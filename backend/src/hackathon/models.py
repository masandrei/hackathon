from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from uuid import UUID
from sqlalchemy import Column, Integer, String, Float, DateTime, Enum as SAEnum, JSON
from sqlalchemy.ext.declarative import declarative_base

class Sex(str, Enum):
    MALE = "M"
    FEMALE = "F"

class CalculationRequest(BaseModel):
    expected_pension: float
    age: int
    sex: Sex
    total_accumulated_funds: Optional[float] = None
    year_work_start: int
    year_desired_retirement: int
    postal_code: Optional[str] = None
    jobs: List["Job"]
    leaves: List["Leave"]

class Calculation(CalculationRequest):
    calculation_datetime: datetime
    calculation_id: UUID

class CalculationResponse(BaseModel):
    nominal_monthly_pension: float
    real_monthly_pension: float
    average_wage: float

class Leave(BaseModel):
    duration_days: int
    leave_year: int


class Job(BaseModel):
    start_date: int
    end_date: Optional[int] = None
    base_salary: float

Base = declarative_base()

class DbCalculation(Base):
    __tablename__ = "calculations"

    # Use a string column for portability. If using Postgres, prefer UUID type (see below).
    calculation_id = Column(String(36), primary_key=True)            # str(uuid4())
    calculation_datetime = Column(DateTime, nullable=False)

    expected_pension = Column(Float, nullable=False)
    age = Column(Integer, nullable=False)
    sex = Column(SAEnum("M", "F", name="sex_enum"), nullable=False)

    total_accumulated_funds = Column(Float, nullable=True)
    year_work_start = Column(Integer, nullable=False)
    year_desired_retirement = Column(Integer, nullable=False)
    postal_code = Column(String(16), nullable=True)

    # Store jobs/leaves as JSON blobs (since you model them in Pydantic)
    jobs = Column(JSON, nullable=False)
    leaves = Column(JSON, nullable=False, default=[])