// Huoshan AI Voice generator for Aily Blockly.

function huoshanAiEnsureRuntime(generator) {
  if (typeof ensureSerialBegin === 'function') {
    ensureSerialBegin('Serial', generator);
  }

  huoshanAiEnsureWiFiLib(generator);
  generator.addLibrary('huoshan_ai_http', '#include <HTTPClient.h>');
  generator.addLibrary('huoshan_ai_secure', '#include <WiFiClientSecure.h>');
  generator.addLibrary('huoshan_ai_json', '#include <ArduinoJson.h>');
  generator.addLibrary('huoshan_ai_ws', '#include <WebSocketsClient.h>');
  generator.addLibrary('huoshan_ai_i2s', '#include <driver/i2s.h>');
  generator.addLibrary('huoshan_ai_gpio', '#include <driver/gpio.h>');
  generator.addLibrary('huoshan_ai_semphr', '#include <freertos/semphr.h>');
  generator.addLibrary('huoshan_ai_queue', '#include <freertos/queue.h>');
  generator.addLibrary('huoshan_ai_heap_caps', '#include <esp_heap_caps.h>');
  generator.addLibrary('huoshan_ai_esp_system', '#include <esp_system.h>');
  generator.addLibrary('huoshan_ai_esp_mac', '#include <esp_mac.h>');
  generator.addLibrary('huoshan_ai_base64', '#include <mbedtls/base64.h>');
  generator.addLibrary('huoshan_ai_vector', '#include <vector>');
  generator.addLibrary('huoshan_ai_math', '#include <math.h>');
  generator.addLibrary('huoshan_ai_string_h', '#include <string.h>');

  generator.addFunction('huoshan_ai_runtime', String.raw`
static const uint8_t HUOSHAN_AI_FULL_CLIENT_HEADER[] = {0x11, 0x10, 0x10, 0x00};
static const uint8_t HUOSHAN_AI_AUDIO_ONLY_HEADER[] = {0x11, 0x20, 0x10, 0x00};
static const uint8_t HUOSHAN_AI_LAST_AUDIO_HEADER[] = {0x11, 0x22, 0x10, 0x00};
static const size_t HUOSHAN_AI_ASR_CHUNK_BYTES = 3200;
static const uint8_t HUOSHAN_AI_ASR_QUEUE_LENGTH = 16;

struct HuoshanAIAsrAudioPacket {
  uint8_t index;
  uint16_t size;
};

struct HuoshanAITtsAudioTask {
  size_t bytes;
  int16_t *data;
};

String huoshan_ai_doubao_app_id = "";
String huoshan_ai_doubao_token = "";
String huoshan_ai_coze_token = "";
String huoshan_ai_coze_bot_id = "";
String huoshan_ai_user_id = "";
String huoshan_ai_voice_type = "zh_female_wanwanxiaohe_moon_bigtts";
String huoshan_ai_conversation_id = "";
String huoshan_ai_last_asr_text = "";
String huoshan_ai_last_reply_text = "";
String huoshan_ai_last_error = "";
String huoshan_ai_state = "idle";

i2s_port_t huoshan_ai_mic_port = I2S_NUM_1;
i2s_port_t huoshan_ai_speaker_port = I2S_NUM_0;
int huoshan_ai_mic_bclk = 42;
int huoshan_ai_mic_ws = 2;
int huoshan_ai_mic_din = 1;
int huoshan_ai_speaker_bclk = 39;
int huoshan_ai_speaker_ws = 40;
int huoshan_ai_speaker_dout = 38;
int huoshan_ai_mic_gain = 8;
int huoshan_ai_max_record_seconds = 15;
double huoshan_ai_volume = 0.9;
double huoshan_ai_speed = 1.0;
bool huoshan_ai_mic_ready = false;
bool huoshan_ai_speaker_ready = false;
bool huoshan_ai_mic_driver_installed = false;
bool huoshan_ai_speaker_driver_installed = false;
volatile bool huoshan_ai_recording = false;
TaskHandle_t huoshan_ai_record_task_handle = NULL;
TaskHandle_t huoshan_ai_asr_stream_task_handle = NULL;
SemaphoreHandle_t huoshan_ai_record_mutex = NULL;
std::vector<int16_t> huoshan_ai_record_buffer;
uint32_t huoshan_ai_record_peak_abs = 0;
uint64_t huoshan_ai_record_abs_sum = 0;
size_t huoshan_ai_record_sample_count = 0;
int16_t huoshan_ai_record_min_sample = INT16_MAX;
int16_t huoshan_ai_record_max_sample = INT16_MIN;
volatile bool huoshan_ai_asr_stream_finish_requested = false;
volatile bool huoshan_ai_asr_stream_started = false;
size_t huoshan_ai_asr_stream_samples_sent = 0;
uint32_t huoshan_ai_asr_stream_packets_sent = 0;
uint32_t huoshan_ai_asr_stream_dropped_packets = 0;
unsigned long huoshan_ai_asr_stream_finish_ms = 0;
QueueHandle_t huoshan_ai_asr_audio_queue = NULL;
QueueHandle_t huoshan_ai_asr_free_queue = NULL;
uint8_t *huoshan_ai_asr_packet_pool[HUOSHAN_AI_ASR_QUEUE_LENGTH] = {NULL};
uint8_t huoshan_ai_asr_chunk_buffer[HUOSHAN_AI_ASR_CHUNK_BYTES];
size_t huoshan_ai_asr_chunk_used = 0;

WebSocketsClient huoshan_ai_asr_ws;
WebSocketsClient huoshan_ai_tts_ws;
String huoshan_ai_asr_headers = "";
String huoshan_ai_tts_headers = "";
volatile bool huoshan_ai_asr_done = false;
volatile bool huoshan_ai_tts_done = false;
QueueHandle_t huoshan_ai_tts_audio_queue = NULL;
TaskHandle_t huoshan_ai_tts_audio_task_handle = NULL;
volatile uint32_t huoshan_ai_tts_audio_pending = 0;
uint32_t huoshan_ai_tts_audio_packets = 0;
uint32_t huoshan_ai_tts_audio_dropped = 0;
uint32_t huoshan_ai_tts_audio_bytes = 0;
bool huoshan_ai_tts_final_received = false;

void huoshan_ai_asr_stream_task(void *arg);
void huoshan_ai_tts_audio_task(void *arg);

void huoshan_ai_set_state(const String &state) {
  if (huoshan_ai_state == state) return;
  huoshan_ai_state = state;
  Serial.println("[HuoshanAI] state: " + state);
}

void huoshan_ai_report_error() {
  huoshan_ai_set_state("error");
  if (huoshan_ai_last_error.length() > 0) {
    Serial.println("[HuoshanAI] " + huoshan_ai_last_error);
  }
}

String huoshan_ai_chip_id() {
  uint8_t mac[6];
  esp_efuse_mac_get_default(mac);
  char buf[13];
  snprintf(buf, sizeof(buf), "%02X%02X%02X%02X%02X%02X", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
  return String(buf);
}

String huoshan_ai_effective_user_id() {
  if (huoshan_ai_user_id.length() > 0) return huoshan_ai_user_id;
  return huoshan_ai_chip_id();
}

String huoshan_ai_task_id() {
  static const char *charset = "0123456789abcdef";
  randomSeed(micros());
  String id = "";
  id.reserve(32);
  for (int i = 0; i < 32; i++) id += charset[random(16)];
  return id;
}

int32_t huoshan_ai_read_i32(const uint8_t *bytes) {
  return ((int32_t)bytes[0] << 24) | ((int32_t)bytes[1] << 16) | ((int32_t)bytes[2] << 8) | bytes[3];
}

void huoshan_ai_append_u32(std::vector<uint8_t> &out, uint32_t value) {
  out.push_back((value >> 24) & 0xFF);
  out.push_back((value >> 16) & 0xFF);
  out.push_back((value >> 8) & 0xFF);
  out.push_back(value & 0xFF);
}

void huoshan_ai_append_bytes(std::vector<uint8_t> &out, const uint8_t *data, size_t len) {
  out.insert(out.end(), data, data + len);
}

String huoshan_ai_bytes_to_string(const uint8_t *data, size_t len) {
  String out;
  out.reserve(len + 1);
  for (size_t i = 0; i < len; i++) {
    out += (char)data[i];
  }
  return out;
}

String huoshan_ai_extract_json_string(const String &json, const String &key) {
  String marker = "\"" + key + "\":\"";
  int start = json.indexOf(marker);
  if (start < 0) return "";
  start += marker.length();
  int end = start;
  while (end < json.length()) {
    char c = json.charAt(end);
    if (c == '"' && (end == start || json.charAt(end - 1) != '\\')) break;
    end++;
  }
  if (end >= json.length()) return "";
  return json.substring(start, end);
}

bool huoshan_ai_find_json_string_bounds(const String &json, const String &key, int &valueStart, size_t &valueLength) {
  String marker = "\"" + key + "\":\"";
  int start = json.indexOf(marker);
  if (start < 0) return false;
  start += marker.length();
  int end = start;
  while (end < json.length()) {
    char c = json.charAt(end);
    if (c == '"' && (end == start || json.charAt(end - 1) != '\\')) break;
    end++;
  }
  if (end >= json.length()) return false;
  valueStart = start;
  valueLength = (size_t)(end - start);
  return valueLength > 0;
}

int huoshan_ai_extract_json_int(const String &json, const String &key, int fallback) {
  String marker = "\"" + key + "\":";
  int start = json.indexOf(marker);
  if (start < 0) return fallback;
  start += marker.length();
  while (start < json.length() && json.charAt(start) == ' ') start++;
  int end = start;
  while (end < json.length()) {
    char c = json.charAt(end);
    if ((c < '0' || c > '9') && c != '-') break;
    end++;
  }
  if (end <= start) return fallback;
  return json.substring(start, end).toInt();
}

int huoshan_ai_find_sentence_end(const String &input) {
  const char *marks[] = {"。", "！", "？", "；", ".", "!", "?", ";"};
  int best = -1;
  for (const char *mark : marks) {
    int idx = input.indexOf(mark);
    if (idx >= 0 && (best < 0 || idx < best)) best = idx + strlen(mark);
  }
  return best;
}

void huoshan_ai_config(String appId, String doubaoToken, String cozeToken, String cozeBotId, String userId) {
  huoshan_ai_doubao_app_id = appId;
  huoshan_ai_doubao_token = doubaoToken;
  huoshan_ai_coze_token = cozeToken;
  huoshan_ai_coze_bot_id = cozeBotId;
  huoshan_ai_user_id = userId;
}

void huoshan_ai_uninstall_mic_driver() {
  if (huoshan_ai_mic_driver_installed) {
    i2s_driver_uninstall(huoshan_ai_mic_port);
    huoshan_ai_mic_driver_installed = false;
  }
  huoshan_ai_mic_ready = false;
}

void huoshan_ai_uninstall_speaker_driver() {
  if (huoshan_ai_speaker_driver_installed) {
    i2s_driver_uninstall(huoshan_ai_speaker_port);
    huoshan_ai_speaker_driver_installed = false;
  }
  huoshan_ai_speaker_ready = false;
}

bool huoshan_ai_connect_wifi(String ssid, String password, uint32_t timeoutMs) {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid.c_str(), password.c_str());
  unsigned long start = millis();
  Serial.println("[HuoshanAI] connecting WiFi: " + ssid);
  while (WiFi.status() != WL_CONNECTED && millis() - start < timeoutMs) {
    delay(250);
    Serial.print(".");
  }
  Serial.println();
  if (WiFi.status() != WL_CONNECTED) {
    huoshan_ai_last_error = "WiFi connection timeout";
    huoshan_ai_set_state("error");
    Serial.println("[HuoshanAI] " + huoshan_ai_last_error);
    return false;
  }
  huoshan_ai_last_error = "";
  huoshan_ai_set_state("wifi_connected");
  Serial.println("[HuoshanAI] WiFi IP: " + WiFi.localIP().toString());
  return true;
}

void huoshan_ai_config_mic(i2s_port_t port, int bclk, int ws, int din, int gain, int maxSeconds) {
  huoshan_ai_uninstall_mic_driver();
  huoshan_ai_mic_port = port;
  huoshan_ai_mic_bclk = bclk;
  huoshan_ai_mic_ws = ws;
  huoshan_ai_mic_din = din;
  huoshan_ai_mic_gain = gain;
  huoshan_ai_max_record_seconds = maxSeconds > 0 ? maxSeconds : 15;
}

void huoshan_ai_config_speaker(i2s_port_t port, int bclk, int ws, int dout, double volume) {
  huoshan_ai_uninstall_speaker_driver();
  huoshan_ai_speaker_port = port;
  huoshan_ai_speaker_bclk = bclk;
  huoshan_ai_speaker_ws = ws;
  huoshan_ai_speaker_dout = dout;
  huoshan_ai_volume = volume;
}

bool huoshan_ai_init_mic() {
  huoshan_ai_uninstall_mic_driver();

  i2s_config_t config = {};
  config.mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX);
  config.sample_rate = 16000;
  config.bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT;
  config.channel_format = I2S_CHANNEL_FMT_ONLY_LEFT;
#if defined(I2S_COMM_FORMAT_STAND_I2S)
  config.communication_format = I2S_COMM_FORMAT_STAND_I2S;
#else
  config.communication_format = I2S_COMM_FORMAT_I2S;
#endif
  config.intr_alloc_flags = ESP_INTR_FLAG_LEVEL1;
  config.dma_buf_count = 4;
  config.dma_buf_len = 1024;
  config.use_apll = false;

  i2s_pin_config_t pins = {};
  pins.bck_io_num = huoshan_ai_mic_bclk;
  pins.ws_io_num = huoshan_ai_mic_ws;
  pins.data_out_num = -1;
  pins.data_in_num = huoshan_ai_mic_din;

  gpio_reset_pin((gpio_num_t)huoshan_ai_mic_din);
  gpio_set_direction((gpio_num_t)huoshan_ai_mic_din, GPIO_MODE_INPUT);
  gpio_set_pull_mode((gpio_num_t)huoshan_ai_mic_din, GPIO_FLOATING);

  esp_err_t err = i2s_driver_install(huoshan_ai_mic_port, &config, 0, NULL);
  if (err != ESP_OK) {
    huoshan_ai_last_error = "Mic i2s install failed: " + String(err);
    huoshan_ai_set_state("error");
    return false;
  }
  huoshan_ai_mic_driver_installed = true;
  err = i2s_set_pin(huoshan_ai_mic_port, &pins);
  if (err != ESP_OK) {
    huoshan_ai_uninstall_mic_driver();
    huoshan_ai_last_error = "Mic i2s pin failed: " + String(err);
    huoshan_ai_set_state("error");
    return false;
  }
  i2s_zero_dma_buffer(huoshan_ai_mic_port);
  huoshan_ai_mic_ready = true;
  Serial.printf("[HuoshanAI] mic ready: port=%d bclk=%d ws=%d din=%d gain=%d\n", (int)huoshan_ai_mic_port, huoshan_ai_mic_bclk, huoshan_ai_mic_ws, huoshan_ai_mic_din, huoshan_ai_mic_gain);
  return true;
}

bool huoshan_ai_init_speaker() {
  huoshan_ai_uninstall_speaker_driver();

  i2s_config_t config = {};
  config.mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX);
  config.sample_rate = 16000;
  config.bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT;
  config.channel_format = I2S_CHANNEL_FMT_ONLY_LEFT;
#if defined(I2S_COMM_FORMAT_STAND_I2S)
  config.communication_format = I2S_COMM_FORMAT_STAND_I2S;
#else
  config.communication_format = I2S_COMM_FORMAT_I2S;
#endif
  config.intr_alloc_flags = ESP_INTR_FLAG_LEVEL1;
  config.dma_buf_count = 4;
  config.dma_buf_len = 1024;
  config.tx_desc_auto_clear = true;

  i2s_pin_config_t pins = {};
  pins.bck_io_num = huoshan_ai_speaker_bclk;
  pins.ws_io_num = huoshan_ai_speaker_ws;
  pins.data_out_num = huoshan_ai_speaker_dout;
  pins.data_in_num = -1;

  esp_err_t err = i2s_driver_install(huoshan_ai_speaker_port, &config, 0, NULL);
  if (err != ESP_OK) {
    huoshan_ai_last_error = "Speaker i2s install failed: " + String(err);
    huoshan_ai_set_state("error");
    return false;
  }
  huoshan_ai_speaker_driver_installed = true;
  err = i2s_set_pin(huoshan_ai_speaker_port, &pins);
  if (err != ESP_OK) {
    huoshan_ai_uninstall_speaker_driver();
    huoshan_ai_last_error = "Speaker i2s pin failed: " + String(err);
    huoshan_ai_set_state("error");
    return false;
  }
  i2s_zero_dma_buffer(huoshan_ai_speaker_port);
  huoshan_ai_speaker_ready = true;
  Serial.printf("[HuoshanAI] speaker ready: port=%d bclk=%d ws=%d dout=%d volume=%.2f\n", (int)huoshan_ai_speaker_port, huoshan_ai_speaker_bclk, huoshan_ai_speaker_ws, huoshan_ai_speaker_dout, huoshan_ai_volume);
  return true;
}

void huoshan_ai_begin() {
  huoshan_ai_last_error = "";
  if (!huoshan_ai_init_speaker()) return;
  if (!huoshan_ai_init_mic()) return;
  if (huoshan_ai_record_mutex == NULL) {
    huoshan_ai_record_mutex = xSemaphoreCreateMutex();
  }
  huoshan_ai_record_buffer.reserve(16000 * huoshan_ai_max_record_seconds);
  huoshan_ai_set_state("idle");
}

void huoshan_ai_play_pcm16(const uint8_t *payload, size_t payloadSize) {
  if (!huoshan_ai_speaker_ready && !huoshan_ai_init_speaker()) return;
  size_t samples = payloadSize / sizeof(int16_t);
  const int16_t *input = (const int16_t *)payload;
  const size_t chunkSamples = 512;
  int32_t output[chunkSamples];
  int32_t factor = (int32_t)(pow(huoshan_ai_volume, 2) * 65536.0);
  for (size_t offset = 0; offset < samples; offset += chunkSamples) {
    size_t current = samples - offset;
    if (current > chunkSamples) current = chunkSamples;
    for (size_t i = 0; i < current; i++) {
      int64_t v = (int64_t)input[offset + i] * factor;
      if (v > INT32_MAX) v = INT32_MAX;
      if (v < INT32_MIN) v = INT32_MIN;
      output[i] = (int32_t)v;
    }
    size_t written = 0;
    i2s_write(huoshan_ai_speaker_port, output, current * sizeof(int32_t), &written, portMAX_DELAY);
  }
}

bool huoshan_ai_tts_init_audio_queue() {
  if (huoshan_ai_tts_audio_queue == NULL) {
    huoshan_ai_tts_audio_queue = xQueueCreate(30, sizeof(HuoshanAITtsAudioTask));
  }
  if (huoshan_ai_tts_audio_queue == NULL) return false;
  if (huoshan_ai_tts_audio_task_handle == NULL) {
    xTaskCreate(huoshan_ai_tts_audio_task, "huoshanTtsAudio", 4096, NULL, 1, &huoshan_ai_tts_audio_task_handle);
  }
  return huoshan_ai_tts_audio_task_handle != NULL;
}

void huoshan_ai_tts_audio_task(void *arg) {
  HuoshanAITtsAudioTask task;
  while (true) {
    if (xQueueReceive(huoshan_ai_tts_audio_queue, &task, portMAX_DELAY) == pdTRUE) {
      if (task.data != NULL && task.bytes > 0) {
        huoshan_ai_play_pcm16((const uint8_t *)task.data, task.bytes);
        free(task.data);
      }
      if (huoshan_ai_tts_audio_pending > 0) huoshan_ai_tts_audio_pending--;
    }
    vTaskDelay(1);
  }
}

bool huoshan_ai_tts_enqueue_audio(const uint8_t *payload, size_t payloadSize) {
  if (payload == NULL || payloadSize == 0) return true;
  if (!huoshan_ai_tts_init_audio_queue()) {
    huoshan_ai_tts_audio_dropped++;
    return false;
  }
#if defined(BOARD_HAS_PSRAM)
  int16_t *copy = (int16_t *)heap_caps_malloc(payloadSize, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
#else
  int16_t *copy = NULL;
#endif
  if (copy == NULL) {
    copy = (int16_t *)heap_caps_malloc(payloadSize, MALLOC_CAP_8BIT);
  }
  if (copy == NULL) {
    huoshan_ai_tts_audio_dropped++;
    return false;
  }
  memcpy(copy, payload, payloadSize);
  HuoshanAITtsAudioTask task;
  task.bytes = payloadSize;
  task.data = copy;
  huoshan_ai_tts_audio_pending++;
  if (xQueueSend(huoshan_ai_tts_audio_queue, &task, pdMS_TO_TICKS(100)) != pdTRUE) {
    huoshan_ai_tts_audio_pending--;
    huoshan_ai_tts_audio_dropped++;
    free(copy);
    return false;
  }
  huoshan_ai_tts_audio_packets++;
  huoshan_ai_tts_audio_bytes += payloadSize;
  return true;
}

void huoshan_ai_tts_wait_audio_done(uint32_t timeoutMs) {
  unsigned long start = millis();
  while (huoshan_ai_tts_audio_pending > 0 && millis() - start < timeoutMs) {
    delay(5);
  }
}

void huoshan_ai_stop_audio() {
  if (huoshan_ai_speaker_ready) {
    i2s_zero_dma_buffer(huoshan_ai_speaker_port);
  }
  if (huoshan_ai_tts_audio_queue != NULL) {
    HuoshanAITtsAudioTask task;
    while (xQueueReceive(huoshan_ai_tts_audio_queue, &task, 0) == pdTRUE) {
      if (task.data != NULL) free(task.data);
      if (huoshan_ai_tts_audio_pending > 0) huoshan_ai_tts_audio_pending--;
    }
  }
}

bool huoshan_ai_asr_queue_packet(const uint8_t *data, size_t size, TickType_t waitTicks) {
  if (huoshan_ai_asr_audio_queue == NULL || huoshan_ai_asr_free_queue == NULL || data == NULL || size == 0) return false;
  uint8_t index = 0;
  if (xQueueReceive(huoshan_ai_asr_free_queue, &index, waitTicks) != pdTRUE || index >= HUOSHAN_AI_ASR_QUEUE_LENGTH || huoshan_ai_asr_packet_pool[index] == NULL) {
    huoshan_ai_asr_stream_dropped_packets++;
    return false;
  }
  HuoshanAIAsrAudioPacket packet;
  packet.index = index;
  packet.size = size > HUOSHAN_AI_ASR_CHUNK_BYTES ? HUOSHAN_AI_ASR_CHUNK_BYTES : size;
  memcpy(huoshan_ai_asr_packet_pool[index], data, packet.size);
  if (xQueueSend(huoshan_ai_asr_audio_queue, &packet, 0) != pdTRUE) {
    xQueueSend(huoshan_ai_asr_free_queue, &index, 0);
    huoshan_ai_asr_stream_dropped_packets++;
    return false;
  }
  return true;
}

void huoshan_ai_asr_queue_pcm_sample(int16_t sample) {
  uint8_t *bytes = (uint8_t *)&sample;
  huoshan_ai_asr_chunk_buffer[huoshan_ai_asr_chunk_used++] = bytes[0];
  huoshan_ai_asr_chunk_buffer[huoshan_ai_asr_chunk_used++] = bytes[1];
  if (huoshan_ai_asr_chunk_used >= HUOSHAN_AI_ASR_CHUNK_BYTES) {
    huoshan_ai_asr_queue_packet(huoshan_ai_asr_chunk_buffer, huoshan_ai_asr_chunk_used, pdMS_TO_TICKS(200));
    huoshan_ai_asr_chunk_used = 0;
  }
}

void huoshan_ai_asr_flush_chunk() {
  if (huoshan_ai_asr_chunk_used > 0) {
    huoshan_ai_asr_queue_packet(huoshan_ai_asr_chunk_buffer, huoshan_ai_asr_chunk_used, pdMS_TO_TICKS(500));
    huoshan_ai_asr_chunk_used = 0;
  }
}

void huoshan_ai_asr_release_queued_packets() {
  if (huoshan_ai_asr_audio_queue == NULL || huoshan_ai_asr_free_queue == NULL) return;
  HuoshanAIAsrAudioPacket packet;
  while (xQueueReceive(huoshan_ai_asr_audio_queue, &packet, 0) == pdTRUE) {
    if (packet.index < HUOSHAN_AI_ASR_QUEUE_LENGTH) {
      xQueueSend(huoshan_ai_asr_free_queue, &packet.index, 0);
    }
  }
}

bool huoshan_ai_asr_init_audio_queues() {
  if (huoshan_ai_asr_audio_queue == NULL) {
    huoshan_ai_asr_audio_queue = xQueueCreate(HUOSHAN_AI_ASR_QUEUE_LENGTH, sizeof(HuoshanAIAsrAudioPacket));
  }
  if (huoshan_ai_asr_free_queue == NULL) {
    huoshan_ai_asr_free_queue = xQueueCreate(HUOSHAN_AI_ASR_QUEUE_LENGTH, sizeof(uint8_t));
  }
  if (huoshan_ai_asr_audio_queue == NULL || huoshan_ai_asr_free_queue == NULL) return false;

  for (uint8_t i = 0; i < HUOSHAN_AI_ASR_QUEUE_LENGTH; i++) {
    if (huoshan_ai_asr_packet_pool[i] == NULL) {
#if defined(BOARD_HAS_PSRAM)
      huoshan_ai_asr_packet_pool[i] = (uint8_t *)heap_caps_malloc(HUOSHAN_AI_ASR_CHUNK_BYTES, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
#endif
      if (huoshan_ai_asr_packet_pool[i] == NULL) {
        huoshan_ai_asr_packet_pool[i] = (uint8_t *)heap_caps_malloc(HUOSHAN_AI_ASR_CHUNK_BYTES, MALLOC_CAP_8BIT);
      }
      if (huoshan_ai_asr_packet_pool[i] == NULL) return false;
    }
  }

  xQueueReset(huoshan_ai_asr_audio_queue);
  xQueueReset(huoshan_ai_asr_free_queue);
  for (uint8_t i = 0; i < HUOSHAN_AI_ASR_QUEUE_LENGTH; i++) {
    xQueueSend(huoshan_ai_asr_free_queue, &i, 0);
  }
  return true;
}

void huoshan_ai_record_task(void *arg) {
  int16_t buffer[160];
  size_t bytesRead = 0;
  const size_t maxSamples = (size_t)16000 * (size_t)huoshan_ai_max_record_seconds;
  while (huoshan_ai_recording) {
    esp_err_t err = i2s_read(huoshan_ai_mic_port, buffer, sizeof(buffer), &bytesRead, pdMS_TO_TICKS(100));
    if (err == ESP_OK && bytesRead > 0) {
      size_t samples = bytesRead / sizeof(int16_t);
      for (size_t i = 0; i < samples; i++) {
        int32_t amplified = (int32_t)buffer[i] * huoshan_ai_mic_gain;
        if (amplified > INT16_MAX) amplified = INT16_MAX;
        if (amplified < INT16_MIN) amplified = INT16_MIN;
        int16_t sample = (int16_t)amplified;
        buffer[i] = sample;
        uint32_t absSample = sample < 0 ? (uint32_t)(-(int32_t)sample) : (uint32_t)sample;
        if (absSample > huoshan_ai_record_peak_abs) huoshan_ai_record_peak_abs = absSample;
        huoshan_ai_record_abs_sum += absSample;
        huoshan_ai_record_sample_count++;
        if (sample < huoshan_ai_record_min_sample) huoshan_ai_record_min_sample = sample;
        if (sample > huoshan_ai_record_max_sample) huoshan_ai_record_max_sample = sample;
        huoshan_ai_asr_queue_pcm_sample(sample);
      }
      bool bufferFull = false;
      if (huoshan_ai_record_mutex != NULL) xSemaphoreTake(huoshan_ai_record_mutex, portMAX_DELAY);
      size_t available = maxSamples > huoshan_ai_record_buffer.size() ? maxSamples - huoshan_ai_record_buffer.size() : 0;
      size_t toAppend = samples < available ? samples : available;
      if (toAppend > 0) {
        huoshan_ai_record_buffer.insert(huoshan_ai_record_buffer.end(), buffer, buffer + toAppend);
      }
      if (huoshan_ai_record_buffer.size() >= maxSamples) bufferFull = true;
      if (huoshan_ai_record_mutex != NULL) xSemaphoreGive(huoshan_ai_record_mutex);
      if (bufferFull) {
        huoshan_ai_recording = false;
      }
    }
    vTaskDelay(1);
  }
  huoshan_ai_asr_flush_chunk();
  huoshan_ai_record_task_handle = NULL;
  vTaskDelete(NULL);
}

void huoshan_ai_start_listening() {
  if (!huoshan_ai_mic_ready && !huoshan_ai_init_mic()) return;
  if (huoshan_ai_recording) return;
  if (huoshan_ai_asr_stream_task_handle != NULL) {
    huoshan_ai_last_error = "ASR stream is still busy";
    huoshan_ai_set_state("error");
    return;
  }
  if (huoshan_ai_record_mutex == NULL) {
    huoshan_ai_record_mutex = xSemaphoreCreateMutex();
  }
  bool asrQueueReady = huoshan_ai_asr_init_audio_queues();
  if (huoshan_ai_record_mutex != NULL) xSemaphoreTake(huoshan_ai_record_mutex, portMAX_DELAY);
  huoshan_ai_record_buffer.clear();
  huoshan_ai_record_buffer.reserve(16000 * huoshan_ai_max_record_seconds);
  if (huoshan_ai_record_mutex != NULL) xSemaphoreGive(huoshan_ai_record_mutex);
  huoshan_ai_record_peak_abs = 0;
  huoshan_ai_record_abs_sum = 0;
  huoshan_ai_record_sample_count = 0;
  huoshan_ai_record_min_sample = INT16_MAX;
  huoshan_ai_record_max_sample = INT16_MIN;
  huoshan_ai_asr_stream_finish_requested = false;
  huoshan_ai_asr_stream_started = false;
  huoshan_ai_asr_stream_samples_sent = 0;
  huoshan_ai_asr_stream_packets_sent = 0;
  huoshan_ai_asr_stream_dropped_packets = 0;
  huoshan_ai_asr_stream_finish_ms = 0;
  huoshan_ai_asr_chunk_used = 0;
  huoshan_ai_last_error = "";
  i2s_zero_dma_buffer(huoshan_ai_mic_port);
  huoshan_ai_recording = true;
  huoshan_ai_last_asr_text = "";
  huoshan_ai_last_reply_text = "";
  huoshan_ai_set_state("listening");
  xTaskCreate(huoshan_ai_record_task, "huoshanRecord", 4096, NULL, 2, &huoshan_ai_record_task_handle);
  if (asrQueueReady) {
    xTaskCreate(huoshan_ai_asr_stream_task, "huoshanASR", 8192, NULL, 3, &huoshan_ai_asr_stream_task_handle);
  } else {
    Serial.println("[HuoshanAI] warning: ASR queue unavailable, fallback to upload after recording");
  }
}

void huoshan_ai_stop_recording() {
  huoshan_ai_recording = false;
  unsigned long start = millis();
  while (huoshan_ai_record_task_handle != NULL && millis() - start < 2000) {
    delay(10);
  }
  uint32_t avgAbs = huoshan_ai_record_sample_count > 0 ? (uint32_t)(huoshan_ai_record_abs_sum / huoshan_ai_record_sample_count) : 0;
  size_t recordedSamples = 0;
  if (huoshan_ai_record_mutex != NULL) xSemaphoreTake(huoshan_ai_record_mutex, portMAX_DELAY);
  recordedSamples = huoshan_ai_record_buffer.size();
  if (huoshan_ai_record_mutex != NULL) xSemaphoreGive(huoshan_ai_record_mutex);
  Serial.printf("[HuoshanAI] recorded samples: %u, bytes: %u, peak=%u, avgAbs=%u, min=%d, max=%d\n",
                (unsigned)recordedSamples,
                (unsigned)(recordedSamples * sizeof(int16_t)),
                (unsigned)huoshan_ai_record_peak_abs,
                (unsigned)avgAbs,
                (int)huoshan_ai_record_min_sample,
                (int)huoshan_ai_record_max_sample);
  if (huoshan_ai_record_sample_count > 0 && huoshan_ai_record_peak_abs < 128) {
    Serial.println("[HuoshanAI] warning: recorded audio is nearly silent");
  }
}

void huoshan_ai_asr_event(WStype_t type, uint8_t *payload, size_t length) {
  if (type == WStype_ERROR || type == WStype_DISCONNECTED) {
    if (!huoshan_ai_asr_done && (huoshan_ai_state == "recognizing" || huoshan_ai_asr_stream_task_handle != NULL)) {
      huoshan_ai_last_error = "ASR websocket disconnected";
      huoshan_ai_asr_done = true;
      huoshan_ai_recording = false;
    }
    return;
  }
  if (type != WStype_BIN || payload == NULL || length < 8) return;

  uint8_t messageType = payload[1] >> 4;
  const uint8_t *body = payload + 4;
  if (messageType == 0b1001) {
    uint32_t payloadSize = huoshan_ai_read_i32(body);
    if (payloadSize > length - 8) return;
    body += 4;
    String json = huoshan_ai_bytes_to_string(body, payloadSize);
    JsonDocument doc;
    DeserializationError err = deserializeJson(doc, json);
    if (err) {
      huoshan_ai_last_error = "ASR JSON parse failed";
      return;
    }
    int32_t code = doc["code"] | 0;
    int32_t sequence = doc["sequence"] | 0;
    String message = doc["message"] | "";
    if (code == 1000) {
      JsonArray result = doc["result"].as<JsonArray>();
      for (JsonObject item : result) {
        String text = item["text"] | "";
        if (text.length() > 0) huoshan_ai_last_asr_text = text;
      }
    } else {
      huoshan_ai_last_error = String("ASR code ") + String(code);
      if (message.length() > 0) huoshan_ai_last_error += ": " + message;
    }
    if (sequence < 0) huoshan_ai_asr_done = true;
  } else if (messageType == 0b1111) {
    if (length < 12) return;
    uint32_t errorCode = huoshan_ai_read_i32(body);
    uint32_t messageSize = huoshan_ai_read_i32(body + 4);
    if (messageSize > length - 12) return;
    String msg = huoshan_ai_bytes_to_string(body + 8, messageSize);
    huoshan_ai_last_error = "ASR error " + String(errorCode) + ": " + msg;
    huoshan_ai_asr_done = true;
  }
}

std::vector<uint8_t> huoshan_ai_build_asr_full_request() {
  JsonDocument doc;
  doc["app"]["appid"] = huoshan_ai_doubao_app_id;
  doc["app"]["cluster"] = "volcengine_streaming_common";
  doc["app"]["token"] = huoshan_ai_doubao_token;
  doc["user"]["uid"] = huoshan_ai_effective_user_id();
  doc["request"]["reqid"] = huoshan_ai_task_id();
  doc["request"]["nbest"] = 1;
  doc["request"]["result_type"] = "full";
  doc["request"]["sequence"] = 1;
  doc["request"]["workflow"] = "audio_in,resample,partition,vad,fe,decode,itn,nlu_ddc,nlu_punctuate";
  doc["audio"]["format"] = "raw";
  doc["audio"]["codec"] = "raw";
  doc["audio"]["channel"] = 1;
  doc["audio"]["rate"] = 16000;
  String payload;
  serializeJson(doc, payload);

  std::vector<uint8_t> request;
  huoshan_ai_append_bytes(request, HUOSHAN_AI_FULL_CLIENT_HEADER, sizeof(HUOSHAN_AI_FULL_CLIENT_HEADER));
  huoshan_ai_append_u32(request, payload.length());
  huoshan_ai_append_bytes(request, (const uint8_t *)payload.c_str(), payload.length());
  return request;
}

std::vector<uint8_t> huoshan_ai_build_asr_audio_request(const uint8_t *audio, size_t size, bool lastPacket) {
  std::vector<uint8_t> request;
  request.reserve(size + 8);
  if (lastPacket) {
    huoshan_ai_append_bytes(request, HUOSHAN_AI_LAST_AUDIO_HEADER, sizeof(HUOSHAN_AI_LAST_AUDIO_HEADER));
  } else {
    huoshan_ai_append_bytes(request, HUOSHAN_AI_AUDIO_ONLY_HEADER, sizeof(HUOSHAN_AI_AUDIO_ONLY_HEADER));
  }
  huoshan_ai_append_u32(request, size);
  huoshan_ai_append_bytes(request, audio, size);
  return request;
}

bool huoshan_ai_asr_open_stream() {
  huoshan_ai_last_asr_text = "";
  huoshan_ai_last_error = "";
  huoshan_ai_asr_done = false;

  if (huoshan_ai_doubao_app_id.length() == 0 || huoshan_ai_doubao_token.length() == 0) {
    huoshan_ai_last_error = "Doubao config missing";
    return false;
  }
  if (WiFi.status() != WL_CONNECTED) {
    huoshan_ai_last_error = "WiFi not connected";
    return false;
  }

  huoshan_ai_asr_ws.disconnect();
  huoshan_ai_asr_headers = "Authorization: Bearer; " + huoshan_ai_doubao_token;
  huoshan_ai_asr_ws.setExtraHeaders(huoshan_ai_asr_headers.c_str());
  huoshan_ai_asr_ws.beginSSL("openspeech.bytedance.com", 443, "/api/v2/asr");
  huoshan_ai_asr_ws.onEvent(huoshan_ai_asr_event);

  unsigned long connectStart = millis();
  while (!huoshan_ai_asr_ws.isConnected() && millis() - connectStart < 10000) {
    huoshan_ai_asr_ws.loop();
    delay(1);
  }
  if (!huoshan_ai_asr_ws.isConnected()) {
    huoshan_ai_last_error = "ASR connect timeout";
    huoshan_ai_asr_ws.disconnect();
    return false;
  }

  std::vector<uint8_t> fullRequest = huoshan_ai_build_asr_full_request();
  if (!huoshan_ai_asr_ws.sendBIN(fullRequest.data(), fullRequest.size())) {
    huoshan_ai_last_error = "ASR header send failed";
    huoshan_ai_asr_ws.disconnect();
    return false;
  }
  Serial.printf("[HuoshanAI] ASR stream connected in %u ms\n", (unsigned)(millis() - connectStart));
  return true;
}

bool huoshan_ai_asr_send_audio(const uint8_t *audio, size_t size, bool lastPacket) {
  std::vector<uint8_t> request = huoshan_ai_build_asr_audio_request(audio, size, lastPacket);
  if (!huoshan_ai_asr_ws.sendBIN(request.data(), request.size())) {
    huoshan_ai_last_error = lastPacket ? "ASR final packet send failed" : "ASR audio send failed";
    return false;
  }
  huoshan_ai_asr_ws.loop();
  return true;
}

String huoshan_ai_asr_wait_result(uint32_t timeoutMs) {
  unsigned long waitStart = millis();
  while (!huoshan_ai_asr_done && millis() - waitStart < timeoutMs) {
    huoshan_ai_asr_ws.loop();
    delay(1);
  }
  huoshan_ai_asr_ws.disconnect();
  if (!huoshan_ai_asr_done && huoshan_ai_last_error.length() == 0) {
    huoshan_ai_last_error = "ASR result timeout";
  }
  if (huoshan_ai_last_asr_text.length() > 0) {
    Serial.println("[HuoshanAI] ASR text: " + huoshan_ai_last_asr_text);
  } else if (huoshan_ai_last_error.length() > 0) {
    Serial.println("[HuoshanAI] ASR failed: " + huoshan_ai_last_error);
  }
  return huoshan_ai_last_asr_text;
}

void huoshan_ai_asr_stream_task(void *arg) {
  unsigned long taskStart = millis();
  huoshan_ai_asr_stream_started = false;
  huoshan_ai_asr_stream_samples_sent = 0;
  huoshan_ai_asr_stream_packets_sent = 0;
  huoshan_ai_asr_stream_dropped_packets = 0;

  if (!huoshan_ai_asr_open_stream()) {
    Serial.println("[HuoshanAI] ASR stream failed: " + huoshan_ai_last_error);
    huoshan_ai_recording = false;
    huoshan_ai_asr_release_queued_packets();
    huoshan_ai_set_state("error");
    huoshan_ai_asr_stream_task_handle = NULL;
    vTaskDelete(NULL);
    return;
  }
  huoshan_ai_asr_stream_started = true;

  while (true) {
    HuoshanAIAsrAudioPacket packet;
    if (huoshan_ai_asr_audio_queue != NULL && xQueueReceive(huoshan_ai_asr_audio_queue, &packet, pdMS_TO_TICKS(10)) == pdTRUE) {
      bool sent = false;
      if (packet.index < HUOSHAN_AI_ASR_QUEUE_LENGTH && huoshan_ai_asr_packet_pool[packet.index] != NULL && packet.size > 0) {
        sent = huoshan_ai_asr_send_audio(huoshan_ai_asr_packet_pool[packet.index], packet.size, false);
      }
      if (packet.index < HUOSHAN_AI_ASR_QUEUE_LENGTH && huoshan_ai_asr_free_queue != NULL) {
        xQueueSend(huoshan_ai_asr_free_queue, &packet.index, 0);
      }
      if (!sent) break;
      huoshan_ai_asr_stream_samples_sent += packet.size / sizeof(int16_t);
      huoshan_ai_asr_stream_packets_sent++;
      vTaskDelay(pdMS_TO_TICKS(1));
      continue;
    }
    if (huoshan_ai_asr_stream_finish_requested && !huoshan_ai_recording) break;
    huoshan_ai_asr_ws.loop();
    vTaskDelay(pdMS_TO_TICKS(1));
  }

  if (huoshan_ai_last_error.length() == 0) {
    uint8_t finalPayload = 0;
    huoshan_ai_asr_send_audio(&finalPayload, 1, true);
  }
  unsigned long afterStop = huoshan_ai_asr_stream_finish_ms > 0 ? millis() - huoshan_ai_asr_stream_finish_ms : 0;
  Serial.printf("[HuoshanAI] ASR stream sent: %u packets, %u bytes, elapsed=%u ms, afterStop=%u ms, dropped=%u\n",
                (unsigned)huoshan_ai_asr_stream_packets_sent,
                (unsigned)(huoshan_ai_asr_stream_samples_sent * sizeof(int16_t)),
                (unsigned)(millis() - taskStart),
                (unsigned)afterStop,
                (unsigned)huoshan_ai_asr_stream_dropped_packets);
  if (huoshan_ai_last_error.length() == 0) {
    huoshan_ai_asr_wait_result(15000);
  } else {
    huoshan_ai_asr_ws.disconnect();
    Serial.println("[HuoshanAI] ASR failed: " + huoshan_ai_last_error);
    huoshan_ai_set_state("error");
  }
  huoshan_ai_asr_release_queued_packets();
  huoshan_ai_asr_stream_task_handle = NULL;
  vTaskDelete(NULL);
}

String huoshan_ai_asr_recognize(uint8_t *audio, size_t size) {
  Serial.printf("[HuoshanAI] ASR start, audio bytes: %u\n", (unsigned)size);

  if (!huoshan_ai_asr_open_stream()) return "";

  size_t offset = 0;
  while (offset < size) {
    size_t current = (size - offset) < HUOSHAN_AI_ASR_CHUNK_BYTES ? (size - offset) : HUOSHAN_AI_ASR_CHUNK_BYTES;
    if (!huoshan_ai_asr_send_audio(audio + offset, current, false)) {
      break;
    }
    offset += current;
    delay(1);
  }
  if (huoshan_ai_last_error.length() == 0) {
    uint8_t finalPayload = 0;
    huoshan_ai_asr_send_audio(&finalPayload, 1, true);
  }
  Serial.printf("[HuoshanAI] ASR audio sent: %u bytes\n", (unsigned)offset);
  return huoshan_ai_asr_wait_result(15000);
}

void huoshan_ai_tts_event(WStype_t type, uint8_t *payload, size_t length) {
  if (type == WStype_ERROR || type == WStype_DISCONNECTED) {
    if (!huoshan_ai_tts_done && huoshan_ai_state == "speaking") {
      if (huoshan_ai_tts_audio_packets == 0) {
        huoshan_ai_last_error = "TTS websocket disconnected before audio";
      } else if (!huoshan_ai_tts_final_received) {
        huoshan_ai_last_error = "TTS websocket disconnected before final audio";
      }
      huoshan_ai_tts_done = true;
    }
    return;
  }
  if (type != WStype_BIN || payload == NULL || length < 8) return;

  uint8_t messageType = payload[1] >> 4;
  uint8_t flags = payload[1] & 0x0f;
  const uint8_t *body = payload + 4;
  if (messageType == 0b1011 && flags > 0) {
    if (length < 12) return;
    int32_t sequence = huoshan_ai_read_i32(body);
    uint32_t payloadSize = huoshan_ai_read_i32(body + 4);
    if (payloadSize > length - 12) return;
    if (payloadSize > 0) {
      if (!huoshan_ai_tts_enqueue_audio(body + 8, payloadSize)) {
        huoshan_ai_last_error = "TTS audio queue full";
        huoshan_ai_tts_done = true;
      }
    }
    if (sequence < 0) {
      huoshan_ai_tts_final_received = true;
      huoshan_ai_tts_done = true;
    }
  } else if (messageType == 0b1111) {
    if (length < 12) return;
    uint32_t errorCode = huoshan_ai_read_i32(body);
    uint32_t messageSize = huoshan_ai_read_i32(body + 4);
    if (messageSize > length - 12) return;
    String msg = huoshan_ai_bytes_to_string(body + 8, messageSize);
    huoshan_ai_last_error = "TTS error " + String(errorCode) + ": " + msg;
    huoshan_ai_tts_done = true;
  }
}

bool huoshan_ai_tts_speak_http(String text) {
  if (huoshan_ai_doubao_app_id.length() == 0 || huoshan_ai_doubao_token.length() == 0) {
    huoshan_ai_last_error = "Doubao config missing";
    huoshan_ai_report_error();
    return false;
  }
  if (WiFi.status() != WL_CONNECTED) {
    huoshan_ai_last_error = "WiFi not connected";
    huoshan_ai_report_error();
    return false;
  }
  if (!huoshan_ai_speaker_ready && !huoshan_ai_init_speaker()) return false;

  JsonDocument doc;
  doc["app"]["appid"] = huoshan_ai_doubao_app_id;
  doc["app"]["token"] = huoshan_ai_doubao_token;
  doc["app"]["cluster"] = "volcano_tts";
  doc["user"]["uid"] = huoshan_ai_effective_user_id();
  doc["audio"]["voice_type"] = huoshan_ai_voice_type;
  doc["audio"]["encoding"] = "pcm";
  doc["audio"]["rate"] = 16000;
  doc["audio"]["speed_ratio"] = huoshan_ai_speed;
  doc["audio"]["volume_ratio"] = 2;
  doc["request"]["reqid"] = huoshan_ai_task_id();
  doc["request"]["text"] = text;
  doc["request"]["operation"] = "query";

  String body;
  serializeJson(doc, body);

  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;
  http.setTimeout(120000);
  if (!http.begin(client, "https://openspeech.bytedance.com/api/v1/tts")) {
    huoshan_ai_last_error = "TTS HTTP begin failed";
    huoshan_ai_report_error();
    return false;
  }
  http.addHeader("Authorization", "Bearer;" + huoshan_ai_doubao_token);
  http.addHeader("Content-Type", "application/json");

  unsigned long start = millis();
  int code = http.POST(body);
  if (code <= 0 || code >= 400) {
    huoshan_ai_last_error = "TTS HTTP " + String(code);
    String err = http.getString();
    if (err.length() > 0) {
      int previewLen = err.length() > 240 ? 240 : err.length();
      Serial.println(err.substring(0, previewLen));
    }
    http.end();
    huoshan_ai_report_error();
    return false;
  }

  String response = http.getString();
  http.end();
  int errCode = huoshan_ai_extract_json_int(response, "code", 0);
  String message = huoshan_ai_extract_json_string(response, "message");
  int audioBase64Start = 0;
  size_t audioBase64Length = 0;
  if (!huoshan_ai_find_json_string_bounds(response, "data", audioBase64Start, audioBase64Length)) {
    huoshan_ai_last_error = "TTS HTTP no audio data";
    if (errCode != 0 || message.length() > 0) {
      huoshan_ai_last_error += " code=" + String(errCode) + " " + message;
    }
    int previewLen = response.length() > 240 ? 240 : response.length();
    if (previewLen > 0) Serial.println(response.substring(0, previewLen));
    huoshan_ai_report_error();
    return false;
  }

  const unsigned char *audioBase64 = (const unsigned char *)(response.c_str() + audioBase64Start);
  size_t decodedLen = 0;
  int ret = mbedtls_base64_decode(NULL, 0, &decodedLen, audioBase64, audioBase64Length);
  if (ret != 0 && decodedLen == 0) {
    huoshan_ai_last_error = "TTS base64 size failed";
    huoshan_ai_report_error();
    return false;
  }

#if defined(BOARD_HAS_PSRAM)
  uint8_t *pcm = (uint8_t *)heap_caps_malloc(decodedLen, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
#else
  uint8_t *pcm = NULL;
#endif
  if (pcm == NULL) {
    pcm = (uint8_t *)heap_caps_malloc(decodedLen, MALLOC_CAP_8BIT);
  }
  if (pcm == NULL) {
    huoshan_ai_last_error = "TTS audio memory allocation failed";
    huoshan_ai_report_error();
    return false;
  }

  size_t actualLen = 0;
  ret = mbedtls_base64_decode(pcm, decodedLen, &actualLen, audioBase64, audioBase64Length);
  if (ret != 0 || actualLen == 0) {
    free(pcm);
    huoshan_ai_last_error = "TTS base64 decode failed";
    huoshan_ai_report_error();
    return false;
  }

  Serial.printf("[HuoshanAI] TTS HTTP audio: %u bytes in %u ms\n", (unsigned)actualLen, (unsigned)(millis() - start));
  huoshan_ai_play_pcm16(pcm, actualLen);
  free(pcm);
  huoshan_ai_last_error = "";
  return true;
}

std::vector<uint8_t> huoshan_ai_build_tts_request(String text) {
  JsonDocument doc;
  doc["app"]["appid"] = huoshan_ai_doubao_app_id;
  doc["app"]["token"] = huoshan_ai_doubao_token;
  doc["app"]["cluster"] = "volcano_tts";
  doc["user"]["uid"] = huoshan_ai_effective_user_id();
  doc["audio"]["voice_type"] = huoshan_ai_voice_type;
  doc["audio"]["encoding"] = "pcm";
  doc["audio"]["rate"] = 16000;
  doc["audio"]["speed_ratio"] = huoshan_ai_speed;
  doc["audio"]["volume_ratio"] = 2;
  doc["request"]["reqid"] = huoshan_ai_task_id();
  doc["request"]["text"] = text;
  doc["request"]["operation"] = "submit";
  String payload;
  serializeJson(doc, payload);

  std::vector<uint8_t> request;
  huoshan_ai_append_bytes(request, HUOSHAN_AI_FULL_CLIENT_HEADER, sizeof(HUOSHAN_AI_FULL_CLIENT_HEADER));
  huoshan_ai_append_u32(request, payload.length());
  huoshan_ai_append_bytes(request, (const uint8_t *)payload.c_str(), payload.length());
  return request;
}

bool huoshan_ai_tts_connect() {
  if (huoshan_ai_doubao_app_id.length() == 0 || huoshan_ai_doubao_token.length() == 0) {
    huoshan_ai_last_error = "Doubao config missing";
    huoshan_ai_set_state("error");
    return false;
  }
  if (WiFi.status() != WL_CONNECTED) {
    huoshan_ai_last_error = "WiFi not connected";
    huoshan_ai_set_state("error");
    return false;
  }
  if (!huoshan_ai_speaker_ready && !huoshan_ai_init_speaker()) return false;
  if (huoshan_ai_tts_ws.isConnected()) return true;

  huoshan_ai_tts_ws.disconnect();
  huoshan_ai_tts_headers = "Authorization: Bearer; " + huoshan_ai_doubao_token;
  huoshan_ai_tts_ws.setExtraHeaders(huoshan_ai_tts_headers.c_str());
  huoshan_ai_tts_ws.beginSSL("openspeech.bytedance.com", 443, "/api/v1/tts/ws_binary");
  huoshan_ai_tts_ws.onEvent(huoshan_ai_tts_event);

  unsigned long connectStart = millis();
  while (!huoshan_ai_tts_ws.isConnected() && millis() - connectStart < 10000) {
    huoshan_ai_tts_ws.loop();
    delay(1);
  }
  if (!huoshan_ai_tts_ws.isConnected()) {
    huoshan_ai_last_error = "TTS connect timeout";
    huoshan_ai_tts_ws.disconnect();
    huoshan_ai_set_state("error");
    return false;
  }
  Serial.printf("[HuoshanAI] TTS connected in %u ms\n", (unsigned)(millis() - connectStart));
  return true;
}

void huoshan_ai_tts_speak_internal(String text, bool disconnectAfter) {
  if (text.length() == 0) return;
  huoshan_ai_tts_done = false;
  huoshan_ai_tts_final_received = false;
  if (disconnectAfter && huoshan_ai_tts_audio_pending == 0) {
    huoshan_ai_tts_audio_packets = 0;
    huoshan_ai_tts_audio_dropped = 0;
    huoshan_ai_tts_audio_bytes = 0;
  }
  huoshan_ai_set_state("speaking");
  if (huoshan_ai_tts_speak_http(text)) {
    if (disconnectAfter) huoshan_ai_set_state("idle");
    return;
  }
  if (huoshan_ai_last_error.length() > 0) return;
  if (!huoshan_ai_tts_connect()) return;

  std::vector<uint8_t> request = huoshan_ai_build_tts_request(text);
  if (!huoshan_ai_tts_ws.sendBIN(request.data(), request.size())) {
    huoshan_ai_last_error = "TTS request send failed";
    huoshan_ai_tts_ws.disconnect();
    huoshan_ai_set_state("error");
    return;
  }

  unsigned long waitStart = millis();
  while (!huoshan_ai_tts_done && millis() - waitStart < 120000) {
    huoshan_ai_tts_ws.loop();
    delay(1);
  }
  if (!huoshan_ai_tts_done && huoshan_ai_last_error.length() == 0) {
    huoshan_ai_last_error = "TTS result timeout";
    huoshan_ai_set_state("error");
    huoshan_ai_tts_ws.disconnect();
    return;
  }
  if (disconnectAfter) {
    huoshan_ai_tts_ws.disconnect();
  }
  if (disconnectAfter && (huoshan_ai_last_error.length() == 0 || huoshan_ai_tts_audio_packets > 0)) {
    huoshan_ai_tts_wait_audio_done(120000);
    Serial.printf("[HuoshanAI] TTS audio queued: %u packets, %u bytes, pending=%u, dropped=%u, final=%u\n",
                  (unsigned)huoshan_ai_tts_audio_packets,
                  (unsigned)huoshan_ai_tts_audio_bytes,
                  (unsigned)huoshan_ai_tts_audio_pending,
                  (unsigned)huoshan_ai_tts_audio_dropped,
                  huoshan_ai_tts_final_received ? 1 : 0);
    if (huoshan_ai_last_error.length() == 0 || huoshan_ai_tts_audio_packets > 0) {
      huoshan_ai_last_error = "";
      huoshan_ai_set_state("idle");
    }
  }
}

void huoshan_ai_tts_speak(String text) {
  huoshan_ai_tts_speak_internal(text, true);
}

void huoshan_ai_speak_buffered_sentences(String &buffer) {
  while (true) {
    int endIndex = huoshan_ai_find_sentence_end(buffer);
    if (endIndex <= 0) break;
    String sentence = buffer.substring(0, endIndex);
    buffer = buffer.substring(endIndex);
    sentence.trim();
    if (sentence.length() > 0) huoshan_ai_tts_speak_internal(sentence, false);
  }
}

String huoshan_ai_coze_chat(String input, bool speakReply) {
  huoshan_ai_last_reply_text = "";
  huoshan_ai_last_error = "";
  if (input.length() == 0) return "";
  if (huoshan_ai_coze_token.length() == 0 || huoshan_ai_coze_bot_id.length() == 0) {
    huoshan_ai_last_error = "Coze config missing";
    huoshan_ai_set_state("error");
    return "";
  }
  if (WiFi.status() != WL_CONNECTED) {
    huoshan_ai_last_error = "WiFi not connected";
    huoshan_ai_set_state("error");
    return "";
  }

  huoshan_ai_set_state("thinking");
  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;
  String url = "https://api.coze.cn/v3/chat";
  if (huoshan_ai_conversation_id.length() > 0) {
    url += "?conversation_id=" + huoshan_ai_conversation_id;
  }
  if (!http.begin(client, url)) {
    huoshan_ai_last_error = "Coze HTTP begin failed";
    huoshan_ai_set_state("error");
    return "";
  }
  http.setTimeout(120000);
  http.addHeader("Authorization", "Bearer " + huoshan_ai_coze_token);
  http.addHeader("Content-Type", "application/json");

  JsonDocument doc;
  doc["stream"] = true;
  doc["bot_id"] = huoshan_ai_coze_bot_id;
  doc["user_id"] = huoshan_ai_effective_user_id();
  JsonArray messages = doc["additional_messages"].to<JsonArray>();
  JsonObject msg = messages.add<JsonObject>();
  msg["content_type"] = "text";
  msg["content"] = input;
  msg["role"] = "user";
  String body;
  serializeJson(doc, body);

  int code = http.POST(body);
  if (code <= 0 || code >= 400) {
    huoshan_ai_last_error = "Coze HTTP " + String(code);
    String err = http.getString();
    if (err.length() > 0) {
      int previewLen = err.length() > 240 ? 240 : err.length();
      Serial.println(err.substring(0, previewLen));
    }
    http.end();
    huoshan_ai_set_state("error");
    return "";
  }
  WiFiClient *stream = http.getStreamPtr();
  String ttsBuffer = "";
  String lastEvent = "";
  unsigned long lastData = millis();
  while (http.connected() || stream->available()) {
    if (!stream->available()) {
      if (millis() - lastData > 120000) break;
      delay(10);
      continue;
    }
    String line = stream->readStringUntil('\n');
    line.trim();
    if (line.length() == 0) continue;
    lastData = millis();
    if (line.startsWith("event:")) {
      lastEvent = line;
      if (line == "event:conversation.message.completed" && huoshan_ai_last_reply_text.length() > 0) break;
      continue;
    }
    if (!line.startsWith("data:")) continue;
    String data = line.substring(5);
    data.trim();
    if (data.length() == 0 || data == "[DONE]") continue;
    JsonDocument chunk;
    DeserializationError err = deserializeJson(chunk, data);
    if (err) continue;
    String role = chunk["role"] | "";
    String type = chunk["type"] | "";
    if (role != "assistant" || type != "answer") continue;
    String content = chunk["content"] | "";
    String cid = chunk["conversation_id"] | "";
    if (cid.length() > 0) huoshan_ai_conversation_id = cid;
    if (content.length() > 0) {
      huoshan_ai_last_reply_text += content;
      if (speakReply) {
        ttsBuffer += content;
      }
    }
  }
  http.end();
  if (speakReply) {
    ttsBuffer.trim();
    if (ttsBuffer.length() > 0) {
      huoshan_ai_tts_speak_internal(ttsBuffer, true);
    } else {
      huoshan_ai_tts_ws.disconnect();
    }
  }
  if (huoshan_ai_last_error.length() == 0) huoshan_ai_set_state("idle");
  return huoshan_ai_last_reply_text;
}

void huoshan_ai_stop_listening_and_chat() {
  huoshan_ai_stop_recording();
  size_t recordedSamples = 0;
  if (huoshan_ai_record_mutex != NULL) xSemaphoreTake(huoshan_ai_record_mutex, portMAX_DELAY);
  recordedSamples = huoshan_ai_record_buffer.size();
  if (huoshan_ai_record_mutex != NULL) xSemaphoreGive(huoshan_ai_record_mutex);
  if (recordedSamples == 0) {
    huoshan_ai_last_error = "No recorded audio";
    huoshan_ai_set_state("error");
    return;
  }
  huoshan_ai_set_state("recognizing");
  String text = "";
  if (huoshan_ai_asr_stream_task_handle != NULL) {
    unsigned long waitStart = millis();
    huoshan_ai_asr_stream_finish_requested = true;
    huoshan_ai_asr_stream_finish_ms = waitStart;
    while (huoshan_ai_asr_stream_task_handle != NULL && millis() - waitStart < 20000) {
      delay(10);
    }
    if (huoshan_ai_asr_stream_task_handle != NULL) {
      huoshan_ai_last_error = "ASR stream finish timeout";
      huoshan_ai_asr_ws.disconnect();
      huoshan_ai_asr_stream_task_handle = NULL;
    }
    text = huoshan_ai_last_asr_text;
  } else if (huoshan_ai_last_error.length() == 0) {
    if (huoshan_ai_record_mutex != NULL) xSemaphoreTake(huoshan_ai_record_mutex, portMAX_DELAY);
    text = huoshan_ai_asr_recognize((uint8_t *)huoshan_ai_record_buffer.data(), huoshan_ai_record_buffer.size() * sizeof(int16_t));
    if (huoshan_ai_record_mutex != NULL) xSemaphoreGive(huoshan_ai_record_mutex);
  }
  if (huoshan_ai_record_mutex != NULL) xSemaphoreTake(huoshan_ai_record_mutex, portMAX_DELAY);
  huoshan_ai_record_buffer.clear();
  if (huoshan_ai_record_mutex != NULL) xSemaphoreGive(huoshan_ai_record_mutex);
  if (text.length() == 0) {
    if (huoshan_ai_last_error.length() == 0) huoshan_ai_last_error = "ASR returned empty text";
    huoshan_ai_set_state("error");
    return;
  }
  huoshan_ai_coze_chat(text, true);
}

class HuoshanAIVoiceClass {
public:
  void config(String appId, String doubaoToken, String cozeToken, String cozeBotId, String userId) {
    huoshan_ai_config(appId, doubaoToken, cozeToken, cozeBotId, userId);
  }
  bool connectWiFi(String ssid, String password, uint32_t timeoutMs) {
    return huoshan_ai_connect_wifi(ssid, password, timeoutMs);
  }
  void configMic(i2s_port_t port, int bclk, int ws, int din, int gain, int maxSeconds) {
    huoshan_ai_config_mic(port, bclk, ws, din, gain, maxSeconds);
  }
  void configSpeaker(i2s_port_t port, int bclk, int ws, int dout, double volume) {
    huoshan_ai_config_speaker(port, bclk, ws, dout, volume);
  }
  void begin() { huoshan_ai_begin(); }
  void startListening() { huoshan_ai_start_listening(); }
  void stopListeningAndChat() { huoshan_ai_stop_listening_and_chat(); }
  String sendText(String text, bool speakReply) { return huoshan_ai_coze_chat(text, speakReply); }
  void speak(String text) { huoshan_ai_tts_speak(text); }
  void stopAudio() { huoshan_ai_stop_audio(); }
  void clearConversation() { huoshan_ai_conversation_id = ""; }
  void setVoice(String voice) { huoshan_ai_voice_type = voice; }
  void setVolume(double volume) { huoshan_ai_volume = volume; }
  void setSpeed(double speed) { huoshan_ai_speed = speed; }
  String state() { return huoshan_ai_state; }
  bool isWiFiConnected() { return WiFi.status() == WL_CONNECTED; }
  String lastAsrText() { return huoshan_ai_last_asr_text; }
  String lastReplyText() { return huoshan_ai_last_reply_text; }
  String lastError() { return huoshan_ai_last_error; }
};

HuoshanAIVoiceClass HuoshanAIVoice;
`);
}

