# ChipIntelliAudio

Plays generated voice prompts or project-local audio on CI13XX devices. Use `chipintelli_audio_voice` for fixed prompt text and pass its numeric output to `chipintelli_audio_play_voice`.

## Library Info

- **Name**: `@aily-project/lib-chipintelli-audio`
- **Version**: 1.1.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|---|---|---|---|---|
| `chipintelli_audio_init` | Statement | LANGUAGE(dropdown) | `chipintelli_audio_init(CHIPINTELLI_LANGUAGE_EN)` | `ChipIntelliAudio.begin(); ChipIntelliAudio.setVolume(100);` |
| `chipintelli_audio_end` | Statement | (none) | `chipintelli_audio_end()` | `ChipIntelliAudio.end();` |
| `chipintelli_audio_voice_settings` | Statement | VOICE_ROLE(dropdown), VOICE_VOLUME(field_number), VOICE_SPEED(field_number) | `chipintelli_audio_voice_settings("小小-伶俐女声", 10, 10)` | `//VOICE_ROLE:"小小-伶俐女声";VOICE_VOLUME:10;VOICE_SPEED:10;` |
| `chipintelli_audio_voice` | Value | TEXT(field_input) | `chipintelli_audio_voice("Hello")` | `VOICE1` |
| `chipintelli_audio_local_audio` | Value | AUDIO(field_audio) | `chipintelli_audio_local_audio({"audioPath":""})` | `0` |
| `chipintelli_audio_play_voice` | Statement | VOICE_ID(input_value), MODE(dropdown) | `chipintelli_audio_play_voice(chipintelli_audio_voice("Hello"), true)` | `ChipIntelliAudio.playVoice((uint16_t)(1), true);` |
| `chipintelli_audio_stop` | Statement | (none) | `chipintelli_audio_stop()` | `ChipIntelliAudio.stop();` |
| `chipintelli_audio_set_volume` | Statement | VOLUME(input_value) | `chipintelli_audio_set_volume(math_number(100))` | `ChipIntelliAudio.setVolume((uint8_t)constrain((int)(100), 0, 100));` |
| `chipintelli_audio_set_muted` | Statement | MUTED(input_value) | `chipintelli_audio_set_muted(logic_boolean(TRUE))` | `ChipIntelliAudio.setMuted((bool)(true));` |
| `chipintelli_audio_is_ready` | Value | (none) | `chipintelli_audio_is_ready()` | `ChipIntelliAudio.isReady()` |
| `chipintelli_audio_is_playing` | Value | (none) | `chipintelli_audio_is_playing()` | `ChipIntelliAudio.isPlaying()` |
| `chipintelli_audio_volume` | Value | (none) | `chipintelli_audio_volume()` | `ChipIntelliAudio.volume()` |
| `chipintelli_audio_is_muted` | Value | (none) | `chipintelli_audio_is_muted()` | `ChipIntelliAudio.isMuted()` |
| `chipintelli_audio_on_finished` | Hat | HANDLER(input_statement) | `chipintelli_audio_on_finished()` | `volatile bool ailyChipIntelliAudioFinished = false; ↵ void ailyChipIntelliAudioFinishedCallback(void *context) { ↵ (void)context; ↵ ailyChipIntelliAudioFinished = true; ↵ } ↵ void ailyChipIntelliAudioFinishedHandler() { ↵ } ↵ ChipIntelliAudio.onFinished(ailyChipIntelliAudioFinishedCallback); ↵ if (ailyChipIntelliAudioFinished) { ↵ ailyChipIntelliAudioFinished = false; ↵ ailyChipIntelliAudioFinishedHandler(); ↵ }` |

## Parameter Options

