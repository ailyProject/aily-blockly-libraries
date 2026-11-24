# HM3301 PM2.5 sensor

HM3301 laser dust sensor, I2C communication, can detect PM1.0, PM2.5, PM10 particle concentration

## Library Info
- **Name**: @aily-project/lib-seeed-hm3301
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `hm3301_init` | Statement | (none); runtime variants: fixed-board-i2c-pins: (none); esp32-custom-i2c-pins: SDA_PIN(dropdown), SCL_PIN(dropdown) | `hm3301_init()` | `HM330X hm3301_sensor; ↵ uint8_t hm3301_buf[30]; ↵ uint16_t hm3301_read_value(uint8_t index) { ↵ if (hm3301_sensor.read_sensor_value(hm3301_buf, 29)) { ↵ return 0; ↵ } ↵ return (uint16_t)hm3301_buf[index * 2] << 8 &#124; hm3301_buf[index * 2 + 1]; ↵ } ↵ hm3301_sensor.init();` |
| `hm3301_read` | Value | TYPE(dropdown) | `hm3301_read(PM1_0_STD)` | `hm3301_read_value(2)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | PM1_0_STD, PM2_5_STD, PM10_STD, PM1_0_ATM, PM2_5_ATM, PM10_ATM | hm3301_read |

## ABS Examples

### Basic Usage
```
arduino_setup()
    hm3301_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, hm3301_read(PM1_0_STD))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **Runtime shape**: `hm3301_init` adds `SDA_PIN` and `SCL_PIN` only on boards that require custom ESP32 I2C pins; fixed-pin boards use `hm3301_init()`.

## Runtime Variant Examples

### Runtime Variant: hm3301_init/esp32-custom-i2c-pins
```abs
arduino_setup()
    hm3301_init(21, 22)
```

New ESP32 blocks default to the board Wire route. On XIAO ESP32-S3 the labels are D4 (SDA) and D5 (SCL). A read checks the 29-byte frame and checksum before returning a concentration. An unavailable or invalid frame yields zero.
