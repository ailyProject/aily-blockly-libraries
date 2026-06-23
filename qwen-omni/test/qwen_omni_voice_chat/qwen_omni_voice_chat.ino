#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ESP_I2S.h>
#include <mbedtls/base64.h>
#include <esp_heap_caps.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/stream_buffer.h>

// ====== WiFi 配置 ======
#define WIFI_SSID     "LYT"
#define WIFI_PASSWORD "lyt13509018386"

// ====== 通义千问 API 配置 ======
#define QWEN_API_KEY  "sk-19c5074cf325413791543520bc32d746"
#define QWEN_BASE_URL "https://dashscope.aliyuncs.com/compatible-mode/v1"
#define QWEN_MODEL    "qwen3.5-omni-plus"
#define QWEN_VOICE    "Tina"

// ====== I2S 麦克风引脚 (INMP441) ======
#define MIC_SCK_PIN   5
#define MIC_SD_PIN    6
#define MIC_WS_PIN    4

// ====== I2S 扬声器引脚 (MAX98357A) ======
#define SPK_DIN_PIN   7
#define SPK_BCLK_PIN  15
#define SPK_LRCLK_PIN 16

// ====== 按键引脚 ======
#define BTN_TALK_PIN  40
#define BTN_VOL_UP    40
#define BTN_VOL_DOWN  39

// ====== 录音参数 ======
#define SAMPLE_RATE       16000
#define TTS_SAMPLE_RATE   24000
#define RECORD_SECONDS    3
#define RECORD_CHUNK_SIZE 4096
#define DECODE_BUF_SIZE   16384
#define PLAYBACK_BUFFER_SIZE    98304
#define PLAYBACK_PREBUFFER_SIZE 16000
#define PLAYBACK_CHUNK_SIZE     1024

// ====== 全局变量 ======
I2SClass i2s_mic;
I2SClass i2s_spk;

String conversation_history = "";
String system_prompt = "你是一个智能语音助手，请用简洁友好的方式回答用户问题。回复请简短，适合语音播报。";
int volume = 80;
bool is_playing = false;

uint8_t* playback_storage = NULL;
StaticStreamBuffer_t playback_stream_struct;
StreamBufferHandle_t playback_stream = NULL;
TaskHandle_t playback_task_handle = NULL;
volatile bool playback_done = false;
volatile size_t playback_total_played = 0;
bool playback_started = false;
size_t playback_buffered = 0;
uint32_t playback_sample_rate = TTS_SAMPLE_RATE;
uint16_t playback_bits_per_sample = 16;
uint16_t playback_channels = 1;

size_t base64_encoded_len(size_t len) {
  return ((len + 2) / 3) * 4;
}

void log_memory(const char* tag) {
  Serial.println("[MEM] " + String(tag) +
                 " heap=" + String(ESP.getFreeHeap()) +
                 " max=" + String(heap_caps_get_largest_free_block(MALLOC_CAP_8BIT)) +
                 " psram=" + String(ESP.getFreePsram()));
}

