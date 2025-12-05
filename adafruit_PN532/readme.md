# adafruit_PN532

PN532 NFC/RFID模块驱动库，支持I2C接口读写Mifare Classic、Mifare Ultralight、NTAG2xx等卡片。

## 库信息
- **库名**: @aily-project/lib-adafruit-PN532
- **版本**: 1.0.0
- **兼容**: Arduino AVR/SAMD, ESP32, ESP8266, RP2040, Renesas UNO R4
- **接口**: I2C (SPI/UART暂未实现)

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `pn532_create_i2c` | 语句 | VAR(input) | `"VAR":"nfc"` | `Adafruit_PN532 nfc(-1,-1);` |
| `pn532_create_i2c_pins` | 语句 | VAR(input), IRQ/RESET(number) | `"VAR":"nfc"` | `Adafruit_PN532 nfc(2,3);` |
| `pn532_begin` | 语句 | VAR(var) | `"VAR":{"id":"..."}` | `nfc.begin();` |
| `pn532_get_firmware_version` | 值 | VAR(var) | `"VAR":{"id":"..."}` | `nfc.getFirmwareVersion()` |
| `pn532_sam_config` | 语句 | VAR(input) | `"VAR":"nfc"` | `nfc.SAMConfig();` |
| `pn532_set_passive_retries` | 语句 | VAR(var), RETRIES(number) | `"RETRIES":255` | `nfc.setPassiveActivationRetries(255);` |
| `pn532_read_passive_target` | 值 | VAR(var), CARDTYPE(drop), TIMEOUT(number) | `"CARDTYPE":"PN532_MIFARE_ISO14443A"` | 读卡并存UID |
| `pn532_get_uid_length` | 值 | 无 | - | `pn532_uid_length` |
| `pn532_get_uid_byte` | 值 | INDEX(input) | - | `pn532_uid[index]` |
| `pn532_mifare_classic_*` | 值/语句 | VAR(var), SECTOR/BLOCK/PAGE(number) | - | Mifare操作 |
| `pn532_mifare_ultralight_*` | 值/语句 | VAR(var), PAGE(number) | - | Ultralight操作 |
| `pn532_ntag2xx_*` | 值/语句 | VAR(var), PAGE(number) | - | NTAG操作 |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "nfc"` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| field_number | 数字 | `"RETRIES": 255` |
| field_dropdown | 字符串 | `"CARDTYPE": "PN532_MIFARE_ISO14443A"` |
| input_value | 块连接 | `"inputs": {"DATA": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **变量规则**:
  - create/sam_config使用`field_input`，.abi中为字符串
  - 其他方法块使用`field_variable`，.abi中为对象`{"id":"变量ID"}`
- **UID存储**: `pn532_read_passive_target`自动将UID存入全局变量`pn532_uid[]`

## 使用示例

### 基础初始化
```json
{
  "type": "pn532_create_i2c",
  "fields": {"VAR": "nfc"},
  "next": {
    "block": {
      "type": "pn532_begin",
      "fields": {"VAR": {"id": "nfc_var_id"}},
      "next": {"block": {"type": "pn532_sam_config", "fields": {"VAR": "nfc"}}}
    }
  }
}
```

### 读取NFC卡
```json
{
  "type": "controls_if",
  "inputs": {
    "IF0": {
      "block": {
        "type": "pn532_read_passive_target",
        "fields": {
          "VAR": {"id": "nfc_var_id"},
          "CARDTYPE": "PN532_MIFARE_ISO14443A",
          "TIMEOUT": 1000
        }
      }
    },
    "DO0": {
      "block": {
        "type": "serial_println",
        "inputs": {"VAR": {"block": {"type": "pn532_get_uid_byte", "inputs": {"INDEX": {"shadow": {"type": "math_number", "fields": {"NUM": 0}}}}}}}
      }
    }
  }
}
```

## 重要规则

1. **初始化顺序**: create → begin → sam_config → (可选)set_passive_retries
2. **I2C初始化**: 自动添加`Wire.begin()`，可被`aily_iic`覆盖
3. **UID全局变量**: 读卡成功后UID存储在`pn532_uid[]`数组中，长度在`pn532_uid_length`
4. **认证要求**: Mifare Classic读写前必须先认证扇区
5. **数据格式**: 字符串数据自动转换为字节数组
6. **NDEF智能解析**: `pn532_mifare_classic_read_block`自动识别并解析NDEF URI格式

## 支持的选项

**卡片类型**: PN532_MIFARE_ISO14443A  
**密钥类型**: MIFARE_CMD_AUTH_A, MIFARE_CMD_AUTH_B  
**URI前缀**: 无, http://www., https://www., http://, https://, tel:, mailto:, ftp://anonymous@