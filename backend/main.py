from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.base import engine, Base
from routes.api import router
from scheduler.jobs import start_scheduler
from dotenv import load_dotenv

load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Farming Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.on_event("startup")
def startup_event():
    start_scheduler()

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Farming Assistant Backend"}
