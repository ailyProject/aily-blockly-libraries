# EncoderMotor

编码电机控制库，支持PID速度闭环控制、PWM开环控制、角度测量。

## 库信息
- **库名**: @aily-project/lib-encoder-motor
- **版本**: 1.0.0
- **作者**: OpenJumper
- **兼容**: ESP32系列平台(ESP32/ESP32-S3/ESP32-C3等)
- **电压**: 3.3V / 5V

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `encoder_config` | 语句块 | PPR(field_number), REDUCTION(field_number) | `"fields":{"PPR":3,"REDUCTION":48}` | `EncoderMotor.begin(3,48)` |
| `encoder_set_pid` | 语句块 | MOTOR_ID(field_dropdown), P(input_value), I(input_value), D(input_value) | `"fields":{"MOTOR_ID":"0"},"inputs":{"P":{"block":{"type":"math_number","fields":{"NUM":5}}},"I":{"block":{"type":"math_number","fields":{"NUM":2}}},"D":{"block":{"type":"math_number","fields":{"NUM":1}}}}` | `g_encoder_motor_0.SetSpeedPid(5.0,2.0,1.0)` |
| `encoder_run_speed` | 语句块 | MOTOR_ID(field_dropdown), SPEED(input_value) | `"fields":{"MOTOR_ID":"0"},"inputs":{"SPEED":{"block":{"type":"math_number","fields":{"NUM":100}}}}` | `g_encoder_motor_0.RunSpeed(100)` |
| `encoder_run_pwm` | 语句块 | MOTOR_ID(field_dropdown), DUTY(input_value) | `"fields":{"MOTOR_ID":"0"},"inputs":{"DUTY":{"block":{"type":"math_number","fields":{"NUM":50}}}}` | `g_encoder_motor_0.RunPwmDuty(map(50,-100,100,-1023,1023))` |
| `encoder_stop` | 语句块 | MOTOR_ID(field_dropdown) | `"fields":{"MOTOR_ID":"0"}` | `g_encoder_motor_0.Stop()` |
| `encoder_get_degree` | 值块 | MOTOR_ID(field_dropdown) | `"fields":{"MOTOR_ID":"0"}` | `EncoderMotor.pulseToDegree(g_encoder_motor_0.EncoderPulseCount())` |
| `encoder_reset_degree` | 语句块 | MOTOR_ID(field_dropdown) | `"fields":{"MOTOR_ID":"0"}` | `g_encoder_motor_0.ResetPulseCount()` |
| `encoder_get_speed` | 值块 | MOTOR_ID(field_dropdown) | `"fields":{"MOTOR_ID":"0"}` | `g_encoder_motor_0.SpeedRpm()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_number | 数值 | `"PPR": 3`, `"REDUCTION": 48` |
| field_dropdown | 字符串 | `"MOTOR_ID": "0"` (EMR), `"MOTOR_ID": "1"` (EML), `"MOTOR_ID": "-1"` (全部) |
| input_value | 块连接 | `"inputs": {"SPEED": {"block": {"type": "math_number", "fields": {"NUM": 100}}}}` |

## 连接规则

- **语句块**: 配置块(encoder_config)、PID设置块(encoder_set_pid)、控制块(encoder_run_speed/encoder_run_pwm/encoder_stop)、重置块(encoder_reset_degree)有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 角度获取块(encoder_get_degree)、转速获取块(encoder_get_speed)有output，连接到`inputs`中，无`next`字段
- **特殊规则**: 
  - 配置块必须在setup()最前面使用，只需配置一次
  - MOTOR_ID字段支持三个选项：`"0"`(EMR右电机)、`"1"`(EML左电机)、`"-1"`(全部电机)
  - 速度闭环范围：-500 ~ 500 RPM，死区±10 RPM
  - PWM开环范围：-100 ~ 100，会自动映射到-1023 ~ 1023
  - 角度累计值单位为度(°)，通过脉冲计数自动换算

## 使用示例

### 示例1: 配置并启动电机
```json
{
  "type": "encoder_config",
  "fields": {"PPR": 3, "REDUCTION": 48},
  "next": {
    "block": {
      "type": "encoder_run_speed",
      "fields": {"MOTOR_ID": "0"},
      "inputs": {
        "SPEED": {"shadow": {"type": "math_number", "fields": {"NUM": 100}}}
      }
    }
  }
}
```

### 示例2: 设置PID参数
```json
{
  "type": "encoder_set_pid",
  "fields": {"MOTOR_ID": "-1"},
  "inputs": {
    "P": {"shadow": {"type": "math_number", "fields": {"NUM": 5}}},
    "I": {"shadow": {"type": "math_number", "fields": {"NUM": 2}}},
    "D": {"shadow": {"type": "math_number", "fields": {"NUM": 1}}}
  }
}
```

### 示例3: 角度控制
```json
{
  "type": "encoder_reset_degree",
  "fields": {"MOTOR_ID": "0"},
  "next": {
    "block": {
      "type": "controls_if",
      "inputs": {
        "IF0": {
          "block": {
            "type": "logic_compare",
            "fields": {"OP": "LT"},
            "inputs": {
              "A": {"block": {"type": "encoder_get_degree", "fields": {"MOTOR_ID": "0"}}},
              "B": {"shadow": {"type": "math_number", "fields": {"NUM": 360}}}
            }
          }
        },
        "DO0": {
          "block": {
            "type": "encoder_run_speed",
            "fields": {"MOTOR_ID": "0"},
            "inputs": {"SPEED": {"shadow": {"type": "math_number", "fields": {"NUM": 50}}}}
          }
        }
      },
      "next": {
        "block": {
          "type": "encoder_stop",
          "fields": {"MOTOR_ID": "0"}
        }
      }
    }
  }
}
```

### 示例4: PWM开环控制
```json
{
  "type": "encoder_run_pwm",
  "fields": {"MOTOR_ID": "-1"},
  "inputs": {
    "DUTY": {"shadow": {"type": "math_number", "fields": {"NUM": 50}}}
  }
}
```

## 重要规则

1. **配置顺序**: `encoder_config`块必须在setup()最前面使用，在所有电机控制块之前
2. **电机编号**: 
   - EMR (右电机) = `"MOTOR_ID": "0"`
   - EML (左电机) = `"MOTOR_ID": "1"`
   - 全部电机 = `"MOTOR_ID": "-1"`
3. **速度控制范围**: 
   - 速度闭环：-500 ~ 500 RPM
   - PWM开环：-100 ~ 100 (自动映射到PWM值-1023 ~ 1023)
   - 速度闭环有±10 RPM死区，低于此值电机不转
4. **PID参数**: 默认 P=5.0, I=2.0, D=1.0，可通过`encoder_set_pid`块修改
5. **角度测量**: 
   - 角度值为累计值，单位为度(°)
   - 通过编码器脉冲自动换算：`角度 = 脉冲数 / (PPR × 减速比) × 360`
   - 使用`encoder_reset_degree`清零角度计数
6. **转速测量**: 返回实时转速，单位为RPM(每分钟转数)
7. **常见错误**: 
   - ❌ 忘记配置块导致编码器不工作
   - ❌ 速度值超出范围-500~500
   - ❌ PWM值超出范围-100~100
   - ❌ 在loop()中重复调用配置块

## 硬件配置

### 默认引脚配置

#### 编码电机0 (EMR - 右电机)
| 功能 | 引脚 | 说明 |
|------|------|------|
| 电机正极 | GPIO12 | PWM控制 |
| 电机负极 | GPIO14 | PWM控制 |
| 编码器A相 | GPIO35 | 中断输入 |
| 编码器B相 | GPIO36 | 中断输入 |

#### 编码电机1 (EML - 左电机)
| 功能 | 引脚 | 说明 |
|------|------|------|
| 电机正极 | GPIO15 | PWM控制 |
| 电机负极 | GPIO17 | PWM控制 |
| 编码器A相 | GPIO34 | 中断输入 |
| 编码器B相 | GPIO39 | 中断输入 |

### 电机参数
- **PPR**: 每转脉冲数，默认3（霍尔编码器单圈脉冲数）
- **减速比**: 电机减速比，默认48（输出轴转一圈需要电机转48圈）
- **编码器相位**: B相领先A相为正转（可通过交换AB相线调整）

## 快速开始

### C++代码示例
```cpp
#include "EncoderMotor_Wrapper.h"

void setup() {
    Serial.begin(115200);
    
    // 初始化编码电机（PPR=3, 减速比=48）
    EncoderMotor.begin(3, 48);
    
    // 设置PID参数（可选）
    g_encoder_motor_0.SetSpeedPid(5.0, 2.0, 1.0);
}

void loop() {
    // 速度闭环控制：100 RPM
    g_encoder_motor_0.RunSpeed(100);
    
    // 获取当前转速和角度
    int speed = g_encoder_motor_0.SpeedRpm();
    float degree = EncoderMotor.pulseToDegree(g_encoder_motor_0.EncoderPulseCount());
    
    Serial.printf("Speed: %d RPM, Angle: %.2f°\n", speed, degree);
    delay(100);
}
```

## 版本历史

- v1.0.0: 初始版本
  - PID速度闭环控制
  - PWM开环控制
  - 实时转速测量
  - 累计角度测量
  - 双电机独立控制
