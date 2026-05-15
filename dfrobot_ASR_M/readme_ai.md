# DFRobot speech recognition module

DFRobot_ASR_M speech recognition module control library, suitable for Arduino, ESP32 and other development boards. It uses the I2C interface for communication and supports three recognition modes: loop mode, command m...

## Library Info
- **Name**: @aily-project/lib-dfrobot-asr-m
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `dfrobot_asr_init` | Statement | MODE(dropdown), MIC_MODE(dropdown), ADDRESS(field_input), WIRE(dropdown) | `dfrobot_asr_init(LOOP, MIC, "0x4F", WIRE)` | Dynamic code |
| `dfrobot_asr_add_command` | Statement | WORDS(field_input), ID(field_input) | `dfrobot_asr_add_command("kai deng", "1")` | asr.addCommand( |
| `dfrobot_asr_start` | Statement | (none) | `dfrobot_asr_start()` | asr.start();\n |
| `dfrobot_asr_read` | Value | (none) | `dfrobot_asr_read()` | asr.read() |
| `dfrobot_asr_set_i2c_addr` | Statement | ADDR(field_input) | `dfrobot_asr_set_i2c_addr("0x4F")` | asr.setI2CAddr( |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | LOOP, PASSWORD, BUTTON | dfrobot_asr_init |
| MIC_MODE | MIC, MONO | dfrobot_asr_init |

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

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
