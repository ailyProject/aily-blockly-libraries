# TF-UW500 LiDAR

SEN0755 TF-UW500 underwater single-point LiDAR over UART/I2C, distance in mm, peak, temperature and confidence.

## Library Info
- **Name**: @aily-project/lib-dfrobot-sen0755
- **Version**: 0.1.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sen0755_init_uart` | Statement | VAR(field_input), SERIAL(dropdown), RX(dropdown), TX(dropdown) | `sen0755_init_uart("lidar", Serial1, 4, 5)` | `lidar.begin();` |
| `sen0755_init_i2c` | Statement | VAR(field_input), WIRE(dropdown), ADDRESS(dropdown) | `sen0755_init_i2c("lidar", Wire, "0x10")` | `lidar.begin();` |
| `sen0755_read` | Value | VAR(field_variable) | `sen0755_read($lidar)` | `lidar.readFrame()` |
| `sen0755_get_data` | Value | VAR(field_variable), DATA(dropdown) | `sen0755_get_data($lidar, DIST)` | `lidar.getDistanceMm()` |
| `sen0755_valid` | Value | VAR(field_variable) | `sen0755_valid($lidar)` | `lidar.isValid()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SERIAL | Serial1, Serial2, Serial | sen0755_init_uart |
| ADDRESS | 0x10 | sen0755_init_i2c |
| DATA | DIST, PEAK, TEMP, CONF | sen0755_get_data |

## ABS Examples

### Basic Usage
```
arduino_setup()
    sen0755_init_uart("lidar", Serial1, 4, 5)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, sen0755_read($lidar))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `sen0755_init_uart` creates a Blockly variable. Use `$varName` only for field_variable slots; input_value slots must use the explicit `variables_get($varName)` block.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(true/false)`, variables, or nested value blocks.
4. **Boards**: this version declares Arduino UNO and standard ESP32 compatible. Nano, Mega, ESP8266, and other board types are not declared compatible. The example uses RX pin 4 and TX pin 5; select valid pins for your board. UNO uses these SoftwareSerial pins; ESP32 uses the selected RX/TX pins. For I2C, configure the sensor for I2C communication and select the board's valid Wire bus.
5. **Confidence**: the confidence getter reads the UART frame's confidence value. I2C mode returns 0 for this getter because the I2C register map does not provide confidence.
