from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
import os
import uvicorn
from contextlib import asynccontextmanager
from model_service import predict_heart_disease, get_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Verify model loading at startup
    try:
        get_model()
        print("[INFO] Model loaded successfully.")
    except Exception as e:
        print(f"[WARN] Failed to load model at startup: {e}")
    yield

app = FastAPI(
    title="Cardiovascular Heart Disease Prediction API",
    description="High-precision ML prediction service based on a tuned Logistic Regression with StandardScaler Pipeline",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HeartDiseaseInput(BaseModel):
    age: float = Field(52.0, ge=18, le=120, description="Patient age in years")
    sex: Any = Field("Male", description="Biological sex ('Male', 'Female', 1, 0)")
    chest_pain_type: Any = Field("Typical angina", description="Chest pain type")
    resting_blood_pressure: float = Field(125.0, ge=60, le=250, description="Resting blood pressure in mm Hg")
    cholestoral: float = Field(212.0, ge=80, le=600, description="Serum cholestoral in mg/dl")
    fasting_blood_sugar: Any = Field("Lower than 120 mg/ml", description="Fasting blood sugar > 120 mg/dl")
    rest_ecg: Any = Field("Normal", description="Resting electrocardiographic results")
    Max_heart_rate: float = Field(168.0, ge=60, le=240, description="Maximum heart rate achieved (bpm)")
    exercise_induced_angina: Any = Field("No", description="Exercise induced angina")
    oldpeak: float = Field(1.0, ge=0.0, le=8.0, description="ST depression induced by exercise relative to rest")
    slope: Any = Field("Flat", description="Slope of the peak exercise ST segment")
    vessels_colored_by_flourosopy: Any = Field("Zero", description="Major vessels colored by fluoroscopy ('Zero' to 'Four')")
    thalassemia: Any = Field("Normal", description="Thalassemia status")

class PredictionResponse(BaseModel):
    prediction: int
    status: str
    probability: float
    probability_percentage: float
    healthy_probability_percentage: float
    risk_level: str
    summary: str
    contributing_factors: List[str]
    normalized_features: Dict[str, Any]

@app.get("/")
def root():
    return {
        "message": "Cardiovascular Heart Disease Prediction API is running",
        "documentation": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    try:
        model = get_model()
        return {
            "status": "healthy",
            "model_loaded": True,
            "pipeline_type": str(type(model))
        }
    except Exception as e:
        return {
            "status": "degraded",
            "model_loaded": False,
            "error": str(e)
        }

@app.post("/predict", response_model=PredictionResponse)
def predict(payload: HeartDiseaseInput):
    """
    Accepts 13 clinical features and returns binary prediction (0 or 1) and disease probability.
    """
    try:
        data = payload.model_dump()
        result = predict_heart_disease(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/presets")
def get_presets():
    """Provides sample patient profiles for testing."""
    return {
        "healthy_profile": {
            "name": "Healthy Patient Profile",
            "description": "38yo female, typical angina, normal ECG, high max HR (188 bpm), zero vessels, favorable indicators",
            "data": {
                "age": 38,
                "sex": "Female",
                "chest_pain_type": "Typical angina",
                "resting_blood_pressure": 110,
                "cholestoral": 175,
                "fasting_blood_sugar": "Lower than 120 mg/ml",
                "rest_ecg": "Normal",
                "Max_heart_rate": 188,
                "exercise_induced_angina": "No",
                "oldpeak": 0.0,
                "slope": "Upsloping",
                "vessels_colored_by_flourosopy": "Zero",
                "thalassemia": "Normal"
            }
        },
        "moderate_risk": {
            "name": "Moderate Risk Profile",
            "description": "55yo male, atypical angina, ST-T abnormality, mild oldpeak, 1 vessel",
            "data": {
                "age": 55,
                "sex": "Male",
                "chest_pain_type": "Atypical angina",
                "resting_blood_pressure": 135,
                "cholestoral": 230,
                "fasting_blood_sugar": "Lower than 120 mg/ml",
                "rest_ecg": "ST-T wave abnormality",
                "Max_heart_rate": 145,
                "exercise_induced_angina": "No",
                "oldpeak": 1.2,
                "slope": "Flat",
                "vessels_colored_by_flourosopy": "One",
                "thalassemia": "Normal"
            }
        },
        "high_risk_profile": {
            "name": "High Risk Patient Profile",
            "description": "62yo male, asymptomatic, high BP, elevated fasting sugar, reversable defect, 3 vessels",
            "data": {
                "age": 62,
                "sex": "Male",
                "chest_pain_type": "Asymptomatic",
                "resting_blood_pressure": 150,
                "cholestoral": 280,
                "fasting_blood_sugar": "Greater than 120 mg/ml",
                "rest_ecg": "Left ventricular hypertrophy",
                "Max_heart_rate": 120,
                "exercise_induced_angina": "Yes",
                "oldpeak": 2.8,
                "slope": "Downsloping",
                "vessels_colored_by_flourosopy": "Three",
                "thalassemia": "Reversable Defect"
            }
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
