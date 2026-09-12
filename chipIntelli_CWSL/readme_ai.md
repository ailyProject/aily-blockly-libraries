# ChipIntelliCWSL

CI13XX 命令词/唤醒词自学习、模板管理与异步事件积木。

## Library Info
- **名称**: `@aily-project/lib-chipintelli-cwsl`
- **版本**: 1.2.0

## Preferred: managed voice learning

For complete voice-only projects use the five `chipintelli_cwsl_voice_learning_*` blocks below. They own prompting, a 250 ms quiet interval, event matching, targeted deletion, and bounded playback/operation waits. Do not ask AI to reconstruct these stages with numeric phase variables. The raw API remains available for advanced applications, as a separate mode.

- Connect a **fixed-ID command definition** directly to the controller's COMMAND_ID input. Numeric literals and variables are rejected here so missing vocabulary cannot silently pass generation. Define an explicit ASR wake phrase; its first ID is 1.
- Use ASR command handlers only to submit first-learning, replacement or targeted-deletion actions. Busy requests are ignored. The controller starts recording only after its own accepted prompt completes and audio/engine are idle. Requests for other prompt playback/stop are guarded by Audio 1.1.0 while it is busy.
- Do not mix this controller with raw CWSL init/end/learn/delete/read/clear blocks, Audio end or Audio finished-event blocks. They would compete for the same engine/queue/callback; generation reports an error.
- First learning never erases templates. Replacement/deletion addresses only the configured ID/group. A zero category count skips nonexistent deletion; a positive category count is not proof of target existence, so a rejected targeted deletion reports failure without learning or deleting other targets.
- Initialization and playback rejection do not wait forever for events. SDK conflict, lost terminal events or operation timeout disable further learning until restart. The error value explains the reason. Feedback still works when Audio is ready but CWSL initialization failed; state 255 does not trap a failure-feedback wait.
- The controller returns learned recognition through ASR normally. Put business actions under a not-busy guard and handle each command once. No separate target_id, prompt_done, phase or event-match variables are needed.
- The controller cannot verify physical audibility or repair incorrect external resource binaries. Muted/zero-volume prompts are rejected before recording. Build matching resources, then test real speech and power-cycle persistence on hardware.

## Resources and command IDs

CWSL learns a sound template for an **existing command ID**. The SDK persists it across power cycles. It does not transcribe arbitrary speech or add `cmd_info` entries at runtime. A learned phrase still reports the original resource ID and text. Erasing learned templates does not erase built-in vocabulary.

1. Select the **CWSL or CWSL+AEC** algorithm profile and use the board core's ChipIntelliCWSL 1.1.0 or a compatible newer API. An ASR-only profile may wake and respond while learning is unavailable. Prefer CI1303/CI1306 for full voice interaction; CI1302 requires a smaller SRAM footprint.
2. Include the ASR and Audio Blockly libraries. Wake-word, text-command and prompt blocks emit `WAKEWORD<n>`, `COMMAND<n>` and `VOICE<n>` macros with text comments. The normal **citool-cli** build generates matching resources from these declarations; do not create a separate Python generator. Online generation uses the existing Aily login. Check that logs show the current vocabulary; fallback to old resources is not a successful update.
3. Ordinary targets must be ordinary resource entries; wake targets must be wake entries. An ID without an entry is rejected. `chipintelli_asr_command_id(100)` only references a number: it neither defines vocabulary nor reserves an automatic ID. This block requires ASR Blockly package 2.4.0 or newer.
4. For a persistent learning target, define `chipintelli_asr_command_fixed_id("执行操作", 1000)` once and reference ID 1000. Automatic commands and additional wake words avoid connected fixed definitions and reserved 199–208. The first explicit wake word stays ID 1. If using automatic text IDs instead, reuse the text block output and verify the mapping after edits; never assume ID 2.

