"""Reproduce a narrow local experiment. Never interpret it as a universal language ranking.

Run from the repository: python3 scripts/benchmarks/run-language-benchmark.py
Requires Python, Node, and matplotlib (only for the chart, outside timed processes).
"""
import csv
import hashlib
import json
import os
import platform
import statistics
import subprocess
import sys
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "public/blogs/evidence"
COUNT = 200_000
TRIALS = 7
EXPECTED = {"records": COUNT, "sum": sum(i % 100 for i in range(COUNT))}


def measure(command, fixture):
    started = time.perf_counter()
    result = subprocess.run([*command, str(fixture)], capture_output=True, text=True, check=True)
    elapsed = (time.perf_counter() - started) * 1000
    if json.loads(result.stdout) != EXPECTED:
        raise ValueError(f"Incorrect workload result: {command[0]}")
    return round(elapsed, 3)


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    commands = {
        "Node.js": ["node", str(ROOT / "scripts/benchmarks/parse-ndjson.mjs")],
        "CPython": [sys.executable, str(ROOT / "scripts/benchmarks/parse-ndjson.py")],
    }
    samples = {name: [] for name in commands}
    with tempfile.TemporaryDirectory(prefix="portfolio-language-benchmark-") as temporary:
        fixture = Path(temporary) / "records.ndjson"
        with fixture.open("w", encoding="utf-8", newline="\n") as stream:
            for i in range(COUNT):
                stream.write(json.dumps({"id": i, "value": i % 100, "label": "record"}, separators=(",", ":")) + "\n")
        digest = hashlib.sha256(fixture.read_bytes()).hexdigest()
        fixture_size = fixture.stat().st_size
        for command in commands.values():
            measure(command, fixture)  # One excluded warm-up process per runtime.
        for trial in range(TRIALS):
            order = list(commands) if trial % 2 == 0 else list(reversed(commands))
            for name in order:
                samples[name].append(measure(commands[name], fixture))

    cpu = platform.processor()
    if Path("/proc/cpuinfo").exists():
        for line in Path("/proc/cpuinfo").read_text().splitlines():
            if line.startswith("model name"):
                cpu = line.split(":", 1)[1].strip()
                break
    data = {
        "executed_at_utc": datetime.now(timezone.utc).isoformat(),
        "workload": "Whole-file UTF-8 NDJSON parse and sum of the integer value field",
        "timing": "Parent wall clock includes process startup, file read, parsing, reduction, JSON result output and shutdown",
        "records": COUNT,
        "fixture_bytes": fixture_size,
        "fixture_sha256": digest,
        "expected_result": EXPECTED,
        "trials_per_runtime": TRIALS,
        "excluded_warmups_per_runtime": 1,
        "order": "Alternating runtime order per trial; warmed filesystem cache",
        "environment": {"os": platform.platform(), "cpu": cpu, "logical_cpus": os.cpu_count(), "node": subprocess.check_output(["node", "--version"], text=True).strip(), "python": platform.python_version()},
        "limitations": "Single uncontrolled development host; no CPU pinning, frequency lock, load isolation, memory measurement, compiler comparison, or network workload. Runtime/library implementations and startup affect results. Not a universal language ranking.",
        "results": [{"runtime": name, "elapsed_ms": values, "median_ms": round(statistics.median(values), 3), "min_ms": min(values), "max_ms": max(values)} for name, values in samples.items()],
    }
    (OUTPUT / "language-benchmark.json").write_text(json.dumps(data, indent=2) + "\n")
    with (OUTPUT / "language-benchmark.csv").open("w", newline="") as stream:
        writer = csv.writer(stream)
        writer.writerow(["runtime", "trial", "elapsed_ms"])
        for name, values in samples.items():
            writer.writerows((name, i + 1, value) for i, value in enumerate(values))

    render_chart(data)
    print(json.dumps(data, indent=2))


def render_chart(data):
    """Render saved observations without running or changing the measurements."""
    samples = {result["runtime"]: result["elapsed_ms"] for result in data["results"]}
    os.environ.setdefault("MPLCONFIGDIR", str(Path(tempfile.gettempdir()) / "portfolio-matplotlib-cache"))
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    with plt.style.context("default"):
        fig, ax = plt.subplots(figsize=(11, 6.5), layout="constrained")
        fig.patch.set_facecolor("#f7f5f0")
        ax.set_facecolor("#f7f5f0")
        names = list(samples)
        medians = [statistics.median(samples[name]) for name in names]
        ax.bar(names, medians, width=0.5, color=["#c93623", "#111111"], alpha=1.0, label=f"Median of {data['trials_per_runtime']} process runs")
        for i, name in enumerate(names):
            ax.scatter([i + (j - (len(samples[name]) - 1) / 2) * .035 for j in range(len(samples[name]))], samples[name], color="#f7f5f0", edgecolors="#111111", linewidths=.8, s=28, zorder=3, label="Individual runs" if i == 0 else None)
            ax.annotate(f"{medians[i]:.1f} ms median", (i, max(samples[name]) + max(medians) * .04), ha="center", fontsize=11)
        ax.set_ylim(0, max(max(values) for values in samples.values()) * 1.2)
        ax.set_ylabel("Whole-process wall time (milliseconds) · lower is faster")
        ax.set_title(f"Local experiment: parse and sum {data['records']:,} NDJSON records\nSame fixture, verified output, one excluded warm-up per runtime", fontsize=14, pad=20)
        ax.grid(axis="y", alpha=.15)
        ax.set_axisbelow(True)
        ax.legend(loc="upper left")
        fig.supxlabel(f"Node {data['environment']['node']} · CPython {data['environment']['python']} · {data['environment']['cpu']}\nSingle development host; warmed filesystem cache. Not a universal language ranking.", fontsize=9)
        fig.savefig(OUTPUT / "language-benchmark.png", dpi=160, facecolor=fig.get_facecolor())
        plt.close(fig)


if __name__ == "__main__":
    if "--render-only" in sys.argv:
        render_chart(json.loads((OUTPUT / "language-benchmark.json").read_text()))
        print("Re-rendered existing measurements in the Signal Press palette.")
    else:
        main()
