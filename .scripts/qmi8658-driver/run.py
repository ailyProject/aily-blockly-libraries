"""Check the drivers actually shipped in the two Blockly packages."""
from pathlib import Path
import os
import subprocess
import tempfile

fixture = Path(__file__).resolve().parent
repo = fixture.parents[1]
with tempfile.TemporaryDirectory() as directory:
    staging = Path(directory)
    for package in ("QMI8658", "ojoy_qmi8658c"):
        subprocess.run(["bsdtar", "-xf", repo / package / "src.7z", "-C", staging], check=True)

    generic = staging / "src/QMI8658/src"
    onboard = staging / "src/OJoy_QMI8658C"
    executable = staging / "driver-test"
    subprocess.run([
        os.environ.get("CXX", "c++"), "-std=c++17", "-Wall", "-Wextra",
        "-I", fixture, "-I", generic, "-I", onboard,
        generic / "QMI8658.cpp", onboard / "OJoy_QMI8658C.cpp",
        fixture / "test.cpp", "-o", executable,
    ], check=True)
    subprocess.run([executable], check=True)
