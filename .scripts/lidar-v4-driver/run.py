"""Build and exercise the LIDAR-Lite v4 driver from the published archive layout."""
from pathlib import Path
import json, os, subprocess, tempfile

here = Path(__file__).resolve().parent
library = here.parents[1] / 'sparkfun_lidar_v4'
with tempfile.TemporaryDirectory() as temp:
    build = Path(temp)
    subprocess.run(['bsdtar', '-xf', library/'src.7z', '-C', build], check=True)
    source, = build.glob('src/*/LIDARLite_v4LED.cpp')
    subprocess.run([os.getenv('CXX', 'c++'), '-std=c++14', '-fsanitize=undefined',
                    '-fno-sanitize-recover=undefined', '-I', here, '-I', source.parent,
                    here/'test.cpp', source, '-o', build/'test'], check=True)
    subprocess.run([build/'test'], check=True, timeout=5)
for file in [library/'block.json', *sorted((library/'i18n').glob('*.json'))]:
    blocks = json.loads(file.read_text())
    if isinstance(blocks, list):
        blocks = {b['type']: b for b in blocks}
    options = blocks['lidarv4_configure']['args0'][1]['options']
    assert [entry[1] for entry in options] == list('012345')
    assert len(set(entry[0] for entry in options)) == 6
    tooltip = blocks['lidarv4_get_distance']['tooltip']
    assert '−1' in tooltip and '−2' in tooltip
print('LIDAR-Lite packaged range, presets, bus errors, rollover, bounded waits and recovery passed.')
