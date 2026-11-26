#pragma once
#include <cstdint>

constexpr int INPUT = 0;
constexpr int HIGH = 1;
constexpr int LOW = 0;
unsigned long millis();
void delay(unsigned long ms);
void pinMode(int, int);
int digitalRead(int);
