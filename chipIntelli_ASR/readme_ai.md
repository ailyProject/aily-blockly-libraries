# ChipIntelliASR

基于 `ChipIntelliASR 2.3.0` 的 CI13XX 离线语音识别积木。事件积木在 setup 中注册 `attach*` 回调，并在 loop 中非阻塞调用 `tick()`。每个唤醒词积木生成对应的 `WAKEWORD<n>` 宏并在当前位置启用唤醒词模式。`keep_awake_for` 的工具箱影子输入初始为 15 秒，但只有实际放置该积木才会调用 `keepAwakeFor()`。

## Library Info

- **Name**: `@aily-project/lib-chipintelli-asr`
- **Version**: 2.4.1
- **Object**: global singleton `ChipIntelliASR`

## 命令词、ID 引用与识别结果

| 需求 | 使用的值块 | 是否生成资源词条 |
|---|---|---|
| 定义“执行操作”等固定命令，并取得其 ID | `chipintelli_asr_command("执行操作")` | 是，生成 `COMMAND<n>` 宏和文本注释；相同文本复用 ID |
| 为学习目标定义稳定且可避让的 ID | `chipintelli_asr_command_fixed_id("执行操作", 1000)` | 是，生成 `COMMAND1000`，并预留给此文本 |
| 已知资源 ID，连接到 ASR 事件或 CWSL 学习/删除 | `chipintelli_asr_command_id(100)` | 否，仅输出数字 `100` |
| 判断本次识别的是哪个命令 | `chipintelli_asr_result_command_id()` | 否，读取当前结果，只在结果处理体内使用 |

数字 ID 引用块默认 1000，以减少误用常见的低编号；默认值不代表资源已存在。它原样输出用户填写的数字，不创建或预留词条，也不能擅自把一次引用改成另一个 ID。为新学习目标使用“固定 ID 命令词”定义块，随后用 ID 引用块或相同文本块引用。

### ID allocation and collision rules

- Before emitting vocabulary, the generator scans all connected, enabled fixed-ID definitions. Automatic command and additional wake IDs skip these IDs and SDK control IDs 199–208, regardless of traversal order. The first explicit wake remains ID 1.
- Fixed definitions allow IDs 2–65535 except 199–208; 0 and 1 are reserved by the allocator. Different texts cannot define the same fixed ID, and one text cannot have different fixed IDs. Identical definitions are deduplicated. Automatic text blocks with the same text reuse the fixed ID.
- The suggested ID 1000 reduces overlap with short automatic vocabularies, but is not universally free. Actual avoidance comes from a fixed definition, not a large numeric reference. Two references to one ID are valid; two different definitions of that ID are not.
- Numeric references never reserve IDs, so intentional references to existing automatic resources still work. External firmware resources, manually written C++ macros and runtime variable values cannot be fully inspected by this Blockly allocator; verify their mappings yourself.
- Saved CWSL templates bind to IDs, not block positions or text. Keep learning targets fixed across firmware revisions. Adding fixed definitions or skipping 199–208 can renumber automatic commands; record the old mapping before updating a device with saved templates. Never reuse an old target ID for a different action without an explicit migration/erase decision.
- Two ASR command event blocks for the same ID do not create independent listeners: the native API replaces the earlier handler. Put all actions for one command inside one handler. ASR and CWSL recognition can both report the same learned phrase, so dispatch its action once.
- citool-cli treats the first COMMAND as a legacy wake entry when no WAKEWORD macro exists. For CWSL projects always set an explicit wake word; otherwise an intended ordinary learning target can become a wake entry. Text and fixed-ID definition blocks include ASR.h even when used only as CWSL values.
- Resource text must be a single line and must not end with a backslash; unsafe comment continuation is rejected before generating macros.

