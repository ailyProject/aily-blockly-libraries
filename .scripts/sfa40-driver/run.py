from pathlib import Path
import shutil
import subprocess
import tempfile

here = Path(__file__).resolve().parent
source = here.parents[1] / 'dfrobot_sfa40' / 'src.7z'
with tempfile.TemporaryDirectory() as folder:
    build = Path(folder)
    if shutil.which('bsdtar'):
        subprocess.run(['bsdtar', '-xf', source, '-C', build], check=True)
    else:
        subprocess.run(['7z', 'x', '-o' + folder, source], check=True)
    driver = build / 'src' / 'DFRobot_SFA40'
    subprocess.run(['c++', '-std=c++17', '-I' + str(here), '-I' + str(driver),
                    here / 'serial-recovery.cpp', driver / 'DFRobot_SFA40.cpp',
                    '-o', build / 'serial-recovery'], check=True)
    subprocess.run([build / 'serial-recovery'], check=True)
