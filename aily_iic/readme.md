# aily_iic

I2C通信库

## 库信息
- **库名**: @aily-project/lib-aily_iic
- **版本**: 0.0.1
- **兼容**: Arduino AVR/ESP32/ESP8266平台

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `wire_begin` | 语句块 | WIRE/MODE(field_dropdown) | `"fields":{"WIRE":"Wire","MODE":"MASTER"}` | `Wire.begin()` |
| `wire_begin_with_settings` | 语句块 | WIRE/MODE(field_dropdown), SDA/SCL(input_value) | `"fields":{"WIRE":"Wire","MODE":"MASTER"},"inputs":{"SDA":{"block":{"type":"math_number","fields":{"NUM":"21"}}},"SCL":{"block":{"type":"math_number","fields":{"NUM":"22"}}}}` | `Wire.begin(21,22)` |
| `wire_set_clock` | 语句块 | WIRE(field_dropdown), FREQUENCY(input_value) | `"fields":{"WIRE":"Wire"},"inputs":{"FREQUENCY":{"block":{"type":"math_number","fields":{"NUM":"100000"}}}}` | `Wire.setClock(100000)` |
| `wire_scan` | 语句块 | WIRE(field_dropdown) | `"fields":{"WIRE":"Wire"}` | `scanI2C(Wire)` |
| `wire_begin_transmission` | 语句块 | WIRE(field_dropdown), ADDRESS(input_value) | `"fields":{"WIRE":"Wire"},"inputs":{"ADDRESS":{"block":{"type":"math_number","fields":{"NUM":"8"}}}}` | `Wire.beginTransmission(8)` |
| `wire_write` | 语句块 | WIRE(field_dropdown), DATA(input_value) | `"fields":{"WIRE":"Wire"},"inputs":{"DATA":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `Wire.write(0)` |
| `wire_end_transmission` | 语句块 | WIRE(field_dropdown) | `"fields":{"WIRE":"Wire"}` | `Wire.endTransmission()` |
| `wire_request_from` | 语句块 | WIRE(field_dropdown), ADDRESS/QUANTITY(input_value) | `"fields":{"WIRE":"Wire"},"inputs":{"ADDRESS":{"block":{"type":"math_number","fields":{"NUM":"8"}}},"QUANTITY":{"block":{"type":"math_number","fields":{"NUM":"10"}}}}` | `Wire.requestFrom(8,10)` |
| `wire_available` | 值块 | WIRE(field_dropdown) | `"fields":{"WIRE":"Wire"}` | `Wire.available()` |
| `wire_read` | 值块 | WIRE(field_dropdown) | `"fields":{"WIRE":"Wire"}` | `Wire.read()` |
| `wire_on_receive` | Hat块 | WIRE(field_dropdown), CALLBACK(input_statement) | `"fields":{"WIRE":"Wire"},"inputs":{"CALLBACK":{"block":{...}}}` | `receiveEvent()+onReceive()` |
| `wire_on_request` | Hat块 | WIRE(field_dropdown), CALLBACK(input_statement) | `"fields":{"WIRE":"Wire"},"inputs":{"CALLBACK":{"block":{...}}}` | `requestEvent()+onRequest()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_dropdown | 字符串 | `"WIRE": "Wire"` |
| field_dropdown(动态) | 字符串 | `"WIRE": "Wire"` (从board.json的i2c字段获取) |
| input_value | 块连接 | `"inputs": {"ADDRESS": {"block": {"type": "math_number", "fields": {"NUM": "8"}}}}` |
| input_statement | 块连接 | `"inputs": {"CALLBACK": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement,通过`next`字段连接
- **值块**: available/read有output,连接到`inputs`中,无`next`字段
- **Hat块**: on_receive/on_request无连接属性,通过`inputs`的CALLBACK连接内部语句
- **特殊规则**: 
  - wire_begin从设备模式下会在mutator中显示ADDRESS输入
  - wire_begin_with_settings仅ESP32等支持自定义引脚的平台有效
  - 自动添加Wire库引用,避免重复

### 动态选项处理
当遇到`"options": "${board.xxx}"`格式的dropdown字段时:
1. 需要从**board.json**文件中获取对应的选项数组
2. 使用`board.xxx`中的xxx作为key,获取对应的value数组
3. 在.abi文件中使用数组中的具体选项值,而非模板字符串

**示例**:
- block.json中: `"options": "${board.i2c}"`
- board.json中: `"i2c": [["Wire", "Wire"], ["Wire1", "Wire1"]]`
- .abi中使用: `"WIRE": "Wire"` (选择数组中某组的value,即第二个元素)

## 使用示例

### I2C主设备初始化
```json
{
  "type": "wire_begin",
  "fields": {
    "WIRE": "Wire",
    "MODE": "MASTER"
  }
}
```

### 自定义引脚初始化
```json
{
  "type": "wire_begin_with_settings",
  "fields": {
    "WIRE": "Wire",
    "MODE": "MASTER"
  },
  "inputs": {
    "SDA": {"block": {"type": "math_number", "fields": {"NUM": "21"}}},
    "SCL": {"block": {"type": "math_number", "fields": {"NUM": "22"}}}
  }
}
```

### 写入数据到从设备
```json
{
  "type": "wire_begin_transmission",
  "fields": {"WIRE": "Wire"},
  "inputs": {
    "ADDRESS": {"block": {"type": "math_number", "fields": {"NUM": "8"}}}
  },
  "next": {
    "block": {
      "type": "wire_write",
      "fields": {"WIRE": "Wire"},
      "inputs": {
        "DATA": {"block": {"type": "math_number", "fields": {"NUM": "123"}}}
      },
      "next": {
        "block": {
          "type": "wire_end_transmission",
          "fields": {"WIRE": "Wire"}
        }
      }
    }
  }
}
```

### 从设备接收回调
```json
{
  "type": "wire_on_receive",
  "fields": {"WIRE": "Wire"},
  "inputs": {
    "CALLBACK": {
      "block": {
        "type": "serial_println",
        "fields": {"SERIAL": "Serial"},
        "inputs": {
          "VAR": {"block": {"type": "text", "fields": {"TEXT": "Received"}}}
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: I2C必须先初始化才能通信,从设备模式需设置地址,块ID必须唯一
2. **连接限制**: 初始化块建议在setup区域,通信块可在任意位置,值块无next字段
3. **平台特性**: wire_begin_with_settings仅ESP32/ESP8266等支持,AVR平台忽略引脚设置
4. **常见错误**: ❌ 未初始化直接通信 ❌ 地址格式错误(7位地址0-127) ❌ 从设备未设置地址 ❌ SDA/SCL引脚冲突

## 支持的字段选项
- **WIRE**: 从board.json的i2c字段获取(如"Wire","Wire1")
- **MODE**: "MASTER"(主设备), "SLAVE"(从设备)
- **ADDRESS**: I2C设备地址(7位:0-127,8位:0-254)
- **FREQUENCY**: 时钟频率(Hz),常用100000(100kHz)/400000(400kHz)
- **SDA/SCL**: GPIO引脚号,ESP32平台支持自定义
