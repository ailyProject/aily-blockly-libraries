# sentry2

Sentry2视觉传感器库，支持颜色识别、色块检测、人脸识别、二维码识别等多种视觉算法

## 库信息
- **库名**: @aily-project/lib-sentry2
- **版本**: 2.2.0
- **兼容**: Arduino全系列平台(ESP32/ESP8266/AVR/SAMD/STM32/RP2040等)

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `sentry2_begin_i2c` | 语句块 | WIRE(field_dropdown) | `"fields":{"WIRE":"Wire"}` | `sentry.begin(&Wire)` |
| `sentry2_camera_set_awb` | 语句块 | AWB(field_dropdown) | `"fields":{"AWB":"kAutoWhiteBalance"}` | `sentry.CameraSetAwb(kAutoWhiteBalance)` |
| `sentry2_vision_set` | 语句块 | VISION_STA(field_dropdown), VISION_TYPE(field_dropdown) | `"fields":{"VISION_STA":"ON","VISION_TYPE":"Sentry2::kVisionColor"}` | `sentry.VisionBegin(kVisionColor)` |
| `sentry2_set_param_num` | 语句块 | VISION_TYPE(field_dropdown), NUM(field_number) | `"fields":{"VISION_TYPE":"Sentry2::kVisionColor","NUM":"1"}` | `sentry.SetParamNum(kVisionColor,1)` |
| `sentry2_set_color_param` | 语句块 | XVALUE/YVALUE/WIDTH/HIGHT/NUM(field_number) | `"fields":{"XVALUE":"50","YVALUE":"50","WIDTH":"3","HIGHT":"4","NUM":"1"}` | `sentry.SetParam(kVisionColor,...)` |
| `sentry2_set_blob_param` | 语句块 | WIDTH/HIGHT(field_number), COLOR(field_dropdown), NUM(field_number) | `"fields":{"WIDTH":"3","HIGHT":"4","COLOR":"kColorRed","NUM":"1"}` | `sentry.SetParam(kVisionBlob,...)` |
| `sentry2_detected` | 值块 | VISION_TYPE(field_dropdown), COLOR/CARD(field_dropdown), NUM(field_number) | `"fields":{"VISION_TYPE":"Sentry2::kVisionColor","COLOR":"kColorRed","NUM":"1"}` | `sentry.GetValue(kVisionColor,...)` 返回Boolean |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown(WIRE) | 字符串 | `"WIRE": "Wire"` (从board.json获取) |
| field_dropdown(AWB) | 字符串 | `"AWB": "kAutoWhiteBalance"` |
| field_dropdown(VISION_STA) | 字符串 | `"VISION_STA": "ON"` 或 `"OFF"` |
| field_dropdown(VISION_TYPE) | 字符串 | `"VISION_TYPE": "Sentry2::kVisionColor"` |
| field_dropdown(COLOR) | 字符串 | `"COLOR": "kColorRed"` |
| field_number | 数值字符串 | `"NUM": "1"`, `"XVALUE": "50"` |

## 连接规则

- **语句块**: 初始化块(sentry2_begin_i2c)、配置块(sentry2_camera_set_awb/vision_set)、参数设置块有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 检测结果块(sentry2_detected)有output，连接到`inputs`中，无`next`字段
- **特殊规则**:
  - 初始化块必须在setup()中执行，默认I2C地址0x60
  - 使用前需先开启对应的视觉算法
  - 支持11种视觉算法：颜色识别、色块检测、标签识别、线条检测、深度学习、卡片识别、人脸识别、20类物体、二维码、自定义、运动检测
  - 颜色识别和色块检测支持最多25组参数

### 动态选项处理
当遇到`"options": "${board.i2c}"`格式时，从board.json获取I2C接口数组

## 使用示例

### 颜色识别示例
```json
{
  "type": "sentry2_begin_i2c",
  "fields": {"WIRE": "Wire"},
  "next": {
    "block": {
      "type": "sentry2_vision_set",
      "fields": {"VISION_STA": "ON", "VISION_TYPE": "Sentry2::kVisionColor"},
      "next": {
        "block": {
          "type": "sentry2_set_color_param",
          "fields": {"XVALUE": "80", "YVALUE": "60", "WIDTH": "20", "HIGHT": "20", "NUM": "1"},
          "next": {
            "block": {
              "type": "controls_repeat_ext",
              "inputs": {
                "TIMES": {"block": {"type": "math_number", "fields": {"NUM": "infinity"}}},
                "DO": {
                  "block": {
                    "type": "controls_if",
                    "inputs": {
                      "IF0": {
                        "block": {
                          "type": "sentry2_detected",
                          "fields": {"VISION_TYPE": "Sentry2::kVisionColor", "COLOR": "kColorRed", "NUM": "1"}
                        }
                      },
                      "DO0": {
                        "block": {
                          "type": "serial_println",
                          "fields": {"SERIAL": "Serial"},
                          "inputs": {
                            "VAR": {
                              "shadow": {"type": "text", "fields": {"TEXT": "检测到红色"}}
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: 初始化块必须在setup()中执行，I2C地址默认0x60，使用前必须开启对应算法，块ID必须唯一
2. **连接限制**: 初始化块和配置块是语句块有next连接，检测结果块是值块无next字段，只能作为input_value使用
3. **算法限制**: 同时开启多个算法会影响性能，建议根据需求选择1-2个算法
4. **参数范围**: 坐标范围0-100(相对位置)，参数组编号1-25，颜色识别区域不宜过小
5. **常见错误**:
   - ❌ 未初始化就使用检测功能
   - ❌ 未开启算法就检测结果
   - ❌ I2C地址设置错误
   - ❌ 参数组编号超出范围
   - ❌ 光照条件不佳导致识别不准
   - ❌ 同时开启过多算法导致性能下降

## 支持的字段选项

### AWB(白平衡模式)
- `"kAutoWhiteBalance"`: 自动白平衡
- `"kLockWhiteBalance"`: 锁定白平衡
- `"kWhiteLight"`: 白光模式
- `"kYellowLight"`: 黄光模式
- `"kWhiteBalanceCalibrating"`: 校准模式

### VISION_TYPE(视觉算法)
- `"Sentry2::kVisionColor"`: 颜色识别
- `"Sentry2::kVisionBlob"`: 色块检测
- `"Sentry2::kVisionAprilTag"`: 标签识别
- `"Sentry2::kVisionLine"`: 线条检测
- `"Sentry2::kVisionLearning"`: 深度学习
- `"Sentry2::kVisionCard"`: 卡片识别
- `"Sentry2::kVisionFace"`: 人脸识别
- `"Sentry2::kVision20Classes"`: 20类物体
- `"Sentry2::kVisionQrCode"`: 二维码
- `"Sentry2::kVisionCustom"`: 自定义
- `"Sentry2::kVisionMotionDetect"`: 运动检测

### COLOR(颜色选项)
- `"kColorRed"`: 红色
- `"kColorGreen"`: 绿色
- `"kColorBlue"`: 蓝色
- `"kColorYellow"`: 黄色
- `"kColorBlack"`: 黑色
- `"kColorWhite"`: 白色