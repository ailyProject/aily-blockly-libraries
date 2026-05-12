# Meteorological data

Access the OpenWeatherMap API for weather data, supporting current weather, 5-day forecasts, air quality and geocoding

## Library Info
- **Name**: @aily-project/lib-openweathermap
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `owm_init` | Statement | VAR(field_input), API_KEY(input_value) | `owm_init("weather", text("value"))` | Dynamic code |
| `owm_set_units` | Statement | VAR(field_variable), UNITS(dropdown) | `owm_set_units(variables_get($weather), OWM_UNITS_METRIC)` | Dynamic code |
| `owm_set_language` | Statement | VAR(field_variable), LANG(dropdown) | `owm_set_language(variables_get($weather), zh_cn)` | Dynamic code |
| `owm_set_debug` | Statement | VAR(field_variable), DEBUG(dropdown) | `owm_set_debug(variables_get($weather), true)` | Dynamic code |
| `owm_get_weather_by_city` | Statement | VAR(field_variable), CITY(input_value), COUNTRY(input_value) | `owm_get_weather_by_city(variables_get($weather), text("value"), text("value"))` | Dynamic code |
| `owm_get_weather_by_coords` | Statement | VAR(field_variable), LAT(input_value), LON(input_value) | `owm_get_weather_by_coords(variables_get($weather), math_number(0), math_number(0))` | Dynamic code |
| `owm_request_success` | Value | VAR(field_variable) | `owm_request_success(variables_get($weather))` | Dynamic code |
| `owm_weather_data` | Value | VAR(field_variable), DATA(dropdown) | `owm_weather_data(variables_get($weather), name)` | Dynamic code |
| `owm_get_forecast` | Statement | VAR(field_variable), LAT(input_value), LON(input_value), COUNT(input_value) | `owm_get_forecast(variables_get($weather), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `owm_get_forecast_by_city` | Statement | VAR(field_variable), CITY(input_value), COUNTRY(input_value), COUNT(input_value) | `owm_get_forecast_by_city(variables_get($weather), text("value"), text("value"), math_number(0))` | Dynamic code |
| `owm_forecast_request_success` | Value | VAR(field_variable) | `owm_forecast_request_success(variables_get($weather))` | Dynamic code |
| `owm_forecast_count` | Value | VAR(field_variable) | `owm_forecast_count(variables_get($weather))` | Dynamic code |
| `owm_forecast_data` | Value | VAR(field_variable), INDEX(input_value), DATA(dropdown) | `owm_forecast_data(variables_get($weather), math_number(0), dt_txt)` | Dynamic code |
| `owm_get_air_pollution` | Statement | VAR(field_variable), LAT(input_value), LON(input_value) | `owm_get_air_pollution(variables_get($weather), math_number(0), math_number(0))` | Dynamic code |
| `owm_air_pollution_request_success` | Value | VAR(field_variable) | `owm_air_pollution_request_success(variables_get($weather))` | Dynamic code |
| `owm_air_pollution_data` | Value | VAR(field_variable), DATA(dropdown) | `owm_air_pollution_data(variables_get($weather), aqi)` | Dynamic code |
| `owm_aqi_description` | Value | AQI(input_value) | `owm_aqi_description(math_number(0))` | OpenWeatherMap::getAQIDescription( |
| `owm_get_coords_by_city` | Statement | VAR(field_variable), CITY(input_value), COUNTRY(input_value) | `owm_get_coords_by_city(variables_get($weather), text("value"), text("value"))` | Dynamic code |
| `owm_get_coords_by_zip` | Statement | VAR(field_variable), ZIP(input_value), COUNTRY(input_value) | `owm_get_coords_by_zip(variables_get($weather), text("value"), text("value"))` | Dynamic code |
| `owm_get_location_by_coords` | Statement | VAR(field_variable), LAT(input_value), LON(input_value) | `owm_get_location_by_coords(variables_get($weather), math_number(0), math_number(0))` | Dynamic code |
| `owm_geo_request_success` | Value | VAR(field_variable) | `owm_geo_request_success(variables_get($weather))` | Dynamic code |
| `owm_geo_data` | Value | VAR(field_variable), DATA(dropdown) | `owm_geo_data(variables_get($weather), name)` | Dynamic code |
| `owm_get_icon_url` | Value | ICON(input_value) | `owm_get_icon_url(text("value"))` | Dynamic code |
| `owm_get_last_error` | Value | VAR(field_variable) | `owm_get_last_error(variables_get($weather))` | Dynamic code |
| `owm_get_http_code` | Value | VAR(field_variable) | `owm_get_http_code(variables_get($weather))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| UNITS | OWM_UNITS_METRIC, OWM_UNITS_IMPERIAL, OWM_UNITS_STANDARD | owm_set_units |
| LANG | zh_cn, en, ja, kr, de, fr, es, ru | owm_set_language |
| DEBUG | true, false | owm_set_debug |
| DATA | name, country, weather_main, weather_description, weather_icon, temp, feels_like, temp_min, temp_max, humidity, pressure, wind_speed, wind_deg, clouds, visibility, sunrise, sunset | owm_weather_data |
| DATA | dt_txt, weather_main, weather_description, temp, feels_like, temp_min, temp_max, humidity, pressure, wind_speed, clouds, pop, rain_3h, snow_3h | owm_forecast_data |
| DATA | aqi, co, no, no2, o3, so2, pm2_5, pm10, nh3 | owm_air_pollution_data |
| DATA | name, country, state, lat, lon | owm_geo_data |

## ABS Examples

### Basic Usage
```
arduino_setup()
    owm_init("weather", text("value"))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, owm_request_success(variables_get($weather)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `owm_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