function huoshanAiEnsureWiFiLib(generator) {
  const boardConfig = (typeof window !== 'undefined' && window['boardConfig']) ? window['boardConfig'] : null;
  const core = boardConfig && boardConfig.core ? String(boardConfig.core) : '';
  if (core && core.indexOf('esp32') === -1 && typeof console !== 'undefined') {
    console.warn('huoshan-ai-voice requires an ESP32-compatible board.');
  }
  generator.addLibrary('huoshan_ai_wifi', '#include <WiFi.h>');
}

Arduino.forBlock['huoshan_ai_config'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  const appId = generator.valueToCode(block, 'DOUBAO_APP_ID', Arduino.ORDER_ATOMIC) || '""';
  const doubaoToken = generator.valueToCode(block, 'DOUBAO_TOKEN', Arduino.ORDER_ATOMIC) || '""';
  const cozeToken = generator.valueToCode(block, 'COZE_TOKEN', Arduino.ORDER_ATOMIC) || '""';
  const cozeBotId = generator.valueToCode(block, 'COZE_BOT_ID', Arduino.ORDER_ATOMIC) || '""';
  const userId = generator.valueToCode(block, 'USER_ID', Arduino.ORDER_ATOMIC) || '""';
  return `HuoshanAIVoice.config(${appId}, ${doubaoToken}, ${cozeToken}, ${cozeBotId}, ${userId});\n`;
};

