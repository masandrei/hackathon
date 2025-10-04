import uuid
from fastapi import FastAPI
from hackathon.models import Calculation, CalculationRequest, CalculationResponse
from hackathon.algorithm import compute_pension_funds, compute_montly_pension 
import uvicorn
from datetime import datetime

app = FastAPI(title="Hackathon API")

@app.get("/")
def root():
    return {"message": "Hello from Hackathon!"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}

@app.post("/calculations")
def create_calculation(calculation: CalculationRequest):
    calc = Calculation(**calculation, calculation_id=uuid.uuid4(), calculation_datetime=datetime.now())
    total_funds = compute_pension_funds(calc)
    monthly_pension = compute_montly_pension(total_funds, calc.age)
    # TODO: save calculation to db
    return CalculationResponse(nominal_monthly_pension=monthly_pension["nominal"], real_monthly_pension=monthly_pension["real"])


def main():
    uvicorn.run("hackathon.main:app", host="127.0.0.1", port=8000, reload=True, app_dir="src")
