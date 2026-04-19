import os
import pickle
import numpy as np
from pathlib import Path

# ── Paths ────────────────────────────────────────────────────────────────────
MODELS_DIR = Path(__file__).resolve().parent.parent / "models"

# ── Load Crop Recommendation Model (Random Forest + LabelEncoder) ─────────────
try:
    with open(MODELS_DIR / "crop_rf_model.pkl", "rb") as f:
        crop_model = pickle.load(f)
    with open(MODELS_DIR / "Label_rf_model.pkl", "rb") as f:
        crop_label_encoder = pickle.load(f)
    CROP_MODEL_LOADED = True
    print("✅ Crop RF model loaded")
except Exception as e:
    CROP_MODEL_LOADED = False
    print(f"⚠️  Crop model not loaded: {e}")

# ── Load Disease Detection Model (CNN / Keras) ────────────────────────────────
try:
    from tensorflow.keras.models import load_model
    from tensorflow.keras.preprocessing import image as keras_image
    import io
    from PIL import Image

    disease_model = load_model(MODELS_DIR / "best_cnn_phase1.h5")
    DISEASE_MODEL_LOADED = True
    print("✅ Disease CNN model loaded")
except Exception as e:
    DISEASE_MODEL_LOADED = False
    print(f"⚠️  Disease model not loaded: {e}")

# ── Load Fertilizer Recommendation Model (ANN / Keras) ───────────────────────
try:
    from tensorflow.keras.models import load_model as load_keras_model
    fertilizer_model = load_keras_model(MODELS_DIR / "ann_fertilizer_model.h5")
    FERTILIZER_MODEL_LOADED = True
    print("✅ Fertilizer ANN model loaded")
except Exception as e:
    FERTILIZER_MODEL_LOADED = False
    print(f"⚠️  Fertilizer model not loaded: {e}")


# ── Crop Recommendation ───────────────────────────────────────────────────────
def predict_crop(n: float, p: float, k: float, ph: float, temp: float, rainfall: float):
    """
    Predict top 3 recommended crops using the trained Random Forest model.
    Input order matches training: [N, P, K, temperature, humidity, ph, rainfall]
    (humidity is not collected in our form, so we pass a neutral default of 50)
    """
    if not CROP_MODEL_LOADED:
        # Fallback mock
        crops = ["Wheat", "Rice", "Maize", "Cotton", "Sugarcane"]
        return {"top_crops": crops[:3], "scores": [0.88, 0.83, 0.79]}

    # Feature vector — adjust column order if your training used a different order
    features = np.array([[n, p, k, temp, 50.0, ph, rainfall]])

    # predict_proba gives confidence per class
    if hasattr(crop_model, "predict_proba"):
        proba = crop_model.predict_proba(features)[0]
        top3_idx = np.argsort(proba)[::-1][:3]
        top3_scores = proba[top3_idx].tolist()
        top3_labels = crop_label_encoder.inverse_transform(
            crop_model.classes_[top3_idx]
        ).tolist()
    else:
        # Model without predict_proba — just return single prediction
        pred = crop_model.predict(features)
        top3_labels = crop_label_encoder.inverse_transform(pred).tolist()
        top3_scores = [1.0]

    return {"top_crops": top3_labels, "scores": top3_scores}


# ── Disease Detection ─────────────────────────────────────────────────────────
# Class names from PlantVillage dataset (38 classes used in training)
DISEASE_CLASSES = {
    0:  "Apple___Apple_scab",
    1:  "Apple___Black_rot",
    2:  "Apple___Cedar_apple_rust",
    3:  "Apple___healthy",
    4:  "Blueberry___healthy",
    5:  "Cherry_(including_sour)___Powdery_mildew",
    6:  "Cherry_(including_sour)___healthy",
    7:  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    8:  "Corn_(maize)___Common_rust_",
    9:  "Corn_(maize)___Northern_Leaf_Blight",
    10: "Corn_(maize)___healthy",
    11: "Grape___Black_rot",
    12: "Grape___Esca_(Black_Measles)",
    13: "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    14: "Grape___healthy",
    15: "Orange___Haunglongbing_(Citrus_greening)",
    16: "Peach___Bacterial_spot",
    17: "Peach___healthy",
    18: "Pepper,_bell___Bacterial_spot",
    19: "Pepper,_bell___healthy",
    20: "Potato___Early_blight",
    21: "Potato___Late_blight",
    22: "Potato___healthy",
    23: "Raspberry___healthy",
    24: "Soybean___healthy",
    25: "Squash___Powdery_mildew",
    26: "Strawberry___Leaf_scorch",
    27: "Strawberry___healthy",
    28: "Tomato___Bacterial_spot",
    29: "Tomato___Early_blight",
    30: "Tomato___Late_blight",
    31: "Tomato___Leaf_Mold",
    32: "Tomato___Septoria_leaf_spot",
    33: "Tomato___Spider_mites Two-spotted_spider_mite",
    34: "Tomato___Target_Spot",
    35: "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    36: "Tomato___Tomato_mosaic_virus",
    37: "Tomato___healthy",
}

