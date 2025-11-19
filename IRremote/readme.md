# @aily-project/lib-irremote

基于 Arduino-IRremote 的红外遥控 Blockly 封装，支持接收、发送以及预置遥控器按键匹配。

## 库信息
- **库名**: `@aily-project/lib-irremote`
- **版本**: `0.0.3`
- **兼容**: Arduino AVR / ESP32 / ESP8266 / RP2040 等 3.3V~5V 开发板

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi 格式 | 生成代码 |
|--------|------|-----------|-----------|----------|
| `irremote_library_config` | 语句 | `RAW_LENGTH(input_value)`, `UNIVERSAL/EXOTIC(field_checkbox)` | `{"inputs":{"RAW_LENGTH":{"shadow":{"type":"math_number","fields":{"NUM":200}}}},"fields":{"UNIVERSAL":"TRUE","EXOTIC":"TRUE"}}` | `#define RAW_BUFFER_LENGTH ...` / `#define EXCLUDE_*` |
| `irremote_receiver_begin` | 语句 | `PIN(input_value)` | `{"inputs":{"PIN":{"block":{"type":"io_pin_digi"}}}}` | `IrReceiver.begin(pin);` |
| `irremote_on_receive` | 语句 | `DO(input_statement)` | `{"inputs":{"DO":{"block":{"type":"controls_if"}}}}` | `if (IrReceiver.decode()) { ... IrReceiver.resume(); }` |
| `irremote_receiver_available` | 值 | - | `{"output":"Boolean"}` | `IrReceiver.available()` |
| `irremote_get_value` | 值 | `FIELD(field_dropdown)` | `{"fields":{"FIELD":"COMMAND"}}` | `IrReceiver.decodedIRData.command` |
| `irremote_get_protocol` | 值 | `FORMAT(field_dropdown)` | `{"fields":{"FORMAT":"NAME"}}` | `String(IrReceiver.getProtocolString())` / `IrReceiver.decodedIRData.protocol` |
| `irremote_is_preset_key` | 值 | `KEY(field_dropdown)` | `{"fields":{"KEY":"69"}}` | `IrReceiver.decodedIRData.command == 69` |
| `irremote_get_preset_name` | 值 | - | `{"output":"String"}` | `String(ailyIrremoteGetPresetKeyName(IrReceiver.decodedIRData.command))` |
| `irremote_check_flag` | 值 | `FLAG(field_dropdown)` | `{"fields":{"FLAG":"REPEAT"}}` | `(IrReceiver.decodedIRData.flags & IRDATA_FLAGS_IS_REPEAT) != 0` |
| `irremote_resume` | 语句 | - | `{"previousStatement":null,"nextStatement":null}` | `IrReceiver.resume();` |
| `irremote_sender_begin` | 语句 | `PIN(input_value)` | `{"inputs":{"PIN":{"block":{"type":"io_pin_digi"}}}}` | `IrSender.begin(pin);` |
| `irremote_send_command` | 语句 | `PROTOCOL(field_dropdown)`, `ADDRESS/COMMAND/REPEAT(input_value)` | `{"inputs":{"ADDRESS":{"shadow":{"type":"math_number","fields":{"NUM":0}}},"COMMAND":{"shadow":{"type":"math_number","fields":{"NUM":165}}},"REPEAT":{"shadow":{"type":"math_number","fields":{"NUM":0}}}}}` | `IrSender.write(protocol, address, command, repeat);` |

## 字段类型映射

| 类型 | .abi 表达 | 说明 |
|------|-----------|------|
| `field_dropdown` | `"fields":{"FLAG":"REPEAT"}` | 选择协议、标志或预置按键 |
| `input_value` | `"inputs":{"PIN":{"block":{"type":"io_pin_digi"}}}` | 引脚、地址、命令、重复次数等参数 |
| `input_statement` | `"inputs":{"DO":{"block":{"type":"controls_if"}}}` | 接收回调内部执行逻辑 |
| `output` | `"output":"Boolean"` | 返回布尔/数字/字符串值 |

## 连接规则
- `irremote_receiver_begin` / `irremote_sender_begin` 只能放在 `setup()` 中执行一次。
- `irremote_on_receive`、`irremote_resume`、`irremote_send_command` 是普通语句块，可串接在 `loop()`。
- `irremote_receiver_available`、`irremote_get_value`、`irremote_get_protocol`、`irremote_is_preset_key`、`irremote_get_preset_name`、`irremote_check_flag` 为值块，可嵌入逻辑或数学运算。
- `irremote_is_preset_key` 与 `irremote_get_preset_name` 均依赖预置命令表，无需串口抓码即可判断按键。

## 使用示例

### 接收并打印预置按键
```json
{
  "type": "irremote_on_receive",
  "inputs": {
    "DO": {
      "block": {
        "type": "serial_println",
        "inputs": {
          "VAR": {
            "block": {
              "type": "irremote_get_preset_name"
            }
          }
        }
      }
    }
  }
}
```

### 判断音量加键
```json
{
  "type": "controls_if",
  "inputs": {
    "IF0": {
      "block": {
        "type": "irremote_is_preset_key",
        "fields": {"KEY": "21"}
      }
    },
    "DO0": {
      "block": {
        "type": "serial_println",
        "inputs": {
          "VAR": {"block": {"type": "text", "fields": {"TEXT": "Volume Up"}}}
        }
      }
    }
  }
}
```

## 重要规则
1. `IrReceiver.begin` 和 `IrSender.begin` 必须在 `setup()` 调用一次；使用 `irremote_on_receive` 时需让 `IrReceiver.resume()` 保持接收。
2. 预置按键基于常见 NEC 遥控器命令值：`CH_MINUS(69)`、`VOL_UP(21)`、`NUM_0(22)` 等，可直接用于判定。
3. `irremote_get_preset_name` 在未匹配时返回空字符串，可通过判断 `== ""` 来区分。
4. 如需自定义其它遥控器，只需继续使用 `irremote_get_value` / `irremote_is_preset_key` 与 `math_number` 搭配即可。
