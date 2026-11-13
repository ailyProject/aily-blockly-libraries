# @aily-project/lib-pocket-translator

## Library Info

- **Name**: @aily-project/lib-pocket-translator
- **Version**: 0.0.1
- **Purpose**: INMP441 I2S 录音（按住录音/松开立即停止）、硅基流动（SiliconFlow）语音识别、硅基流动对话模型中文→英文翻译、硅基流动语音合成朗读英文（I2S 直推功放）、16×16 GB2312 点阵中文字库屏幕显示。
- **Dependencies**: `ESP_I2S`、`WiFi`、`NetworkClientSecure`、`HTTPClient`、`TFT_eSPI`（均由 ESP32 Arduino SDK 或本库 `block.json` 依赖引入）。MP3 解码走 arduino-esp32 自带的 `-lchmorgan__esp-libhelix-mp3`（通过 `__has_include("mp3dec.h")` 探测）。

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| --- | --- | --- | --- | --- |
| pt_init | Statement | BTN1(dropdown), BTN2(dropdown), WS(dropdown), SCK(dropdown), SD(dropdown), RATE(dropdown), BITS(dropdown), CH(dropdown), SPK_BCLK(dropdown), SPK_LRC(dropdown), SPK_DIN(dropdown) | `pt_init("38", "39", "4", "5", "6", "16000", "32", PT_CH_LEFT, "15", "16", "7")` | `#include "PocketTranslator.h"` ↵ setup: `ptInit(38, 39, 4, 5, 6, 16000, 32, PT_CH_LEFT);` ↵ `ptEnableSpeaker(15, 16, 7);` |
| pt_button_edge | Value (Boolean) | (none) | `pt_button_edge()` | `#include "PocketTranslator.h"` ↵ `ptButtonJustPressed()` |
| pt_button_down | Value (Boolean) | (none) | `pt_button_down()` | `#include "PocketTranslator.h"` ↵ `ptButtonDown()` |
| pt_record_hold | Statement | SECONDS(input_value) | `pt_record_hold(math_number(10))` | `#include "PocketTranslator.h"` ↵ `ptRecordHold(10);` |
| pt_record_ms | Value (Number) | (none) | `pt_record_ms()` | `#include "PocketTranslator.h"` ↵ `ptRecordMs()` |
| pt_speech_to_text | Value (String) | URL(input_value), TOKEN(input_value), MODEL(input_value) | `pt_speech_to_text(variables_get($sfAsrUrl), variables_get($sfApiKey), variables_get($sfAsrModel))` | `#include "PocketTranslator.h"` ↵ `ptSpeechToText(String(sfAsrUrl), String(sfApiKey), String(sfAsrModel))` |
| pt_translate | Value (String) | URL(input_value), TOKEN(input_value), MODEL(input_value), TEXT(input_value) | `pt_translate(variables_get($sfChatUrl), variables_get($sfApiKey), variables_get($sfTranslateModel), variables_get($asrText))` | `#include "PocketTranslator.h"` ↵ `ptTranslate(String(sfChatUrl), String(sfApiKey), String(sfTranslateModel), String(asrText))` |
| pt_last_error | Value (String) | (none) | `pt_last_error()` | `#include "PocketTranslator.h"` ↵ `ptLastError()` |
| pt_draw_text | Statement | TFT(field_variable), X(input_value), Y(input_value), TEXT(input_value), FG(input_value), BG(input_value) | `pt_draw_text($tft, math_number(10), math_number(10), text("你好"), tftespi_color(TFT_WHITE), tftespi_color(TFT_BLACK))` | `#include "PocketTranslator.h"` ↵ `ptDrawTextCN(tft, 10, 10, String("你好"), TFT_WHITE, TFT_BLACK);` |
| pt_free_buffer | Statement | (none) | `pt_free_buffer()` | `#include "PocketTranslator.h"` ↵ `ptFreeRecordBuffer();` |
| pt_speak | Statement | URL(input_value), TOKEN(input_value), MODEL(input_value), VOICE(input_value), TEXT(input_value), RATE(dropdown) | `pt_speak(variables_get($sfTtsUrl), variables_get($sfApiKey), variables_get($sfTtsModel), variables_get($sfTtsVoice), variables_get($enText), "24000")` | `#include "PocketTranslator.h"` ↵ `ptSpeak(String(sfTtsUrl), String(sfApiKey), String(sfTtsModel), String(sfTtsVoice), String(enText), 24000);` |
| pt_speak_ok | Value (Boolean) | (none) | `pt_speak_ok()` | `#include "PocketTranslator.h"` ↵ `ptSpeakOk()` |
| pt_speak_ms | Value (Number) | (none) | `pt_speak_ms()` | `#include "PocketTranslator.h"` ↵ `ptSpeakMs()` |
| pt_set_volume | Statement | VOLUME(input_value, Number) | `pt_set_volume(math_number(40))` | `#include "PocketTranslator.h"` ↵ `ptSetVolume(40);` |

