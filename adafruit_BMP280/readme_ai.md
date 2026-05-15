# BMP280 air pressure sensor

Used for BMP280 air pressure sensor to achieve high-precision measurement of temperature and air pressure and altitude calculation through I2C interface, suitable for Arduino, ESP32 and other development boards

## Library Info
- **Name**: @aily-project/lib-adafruit-bmp280
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `bmp280_init` | Statement | ADDR(dropdown), WIRE(dropdown) | `bmp280_init("0x76", WIRE)` | Dynamic code |
| `bmp280_read_temperature` | Value | (none) | `bmp280_read_temperature()` | bmp.readTemperature() |
| `bmp280_read_pressure` | Value | (none) | `bmp280_read_pressure()` | (bmp.readPressure() / 100.0F) |
| `bmp280_read_altitude` | Value | SEAPRESSURE(field_number) | `bmp280_read_altitude(1013.25)` | bmp.readAltitude( |
| `bmp280_set_sampling` | Statement | MODE(dropdown), TEMP_OS(dropdown), PRES_OS(dropdown), FILTER(dropdown), DURATION(dropdown) | `bmp280_set_sampling(MODE_NORMAL, SAMPLING_X4, SAMPLING_X4, FILTER_X4, STANDBY_MS_1)` | bmp.setSampling(Adafruit_BMP280:: |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDR | 0x76, 0x77 | bmp280_init |
| MODE | MODE_NORMAL, MODE_FORCED, MODE_SLEEP | bmp280_set_sampling |
| TEMP_OS | SAMPLING_X4, SAMPLING_NONE, SAMPLING_X1, SAMPLING_X2, SAMPLING_X8, SAMPLING_X16 | bmp280_set_sampling |
| PRES_OS | SAMPLING_X4, SAMPLING_NONE, SAMPLING_X1, SAMPLING_X2, SAMPLING_X8, SAMPLING_X16 | bmp280_set_sampling |
| FILTER | FILTER_X4, FILTER_OFF, FILTER_X2, FILTER_X8, FILTER_X16 | bmp280_set_sampling |
| DURATION | STANDBY_MS_1, STANDBY_MS_63, STANDBY_MS_125, STANDBY_MS_250, STANDBY_MS_500, STANDBY_MS_1000, STANDBY_MS_2000, STANDBY_MS_4000 | bmp280_set_sampling |

## ABS Examples

### Basic Usage
```
arduino_setup()
    bmp280_init("0x76", WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, bmp280_read_temperature())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
