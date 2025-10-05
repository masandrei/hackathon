from __future__ import annotations

from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
from datetime import datetime
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .schemas import (
    DatabaseItemsResponse, DatabaseItemResponse, HealthCheckResponse, 
    ErrorResponse, StatisticsResponse, StatisticsDataResponse, LifeExpectancyResponse, LifeExpectancyData,
    CalculationRequest, CalculationResponse, AnalysisResponse, AnalysisErrorResponse,
    ChatMessage, ChatResponse, ChatErrorResponse, OwlInfoResponse
)
from .models import Calculation, Job, Leave
from .mapper import GROWTH, AVERAGE_WAGE, VALORIZATION, INFLATION, LIFE_EXPECTANCY, LIFE_EXPECTANCY_MALE, LIFE_EXPECTANCY_FEMALE, META
import uuid
import os

app = FastAPI(title="Hackathon API")

# --- simple root from the other branch ---
@app.get("/")
def root():
    return {"message": "Hello from Hackathon!"}

# --- DB session setup (from first part) ---
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///hackathon.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Health ---
@app.get("/health", response_model=HealthCheckResponse)
async def health_check():
    return HealthCheckResponse(status="healthy", timestamp=datetime.now())

# --- Statistics ---
@app.get("/statistics", response_model=StatisticsResponse)
async def get_statistics():
    try:
        meta_data = dict(META) if any(META.values()) else None
        life_expectancy_data = LifeExpectancyData(
            male=[StatisticsDataResponse(year=year, value=value) for year, value in LIFE_EXPECTANCY_MALE.items()],
            female=[StatisticsDataResponse(year=year, value=value) for year, value in LIFE_EXPECTANCY_FEMALE.items()]
        )
        return StatisticsResponse(
            growth_rate=[StatisticsDataResponse(year=y, value=v) for y, v in GROWTH.items()],
            average_wage=[StatisticsDataResponse(year=y, value=v) for y, v in AVERAGE_WAGE.items()],
            valorization=[StatisticsDataResponse(year=y, value=v) for y, v in VALORIZATION.items()],
            inflation=[StatisticsDataResponse(year=y, value=v) for y, v in INFLATION.items()],
            life_expectancy=life_expectancy_data,
            meta=meta_data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading statistics: {str(e)}")

import uuid
from fastapi import FastAPI
from hackathon.mapper import AVERAGE_WAGE
from hackathon.models import Calculation, CalculationRequest, CalculationResponse
from hackathon.algorithm import compute_pension_funds, compute_montly_pension 
import uvicorn
from datetime import datetime

app = FastAPI(title="Hackathon API")

@app.get("/")
def root():
    return {"message": "Hello from Hackathon!"}

@app.get("/statistics/growth-rate", response_model=List[StatisticsDataResponse])
async def get_growth_rate():
    return [StatisticsDataResponse(year=y, value=v) for y, v in GROWTH.items()]

@app.get("/statistics/average-wage", response_model=List[StatisticsDataResponse])
async def get_average_wage():
    return [StatisticsDataResponse(year=y, value=v) for y, v in AVERAGE_WAGE.items()]

@app.get("/statistics/valorization", response_model=List[StatisticsDataResponse])
async def get_valorization():
    return [StatisticsDataResponse(year=y, value=v) for y, v in VALORIZATION.items()]

@app.get("/statistics/inflation", response_model=List[StatisticsDataResponse])
async def get_inflation():
    return [StatisticsDataResponse(year=y, value=v) for y, v in INFLATION.items()]

@app.get("/statistics/life-expectancy", response_model=List[LifeExpectancyResponse])
async def get_life_expectancy(gender: str = "M"):
    if gender.upper() == "F":
        data = LIFE_EXPECTANCY_FEMALE
        gender_label = "Female"
    else:
        data = LIFE_EXPECTANCY_MALE
        gender_label = "Male"
    return [LifeExpectancyResponse(year=year, value=value, gender=gender_label) for year, value in data.items()]

@app.get("/statistics/life-expectancy/male", response_model=List[LifeExpectancyResponse])
async def get_life_expectancy_male():
    return [LifeExpectancyResponse(year=year, value=value, gender="Male") for year, value in LIFE_EXPECTANCY_MALE.items()]

@app.get("/statistics/life-expectancy/female", response_model=List[LifeExpectancyResponse])
async def get_life_expectancy_female():
    return [LifeExpectancyResponse(year=year, value=value, gender="Female") for year, value in LIFE_EXPECTANCY_FEMALE.items()]

# --- Global error handler ---
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal Server Error",
            detail=str(exc),
            timestamp=datetime.now()
        ).dict()
    )

