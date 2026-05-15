# GPS Module

GPS module control library based on TinyGPS++, supports NMEA protocol parsing to obtain latitude/longitude, date/time, speed, altitude, course, satellite count and more. Includes distance and course calculation betwee...

## Library Info
- **Name**: @aily-project/lib-tiny-gps-plus
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `gps_init` | Statement | VAR(field_input), SERIAL(dropdown), BAUD(dropdown) | `gps_init("gps", SERIAL, "9600")` | Dynamic code |
| `gps_update` | Statement | VAR(field_variable) | `gps_update(variables_get($gps))` | while ( |
| `gps_location` | Value | VAR(field_variable), COORD(dropdown) | `gps_location(variables_get($gps), LAT)` | Dynamic code |
| `gps_date` | Value | VAR(field_variable), PART(dropdown) | `gps_date(variables_get($gps), YEAR)` | Dynamic code |
| `gps_time` | Value | VAR(field_variable), PART(dropdown) | `gps_time(variables_get($gps), HOUR)` | Dynamic code |
| `gps_speed` | Value | VAR(field_variable), UNIT(dropdown) | `gps_speed(variables_get($gps), KMPH)` | Dynamic code |
| `gps_altitude` | Value | VAR(field_variable), UNIT(dropdown) | `gps_altitude(variables_get($gps), METERS)` | Dynamic code |
| `gps_satellites` | Value | VAR(field_variable) | `gps_satellites(variables_get($gps))` | Dynamic code |
| `gps_course` | Value | VAR(field_variable) | `gps_course(variables_get($gps))` | Dynamic code |
| `gps_hdop` | Value | VAR(field_variable) | `gps_hdop(variables_get($gps))` | Dynamic code |
| `gps_is_valid` | Value | VAR(field_variable), TYPE(dropdown) | `gps_is_valid(variables_get($gps), LOCATION)` | Dynamic code |
| `gps_distance_between` | Value | LAT1(input_value), LNG1(input_value), LAT2(input_value), LNG2(input_value) | `gps_distance_between(math_number(0), math_number(0), math_number(0), math_number(0))` | TinyGPSPlus::distanceBetween( |
| `gps_course_to` | Value | LAT1(input_value), LNG1(input_value), LAT2(input_value), LNG2(input_value) | `gps_course_to(math_number(0), math_number(0), math_number(0), math_number(0))` | TinyGPSPlus::courseTo( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BAUD | 9600, 4800, 19200, 38400, 57600, 115200 | gps_init |
| COORD | LAT, LNG | gps_location |
| PART | YEAR, MONTH, DAY | gps_date |
| PART | HOUR, MINUTE, SECOND | gps_time |
| UNIT | KMPH, MPH, MPS, KNOTS | gps_speed |
| UNIT | METERS, KM, FEET | gps_altitude |
| TYPE | LOCATION, DATE, TIME | gps_is_valid |

## ABS Examples

### Basic Usage
```
arduino_setup()
    gps_init("gps", SERIAL, "9600")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, gps_location(variables_get($gps), LAT))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `gps_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