void* alloc_audio_buffer(size_t len, const char* tag) {
  void* ptr = NULL;
  if (psramFound()) {
    ptr = heap_caps_malloc(len, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
  }
  if (!ptr) {
    ptr = heap_caps_malloc(len, MALLOC_CAP_8BIT);
  }
  if (!ptr) {
    Serial.println("[MEM] " + String(tag) + " 分配失败: " + String(len) + " bytes");
    log_memory("alloc-failed");
  }
  return ptr;
}

void playback_task_entry(void* param) {
  uint8_t chunk[PLAYBACK_CHUNK_SIZE];

  while (!playback_done || xStreamBufferBytesAvailable(playback_stream) > 0) {
    size_t n = xStreamBufferReceive(playback_stream, chunk, sizeof(chunk), pdMS_TO_TICKS(20));
    if (n == 0) {
      delay(1);
      continue;
    }

    size_t written_total = 0;
    while (written_total < n) {
      size_t written = i2s_spk.write(chunk + written_total, n - written_total);
      if (written == 0) {
        delay(1);
      } else {
        written_total += written;
        playback_total_played += written;
      }
    }
    delay(0);
  }

  playback_task_handle = NULL;
  vTaskDelete(NULL);
}

bool prepare_stream_playback() {
  playback_done = false;
  playback_total_played = 0;
  playback_started = false;
  playback_buffered = 0;
  playback_sample_rate = TTS_SAMPLE_RATE;
  playback_bits_per_sample = 16;
  playback_channels = 1;

  if (!playback_storage) {
    playback_storage = (uint8_t*)alloc_audio_buffer(PLAYBACK_BUFFER_SIZE, "playback-stream");
    if (!playback_storage) {
      return false;
    }
  }

  if (!playback_stream) {
    playback_stream = xStreamBufferCreateStatic(
      PLAYBACK_BUFFER_SIZE, 1, playback_storage, &playback_stream_struct);
  } else {
    xStreamBufferReset(playback_stream);
  }

  if (!playback_stream) {
    Serial.println("[PLAY] 播放流缓冲创建失败");
    return false;
  }

  return true;
}

bool start_stream_playback() {
  if (playback_started) return true;

  i2s_spk.end();
  bool ok = i2s_spk.begin(I2S_MODE_STD, playback_sample_rate,
    (playback_bits_per_sample == 32) ? I2S_DATA_BIT_WIDTH_32BIT : I2S_DATA_BIT_WIDTH_16BIT,
    (playback_channels == 2) ? I2S_SLOT_MODE_STEREO : I2S_SLOT_MODE_MONO,
    I2S_STD_SLOT_BOTH);
  if (!ok) {
    Serial.println("[PLAY] I2S 播放初始化失败");
    return false;
  }

  BaseType_t task_ok = xTaskCreate(
    playback_task_entry, "tts_play", 4096, NULL, 2, &playback_task_handle);
  if (task_ok != pdPASS) {
    playback_task_handle = NULL;
    Serial.println("[PLAY] 播放任务创建失败");
    return false;
  }

  playback_started = true;
  Serial.println("[PLAY] 预缓冲完成，开始播放");
  return true;
}

bool queue_stream_playback(const uint8_t* data, size_t len) {
  if (!playback_stream || len == 0) return false;

  size_t sent_total = 0;
  while (sent_total < len) {
    size_t to_send = min((size_t)4096, len - sent_total);
    size_t sent = xStreamBufferSend(
      playback_stream, data + sent_total, to_send, pdMS_TO_TICKS(1000));
    if (sent == 0) {
      Serial.println("[PLAY] 播放缓冲写入超时");
      return false;
    }

    sent_total += sent;
    playback_buffered += sent;

    if (!playback_started && playback_buffered >= PLAYBACK_PREBUFFER_SIZE) {
      if (!start_stream_playback()) {
        return false;
      }
    }
  }

  return true;
}

size_t finish_stream_playback() {
  if (playback_stream && !playback_started && playback_buffered > 0) {
    start_stream_playback();
  }

  playback_done = true;
  unsigned long start_ms = millis();
  while (playback_task_handle && millis() - start_ms < 20000) {
    delay(10);
  }

  if (playback_task_handle) {
    Serial.println("[PLAY] 等待播放完成超时");
  }

  return playback_total_played;
}

class Base64JsonStream : public Stream {
public:
  Base64JsonStream(const String& prefix, const uint8_t* data, size_t data_len, const String& suffix)
    : prefix_(prefix), data_(data), data_len_(data_len), suffix_(suffix), pos_(0) {
    b64_len_ = base64_encoded_len(data_len_);
    total_len_ = prefix_.length() + b64_len_ + suffix_.length();
  }

  size_t contentLength() const {
    return total_len_;
  }

  int available() override {
    size_t left = total_len_ - pos_;
    return left > 0x7fffffff ? 0x7fffffff : (int)left;
  }

  int read() override {
    if (pos_ >= total_len_) return -1;
    char ch = charAt(pos_);
    pos_++;
    return (uint8_t)ch;
  }

  int peek() override {
    if (pos_ >= total_len_) return -1;
    return (uint8_t)charAt(pos_);
  }

  void flush() override {
  }

  size_t write(uint8_t) override {
    return 0;
  }

private:
  String prefix_;
  const uint8_t* data_;
  size_t data_len_;
  String suffix_;
  size_t b64_len_;
  size_t total_len_;
  size_t pos_;

  char charAt(size_t absolute_pos) const {
    size_t prefix_len = prefix_.length();
    if (absolute_pos < prefix_len) {
      return prefix_.charAt(absolute_pos);
    }

    size_t b64_pos = absolute_pos - prefix_len;
    if (b64_pos < b64_len_) {
      return base64CharAt(b64_pos);
    }

    return suffix_.charAt(b64_pos - b64_len_);
  }

  char base64CharAt(size_t b64_pos) const {
    static const char alphabet[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    size_t group = b64_pos / 4;
    size_t slot = b64_pos % 4;
    size_t src = group * 3;
    size_t remain = data_len_ - src;

    uint8_t b0 = data_[src];
    uint8_t b1 = remain > 1 ? data_[src + 1] : 0;
    uint8_t b2 = remain > 2 ? data_[src + 2] : 0;

    switch (slot) {
      case 0: return alphabet[b0 >> 2];
      case 1: return alphabet[((b0 & 0x03) << 4) | (b1 >> 4)];
      case 2: return remain > 1 ? alphabet[((b1 & 0x0F) << 2) | (b2 >> 6)] : '=';
      default: return remain > 2 ? alphabet[b2 & 0x3F] : '=';
    }
  }
};

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n========================================");
  Serial.println("  Qwen Omni 实时语音通话");
  Serial.println("========================================");

  pinMode(BTN_TALK_PIN, INPUT_PULLUP);
  pinMode(BTN_VOL_DOWN, INPUT_PULLUP);

  init_i2s_speaker();
  connect_wifi();
  test_api_connection();

  Serial.println("\n[READY] 系统就绪！");
  Serial.println("按下 GPIO40 按键开始说话...");
  Serial.println("========================================\n");
}

void loop() {
  if (digitalRead(BTN_TALK_PIN) == LOW) {
    delay(50);
    if (digitalRead(BTN_TALK_PIN) == LOW) {
      handle_voice_chat();
      while (digitalRead(BTN_TALK_PIN) == LOW) {
        delay(10);
      }
    }
  }
  delay(10);
}

// ==================== WiFi 连接 ====================
void connect_wifi() {
  Serial.print("[WiFi] 连接中: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    attempts++;
    if (attempts > 60) {
      Serial.println("\n[WiFi] 连接失败！重启...");
      ESP.restart();
    }
  }

  Serial.println();
  Serial.print("[WiFi] 已连接! IP: ");
  Serial.println(WiFi.localIP());
}

// ==================== API 连接测试 ====================
void test_api_connection() {
  Serial.println("[TEST] 测试 API 连接...");

  HTTPClient http;
  String url = String(QWEN_BASE_URL) + "/chat/completions";
  http.begin(url);
  http.setTimeout(15000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "text/event-stream");
  http.addHeader("Authorization", "Bearer " + String(QWEN_API_KEY));

  String body = "{\"model\":\"" + String(QWEN_MODEL) + "\",\"messages\":[{\"role\":\"user\",\"content\":\"hi\"}],\"stream\":true,\"stream_options\":{\"include_usage\":true},\"modalities\":[\"text\"],\"max_tokens\":20}";

  int code = http.POST(body);
  if (code == 200) {
    Serial.println("[TEST] API 连接正常 ✓");
  } else {
    Serial.println("[TEST] API 错误: " + String(code));
    Serial.println(http.getString().substring(0, 200));
  }
  http.end();
}

// ==================== I2S 扬声器初始化 ====================
void init_i2s_speaker() {
  Serial.println("[I2S] 初始化扬声器...");
  i2s_spk.setPins(SPK_BCLK_PIN, SPK_LRCLK_PIN, SPK_DIN_PIN, -1, -1);
  if (!i2s_spk.begin(I2S_MODE_STD, SAMPLE_RATE, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO, I2S_STD_SLOT_BOTH)) {
    Serial.println("[I2S] 扬声器初始化失败!");
    while (1) delay(1000);
  }
  Serial.println("[I2S] 扬声器就绪");
}

// ==================== I2S 麦克风初始化 ====================
void init_i2s_mic() {
  Serial.println("[I2S] 初始化麦克风...");
  // INMP441: SCK=5, SD=6, WS=4
  // setPins(sck, ws, sd_out, sd_in, mck)
  i2s_mic.setPins(MIC_SCK_PIN, MIC_WS_PIN, -1, MIC_SD_PIN, -1);

  if (!i2s_mic.begin(I2S_MODE_STD, SAMPLE_RATE, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO, I2S_STD_SLOT_BOTH)) {
    Serial.println("[I2S] 麦克风初始化失败!");
    while (1) delay(1000);
  }
  Serial.println("[I2S] 麦克风就绪");
}

// ==================== 录音 ====================
uint8_t* record_audio(size_t *out_len) {
  init_i2s_mic();

  size_t total_samples = SAMPLE_RATE * RECORD_SECONDS;
  size_t pcm_bytes = total_samples * sizeof(int16_t);
  size_t wav_bytes = 44 + pcm_bytes;

  uint8_t* wav_buf = (uint8_t*)alloc_audio_buffer(wav_bytes, "record-wav");
  if (!wav_buf) {
    Serial.println("[REC] 内存分配失败!");
    *out_len = 0;
    return NULL;
  }

  Serial.println("[REC] 开始录音 (" + String(RECORD_SECONDS) + "秒)...");
  play_beep(1000, 50);

  size_t bytes_read = 0;
  unsigned long start_ms = millis();
  unsigned long max_ms = (unsigned long)(RECORD_SECONDS * 1000 + 1000);

  while (bytes_read < pcm_bytes) {
    size_t to_read = min((size_t)RECORD_CHUNK_SIZE, pcm_bytes - bytes_read);
    size_t n = i2s_mic.readBytes((char*)(wav_buf + 44 + bytes_read), to_read);
    if (n > 0) {
      bytes_read += n;
    }
    if (millis() - start_ms > max_ms) {
      Serial.println("[REC] 录音超时");
      break;
    }

    if (bytes_read % (SAMPLE_RATE * sizeof(int16_t)) == 0) {
      int elapsed = bytes_read / (SAMPLE_RATE * sizeof(int16_t));
      Serial.println("[REC] " + String(elapsed) + "/" + String(RECORD_SECONDS) + "s");
    }
  }

  play_beep(800, 50);
  if (bytes_read % sizeof(int16_t) != 0) {
    bytes_read -= bytes_read % sizeof(int16_t);
  }
  build_wav_header(wav_buf, (uint32_t)bytes_read, SAMPLE_RATE);
  Serial.println("[REC] 录音完成: " + String(bytes_read) + " bytes PCM, " + String(bytes_read + 44) + " bytes WAV");

  i2s_mic.end();

  *out_len = bytes_read + 44;
  return wav_buf;
}

// ==================== WAV 头构建 ====================
void build_wav_header(uint8_t* header, uint32_t data_size, uint32_t sample_rate) {
  memset(header, 0, 44);
  memcpy(header, "RIFF", 4);
  uint32_t file_size = data_size + 36;
  header[4] = file_size & 0xFF;
  header[5] = (file_size >> 8) & 0xFF;
  header[6] = (file_size >> 16) & 0xFF;
  header[7] = (file_size >> 24) & 0xFF;
  memcpy(header + 8, "WAVE", 4);
  memcpy(header + 12, "fmt ", 4);
  header[16] = 16;
  header[20] = 1;
  header[22] = 1;
  header[24] = sample_rate & 0xFF;
  header[25] = (sample_rate >> 8) & 0xFF;
  header[26] = (sample_rate >> 16) & 0xFF;
  header[27] = (sample_rate >> 24) & 0xFF;
  uint32_t byte_rate = sample_rate * 2;
  header[28] = byte_rate & 0xFF;
  header[29] = (byte_rate >> 8) & 0xFF;
  header[30] = (byte_rate >> 16) & 0xFF;
  header[31] = (byte_rate >> 24) & 0xFF;
  header[32] = 2;
  header[34] = 16;
  memcpy(header + 36, "data", 4);
  header[40] = data_size & 0xFF;
  header[41] = (data_size >> 8) & 0xFF;
  header[42] = (data_size >> 16) & 0xFF;
  header[43] = (data_size >> 24) & 0xFF;
}

// ==================== JSON 转义 ====================
String escape_json(String input) {
  input.replace("\\", "\\\\");
  input.replace("\"", "\\\"");
  input.replace("\n", "\\n");
  input.replace("\r", "\\r");
  return input;
}

// ==================== 清洗 Base64 ====================
String sanitize_base64(String input) {
  String out = "";
  out.reserve(input.length());
  for (size_t i = 0; i < input.length(); i++) {
    char ch = input.charAt(i);
    if ((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z') ||
        (ch >= '0' && ch <= '9') || ch == '+' || ch == '/' || ch == '=') {
      out += ch;
    }
  }
  return out;
}

void play_decoded_audio(uint8_t* decode_buf, size_t out_len, bool &header_parsed, size_t &total_played) {
  if (out_len == 0) return;

  uint8_t* pcm_ptr = decode_buf;
  size_t play_len = out_len;

  if (!header_parsed) {
    if (out_len > 44 && decode_buf[0] == 'R' && decode_buf[1] == 'I' &&
        decode_buf[2] == 'F' && decode_buf[3] == 'F') {
      int hdr_len = 44;
      int fmt_size = decode_buf[16] | (decode_buf[17] << 8) |
                     (decode_buf[18] << 16) | (decode_buf[19] << 24);
      if (fmt_size > 16) hdr_len = 44 + (fmt_size - 16);
      uint16_t num_ch = decode_buf[22] | (decode_buf[23] << 8);
      uint32_t sr = decode_buf[24] | (decode_buf[25] << 8) |
                    (decode_buf[26] << 16) | (decode_buf[27] << 24);
      uint16_t bps = decode_buf[34] | (decode_buf[35] << 8);

      playback_sample_rate = sr;
      playback_bits_per_sample = bps;
      playback_channels = num_ch;

      if (hdr_len < (int)out_len) {
        pcm_ptr = decode_buf + hdr_len;
        play_len = out_len - hdr_len;
      } else {
        play_len = 0;
      }
      Serial.println("[PLAY] WAV: " + String(sr) + "Hz " + String(bps) + "bit " + String(num_ch) + "ch");
    } else {
      playback_sample_rate = TTS_SAMPLE_RATE;
      playback_bits_per_sample = 16;
      playback_channels = 1;
      Serial.println("[PLAY] PCM: " + String(TTS_SAMPLE_RATE) + "Hz 16bit mono");
    }
    header_parsed = true;
  }

  if (play_len > 0) {
    if (queue_stream_playback(pcm_ptr, play_len)) {
      total_played += play_len;
    }
  }
}

void decode_and_play_base64(String &b64_data, uint8_t* decode_buf, bool &header_parsed, size_t &total_played) {
  if (b64_data.length() == 0) return;

  while ((b64_data.length() % 4) != 0) b64_data += "=";
  const size_t max_b64_in = (DECODE_BUF_SIZE / 3) * 4;
  size_t offset = 0;

  while (offset < b64_data.length()) {
    size_t remaining = b64_data.length() - offset;
    size_t part_len = min(max_b64_in, remaining);
    if (part_len < remaining) {
      part_len = (part_len / 4) * 4;
    }
    if (part_len == 0) break;

    size_t out_len = 0;
    int ret = mbedtls_base64_decode(decode_buf, DECODE_BUF_SIZE, &out_len,
      (const unsigned char*)b64_data.c_str() + offset, part_len);
    if (ret == 0) {
      play_decoded_audio(decode_buf, out_len, header_parsed, total_played);
    } else {
      Serial.println("[PLAY] Base64 解码失败: " + String(ret));
    }
    offset += part_len;
  }
}

class QwenSseAudioSink : public Stream {
public:
  QwenSseAudioSink(uint8_t* decode_buf, String& full_text, bool& header_parsed, size_t& total_played)
    : decode_buf_(decode_buf), full_text_(full_text), header_parsed_(header_parsed),
      total_played_(total_played), done_(false) {
  }

  int available() override {
    return 0;
  }

  int read() override {
    return -1;
  }

  int peek() override {
    return -1;
  }

  void flush() override {
  }

  size_t write(uint8_t b) override {
    if (!done_) {
      char c = (char)b;
      if (c == '\n') {
        processLine();
      } else if (c != '\r') {
        line_buf_ += c;
      }
    }
    return 1;
  }

  size_t write(const uint8_t* buffer, size_t size) override {
    for (size_t i = 0; i < size; i++) {
      write(buffer[i]);
    }
    return size;
  }

private:
  uint8_t* decode_buf_;
  String& full_text_;
  bool& header_parsed_;
  size_t& total_played_;
  String line_buf_;
  bool done_;

  void processLine() {
    line_buf_.trim();
    if (!line_buf_.startsWith("data:")) {
      line_buf_ = "";
      return;
    }

    String data = line_buf_.substring(5);
    data.trim();
    line_buf_ = "";

    if (data == "[DONE]") {
      Serial.println("\n[CHAT] 流式传输完成");
      done_ = true;
      return;
    }

    if (data.indexOf("\"error\"") >= 0) {
      String message_marker = "\"message\":\"";
      int message_start = data.indexOf(message_marker);
      if (message_start >= 0) {
        message_start += message_marker.length();
        int message_end = data.indexOf("\"", message_start);
        if (message_end > message_start) {
          String message = data.substring(message_start, message_end);
          Serial.println("[CHAT] API 错误: " + message);
        } else {
          Serial.println("[CHAT] API 错误: " + data.substring(0, min((int)data.length(), 300)));
        }
      } else {
        Serial.println("[CHAT] API 错误: " + data.substring(0, min((int)data.length(), 300)));
      }
      done_ = true;
      return;
    }

    if (data.length() > 0 && total_played_ == 0 && full_text_.length() == 0) {
      Serial.println("[DEBUG] Data: " + data.substring(0, min((int)data.length(), 200)));
    }

    String content_marker = "\"content\":\"";
    int content_start = data.indexOf(content_marker);
    if (content_start >= 0) {
      content_start += content_marker.length();
      int content_end = data.indexOf("\"", content_start);
      if (content_end > content_start) {
        String content = data.substring(content_start, content_end);
        full_text_ += content;
        Serial.print(content);
      }
    }

    int audio_obj = data.indexOf("\"audio\"");
    if (audio_obj >= 0) {
      String audio_marker = "\"data\":\"";
      int audio_pos = data.indexOf(audio_marker, audio_obj);
      if (audio_pos >= 0) {
        audio_pos += audio_marker.length();
        int audio_end = data.indexOf("\"", audio_pos);
        if (audio_end > audio_pos) {
          String b64_data = sanitize_base64(data.substring(audio_pos, audio_end));
          decode_and_play_base64(b64_data, decode_buf_, header_parsed_, total_played_);
        }
      }
    }
  }
};

// ==================== 核心：语音对话处理 ====================
void handle_voice_chat() {
  Serial.println("\n========================================");
  Serial.println("[CHAT] 语音对话开始");
  Serial.println("========================================");

  // 1. 录音，直接得到 WAV，避免 PCM 和 WAV 双份占用内存
  size_t wav_len = 0;
  uint8_t* wav_data = record_audio(&wav_len);
  if (!wav_data || wav_len <= 44) {
    Serial.println("[CHAT] 录音失败，取消对话");
    if (wav_data) free(wav_data);
    return;
  }
  log_memory("after-record");

  // 2. 构建请求。音频 Base64 在 HTTP 上传时按需生成，不再落到大 String 里。
  String safe_prompt = escape_json("请用简短友好的方式回答，适合语音播报");
  String safe_sys = escape_json(system_prompt);

  String request_prefix = "{\"model\":\"" + String(QWEN_MODEL) + "\",\"messages\":[";
  if (system_prompt.length() > 0) {
    request_prefix += "{\"role\":\"system\",\"content\":\"" + safe_sys + "\"},";
  }
  if (conversation_history.length() > 0) {
    request_prefix += conversation_history + ",";
  }
  request_prefix += "{\"role\":\"user\",\"content\":[{\"type\":\"input_audio\",\"input_audio\":{\"data\":\"data:;base64,";

  String request_suffix = "\",\"format\":\"wav\"}},";
  request_suffix += "{\"type\":\"text\",\"text\":\"" + safe_prompt + "\"}]}],";
  request_suffix += "\"modalities\":[\"text\",\"audio\"],";
  request_suffix += "\"audio\":{\"voice\":\"" + String(QWEN_VOICE) + "\",\"format\":\"wav\"},";
  request_suffix += "\"stream\":true,\"stream_options\":{\"include_usage\":true}}";

  Base64JsonStream request_stream(request_prefix, wav_data, wav_len, request_suffix);

  // 3. 发送请求（使用 HTTPClient 流式上传请求体）
  Serial.println("[CHAT] 发送 API 请求...");
  unsigned long send_start = millis();

  HTTPClient http;
  http.setReuse(true);
  http.setTimeout(60000);
  http.begin(String(QWEN_BASE_URL) + "/chat/completions");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "text/event-stream");
  http.addHeader("Authorization", "Bearer " + String(QWEN_API_KEY));

  Serial.println("[CHAT] WAV 大小: " + String(wav_len) + " bytes");
  Serial.println("[CHAT] Base64 长度: " + String(base64_encoded_len(wav_len)));
  Serial.println("[CHAT] 请求体大小: " + String(request_stream.contentLength()) + " bytes");
  log_memory("before-post");

  int http_code = http.sendRequest("POST", &request_stream, request_stream.contentLength());
  free(wav_data);
  wav_data = NULL;
  Serial.println("[CHAT] HTTP: " + String(http_code));

  if (http_code != 200) {
    String err = http.getString();
    Serial.println("[CHAT] 错误响应: " + err.substring(0, 500));
    http.end();
    return;
  }

  // 6. 流式解析：边收边播
  Serial.println("[CHAT] 接收流式响应...");
  if (!prepare_stream_playback()) {
    Serial.println("[CHAT] 播放缓冲初始化失败");
    http.end();
    return;
  }

  String full_text = "";
  bool header_parsed = false;
  size_t queued_audio = 0;

  uint8_t* decode_buf = (uint8_t*)alloc_audio_buffer(DECODE_BUF_SIZE, "decode");
  if (!decode_buf) {
    Serial.println("[CHAT] 解码缓冲区分配失败");
    playback_done = true;
    http.end();
    return;
  }

  QwenSseAudioSink sse_sink(decode_buf, full_text, header_parsed, queued_audio);
  int stream_result = http.writeToStream(&sse_sink);
  if (stream_result < 0) {
    Serial.println("[CHAT] 流式读取错误: " + HTTPClient::errorToString(stream_result));
  }

  free(decode_buf);
  http.end();
  size_t total_played = finish_stream_playback();

  Serial.println();
  Serial.println("[CHAT] 入队字节: " + String(queued_audio));
  Serial.println("[CHAT] 播放字节: " + String(total_played));
  Serial.println("[CHAT] 回复文本: " + full_text);
  Serial.println("[CHAT] 耗时: " + String(millis() - send_start) + "ms");

  // 保存对话历史（仅文本，避免内存溢出）
  if (full_text.length() > 0 && full_text.length() < 500) {
    if (conversation_history.length() > 2000) {
      conversation_history = "";
    }
    String safe_text = escape_json(full_text);
    if (conversation_history.length() > 0) conversation_history += ",";
    conversation_history += "{\"role\":\"assistant\",\"content\":\"" + safe_text + "\"}";
  }

  Serial.println("========================================");
  Serial.println("[CHAT] 对话结束，按下按键再次对话");
  Serial.println("========================================\n");
}

// ==================== 提示音 ====================
void play_beep(int freq, int duration_ms) {
  i2s_spk.end();
  i2s_spk.begin(I2S_MODE_STD, SAMPLE_RATE, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO);

  size_t samples = SAMPLE_RATE * duration_ms / 1000;
  int16_t* buf = (int16_t*)malloc(samples * sizeof(int16_t));
  if (!buf) return;

  for (size_t i = 0; i < samples; i++) {
    float t = (float)i / SAMPLE_RATE;
    buf[i] = (int16_t)(sin(2.0 * PI * freq * t) * 3000);
  }

  i2s_spk.write((uint8_t*)buf, samples * sizeof(int16_t));
  free(buf);

  i2s_spk.end();
  i2s_spk.begin(I2S_MODE_STD, SAMPLE_RATE, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO);
}

// ==================== 音量调节 ====================
void adjust_volume(int delta) {
  volume = constrain(volume + delta, 0, 100);
  Serial.println("[VOL] 音量: " + String(volume) + "%");
}
