# Wind speed, direction and rain sensor

Wind speed, wind direction and rain sensor control library, hardware adapted to the wind speed, wind direction and raindrop sensor in the openJumper Weather IoT Master Kit, supports wind speed measurement (km/h, mph)...

## Library Info
- **Name**: @aily-project/lib-wind
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wind_begin` | Statement | SPEED_PIN(dropdown), DIR_PIN(dropdown) | `wind_begin(SPEED_PIN, DIR_PIN)` | Dynamic code |
| `wind_begin_speed` | Statement | SPEED_PIN(dropdown) | `wind_begin_speed(SPEED_PIN)` | Dynamic code |
| `wind_begin_direction` | Statement | DIR_PIN(dropdown) | `wind_begin_direction(DIR_PIN)` | Dynamic code |
| `wind_update` | Statement | (none) | `wind_update()` | WindSpeed::update();\n |
| `wind_update_speed` | Statement | (none) | `wind_update_speed()` | WindSpeed::updateWindSpeed();\n |
| `wind_update_direction` | Statement | (none) | `wind_update_direction()` | WindSpeed::updateWindDirection();\n |
| `wind_get_speed_kmh` | Value | (none) | `wind_get_speed_kmh()` | WindSpeed::getWindSpeed() |
| `wind_get_speed_mph` | Value | (none) | `wind_get_speed_mph()` | WindSpeed::getWindSpeedMph() |
| `wind_get_direction` | Value | (none) | `wind_get_direction()` | WindSpeed::getWindDirection() |
| `wind_get_direction_string` | Value | (none) | `wind_get_direction_string()` | WindSpeed::getWindDirectionString() |
| `wind_get_direction_adc` | Value | (none) | `wind_get_direction_adc()` | WindSpeed::getWindDirectionADC() |
| `wind_is_data_ready` | Value | (none) | `wind_is_data_ready()` | WindSpeed::isDataReady() |
| `rain_init` | Statement | PIN(dropdown) | `rain_init(PIN)` | Dynamic code |
| `rain_update` | Statement | (none) | `rain_update()` | RainSensor::update();\n |
| `rain_get_total` | Value | (none) | `rain_get_total()` | RainSensor::getRainfallTotal() |
| `rain_get_hour` | Value | (none) | `rain_get_hour()` | RainSensor::getRainfallLastHour() |
| `rain_get_day` | Value | (none) | `rain_get_day()` | RainSensor::getRainfallLastDay() |
| `rain_get_ticks` | Value | (none) | `rain_get_ticks()` | RainSensor::getRainTicks() |
| `rain_is_data_ready` | Value | (none) | `rain_is_data_ready()` | RainSensor::isDataReady() |

## ABS Examples

### Basic Usage
```
arduino_setup()
    wind_begin(SPEED_PIN, DIR_PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, wind_get_speed_kmh())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
