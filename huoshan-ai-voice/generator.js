// Huoshan AI Voice generator for Aily Blockly.

const HUOSHAN_AI_SCREEN_DEFAULTS = {
  width: '240',
  height: '320',
  rotation: 'LV_DISPLAY_ROTATION_0',
  brightness: '80',
  bl: '8',
  miso: '15',
  mosi: '17',
  sclk: '16',
  cs: '5',
  dc: '7',
  rst: '6',
  touchSda: '10',
  touchScl: '13',
  touchRst: '9',
  touchInt: '12'
};

const HUOSHAN_AI_SCREEN_PROJECT_MACRO_NAMES = [
  'HUOSHAN_AI_SCREEN_ENABLED',
  'HUOSHAN_AI_SCREEN_WIDTH',
  'HUOSHAN_AI_SCREEN_HEIGHT',
  'HUOSHAN_AI_SCREEN_ROTATION',
  'HUOSHAN_AI_SCREEN_BL',
  'HUOSHAN_AI_SCREEN_TOUCH_SDA',
  'HUOSHAN_AI_SCREEN_TOUCH_SCL',
  'HUOSHAN_AI_SCREEN_TOUCH_RST',
  'HUOSHAN_AI_SCREEN_TOUCH_INT',
  'HUOSHAN_AI_STATUS_BAR_HEIGHT',
  'HUOSHAN_AI_SPEAK_BUTTON_HEIGHT',
  'HUOSHAN_AI_SYMBOL_MIC',
  'ST7789_DRIVER',
  'TFT_WIDTH',
  'TFT_HEIGHT',
  'TFT_INVERSION_OFF',
  'TFT_RGB_ORDER',
  'TFT_BL',
  'TFT_BACKLIGHT_ON',
  'TFT_MISO',
  'TFT_MOSI',
  'TFT_SCLK',
  'TFT_CS',
  'TFT_DC',
  'TFT_RST',
  'TOUCH_CS',
  'SPI_FREQUENCY',
  'TFT_FREQUENCY',
  'USE_HSPI_PORT',
  'LV_CONF_INCLUDE_SIMPLE',
  'LV_LVGL_H_INCLUDE_SIMPLE',
  'LV_USE_TFT_ESPI',
  'LV_FONT_SOURCE_HAN_SANS_SC_14_CJK',
  'LV_FONT_FMT_TXT_LARGE'
];

let huoshanAiProjectMacroPromise = null;

function huoshanAiQueueProjectMacro(action, label) {
  if (typeof window === 'undefined' || !window['projectService']) return;
  const service = window['projectService'];
  if (typeof action !== 'function') return;
  if (!huoshanAiProjectMacroPromise) huoshanAiProjectMacroPromise = Promise.resolve();
  huoshanAiProjectMacroPromise = huoshanAiProjectMacroPromise
    .then(() => action(service))
    .catch(err => {
      if (typeof console !== 'undefined') console.error('huoshan-ai-voice macro failed:', label, err);
    });
}

function huoshanAiAddProjectMacro(macro) {
  huoshanAiQueueProjectMacro(service => {
    if (service.addMacro) return service.addMacro(macro);
    return null;
  }, macro);
}

function huoshanAiRemoveProjectMacro(name) {
  huoshanAiQueueProjectMacro(service => {
    if (service.removeMacro) return service.removeMacro(name);
    return null;
  }, name);
}

function huoshanAiScreenField(block, name, fallback) {
  const value = block.getFieldValue(name);
  return String(value === null || value === undefined || value === '' ? fallback : value);
}

function huoshanAiAddScreenMacros(generator, config) {
  const next = Object.assign({}, HUOSHAN_AI_SCREEN_DEFAULTS, config || {});
  Arduino.huoshan_ai_screen_config = next;
  Arduino.huoshan_ai_screen_configured = true;

  HUOSHAN_AI_SCREEN_PROJECT_MACRO_NAMES.forEach(huoshanAiRemoveProjectMacro);

  generator.addMacro('HUOSHAN_AI_SCREEN_ENABLED', '#define HUOSHAN_AI_SCREEN_ENABLED 1');
  generator.addMacro('HUOSHAN_AI_SCREEN_WIDTH', `#define HUOSHAN_AI_SCREEN_WIDTH ${next.width}`);
  generator.addMacro('HUOSHAN_AI_SCREEN_HEIGHT', `#define HUOSHAN_AI_SCREEN_HEIGHT ${next.height}`);
  generator.addMacro('HUOSHAN_AI_SCREEN_ROTATION', `#define HUOSHAN_AI_SCREEN_ROTATION ${next.rotation}`);
  generator.addMacro('HUOSHAN_AI_SCREEN_BL', `#define HUOSHAN_AI_SCREEN_BL ${next.bl}`);
  generator.addMacro('HUOSHAN_AI_SCREEN_TOUCH_SDA', `#define HUOSHAN_AI_SCREEN_TOUCH_SDA ${next.touchSda}`);
  generator.addMacro('HUOSHAN_AI_SCREEN_TOUCH_SCL', `#define HUOSHAN_AI_SCREEN_TOUCH_SCL ${next.touchScl}`);
  generator.addMacro('HUOSHAN_AI_SCREEN_TOUCH_RST', `#define HUOSHAN_AI_SCREEN_TOUCH_RST ${next.touchRst}`);
  generator.addMacro('HUOSHAN_AI_SCREEN_TOUCH_INT', `#define HUOSHAN_AI_SCREEN_TOUCH_INT ${next.touchInt}`);
  generator.addMacro('ST7789_DRIVER', '#define ST7789_DRIVER 1');
  generator.addMacro('TFT_WIDTH', `#define TFT_WIDTH ${next.width}`);
  generator.addMacro('TFT_HEIGHT', `#define TFT_HEIGHT ${next.height}`);
  generator.addMacro('TFT_INVERSION_OFF', '#define TFT_INVERSION_OFF');
  generator.addMacro('TFT_RGB_ORDER', '#define TFT_RGB_ORDER TFT_BGR');
  generator.addMacro('TFT_BL', `#define TFT_BL ${next.bl}`);
  generator.addMacro('TFT_BACKLIGHT_ON', '#define TFT_BACKLIGHT_ON HIGH');
  generator.addMacro('TFT_MISO', `#define TFT_MISO ${next.miso}`);
  generator.addMacro('TFT_MOSI', `#define TFT_MOSI ${next.mosi}`);
  generator.addMacro('TFT_SCLK', `#define TFT_SCLK ${next.sclk}`);
  generator.addMacro('TFT_CS', `#define TFT_CS ${next.cs}`);
  generator.addMacro('TFT_DC', `#define TFT_DC ${next.dc}`);
  generator.addMacro('TFT_RST', `#define TFT_RST ${next.rst}`);
  generator.addMacro('TOUCH_CS', '#define TOUCH_CS -1');
  generator.addMacro('SPI_FREQUENCY', '#define SPI_FREQUENCY 27000000');
  generator.addMacro('TFT_FREQUENCY', '#define TFT_FREQUENCY 27000000');
  generator.addMacro('USE_HSPI_PORT', '#define USE_HSPI_PORT');
  generator.addMacro('LV_CONF_INCLUDE_SIMPLE', '#define LV_CONF_INCLUDE_SIMPLE');
  generator.addMacro('LV_LVGL_H_INCLUDE_SIMPLE', '#define LV_LVGL_H_INCLUDE_SIMPLE');
  generator.addMacro('LV_USE_TFT_ESPI', '#define LV_USE_TFT_ESPI 1');
  generator.addMacro('LV_FONT_FMT_TXT_LARGE', '#define LV_FONT_FMT_TXT_LARGE 1');

  [
    'HUOSHAN_AI_SCREEN_ENABLED=1',
    `HUOSHAN_AI_SCREEN_WIDTH=${next.width}`,
    `HUOSHAN_AI_SCREEN_HEIGHT=${next.height}`,
    `HUOSHAN_AI_SCREEN_ROTATION=${next.rotation}`,
    `HUOSHAN_AI_SCREEN_BL=${next.bl}`,
    `HUOSHAN_AI_SCREEN_TOUCH_SDA=${next.touchSda}`,
    `HUOSHAN_AI_SCREEN_TOUCH_SCL=${next.touchScl}`,
    `HUOSHAN_AI_SCREEN_TOUCH_RST=${next.touchRst}`,
    `HUOSHAN_AI_SCREEN_TOUCH_INT=${next.touchInt}`,
    'ST7789_DRIVER=1',
    `TFT_WIDTH=${next.width}`,
    `TFT_HEIGHT=${next.height}`,
    'TFT_INVERSION_OFF',
    'TFT_RGB_ORDER=TFT_BGR',
    `TFT_BL=${next.bl}`,
    'TFT_BACKLIGHT_ON=HIGH',
    `TFT_MISO=${next.miso}`,
    `TFT_MOSI=${next.mosi}`,
    `TFT_SCLK=${next.sclk}`,
    `TFT_CS=${next.cs}`,
    `TFT_DC=${next.dc}`,
    `TFT_RST=${next.rst}`,
    'TOUCH_CS=-1',
    'SPI_FREQUENCY=27000000',
    'TFT_FREQUENCY=27000000',
    'USE_HSPI_PORT',
    'LV_CONF_INCLUDE_SIMPLE',
    'LV_LVGL_H_INCLUDE_SIMPLE',
    'LV_USE_TFT_ESPI=1',
    'LV_FONT_FMT_TXT_LARGE=1'
  ].forEach(huoshanAiAddProjectMacro);
}

function huoshanAiEnsureScreenConfigured(generator) {
  if (!Arduino.huoshan_ai_screen_configured) {
    huoshanAiAddScreenMacros(generator, HUOSHAN_AI_SCREEN_DEFAULTS);
  }
}

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
  generator.addLibrary('huoshan_ai_ringbuf', '#include <freertos/ringbuf.h>');
  generator.addLibrary('huoshan_ai_task', '#include <freertos/task.h>');
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
static const size_t HUOSHAN_AI_CAPTURE_FRAME_BYTES = 320;
// Keep the full WebSocket payload below the library's 1400-byte single-write path.
static const size_t HUOSHAN_AI_ASR_PACKET_BYTES = 1280;
static const size_t HUOSHAN_AI_ASR_RING_BYTES = 512 * 1024;
static const size_t HUOSHAN_AI_ASR_RING_FALLBACK_BYTES = 32 * 1024;
static const uint8_t HUOSHAN_AI_ASR_FULL_UPLOAD_ATTEMPTS = 2;
static const uint8_t HUOSHAN_AI_ASR_PACKET_YIELD_MS = 10;
static const uint8_t HUOSHAN_AI_TTS_WS_ATTEMPTS = 2;
static const uint8_t HUOSHAN_AI_TTS_PREBUFFER_PACKETS = 3;
static const bool HUOSHAN_AI_VERBOSE_LOG = false;

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
int huoshan_ai_mic_gain = 4;
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
size_t huoshan_ai_record_clipped_samples = 0;
int16_t huoshan_ai_record_min_sample = INT16_MAX;
int16_t huoshan_ai_record_max_sample = INT16_MIN;
unsigned long huoshan_ai_record_start_ms = 0;
volatile bool huoshan_ai_asr_stream_finish_requested = false;
volatile bool huoshan_ai_asr_stream_started = false;
volatile bool huoshan_ai_asr_retry_full_pending = false;
volatile bool huoshan_ai_asr_request_active = false;
size_t huoshan_ai_asr_stream_samples_sent = 0;
uint32_t huoshan_ai_asr_stream_packets_sent = 0;
uint32_t huoshan_ai_asr_stream_dropped_packets = 0;
uint32_t huoshan_ai_asr_send_total_ms = 0;
uint32_t huoshan_ai_asr_send_max_ms = 0;
unsigned long huoshan_ai_asr_stream_finish_ms = 0;
RingbufHandle_t huoshan_ai_asr_ring_buffer = NULL;
size_t huoshan_ai_asr_ring_bytes = 0;
uint32_t huoshan_ai_asr_reconnect_count = 0;
bool huoshan_ai_asr_client_started = false;
std::vector<uint8_t> huoshan_ai_asr_fragment_buffer;
bool huoshan_ai_asr_fragment_active = false;

