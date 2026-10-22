# 6x6 Tactile

DFRobot SEN0704 6x6 flexible tactile pressure array over UART.

## Library Info
- **Name**: @aily-project/lib-dfrobot-sen0704
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sen0704_init` | Statement | VAR(field_input), SERIAL(dropdown), RX(dropdown), TX(dropdown), ADDR(dropdown) | `sen0704_init("tactile", Serial1, 4, 5, 1)` | `while (tactile.begin(36) == -1) { ↵ delay(1000); ↵ } ↵ tactile.setSampleRate(eSampleRate20Hz);` |
| `sen0704_read` | Value | VAR(field_variable) | `sen0704_read($tactile)` | `((tactileData = tactile.getDatas()).result == 0)` |
| `sen0704_cell` | Value | VAR(field_variable), ROW(input_value), COL(input_value) | `sen0704_cell($tactile, math_number(0), math_number(0))` | `tactileData.adcval[0][0]` |
| `sen0704_set_thld` | Statement | VAR(field_variable), THLD(input_value) | `sen0704_set_thld($tactile, math_number(0))` | `tactile.setThld(0);` |
| `sen0704_set_rate` | Statement | VAR(field_variable), RATE(dropdown) | `sen0704_set_rate($tactile, eSampleRate20Hz)` | `tactile.setSampleRate(eSampleRate20Hz);` |
| `sen0704_info` | Value | VAR(field_variable), INFO(dropdown) | `sen0704_info($tactile, VID)` | `tactile.getDeviceInfo().VID` |
| `sen0704_restore` | Statement | VAR(field_variable) | `sen0704_restore($tactile)` | `tactile.restoreSensor();` |
| `sen0704_set_addr` | Statement | VAR(field_variable), ADDR(input_value) | `sen0704_set_addr($tactile, math_number(1))` | `tactile.setDevAddr(1);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SERIAL | Serial1, Serial2, Serial | sen0704_init |
| ADDR | 1, 2, 3 | sen0704_init |
| RATE | eSampleRate20Hz, eSampleRate50Hz | sen0704_set_rate |
| INFO | VID, PID, VER | sen0704_info |

## ABS Examples

### Basic Usage
```
arduino_setup()
    sen0704_init("tactile", Serial1, 4, 5, 1)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, sen0704_read($tactile))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `sen0704_init` creates a Blockly variable. Use `$varName` only for field_variable slots; input_value slots must use the explicit `variables_get($varName)` block.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(true/false)`, variables, or nested value blocks.
4. **Boards**: this version declares Arduino Mega 2560 and standard ESP32 compatible. UNO, Nano, and other board types are not declared compatible with the default Serial1 configuration. Mega uses the selected hardware UART's fixed pins; its RX/TX dropdowns do not remap that UART. The example's RX pin 4 and TX pin 5 apply to ESP32; select valid pins for your board. Advanced manual UNO/Nano use requires selecting Serial on D0/D1 and using it exclusively for the sensor without USB serial logging.