# Treatment suggestions per disease
TREATMENTS = {
    "healthy": "No treatment needed. Plant looks healthy!",
    "Apple_scab": "Apply fungicide (captan or myclobutanil). Remove infected leaves.",
    "Black_rot": "Prune infected areas. Apply copper-based fungicide.",
    "Cedar_apple_rust": "Apply fungicide at bud break. Remove nearby cedar trees if possible.",
    "Powdery_mildew": "Apply sulfur-based fungicide. Improve air circulation.",
    "Cercospora_leaf_spot": "Apply fungicide (azoxystrobin). Rotate crops.",
    "Common_rust_": "Apply fungicide early. Use resistant varieties.",
    "Northern_Leaf_Blight": "Apply fungicide. Use resistant hybrids.",
    "Esca_(Black_Measles)": "No cure. Remove and destroy infected vines.",
    "Leaf_blight_(Isariopsis_Leaf_Spot)": "Apply copper fungicide. Remove infected leaves.",
    "Haunglongbing_(Citrus_greening)": "No cure. Remove infected trees. Control psyllid insects.",
    "Bacterial_spot": "Apply copper-based bactericide. Avoid overhead irrigation.",
    "Early_blight": "Apply fungicide (chlorothalonil). Remove lower infected leaves.",
    "Late_blight": "Apply fungicide immediately (mancozeb). Destroy infected plants.",
    "Leaf_scorch": "Improve drainage. Apply fungicide if severe.",
    "Septoria_leaf_spot": "Apply fungicide. Remove infected leaves. Avoid wetting foliage.",
    "Spider_mites": "Apply miticide or neem oil. Increase humidity.",
    "Target_Spot": "Apply fungicide. Improve air circulation.",
    "Tomato_Yellow_Leaf_Curl_Virus": "Control whitefly vectors. Remove infected plants.",
    "Tomato_mosaic_virus": "No cure. Remove infected plants. Disinfect tools.",
}

def _get_treatment(class_name: str) -> str:
    """Map class name to a treatment string."""
    if "healthy" in class_name.lower():
        return TREATMENTS["healthy"]
    # Try to match the disease part after '___'
    parts = class_name.split("___")
    disease_key = parts[-1] if len(parts) > 1 else class_name
    for key, treatment in TREATMENTS.items():
        if key.lower() in disease_key.lower():
            return treatment
    return "Consult a local agricultural expert for treatment advice."


def predict_disease(image_bytes: bytes):
    """
    Run the CNN model on the uploaded leaf image and return disease + confidence.
    """
    if not DISEASE_MODEL_LOADED:
        return {
            "disease": "Model not available",
            "confidence": 0.0,
            "treatment": "Please ensure disease model is loaded."
        }

    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize((128, 128))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)  # (1, 128, 128, 3)

        predictions = disease_model.predict(img_array, verbose=0)[0]
        pred_idx = int(np.argmax(predictions))
        confidence = float(predictions[pred_idx])

        class_name = DISEASE_CLASSES.get(pred_idx, f"Unknown class {pred_idx}")
        # Make it human-readable: "Tomato___Early_blight" → "Tomato - Early blight"
        display_name = class_name.replace("___", " - ").replace("_", " ")

        return {
            "disease": display_name,
            "confidence": round(confidence, 4),
            "treatment": _get_treatment(class_name)
        }
    except Exception as e:
        return {
            "disease": "Prediction error",
            "confidence": 0.0,
            "treatment": str(e)
        }


# ── Weather Anomaly Detection (rule-based, no model needed) ──────────────────
def detect_weather_anomaly(weather_data: list):
    if not weather_data:
        return {"anomaly": "None", "severity": "None"}

    latest = weather_data[-1]
    temp = latest.get("temperature", 25)
    rainfall = latest.get("rainfall", 0)
    humidity = latest.get("humidity", 50)

    if rainfall > 80:
        return {"anomaly": "Extremely Heavy Rainfall", "severity": "High"}
    elif rainfall > 50:
        return {"anomaly": "Heavy Rainfall", "severity": "Medium"}
    elif temp > 42:
        return {"anomaly": "Extreme Heat", "severity": "High"}
    elif temp > 38:
        return {"anomaly": "Heat Stress", "severity": "Medium"}
    elif humidity > 90:
        return {"anomaly": "High Humidity - Disease Risk", "severity": "Medium"}

    return {"anomaly": "None", "severity": "Low"}
