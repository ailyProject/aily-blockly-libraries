# ChipIntelliCWSL

CI13XX 命令词/唤醒词自学习、模板管理与异步事件积木。

## Library Info
- **名称**: `@aily-project/lib-chipintelli-cwsl`
- **版本**: 1.1.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `chipintelli_cwsl_init` | 语句 | TIMEOUT(input_value) | `chipintelli_cwsl_init(math_number(10000))` | `ChipIntelliCWSL.begin((uint32_t)max(0L, (long)(1)));` |
| `chipintelli_cwsl_end` | 语句 | (none) | `chipintelli_cwsl_end()` | `ChipIntelliCWSL.end();` |
| `chipintelli_cwsl_learn` | 语句 | WORD_TYPE(dropdown), COMMAND_ID(input_value), GROUP_ID(input_value) | `chipintelli_cwsl_learn(COMMAND, math_number(2), math_number(0))` | `ChipIntelliCWSL.learnCommand(ailyChipIntelliCWSLCommandId(1), ailyChipIntelliCWSLGroupId(1));` |
| `chipintelli_cwsl_cancel_learning` | 语句 | (none) | `chipintelli_cwsl_cancel_learning()` | `ChipIntelliCWSL.cancelLearning();` |
| `chipintelli_cwsl_erase_template` | 语句 | WORD_TYPE(dropdown), COMMAND_ID(input_value), GROUP_ID(input_value) | `chipintelli_cwsl_erase_template(COMMAND, math_number(2), math_number(0))` | `ChipIntelliCWSL.eraseCommand(ailyChipIntelliCWSLCommandId(1), ailyChipIntelliCWSLGroupId(1));` |
| `chipintelli_cwsl_erase_templates` | 语句 | SCOPE(dropdown) | `chipintelli_cwsl_erase_templates(ALL)` | `ChipIntelliCWSL.eraseCommands();` |
| `chipintelli_cwsl_read_events` | 语句 | HANDLER(input_statement) | `chipintelli_cwsl_read_events()` | `while (ChipIntelliCWSL.read(ailyChipIntelliCWSLEvent)) { ↵ }` |
| `chipintelli_cwsl_profile_enabled` | 值(Boolean) | (none) | `chipintelli_cwsl_profile_enabled()` | `ChipIntelliCWSL.profileEnabled()` |
| `chipintelli_cwsl_available` | 值(Boolean) | (none) | `chipintelli_cwsl_available()` | `ChipIntelliCWSL.available()` |
| `chipintelli_cwsl_state` | 值(Number) | (none) | `chipintelli_cwsl_state()` | `static_cast<uint8_t>(ChipIntelliCWSL.state())` |
| `chipintelli_cwsl_state_value` | 值(Number) | STATE(dropdown) | `chipintelli_cwsl_state_value(0)` | `0` |
| `chipintelli_cwsl_count` | 值(Number) | COUNT_TYPE(dropdown) | `chipintelli_cwsl_count(TEMPLATE)` | `ChipIntelliCWSL.commandCount()` |
| `chipintelli_cwsl_dropped_events` | 值(Number) | (none) | `chipintelli_cwsl_dropped_events()` | `ChipIntelliCWSL.droppedEvents()` |
| `chipintelli_cwsl_event_type` | 值(Number) | (none) | `chipintelli_cwsl_event_type()` | `static_cast<uint8_t>(ailyChipIntelliCWSLEvent.type)` |
| `chipintelli_cwsl_event_word_type` | 值(Number) | (none) | `chipintelli_cwsl_event_word_type()` | `static_cast<uint8_t>(ailyChipIntelliCWSLEvent.wordType)` |
| `chipintelli_cwsl_event_attempt` | 值(Number) | (none) | `chipintelli_cwsl_event_attempt()` | `ailyChipIntelliCWSLEvent.attempt` |
| `chipintelli_cwsl_event_result` | 值(Number) | (none) | `chipintelli_cwsl_event_result()` | `static_cast<uint8_t>(ailyChipIntelliCWSLEvent.result)` |
| `chipintelli_cwsl_event_command_id` | 值(Number) | (none) | `chipintelli_cwsl_event_command_id()` | `ailyChipIntelliCWSLEvent.commandId` |
| `chipintelli_cwsl_event_group_id` | 值(Number) | (none) | `chipintelli_cwsl_event_group_id()` | `ailyChipIntelliCWSLEvent.groupId` |
| `chipintelli_cwsl_event_distance` | 值(Number) | (none) | `chipintelli_cwsl_event_distance()` | `ailyChipIntelliCWSLEvent.distance` |
| `chipintelli_cwsl_event_type_value` | 值(Number) | EVENT_TYPE(dropdown) | `chipintelli_cwsl_event_type_value(4)` | `1` |
| `chipintelli_cwsl_learn_result_value` | 值(Number) | RESULT(dropdown) | `chipintelli_cwsl_learn_result_value(0)` | `0` |
| `chipintelli_cwsl_is_begun` | 值(Boolean) | (none) | `chipintelli_cwsl_is_begun()` | `ChipIntelliCWSL.isBegun()` |
| `chipintelli_cwsl_last_error` | 值(Number) | (none) | `chipintelli_cwsl_last_error()` | `static_cast<uint8_t>(ChipIntelliCWSL.lastError())` |
| `chipintelli_cwsl_error_value` | 值(Number) | ERROR(dropdown) | `chipintelli_cwsl_error_value(0)` | `static_cast<uint8_t>(ChipIntelliCWSLClass::Error::None)` |
| `chipintelli_cwsl_error_string` | 值(String) | (none) | `chipintelli_cwsl_error_string()` | `String(ChipIntelliCWSL.errorString())` |
| `chipintelli_cwsl_state_name` | 值(String) | (none) | `chipintelli_cwsl_state_name()` | `String(ChipIntelliCWSL.stateName(ChipIntelliCWSL.state()))` |
| `chipintelli_cwsl_event_name` | 值(String) | DETAIL(dropdown) | `chipintelli_cwsl_event_name(TYPE)` | `String(ChipIntelliCWSL.eventName(ailyChipIntelliCWSLEvent.type))` |
| `chipintelli_cwsl_pending_events` | 值(Number) | (none) | `chipintelli_cwsl_pending_events()` | `ChipIntelliCWSL.pendingEvents()` |
| `chipintelli_cwsl_clear_events` | 语句 | (none) | `chipintelli_cwsl_clear_events()` | `ChipIntelliCWSL.clearEvents();` |
| `chipintelli_cwsl_dropped_read_events` | 值(Number) | (none) | `chipintelli_cwsl_dropped_read_events()` | `ChipIntelliCWSL.droppedReadEvents()` |
| `chipintelli_cwsl_dropped_callback_events` | 值(Number) | (none) | `chipintelli_cwsl_dropped_callback_events()` | `ChipIntelliCWSL.droppedCallbackEvents()` |
| `chipintelli_cwsl_word_type_value` | 值(Number) | WORD_TYPE(dropdown) | `chipintelli_cwsl_word_type_value(0)` | `static_cast<uint8_t>(CWSLCommandWord)` |

