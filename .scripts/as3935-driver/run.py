"""Test the driver archive distributed with the Blockly library."""
from pathlib import Path
import os
import subprocess
import tempfile

here = Path(__file__).resolve().parent
archive = here.parents[1] / "sparkfun_as3935/src.7z"
with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    subprocess.run(["bsdtar", "-xf", archive, "-C", root], check=True)
    src = root / "src/SparkFun_AS3935"
    exe = root / "test-as3935"
    subprocess.run([os.getenv("CXX", "c++"), "-std=c++11", "-DARDUINO=10819", "-I", here, "-I", src,
                    src / "SparkFun_AS3935.cpp", here / "test.cpp", "-o", exe], check=True)
    subprocess.run([exe], check=True)
