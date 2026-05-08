# SparkFun I2C GPS

通过 I2C 接口读取 GPS NMEA 数据流，配合 TinyGPS++ 解析位置信息。

## Library Info
- **Name**: @aily-project/lib-sparkfun-i2c-gps
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `i2cgps_init` | Statement | VAR(field_input) | `i2cgps_init("gps")` | `I2CGPS gps; Wire.begin(); gps.begin();` |
| `i2cgps_check` | Statement | VAR(field_variable) | `i2cgps_check(variables_get($gps))` | `gps.check();` |
| `i2cgps_available` | Value→Number | VAR(field_variable) | `i2cgps_available(variables_get($gps))` | `gps.available()` |
| `i2cgps_read` | Value→Number | VAR(field_variable) | `i2cgps_read(variables_get($gps))` | `gps.read()` |

## ABS Examples

### 基本读取循环
```
arduino_setup()
    i2cgps_init("gps")
    serial_begin(Serial, 9600)

arduino_loop()
    i2cgps_check(variables_get($gps))
    controls_whileUntil(WHILE)
        @BOOL: logic_compare(i2cgps_available(variables_get($gps)), GT, math_number(0))
        serial_print(Serial, i2cgps_read(variables_get($gps)))
```

## Notes

1. **初始化**: 在 `arduino_setup()` 中调用 `i2cgps_init`
2. **数据流**: 每次调用 `i2cgps_read()` 返回一个字节（ASCII 字符），需组合成 NMEA 句子再解析
3. **check()**: 主动轮询新数据；`available()` 若为 0 时会自动调用 `check()`
