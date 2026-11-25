"""Exercise the exact Arduino driver shipped in the Aily package."""
import os
from pathlib import Path
import subprocess
import tempfile

fixture = Path(__file__).resolve().parent
archive = fixture.parents[1] / "sparkfun_bq27441" / "src.7z"
with tempfile.TemporaryDirectory() as temp:
    subprocess.run(["bsdtar", "-xf", archive, "-C", temp], check=True)
    driver = Path(temp) / "src" / "SparkFun_BQ27441"
    executable = Path(temp) / "check-driver"
    subprocess.run([
        os.environ.get("CXX", "c++"), "-std=c++11", "-Wall",
        "-I", fixture, "-I", driver, fixture / "test.cpp",
        driver / "SparkFunBQ27441.cpp", "-o", executable,
    ], check=True)
    subprocess.run([executable], check=True)