CWSL 学习目标必须是资源中已有、词类型匹配的 ID。学习普通命令时，控制口令“学习命令词”和目标“执行操作”必须使用不同 ID，否则学到的新短语会再次触发学习控制。第一个显式唤醒词为 ID 1，可用数字 ID 块连接 CWSL 的 WAKE 输入。学习得到的是该 ID 的声音模板，识别文本仍是资源中的原始文字。完整异步流程见 [CWSL AI 文档](../chipIntelli_CWSL/readme_ai.md)。

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `chipintelli_asr_init` | 语句 | (none) | `chipintelli_asr_init()` | `ChipIntelliASR.begin();` |
| `chipintelli_asr_set_wake_word` | 语句 | WAKE_WORD(field_input) | `chipintelli_asr_set_wake_word("智能管家")` | `ChipIntelliASR.setWakeWordEnabled(true);` |
| `chipintelli_asr_end` | 语句 | (none) | `chipintelli_asr_end()` | `ChipIntelliASR.end();` |
| `chipintelli_asr_on_startup` | 事件 | HANDLER(input_statement) | `chipintelli_asr_on_startup()` | `void ailyChipIntelliASRCallback1() { ↵ } ↵ ChipIntelliASR.attachStartup(ailyChipIntelliASRCallback1); ↵ ChipIntelliASR.tick();` |
| `chipintelli_asr_on_wakeup` | 事件 | HANDLER(input_statement) | `chipintelli_asr_on_wakeup()` | `void ailyChipIntelliASRCallback1() { ↵ } ↵ ChipIntelliASR.attachWakeup(ailyChipIntelliASRCallback1); ↵ ChipIntelliASR.tick();` |
| `chipintelli_asr_on_timeout` | 事件 | HANDLER(input_statement) | `chipintelli_asr_on_timeout()` | `void ailyChipIntelliASRCallback1() { ↵ } ↵ ChipIntelliASR.attachTimeout(ailyChipIntelliASRCallback1); ↵ ChipIntelliASR.tick();` |
| `chipintelli_asr_on_result` | 事件 | HANDLER(input_statement) | `chipintelli_asr_on_result()` | `ChipIntelliASRResult ailyChipIntelliASRResult = {}; ↵ void ailyChipIntelliASRCallback1(const ChipIntelliASRResult &result) { ↵ ailyChipIntelliASRResult = result; ↵ } ↵ ChipIntelliASR.onResult(ailyChipIntelliASRCallback1); ↵ ChipIntelliASR.tick();` |
| `chipintelli_asr_on_command` | 事件 | COMMAND(input_value), HANDLER(input_statement) | `chipintelli_asr_on_command(chipintelli_asr_command("打开灯"))` | `ChipIntelliASRResult ailyChipIntelliASRResult = {}; ↵ void ailyChipIntelliASRCallback1(const ChipIntelliASRResult &result) { ↵ ailyChipIntelliASRResult = result; ↵ } ↵ ChipIntelliASR.attachCommand((uint16_t)(COMMAND2), ailyChipIntelliASRCallback1); ↵ ChipIntelliASR.tick();` |
| `chipintelli_asr_on_semantic` | 事件 | SEMANTIC_ID(input_value), HANDLER(input_statement) | `chipintelli_asr_on_semantic(math_number(0))` | `ChipIntelliASRResult ailyChipIntelliASRResult = {}; ↵ void ailyChipIntelliASRCallback1(const ChipIntelliASRResult &result) { ↵ ailyChipIntelliASRResult = result; ↵ } ↵ ChipIntelliASR.attachSemantic((uint32_t)(0), ailyChipIntelliASRCallback1); ↵ ChipIntelliASR.tick();` |
| `chipintelli_asr_command` | 值(Number) | TEXT(field_input) | `chipintelli_asr_command("打开灯")` | `COMMAND2` |
| `chipintelli_asr_command_fixed_id` | 值(Number) | TEXT(field_input), COMMAND_ID(field_number) | `chipintelli_asr_command_fixed_id("执行操作", 1000)` | `COMMAND1000` |
| `chipintelli_asr_command_id` | 值(Number) | COMMAND_ID(field_number) | `chipintelli_asr_command_id(100)` | `100` |
| `chipintelli_asr_detach_lifecycle` | 语句 | EVENT(dropdown) | `chipintelli_asr_detach_lifecycle(STARTUP)` | `ChipIntelliASR.detachStartup();` |
| `chipintelli_asr_detach_command` | 语句 | COMMAND(input_value) | `chipintelli_asr_detach_command(math_number(2))` | `ChipIntelliASR.detachCommand((uint16_t)(2));` |
| `chipintelli_asr_detach_semantic` | 语句 | SEMANTIC_ID(input_value) | `chipintelli_asr_detach_semantic(math_number(31725955))` | `ChipIntelliASR.detachSemantic((uint32_t)(31725955));` |
| `chipintelli_asr_detach_handlers` | 语句 | HANDLERS(dropdown) | `chipintelli_asr_detach_handlers(COMMANDS)` | `ChipIntelliASR.detachAllCommands();` |
| `chipintelli_asr_keep_awake_for` | 语句 | TIMEOUT(input_value) | `chipintelli_asr_keep_awake_for(math_number(15))` | `ChipIntelliASR.keepAwakeFor((uint32_t)max(0L, (long)(15)) * 1000UL);` |
| `chipintelli_asr_is_awake` | 值(Boolean) | (none) | `chipintelli_asr_is_awake()` | `ChipIntelliASR.isAwake()` |
| `chipintelli_asr_read_results` | 语句 | HANDLER(input_statement) | `chipintelli_asr_read_results()` | `while (ChipIntelliASR.read(ailyChipIntelliASRResult)) { ↵ }` |
| `chipintelli_asr_available` | 值(Boolean) | (none) | `chipintelli_asr_available()` | `ChipIntelliASR.available()` |
| `chipintelli_asr_result_command_id` | 值(Number) | (none) | `chipintelli_asr_result_command_id()` | `ailyChipIntelliASRResult.commandId` |
| `chipintelli_asr_result_semantic_id` | 值(Number) | (none) | `chipintelli_asr_result_semantic_id()` | `ailyChipIntelliASRResult.semanticId` |
| `chipintelli_asr_result_score` | 值(Number) | (none) | `chipintelli_asr_result_score()` | `ailyChipIntelliASRResult.score` |
| `chipintelli_asr_result_frames` | 值(Number) | (none) | `chipintelli_asr_result_frames()` | `ailyChipIntelliASRResult.frames` |
| `chipintelli_asr_result_is_wake_word` | 值(Boolean) | (none) | `chipintelli_asr_result_is_wake_word()` | `ailyChipIntelliASRResult.isWakeWord` |
| `chipintelli_asr_result_text` | 值(String) | (none) | `chipintelli_asr_result_text()` | `String(ailyChipIntelliASRResult.text)` |
| `chipintelli_asr_result_text_truncated` | 值(Boolean) | (none) | `chipintelli_asr_result_text_truncated()` | `ailyChipIntelliASRResult.textTruncated` |
| `chipintelli_asr_pending_results` | 值(Number) | (none) | `chipintelli_asr_pending_results()` | `ChipIntelliASR.pendingResults()` |
| `chipintelli_asr_pending_events` | 值(Number) | (none) | `chipintelli_asr_pending_events()` | `ChipIntelliASR.pendingEvents()` |
| `chipintelli_asr_dropped_results` | 值(Number) | (none) | `chipintelli_asr_dropped_results()` | `ChipIntelliASR.droppedResults()` |
| `chipintelli_asr_dropped_events` | 值(Number) | (none) | `chipintelli_asr_dropped_events()` | `ChipIntelliASR.droppedEvents()` |
| `chipintelli_asr_handler_count` | 值(Number) | (none) | `chipintelli_asr_handler_count()` | `ChipIntelliASR.handlerCount()` |
| `chipintelli_asr_handler_capacity` | 值(Number) | (none) | `chipintelli_asr_handler_capacity()` | `ChipIntelliASR.handlerCapacity()` |
| `chipintelli_asr_last_error` | 值(Number) | (none) | `chipintelli_asr_last_error()` | `static_cast<uint8_t>(ChipIntelliASR.lastError())` |
| `chipintelli_asr_last_error_text` | 值(String) | (none) | `chipintelli_asr_last_error_text()` | `String(ChipIntelliASR.errorString(ChipIntelliASR.lastError()))` |
| `chipintelli_asr_aec_enabled` | 值(Boolean) | (none) | `chipintelli_asr_aec_enabled()` | `ChipIntelliASR.isAECEnabled()` |
| `chipintelli_asr_barge_in_enabled` | 值(Boolean) | (none) | `chipintelli_asr_barge_in_enabled()` | `ChipIntelliASR.isBargeInEnabled()` |
| `chipintelli_asr_barge_in_mode` | 值(Number) | (none) | `chipintelli_asr_barge_in_mode()` | `static_cast<uint8_t>(ChipIntelliASR.bargeInMode())` |
| `chipintelli_asr_barge_in_mode_value` | 值(Number) | MODE(dropdown) | `chipintelli_asr_barge_in_mode_value(0)` | `0` |

