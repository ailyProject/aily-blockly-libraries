# SparkFun 触觉驱动 DA7280

SparkFun Qwiic Haptic Driver DA7280 的 Blockly 封装库，用于驱动 LRA 或 ERM 振动电机。

## Library Info
- **Name**: @aily-project/lib-sparkfun-haptic-da7280
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `haptic_da7280_init` | Statement | VAR(field_input), MOTOR_TYPE(dropdown) | `haptic_da7280_init("haptic", LRA)` | `Haptic_Driver haptic; haptic.begin(); haptic.setActuatorType(0); haptic.setOperationMode(DRO_MODE); haptic.defaultMotor();` |
| `haptic_da7280_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `haptic_da7280_set_mode(variables_get($haptic), DRO)` | `haptic.setOperationMode(1);` |
| `haptic_da7280_enable_accel` | Statement | VAR(field_variable), STATE(dropdown) | `haptic_da7280_enable_accel(variables_get($haptic), ENABLE)` | `haptic.enableAcceleration(true);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MOTOR_TYPE | LRA(0), ERM(1) | 电机类型：线性谐振驱动或偏心旋转质量 |
| MODE | 0=停用, 1=DRO, 3=RTWM, 4=ETWM | 操作模式 |
| STATE | true(启用), false(禁用) | 加速反馈开关 |

## Notes

1. 初始化后默认进入 DRO_MODE 并调用 `defaultMotor()` 设置默认参数
2. DRO 模式下通过 I2C 直接控制振动输出
3. 电机类型必须与实际连接的电机匹配

## ABS Examples

### 基本振动
```
arduino_setup()
    haptic_da7280_init("haptic", LRA)
    haptic_da7280_set_mode(variables_get($haptic), DRO)
    haptic_da7280_enable_accel(variables_get($haptic), ENABLE)
```
