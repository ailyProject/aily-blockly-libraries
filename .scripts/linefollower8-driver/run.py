from pathlib import Path
from tempfile import TemporaryDirectory
import subprocess
here = Path(__file__).resolve().parent
with TemporaryDirectory() as tmp:
    dest = Path(tmp)
    subprocess.run(['bsdtar','-xf',here.parents[1]/'LineFollower_8/src.7z','-C',dest],check=True)
    driver = dest/'src/EspReceive'
    subprocess.run(['c++','-std=c++17','-I'+str(here),'-I'+str(driver),here/'test.cpp',driver/'EspReceive.cpp','-o',dest/'test'],check=True)
    subprocess.run([dest/'test'],check=True)
