#if defined(ARDUINO) && ARDUINO >= 100
#include "Arduino.h"
#else
#include "WProgram.h"
#endif
#include "DS1302.h"

#include <stdint.h>

namespace {

enum Register {
  kSecondReg       = 0,
  kMinuteReg       = 1,
  kHourReg         = 2,
  kDateReg         = 3,
  kMonthReg        = 4,
  kDayReg          = 5,
  kYearReg         = 6,
  kWriteProtectReg = 7,

  // The RAM register space follows the clock register space.
  kRamAddress0     = 32
};

enum Command {
  kClockBurstRead  = 0xBF,
  kClockBurstWrite = 0xBE,
  kRamBurstRead    = 0xFF,
  kRamBurstWrite   = 0xFE
};

// Establishes and terminates a three-wire SPI session.
class SPISession {
 public:
  SPISession(const int ce_pin, const int io_pin, const int sclk_pin)
      : ce_pin_(ce_pin), io_pin_(io_pin), sclk_pin_(sclk_pin) {
    digitalWrite(sclk_pin_, LOW);
    digitalWrite(ce_pin_, HIGH);
    delayMicroseconds(4);  // tCC
  }
  ~SPISession() {
    digitalWrite(ce_pin_, LOW);
    delayMicroseconds(4);  // tCWH
  }

 private:
  const int ce_pin_;
  const int io_pin_;
  const int sclk_pin_;
};

// Returns the decoded decimal value from a binary-coded decimal (BCD) byte.
// Assumes 'bcd' is coded with 4-bits per digit, with the tens place digit in
// the upper 4 MSBs.
uint8_t bcdToDec(const uint8_t bcd) {
  return (10 * ((bcd & 0xF0) >> 4) + (bcd & 0x0F));
}

// Returns the binary-coded decimal of 'dec'. Inverse of bcdToDec.
uint8_t decToBcd(const uint8_t dec) {
  const uint8_t tens = dec / 10;
  const uint8_t ones = dec % 10;
  return (tens << 4) | ones;
}

// Returns the hour in 24-hour format from the hour register value.
uint8_t hourFromRegisterValue(const uint8_t value) {
  uint8_t adj;
  if (value & 128)  // 12-hour mode
    adj = 12 * ((value & 32) >> 5);
  else           // 24-hour mode
    adj = 10 * ((value & (32 + 16)) >> 4);
  return (value & 15) + adj;
}

}  // namespace

Time::Time(const uint16_t yr, const uint8_t mon, const uint8_t date,
           const uint8_t hr, const uint8_t min, const uint8_t sec,
           const Day day) {
  this->yr   = yr;
  this->mon  = mon;
  this->date = date;
  this->hr   = hr;
  this->min  = min;
  this->sec  = sec;
  this->day  = day;
}

DS1302::DS1302(const uint8_t ce_pin, const uint8_t io_pin,
               const uint8_t sclk_pin) {
  ce_pin_ = ce_pin;
  io_pin_ = io_pin;
  sclk_pin_ = sclk_pin;

  digitalWrite(ce_pin, LOW);
  pinMode(ce_pin, OUTPUT);
  pinMode(io_pin, INPUT);
  digitalWrite(sclk_pin, LOW);
  pinMode(sclk_pin, OUTPUT);
}

void DS1302::writeOut(const uint8_t value, bool readAfter) {
  pinMode(io_pin_, OUTPUT);

  for (int i = 0; i < 8; ++i) {
    digitalWrite(io_pin_, (value >> i) & 1);
    delayMicroseconds(1);
    digitalWrite(sclk_pin_, HIGH);
    delayMicroseconds(1);

    if (readAfter && i == 7) {
      // We're about to read data -- ensure the pin is back in input mode
      // before the clock is lowered.
      pinMode(io_pin_, INPUT);
    } else {
      digitalWrite(sclk_pin_, LOW);
      delayMicroseconds(1);
    }
  }
}