| Purpose | Resource plan | CWSL operation |
|---|---|---|
| Built-in wake phrase “你好小智” | One ASR wake-word setter in setup; the first gets ID 1 | `WAKE`, numeric ID block 1, group 0 |
| Learned execution phrase | Define “执行操作” with the fixed-ID command block, ID 1000 | `COMMAND`, numeric ID block 1000, group 0 |
| Learning/replacement/deletion controls | Define separate commands: “学习命令词”, “学习唤醒词”, “修改命令词”, “修改唤醒词”, “删除学习内容” | Dispatch actions; **never reuse these IDs as learning targets** |
| Instructions | Audio prompt blocks generate VOICE macros | Finish playback and a quiet interval before requesting learning |

Learned recognition also enters normal ASR dispatch. Reusing the ID of “学习命令词” as a target makes the learned phrase start learning again. Handle execution in either the ASR handler or CWSL `Recognized` processing, once, to avoid duplicate responses.

### ID pitfalls to check before learning

- The numeric ID block now defaults to 1000, but a reference alone does not create an entry or reserve that number. The matching fixed-ID definition is what creates the resource and keeps automatic controls away. Keep that definition connected and enabled.
- Conflicting fixed definitions fail generation. Reusing an ID in several references is normal; registering several ASR event handlers for one ID replaces the earlier handler, so combine their actions.
- Keep fixed target IDs across firmware revisions. Saved templates are not automatically migrated when ordinary auto IDs change. Skipping reserved IDs or introducing a low fixed ID can change older automatic mappings. Do not automatically delete user templates to hide such a mismatch.
- Always define an explicit wake phrase in CWSL projects. Without a WAKEWORD macro, citool-cli's legacy rule turns the first COMMAND into a wake entry, which can make ordinary learning fail on word-type mismatch.
- A free ID is insufficient for learning: its resource must exist with the correct word type. The allocator checks this workspace's definitions, not a device's flash or arbitrary external resource files. A larger number alone cannot establish correctness.

## Raw API flow (advanced; separate from managed mode)

Unless requested otherwise, use voice controls and spoken feedback without buttons or serial input. Serial output is optional diagnostics. Track application `phase`, pending action, target word type/ID/group, replacement-after-delete flag, prompt completion flag and timestamps.

| Phase | Action | Condition for advancing |
|---|---|---|
| Initialization | Initialize ASR, Chinese Audio, wake word and CWSL in setup; check `is_begun`, `profile_enabled` and Audio readiness | Accept learning only after initialization; do not automatically erase or learn at boot |
| Idle | ASR handlers record actions; discard controls received while busy or playing | In loop require application idle, audio idle and CWSL state **0 or 1** |
| First learning | Confirm the target has no template; prepare instructions explaining when to speak and how retries work | Proceed directly to the prompt; no preliminary deletion |
| Replacement | Submit target deletion; immediately check `last_error == error_value(0)` | Wait only if accepted; on rejection report failure without setting a wait flag |
| Deletion wait | Drain events, match phase, word type, command ID and group ID | Only **7 DeleteSucceeded** may start replacement; **9 DeleteFailed** ends the operation |
| Prompt | Reset the current completion flag, then play instructions; completion handler only sets the flag | Require completion and audio idle, followed by about 250 ms of quiet; abort if completion times out |
| Submit learning | Recheck engine availability, submit `learn`, immediately inspect `last_error` | Only error 0 enters learning wait; rejection needs feedback, not a terminal-event wait |
| Record/retry | Drain events; do not play audio, resubmit learning or delete | Events 1/2/3 update status; 4 success, 5 failure and 6 cancellation are terminal |
| Feedback | Save the matching terminal result and schedule feedback | Wait for engine state 0/1 before speaking; return to idle after playback and quiet |

**Playback is asynchronous.** `playVoice(id, true)` interrupts the current request; it does not wait for completion. Do not call learning on the next line. Do not wait for `LearningStarted` or `RecordingStarted` before saying “请说出命令”: capture may already have started. The SDK may immediately retry after event 3. Explain retries in the initial prompt and keep the speaker silent during capture.

Audio completion means the SDK handled the playback request, not that its resource existed or was audible. The Blockly play block does not return acceptance. Check Audio readiness, generate valid VOICE resources, and time out missing completion. A timeout is never permission to record. Only completion during the current prompt phase may advance learning; startup or wake-feedback completion must not accidentally set that flag.

