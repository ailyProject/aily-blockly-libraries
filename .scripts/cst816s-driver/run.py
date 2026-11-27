from pathlib import Path
import subprocess
import tempfile

here = Path(__file__).resolve().parent
with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    archive = here.parents[1] / 'CST816S/src.7z'
    subprocess.run(['bsdtar', '-xf', archive, '-C', root], check=True)
    driver = root / 'src/cst816s'
    subprocess.run(['c++', '-std=c++17', '-DARDUINO_ARCH_STM32', '-Wall', '-Wextra', '-Werror',
                    '-I', here, '-I', driver, here / 'test.cpp', driver / 'CST816S.cpp',
                    '-o', root / 'test'], check=True)
    subprocess.run([root / 'test'], check=True)
