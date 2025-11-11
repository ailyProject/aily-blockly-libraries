# esp32_spi

ESP32 SPI通信操作库

## 库信息
- **库名**: @aily-project/lib-esp32-spi
- **版本**: 1.0.0
- **兼容**: ESP32系列开发板(ESP32/S2/S3/C3/C6/H2)

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `esp32_spi_create` | 语句块 | VAR(field_input), BUS(field_dropdown) | `"fields":{"VAR":"spi","BUS":"VSPI"}` | `SPIClass *spi = new SPIClass(VSPI);` |
| `esp32_spi_begin_default` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"spi_id","name":"spi","type":"SPIClass"}}` | `spi->begin();` |
| `esp32_spi_begin` | 语句块 | VAR(field_variable), SCK/MISO/MOSI/SS(input_value) | `"fields":{"VAR":{"id":"spi_id","name":"spi","type":"SPIClass"}},"inputs":{"SCK":{"block":{"type":"math_number","fields":{"NUM":"18"}}}}` | `spi->begin(18, 19, 23, 5);` |
| `esp32_spi_settings` | 语句块 | VAR(field_variable), FREQUENCY(input_value), BIT_ORDER/MODE(field_dropdown) | `"fields":{"VAR":{"id":"spi_id","name":"spi","type":"SPIClass"},"BIT_ORDER":"MSBFIRST","MODE":"0"},"inputs":{"FREQUENCY":{"block":{"type":"math_number","fields":{"NUM":"1000000"}}}}` | `spi->setFrequency(1000000); spi->setBitOrder(MSBFIRST);` |
| `esp32_spi_begin_transaction` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"spi_id","name":"spi","type":"SPIClass"}}` | `spi->beginTransaction(SPISettings(1000000, MSBFIRST, SPI_MODE0));` |
| `esp32_spi_end_transaction` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"spi_id","name":"spi","type":"SPIClass"}}` | `spi->endTransaction();` |
| `esp32_spi_transfer` | 值块 | VAR(field_variable), DATA(input_value) | `"fields":{"VAR":{"id":"spi_id","name":"spi","type":"SPIClass"}},"inputs":{"DATA":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `spi->transfer(0)` |
| `esp32_spi_transfer16` | 值块 | VAR(field_variable), DATA(input_value) | `"fields":{"VAR":{"id":"spi_id","name":"spi","type":"SPIClass"}},"inputs":{"DATA":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `spi->transfer16(0)` |
| `esp32_spi_write` | 语句块 | VAR(field_variable), DATA(input_value) | `"fields":{"VAR":{"id":"spi_id","name":"spi","type":"SPIClass"}},"inputs":{"DATA":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `spi->write(0);` |
| `esp32_spi_write_bytes` | 语句块 | VAR(field_variable), DATA(input_value), LENGTH(input_value) | `"fields":{"VAR":{"id":"spi_id","name":"spi","type":"SPIClass"}},"inputs":{"DATA":{"block":{"type":"variables_get"}},"LENGTH":{"block":{"type":"math_number","fields":{"NUM":"0"}}}}` | `spi->writeBytes(data, 0);` |
| `esp32_spi_set_frequency` | 语句块 | VAR(field_variable), FREQUENCY(input_value) | `"fields":{"VAR":{"id":"spi_id","name":"spi","type":"SPIClass"}},"inputs":{"FREQUENCY":{"block":{"type":"math_number","fields":{"NUM":"1000000"}}}}` | `spi->setFrequency(1000000);` |
| `esp32_spi_set_bit_order` | 语句块 | VAR(field_variable), BIT_ORDER(field_dropdown) | `"fields":{"VAR":{"id":"spi_id","name":"spi","type":"SPIClass"},"BIT_ORDER":"MSBFIRST"}` | `spi->setBitOrder(MSBFIRST);` |
| `esp32_spi_set_data_mode` | 语句块 | VAR(field_variable), MODE(field_dropdown) | `"fields":{"VAR":{"id":"spi_id","name":"spi","type":"SPIClass"},"MODE":"0"}` | `spi->setDataMode(0);` |
| `esp32_spi_get_ss_pin` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"spi_id","name":"spi","type":"SPIClass"}}` | `spi->pinSS()` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "spi"` |
| field_variable | SPIClass变量对象 | `"VAR": {"id": "spi_id", "name": "spi", "type": "SPIClass"}` |
| field_dropdown | 字符串 | `"BUS": "VSPI"` |
| input_value | 块连接 | `"inputs": {"SCK": {"block": {...}}}` |

