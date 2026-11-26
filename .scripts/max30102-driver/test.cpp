#include <cassert>
#include <cmath>
#include <cstdio>
#include "generated.h"

TwoWire Wire;
static uint32_t nowMs = 0;
static int waveformSample = -1;
unsigned long millis() { return nowMs; }
void delay(unsigned long ms) { nowMs += ms; }
void pinMode(int, int) {}
int digitalRead(int) {
  if (waveformSample < 0) return HIGH;
  const double phase = 2 * 3.141592653589793 * (waveformSample++ % 20) / 20.0;
  Wire.sample(uint32_t(60000 + 900*std::sin(phase)), uint32_t(80000 + 1800*std::sin(phase)));
  delay(40);
  return LOW;
}
int main() {
  Wire.present = false;
  uint8_t byte = 71;
  assert(!ailyMax30102Begin(5,6,7) && !maxim_max30102_read_reg(255,&byte) && byte == 71);
  assert(!maxim_max30102_write_reg(9,64) && !Wire.configWrites);
  Wire.present = true; Wire.id = 0x24;
  assert(!maxim_max30102_init() && !ailyMax30102Begin(5,6,7));
  block_max30102_reset(); block_max30102_set_led_amplitude(); block_max30102_config_spo2();
  assert(!Wire.configWrites);
  Wire.id = 0x15; Wire.failWrite = true;
  assert(!maxim_max30102_read_reg(255,&byte) && !maxim_max30102_write_reg(9,64));
  Wire.failWrite = false; Wire.resetStuck = true;
  assert(!ailyMax30102Begin(5,6,7));
  Wire.resetStuck = false; assert(ailyMax30102Begin(5,6,7));
  unsigned writes = Wire.configWrites; Wire.failRegister = 0x0a;
  assert(!setSPO2ADCRange(ADC_RANGE_4096) && writes == Wire.configWrites);
  Wire.failRegister = -1;
  uint32_t red = 17, ir = 18;
  assert(!maxim_max30102_read_fifo(&red,&ir));
  for (int cut = 0; cut < 6; ++cut) {
    Wire.sample(0x12345,0x321ab); Wire.shortAt = cut;
    red = 17; ir = 18;
    const auto rd = Wire.regs[6];
    assert(!maxim_max30102_read_fifo(&red,&ir) && red == 17 && ir == 18 && Wire.regs[6] == rd);
    assert(maxim_max30102_read_fifo(&red,&ir) && red == 0x12345 && ir == 0x321ab);
  }
  Wire.sample(10,20); Wire.readFault = 3;
  assert(!maxim_max30102_read_fifo(&red,&ir) && red == 0x12345 && ir == 0x321ab);
  assert(maxim_max30102_read_fifo(&red,&ir) && red == 10 && ir == 20);
  for (int i=0;i<32;++i) Wire.sample(i+100,i+200);
  Wire.regs[5]=3; Wire.shortAt=1;
  assert(!maxim_max30102_read_fifo(&red,&ir) && Wire.regs[5]==0);
  for (unsigned i=0;i<32;++i) assert(maxim_max30102_read_fifo(&red,&ir) && red==i+100 && ir==i+200);
  assert(!maxim_max30102_read_fifo(&red,&ir));
  Wire.sample(42,84); Wire.shortAt=2; Wire.failRewind=true;
  assert(!maxim_max30102_read_fifo(&red,&ir));
  Wire.failRewind=false; assert(!maxim_max30102_read_fifo(&red,&ir));
  assert(ailyMax30102Begin(5,6,7));
  int8_t degree = 37; uint8_t fraction = 1;
  Wire.regs[0x1f] = 0xfc; Wire.regs[0x20] = 0x0c; Wire.tempStuck = true;
  const uint32_t start = nowMs;
  assert(!maxim_max30102_read_temperature(&degree,&fraction) && degree == 37 && fraction == 1 && nowMs-start >= 100);
  Wire.tempStuck = false; Wire.failRegister=0x20;
  assert(!maxim_max30102_read_temperature(&degree,&fraction) && degree==37 && fraction==1);
  Wire.failRegister=-1;
  assert(maxim_max30102_read_temperature(&degree,&fraction) && degree == -4 && fraction == 12);
  waveformSample=0; assert(ailyMax30102Measure(5000));
  assert(_ailyMax30102HeartRate == 75 && _ailyMax30102SpO2Valid && _ailyMax30102HeartRateValid);
  waveformSample=-1; assert(!ailyMax30102Measure(5));
  assert(!_ailyMax30102SpO2Valid && !_ailyMax30102HeartRateValid);
  block_max30102_reset(); assert(!_ailyMax30102Initialized && !_ailyMax30102LastOK);
  assert(ailyMax30102Begin(5,6,7));
  std::puts("MAX30102 archive and generated helpers passed identity, FIFO faults, temperature and deterministic waveform.");
}
