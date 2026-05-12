# PN532 NFC

PN532 NFC/RFID module library, supports SPI/I2C/UART interface, can read and write Mifare Classic, Mifare Ultralight, NTAG2xx and other cards

## Library Info
- **Name**: @aily-project/lib-adafruit-PN532
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `pn532_create_spi` | Statement | VAR(field_input), SCK(field_number), MISO(field_number), MOSI(field_number), SS(field_number) | `pn532_create_spi("nfc", 2, 5, 3, 4)` | Dynamic code |
| `pn532_create_spi_hw` | Statement | VAR(field_input), SS(field_number) | `pn532_create_spi_hw("nfc", 10)` | Dynamic code |
| `pn532_create_i2c` | Statement | VAR(field_input) | `pn532_create_i2c("nfc")` | Dynamic code |
| `pn532_create_i2c_pins` | Statement | VAR(field_input), IRQ(field_number), RESET(field_number) | `pn532_create_i2c_pins("nfc", 2, 3)` | Dynamic code |
| `pn532_begin` | Statement | VAR(field_variable) | `pn532_begin(variables_get($nfc))` | Dynamic code |
| `pn532_get_firmware_version` | Value | VAR(field_variable) | `pn532_get_firmware_version(variables_get($nfc))` | Dynamic code |
| `pn532_sam_config` | Statement | VAR(field_variable) | `pn532_sam_config(variables_get($nfc))` | Dynamic code |
| `pn532_set_passive_retries` | Statement | VAR(field_variable), RETRIES(field_number) | `pn532_set_passive_retries(variables_get($nfc), 255)` | Dynamic code |
| `pn532_read_passive_target` | Value | VAR(field_variable), CARDTYPE(dropdown), TIMEOUT(field_number) | `pn532_read_passive_target(variables_get($nfc), PN532_MIFARE_ISO14443A, 1000)` | Dynamic code |
| `pn532_get_uid_length` | Value | (none) | `pn532_get_uid_length()` | pn532_uid_length |
| `pn532_get_uid_byte` | Value | INDEX(input_value) | `pn532_get_uid_byte(math_number(0))` | pn532_uid[ |
| `pn532_mifare_classic_authenticate` | Value | VAR(field_variable), SECTOR(field_number), KEYTYPE(dropdown), KEY(input_value) | `pn532_mifare_classic_authenticate(variables_get($nfc), 1, MIFARE_CMD_AUTH_A, text("value"))` | Dynamic code |
| `pn532_mifare_classic_read_block` | Value | VAR(field_variable), BLOCK(field_number) | `pn532_mifare_classic_read_block(variables_get($nfc), 4)` | Dynamic code |
| `pn532_mifare_classic_write_block` | Value | VAR(field_variable), BLOCK(field_number), DATA(input_value) | `pn532_mifare_classic_write_block(variables_get($nfc), 4, text("value"))` | writeMifareClassicBlock( |
| `pn532_mifare_ultralight_read_page` | Value | VAR(field_variable), PAGE(field_number) | `pn532_mifare_ultralight_read_page(variables_get($nfc), 4)` | readMifareUltralightPage( |
| `pn532_mifare_ultralight_write_page` | Value | VAR(field_variable), PAGE(field_number), DATA(input_value) | `pn532_mifare_ultralight_write_page(variables_get($nfc), 4, text("value"))` | writeMifareUltralightPage( |
| `pn532_ntag2xx_read_page` | Value | VAR(field_variable), PAGE(field_number) | `pn532_ntag2xx_read_page(variables_get($nfc), 4)` | readNTAG2xxPage( |
| `pn532_ntag2xx_write_page` | Value | VAR(field_variable), PAGE(field_number), DATA(input_value) | `pn532_ntag2xx_write_page(variables_get($nfc), 4, text("value"))` | writeNTAG2xxPage( |
| `pn532_mifare_classic_write_ndef_uri` | Value | VAR(field_variable), SECTOR(field_number), PREFIX(dropdown), URL(input_value) | `pn532_mifare_classic_write_ndef_uri(variables_get($nfc), 1, NDEF_URIPREFIX_NONE, text("value"))` | writeNDEFURI_Manual( |
| `pn532_ntag2xx_write_ndef_uri` | Value | VAR(field_variable), PREFIX(dropdown), URL(input_value) | `pn532_ntag2xx_write_ndef_uri(variables_get($nfc), NDEF_URIPREFIX_NONE, text("value"))` | Dynamic code |
| `pn532_mifare_classic_format_ndef` | Value | VAR(field_variable) | `pn532_mifare_classic_format_ndef(variables_get($nfc))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| CARDTYPE | PN532_MIFARE_ISO14443A | pn532_read_passive_target |
| KEYTYPE | MIFARE_CMD_AUTH_A, MIFARE_CMD_AUTH_B | pn532_mifare_classic_authenticate |
| PREFIX | NDEF_URIPREFIX_NONE, NDEF_URIPREFIX_HTTP_WWWDOT, NDEF_URIPREFIX_HTTPS_WWWDOT, NDEF_URIPREFIX_HTTP, NDEF_URIPREFIX_HTTPS, NDEF_URIPREFIX_TEL, NDEF_URIPREFIX_MAILTO, NDEF_URIPREFIX_FTP_ANONAT | pn532_mifare_classic_write_ndef_uri, pn532_ntag2xx_write_ndef_uri |

## ABS Examples

### Basic Usage
```
arduino_setup()
    pn532_create_spi("nfc", 2, 5, 3, 4)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, pn532_get_firmware_version(variables_get($nfc)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `pn532_create_spi("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
