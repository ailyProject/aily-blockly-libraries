#include <DFRobot_C4002.h>
#include <cassert>
#include <cstdio>
#include <cstring>
#include <cmath>
#include <numeric>
#include <vector>

// These consecutive bytes use the manufacturer's Raspberry Pi field offsets,
// independently of the C++ ABI. Distances and speed are in cm and cm/s.
static std::vector<uint8_t> frame(uint8_t command, std::vector<uint8_t> data) {
  std::vector<uint8_t> bytes{0xfa,0xf5,0xaa,0xa5,uint8_t(data.size()+14),0,0,
    FRAME_TYPE_NOTIFICATION,command,eSucceed,uint8_t(data.size()+4),0};
  bytes.insert(bytes.end(),data.begin(),data.end());
  uint16_t sum=std::accumulate(bytes.begin(),bytes.end(),0u);
  bytes.push_back(uint8_t(sum)); bytes.push_back(uint8_t(sum>>8));
  return bytes;
}
static void enqueue(HardwareSerial& port, const std::vector<uint8_t>& bytes) {
  port.rx.insert(port.rx.end(),bytes.begin(),bytes.end());
}
int main(int argc, char** argv) {
  HardwareSerial port;
  DFRobot_C4002 radar(&port,115200,44,43);
  const std::vector<uint8_t> sample{2,123,0,5,0,0,1,2,1,123,0,17,0xea,0,0xd3,0xff,43,2};
  enqueue(port,frame(NOTE_RESULT_CMD,sample));
  auto first=radar.getNoteInfo();
  auto stationary=radar.getPresenceTargetInfo();
  auto moving=radar.getMotionTargetInfo();
  std::printf("state=%d, lux=%.1f, gates=%lu, countdown=%u, presence=%.2f/%u, motion=%.2f/%.2f/%u/%d\n",
    int(radar.getTargetState()),radar.getLightIntensity(),(unsigned long)radar.getPresenceGateIndex(),
    radar.getPresenceCountDown(),stationary.distance,stationary.energy,moving.distance,moving.speed,
    moving.energy,int(moving.direction));
  bool ok=first.noteType==eResult && radar.getTargetState()==eMotion
    && std::lround(radar.getLightIntensity()*10)==123 && radar.getPresenceGateIndex()==0x01000005
    && radar.getPresenceCountDown()==258 && std::lround(stationary.distance*100)==123
    && stationary.energy==17 && std::lround(moving.distance*100)==234
    && std::lround(moving.speed*100)==-45 && moving.energy==43 && moving.direction==eApproaching;
  if (argc==2 && !std::strcmp(argv[1],"baseline")) return ok?0:1;
  assert(ok);
  port.onWrite=[&](const uint8_t*,size_t) {
    // A report arriving during a command must not be consumed as its ACK.
    enqueue(port,frame(NOTE_ENVIRNMENT_CALIBRATION_CMD,{42,0}));
    auto ack=frame(CMD_SET_REPORT_PERIOD,{});
    ack[7]=FRAME_TYPE_WRITE_RESPOND;
    ack[ack.size()-2]-=FRAME_TYPE_NOTIFICATION-FRAME_TYPE_WRITE_RESPOND;
    enqueue(port,ack);
  };
  assert(radar.setReportPeriod(10));
  auto interleaved=radar.getNoteInfo();
  assert(interleaved.noteType==eCalibration && interleaved.calibCountdown==42);
  // A calibration notification, idle UART and bad checksum never erase the last target.
  enqueue(port,frame(NOTE_ENVIRNMENT_CALIBRATION_CMD,{2,1}));
  auto calibration=radar.getNoteInfo();
  assert(calibration.noteType==eCalibration && calibration.calibCountdown==258);
  assert(radar.getNoteInfo().noteType==eNoNote);
  auto damaged=frame(NOTE_RESULT_CMD,sample); damaged.back()^=1;
  enqueue(port,damaged); assert(radar.getNoteInfo().noteType==eNoNote);
  assert(std::lround(radar.getMotionTargetInfo().speed*100)==-45);
  enqueue(port,frame(NOTE_RESULT_CMD,std::vector<uint8_t>(18,0)));
  assert(radar.getNoteInfo().noteType==eResult && radar.getTargetState()==eNoTarget);
  assert(radar.getMotionTargetInfo().energy==0 && radar.getPresenceGateIndex()==0 && port.rx.empty());
}
