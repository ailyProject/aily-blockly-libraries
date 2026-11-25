"""Run the I2C regression against the exact sources distributed in src.7z."""
import os
from pathlib import Path
import subprocess
import tempfile

fixture = Path(__file__).resolve().parent
archive = fixture.parents[1] / "Infineon_dps3xx" / "src.7z"
with tempfile.TemporaryDirectory() as directory:
    subprocess.run(["bsdtar", "-xf", archive, "-C", directory], check=True)
    driver = Path(directory) / "src" / "Dps3xx"
    executable = Path(directory) / "dps3xx-test"
    subprocess.run([
        os.environ.get("CXX", "c++"), "-std=c++11", "-DDPS_DISABLESPI",
        "-I", fixture, "-I", driver, fixture / "test.cpp",
        driver / "DpsClass.cpp", driver / "Dps3xx.cpp", "-o", executable,
    ], check=True)
    subprocess.run([executable], check=True)
