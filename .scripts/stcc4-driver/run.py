from pathlib import Path
import shutil
import subprocess
import tempfile

here = Path(__file__).resolve().parent
archive = here.parents[1] / 'dfrobot_stcc4' / 'src.7z'
with tempfile.TemporaryDirectory() as folder:
    out = Path(folder)
    if shutil.which('bsdtar'):
        subprocess.run(['bsdtar', '-xf', archive, '-C', out], check=True)
    else:
        subprocess.run(['7z', 'x', '-o' + folder, archive], check=True)
    src = out / 'src' / 'DFRobot_STCC4'
    exe = out / 'word-integrity'
    subprocess.run(['c++', '-std=c++17', '-I' + str(here), '-I' + str(src),
                    here / 'word-integrity.cpp', src / 'DFRobot_STCC4.cpp', '-o', exe], check=True)
    result = subprocess.check_output([exe], text=True).splitlines()
    assert len(result) == 31 and all(row.endswith(',pass') for row in result), result
    print('STCC4 driver checks passed:', len(result))
