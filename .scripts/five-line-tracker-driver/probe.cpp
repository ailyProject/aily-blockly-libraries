#include <cassert>
#include <cstdio>
#include "five_line_tracker_v3.h"

TwoWire Wire;
int main() {
  using Tracker = emakefun::FiveLineTracker;
  Tracker tracker;
  assert(tracker.Initialize() == Tracker::kOK && Wire.address == 0x50);
  uint16_t batch[5] = {0,1,255,256,1023};
  tracker.HighThresholds(batch);
  assert((Wire.tx == std::vector<uint8_t>{0x1c,0,0,1,0,255,0,0,1,255,3}));
  for (uint8_t channel = 0; channel < 5; ++channel) {
    tracker.LowThreshold(channel, 0x0123);
    assert((Wire.tx == std::vector<uint8_t>{uint8_t(0x26+2*channel),0x23,1}));
    Wire.rx = {0x56,0x03};
    assert(tracker.AnalogValue(channel) == 0x356 && tracker.LastError() == Tracker::kOK);
    assert(Wire.tx[0] == 0x10+2*channel);
  }
  const auto before = Wire.selections;
  tracker.HighThreshold(5, 123); tracker.LowThreshold(255,123);
  assert(tracker.AnalogValue(5)==0 && tracker.DigitalValue(255)==0);
  assert(tracker.LastError()==Tracker::kInvalidParameter && Wire.selections==before);
  Wire.rx = {0x34}; // Incomplete word
  assert(tracker.AnalogValue(0)==0 && tracker.LastError()==Tracker::kI2cOtherError);
  for (int count=0; count<10; ++count) {
    Wire.rx.assign(count, 0x99);
    tracker.AnalogValues(batch);
    assert(tracker.LastError()==Tracker::kI2cOtherError && batch[0]==0 && batch[1]==1 && batch[2]==255 && batch[3]==256 && batch[4]==1023);
  }
  Wire.rx = {1,0,2,0,3,0,4,0,5,0};
  Wire.failAt = 8; tracker.AnalogValues(batch);
  assert(batch[4]==1023 && tracker.LastError()==Tracker::kI2cOtherError);
  Wire.failAt = -1; tracker.AnalogValues(batch);
  for (unsigned i=0;i<5;++i) assert(batch[i]==i+1);
  Wire.rx = {0,0}; assert(tracker.AnalogValue(0)==0 && tracker.LastError()==Tracker::kOK);
  Wire.status=2;
  const auto requests=Wire.requests;
  assert(tracker.AnalogValue(0)==0 && tracker.LastError()==Tracker::kI2cReceivedNackOnTransmitOfAddress && Wire.requests==requests);
  tracker.HighThresholds(batch); assert(tracker.LastError()==Tracker::kI2cReceivedNackOnTransmitOfAddress);
  Wire.status=0; Wire.capacity=2; tracker.LowThresholds(batch);
  assert(tracker.LastError()==Tracker::kI2cDataTooLongToFitInTransmitBuffer);
  Wire.capacity=32;Wire.rx={0x15};
  assert(tracker.DigitalValues()==0x15 && tracker.DigitalValue(2)==1 && tracker.DigitalValue(1)==0);
  assert(tracker.DeviceId()==0x15 && tracker.FirmwareVersion()==0x15 && tracker.LastError()==Tracker::kOK);
  tracker.AnalogValues(nullptr); assert(tracker.LastError()==Tracker::kInvalidParameter);
  std::puts("Packaged five-line tracker driver checks passed");
}
