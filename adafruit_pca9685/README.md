# adafruit_pca9685

PCA9685 I2C 16通道PWM舵机驱动库，支持舵机角度控制、PWM输出、微秒脉宽控制等功能。

## 库信息
- **库名**: @aily-project/lib-adafruit-pca9685
- **版本**: 1.0.0
- **兼容**: Arduino AVR/SAMD, ESP32, ESP8266, RP2040, Renesas UNO R4
- **I2C地址**: 0x40 (默认)

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `pca9685_create` | 语句 | VAR(input) | `"VAR":"pwm"` | `Adafruit_PWMServoDriver pwm;` |
| `pca9685_begin` | 语句 | VAR(var), ADDRESS(input) | `"VAR":{"id":"..."}` | `pwm.begin();` |
| `pca9685_set_freq` | 语句 | VAR(var), FREQ(input) | `"VAR":{"id":"..."}` | `pwm.setPWMFreq(60);` |
| `pca9685_set_servo_angle` | 语句 | VAR(var), CHANNEL/ANGLE(input) | `"VAR":{"id":"..."}` | `pwm.setPWM(ch,0,map(angle,0,180,100,700));` |
| `pca9685_set_pwm` | 语句 | VAR(var), CHANNEL/ON/OFF(input) | `"VAR":{"id":"..."}` | `pwm.setPWM(ch,on,off);` |
| `pca9685_set_microseconds` | 语句 | VAR(var), CHANNEL/MICROSECONDS(input) | `"VAR":{"id":"..."}` | `pwm.writeMicroseconds(ch,us);` |
| `pca9685_config_servo` | 语句 | VAR(input), MIN/MAX(input) | `"VAR":"pwm"` | 配置舵机范围 |
| `pca9685_set_all_servos` | 语句 | VAR(var), ANGLE(input) | `"VAR":{"id":"..."}` | 批量设置16通道 |
| `pca9685_sleep/wakeup` | 语句 | VAR(var) | `"VAR":{"id":"..."}` | `pwm.sleep/wakeup();` |
| `pca9685_set_servo_range` | 语句 | VAR(var), 多输入 | `"VAR":{"id":"..."}` | 自定义映射 |
| `pca9685_angle_to_pwm` | 值 | VAR(var), ANGLE(input) | `"VAR":{"id":"..."}` | `map(angle,0,180,100,700)` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "pwm"` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| input_value | 块连接 | `"inputs": {"CHANNEL": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **变量规则**:
  - `pca9685_create`, `pca9685_config_servo`使用`field_input`，.abi中为字符串
  - 其他方法块使用`field_variable`，.abi中为对象`{"id":"变量ID"}`
- **配置存储**: `pca9685_config_servo`设置的范围会被`pca9685_set_servo_angle`自动使用

## 使用示例

### 基础初始化
```json
{
  "type": "pca9685_create",
  "fields": {"VAR": "pwm"},
  "next": {
    "block": {
      "type": "pca9685_begin",
      "fields": {"VAR": {"id": "pwm_var_id"}},
      "inputs": {"ADDRESS": {"shadow": {"type": "math_number", "fields": {"NUM": 40}}}},
      "next": {
        "block": {
          "type": "pca9685_set_freq",
          "fields": {"VAR": {"id": "pwm_var_id"}},
          "inputs": {"FREQ": {"shadow": {"type": "math_number", "fields": {"NUM": 60}}}}
        }
      }
    }
  }
}
```

### 控制舵机
```json
{
  "type": "pca9685_set_servo_angle",
  "fields": {"VAR": {"id": "pwm_var_id"}},
  "inputs": {
    "CHANNEL": {"shadow": {"type": "math_number", "fields": {"NUM": 0}}},
    "ANGLE": {"shadow": {"type": "math_number", "fields": {"NUM": 90}}}
  }
}
```

## 重要规则

1. **初始化顺序**: create → begin → set_freq → (可选)config_servo
2. **I2C初始化**: 自动添加`Wire.begin()`，可被`aily_iic`覆盖
3. **地址格式**: 输入40自动转为0x40，简化输入
4. **舵机范围**: 默认PWM 100-700，可用`config_servo`自定义
5. **外部供电**: 舵机需要独立5-6V电源，不能用开发板供电
6. **通道编号**: 0-15，共16个通道

## 支持的参数

**PWM频率**: 50-60Hz (舵机标准)  
**PWM值**: 0-4095 (12位分辨率)  
**脉宽**: 500-2500μs (舵机标准范围)  
**默认舵机范围**: 100-700 PWM
