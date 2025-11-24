# ESP32 SPI通信库

ESP32平台的SPI通信操作库，支持硬件SPI总线配置、事务控制和数据传输。

## 库信息
- **库名**: @aily-project/lib-esp32-spi
- **版本**: 1.0.0
- **兼容**: ESP32系列开发板

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp32_spi_begin` | 语句块 | VAR(field_input), BUS(field_dropdown) | `"fields":{"VAR":"SPI","BUS":"HSPI"}` | `SPI.begin()` |
| `esp32_spi_begin_custom` | 语句块 | VAR(field_input), BUS(field_dropdown), SCK/MISO/MOSI/SS(input_value) | `"fields":{"VAR":"SPI","BUS":"HSPI"},"inputs":{"SCK":{"block":{"type":"math_number","fields":{"NUM":"18"}}}}` | `SPI.begin(sck,miso,mosi,ss)` |
| `esp32_spi_begin_transaction` | 语句块 | SPI(field_dropdown), FREQUENCY(input_value), BIT_ORDER/MODE(field_dropdown) | `"fields":{"SPI":"SPI","BIT_ORDER":"MSBFIRST","MODE":"0"},"inputs":{"FREQUENCY":{"block":{"type":"math_number","fields":{"NUM":"1000000"}}}}` | `SPI.beginTransaction(SPISettings())` |
| `esp32_spi_end_transaction` | 语句块 | SPI(field_dropdown) | `"fields":{"SPI":"SPI"}` | `SPI.endTransaction()` |
| `esp32_spi_transfer` | 值块 | SPI(field_dropdown), DATA(input_value) | `"fields":{"SPI":"SPI"},"inputs":{"DATA":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `SPI.transfer(data)` |
| `esp32_spi_transfer16` | 值块 | SPI(field_dropdown), DATA(input_value) | `"fields":{"SPI":"SPI"},"inputs":{"DATA":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `SPI.transfer16(data)` |
| `esp32_spi_write` | 语句块 | SPI(field_dropdown), DATA(input_value) | `"fields":{"SPI":"SPI"},"inputs":{"DATA":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `SPI.write(data)` |
| `esp32_spi_write_bytes` | 语句块 | SPI(field_dropdown), DATA/LENGTH(input_value) | `"fields":{"SPI":"SPI"},"inputs":{"LENGTH":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `SPI.writeBytes(data,len)` |
| `esp32_spi_set_frequency` | 语句块 | SPI(field_dropdown), FREQUENCY(input_value) | `"fields":{"SPI":"SPI"},"inputs":{"FREQUENCY":{"block":{"type":"math_number","fields":{"NUM":"1000000"}}}}` | `SPI.setFrequency(freq)` |
| `esp32_spi_set_bit_order` | 语句块 | SPI(field_dropdown), BIT_ORDER(field_dropdown) | `"fields":{"SPI":"SPI","BIT_ORDER":"MSBFIRST"}` | `SPI.setBitOrder(order)` |
| `esp32_spi_set_data_mode` | 语句块 | SPI(field_dropdown), MODE(field_dropdown) | `"fields":{"SPI":"SPI","MODE":"0"}` | `SPI.setDataMode(mode)` |
| `esp32_spi_get_ss_pin` | 值块 | SPI(field_dropdown) | `"fields":{"SPI":"SPI"}` | `SPI.pinSS()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "SPI"` |
| field_dropdown | 字符串 | `"BUS": "HSPI"` |
| field_dropdown(动态) | 字符串 | `"SPI": "SPI"` (从board.json的spi字段获取) |
| input_value | 块连接 | `"inputs": {"SCK": {"block": {"type": "math_number", "fields": {"NUM": "18"}}}}` |

## 连接规则

- **语句块**: 大部分块有previousStatement/nextStatement,通过`next`字段连接
- **值块**: transfer/transfer16/get_ss_pin有output,连接到`inputs`中,无`next`字段
- **特殊规则**: 
  - 初始化块使用field_input定义SPI对象名称
  - 操作块使用动态dropdown选择已初始化的SPI对象
  - 支持VSPI和HSPI两个硬件SPI总线

### 动态选项处理
当遇到`"options": "${board.xxx}"`格式的dropdown字段时:
1. 需要从**board.json**文件中获取对应的选项数组
2. 使用`board.xxx`中的xxx作为key,获取对应的value数组
3. 在.abi文件中使用数组中的具体选项值,而非模板字符串

**示例**:
- block.json中: `"options": "${board.spi}"`
- board.json中: `"spi": [["SPI", "SPI"], ["HSPI", "HSPI"], ["VSPI", "VSPI"]]`
- .abi中使用: `"SPI": "SPI"` (选择数组中某组的value,即第二个元素)

## 使用示例

### SPI默认初始化
```json
{
  "type": "esp32_spi_begin",
  "id": "spi_setup",
  "fields": {
    "VAR": "SPI",
    "BUS": "HSPI"
  }
}
```

### SPI自定义引脚初始化
```json
{
  "type": "esp32_spi_begin_custom",
  "id": "spi_init",
  "fields": {
    "VAR": "SPI",
    "BUS": "HSPI"
  },
  "inputs": {
    "SCK": {"block": {"type": "math_number", "fields": {"NUM": "18"}}},
    "MISO": {"block": {"type": "math_number", "fields": {"NUM": "19"}}},
    "MOSI": {"block": {"type": "math_number", "fields": {"NUM": "23"}}},
    "SS": {"block": {"type": "math_number", "fields": {"NUM": "5"}}}
  }
}
```

### SPI事务和数据传输
```json
{
  "type": "esp32_spi_begin_transaction",
  "id": "spi_trans",
  "fields": {
    "SPI": "SPI",
    "BIT_ORDER": "MSBFIRST",
    "MODE": "0"
  },
  "inputs": {
    "FREQUENCY": {"block": {"type": "math_number", "fields": {"NUM": "1000000"}}}
  },
  "next": {
    "block": {
      "type": "esp32_spi_write",
      "id": "spi_write",
      "fields": {"SPI": "SPI"},
      "inputs": {
        "DATA": {"block": {"type": "math_number", "fields": {"NUM": "85"}}}
      },
      "next": {
        "block": {
          "type": "esp32_spi_end_transaction",
          "id": "spi_end",
          "fields": {"SPI": "SPI"}
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: SPI必须先初始化才能使用,事务操作必须配对(beginTransaction/endTransaction),块ID必须唯一
2. **连接限制**: 初始化块建议在setup区域,传输函数是值块返回接收数据,无next字段
3. **变量管理**: 使用field_input定义SPI对象,操作块通过动态dropdown选择对象
4. **常见错误**: ❌ 未初始化直接使用 ❌ 引脚冲突 ❌ 忘记结束事务 ❌ 频率设置超出范围

## 支持的字段选项
- **BUS**: "HSPI", "VSPI" (ESP32硬件SPI总线)
- **SPI**: 从board.json的spi字段获取(如"SPI","HSPI","VSPI")
- **BIT_ORDER**: "MSBFIRST"(高位优先), "LSBFIRST"(低位优先)
- **MODE**: "0"(MODE0), "1"(MODE1), "2"(MODE2), "3"(MODE3)
- **FREQUENCY**: SPI时钟频率(Hz),建议1MHz-20MHz