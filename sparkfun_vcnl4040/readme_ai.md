# SparkFun VCNL4040 Proximity and Ambient Light Sensor

Blockly wrapper for the SparkFun VCNL4040 I2C proximity and ambient light sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-vcnl4040
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `vcnl4040_init` | Statement | VAR(field_input) | `vcnl4040_init("prox")` | `Wire.begin(); ↵ prox.begin(); ↵ prox.powerOnProximity(); ↵ prox.powerOnAmbient();` |
| `vcnl4040_get_proximity` | Value | VAR(field_variable) | `vcnl4040_get_proximity($prox)` | `prox.getProximity()` |
| `vcnl4040_get_ambient` | Value | VAR(field_variable) | `vcnl4040_get_ambient($prox)` | `prox.getAmbient()` |
| `vcnl4040_get_white` | Value | VAR(field_variable) | `vcnl4040_get_white($prox)` | `prox.getWhite()` |
| `vcnl4040_power_proximity` | Statement | VAR(field_variable), STATE(dropdown) | `vcnl4040_power_proximity($prox, ON)` | `prox.powerOnProximity();` |
| `vcnl4040_power_ambient` | Statement | VAR(field_variable), STATE(dropdown) | `vcnl4040_power_ambient($prox, ON)` | `prox.powerOnAmbient();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | ON, OFF | vcnl4040_power_proximity, vcnl4040_power_ambient |

## ABS Examples

### Basic Usage
```
arduino_setup()
    vcnl4040_init("prox")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, vcnl4040_get_proximity($prox))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `vcnl4040_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

0.0.2 增加“上次初始化成功”和“上次 I²C 传输成功”。读数为 0 时可用后者区分合法零值与断线、短读；请在下一次总线操作前读取状态。C++ 的 begin() 仍会启动 Wire，已启动的总线可使用 beginOnActiveBus(Wire)。
