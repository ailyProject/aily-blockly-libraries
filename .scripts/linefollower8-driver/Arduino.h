#pragma once
#include <cstdint>
#include <cstring>
#include <string>
using byte = uint8_t;
constexpr uint8_t SDA=8, SCL=9, A0=54, A7=61;
constexpr int BIN=2, HEX=16;
inline unsigned long nowMs=0;
inline unsigned long millis(){return nowMs;}
inline void delay(unsigned long ms){nowMs+=ms;}
class String : public std::string {
public:
  using std::string::string;
  String(const std::string &s):std::string(s){}
  String(int n):std::string(std::to_string(n)){}
};
struct Console {
  template<class... T> void print(T...){}
  template<class... T> void println(T...){}
  template<class... T> void printf(T...){}
};
inline Console Serial;