Arduino.forBlock['huoshan_ai_wifi_connect'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  const ssid = generator.valueToCode(block, 'SSID', Arduino.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', Arduino.ORDER_ATOMIC) || '""';
  const timeout = generator.valueToCode(block, 'TIMEOUT', Arduino.ORDER_ATOMIC) || '20000';
  return `HuoshanAIVoice.connectWiFi(${ssid}, ${password}, ${timeout});\n`;
};

Arduino.forBlock['huoshan_ai_mic_config'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  const port = block.getFieldValue('PORT') || 'I2S_NUM_1';
  const bclk = generator.valueToCode(block, 'BCLK', Arduino.ORDER_ATOMIC) || '42';
  const ws = generator.valueToCode(block, 'WS', Arduino.ORDER_ATOMIC) || '2';
  const din = generator.valueToCode(block, 'DIN', Arduino.ORDER_ATOMIC) || '1';
  const gain = generator.valueToCode(block, 'GAIN', Arduino.ORDER_ATOMIC) || '8';
  const maxSeconds = generator.valueToCode(block, 'MAX_SECONDS', Arduino.ORDER_ATOMIC) || '15';
  return `HuoshanAIVoice.configMic(${port}, ${bclk}, ${ws}, ${din}, ${gain}, ${maxSeconds});\n`;
};

Arduino.forBlock['huoshan_ai_speaker_config'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  const port = block.getFieldValue('PORT') || 'I2S_NUM_0';
  const bclk = generator.valueToCode(block, 'BCLK', Arduino.ORDER_ATOMIC) || '39';
  const ws = generator.valueToCode(block, 'WS', Arduino.ORDER_ATOMIC) || '40';
  const dout = generator.valueToCode(block, 'DOUT', Arduino.ORDER_ATOMIC) || '38';
  const volume = generator.valueToCode(block, 'VOLUME', Arduino.ORDER_ATOMIC) || '0.9';
  return `HuoshanAIVoice.configSpeaker(${port}, ${bclk}, ${ws}, ${dout}, ${volume});\n`;
};

Arduino.forBlock['huoshan_ai_begin'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  return 'HuoshanAIVoice.begin();\n';
};

Arduino.forBlock['huoshan_ai_start_listening'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  return 'HuoshanAIVoice.startListening();\n';
};

Arduino.forBlock['huoshan_ai_stop_listening_and_chat'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  return 'HuoshanAIVoice.stopListeningAndChat();\n';
};

Arduino.forBlock['huoshan_ai_send_text'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  const speak = block.getFieldValue('SPEAK') || 'true';
  return `HuoshanAIVoice.sendText(${text}, ${speak});\n`;
};

Arduino.forBlock['huoshan_ai_tts_speak'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  return `HuoshanAIVoice.speak(${text});\n`;
};

Arduino.forBlock['huoshan_ai_stop_audio'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  return 'HuoshanAIVoice.stopAudio();\n';
};

Arduino.forBlock['huoshan_ai_clear_conversation'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  return 'HuoshanAIVoice.clearConversation();\n';
};

Arduino.forBlock['huoshan_ai_set_voice'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  const voice = JSON.stringify(block.getFieldValue('VOICE') || 'zh_female_wanwanxiaohe_moon_bigtts');
  return `HuoshanAIVoice.setVoice(${voice});\n`;
};

Arduino.forBlock['huoshan_ai_set_volume'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  const volume = generator.valueToCode(block, 'VOLUME', Arduino.ORDER_ATOMIC) || '0.9';
  return `HuoshanAIVoice.setVolume(${volume});\n`;
};

Arduino.forBlock['huoshan_ai_set_speed'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  const speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC) || '1.0';
  return `HuoshanAIVoice.setSpeed(${speed});\n`;
};

Arduino.forBlock['huoshan_ai_get_state'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  return ['HuoshanAIVoice.state()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['huoshan_ai_is_wifi_connected'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  return ['HuoshanAIVoice.isWiFiConnected()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['huoshan_ai_get_last_asr_text'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  return ['HuoshanAIVoice.lastAsrText()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['huoshan_ai_get_last_reply_text'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  return ['HuoshanAIVoice.lastReplyText()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['huoshan_ai_get_last_error'] = function(block, generator) {
  huoshanAiEnsureRuntime(generator);
  return ['HuoshanAIVoice.lastError()', Arduino.ORDER_FUNCTION_CALL];
};
