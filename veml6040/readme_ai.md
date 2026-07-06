# VEML6040 Color Sensor

Vishay VEML6040 RGBW color sensor over I2C (address 0x10). `veml6040_init` creates a sensor object (variable) and selects the I2C bus; other blocks reference it.

## Library Info
- **Name**: @aily-project/lib-veml6040
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `veml6040_init` | Statement | VAR(field_input), WIRE(dropdown ${board.i2c}), IT(dropdown) | `veml6040_init("colorSensor", Wire, VEML6040_IT_320MS)` | `VEML6040 colorSensor;` + `Wire.begin();` + `colorSensor.begin(&Wire);` + `colorSensor.setConfiguration(VEML6040_IT_320MS + VEML6040_AF_AUTO + VEML6040_SD_ENABLE);` |
| `veml6040_read` | Value | VAR(field_variable), CHANNEL(dropdown) | `veml6040_read(variables_get($colorSensor), getRed)` | `colorSensor.getRed()` |
| `veml6040_get_color` | Value (String) | VAR(field_variable) | `veml6040_get_color(variables_get($colorSensor))` | `veml6040ColorName(colorSensor)` |
| `veml6040_is_color` | Value (Boolean) | VAR(field_variable), COLOR(dropdown) | `veml6040_is_color(variables_get($colorSensor), "red")` | `(veml6040ColorName(colorSensor) == "red")` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| WIRE | from `${board.i2c}` (e.g. Wire) | I2C bus instance |
| IT | VEML6040_IT_40MS, 80MS, 160MS, 320MS, 640MS, 1280MS | integration time (longer = more sensitive, slower) |
| CHANNEL | getRed, getGreen, getBlue, getWhite, getCCT, getAmbientLight | value to read (dropdown value is the method name) |
| COLOR | red, green, blue, yellow, cyan, white, dark | color to match |

## ABS Examples

### Read raw values
```
arduino_setup()
    veml6040_init("colorSensor", Wire, VEML6040_IT_320MS)
    serial_begin(Serial, 115200)

arduino_loop()
    serial_println(Serial, veml6040_read(variables_get($colorSensor), getRed))
    time_delay(math_number(500))
```

### React to a color
```
arduino_loop()
    controls_if()
        @IF0: veml6040_is_color(variables_get($colorSensor), "red")
        @DO0:
            serial_println(Serial, text("RED!"))
```

## Notes

1. **Variable**: `veml6040_init("colorSensor", ...)` creates variable `$colorSensor` (type `VEML6040`); reference it with `variables_get($colorSensor)`.
2. **Init**: place `veml6040_init` in `arduino_setup()`. It selects the I2C bus (`WIRE`), calls `wire.begin()`, `sensor.begin(&wire)` and `setConfiguration()` (auto mode + enable).
3. **CHANNEL dropdown value is the C++ method name** — generator emits `var.<CHANNEL>()`.
4. **Color detection**: `veml6040_get_color` returns a text (red/green/blue/yellow/cyan/white/dark) via helper `veml6040ColorName`; `veml6040_is_color` compares it against the chosen color and returns Boolean.
5. **Units**: R/G/B/W raw counts (uint16); CCT in K; ambient light in lux (float, needs valid IT).
6. **I2C**: fixed address 0x10; `begin(&wire)` no longer calls `wire.begin()` itself — the generator adds `wire.begin()` in setup.