`pt_draw_text` 的 `TFT` 是 `field_variable`，类型限定为 `TFT_eSPI`，须传入由 `tftespi_setup` 创建的变量（例如 `$tft`）。

## Parameter Options

| Parameter | Values | Description |
| --- | --- | --- |
| BTN1, BTN2, WS, SCK, SD | `${board.digitalPins}`（当前板 ESP32-S3 为 0–21、35–48） | GPIO 编号 |
| RATE | 16000, 8000, 44100 | I2S 采样率 |
| PT_CH_* | PT_CH_LEFT, PT_CH_RIGHT, PT_CH_STEREO | I2S 声道；L/R 接地时麦克风输出在左声道 |
| SPK_BCLK / SPK_LRC / SPK_DIN | `${board.digitalPins}` | MAX98357A 功放引脚；任一设为 -1 表示不接扬声器（此时 `ptSpeak` 直接失败并说明原因） |
| pt_speak 的 RATE | 16000, 24000, 32000, 44100 | 请求的 TTS 采样率。服务端会按实际生成值写回 WAV 头，播放以头部为准，因此填错也不会变调 |
| pt_set_volume 的 VOLUME | 0–100（建议 30–60） | 软音量百分比。MAX98357A 的 GAIN 是硬件固定的，因此库内对 PCM 采样缩放来实现调小 |
| BITS | 32, 16, 24 | I2S 帧位宽；INMP441 的 24 位有效数据位于 32 位帧高位 |
| CH | PT_CH_LEFT, PT_CH_RIGHT, PT_CH_STEREO | I2S 声道；L/R 接地时麦克风输出在左声道 |

## ABS Examples

### 完整流程：录音 → 识别 → 翻译 → 朗读

```abs
arduino_global()
    variable_define("wifiSsid", String, text("YourWiFi"))
    variable_define("wifiPass", String, text("YourPassword"))
    variable_define("sfApiKey", String, text("sk-xxxxxxxx"))
    variable_define("sfAsrUrl", String, text("https://api.siliconflow.cn/v1/audio/transcriptions"))
    variable_define("sfAsrModel", String, text("FunAudioLLM/SenseVoiceSmall"))
    variable_define("sfChatUrl", String, text("https://api.siliconflow.cn/v1/chat/completions"))
    variable_define("sfTranslateModel", String, text("Qwen/Qwen2.5-7B-Instruct"))
    variable_define("sfTtsUrl", String, text("https://api.siliconflow.cn/v1/audio/speech"))
    variable_define("sfTtsModel", String, text("fnlp/MOSS-TTSD-v0.5"))
    variable_define("sfTtsVoice", String, text("fnlp/MOSS-TTSD-v0.5:anna"))
    variable_define("asrText", String, text(""))
    variable_define("enText", String, text(""))
arduino_setup()
    tftespi_setup("tft", ST7789_DRIVER, "240", "240", "-1", "47", "21", "41", "40", "45", "42", HIGH, TFT_RGB, "40000000", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1")
    pt_init("38", "39", "4", "5", "6", "16000", "32", PT_CH_LEFT, "15", "16", "7")
    serial_begin(Serial, "115200")
    esp32_wifi_begin(variables_get($wifiSsid), variables_get($wifiPass))
arduino_loop()
    controls_if()
        @IF0: pt_button_edge()
        @DO0:
            pt_record_hold(math_number(10))
            variables_set($asrText, pt_speech_to_text(variables_get($sfAsrUrl), variables_get($sfApiKey), variables_get($sfAsrModel)))
            pt_free_buffer()
            controls_if()
                @IF0: logic_compare(text_length(variables_get($asrText)), GT, math_number(0))
                @DO0:
                    pt_draw_text($tft, math_number(10), math_number(10), variables_get($asrText), tftespi_color(TFT_WHITE), tftespi_color(TFT_BLACK))
                    variables_set($enText, pt_translate(variables_get($sfChatUrl), variables_get($sfApiKey), variables_get($sfTranslateModel), variables_get($asrText)))
                    pt_draw_text($tft, math_number(10), math_number(142), variables_get($enText), tftespi_color(TFT_WHITE), tftespi_color(TFT_BLACK))
                    pt_speak(variables_get($sfTtsUrl), variables_get($sfApiKey), variables_get($sfTtsModel), variables_get($sfTtsVoice), variables_get($enText), "24000")
                    controls_if() @extra:{"hasElse":true}
                        @IF0: pt_speak_ok()
                        @DO0:
                            pt_draw_text($tft, math_number(10), math_number(204), text("朗读完成"), tftespi_color(TFT_GREEN), tftespi_color(TFT_BLACK))
                        @ELSE:
                            pt_draw_text($tft, math_number(10), math_number(204), text("朗读失败"), tftespi_color(TFT_ORANGE), tftespi_color(TFT_BLACK))
```