# --- Create calculation (DB-backed) from first part ---
@app.post("/calculations", response_model=CalculationResponse, status_code=201)
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
    db.flush()

    for job in request.jobs:
        job_obj = Job(
            calculation_id=calculation.id,
            start_date=job.startDate,
            end_date=job.endDate,
            base_salary=job.baseSalary,
        )
        db.add(job_obj)

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

# --- Analysis & Chat endpoints (kept) ---
@app.post("/calculations/analyze", response_model=AnalysisResponse, status_code=200)
def analyze_calculation(request: CalculationRequest):
    try:
        from .gemini_client import analyze_pension_from_api_request
        result = analyze_pension_from_api_request(request)
        if "error" in result:
            return AnalysisErrorResponse(error=result["error"])
        return AnalysisResponse(
            basic_summary=result["basic_summary"],
            detailed_analysis=result["detailed_analysis"],
            calculation_data=result["calculation_data"]
        )
    except Exception as e:
        return AnalysisErrorResponse(error=f"Analysis failed: {str(e)}")

@app.post("/chat/owl", response_model=ChatResponse, status_code=200)
def chat_with_owl_endpoint(message: ChatMessage):
    try:
        from .gemini_client import chat_with_owl
        owl_result = chat_with_owl(message.message)
        return ChatResponse(
            response=owl_result["response"],
            timestamp=datetime.now(),
            action_executed=owl_result.get("action_executed"),
            action_result=owl_result.get("action_result")
        )
    except Exception as e:
        return ChatErrorResponse(
            error=f"Hoo hoo! Coś poszło nie tak: {str(e)}",
            timestamp=datetime.now()
        )

@app.get("/chat/owl/info", response_model=OwlInfoResponse, status_code=200)
def get_owl_info():
    return OwlInfoResponse(
        name="ZUŚka",
        description="Inteligentna maskotka aplikacji do kalkulacji emerytur, ekspert w dziedzinie finansów osobistych i emerytur. Może wykonywać akcje w aplikacji!",
        personality="Przyjazna, pomocna, zachęcająca, profesjonalna ale nieformalna, czasami używa sówich wyrażeń, może wykonywać polecenia.",
        capabilities=[
            "Odpowiadanie na pytania o emerytury",
            "Wyjaśnianie pojęć finansowych",
            "Pomoc w korzystaniu z aplikacji",
            "Motywowanie do planowania emerytury",
            "Dzielenie się praktycznymi radami",
            "Wykonywanie akcji: 'oblicz emeryturę', 'pokaż statystyki', 'sprawdź zdrowie'",
            "Wywoływanie API i skryptów aplikacji"
        ],
        greeting="Hoo hoo! Cześć! Jestem ZUŚka, Twoja inteligentna przewodniczka po świecie emerytur! 🦉 Mogę nie tylko odpowiadać na pytania, ale też wykonywać akcje w aplikacji! Skrzydła w górę!"
    )

def main():
    uvicorn.run("hackathon.main:app", host="127.0.0.1", port=8000, reload=True)

if __name__ == "__main__":
    main()
@app.post("/calculations")
def create_calculation(calculation: CalculationRequest):
    calc = Calculation(**calculation, calculation_id=uuid.uuid4(), calculation_datetime=datetime.now())
    avg_salaries = {year: AVERAGE_WAGE[year] for year in range(calc.year_work_start, calc.year_desired_retirement + 1)}
    calc.year_desired_retirement += 5
    funds_by_year = compute_pension_funds(calc)
    calc.year_desired_retirement -= 5
    monthly_pension = compute_montly_pension(funds_by_year[calc.year_desired_retirement], calc.age)
    return CalculationResponse(nominal_monthly_pension=monthly_pension["nominal"],
                                real_monthly_pension=monthly_pension["real"],
                                average_wage=AVERAGE_WAGE[calc.year_desired_retirement],
                                funds_by_year={year: funds_by_year[year] for year in funds_by_year.keys if year == calc.year_desired_retirement + 1 or
                                                                                                            year == calc.year_desired_retirement + 2 or
                                                                                                            year == calc.year_desired_retirement + 5 or
                                                                                                            year <= calc.year_desired_retirement},
                                avg_salaries=avg_salaries,
                                replacement_rate=monthly_pension["nominal"] / AVERAGE_WAGE[calc.year_desired_retirement])