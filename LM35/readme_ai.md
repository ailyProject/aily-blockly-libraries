# LM35 Temperature Sensor Library

The LM35 temperature sensor library achieves accurate measurement of ambient temperature through analog signal output. It supports continuous temperature acquisition, low-power operation, linear output, no calibration...

## Library Info
- **Name**: @aily-project/lib-lm35
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lm35_read` | Value | PIN(dropdown) | `lm35_read(PIN)` | `AilyLM35::readCelsius(PIN)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PIN | ${board.analogPins} | lm35_read |

## ABS Examples

### Basic Usage
```
arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, lm35_read(PIN))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

### Temperature and ADC wiring

Power the LM35 from 4–30 V, connect grounds and wire OUT to the ADC input. The basic positive-temperature circuit delivers 10 mV/°C. The supply voltage of the LM35 and the full-scale input voltage of the ADC are separate parameters.

Use `#include <AilyLM35.h>` in Coder. `AilyLM35::readCelsius(pin)` uses the startup ADC width on STM32 and ESP32 and assumes a nominal 3300 mV ADC full scale. Classic 5 V AVR uses 10 bits. For a different reference, resolution, or calibrated input span, use `AilyLM35::readCalibrated(pin, referenceMillivolts, maxCode)` or the corresponding Blockly block. For example, a 3.3 V 10-bit ADC uses 3300 and 1023. The library leaves board ADC configuration untouched. For physical ESP32 hardware, ADC attenuation and nonlinearity affect accuracy. With factory calibration available, calibrated pin millivolts divided by ten gives degrees Celsius.
