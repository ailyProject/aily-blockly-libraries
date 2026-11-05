#pragma once
#include <Arduino.h>
class SoftwareSerial : public Stream {
public:
  void begin(uint32_t) {}
};
