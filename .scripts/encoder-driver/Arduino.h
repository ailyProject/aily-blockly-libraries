#pragma once
#include <cassert>
#include <cstdint>
#include <functional>

using pin_size_t = unsigned;
constexpr int CHANGE = 3, INPUT_PULLUP = 2;
extern unsigned irqMask, levels;
extern std::function<void()> handlers[16];
inline unsigned __get_PRIMASK() { return irqMask; }
inline void __set_PRIMASK(unsigned mask) { irqMask = mask; }
inline void __disable_irq() { irqMask = 1; }
inline bool digitalPinIsValid(unsigned pin) { return pin < 32; }
inline unsigned digitalPinToInterrupt(unsigned pin) { return pin; }
inline unsigned digitalPinToBitMask(unsigned pin) { return 1u << (pin % 16); }
inline void pinMode(unsigned pin, int mode) { assert(pin < 32 && mode == INPUT_PULLUP); }
inline int digitalRead(unsigned pin) { return (levels >> pin) & 1u; }
inline void attachInterrupt(unsigned pin, std::function<void()> cb, int mode) {
    assert(!handlers[pin % 16] && mode == CHANGE);
    handlers[pin % 16] = cb;
}
inline void detachInterrupt(unsigned pin) { assert(handlers[pin % 16]); handlers[pin % 16] = {}; }
