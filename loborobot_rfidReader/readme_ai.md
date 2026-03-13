# RFID读卡器(创乐博)

创乐博RFID射频卡模块支持库，通过软串口读取RFID标签ID，支持Arduino UNO、MEGA等开发板

## Library Info
- **Name**: @aily-project/lib-loborobot_rfidreader
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rfid_setup` | Statement | VAR(field_input), RX_PIN(dropdown), TX_PIN(dropdown), ENABLE_PIN(dropdown) | `rfid_setup("rfidReader", RX_PIN, TX_PIN, ENABLE_PIN)` | `` |
| `rfid_on_tag_read` | Statement | VAR(field_variable) | `rfid_on_tag_read($rfidReader)` | `` |
| `rfid_available` | Value | VAR(field_variable) | `rfid_available($rfidReader)` | (dynamic code) |
| `rfid_read_tag` | Value | VAR(field_variable) | `rfid_read_tag($rfidReader)` | (dynamic code) |
| `rfid_enable` | Statement | VAR(field_variable), STATE(dropdown) | `rfid_enable($rfidReader, LOW)` | `digitalWrite(` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | LOW, HIGH | 启用 / 禁用 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    rfid_setup("rfidReader", RX_PIN, TX_PIN, ENABLE_PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, rfid_available($rfidReader))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `rfid_setup("varName", ...)` creates variable `$varName`; reference with `$varName`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order
