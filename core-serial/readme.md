# core-serial

串口通信核心库

## 库信息
- **库名**: @aily-project/lib-core-serial
- **版本**: 0.0.1
- **兼容**: Arduino全系列平台，3.3V/5V

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `serial_begin` | 语句块 | SERIAL(field_dropdown), SPEED(field_dropdown) | `"fields":{"SERIAL":"Serial","SPEED":"9600"}` | `Serial.begin(9600);` |
| `serial_available` | 值块 | SERIAL(field_dropdown) | `"fields":{"SERIAL":"Serial"}` | `Serial.available()` |
| `serial_read` | 值块 | SERIAL(field_dropdown), TYPE(field_dropdown) | `"fields":{"SERIAL":"Serial","TYPE":"read"}` | `Serial.read()` |
| `serial_print` | 语句块 | SERIAL(field_dropdown), VAR(input_value) | `"fields":{"SERIAL":"Serial"},"inputs":{"VAR":{"block":{...}}}` | `Serial.print(var);` |
| `serial_println` | 语句块 | SERIAL(field_dropdown), VAR(input_value) | `"fields":{"SERIAL":"Serial"},"inputs":{"VAR":{"block":{...}}}` | `Serial.println(var);` |
| `serial_write` | 语句块 | SERIAL(field_dropdown), DATA(input_value) | `"fields":{"SERIAL":"Serial"},"inputs":{"DATA":{"block":{...}}}` | `Serial.write(data);` |
| `serial_read_string` | 值块 | SERIAL(field_dropdown) | `"fields":{"SERIAL":"Serial"}` | `Serial.readString()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"SERIAL": "Serial"` |
| input_value | 块连接 | `"inputs": {"VAR": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **特殊规则**: 
  - 串口端口和波特率选项由板卡配置动态生成 `${board.serialPort}`, `${board.serialSpeed}`
  - 未初始化的串口会自动添加默认初始化代码
  - serial_available输出Number类型，serial_read输出Any类型，serial_read_string输出String类型

## 使用示例

### 基础串口通信
```json
{
  "type": "serial_begin",
  "id": "serial_init",
  "fields": {"SERIAL": "Serial", "SPEED": "9600"},
  "next": {
    "block": {
      "type": "serial_println", 
      "fields": {"SERIAL": "Serial"},
      "inputs": {
        "VAR": {"block": {"type": "text", "fields": {"TEXT": "Hello World"}}}
      }
    }
  }
}
```

### 串口数据读取
```json
{
  "type": "controls_if",
  "id": "check_serial",
  "inputs": {
    "IF0": {
      "block": {
        "type": "logic_compare",
        "fields": {"OP": "GT"}, 
        "inputs": {
          "A": {"block": {"type": "serial_available", "fields": {"SERIAL": "Serial"}}},
          "B": {"block": {"type": "math_number", "fields": {"NUM": "0"}}}
        }
      }
    },
    "DO0": {
      "block": {
        "type": "variables_set",
        "fields": {"VAR": {"id": "received_data", "name": "data", "type": "String"}},
        "inputs": {
          "VALUE": {"block": {"type": "serial_read_string", "fields": {"SERIAL": "Serial"}}}
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: 使用串口前建议先调用serial_begin初始化，否则系统会自动添加默认初始化
2. **连接限制**: serial_begin、serial_print、serial_println、serial_write为语句块，其他为值块
3. **常见错误**: ❌ 忘记检查serial_available就直接读取，❌ 波特率设置与硬件不匹配

## 支持的字段选项
- **SERIAL(串口)**: 根据板卡动态生成，常见值："Serial", "Serial1", "Serial2", "Serial3"
- **SPEED(波特率)**: 根据板卡动态生成，常见值："9600", "19200", "38400", "57600", "115200"
- **TYPE(读取类型)**: "read", "peek", "parseInt", "parseFloat"