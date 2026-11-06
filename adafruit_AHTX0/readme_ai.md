# AHT temperature and humidity sensor

Applicable to AHT10, AHT20 temperature and humidity sensors

## Library Info
- **Name**: @aily-project/lib-adafruit-ahtx0
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ahtx0_begin` | Statement | (none) | `ahtx0_begin()` | `Adafruit_AHTX0 aht; ↵ Wire.begin(); ↵ if (!aht.begin()) { ↵ Serial.println("Could not find AHT sensor!"); ↵ while (1) delay(10); ↵ }` |
| `ahtx0_read` | Statement | (none) | `ahtx0_read()` | `aht.getEvent(&humidity, &temp);` |
| `ahtx0_get_temperature` | Value | (none) | `ahtx0_get_temperature()` | `temp.temperature` |
| `ahtx0_get_humidity` | Value | (none) | `ahtx0_get_humidity()` | `humidity.relative_humidity` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    ahtx0_begin()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, ahtx0_get_temperature())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **I2C pins**: `ahtx0_begin` starts `Wire` first, before `aht.begin()`: on ESP32 boards with the pins set in the aily I2C library or the board’s `i2cPins`, otherwise with `Wire.begin()`. Boards whose variant default pins differ from the real wiring (IBox S31: SDA=IO0, SCL=IO1, variant default 2/3) need this to find the sensor.
