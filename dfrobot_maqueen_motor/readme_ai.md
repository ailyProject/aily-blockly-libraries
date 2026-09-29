# mPython Expansion Motor Driver

Expansion board with a built-in motor driver, for mPython 2.0/3.0, ESP32, K10, micro:bit and other boards

## Library Info
- **Name**: @aily-project/lib-dfrobot-maqueen-motor
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `maqueen_motor_init` | Statement | VAR(field_input) | `maqueen_motor_init("maqueen")` | `if (!maqueen.begin()) { ↵ Serial.println("未检测到电机驱动（I2C 地址 0x10），请检查连接并打开电源"); ↵ }` |
| `maqueen_motor_run` | Statement | VAR(field_variable), INDEX(dropdown), DIR(dropdown), SPEED(input_value) | `maqueen_motor_run($maqueen, MAQUEEN_MOTOR_LEFT, MAQUEEN_MOTOR_CW, math_number(9600))` | `maqueen.motorRun(MAQUEEN_MOTOR_LEFT, MAQUEEN_MOTOR_CW, 255);` |
| `maqueen_motor_stop` | Statement | VAR(field_variable), INDEX(dropdown) | `maqueen_motor_stop($maqueen, MAQUEEN_MOTOR_ALL)` | `maqueen.motorStop(MAQUEEN_MOTOR_ALL);` |
| `maqueen_motor_move` | Statement | VAR(field_variable), ACTION(dropdown), SPEED(input_value) | `maqueen_motor_move($maqueen, FORWARD, math_number(9600))` | `maqueen.motorRun(MAQUEEN_MOTOR_ALL, MAQUEEN_MOTOR_CW, 255);` |
| `maqueen_motor_is_connected` | Value | VAR(field_variable) | `maqueen_motor_is_connected($maqueen)` | `maqueen.isConnected()` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| INDEX | MAQUEEN_MOTOR_LEFT, MAQUEEN_MOTOR_RIGHT, MAQUEEN_MOTOR_ALL | maqueen_motor_run |
| DIR | MAQUEEN_MOTOR_CW, MAQUEEN_MOTOR_CCW | maqueen_motor_run |
| INDEX | MAQUEEN_MOTOR_ALL, MAQUEEN_MOTOR_LEFT, MAQUEEN_MOTOR_RIGHT | maqueen_motor_stop |
| ACTION | FORWARD, BACKWARD, LEFT, RIGHT | maqueen_motor_move |

## ABS Examples

### Basic Usage
```abs
arduino_setup()
    maqueen_motor_init("maqueen")

arduino_loop()
    maqueen_motor_move($maqueen, FORWARD, math_number(150))
    time_delay(math_number(1000))
    maqueen_motor_move($maqueen, LEFT, math_number(120))
    time_delay(math_number(500))
    maqueen_motor_stop($maqueen, MAQUEEN_MOTOR_ALL)
    time_delay(math_number(1000))
```

## Notes

1. **I2C pins**: `maqueen_motor_init` starts `Wire` at the top of `setup()` with the board I2C pins. On ESP32 boards it passes them explicitly (mPython 2.0: `Wire.begin(23, 22)`, mPython 3.0: `Wire.begin(44, 43)`, K10: `Wire.begin(47, 48)`), because aily builds mPython with the generic ESP32 variants whose default pins are different. Other boards use `Wire.begin()`.
2. **mPython 3.0 and Serial**: GPIO44/43 are also the default UART0 pins of the ESP32-S3. Unless the board menu enables USB CDC On Boot, `Serial` is UART0 and `Serial.begin()` takes those pins and shuts I2C down. On such boards init does not print anything; use `maqueen_motor_is_connected` to check the link, and avoid serial blocks or enable USB CDC On Boot.
3. **Fixed address**: the motor driver is always at I2C 0x10, so there is no address field. On other boards init prints a serial hint when nothing answers.
4. **Variable**: `maqueen_motor_init("maqueen")` creates `$maqueen`; pass it directly to field_variable slots.
5. **Speed**: limited to 0~255. Literal values are clamped in the generated code, expressions are wrapped in `constrain()`.
6. **Directions**: `MAQUEEN_MOTOR_CW` is forward. `maqueen_motor_move` LEFT/RIGHT spin on the spot (one side forward, the other backward).
7. **Driver change**: the original Mind+ library called `Wire.begin()` in its constructor; this copy starts nothing in the constructor, so always place the init block in `setup()`.
