"""Compile and exercise the LSM303AGR driver distributed to the editors."""
import os
from pathlib import Path
import subprocess
import tempfile

here = Path(__file__).resolve().parent
package = here.parents[1] / 'LSM303AGR'
with tempfile.TemporaryDirectory() as tmp:
    build = Path(tmp)
    subprocess.run(['bsdtar','-xf',package/'src.7z','-C',build],check=True)
    driver = build/'src/LSM303AGR'
    filter_dir = build/'src/MadgwickAHRS'
    includes = ['-I',here,'-I',driver,'-I',filter_dir]
    with (build/'generated-test.inc').open('wb') as out:
        subprocess.run([os.getenv('NODE','node'),here/'generate-test.cjs'],stdout=out,check=True)
    includes += ['-I',build]
    objects = []
    for kind in ('ACC','MAG'):
        obj = build/(kind+'.o')
        subprocess.run([os.getenv('CC','cc'),*includes,'-c',driver/f'LSM303AGR_{kind}_Driver.c','-o',obj],check=True)
        objects.append(obj)
    exe = build/'driver-test'
    subprocess.run([os.getenv('CXX','c++'),'-std=c++11',*includes,here/'test.cpp',
                    driver/'LSM303AGR_ACC_Sensor.cpp',driver/'LSM303AGR_MAG_Sensor.cpp',
                    filter_dir/'MadgwickAHRS.cpp',*objects,'-o',exe],check=True)
    subprocess.run([exe],check=True)
