from pathlib import Path
import subprocess
import tempfile

here = Path(__file__).resolve().parent
archive = here.parents[1] / 'dfrobot_ct1780/src.7z'
with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    subprocess.run(['bsdtar', '-xf', archive, '-C', root], check=True)
    driver = root / 'src/DFRobot_CT1780'
    exe = root / 'probe'
    subprocess.run(['c++', '-std=c++17', '-Wall', '-Wextra', '-I', here, '-I', driver,
                    here / 'probe.cpp', driver / 'DFRobot_CT1780.cpp', '-o', exe], check=True)
    subprocess.run([exe], check=True)
