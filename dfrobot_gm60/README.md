# DFRobot GM60 二维码扫描器

GM60环形二维码/条码扫描识别传感器，支持I2C和UART通信，可识别QR Code、Data Matrix、PDF417、EAN13、Code128等多种码制。

## 库信息
- **库名**: @aily-project/lib-dfrobot-gm60
- **版本**: 0.0.1
- **兼容**: Arduino AVR, ESP32

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `gm60_init_i2c` | 语句块 | VAR(field_input), ADDRESS(dropdown), WIRE(dropdown动态) | `"fields":{"VAR":"gm60","ADDRESS":"0x1A","WIRE":"Wire"}` | `DFRobot_GM60_IIC gm60(&Wire, 0x1A); gm60.begin();` |
| `gm60_init_uart` | 语句块 | VAR(field_input), RX(input_value), TX(input_value) | `"fields":{"VAR":"gm60"},"inputs":{"RX":{"block":{...}},"TX":{"block":{...}}}` | `SoftwareSerial gm60Serial(rx, tx); DFRobot_GM60_UART gm60; gm60.begin(gm60Serial);` |
| `gm60_set_encode` | 语句块 | VAR(field_variable), ENCODE(dropdown) | `"fields":{"VAR":{"id":"var_id"},"ENCODE":"eUTF8"}` | `gm60.encode(gm60.eUTF8);` |
| `gm60_setup_code` | 语句块 | VAR(field_variable), ON(dropdown), CONTENT(dropdown) | `"fields":{"VAR":{"id":"var_id"},"ON":"true","CONTENT":"true"}` | `gm60.setupCode(true, true);` |
| `gm60_set_identify` | 语句块 | VAR(field_variable), BARCODE(dropdown) | `"fields":{"VAR":{"id":"var_id"},"BARCODE":"eEnableAllBarcode"}` | `gm60.setIdentify(gm60.eEnableAllBarcode);` |
| `gm60_reset` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"var_id"}}` | `gm60.reset();` |
| `gm60_detection` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"var_id"}}` | `gm60.detection()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "gm60"` |
| field_dropdown | 字符串 | `"ENCODE": "eUTF8"` |
| field_dropdown(动态) | 字符串 | `"WIRE": "Wire"` (从board.json获取) |
| field_variable | 对象 | `"VAR": {"id": "gm60_id", "name": "gm60", "type": "GM60"}` |
| input_value | 块连接 | `"RX": {"block": {"type": "math_number", "fields": {"NUM": 2}}}` |

## 连接规则

- **语句块**: gm60_init_i2c/uart及配置块有previousStatement/nextStatement，通过`next`字段连接
- **值块**: gm60_detection有output: "String"，连接到`inputs`中
- **特殊规则**: 
  - GM60有两种通信模式：I2C(`gm60_init_i2c`)和UART(`gm60_init_uart`)，二选一
  - 初始化块使用`field_input`创建变量名，生成器注册为`GM60`类型
  - 后续配置和读取块使用`field_variable`引用该变量

### 动态选项处理
当WIRE字段使用`"options": "${board.i2c}"`时：
- 从board.json中获取i2c选项数组
- .abi中使用具体值如`"WIRE": "Wire"`

## 使用示例

### I2C模式初始化与读取
```json
{
  "type": "gm60_init_i2c",
  "id": "gm60_setup",
  "fields": {
    "VAR": "gm60",
    "ADDRESS": "0x1A",
    "WIRE": "Wire"
  },
  "next": {
    "block": {
      "type": "gm60_set_encode",
      "fields": {
        "VAR": {"id": "gm60_var", "name": "gm60", "type": "GM60"},
        "ENCODE": "eUTF8"
      },
      "next": {
        "block": {
          "type": "gm60_set_identify",
          "fields": {
            "VAR": {"id": "gm60_var", "name": "gm60", "type": "GM60"},
            "BARCODE": "eEnableAllBarcode"
          }
        }
      }
    }
  }
}
```

### 读取扫描数据
```json
{
  "type": "serial_println",
  "inputs": {
    "VAR": {
      "block": {
        "type": "gm60_detection",
        "fields": {
          "VAR": {"id": "gm60_var", "name": "gm60", "type": "GM60"}
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: 必须先使用初始化块(I2C或UART)，再使用配置和读取块
2. **连接限制**: I2C和UART初始化二选一；detection为值块，需要连接到其他块的输入中
3. **常见错误**: ❌ 同时使用I2C和UART初始化；❌ 未初始化直接读取；❌ detection返回"null"时表示未扫描到数据

## 支持的参数选项
- **ADDRESS**: "0x1A"（默认I2C地址）
- **ENCODE**: "eUTF8"（UTF-8编码）, "eGBK"（GBK编码）
- **ON**: "true"（开启设置码）, "false"（关闭设置码）
- **CONTENT**: "true"（输出内容）, "false"（不输出内容）
- **BARCODE**: "eEnableAllBarcode"（启用所有）, "eEnableDefaultcode"（启用默认）, "eForbidAllBarcode"（禁止所有）
- **变量类型**: "GM60"
