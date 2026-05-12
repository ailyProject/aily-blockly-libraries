# HM3301 PM2.5 sensor

HM3301 laser dust sensor, I2C communication, can detect PM1.0, PM2.5, PM10 particle concentration

## Library Info
- **Name**: @aily-project/lib-seeed-hm3301
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `hm3301_init` | Statement | (none) | `hm3301_init()` | Dynamic code |
| `hm3301_read` | Value | TYPE(dropdown) | `hm3301_read(PM1_0_STD)` | hm3301_read_value( |

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
3. **Dynamic fields**: `hm3301_init` may add fields at runtime through Blockly extensions.
