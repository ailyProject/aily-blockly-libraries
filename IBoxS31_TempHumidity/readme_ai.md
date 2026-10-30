# IBox S31 Temp & Humidity

Onboard AHT20 temperature and humidity sensor of the IBox S31, with CRC check

## Library Info
- **Name**: @aily-project/lib-iboxs31_temphumidity
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `iboxs31_aht20_init` | Statement | (none) | `iboxs31_aht20_init()` | `iboxs31_aht20.begin(Wire, 0, 1);` |
| `iboxs31_aht20_read` | Value | WHAT(dropdown) | `iboxs31_aht20_read(TEMP)` | `iboxs31_aht20_get(false)` |
| `iboxs31_aht20_ok` | Value | (none) | `iboxs31_aht20_ok()` | `iboxs31_aht20_ok()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WHAT | TEMP, HUMI | iboxs31_aht20_read |

## ABS Examples

### Print temperature and humidity every second
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    iboxs31_aht20_init()

arduino_loop()
    controls_ifelse(iboxs31_aht20_ok())
        @DO0:
            serial_println(Serial, text_join(ADD0=text("T="), ADD1=iboxs31_aht20_read(TEMP), ADD2=text(" H="), ADD3=iboxs31_aht20_read(HUMI)))
        @ELSE:
            serial_println(Serial, text("AHT20 read fail"))
    time_delay(math_number(1000))
```

## Notes

1. **Board**: IBox S31 only (Aily board IBOX S31, ESP32-S31, Arduino-ESP32 4.0.0). The AHT20 is at I2C 0x38 on SDA=IO0, SCL=IO1, the bus shared by all onboard sensors; every IBox S31 sensor library starts the same `Wire` bus, so they work together.
2. **Reading**: a measurement blocks about 80 ms, and reads within 0.5 s reuse it. `iboxs31_aht20_ok` is false when the sensor is missing, busy or fails the CRC; the last good values are kept.
