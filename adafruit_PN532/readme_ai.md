# PN532 NFC

PN532 NFC/RFID模块库，支持SPI/I2C/UART接口，可读写Mifare Classic、Mifare Ultralight、NTAG2xx等卡片

## Library Info
- **Name**: @aily-project/lib-adafruit-PN532
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `pn532_create_spi` | Statement | VAR(field_input), SCK(field_number), MISO(field_number), MOSI(field_number), SS(field_number) | `pn532_create_spi("nfc", 2, 5, 3, 4)` | `` |
| `pn532_create_spi_hw` | Statement | VAR(field_input), SS(field_number) | `pn532_create_spi_hw("nfc", 10)` | `` |
| `pn532_create_i2c` | Statement | VAR(field_input) | `pn532_create_i2c("nfc")` | `` |
| `pn532_create_i2c_pins` | Statement | VAR(field_input), IRQ(field_number), RESET(field_number) | `pn532_create_i2c_pins("nfc", 2, 3)` | `` |
| `pn532_begin` | Statement | VAR(field_variable) | `pn532_begin(variables_get($nfc))` | (dynamic code) |
| `pn532_get_firmware_version` | Value | VAR(field_variable) | `pn532_get_firmware_version(variables_get($nfc))` | (dynamic code) |
| `pn532_sam_config` | Statement | VAR(field_variable) | `pn532_sam_config(variables_get($nfc))` | (dynamic code) |
| `pn532_set_passive_retries` | Statement | VAR(field_variable), RETRIES(field_number) | `pn532_set_passive_retries(variables_get($nfc), 255)` | (dynamic code) |
| `pn532_read_passive_target` | Value | VAR(field_variable), CARDTYPE(dropdown), TIMEOUT(field_number) | `pn532_read_passive_target(variables_get($nfc), PN532_MIFARE_ISO14443A, 1000)` | (dynamic code) |
| `pn532_get_uid_length` | Value | (none) | `pn532_get_uid_length()` | `pn532_uid_length` |
| `pn532_get_uid_byte` | Value | INDEX(input_value) | `pn532_get_uid_byte(math_number(0))` | `pn532_uid[` |
| `pn532_mifare_classic_authenticate` | Value | VAR(field_variable), SECTOR(field_number), KEYTYPE(dropdown), KEY(input_value) | `pn532_mifare_classic_authenticate(variables_get($nfc), 1, MIFARE_CMD_AUTH_A, math_number(0))` | (dynamic code) |
| `pn532_mifare_classic_read_block` | Value | VAR(field_variable), BLOCK(field_number) | `pn532_mifare_classic_read_block(variables_get($nfc), 4)` | `读取失败` |
| `pn532_mifare_classic_write_block` | Value | VAR(field_variable), BLOCK(field_number), DATA(input_value) | `pn532_mifare_classic_write_block(variables_get($nfc), 4, math_number(0))` | `writeMifareClassicBlock(` |
| `pn532_mifare_ultralight_read_page` | Value | VAR(field_variable), PAGE(field_number) | `pn532_mifare_ultralight_read_page(variables_get($nfc), 4)` | `` |
| `pn532_mifare_ultralight_write_page` | Value | VAR(field_variable), PAGE(field_number), DATA(input_value) | `pn532_mifare_ultralight_write_page(variables_get($nfc), 4, math_number(0))` | `writeMifareUltralightPage(` |
| `pn532_ntag2xx_read_page` | Value | VAR(field_variable), PAGE(field_number) | `pn532_ntag2xx_read_page(variables_get($nfc), 4)` | `` |
| `pn532_ntag2xx_write_page` | Value | VAR(field_variable), PAGE(field_number), DATA(input_value) | `pn532_ntag2xx_write_page(variables_get($nfc), 4, math_number(0))` | `writeNTAG2xxPage(` |
| `pn532_mifare_classic_write_ndef_uri` | Value | VAR(field_variable), SECTOR(field_number), PREFIX(dropdown), URL(input_value) | `pn532_mifare_classic_write_ndef_uri(variables_get($nfc), 1, NDEF_URIPREFIX_NONE, math_number(0))` | `writeNDEFURI_Manual(` |
| `pn532_ntag2xx_write_ndef_uri` | Value | VAR(field_variable), PREFIX(dropdown), URL(input_value) | `pn532_ntag2xx_write_ndef_uri(variables_get($nfc), NDEF_URIPREFIX_NONE, math_number(0))` | (dynamic code) |
| `pn532_mifare_classic_format_ndef` | Value | VAR(field_variable) | `pn532_mifare_classic_format_ndef(variables_get($nfc))` | (dynamic code) |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| CARDTYPE | PN532_MIFARE_ISO14443A | MIFARE ISO14443A |
| KEYTYPE | MIFARE_CMD_AUTH_A, MIFARE_CMD_AUTH_B | A密钥 / B密钥 |
| PREFIX | NDEF_URIPREFIX_NONE, NDEF_URIPREFIX_HTTP_WWWDOT, NDEF_URIPREFIX_HTTPS_WWWDOT, NDEF_URIPREFIX_HTTP, NDEF_URIPREFIX_HTTPS, NDEF_URIPREFIX_TEL, NDEF_URIPREFIX_MAILTO, NDEF_URIPREFIX_FTP_ANONAT | 无 / http://www. / https://www. / http:// / https:// / tel: / mailto: / ftp://anonymous@ |

## ABS Examples

### Basic Usage
```
arduino_setup()
    pn532_create_spi("nfc", 2, 5, 3, 4)
    pn532_create_spi_hw("nfc", 10)
    pn532_create_i2c("nfc")
    pn532_create_i2c_pins("nfc", 2, 3)
    pn532_begin(variables_get($nfc))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, pn532_get_firmware_version(variables_get($nfc)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `pn532_create_spi("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order
