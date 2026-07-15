# Stepper Controller

步进电机控制器库，支持步数控制、速度调节、方向切换及前后限位开关检测。

## Library Info
- **Name**: @aily-project/lib-stepper-controller
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `stepper_ctrl_init` | Statement | VAR(field_input), STEP_PIN(field_dropdown), DIR_PIN(field_dropdown), SPEED(input_value), FRONT_LIMIT_PIN(field_dropdown), BACK_LIMIT_PIN(field_dropdown) | `stepper_ctrl_init("stepper1", PA8, PA9, math_number(1000), PA0, PA1)` | `stepper1.begin(PA8, PA9, 1000, PA0, PA1);` |
| `stepper_ctrl_start` | Statement | VAR(field_variable), TARGET(input_value), DIR(dropdown) | `stepper_ctrl_start($stepper1, math_number(800), FORWARD)` | `setTarget + setDirection + start` |
| `stepper_ctrl_stop` | Statement | VAR(field_variable) | `stepper_ctrl_stop($stepper1)` | `stepper1.stop();` |
| `stepper_ctrl_set_speed` | Statement | VAR(field_variable), SPEED(input_value) | `stepper_ctrl_set_speed($stepper1, math_number(1000))` | `stepper1.setSpeed(1000);` |
| `stepper_ctrl_set_rpm` | Statement | VAR(field_variable), RPM(input_value), SPR(input_value) | `stepper_ctrl_set_rpm($stepper1, math_number(60), math_number(200))` | `stepper1.setRPM(60, 200);` |
| `stepper_ctrl_set_direction` | Statement | VAR(field_variable), DIR(dropdown) | `stepper_ctrl_set_direction($stepper1, FORWARD)` | `stepper1.setDirection(true);` |
| `stepper_ctrl_tick` | Statement | VAR(field_variable) | `stepper_ctrl_tick($stepper1)` | `stepper1.tick();` |
| `stepper_ctrl_is_running` | Value | VAR(field_variable) | `stepper_ctrl_is_running($stepper1)` | `stepper1.isRunning()` |
| `stepper_ctrl_get_steps` | Value | VAR(field_variable) | `stepper_ctrl_get_steps($stepper1)` | `stepper1.getSteps()` |
| `stepper_ctrl_reset_steps` | Statement | VAR(field_variable) | `stepper_ctrl_reset_steps($stepper1)` | `stepper1.resetSteps();` |
| `stepper_ctrl_is_front_limit` | Value | VAR(field_variable) | `stepper_ctrl_is_front_limit($stepper1)` | `stepper1.isFrontLimit()` |
| `stepper_ctrl_is_back_limit` | Value | VAR(field_variable) | `stepper_ctrl_is_back_limit($stepper1)` | `stepper1.isBackLimit()` |
| `stepper_ctrl_on_target_done` | Hat | VAR(field_variable), HANDLER(input_statement) | `stepper_ctrl_on_target_done($stepper1) @HANDLER: ...` | callback registration |
| `stepper_ctrl_on_front_limit` | Hat | VAR(field_variable), HANDLER(input_statement) | `stepper_ctrl_on_front_limit($stepper1) @HANDLER: ...` | callback registration |
| `stepper_ctrl_on_back_limit` | Hat | VAR(field_variable), HANDLER(input_statement) | `stepper_ctrl_on_back_limit($stepper1) @HANDLER: ...` | callback registration |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| DIR | FORWARD, REVERSE | 电机旋转方向 |
| SPEED | 200~5000 | 步进脉冲间隔（微秒），越小越快 |
| RPM | 浮点数 | 目标转速（转/分钟） |
| SPR | 整数 | 电机每圈步数（如200步/圈） |

## ABS Examples

### Basic Usage - Button start with limit detection
```
arduino_setup()
    stepper_ctrl_init("stepper1", PA8, PA9, math_number(1000), PA0, PA1)
    serial_begin(Serial, 115200)

arduino_loop()
    controls_if()
        @IF0: logic_compare(io_digitalread(PA0), EQ, math_number(0))
        @DO0:
            stepper_ctrl_start($stepper1, math_number(800), FORWARD)
    stepper_ctrl_tick($stepper1)
```

### With Event Callbacks
```
arduino_setup()
    stepper_ctrl_init("stepper1", PA8, PA9, math_number(1000), PA0, PA1)
    serial_begin(Serial, 115200)

stepper_ctrl_on_target_done($stepper1)
    serial_println(Serial, text("Target done!"))

stepper_ctrl_on_front_limit($stepper1)
    serial_println(Serial, text("Front limit triggered!"))

stepper_ctrl_on_back_limit($stepper1)
    serial_println(Serial, text("Back limit triggered!"))

arduino_loop()
    stepper_ctrl_tick($stepper1)
```

## Notes

1. **Initialization**: `stepper_ctrl_init` must be called in `arduino_setup()` before other blocks
2. **Tick loop**: `stepper_ctrl_tick()` must be called in `arduino_loop()` to drive the motor and check limits
3. **Limit switches**: Use INPUT_PULLUP mode, switch connects pin to GND when triggered (LOW = triggered)
4. **Speed range**: Step delay 200~5000μs, lower value = faster speed
5. **Events**: Hat blocks (on_target_done, on_front_limit, on_back_limit) are event-driven, auto-register callbacks
6. **Variable**: `stepper_ctrl_init("varName", ...)` creates variable `$varName`; reference it with `$varName` or `variables_get($varName)`