WebSocketsClient huoshan_ai_asr_ws;
WebSocketsClient huoshan_ai_tts_ws;
String huoshan_ai_asr_headers = "";
String huoshan_ai_tts_headers = "";
volatile bool huoshan_ai_asr_done = false;
volatile bool huoshan_ai_tts_done = false;
QueueHandle_t huoshan_ai_tts_audio_queue = NULL;
TaskHandle_t huoshan_ai_tts_audio_task_handle = NULL;
TaskHandle_t huoshan_ai_tts_connect_task_handle = NULL;
volatile uint32_t huoshan_ai_tts_audio_pending = 0;
uint32_t huoshan_ai_tts_audio_packets = 0;
uint32_t huoshan_ai_tts_audio_dropped = 0;
uint32_t huoshan_ai_tts_audio_bytes = 0;
uint32_t huoshan_ai_tts_audio_underruns = 0;
uint32_t huoshan_ai_tts_request_packet_start = 0;
bool huoshan_ai_tts_final_received = false;
volatile bool huoshan_ai_tts_request_active = false;
bool huoshan_ai_tts_sequence_active = false;
volatile bool huoshan_ai_tts_sequence_input_done = true;
bool huoshan_ai_tts_playback_primed = false;
uint32_t huoshan_ai_tts_reconnect_count = 0;
unsigned long huoshan_ai_tts_request_start_ms = 0;
unsigned long huoshan_ai_tts_first_audio_ms = 0;
std::vector<uint8_t> huoshan_ai_tts_fragment_buffer;
bool huoshan_ai_tts_fragment_active = false;

void huoshan_ai_asr_stream_task(void *arg);
void huoshan_ai_tts_audio_task(void *arg);
void huoshan_ai_tts_connect_task(void *arg);
void huoshan_ai_screen_on_state(const String &state);
void huoshan_ai_screen_on_user_text(const String &text);
void huoshan_ai_screen_on_reply_text(const String &text);
void huoshan_ai_screen_config(int width, int height, int brightness);
bool huoshan_ai_screen_begin(bool touchToTalk, bool autoMessages);
void huoshan_ai_screen_set_brightness(int brightness);
void huoshan_ai_screen_set_status(String text);
void huoshan_ai_screen_add_message(String role, String text);
void huoshan_ai_screen_clear_messages();

#if !defined(HUOSHAN_AI_SCREEN_ENABLED) || !HUOSHAN_AI_SCREEN_ENABLED
void huoshan_ai_screen_on_state(const String &state) {}
void huoshan_ai_screen_on_user_text(const String &text) {}
void huoshan_ai_screen_on_reply_text(const String &text) {}
void huoshan_ai_screen_config(int width, int height, int brightness) {}
bool huoshan_ai_screen_begin(bool touchToTalk, bool autoMessages) { return false; }
void huoshan_ai_screen_set_brightness(int brightness) {}
void huoshan_ai_screen_set_status(String text) {}
void huoshan_ai_screen_add_message(String role, String text) {}
void huoshan_ai_screen_clear_messages() {}
#endif