`is_begun` means initialized; `available` means unread events. Neither means the engine accepts new operations. A running recognizer may be in state 1: do not gate everything on `state == 0`. Even in state 0/1 a request can be rejected for its ID, template or SDK protection state, so always check the immediate error.

## Raw events and recovery

| Event | Meaning | Handling |
|---|---|---|
| 1 LearningStarted | Learning flow started | Do not play instructions |
| 2 RecordingStarted | Recording request submitted, not an exact hardware capture-start notification | Do not play instructions |
| 3 AttemptResult | One recording/registration attempt finished | Inspect `attempt/result`; SDK retries automatically, so do not resubmit learn |
| 4 LearningSucceeded | Learning completed and template saved | Match target, schedule success feedback |
| 5 LearningFailed / 6 LearningCancelled | Learning ended | Clear current pending action, schedule failure/cancellation feedback |
| 7 DeleteSucceeded / 9 DeleteFailed | Deletion succeeded/failed | Only 7 can trigger a previously requested replacement |
| 8 Recognized | Learned template recognized | Perform the application action; `groupId` is 65535 because SDK does not report the group, so do not require group 0 |

Match single-template events by `(wordType, commandId, groupId)`. Bulk deletion uses wildcard ID/group `4294967295`/`65535`; do not match `erase_templates` completion against a single target ID. Word types are ordinary 0, wake 1 and all 2.

