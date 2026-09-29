# EVLab Servo & Motor

EasyVoice 1306 Dev only: drive 4 servos and 2 DC motors

## Library Info
- **Name**: @aily-project/lib-evlabmotion
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `evlabmotion_init` | Statement | VAR(field_input), WIRE(dropdown) | `evlabmotion_init("motion", WIRE)` | `// 初始化 EasyVoiceLab 1306 运动协处理器 motion ↵ if (!motion.begin()) { ↵ Serial.print("运动模块初始化失败，未在地址 0x"); ↵ Serial.print(motion.getAddress(), HEX); ↵ Serial.println(" 找到协处理器，请检查接线与上拉电阻"); ↵ }` |
| `evlabmotion_is_connected` | Value | VAR(field_variable) | `evlabmotion_is_connected($motion)` | `motion.isConnected()` |
| `evlabmotion_get_address` | Value | VAR(field_variable) | `evlabmotion_get_address($motion)` | `motion.getAddress()` |
| `evlabmotion_set_servo` | Statement | VAR(field_variable), INDEX(dropdown), ANGLE(input_value) | `evlabmotion_set_servo($motion, 1, math_number(90))` | `motion.setServo(1, 1);` |
| `evlabmotion_set_all_servos` | Statement | VAR(field_variable), ANGLE(input_value) | `evlabmotion_set_all_servos($motion, math_number(90))` | `motion.setAllServos(1);` |
| `evlabmotion_motor_run` | Statement | VAR(field_variable), INDEX(dropdown), DIR(dropdown), SPEED(input_value) | `evlabmotion_motor_run($motion, 1, FORWARD, math_number(9600))` | `motion.forward(1, 1);` |
| `evlabmotion_set_motor` | Statement | VAR(field_variable), INDEX(dropdown), DIR(input_value), SPEED(input_value) | `evlabmotion_set_motor($motion, 1, math_number(0), math_number(9600))` | `motion.setMotor(1, 1, 1);` |
| `evlabmotion_stop_motor` | Statement | VAR(field_variable), INDEX(dropdown) | `evlabmotion_stop_motor($motion, 1)` | `motion.stopMotor(1);` |
| `evlabmotion_stop_motors` | Statement | VAR(field_variable) | `evlabmotion_stop_motors($motion)` | `motion.stopMotors();` |
| `evlabmotion_send_frame` | Statement | VAR(field_variable), ID(input_value), ARG1(input_value), ARG2(input_value) | `evlabmotion_send_frame($motion, math_number(0), math_number(0), math_number(0))` | `motion.sendFrame(1, 1, 1);` |
| `evlabmotion_verify` | Value | VAR(field_variable) | `evlabmotion_verify($motion)` | `motion.verify()` |
| `evlabmotion_read_frame_byte` | Value | VAR(field_variable), PART(dropdown) | `evlabmotion_read_frame_byte($motion, 0)` | `evlabMotionReadFrameByte(motion, 0)` |
| `evlabmotion_last_frame_byte` | Value | VAR(field_variable), PART(dropdown) | `evlabmotion_last_frame_byte($motion, 0)` | `evlabMotionLastFrameByte(motion, 0)` |
| `evlabmotion_last_error` | Value | VAR(field_variable) | `evlabmotion_last_error($motion)` | `motion.lastError()` |
| `evlabmotion_last_write` | Value | VAR(field_variable) | `evlabmotion_last_write($motion)` | `motion.lastWrite()` |
| `evlabmotion_calibrate_zero` | Statement | VAR(field_variable) | `evlabmotion_calibrate_zero($motion)` | `motion.calibrateZero();` |
| `evlabmotion_current_amps` | Value | VAR(field_variable) | `evlabmotion_current_amps($motion)` | `motion.readCurrentAmps()` |
| `evlabmotion_current_raw` | Value | VAR(field_variable) | `evlabmotion_current_raw($motion)` | `motion.readCurrentRaw()` |
| `evlabmotion_error_const` | Value | CODE(dropdown) | `evlabmotion_error_const(EVLABMOTION_OK)` | `EVLABMOTION_OK` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| INDEX | 1, 2, 3, 4 | evlabmotion_set_servo |
| INDEX | 1, 2 | evlabmotion_motor_run, evlabmotion_set_motor, evlabmotion_stop_motor |
| DIR | FORWARD, BACKWARD | evlabmotion_motor_run |
| PART | 0, 1, 2 | evlabmotion_read_frame_byte, evlabmotion_last_frame_byte |
| CODE | EVLABMOTION_OK, EVLABMOTION_ERROR_CONNECT, EVLABMOTION_ERROR_INDEX, EVLABMOTION_ERROR_ANGLE, EVLABMOTION_ERROR_MISSING_BYTES, EVLABMOTION_ERROR_VERIFY, EVLABMOTION_ERROR_NO_CURRENT | evlabmotion_error_const |

## ABS Examples

### Basic Usage
```
arduino_setup()
    evlabmotion_init("motion", WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, evlabmotion_is_connected($motion))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `evlabmotion_init` creates a Blockly variable. Use `$varName` only for field_variable slots; input_value slots must use the explicit `variables_get($varName)` block.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. **Board scope**: this library targets the EasyVoiceLab 1306 board (`chipintelli:ci13xx:easyvoice_1306_dev`, shared by the EasyVoice 1306 Dev and EasyVoiceLab 1306 board packages).
5. **Setup side effects**: `evlabmotion_init` also emits `#include <Wire.h>`, `#include <EVLabMotion.h>`, the object declaration `EVLabMotion motion;` (or `EVLabMotion motion(&Wire1);` for a non-default bus), `Wire.begin();` at setup begin, and a `Serial.begin()` call. The table above shows only the statement code the block returns.
6. **Fixed address**: the co-processor answers at I2C 0x10 only, so no address field is exposed. SDA and SCL need external pull-ups.
7. **Read-once error**: `evlabmotion_last_error` clears the error state as it reads, and it only reflects the most recent call, so a later successful call hides an earlier failure. Store it in a variable right after the call you care about.
8. **Byte range clamping**: `SPEED` on `evlabmotion_motor_run` / `evlabmotion_set_motor` and `DIR` on `evlabmotion_set_motor` are `uint8_t` parameters that would wrap silently (256 becomes 0, stopping the motor). The generator clamps them to 0-255: numeric literals are folded at generation time, other expressions are wrapped in `constrain(value, 0, 255)`. `evlabmotion_send_frame` is deliberately left unclamped because it is the raw escape hatch.
9. **Current sense**: a 10 mOhm shunt feeds an INA199A1 (50 V/V) whose output is sampled on the co-processor pin P01 (ADC channel 7) and returned in bytes 3-4 of a 5 byte read. It needs co-processor firmware that samples P01; older firmware returns 0, which the library reports as `EVLABMOTION_ERROR_NO_CURRENT` (raw -1, amps 0).
10. **Zero point**: the amplifier reference voltage is not assumed. `evlabmotion_init` samples the output once with the motors stopped and keeps it as the zero point, so the reading is correct whatever the reference actually is and the amplifier offset cancels out. Use `evlabmotion_calibrate_zero` to redo it whenever the motors are idle; a calibration taken while the motors draw current biases every later reading.
