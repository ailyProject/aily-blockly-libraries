# IBox S31 Battery

IBox S31 battery: BQ27220 voltage, charge estimated from voltage, low-battery flag and low-voltage shutdown

## Library Info
- **Name**: @aily-project/lib-iboxs31_battery
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `iboxs31_battery_init` | Statement | (none) | `iboxs31_battery_init()` | `iboxs31_battery.begin(Wire, 0, 1);` |
| `iboxs31_battery_read` | Value | WHAT(dropdown) | `iboxs31_battery_read(PERCENT)` | `iboxs31_battery_get(0)` |
| `iboxs31_battery_state` | Value | WHAT(dropdown) | `iboxs31_battery_state(LOW)` | `(iboxs31_battery_service(), iboxs31_battery.isLow())` |
| `iboxs31_battery_shutdown` | Statement | (none) | `iboxs31_battery_shutdown()` | `IBoxS31_Battery::deepSleepShutdown();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WHAT | PERCENT, VOLT, RAW, CURRENT, TEMP | iboxs31_battery_read |
| WHAT | LOW, SHUTDOWN, VALID | iboxs31_battery_state |

## ABS Examples

### Show the charge and shut down when empty
```abs
arduino_setup()
    serial_begin(Serial, 115200)
    iboxs31_battery_init()

arduino_loop()
    serial_println(Serial, text_join(ADD0=text("battery "), ADD1=iboxs31_battery_read(PERCENT), ADD2=text("% "), ADD3=iboxs31_battery_read(VOLT)))
    controls_if()
        @IF0: iboxs31_battery_state(LOW)
        @DO0:
            serial_println(Serial, text("please charge"))
    controls_if()
        @IF0: iboxs31_battery_state(SHUTDOWN)
        @DO0:
            serial_println(Serial, text("battery empty"))
            iboxs31_battery_shutdown()
    time_delay(math_number(100))
```

## Notes

1. **Board**: IBox S31 only (Aily board IBOX S31, ESP32-S31, Arduino-ESP32 4.0.0). The BQ27220 is at I2C 0x55 on SDA=IO0, SCL=IO1, shared with the other onboard sensors.
2. **Sampling**: `iboxs31_battery_init` adds a 100 ms sampler to the start of `loop()`. The voltage goes through a low-pass filter (about 1 s), the charge comes from a single-cell curve with 2% hysteresis, and the shutdown flag needs the smoothed voltage below 3.3 V for about 3 s. Long `delay()` in the loop slows these down.
3. **Trust the voltage**: the BQ27220’s own state of charge is not calibrated for this battery and stays fixed, so the library estimates charge from voltage like board_test. Current and temperature are read directly from the gauge.
4. **Shutdown**: `iboxs31_battery_shutdown` enters deep sleep; plugging in power or pressing reset restarts the program. Turn off the speaker amplifier and lights before it.
