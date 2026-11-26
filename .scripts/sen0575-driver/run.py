import argparse, pathlib, subprocess, tempfile, json, os
parser=argparse.ArgumentParser()
parser.add_argument('archive', nargs='?', type=pathlib.Path, default=pathlib.Path(__file__).resolve().parents[2]/'dfrobot_rainfall_sensor/src.7z')
parser.add_argument('--stock', action='store_true')
args=parser.parse_args()
root=pathlib.Path(__file__).resolve().parent
with tempfile.TemporaryDirectory(dir=os.environ.get('TMPDIR')) as t:
    out=pathlib.Path(t)
    subprocess.run(['bsdtar','-xf',args.archive,'-C',out],check=True)
    sensor=out/'src/DFRobot_RainfallSensor'
    rtu=out/'src/DFRobot_RTU'
    subprocess.run(['c++','-std=c++17','-DARDUINO=100','-I',root,'-I',sensor,'-I',rtu,
        root/'test.cpp',sensor/'DFRobot_RainfallSensor.cpp',rtu/'DFRobot_RTU.cpp','-o',out/'test'],check=True)
    results=subprocess.check_output([out/'test'],text=True).split()
missing,short,misreported,selector,stale,full=map(float,results)
if args.stock:
    assert missing==0 and short>100000 and misreported>100000 and selector==1 and stale==1 and full==0,results
else:
    assert missing>0 and short==-1 and misreported==-1 and selector==-1 and stale==0 and full>0,results
print(json.dumps(dict(stock=args.stock,missingCalibration=missing,shortPeriodMm=short,
    misreportedLengthMm=misreported,failedWindowSelectionMm=selector,staleReads=stale,truncatedCalibration=full)))
