"""Read a complete UTF-8 NDJSON fixture and sum its integer `value` field."""
import json
import sys
from pathlib import Path

records = 0
total = 0
for line in Path(sys.argv[1]).read_text(encoding="utf-8").split("\n"):
    if line:
        total += json.loads(line)["value"]
        records += 1
print(json.dumps({"records": records, "sum": total}))
