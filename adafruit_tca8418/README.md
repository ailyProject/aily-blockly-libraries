# adafruit_tca8418

TCA8418 I2C键盘矩阵和GPIO扩展器驱动库，支持8x10矩阵扫描、GPIO控制和事件处理。

## 库信息
- **库名**: @aily-project/lib-adafruit-tca8418
- **版本**: 1.0.0
- **兼容**: Arduino AVR/SAMD, ESP32, ESP8266, RP2040, Renesas UNO R4
- **I2C地址**: 0x34 (默认为52)

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `tca8418_create` | 语句 | VAR(input) | `"VAR":"keypad"` | `Adafruit_TCA8418 keypad;` |
| `tca8418_begin` | 语句 | VAR(input), ADDRESS(input) | `"VAR":"keypad"` | `keypad.begin(0x34);` |
| `tca8418_matrix` | 语句 | VAR(input), ROWS/COLUMNS(input) | `"VAR":"keypad"` | `keypad.matrix(4,3);` |
| `tca8418_available` | 值 | VAR(var) | `"VAR":{"id":"..."}` | `keypad.available()` |
| `tca8418_get_event` | 值 | VAR(var) | `"VAR":{"id":"..."}` | `keypad.getEvent()` |
| `tca8418_flush` | 语句 | VAR(var) | `"VAR":{"id":"..."}` | `keypad.flush();` |
| `tca8418_when_key_event` | Hat | VAR(var), HANDLER(stmt) | `"VAR":{"id":"..."}` | 自动loop |
| `tca8418_current_event` | 值 | VAR(var) | `"VAR":{"id":"..."}` | `_keypad_current_event` |
| `tca8418_get_event_row/col/pressed` | 值 | VAR(var), EVENT(input) | `"VAR":{"id":"..."}` | 事件解析 |
| `tca8418_pin_mode` | 语句 | VAR(var), PIN(input), MODE(drop) | `"MODE":"INPUT"` | `pinMode(0,INPUT);` |
| `tca8418_digital_read` | 值 | VAR(var), PIN(input) | `"VAR":{"id":"..."}` | `digitalRead(0)` |
| `tca8418_digital_write` | 语句 | VAR(var), PIN(input), LEVEL(drop) | `"LEVEL":"HIGH"` | `digitalWrite(0,HIGH);` |
| `tca8418_enable/disable_*` | 语句 | VAR(var) | `"VAR":{"id":"..."}` | `enable/disableXxx();` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "keypad"` |
| field_variable | 对象 | `"VAR": {"id": "variable_id"}` |
| field_dropdown | 字符串 | `"MODE": "INPUT"` |
| input_value | 块连接 | `"inputs": {"ADDRESS": {"block": {...}}}` |
| input_statement | 块连接 | `"inputs": {"HANDLER": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **Hat块**: `tca8418_when_key_event`无连接属性，自动添加到loop中
- **变量规则**:
  - `tca8418_create`, `tca8418_begin`, `tca8418_matrix`使用`field_input`，.abi中为字符串
  - 其他方法块使用`field_variable`，.abi中为对象格式`{"id":"变量ID"}`
- **事件处理**: Hat块自动创建事件变量`_keypad_current_event`存储当前事件

## 使用示例

### 基础初始化
```json
{
  "type": "tca8418_create",
  "fields": {"VAR": "keypad"},
  "next": {
    "block": {
      "type": "tca8418_begin",
      "fields": {"VAR": "keypad"},
      "inputs": {"ADDRESS": {"shadow": {"type": "math_number", "fields": {"NUM": 52}}}},
      "next": {"block": {"type": "tca8418_matrix", "fields": {"VAR": "keypad"}}}
    }
  }
}
```

### Hat块事件处理
```json
{
  "type": "tca8418_when_key_event",
  "fields": {"VAR": {"id": "var_id"}},
  "inputs": {
    "HANDLER": {
      "block": {
        "type": "tca8418_get_event_row",
        "fields": {"VAR": {"id": "var_id"}},
        "inputs": {"EVENT": {"block": {"type": "tca8418_current_event"}}}
      }
    }
  }
}
```

## 重要规则

1. **初始化顺序**: create → begin → matrix
2. **I2C初始化**: 自动添加`Wire.begin()`，可被`aily_iic`覆盖
3. **事件编码**: 低7位=按键位置，最高位=0按下/1释放
4. **Hat块**: `tca8418_when_key_event`自动添加到loop
5. **变量规则**: create/begin/matrix用`field_input`字符串，其他用`field_variable`对象

## 支持的选项

**GPIO模式**: INPUT, OUTPUT, INPUT_PULLUP  
**电平值**: HIGH, LOW
