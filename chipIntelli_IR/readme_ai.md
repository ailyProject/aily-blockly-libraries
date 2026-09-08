# ChipIntelliIR

CI13XX 原始红外、NEC 与原厂空调码库积木。依赖 **CI13XX 核心 1.0.17+** 自带的 `ChipIntelliIR 1.1.0` 或兼容新版；本包不捆绑 Arduino 库源码。工具箱优先提供默认初始化与常用操作，自定义引脚放在“高级初始化”，可处理失败的等待值块放在“诊断”。

## Library Info
- **名称**: `@aily-project/lib-chipintelli-ir`
- **版本**: 1.2.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `chipintelli_ir_init_default` | Statement | MODE(dropdown) | `chipintelli_ir_init_default(Raw)` | `ChipIntelliIR.begin();` |
| `chipintelli_ir_decode_nec` | Statement | TOLERANCE(input_value), HANDLER(input_statement) | `chipintelli_ir_decode_nec(math_number(25))` | `if (ChipIntelliIRClass::decodeNEC(ailyChipIntelliIRRaw, ailyChipIntelliIRRawCount, ↵ ailyChipIntelliIRNECResult, ailyChipIntelliIRNECTolerance(1))) { ↵ }` |
| `chipintelli_ir_nec_field` | Value | FIELD(dropdown) | `chipintelli_ir_nec_field(type)` | `static_cast<uint8_t>(ailyChipIntelliIRNECResult.type)` |
| `chipintelli_ir_nec_frame_type` | Value | FRAME_TYPE(dropdown) | `chipintelli_ir_nec_frame_type(0)` | `0` |
| `chipintelli_ir_wait_until_idle` | Statement | TIMEOUT(input_value) | `chipintelli_ir_wait_until_idle(math_number(30000))` | `ailyChipIntelliIRWaitUntilIdle(1);` |
| `chipintelli_ir_wait_until_idle_result` | Value | TIMEOUT(input_value) | `chipintelli_ir_wait_until_idle_result(math_number(30000))` | `ailyChipIntelliIRWaitUntilIdle(1)` |
| `chipintelli_ir_air_send_status` | Value | (none) | `chipintelli_ir_air_send_status()` | `static_cast<uint8_t>(ChipIntelliIR.airSendStatus())` |
| `chipintelli_ir_air_send_status_value` | Value | STATUS(dropdown) | `chipintelli_ir_air_send_status_value(0)` | `0` |
| `chipintelli_ir_init_raw` | 语句 | TX_PIN(input_value), RX_PIN(input_value), TIMER(dropdown) | `chipintelli_ir_init_raw(math_number(2), math_number(4), 2)` | `ChipIntelliIR.begin((uint8_t)(1), (uint8_t)(1), 0);` |
| `chipintelli_ir_init_air` | 语句 | TX_PIN(input_value), RX_PIN(input_value), TIMER(dropdown), RESOURCE_ID(input_value) | `chipintelli_ir_init_air(math_number(2), math_number(4), 2, math_number(50000))` | `ChipIntelliIR.beginAirConditioner((uint8_t)(1), (uint8_t)(1), 0, (uint16_t)(1));` |
| `chipintelli_ir_send_raw` | 语句 | DURATIONS(input_value) | `chipintelli_ir_send_raw(text("9000,4500,560,560"))` | `ailyChipIntelliIRSendRawText(String("value"));` |
| `chipintelli_ir_send_nec` | 语句 | ADDRESS(input_value), COMMAND(input_value), REPEATS(input_value) | `chipintelli_ir_send_nec(math_number(16), math_number(32), math_number(0))` | `ChipIntelliIR.sendNEC((uint8_t)(1), (uint8_t)(1), (uint8_t)constrain((int)(1), 0, 239));` |
| `chipintelli_ir_send_extended_nec` | 语句 | ADDRESS(input_value), COMMAND(input_value), REPEATS(input_value) | `chipintelli_ir_send_extended_nec(math_number(13483), math_number(32), math_number(0))` | `ChipIntelliIR.sendExtendedNEC((uint16_t)(1), (uint8_t)(1), (uint8_t)constrain((int)(1), 0, 239));` |
| `chipintelli_ir_start_receive` | 语句 | TIMEOUT(input_value) | `chipintelli_ir_start_receive(math_number(5000))` | `ChipIntelliIR.startReceive((uint32_t)constrain((long)(1), 1L, 60000L));` |
| `chipintelli_ir_stop_receive` | 语句 | (none) | `chipintelli_ir_stop_receive()` | `ChipIntelliIR.stopReceive();` |
| `chipintelli_ir_read_received` | 语句 | HANDLER(input_statement) | `chipintelli_ir_read_received()` | `if (ChipIntelliIR.receiveStatus() == ChipIntelliIRClass::ReceiveStatus::Ready && ↵ ChipIntelliIR.readRaw(ailyChipIntelliIRRaw, ChipIntelliIRClass::MaxRawEntries, ailyChipIntelliIRRawCount)) { ↵ }` |
| `chipintelli_ir_replay_received` | 语句 | (none) | `chipintelli_ir_replay_received()` | `if (ailyChipIntelliIRRawCount != 0) { ↵ ChipIntelliIR.sendRaw(ailyChipIntelliIRRaw, ailyChipIntelliIRRawCount); ↵ }` |
| `chipintelli_ir_received_count` | 值(Number) | (none) | `chipintelli_ir_received_count()` | `ailyChipIntelliIRRawCount` |
| `chipintelli_ir_received_text` | 值(String) | (none) | `chipintelli_ir_received_text()` | `ailyChipIntelliIRRawText()` |
| `chipintelli_ir_receive_status` | 值(Number) | (none) | `chipintelli_ir_receive_status()` | `static_cast<uint8_t>(ChipIntelliIR.receiveStatus())` |
| `chipintelli_ir_receive_status_value` | 值(Number) | STATUS(dropdown) | `chipintelli_ir_receive_status_value(2)` | `0` |
| `chipintelli_ir_is_busy` | 值(Boolean) | (none) | `chipintelli_ir_is_busy()` | `ChipIntelliIR.isBusy()` |
| `chipintelli_ir_select_air_brand` | 语句 | BRAND(dropdown) | `chipintelli_ir_select_air_brand(Gree)` | `ChipIntelliIR.selectAirBrand(ChipIntelliIRClass::AirBrand::LG);` |
| `chipintelli_ir_select_air_code` | 语句 | CODE_ID(input_value) | `chipintelli_ir_select_air_code(math_number(0))` | `ChipIntelliIR.selectAirCode((uint32_t)(1));` |
| `chipintelli_ir_air_code` | 值(Number) | (none) | `chipintelli_ir_air_code()` | `ChipIntelliIR.airCode()` |
| `chipintelli_ir_send_air_command` | 语句 | COMMAND(dropdown) | `chipintelli_ir_send_air_command(ModeCool)` | `ChipIntelliIR.sendAir(ChipIntelliIRClass::AirCommand::PowerOn);` |
| `chipintelli_ir_set_air_temperature` | 语句 | TEMPERATURE(input_value) | `chipintelli_ir_set_air_temperature(math_number(26))` | `ChipIntelliIR.setTemperature((uint8_t)constrain((int)(1), 16, 30));` |
| `chipintelli_ir_air_power` | 语句 | POWER(dropdown) | `chipintelli_ir_air_power(true)` | `ChipIntelliIR.power(true);` |
| `chipintelli_ir_start_air_search` | 语句 | SEARCH_TYPE(dropdown), SEND_COUNT(input_value), INTERVAL(input_value) | `chipintelli_ir_start_air_search(AllBrands, math_number(3), math_number(3000))` | `ChipIntelliIR.startAirSearch(ChipIntelliIRClass::AirSearchType::AllBrands, ailyChipIntelliIRSearchCallback, nullptr, (uint8_t)constrain((int)(1), 3, 255), (uint32_t)constrain((long)(1), 3000L, 2147483647L));` |
| `chipintelli_ir_stop_air_search` | 语句 | (none) | `chipintelli_ir_stop_air_search()` | `ChipIntelliIR.stopAirSearch();` |
| `chipintelli_ir_read_air_search_event` | 语句 | HANDLER(input_statement) | `chipintelli_ir_read_air_search_event()` | `if (ailyChipIntelliIRSearchPending) { ↵ ailyChipIntelliIRSearchPending = false; ↵ }` |
| `chipintelli_ir_air_search_event` | 值(Number) | (none) | `chipintelli_ir_air_search_event()` | `ailyChipIntelliIRSearchEvent` |
| `chipintelli_ir_air_search_code` | 值(Number) | (none) | `chipintelli_ir_air_search_code()` | `ailyChipIntelliIRSearchCode` |
| `chipintelli_ir_air_search_event_value` | 值(Number) | EVENT(dropdown) | `chipintelli_ir_air_search_event_value(0)` | `0` |
| `chipintelli_ir_mode` | 值(Number) | (none) | `chipintelli_ir_mode()` | `static_cast<uint8_t>(ChipIntelliIR.mode())` |
| `chipintelli_ir_last_error` | 值(Number) | (none) | `chipintelli_ir_last_error()` | `static_cast<uint8_t>(ChipIntelliIR.lastError())` |
| `chipintelli_ir_error_string` | 值(String) | (none) | `chipintelli_ir_error_string()` | `String(ChipIntelliIR.errorString())` |

