# IOBOX电机驱动库

IOBOX电机驱动库，用于控制IOBOX电机驱动板上的直流电机。

## 库信息
- **库名**: @aily-project/lib-iobox-motor
- **版本**: 1.0.0
- **兼容**: microbit、microbit V2、mpython、ESP32、ESP32-S3

## 功能特性

- 支持M1和M2两个独立电机控制
- 支持同时控制两个电机
- 支持电机速度调节(0-255)
- 支持电机方向控制(顺时针/逆时针)
- 支持电机停止功能
- 基于I2C通信协议

## 硬件支持

- microbit
- microbit V2
- mpython
- ESP32
- ESP32-S3

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `iobox_motor_init` | 语句块 | 无 | 无 | `IOBOX_Motor motor;` |
| `iobox_motor_run` | 语句块 | INDEX(field_dropdown), DIRECTION(field_dropdown), SPEED(input_value) | `"INDEX":"0","DIRECTION":"0"` | `motor.motorRun(0, 0, 255);` |
| `iobox_motor_stop` | 语句块 | INDEX(field_dropdown) | `"INDEX":"0"` | `motor.motorStop(0);` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"INDEX": "0"` |
| input_value | 块连接 | `"inputs": {"SPEED": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **重要规则**: iobox_motor_init块必须首先使用，用于初始化IOBOX_Motor对象

## 使用示例

### 基础使用

1. 初始化IOBOX电机驱动
2. 控制M1电机以最大速度顺时针旋转
3. 停止M1电机

### 初始化IOBOX电机驱动
```json
{
  "type": "iobox_motor_init",
  "id": "init_motor"
}
```

### 控制M1电机以最大速度顺时针旋转
```json
{
  "type": "iobox_motor_run",
  "fields": {
    "INDEX": "0",
    "DIRECTION": "0"
  },
  "inputs": {
    "SPEED": {"block": {"type": "math_number", "fields": {"NUM": 255}}}
  }
}
```

### 停止M1电机
```json
{
  "type": "iobox_motor_stop",
  "fields": {
    "INDEX": "0"
  }
}
```

## 重要规则

1. **必须遵守**: iobox_motor_init块必须首先使用，用于初始化IOBOX_Motor对象
2. **全局对象**: IOBOX_Motor motor 是全局对象，所有块直接调用
3. **速度范围**: 0-255，超过255会自动限制为255
4. **电机索引**: 0=M1, 1=M2, 2=全部
5. **方向控制**: 0=顺时针, 1=逆时针
6. **常见错误**: 
   - ❌ 未初始化就使用电机控制块
   - ❌ 速度设置超过255
   - ❌ 使用了错误的电机索引

## 技术规格

- 通信接口：I2C
- I2C地址：0x10
- 电机数量：2个
- 速度范围：0-255
- 方向控制：顺时针、逆时针

## 依赖库

- Wire.h (I2C通信)
- IOBOX_Motor.h

## 注意事项

1. 使用前必须先初始化IOBOX电机驱动
2. 速度范围为0-255，超过255会自动限制为255
3. 电机停止实际上是将速度设为0
4. 确保I2C地址正确（默认0x10）

## 设计说明

### 关于变量重命名监听机制

IOBOX_Motor库使用固定的全局对象名"motor"，而不是可变变量名。因此，该库不需要实现变量重命名监听机制（renameVariableInBlockly和setValidator）。验证脚本中的相关警告可以安全忽略。

如果需要添加调试输出，请确保在setup()中调用Serial.begin(115200);
