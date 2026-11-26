"""Compile the shipped RFD77402 sources and check the six editor operations."""
import json
import os
from pathlib import Path
import subprocess
import tempfile

here = Path(__file__).resolve().parent
library = here.parents[1] / 'sparkfun_rfd77402'
rows = json.loads((library/'block.json').read_bytes())
types = {row['type'] for row in rows}
assert len(types) == 6 and types == {x['type'] for x in json.loads((library/'toolbox.json').read_bytes())['contents']}
for file in (library/'i18n').glob('*.json'):
    translations = json.loads(file.read_bytes())
    assert all(translations[key]['message0'].count('%1') == 1 and translations[key]['tooltip'] for key in types)
with tempfile.TemporaryDirectory() as path:
    tmp = Path(path)
    subprocess.run(['bsdtar','-xf',library/'src.7z','-C',tmp], check=True)
    driver, = tmp.glob('src/*/SparkFun_RFD77402_Arduino_Library.cpp')
    binary = tmp/'test'
    subprocess.run([os.environ.get('CXX','c++'),'-std=c++17','-DARDUINO=10819','-Werror=return-type',
                    '-I'+str(here/'include'),'-I'+str(driver.parent),driver,here/'test.cpp','-o',binary], check=True)
    subprocess.run([binary], check=True)
print('RFD77402 packaged samples, error propagation, recovery, calibration and six block definitions passed.')
