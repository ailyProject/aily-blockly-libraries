"""Exercise the shipped IMU and RTU drivers against fixed I²C and UART transcripts."""
import json
import subprocess
import tempfile
from pathlib import Path

suite = Path(__file__).resolve().parent
def exercise(sku, axes, fixture):
    library = suite.parents[1] / sku
    transcripts = json.loads((suite / fixture).read_bytes())
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        subprocess.run(['bsdtar', '-xf', library / 'src.7z', '-C', root], check=True)
        imu = root / 'src/DFRobot_Multi_DOF_IMU'
        rtu = root / 'src/DFRobot_RTU'
        program = root / 'imu'
        subprocess.run(['c++', '-std=c++17', '-DARDUINO=10800', f'-DIMU_AXES={axes}', '-include', 'cmath',
                        '-I', suite, '-I', suite.parent / 'dfrobot-tactile-array', '-I', imu, '-I', rtu,
                        suite / 'imu.cpp', imu / 'DFRobot_Multi_DOF_IMU.cpp', rtu / 'DFRobot_RTU.cpp',
                        '-o', program], check=True)
        for mode, pairs in transcripts.items():
            responses = ''.join(reply+'\n' for _, reply in pairs)
            result = subprocess.run([program, mode], input=responses, text=True, stdout=subprocess.PIPE,
                                    timeout=10, check=True)
            assert [line.rstrip() for line in result.stdout.splitlines()] == [req for req, _ in pairs] + ['PASS']
            print(sku, mode, len(pairs), 'verified')

exercise('dfrobot-sen0692', 6, 'frames.json')
exercise('dfrobot-sen0694', 9, 'frames-9dof.json')
exercise('dfrobot-sen0696', 10, 'frames-10dof.json')