void huoshan_ai_set_state(const String &state) {
  if (huoshan_ai_state == state) return;
  huoshan_ai_state = state;
  Serial.println("[HuoshanAI] state: " + state);
  huoshan_ai_screen_on_state(state);
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

void huoshan_ai_asr_disconnect() {
  huoshan_ai_asr_request_active = false;
  huoshan_ai_asr_ws.disconnect();
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

bool huoshan_ai_has_readable_text(const String &input) {
  const uint8_t *bytes = (const uint8_t *)input.c_str();
  size_t length = input.length();
  size_t offset = 0;
  while (offset < length) {
    uint32_t codepoint = 0;
    uint8_t first = bytes[offset];
    if (first < 0x80) {
      codepoint = first;
      offset++;
    } else if ((first & 0xE0) == 0xC0 && offset + 1 < length) {
      codepoint = ((uint32_t)(first & 0x1F) << 6)
          | (uint32_t)(bytes[offset + 1] & 0x3F);
      offset += 2;
    } else if ((first & 0xF0) == 0xE0 && offset + 2 < length) {
      codepoint = ((uint32_t)(first & 0x0F) << 12)
          | ((uint32_t)(bytes[offset + 1] & 0x3F) << 6)
          | (uint32_t)(bytes[offset + 2] & 0x3F);
      offset += 3;
    } else if ((first & 0xF8) == 0xF0 && offset + 3 < length) {
      codepoint = ((uint32_t)(first & 0x07) << 18)
          | ((uint32_t)(bytes[offset + 1] & 0x3F) << 12)
          | ((uint32_t)(bytes[offset + 2] & 0x3F) << 6)
          | (uint32_t)(bytes[offset + 3] & 0x3F);
      offset += 4;
    } else {
      offset++;
      continue;
    }

    bool asciiAlphaNumeric = (codepoint >= '0' && codepoint <= '9')
        || (codepoint >= 'A' && codepoint <= 'Z')
        || (codepoint >= 'a' && codepoint <= 'z');
    bool latinExtended = codepoint >= 0x00C0 && codepoint <= 0x02AF;
    bool japanese = codepoint >= 0x3040 && codepoint <= 0x30FF;
    bool cjk = (codepoint >= 0x3400 && codepoint <= 0x4DBF)
        || (codepoint >= 0x4E00 && codepoint <= 0x9FFF);
    bool korean = codepoint >= 0xAC00 && codepoint <= 0xD7AF;
    if (asciiAlphaNumeric || latinExtended || japanese || cjk || korean) return true;
  }
  return false;
}

void huoshan_ai_config(String appId, String doubaoToken, String cozeToken, String cozeBotId, String userId) {
  bool doubaoConfigChanged = huoshan_ai_doubao_token != doubaoToken;
  huoshan_ai_doubao_app_id = appId;
  huoshan_ai_doubao_token = doubaoToken;
  huoshan_ai_coze_token = cozeToken;
  huoshan_ai_coze_bot_id = cozeBotId;
  huoshan_ai_user_id = userId;
  if (doubaoConfigChanged) {
    huoshan_ai_asr_client_started = false;
    huoshan_ai_asr_disconnect();
  }
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
  WiFi.useStaticBuffers(true);
  WiFi.persistent(false);
  WiFi.setAutoReconnect(true);
  WiFi.mode(WIFI_STA);
  WiFi.setSleep(false);
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
  if (HUOSHAN_AI_VERBOSE_LOG) {
    Serial.println("[HuoshanAI] WiFi static buffers: on, auto reconnect: on, power save: off");
  }
  return true;
}

void huoshan_ai_config_mic(i2s_port_t port, int bclk, int ws, int din, int gain, int maxSeconds) {
  huoshan_ai_uninstall_mic_driver();
  huoshan_ai_mic_port = port;
  huoshan_ai_mic_bclk = bclk;
  huoshan_ai_mic_ws = ws;
  huoshan_ai_mic_din = din;
  huoshan_ai_mic_gain = gain < 1 ? 1 : (gain > 16 ? 16 : gain);
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
    huoshan_ai_tts_audio_queue = xQueueCreate(80, sizeof(HuoshanAITtsAudioTask));
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
    if (!huoshan_ai_tts_playback_primed) {
      UBaseType_t queuedPackets = uxQueueMessagesWaiting(huoshan_ai_tts_audio_queue);
      bool hasPrebuffer = queuedPackets >= HUOSHAN_AI_TTS_PREBUFFER_PACKETS;
      if (queuedPackets == 0
          || (!hasPrebuffer && !huoshan_ai_tts_sequence_input_done)) {
        vTaskDelay(pdMS_TO_TICKS(2));
        continue;
      }
      huoshan_ai_tts_playback_primed = true;
      if (HUOSHAN_AI_VERBOSE_LOG) {
        Serial.printf("[HuoshanAI] TTS playback primed: %u packets\n",
                      (unsigned)queuedPackets);
      }
    }
    if (xQueueReceive(huoshan_ai_tts_audio_queue, &task, portMAX_DELAY) == pdTRUE) {
      if (task.data != NULL && task.bytes > 0) {
        huoshan_ai_play_pcm16((const uint8_t *)task.data, task.bytes);
        free(task.data);
      }
      if (huoshan_ai_tts_audio_pending > 0) huoshan_ai_tts_audio_pending--;
      if (uxQueueMessagesWaiting(huoshan_ai_tts_audio_queue) == 0) {
        if (huoshan_ai_tts_sequence_active && !huoshan_ai_tts_sequence_input_done) {
          huoshan_ai_tts_audio_underruns++;
        }
        huoshan_ai_tts_playback_primed = false;
      }
    }
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
  if (xQueueSend(huoshan_ai_tts_audio_queue, &task, pdMS_TO_TICKS(500)) != pdTRUE) {
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
  huoshan_ai_tts_sequence_input_done = true;
  huoshan_ai_tts_playback_primed = false;
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

bool huoshan_ai_asr_should_retry_full() {
  return huoshan_ai_asr_retry_full_pending
      || huoshan_ai_last_error == "ASR connect timeout"
      || huoshan_ai_last_error == "ASR header send failed"
      || huoshan_ai_last_error == "ASR ring buffer send failed"
      || huoshan_ai_last_error == "ASR audio send failed"
      || huoshan_ai_last_error == "ASR final packet send failed"
      || huoshan_ai_last_error == "ASR websocket disconnected"
      || huoshan_ai_last_error == "ASR result timeout";
}

bool huoshan_ai_asr_is_retryable_error() {
  return huoshan_ai_last_error == "ASR connect timeout"
      || huoshan_ai_last_error == "ASR header send failed"
      || huoshan_ai_last_error == "ASR audio send failed"
      || huoshan_ai_last_error == "ASR final packet send failed"
      || huoshan_ai_last_error == "ASR websocket disconnected"
      || huoshan_ai_last_error == "ASR result timeout";
}

void huoshan_ai_asr_drain_ring_buffer() {
  if (huoshan_ai_asr_ring_buffer == NULL) return;
  size_t itemSize = 0;
  void *item = NULL;
  while ((item = xRingbufferReceive(huoshan_ai_asr_ring_buffer, &itemSize, 0)) != NULL) {
    vRingbufferReturnItem(huoshan_ai_asr_ring_buffer, item);
  }
}

bool huoshan_ai_asr_init_audio_ring() {
  if (huoshan_ai_asr_ring_buffer == NULL) {
#if defined(BOARD_HAS_PSRAM)
    huoshan_ai_asr_ring_buffer = xRingbufferCreateWithCaps(
        HUOSHAN_AI_ASR_RING_BYTES,
        RINGBUF_TYPE_BYTEBUF,
        MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    if (huoshan_ai_asr_ring_buffer != NULL) {
      huoshan_ai_asr_ring_bytes = HUOSHAN_AI_ASR_RING_BYTES;
    }
#endif
    if (huoshan_ai_asr_ring_buffer == NULL) {
      huoshan_ai_asr_ring_buffer = xRingbufferCreate(
          HUOSHAN_AI_ASR_RING_FALLBACK_BYTES,
          RINGBUF_TYPE_BYTEBUF);
      if (huoshan_ai_asr_ring_buffer != NULL) {
        huoshan_ai_asr_ring_bytes = HUOSHAN_AI_ASR_RING_FALLBACK_BYTES;
      }
    }
    if (huoshan_ai_asr_ring_buffer != NULL) {
      if (HUOSHAN_AI_VERBOSE_LOG) {
        Serial.printf("[HuoshanAI] ASR ring buffer: %u bytes\n", (unsigned)huoshan_ai_asr_ring_bytes);
      }
    }
  }
  if (huoshan_ai_asr_ring_buffer == NULL) return false;
  huoshan_ai_asr_drain_ring_buffer();
  return true;
}

void huoshan_ai_asr_drain_while_recording() {
  while (huoshan_ai_recording) {
    size_t itemSize = 0;
    void *item = xRingbufferReceive(
        huoshan_ai_asr_ring_buffer,
        &itemSize,
        pdMS_TO_TICKS(100));
    if (item != NULL) {
      vRingbufferReturnItem(huoshan_ai_asr_ring_buffer, item);
    }
    vTaskDelay(1);
  }
  huoshan_ai_asr_drain_ring_buffer();
}

void huoshan_ai_record_task(void *arg) {
  if (HUOSHAN_AI_VERBOSE_LOG) {
    Serial.printf("[HuoshanAI] record task: core=%d priority=%u\n",
                  (int)xPortGetCoreID(),
                  (unsigned)uxTaskPriorityGet(NULL));
  }
  int16_t buffer[160];
  size_t bytesRead = 0;
  const size_t maxSamples = (size_t)16000 * (size_t)huoshan_ai_max_record_seconds;
  while (huoshan_ai_recording) {
    esp_err_t err = i2s_read(huoshan_ai_mic_port, buffer, HUOSHAN_AI_CAPTURE_FRAME_BYTES, &bytesRead, portMAX_DELAY);
    if (err == ESP_OK && bytesRead > 0) {
      size_t samples = bytesRead / sizeof(int16_t);
      for (size_t i = 0; i < samples; i++) {
        int32_t amplified = (int32_t)buffer[i] * huoshan_ai_mic_gain;
        if (amplified > INT16_MAX) {
          amplified = INT16_MAX;
          huoshan_ai_record_clipped_samples++;
        } else if (amplified < INT16_MIN) {
          amplified = INT16_MIN;
          huoshan_ai_record_clipped_samples++;
        }
        int16_t sample = (int16_t)amplified;
        buffer[i] = sample;
        uint32_t absSample = sample < 0 ? (uint32_t)(-(int32_t)sample) : (uint32_t)sample;
        if (absSample > huoshan_ai_record_peak_abs) huoshan_ai_record_peak_abs = absSample;
        huoshan_ai_record_abs_sum += absSample;
        huoshan_ai_record_sample_count++;
        if (sample < huoshan_ai_record_min_sample) huoshan_ai_record_min_sample = sample;
        if (sample > huoshan_ai_record_max_sample) huoshan_ai_record_max_sample = sample;
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
      if (huoshan_ai_asr_ring_buffer != NULL
          && xRingbufferSend(huoshan_ai_asr_ring_buffer, buffer, bytesRead, 0) != pdTRUE) {
        huoshan_ai_asr_stream_dropped_packets++;
        huoshan_ai_asr_retry_full_pending = true;
      }
      if (bufferFull) {
        huoshan_ai_recording = false;
      }
    }
  }
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
  bool asrRingReady = huoshan_ai_asr_init_audio_ring();
  if (huoshan_ai_record_mutex != NULL) xSemaphoreTake(huoshan_ai_record_mutex, portMAX_DELAY);
  huoshan_ai_record_buffer.clear();
  huoshan_ai_record_buffer.reserve(16000 * huoshan_ai_max_record_seconds);
  if (huoshan_ai_record_mutex != NULL) xSemaphoreGive(huoshan_ai_record_mutex);
  huoshan_ai_record_peak_abs = 0;
  huoshan_ai_record_abs_sum = 0;
  huoshan_ai_record_sample_count = 0;
  huoshan_ai_record_clipped_samples = 0;
  huoshan_ai_record_min_sample = INT16_MAX;
  huoshan_ai_record_max_sample = INT16_MIN;
  huoshan_ai_asr_stream_finish_requested = false;
  huoshan_ai_asr_stream_started = false;
  huoshan_ai_asr_retry_full_pending = false;
  huoshan_ai_asr_stream_samples_sent = 0;
  huoshan_ai_asr_stream_packets_sent = 0;
  huoshan_ai_asr_stream_dropped_packets = 0;
  huoshan_ai_asr_send_total_ms = 0;
  huoshan_ai_asr_send_max_ms = 0;
  huoshan_ai_asr_reconnect_count = 0;
  huoshan_ai_asr_stream_finish_ms = 0;
  huoshan_ai_last_error = "";
  i2s_zero_dma_buffer(huoshan_ai_mic_port);
  huoshan_ai_record_start_ms = millis();
  huoshan_ai_recording = true;
  huoshan_ai_last_asr_text = "";
  huoshan_ai_last_reply_text = "";
  huoshan_ai_set_state("listening");
  xTaskCreate(
      huoshan_ai_record_task,
      "huoshanRecord",
      4096,
      NULL,
      1,
      &huoshan_ai_record_task_handle);
  if (asrRingReady) {
    xTaskCreate(
        huoshan_ai_asr_stream_task,
        "huoshanASR",
        16384,
        NULL,
        1,
        &huoshan_ai_asr_stream_task_handle);
  } else {
    Serial.println("[HuoshanAI] warning: ASR ring buffer unavailable, fallback to upload after recording");
  }
}

void huoshan_ai_stop_recording() {
  unsigned long stopRequestMs = millis();
  huoshan_ai_recording = false;
  unsigned long start = millis();
  while (huoshan_ai_record_task_handle != NULL && millis() - start < 2000) {
    delay(10);
  }
  uint32_t avgAbs = huoshan_ai_record_sample_count > 0 ? (uint32_t)(huoshan_ai_record_abs_sum / huoshan_ai_record_sample_count) : 0;
  uint32_t clippedPermille = huoshan_ai_record_sample_count > 0
      ? (uint32_t)(((uint64_t)huoshan_ai_record_clipped_samples * 1000ULL) / huoshan_ai_record_sample_count)
      : 0;
  uint32_t recordDurationMs = huoshan_ai_record_start_ms > 0
      ? (uint32_t)(stopRequestMs - huoshan_ai_record_start_ms)
      : 0;
  uint32_t expectedSamples = (uint32_t)(((uint64_t)recordDurationMs * 16000ULL) / 1000ULL);
  uint32_t capturePermille = expectedSamples > 0
      ? (uint32_t)(((uint64_t)huoshan_ai_record_sample_count * 1000ULL) / expectedSamples)
      : 0;
  size_t recordedSamples = 0;
  if (huoshan_ai_record_mutex != NULL) xSemaphoreTake(huoshan_ai_record_mutex, portMAX_DELAY);
  recordedSamples = huoshan_ai_record_buffer.size();
  if (huoshan_ai_record_mutex != NULL) xSemaphoreGive(huoshan_ai_record_mutex);
  if (HUOSHAN_AI_VERBOSE_LOG) {
    Serial.printf("[HuoshanAI] recorded samples: %u, bytes: %u, duration=%u ms, capture=%u.%u%%, peak=%u, avgAbs=%u, min=%d, max=%d, clipped=%u.%u%%\n",
                  (unsigned)recordedSamples,
                  (unsigned)(recordedSamples * sizeof(int16_t)),
                  (unsigned)recordDurationMs,
                  (unsigned)(capturePermille / 10),
                  (unsigned)(capturePermille % 10),
                  (unsigned)huoshan_ai_record_peak_abs,
                  (unsigned)avgAbs,
                  (int)huoshan_ai_record_min_sample,
                  (int)huoshan_ai_record_max_sample,
                  (unsigned)(clippedPermille / 10),
                  (unsigned)(clippedPermille % 10));
  }
  if (huoshan_ai_record_sample_count > 0 && huoshan_ai_record_peak_abs < 128) {
    Serial.println("[HuoshanAI] warning: recorded audio is nearly silent");
  }
  if (capturePermille < 900) {
    Serial.println("[HuoshanAI] warning: recording capture is incomplete");
  }
  if (clippedPermille >= 10) {
    Serial.println("[HuoshanAI] warning: microphone audio is clipping; reduce mic gain");
  }
}

void huoshan_ai_asr_event(WStype_t type, uint8_t *payload, size_t length) {
  if (type == WStype_ERROR || type == WStype_DISCONNECTED) {
    huoshan_ai_asr_fragment_buffer.clear();
    huoshan_ai_asr_fragment_active = false;
    if (!huoshan_ai_asr_done && huoshan_ai_asr_request_active) {
      if (huoshan_ai_last_asr_text.length() > 0) {
        huoshan_ai_last_error = "";
      } else {
        huoshan_ai_last_error = "ASR websocket disconnected";
        huoshan_ai_asr_retry_full_pending = huoshan_ai_asr_stream_started;
      }
      huoshan_ai_asr_done = true;
    }
    huoshan_ai_asr_request_active = false;
    return;
  }

  if (type == WStype_FRAGMENT_BIN_START) {
    huoshan_ai_asr_fragment_buffer.clear();
    huoshan_ai_asr_fragment_buffer.reserve(length + 4096);
    if (payload != NULL && length > 0) {
      huoshan_ai_asr_fragment_buffer.insert(
          huoshan_ai_asr_fragment_buffer.end(),
          payload,
          payload + length);
    }
    huoshan_ai_asr_fragment_active = true;
    return;
  }
  if (type == WStype_FRAGMENT) {
    if (huoshan_ai_asr_fragment_active && payload != NULL && length > 0) {
      huoshan_ai_asr_fragment_buffer.insert(
          huoshan_ai_asr_fragment_buffer.end(),
          payload,
          payload + length);
    }
    return;
  }
  if (type == WStype_FRAGMENT_FIN) {
    if (!huoshan_ai_asr_fragment_active) return;
    if (payload != NULL && length > 0) {
      huoshan_ai_asr_fragment_buffer.insert(
          huoshan_ai_asr_fragment_buffer.end(),
          payload,
          payload + length);
    }
    huoshan_ai_asr_fragment_active = false;
    payload = huoshan_ai_asr_fragment_buffer.data();
    length = huoshan_ai_asr_fragment_buffer.size();
    type = WStype_BIN;
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
        if (sequence < 0 && text.length() > 0) huoshan_ai_last_asr_text = text;
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

void huoshan_ai_asr_begin_client() {
  String nextHeaders = "Authorization: Bearer; " + huoshan_ai_doubao_token;
  if (huoshan_ai_asr_client_started && huoshan_ai_asr_headers == nextHeaders) return;

  if (huoshan_ai_asr_ws.isConnected()) {
    huoshan_ai_asr_disconnect();
  }
  huoshan_ai_asr_headers = nextHeaders;
  huoshan_ai_asr_ws.setExtraHeaders(huoshan_ai_asr_headers.c_str());
  huoshan_ai_asr_ws.setReconnectInterval(250);
  huoshan_ai_asr_ws.beginSSL("openspeech.bytedance.com", 443, "/api/v2/asr");
  huoshan_ai_asr_ws.onEvent(huoshan_ai_asr_event);
  huoshan_ai_asr_client_started = true;
}

bool huoshan_ai_asr_open_stream() {
  huoshan_ai_last_asr_text = "";
  huoshan_ai_last_error = "";
  huoshan_ai_asr_done = false;
  huoshan_ai_asr_fragment_buffer.clear();
  huoshan_ai_asr_fragment_active = false;

  if (huoshan_ai_doubao_app_id.length() == 0 || huoshan_ai_doubao_token.length() == 0) {
    huoshan_ai_last_error = "Doubao config missing";
    return false;
  }
  if (WiFi.status() != WL_CONNECTED) {
    huoshan_ai_last_error = "WiFi not connected";
    return false;
  }

  huoshan_ai_asr_begin_client();

  unsigned long connectStart = millis();
  while (!huoshan_ai_asr_ws.isConnected() && millis() - connectStart < 10000) {
    huoshan_ai_asr_ws.loop();
    delay(1);
  }
  if (!huoshan_ai_asr_ws.isConnected()) {
    huoshan_ai_last_error = "ASR connect timeout";
    huoshan_ai_asr_disconnect();
    return false;
  }

  std::vector<uint8_t> fullRequest = huoshan_ai_build_asr_full_request();
  if (!huoshan_ai_asr_ws.sendBIN(fullRequest.data(), fullRequest.size())) {
    huoshan_ai_last_error = "ASR header send failed";
    huoshan_ai_asr_disconnect();
    return false;
  }
  huoshan_ai_asr_request_active = true;
  if (HUOSHAN_AI_VERBOSE_LOG) {
    Serial.printf("[HuoshanAI] ASR stream connected in %u ms\n", (unsigned)(millis() - connectStart));
  }
  return true;
}

bool huoshan_ai_asr_send_audio(const uint8_t *audio, size_t size, bool lastPacket) {
  std::vector<uint8_t> request = huoshan_ai_build_asr_audio_request(audio, size, lastPacket);
  unsigned long sendStart = millis();
  if (!huoshan_ai_asr_ws.sendBIN(request.data(), request.size())) {
    huoshan_ai_last_error = lastPacket ? "ASR final packet send failed" : "ASR audio send failed";
    return false;
  }
  uint32_t sendMs = millis() - sendStart;
  if (!lastPacket) {
    huoshan_ai_asr_send_total_ms += sendMs;
    if (sendMs > huoshan_ai_asr_send_max_ms) huoshan_ai_asr_send_max_ms = sendMs;
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
  huoshan_ai_asr_disconnect();
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
  if (HUOSHAN_AI_VERBOSE_LOG) {
    Serial.printf("[HuoshanAI] ASR task: core=%d priority=%u\n",
                  (int)xPortGetCoreID(),
                  (unsigned)uxTaskPriorityGet(NULL));
  }
  unsigned long taskStart = millis();
  unsigned long finishStart = 0;
  huoshan_ai_asr_stream_started = false;
  huoshan_ai_asr_stream_samples_sent = 0;
  huoshan_ai_asr_stream_packets_sent = 0;
  huoshan_ai_asr_stream_dropped_packets = 0;
  huoshan_ai_asr_send_total_ms = 0;
  huoshan_ai_asr_send_max_ms = 0;

  huoshan_ai_asr_begin_client();
  uint8_t uploadBuffer[HUOSHAN_AI_ASR_PACKET_BYTES];
  size_t uploadUsed = 0;
  bool firstPacket = true;
  bool transportFailed = false;

  while (true) {
    size_t itemSize = 0;
    uint8_t *item = NULL;
    if (huoshan_ai_asr_ring_buffer != NULL) {
      item = (uint8_t *)xRingbufferReceive(
          huoshan_ai_asr_ring_buffer,
          &itemSize,
          pdMS_TO_TICKS(500));
    }
    if (item != NULL) {
      size_t offset = 0;
      bool sent = true;
      while (offset < itemSize) {
        size_t available = HUOSHAN_AI_ASR_PACKET_BYTES - uploadUsed;
        size_t current = itemSize - offset;
        if (current > available) current = available;
        memcpy(uploadBuffer + uploadUsed, item + offset, current);
        uploadUsed += current;
        offset += current;
        if (uploadUsed == HUOSHAN_AI_ASR_PACKET_BYTES) {
          if (firstPacket) {
            if (!huoshan_ai_asr_open_stream()) {
              sent = false;
              break;
            }
            huoshan_ai_asr_stream_started = true;
            firstPacket = false;
          }
          if (!huoshan_ai_asr_send_audio(uploadBuffer, uploadUsed, false)) {
            sent = false;
            break;
          }
          huoshan_ai_asr_stream_samples_sent += uploadUsed / sizeof(int16_t);
          huoshan_ai_asr_stream_packets_sent++;
          uploadUsed = 0;
          vTaskDelay(pdMS_TO_TICKS(HUOSHAN_AI_ASR_PACKET_YIELD_MS));
        }
      }
      vRingbufferReturnItem(huoshan_ai_asr_ring_buffer, item);
      if (!sent) {
        transportFailed = true;
        if (huoshan_ai_recording) huoshan_ai_asr_drain_while_recording();
        break;
      }
      continue;
    }
    if (!huoshan_ai_recording) {
      finishStart = millis();
      break;
    }
    huoshan_ai_asr_ws.loop();
    vTaskDelay(pdMS_TO_TICKS(1));
  }

  if (!transportFailed && uploadUsed > 0) {
    if (firstPacket) {
      if (huoshan_ai_asr_open_stream()) {
        huoshan_ai_asr_stream_started = true;
        firstPacket = false;
      } else {
        transportFailed = true;
      }
    }
    if (!transportFailed && huoshan_ai_asr_send_audio(uploadBuffer, uploadUsed, false)) {
      huoshan_ai_asr_stream_samples_sent += uploadUsed / sizeof(int16_t);
      huoshan_ai_asr_stream_packets_sent++;
      uploadUsed = 0;
    } else {
      transportFailed = true;
    }
  }

  if (!transportFailed && !firstPacket && huoshan_ai_last_error.length() == 0) {
    uint8_t finalPayload = 0;
    if (!huoshan_ai_asr_send_audio(&finalPayload, 1, true)) {
      transportFailed = true;
    }
  } else if (!transportFailed && firstPacket) {
    huoshan_ai_last_error = "ASR no audio packet sent";
    transportFailed = true;
  }
  unsigned long afterStop = finishStart > 0 ? millis() - finishStart : 0;
  uint32_t avgSendMs = huoshan_ai_asr_stream_packets_sent > 0
      ? huoshan_ai_asr_send_total_ms / huoshan_ai_asr_stream_packets_sent
      : 0;
  if (HUOSHAN_AI_VERBOSE_LOG) {
    Serial.printf("[HuoshanAI] ASR stream sent: %u packets, %u bytes, elapsed=%u ms, afterStop=%u ms, dropped=%u, sendAvg=%u ms, sendMax=%u ms\n",
                  (unsigned)huoshan_ai_asr_stream_packets_sent,
                  (unsigned)(huoshan_ai_asr_stream_samples_sent * sizeof(int16_t)),
                  (unsigned)(millis() - taskStart),
                  (unsigned)afterStop,
                  (unsigned)huoshan_ai_asr_stream_dropped_packets,
                  (unsigned)avgSendMs,
                  (unsigned)huoshan_ai_asr_send_max_ms);
  }

  if (!transportFailed && huoshan_ai_last_error.length() == 0) {
    huoshan_ai_asr_wait_result(15000);
  } else {
    huoshan_ai_asr_disconnect();
    Serial.println("[HuoshanAI] ASR failed: " + huoshan_ai_last_error);
  }
  huoshan_ai_asr_drain_ring_buffer();
  huoshan_ai_asr_stream_started = false;
  huoshan_ai_asr_stream_task_handle = NULL;
  vTaskDelete(NULL);
}

String huoshan_ai_asr_recognize(uint8_t *audio, size_t size) {
  if (HUOSHAN_AI_VERBOSE_LOG) {
    Serial.printf("[HuoshanAI] ASR start, audio bytes: %u\n", (unsigned)size);
  }

  huoshan_ai_asr_send_total_ms = 0;
  huoshan_ai_asr_send_max_ms = 0;
  if (!huoshan_ai_asr_open_stream()) return "";

  unsigned long sendStart = millis();
  size_t offset = 0;
  uint32_t packetsSent = 0;
  while (offset < size) {
    if (huoshan_ai_asr_done && huoshan_ai_last_asr_text.length() > 0) {
      huoshan_ai_last_error = "";
      break;
    }
    size_t current = (size - offset) < HUOSHAN_AI_ASR_PACKET_BYTES ? (size - offset) : HUOSHAN_AI_ASR_PACKET_BYTES;
    if (!huoshan_ai_asr_send_audio(audio + offset, current, false)) {
      if (huoshan_ai_last_asr_text.length() > 0) {
        huoshan_ai_last_error = "";
      }
      break;
    }
    offset += current;
    packetsSent++;
    if (huoshan_ai_asr_done && huoshan_ai_last_asr_text.length() > 0) {
      huoshan_ai_last_error = "";
      break;
    }
    vTaskDelay(pdMS_TO_TICKS(HUOSHAN_AI_ASR_PACKET_YIELD_MS));
  }
  if (huoshan_ai_last_error.length() == 0 && !huoshan_ai_asr_done) {
    uint8_t finalPayload = 0;
    huoshan_ai_asr_send_audio(&finalPayload, 1, true);
  }
  uint32_t avgSendMs = packetsSent > 0 ? huoshan_ai_asr_send_total_ms / packetsSent : 0;
  if (HUOSHAN_AI_VERBOSE_LOG) {
    Serial.printf("[HuoshanAI] ASR audio sent: %u bytes, packets=%u, elapsed=%u ms, sendAvg=%u ms, sendMax=%u ms\n",
                  (unsigned)offset,
                  (unsigned)packetsSent,
                  (unsigned)(millis() - sendStart),
                  (unsigned)avgSendMs,
                  (unsigned)huoshan_ai_asr_send_max_ms);
  }
  if (huoshan_ai_last_error.length() > 0) {
    huoshan_ai_asr_disconnect();
    Serial.println("[HuoshanAI] ASR failed: " + huoshan_ai_last_error);
    return "";
  }
  return huoshan_ai_asr_wait_result(15000);
}

String huoshan_ai_asr_recognize_with_reconnect(uint8_t *audio, size_t size) {
  String text = "";
  for (uint8_t attempt = 1; attempt <= HUOSHAN_AI_ASR_FULL_UPLOAD_ATTEMPTS; attempt++) {
    if (attempt > 1) huoshan_ai_asr_reconnect_count++;
    Serial.printf("[HuoshanAI] ASR full upload attempt %u/%u\n",
                  (unsigned)attempt,
                  (unsigned)HUOSHAN_AI_ASR_FULL_UPLOAD_ATTEMPTS);
    huoshan_ai_last_error = "";
    huoshan_ai_asr_retry_full_pending = false;
    text = huoshan_ai_asr_recognize(audio, size);
    if (text.length() > 0) return text;

    bool retryable = huoshan_ai_asr_is_retryable_error();
    huoshan_ai_asr_disconnect();
    if (attempt < HUOSHAN_AI_ASR_FULL_UPLOAD_ATTEMPTS) {
      if (!retryable) break;
      Serial.println("[HuoshanAI] ASR transport failed; reconnecting before complete retry");
      delay(250);
    }
  }
  return text;
}

void huoshan_ai_tts_event(WStype_t type, uint8_t *payload, size_t length) {
  if (type == WStype_ERROR || type == WStype_DISCONNECTED) {
    huoshan_ai_tts_fragment_buffer.clear();
    huoshan_ai_tts_fragment_active = false;
    if (!huoshan_ai_tts_done && huoshan_ai_tts_request_active) {
      if (huoshan_ai_tts_audio_packets == huoshan_ai_tts_request_packet_start) {
        huoshan_ai_last_error = "TTS websocket disconnected before audio";
      } else if (!huoshan_ai_tts_final_received) {
        huoshan_ai_last_error = "TTS websocket disconnected before final audio";
      }
      huoshan_ai_tts_done = true;
    }
    huoshan_ai_tts_request_active = false;
    return;
  }

  if (type == WStype_FRAGMENT_BIN_START) {
    huoshan_ai_tts_fragment_buffer.clear();
    huoshan_ai_tts_fragment_buffer.reserve(length + 16384);
    if (payload != NULL && length > 0) {
      huoshan_ai_tts_fragment_buffer.insert(
          huoshan_ai_tts_fragment_buffer.end(),
          payload,
          payload + length);
    }
    huoshan_ai_tts_fragment_active = true;
    return;
  }
  if (type == WStype_FRAGMENT) {
    if (huoshan_ai_tts_fragment_active && payload != NULL && length > 0) {
      huoshan_ai_tts_fragment_buffer.insert(
          huoshan_ai_tts_fragment_buffer.end(),
          payload,
          payload + length);
    }
    return;
  }
  if (type == WStype_FRAGMENT_FIN) {
    if (!huoshan_ai_tts_fragment_active) return;
    if (payload != NULL && length > 0) {
      huoshan_ai_tts_fragment_buffer.insert(
          huoshan_ai_tts_fragment_buffer.end(),
          payload,
          payload + length);
    }
    huoshan_ai_tts_fragment_active = false;
    payload = huoshan_ai_tts_fragment_buffer.data();
    length = huoshan_ai_tts_fragment_buffer.size();
    type = WStype_BIN;
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
      if (huoshan_ai_tts_first_audio_ms == 0) {
        huoshan_ai_tts_first_audio_ms = millis();
        if (HUOSHAN_AI_VERBOSE_LOG) {
          Serial.printf("[HuoshanAI] TTS first audio in %u ms\n",
                        (unsigned)(huoshan_ai_tts_first_audio_ms - huoshan_ai_tts_request_start_ms));
        }
      }
      if (!huoshan_ai_tts_enqueue_audio(body + 8, payloadSize)) {
        if (huoshan_ai_tts_audio_packets == huoshan_ai_tts_request_packet_start) {
          huoshan_ai_last_error = "TTS audio queue full";
          huoshan_ai_tts_done = true;
          huoshan_ai_tts_request_active = false;
        } else {
          Serial.println("[HuoshanAI] TTS audio packet dropped");
        }
      }
    }
    if (sequence < 0) {
      huoshan_ai_tts_final_received = true;
      huoshan_ai_tts_done = true;
      huoshan_ai_tts_request_active = false;
    }
  } else if (messageType == 0b1111) {
    if (length < 12) return;
    uint32_t errorCode = huoshan_ai_read_i32(body);
    uint32_t messageSize = huoshan_ai_read_i32(body + 4);
    if (messageSize > length - 12) return;
    String msg = huoshan_ai_bytes_to_string(body + 8, messageSize);
    huoshan_ai_last_error = "TTS error " + String(errorCode) + ": " + msg;
    huoshan_ai_tts_done = true;
    huoshan_ai_tts_request_active = false;
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
  if (HUOSHAN_AI_VERBOSE_LOG) {
    Serial.printf("[HuoshanAI] TTS HTTP code: %d\n", code);
  }
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

  if (HUOSHAN_AI_VERBOSE_LOG) {
    Serial.printf("[HuoshanAI] TTS HTTP audio: %u bytes in %u ms\n", (unsigned)actualLen, (unsigned)(millis() - start));
  }
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
    return false;
  }
  if (WiFi.status() != WL_CONNECTED) {
    huoshan_ai_last_error = "WiFi not connected";
    return false;
  }
  if (!huoshan_ai_speaker_ready && !huoshan_ai_init_speaker()) return false;
  if (huoshan_ai_tts_ws.isConnected()) return true;

  huoshan_ai_tts_request_active = false;
  huoshan_ai_tts_ws.disconnect();
  huoshan_ai_tts_headers = "Authorization: Bearer; " + huoshan_ai_doubao_token;
  huoshan_ai_tts_ws.setExtraHeaders(huoshan_ai_tts_headers.c_str());
  huoshan_ai_tts_ws.setReconnectInterval(1000);
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
    return false;
  }
  huoshan_ai_last_error = "";
  if (HUOSHAN_AI_VERBOSE_LOG) {
    Serial.printf("[HuoshanAI] TTS connected in %u ms\n", (unsigned)(millis() - connectStart));
  }
  return true;
}

void huoshan_ai_tts_connect_task(void *arg) {
  huoshan_ai_tts_connect();
  huoshan_ai_tts_connect_task_handle = NULL;
  vTaskDelete(NULL);
}

void huoshan_ai_tts_preconnect() {
  if (huoshan_ai_tts_ws.isConnected() || huoshan_ai_tts_connect_task_handle != NULL) return;
  xTaskCreate(
      huoshan_ai_tts_connect_task,
      "huoshanTtsConnect",
      6144,
      NULL,
      1,
      &huoshan_ai_tts_connect_task_handle);
}

bool huoshan_ai_tts_wait_preconnect(uint32_t timeoutMs) {
  unsigned long start = millis();
  while (huoshan_ai_tts_connect_task_handle != NULL
         && !huoshan_ai_tts_ws.isConnected()
         && millis() - start < timeoutMs) {
    delay(1);
  }
  if (huoshan_ai_tts_ws.isConnected()) return true;
  return huoshan_ai_tts_connect();
}

void huoshan_ai_tts_begin_sequence() {
  if (huoshan_ai_tts_sequence_active) return;
  huoshan_ai_tts_sequence_active = true;
  huoshan_ai_tts_sequence_input_done = false;
  huoshan_ai_tts_playback_primed = false;
  huoshan_ai_tts_audio_packets = 0;
  huoshan_ai_tts_audio_dropped = 0;
  huoshan_ai_tts_audio_bytes = 0;
  huoshan_ai_tts_audio_underruns = 0;
  huoshan_ai_tts_reconnect_count = 0;
}

void huoshan_ai_tts_finish_sequence() {
  huoshan_ai_tts_request_active = false;
  huoshan_ai_tts_ws.disconnect();
  huoshan_ai_tts_sequence_input_done = true;
  huoshan_ai_tts_wait_audio_done(120000);
  if (HUOSHAN_AI_VERBOSE_LOG) {
    Serial.printf("[HuoshanAI] TTS stream complete: %u packets, %u bytes, pending=%u, dropped=%u, underruns=%u, reconnects=%u\n",
                  (unsigned)huoshan_ai_tts_audio_packets,
                  (unsigned)huoshan_ai_tts_audio_bytes,
                  (unsigned)huoshan_ai_tts_audio_pending,
                  (unsigned)huoshan_ai_tts_audio_dropped,
                  (unsigned)huoshan_ai_tts_audio_underruns,
                  (unsigned)huoshan_ai_tts_reconnect_count);
  }
  huoshan_ai_tts_sequence_active = false;
  if (huoshan_ai_last_error.length() == 0 || huoshan_ai_tts_audio_packets > 0) {
    huoshan_ai_last_error = "";
    huoshan_ai_set_state("idle");
  }
}

void huoshan_ai_tts_speak_internal(String text, bool disconnectAfter) {
  text.trim();
  if (!huoshan_ai_has_readable_text(text)) {
    Serial.println("[HuoshanAI] TTS skipped unreadable text");
    if (disconnectAfter && huoshan_ai_tts_sequence_active) {
      huoshan_ai_tts_finish_sequence();
    }
    return;
  }
  huoshan_ai_tts_begin_sequence();
  huoshan_ai_set_state("speaking");
  uint32_t sentencePacketStart = huoshan_ai_tts_audio_packets;
  bool websocketCompleted = false;

  for (uint8_t attempt = 1; attempt <= HUOSHAN_AI_TTS_WS_ATTEMPTS; attempt++) {
    huoshan_ai_tts_done = false;
    huoshan_ai_tts_final_received = false;
    huoshan_ai_tts_request_packet_start = huoshan_ai_tts_audio_packets;
    huoshan_ai_tts_first_audio_ms = 0;
    huoshan_ai_last_error = "";

    if (!huoshan_ai_tts_wait_preconnect(10000)) {
      if (attempt < HUOSHAN_AI_TTS_WS_ATTEMPTS) {
        huoshan_ai_tts_reconnect_count++;
        delay(250);
        continue;
      }
      break;
    }

    std::vector<uint8_t> request = huoshan_ai_build_tts_request(text);
    huoshan_ai_tts_request_start_ms = millis();
    huoshan_ai_tts_request_active = true;
    if (!huoshan_ai_tts_ws.sendBIN(request.data(), request.size())) {
      huoshan_ai_tts_request_active = false;
      huoshan_ai_last_error = "TTS request send failed";
    } else {
      unsigned long waitStart = millis();
      while (!huoshan_ai_tts_done && millis() - waitStart < 120000) {
        huoshan_ai_tts_ws.loop();
        delay(1);
      }
      if (!huoshan_ai_tts_done && huoshan_ai_last_error.length() == 0) {
        huoshan_ai_last_error = "TTS result timeout";
      }
      if (huoshan_ai_tts_final_received && huoshan_ai_last_error.length() == 0) {
        websocketCompleted = true;
        break;
      }
    }

    huoshan_ai_tts_request_active = false;
    huoshan_ai_tts_ws.disconnect();
    bool audioStarted = huoshan_ai_tts_audio_packets > sentencePacketStart;
    if (audioStarted || attempt >= HUOSHAN_AI_TTS_WS_ATTEMPTS) break;
    huoshan_ai_tts_reconnect_count++;
    Serial.println("[HuoshanAI] TTS transport failed before audio; reconnecting");
    delay(250);
  }

  if (!websocketCompleted && huoshan_ai_tts_audio_packets == sentencePacketStart) {
    Serial.println("[HuoshanAI] TTS WebSocket unavailable before audio; falling back to HTTP");
    huoshan_ai_last_error = "";
    if (huoshan_ai_tts_speak_http(text)) {
      if (disconnectAfter) huoshan_ai_tts_finish_sequence();
      return;
    }
  }

  if (!websocketCompleted) {
    if (huoshan_ai_last_error.length() == 0) {
      huoshan_ai_last_error = "TTS websocket ended before final audio";
    }
    huoshan_ai_set_state("error");
    return;
  }

  if (disconnectAfter) {
    huoshan_ai_tts_finish_sequence();
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

  huoshan_ai_screen_on_user_text(input);
  huoshan_ai_set_state("thinking");
  HTTPClient http;
  String url = "https://api.coze.cn/v3/chat";
  if (huoshan_ai_conversation_id.length() > 0) {
    url += "?conversation_id=" + huoshan_ai_conversation_id;
  }
  if (!http.begin(url)) {
    huoshan_ai_last_error = "Coze HTTP begin failed";
    huoshan_ai_set_state("error");
    return "";
  }
  http.setTimeout(120000);
  http.addHeader("Authorization", "Bearer " + huoshan_ai_coze_token);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "text/event-stream");

  JsonDocument doc;
  doc["stream"] = true;
  doc["auto_save_history"] = true;
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
  if (HUOSHAN_AI_VERBOSE_LOG) {
    Serial.printf("[HuoshanAI] Coze HTTP code: %d\n", code);
  }
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
  if (speakReply) {
    huoshan_ai_tts_begin_sequence();
  }
  WiFiClient *stream = http.getStreamPtr();
  stream->setTimeout(2000);
  String ttsBuffer = "";
  String lastEvent = "";
  unsigned long lastData = millis();
  bool cozeAnswerCompleted = false;
  uint32_t cozeDataLines = 0;
  uint32_t cozeAnswerLines = 0;
  uint32_t cozeParseErrors = 0;
  uint32_t cozeSkippedData = 0;
  bool ttsPreconnectStarted = false;
  bool cozeSseTimedOut = false;
  while (stream->connected() || stream->available()) {
    while (!stream->available()) {
      if (millis() - lastData > 30000 && cozeDataLines == 0) {
        huoshan_ai_last_error = "Coze SSE first data timeout";
        cozeSseTimedOut = true;
        break;
      }
      if (millis() - lastData > 120000) {
        cozeSseTimedOut = true;
        break;
      }
      vTaskDelay(pdMS_TO_TICKS(10));
    }
    if (cozeSseTimedOut || !stream->available()) break;
    String line = stream->readStringUntil('\n');
    lastData = millis();
    line.trim();
    if (line.length() == 0) continue;
    if (line.startsWith("event:")) {
      lastEvent = line;
      continue;
    }
    if (!line.startsWith("data:")) {
      if (line.startsWith("{")) {
        int previewLen = line.length() > 240 ? 240 : line.length();
        Serial.println("[HuoshanAI] Coze non-SSE: " + line.substring(0, previewLen));
        JsonDocument errorDoc;
        DeserializationError parseError = deserializeJson(errorDoc, line);
        if (!parseError) {
          int errCode = errorDoc["code"] | 0;
          String errMsg = errorDoc["msg"] | "";
          if (errMsg.length() == 0) errMsg = errorDoc["message"] | "";
          if (errCode != 0 || errMsg.length() > 0) {
            huoshan_ai_last_error = "Coze API " + String(errCode);
            if (errMsg.length() > 0) huoshan_ai_last_error += ": " + errMsg;
          } else {
            huoshan_ai_last_error = "Coze returned non-SSE response";
          }
        } else {
          huoshan_ai_last_error = "Coze returned non-SSE response";
        }
        break;
      }
      continue;
    }
    cozeDataLines++;
    String data = line.substring(5);
    data.trim();
    if (data.length() == 0 || data == "[DONE]") continue;
    JsonDocument chunk;
    DeserializationError err = deserializeJson(chunk, data);
    if (err) {
      cozeParseErrors++;
      if (HUOSHAN_AI_VERBOSE_LOG && cozeParseErrors <= 2) {
        Serial.println("[HuoshanAI] Coze JSON parse failed");
      }
      continue;
    }
    String role = chunk["role"] | "";
    String type = chunk["type"] | "";
    String content = chunk["content"] | "";
    String cid = chunk["conversation_id"] | "";
    if (cid.length() > 0) huoshan_ai_conversation_id = cid;
    if (role != "assistant" || type != "answer") {
      cozeSkippedData++;
      continue;
    }
    cozeAnswerLines++;
    if (speakReply && !ttsPreconnectStarted) {
      huoshan_ai_tts_preconnect();
      ttsPreconnectStarted = true;
    }
    bool completedEvent = lastEvent == "event:conversation.message.completed";
    String contentToAppend = content;
    if (completedEvent) {
      cozeAnswerCompleted = true;
      if (content.length() >= huoshan_ai_last_reply_text.length()
          && content.startsWith(huoshan_ai_last_reply_text)) {
        contentToAppend = content.substring(huoshan_ai_last_reply_text.length());
      } else if (huoshan_ai_last_reply_text.length() > 0) {
        contentToAppend = "";
      }
    }
    if (contentToAppend.length() > 0) {
      huoshan_ai_last_reply_text += contentToAppend;
      huoshan_ai_screen_on_reply_text(huoshan_ai_last_reply_text);
      if (speakReply) {
        ttsBuffer += contentToAppend;
        huoshan_ai_speak_buffered_sentences(ttsBuffer);
      }
    }
    if (cozeAnswerCompleted && huoshan_ai_last_reply_text.length() > 0) break;
  }
  http.end();
  if (HUOSHAN_AI_VERBOSE_LOG) {
    Serial.printf("[HuoshanAI] Coze lines: data=%u answer=%u skipped=%u parseErr=%u\n",
                  (unsigned)cozeDataLines,
                  (unsigned)cozeAnswerLines,
                  (unsigned)cozeSkippedData,
                  (unsigned)cozeParseErrors);
    Serial.printf("[HuoshanAI] Coze reply chars: %u\n", (unsigned)huoshan_ai_last_reply_text.length());
  }
  if (huoshan_ai_last_reply_text.length() == 0 && huoshan_ai_last_error.length() == 0) {
    if (cozeSseTimedOut) {
      huoshan_ai_last_error = cozeDataLines == 0
          ? "Coze SSE first data timeout"
          : "Coze SSE response timeout";
    } else if (cozeDataLines == 0) {
      huoshan_ai_last_error = "Coze returned no SSE data";
    } else if (cozeAnswerLines == 0) {
      huoshan_ai_last_error = "Coze returned no answer";
    } else {
      huoshan_ai_last_error = "Coze reply is empty";
    }
  }
  if (speakReply) {
    ttsBuffer.trim();
    if (ttsBuffer.length() > 0) {
      huoshan_ai_tts_speak_internal(ttsBuffer, true);
    } else {
      huoshan_ai_tts_finish_sequence();
    }
  }
  if (huoshan_ai_last_reply_text.length() == 0 && huoshan_ai_last_error.length() > 0) {
    huoshan_ai_report_error();
  } else if (!speakReply && huoshan_ai_last_error.length() == 0) {
    huoshan_ai_set_state("idle");
  }
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
  bool shouldRetryFull = false;
  if (huoshan_ai_asr_stream_task_handle != NULL) {
    unsigned long waitStart = millis();
    huoshan_ai_asr_stream_finish_requested = true;
    huoshan_ai_asr_stream_finish_ms = waitStart;
    while (huoshan_ai_asr_stream_task_handle != NULL && millis() - waitStart < 30000) {
      delay(10);
    }
    bool streamFinished = huoshan_ai_asr_stream_task_handle == NULL;
    if (huoshan_ai_asr_stream_task_handle != NULL) {
      huoshan_ai_last_error = "ASR stream finish timeout";
      huoshan_ai_set_state("error");
      return;
    }
    if (streamFinished) {
      text = huoshan_ai_last_asr_text;
      shouldRetryFull = text.length() == 0 && huoshan_ai_asr_should_retry_full();
    }
  } else if (huoshan_ai_last_error.length() == 0) {
    huoshan_ai_last_error = "ASR stream task not running";
    shouldRetryFull = true;
  } else {
    shouldRetryFull = huoshan_ai_asr_should_retry_full();
  }
  if (text.length() == 0 && shouldRetryFull) {
    Serial.println("[HuoshanAI] ASR stream incomplete; retrying complete recording");
    huoshan_ai_last_error = "";
    text = huoshan_ai_asr_recognize_with_reconnect(
        (uint8_t *)huoshan_ai_record_buffer.data(),
        recordedSamples * sizeof(int16_t));
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
  void configScreen(int width, int height, int brightness) { huoshan_ai_screen_config(width, height, brightness); }
  bool beginScreen(bool touchToTalk, bool autoMessages) { return huoshan_ai_screen_begin(touchToTalk, autoMessages); }
  void setScreenBrightness(int brightness) { huoshan_ai_screen_set_brightness(brightness); }
  void setScreenStatus(String text) { huoshan_ai_screen_set_status(text); }
  void addScreenMessage(String role, String text) { huoshan_ai_screen_add_message(role, text); }
  void clearScreenMessages() { huoshan_ai_screen_clear_messages(); }
  String state() { return huoshan_ai_state; }
  bool isWiFiConnected() { return WiFi.status() == WL_CONNECTED; }
  String lastAsrText() { return huoshan_ai_last_asr_text; }
  String lastReplyText() { return huoshan_ai_last_reply_text; }
  String lastError() { return huoshan_ai_last_error; }
};

HuoshanAIVoiceClass HuoshanAIVoice;
`);
}

function huoshanAiEnsureScreenRuntime(generator) {
  huoshanAiEnsureScreenConfigured(generator);
  huoshanAiEnsureRuntime(generator);

  generator.addLibrary('huoshan_ai_tft_espi', '#include <TFT_eSPI.h>');
  generator.addLibrary('huoshan_ai_lvgl', '#include <lvgl.h>');
  generator.addLibrary('huoshan_ai_screen_font', '#include <huoshan_ai_screen_font.h>');
  generator.addLibrary('huoshan_ai_wire', '#include <Wire.h>');
  generator.addFunction('huoshan_ai_screen_runtime', String.raw`
#if HUOSHAN_AI_SCREEN_ENABLED

static const int HUOSHAN_AI_STATUS_BAR_HEIGHT = 25;
static const int HUOSHAN_AI_SPEAK_BUTTON_HEIGHT = 38;
static const uint8_t HUOSHAN_AI_SCREEN_TOUCH_ADDR = 0x38;

static uint32_t huoshan_ai_screen_draw_buf[
    HUOSHAN_AI_SCREEN_WIDTH * HUOSHAN_AI_SCREEN_HEIGHT / 10 * (LV_COLOR_DEPTH / 8) / 4];

class HuoshanAIScreenTouch {
public:
  HuoshanAIScreenTouch(int sda, int scl, int rst, int intr)
      : sda_(sda), scl_(scl), rst_(rst), intr_(intr) {}

  void begin() {
    Wire.begin(sda_, scl_);
    if (intr_ >= 0) pinMode(intr_, INPUT);
    if (rst_ >= 0) {
      pinMode(rst_, OUTPUT);
      digitalWrite(rst_, LOW);
      delay(10);
      digitalWrite(rst_, HIGH);
      delay(300);
    }
  }

  uint8_t read_touch_number() {
    return readByte(0x02) & 0x0F;
  }

  uint16_t read_touch1_x() {
    return readCoord(0x03);
  }

  uint16_t read_touch1_y() {
    return readCoord(0x05);
  }

private:
  int sda_;
  int scl_;
  int rst_;
  int intr_;

  uint8_t readByte(uint8_t reg) {
    Wire.beginTransmission(HUOSHAN_AI_SCREEN_TOUCH_ADDR);
    Wire.write(reg);
    if (Wire.endTransmission(false) != 0) return 0;
    if (Wire.requestFrom((uint8_t)HUOSHAN_AI_SCREEN_TOUCH_ADDR, (uint8_t)1) != 1) return 0;
    return Wire.read();
  }

  uint16_t readCoord(uint8_t reg) {
    uint8_t high = readByte(reg);
    uint8_t low = readByte(reg + 1);
    return ((uint16_t)(high & 0x0F) << 8) | low;
  }
};

HuoshanAIScreenTouch huoshan_ai_screen_touch(
    HUOSHAN_AI_SCREEN_TOUCH_SDA,
    HUOSHAN_AI_SCREEN_TOUCH_SCL,
    HUOSHAN_AI_SCREEN_TOUCH_RST,
    HUOSHAN_AI_SCREEN_TOUCH_INT);

SemaphoreHandle_t huoshan_ai_screen_lock = NULL;
TaskHandle_t huoshan_ai_screen_loop_task_handle = NULL;
TaskHandle_t huoshan_ai_screen_chat_task_handle = NULL;
lv_obj_t *huoshan_ai_screen_home = NULL;
lv_obj_t *huoshan_ai_screen_status_label = NULL;
lv_obj_t *huoshan_ai_screen_wifi_label = NULL;
lv_obj_t *huoshan_ai_screen_message_list = NULL;
lv_obj_t *huoshan_ai_screen_speak_button = NULL;
lv_obj_t *huoshan_ai_screen_speak_label = NULL;
lv_obj_t *huoshan_ai_screen_active_reply_label = NULL;
uint8_t huoshan_ai_screen_brightness = 80;
bool huoshan_ai_screen_ready = false;
bool huoshan_ai_screen_touch_to_talk = true;
bool huoshan_ai_screen_auto_messages = true;
uint8_t huoshan_ai_screen_message_count = 0;

bool huoshan_ai_screen_take(TickType_t ticks) {
  return huoshan_ai_screen_lock != NULL
      && xSemaphoreTakeRecursive(huoshan_ai_screen_lock, ticks) == pdTRUE;
}

void huoshan_ai_screen_give() {
  if (huoshan_ai_screen_lock != NULL) xSemaphoreGiveRecursive(huoshan_ai_screen_lock);
}

uint32_t huoshan_ai_screen_tick() {
  return millis();
}

String huoshan_ai_screen_state_label(const String &state) {
  if (state == "idle") return "待命中...";
  if (state == "wifi_connected") return "连网成功";
  if (state == "listening") return "正在聆听...";
  if (state == "recognizing") return "正在识别...";
  if (state == "thinking") return "正在思考...";
  if (state == "speaking") return "正在说话...";
  if (state == "error") return "出错";
  return state;
}

void huoshan_ai_screen_append_utf8(String &out, uint32_t codepoint) {
  if (codepoint <= 0x7F) {
    out += (char)codepoint;
  } else if (codepoint <= 0x7FF) {
    out += (char)(0xC0 | (codepoint >> 6));
    out += (char)(0x80 | (codepoint & 0x3F));
  } else if (codepoint <= 0xFFFF) {
    out += (char)(0xE0 | (codepoint >> 12));
    out += (char)(0x80 | ((codepoint >> 6) & 0x3F));
    out += (char)(0x80 | (codepoint & 0x3F));
  }
}

bool huoshan_ai_screen_is_supported_codepoint(uint32_t codepoint) {
  if (codepoint == '\n' || codepoint == '\t') return true;
  if (codepoint >= 0x20 && codepoint <= 0x7E) return true;
  if (codepoint >= 0x00A0 && codepoint <= 0x00FF) return true;
  if (codepoint >= 0x2000 && codepoint <= 0x206F) return true;
  if (codepoint >= 0x2100 && codepoint <= 0x214F) return true;
  if (codepoint >= 0x3000 && codepoint <= 0x303F) return true;
  if (codepoint >= 0x3400 && codepoint <= 0x4DBF) return true;
  if (codepoint >= 0x4E00 && codepoint <= 0x9FFF) return true;
  if (codepoint >= 0xFF00 && codepoint <= 0xFFEF) return true;
  return false;
}

String huoshan_ai_screen_sanitize_text(const String &input) {
  String out = "";
  const uint8_t *bytes = (const uint8_t *)input.c_str();
  size_t length = input.length();
  size_t offset = 0;
  while (offset < length) {
    uint32_t codepoint = 0;
    uint8_t first = bytes[offset];
    if (first < 0x80) {
      codepoint = first;
      offset++;
    } else if ((first & 0xE0) == 0xC0 && offset + 1 < length
        && (bytes[offset + 1] & 0xC0) == 0x80) {
      codepoint = ((uint32_t)(first & 0x1F) << 6)
          | (uint32_t)(bytes[offset + 1] & 0x3F);
      offset += 2;
    } else if ((first & 0xF0) == 0xE0 && offset + 2 < length
        && (bytes[offset + 1] & 0xC0) == 0x80
        && (bytes[offset + 2] & 0xC0) == 0x80) {
      codepoint = ((uint32_t)(first & 0x0F) << 12)
          | ((uint32_t)(bytes[offset + 1] & 0x3F) << 6)
          | (uint32_t)(bytes[offset + 2] & 0x3F);
      offset += 3;
    } else if ((first & 0xF8) == 0xF0 && offset + 3 < length
        && (bytes[offset + 1] & 0xC0) == 0x80
        && (bytes[offset + 2] & 0xC0) == 0x80
        && (bytes[offset + 3] & 0xC0) == 0x80) {
      // The bundled 15px font does not cover emoji or supplementary-plane glyphs.
      offset += 4;
      continue;
    } else {
      offset++;
      continue;
    }

    if (codepoint == '\r') continue;
    if (codepoint == '\n' || codepoint == '\t') {
      out += ' ';
      continue;
    }
    if (codepoint >= 0x200B && codepoint <= 0x200F) continue;
    if (codepoint >= 0x202A && codepoint <= 0x202E) continue;
    if (codepoint >= 0x2060 && codepoint <= 0x206F) continue;
    if (codepoint >= 0xFE00 && codepoint <= 0xFE0F) continue;
    if (codepoint >= 0xE000 && codepoint <= 0xF8FF) continue;
    if (!huoshan_ai_screen_is_supported_codepoint(codepoint)) continue;
    huoshan_ai_screen_append_utf8(out, codepoint);
  }
  out.trim();
  return out;
}

void huoshan_ai_screen_set_brightness(int brightness) {
  if (brightness < 0) brightness = 0;
  if (brightness > 100) brightness = 100;
  huoshan_ai_screen_brightness = (uint8_t)brightness;
#if HUOSHAN_AI_SCREEN_BL >= 0
  pinMode(HUOSHAN_AI_SCREEN_BL, OUTPUT);
  digitalWrite(HUOSHAN_AI_SCREEN_BL, brightness > 0 ? TFT_BACKLIGHT_ON : !TFT_BACKLIGHT_ON);
  analogWrite(HUOSHAN_AI_SCREEN_BL, map(brightness, 0, 100, 0, 255));
#endif
}

void huoshan_ai_screen_touch_read(lv_indev_t *indev, lv_indev_data_t *data) {
  uint8_t touches = huoshan_ai_screen_touch.read_touch_number();
  if (touches == 0) {
    data->state = LV_INDEV_STATE_RELEASED;
    return;
  }

  data->state = LV_INDEV_STATE_PRESSED;
  data->point.x = huoshan_ai_screen_touch.read_touch1_x();
  data->point.y = huoshan_ai_screen_touch.read_touch1_y();
}

void huoshan_ai_screen_loop_task(void *arg) {
  while (true) {
    if (huoshan_ai_screen_take(portMAX_DELAY)) {
      lv_timer_handler();
      huoshan_ai_screen_give();
    }
    vTaskDelay(pdMS_TO_TICKS(5));
  }
}

void huoshan_ai_screen_chat_task(void *arg) {
  huoshan_ai_stop_listening_and_chat();
  huoshan_ai_screen_chat_task_handle = NULL;
  vTaskDelete(NULL);
}

void huoshan_ai_screen_speak_event(lv_event_t *event) {
  if (!huoshan_ai_screen_touch_to_talk) return;
  lv_event_code_t code = lv_event_get_code(event);
  if (code == LV_EVENT_PRESSED) {
    huoshan_ai_start_listening();
  } else if (code == LV_EVENT_RELEASED || code == LV_EVENT_PRESS_LOST) {
    if (huoshan_ai_recording && huoshan_ai_screen_chat_task_handle == NULL) {
      xTaskCreate(
          huoshan_ai_screen_chat_task,
          "huoshanScreenChat",
          12288,
          NULL,
          1,
          &huoshan_ai_screen_chat_task_handle);
    }
  }
}

lv_obj_t *huoshan_ai_screen_add_message_locked(const String &role, const String &text) {
  if (huoshan_ai_screen_message_list == NULL) return NULL;
  String displayText = huoshan_ai_screen_sanitize_text(text);
  if (displayText.length() == 0) return NULL;
  String prefix = "";
  uint32_t color = 0x1F2937;
  if (role == "user") {
    prefix = "我：";
    color = 0x0F766E;
    huoshan_ai_screen_active_reply_label = NULL;
  } else if (role == "assistant") {
    prefix = "AI：";
    color = 0x1D4ED8;
  } else if (role == "system") {
    prefix = "";
    color = 0x6B7280;
    huoshan_ai_screen_active_reply_label = NULL;
  }

  String line = prefix + displayText;
  lv_obj_t *label = lv_list_add_text(huoshan_ai_screen_message_list, line.c_str());
  lv_label_set_long_mode(label, LV_LABEL_LONG_WRAP);
  lv_obj_set_width(label, lv_pct(100));
  lv_obj_set_style_text_font(label, &HuoshanAI_CN_15, 0);
  lv_obj_set_style_text_color(label, lv_color_hex(color), 0);
  lv_obj_set_style_pad_top(label, 8, 0);
  lv_obj_set_style_pad_bottom(label, 8, 0);
  lv_obj_set_style_bg_opa(label, LV_OPA_TRANSP, 0);
  huoshan_ai_screen_message_count++;

  while (huoshan_ai_screen_message_count > 24) {
    lv_obj_t *first = lv_obj_get_child(huoshan_ai_screen_message_list, 0);
    if (first == NULL) break;
    if (first == huoshan_ai_screen_active_reply_label) huoshan_ai_screen_active_reply_label = NULL;
    lv_obj_delete(first);
    huoshan_ai_screen_message_count--;
  }

  lv_obj_scroll_to_y(huoshan_ai_screen_message_list, LV_COORD_MAX, LV_ANIM_ON);
  return label;
}

void huoshan_ai_screen_set_status(String text) {
  if (!huoshan_ai_screen_ready || huoshan_ai_screen_status_label == NULL) return;
  String displayText = huoshan_ai_screen_sanitize_text(text);
  if (displayText.length() == 0) return;
  if (huoshan_ai_screen_take(pdMS_TO_TICKS(100))) {
    lv_label_set_text(huoshan_ai_screen_status_label, displayText.c_str());
    if (huoshan_ai_screen_wifi_label != NULL) {
      lv_label_set_text(huoshan_ai_screen_wifi_label, WiFi.status() == WL_CONNECTED ? "WiFi" : "--");
    }
    huoshan_ai_screen_give();
  }
}

void huoshan_ai_screen_add_message(String role, String text) {
  if (!huoshan_ai_screen_ready || text.length() == 0) return;
  if (huoshan_ai_screen_take(pdMS_TO_TICKS(200))) {
    huoshan_ai_screen_add_message_locked(role, text);
    huoshan_ai_screen_give();
  }
}

void huoshan_ai_screen_clear_messages() {
  if (!huoshan_ai_screen_ready || huoshan_ai_screen_message_list == NULL) return;
  if (huoshan_ai_screen_take(pdMS_TO_TICKS(200))) {
    while (lv_obj_get_child_count(huoshan_ai_screen_message_list) > 0) {
      lv_obj_delete(lv_obj_get_child(huoshan_ai_screen_message_list, 0));
    }
    huoshan_ai_screen_active_reply_label = NULL;
    huoshan_ai_screen_message_count = 0;
    huoshan_ai_screen_give();
  }
}

void huoshan_ai_screen_on_state(const String &state) {
  huoshan_ai_screen_set_status(huoshan_ai_screen_state_label(state));
  if (!huoshan_ai_screen_ready || huoshan_ai_screen_speak_label == NULL) return;
  if (huoshan_ai_screen_take(pdMS_TO_TICKS(100))) {
    if (state == "listening") {
      lv_label_set_text(huoshan_ai_screen_speak_label, "松开开始对话");
      lv_obj_set_style_bg_color(huoshan_ai_screen_speak_button, lv_color_hex(0xDC2626), 0);
    } else if (state == "recognizing" || state == "thinking" || state == "speaking") {
      lv_label_set_text(huoshan_ai_screen_speak_label, "处理中...");
      lv_obj_set_style_bg_color(huoshan_ai_screen_speak_button, lv_color_hex(0x64748B), 0);
    } else {
      lv_label_set_text(huoshan_ai_screen_speak_label, "按住说话");
      lv_obj_set_style_bg_color(huoshan_ai_screen_speak_button, lv_color_hex(0x059669), 0);
    }
    huoshan_ai_screen_give();
  }
}

void huoshan_ai_screen_on_user_text(const String &text) {
  if (!huoshan_ai_screen_auto_messages) return;
  huoshan_ai_screen_add_message("user", text);
}

void huoshan_ai_screen_on_reply_text(const String &text) {
  if (!huoshan_ai_screen_auto_messages || !huoshan_ai_screen_ready || text.length() == 0) return;
  String displayText = huoshan_ai_screen_sanitize_text(text);
  if (displayText.length() == 0) return;
  if (huoshan_ai_screen_take(pdMS_TO_TICKS(200))) {
    String line = "AI：" + displayText;
    if (huoshan_ai_screen_active_reply_label == NULL) {
      huoshan_ai_screen_active_reply_label = huoshan_ai_screen_add_message_locked("assistant", displayText);
    } else {
      lv_label_set_text(huoshan_ai_screen_active_reply_label, line.c_str());
      lv_obj_scroll_to_y(huoshan_ai_screen_message_list, LV_COORD_MAX, LV_ANIM_ON);
    }
    huoshan_ai_screen_give();
  }
}

void huoshan_ai_screen_config(int width, int height, int brightness) {
  huoshan_ai_screen_set_brightness(brightness);
}

void huoshan_ai_screen_create_ui() {
  huoshan_ai_screen_home = lv_obj_create(NULL);
  lv_obj_set_style_bg_color(huoshan_ai_screen_home, lv_color_hex(0xF8FAFC), 0);
  lv_obj_set_style_text_font(huoshan_ai_screen_home, &HuoshanAI_CN_15, 0);

  lv_obj_t *statusBar = lv_obj_create(lv_layer_top());
  lv_obj_set_size(statusBar, LV_HOR_RES, HUOSHAN_AI_STATUS_BAR_HEIGHT);
  lv_obj_remove_flag(statusBar, LV_OBJ_FLAG_SCROLLABLE);
  lv_obj_set_style_border_width(statusBar, 0, 0);
  lv_obj_set_style_radius(statusBar, 0, 0);
  lv_obj_set_style_bg_color(statusBar, lv_color_hex(0xEA580C), 0);
  lv_obj_set_style_bg_grad_color(statusBar, lv_color_hex(0x2563EB), 0);
  lv_obj_set_style_bg_grad_dir(statusBar, LV_GRAD_DIR_HOR, 0);
  lv_obj_set_style_text_color(statusBar, lv_color_hex(0xFFFFFF), 0);
  lv_obj_set_style_text_font(statusBar, &HuoshanAI_CN_15, 0);
  lv_obj_set_layout(statusBar, LV_LAYOUT_FLEX);
  lv_obj_set_flex_flow(statusBar, LV_FLEX_FLOW_ROW);
  lv_obj_set_flex_align(statusBar, LV_FLEX_ALIGN_SPACE_BETWEEN, LV_FLEX_ALIGN_CENTER, LV_FLEX_ALIGN_CENTER);

  lv_obj_t *title = lv_label_create(statusBar);
  lv_obj_set_style_text_font(title, &HuoshanAI_CN_15, 0);
  lv_label_set_text(title, "火山 AI");
  huoshan_ai_screen_status_label = lv_label_create(statusBar);
  lv_obj_set_style_text_font(huoshan_ai_screen_status_label, &HuoshanAI_CN_15, 0);
  lv_label_set_text(huoshan_ai_screen_status_label, huoshan_ai_screen_state_label(huoshan_ai_state).c_str());
  huoshan_ai_screen_wifi_label = lv_label_create(statusBar);
  lv_obj_set_style_text_font(huoshan_ai_screen_wifi_label, &HuoshanAI_CN_15, 0);
  lv_label_set_text(huoshan_ai_screen_wifi_label, WiFi.status() == WL_CONNECTED ? "WiFi" : "--");

  huoshan_ai_screen_message_list = lv_list_create(huoshan_ai_screen_home);
  lv_obj_set_size(
      huoshan_ai_screen_message_list,
      lv_pct(95),
      LV_VER_RES - HUOSHAN_AI_STATUS_BAR_HEIGHT - HUOSHAN_AI_SPEAK_BUTTON_HEIGHT - 16);
  lv_obj_align(huoshan_ai_screen_message_list, LV_ALIGN_TOP_MID, 0, HUOSHAN_AI_STATUS_BAR_HEIGHT + 6);
  lv_obj_set_style_border_width(huoshan_ai_screen_message_list, 0, 0);
  lv_obj_set_style_radius(huoshan_ai_screen_message_list, 6, 0);
  lv_obj_set_style_bg_color(huoshan_ai_screen_message_list, lv_color_hex(0xFFFFFF), 0);
  lv_obj_set_style_text_font(huoshan_ai_screen_message_list, &HuoshanAI_CN_15, 0);

  huoshan_ai_screen_speak_button = lv_button_create(huoshan_ai_screen_home);
  lv_obj_set_size(huoshan_ai_screen_speak_button, lv_pct(95), HUOSHAN_AI_SPEAK_BUTTON_HEIGHT);
  lv_obj_align(huoshan_ai_screen_speak_button, LV_ALIGN_BOTTOM_MID, 0, -5);
  lv_obj_set_style_bg_color(huoshan_ai_screen_speak_button, lv_color_hex(0x059669), 0);
  lv_obj_set_style_radius(huoshan_ai_screen_speak_button, 6, 0);
  lv_obj_add_event_cb(huoshan_ai_screen_speak_button, huoshan_ai_screen_speak_event, LV_EVENT_ALL, NULL);

  huoshan_ai_screen_speak_label = lv_label_create(huoshan_ai_screen_speak_button);
  lv_obj_set_style_text_font(huoshan_ai_screen_speak_label, &HuoshanAI_CN_15, 0);
  lv_label_set_text(huoshan_ai_screen_speak_label, "按住说话");
  lv_obj_center(huoshan_ai_screen_speak_label);

  lv_screen_load(huoshan_ai_screen_home);
}

bool huoshan_ai_screen_begin(bool touchToTalk, bool autoMessages) {
  huoshan_ai_screen_touch_to_talk = touchToTalk;
  huoshan_ai_screen_auto_messages = autoMessages;
  if (huoshan_ai_screen_ready) return true;

  if (huoshan_ai_screen_lock == NULL) {
    huoshan_ai_screen_lock = xSemaphoreCreateRecursiveMutex();
  }
  if (huoshan_ai_screen_lock == NULL) {
    huoshan_ai_last_error = "Screen mutex failed";
    huoshan_ai_set_state("error");
    return false;
  }

  huoshan_ai_screen_set_brightness(huoshan_ai_screen_brightness);
  lv_init();
  huoshan_ai_screen_touch.begin();
  lv_tick_set_cb(huoshan_ai_screen_tick);

  lv_display_t *disp = lv_tft_espi_create(
      HUOSHAN_AI_SCREEN_WIDTH,
      HUOSHAN_AI_SCREEN_HEIGHT,
      huoshan_ai_screen_draw_buf,
      sizeof(huoshan_ai_screen_draw_buf));
  lv_display_set_rotation(disp, HUOSHAN_AI_SCREEN_ROTATION);

  lv_indev_t *indev = lv_indev_create();
  lv_indev_set_type(indev, LV_INDEV_TYPE_POINTER);
  lv_indev_set_read_cb(indev, huoshan_ai_screen_touch_read);

  if (huoshan_ai_screen_take(portMAX_DELAY)) {
    huoshan_ai_screen_create_ui();
    huoshan_ai_screen_ready = true;
    huoshan_ai_screen_give();
  }

  xTaskCreate(
      huoshan_ai_screen_loop_task,
      "huoshanScreen",
      8192,
      NULL,
      1,
      &huoshan_ai_screen_loop_task_handle);
  return true;
}

#endif
`);

  if (typeof generator.addSetupBegin === 'function') {
    generator.addSetupBegin(
      'huoshan_ai_screen_auto_begin',
      'HuoshanAIVoice.beginScreen(true, true);',
      true
    );
  }
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
  const gain = generator.valueToCode(block, 'GAIN', Arduino.ORDER_ATOMIC) || '4';
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

Arduino.forBlock['huoshan_ai_screen_config'] = function(block, generator) {
  const config = {
    width: huoshanAiScreenField(block, 'WIDTH', HUOSHAN_AI_SCREEN_DEFAULTS.width),
    height: huoshanAiScreenField(block, 'HEIGHT', HUOSHAN_AI_SCREEN_DEFAULTS.height),
    rotation: block.getFieldValue('ROTATION') || HUOSHAN_AI_SCREEN_DEFAULTS.rotation,
    brightness: huoshanAiScreenField(block, 'BRIGHTNESS', HUOSHAN_AI_SCREEN_DEFAULTS.brightness),
    bl: huoshanAiScreenField(block, 'BL', HUOSHAN_AI_SCREEN_DEFAULTS.bl),
    miso: huoshanAiScreenField(block, 'MISO', HUOSHAN_AI_SCREEN_DEFAULTS.miso),
    mosi: huoshanAiScreenField(block, 'MOSI', HUOSHAN_AI_SCREEN_DEFAULTS.mosi),
    sclk: huoshanAiScreenField(block, 'SCLK', HUOSHAN_AI_SCREEN_DEFAULTS.sclk),
    cs: huoshanAiScreenField(block, 'CS', HUOSHAN_AI_SCREEN_DEFAULTS.cs),
    dc: huoshanAiScreenField(block, 'DC', HUOSHAN_AI_SCREEN_DEFAULTS.dc),
    rst: huoshanAiScreenField(block, 'RST', HUOSHAN_AI_SCREEN_DEFAULTS.rst),
    touchSda: huoshanAiScreenField(block, 'TOUCH_SDA', HUOSHAN_AI_SCREEN_DEFAULTS.touchSda),
    touchScl: huoshanAiScreenField(block, 'TOUCH_SCL', HUOSHAN_AI_SCREEN_DEFAULTS.touchScl),
    touchRst: huoshanAiScreenField(block, 'TOUCH_RST', HUOSHAN_AI_SCREEN_DEFAULTS.touchRst),
    touchInt: huoshanAiScreenField(block, 'TOUCH_INT', HUOSHAN_AI_SCREEN_DEFAULTS.touchInt)
  };
  huoshanAiAddScreenMacros(generator, config);
  huoshanAiEnsureScreenRuntime(generator);
  return `HuoshanAIVoice.configScreen(${config.width}, ${config.height}, ${config.brightness});\n`;
};

Arduino.forBlock['huoshan_ai_screen_begin'] = function(block, generator) {
  huoshanAiEnsureScreenRuntime(generator);
  const touchToTalk = block.getFieldValue('TOUCH_TO_TALK') || 'true';
  const autoMessages = block.getFieldValue('AUTO_MESSAGES') || 'true';
  return `HuoshanAIVoice.beginScreen(${touchToTalk}, ${autoMessages});\n`;
};

Arduino.forBlock['huoshan_ai_screen_set_brightness'] = function(block, generator) {
  huoshanAiEnsureScreenRuntime(generator);
  const value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '80';
  return `HuoshanAIVoice.setScreenBrightness(${value});\n`;
};

Arduino.forBlock['huoshan_ai_screen_set_status'] = function(block, generator) {
  huoshanAiEnsureScreenRuntime(generator);
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  return `HuoshanAIVoice.setScreenStatus(${text});\n`;
};

Arduino.forBlock['huoshan_ai_screen_add_message'] = function(block, generator) {
  huoshanAiEnsureScreenRuntime(generator);
  const role = JSON.stringify(block.getFieldValue('ROLE') || 'system');
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  return `HuoshanAIVoice.addScreenMessage(${role}, ${text});\n`;
};

Arduino.forBlock['huoshan_ai_screen_clear_messages'] = function(block, generator) {
  huoshanAiEnsureScreenRuntime(generator);
  return 'HuoshanAIVoice.clearScreenMessages();\n';
};
