# ESP32 I2S音频库

ESP32 I2S音频接口库,支持标准I2S、TDM、PDM模式,用于音频播放和录制,提供快速操作和音调生成功能。

## Library Info
- **Name**: @aily-project/lib-esp32-i2s
- **Version**: 1.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_i2s_create` | Statement | VAR(field_input) | `esp32_i2s_create("i2s")` | `` |
| `esp32_i2s_set_pins_std` | Statement | VAR(field_variable), BCLK(field_number), WS(field_number), DOUT(field_number), DIN(field_number), MCLK(field_number) | `esp32_i2s_set_pins_std(variables_get($i2s), 5, 25, 26, -1, -1)` | `....setPins(..., ..., ..., ..., ...);\n` |
| `esp32_i2s_set_pins_pdm_tx` | Statement | VAR(field_variable), CLK(field_number), DOUT0(field_number), DOUT1(field_number) | `esp32_i2s_set_pins_pdm_tx(variables_get($i2s), 20, 21, -1)` | `....setPinsPdmTx(..., ..., ...);\n` |
| `esp32_i2s_set_pins_pdm_rx` | Statement | VAR(field_variable), CLK(field_number), DIN0(field_number), DIN1(field_number), DIN2(field_number), DIN3(field_number) | `esp32_i2s_set_pins_pdm_rx(variables_get($i2s), 20, 21, -1, -1, -1)` | `....setPinsPdmRx(..., ..., ..., ..., ...);\n` |
| `esp32_i2s_begin` | Statement | VAR(field_variable), MODE(dropdown), RATE(field_number), BITS(dropdown), SLOT(dropdown), SLOT_MASK(dropdown) | `esp32_i2s_begin(variables_get($i2s), I2S_MODE_STD, 44100, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_STEREO, -1)` | `if (!....begin(...)) {\n` |
| `esp32_i2s_configure_tx` | Statement | VAR(field_variable), RATE(field_number), BITS(dropdown), SLOT(dropdown), SLOT_MASK(dropdown) | `esp32_i2s_configure_tx(variables_get($i2s), 44100, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_STEREO, -1)` | `if (!....configureTX(...)) {\n` |
| `esp32_i2s_configure_rx` | Statement | VAR(field_variable), RATE(field_number), BITS(dropdown), SLOT(dropdown), TRANSFORM(dropdown) | `esp32_i2s_configure_rx(variables_get($i2s), 16000, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_STEREO, I2S_RX_TRANSFORM_NONE)` | `if (!....configureRX(..., ..., ..., ...)) {\n` |
| `esp32_i2s_write_byte` | Statement | VAR(field_variable), BYTE(input_value) | `esp32_i2s_write_byte(variables_get($i2s), math_number(0))` | `....write(...);\n` |
| `esp32_i2s_read_bytes` | Statement | VAR(field_variable), BUFFER(input_value), SIZE(input_value) | `esp32_i2s_read_bytes(variables_get($i2s), math_number(0), math_number(0))` | `....readBytes(..., ...);\n` |
| `esp32_i2s_record_wav` | Value | VAR(field_variable), SECONDS(input_value), SIZE_VAR(field_input) | `esp32_i2s_record_wav(variables_get($i2s), math_number(0), "wav_size")` | `....recordWAV(..., &...)` |
| `esp32_i2s_play_wav` | Statement | VAR(field_variable), DATA(input_value), LENGTH(input_value) | `esp32_i2s_play_wav(variables_get($i2s), math_number(0), math_number(0))` | `....playWAV(..., ...);\n` |
| `esp32_i2s_end` | Statement | VAR(field_variable) | `esp32_i2s_end(variables_get($i2s))` | `....end();\n` |
| `esp32_i2s_get_last_error` | Value | VAR(field_variable) | `esp32_i2s_get_last_error(variables_get($i2s))` | `....lastError()` |
| `esp32_i2s_write_sample` | Statement | VAR(field_variable), SAMPLE(input_value) | `esp32_i2s_write_sample(variables_get($i2s), math_number(0))` | (dynamic code) |
| `esp32_i2s_write_buffer` | Value | VAR(field_variable), BUFFER(input_value), SIZE(input_value) | `esp32_i2s_write_buffer(variables_get($i2s), math_number(0), math_number(0))` | `....write((const uint8_t*)..., ...)` |
| `esp32_i2s_available` | Value | VAR(field_variable) | `esp32_i2s_available(variables_get($i2s))` | `....available()` |
| `esp32_i2s_tx_sample_rate` | Value | VAR(field_variable) | `esp32_i2s_tx_sample_rate(variables_get($i2s))` | `....txSampleRate()` |
| `esp32_i2s_rx_sample_rate` | Value | VAR(field_variable) | `esp32_i2s_rx_sample_rate(variables_get($i2s))` | `....rxSampleRate()` |
| `esp32_i2s_set_inverted` | Statement | VAR(field_variable), BCLK_INV(field_checkbox), WS_INV(field_checkbox), MCLK_INV(field_checkbox) | `esp32_i2s_set_inverted(variables_get($i2s), FALSE, FALSE, FALSE)` | `....setInverted(..., ..., ...);\n` |
| `esp32_i2s_generate_tone` | Statement | VAR(field_variable), FREQUENCY(input_value), DURATION(input_value), AMPLITUDE(input_value) | `esp32_i2s_generate_tone(variables_get($i2s), math_number(0), math_number(0), math_number(0))` | `i2s_generate_tone(..., ..., ..., ...);\n` |
| `esp32_i2s_free_wav_buffer` | Statement | BUFFER(input_value) | `esp32_i2s_free_wav_buffer(math_number(0))` | `if (... != NULL) {\n` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | I2S_MODE_STD, I2S_MODE_TDM, I2S_MODE_PDM_TX, I2S_MODE_PDM_RX | 标准I2S / TDM模式 / PDM发送 / PDM接收 |
| BITS | I2S_DATA_BIT_WIDTH_16BIT, I2S_DATA_BIT_WIDTH_32BIT, I2S_DATA_BIT_WIDTH_24BIT, I2S_DATA_BIT_WIDTH_8BIT | 16位 / 32位 / 24位 / 8位 |
| SLOT | I2S_SLOT_MODE_STEREO, I2S_SLOT_MODE_MONO | 立体声 / 单声道 |
| SLOT_MASK | -1, I2S_STD_SLOT_LEFT, I2S_STD_SLOT_RIGHT, I2S_STD_SLOT_BOTH | 自动 / 左声道 / 右声道 / 双声道 |
| TRANSFORM | I2S_RX_TRANSFORM_NONE, I2S_RX_TRANSFORM_32_TO_16, I2S_RX_TRANSFORM_16_STEREO_TO_MONO | 无转换 / 32转16位 / 立体声转单声道 |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_i2s_create("i2s")
    esp32_i2s_begin(variables_get($i2s), I2S_MODE_STD, 44100, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_STEREO, -1)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_i2s_record_wav(variables_get($i2s), math_number(0), "wav_size"))
    time_delay(math_number(1000))
```

## Notes

1. **Variable Creation**: `esp32_i2s_create("varName", ...)` creates variable `$varName`; reference with `variables_get($varName)`
2. **Initialization**: Place init blocks inside `arduino_setup()`
3. **Parameter Order**: Follows `block.json` args0 order
