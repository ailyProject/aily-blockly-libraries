# TGAM 脑电波

TGAM 脑电波模块驱动：非阻塞解析 NeuroSky TGAM 大包（基于 Stream，可绑定任意串口），读取信号质量、注意力、放松度。

## Library Info

- **Name**: @aily-project/lib-tgam
- **Version**: 1.2.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `tgam_init` | Statement | VAR(field_variable), SERIAL(field_dropdown 由板卡提供), RX(input_value Number), TX(input_value Number), BAUD(field_dropdown) | `tgam_init($tgam, Serial, math_number(0), math_number(1), 57600)` | `#include "TGAM.h" ↵ TGAM tgam(Serial); ↵ Serial.begin(57600); ↵ tgam.update();`（include 位于文件头部；对象为全局声明；begin 位于 setup 开头；`update()` 自动注入 loop 开头；块本身不产生行内语句。ESP32 系列选择 Serial1/Serial2 时生成 `Serial1.begin(57600, SERIAL_8N1, 16, 17);`，RX/TX 为积木输入值） |
| `tgam_signal_quality` | Value (Number) | VAR(field_variable) | `tgam_signal_quality($tgam)` | `tgam.signalQuality()` |
| `tgam_attention` | Value (Number) | VAR(field_variable) | `tgam_attention($tgam)` | `tgam.attention()` |
| `tgam_meditation` | Value (Number) | VAR(field_variable) | `tgam_meditation($tgam)` | `tgam.meditation()` |
| `tgam_signal_good` | Value (Boolean) | VAR(field_variable) | `tgam_signal_good($tgam)` | `tgam.signalGood()` |
| `tgam_has_new_data` | Value (Boolean) | VAR(field_variable) | `tgam_has_new_data($tgam)` | `tgam.hasNewData()` |

## Parameter Options

| Parameter | Values | Description |
| --------- | ------ | ----------- |
| SERIAL | 由当前板卡的串口选项动态提供（如 UNO：`Serial`；ESP32：`Serial`、`Serial1`、`Serial2`），以安装后 `block_info` 的 fieldOptions 为准 | tgam_init 串口选择 |
| BAUD | `57600`, `9600`, `115200` | tgam_init 串口波特率，TGAM 模块默认 57600 |

## ABS Examples

### Arduino UNO/Nano：TGAM 接 Serial（引脚 0/1），复刻原程序输出

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    tgam_init($tgam, Serial, math_number(0), math_number(1), 57600)

arduino_loop()
    controls_if(tgam_has_new_data($tgam))
        serial_print(Serial, text("SignalQuality: "))
        serial_print(Serial, tgam_signal_quality($tgam))
        serial_print(Serial, text("Attation: "))
        serial_print(Serial, tgam_attention($tgam))
        serial_print(Serial, text("Meditation: "))
        serial_println(Serial, tgam_meditation($tgam))
```

### ESP32：TGAM 接 Serial1（RX16/TX17），调试走独立的 Serial

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    tgam_init($tgam, Serial1, math_number(16), math_number(17), 57600)
    serial_begin(Serial, 9600)

arduino_loop()
    controls_if(tgam_has_new_data($tgam))
        serial_println(Serial, tgam_attention($tgam))
```

## Notes

1. **Variable**: `tgam_init($tgam, ...)` 创建 `$tgam` 对象变量；本库后续积木的 field_variable 参数直接传 `$tgam`，不要写成 `variables_get($tgam)` 或字符串。
2. **对象生命周期**: `tgam_init` 生成全局对象 `TGAM tgam(<串口>);`，串口对象来自 SERIAL 下拉的枚举值，绑定 `Stream`。请勿用 `serial_begin` 重复初始化同一串口，以免波特率被覆盖。
3. **板卡变体（runtime 变体）**: `tgam_init` 的 begin 代码按当前板卡生成——ESP32 系列且选择 `Serial1`/`Serial2` 时生成 `<串口>.begin(波特率, SERIAL_8N1, RX, TX);`（RX/TX 来自积木输入）；其余情况（如 UNO 的 `Serial`）生成 `<串口>.begin(波特率);`，此时 RX/TX 输入不进入代码，仅作接线提示。生成后同时向核心串口库登记该串口已初始化，`serial_print`/`serial_println` 不会再自动注入 `begin(9600)`，避免覆盖 TGAM 波特率。
4. **自动 update**: `tgam_init` 自动在 loop 开头注入 `tgam.update();` 非阻塞解析串口数据；本库没有也不需要手动 update 积木，请勿重复实现阻塞式 `while(!Serial.available())` 等待。
5. **数据新鲜度**: `tgam_has_new_data($tgam)` 在本轮 loop 刚解析完一帧校验通过的大包（AA AA 20 + 32 字节 + 校验）时为真；小包自动舍弃，与原始驱动行为一致。信号质量取 payload[1]，注意力取 payload[29]，放松度取 payload[31]。
6. **信号质量含义**: 0=最佳（`tgam_signal_good` 为真），值越大噪声越大，200=电极未接触。
7. **硬件限制**: TGAM 供电 3.3V，波特率默认 57600。UNO/Nano 上 TGAM 与调试输出共用 Serial 时（与原程序一致），串口监视器波特率须设为 57600，且烧录程序前需断开引脚 0/1 上的模块接线。RX/TX 为 `input_value`，需接 `math_number(n)` 等数字块。
