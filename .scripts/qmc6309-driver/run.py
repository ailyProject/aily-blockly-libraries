"""Compile the published QMC6309 archive and its actual Blockly sampling function."""
from pathlib import Path
import os
import subprocess
import tempfile
root = Path(__file__).resolve().parent
package = root.parents[1]/"QMC6309"
with tempfile.TemporaryDirectory() as temp:
    work=Path(temp)
    subprocess.run(["bsdtar", "-xf", package/"src.7z","-C",work],check=True)
    source,=work.rglob("QMC6309.cpp")
    with (work/"generated.inc").open("wb") as out:
        subprocess.run(["node",root/"emit.cjs",package/"generator.js"],stdout=out,check=True)
    subprocess.run([os.environ.get("CXX","c++"),"-std=c++17","-Wall","-Werror","-I",root,"-I",source.parent,"-I",work,root/"test.cpp",source,"-o",work/"test"],check=True)
    subprocess.run([work/"test"],check=True)
print("QMC6309 packaged driver passed identity, transport, coherent sampling and calibration checks.")
