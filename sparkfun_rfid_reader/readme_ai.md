# SparkFun Simultaneous UHF RFID Reader

Blockly wrapper for the SparkFun Simultaneous UHF RFID Tag Reader.

## Library Info
- **Name**: @aily-project/lib-sparkfun-rfid-reader
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rfid_reader_init` | Statement | VAR(field_input), PORT(dropdown) | `rfid_reader_init("rfid", Serial1)` | Dynamic code |
| `rfid_reader_start` | Statement | VAR(field_variable) | `rfid_reader_start(variables_get($rfid))` | Dynamic code |
| `rfid_reader_stop` | Statement | VAR(field_variable) | `rfid_reader_stop(variables_get($rfid))` | Dynamic code |
| `rfid_reader_check_tag` | Value | VAR(field_variable) | `rfid_reader_check_tag(variables_get($rfid))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PORT | Serial1, Serial2, Serial3 | rfid_reader_init |

## ABS Examples

### Basic Usage
```
arduino_setup()
    rfid_reader_init("rfid", Serial1)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, rfid_reader_check_tag(variables_get($rfid)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `rfid_reader_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
