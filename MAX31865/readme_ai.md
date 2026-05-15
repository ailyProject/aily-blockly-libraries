# MAX31865 Temperature Sensor Library

MAX31865 temperature sensor library supports PT100/PT1000 temperature sensors and can be configured with 2/3/4 wire connection methods

## Library Info
- **Name**: @aily-project/lib-max31865
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `max31865_init` | Statement | CS_PIN(dropdown), WIRE_MODE(dropdown), SENSOR_TYPE(dropdown) | `max31865_init(CS_PIN, MAX31865_2WIRE, MAX31865_PT100)` | maxTemp.begin( |
| `max31865_read` | Statement | TEMP_VAR(field_variable), RESISTANCE_VAR(field_variable), STATUS_VAR(field_variable) | `max31865_read(variables_get($temperature), variables_get($resistance), variables_get($status))` | maxTemp.MAX31865_GetTemperatureAndStatus( |
| `max31865_set_low_threshold` | Statement | THRESHOLD(input_value) | `max31865_set_low_threshold(math_number(0))` | maxTemp.MAX31865_SetLowFaultThreshold( |
| `max31865_set_high_threshold` | Statement | THRESHOLD(input_value) | `max31865_set_high_threshold(math_number(0))` | maxTemp.MAX31865_SetHighFaultThreshold( |
| `max31865_check_fault` | Value | FAULT_TYPE(dropdown) | `max31865_check_fault(MAX31865_FAULT_TEMP_HIGH)` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WIRE_MODE | MAX31865_2WIRE, MAX31865_3WIRE, MAX31865_4WIRE | max31865_init |
| SENSOR_TYPE | MAX31865_PT100, MAX31865_PT1000 | max31865_init |
| FAULT_TYPE | MAX31865_FAULT_TEMP_HIGH, MAX31865_FAULT_TEMP_LOW, MAX31865_FAULT_REFIN_HIGH, MAX31865_FAULT_REFIN_LOW_OPEN, MAX31865_FAULT_RTDIN_LOW_OPEN, MAX31865_FAULT_VOLTAGE_OOR | max31865_check_fault |

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

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
