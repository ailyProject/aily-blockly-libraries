# adafruit_pca9685

PCA9685 I2C 16通道PWM舵机驱动库，支持舵机角度控制、通道独立配置、图形化角度选择等功能。

## 库信息
- **库名**: @aily-project/lib-adafruit-pca9685
- **版本**: 1.0.0
- **兼容**: Arduino AVR/SAMD, ESP32, ESP8266, RP2040, Renesas UNO R4
- **I2C地址**: 0x40 (默认)
- **特色**: 支持通道独立角度-PWM映射、图形化角度选择

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `pca9685_begin` | 语句 | VAR(input), ADDRESS(input), WIRE(dropdown) | `"VAR":"pwm"` | `Adafruit_PWMServoDriver pwm;` + setup中初始化 |
| `pca9685_set_freq` | 语句 | VAR(var), FREQ(input) | `"VAR":{"id":"..."}` | `pwm.setPWMFreq(60);` |
| `pca9685_set_servo_angle` | 语句 | VAR(var), CHANNEL(input), ANGLE(input) | `"VAR":{"id":"..."}` | `pwm.setPWM(ch,0,map(angle,0,180,100,700));` |
| `pca9685_config_servo` | 语句 | VAR(input), MIN(input), MAX(input) | `"VAR":"pwm"` | 配置全局PWM范围 |
| `pca9685_set_servo_range` | 语句 | VAR(var), CHANNEL(input), 角度/PWM输入 | `"VAR":{"id":"..."}` | 配置通道独立映射 |
| `pca9685_set_all_servos` | 语句 | VAR(var), ANGLE(input) | `"VAR":{"id":"..."}` | 批量设置16通道 |
| `pca9685_sleep` | 语句 | VAR(var) | `"VAR":{"id":"..."}` | `pwm.sleep();` |
| `pca9685_wakeup` | 语句 | VAR(var) | `"VAR":{"id":"..."}` | `pwm.wakeup();` |
| `pca9685_angle` | 值块 | ANGLE(field_angle) | - | 图形化角度选择器 |

## 字段类型映射

| 类型 | .abi格式 | 示例 | 说明 |
|------|----------|------|------|
| field_input | 字符串 | `"VAR": "pwm"` | 初始化块，创建新变量 |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` | 方法调用块，引用已有变量 |
| field_angle | 数字 | `"ANGLE": 90` | 图形化角度选择 |
| input_value | 块连接 | `"inputs": {"CHANNEL": {"block": {...}}}` | 支持动态表达式 |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **变量规则**:
  - `pca9685_begin`, `pca9685_config_servo`使用`field_input`，.abi中为字符串（创建新变量）
  - 其他方法块使用`field_variable`，.abi中为对象`{"id":"变量ID"}`（引用已有变量）
- **配置层次**:
  - 全局配置: `pca9685_config_servo`设置所有通道默认PWM范围
  - 通道配置: `pca9685_set_servo_range`为特定通道设置独立的角度-PWM映射
  - 优先级: 通道配置 > 全局配置 > 默认值(100-700)

## 使用示例

### 基础初始化
```json
{
  "type": "pca9685_begin",
  "fields": {"VAR": "pwm", "WIRE": "Wire"},
  "inputs": {
    "ADDRESS": {"shadow": {"type": "math_number", "fields": {"NUM": 40}}}
  },
  "next": {
    "block": {
      "type": "pca9685_set_freq",
      "fields": {"VAR": {"id": "pwm_var_id"}},
      "inputs": {"FREQ": {"shadow": {"type": "math_number", "fields": {"NUM": 60}}}}
    }
  }
}
```

### 控制舵机（图形化角度选择）
```json
{
  "type": "pca9685_set_servo_angle",
  "fields": {"VAR": {"id": "pwm_var_id"}},
  "inputs": {
    "CHANNEL": {"shadow": {"type": "math_number", "fields": {"NUM": 0}}},
    "ANGLE": {"shadow": {"type": "pca9685_angle", "fields": {"ANGLE": 90}}}
  }
}
```

### 通道独立配置
```json
{
  "type": "pca9685_set_servo_range",
  "fields": {"VAR": {"id": "pwm_var_id"}},
  "inputs": {
    "CHANNEL": {"shadow": {"type": "math_number", "fields": {"NUM": 0}}},
    "MIN_ANGLE": {"shadow": {"type": "pca9685_angle", "fields": {"ANGLE": 0}}},
    "MIN_PWM": {"shadow": {"type": "math_number", "fields": {"NUM": 100}}},
    "MAX_ANGLE": {"shadow": {"type": "pca9685_angle", "fields": {"ANGLE": 180}}},
    "MAX_PWM": {"shadow": {"type": "math_number", "fields": {"NUM": 700}}}
  }
}
```

## 重要规则

1. **初始化顺序**: `pca9685_begin` → `pca9685_set_freq` → (可选)`pca9685_config_servo`
2. **初始化机制**: `pca9685_begin`同时完成变量创建和对象初始化，初始化代码自动放入`setup()`
3. **I2C支持**: 支持多总线，通过WIRE下拉框选择，自动添加`Wire.begin()`
4. **地址格式**: 直接使用输入值，无需转换
5. **舵机范围**: 
   - 默认: PWM 100-700 (0-180°)
   - 全局配置: `pca9685_config_servo`设置所有通道
   - 通道配置: `pca9685_set_servo_range`为单个通道设置独立映射
6. **图形化角度**: 使用`pca9685_angle`块提供圆形拖拽角度选择
7. **外部供电**: 舵机需要独立5-6V电源，不能用开发板供电
8. **通道编号**: 0-15，共16个通道

## 支持的参数

**PWM频率**: 50-60Hz (舵机标准)  
**PWM值**: 0-4095 (12位分辨率)  
**脉宽**: 500-2500μs (舵机标准范围)  
**默认舵机范围**: 100-700 PWM
