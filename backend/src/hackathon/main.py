from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
import aiosqlite
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

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///hackathon.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Health check endpoint
@app.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """Health check endpoint for API status"""
    return HealthCheckResponse(
        status="healthy",
        timestamp=datetime.now()
    )

# Basic endpoint to fetch all rows from a sample table using DI
@app.get("/db-items", response_model=DatabaseItemsResponse)
async def get_db_items(db=Depends(get_db)):
    """Get all items from database with count"""
    try:
        cursor = await db.execute("SELECT id, name FROM items")
        rows = await cursor.fetchall()
        await cursor.close()
        
        items = [DatabaseItemResponse(id=row[0], name=row[1]) for row in rows]
        return DatabaseItemsResponse(items=items, count=len(items))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/items/{item_id}", response_model=DatabaseItemResponse)
async def read_item(item_id: int, q: str | None = None):
    """Get specific item by ID"""
    # This is a placeholder - you might want to implement actual database lookup
    return DatabaseItemResponse(id=item_id, name=f"Item {item_id}")

# Statistics endpoints for frontend data
@app.get("/statistics", response_model=StatisticsResponse)
async def get_statistics():
    """Get all economic statistics data for frontend charts"""
    try:
        # Only include meta if it has meaningful data
        meta_data = dict(META) if any(META.values()) else None
        
        # Organize life expectancy data by gender
        life_expectancy_data = LifeExpectancyData(
            male=[StatisticsDataResponse(year=year, value=value) for year, value in LIFE_EXPECTANCY_MALE.items()],
            female=[StatisticsDataResponse(year=year, value=value) for year, value in LIFE_EXPECTANCY_FEMALE.items()]
        )
        
        return StatisticsResponse(
            growth_rate=[StatisticsDataResponse(year=year, value=value) for year, value in GROWTH.items()],
            average_wage=[StatisticsDataResponse(year=year, value=value) for year, value in AVERAGE_WAGE.items()],
            valorization=[StatisticsDataResponse(year=year, value=value) for year, value in VALORIZATION.items()],
            inflation=[StatisticsDataResponse(year=year, value=value) for year, value in INFLATION.items()],
            life_expectancy=life_expectancy_data,
            meta=meta_data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading statistics: {str(e)}")

@app.get("/statistics/growth-rate", response_model=List[StatisticsDataResponse])
async def get_growth_rate():
    """Get salary growth rate data for frontend charts"""
    return [StatisticsDataResponse(year=year, value=value) for year, value in GROWTH.items()]

@app.get("/statistics/average-wage", response_model=List[StatisticsDataResponse])
async def get_average_wage():
    """Get average wage data for frontend charts"""
    return [StatisticsDataResponse(year=year, value=value) for year, value in AVERAGE_WAGE.items()]

@app.get("/statistics/valorization", response_model=List[StatisticsDataResponse])
async def get_valorization():
    """Get valorization data for frontend charts"""
    return [StatisticsDataResponse(year=year, value=value) for year, value in VALORIZATION.items()]

@app.get("/statistics/inflation", response_model=List[StatisticsDataResponse])
async def get_inflation():
    """Get inflation data for frontend charts"""
    return [StatisticsDataResponse(year=year, value=value) for year, value in INFLATION.items()]

@app.get("/statistics/life-expectancy", response_model=List[LifeExpectancyResponse])
async def get_life_expectancy(gender: str = "M"):
    """Get life expectancy data for frontend charts
    
    Args:
        gender: Gender to get life expectancy for ("M" for male, "F" for female)
    """
    if gender.upper() == "F":
        data = LIFE_EXPECTANCY_FEMALE
        gender_label = "Female"
    else:
        data = LIFE_EXPECTANCY_MALE
        gender_label = "Male"
    
    return [LifeExpectancyResponse(year=year, value=value, gender=gender_label) for year, value in data.items()]

@app.get("/statistics/life-expectancy/male", response_model=List[LifeExpectancyResponse])
async def get_life_expectancy_male():
    """Get male life expectancy data for frontend charts"""
    return [LifeExpectancyResponse(year=year, value=value, gender="Male") for year, value in LIFE_EXPECTANCY_MALE.items()]

@app.get("/statistics/life-expectancy/female", response_model=List[LifeExpectancyResponse])
async def get_life_expectancy_female():
    """Get female life expectancy data for frontend charts"""
    return [LifeExpectancyResponse(year=year, value=value, gender="Female") for year, value in LIFE_EXPECTANCY_FEMALE.items()]

# Error handler for GET requests
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


@app.post(
    "/calculations/analyze",
    response_model=AnalysisResponse,
    status_code=200,
)
def analyze_calculation(request: CalculationRequest):
    """Analyze pension calculation with AI-powered insights"""
    try:
        from .gemini_client import analyze_pension_from_api_request
        
        # Get AI analysis
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


@app.post(
    "/chat/owl",
    response_model=ChatResponse,
    status_code=200,
)
def chat_with_owl_endpoint(message: ChatMessage):
    """Chat with the owl mascot - Sowa Mądra"""
    try:
        from .gemini_client import chat_with_owl
        
        # Get response from owl
        owl_response = chat_with_owl(message.message)
        
        return ChatResponse(
            response=owl_response,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        return ChatErrorResponse(
            error=f"Hoo hoo! Coś poszło nie tak: {str(e)}",
            timestamp=datetime.now()
        )


@app.get(
    "/chat/owl/info",
    response_model=OwlInfoResponse,
    status_code=200,
)
def get_owl_info():
    """Get information about the owl mascot"""
    return OwlInfoResponse(
        name="Sowa Mądra",
        description="Przyjazna maskotka aplikacji do kalkulacji emerytur, ekspert w dziedzinie finansów osobistych i emerytur.",
        personality="Przyjazna, pomocna, zachęcająca, profesjonalna ale nieformalna, czasami używa sówich wyrażeń.",
        capabilities=[
            "Odpowiadanie na pytania o emerytury",
            "Wyjaśnianie pojęć finansowych",
            "Pomoc w korzystaniu z aplikacji",
            "Motywowanie do planowania emerytury",
            "Dzielenie się praktycznymi radami"
        ],
        greeting="Hoo hoo! Cześć! Jestem Sowa Mądra, Twoja przewodniczka po świecie emerytur! 🦉 Skrzydła w górę i zapraszam do rozmowy!"
    )


def main():
    uvicorn.run("hackathon.main:app", host="127.0.0.1", port=8080, reload=True, app_dir="src")
