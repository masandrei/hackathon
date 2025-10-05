from __future__ import annotations

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
import io
import pandas as pd
from .schemas import (
    DatabaseItemsResponse, DatabaseItemResponse, HealthCheckResponse, 
    ErrorResponse, StatisticsResponse, StatisticsDataResponse, LifeExpectancyResponse, LifeExpectancyData,
    CalculationRequest, CalculationResponse, AnalysisResponse, AnalysisErrorResponse,
    ChatMessage, ChatResponse, ChatErrorResponse, OwlInfoResponse,
    CalculationDetail, CalculationAdminDetail, PaginatedCalculationsResponse
)
from .models import Calculation, Job, Leave
from .mapper import GROWTH, AVERAGE_WAGE, VALORIZATION, INFLATION, LIFE_EXPECTANCY, LIFE_EXPECTANCY_MALE, LIFE_EXPECTANCY_FEMALE, META
import uuid
import os

app = FastAPI(title="Hackathon API")

# Enable CORS for all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


@app.get(
    "/calculations",
    response_model=PaginatedCalculationsResponse,
    status_code=200,
)
def list_calculations(
    page: int = Query(1, ge=1, description="Page number (starting from 1)"),
    limit: int = Query(20, ge=1, le=100, description="Number of items per page"),
    db: Session = Depends(get_db)
):
    """List all submitted calculations with pagination"""
    try:
        # Calculate offset
        offset = (page - 1) * limit
        
        # Get total count
        total_items = db.query(Calculation).count()
        
        # Get calculations with pagination
        calculations = db.query(Calculation).offset(offset).limit(limit).all()
        
        # Convert to response format
        submissions = []
        for calc in calculations:
            # Parse timestamp
            timestamp_parts = calc.calculation_timestamp.split('T')
            calc_date = timestamp_parts[0] if len(timestamp_parts) > 0 else ""
            calc_time = timestamp_parts[1] if len(timestamp_parts) > 1 else ""
            
            submission = CalculationAdminDetail(
                calculationId=calc.id,
                calculationDate=calc_date,
                calculationTime=calc_time,
                expectedPension=calc.expected_pension,
                age=calc.age,
                sex=calc.sex,
                salary=calc.salary,
                isSickLeaveIncluded=calc.is_sick_leave_included,
                totalAccumulatedFunds=calc.total_accumulated_funds,
                yearWorkStart=calc.year_work_start,
                yearDesiredRetirement=calc.year_desired_retirement,
                postalCode=calc.postal_code,
                nominalPension=None,  # These would need to be calculated
                realPension=None      # These would need to be calculated
            )
            submissions.append(submission)
        
        # Calculate total pages
        total_pages = (total_items + limit - 1) // limit
        
        return PaginatedCalculationsResponse(
            submissions=submissions,
            page=page,
            pageSize=limit,
            totalItems=total_items,
            totalPages=total_pages
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving calculations: {str(e)}")


@app.get(
    "/calculations/export",
    status_code=200,
)
def download_all_calculations(
    lang: str = Query("pl-PL", description="Language for the exported file"),
    db: Session = Depends(get_db)
):
    """Download all submitted calculations in XLS format"""
    try:
        # Get all calculations
        calculations = db.query(Calculation).all()
        
        if not calculations:
            # Return empty XLS file
            df = pd.DataFrame(columns=[
                'ID Obliczenia', 'Data', 'Czas', 'Wiek', 'Płeć', 'Pensja', 
                'Oczekiwana Emerytura', 'Składki Chorobowe', 'Zgromadzone Środki',
                'Rok Rozpoczęcia Pracy', 'Rok Planowanej Emerytury', 'Kod Pocztowy'
            ])
        else:
            # Prepare data for export
            data = []
            for calc in calculations:
                # Parse timestamp
                timestamp_parts = calc.calculation_timestamp.split('T')
                calc_date = timestamp_parts[0] if len(timestamp_parts) > 0 else ""
                calc_time = timestamp_parts[1] if len(timestamp_parts) > 1 else ""
                
                data.append({
                    'ID Obliczenia': calc.id,
                    'Data': calc_date,
                    'Czas': calc_time,
                    'Wiek': calc.age,
                    'Płeć': 'Kobieta' if calc.sex == 'female' else 'Mężczyzna',
                    'Pensja': calc.salary,
                    'Oczekiwana Emerytura': calc.expected_pension,
                    'Składki Chorobowe': 'Tak' if calc.is_sick_leave_included else 'Nie',
                    'Zgromadzone Środki': calc.total_accumulated_funds,
                    'Rok Rozpoczęcia Pracy': calc.year_work_start,
                    'Rok Planowanej Emerytury': calc.year_desired_retirement,
                    'Kod Pocztowy': calc.postal_code or ''
                })
            
            df = pd.DataFrame(data)
        
        # Create XLS file in memory
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Obliczenia Emerytur', index=False)
        output.seek(0)
        # Use StreamingResponse for file download
        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": f"attachment; filename=obliczenia-emerytur-{datetime.now().strftime('%Y-%m-%d')}.xlsx"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating XLS file: {str(e)}")


@app.get(
    "/calculations/{calculation_id}",
    response_model=CalculationDetail,
    status_code=200,
)
def get_calculation_by_id(calculation_id: str, db: Session = Depends(get_db)):
    """Get detailed calculation by ID"""
    try:
        calculation = db.query(Calculation).filter(Calculation.id == calculation_id).first()
        
        if not calculation:
            raise HTTPException(status_code=404, detail="Calculation not found")
        
        # Parse timestamp
        timestamp_parts = calculation.calculation_timestamp.split('T')
        calc_date = timestamp_parts[0] if len(timestamp_parts) > 0 else ""
        calc_time = timestamp_parts[1] if len(timestamp_parts) > 1 else ""
        
        return CalculationDetail(
            calculationId=calculation.id,
            calculationDate=calc_date,
            calculationTime=calc_time,
            expectedPension=calculation.expected_pension,
            age=calculation.age,
            sex=calculation.sex,
            salary=calculation.salary,
            isSickLeaveIncluded=calculation.is_sick_leave_included,
            totalAccumulatedFunds=calculation.total_accumulated_funds,
            yearWorkStart=calculation.year_work_start,
            yearDesiredRetirement=calculation.year_desired_retirement,
            postalCode=calculation.postal_code,
            nominalPension=None,  # These would need to be calculated
            realPension=None      # These would need to be calculated
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving calculation: {str(e)}")


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