# SparkFun 土壤湿度传感器

## Library Info
- **Name**: @aily-project/lib-sparkfun-soil-moisture
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `soil_moisture_init` | Statement | VAR(field_input) | `soil_moisture_init("soilSensor")` | `SparkFunSoilMoistureSensor soilSensor; soilSensor.begin();` |
| `soil_moisture_read_value` | Value→Number | VAR(field_variable) | `soil_moisture_read_value(variables_get($soilSensor))` | `soilSensor.readMoistureValue()` |
| `soil_moisture_read_percentage` | Value→Number | VAR(field_variable) | `soil_moisture_read_percentage(variables_get($soilSensor))` | `soilSensor.readMoisturePercentage()` |
| `soil_moisture_led` | Statement | VAR(field_variable), STATE(dropdown:ON/OFF) | `soil_moisture_led(variables_get($soilSensor), ON)` | `soilSensor.LEDOn();` |
