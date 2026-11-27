#pragma once
#include <cstdint>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <string>

using std::size_t;
inline uint32_t ticks = 0;
struct ProbeDeadline {};
inline uint32_t guardAt = 0;
inline uint32_t millis() { return ticks++; }
inline void delay(uint32_t ms) { ticks += ms; if(guardAt && ticks >= guardAt) throw ProbeDeadline{}; }
class String {
  std::string value;
public:
  String(const char* text = "") : value(text) {}
  String(double n, int precision) {
    char text[64]; std::snprintf(text, sizeof text, "%.*f", precision, n); value = text;
  }
  char& operator[](size_t index) { return value.at(index); }
  const char* c_str() const { return value.c_str(); }
  size_t length() const { return value.size(); }
  String& operator+=(const String& text) { value += text.value; return *this; }
  String& operator+=(int n) { value += std::to_string(n); return *this; }
};
#define SERIAL_8N1 0x800001c
