"""Replay two addressed Modbus peripherals against the actual Arduino drivers."""
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile

here = Path(__file__).resolve().parent
repo = here.parents[1]
archives = [repo / name / 'src.7z' for name in ('dfrobot-sen0704', 'dfrobot-sen0705')]
assert len({hashlib.sha256(p.read_bytes()).digest() for p in archives}) == 1
frames = iter(json.loads((here / 'frames.json').read_bytes()))
with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    subprocess.run(['bsdtar', '-xf', archives[0], '-C', root], check=True)
    tactile = root / 'src/DFRobot_TactileSensor'
    rtu = root / 'src/DFRobot_RTU'
    program = root / 'check'
    subprocess.run(['c++', '-std=c++17', '-DARDUINO=10800', '-I', here, '-I', tactile, '-I', rtu,
                    here / 'bridge.cpp', tactile / 'DFRobot_TactileSensor.cpp', rtu / 'DFRobot_RTU.cpp',
                    '-o', program], check=True)
    with subprocess.Popen([program], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True) as child:
        passed = False
        for line in child.stdout:
            line = line.rstrip()
            if line.startswith('TX '):
                request, response = next(frames)
                assert line.split()[2] == request
                child.stdin.write(response + '\n')
                child.stdin.flush()
            elif line == 'PASS':
                passed = True
        assert child.wait() == 0 and passed and next(frames, None) is None
