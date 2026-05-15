# RFID card reader (Chuanglebo)

Chuanglebo RFID radio frequency card module support library reads RFID tag ID through the soft serial port and supports Arduino UNO, MEGA and other development boards.

## Library Info
- **Name**: @aily-project/lib-loborobot-rfidreader
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rfid_setup` | Statement | VAR(field_input), RX_PIN(dropdown), TX_PIN(dropdown), ENABLE_PIN(dropdown) | `rfid_setup("rfidReader", RX_PIN, TX_PIN, ENABLE_PIN)` | Dynamic code |
| `rfid_on_tag_read` | Hat | VAR(field_variable), TAG_VAR(field_variable), HANDLER(input_statement) | `rfid_on_tag_read(variables_get($rfidReader), variables_get($tagID)) @HANDLER: child_block()` | Dynamic code |
| `rfid_available` | Value | VAR(field_variable) | `rfid_available(variables_get($rfidReader))` | Dynamic code |
| `rfid_read_tag` | Value | VAR(field_variable) | `rfid_read_tag(variables_get($rfidReader))` | Dynamic code |
| `rfid_enable` | Statement | VAR(field_variable), STATE(dropdown) | `rfid_enable(variables_get($rfidReader), LOW)` | digitalWrite( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | LOW, HIGH | rfid_enable |

## ABS Examples

### Basic Usage
```
arduino_setup()
    rfid_setup("rfidReader", RX_PIN, TX_PIN, ENABLE_PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, rfid_available(variables_get($rfidReader)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `rfid_setup("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
