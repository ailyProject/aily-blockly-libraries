#include "DFRobot_C4001.h"
#include <cassert>
#include <cmath>
#include <cstdio>

static bool near(float a, float b) { return std::fabs(a-b) < 0.0001f; }

static void i2cReports() {
  TwoWire first, second;
  DFRobot_C4001_I2C radar(&first,DEVICE_ADDR_1), peer(&second);
  assert(radar.begin() && first.address==0x2b);
  const std::deque<uint8_t> frame={1,123,0,211,255,0x34,0x12};
  first.rx=frame;
  assert(radar.getTargetNumber()==1 && near(radar.getTargetRange(),1.23f));
  assert(near(radar.getTargetSpeed(),-0.45f) && radar.getTargetEnergy()==4660);
  assert(!first.lastStop && first.requested==7 && first.tx.at(0)==0x10);
  for (size_t n=0; n<7; ++n) {
    first.rx={frame.begin(),frame.begin()+n};
    assert(radar.getTargetNumber()==0 && radar.getTargetEnergy()==0);
    assert(radar.getTargetRange()==0 && radar.getTargetSpeed()==0);
    first.rx=frame;
    assert(radar.getTargetNumber()==1 && radar.getTargetEnergy()==4660);
  }
  first.rx={100}; assert(radar.getMaxRange()==0);
  first.error=2;
  assert(!radar.setTrigSensitivity(5) && !radar.setSensorMode(eExitMode));
  assert(!radar.begin() && !radar.getTargetNumber());
  first.error=0; first.rx=frame; second.rx=frame;
  assert(radar.begin() && radar.getTargetNumber()==1 && peer.getTargetNumber()==1);
  for (unsigned i=0;i<11;++i) {
    first.rx={0,0,0,0,0,0,0}; assert(radar.getTargetNumber()==1);
    second.rx=frame; assert(peer.getTargetNumber()==1);
  }
  first.rx={0,0,0,0,0,0,0}; assert(radar.getTargetNumber()==0 && !radar.getTargetEnergy());
  assert(peer.getTargetEnergy()==4660);
}
static void uartReports() {
  HardwareSerial serial; DFRobot_C4001_UART radar(&serial,9600,9,10);
  assert(radar.begin() && serial.baud==9600 && serial.rxPin==9 && serial.txPin==10);
  serial.offer("$DFHPD,1,,, *\r\n"); assert(radar.motionDetection());
  serial.offer("$DFHPD,0,,, *\r\n"); assert(!radar.motionDetection());
  serial.offer("$DFDMD,1,1,1.");
  assert(radar.getTargetNumber()==0);
  serial.offer("817,-0.129,15304, , *\r\n");
  assert(radar.getTargetNumber()==1 && near(radar.getTargetRange(),1.817f));
  assert(near(radar.getTargetSpeed(),-0.129f) && radar.getTargetEnergy()==15304);
  serial.offer("$DFDMD,0, , , , , , *"); assert(!radar.getTargetNumber());
}
static void uartRecovery() {
  HardwareSerial serial; DFRobot_C4001_UART radar(&serial,9600,9,10);
  assert(radar.begin());
  uint32_t t=ticks;
  assert(!radar.getStatus().initStatus && ticks-t<=3600);
  const unsigned statusWait=ticks-t;
  t=ticks;
  assert(radar.getTrigSensitivity()==0 && ticks-t<=2300);
  const unsigned queryWait=ticks-t;
  assert(!radar.setSensorMode(eSpeedMode) && !radar.setTrigSensitivity(3));
  for (const auto& cmd: serial.commands) assert(cmd=="sensorStart" || cmd=="sensorStop");
  serial.reply=[](const std::string& cmd)->std::string {
    if (cmd=="sensorStart") return "$DFDMD,1,1,1.23,-0.45,4660, , *\r\n";
    if (cmd=="sensorStop") return "DFRobot:/> sensorStop\r\nDone\r\n";
    if (cmd=="getSensitivity") return "Response 7 5\r\nDone\r\n";
    if (cmd=="getPwm") return "Response 80 25 10\r\nDone\r\n";
    return "Done\r\n";
  };
  assert(radar.getStatus().initStatus);
  assert(radar.getKeepSensitivity()==7 && radar.getTrigSensitivity()==5);
  const auto pwm=radar.getPwm();
  assert(pwm.pwm1==80 && pwm.pwm2==25 && pwm.timer==10);
  assert(radar.setTrigSensitivity(3) && radar.setSensorMode(eSpeedMode));
  assert(radar.getTargetNumber()==1 && radar.getTargetEnergy()==4660);
  std::printf("Silent UART status %u ms, parameter query %u ms on fixture clock. Recovery succeeded.\n",statusWait,queryWait);
}
int main() {
  i2cReports(); uartReports(); uartRecovery();
  std::puts("PASS short reads 0..6/7, NACK, signed complete report, two independent caches, partial UART report, CRLF framing, configuration, silence and recovery.");
}
