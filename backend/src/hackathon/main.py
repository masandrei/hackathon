from fastapi import FastAPI, Depends
import uvicorn
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .schemas import CalculationRequest, CalculationResponse
from .models import Calculation, Job, Leave
import uuid
import os

app = FastAPI(title="Hackathon API")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///hackathon.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Basic endpoint to fetch all rows from a sample table using DI
@app.get("/db-items")
async def get_db_items(db=Depends(get_db)):
    cursor = await db.execute("SELECT id, name FROM items")
    rows = await cursor.fetchall()
    await cursor.close()
    return [{"id": row[0], "name": row[1]} for row in rows]


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}


@app.post(
    "/calculations",
    response_model=CalculationResponse,
    status_code=201,
)
def submit_calculation(request: CalculationRequest, db: Session = Depends(get_db)):
    calculation_id = str(uuid.uuid4())
    calculation = Calculation(
        id=calculation_id,
        calculation_timestamp=f"{request.calculationDate}T{request.calculationTime}",
        expected_pension=request.expectedPension,
        age=request.age,
        sex=request.sex,
        salary=request.salary,
        is_sick_leave_included=request.isSickLeaveIncluded,
        total_accumulated_funds=request.totalAccumulatedFunds,
        year_work_start=request.yearWorkStart,
        year_desired_retirement=request.yearDesiredRetirement,
        postal_code=request.postalCode,
    )
    db.add(calculation)
    db.flush()  # Get calculation.id for relationships
    # Add jobs
    for job in request.jobs:
        job_obj = Job(
            calculation_id=calculation.id,
            start_date=job.startDate,
            end_date=job.endDate,
            base_salary=job.baseSalary,
        )
        db.add(job_obj)
    # Add leaves
    for leave in request.leaves:
        leave_obj = Leave(
            calculation_id=calculation.id,
            start_date=leave.startDate,
            end_date=leave.endDate,
        )
        db.add(leave_obj)
    db.commit()
    db.refresh(calculation)
    return CalculationResponse(calculationId=calculation.id)


def main():
    uvicorn.run("hackathon.main:app", host="127.0.0.1", port=8080, reload=True, app_dir="src")
