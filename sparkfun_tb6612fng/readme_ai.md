# SparkFun TB6612FNG Dual Motor Driver

Blockly wrapper for the SparkFun TB6612FNG dual H-bridge motor driver.

## Library Info
- **Name**: @aily-project/lib-sparkfun-tb6612fng
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tb6612fng_init` | Statement | VAR(field_input), IN1(input_value), IN2(input_value), PWM(input_value), OFFSET(dropdown), STBY(input_value) | `tb6612fng_init("motor1", math_number(0), math_number(0), math_number(0), "1", math_number(0))` | Dynamic code |
| `tb6612fng_drive` | Statement | VAR(field_variable), SPEED(input_value) | `tb6612fng_drive(variables_get($motor1), math_number(9600))` | Dynamic code |
| `tb6612fng_brake` | Statement | VAR(field_variable) | `tb6612fng_brake(variables_get($motor1))` | Dynamic code |
| `tb6612fng_standby` | Statement | PIN(input_value), STATE(dropdown) | `tb6612fng_standby(math_number(2), HIGH)` | digitalWrite( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| OFFSET | 1, -1 | tb6612fng_init |
| STATE | HIGH, LOW | tb6612fng_standby |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tb6612fng_init("motor1", math_number(0), math_number(0), math_number(0), "1", math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    tb6612fng_drive(variables_get($motor1), math_number(9600))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `tb6612fng_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
