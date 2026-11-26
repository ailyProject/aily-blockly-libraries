from pathlib import Path
import shutil
import subprocess
import tempfile

here = Path(__file__).resolve().parent
archive = here.parents[1] / 'emakefun_nlcs11' / 'src.7z'
with tempfile.TemporaryDirectory() as folder:
    out = Path(folder)
    tar = shutil.which('bsdtar') or shutil.which('7z') or shutil.which('7zz')
    if not tar and Path('/usr/bin/tar').is_file() and 'bsdtar' in subprocess.check_output(['/usr/bin/tar', '--version'], text=True):
        tar = '/usr/bin/tar'
    if not tar:
        raise RuntimeError('Install bsdtar or 7-Zip to extract src.7z')
    command = [tar, 'x', '-o' + folder, archive] if Path(tar).name.startswith('7') else [tar, '-xf', archive, '-C', out]
    subprocess.run(command, check=True)
    src = out / 'src/color_sensor_nlcs11'
    exe = out / 'probe'
    subprocess.run(['c++', '-std=c++11', '-Wall', '-Wextra', '-Werror', '-I' + str(here), '-I' + str(src),
                    here / 'probe.cpp', src / 'color_sensor_nlcs11.cpp', '-o', exe], check=True)
    subprocess.run([exe], check=True)
