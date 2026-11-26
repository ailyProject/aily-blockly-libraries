"""Compile and test the exact driver archive and helpers shipped by the Blockly library."""
from pathlib import Path
import os
import subprocess
import tempfile

tests = Path(__file__).resolve().parent
library = tests.parents[1] / 'max30102'
with tempfile.TemporaryDirectory() as tmp:
    build = Path(tmp)
    subprocess.run(['bsdtar', '-xf', library/'src.7z', '-C', build], check=True)
    subprocess.run(['node', tests/'generated.cjs', library, build/'generated.h'], check=True)
    src, = build.rglob('max30102.cpp')
    executable = build / 'test'
    subprocess.run([os.environ.get('CXX', 'c++'), '-std=c++17', '-I', tests, '-I', build, '-I', src.parent,
                    tests/'test.cpp', src, src.parent/'max30102_settings.cpp', src.parent/'algorithm_by_RF.cpp',
                    '-o', executable], check=True)
    subprocess.run([executable], check=True)
