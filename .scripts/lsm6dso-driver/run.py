"""Test the driver archive distributed with the Blockly library."""
from pathlib import Path
import os
import subprocess
import tempfile

here = Path(__file__).resolve().parent
archive = here.parents[1] / "sparkfun_lsm6dso/src.7z"
with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    subprocess.run(["bsdtar", "-xf", archive, "-C", root], check=True)
    src = root / "src/SparkFun_Qwiic_6DoF_LSM6DSO_Arduino_Library"
    exe = root / "test-lsm6dso"
    subprocess.run([os.getenv("CXX", "c++"), "-std=c++11", "-I", here, "-I", src,
                    src / "SparkFunLSM6DSO.cpp", here / "test.cpp", "-o", exe], check=True)
    subprocess.run([exe], check=True)
