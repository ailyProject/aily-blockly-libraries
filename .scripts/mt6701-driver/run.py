"""Test the driver archive distributed with the Blockly library."""
from pathlib import Path
import os
import subprocess
import tempfile

here = Path(__file__).resolve().parent
archive = here.parents[1] / "MT6701/src.7z"
with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    subprocess.run(["bsdtar", "-xf", archive, "-C", root], check=True)
    src = root / "src" / "MT6701"
    exe = root / "test-mt6701"
    subprocess.run([os.getenv("CXX", "c++"), "-std=c++11", "-DARDUINO=10819", "-I", here, "-I", src,
                    src / "MT6701.cpp", here / "test.cpp", "-o", exe], check=True)
    subprocess.run([exe], check=True)
