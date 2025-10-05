from models import Calculation, Leave, Sex
from mapper import GROWTH, VALORIZATION, AVERAGE_WAGE, INFLATION, LIFE_EXPECTANCY, EXPECTED_ABSENCE
from datetime import datetime

TAU = 0.196
FEMALE_EXPERIENCE = 20
MALE_EXPERIENCE = 25
LEAP_YEAR_DAYS = 366
NORMAL_YEAR_DAYS = 365
AVG_SALARIES_PER_YEAR_THRESHOLD = 30

def get_salary(base_salary: float, start_year: int, target_year: int):
    if target_year < start_year:
        for i in range(start_year - 1, target_year - 1, -1):
            base_salary = base_salary / (1 + GROWTH[i])
    else:
        for i in range(start_year, target_year):
            base_salary = base_salary * (1 + GROWTH[i])
    
    return base_salary

def get_inflation(start_year: int, end_year: int):
    inflation = 1
    for i in range(start_year, end_year):
        inflation = inflation * (1 + INFLATION[i])
    
    return inflation

def compute_pension_funds(calc: Calculation):
    jobs = sorted(calc.jobs, key= lambda x: x.start_date)
    start_year = jobs[0].start_date
    if len(calc.leaves) == 0:
        avg_leaves = EXPECTED_ABSENCE[calc.sex][max(18, min(65, calc.age))]
        calc.leaves = [Leave(leave_year=year, duration_days=avg_leaves) for year in range(calc.year_work_start, calc.year_desired_retirement + 1)]
    if calc.total_accumulated_funds is None:
        total_funds = 0
        experience = 0
    else:
        total_funds = calc.total_accumulated_funds
        start_idx = 0
        while jobs[i].end_date < datetime.now().year:
            i += 1
        jobs[i].start_date = min(jobs[i].start_date, datetime.now().year)
        jobs = jobs[start_idx:]

        
    threshold = MALE_EXPERIENCE if calc.sex==Sex.MALE else FEMALE_EXPERIENCE
    for job in jobs:
        experience = experience + (job.end_date if job.end_date is not None else datetime.now().year) - job.start_date + 1
        for i in range(job.start_date, job.end_date):
            total_days = NORMAL_YEAR_DAYS if i % 4 == 0 else LEAP_YEAR_DAYS
            effective_days = total_days
            for leave in calc.leaves:
                if leave.leave_year == i:
                    effective_days -= leave.duration_days
            total_sum_under_taxes = min(12 * get_salary(job.base_salary, job.start_date, i) * (effective_days / total_days * TAU + (total_days - effective_days) / total_days * leave.get_multiplier()), AVG_SALARIES_PER_YEAR_THRESHOLD * AVERAGE_WAGE[i])
            total_funds = total_funds + total_sum_under_taxes
            total_funds = total_funds * (1 + VALORIZATION[i])
    
    inflation=get_inflation(start_year, datetime.now().year)
    return {"nominal": total_funds, "real": total_funds / inflation} if experience >= threshold else {"nominal": 0, "real": 0}

def compute_montly_pension(available_funds, age: int):
    return {"nominal": available_funds["nominal"] / LIFE_EXPECTANCY[age], "real": available_funds["real"] / LIFE_EXPECTANCY[age]}
