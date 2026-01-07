# SoftwareSerial

软件模拟串口通信库，允许在任意数字引脚上进行串口通信。

## 库信息
- **库名**: @aily-project/lib-softwareserial
- **版本**: 1.0.0
- **兼容**: Arduino AVR系列（UNO, Mega, Nano等）

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `softwareserial_init` | 语句块 | VAR(field_input), RX_PIN/TX_PIN(field_dropdown), BAUD(field_dropdown) | `"fields":{"VAR":"mySerial","RX_PIN":"10","TX_PIN":"11","BAUD":"9600"}` | `mySerial.begin(9600);` |
| `softwareserial_available` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"var_id","name":"mySerial","type":"SoftwareSerial"}}` | `mySerial.available()` |
| `softwareserial_read` | 值块 | VAR(field_variable), TYPE(field_dropdown) | `"fields":{"VAR":{...},"TYPE":"read()"}` | `mySerial.read()` |
| `softwareserial_print` | 语句块 | VAR(field_variable), DATA(input_value) | `"fields":{"VAR":{...}},"inputs":{"DATA":{...}}` | `mySerial.print(data);` |
| `softwareserial_println` | 语句块 | VAR(field_variable), DATA(input_value) | `"fields":{"VAR":{...}},"inputs":{"DATA":{...}}` | `mySerial.println(data);` |
| `softwareserial_write` | 语句块 | VAR(field_variable), DATA(input_value) | `"fields":{"VAR":{...}},"inputs":{"DATA":{...}}` | `mySerial.write(data);` |
| `softwareserial_listen` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{...}}` | `mySerial.listen();` |
| `softwareserial_islistening` | 值块 | VAR(field_variable) | `"fields":{"VAR":{...}}` | `mySerial.isListening()` |
| `softwareserial_overflow` | 值块 | VAR(field_variable) | `"fields":{"VAR":{...}}` | `mySerial.overflow()` |
| `softwareserial_end` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{...}}` | `mySerial.end();` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "mySerial"` (初始化块使用) |
| field_variable | SoftwareSerial变量对象 | `"VAR": {"id": "var_id", "name": "mySerial", "type": "SoftwareSerial"}` |
| field_dropdown | 字符串 | `"BAUD": "9600"`, `"TYPE": "read()"` |
| field_dropdown(动态) | 字符串 | `"RX_PIN": "10"` (选项来自 `board.digitalPins`) |
| input_value | 块连接 | `"inputs": {"DATA": {"shadow": {"type": "text", ...}}}` |

## 连接规则

- **语句块**: `softwareserial_init`、`softwareserial_print`等有previousStatement/nextStatement，通过`next`字段连接
- **值块**: `softwareserial_available`、`softwareserial_read`等有output，连接到`inputs`中，无`next`字段
- **变量类型**: SoftwareSerial实例使用`field_variable`选择，类型为`SoftwareSerial`
- **特殊规则**: 
  - 同一时刻只能有一个SoftwareSerial实例处于监听状态
  - 使用`listen()`切换活动监听端口

### 动态选项处理
当遇到`"options": "${board.digitalPins}"`格式的dropdown字段时：
1. 从**board.json**文件获取对应的引脚选项数组
2. 在.abi文件中使用数组中的具体引脚值

## 使用示例

### 初始化软串口
```json
{
  "type": "softwareserial_init",
  "id": "ss_init_1",
  "fields": {
    "VAR": "mySerial",
    "RX_PIN": "10",
    "TX_PIN": "11",
    "BAUD": "9600"
  }
}
```

### 读取并转发数据
```json
{
  "type": "softwareserial_init",
  "id": "ss_init",
  "fields": {"VAR": "mySerial", "RX_PIN": "10", "TX_PIN": "11", "BAUD": "9600"},
  "next": {
    "block": {
      "type": "controls_if",
      "id": "if_1",
      "inputs": {
        "IF0": {
          "block": {
            "type": "softwareserial_available",
            "id": "ss_avail",
            "fields": {"VAR": {"id": "mySerial_id", "name": "mySerial", "type": "SoftwareSerial"}}
          }
        },
        "DO0": {
          "block": {
            "type": "serial_println",
            "id": "print_1",
            "fields": {"SERIAL": "Serial"},
            "inputs": {
              "VAR": {
                "block": {
                  "type": "softwareserial_read",
                  "id": "ss_read",
                  "fields": {
                    "VAR": {"id": "mySerial_id", "name": "mySerial", "type": "SoftwareSerial"},
                    "TYPE": "read()"
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

1. **变量唯一性**: 每个SoftwareSerial实例必须有唯一的变量名
2. **引脚限制**: 不同Arduino板支持的RX引脚不同：
   - UNO/Nano: 所有数字引脚
   - Mega: 10-13, 50-53, 62-69
   - Leonardo/Micro: 8-11, 14-16
3. **监听限制**: 同一时刻只能有一个软串口处于监听状态
4. **波特率限制**: 建议不超过57600，高波特率可能不稳定

## 支持的读取类型

| 类型 | 说明 |
|------|------|
| `read()` | 读取一个字节 |
| `peek()` | 查看下一个字节但不移除 |
| `parseInt()` | 读取整数 |
| `parseFloat()` | 读取浮点数 |
| `readString()` | 读取字符串 |

## 支持的波特率
300, 1200, 2400, 4800, 9600, 14400, 19200, 28800, 38400, 57600, 115200
