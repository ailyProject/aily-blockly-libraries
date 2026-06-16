# LIS3DHTR 加速度计库

LIS3DHTR 三轴数字加速度传感器 Blockly 驱动库，支持加速度、温度、ADC 和敲击检测

## Library Info
- **Name**: @aily-project/lib-seeed-lis3dhtr
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `lis3dhtr_init` | Statement | WIRE(dropdown), ADDRESS(dropdown) | `lis3dhtr_init(Wire1, LIS3DHTR_DEFAULT_ADDRESS)` | `accel_sensor.begin(Wire, 0x18);` |
| `lis3dhtr_init_simplified` | Statement | WIRE(dropdown), ADDRESS(dropdown), DATARATE(dropdown), RANGE(dropdown), HIGHRES(dropdown) | `lis3dhtr_init_simplified(Wire1, LIS3DHTR_DEFAULT_ADDRESS, LIS3DHTR_DATARATE_25HZ, LIS3DHTR_RANGE_2G, true)` | begin + setOutputDataRate + setFullScaleRange + setHighSolution |
| `lis3dhtr_set_datarate` | Statement | DATARATE(dropdown) | `lis3dhtr_set_datarate(LIS3DHTR_DATARATE_100HZ)` | `accel_sensor.setOutputDataRate(...);` |
| `lis3dhtr_set_full_scale_range` | Statement | RANGE(dropdown) | `lis3dhtr_set_full_scale_range(LIS3DHTR_RANGE_2G)` | `accel_sensor.setFullScaleRange(...);` |
| `lis3dhtr_set_resolution` | Statement | ENABLE(dropdown) | `lis3dhtr_set_resolution(true)` | `accel_sensor.setHighSolution(true);` |
| `lis3dhtr_set_power_mode` | Statement | MODE(dropdown) | `lis3dhtr_set_power_mode(POWER_MODE_NORMAL)` | `accel_sensor.setPowerMode(...);` |
| `lis3dhtr_get_acceleration` | Value | AXIS(dropdown) | `lis3dhtr_get_acceleration(X)` | `accel_sensor.getAccelerationX()` |
| `lis3dhtr_get_acceleration_x` | Value | (none) | `lis3dhtr_get_acceleration_x()` | `accel_sensor.getAccelerationX()` |
| `lis3dhtr_get_acceleration_y` | Value | (none) | `lis3dhtr_get_acceleration_y()` | `accel_sensor.getAccelerationY()` |
| `lis3dhtr_get_acceleration_z` | Value | (none) | `lis3dhtr_get_acceleration_z()` | `accel_sensor.getAccelerationZ()` |
| `lis3dhtr_get_acceleration_xyz` | Statement | X_VAR(field_variable), Y_VAR(field_variable), Z_VAR(field_variable) | `lis3dhtr_get_acceleration_xyz($x, $y, $z)` | `accel_sensor.getAcceleration(&x, &y, &z);` |
| `lis3dhtr_available` | Value | (none) | `lis3dhtr_available()` | `accel_sensor.available()` |
| `lis3dhtr_open_temp` | Statement | (none) | `lis3dhtr_open_temp()` | `accel_sensor.openTemp();` |
| `lis3dhtr_close_temp` | Statement | (none) | `lis3dhtr_close_temp()` | `accel_sensor.closeTemp();` |
| `lis3dhtr_get_temperature` | Value | (none) | `lis3dhtr_get_temperature()` | `accel_sensor.getTemperature()` |
| `lis3dhtr_read_adc` | Value | CHANNEL(dropdown) | `lis3dhtr_read_adc("1")` | `accel_sensor.readbitADC1()` |
| `lis3dhtr_is_connection` | Value | (none) | `lis3dhtr_is_connection()` | `accel_sensor.isConnection()` |
| `lis3dhtr_get_device_id` | Value | (none) | `lis3dhtr_get_device_id()` | `accel_sensor.getDeviceID()` |
| `lis3dhtr_reset` | Statement | (none) | `lis3dhtr_reset()` | `accel_sensor.reset();` |
| `lis3dhtr_on_tap` | Hat | CLICK_TYPE(dropdown), THRESHOLD(input_value), INT_PIN(dropdown), HANDLER(input_statement) | `lis3dhtr_on_tap("1", math_number(40), "2") @HANDLER: action()` | click() + attachInterrupt() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WIRE | Wire, Wire1 | I2C 总线选择（由开发板配置自动填充） |
| ADDRESS | 0x18, 0x19 | I2C 设备地址，0x18 为默认 |
| DATARATE | LIS3DHTR_DATARATE_POWERDOWN, LIS3DHTR_DATARATE_1HZ, LIS3DHTR_DATARATE_10HZ, LIS3DHTR_DATARATE_25HZ, LIS3DHTR_DATARATE_50HZ, LIS3DHTR_DATARATE_100HZ, LIS3DHTR_DATARATE_200HZ, LIS3DHTR_DATARATE_400HZ, LIS3DHTR_DATARATE_1_6KH, LIS3DHTR_DATARATE_5KHZ | 输出数据速率（一体化初始化默认 25Hz，wiki 推荐值） |
| RANGE | LIS3DHTR_RANGE_2G, LIS3DHTR_RANGE_4G, LIS3DHTR_RANGE_8G, LIS3DHTR_RANGE_16G | 加速度量程范围 |
| AXIS | X, Y, Z | 加速度轴选择 |
| CHANNEL | 1, 2, 3 | ADC 通道选择 |
| MODE | POWER_MODE_NORMAL, POWER_MODE_LOW | 电源模式 |
| CLICK_TYPE | 1, 2 | 1=单击, 2=双击 |
| HIGHRES | true, false | 高分辨率模式开关 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    lis3dhtr_init_simplified(Wire1, LIS3DHTR_DEFAULT_ADDRESS, LIS3DHTR_DATARATE_25HZ, LIS3DHTR_RANGE_2G, true)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_print(Serial, text("X: "))
    serial_println(Serial, lis3dhtr_get_acceleration_x())
    time_delay(math_number(500))
