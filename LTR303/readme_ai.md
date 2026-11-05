# LTR303 Ambient Light

LTR-303 ambient light sensor: lux plus raw visible and infrared counts, I2C pins from the board

## Library Info
- **Name**: @aily-project/lib-ltr303
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ltr303_init` | Statement | (none) | `ltr303_init()` | `ltr303.begin(Wire);` |
| `ltr303_gain` | Statement | GAIN(dropdown) | `ltr303_gain(GAIN_1X)` | `ltr303.setGain(LTR303::GAIN_1X);` |
| `ltr303_integration` | Statement | TIME(dropdown) | `ltr303_integration(INT_50MS)` | `ltr303.setTiming(LTR303::INT_50MS, LTR303::RATE_500MS);` |
| `ltr303_read` | Value | WHAT(dropdown) | `ltr303_read(LUX)` | `ltr303_get(0)` |
| `ltr303_ok` | Value | (none) | `ltr303_ok()` | `ltr303_ok()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| GAIN | GAIN_1X, GAIN_2X, GAIN_4X, GAIN_8X, GAIN_48X, GAIN_96X | ltr303_gain |
| TIME | INT_50MS, INT_100MS, INT_200MS, INT_400MS | ltr303_integration |
| WHAT | LUX, CH0, CH1 | ltr303_read |

## ABS Examples

### Print the light level, more gain in the dark
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    ltr303_init()
    ltr303_gain(GAIN_4X)
    ltr303_integration(INT_200MS)

arduino_loop()
    controls_if()
        @IF0: ltr303_ok()
        @DO0:
            serial_println(Serial, text_join(ADD0=text("lux="), ADD1=ltr303_read(LUX), ADD2=text(" CH0="), ADD3=ltr303_read(CH0)))
    time_delay(math_number(500))
```

## Notes

1. **Boards**: any ESP32 board. `ltr303_init` starts `Wire` on the board’s I2C pins (the board `i2cPins`, or pins set with the aily I2C library) before talking to the chip. The LTR-303 address is fixed at 0x29. IBox S31: onboard, SDA=IO0, SCL=IO1.
2. **Values**: `LUX` uses the LTR-303 application note formula and follows the current gain and integration time. `CH0` is visible + infrared, `CH1` infrared only (raw counts). The sensor updates every 500 ms; reads within 0.1 s reuse one sample.
3. **Gain and integration**: raise the gain or integration time in dim places; in bright light lower them if the counts stop rising (saturation). The LTR-303 is not the LTR-308: different address and registers.
