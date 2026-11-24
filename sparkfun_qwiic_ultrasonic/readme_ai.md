# SparkFun Qwiic Ultrasonic Distance Sensor

Blockly wrapper for SparkFun Qwiic Ultrasonic distance sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-qwiic-ultrasonic
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qwiic_ultrasonic_init` | Statement | VAR(field_input) | `qwiic_ultrasonic_init("sonar")` | `sonar.begin();` |
| `qwiic_ultrasonic_read` | Value | VAR(field_variable) | `qwiic_ultrasonic_read($sonar)` | `triggerAndRead(mm) with status check` |

## ABS Examples

### Basic Usage
```
arduino_setup()
    qwiic_ultrasonic_init("sonar")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, qwiic_ultrasonic_read($sonar))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `qwiic_ultrasonic_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

The default Qwiic address of the TCT40 (SEN-24805) is 0x2F. The distance block triggers a measurement and reads the most recently available result in millimetres. Allow time between readings for the echo. A successful bus read may return zero, including before the first echo. The block checks the address before sending a command. An I²C error returns -1. The package installs the shared SparkFun Toolkit 1.2.1 dependency.
