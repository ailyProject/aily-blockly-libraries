from pathlib import Path
import subprocess
import tempfile

here = Path(__file__).resolve().parent
archive = here.parents[1] / 'dfrobot_gm60/src.7z'
with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    subprocess.run(['bsdtar', '-xf', archive, '-C', root], check=True)
    driver = root / 'src/DFRobot_GM60'
    binary = root / 'gm60-test'
    subprocess.run(['c++', '-std=c++17', '-I', here, '-I', driver,
                    here / 'test.cpp', driver / 'DFRobot_GM60.cpp', '-o', binary], check=True)
    subprocess.run([binary], check=True)
