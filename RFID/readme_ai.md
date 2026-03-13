# MFRC522 RFID

MFRC522 RFID读写器库，支持I2C通信协议，可读取和写入RFID卡片

## Library Info
- **Name**: @aily-project/lib-mfrc522
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `mfrc522_setup` | Statement | VAR(field_input), ADDRESS(field_number) | `mfrc522_setup("rfid", 0x2F)` | `` |
| `mfrc522_is_new_card_present` | Value | VAR(field_variable) | `mfrc522_is_new_card_present($rfid)` | (dynamic code) |
| `mfrc522_read_card_serial` | Value | VAR(field_variable) | `mfrc522_read_card_serial($rfid)` | (dynamic code) |
| `mfrc522_read_uid` | Value | VAR(field_variable) | `mfrc522_read_uid($rfid)` | (dynamic code) |
| `mfrc522_when_card_detected` | Statement | VAR(field_variable) | `mfrc522_when_card_detected($rfid)` | `` |
| `mfrc522_authenticate` | Statement | VAR(field_variable), SECTOR(input_value), KEY_TYPE(dropdown), KEY(input_value) | `mfrc522_authenticate($rfid, math_number(0), A, math_number(0))` | (dynamic code) |
| `mfrc522_read_block` | Statement | VAR(field_variable), BLOCK(input_value), BUFFER(field_variable) | `mfrc522_read_block($rfid, math_number(0), $data)` | (dynamic code) |
| `mfrc522_write_block` | Statement | VAR(field_variable), DATA(input_value), BLOCK(input_value) | `mfrc522_write_block($rfid, math_number(0), math_number(0))` | (dynamic code) |
| `mfrc522_halt_card` | Statement | VAR(field_variable) | `mfrc522_halt_card($rfid)` | (dynamic code) |
| `mfrc522_get_data_string` | Value | BUFFER(field_variable) | `mfrc522_get_data_string($data)` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| KEY_TYPE | A, B | A密钥 / B密钥 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    mfrc522_setup("rfid", 0x2F)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, mfrc522_is_new_card_present($rfid))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `mfrc522_setup("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order
