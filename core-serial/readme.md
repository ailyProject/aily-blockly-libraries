# core-serial

串口通信核心库

## 库信息
- **库名**: @aily-project/lib-core-serial
- **版本**: 0.0.1
- **兼容**: Arduino全系列平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `serial_begin` | 语句块 | SERIAL/SPEED(field_dropdown) | `"fields":{"SERIAL":"Serial","SPEED":"9600"}` | `Serial.begin(9600)` |
| `serial_available` | 值块 | SERIAL(field_dropdown) | `"fields":{"SERIAL":"Serial"}` | `Serial.available()` |
| `serial_read` | 值块 | SERIAL/TYPE(field_dropdown) | `"fields":{"SERIAL":"Serial","TYPE":"read()"}` | `Serial.read()` |
| `serial_read_until` | 值块 | SERIAL(field_dropdown), TERMINATOR(input_value) | `"fields":{"SERIAL":"Serial"},"inputs":{"TERMINATOR":{"block":{"type":"char","fields":{"CHAR":"\\n"}}}}` | `Serial.readStringUntil('\n')` |
| `serial_print` | 语句块 | SERIAL(field_dropdown), VAR(input_value) | `"fields":{"SERIAL":"Serial"},"inputs":{"VAR":{"block":{"type":"text","fields":{"TEXT":"Hello"}}}}` | `Serial.print("Hello")` |
| `serial_println` | 语句块 | SERIAL(field_dropdown), VAR(input_value) | `"fields":{"SERIAL":"Serial"},"inputs":{"VAR":{"block":{"type":"text","fields":{"TEXT":"Hello"}}}}` | `Serial.println("Hello")` |
| `serial_write` | 语句块 | SERIAL(field_dropdown), DATA(input_value) | `"fields":{"SERIAL":"Serial"},"inputs":{"DATA":{"block":{"type":"math_number","fields":{"NUM":"65"}}}}` | `Serial.write(65)` |
| `serial_read_string` | 值块 | SERIAL(field_dropdown) | `"fields":{"SERIAL":"Serial"}` | `Serial.readString()` |
| `serial_begin_esp32_custom` | 语句块 | VAR(field_input), UART/SPEED/RX/TX(field_dropdown) | `"fields":{"VAR":"MySerial","UART":"UART1","SPEED":"9600","RX":"16","TX":"17"}` | `HardwareSerial MySerial(1); MySerial.begin(9600,SERIAL_8N1,16,17)` |
| `serial_begin_software` | 语句块 | VAR(field_input), RX/TX(field_dropdown), SPEED(field_dropdown) | `"fields":{"VAR":"SoftSerial","RX":"10","TX":"11","SPEED":"9600"}` | `SoftwareSerial SoftSerial(10,11); SoftSerial.begin(9600)` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "MySerial"`, `"CHAR": "\\n"` |
| field_dropdown | 字符串 | `"SERIAL": "Serial"`, `"TYPE": "read()"` |
| field_dropdown(动态) | 字符串 | `"SERIAL": "Serial"` (从board.json的serialPort字段获取) |
| input_value | 块连接 | `"inputs": {"VAR": {"block": {"type": "text", "fields": {"TEXT": "Hello"}}}}` |

## 连接规则

- **语句块**: begin/print/println/write有previousStatement/nextStatement,通过`next`字段连接
- **值块**: available/read/read_string/read_until有output,连接到`inputs`中,无`next`字段
- **特殊规则**: 
  - 未初始化的串口会自动添加默认初始化(9600波特率)
  - serial_begin_esp32_custom创建自定义HardwareSerial实例,仅ESP32平台
  - serial_begin_software创建SoftwareSerial实例,仅Arduino AVR平台
  - 自定义串口名称会动态添加到SERIAL下拉选项中

### 动态选项处理
当遇到`"options": "${board.xxx}"`格式的dropdown字段时:
1. 需要从**board.json**文件中获取对应的选项数组
2. 使用`board.xxx`中的xxx作为key,获取对应的value数组
3. 在.abi文件中使用数组中的具体选项值,而非模板字符串

**示例**:
- block.json中: `"options": "${board.serialPort}"`
- board.json中: `"serialPort": [["Serial", "Serial"], ["Serial1", "Serial1"]]`
- .abi中使用: `"SERIAL": "Serial"` (选择数组中某组的value,即第二个元素)

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
        "VAR": {"block": {"type": "text", "fields": {"TEXT": "Hello"}}}
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
        "fields": {"VAR": {"name": "data", "type": "String"}},
        "inputs": {
          "VALUE": {"block": {"type": "serial_read_string", "fields": {"SERIAL": "Serial"}}}
        }
      }
    }
  }
}
```

### 读取直到指定字符
方法一：
```json
{
  "type": "variables_set",
  "fields": {"VAR": {"name": "line", "type": "String"}},
  "inputs": {
    "VALUE": {
      "block": {
        "type": "serial_read_until",
        "fields": {"SERIAL": "Serial"},
        "inputs": {
          "TERMINATOR": {"block": {"type": "char", "fields": {"CHAR": "\\n"}}}
        }
      }
    }
  }
} 
```
方法二：
```json
{
  "type": "variables_set",
  "id": "set_line_alt",
  "fields": {"VAR": {"name": "lineAlt", "type": "String"}},
  "inputs": {
    "VALUE": {
      "block": {
        "type": "serial_read",
        "fields": {"SERIAL": "Serial", "TYPE": "readStringUntil('\\n')"}
      }
    }
  }
}
```

### ESP32自定义串口
```json
{
  "type": "serial_begin_esp32_custom",
  "id": "custom_serial",
  "fields": {
    "VAR": "MySerial",
    "UART": "UART1",
    "SPEED": "115200",
    "RX": "16",
    "TX": "17"
  },
  "next": {
    "block": {
      "type": "serial_println",
      "id": "custom_print",
      "fields": {"SERIAL": "MySerial"},
      "inputs": {
        "VAR": {"block": {"type": "text", "id": "custom_msg", "fields": {"TEXT": "Custom UART"}}}
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: 使用串口前建议先初始化,未初始化会自动添加默认配置(9600波特率),块ID必须唯一
2. **连接限制**: begin/print/println/write是语句块,available/read/read_string/read_until是值块无next字段
3. **变量管理**: serial_begin_esp32_custom创建的自定义串口会自动添加到SERIAL下拉选项中
4. **常见错误**: ❌ 忘记检查available直接读取 ❌ 波特率与硬件不匹配 ❌ ESP32 UART编号超范围 ❌ 自定义串口名称重复

## 支持的字段选项
- **SERIAL**: 从board.json的serialPort字段获取(如"Serial","Serial1","Serial2")+自定义串口
- **SPEED**: 从board.json的serialSpeed字段获取(如"9600","115200")
- **TYPE**: "read()","peek()","parseInt()","parseFloat()","readString()","readStringUntil('\\r')","readStringUntil('\\n')","readStringUntil('\\0')"
- **UART**: "UART0","UART1"等(ESP32硬件UART编号,根据芯片型号动态生成)
- **RX/TX**: 从board.json的digitalPins字段获取GPIO引脚号
- **TERMINATOR**: 使用char块,如`{"type":"char","fields":{"CHAR":"\\n"}}`表示换行符