## Notes

1. **初始化顺序**：`pt_init` 内部 `pinMode(..., INPUT_PULLUP)` 并调用 `i2s.setPins(sck, ws, -1, sd, -1)` 与 `i2s.begin(I2S_MODE_STD, ...)`。须在 `setup()` 中先调用；I2S 只开接收通道（`dout = -1`）。
2. **录音行为**：`pt_record_hold` 是**阻塞**调用——先等待按键按下（以 `pt_button_down` 为准），开始录音后持续采样，松开按键（消抖后）或到达 `SECONDS` 秒即停止。因此 `loop()` 中由 `pt_button_edge()` 触发它是安全的。
3. **缓冲**：录音缓冲优先从 PSRAM（`MALLOC_CAP_SPIRAM`）分配，失败才回退内部 RAM。16 kHz/16 bit 单声道约 32 KB/秒。用完应调用 `pt_free_buffer`；下一次 `pt_record_hold` 会自动重新分配。
4. **位宽与声道**：`BITS=32` 时按 32 位帧读取并右移 16 位得到 16 位样本（INMP441 有效数据在高位）。`CH=PT_CH_LEFT` 对应 `I2S_STD_SLOT_LEFT`，符合 INMP441 的 L/R 接地接法。
5. **WAV 格式**：内存中直接构造 44 字节 PCM WAV 头（单声道、16 bit）后整体上传，不做二次转码。
6. **识别请求**：`pt_speech_to_text` 以 `multipart/form-data` POST 到给定 URL（默认硅基流动 `/v1/audio/transcriptions`），表单字段为 `model` 与 `file`（`record.wav`，`audio/wav`），请求头携带 `Authorization: Bearer <TOKEN>`。返回体按 JSON 解析 `text` 字段；失败返回空字符串且原因在 `pt_last_error` 中。
7. **TLS**：实现使用 `WiFiClientSecure::setInsecure()`（不校验根证书）以保证开箱可用；生产环境建议改为 `setCACert`。
8. **中英文显示**：`pt_draw_text` 内嵌两套点阵字库——HZK16 GB2312 16×16（8178 字，`FontData.h`，约 262 KB，UTF-8 经 GBK 映射查索引）与 ASC16 ASCII 8×16 半角（`ASC16Data.h`，可打印区 95 字符）。中英文混排，汉字全宽 16 像素、半角字符 8 像素，超宽自动折行，`\n` 换行；GB2312 之外的字符画空心方块占位。
9. **内存占用**：字库随固件链接，需要较大的 APP 分区（本工程选用 16 MB Flash / 3 MB APP）。
10. **中文翻译**：`pt_translate` 以 JSON POST 到硅基流动 `/v1/chat/completions`，`system` 提示词要求输出地道、简洁、口语化的英文译文（只输出译文，不加客套语/解释/冗长从句，原文简短则译文同样简短，便于口头朗读与减小音频体积）；文本经 JSON 转义后拼入请求体（UTF-8 字节原样保留）。响应取第一个 `"content"` 字段（即 `choices[0].message.content`）；失败返回空字符串且原因在 `pt_last_error` 中。读超时 60 秒（大模型生成比 ASR 慢）。推荐模型 `Qwen/Qwen2.5-7B-Instruct`，已用真实接口实测可用；如需换模型请确认该模型在硅基流动平台可用。
11. **未验证项**：录音音质、麦克风灵敏度、屏幕颜色顺序（`TFT_RGB`/`TFT_BGR`）、实际识别与翻译成功率均需在真实硬件与有效 API Key 下验证。
12. **英文朗读（TTS）**：`pt_speak` 以 JSON POST 到硅基流动 `/v1/audio/speech`，字段为 `model`、`input`、`voice`、`response_format:"wav"`、`sample_rate`、`speed`、`gain`；响应体是流式音频，实现边收边解码边推 I2S，因此首字出声约 1 秒。
13. **分块传输（关键）**：该接口**始终**返回 `Transfer-Encoding: chunked`（实测与是否传 `stream` 参数无关），而 `HTTPClient::getStreamPtr()` 是未解包的原始 socket。库内 `ptAudioRead()` 自行解分块（`ChunkedTransfer.h` 的 `parseSizeLine` 为纯函数，已用目标板编译器断言覆盖）。若跳过这一步，分块头会混进音频，导致 WAV 头匹配失败而误入 MP3 分支，进而在 8KB `loopTask` 栈上叠加 helix 解码缓冲导致重启。
13. **模型与格式（实测约束）**：
    - `fnlp/MOSS-TTSD-v0.5`：尊重 `response_format`，`wav` 返回 16bit PCM WAV，可用 `sample_rate` 16000/24000/32000/44100；英文自然、可直接播放，**推荐**。
    - `FunAudioLLM/CosyVoice2-0.5B`：忽略 `wav`/`pcm`/`flac`，始终返回 `audio/mpeg`（MP3，`sample_rate` 只接受 32000/44100）。本库检测到非 RIFF 响应时自动改用内置 helix MP3 解码器播放，同样能出声。
    - 音色写法为 `模型ID:音色名`，如 `fnlp/MOSS-TTSD-v0.5:anna`；`anna`/`alex`/`bella`/`david` 等均已实测可用。音色不匹配返回 `code 20047 Invalid voice`。
