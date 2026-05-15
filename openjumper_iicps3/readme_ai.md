# PS3 wireless receiver

Adapted to the openjumper PS3 wireless receiver (No. ojmoBhp4039), the library parses the data of the IICPS3 handle receiving module and supports obtaining the button status and joystick position of the handle.

## Library Info
- **Name**: @aily-project/lib-openjumper-iicps3
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `openjumper_iicps3_init` | Statement | PS3_NAME(field_input) | `openjumper_iicps3_init("ps3")` | Dynamic code |
| `openjumper_iicps3_run` | Statement | PS3_NAME(field_input) | `openjumper_iicps3_run("ps3")` | ....run();\n |
| `openjumper_iicps3_butstate` | Value | PS3_NAME(field_input), IICPS3_BTN(dropdown) | `openjumper_iicps3_butstate("ps3", up)` | ....ps3Data.... |
| `openjumper_iicps3_xy` | Value | PS3_NAME(field_input), IICPS3_XY(dropdown) | `openjumper_iicps3_xy("ps3", lx)` | ....ps3Data.... |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| IICPS3_BTN | up, down, left, right, triangle, cross, square, circle, l1, l2, l3, r1, r2, r3, select, start | openjumper_iicps3_butstate |
| IICPS3_XY | lx, ly, rx, ry | openjumper_iicps3_xy |

## ABS Examples

### Basic Usage
```
arduino_setup()
    openjumper_iicps3_init("ps3")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, openjumper_iicps3_butstate("ps3", up))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
