# OpenJumper ASR 离线语音识别

OpenJumper离线语音识别模块，支持118条预设语音指令，软串口通信，免联网语音控制

## 库信息
- **库名**: @aily-project/lib-asr
- **版本**: 0.0.1
- **兼容**: 通用（Arduino UNO/Nano、ESP32/ESP8266等支持软串口的板卡）

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `openjumper_asr_init` | 语句块 | RX_PIN(dropdown), TX_PIN(dropdown) | `"RX_PIN":"2", "TX_PIN":"3"` | `asr.begin(115200);` |
| `openjumper_asr_data` | 语句块 | 无 | 无字段 | `asr.asrRun();` |
| `openjumper_asr_rincmd` | 值块(Boolean) | ASR_CMD(dropdown) | `"ASR_CMD":"1"` | `asr.asrDate == 1` |
| `openjumper_asr_state` | 值块(Boolean) | 无 | 无字段 | `asr.WakeUpStatus` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown(引脚) | 字符串 | `"RX_PIN": "2"` |
| field_dropdown(指令) | 字符串 | `"ASR_CMD": "1"` (0-118的指令编号) |

## 连接规则

- **语句块**: `openjumper_asr_init`和`openjumper_asr_data`有previousStatement/nextStatement，通过`next`字段连接
- **值块**: `openjumper_asr_rincmd`和`openjumper_asr_state`有output:"Boolean"，连接到条件判断的`inputs`中，无`next`字段
- **初始化顺序**: 必须先调用`openjumper_asr_init`初始化，再使用其他块
- **数据解析**: `openjumper_asr_data`需在loop中持续调用才能更新识别状态

### 动态选项处理
`RX_PIN`和`TX_PIN`字段使用`"options": "${board.digitalPins}"`，需从board.json获取数字引脚选项

## 使用示例

### 语音控制LED
```json
{
  "type": "openjumper_asr_init",
  "id": "init1",
  "fields": {
    "RX_PIN": "2",
    "TX_PIN": "3"
  }
}
```

```json
{
  "type": "openjumper_asr_data",
  "id": "parse1",
  "next": {
    "block": {
      "type": "controls_if",
      "inputs": {
        "IF0": {
          "block": {
            "type": "openjumper_asr_rincmd",
            "fields": {"ASR_CMD": "39"}
          }
        },
        "DO0": {
          "block": {
            "type": "io_digital_write",
            "fields": {"PIN": "13", "STAT": "1"}
          }
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**
   - 所有块的`id`字段必须唯一
   - 初始化块必须在setup中调用，数据解析块必须在loop中调用
   - ASR_CMD取值范围：0-118（对应118条预设指令）

2. **连接限制**
   - 值块不能有`next`字段
   - 语句块必须通过`next`或`inputs`中的`statement`字段连接
   - `openjumper_asr_rincmd`和`openjumper_asr_state`只能连接到接受Boolean类型的输入

3. **常见错误**
   - ❌ 值块添加`next`字段：`{"type":"openjumper_asr_state", "next":{...}}`
   - ❌ 未初始化就使用：直接使用`openjumper_asr_data`而没有先调用`openjumper_asr_init`
   - ❌ ASR_CMD超出范围：`"ASR_CMD":"200"`（最大118）

## 支持的语音指令分类

| 分类 | 编号范围 | 示例指令 |
|------|----------|----------|
| 智能家居 | 0-71 | 打开空调(1)、关闭空调(2)、打开客厅灯(39)、关闭客厅灯(40) |
| 机器人控制 | 72-102 | 启动小车(72)、前进(87)、后退(88)、左转(89)、右转(90) |
| 场景模式 | 103-118 | 观影模式(107)、工作模式(110)、早上好(113)、晚安(114) |

**唤醒词**: "语音管家"(指令0)，需先唤醒才能识别其他指令
