# IRremote Blockly 库

红外遥控收发（基于 Arduino-IRremote）的 Blockly 封装，覆盖常用初始化、读取、NEC 发送以及按键事件。

## 库信息
- **库名**: `@aily-project/lib-irremote`
- **版本**: `0.0.1`
- **兼容**: `arduino:avr`、`esp32:esp32`（3.3 V/5 V）

## 块定义
| 块类型 | 连接 | 字段/输入 | .abi格式关键字段 | 生成代码摘要 |
|--------|------|-----------|------------------|-------------|
| `QuickTesting` | 语句块 | `IRPIN(field_dropdown)` | `"IRPIN":"D2"` | `Serial.begin(115200); IrReceiver.begin(pin, ENABLE_LED_FEEDBACK); if (IrReceiver.decode()) { IrReceiver.printIRResultShort(&Serial); }` |
| `irrecv_begin_in` | 语句块 | `IRPININ(field_dropdown)` | `"IRPININ":"D2"` | `IrReceiver.begin(pin, ENABLE_LED_FEEDBACK);` |
| `irrecv_begin_out` | 语句块 | `IRPINOUT(field_dropdown)` | `"IRPINOUT":"D3"` | `IrReceiver.begin(pin);`（当前库沿用接收器，后续可扩展为 `IrSender`） |
| `irrecv_datain` | 语句块 | `IRDATA(input_statement)` | `"IRDATA":{"block":{...}}` | `if (IrReceiver.decode()) { ...用户语句...; IrReceiver.resume(); }` |
| `irrecv_irdata` | 值块 | _无字段_ | `{"type":"irrecv_irdata"}` | `IrReceiver.decodedIRData.command` |
| `irrecv_irsend` | 语句块 | `IRADDRESS(input_value)`, `IROUTDATA(input_value)` | `"IRADDRESS":{"block":{...}}` | `IrSender.sendNEC(address, data, 0);` |
| `irrecv_on_key` | Hat块 | `IRKEY(field_dropdown)`, `DEBOUNCE(input_value)`, `HANDLER(input_statement)` | `"IRKEY":"PLAY_PAUSE","inputs":{"DEBOUNCE":{"block":...}}` | 在 `loop()` 中注入 `if (IrReceiver.decode()) { ... 防抖判定 ... }` |

## 字段类型映射
| 类型 | .abi格式 | 示例 |
|------|----------|------|
| `field_dropdown` | 字符串 | `"IRKEY":"PLAY_PAUSE"` |
| `input_value` | 块连接 | `"inputs":{"DEBOUNCE":{"block":{...}}}` |
| `input_statement` | 块连接 | `"inputs":{"HANDLER":{"block":{...}}}` |
| `output`(值块) | 连接到父输入 | `"block":{"type":"irrecv_irdata"}` |

## 连接规则
- **语句块**：具备 `previousStatement`/`nextStatement`，在 `toolbox.json` 中按顺序拼接。
- **值块**：仅提供 `output`，需连接到其它块的 `input_value`。
- **Hat块**：无前后连接，依赖 `input_statement` 承载事件体，生成器自动通过 `addLoop` 插入 `loop()`。
- **自定义字段**：红外按键字段使用固定枚举值（详见下表），在 .abi 中以字符串保存。

## 使用示例

### 快速调试 + 事件触发
```json
{
  "type": "irrecv_begin_in",
  "fields": {"IRPININ": "4"},
  "next": {
    "block": {
      "type": "irrecv_on_key",
      "fields": {"IRKEY": "PLAY_PAUSE"},
      "inputs": {
        "DEBOUNCE": {
          "block": {"type": "math_number", "fields": {"NUM": 150}}
        },
        "HANDLER": {
          "block": {
            "type": "core_serial_println",
            "inputs": {"TEXT": {"block": {"type": "text", "fields": {"TEXT": "Play"}}}
            }
          }
        }
      }
    }
  }
}
```

### NEC 发射
```json
{
  "type": "irrecv_irsend",
  "inputs": {
    "IRADDRESS": {"block": {"type": "math_number", "fields": {"NUM": 0}}},
    "IROUTDATA": {"block": {"type": "math_number", "fields": {"NUM": 67}}}
  }
}
```

## 重要规则
1. **初始化先行**：使用任何接收或事件相关块前，必须放置 `QuickTesting` 或 `irrecv_begin_in` 以调用 `IrReceiver.begin`。
2. **Hat块自动入 loop**：`irrecv_on_key` 返回空字符串，但生成器会向 `loop()` 添加唯一段落；不要手动再写 `while(true)`。
3. **防抖时间**：`DEBOUNCE` 输入默认为 150 ms，可自定义；在一次按键释放期间只会触发一次。
4. **重复帧处理**：库内部利用 `_irremote_last_command` 记住上一条命令，遥控器 repeat 帧也会被识别。
5. **NEC 地址/数据**：`irrecv_irsend` 期望十进制数值，如需 0xFF 可在数值块中输入 `255` 或经变量计算。

## 支持的按键编码
| 选项 | 值(Decimal) |
|------|-------------|
| 频道- | 69 |
| 频道 | 70 |
| 频道+ | 71 |
| 上一曲 | 68 |
| 下一曲 | 64 |
| 播放/暂停 | 67 |
| 音量- | 7 |
| 音量+ | 21 |
| EQ | 9 |

## 连接限制与常见错误
- ❌ 忘记在 Hat 块中提供 `HANDLER` 语句 -> 事件会生成空体，无法执行任何动作。
- ❌ 将 Hat 块串在语句链上 -> Blockly 会拒绝连接；应单独放置。
- ❌ `DEBOUNCE` 设为 0 -> repeat 帧会被多次触发，慎用。
- ✅ 多个 Hat 块可以监听不同按键，生成器会使用 block.id 作为唯一 key，互不干扰。

（基于 [Arduino-IRremote](https://github.com/Arduino-IRremote/Arduino-IRremote) 5.x API）