## Parameter Options

- `MODE`: `Raw` 原始波形/NEC，或 `AirConditioner` 空调码库。默认初始化按板型选择引脚，CI1302/CI1303/CI1306/CI-D06GT01D 为 PA2/PA4，easyVoice 1306 dev 为 PA2/PA3。
- `TIMER`: `0`、`1`、`2`；TIMER3 被 BLE SDK 占用。
- `TOLERANCE`: NEC 解码容差百分比，默认 25，限制 0～40。
- `FIELD`: `type` 帧类型、`address` 地址、`command` 命令、`repeatCount` 重复帧数；`FRAME_TYPE`: `0` 未知、`1` 标准、`2` 扩展、`3` 独立重复帧。
- `SEARCH_TYPE`: `AllBrands` 或 `CurrentBrandModels`。
- `STATUS`: `0` 空闲、`1` 接收中、`2` 已就绪、`3` 超时、`4` 错误。
- 空调发送状态的 `STATUS`: `0` 空闲、`1` 排队中、`2` 发送中、`3` 等待后续帧、`4` 失败。
- `EVENT`: `0` 候选码已发送、`1` 搜索完成、`2` 搜索停止。

## 注意事项

1. 原始模式与空调模式在一次启动中互斥，成功初始化后资源保持到复位。
2. 原始波形使用 `uint32_t` 缓冲区，每项 200～131070 µs，最多 1024 项，载波固定 38 kHz。接收、回放和 NEC 解码共享最近成功读取或解析的波形；无效发送文本会清空有效项数，不发送残缺数据。
3. 两种空调初始化积木自动生成 `#define CHIPINTELLI_IR_DATABASE 1`。核心编译前从自身包准备官方数据库（70716 字节），同步到 aily 工程 `src/recursos/user_file_entries/[50000]ir_data_2024_08_16.bin` 和本轮 `.temp/sketch/recursos/user_file_entries/`，再自动合并进固件。资源位于公共目录，与 CWSL 无关，无需用户复制文件。CI1302 标准资源布局不支持数据库，需 CI1303/CI1306 或对应 4 MB 开发板。
4. 搜索事件 Getter 应放在 `chipintelli_ir_read_air_search_event` 的 `HANDLER` 内。
5. 接收超时限制为 1～60000 ms；空调温度限制为 16～30 ℃；搜索间隔至少 3000 ms。
6. 空调命令是异步入队；先检查发送后错误码为 0，再等待空闲。等待默认超时 30000 ms，输入限制 0～2147483647 ms。发送结束后包含约 1 秒静默窗口，以覆盖部分空调码的第二帧。`wait_until_idle_result` 是会阻塞的操作值块；失败时读取错误说明，包括异步失败或超时。等待成功只表示驱动空闲，不能替代此前发送请求的接受检查。
7. `decode_nec` 应在 `read_received` 的 `HANDLER` 内使用；它解码已读取的缓冲区，不会自动接收。Getter 放在解码成功分支，失败时结果复位。独立重复帧的地址和命令均为 0，需应用自行关联最近完整帧。
8. 调用驱动的操作语句可通过最近错误查询；原始文本解析失败及空缓冲回放不会调用驱动，也不会更新最近错误。文本解析失败可通过最近波形项数为 0 识别。静态 NEC 解码以是否执行 `HANDLER` 表示成功，不修改驱动错误。接收是单次操作，处理就绪或超时后需要再次开始接收。
9. 原始模式和 NEC 积木不生成数据库宏。移除所有空调初始化积木后，下一次构建会清理未被修改的托管数据库，用户手动提供的资源会保留。手写 Arduino 草图可在文件顶部直接定义该宏为 `1`；未定义或定义为 `0` 不自动准备。宏只控制资源准备，不会初始化驱动。普通 Arduino 草图使用其 `recursos/user_file_entries/` 公共目录。
## ABS Examples

