"""Build the shipped INA228/INA237/INA238 drivers and BusIO against a controlled Wire peer."""
import os
from pathlib import Path
import subprocess
import tempfile

fixture = Path(__file__).resolve().parent
root = fixture.parents[1]
with tempfile.TemporaryDirectory() as temp:
    sources = []
    for package in ("adafruit_ina228", "adafruit_ina237_ina238"):
        extracted = Path(temp) / package
        extracted.mkdir()
        subprocess.run(["bsdtar", "-xf", root / package / "src.7z", "-C", extracted], check=True)
        sources.append(extracted / "src")
    for folder in ("Adafruit_INA228", "Adafruit_BusIO"):
        files = lambda root: {p.name: p.read_bytes() for p in (root / folder).iterdir() if p.is_file()}
        assert files(sources[0]) == files(sources[1]), folder
    drivers = [sources[0] / "Adafruit_BusIO", sources[0] / "Adafruit_INA228",
               sources[1] / "Adafruit_INA237_INA238"]
    exe = Path(temp) / "check"
    subprocess.run([os.environ.get("CXX", "c++"), "-std=c++11", "-DARDUINO=10819",
                    "-I", fixture, *[flag for d in drivers for flag in ("-I", d)],
                    *[p for d in drivers for p in sorted(d.glob("*.cpp"))],
                    fixture / "test.cpp", fixture / "test-family.cpp", "-o", exe], check=True)
    subprocess.run([exe], check=True)
print("INA228 recovery, measurement, copy, and INA237/238 identity checks passed.")
