# IBox S31 Ambient Light

Onboard LTR-303 ambient light sensor of the IBox S31: lux plus raw visible and infrared counts

## Library Info
- **Name**: @aily-project/lib-iboxs31_ambientlight
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `iboxs31_ltr303_init` | Statement | (none) | `iboxs31_ltr303_init()` | `iboxs31_ltr303.begin(Wire, 0, 1);` |
| `iboxs31_ltr303_gain` | Statement | GAIN(dropdown) | `iboxs31_ltr303_gain(GAIN_1X)` | `iboxs31_ltr303.setGain(IBoxS31_LTR303::GAIN_1X);` |
| `iboxs31_ltr303_integration` | Statement | TIME(dropdown) | `iboxs31_ltr303_integration(INT_50MS)` | `iboxs31_ltr303.setTiming(IBoxS31_LTR303::INT_50MS, IBoxS31_LTR303::RATE_500MS);` |
| `iboxs31_ltr303_read` | Value | WHAT(dropdown) | `iboxs31_ltr303_read(LUX)` | `iboxs31_ltr303_get(0)` |
| `iboxs31_ltr303_ok` | Value | (none) | `iboxs31_ltr303_ok()` | `iboxs31_ltr303_ok()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| GAIN | GAIN_1X, GAIN_2X, GAIN_4X, GAIN_8X, GAIN_48X, GAIN_96X | iboxs31_ltr303_gain |
| TIME | INT_50MS, INT_100MS, INT_200MS, INT_400MS | iboxs31_ltr303_integration |
| WHAT | LUX, CH0, CH1 | iboxs31_ltr303_read |

## ABS Examples

### Print the light level, more gain in the dark
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    iboxs31_ltr303_init()
    iboxs31_ltr303_gain(GAIN_4X)
    iboxs31_ltr303_integration(INT_200MS)

arduino_loop()
    controls_if()
        @IF0: iboxs31_ltr303_ok()
        @DO0:
            serial_println(Serial, text_join(ADD0=text("lux="), ADD1=iboxs31_ltr303_read(LUX), ADD2=text(" CH0="), ADD3=iboxs31_ltr303_read(CH0)))
    time_delay(math_number(500))
```

## Notes

1. **Board**: IBox S31 only (Aily board IBOX S31, ESP32-S31, Arduino-ESP32 4.0.0). The LTR-303 is at I2C 0x29 on SDA=IO0, SCL=IO1, shared with the other onboard sensors.
2. **Values**: `LUX` uses the LTR-303 application note formula and follows the current gain and integration time. `CH0` (visible + infrared) is the raw count the board_test card shows; `CH1` is infrared only. The sensor updates every 500 ms; reads within 0.1 s reuse one sample.
3. **Gain and integration**: raise the gain or integration time in dim places; in bright light lower them if the counts stop rising (saturation).