### Minimal Executable Usage

```abs
arduino_setup()
    chipintelli_ir_init_default(Raw)
```

### 接收并识别 NEC 遥控器

```abs
arduino_setup()
    serial_begin(Serial, 115200)
    chipintelli_ir_init_default(Raw)
    chipintelli_ir_start_receive(math_number(5000))

arduino_loop()
    chipintelli_ir_read_received()
        @HANDLER:
            chipintelli_ir_decode_nec(math_number(25))
                @HANDLER:
                    serial_println(Serial, chipintelli_ir_nec_field(type))
                    serial_println(Serial, chipintelli_ir_nec_field(address))
                    serial_println(Serial, chipintelli_ir_nec_field(command))
                    serial_println(Serial, chipintelli_ir_nec_field(repeatCount))
            chipintelli_ir_start_receive(math_number(5000))
    controls_if(logic_compare(chipintelli_ir_receive_status(), EQ, chipintelli_ir_receive_status_value(3)))
        @DO0:
            chipintelli_ir_start_receive(math_number(5000))
```

### 空调开机并设为 26 ℃

空调初始化会自动启用数据库准备。每次发送后检查等待结果，成功才发送下一条；此示例在 setup 中执行一次。

```abs
arduino_setup()
    serial_begin(Serial, 115200)
    chipintelli_ir_init_default(AirConditioner)
    chipintelli_ir_select_air_brand(Gree)
    chipintelli_ir_air_power(true)
    controls_if(logic_operation(logic_compare(chipintelli_ir_last_error(), EQ, math_number(0)), AND, chipintelli_ir_wait_until_idle_result(math_number(30000))))
        @DO0:
            chipintelli_ir_set_air_temperature(math_number(26))
            controls_if(logic_compare(chipintelli_ir_last_error(), EQ, math_number(0)))
                @DO0:
                    chipintelli_ir_wait_until_idle(math_number(30000))
    serial_println(Serial, chipintelli_ir_error_string())
```
