from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .base import Base
import datetime

class UserInput(Base):
    __tablename__ = "user_inputs"
    id = Column(Integer, primary_key=True, index=True)
    N = Column(Float)
    P = Column(Float)
    K = Column(Float)
    pH = Column(Float)
    location = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class FarmingPlan(Base):
    __tablename__ = "farming_plans"
    id = Column(Integer, primary_key=True, index=True)
    crop = Column(String)
    user_input_id = Column(Integer, ForeignKey("user_inputs.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    tasks = relationship("Task", back_populates="plan", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("farming_plans.id"))
    phase = Column(String)
    task_name = Column(String)
    day_offset = Column(Integer)
    priority = Column(String)
    completed = Column(Boolean, default=False)

    plan = relationship("FarmingPlan", back_populates="tasks")

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String)
    alert_type = Column(String) # e.g. "Weather", "Disease", "Task"
    severity = Column(String, default="Normal")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
