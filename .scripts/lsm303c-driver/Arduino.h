#pragma once
#include <cmath>
#include <cstddef>
#include <cstdint>
#define HEX 16
struct SerialConsole {
  template <typename... T> void print(T...) {}
  template <typename... T> void println(T...) {}
};
extern SerialConsole Serial;