## Parameter Options

- 学习/删除的 `WORD_TYPE`: `COMMAND` 普通命令词，`WAKE` 唤醒词；词类型常量块为 `0` 命令词、`1` 唤醒词、`2` 全部。
- `SCOPE`: `COMMANDS`、`WAKE_WORDS`、`ALL`。
- `COUNT_TYPE`: `COMMAND`、`WAKE`、`TEMPLATE`、`REMAINING`、`MAX`。
- `STATE`: `0` 空闲、`1` 识别、`2` 学习、`3` 删除、`255` 不可用。
- `EVENT_TYPE`: `1` 学习开始、`2` 录音请求提交、`3` 单次结果、`4` 学习成功、`5` 学习失败、`6` 取消、`7` 删除成功、`8` 识别、`9` 删除失败。
- `RESULT`: `0` 录音成功、`1` 录音失败、`2` 注册完成、`3` 注册中止、`4` 有效帧不足、`5` 数据无效、`6` 默认命令冲突。
- `ERROR`: `0` None、`1` ProfileDisabled、`2` SDKStartFailed、`3` SDKFailed、`4` Timeout、`5` RequestRejected。
- `DETAIL`: `TYPE` 事件类型、`RESULT` 尝试结果、`WORD_TYPE` 词类型。名称与错误说明均为上游提供的英文字符串。

