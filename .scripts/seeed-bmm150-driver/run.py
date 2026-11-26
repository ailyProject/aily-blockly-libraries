"""Test the driver archive distributed with the Blockly library."""
from pathlib import Path
import os
import subprocess
import tempfile

here = Path(__file__).resolve().parent
archive = here.parents[1] / "seeed_bmm150/src.7z"
with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    subprocess.run(["bsdtar", "-xf", archive, "-C", root], check=True)
    src = root / "src/bmm150"
    exe = root / "test-bmm150"
    subprocess.run([os.getenv("CXX", "c++"), "-std=c++11", "-I", here, "-I", src,
                    src / "bmm150.cpp", here / "test.cpp", "-o", exe], check=True)
    subprocess.run([exe], check=True)
