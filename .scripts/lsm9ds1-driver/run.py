"""Test the driver archive distributed with the Blockly library."""
from pathlib import Path
import os
import subprocess
import tempfile

here = Path(__file__).resolve().parent
archive = here.parents[1] / "sparkfun_lsm9ds1/src.7z"
with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    subprocess.run(["bsdtar", "-xf", archive, "-C", root], check=True)
    src = root / "src/SparkFun_LSM9DS1_Arduino_Library"
    exe = root / "test-lsm9ds1"
    subprocess.run([os.getenv("CXX", "c++"), "-std=c++11", "-DARDUINO=10819", "-I", here, "-I", src,
                    src / "SparkFunLSM9DS1.cpp", here / "test.cpp", "-o", exe], check=True)
    subprocess.run([exe], check=True)
