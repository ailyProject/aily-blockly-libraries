"""Exercise the Arduino driver shipped in the Wind_Rain package."""
from pathlib import Path
from tempfile import TemporaryDirectory
import os
import subprocess

here = Path(__file__).resolve().parent
archive = here.parents[1] / "Wind_Rain" / "src.7z"
with TemporaryDirectory() as tmp:
    work = Path(tmp)
    subprocess.run(["bsdtar", "-xf", archive, "-C", work], check=True)
    driver = work / "lib-wind"
    binary = work / "test-wind-rain"
    subprocess.run([os.environ.get("CXX", "c++"), "-std=c++17", "-I" + str(here),
                    "-I" + str(driver), str(here / "test.cpp"), str(driver / "Wind.cpp"),
                    "-o", binary], check=True)
    for case in ["directions", "early-tip", "two-tips", "full", "wind", "wrap"]:
        subprocess.run([binary, case], check=True, timeout=5)
