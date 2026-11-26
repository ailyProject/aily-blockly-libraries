"""Exercise the 15 Blockly generators against the driver shipped in the package."""
import os
from pathlib import Path
import subprocess
import tempfile

here = Path(__file__).resolve().parent
archive = here.parents[1] / 'MMA8653/src.7z'
with tempfile.TemporaryDirectory() as temporary:
    root = Path(temporary)
    subprocess.run(['bsdtar', '-xf', archive, '-C', root], check=True)
    with (root / 'generated.inc').open('wb') as out:
        subprocess.run([os.getenv('NODE','node'), here/'generate-test.cjs'], stdout=out, check=True)
    driver = root/'src'
    subprocess.run([os.getenv('CXX','c++'), '-std=c++14','-fsanitize=undefined','-fno-sanitize-recover=undefined',
                    '-I', here, '-I', root, '-I', driver, here/'test.cpp', driver/'MMA8653.cpp', '-o', root/'test'], check=True)
    subprocess.run([root/'test'], check=True)
print('MMA8653 packaged driver and all fifteen Blockly generators passed')