## ABS Examples

### 学习与识别（CI1303 / CI1306）

命令 2 必须是当前资源中的普通命令，且此前未在分组 0 学习过。首次运行初始化后开始学习；学习完成和之后的识别分别通过事件反馈。再次学习前应先删除已有模板并等待删除成功事件。

```abs
arduino_setup()
    serial_begin(Serial, 115200)
    chipintelli_cwsl_init(math_number(10000))
    controls_if(chipintelli_cwsl_is_begun())
        @DO0:
            chipintelli_cwsl_learn(COMMAND, math_number(2), math_number(0))
    serial_println(Serial, chipintelli_cwsl_error_string())

arduino_loop()
    chipintelli_cwsl_read_events()
        @HANDLER:
            serial_println(Serial, chipintelli_cwsl_event_name(TYPE))
            controls_if(logic_compare(chipintelli_cwsl_event_type(), EQ, chipintelli_cwsl_event_type_value(8)))
                @DO0:
                    serial_println(Serial, chipintelli_cwsl_event_command_id())
    time_delay(math_number(1))
```

### 精简学习（CI1302）

```abs
arduino_setup()
    chipintelli_cwsl_init(math_number(10000))
    controls_if(chipintelli_cwsl_is_begun())
        @DO0:
            chipintelli_cwsl_learn(COMMAND, math_number(2), math_number(0))

arduino_loop()
    chipintelli_cwsl_read_events()
    time_delay(math_number(1))
```

## Notes

1. 使用开发板核心自带的 **ChipIntelliCWSL 1.1.0 或更新兼容版本**，本包不重复捆绑源码。编译前选择 CWSL 或 CWSL+AEC 算法配置，并使用匹配的 `cmd_info`/语音资源。
2. 默认超时 10000 ms、命令 ID 2、分组 ID 0；唤醒词请选择 `WAKE` 并改成当前资源中实际的唤醒命令 ID（上游示例为 1）。命令 ID 范围 0～65535，分组 0～255，199～208 为保留命令。生成器会将越界 ID 转为上游拒绝值，避免整数截断后误操作其他模板。
3. 所有控制积木保留语句形态。紧接初始化使用 `is_begun`；紧接学习/取消/删除请求使用 `last_error` 与 `error_value(0)` 比较，失败时读取 `error_string`。错误码 0 只代表请求接受，异步完成必须等待相应事件；后续控制调用会覆盖上次错误。
4. `event_*` Getter 仅放在 `read_events` 的 `HANDLER` 内。生成器自动加入头文件及全局 `ChipIntelliCWSLEvent ailyChipIntelliCWSLEvent = {};`；`read_events` 在当前任务中逐条排空队列，不自动注册回调，也不自动启动学习。
5. 独立轮询和回调队列各容纳 15 个事件，满时丢弃新事件。Blockly 轮询程序优先查看 `dropped_read_events`；旧 `dropped_events` 为两条路径丢弃数之和。`clear_events` 只丢弃轮询积压，不取消操作或回调。
6. 初始化成功前状态为 255、容量查询为 -1。识别事件 `groupId` 为 65535，因为 SDK 不报告模板分组；`distance` 只在识别事件有意义，`attempt/result` 主要用于学习尝试及结束事件。
7. 学习开始后不可取消，取消仅在 `LearningStarted` 前接受。所有 CWSL API 只能从 setup、loop 或普通 RTOS 任务调用；从原生 onEvent 回调发起的控制请求可能被拒绝，应转到 loop 执行。
8. 模板掉电保存；普通命令/分组需删除后才能重学，唤醒命令/分组支持两种学习短语。程序化学习不自动播放提示音；若结合 ChipIntelliAudio，播放完成后再在 loop 发起学习。
9. `end` 结束监听并清空两条队列及计数，不代表已停止正在进行的录音。若录音被休眠、重置或默认命令冲突中断，SDK 可能锁定继续学习直到 MCU 重启；识别与删除仍可用。
10. CI1302 的用户代码/SRAM 空间有限，优先精简示例。包含串口诊断、名称字符串及音频提示的完整流程应选 CI1303 或 CI1306。
