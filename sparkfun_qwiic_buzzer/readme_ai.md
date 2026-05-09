# SparkFun Qwiic 蜂鸣器

SparkFun Qwiic Buzzer（BOB-24474）的 Blockly 封装库，支持 I2C 控制频率、时长和音量。

## Library Info
- **Name**: @aily-project/lib-sparkfun-qwiic-buzzer
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qwiic_buzzer_init` | Statement | VAR(field_input) | `qwiic_buzzer_init("buzzer")` | `QwiicBuzzer buzzer; buzzer.begin();` |
| `qwiic_buzzer_on` | Statement | VAR(field_variable) | `qwiic_buzzer_on(variables_get($buzzer))` | `buzzer.on();` |
| `qwiic_buzzer_off` | Statement | VAR(field_variable) | `qwiic_buzzer_off(variables_get($buzzer))` | `buzzer.off();` |
| `qwiic_buzzer_configure` | Statement | VAR(field_variable), FREQ(input_value), DURATION(input_value), VOLUME(dropdown) | `qwiic_buzzer_configure(variables_get($buzzer), math_number(2730), math_number(500), 4)` | `buzzer.configureBuzzer(2730, 500, 4);` |
| `qwiic_buzzer_sound_effect` | Statement | VAR(field_variable), EFFECT(input_value), VOLUME(dropdown) | `qwiic_buzzer_sound_effect(variables_get($buzzer), math_number(0), 4)` | `buzzer.playSoundEffect(0, 4);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| VOLUME | 0, 1, 2, 3, 4 | 音量：0=静音, 1=最小, 4=最大 |

## Notes

1. DURATION=0 表示持续发声，直到调用 `off()`
2. 谐振频率为 2730 Hz（SFE_QWIIC_BUZZER_RESONANT_FREQUENCY）
3. `qwiic_buzzer_configure` 仅配置参数，需额外调用 `qwiic_buzzer_on` 才开始发声

## ABS Examples

### 基本蜂鸣
```
arduino_setup()
    qwiic_buzzer_init("buzzer")
    serial_begin(Serial, 115200)

arduino_loop()
    qwiic_buzzer_configure(variables_get($buzzer), math_number(2730), math_number(500), 4)
    qwiic_buzzer_on(variables_get($buzzer))
    time_delay(math_number(500))
    qwiic_buzzer_off(variables_get($buzzer))
    time_delay(math_number(1000))
```
