from pathlib import Path
import subprocess,tempfile
root=Path(__file__).resolve().parent
with tempfile.TemporaryDirectory() as tmp:
    tmp=Path(tmp)
    subprocess.run(['bsdtar','-xf',root.parents[1]/'seeed_dopplerradar/src.7z','-C',tmp],check=True)
    driver=tmp/'src/Seeed_Arduino_DopplerRadar'
    subprocess.run(['c++','-std=c++11','-Wall','-Wextra','-Werror','-I',root,'-I',driver,root/'test.cpp',driver/'BGT24LTR11.cpp','-o',tmp/'test'],check=True)
    subprocess.run([tmp/'test'],check=True)
