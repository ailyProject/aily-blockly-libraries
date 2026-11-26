"""Build the installed ZX archive against a deterministic transport fault fixture."""
from pathlib import Path
import os
import subprocess
import tempfile

root = Path(__file__).resolve().parent
archive = root.parents[1] / "sparkfun_zx_sensor/src.7z"
with tempfile.TemporaryDirectory() as work:
    subprocess.run(["bsdtar", "-xf", archive, "-C", work], check=True)
    source, = Path(work).rglob("ZX_Sensor.cpp")
    executable = Path(work) / "zx-test"
    subprocess.run([os.environ.get("CXX", "c++"), "-std=c++17", "-Wall", "-Werror",
                    "-I", root, "-I", source.parent, source, root / "test.cpp",
                    "-o", executable], check=True)
    subprocess.run([executable], check=True)
print("ZX packaged driver passed transport, version, interrupt, coordinate and gesture checks.")
