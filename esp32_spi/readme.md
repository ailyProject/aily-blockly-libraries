# ESP32 SPI通信库

ESP32平台的SPI通信操作库，支持硬件SPI总线配置、事务控制和数据传输。

## 库信息
- **库名**: @aily-project/lib-esp32-spi
- **版本**: 1.0.0
- **兼容**: ESP32系列开发板

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp32_spi_begin` | 语句块 | VAR(field_input), BUS(field_dropdown) | `"VAR":"SPI","BUS":"HSPI"` | `SPI.begin();` |
| `esp32_spi_begin_custom` | 语句块 | VAR(field_input), BUS(field_dropdown), SCK/MISO/MOSI/SS(input_value) | `"VAR":"SPI","BUS":"HSPI"` | `SPI.begin(18,19,23,5);` |
| `esp32_spi_begin_transaction` | 语句块 | VAR(field_variable), FREQUENCY(input_value), BIT_ORDER/MODE(field_dropdown) | `"VAR":{"id":"spi_id","name":"SPI","type":"SPIClass"},"BIT_ORDER":"MSBFIRST","MODE":"0"` | `SPI.beginTransaction(SPISettings(...));` |
| `esp32_spi_end_transaction` | 语句块 | VAR(field_variable) | `"VAR":{"id":"spi_id","name":"SPI","type":"SPIClass"}` | `SPI.endTransaction();` |
| `esp32_spi_transfer` | 值块 | VAR(field_variable), DATA(input_value) | `"VAR":{"id":"spi_id","name":"SPI","type":"SPIClass"}` | `SPI.transfer(data)` |
| `esp32_spi_transfer16` | 值块 | VAR(field_variable), DATA(input_value) | `"VAR":{"id":"spi_id","name":"SPI","type":"SPIClass"}` | `SPI.transfer16(data)` |
| `esp32_spi_write` | 语句块 | VAR(field_variable), DATA(input_value) | `"VAR":{"id":"spi_id","name":"SPI","type":"SPIClass"}` | `SPI.write(data);` |
| `esp32_spi_write_bytes` | 语句块 | VAR(field_variable), DATA/LENGTH(input_value) | `"VAR":{"id":"spi_id","name":"SPI","type":"SPIClass"}` | `SPI.writeBytes(data,len);` |
| `esp32_spi_set_frequency` | 语句块 | VAR(field_variable), FREQUENCY(input_value) | `"VAR":{"id":"spi_id","name":"SPI","type":"SPIClass"}` | `SPI.setFrequency(freq);` |
| `esp32_spi_set_bit_order` | 语句块 | VAR(field_variable), BIT_ORDER(field_dropdown) | `"VAR":{"id":"spi_id","name":"SPI","type":"SPIClass"},"BIT_ORDER":"MSBFIRST"` | `SPI.setBitOrder(order);` |
| `esp32_spi_set_data_mode` | 语句块 | VAR(field_variable), MODE(field_dropdown) | `"VAR":{"id":"spi_id","name":"SPI","type":"SPIClass"},"MODE":"0"` | `SPI.setDataMode(mode);` |
| `esp32_spi_get_ss_pin` | 值块 | VAR(field_variable) | `"VAR":{"id":"spi_id","name":"SPI","type":"SPIClass"}` | `SPI.pinSS()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "SPI"` |
| field_variable | SPIClass变量对象 | `"VAR": {"id": "spi_id", "name": "SPI", "type": "SPIClass"}` |
| field_dropdown | 字符串 | `"BUS": "HSPI"` |
| input_value | 块连接 | `"inputs": {"SCK": {"block": {...}}}` |

## 连接规则

- **语句块**: 大部分块有previousStatement/nextStatement，通过`next`字段连接
- **值块**: esp32_spi_transfer、esp32_spi_transfer16、esp32_spi_get_ss_pin有output，连接到`inputs`中
- **特殊规则**: 
  - SPIClass变量类型为"SPIClass"，每个实例独立管理
  - 初始化块生成库包含、变量定义和begin调用
  - 初始化块自动添加到setup()区域
  - 支持VSPI和HSPI两个硬件SPI总线

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
  "id": "spi_init_custom",
  "fields": {
    "VAR": "SPI",
    "BUS": "HSPI"
  },
  "inputs": {
    "SCK": {"shadow": {"type": "math_number", "fields": {"NUM": "18"}}},
    "MISO": {"shadow": {"type": "math_number", "fields": {"NUM": "19"}}},
    "MOSI": {"shadow": {"type": "math_number", "fields": {"NUM": "23"}}},
    "SS": {"shadow": {"type": "math_number", "fields": {"NUM": "5"}}}
  }
}
```

### SPI事务控制和数据传输
```json
{
  "type": "esp32_spi_begin_transaction",
  "id": "spi_start_trans",
  "fields": {
    "VAR": {"id": "spi_var", "name": "SPI", "type": "SPIClass"},
    "BIT_ORDER": "MSBFIRST",
    "MODE": "0"
  },
  "inputs": {
    "FREQUENCY": {"shadow": {"type": "math_number", "fields": {"NUM": "1000000"}}}
  },
  "next": {
    "block": {
      "type": "esp32_spi_transfer",
      "fields": {"VAR": {"id": "spi_var", "name": "SPI", "type": "SPIClass"}},
      "inputs": {"DATA": {"shadow": {"type": "math_number", "fields": {"NUM": "85"}}}},
      "next": {
        "block": {
          "type": "esp32_spi_end_transaction",
          "fields": {"VAR": {"id": "spi_var", "name": "SPI", "type": "SPIClass"}}
        }
      }
    }
  }
}
```

## 重要规则

1. **初始化顺序**: SPI必须先初始化(esp32_spi_begin)再使用，事务操作必须配对使用beginTransaction/endTransaction
2. **连接限制**: 初始化块是语句块必须在setup区域，传输函数是值块返回接收数据
3. **变量管理**: 每个SPI实例使用独立的SPIClass类型变量，支持多SPI总线同时使用
4. **常见错误**: ❌ 未初始化直接使用，❌ 引脚冲突，❌ 忘记结束事务，❌ 频率设置过高

## 支持的字段选项
- **BUS(SPI总线)**: "HSPI", "VSPI"（ESP32硬件SPI总线）
- **BIT_ORDER(位序)**: "MSBFIRST"(高位优先), "LSBFIRST"(低位优先)
- **MODE(通信模式)**: "0"(MODE0), "1"(MODE1), "2"(MODE2), "3"(MODE3)
- **变量类型**: "SPIClass"（专用类型，用于ESP32 SPI实例）

---
*自包含文档，无需外部规范*