## Parameter Options

- `COMMAND_ID`: ID 引用块默认 1000，范围 0～65535，原样输出；固定定义块默认 1000，范围 2～65535 且禁止 199～208，生成资源宏。ID 1 留给首个唤醒词。

- `EVENT`: `STARTUP` 启动完成；`WAKEUP` 进入命令会话；`TIMEOUT` 命令会话超时。
- `HANDLERS`: `COMMANDS` 全部命令；`SEMANTICS` 全部语义；`ALL` 命令和语义。
- `MODE`: `0` 禁用；`1` 仅唤醒词；`2` 仅命令词；`3` 唤醒词和命令词。

## ABS Examples

```abs
arduino_setup()
    chipintelli_asr_init()
    chipintelli_asr_set_wake_word("智能管家")
    chipintelli_asr_set_wake_word("你好小智")
    serial_begin(Serial, 115200)

chipintelli_asr_on_wakeup()
    @HANDLER:
        chipintelli_asr_keep_awake_for(math_number(15))

chipintelli_asr_on_command(chipintelli_asr_command("打开灯"))
    @HANDLER:
        serial_println(Serial, chipintelli_asr_result_text())
```

生成代码会创建独立回调，把完整 `ChipIntelliASRResult` 复制到当前结果变量，在 setup 末尾调用 `attachWakeup()` / `attachCommand()`，并且只向 loop 添加一次 `ChipIntelliASR.tick()`。

