# 红外遥控

基于 Arduino-IRremote 的红外遥控接收与发送库，提供 IrReceiver/IrSender 初始化、解码结果读取与常见协议写入块。

## Library Info
- **Name**: @aily-project/lib-irremote
- **Version**: 0.0.3

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `irremote_library_config` | Statement | RAW_LENGTH(input_value), UNIVERSAL(field_checkbox), EXOTIC(field_checkbox) | `irremote_library_config(math_number(0), TRUE, TRUE)` | — |
| `irremote_receiver_begin` | Statement | PIN(input_value) | `irremote_receiver_begin(math_number(2))` | — |
| `irremote_sender_begin` | Statement | PIN(input_value) | `irremote_sender_begin(math_number(2))` | — |
| `irremote_on_receive` | Statement | DO(input_statement) | `irremote_on_receive()` @DO: ... | — |
| `irremote_receiver_available` | Value | (none) | `irremote_receiver_available()` | — |
| `irremote_get_value` | Value | FIELD(dropdown) | `irremote_get_value(ADDRESS)` | — |
| `irremote_get_protocol` | Value | FORMAT(dropdown) | `irremote_get_protocol(NAME)` | — |
| `irremote_check_flag` | Value | FLAG(dropdown) | `irremote_check_flag(REPEAT)` | — |
| `irremote_is_preset_key` | Value | KEY(dropdown) | `irremote_is_preset_key(69)` | — |
| `irremote_get_preset_name` | Value | (none) | `irremote_get_preset_name()` | — |
| `irremote_resume` | Statement | (none) | `irremote_resume()` | — |
| `irremote_send_command` | Statement | PROTOCOL(dropdown), ADDRESS(input_value), COMMAND(input_value), REPEAT(input_value) | `irremote_send_command(NEC, math_number(0), math_number(0), math_number(0))` | — |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| FIELD | ADDRESS, COMMAND, EXTRA, RAW, BITS, FLAGS | 地址 / 命令 / 附加值 / 原始码 / 位数 / 标志位 |
| FORMAT | NAME, ID | 名称 / 枚举值 |
| FLAG | REPEAT, AUTO_REPEAT, PARITY, TOGGLE, DIFF_REPEAT, EXTRA_INFO | 重复帧 / 自动重复 / 奇偶校验失败 / 切换位 / 不同重发协议 / 包含附加信息 |
| KEY | 69, 70, 71, 68, 64, 67, 7, 21, 9, 22, 12, 24, 94, 8, 28, 90, 66, 82, 74 | CH_MINUS / CHANNEL / CH_PLUS / PREV / NEXT / PLAY_PAUSE / VOL_DOWN / VOL_UP / EQ / NUM_0 / NUM_1 / NUM_2 / NUM_3 / NUM_4 / NUM_5 / NUM_6 / NUM_7 / NUM_8 / NUM_9 |
| PROTOCOL | NEC, NEC2, SAMSUNG, SAMSUNG48, SAMSUNGLG, SONY, PANASONIC, DENON, SHARP, LG, JVC, RC5, RC6, KASEIKYO_JVC, KASEIKYO_DENON, KASEIKYO_SHARP, KASEIKYO_MITSUBISHI, ONKYO, APPLE, BOSEWAVE, FAST, LEGO_PF | NEC / NEC2 / SAMSUNG / SAMSUNG48 / SAMSUNGLG / SONY / PANASONIC / DENON / SHARP / LG / JVC / RC5 / RC6 / KASEIKYO_JVC / KASEIKYO_DENON / KASEIKYO_SHARP / KASEIKYO_MITSUBISHI / ONKYO / APPLE / BOSEWAVE / FAST / LEGO_PF |

## ABS Examples

### Basic Usage
```
arduino_setup()
    irremote_receiver_begin(math_number(2))
    irremote_sender_begin(math_number(2))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, irremote_receiver_available())
    time_delay(math_number(1000))
```

## Notes

1. **Initialization**: Place init/setup blocks inside `arduino_setup()`
2. **Parameter Order**: Follows `block.json` args0 order