uint8_t DS1302::readIn() {
  uint8_t input_value = 0;
  uint8_t bit = 0;
  pinMode(io_pin_, INPUT);

  // Bits from the DS1302 are output on the falling edge of the clock
  // cycle. This is called after readIn (which will leave the clock low) or
  // writeOut(..., true) (which will leave it high).
  for (int i = 0; i < 8; ++i) {
    digitalWrite(sclk_pin_, HIGH);
    delayMicroseconds(1);
    digitalWrite(sclk_pin_, LOW);
    delayMicroseconds(1);

    bit = digitalRead(io_pin_);
    input_value |= (bit << i);  // Bits are read LSB first.
  }

  return input_value;
}

uint8_t DS1302::readRegister(const uint8_t reg) {
  const SPISession s(ce_pin_, io_pin_, sclk_pin_);

  const uint8_t cmd_byte = (0x81 | (reg << 1));
  writeOut(cmd_byte, true);
  return readIn();
}

void DS1302::writeRegister(const uint8_t reg, const uint8_t value) {
  const SPISession s(ce_pin_, io_pin_, sclk_pin_);

  const uint8_t cmd_byte = (0x80 | (reg << 1));
  writeOut(cmd_byte);
  writeOut(value);
}

void DS1302::writeProtect(const bool enable) {
  writeRegister(kWriteProtectReg, (enable << 7));
}

void DS1302::halt(const bool enable) {
  uint8_t sec = readRegister(kSecondReg);
  sec &= ~(1 << 7);
  sec |= (enable << 7);
  writeRegister(kSecondReg, sec);
}

Time DS1302::time() {
  const SPISession s(ce_pin_, io_pin_, sclk_pin_);

  Time t(2099, 1, 1, 0, 0, 0, Time::kSunday);
  writeOut(kClockBurstRead, true);
  t.sec = bcdToDec(readIn() & 0x7F);
  t.min = bcdToDec(readIn());
  t.hr = hourFromRegisterValue(readIn());
  t.date = bcdToDec(readIn());
  t.mon = bcdToDec(readIn());
  t.day = static_cast<Time::Day>(bcdToDec(readIn()));
  t.yr = 2000 + bcdToDec(readIn());
  return t;
}

void DS1302::time(const Time t) {
  // We want to maintain the Clock Halt flag if it is set.
  const uint8_t ch_value = readRegister(kSecondReg) & 0x80;

  const SPISession s(ce_pin_, io_pin_, sclk_pin_);

  writeOut(kClockBurstWrite);
  writeOut(ch_value | decToBcd(t.sec));
  writeOut(decToBcd(t.min));
  writeOut(decToBcd(t.hr));
  writeOut(decToBcd(t.date));
  writeOut(decToBcd(t.mon));
  writeOut(decToBcd(static_cast<uint8_t>(t.day)));
  writeOut(decToBcd(t.yr - 2000));
  // All clock registers *and* the WP register have to be written for the time
  // to be set.
  writeOut(0);  // Write protection register.
}

void DS1302::writeRam(const uint8_t address, const uint8_t value) {
  if (address >= kRamSize) {
    return;
  }

  writeRegister(kRamAddress0 + address, value);
}

uint8_t DS1302::readRam(const uint8_t address) {
  if (address >= kRamSize) {
    return 0;
  }

  return readRegister(kRamAddress0 + address);
}

void DS1302::writeRamBulk(const uint8_t* const data, int len) {
  if (len <= 0) {
    return;
  }
  if (len > kRamSize) {
    len = kRamSize;
  }

  const SPISession s(ce_pin_, io_pin_, sclk_pin_);

  writeOut(kRamBurstWrite);
  for (int i = 0; i < len; ++i) {
    writeOut(data[i]);
  }
}

void DS1302::readRamBulk(uint8_t* const data, int len) {
  if (len <= 0) {
    return;
  }
  if (len > kRamSize) {
    len = kRamSize;
  }

  const SPISession s(ce_pin_, io_pin_, sclk_pin_);

  writeOut(kRamBurstRead, true);
  for (int i = 0; i < len; ++i) {
    data[i] = readIn();
  }
}