| Parameter | Values | Meaning |
|---|---|---|
| LANGUAGE | `CHIPINTELLI_LANGUAGE_ZH`, `CHIPINTELLI_LANGUAGE_EN`, `CHIPINTELLI_LANGUAGE_JA`, `CHIPINTELLI_LANGUAGE_KO`, `CHIPINTELLI_LANGUAGE_RU`, `CHIPINTELLI_LANGUAGE_ES`, `CHIPINTELLI_LANGUAGE_TH`, `CHIPINTELLI_LANGUAGE_DE`, `CHIPINTELLI_LANGUAGE_ID`, `CHIPINTELLI_LANGUAGE_VI`, `CHIPINTELLI_LANGUAGE_FR`, `CHIPINTELLI_LANGUAGE_PT`, `CHIPINTELLI_LANGUAGE_FA`, `CHIPINTELLI_LANGUAGE_TR`, `CHIPINTELLI_LANGUAGE_AR` | Chinese, English, Japanese, Korean, Russian, Spanish, Thai, German, Indonesian, Vietnamese, French, Portuguese, Persian, Turkish and Arabic numeric speech, respectively |
| VOICE_ROLE | `小小-伶俐女声`, `小蝶-清新女声`, `云儿-温柔女声`, `小爱-活泼女声`, `妞妞-中文女声`, `思思-知性女声`, `方方-标准女声`, `橙子-甜美客服`, `小雨-优雅女声`, `小韩-快乐女声`, `娇娇-邻家女声`, `小美-娇美女声`, `姗姗-温柔女声`, `阿文-温和男声`, `晓君-川话男声`, `阿月-粤语女声`, `阿栋-浑厚男声`, `可可-欢快女童`, `小萌-可爱女童`, `程程-标准男童`, `小英-高兴`, `小英-日常`, `小英-温和`, `小英-认真`, `小伦-日常`, `小伦-高兴`, `小伦-放松`, `小伦-认真`, `Ana-英语女声`, `Olivia-英语女声`, `Sophia-英语女声`, `Mia-英语女声`, `Harper-英语女声`, `Linda-英语女声`, `Dora-英语女声`, `Rebecca-英语女声`, `David-英语男声`, `Daniel-英语男声`, `James-英语男声`, `John-英语男声`, `Ava-英语女童`, `樱子-标准女声`, `Aiko-清新女声`, `Daichi-标准男声`, `Yoki-标准童声`, `智恩-韩文女声`, `尤金-韩文女声`, `俊昊-韩文男声`, `Alexey-俄语男声`, `Alina-俄语女声`, `Carlos-西班牙男声`, `Mateo-西班牙男声`, `Paula-西班牙女声`, `Bella-西班牙女声`, `Ken-泰语男声`, `Lemur-泰语女声`, `Supaporn-泰语女声`, `Felix-德语男声`, `Anna-德语女声`, `Paolo-印尼男声`, `Jessica-印尼女声`, `Khoa-越南语男声`, `Tuyet-越南语女声`, `Sophie-法语女声`, `Camille-法语女声`, `Louis-法语男声`, `Gabriel-法语男声`, `Beatriz-葡萄牙女声`, `Rodrigo-葡萄牙男声`, `Farzaneh-波斯女声`, `Ali-波斯男声`, `Mustafa-土耳其男声`, `Mehmet-土耳其女声`, `Jamila-阿拉伯女声`, `Emm-阿拉伯女声`, `Adam-阿拉伯男声`, `Rem-阿拉伯男声` | Generated-prompt voice role; these are the exact dropdown values |
| MODE | `true`, `false` | `true` interrupts the current prompt; `false` queues the request |

`VOICE_VOLUME` and `VOICE_SPEED` are integer fields from 0 to 20 and default to 10. Runtime `VOLUME` is a percentage and is constrained to 0–100. Initialization sets playback volume to 100%; the volume block also defaults to 100 when newly added or when its input is empty.

## ABS Examples

```abs
arduino_setup()
    chipintelli_audio_init(CHIPINTELLI_LANGUAGE_EN)
    chipintelli_audio_voice_settings("Ana-英语女声", 10, 10)
    serial_begin(Serial, 115200)
    chipintelli_audio_set_volume(math_number(100))
    chipintelli_audio_play_voice(chipintelli_audio_voice("System ready"), true)

    variable_define("number", int, math_number(300))
    chipintelli_audio_play_voice(variables_get($number), false)

chipintelli_audio_on_finished()
    @HANDLER:
        serial_println(Serial, text("Voice request completed"))
```

## Coordination with CWSL 1.2.0

When a managed voice-learning controller is connected, ordinary play/stop blocks automatically check its busy flag. Wake or business prompts cannot interrupt learning instructions or recording. Requests during that interval are discarded, not replayed later. Also guard non-audio business actions with `chipintelli_cwsl_voice_learning_busy()`.

Do not combine the managed controller with `chipintelli_audio_on_finished` or Audio end blocks: the controller owns the completion callback. Generation rejects that combination. Without a managed controller the existing Audio blocks behave as before. In a manual state machine, a global completion flag identifies no particular voice request; do not let another prompt's completion advance learning. Check readiness and playback acceptance, time out both instructions and feedback, and never interpret timeout as completion.

## Notes

1. Initialize in `arduino_setup()`. `LANGUAGE` selects only the word table used when a numeric variable is spoken. The generator emits the selected `CHIPINTELLI_LANGUAGE_*` macro before including the audio library and falls back to Chinese only if an invalid value reaches the generator.
2. `VOICE_ID` accepts `chipintelli_audio_voice(...)`, a configured `chipintelli_audio_local_audio(...)`, or `variables_get($number)` for a numeric variable. Fixed prompts and local audio call the 16-bit ID overload; a variable is converted to `String(value)` for localized decimal-number speech. Do not pass `text(...)` or a string variable.
3. Fixed-prompt IDs start at 1 and repeated text reuses its first macro. Local-audio IDs start at 500; identical project-relative converted MP3 paths reuse the same ID.
4. Configure local audio in the Blockly audio editor before using it. The field defaults to 16 kHz, mono, 16 kbps MP3; conversion and trimming can be changed there. The empty `{"audioPath":""}` state means no project audio is selected and generates `0`; do not hand-author a path.
5. `chipintelli_audio_voice_settings` writes generation metadata for fixed prompts. Its role must be one of the exact dropdown values above; volume and speed are separate from runtime playback volume.
6. The completion event body is dispatched from the Arduino loop. It means the SDK finished handling the request, not that a requested resource necessarily existed or was physically audible.
