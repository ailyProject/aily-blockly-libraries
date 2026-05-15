# Seeed Hmc5883l

Blockly library for Seeed Hmc5883l.

## Library Info
- **Name**: @aily-project/lib-seeed-hmc5883l
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `hmc5883l_init` | Statement | (none) | `hmc5883l_init()` | Wire.begin();\n |
| `hmc5883l_set_scale` | Statement | SCALE(dropdown) | `hmc5883l_set_scale("0.88")` | hmc5883l_compass.setScale( |
| `hmc5883l_get_heading` | Value | (none) | `hmc5883l_get_heading()` | hmc5883l_getHeading() |
| `hmc5883l_read_axis` | Value | AXIS(dropdown) | `hmc5883l_read_axis(X)` | hmc5883l_readAxis(\ |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SCALE | 0.88, 1.3, 1.9, 2.5, 4.0, 4.7, 5.6, 8.1 | hmc5883l_set_scale |
| AXIS | X, Y, Z | hmc5883l_read_axis |

## ABS Examples

### Basic Usage
```
arduino_setup()
    hmc5883l_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, hmc5883l_get_heading())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
