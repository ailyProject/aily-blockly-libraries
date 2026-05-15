# 2.4G wireless remote control

2.4G wireless remote control library, serial port communication, can read joystick and button data

## Library Info
- **Name**: @aily-project/lib-remotecontrol-2g4
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `RemoteControl2g4_init` | Statement | (none) | `RemoteControl2g4_init()` | Dynamic code |
| `RemoteControl2g4_run` | Statement | (none) | `RemoteControl2g4_run()` | MyCar.OpenJumper_RemoteControl_run();\n |
| `RemoteControl2g4_RD` | Value | (none) | `RemoteControl2g4_RD()` | MyCar.SerialState() |
| `RemoteControl_btn` | Value | BUTTON(dropdown) | `RemoteControl_btn(PAD_UP)` | MyCar.Button( |
| `RemoteControl_joy` | Value | JOY(dropdown) | `RemoteControl_joy(PAD_LX)` | MyCar.Analog( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| BUTTON | PAD_UP, PAD_DOWN, PAD_LEFT, PAD_RIGHT, PAD_A, PAD_B, PAD_C, PAD_D, PAD_J_L, PAD_J_R | RemoteControl_btn |
| JOY | PAD_LX, PAD_LY, PAD_RX, PAD_RY | RemoteControl_joy |

## ABS Examples

### Basic Usage
```
arduino_setup()
    RemoteControl2g4_init()
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, RemoteControl2g4_RD())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