```

### Tap Detection
```
arduino_setup()
    lis3dhtr_init(Wire1, LIS3DHTR_DEFAULT_ADDRESS)

lis3dhtr_on_tap("1", math_number(40), "2")
    serial_println(Serial, text("Tapped!"))
```

### Three-Axis Reading
```
arduino_setup()
    lis3dhtr_init_simplified(Wire1, LIS3DHTR_DEFAULT_ADDRESS, LIS3DHTR_DATARATE_25HZ, LIS3DHTR_RANGE_2G, true)
    serial_begin(Serial, 9600)

arduino_loop()
    lis3dhtr_get_acceleration_xyz($x, $y, $z)
    serial_println(Serial, variables_get($x))
    time_delay(math_number(100))
```

## Notes

1. **Wio Terminal I2C 总线**: ⚠️ Wio Terminal 必须使用 **Wire1**（不是 Wire），因为 LIS3DHTR 传感器连接在 Wio Terminal 的专用 I2C 总线上
2. **Global object**: 所有块使用全局对象 `accel_sensor`（类型 `LIS3DHTR<TwoWire>`），无需手动创建
3. **I2C 去重**: 初始化块使用 `wire_${wire}_begin` key 确保 Wire.begin() 不重复
4. **敲击检测阈值**: 2G 量程建议 40-80，4G 建议 20-40，8G 建议 10-20，16G 建议 5-10
5. **温度传感器**: 读取温度前需先调用 `lis3dhtr_open_temp` 开启
6. **读取延迟**: wiki 建议在 loop 中添加 50ms 以上延迟，避免一次性读取大量数据
7. **默认速率**: 一体化初始化默认 25Hz（wiki 推荐），配合 50ms 延迟使用效果最佳
8. **Parameter order**: ABS parameters follow `block.json` args0 order