- Control blocks discard native bool results. Immediately after learn/cancel/delete compare `last_error` with `error_value(0)`. Nonzero means not accepted and normally no corresponding completion event follows. Another control call overwrites the error; handle or save it immediately.
- Asynchronous failure is reported by event `result`, not just request `last_error`. Result 6 means default-command conflict. SDK may block learning until MCU restart. Ask for a phrase different from built-in controls and restart after recording ends. `begin/end/clear_events` do not replace this recovery.
- Active capture cannot be cancelled after learning starts. A voice cancel command can cancel application confirmation/prompt stages; do not promise cancellation during capture. A timeout must not force application idle and immediately submit another operation. Wait for termination and engine release, or guide the user to restart after an abnormal operation.
- An ordinary ID/group needs deletion before relearning; a wake ID/group can hold two learned phrases. Replacement removes old templates first; failure does not restore them. The built-in wake phrase remains for recovery.
- `count(COMMAND/WAKE)` counts a whole category, not a target ID/group. Use it to detect first learning only if the project owns one target in that category. Do not clear a category merely to replace one target. A fresh board should learn directly, rather than using deletion failure as the trigger.

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `chipintelli_cwsl_voice_learning_init` | 语句 | COMMAND_ID(input_value), WAKE_ID(input_value), GROUP_ID(input_value), COMMAND_PROMPT(input_value), WAKE_PROMPT(input_value), SUCCESS_PROMPT(input_value), FAILURE_PROMPT(input_value) | `chipintelli_cwsl_voice_learning_init(chipintelli_asr_command_fixed_id("执行操作", 1000), chipintelli_asr_command_id(1), math_number(0), chipintelli_audio_voice("请说命令"), chipintelli_audio_voice("请说唤醒词"), chipintelli_audio_voice("操作成功"), chipintelli_audio_voice("操作失败"))` | `ailyChipIntelliVoiceLearning.begin(...);` |
| `chipintelli_cwsl_voice_learning_request` | 语句 | ACTION(dropdown) | `chipintelli_cwsl_voice_learning_request(LEARN_COMMAND)` | `ailyChipIntelliVoiceLearning.request(1);` |
| `chipintelli_cwsl_voice_learning_busy` | 值(Boolean) | (none) | `chipintelli_cwsl_voice_learning_busy()` | `ailyChipIntelliCWSLVoiceBusy()` |
| `chipintelli_cwsl_voice_learning_ready` | 值(Boolean) | (none) | `chipintelli_cwsl_voice_learning_ready()` | `ailyChipIntelliVoiceLearning.ready` |
| `chipintelli_cwsl_voice_learning_error` | 值(String) | (none) | `chipintelli_cwsl_voice_learning_error()` | `String(ailyChipIntelliVoiceLearning.error)` |
| `chipintelli_cwsl_init` | 语句 | TIMEOUT(input_value) | `chipintelli_cwsl_init(math_number(10000))` | `ChipIntelliCWSL.begin((uint32_t)max(0L, (long)(10000)));` |
| `chipintelli_cwsl_end` | 语句 | (none) | `chipintelli_cwsl_end()` | `ChipIntelliCWSL.end();` |
| `chipintelli_cwsl_learn` | 语句 | WORD_TYPE(dropdown), COMMAND_ID(input_value), GROUP_ID(input_value) | `chipintelli_cwsl_learn(COMMAND, math_number(2), math_number(0))` | `ChipIntelliCWSL.learnCommand(ailyChipIntelliCWSLCommandId(2), ailyChipIntelliCWSLGroupId(0));` |
| `chipintelli_cwsl_cancel_learning` | 语句 | (none) | `chipintelli_cwsl_cancel_learning()` | `ChipIntelliCWSL.cancelLearning();` |
| `chipintelli_cwsl_erase_template` | 语句 | WORD_TYPE(dropdown), COMMAND_ID(input_value), GROUP_ID(input_value) | `chipintelli_cwsl_erase_template(COMMAND, math_number(2), math_number(0))` | `ChipIntelliCWSL.eraseCommand(ailyChipIntelliCWSLCommandId(2), ailyChipIntelliCWSLGroupId(0));` |
| `chipintelli_cwsl_erase_templates` | 语句 | SCOPE(dropdown) | `chipintelli_cwsl_erase_templates(ALL)` | `ChipIntelliCWSL.eraseAll();` |
| `chipintelli_cwsl_read_events` | 语句 | HANDLER(input_statement) | `chipintelli_cwsl_read_events()` | `while (ChipIntelliCWSL.read(ailyChipIntelliCWSLEvent)) { ↵ }` |
| `chipintelli_cwsl_profile_enabled` | 值(Boolean) | (none) | `chipintelli_cwsl_profile_enabled()` | `ChipIntelliCWSL.profileEnabled()` |
| `chipintelli_cwsl_available` | 值(Boolean) | (none) | `chipintelli_cwsl_available()` | `ChipIntelliCWSL.available()` |
| `chipintelli_cwsl_state` | 值(Number) | (none) | `chipintelli_cwsl_state()` | `static_cast<uint8_t>(ChipIntelliCWSL.state())` |
| `chipintelli_cwsl_state_value` | 值(Number) | STATE(dropdown) | `chipintelli_cwsl_state_value(0)` | `0` |
| `chipintelli_cwsl_count` | 值(Number) | COUNT_TYPE(dropdown) | `chipintelli_cwsl_count(TEMPLATE)` | `ChipIntelliCWSL.templateCount()` |
| `chipintelli_cwsl_dropped_events` | 值(Number) | (none) | `chipintelli_cwsl_dropped_events()` | `ChipIntelliCWSL.droppedEvents()` |
| `chipintelli_cwsl_event_type` | 值(Number) | (none) | `chipintelli_cwsl_event_type()` | `static_cast<uint8_t>(ailyChipIntelliCWSLEvent.type)` |
| `chipintelli_cwsl_event_word_type` | 值(Number) | (none) | `chipintelli_cwsl_event_word_type()` | `static_cast<uint8_t>(ailyChipIntelliCWSLEvent.wordType)` |
| `chipintelli_cwsl_event_attempt` | 值(Number) | (none) | `chipintelli_cwsl_event_attempt()` | `ailyChipIntelliCWSLEvent.attempt` |
| `chipintelli_cwsl_event_result` | 值(Number) | (none) | `chipintelli_cwsl_event_result()` | `static_cast<uint8_t>(ailyChipIntelliCWSLEvent.result)` |
| `chipintelli_cwsl_event_command_id` | 值(Number) | (none) | `chipintelli_cwsl_event_command_id()` | `ailyChipIntelliCWSLEvent.commandId` |
| `chipintelli_cwsl_event_group_id` | 值(Number) | (none) | `chipintelli_cwsl_event_group_id()` | `ailyChipIntelliCWSLEvent.groupId` |
| `chipintelli_cwsl_event_distance` | 值(Number) | (none) | `chipintelli_cwsl_event_distance()` | `ailyChipIntelliCWSLEvent.distance` |
| `chipintelli_cwsl_event_type_value` | 值(Number) | EVENT_TYPE(dropdown) | `chipintelli_cwsl_event_type_value(4)` | `4` |
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

