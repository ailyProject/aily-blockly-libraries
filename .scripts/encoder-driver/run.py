"""Exercise the installed source archive in both STM32 interrupt and polling modes."""
from pathlib import Path
from tempfile import TemporaryDirectory
import os
import subprocess

tests = Path(__file__).resolve().parent
archive = tests.parents[1] / 'encoder/src.7z'
with TemporaryDirectory(dir=os.environ.get('TMPDIR')) as directory:
    src = Path(directory) / 'src/Encoder'
    subprocess.run(['tar', '-xf', archive, '-C', directory], check=True)
    for flags in ([], ['-DENCODER_DO_NOT_USE_INTERRUPTS']):
        binary = Path(directory) / 'encoder-test'
        subprocess.run(['c++', '-std=c++17', '-Wall', '-Wextra', '-Werror',
                        '-DARDUINO_ARCH_STM32', '-DARDUINO=10800', *flags,
                        '-I', tests, '-I', src, tests / 'quadrature.cpp',
                        src / 'Encoder.cpp', '-o', binary], check=True)
        subprocess.run([binary], check=True)
