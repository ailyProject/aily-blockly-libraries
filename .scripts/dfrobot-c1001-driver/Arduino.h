#pragma once
#include <cstddef>
#include <cstdint>
#include <cstring>
unsigned long millis();
void delay(unsigned long ms);
class Stream {
public:
    virtual int available() = 0;
    virtual int read() = 0;
    virtual size_t write(const uint8_t *bytes, size_t count) = 0;
    virtual ~Stream() = default;
};
