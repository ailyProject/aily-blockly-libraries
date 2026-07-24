# Adafruit VL53L7CX

Blocks for the ST VL53L7CX 8x8 multizone time-of-flight distance sensor.

## Library Info
- **Name**: @aily-project/lib-adafruit-vl53l7cx
- **Version**: 0.1.0
- **Author**: Adafruit
- **Source**: https://github.com/adafruit/Adafruit_VL53L7
- **License**: BSD-3-Clause

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `adafruit_vl53l7cx_init` | Statement | VAR(field_input), WIRE(field_dropdown), ADDR(field_dropdown) | `adafruit_vl53l7cx_init(VAR, WIRE, ADDR)` | Dynamic code |
| `adafruit_vl53l7cx_read` | Value | VAR(field_variable), DATA(field_dropdown), INDEX(input_value) | `adafruit_vl53l7cx_read(VAR, DATA, INDEX)` | Dynamic code |
| `adafruit_vl53l7cx_action` | Statement | VAR(field_variable), ACTION(field_dropdown) | `adafruit_vl53l7cx_action(VAR, ACTION)` | Dynamic code |
| `adafruit_vl53l7cx_set` | Statement | VAR(field_variable), SETTING(field_dropdown), VALUE(input_value) | `adafruit_vl53l7cx_set(VAR, SETTING, VALUE)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| adafruit_vl53l7cx_init.WIRE | board-provided options | Selects the generated API option. |
| adafruit_vl53l7cx_init.ADDR | 0x29 | Selects the generated API option. |
| adafruit_vl53l7cx_read.DATA | distance, targets, reflectance, status | Selects the generated API option. |
| adafruit_vl53l7cx_action.ACTION | start, stop | Selects the generated API option. |
| adafruit_vl53l7cx_set.SETTING | frequency, resolution | Selects the generated API option. |

## ABS Examples

### Basic Usage

```
arduino_setup()
    adafruit_vl53l7cx_init("vl53l7cx")
```

## Notes

1. The init block registers a typed Blockly variable and emits the required driver include and object declaration.
2. Input value sockets include numeric shadow blocks.
3. The package is marked untested until verified on physical hardware.
