from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

# -------------------------- Basic Data Models --------------------------

class Item(BaseModel):
    id: int
    name: str

# -------------------------- Statistics Data Schemas for GET requests --------------------------

class StatisticsDataResponse(BaseModel):
    year: int
    value: float

class LifeExpectancyResponse(BaseModel):
    year: int
    value: float
    gender: str

class LifeExpectancyData(BaseModel):
    male: List[StatisticsDataResponse]
    female: List[StatisticsDataResponse]

class StatisticsResponse(BaseModel):
    growth_rate: List[StatisticsDataResponse]
    average_wage: List[StatisticsDataResponse]
    valorization: List[StatisticsDataResponse]
    inflation: List[StatisticsDataResponse]
    life_expectancy: LifeExpectancyData
    meta: Optional[Dict[str, str]] = None

# -------------------------- API Response Schemas for GET requests --------------------------

class HealthCheckResponse(BaseModel):
    status: str
    timestamp: datetime
    version: str = "1.0.0"

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    timestamp: datetime

# -------------------------- Database Response Schemas --------------------------

class DatabaseItemResponse(BaseModel):
    id: int
    name: str

class DatabaseItemsResponse(BaseModel):
    items: List[DatabaseItemResponse]
    count: int