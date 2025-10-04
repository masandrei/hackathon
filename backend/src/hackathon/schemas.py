from pydantic import BaseModel

# TODO: Define request and response schemas here
class Item(BaseModel):
    id: int
    name: str

from pydantic import BaseModel, Field
from typing import List, Optional

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
