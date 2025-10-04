from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from uuid import UUID

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

class Leave(BaseModel):
    duration_days: int
    leave_year: int


class Job(BaseModel):
    start_date: int
    end_date: Optional[int] = None
    base_salary: float