- Managed `ACTION`: `LEARN_COMMAND`, `LEARN_WAKE`, `REPLACE_COMMAND`, `REPLACE_WAKE`, `DELETE_COMMAND`, `DELETE_WAKE`. The four prompt inputs are voice-resource IDs. The controller waits up to 60 seconds per operation/playback phase; this is not a configurable SDK recording duration.

- 学习/删除的 `WORD_TYPE`: `COMMAND` 普通命令词，`WAKE` 唤醒词；词类型常量块为 `0` 命令词、`1` 唤醒词、`2` 全部。
- `SCOPE`: `COMMANDS`、`WAKE_WORDS`、`ALL`。
- `COUNT_TYPE`: `COMMAND`、`WAKE`、`TEMPLATE`、`REMAINING`、`MAX`。
- `STATE`: `0` 空闲、`1` 识别、`2` 学习、`3` 删除、`255` 不可用。
- `EVENT_TYPE`: `1` 学习开始、`2` 录音请求提交、`3` 单次结果、`4` 学习成功、`5` 学习失败、`6` 取消、`7` 删除成功、`8` 识别、`9` 删除失败。
- `RESULT`: `0` 录音成功、`1` 录音失败、`2` 注册完成、`3` 注册中止、`4` 有效帧不足、`5` 数据无效、`6` 默认命令冲突。
- `ERROR`: `0` None、`1` ProfileDisabled、`2` SDKStartFailed、`3` SDKFailed、`4` Timeout、`5` RequestRejected。
- `DETAIL`: `TYPE` 事件类型、`RESULT` 尝试结果、`WORD_TYPE` 词类型。名称与错误说明均为上游提供的英文字符串。

## ABS Examples

### Complete voice-only learning project

This is one complete project, not fragments to concatenate. The controller adds its own loop service; ASR handlers add tick(). It creates the fixed target resource in setup and registers execution by the same ID. Replace the final execution handler body with application actions, keeping its not-busy guard. Wait for the wake session to expire before testing a learned wake phrase.

