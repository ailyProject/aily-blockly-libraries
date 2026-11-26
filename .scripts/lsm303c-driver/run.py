"""Test the driver archive distributed with the Blockly library."""
from pathlib import Path
import os
import subprocess
import tempfile

here = Path(__file__).resolve().parent
archive = here.parents[1] / "sparkfun_lsm303c/src.7z"
with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    subprocess.run(["bsdtar", "-xf", archive, "-C", root], check=True)
    src = root / "src/SparkFun_LSM303C_6_DOF_IMU_Breakout_Arduino_Library"
    exe = root / "test-lsm303c"
    subprocess.run([os.getenv("CXX", "c++"), "-std=c++11", "-I", here, "-I", src,
                    src / "SparkFunLSM303C.cpp", here / "test.cpp", "-o", exe], check=True)
    subprocess.run([exe], check=True)
