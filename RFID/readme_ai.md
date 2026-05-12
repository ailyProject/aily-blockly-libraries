# MFRC522 RFID

MFRC522 RFID reader/writer library supports I2C communication protocol and can read and write RFID cards

## Library Info
- **Name**: @aily-project/lib-mfrc522
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mfrc522_setup` | Statement | VAR(field_input), ADDRESS(field_number) | `mfrc522_setup("rfid", 0x2F)` | Dynamic code |
| `mfrc522_is_new_card_present` | Value | VAR(field_variable) | `mfrc522_is_new_card_present(variables_get($rfid))` | Dynamic code |
| `mfrc522_read_card_serial` | Value | VAR(field_variable) | `mfrc522_read_card_serial(variables_get($rfid))` | Dynamic code |
| `mfrc522_read_uid` | Value | VAR(field_variable) | `mfrc522_read_uid(variables_get($rfid))` | Dynamic code |
| `mfrc522_when_card_detected` | Hat | VAR(field_variable), HANDLER(input_statement) | `mfrc522_when_card_detected(variables_get($rfid)) @HANDLER: child_block()` | if ( |
| `mfrc522_authenticate` | Statement | VAR(field_variable), SECTOR(input_value), KEY_TYPE(dropdown), KEY(input_value) | `mfrc522_authenticate(variables_get($rfid), math_number(0), A, text("value"))` | Dynamic code |
| `mfrc522_read_block` | Statement | VAR(field_variable), BLOCK(input_value), BUFFER(field_variable) | `mfrc522_read_block(variables_get($rfid), math_number(0), variables_get($data))` | Dynamic code |
| `mfrc522_write_block` | Statement | VAR(field_variable), DATA(input_value), BLOCK(input_value) | `mfrc522_write_block(variables_get($rfid), text("value"), math_number(0))` | Dynamic code |
| `mfrc522_halt_card` | Statement | VAR(field_variable) | `mfrc522_halt_card(variables_get($rfid))` | Dynamic code |
| `mfrc522_get_data_string` | Value | BUFFER(field_variable) | `mfrc522_get_data_string(variables_get($data))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| KEY_TYPE | A, B | mfrc522_authenticate |

## ABS Examples

### Basic Usage
```
arduino_setup()
    mfrc522_setup("rfid", 0x2F)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, mfrc522_is_new_card_present(variables_get($rfid)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `mfrc522_setup("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Dynamic fields**: `mfrc522_setup` may add fields at runtime through Blockly extensions.
