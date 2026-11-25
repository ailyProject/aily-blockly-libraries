#include "bq27220.h"
#include <cassert>
#include <cmath>
#include <cstdio>

static unsigned long clockMs = 0;
void delay(unsigned long ms) { clockMs += ms; }
size_t TwoWire::write(uint8_t value) { return write(&value, 1); }
size_t TwoWire::write(const uint8_t *data, size_t count) {
  if (shortWrite) return 0;
  tx.insert(tx.end(), data, data + count);
  return count;
}
static uint8_t checksum(uint16_t word) {
  // The other 30 bytes are nonzero and represent neighboring parameters.
  return uint8_t(~(0x9f + 0x92 + (word >> 8) + (word & 255) + 0x5a));
}
uint8_t TwoWire::endTransmission(bool stop) {
  if (!connected || selected != 0x55 || tx.empty()) return 2;
  reg = tx.front();
  repeatedStart = !stop;
  if (tx.size() == 1) return 0;
  assert(stop && tx.size() == 3);
  const uint16_t word = tx[1] | uint16_t(tx[2] << 8);
  switch (reg) {
  case 0x00:
    if (word == 1) selectedMemory = false;
    else if (word == 0xffff && !refuseKeys) {
      if (pendingKey) access = 2;
      pendingKey = !pendingKey;
    } else if (word == 0x0090 && access == 2) { enterAt = clockMs + 2000; ++entries; }
    else if (word == 0x0092) { configured = false; enterAt = 0; ++exits; }
    break;
  case 0x3e:
    assert(configured && word == 0x929f);
    selectedMemory = true;
    staged = capacity;
    break;
  case 0x40:
    assert(configured && selectedMemory);
    staged = uint16_t(tx[1] << 8) | tx[2];
    break;
  case 0x60:
    assert(configured && tx[1] == checksum(staged) && tx[2] == 36);
    if (!discardCommit) capacity = staged;
    ++commits;
    break;
  default: assert(false && "unexpected write to a measurement register");
  }
  return 0;
}
uint8_t TwoWire::requestFrom(uint8_t address, uint8_t count) {
  assert(address == 0x55 && repeatedStart && count == 2);
  repeatedStart = false;
  if (enterAt && clockMs >= enterAt) { configured = true; enterAt = 0; }
  uint16_t value = 0;
  switch (reg) {
  case 0x06: value = 2982; break;
  case 0x08: value = 3970; break;
  case 0x0c: value = uint16_t(-140); break;
  case 0x14: value = 23; break;
  case 0x16: value = 40000; break;
  case 0x18: value = 0xffff; break;
  case 0x3a: value = access | (configured ? 0x400 : 0); break;
  case 0x3c: value = capacity; break;
  case 0x3e: value = selectedMemory ? 0x929f : 1; break;
  case 0x40: value = selectedMemory ? ((capacity >> 8) | uint16_t(capacity << 8))
                                    : (correctDevice ? 0x0220 : 0x0421); break;
  case 0x60: value = 0x2400 | checksum(capacity); break;
  }
  rx = {uint8_t(value), uint8_t(value >> 8)};
  return shortRead ? 1 : 2;
}
int TwoWire::read() {
  if (emptyFifo || rx.empty()) return -1;
  int byte = rx.front();
  rx.erase(rx.begin());
  return byte;
}
int main() {
  TwoWire wire;
  BQ27220 gauge;
  assert(gauge.getVoltage() == 0 && !gauge.lastOperationSucceeded());
  assert(!gauge.begin(nullptr, 0, 0));
  wire.correctDevice = false;
  assert(!gauge.begin(&wire, 0, 0));
  assert(gauge.getVoltage() == 0 && !gauge.lastOperationSucceeded());
  wire.correctDevice = true;
  assert(gauge.begin(&wire, 0x55, 400000) && wire.frequency == 400000);
  assert(gauge.getVoltage() == 3970 && gauge.getCurrent() == -140 && gauge.getAvgCurrent() == 23);
  assert(std::fabs(gauge.getTemperature() - 25.05f) < 0.01);
  assert(gauge.getTimeToEmpty() == 40000 && gauge.getTimeToFull() == -1);
  assert(gauge.getSoc() == 0 && gauge.lastOperationSucceeded());
  wire.shortWrite = true;
  assert(!gauge.getVoltage() && !gauge.lastOperationSucceeded());
  wire.shortWrite = false;
  wire.shortRead = true;
  assert(!gauge.getVoltage() && !gauge.lastOperationSucceeded());
  wire.shortRead = false;
  wire.emptyFifo = true;
  assert(!gauge.getVoltage() && !gauge.lastOperationSucceeded());
  wire.emptyFifo = false;
  wire.connected = false;
  assert(!gauge.getVoltage() && !gauge.lastOperationSucceeded());
  wire.connected = true;
  assert(gauge.getVoltage() == 3970 && gauge.lastOperationSucceeded());
  assert(!gauge.setDesignCapacityChecked(32768));
  assert(gauge.setDesignCapacityChecked(3000) && wire.entries == 0);
  wire.access = 6;
  assert(!gauge.setDesignCapacityChecked(1200) && wire.entries == 0);
  wire.access = 4;
  wire.refuseKeys = true;
  assert(!gauge.setDesignCapacityChecked(1200) && wire.entries == 0);
  wire.refuseKeys = false;
  wire.discardCommit = true;
  assert(!gauge.setDesignCapacityChecked(1200) && !wire.configured && wire.exits == 1);
  wire.discardCommit = false;
  gauge.setDesignCapacity(1200);
  assert(gauge.lastOperationSucceeded() && gauge.getDesignCapacity() == 1200 && wire.exits == 2);
  wire.configured = true;
  assert(gauge.setDesignCapacityChecked(1500) && wire.configured && wire.exits == 2);
  gauge.end();
  assert(!gauge.getVoltage() && !gauge.lastOperationSucceeded());
  std::puts("BQ27220 packaged Wire driver and profile 1 RAM protocol passed");
}
