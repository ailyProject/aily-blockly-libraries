# AccelStepper

高性能步进电机控制库，支持加减速和多电机同步控制

## 库信息
- **库名**: @aily-project/lib-accelstepper
- **版本**: 1.0.0
- **兼容**: Arduino全系列, ESP32, ESP8266

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `accelstepper_setup` | 语句块 | VAR(field_input), INTERFACE(field_dropdown), PIN1(input) | `"VAR":"stepper","INTERFACE":"4"` | `stepper = AccelStepper(4, pin1, pin2, pin3, pin4);` |
| `accelstepper_setup_driver` | 语句块 | VAR(field_input), PIN_STEP(input), PIN_DIR(input) | `"VAR":"stepper"` | `stepper = AccelStepper(AccelStepper::DRIVER, stepPin, dirPin);` |
| `accelstepper_move_to` | 语句块 | VAR(field_variable), POSITION(input) | `"VAR":{"id":"var_id"}` | `stepper.moveTo(position);` |
| `accelstepper_move` | 语句块 | VAR(field_variable), STEPS(input) | `"VAR":{"id":"var_id"}` | `stepper.move(steps);` |
| `accelstepper_run` | 语句块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `stepper.run();` |
| `accelstepper_run_speed` | 语句块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `stepper.runSpeed();` |
| `accelstepper_stop` | 语句块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `stepper.stop();` |
| `accelstepper_set_max_speed` | 语句块 | VAR(field_variable), SPEED(input) | `"VAR":{"id":"var_id"}` | `stepper.setMaxSpeed(speed);` |
| `accelstepper_set_speed` | 语句块 | VAR(field_variable), SPEED(input) | `"VAR":{"id":"var_id"}` | `stepper.setSpeed(speed);` |
| `accelstepper_get_speed` | 值块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `stepper.speed()` |
| `accelstepper_set_acceleration` | 语句块 | VAR(field_variable), ACCEL(input) | `"VAR":{"id":"var_id"}` | `stepper.setAcceleration(accel);` |
| `accelstepper_get_current_position` | 值块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `stepper.currentPosition()` |
| `accelstepper_set_current_position` | 语句块 | VAR(field_variable), POSITION(input) | `"VAR":{"id":"var_id"}` | `stepper.setCurrentPosition(position);` |
| `accelstepper_distance_to_go` | 值块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `stepper.distanceToGo()` |
| `accelstepper_is_running` | 值块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `stepper.isRunning()` |
| `accelstepper_enable_outputs` | 语句块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `stepper.enableOutputs();` |
| `accelstepper_disable_outputs` | 语句块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `stepper.disableOutputs();` |
| `accelstepper_run_to_position` | 语句块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `stepper.runToPosition();` |
| `accelstepper_run_to_new_position` | 语句块 | VAR(field_variable), POSITION(input) | `"VAR":{"id":"var_id"}` | `stepper.runToNewPosition(position);` |
| `accelstepper_run_speed_to_position` | 语句块 | VAR(field_variable) | `"VAR":{"id":"var_id"}` | `stepper.runSpeedToPosition();` |
| `accelstepper_set_enable_pin` | 语句块 | VAR(field_variable), PIN(input) | `"VAR":{"id":"var_id"}` | `stepper.setEnablePin(pin);` |
| `multistepper_create` | 语句块 | VAR(field_input) | `"VAR":"steppers"` | `steppers = MultiStepper();` |
| `multistepper_add_stepper` | 语句块 | STEPPER(field_variable), VAR(field_variable) | `"VAR":"steppers"` | `steppers.addStepper(stepper);` |
| `multistepper_move_to` | 语句块 | VAR(field_variable), POSITIONS(input) | `"VAR":"steppers"` | `steppers.moveTo(positions);` |
| `multistepper_positions_array` | 值块 | INPUT0(input), extraState | `"extraState":{"extraCount":1},"inputs":{"INPUT0":{"block":{},"INPUT1":{"block":{}}}}` | `{pos1, pos2, pos3, pos4}` |
| `multistepper_run` | 语句块 | VAR(field_variable) | `"VAR":"steppers"` | `steppers.run();` |
| `multistepper_run_speed_to_position` | 语句块 | VAR(field_variable) | `"VAR":"steppers"` | `steppers.runSpeedToPosition();` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "stepper"` |
| field_dropdown | 字符串 | `"INTERFACE": "4"` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"POSITION": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **初始化块**: 使用field_input让用户输入新变量名，自动注册到变量系统
- **方法调用块**: 使用field_variable选择已存在变量，配置variableTypes为["AccelStepper"]或["MultiStepper"]

## 使用示例

### 基础4线步进电机
```json
{
  "type": "accelstepper_setup",
  "id": "setup_id",
  "fields": {
    "VAR": "stepper",
    "INTERFACE": "4"
  },
  "inputs": {
    "PIN1": {
      "block": {
        "type": "math_number",
        "fields": {"NUM": 2}
      }
    }
  }
}
```

### 带加速控制的完整程序
```json
[
  {
    "type": "accelstepper_setup",
    "id": "setup_id",
    "fields": {"VAR": "stepper", "INTERFACE": "4"},
    "inputs": {"PIN1": {"block": {"type": "math_number", "fields": {"NUM": 2}}}},
    "next": {"block": "accelstepper_set_max_speed_id"}
  },
  {
    "type": "accelstepper_set_max_speed",
    "id": "set_max_speed_id",
    "fields": {"VAR": {"variable": "stepper"}},
    "inputs": {"SPEED": {"block": {"type": "math_number", "fields": {"NUM": 1000}}}},
    "next": {"block": "accelstepper_set_acceleration_id"}
  },
  {
    "type": "accelstepper_set_acceleration",
    "id": "accelstepper_set_acceleration_id",
    "fields": {"VAR": {"variable": "stepper"}},
    "inputs": {"ACCEL": {"block": {"type": "math_number", "fields": {"NUM": 100}}}}
  }
]
```

## 重要规则

1. **必须遵守**: run()和runSpeed()必须在loop中频繁调用，否则电机不会动作
2. **连接限制**: 初始化块后的方法调用块必须选择正确的电机变量
3. **常见错误**: 
   - ❌ 忘记在loop中调用run()
   - ❌ 没有设置最大速度和加速度就使用run()
   - ❌ 阻塞模式(runToPosition)会导致程序卡死

## 支持的接口类型

- **4线全步**: FULL4WIRE (4) - 4引脚全步进
- **2线全步**: FULL2WIRE (2) - 2引脚全步进
- **3线全步**: FULL3WIRE (3) - 3引脚全步进（如硬盘电机）
- **3线半步**: HALF3WIRE (6) - 3引脚半步进
- **4线半步**: HALF4WIRE (8) - 4引脚半步进
- **驱动模式**: DRIVER (1) - Step+Direction驱动器模式

## 使用模式

### 非阻塞模式（推荐）
```javascript
// setup中
stepper.moveTo(1000);
// loop中
stepper.run();  // 必须频繁调用
```

### 恒速模式
```javascript
// setup中
stepper.setSpeed(50);
// loop中
stepper.runSpeed();  // 恒速运行
```

### 阻塞模式（简单但不推荐）
```javascript
stepper.runToNewPosition(1000);  // 等待到达才继续
```

## MultiStepper 多电机同步控制

MultiStepper 类支持同时控制多达10个步进电机进行同步运动，适用于3D打印机、XY绘图仪等需要多轴协调运动的场景。

### 重要限制

1. **恒速运动**: MultiStepper 只支持恒速运动，不支持加速度控制
2. **最大电机数**: 最多可管理 10 个步进电机
3. **同步到达**: 所有添加的电机将以不同速度同时到达目标位置
4. **速度设置**: 使用 MultiStepper 前，必须为各个电机设置最大速度

### 使用步骤

1. **创建多个 AccelStepper 对象**: 为每个电机创建独立的 AccelStepper 对象
2. **设置各电机最大速度**: 为每个电机调用 setMaxSpeed() 设置最大速度
3. **创建 MultiStepper 对象**: 创建多电机控制器
4. **添加电机**: 将各个 AccelStepper 对象添加到 MultiStepper
5. **设置目标位置**: 使用 moveTo 设置所有电机的目标位置
6. **执行运动**: 在 loop 中频繁调用 run()
7. **设置合适速度**: 根据电机规格和负载设置合理的最大速度
8. **频繁调用 run()**: 在 loop 中尽可能频繁地调用 run()，确保运动流畅
9. **阻塞模式慎用**: `runSpeedToPosition()` 会阻塞程序，只在简单场景使用