import json
from pathlib import Path
from types import MappingProxyType

FILE = Path("statistics.json")

def _freeze_year_map(d: dict) -> dict:
    return MappingProxyType({int(k): float(v) for k, v in d.items()})

with FILE.open("r", encoding="utf-8") as f:
    raw = json.load(f)

GROWTH             = _freeze_year_map(raw["growth_rate"])
AVERAGE_WAGE       = _freeze_year_map(raw["average_wage"])
VALORIZATION       = _freeze_year_map(raw["valorization"])
INFLATION          = _freeze_year_map(raw["inflation"])
LIFE_EXPECTANCY    = _freeze_year_map(raw["life_expectancy"])

# For now, use the same life expectancy data for both genders
# In a real application, you'd have separate data for male/female
LIFE_EXPECTANCY_MALE = LIFE_EXPECTANCY
LIFE_EXPECTANCY_FEMALE = LIFE_EXPECTANCY

# Handle nested structure for average_leave
EXPECTED_ABSENCE_FEMALE = _freeze_year_map(raw["average_leave"]["F"])
EXPECTED_ABSENCE_MALE = _freeze_year_map(raw["average_leave"]["M"])

META               = MappingProxyType({"scenario": raw.get("scenario",""), "prepared_on": raw.get("prepared_on","")})
