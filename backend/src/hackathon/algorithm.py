from __future__ import annotations
from dataclasses import dataclass
from typing import Dict, List, Optional
from .mapper import INFLATION, VALORIZATION, AVERAGE_WAGE, GROWTH


# -------------------------- Data models --------------------------

@dataclass
class Job:
    base_salary_monthly: float  # salary expressed in base_year (monthly, gross)
    base_year: int              # year that salary is stated for
    start_year: int             # first contributory year (inclusive)
    end_year: Optional[int] = None  # last contributory year (inclusive); None = open-ended
    label: str = ""
    sick_factor: Optional[float] = None  # per-job sick factor; if None, global sick_factor is used


@dataclass
class YearBreakdown:
    year: int
    monthly_by_job: List[float]        # projected monthly salary per job (0 if inactive)
    base_annual_before_cap: float      # sum across jobs × 12 × sick factor
    cap_annual: float                  # 30 × avg monthly wage
    base_annual_after_cap: float       # min(base_annual_before_cap, cap_annual)
    contributions_by_job: List[float]  # τ × base (scaled if over cap)
    contribution_total: float          # Σ contributions_by_job
    valorized_to_retirement: float     # contribution_total carried to retirement year


@dataclass
class MultiJobResult:
    years: List[YearBreakdown]
    KR: float  # notional capital at the retirement (award) year


# -------------------------- Core helpers --------------------------

def ensure_year(d: Dict[int, float], year: int, name: str) -> None:
    if year not in d:
        raise ValueError(f"Missing {name} for year {year}.")


def chain_factor(path: Dict[int, float], start_year: int, end_year: int) -> float:
    """
    Product of indices for years (start_year+1 ... end_year).
    If end_year == start_year -> 1.0
    """
    if end_year < start_year:
        return 1.0
    f = 1.0
    for y in range(start_year + 1, end_year + 1):
        ensure_year(path, y, "valorization index")
        f *= path[y]
    return f


def get_salary(base_salary_monthly: float, base_year: int, target_year: int,
               growth: Dict[int, float]) -> float:
    """
    Project/backcast one salary to target_year using growth factors (from y-1 -> y).
    """
    s = base_salary_monthly
    if target_year > base_year:
        for y in range(base_year + 1, target_year + 1):
            ensure_year(growth, y, "growth factor")
            s *= (growth[y] + 1)
    elif target_year < base_year:
        for y in range(base_year, target_year, -1):
            ensure_year(growth, y, "growth factor")
            s /= (growth[y] + 1)
    return s


# -------------------------- Multi-job engine --------------------------

def build_multi_job_contributions(
    *,
    jobs: List[Job],
    start_year: int,
    end_year: int,
    tau: float,                          # contribution rate (0..1), e.g. 0.1952
    include_sick_leave: bool,
    sick_factor_global: float,           # e.g. 0.97 (3% reduction)
    retirement_year: int                 # carry contributions to this (award) year
) -> MultiJobResult:
    """
    - Projects each job's salary per year
    - Applies sick-leave factor (per-job if given, else global)
    - Applies annual 30× cap on the sum of bases
    - Allocates contributions per job (pro-rata under cap)
    - Valorizes each year to the retirement year
    """
    if start_year > end_year:
        raise ValueError("start_year must be ≤ end_year.")
    if not (0 < tau <= 1):
        raise ValueError("Invalid contribution rate τ.")

    years: List[YearBreakdown] = []
    KR = 0.0

    for y in range(start_year, end_year + 1):
        # 1) Project monthly salary for each job in year y (0 if inactive)
        monthly_by_job: List[float] = []
        base_annual_per_job_before_cap: List[float] = []

        for job in jobs:
            active = y >= job.start_year and (job.end_year is None or y <= job.end_year)
            if not active:
                monthly_by_job.append(0.0)
                base_annual_per_job_before_cap.append(0.0)
                continue

            m = get_salary(job.base_salary_monthly, job.base_year, y, GROWTH)
            monthly_by_job.append(m)

            sick = job.sick_factor if (include_sick_leave and job.sick_factor is not None) else \
                   (sick_factor_global if include_sick_leave else 1.0)
            base_annual_per_job_before_cap.append(12.0 * m * sick)

        # 2) Combine and apply 30× cap
        base_annual_before_cap = sum(base_annual_per_job_before_cap)
        ensure_year(AVERAGE_WAGE, y, "avg monthly wage")
        cap_annual = 30.0 * AVERAGE_WAGE[y]
        base_annual_after_cap = min(base_annual_before_cap, cap_annual)

        # 3) Allocate contributions per job (under cap: direct; over cap: pro-rata)
        contributions_by_job: List[float] = []
        if base_annual_before_cap <= 0:
            contributions_by_job = [0.0 for _ in base_annual_per_job_before_cap]
        elif base_annual_before_cap <= cap_annual:
            contributions_by_job = [tau * b for b in base_annual_per_job_before_cap]
        else:
            scale = cap_annual / base_annual_before_cap
            contributions_by_job = [tau * b * scale for b in base_annual_per_job_before_cap]

        contribution_total = sum(contributions_by_job)

        # 4) Valorize this year's total to retirement year
        v = chain_factor(VALORIZATION, y, retirement_year)
        valorized_to_retirement = contribution_total * v
        KR += valorized_to_retirement

        years.append(YearBreakdown(
            year=y,
            monthly_by_job=monthly_by_job,
            base_annual_before_cap=base_annual_before_cap,
            cap_annual=cap_annual,
            base_annual_after_cap=base_annual_after_cap,
            contributions_by_job=contributions_by_job,
            contribution_total=contribution_total,
            valorized_to_retirement=valorized_to_retirement
        ))

    return MultiJobResult(years=years, KR=KR)


# -------------------------- Pension award (optional) --------------------------

def pension_at_retirement(KR: float, life_expectancy_years: float) -> float:
    """First pension at award (PLN/month)."""
    if life_expectancy_years <= 0:
        raise ValueError("Life expectancy must be > 0.")
    return KR / (12.0 * life_expectancy_years)
