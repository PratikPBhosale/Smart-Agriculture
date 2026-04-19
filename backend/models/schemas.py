from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserInputBase(BaseModel):
    N: float
    P: float
    K: float
    pH: float
    location: str

class UserInputCreate(UserInputBase):
    pass

class UserInputResponse(UserInputBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

class CropRecommendResponse(BaseModel):
    top_crops: List[str]
    scores: List[float]
    # Maharashtra regional intelligence fields (empty for non-Maharashtra locations)
    regional_crops: List[str] = []
    region_label: str = ""
    district: str = ""
    is_maharashtra: bool = False

class TaskSchema(BaseModel):
    task: str
    day_offset: int
    priority: str

class PhaseSchema(BaseModel):
    phase: str
    tasks: List[TaskSchema]

class PlanSchema(BaseModel):
    crop: str
    phases: List[PhaseSchema]
    alerts: List[str]

class DiseaseDetectionResponse(BaseModel):
    disease: str
    confidence: float
    treatment: str

class AlertResponse(BaseModel):
    id: int
    message: str
    alert_type: str
    severity: str
    created_at: datetime
    class Config:
        orm_mode = True

class WeatherAnomalyResponse(BaseModel):
    anomaly: str
    severity: str
