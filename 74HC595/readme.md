# Shift register driver library

Shift register 74HC595 control library, supports Arduino UNO, MEGA, ESP8266, ESP32 and other development boards

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-shiftregister |
| Version | 1.0.1 |
| Author | Simsso |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Shift register 74HC595 control library, supports Arduino UNO, MEGA, ESP8266, ESP32 and other development boards

## Coder initialization

Declare a register at file scope and initialize its pins in Arduino setup. For example:

```cpp
ShiftRegister74HC595<2> outputs;

void setup() {
  outputs.begin(dataPin, clockPin, latchPin);
}
```

Each call to `begin` configures the three pins and latches zeros into both registers. The original three-pin constructor still initializes immediately. Blockly initializes the same named object at the start of setup.

## Quick Start

1. Enable `@aily-project/lib-shiftregister` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.