```abs
arduino_setup()
    chipintelli_asr_init()
    chipintelli_audio_init(CHIPINTELLI_LANGUAGE_ZH)
    chipintelli_asr_set_wake_word("你好小智")
    chipintelli_cwsl_voice_learning_init(chipintelli_asr_command_fixed_id("执行操作", 1000), chipintelli_asr_command_id(1), math_number(0), chipintelli_audio_voice("提示结束后，说出新的命令短语。没有听到结果时，请间隔两秒重复。"), chipintelli_audio_voice("提示结束后，说出新的唤醒短语。没有听到结果时，请间隔两秒重复。"), chipintelli_audio_voice("操作成功，已经保存。"), chipintelli_audio_voice("操作失败。如果再次学习仍然失败，请重新上电并换一个短语。"))

chipintelli_asr_on_startup()
    @HANDLER:
        controls_if(chipintelli_cwsl_voice_learning_ready())
            @DO0:
                chipintelli_audio_play_voice(chipintelli_audio_voice("语音学习已就绪。请说你好小智，再说学习命令词或学习唤醒词。"), false)

chipintelli_asr_on_wakeup()
    @HANDLER:
        controls_if(logic_negate(chipintelli_cwsl_voice_learning_busy()))
            @DO0:
                chipintelli_asr_keep_awake_for(math_number(30))
                chipintelli_audio_play_voice(chipintelli_audio_voice("我在"), false)

chipintelli_asr_on_command(chipintelli_asr_command("学习命令词"))
    @HANDLER:
        chipintelli_cwsl_voice_learning_request(LEARN_COMMAND)

chipintelli_asr_on_command(chipintelli_asr_command("学习唤醒词"))
    @HANDLER:
        chipintelli_cwsl_voice_learning_request(LEARN_WAKE)

chipintelli_asr_on_command(chipintelli_asr_command("修改命令词"))
    @HANDLER:
        chipintelli_cwsl_voice_learning_request(REPLACE_COMMAND)

chipintelli_asr_on_command(chipintelli_asr_command("修改唤醒词"))
    @HANDLER:
        chipintelli_cwsl_voice_learning_request(REPLACE_WAKE)

chipintelli_asr_on_command(chipintelli_asr_command("删除命令词"))
    @HANDLER:
        chipintelli_cwsl_voice_learning_request(DELETE_COMMAND)

chipintelli_asr_on_command(chipintelli_asr_command("删除唤醒词"))
    @HANDLER:
        chipintelli_cwsl_voice_learning_request(DELETE_WAKE)

chipintelli_asr_on_command(chipintelli_asr_command_id(1000))
    @HANDLER:
        controls_if(logic_negate(chipintelli_cwsl_voice_learning_busy()))
            @DO0:
                chipintelli_audio_play_voice(chipintelli_audio_voice("收到命令，操作已执行。"), false)

arduino_loop()
    time_delay(math_number(1))
```

### Diagnosing older manually assembled code

Check for missing COMMAND1000 and an uninitialized global target_id first. Then check unconditional wake/startup audio, audio acceptance, feedback timeouts and state-255 error recovery. Global shared variables must use explicit global declarations; ordinary variable_define inside setup can be local. Do not repair only the numeric ID and assume the rest of a manual phase machine is correct.

## Notes

1. 命令 ID 范围 0～65535、组 ID 范围 0～255，199～208 为保留命令。生成器将越界 ID 转为上游拒绝值，避免窄整数截断后误操作其他模板。模板总容量用 `count(MAX/REMAINING)` 查询，不要假定固定容量。
2. 初始化成功前 `state` 为 255、容量查询为 -1。`begin` 的默认等待时间为 10000 ms，这是初始化等待参数，不是用户录音时长。
3. `event_*` 值块只在 `read_events` 的 HANDLER 内读取；生成器自动声明全局事件结构。需跨循环使用时保存必要字段，后续读取会覆盖当前事件。
4. 轮询与原生回调各有独立容量为 15 的事件队列，满时丢弃新事件。Blockly 优先检查 `dropped_read_events`；旧 `dropped_events` 是两条路径之和。不要长时间阻塞 loop，否则可能丢失学习完成事件。
5. `clear_events` 只丢弃轮询积压，不取消操作；不能用它等待或确认学习完成。`end` 结束监听并清空队列/计数，也不代表采音已经停止。等待操作期间不要调用这两个块来“恢复状态”。
6. CWSL 控制调用放在 setup、loop 或普通任务中。原生 `onEvent` 回调内的控制请求可能被拒绝。ASR Blockly 事件与 Audio 完成事件在 loop 分发；仍建议只记录待办，由统一状态流程调度。
7. 语音测试顺序：先确认内置唤醒和控制口令有效，再首次学习普通目标、测试执行、修改后再次测试，最后学习唤醒词。测试新唤醒词前先等命令会话超时；已唤醒时说出短语不能证明它能唤醒。最后断电重启验证模板保留。编译通过或串口显示初始化成功都不能代替实际语音验收。
8. 诊断“有响应但不能学习”时依次检查：CWSL 配置与初始化 → 目标 ID/词类型及控制 ID 分离 → 状态是否被错误限定为 0 → 提示音是否仍在播放 → 请求即时错误 → 终结事件及结果 6 → 事件丢弃计数。确认是默认命令冲突后，提示更换短语并重启恢复学习。