14. **播放通道**：录音与播放使用两个独立 `I2SClass` 实例（ESP32-S3 有 2 个 I2S 控制器），因此“按住说话”和“朗读”不会互踩。扬声器按需在首次播放时按 WAV 头里的真实采样率建立 TX 通道（16bit 单声道，`SLOT_LEFT`）；WAV 为立体声时自动取左声道下混。
15. **扬声器接线（MAX98357A）**：ESP32-S3 `BCLK→15`、`LRC→16`、`DIN→7`，功放 `VIN→5V`、`GND→GND`、`LRC/DIN/BCLK` 按上述对应，喇叭接 `+/-`。`GAIN` 悬空为默认增益，可用 `SD` 脚上/下拉选择声道。共享时钟的 I2S 麦克风不能与功放共用引脚（本工程麦克风为 WS=4/SCK=5/SD=6）。
16. **WAV 头解析**：`src/PocketTranslator/WavHeader.h` 的 `parse()` 是纯函数，会跳过 `LIST/INFO` 等元数据块（硅基流动实际会返回 122 字节元数据，`data` 并不紧跟 `fmt`），并读取真实采样率/声道/位深。该逻辑已用目标板编译器 `static_assert` 对真实返回字节做过校验。
17. **内存与栈**：MP3 分支的解码输出缓冲（4.6KB）与 4KB 输入缓冲均在堆/PSRAM 分配，不占用 `loopTask`（默认 8KB）栈；播放循环内主动调用 `esp_task_wdt_reset()` 喂看门狗，长句/慢网不会触发任务看门狗复位。MP3 连续 64 帧解码失败会主动报错退出，避免对非 MP3 数据无限扫描。
18. **为什么不能直接读 socket**：`getStreamPtr()` 返回的是尚未解包的原始 socket。流式音频下每个分块之间会有网络停顿，而 `Stream::readStringUntil()` 依赖 1s 读超时，一旦超时就返回**半行**，会把分块大小读错并非正常结束音频（表现为“只响一下就没了、屏幕却显示朗读完成”）。因此 `ptAudioRead()` 改为自己逐字节拼行（直到 `\n` 或超过 15s 硬超时），并单独处理分块末尾的 CRLF。
19. **音量**：`pt_set_volume` / `ptSetVolume(0–100)` 为软件音量。MAX98357A 的 GAIN 引脚只能靠硬件跳线（默认 9dB，接 VIN 为 15dB，接 GND 为 6dB），代码调不了；因此库内对 16bit 采样做百分比缩放（四舍五入 + 饱和保护，`Volume.h` 为纯函数并有断言覆盖）。本工程默认 40%。
