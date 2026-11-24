# SparkFun Soil Moisture Sensor

Blockly wrapper for the SparkFun I2C soil moisture sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-soil-moisture
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `soil_moisture_init` | Statement | VAR(field_input) | `soil_moisture_init("soilSensor")` | `Wire.begin(); ↵ soilSensor.begin();` |
| `soil_moisture_read_value` | Value | VAR(field_variable) | `soil_moisture_read_value($soilSensor)` | `soilSensor.readMoistureValue()` |
| `soil_moisture_read_percentage` | Value | VAR(field_variable) | `soil_moisture_read_percentage($soilSensor)` | `soilSensor.readMoisturePercentage()` |
| `soil_moisture_led` | Statement | VAR(field_variable), STATE(dropdown) | `soil_moisture_led($soilSensor, ON)` | `soilSensor.LEDOn();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | ON, OFF | soil_moisture_led |

## ABS Examples

### Basic Usage
```
arduino_setup()
    soil_moisture_init("soilSensor")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, soil_moisture_read_value($soilSensor))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `soil_moisture_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

读取前可用 `soil_moisture_is_connected` 检查地址应答。原生驱动遇到读错误会返回 0，此时百分比可能显示 100%。地址应答与测量是两笔独立的 I²C 事务。
