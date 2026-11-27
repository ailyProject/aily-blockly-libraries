#pragma once
#include <cstdint>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <string>
using byte = uint8_t;
using std::size_t;
constexpr int HEX = 16;
class String : public std::string {
public:
    using std::string::string;
    String(const std::string &s) : std::string(s) {}
    explicit String(int n) : std::string(std::to_string(n)) {}
};
class Stream {
public:
    virtual ~Stream() = default;
    virtual int available() = 0;
    virtual int read() = 0;
    virtual size_t write(const byte*, size_t n) { return n; }
    template<typename... T> void print(const T &...) {}
    template<typename... T> void println(const T &...) {}
};
extern uint32_t fakeMillis;
inline unsigned long millis() { return fakeMillis; }
inline void delay(unsigned long ms) { fakeMillis += ms; }
