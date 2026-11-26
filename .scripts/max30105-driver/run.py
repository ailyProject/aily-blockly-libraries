"""Test the driver shipped inside the Blockly library archive."""
import json
import os
from pathlib import Path
import subprocess
import tempfile

tests = Path(__file__).resolve().parent
archive = tests.parents[1] / 'sparkfun_max30105' / 'src.7z'
for file in [archive.parent/'block.json', *(archive.parent/'i18n').glob('*.json')]:
    data = json.loads(file.read_bytes())
    setup = next(b for b in data if b['type'] == 'max30105_setup') if isinstance(data, list) else data['max30105_setup']
    assert setup['args0'][1]['options'] == [[v, v] for v in ['60', '20', '6']]
    assert setup['args0'][6]['options'][-2:] == [['2048', '2048'], ['2048 (32768)', '32768']]
with tempfile.TemporaryDirectory() as tmp:
    dest = Path(tmp)
    subprocess.run(['bsdtar', '-xf', archive, '-C', dest], check=True)
    source, = dest.rglob('MAX30105.cpp')
    exe = dest / 'fifo-test'
    subprocess.run([os.environ.get('CXX', 'c++'), '-std=c++17', '-DARDUINO=10800', '-DFIXED',
                    '-I', tests, '-I', source.parent, tests/'test.cpp', source, '-o', exe], check=True)
    subprocess.run([exe], check=True)