### Stable learning target

Define the target once with ID 1000, and use ordinary text blocks for controls. A reference to 1000 intentionally addresses this definition; it must not be renumbered. This example defines resources and one execution handler, not the learning state machine (see the CWSL guide).

```abs
arduino_setup()
    chipintelli_asr_init()
    chipintelli_asr_set_wake_word("你好小智")
    serial_begin(Serial, 115200)
    variable_define_scoped(global, "target_id", int, chipintelli_asr_command_fixed_id("执行操作", 1000))

chipintelli_asr_on_command(chipintelli_asr_command("学习命令词"))
    @HANDLER:
        serial_println(Serial, text("Record a pending learning action here"))

chipintelli_asr_on_command(chipintelli_asr_command_id(1000))
    @HANDLER:
        serial_println(Serial, text("Execute the learned action"))
```

### 引用已存在的数字 ID

前提：已确认当前资源包含普通命令 ID 100。这个例子只注册处理函数，不生成命令 100 的资源；在自动资源项目中，应使用文本命令块定义目标并复用其输出。

```abs
arduino_setup()
    chipintelli_asr_init()
    serial_begin(Serial, 115200)

chipintelli_asr_on_command(chipintelli_asr_command_id(100))
    @HANDLER:
        serial_println(Serial, chipintelli_asr_result_command_id())
```

### Polling Alternative

```abs
arduino_setup()
    chipintelli_asr_init()
    chipintelli_asr_set_wake_word("智能管家")
    serial_begin(Serial, 115200)

arduino_loop()
    chipintelli_asr_read_results()
        @HANDLER:
            serial_println(Serial, chipintelli_asr_result_text())
```

## Global resource initializers

Resource and numeric-ID value blocks work inside global variable initializers, including root-level variable declarations. A floating value block alone still emits nothing. For variables shared by setup, loop and ASR handlers, use `variable_define_scoped(global, "target_id", int, chipintelli_asr_command_fixed_id("执行操作", 1000))`; an ordinary declaration placed inside setup may be local to setup.

After generation verify BOTH `#define COMMAND1000 1000 //执行操作` and `int target_id = COMMAND1000;`. A bare `int target_id;` is zero-initialized and cannot match events for 1000. A numeric-ID reference never substitutes for a resource definition. For voice learning, prefer the managed controller in CWSL 1.2.0; it takes the fixed definition directly and keeps its target internally.

## Notes

1. 当前结果 Getter 应放在 `on_result`、`on_command` 或 `read_results` 的 HANDLER 内。
2. `onResult()` 观察每个识别结果；命令处理函数按命令 ID 精确匹配。
3. 事件积木使用 `tick()`，轮询积木使用 `read()`；二者消费同一结果队列，通常不要混用。
4. 第一个唤醒词固定使用命令 ID 1；后续唤醒词与普通命令共享从 ID 2 开始的编号空间，并避开固定定义及 199～208。每个唤醒词积木独立生成宏，即使文本相同也不会合并；普通命令仍按文本去重。唤醒词积木会在自身位置生成 `setWakeWordEnabled(true)`，因此应放在初始化积木之后。
5. 初始化积木不会自动添加唤醒词宏，也不向用户暴露初始化等待时间；始终生成无参 `begin()`。
6. `keep_awake_for` 只在已经唤醒时按输入秒数重置命令响应窗口。15 秒只是工具箱自动连接的可编辑影子输入；如果程序中没有该积木，本库不会调用 `keepAwakeFor()`，实际窗口继续使用当前 CI13XX SDK/固件默认值，而本库文件没有声明该默认值。
7. 结果文本缓冲区容量为 64 字节；用 `result_text_truncated` 检查截断。
8. AEC 与语音打断能力由 Arduino 的编译时算法配置决定；相关 Getter 只报告当前编译配置，不会修改它。
9. `chipintelli_asr_on_semantic` 在 `block.json` 和 generator 中存在，但当前 `toolbox.json` 未列出；其 ABS 调用仍是有效的公开块调用。
