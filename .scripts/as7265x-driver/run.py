"""Test the driver archive distributed with the Blockly library."""
from pathlib import Path
import os
import subprocess
import tempfile

here = Path(__file__).resolve().parent
archive = here.parents[1] / "sparkfun_as7265x/src.7z"
with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    subprocess.run(["bsdtar", "-xf", archive, "-C", root], check=True)
    src = root / "src/SparkFun_AS7265x"
    exe = root / "test-as7265x"
    subprocess.run([os.getenv("CXX", "c++"), "-std=c++11", "-DARDUINO=10819", "-I", here, "-I", src,
                    src / "SparkFun_AS7265X.cpp", here / "test.cpp", "-o", exe], check=True)
    subprocess.run([exe], check=True)
