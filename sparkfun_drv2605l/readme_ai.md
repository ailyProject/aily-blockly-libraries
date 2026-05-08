# SparkFun DRV2605L 触感电机驱动

I2C 接口触感电机驱动库，通过 `SFE_HMD_DRV2605L` 对象控制振动效果。

## Library Info
- **Name**: @aily-project/lib-sparkfun-drv2605l
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `drv2605l_init` | Statement | VAR(field_input) | `drv2605l_init("haptic")` | `SFE_HMD_DRV2605L haptic; Wire.begin(); haptic.begin();` |
| `drv2605l_mode` | Statement | VAR(field_variable), MODE(field_dropdown) | `drv2605l_mode(variables_get($haptic), INTERNAL_TRIGGER)` | `haptic.Mode(0x00);` |
| `drv2605l_motor_select` | Statement | VAR(field_variable), TYPE(field_dropdown) | `drv2605l_motor_select(variables_get($haptic), ERM)` | `haptic.MotorSelect(0x00);` |
| `drv2605l_library` | Statement | VAR(field_variable), LIB(field_number) | `drv2605l_library(variables_get($haptic), 1)` | `haptic.Library(1);` |
| `drv2605l_waveform` | Statement | VAR(field_variable), SEQ(field_number), WAV(field_number) | `drv2605l_waveform(variables_get($haptic), 0, 1)` | `haptic.Waveform(0, 1);` |
| `drv2605l_go` | Statement | VAR(field_variable) | `drv2605l_go(variables_get($haptic))` | `haptic.go();` |
| `drv2605l_stop` | Statement | VAR(field_variable) | `drv2605l_stop(variables_get($haptic))` | `haptic.stop();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | 0x00~0x05 | 工作模式（内部触发/外部/PWM/音频/RTP）|
| TYPE | 0x00(ERM), 0x08(LRA) | 电机类型 |
| LIB | 0-7 | 波形库（1-6 ERM，7 LRA）|
| SEQ | 0-7 | 序列位置 |
| WAV | 0-123 | 波形编号（0=停止）|

## ABS Examples

```
arduino_setup()
    drv2605l_init("haptic")
    drv2605l_mode(variables_get($haptic), INTERNAL_TRIGGER)
    drv2605l_motor_select(variables_get($haptic), ERM)
    drv2605l_library(variables_get($haptic), 1)
    drv2605l_waveform(variables_get($haptic), 0, 1)
    drv2605l_waveform(variables_get($haptic), 1, 0)
    drv2605l_go(variables_get($haptic))
```
