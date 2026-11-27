from pathlib import Path
import subprocess
import tempfile

here = Path(__file__).resolve().parent
archive = here.parents[1] / 'dfrobot_c4001/src.7z'
with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    subprocess.run(['bsdtar', '-xf', archive, '-C', root], check=True)
    driver = root / 'src/DFRobot_C4001'
    exe = root / 'probe'
    subprocess.run(['c++', '-std=c++17', '-DESP32', '-Wall', '-Wextra', '-I', here, '-I', driver,
                    here / 'probe.cpp', driver / 'DFRobot_C4001.cpp', '-o', exe], check=True)
    subprocess.run([exe], check=True)
