# 语音识别模块

Emakefun语音识别模块库，支持自动识别、按键触发、关键词触发等多种模式。

## 库信息
- **名称**: @aily-project/lib-emakefun_speech_recognizer
- **版本**: 1.0.0

## 块定义

| 块类型 | 连接类型 | 参数（args0顺序） | ABS格式 | 生成代码 |
|--------|----------|-------------------|---------|----------|
| `speech_recognizer_setup` | Statement | VAR(field_input), I2C_ADDRESS(field_input) | `speech_recognizer_setup("speechRecognizer", "0x30")` | `emakefun::SpeechRecognizer speechRecognizer(Wire, 0x30);` |
| `speech_recognizer_set_mode` | Statement | VAR(field_variable), MODE(field_dropdown) | `speech_recognizer_set_mode($speechRecognizer, kRecognitionAuto)` | `speechRecognizer.SetRecognitionMode(...);` |
| `speech_recognizer_set_timeout` | Statement | VAR(field_variable), TIMEOUT(input_value) | `speech_recognizer_set_timeout($speechRecognizer, math_number(10000))` | `speechRecognizer.SetTimeout(10000);` |
| `speech_recognizer_add_keyword` | Statement | KEYWORD(input_value), INDEX(input_value), VAR(field_variable) | `speech_recognizer_add_keyword(text("小易小易"), math_number(0), $speechRecognizer)` | `speechRecognizer.AddKeyword(0, "小易小易");` |
| `speech_recognizer_recognize` | Value | VAR(field_variable) | `speech_recognizer_recognize($speechRecognizer)` | `speechRecognizer.Recognize()` |
| `speech_recognizer_get_event` | Value | VAR(field_variable) | `speech_recognizer_get_event($speechRecognizer)` | `speechRecognizer.GetEvent()` |
| `speech_recognizer_event_handler` | Hat | VAR(field_variable), EVENT(field_dropdown), HANDLER(input_statement) | `speech_recognizer_event_handler($speechRecognizer, kEventSpeechRecognized) @HANDLER: action()` | 事件检查代码 |
| `speech_recognizer_check_result` | Value | RESULT(input_value), INDEX(input_value) | `speech_recognizer_check_result(speech_recognizer_recognize($speechRecognizer), math_number(0))` | `(result == 0)` |

## 参数选项

| 参数 | 值 | 描述 |
|------|-----|------|
| MODE | kRecognitionAuto | 自动识别模式 |
| MODE | kButtonTrigger | 按键触发识别模式 |
| MODE | kKeywordTrigger | 关键词触发识别模式 |
| MODE | kKeywordOrButtonTrigger | 按键或关键词触发识别模式 |
| EVENT | kEventStartWaitingForTrigger | 开始等待触发 |
| EVENT | kEventButtonTriggered | 被按键触发 |
| EVENT | kEventKeywordTriggered | 被关键词触发 |
| EVENT | kEventStartRecognizing | 开始识别 |
| EVENT | kEventSpeechRecognized | 识别成功 |
| EVENT | kEventSpeechRecognitionTimedOut | 识别超时 |

## ABS示例

### 自动识别模式
```
arduino_setup()
    speech_recognizer_setup("speechRecognizer", "0x30")
    speech_recognizer_add_keyword(text("小易小易"), math_number(0), $speechRecognizer)
    speech_recognizer_add_keyword(text("北京"), math_number(1), $speechRecognizer)
    speech_recognizer_add_keyword(text("上海"), math_number(2), $speechRecognizer)

arduino_loop()
    controls_if()
        @IF0: logic_compare(speech_recognizer_recognize($speechRecognizer), EQ, math_number(0))
        @DO0:
            serial_println(Serial, text("识别到：小易小易"))
    controls_if()
        @IF0: logic_compare(speech_recognizer_recognize($speechRecognizer), EQ, math_number(1))
        @DO0:
            serial_println(Serial, text("识别到：北京"))
```

### 按键触发模式
```
arduino_setup()
    speech_recognizer_setup("speechRecognizer", "0x30")
    speech_recognizer_set_mode($speechRecognizer, kButtonTrigger)
    speech_recognizer_set_timeout($speechRecognizer, math_number(10000))
    speech_recognizer_add_keyword(text("北京"), math_number(0), $speechRecognizer)

arduino_loop()
    speech_recognizer_recognize($speechRecognizer)
    speech_recognizer_event_handler($speechRecognizer, kEventSpeechRecognized)
        @HANDLER:
            serial_println(Serial, text("识别成功"))
```

## 注意事项

1. **初始化**: 必须在`arduino_setup()`中调用`speech_recognizer_setup`初始化模块
2. **循环调用**: `speech_recognizer_recognize`需要在`arduino_loop()`中循环调用以推进识别工作
3. **变量引用**: 使用`$varName`引用已创建的语音识别对象
4. **I2C地址**: 默认地址为0x30，可根据实际硬件修改
5. **关键词限制**: 最多50个关键词，每个关键词最大50字节
6. **超时设置**: `speech_recognizer_set_timeout`对自动识别模式无效