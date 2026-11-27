from pathlib import Path
import subprocess
import tempfile

here = Path(__file__).resolve().parent
with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    archive = here.parents[1] / 'FT6336U/src.7z'
    subprocess.run(['bsdtar', '-xf', archive, '-C', root], check=True)
    driver = root / 'src/FT6336U'
    subprocess.run(['c++', '-std=c++17', '-DARDUINO_ARCH_ESP32', '-Wall', '-Wextra', '-Werror',
                    '-I', here, '-I', driver, here / 'test.cpp', driver / 'FT6336U.cpp',
                    '-o', root / 'test'], check=True)
    subprocess.run([root / 'test'], check=True)
