from pathlib import Path
import subprocess,tempfile
here=Path(__file__).resolve().parent
with tempfile.TemporaryDirectory() as tmp:
    dest=Path(tmp)
    subprocess.run(['bsdtar','-xf',here.parents[1]/'seeed_mmwave/src.7z','-C',dest],check=True)
    src=dest/'src/mmwave_for_xiao'
    subprocess.run(['c++','-std=c++11','-Wall','-Wextra','-I',here,'-I',src,
        here/'test.cpp',src/'mmwave_for_xiao.cpp','-o',dest/'test'],check=True)
    subprocess.run([dest/'test'],check=True)
