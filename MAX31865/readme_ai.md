# MAX31865温度传感器库

MAX31865温度传感器库，支持PT100/PT1000温度传感器，可配置2/3/4线连接方式

## Library Info
- **Name**: @aily-project/lib-max31865
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `max31865_init` | Statement | CS_PIN(dropdown), WIRE_MODE(dropdown), SENSOR_TYPE(dropdown) | `max31865_init(CS_PIN, MAX31865_2WIRE, MAX31865_PT100)` | `maxTemp.begin(` |
| `max31865_read` | Statement | TEMP_VAR(field_variable), RESISTANCE_VAR(field_variable), STATUS_VAR(field_variable) | `max31865_read(variables_get($temperature), variables_get($resistance), variables_get($status))` | `maxTemp.MAX31865_GetTemperatureAndStatus(` |
| `max31865_set_low_threshold` | Statement | THRESHOLD(input_value) | `max31865_set_low_threshold(math_number(0))` | `maxTemp.MAX31865_SetLowFaultThreshold(` |
| `max31865_set_high_threshold` | Statement | THRESHOLD(input_value) | `max31865_set_high_threshold(math_number(0))` | `maxTemp.MAX31865_SetHighFaultThreshold(` |
| `max31865_check_fault` | Value | FAULT_TYPE(dropdown) | `max31865_check_fault(MAX31865_FAULT_TEMP_HIGH)` | `((` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WIRE_MODE | MAX31865_2WIRE, MAX31865_3WIRE, MAX31865_4WIRE | 2线制 / 3线制 / 4线制 |
| SENSOR_TYPE | MAX31865_PT100, MAX31865_PT1000 | PT100 / PT1000 |
| FAULT_TYPE | MAX31865_FAULT_TEMP_HIGH, MAX31865_FAULT_TEMP_LOW, MAX31865_FAULT_REFIN_HIGH, MAX31865_FAULT_REFIN_LOW_OPEN, MAX31865_FAULT_RTDIN_LOW_OPEN, MAX31865_FAULT_VOLTAGE_OOR | 高温故障 / 低温故障 / 基准电阻高故障 / 基准电阻低/开路故障 / 温度传感器低/开路故障 / 电压超出范围故障 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    max31865_init(CS_PIN, MAX31865_2WIRE, MAX31865_PT100)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, max31865_check_fault(MAX31865_FAULT_TEMP_HIGH))
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
