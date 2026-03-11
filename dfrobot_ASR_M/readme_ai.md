# DFRobot语音识别模块

DFRobot_ASR_M语音识别模块控制库，适用于Arduino、ESP32等开发板。使用I2C接口进行通信，支持循环模式、指令模式和按钮模式三种识别模式，可添加自定义语音词条并识别返回对应的识别号。

## Library Info
- **Name**: @aily-project/lib-dfrobot_asr_m
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dfrobot_asr_init` | Statement | MODE(dropdown), MIC_MODE(dropdown), ADDRESS(field_input), WIRE(dropdown) | `dfrobot_asr_init(LOOP, MIC, "0x4F", WIRE)` | (dynamic code) |
| `dfrobot_asr_add_command` | Statement | WORDS(field_input), ID(field_input) | `dfrobot_asr_add_command("kai deng", "1")` | `asr.addCommand(` |
| `dfrobot_asr_start` | Statement | (none) | `dfrobot_asr_start()` | `asr.start();\n` |
| `dfrobot_asr_read` | Value | (none) | `dfrobot_asr_read()` | `asr.read()` |
| `dfrobot_asr_set_i2c_addr` | Statement | ADDR(field_input) | `dfrobot_asr_set_i2c_addr("0x4F")` | `asr.setI2CAddr(` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | LOOP, PASSWORD, BUTTON | 循环模式 (LOOP) / 指令模式 (PASSWORD) / 按钮模式 (BUTTON) |
| MIC_MODE | MIC, MONO | 麦克风 (MIC) / 单声道 (MONO) |

## ABS Examples

### Basic Usage
```
arduino_setup()
    dfrobot_asr_init(LOOP, MIC, "0x4F", WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, dfrobot_asr_read())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
