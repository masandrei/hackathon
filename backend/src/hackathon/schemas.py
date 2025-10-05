from pydantic import BaseModel, Field
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

# -------------------------- Calculation Schemas for POST requests --------------------------

class Job(BaseModel):
    startDate: str = Field(..., pattern=r"^\d{2}-\d{2}-\d{4}$")
    endDate: Optional[str] = Field(None, pattern=r"^\d{2}-\d{2}-\d{4}$")
    baseSalary: int = Field(...)

class Leave(BaseModel):
    startDate: str = Field(..., pattern=r"^\d{2}-\d{2}-\d{4}$")
    endDate: Optional[str] = Field(None, pattern=r"^\d{2}-\d{2}-\d{4}$")

class CalculationRequest(BaseModel):
    calculationDate: str
    calculationTime: str
    expectedPension: str
    age: int
    sex: str
    salary: str
    isSickLeaveIncluded: bool
    totalAccumulatedFunds: str
    yearWorkStart: int
    yearDesiredRetirement: int
    postalCode: Optional[str] = None
    jobs: List[Job]
    leaves: List[Leave]

class CalculationResponse(BaseModel):
    calculationId: str
    # Additional fields can be added here as needed

# -------------------------- Admin Schemas --------------------------

class CalculationDetail(BaseModel):
    calculationId: str
    calculationDate: str
    calculationTime: str
    expectedPension: str
    age: int
    sex: str
    salary: str
    isSickLeaveIncluded: bool
    totalAccumulatedFunds: str
    yearWorkStart: int
    yearDesiredRetirement: int
    postalCode: Optional[str] = None
    nominalPension: Optional[str] = None
    realPension: Optional[str] = None

class CalculationAdminDetail(BaseModel):
    calculationId: str
    calculationDate: str
    calculationTime: str
    expectedPension: str
    age: int
    sex: str
    salary: str
    isSickLeaveIncluded: bool
    totalAccumulatedFunds: str
    yearWorkStart: int
    yearDesiredRetirement: int
    postalCode: Optional[str] = None
    nominalPension: Optional[str] = None
    realPension: Optional[str] = None

class PaginatedCalculationsResponse(BaseModel):
    submissions: List[CalculationAdminDetail]
    page: int
    pageSize: int
    totalItems: int
    totalPages: int

# -------------------------- Analysis Schemas --------------------------

class AnalysisResponse(BaseModel):
    basic_summary: str
    detailed_analysis: str
    calculation_data: Dict
    success: bool = True

class AnalysisErrorResponse(BaseModel):
    error: str
    success: bool = False

# -------------------------- Chat Schemas --------------------------

class ChatMessage(BaseModel):
    message: str
    timestamp: Optional[datetime] = None

class ChatResponse(BaseModel):
    response: str
    timestamp: datetime
    success: bool = True
    action_executed: Optional[str] = None
    action_result: Optional[Dict] = None

class ChatErrorResponse(BaseModel):
    error: str
    timestamp: datetime
    success: bool = False

class OwlInfoResponse(BaseModel):
    name: str
    description: str
    personality: str
    capabilities: List[str]
    greeting: str
