"""Exercise the exact Arduino driver shipped in the Aily package."""
import os
from pathlib import Path
import subprocess
import tempfile

fixture = Path(__file__).resolve().parent
archive = fixture.parents[1] / "bq27220" / "src.7z"
onboard_archive = fixture.parents[1] / "ojoy_bq27220" / "src.7z"
if onboard_archive.read_bytes() != archive.read_bytes():
    raise ValueError("The OJoy and generic BQ27220 packages must ship the same tested Arduino driver")
with tempfile.TemporaryDirectory() as temp:
    subprocess.run(["bsdtar", "-xf", archive, "-C", temp], check=True)
    driver = Path(temp) / "src" / "bq27220"
    linkbit = fixture.parents[1] / "linkbit_bq27220" / "src.7z"
    onboard_protocol = subprocess.check_output(
        ["bsdtar", "-xOf", linkbit, "src/src/bq27220/bq27220_protocol.h"])
    if onboard_protocol != (driver / "bq27220_protocol.h").read_bytes():
        raise ValueError("LinkBit must use the same verified Profile 1 protocol")
    executable = Path(temp) / "check-driver"
    subprocess.run([
        os.environ.get("CXX", "c++"), "-std=c++11", "-Wall",
        "-I", fixture, "-I", driver, fixture / "test.cpp",
        "-o", executable,
    ], check=True)
    subprocess.run([executable], check=True)
