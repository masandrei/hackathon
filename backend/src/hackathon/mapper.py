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
# Handle gender-specific life expectancy data
LIFE_EXPECTANCY_MALE   = _freeze_year_map(raw["life_expectancy"]["M"])
LIFE_EXPECTANCY_FEMALE = _freeze_year_map(raw["life_expectancy"]["F"])
# Default to male for backward compatibility
LIFE_EXPECTANCY    = LIFE_EXPECTANCY_MALE
META               = MappingProxyType({"scenario": raw.get("scenario",""), "prepared_on": raw.get("prepared_on","")})
