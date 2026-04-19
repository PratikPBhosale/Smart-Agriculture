from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database.base import get_db
from database import models
from models import schemas
from services.ml_service import predict_crop, predict_disease, detect_weather_anomaly
from services.weather_service import fetch_weather, check_severe_weather
from services.gemini_service import generate_farming_plan, chat_with_assistant, validate_crops_for_location
from services.maharashtra_crop_service import get_regional_crops, get_regional_context, merge_recommendations
from services.sms_service import send_weather_alert_sms
import datetime

router = APIRouter()


@router.post("/input", response_model=schemas.UserInputResponse)
def create_input(user_input: schemas.UserInputCreate, db: Session = Depends(get_db)):
    db_input = models.UserInput(**user_input.dict())
    db.add(db_input)
    db.commit()
    db.refresh(db_input)
    return db_input


@router.get("/recommend", response_model=schemas.CropRecommendResponse)
def recommend_crop(input_id: int, db: Session = Depends(get_db)):
    db_input = db.query(models.UserInput).filter(models.UserInput.id == input_id).first()
    if not db_input:
        raise HTTPException(status_code=404, detail="Input not found")

    # Real weather for the user's location
    weather = fetch_weather(db_input.location)

    # ML crop prediction
    ml_result = predict_crop(
        n=db_input.N, p=db_input.P, k=db_input.K, ph=db_input.pH,
        temp=weather["temperature"], rainfall=weather["rainfall"]
    )

    # Groq-powered geographic validation — correct ML predictions for the actual location
    soil = {"N": db_input.N, "P": db_input.P, "K": db_input.K, "pH": db_input.pH}
    validation = validate_crops_for_location(
        ml_crops=ml_result["top_crops"],
        location=db_input.location,
        soil=soil,
        weather=weather
    )
    if validation.get("corrections_made") and validation.get("validated_crops"):
        # Replace ML crops with geographically validated crops
        validated = validation["validated_crops"][:3]
        # Keep original scores structure, pad if needed
        scores = ml_result["scores"][:len(validated)]
        while len(scores) < len(validated):
            scores.append(round(scores[-1] - 0.05, 2) if scores else 0.75)
        ml_result = {"top_crops": validated, "scores": scores}

    # Maharashtra regional intelligence
    regional_data = get_regional_crops(db_input.location)
    enriched = merge_recommendations(ml_result, regional_data)

    # Attach validation notes if corrections were made
    if validation.get("corrections_made"):
        enriched["location_notes"] = validation.get("location_notes", "")

    return enriched


@router.get("/weather")
def get_current_weather(location: str):
    """Get real-time weather for any location."""
    weather = fetch_weather(location)
    severity = check_severe_weather(weather)
    return {**weather, **severity}


@router.post("/generate-plan")
def generate_plan(input_id: int, top_crops: list[str], db: Session = Depends(get_db)):
    db_input = db.query(models.UserInput).filter(models.UserInput.id == input_id).first()
    if not db_input:
        raise HTTPException(status_code=404, detail="Input not found")

    weather = fetch_weather(db_input.location)
    soil = {"N": db_input.N, "P": db_input.P, "K": db_input.K, "pH": db_input.pH}

    # Get Maharashtra regional context for the top crop
    regional_context = get_regional_context(db_input.location, top_crops[0] if top_crops else "")

    plan_data = generate_farming_plan(
        location_info={"location": db_input.location},
        weather_data=weather,
        soil_data=soil,
        top_crops=top_crops,
        regional_context=regional_context
    )

    # Save plan to DB
    db_plan = models.FarmingPlan(crop=plan_data["crop"], user_input_id=input_id)
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)

    # Save tasks — phases -> days -> tasks list
    for phase_data in plan_data.get("phases", []):
        phase_name = phase_data.get("phase", "")
        week_range = phase_data.get("week_range", "")
        for day_data in phase_data.get("days", []):
            day_num = day_data.get("day", 0)
            priority = day_data.get("priority", "medium")
            tasks_list = day_data.get("tasks", [])
            task_name = " | ".join(tasks_list)
            db_task = models.Task(
                plan_id=db_plan.id,
                phase=f"{phase_name} ({week_range})" if week_range else phase_name,
                task_name=task_name,
                day_offset=day_num,
                priority=priority
            )
            db.add(db_task)

    # Save alerts
    for a in plan_data.get("alerts", []):
        db_alert = models.Alert(message=a, alert_type="AI_Plan", severity="Normal")
        db.add(db_alert)

    db.commit()
    return plan_data


@router.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()


@router.post("/disease-detect", response_model=schemas.DiseaseDetectionResponse)
async def disease_detect(file: UploadFile = File(...)):
    contents = await file.read()
    result = predict_disease(contents)
    return result


@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    return db.query(models.Alert).order_by(models.Alert.created_at.desc()).all()


@router.post("/register-phone")
def register_phone(phone: str, db: Session = Depends(get_db)):
    """Register a phone number to receive SMS weather alerts."""
    import os
    existing = os.getenv("ALERT_PHONE_NUMBERS", "")
    numbers = [n.strip() for n in existing.split(",") if n.strip()]
    if phone not in numbers:
        numbers.append(phone)
        os.environ["ALERT_PHONE_NUMBERS"] = ",".join(numbers)
    return {"message": f"Phone {phone} registered for weather alerts.", "total_registered": len(numbers)}


@router.post("/chat")
def chat(request: schemas.ChatRequest):
    """Farming assistant chatbot powered by Gemini."""
    reply = chat_with_assistant(
        message=request.message,
        history=request.history,
        context=request.context
    )
    return {"reply": reply}
