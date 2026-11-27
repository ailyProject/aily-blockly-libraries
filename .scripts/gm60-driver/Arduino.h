#pragma once
#include <cstdint>
#include <cstdlib>
#include <string>
using std::size_t;
class String : public std::string {
public:
    using std::string::string;
    bool reserve(size_t n) { std::string::reserve(n); return true; }
};
inline unsigned long virtualMs;
inline void delay(unsigned long ms) { virtualMs += ms; }
inline unsigned long millis() { return virtualMs; }
class Stream {
public:
    virtual int available() = 0;
    virtual int read() = 0;
    virtual size_t write(uint8_t value) = 0;
};
