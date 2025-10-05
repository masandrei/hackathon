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
EXPECTED_ABSENCE   = _freeze_year_map(raw["average_leave"])
META               = MappingProxyType({"scenario": raw.get("scenario",""), "prepared_on": raw.get("prepared_on","")})
