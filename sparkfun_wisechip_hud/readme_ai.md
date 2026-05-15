# SparkFun WiseChip HUD Display

Blockly wrapper for the SparkFun WiseChip HUD I2C head-up display.

## Library Info
- **Name**: @aily-project/lib-sparkfun-wisechip-hud
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wisechip_hud_init` | Statement | VAR(field_input) | `wisechip_hud_init("hud")` | Wire.begin();\n |
| `wisechip_hud_icon_level` | Statement | VAR(field_variable), ICON(input_value), LEVEL(input_value) | `wisechip_hud_icon_level(variables_get($hud), math_number(0), math_number(0))` | Dynamic code |
| `wisechip_hud_nav` | Statement | VAR(field_variable), CMD(dropdown) | `wisechip_hud_nav(variables_get($hud), nav_TurnLeft)` | Dynamic code |
| `wisechip_hud_compass` | Statement | VAR(field_variable), TYPE(dropdown), SELECT(input_value) | `wisechip_hud_compass(variables_get($hud), compassCircle, math_number(0))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| CMD | nav_TurnLeft, nav_TurnRight, nav_HardLeft, nav_HardRight, nav_KeepLeft, nav_KeepRight, nav_Group | wisechip_hud_nav |
| TYPE | compassCircle, compassArrows | wisechip_hud_compass |

## ABS Examples

### Basic Usage
```
arduino_setup()
    wisechip_hud_init("hud")
    serial_begin(Serial, 9600)

arduino_loop()
    wisechip_hud_icon_level(variables_get($hud), math_number(0), math_number(0))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `wisechip_hud_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