## 连接规则

- **语句块**: 大部分块有previousStatement/nextStatement，通过`next`字段连接
- **值块**: esp32_spi_transfer、esp32_spi_transfer16、esp32_spi_get_ss_pin有output，连接到`inputs`中
- **特殊规则**: 
  - SPIClass变量类型为"SPIClass"，每个实例独立管理
  - esp32_spi_create生成库包含、变量定义和对象创建
  - 初始化块自动添加到setup()区域
  - 支持VSPI和HSPI两个硬件SPI总线

## 使用示例

### SPI对象创建和初始化
```json
{
  "type": "esp32_spi_create",
  "id": "spi_setup",
  "fields": {
    "VAR": "mySPI",
    "BUS": "VSPI"
  }
}
```

### SPI自定义引脚初始化
```json
{
  "type": "esp32_spi_begin",
  "id": "spi_init_custom",
  "fields": {
    "VAR": {"id": "spi_var", "name": "mySPI", "type": "SPIClass"}
  },
  "inputs": {
    "SCK": {"block": {"type": "math_number", "fields": {"NUM": "18"}}},
    "MISO": {"block": {"type": "math_number", "fields": {"NUM": "19"}}},
    "MOSI": {"block": {"type": "math_number", "fields": {"NUM": "23"}}},
    "SS": {"block": {"type": "math_number", "fields": {"NUM": "5"}}}
  }
}
```

### SPI事务控制和数据传输
```json
{
  "type": "esp32_spi_begin_transaction",
  "id": "spi_start_trans",
  "fields": {
    "VAR": {"id": "spi_var", "name": "mySPI", "type": "SPIClass"}
  },
  "next": {
    "block": {
      "type": "variables_set",
      "fields": {"VAR": {"id": "result_var", "name": "result", "type": "Number"}},
      "inputs": {
        "VALUE": {
          "block": {
            "type": "esp32_spi_transfer",
            "fields": {"VAR": {"id": "spi_var", "name": "mySPI", "type": "SPIClass"}},
            "inputs": {"DATA": {"block": {"type": "math_number", "fields": {"NUM": "0x55"}}}}
          }
        }
      },
      "next": {
        "block": {
          "type": "esp32_spi_end_transaction",
          "fields": {"VAR": {"id": "spi_var", "name": "mySPI", "type": "SPIClass"}}
        }
      }
    }
  }
}
```

## 重要规则

1. **必须遵守**: SPI对象必须先创建再初始化，事务操作必须配对使用beginTransaction/endTransaction
2. **连接限制**: esp32_spi_create是语句块必须在setup区域，传输函数是值块返回接收数据
3. **变量管理**: 每个SPI实例使用独立的SPIClass类型变量，支持多SPI总线同时使用
4. **常见错误**: ❌ 未创建对象直接使用，❌ 引脚冲突，❌ 忘记结束事务，❌ 频率设置过高

## 支持的字段选项
- **BUS(SPI总线)**: "VSPI", "HSPI"（ESP32硬件SPI总线）
- **BIT_ORDER(位序)**: "MSBFIRST"(高位优先), "LSBFIRST"(低位优先)
- **MODE(通信模式)**: "0"(MODE0), "1"(MODE1), "2"(MODE2), "3"(MODE3)
- **FREQUENCY(频率范围)**: 80MHz以下（建议1MHz-40MHz）
- **引脚范围**: GPIO 0-39（避免仅输入引脚34-39作为输出）
- **变量类型**: "SPIClass"（专用类型，用于ESP32 SPI实例）

## 技术规格
- **支持平台**: ESP32全系列(ESP32/S2/S3/C3/C6/H2)
- **硬件总线**: VSPI(SPI3)、HSPI(SPI2)
- **最大频率**: 80MHz（实际建议40MHz以内）
- **默认引脚**: VSPI(SCK:18, MISO:19, MOSI:23, SS:5), HSPI(SCK:14, MISO:12, MOSI:13, SS:15)
- **工作电压**: 3.3V兼容，部分引脚支持5V容忍
- **传输模式**: 全双工、半双工、单工传输
- **数据宽度**: 8位、16位数据传输支持