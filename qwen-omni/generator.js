// 通义千问Qwen-Omni API库代码生成器

function ensureQwenOmniPlaybackHelpers(generator) {
  ensureQwenOmniI2SHelpers(generator);
  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');
  generator.addLibrary('qwen_heap_caps', '#include <esp_heap_caps.h>');
  generator.addLibrary('qwen_freertos', '#include <freertos/FreeRTOS.h>');
  generator.addLibrary('qwen_freertos_task', '#include <freertos/task.h>');
  generator.addLibrary('qwen_freertos_stream_buffer', '#include <freertos/stream_buffer.h>');

  generator.addVariable('qwen_playback_storage', 'uint8_t* qwen_playback_storage = NULL;');
  generator.addVariable('qwen_playback_stream_struct', 'StaticStreamBuffer_t qwen_playback_stream_struct;');
  generator.addVariable('qwen_playback_stream', 'StreamBufferHandle_t qwen_playback_stream = NULL;');
  generator.addVariable('qwen_playback_task_handle', 'TaskHandle_t qwen_playback_task_handle = NULL;');
  generator.addVariable('qwen_playback_i2s', 'I2SClass* qwen_playback_i2s = NULL;');
  generator.addVariable('qwen_playback_done', 'volatile bool qwen_playback_done = false;');
  generator.addVariable('qwen_playback_total_played', 'volatile size_t qwen_playback_total_played = 0;');
  generator.addVariable('qwen_playback_started', 'bool qwen_playback_started = false;');
  generator.addVariable('qwen_playback_buffered', 'size_t qwen_playback_buffered = 0;');
  generator.addVariable('qwen_playback_sample_rate', 'uint32_t qwen_playback_sample_rate = 24000;');
  generator.addVariable('qwen_playback_bits_per_sample', 'uint16_t qwen_playback_bits_per_sample = 16;');
  generator.addVariable('qwen_playback_channels', 'uint16_t qwen_playback_channels = 1;');

  generator.addFunction('qwen_audio_alloc_buffer', String.raw`
void* qwen_audio_alloc_buffer(size_t len, const char* tag) {
  void* ptr = NULL;
  if (psramFound()) {
    ptr = heap_caps_malloc(len, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
  }
  if (!ptr) {
    ptr = heap_caps_malloc(len, MALLOC_CAP_8BIT);
  }
  if (!ptr) {
    Serial.println("[QWEN-AUDIO] alloc failed: " + String(tag) + " " + String(len));
  }
  return ptr;
}

size_t qwen_base64_encoded_len(size_t len) {
  return ((len + 2) / 3) * 4;
}`);

  generator.addFunction('qwen_stream_playback_helpers', String.raw`
#define QWEN_PLAYBACK_BUFFER_SIZE 196608
#define QWEN_PLAYBACK_PREBUFFER_SIZE 48000
#define QWEN_PLAYBACK_CHUNK_SIZE 2048
#define QWEN_DECODE_BUF_SIZE 16384

bool qwen_i2s_prepare_es8311_playback(I2SClass &i2s, uint32_t sampleRate, i2s_data_bit_width_t bitWidth, i2s_slot_mode_t slotMode);

void qwen_play_prompt_tone(I2SClass &i2s, int freq, int durationMs) {
  const uint32_t toneRate = 16000;
  if (!qwen_i2s_prepare_es8311_playback(i2s, toneRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO)) {
    if (qwen_i2s_speaker_bclk_pin >= 0 && qwen_i2s_speaker_lrclk_pin >= 0 && qwen_i2s_speaker_din_pin >= 0) {
      i2s.end();
      delay(20);
      i2s.setPins(qwen_i2s_speaker_bclk_pin, qwen_i2s_speaker_lrclk_pin, qwen_i2s_speaker_din_pin, -1, -1);
      i2s.begin(I2S_MODE_STD, toneRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO, I2S_STD_SLOT_BOTH);
    } else {
      i2s.end();
      delay(20);
      i2s.begin(I2S_MODE_STD, toneRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO, I2S_STD_SLOT_BOTH);
    }
  } else if (qwen_i2s_mic_mode != 3 && qwen_i2s_speaker_bclk_pin >= 0 && qwen_i2s_speaker_lrclk_pin >= 0 && qwen_i2s_speaker_din_pin >= 0) {
    i2s.end();
    delay(20);
    i2s.setPins(qwen_i2s_speaker_bclk_pin, qwen_i2s_speaker_lrclk_pin, qwen_i2s_speaker_din_pin, -1, -1);
    i2s.begin(I2S_MODE_STD, toneRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO, I2S_STD_SLOT_BOTH);
  }
  size_t samples = toneRate * durationMs / 1000;
  int16_t* buf = (int16_t*)malloc(samples * sizeof(int16_t));
  if (!buf) {
    Serial.println("[QWEN-AUDIO] prompt tone alloc failed");
    return;
  }
  for (size_t i = 0; i < samples; i++) {
    float t = (float)i / toneRate;
    buf[i] = (int16_t)(sin(2.0f * 3.1415926f * freq * t) * 7000);
  }
  size_t bytes = samples * sizeof(int16_t);
  size_t written = 0;
  unsigned long startMs = millis();
  while (written < bytes) {
    if (millis() - startMs > (unsigned long)(durationMs + 1000)) {
      Serial.println("[QWEN-AUDIO] prompt tone timeout");
      break;
    }
    size_t n = i2s.write((uint8_t*)buf + written, bytes - written);
    if (n == 0) delay(1);
    else written += n;
  }
  free(buf);
  delay(durationMs + 20);
  Serial.println("[QWEN-AUDIO] prompt tone done, bytes: " + String(written));
}

void qwen_playback_task_entry(void* param) {
  uint8_t chunk[QWEN_PLAYBACK_CHUNK_SIZE];
  while (!qwen_playback_done || xStreamBufferBytesAvailable(qwen_playback_stream) > 0) {
    size_t n = xStreamBufferReceive(qwen_playback_stream, chunk, sizeof(chunk), pdMS_TO_TICKS(20));
    if (n == 0) {
      delay(1);
      continue;
    }
    size_t writtenTotal = 0;
    while (writtenTotal < n) {
      if (!qwen_playback_i2s) break;
      size_t written = qwen_playback_i2s->write(chunk + writtenTotal, n - writtenTotal);
      if (written == 0) {
        delay(1);
      } else {
        writtenTotal += written;
        qwen_playback_total_played += written;
      }
    }
    delay(0);
  }
  qwen_playback_task_handle = NULL;
  vTaskDelete(NULL);
}

bool qwen_prepare_stream_playback(I2SClass &i2s) {
  qwen_playback_i2s = &i2s;
  qwen_playback_done = false;
  qwen_playback_total_played = 0;
  qwen_playback_started = false;
  qwen_playback_buffered = 0;
  qwen_playback_sample_rate = 24000;
  qwen_playback_bits_per_sample = 16;
  qwen_playback_channels = 1;

  if (!qwen_playback_storage) {
    qwen_playback_storage = (uint8_t*)qwen_audio_alloc_buffer(QWEN_PLAYBACK_BUFFER_SIZE, "playback-stream");
    if (!qwen_playback_storage) return false;
  }

  if (!qwen_playback_stream) {
    qwen_playback_stream = xStreamBufferCreateStatic(
      QWEN_PLAYBACK_BUFFER_SIZE, 1, qwen_playback_storage, &qwen_playback_stream_struct);
  } else {
    xStreamBufferReset(qwen_playback_stream);
  }

  if (!qwen_playback_stream) {
    Serial.println("[QWEN-AUDIO] stream buffer create failed");
    return false;
  }
  return true;
}

bool qwen_start_stream_playback() {
  if (qwen_playback_started) return true;
  if (!qwen_playback_i2s) return false;

  qwen_playback_i2s->end();
  i2s_data_bit_width_t bitWidth = (qwen_playback_bits_per_sample == 32) ? I2S_DATA_BIT_WIDTH_32BIT : I2S_DATA_BIT_WIDTH_16BIT;
  i2s_slot_mode_t slotMode = (qwen_playback_channels == 2) ? I2S_SLOT_MODE_STEREO : I2S_SLOT_MODE_MONO;
  bool ok = qwen_i2s_prepare_es8311_playback(*qwen_playback_i2s, qwen_playback_sample_rate, bitWidth, slotMode);
  if (ok && !(qwen_i2s_mic_mode == 3 && qwen_i2s_mic_es8311_dac_pin >= 0)) {
    ok = qwen_playback_i2s->begin(I2S_MODE_STD, qwen_playback_sample_rate, bitWidth, slotMode, I2S_STD_SLOT_BOTH);
  }
  if (!ok) {
    Serial.println("[QWEN-AUDIO] I2S begin failed");
    return false;
  }

  BaseType_t taskOk = xTaskCreate(
    qwen_playback_task_entry, "qwen_tts_play", 4096, NULL, 3, &qwen_playback_task_handle);
  if (taskOk != pdPASS) {
    qwen_playback_task_handle = NULL;
    Serial.println("[QWEN-AUDIO] playback task create failed");
    return false;
  }

  qwen_playback_started = true;
  Serial.println("[QWEN-AUDIO] prebuffer ready, play");
  return true;
}

bool qwen_queue_stream_playback(const uint8_t* data, size_t len) {
  if (!qwen_playback_stream || len == 0) return false;

  size_t sentTotal = 0;
  while (sentTotal < len) {
    size_t toSend = min((size_t)4096, len - sentTotal);
    size_t sent = xStreamBufferSend(
      qwen_playback_stream, data + sentTotal, toSend, pdMS_TO_TICKS(3000));
    if (sent == 0) {
      Serial.println("[QWEN-AUDIO] playback buffer timeout");
      return false;
    }

    sentTotal += sent;
    qwen_playback_buffered += sent;
    if (!qwen_playback_started && qwen_playback_buffered >= QWEN_PLAYBACK_PREBUFFER_SIZE) {
      if (!qwen_start_stream_playback()) return false;
    }
  }
  return true;
}

size_t qwen_finish_stream_playback() {
  if (qwen_playback_stream && !qwen_playback_started && qwen_playback_buffered > 0) {
    qwen_start_stream_playback();
  }
  qwen_playback_done = true;
  unsigned long startMs = millis();
  while (qwen_playback_task_handle && millis() - startMs < 60000) {
    delay(10);
  }
  if (qwen_playback_task_handle) {
    Serial.println("[QWEN-AUDIO] wait playback timeout");
  }
  return qwen_playback_total_played;
}

void qwen_play_decoded_audio(I2SClass &i2s, uint8_t* decodeBuf, size_t outLen, bool &headerParsed, size_t &queuedAudio) {
  if (outLen == 0) return;

  uint8_t* pcmPtr = decodeBuf;
  size_t playLen = outLen;
  if (!headerParsed) {
    if (outLen > 44 && decodeBuf[0] == 'R' && decodeBuf[1] == 'I' && decodeBuf[2] == 'F' && decodeBuf[3] == 'F') {
      int hdrLen = 44;
      int fmtSize = decodeBuf[16] | (decodeBuf[17] << 8) | (decodeBuf[18] << 16) | (decodeBuf[19] << 24);
      if (fmtSize > 16) hdrLen = 44 + (fmtSize - 16);
      qwen_playback_channels = decodeBuf[22] | (decodeBuf[23] << 8);
      qwen_playback_sample_rate = decodeBuf[24] | (decodeBuf[25] << 8) | (decodeBuf[26] << 16) | (decodeBuf[27] << 24);
      qwen_playback_bits_per_sample = decodeBuf[34] | (decodeBuf[35] << 8);
      if (hdrLen < (int)outLen) {
        pcmPtr = decodeBuf + hdrLen;
        playLen = outLen - hdrLen;
      } else {
        playLen = 0;
      }
      Serial.println("[QWEN-AUDIO] WAV: " + String(qwen_playback_sample_rate) + "Hz " + String(qwen_playback_bits_per_sample) + "bit " + String(qwen_playback_channels) + "ch");
    } else {
      qwen_playback_sample_rate = 24000;
      qwen_playback_bits_per_sample = 16;
      qwen_playback_channels = 1;
      Serial.println("[QWEN-AUDIO] PCM: 24000Hz 16bit mono");
    }
    headerParsed = true;
  }

  if (playLen > 0 && qwen_queue_stream_playback(pcmPtr, playLen)) {
    queuedAudio += playLen;
  }
}

void qwen_decode_and_queue_base64(I2SClass &i2s, String &b64Data, uint8_t* decodeBuf, bool &headerParsed, size_t &queuedAudio) {
  if (b64Data.length() == 0) return;
  while ((b64Data.length() % 4) != 0) b64Data += "=";

  const size_t maxB64In = (QWEN_DECODE_BUF_SIZE / 3) * 4;
  size_t offset = 0;
  while (offset < b64Data.length()) {
    size_t remaining = b64Data.length() - offset;
    size_t partLen = min(maxB64In, remaining);
    if (partLen < remaining) {
      partLen = (partLen / 4) * 4;
    }
    if (partLen == 0) break;

    size_t outLen = 0;
    int ret = mbedtls_base64_decode(
      decodeBuf, QWEN_DECODE_BUF_SIZE, &outLen, (const unsigned char*)b64Data.c_str() + offset, partLen);
    if (ret == 0) {
      qwen_play_decoded_audio(i2s, decodeBuf, outLen, headerParsed, queuedAudio);
    } else {
      Serial.println("[QWEN-AUDIO] base64 decode failed: " + String(ret));
    }
    offset += partLen;
  }
}

bool qwen_play_base64_audio_to_i2s(I2SClass &i2s, String base64Audio) {
  Serial.println("[QWEN-AUDIO] play base64 len: " + String(base64Audio.length()));
  if (base64Audio.length() == 0 || base64Audio.startsWith("URL:")) {
    qwen_last_success = false;
    qwen_last_error = base64Audio.startsWith("URL:") ? "URL audio needs URL player" : "Empty audio";
    return false;
  }

  if (!qwen_prepare_stream_playback(i2s)) {
    qwen_last_success = false;
    qwen_last_error = "Playback buffer init failed";
    return false;
  }

  uint8_t* decodeBuf = (uint8_t*)qwen_audio_alloc_buffer(QWEN_DECODE_BUF_SIZE, "decode");
  if (!decodeBuf) {
    qwen_playback_done = true;
    qwen_last_success = false;
    qwen_last_error = "Decode alloc failed";
    return false;
  }

  bool headerParsed = false;
  size_t queuedAudio = 0;
  String cleanAudio = qwen_sanitize_base64(base64Audio);
  qwen_decode_and_queue_base64(i2s, cleanAudio, decodeBuf, headerParsed, queuedAudio);
  free(decodeBuf);
  size_t played = qwen_finish_stream_playback();

  qwen_last_success = played > 0;
  qwen_last_error = played > 0 ? "" : "No audio data";
  Serial.println("[QWEN-AUDIO] queued: " + String(queuedAudio) + ", played: " + String(played));
  return played > 0;
}`);

  generator.addFunction('qwen_sse_audio_sink', String.raw`
class QwenSseAudioSink : public Stream {
public:
  QwenSseAudioSink(I2SClass &i2s, uint8_t* decodeBuf, String* fullText, size_t &queuedAudio)
    : i2s_(i2s), decodeBuf_(decodeBuf), fullText_(fullText), queuedAudio_(queuedAudio), done_(false), headerParsed_(false) {
  }

  int available() override { return 0; }
  int read() override { return -1; }
  int peek() override { return -1; }
  void flush() override {}

  size_t write(uint8_t b) override {
    if (!done_) {
      char c = (char)b;
      if (c == '\n') {
        processLine();
      } else if (c != '\r') {
        lineBuf_ += c;
      }
    }
    return 1;
  }

  size_t write(const uint8_t* buffer, size_t size) override {
    for (size_t i = 0; i < size; i++) write(buffer[i]);
    return size;
  }

private:
  I2SClass &i2s_;
  uint8_t* decodeBuf_;
  String* fullText_;
  size_t &queuedAudio_;
  String lineBuf_;
  bool done_;
  bool headerParsed_;

  void processLine() {
    lineBuf_.trim();
    if (!lineBuf_.startsWith("data:")) {
      lineBuf_ = "";
      return;
    }

    String data = lineBuf_.substring(5);
    data.trim();
    lineBuf_ = "";

    if (data == "[DONE]") {
      done_ = true;
      return;
    }

    if (data.indexOf("\"error\"") >= 0) {
      String marker = "\"message\":\"";
      int start = data.indexOf(marker);
      if (start >= 0) {
        start += marker.length();
        int end = data.indexOf("\"", start);
        qwen_last_error = (end > start) ? data.substring(start, end) : data.substring(0, min((int)data.length(), 240));
      } else {
        qwen_last_error = data.substring(0, min((int)data.length(), 240));
      }
      Serial.println("[QWEN-AUDIO] API error: " + qwen_last_error);
      done_ = true;
      return;
    }

    int contentStart = data.indexOf("\"content\":\"");
    if (contentStart >= 0) {
      contentStart += 11;
      int contentEnd = data.indexOf("\"", contentStart);
      if (contentEnd > contentStart) {
        String content = data.substring(contentStart, contentEnd);
        Serial.print(content);
        if (fullText_ != NULL) *fullText_ += content;
        if (qwen_stream_callback != NULL) {
          qwen_stream_chunk = content;
          qwen_stream_callback();
        }
      }
    }

    int audioObj = data.indexOf("\"audio\"");
    if (audioObj >= 0) {
      String audioMarker = "\"data\":\"";
      int audioPos = data.indexOf(audioMarker, audioObj);
      if (audioPos >= 0) {
        audioPos += audioMarker.length();
        int audioEnd = data.indexOf("\"", audioPos);
        if (audioEnd > audioPos) {
          String b64Data = qwen_sanitize_base64(data.substring(audioPos, audioEnd));
          qwen_decode_and_queue_base64(i2s_, b64Data, decodeBuf_, headerParsed_, queuedAudio_);
        }
      }
    }
  }
};

size_t qwen_stream_http_audio_to_i2s(HTTPClient &http, I2SClass &i2s, String *fullText, const char* tag) {
  if (!qwen_prepare_stream_playback(i2s)) {
    qwen_last_error = "Playback buffer init failed";
    return 0;
  }

  uint8_t* decodeBuf = (uint8_t*)qwen_audio_alloc_buffer(QWEN_DECODE_BUF_SIZE, "decode");
  if (!decodeBuf) {
    qwen_playback_done = true;
    qwen_last_error = "Decode alloc failed";
    return 0;
  }

  size_t queuedAudio = 0;
  QwenSseAudioSink sink(i2s, decodeBuf, fullText, queuedAudio);
  int streamResult = http.writeToStream(&sink);
  if (streamResult < 0) {
    qwen_last_error = HTTPClient::errorToString(streamResult);
    Serial.println(String("[") + tag + "] stream error: " + qwen_last_error);
  }

  free(decodeBuf);
  size_t played = qwen_finish_stream_playback();
  Serial.println(String("[") + tag + "] queued: " + String(queuedAudio) + ", played: " + String(played));
  return played;
}`);
}


function ensureQwenOmniUploadHelpers(generator) {
  ensureQwenOmniPlaybackHelpers(generator);

  generator.addFunction('qwen_base64_json_stream', String.raw`
class QwenBase64JsonStream : public Stream {
public:
  QwenBase64JsonStream(const String& prefix, const uint8_t* data, size_t dataLen, const String& suffix)
    : prefix_(prefix), data_(data), dataLen_(dataLen), suffix_(suffix), pos_(0) {
    b64Len_ = qwen_base64_encoded_len(dataLen_);
    totalLen_ = prefix_.length() + b64Len_ + suffix_.length();
  }

  size_t contentLength() const { return totalLen_; }
  int available() override {
    size_t left = totalLen_ - pos_;
    return left > 0x7fffffff ? 0x7fffffff : (int)left;
  }
  int read() override {
    if (pos_ >= totalLen_) return -1;
    char ch = charAt(pos_);
    pos_++;
    return (uint8_t)ch;
  }
  int peek() override {
    if (pos_ >= totalLen_) return -1;
    return (uint8_t)charAt(pos_);
  }
  void flush() override {}
  size_t write(uint8_t) override { return 0; }

private:
  String prefix_;
  const uint8_t* data_;
  size_t dataLen_;
  String suffix_;
  size_t b64Len_;
  size_t totalLen_;
  size_t pos_;

  char charAt(size_t absolutePos) const {
    size_t prefixLen = prefix_.length();
    if (absolutePos < prefixLen) return prefix_.charAt(absolutePos);

    size_t b64Pos = absolutePos - prefixLen;
    if (b64Pos < b64Len_) return base64CharAt(b64Pos);
    return suffix_.charAt(b64Pos - b64Len_);
  }

  char base64CharAt(size_t b64Pos) const {
    static const char alphabet[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    size_t group = b64Pos / 4;
    size_t slot = b64Pos % 4;
    size_t src = group * 3;
    size_t remain = dataLen_ - src;
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
};`);
}

function qwenOmniI2SKey(varName) {
  return String(varName).replace(/[^A-Za-z0-9_]/g, '_');
}

function qwenOmniVoiceChatPromptCode(prompt) {
  const promptCode = String(prompt || '""').trim();
  if (promptCode === '"请描述一下你听到的内容"' || promptCode === "'请描述一下你听到的内容'") {
    return '"请用简短友好的方式回答，适合语音播报"';
  }
  return promptCode;
}

function ensureQwenOmniI2SObject(generator, varName) {
  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addVariable('I2SClass_' + qwenOmniI2SKey(varName), 'I2SClass ' + varName + ';');
}

function ensureQwenOmniI2SHelpers(generator) {
  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('qwen_math', '#include <math.h>');
  generator.addVariable('qwen_i2s_mic_bclk_pin', 'int qwen_i2s_mic_bclk_pin = -1;');
  generator.addVariable('qwen_i2s_mic_lrclk_pin', 'int qwen_i2s_mic_lrclk_pin = -1;');
  generator.addVariable('qwen_i2s_mic_sd_pin', 'int qwen_i2s_mic_sd_pin = -1;');
  generator.addVariable('qwen_i2s_speaker_bclk_pin', 'int qwen_i2s_speaker_bclk_pin = -1;');
  generator.addVariable('qwen_i2s_speaker_lrclk_pin', 'int qwen_i2s_speaker_lrclk_pin = -1;');
  generator.addVariable('qwen_i2s_speaker_din_pin', 'int qwen_i2s_speaker_din_pin = -1;');
  generator.addVariable('qwen_i2s_mic_mode', 'int qwen_i2s_mic_mode = 0;');
  generator.addVariable('qwen_i2s_mic_pdm_clk_pin', 'int qwen_i2s_mic_pdm_clk_pin = -1;');
  generator.addVariable('qwen_i2s_mic_pdm_din_pin', 'int qwen_i2s_mic_pdm_din_pin = -1;');
  generator.addVariable('qwen_i2s_mic_es8311_sda_pin', 'int qwen_i2s_mic_es8311_sda_pin = -1;');
  generator.addVariable('qwen_i2s_mic_es8311_scl_pin', 'int qwen_i2s_mic_es8311_scl_pin = -1;');
  generator.addVariable('qwen_i2s_mic_es8311_addr', 'uint8_t qwen_i2s_mic_es8311_addr = 0x18;');
  generator.addVariable('qwen_i2s_mic_es8311_mclk_pin', 'int qwen_i2s_mic_es8311_mclk_pin = -1;');
  generator.addVariable('qwen_i2s_mic_es8311_dac_pin', 'int qwen_i2s_mic_es8311_dac_pin = -1;');
  generator.addVariable('qwen_i2s_mic_es8311_pa_pin', 'int qwen_i2s_mic_es8311_pa_pin = -1;');
  generator.addVariable('qwen_i2s_mic_es8311_gain_reg', 'uint8_t qwen_i2s_mic_es8311_gain_reg = 0x24;');
  generator.addFunction('qwen_i2s_audio_helpers', String.raw`
void qwen_es8311_set_pa(int paPin, bool enabled) {
  if (paPin < 0) return;
  pinMode(paPin, OUTPUT);
  digitalWrite(paPin, enabled ? HIGH : LOW);
  Serial.println("[ES8311] PA_EN pin " + String(paPin) + (enabled ? " HIGH" : " LOW"));
}

bool qwen_es8311_write_reg(uint8_t address, uint8_t reg, uint8_t value) {
  Wire.beginTransmission(address);
  Wire.write(reg);
  Wire.write(value);
  return Wire.endTransmission() == 0;
}

int qwen_es8311_read_reg(uint8_t address, uint8_t reg) {
  Wire.beginTransmission(address);
  Wire.write(reg);
  if (Wire.endTransmission(false) != 0) return -1;
  if (Wire.requestFrom((int)address, 1) != 1) return -1;
  return Wire.read();
}

bool qwen_es8311_config_clock(uint8_t address, uint32_t sampleRate, bool useMclk) {
  uint32_t mclk = sampleRate * 256;
  uint8_t preDiv = 1;
  uint8_t preMulti = 1;
  uint8_t adcDiv = 1;
  uint8_t dacDiv = 1;
  uint8_t fsMode = 0;
  uint8_t lrckH = 0x00;
  uint8_t lrckL = 0xFF;
  uint8_t bclkDiv = 4;
  uint8_t adcOsr = 0x10;
  uint8_t dacOsr = 0x10;

  if (!useMclk) {
    mclk = 0;
  } else {
    preDiv = 1;
    preMulti = 1;
  }

  uint8_t multiBits = 0;
  if (preMulti == 2) multiBits = 1;
  else if (preMulti == 4) multiBits = 2;
  else if (preMulti == 8) multiBits = 3;

  bool ok = true;
  uint8_t reg02 = (useMclk ? 0x00 : 0x80) | ((preDiv - 1) << 5) | (multiBits << 3);
  ok &= qwen_es8311_write_reg(address, 0x02, reg02);
  ok &= qwen_es8311_write_reg(address, 0x05, ((adcDiv - 1) << 4) | (dacDiv - 1));
  ok &= qwen_es8311_write_reg(address, 0x03, (fsMode << 6) | adcOsr);
  ok &= qwen_es8311_write_reg(address, 0x04, dacOsr);
  ok &= qwen_es8311_write_reg(address, 0x07, lrckH);
  ok &= qwen_es8311_write_reg(address, 0x08, lrckL);
  ok &= qwen_es8311_write_reg(address, 0x06, (bclkDiv < 19) ? (bclkDiv - 1) : bclkDiv);

  Serial.println("[ES8311] clock config rate=" + String(sampleRate) + " mclk=" + String(mclk) + " reg02=" + String(reg02, HEX));
  return ok;
}

bool qwen_es8311_begin(uint8_t address, int sdaPin, int sclPin, uint8_t micGainReg, bool useMclk) {
  Serial.println("[ES8311] codec begin");
  Wire.begin(sdaPin, sclPin);
  Wire.setClock(100000);
  delay(20);

  bool ok = true;
  ok &= qwen_es8311_write_reg(address, 0x00, 0x80);
  delay(20);
  ok &= qwen_es8311_write_reg(address, 0x01, 0x30);
  ok &= qwen_es8311_write_reg(address, 0x02, 0x00);
  ok &= qwen_es8311_write_reg(address, 0x03, 0x10);
  ok &= qwen_es8311_write_reg(address, 0x16, 0x24);
  ok &= qwen_es8311_write_reg(address, 0x04, 0x10);
  ok &= qwen_es8311_write_reg(address, 0x05, 0x00);
  ok &= qwen_es8311_write_reg(address, 0x0B, 0x00);
  ok &= qwen_es8311_write_reg(address, 0x0C, 0x00);
  ok &= qwen_es8311_write_reg(address, 0x10, 0x1F);
  ok &= qwen_es8311_write_reg(address, 0x11, 0x7F);
  ok &= qwen_es8311_write_reg(address, 0x00, 0x80);
  ok &= qwen_es8311_write_reg(address, 0x00, 0x80);
  ok &= qwen_es8311_write_reg(address, 0x01, useMclk ? 0x3F : 0xBF);
  ok &= qwen_es8311_write_reg(address, 0x02, 0x00);
  ok &= qwen_es8311_write_reg(address, 0x03, 0x10);
  ok &= qwen_es8311_write_reg(address, 0x04, 0x10);
  ok &= qwen_es8311_write_reg(address, 0x05, 0x00);
  ok &= qwen_es8311_write_reg(address, 0x06, 0x03);
  ok &= qwen_es8311_write_reg(address, 0x07, 0x00);
  ok &= qwen_es8311_write_reg(address, 0x08, 0xFF);
  ok &= qwen_es8311_write_reg(address, 0x09, 0x0C);
  ok &= qwen_es8311_write_reg(address, 0x0A, 0x0C);
  ok &= qwen_es8311_write_reg(address, 0x13, 0x10);
  ok &= qwen_es8311_write_reg(address, 0x1B, 0x0A);
  ok &= qwen_es8311_write_reg(address, 0x1C, 0x6A);
  ok &= qwen_es8311_write_reg(address, 0x44, 0x08);
  ok &= qwen_es8311_write_reg(address, 0x31, 0x00);
  ok &= qwen_es8311_write_reg(address, 0x32, 0xC0);
  ok &= qwen_es8311_write_reg(address, 0x17, 0xBF);
  ok &= qwen_es8311_write_reg(address, 0x0E, 0x02);
  ok &= qwen_es8311_write_reg(address, 0x12, 0x00);
  ok &= qwen_es8311_write_reg(address, 0x14, 0x1A);
  ok &= qwen_es8311_write_reg(address, 0x0D, 0x01);
  ok &= qwen_es8311_write_reg(address, 0x15, 0x40);
  ok &= qwen_es8311_write_reg(address, 0x16, micGainReg);
  ok &= qwen_es8311_write_reg(address, 0x37, 0x08);
  ok &= qwen_es8311_write_reg(address, 0x45, 0x00);
  ok &= qwen_es8311_config_clock(address, 16000, useMclk);

  Serial.println("[ES8311] DAC enabled, volume 192");
  Serial.println("[ES8311] clock source: " + String(useMclk ? "MCLK" : "BCLK/LRCLK"));
  Serial.println("[ES8311] reg09=" + String(qwen_es8311_read_reg(address, 0x09), HEX) + " reg31=" + String(qwen_es8311_read_reg(address, 0x31), HEX) + " reg32=" + String(qwen_es8311_read_reg(address, 0x32), HEX));
  Serial.println(ok ? "[ES8311] codec ready" : "[ES8311] codec begin failed");
  return ok;
}

bool qwen_i2s_begin_speaker(I2SClass &i2s, int bclkPin, int lrclkPin, int dinPin, uint32_t sampleRate) {
  Serial.println("[I2S] speaker begin");
  qwen_i2s_speaker_bclk_pin = bclkPin;
  qwen_i2s_speaker_lrclk_pin = lrclkPin;
  qwen_i2s_speaker_din_pin = dinPin;
  i2s.end();
  i2s.setPins(bclkPin, lrclkPin, dinPin, -1, -1);
  bool ok = i2s.begin(I2S_MODE_STD, sampleRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO, I2S_STD_SLOT_BOTH);
  Serial.println(ok ? "[I2S] speaker ready" : "[I2S] speaker begin failed");
  return ok;
}

bool qwen_i2s_begin_microphone(I2SClass &i2s, int bclkPin, int lrclkPin, int sdPin, uint32_t sampleRate) {
  Serial.println("[I2S] microphone begin");
  qwen_i2s_mic_bclk_pin = bclkPin;
  qwen_i2s_mic_lrclk_pin = lrclkPin;
  qwen_i2s_mic_sd_pin = sdPin;
  qwen_i2s_mic_mode = 1;
  qwen_i2s_mic_pdm_clk_pin = -1;
  qwen_i2s_mic_pdm_din_pin = -1;
  qwen_i2s_mic_es8311_sda_pin = -1;
  qwen_i2s_mic_es8311_scl_pin = -1;
  qwen_i2s_mic_es8311_mclk_pin = -1;
  qwen_i2s_mic_es8311_dac_pin = -1;
  qwen_i2s_mic_es8311_pa_pin = -1;
  i2s.end();
  i2s.setPins(bclkPin, lrclkPin, -1, sdPin, -1);
  bool ok = i2s.begin(I2S_MODE_STD, sampleRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO, I2S_STD_SLOT_BOTH);
  Serial.println(ok ? "[I2S] microphone ready" : "[I2S] microphone begin failed");
  return ok;
}

bool qwen_i2s_begin_pdm_microphone(I2SClass &i2s, int clkPin, int dinPin, uint32_t sampleRate) {
  Serial.println("[I2S] PDM microphone begin");
#if defined(SOC_I2S_SUPPORTS_PDM_RX) && SOC_I2S_SUPPORTS_PDM_RX
  qwen_i2s_mic_bclk_pin = -1;
  qwen_i2s_mic_lrclk_pin = -1;
  qwen_i2s_mic_sd_pin = -1;
  qwen_i2s_mic_mode = 2;
  qwen_i2s_mic_pdm_clk_pin = clkPin;
  qwen_i2s_mic_pdm_din_pin = dinPin;
  qwen_i2s_mic_es8311_sda_pin = -1;
  qwen_i2s_mic_es8311_scl_pin = -1;
  qwen_i2s_mic_es8311_mclk_pin = -1;
  qwen_i2s_mic_es8311_dac_pin = -1;
  i2s.end();
  delay(20);
  i2s.setPinsPdmRx(clkPin, dinPin);
  bool ok = i2s.begin(I2S_MODE_PDM_RX, sampleRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO);
  Serial.println(ok ? "[I2S] PDM microphone ready" : "[I2S] PDM microphone begin failed");
  return ok;
#else
  Serial.println("[I2S] PDM RX is not supported on this board/core");
  return false;
#endif
}

bool qwen_i2s_begin_es8311_microphone(I2SClass &i2s, int sdaPin, int sclPin, uint8_t address, int bclkPin, int lrclkPin, int sdoutPin, int mclkPin, uint32_t sampleRate, uint8_t micGainReg) {
  Serial.println("[I2S] ES8311 microphone begin");
  qwen_i2s_mic_bclk_pin = bclkPin;
  qwen_i2s_mic_lrclk_pin = lrclkPin;
  qwen_i2s_mic_sd_pin = sdoutPin;
  qwen_i2s_mic_mode = 3;
  qwen_i2s_mic_pdm_clk_pin = -1;
  qwen_i2s_mic_pdm_din_pin = -1;
  qwen_i2s_mic_es8311_sda_pin = sdaPin;
  qwen_i2s_mic_es8311_scl_pin = sclPin;
  qwen_i2s_mic_es8311_addr = address;
  qwen_i2s_mic_es8311_mclk_pin = mclkPin;
  qwen_i2s_mic_es8311_dac_pin = -1;
  qwen_i2s_mic_es8311_pa_pin = -1;
  qwen_i2s_mic_es8311_gain_reg = micGainReg;

  bool codecOk = qwen_es8311_begin(address, sdaPin, sclPin, micGainReg, mclkPin >= 0);
  codecOk &= qwen_es8311_config_clock(address, sampleRate, mclkPin >= 0);
  i2s.end();
  delay(20);
  i2s.setPins(bclkPin, lrclkPin, -1, sdoutPin, mclkPin);
  bool i2sOk = i2s.begin(I2S_MODE_STD, sampleRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO, I2S_STD_SLOT_BOTH);
  Serial.println((codecOk && i2sOk) ? "[I2S] ES8311 microphone ready" : "[I2S] ES8311 microphone begin failed");
  return codecOk && i2sOk;
}

bool qwen_i2s_begin_es8311_audio(I2SClass &i2s, int sdaPin, int sclPin, uint8_t address, int bclkPin, int lrclkPin, int dacDinPin, int adcDoutPin, int mclkPin, uint32_t sampleRate, uint8_t micGainReg, int paPin) {
  Serial.println("[I2S] ES8311 audio codec begin");
  qwen_i2s_mic_bclk_pin = bclkPin;
  qwen_i2s_mic_lrclk_pin = lrclkPin;
  qwen_i2s_mic_sd_pin = adcDoutPin;
  qwen_i2s_mic_mode = 3;
  qwen_i2s_mic_pdm_clk_pin = -1;
  qwen_i2s_mic_pdm_din_pin = -1;
  qwen_i2s_mic_es8311_sda_pin = sdaPin;
  qwen_i2s_mic_es8311_scl_pin = sclPin;
  qwen_i2s_mic_es8311_addr = address;
  qwen_i2s_mic_es8311_mclk_pin = mclkPin;
  qwen_i2s_mic_es8311_dac_pin = dacDinPin;
  qwen_i2s_mic_es8311_pa_pin = paPin;
  qwen_i2s_mic_es8311_gain_reg = micGainReg;

  bool codecOk = qwen_es8311_begin(address, sdaPin, sclPin, micGainReg, mclkPin >= 0);
  codecOk &= qwen_es8311_config_clock(address, sampleRate, mclkPin >= 0);
  qwen_es8311_set_pa(paPin, true);
  i2s.end();
  delay(20);
  i2s.setPins(bclkPin, lrclkPin, dacDinPin, adcDoutPin, mclkPin);
  bool i2sOk = i2s.begin(I2S_MODE_STD, sampleRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO, I2S_STD_SLOT_BOTH);
  Serial.println((codecOk && i2sOk) ? "[I2S] ES8311 audio codec ready" : "[I2S] ES8311 audio codec begin failed");
  return codecOk && i2sOk;
}

bool qwen_i2s_prepare_es8311_playback(I2SClass &i2s, uint32_t sampleRate, i2s_data_bit_width_t bitWidth, i2s_slot_mode_t slotMode) {
  if (qwen_i2s_mic_mode != 3 || qwen_i2s_mic_es8311_dac_pin < 0) return true;
  if (qwen_i2s_mic_es8311_sda_pin < 0 || qwen_i2s_mic_es8311_scl_pin < 0 || qwen_i2s_mic_bclk_pin < 0 || qwen_i2s_mic_lrclk_pin < 0) return false;

  bool codecOk = qwen_es8311_begin(qwen_i2s_mic_es8311_addr, qwen_i2s_mic_es8311_sda_pin, qwen_i2s_mic_es8311_scl_pin, qwen_i2s_mic_es8311_gain_reg, qwen_i2s_mic_es8311_mclk_pin >= 0);
  codecOk &= qwen_es8311_config_clock(qwen_i2s_mic_es8311_addr, sampleRate, qwen_i2s_mic_es8311_mclk_pin >= 0);
  qwen_es8311_set_pa(qwen_i2s_mic_es8311_pa_pin, true);
  i2s.end();
  delay(20);
  i2s.setPins(qwen_i2s_mic_bclk_pin, qwen_i2s_mic_lrclk_pin, qwen_i2s_mic_es8311_dac_pin, qwen_i2s_mic_sd_pin, qwen_i2s_mic_es8311_mclk_pin);
  bool i2sOk = i2s.begin(I2S_MODE_STD, sampleRate, bitWidth, slotMode, I2S_STD_SLOT_BOTH);
  Serial.println((codecOk && i2sOk) ? "[I2S] ES8311 playback ready" : "[I2S] ES8311 playback begin failed");
  return codecOk && i2sOk;
}

bool qwen_i2s_restart_microphone(I2SClass &i2s, uint32_t sampleRate) {
  if (qwen_i2s_mic_mode == 3 && qwen_i2s_mic_es8311_sda_pin >= 0 && qwen_i2s_mic_es8311_scl_pin >= 0 && qwen_i2s_mic_bclk_pin >= 0 && qwen_i2s_mic_lrclk_pin >= 0 && qwen_i2s_mic_sd_pin >= 0) {
    if (qwen_i2s_mic_es8311_dac_pin >= 0) {
      return qwen_i2s_begin_es8311_audio(i2s, qwen_i2s_mic_es8311_sda_pin, qwen_i2s_mic_es8311_scl_pin, qwen_i2s_mic_es8311_addr, qwen_i2s_mic_bclk_pin, qwen_i2s_mic_lrclk_pin, qwen_i2s_mic_es8311_dac_pin, qwen_i2s_mic_sd_pin, qwen_i2s_mic_es8311_mclk_pin, sampleRate, qwen_i2s_mic_es8311_gain_reg, qwen_i2s_mic_es8311_pa_pin);
    }
    return qwen_i2s_begin_es8311_microphone(i2s, qwen_i2s_mic_es8311_sda_pin, qwen_i2s_mic_es8311_scl_pin, qwen_i2s_mic_es8311_addr, qwen_i2s_mic_bclk_pin, qwen_i2s_mic_lrclk_pin, qwen_i2s_mic_sd_pin, qwen_i2s_mic_es8311_mclk_pin, sampleRate, qwen_i2s_mic_es8311_gain_reg);
  }

  if (qwen_i2s_mic_mode == 2 && qwen_i2s_mic_pdm_clk_pin >= 0 && qwen_i2s_mic_pdm_din_pin >= 0) {
    return qwen_i2s_begin_pdm_microphone(i2s, qwen_i2s_mic_pdm_clk_pin, qwen_i2s_mic_pdm_din_pin, sampleRate);
  }

  if (qwen_i2s_mic_mode == 1 && qwen_i2s_mic_bclk_pin >= 0 && qwen_i2s_mic_lrclk_pin >= 0 && qwen_i2s_mic_sd_pin >= 0) {
    return qwen_i2s_begin_microphone(i2s, qwen_i2s_mic_bclk_pin, qwen_i2s_mic_lrclk_pin, qwen_i2s_mic_sd_pin, sampleRate);
  }

  Serial.println("[I2S] microphone pins not cached, configure RX only");
  i2s.end();
  delay(20);
  i2s.configureRX(sampleRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO);
  return true;
}

size_t qwen_i2s_record_pcm(I2SClass &i2s, uint8_t* pcmBuf, size_t pcmBytes, float durationSeconds, const char* tag) {
  i2s.setTimeout(20);
  size_t bytesRead = 0;
  unsigned long recordStart = millis();
  unsigned long maxMs = (unsigned long)(durationSeconds * 1000 + 1200);
  while (bytesRead < pcmBytes) {
    if (millis() - recordStart > maxMs) {
      Serial.println(String("[") + tag + "] record timeout");
      break;
    }
    size_t toRead = min((size_t)512, pcmBytes - bytesRead);
    size_t n = i2s.readBytes((char*)(pcmBuf + bytesRead), toRead);
    if (n > 0) {
      bytesRead += n;
    } else {
      delay(1);
    }
  }
  if (bytesRead % sizeof(int16_t) != 0) bytesRead -= bytesRead % sizeof(int16_t);
  return bytesRead;
}`);
}

Arduino.forBlock['qwen_omni_config'] = function(block, generator) {
  const apiKey = generator.valueToCode(block, 'API_KEY', Arduino.ORDER_ATOMIC) || '""';
  const baseUrl = generator.valueToCode(block, 'BASE_URL', Arduino.ORDER_ATOMIC) || '"https://dashscope.aliyuncs.com/compatible-mode/v1"';

  // 添加必要的库引用
  generator.addLibrary('qwen_wifi', '#include <WiFi.h>');
  generator.addLibrary('qwen_http', '#include <HTTPClient.h>');

  // 添加全局变量
  generator.addVariable('qwen_api_key', 'String qwen_api_key = ' + apiKey + ';');
  generator.addVariable('qwen_base_url', 'String qwen_base_url = ' + baseUrl + ';');
  generator.addVariable('qwen_system_prompt', 'String qwen_system_prompt = "";');
  generator.addVariable('qwen_last_success', 'bool qwen_last_success = false;');
  generator.addVariable('qwen_last_error', 'String qwen_last_error = "";');
  generator.addVariable('qwen_chat_history', 'String qwen_chat_history = "";');
  generator.addVariable('qwen_stream_chunk', 'String qwen_stream_chunk = "";');
  generator.addVariable('qwen_stream_callback', 'void (*qwen_stream_callback)(void) = NULL;');
  generator.addVariable('qwen_omni_audio_data', 'String qwen_omni_audio_data = "";');
  generator.addVariable('qwen_tts_data', 'String qwen_tts_data = "";');

  generator.addFunction('qwen_escape_json', String.raw`
String qwen_escape_json(String input) {
  input.replace("\\", "\\\\");
  input.replace("\"", "\\\"");
  input.replace("\n", "\\n");
  input.replace("\r", "\\r");
  return input;
}`);

  generator.addFunction('qwen_sanitize_base64', String.raw`
String qwen_sanitize_base64(String input) {
  String out = "";
  out.reserve(input.length());
  for (size_t i = 0; i < input.length(); i++) {
    char ch = input.charAt(i);
    bool isAlphaNum = (ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9');
    if (isAlphaNum || ch == '+' || ch == '/' || ch == '=') {
      out += ch;
    }
  }
  return out;
}`);

  generator.addFunction('qwen_unescape_json_string', String.raw`
String qwen_unescape_json_string(String input) {
  input.replace("\\/", "/");
  input.replace("\\u0026", "&");
  input.replace("\\u003d", "=");
  input.replace("\\u002b", "+");
  input.replace("\\u002f", "/");
  return input;
}`);


  // 添加流式HTTP请求函数
  generator.addFunction('qwen_simple_request', `
String qwen_simple_request(String model, String message, bool enableThinking) {
  Serial.println("=== 通义千问API调用开始(流式) ===");
  Serial.println("模型: " + model);
  Serial.println("消息: " + message);

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Error: WiFi not connected");
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = qwen_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(60000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  String safeSystem = qwen_escape_json(qwen_system_prompt);
  String safeMessage = qwen_escape_json(message);
  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[";
  requestBody.reserve(model.length() + safeSystem.length() + safeMessage.length() + 256);
  if (qwen_system_prompt.length() > 0) {
    requestBody += "{\\"role\\":\\"system\\",\\"content\\":\\"" + safeSystem + "\\"},";
  }
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":\\"" + safeMessage + "\\"}]";
  requestBody += ",\\"stream\\":true";
  
  if (enableThinking) {
    requestBody += ",\\"enable_thinking\\":true";
  }
  requestBody += "}";

  Serial.println("发送流式请求...");
  int httpResponseCode = http.POST(requestBody);
  Serial.println("HTTP响应码: " + String(httpResponseCode));
  String response = "";

  if (httpResponseCode == 200) {
    WiFiClient* stream = http.getStreamPtr();
    String fullContent = "";
    String buffer = "";
    
    while (http.connected() || stream->available()) {
      if (stream->available()) {
        char c = stream->read();
        buffer += c;
        
        if (c == '\\n') {
          buffer.trim();
          if (buffer.startsWith("data:")) {
            String data = buffer.substring(5);
            data.trim();
            
            if (data == "[DONE]") {
              Serial.println();
              Serial.println("娴佸紡浼犺緭瀹屾垚");
              break;
            }
            
            int contentStart = data.indexOf("\\"content\\":\\"");
            if (contentStart >= 0) {
              contentStart += 11;
              int contentEnd = data.indexOf("\\"", contentStart);
              if (contentEnd > contentStart) {
                String content = data.substring(contentStart, contentEnd);
                Serial.print(content); // 瀹炴椂杈撳嚭
                fullContent += content;
                // 璋冪敤娴佸紡鍥炶皟
                if (qwen_stream_callback != NULL) {
                  qwen_stream_chunk = content;
                  qwen_stream_callback();
                }
              }
            }
          }
          buffer = "";
        }
      }
      delay(1);
    }
    
    if (fullContent.length() > 0) {
      response = fullContent;
      qwen_last_success = true;
      qwen_last_error = "";
    } else {
      Serial.println("娴佸紡瑙ｆ瀽澶辫触");
      qwen_last_success = false;
      qwen_last_error = "Stream parse error";
    }
  } else {
    String errorResponse = http.getString();
    Serial.println("HTTP閿欒: " + errorResponse);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  Serial.println("=== 通义千问API调用结束 ===");
  return response;
}`);

  // 添加多轮对话请求函数（流式）
  generator.addFunction('qwen_history_request', `
String qwen_history_request(String model, String message) {
  Serial.println("=== 通义千问多轮对话开始(流式) ===");

  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = qwen_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(60000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  // 添加用户消息到历史
  String safeMessage = qwen_escape_json(message);
  if (qwen_chat_history.length() > 0) {
    qwen_chat_history += ",";
  }
  qwen_chat_history += "{\\"role\\":\\"user\\",\\"content\\":\\"" + safeMessage + "\\"}";

  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[";
  requestBody.reserve(model.length() + qwen_system_prompt.length() + qwen_chat_history.length() + 256);
  if (qwen_system_prompt.length() > 0) {
    requestBody += "{\\"role\\":\\"system\\",\\"content\\":\\"" + qwen_escape_json(qwen_system_prompt) + "\\"},";
  }
  requestBody += qwen_chat_history + "],\\"stream\\":true}";

  int httpResponseCode = http.POST(requestBody);
  String response = "";

  if (httpResponseCode == 200) {
    WiFiClient* stream = http.getStreamPtr();
    String fullContent = "";
    String buffer = "";
    
    while (http.connected() || stream->available()) {
      if (stream->available()) {
        char c = stream->read();
        buffer += c;
        if (c == '\\n') {
          buffer.trim();
          if (buffer.startsWith("data:")) {
            String data = buffer.substring(5);
            data.trim();
            if (data == "[DONE]") {
              Serial.println();
              break;
            }
            int contentStart = data.indexOf("\\"content\\":\\"");
            if (contentStart >= 0) {
              contentStart += 11;
              int contentEnd = data.indexOf("\\"", contentStart);
              if (contentEnd > contentStart) {
                String content = data.substring(contentStart, contentEnd);
                Serial.print(content); // 瀹炴椂杈撳嚭
                fullContent += content;
                // 璋冪敤娴佸紡鍥炶皟
                if (qwen_stream_callback != NULL) {
                  qwen_stream_chunk = content;
                  qwen_stream_callback();
                }
              }
            }
          }
          buffer = "";
        }
      }
      delay(1);
    }
    
    if (fullContent.length() > 0) {
      response = fullContent;
      // 添加助手回复到历史
      qwen_chat_history += ",{\\"role\\":\\"assistant\\",\\"content\\":\\"" + qwen_escape_json(response) + "\\"}";
      qwen_last_success = true;
      qwen_last_error = "";
    } else {
      qwen_last_success = false;
      qwen_last_error = "Stream parse error";
    }
  } else {
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  Serial.println("=== 通义千问多轮对话结束 ===");
  return response;
}`);

  return '';
};

Arduino.forBlock['qwen_omni_i2s_speaker_init'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_spk';
  const bclk = generator.valueToCode(block, 'BCLK', Arduino.ORDER_ATOMIC) || '15';
  const lrclk = generator.valueToCode(block, 'LRCLK', Arduino.ORDER_ATOMIC) || '16';
  const din = generator.valueToCode(block, 'DIN', Arduino.ORDER_ATOMIC) || '7';
  const sampleRate = generator.valueToCode(block, 'SAMPLE_RATE', Arduino.ORDER_ATOMIC) || '24000';

  ensureQwenOmniI2SObject(generator, varName);
  ensureQwenOmniI2SHelpers(generator);
  return 'qwen_i2s_begin_speaker(' + varName + ', ' + bclk + ', ' + lrclk + ', ' + din + ', ' + sampleRate + ');\n';
};

Arduino.forBlock['qwen_omni_i2s_mic_init'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_mic';
  const bclk = generator.valueToCode(block, 'BCLK', Arduino.ORDER_ATOMIC) || '5';
  const lrclk = generator.valueToCode(block, 'LRCLK', Arduino.ORDER_ATOMIC) || '4';
  const sd = generator.valueToCode(block, 'SD', Arduino.ORDER_ATOMIC) || '6';
  const sampleRate = generator.valueToCode(block, 'SAMPLE_RATE', Arduino.ORDER_ATOMIC) || '16000';

  ensureQwenOmniI2SObject(generator, varName);
  ensureQwenOmniI2SHelpers(generator);
  return 'qwen_i2s_begin_microphone(' + varName + ', ' + bclk + ', ' + lrclk + ', ' + sd + ', ' + sampleRate + ');\n';
};

Arduino.forBlock['qwen_omni_pdm_mic_init'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_mic';
  const clk = generator.valueToCode(block, 'CLK', Arduino.ORDER_ATOMIC) || '42';
  const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '41';
  const sampleRate = generator.valueToCode(block, 'SAMPLE_RATE', Arduino.ORDER_ATOMIC) || '16000';

  ensureQwenOmniI2SObject(generator, varName);
  ensureQwenOmniI2SHelpers(generator);
  return 'qwen_i2s_begin_pdm_microphone(' + varName + ', ' + clk + ', ' + data + ', ' + sampleRate + ');\n';
};

Arduino.forBlock['qwen_omni_es8311_mic_init'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_mic';
  const sda = generator.valueToCode(block, 'SDA', Arduino.ORDER_ATOMIC) || '41';
  const scl = generator.valueToCode(block, 'SCL', Arduino.ORDER_ATOMIC) || '42';
  const address = generator.valueToCode(block, 'I2C_ADDRESS', Arduino.ORDER_ATOMIC) || '0x18';
  const bclk = generator.valueToCode(block, 'BCLK', Arduino.ORDER_ATOMIC) || '39';
  const lrclk = generator.valueToCode(block, 'LRCLK', Arduino.ORDER_ATOMIC) || '2';
  const sdout = generator.valueToCode(block, 'SDOUT', Arduino.ORDER_ATOMIC) || '40';
  const mclk = generator.valueToCode(block, 'MCLK', Arduino.ORDER_ATOMIC) || '46';
  const sampleRate = generator.valueToCode(block, 'SAMPLE_RATE', Arduino.ORDER_ATOMIC) || '16000';
  const micGain = generator.valueToCode(block, 'MIC_GAIN', Arduino.ORDER_ATOMIC) || '0x24';

  ensureQwenOmniI2SObject(generator, varName);
  ensureQwenOmniI2SHelpers(generator);
  return 'qwen_i2s_begin_es8311_microphone(' + varName + ', ' + sda + ', ' + scl + ', (uint8_t)(' + address + '), ' + bclk + ', ' + lrclk + ', ' + sdout + ', ' + mclk + ', ' + sampleRate + ', (uint8_t)(' + micGain + '));\n';
};

Arduino.forBlock['qwen_omni_es8311_audio_init'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_audio';
  const sda = generator.valueToCode(block, 'SDA', Arduino.ORDER_ATOMIC) || '41';
  const scl = generator.valueToCode(block, 'SCL', Arduino.ORDER_ATOMIC) || '42';
  const address = generator.valueToCode(block, 'I2C_ADDRESS', Arduino.ORDER_ATOMIC) || '0x18';
  const bclk = generator.valueToCode(block, 'BCLK', Arduino.ORDER_ATOMIC) || '39';
  const lrclk = generator.valueToCode(block, 'LRCLK', Arduino.ORDER_ATOMIC) || '2';
  const dacDin = generator.valueToCode(block, 'DAC_DIN', Arduino.ORDER_ATOMIC) || '38';
  const adcDout = generator.valueToCode(block, 'ADC_DOUT', Arduino.ORDER_ATOMIC) || '40';
  const mclk = generator.valueToCode(block, 'MCLK', Arduino.ORDER_ATOMIC) || '46';
  const sampleRate = generator.valueToCode(block, 'SAMPLE_RATE', Arduino.ORDER_ATOMIC) || '16000';
  const micGain = generator.valueToCode(block, 'MIC_GAIN', Arduino.ORDER_ATOMIC) || '0x24';
  const paEn = generator.valueToCode(block, 'PA_EN', Arduino.ORDER_ATOMIC) || '-1';

  ensureQwenOmniI2SObject(generator, varName);
  ensureQwenOmniI2SHelpers(generator);
  return 'qwen_i2s_begin_es8311_audio(' + varName + ', ' + sda + ', ' + scl + ', (uint8_t)(' + address + '), ' + bclk + ', ' + lrclk + ', ' + dacDin + ', ' + adcDout + ', ' + mclk + ', ' + sampleRate + ', (uint8_t)(' + micGain + '), ' + paEn + ');\n';
};

Arduino.forBlock['qwen_omni_es8311_test_tone'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_audio';
  const freq = generator.valueToCode(block, 'FREQ', Arduino.ORDER_ATOMIC) || '1000';
  const duration = generator.valueToCode(block, 'DURATION', Arduino.ORDER_ATOMIC) || '800';

  ensureQwenOmniI2SObject(generator, varName);
  ensureQwenOmniI2SHelpers(generator);
  return 'qwen_play_prompt_tone(' + varName + ', ' + freq + ', ' + duration + ');\n';
};

Arduino.forBlock['qwen_omni_i2s_prompt_tone'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_spk';
  const freq = generator.valueToCode(block, 'FREQ', Arduino.ORDER_ATOMIC) || '1000';
  const duration = generator.valueToCode(block, 'DURATION', Arduino.ORDER_ATOMIC) || '300';

  ensureQwenOmniI2SObject(generator, varName);
  ensureQwenOmniPlaybackHelpers(generator);
  return 'qwen_play_prompt_tone(' + varName + ', ' + freq + ', ' + duration + ');\n';
};

Arduino.forBlock['qwen_omni_chat'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  const code = `qwen_simple_request("${model}", ${message}, false)`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwen_omni_chat_simple'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';

  const code = `qwen_simple_request("qwen3.7-plus", ${message}, false)`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwen_omni_chat_with_thinking'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  const code = `qwen_simple_request("${model}", ${message}, true)`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwen_omni_chat_with_history'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  const code = `qwen_history_request("${model}", ${message})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwen_omni_clear_history'] = function(block, generator) {
  return 'qwen_chat_history = "";\nSerial.println("History cleared");\n';
};

Arduino.forBlock['qwen_omni_set_system_prompt'] = function(block, generator) {
  const systemPrompt = generator.valueToCode(block, 'SYSTEM_PROMPT', Arduino.ORDER_ATOMIC) || '""';
  return `qwen_system_prompt = ${systemPrompt};\n`;
};

Arduino.forBlock['qwen_omni_get_response_status'] = function() {
  return ['qwen_last_success', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['qwen_omni_get_error_message'] = function() {
  return ['qwen_last_error', Arduino.ORDER_ATOMIC];
};

// 娴佸紡鍥炶皟鐩稿叧
Arduino.forBlock['qwen_omni_set_stream_callback'] = function(block, generator) {
  const callback = generator.statementToCode(block, 'CALLBACK');
  
  // 鐢熸垚鍥炶皟鍑芥暟
  generator.addFunction('qwen_user_stream_callback', `
void qwen_user_stream_callback() {
${callback}}`);
  
  return 'qwen_stream_callback = qwen_user_stream_callback;\n';
};

Arduino.forBlock['qwen_omni_get_stream_chunk'] = function() {
  return ['qwen_stream_chunk', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['qwen_omni_clear_stream_callback'] = function() {
  return 'qwen_stream_callback = NULL;\n';
};


Arduino.forBlock['qwen_omni_vision_chat'] = function(block, generator) {
  const image = generator.valueToCode(block, 'IMAGE', Arduino.ORDER_ATOMIC) || '""';
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  generator.addFunction('qwen_vision_request', `
String qwen_vision_request(String model, String base64Image, String message) {
  Serial.println("=== 通义千问VL图片对话开始(流式) ===");
  Serial.println("模型: " + model);
  Serial.println("提示词: " + message);

  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = qwen_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(60000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  String safeMessage = qwen_escape_json(message);
  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[{\\"role\\":\\"user\\",\\"content\\":[";
  requestBody.reserve(model.length() + base64Image.length() + safeMessage.length() + 256);
  requestBody += "{\\"type\\":\\"image_url\\",\\"image_url\\":{\\"url\\":\\"data:image/jpeg;base64," + base64Image + "\\"}},";
  requestBody += "{\\"type\\":\\"text\\",\\"text\\":\\"" + safeMessage + "\\"}";
  requestBody += "]}],\\"stream\\":true}";

  int httpResponseCode = http.POST(requestBody);
  String response = "";

  if (httpResponseCode == 200) {
    WiFiClient* stream = http.getStreamPtr();
    String fullContent = "";
    String buffer = "";
    
    while (http.connected() || stream->available()) {
      if (stream->available()) {
        char c = stream->read();
        buffer += c;
        if (c == '\\n') {
          buffer.trim();
          if (buffer.startsWith("data:")) {
            String data = buffer.substring(5);
            data.trim();
            if (data == "[DONE]") {
              Serial.println();
              break;
            }
            int contentStart = data.indexOf("\\"content\\":\\"");
            if (contentStart >= 0) {
              contentStart += 11;
              int contentEnd = data.indexOf("\\"", contentStart);
              if (contentEnd > contentStart) {
                String content = data.substring(contentStart, contentEnd);
                Serial.print(content); // 瀹炴椂杈撳嚭
                fullContent += content;
                // 璋冪敤娴佸紡鍥炶皟
                if (qwen_stream_callback != NULL) {
                  qwen_stream_chunk = content;
                  qwen_stream_callback();
                }
              }
            }
          }
          buffer = "";
        }
      }
      delay(1);
    }
    
    if (fullContent.length() > 0) {
      response = fullContent;
      qwen_last_success = true;
      qwen_last_error = "";
    } else {
      qwen_last_success = false;
      qwen_last_error = "Stream parse error";
    }
  } else {
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  Serial.println("=== 通义千问VL图片对话结束 ===");
  return response;
}`);

  const code = `qwen_vision_request("${model}", ${image}, ${message})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwen_omni_vision_chat_direct_capture'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  generator.addLibrary('qwen_wifi_client_secure', '#include <WiFiClientSecure.h>');
  generator.addLibrary('qwen_wifi_client', '#include <WiFiClient.h>');
  generator.addLibrary('qwen_esp_camera', '#include <esp_camera.h>');

  generator.addFunction('qwen_parse_base_url', `
bool qwen_parse_base_url(String baseUrl, bool &isHttps, String &host, uint16_t &port, String &basePath) {
  isHttps = false;
  host = "";
  port = 0;
  basePath = "";

  if (baseUrl.startsWith("https://")) {
    isHttps = true;
    baseUrl = baseUrl.substring(8);
  } else if (baseUrl.startsWith("http://")) {
    isHttps = false;
    baseUrl = baseUrl.substring(7);
  } else {
    return false;
  }

  int slashIndex = baseUrl.indexOf('/');
  String hostPort = (slashIndex >= 0) ? baseUrl.substring(0, slashIndex) : baseUrl;
  basePath = (slashIndex >= 0) ? baseUrl.substring(slashIndex) : "";

  int colonIndex = hostPort.indexOf(':');
  if (colonIndex >= 0) {
    host = hostPort.substring(0, colonIndex);
    port = (uint16_t)hostPort.substring(colonIndex + 1).toInt();
  } else {
    host = hostPort;
    port = isHttps ? 443 : 80;
  }

  if (host.length() == 0) return false;
  return true;
}`);

  generator.addFunction('qwen_base64_length', `
size_t qwen_base64_length(size_t inputLen) {
  return ((inputLen + 2) / 3) * 4;
}`);

  generator.addFunction('qwen_base64_write', `
void qwen_base64_write(Client &out, const uint8_t* data, size_t len) {
  static const char* table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  char outBuf[512];
  size_t outPos = 0;
  size_t i = 0;

  while (i + 3 <= len) {
    uint32_t n = ((uint32_t)data[i] << 16) | ((uint32_t)data[i + 1] << 8) | ((uint32_t)data[i + 2]);
    if (outPos + 4 > sizeof(outBuf)) {
      out.write((const uint8_t*)outBuf, outPos);
      outPos = 0;
    }
    outBuf[outPos++] = table[(n >> 18) & 0x3F];
    outBuf[outPos++] = table[(n >> 12) & 0x3F];
    outBuf[outPos++] = table[(n >> 6) & 0x3F];
    outBuf[outPos++] = table[n & 0x3F];
    i += 3;
  }

  size_t rem = len - i;
  if (rem == 1) {
    uint32_t n = ((uint32_t)data[i] << 16);
    if (outPos + 4 > sizeof(outBuf)) {
      out.write((const uint8_t*)outBuf, outPos);
      outPos = 0;
    }
    outBuf[outPos++] = table[(n >> 18) & 0x3F];
    outBuf[outPos++] = table[(n >> 12) & 0x3F];
    outBuf[outPos++] = '=';
    outBuf[outPos++] = '=';
  } else if (rem == 2) {
    uint32_t n = ((uint32_t)data[i] << 16) | ((uint32_t)data[i + 1] << 8);
    if (outPos + 4 > sizeof(outBuf)) {
      out.write((const uint8_t*)outBuf, outPos);
      outPos = 0;
    }
    outBuf[outPos++] = table[(n >> 18) & 0x3F];
    outBuf[outPos++] = table[(n >> 12) & 0x3F];
    outBuf[outPos++] = table[(n >> 6) & 0x3F];
    outBuf[outPos++] = '=';
  }

  if (outPos > 0) {
    out.write((const uint8_t*)outBuf, outPos);
  }
}`);

  generator.addFunction('qwen_vision_direct_capture_request', `
String qwen_vision_direct_capture_request(String model, String message) {
  Serial.println("=== 通义千问VL图片对话开始(直接拍照/流式上传) ===");
  Serial.println("模型: " + model);
  Serial.println("提示词: " + message);

  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    return "";
  }

  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb) {
    qwen_last_success = false;
    qwen_last_error = "Camera capture failed";
    return "";
  }

  bool isHttps = true;
  String host = "";
  uint16_t port = 443;
  String basePath = "";
  if (!qwen_parse_base_url(qwen_base_url, isHttps, host, port, basePath)) {
    esp_camera_fb_return(fb);
    qwen_last_success = false;
    qwen_last_error = "Invalid base URL";
    return "";
  }

  String path = basePath;
  if (path.endsWith("/")) path.remove(path.length() - 1);
  path += "/chat/completions";

  String safeMessage = qwen_escape_json(message);
  String jsonPrefix = "{\\\"model\\\":\\\"" + model + "\\\",\\\"messages\\\":[{\\\"role\\\":\\\"user\\\",\\\"content\\\":[{\\\"type\\\":\\\"image_url\\\",\\\"image_url\\\":{\\\"url\\\":\\\"data:image/jpeg;base64,";
  String jsonSuffix = "\\\"}},{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"" + safeMessage + "\\\"}]}],\\\"stream\\\":true}";

  size_t base64Len = qwen_base64_length(fb->len);
  size_t contentLen = (size_t)jsonPrefix.length() + base64Len + (size_t)jsonSuffix.length();

  WiFiClientSecure secureClient;
  WiFiClient plainClient;
  Client* client = NULL;
  if (isHttps) {
    secureClient.setInsecure();
    client = &secureClient;
  } else {
    client = &plainClient;
  }
  client->setTimeout(60000);

  if (!client->connect(host.c_str(), port)) {
    esp_camera_fb_return(fb);
    qwen_last_success = false;
    qwen_last_error = "Connect failed";
    return "";
  }

  client->print("POST ");
  client->print(path);
  client->print(" HTTP/1.1\\r\\n");
  client->print("Host: ");
  client->print(host);
  client->print("\\r\\n");
  client->print("User-Agent: Aily\\r\\n");
  client->print("Connection: close\\r\\n");
  client->print("Accept: text/event-stream\\r\\n");
  client->print("Content-Type: application/json\\r\\n");
  client->print("Authorization: Bearer ");
  client->print(qwen_api_key);
  client->print("\\r\\n");
  client->print("Content-Length: ");
  client->print(String(contentLen));
  client->print("\\r\\n\\r\\n");

  client->print(jsonPrefix);
  qwen_base64_write(*client, fb->buf, fb->len);
  client->print(jsonSuffix);
  esp_camera_fb_return(fb);

  String statusLine = client->readStringUntil('\\n');
  statusLine.trim();
  int httpCode = 0;
  int firstSpace = statusLine.indexOf(' ');
  if (firstSpace >= 0) {
    int secondSpace = statusLine.indexOf(' ', firstSpace + 1);
    if (secondSpace > firstSpace) {
      httpCode = statusLine.substring(firstSpace + 1, secondSpace).toInt();
    }
  }

  while (client->connected()) {
    String headerLine = client->readStringUntil('\\n');
    if (headerLine == "\\r" || headerLine.length() == 0) break;
  }

  if (httpCode != 200) {
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpCode);
    client->stop();
    return "";
  }

  String fullContent = "";
  String buffer = "";
  unsigned long lastDataMs = millis();

  while (client->connected() || client->available()) {
    if (client->available()) {
      char c = (char)client->read();
      buffer += c;
      if (c == '\\n') {
        buffer.trim();
        if (buffer.startsWith("data:")) {
          String data = buffer.substring(5);
          data.trim();
          if (data == "[DONE]") {
            Serial.println();
            break;
          }
          int contentStart = data.indexOf("\\\"content\\\":\\\"");
          if (contentStart >= 0) {
            contentStart += 11;
            int contentEnd = data.indexOf("\\\"", contentStart);
            if (contentEnd > contentStart) {
              String content = data.substring(contentStart, contentEnd);
              Serial.print(content);
              fullContent += content;
              if (qwen_stream_callback != NULL) {
                qwen_stream_chunk = content;
                qwen_stream_callback();
              }
            }
          }
        }
        buffer = "";
      }
      lastDataMs = millis();
    } else {
      if (millis() - lastDataMs > 65000) break;
      delay(1);
    }
  }

  client->stop();
  if (fullContent.length() > 0) {
    qwen_last_success = true;
    qwen_last_error = "";
  } else {
    qwen_last_success = false;
    qwen_last_error = "Stream parse error";
  }
  Serial.println("=== 通义千问VL图片对话结束 ===");
  return fullContent;
}`);

  const code = `qwen_vision_direct_capture_request("${model}", ${message})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwen_omni_vision_url_chat'] = function(block, generator) {
  const imageUrl = generator.valueToCode(block, 'IMAGE_URL', Arduino.ORDER_ATOMIC) || '""';
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  generator.addFunction('qwen_vision_url_request', `
String qwen_vision_url_request(String model, String imageUrl, String message) {
  Serial.println("=== 通义千问VL图片URL对话开始(流式) ===");
  Serial.println("模型: " + model);
  Serial.println("图片URL: " + imageUrl);

  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = qwen_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(60000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  String safeMessage = qwen_escape_json(message);
  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[{\\"role\\":\\"user\\",\\"content\\":[";
  requestBody.reserve(model.length() + imageUrl.length() + safeMessage.length() + 256);
  requestBody += "{\\"type\\":\\"image_url\\",\\"image_url\\":{\\"url\\":\\"" + imageUrl + "\\"}},";
  requestBody += "{\\"type\\":\\"text\\",\\"text\\":\\"" + safeMessage + "\\"}";
  requestBody += "]}],\\"stream\\":true}";

  int httpResponseCode = http.POST(requestBody);
  String response = "";

  if (httpResponseCode == 200) {
    WiFiClient* stream = http.getStreamPtr();
    String fullContent = "";
    String buffer = "";
    
    while (http.connected() || stream->available()) {
      if (stream->available()) {
        char c = stream->read();
        buffer += c;
        if (c == '\\n') {
          buffer.trim();
          if (buffer.startsWith("data:")) {
            String data = buffer.substring(5);
            data.trim();
            if (data == "[DONE]") {
              Serial.println();
              break;
            }
            int contentStart = data.indexOf("\\"content\\":\\"");
            if (contentStart >= 0) {
              contentStart += 11;
              int contentEnd = data.indexOf("\\"", contentStart);
              if (contentEnd > contentStart) {
                String content = data.substring(contentStart, contentEnd);
                Serial.print(content); // 瀹炴椂杈撳嚭
                fullContent += content;
                // 璋冪敤娴佸紡鍥炶皟
                if (qwen_stream_callback != NULL) {
                  qwen_stream_chunk = content;
                  qwen_stream_callback();
                }
              }
            }
          }
          buffer = "";
        }
      }
      delay(1);
    }
    
    if (fullContent.length() > 0) {
      response = fullContent;
      qwen_last_success = true;
      qwen_last_error = "";
    } else {
      qwen_last_success = false;
      qwen_last_error = "Stream parse error";
    }
  } else {
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  Serial.println("=== 通义千问VL图片URL对话结束 ===");
  return response;
}`);

  const code = `qwen_vision_url_request("${model}", ${imageUrl}, ${message})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 鍥惧儚鐢熸垚鍔熻兘
Arduino.forBlock['qwen_omni_image_generate'] = function(block, generator) {
  const prompt = generator.valueToCode(block, 'PROMPT', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');
  const size = block.getFieldValue('SIZE');

  generator.addFunction('qwen_image_generate', `
String qwen_image_generate(String model, String prompt, String size) {
  Serial.println("=== 通义万相图像生成开始 ===");
  Serial.println("模型: " + model);
  Serial.println("提示词: " + prompt);
  Serial.println("尺寸: " + size);

  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  // 通义万相使用不同的API端点
  String url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis";
  http.begin(url);
  http.setTimeout(180000); // 120秒超时
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);
  http.addHeader("X-DashScope-Async", "enable");

  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody.reserve(model.length() + prompt.length() + size.length() + 128);
  String safePrompt = qwen_escape_json(prompt);
  requestBody += "\\"input\\":{\\"prompt\\":\\"" + safePrompt + "\\"},";
  requestBody += "\\"parameters\\":{\\"size\\":\\"" + size + "\\"}}";

  Serial.println("请求体: " + requestBody);
  int httpResponseCode = http.POST(requestBody);
  Serial.println("HTTP响应码: " + String(httpResponseCode));
  String response = "";

  if (httpResponseCode == 200) {
    String payload = http.getString();
    Serial.println("API响应: " + payload);

    // 解析task_id用于查询结果
    int taskStart = payload.indexOf("\\"task_id\\":\\"") + 12;
    int taskEnd = payload.indexOf("\\"", taskStart);
    if (taskStart > 11 && taskEnd > taskStart) {
      String taskId = payload.substring(taskStart, taskEnd);
      Serial.println("任务ID: " + taskId);
      
      // 轮询查询结果
      http.end();
      delay(3000); // 等待3秒
      
      String queryUrl = "https://dashscope.aliyuncs.com/api/v1/tasks/" + taskId;
      for (int i = 0; i < 30; i++) { // 最多等待90秒
        http.begin(queryUrl);
        http.addHeader("Authorization", "Bearer " + qwen_api_key);
        int queryCode = http.GET();
        
        if (queryCode == 200) {
          String queryPayload = http.getString();
          if (queryPayload.indexOf("\\"SUCCEEDED\\"") >= 0) {
            int urlStart = queryPayload.indexOf("\\"url\\":\\"") + 7;
            int urlEnd = queryPayload.indexOf("\\"", urlStart);
            if (urlStart > 6 && urlEnd > urlStart) {
              response = queryPayload.substring(urlStart, urlEnd);
              Serial.println("图片URL: " + response);
              qwen_last_success = true;
              qwen_last_error = "";
              http.end();
              break;
            }
          } else if (queryPayload.indexOf("\\"FAILED\\"") >= 0) {
            qwen_last_success = false;
            qwen_last_error = "Task failed";
            http.end();
            break;
          }
        }
        http.end();
        delay(3000);
      }
    } else {
      qwen_last_success = false;
      qwen_last_error = "No task_id";
    }
  } else {
    String errorResponse = http.getString();
    Serial.println("HTTP閿欒: " + errorResponse);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  Serial.println("=== 通义万相图像生成结束 ===");
  return response;
}`);

  const code = `qwen_image_generate("${model}", ${prompt}, "${size}")`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwen_omni_image_generate_simple'] = function(block, generator) {
  const prompt = generator.valueToCode(block, 'PROMPT', Arduino.ORDER_ATOMIC) || '""';

  // 澶嶇敤鍥惧儚鐢熸垚鍑芥暟
  generator.addFunction('qwen_image_generate', `
String qwen_image_generate(String model, String prompt, String size) {
  Serial.println("=== 通义万相图像生成开始 ===");
  Serial.println("模型: " + model);
  Serial.println("提示词: " + prompt);
  Serial.println("尺寸: " + size);

  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);
  http.addHeader("X-DashScope-Async", "enable");

  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody.reserve(model.length() + prompt.length() + size.length() + 128);
  String safePrompt = qwen_escape_json(prompt);
  requestBody += "\\"input\\":{\\"prompt\\":\\"" + safePrompt + "\\"},";
  requestBody += "\\"parameters\\":{\\"size\\":\\"" + size + "\\"}}";

  int httpResponseCode = http.POST(requestBody);
  String response = "";

  if (httpResponseCode == 200) {
    String payload = http.getString();
    int taskStart = payload.indexOf("\\"task_id\\":\\"") + 12;
    int taskEnd = payload.indexOf("\\"", taskStart);
    if (taskStart > 11 && taskEnd > taskStart) {
      String taskId = payload.substring(taskStart, taskEnd);
      http.end();
      delay(3000);
      
      String queryUrl = "https://dashscope.aliyuncs.com/api/v1/tasks/" + taskId;
      for (int i = 0; i < 30; i++) {
        http.begin(queryUrl);
        http.addHeader("Authorization", "Bearer " + qwen_api_key);
        int queryCode = http.GET();
        
        if (queryCode == 200) {
          String queryPayload = http.getString();
          if (queryPayload.indexOf("\\"SUCCEEDED\\"") >= 0) {
            int urlStart = queryPayload.indexOf("\\"url\\":\\"") + 7;
            int urlEnd = queryPayload.indexOf("\\"", urlStart);
            if (urlStart > 6 && urlEnd > urlStart) {
              response = queryPayload.substring(urlStart, urlEnd);
              qwen_last_success = true;
              qwen_last_error = "";
              http.end();
              break;
            }
          } else if (queryPayload.indexOf("\\"FAILED\\"") >= 0) {
            qwen_last_success = false;
            qwen_last_error = "Task failed";
            http.end();
            break;
          }
        }
        http.end();
        delay(3000);
      }
    } else {
      qwen_last_success = false;
      qwen_last_error = "No task_id";
    }
  } else {
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  return response;
}`);

  const code = `qwen_image_generate("wanx2.1-t2i-turbo", ${prompt}, "1024*1024")`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwen_omni_tts'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  const voice = block.getFieldValue('VOICE');
  const model = block.getFieldValue('MODEL');
  const language = block.getFieldValue('LANGUAGE');

  generator.addFunction('qwen_tts_request', `
String qwen_tts_request(String text, String voice, String model, String language) {
  Serial.println("=== 通义TTS语音合成开始(流式) ===");
  Serial.println("文本: " + text);
  Serial.println("音色: " + voice);
  Serial.println("模型: " + model);
  Serial.println("语种: " + language);

  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);
  http.addHeader("X-DashScope-SSE", "enable");

  String safeText = qwen_escape_json(text);
  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"input\\":{\\"text\\":\\"" + safeText + "\\",";
  requestBody += "\\"voice\\":\\"" + voice + "\\",";
  requestBody += "\\"language_type\\":\\"" + language + "\\"},";
  requestBody += "\\"stream\\":true}";

  Serial.println("发送TTS流式请求...");
  int httpResponseCode = http.POST(requestBody);
  Serial.println("HTTP响应码: " + String(httpResponseCode));
  String response = "";

  if (httpResponseCode == 200) {
    WiFiClient* stream = http.getStreamPtr();
    String fullAudio = "";
    String buffer = "";
    unsigned long lastDataTime = millis();
    
    while (http.connected() || stream->available()) {
      if (stream->available()) {
        char c = stream->read();
        lastDataTime = millis();
        buffer += c;
        
        if (c == '\\n') {
          buffer.trim();
          if (buffer.startsWith("data:")) {
            String data = buffer.substring(5);
            data.trim();
            
            if (data == "[DONE]") {
              Serial.println();
              Serial.println("TTS娴佸紡浼犺緭瀹屾垚");
              break;
            }
            
            Serial.println("SSE: " + data.substring(0, min((int)data.length(), 80)));
            int outputAudioDataPos = data.indexOf("\\"audio\\":{\\"data\\":\\"");
            if (outputAudioDataPos >= 0) {
              outputAudioDataPos += 17;
              int endPos = data.indexOf("\\"", outputAudioDataPos);
              if (endPos > outputAudioDataPos) {
                String audioChunk = qwen_sanitize_base64(data.substring(outputAudioDataPos, endPos));
                fullAudio += audioChunk;
                /* progress omitted to avoid serial blocking */
              }
            }
          }
          buffer = "";
        }
      } else {
        if (millis() - lastDataTime > 30000) {
          Serial.println("TTS娴佸紡瓒呮椂");
          break;
        }
        delay(1);
      }
    }
    
    if (fullAudio.length() > 0) {
      response = fullAudio;
      qwen_last_success = true;
      qwen_last_error = "";
    } else {
      Serial.println("TTS娴佸紡瑙ｆ瀽澶辫触");
      qwen_last_success = false;
      qwen_last_error = "Stream parse error";
    }
  } else {
    String errorResponse = http.getString();
    Serial.println("HTTP閿欒: " + errorResponse);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  Serial.println("=== 通义TTS语音合成结束 ===");
  return response;
}`);

  generator.addFunction('qwen_tts_request_v2', `
String qwen_tts_request_v2(String text, String voice, String model, String language) {
  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
  http.begin(url);
  http.setTimeout(90000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  String safeText = qwen_escape_json(text);
  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"input\\":{\\"text\\":\\"" + safeText + "\\",";
  requestBody += "\\"voice\\":\\"" + voice + "\\",";
  requestBody += "\\"language_type\\":\\"" + language + "\\"},";
  requestBody += "\\"stream\\":false}";

  int httpResponseCode = http.POST(requestBody);
  String response = "";
  if (httpResponseCode == 200) {
    String body = http.getString();
    int audioPos = body.indexOf("\\"audio\\":{");
    if (audioPos < 0) audioPos = body.indexOf("\\"output\\":{\\"audio\\":{");
    if (audioPos >= 0) {
      int dataPos = body.indexOf("\\"data\\":\\"", audioPos);
      if (dataPos > audioPos) {
        dataPos += 9;
        int audioEnd = body.indexOf("\\"", dataPos);
        if (audioEnd > dataPos) response = qwen_sanitize_base64(body.substring(dataPos, audioEnd));
      }
    }
    if (response.length() == 0) {
      int urlPos = body.indexOf("\\"audio\\":{");
      if (urlPos < 0) urlPos = body.indexOf("\\"output\\":{\\"audio\\":{");
      if (urlPos >= 0) {
        int realUrlPos = body.indexOf("\\"url\\":\\"", urlPos);
        if (realUrlPos > urlPos) {
          realUrlPos += 8;
          int urlEnd = body.indexOf("\\"", realUrlPos);
          if (urlEnd > realUrlPos) {
            String audioUrl = body.substring(realUrlPos, urlEnd);
            audioUrl = qwen_unescape_json_string(audioUrl);
            response = "URL:" + audioUrl;
          }
        }
      }
    }
    if (response.length() > 0) {
      qwen_last_success = true;
      qwen_last_error = "";
    } else {
      qwen_last_success = false;
      qwen_last_error = "Audio parse failed";
    }
  } else {
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
  }
  http.end();
  return response;
}`);

  const code = `qwen_tts_request_v2(${text}, "${voice}", "${model}", "${language}")`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwen_omni_tts_play'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_spk';
  const base64Audio = generator.valueToCode(block, 'BASE64_AUDIO', Arduino.ORDER_ATOMIC) || '""';

  ensureQwenOmniI2SObject(generator, varName);
  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');
  generator.addLibrary('qwen_wifi_secure', '#include <WiFiClientSecure.h>');
  ensureQwenOmniPlaybackHelpers(generator);

  generator.addFunction('qwen_base64_decode_to_buffer', `
size_t qwen_base64_decode_to_buffer(const char* input, uint8_t* output, size_t outputMax) {
  size_t outLen = 0;
  int ret = mbedtls_base64_decode(output, outputMax, &outLen, (const unsigned char*)input, strlen(input));
  if (ret != 0) {
    Serial.println("Base64解码失败: " + String(ret));
    return 0;
  }
  return outLen;
}`);

  generator.addFunction('qwen_omni_parse_wav_and_config_tx', `
bool qwen_omni_parse_wav_and_config_tx(I2SClass &i2s, const uint8_t* data, size_t totalLen, uint8_t** pcmOut, size_t* pcmLenOut) {
  uint32_t sampleRate = 24000;
  i2s_data_bit_width_t bitWidth = I2S_DATA_BIT_WIDTH_16BIT;
  i2s_slot_mode_t slotMode = I2S_SLOT_MODE_MONO;
  int headerLen = 0;

  if (totalLen > 44 && data[0] == 'R' && data[1] == 'I' && data[2] == 'F' && data[3] == 'F') {
    uint16_t numChannels = data[22] | (data[23] << 8);
    sampleRate = data[24] | (data[25] << 8) | (data[26] << 16) | (data[27] << 24);
    uint16_t bitsPerSample = data[34] | (data[35] << 8);
    slotMode = (numChannels == 2) ? I2S_SLOT_MODE_STEREO : I2S_SLOT_MODE_MONO;
    bitWidth = (bitsPerSample == 32) ? I2S_DATA_BIT_WIDTH_32BIT : I2S_DATA_BIT_WIDTH_16BIT;
    headerLen = 44;
    int fmtSize = data[16] | (data[17] << 8) | (data[18] << 16) | (data[19] << 24);
    if (fmtSize > 16) headerLen = 44 + (fmtSize - 16);
    Serial.println("WAV: " + String(sampleRate) + "Hz " + String(bitsPerSample) + "bit " + String(numChannels) + "ch");
  } else {
    Serial.println("PCM: " + String(sampleRate) + "Hz 16bit mono");
  }

  i2s.end();
  i2s.begin(I2S_MODE_STD, sampleRate, bitWidth, slotMode);

  *pcmOut = (uint8_t*)data + headerLen;
  *pcmLenOut = totalLen - headerLen;
  return headerLen > 0;
}`);

  generator.addFunction('qwen_play_pcm_via_i2s', `
void qwen_play_pcm_via_i2s(I2SClass &i2s, const uint8_t* pcmData, size_t pcmLen) {
  Serial.println("=== 播放PCM音频 ===");
  Serial.println("PCM数据大小: " + String(pcmLen) + " bytes");
  
  size_t bytesWritten = 0;
  size_t chunkSize = 1024;
  while (bytesWritten < pcmLen) {
    size_t toWrite = min(chunkSize, pcmLen - bytesWritten);
    i2s.write(pcmData + bytesWritten, toWrite);
    bytesWritten += toWrite;
  }
  Serial.println("播放完成!");
}`);

  generator.addFunction('qwen_play_wav_from_url', `
bool qwen_play_wav_from_url(I2SClass &i2s, String audioUrl) {
  audioUrl = qwen_unescape_json_string(audioUrl);
  audioUrl.trim();
  if (!(audioUrl.startsWith("https://") || audioUrl.startsWith("http://"))) {
    Serial.println("[TTS] url invalid");
    return false;
  }
  Serial.println("[TTS] url len: " + String(audioUrl.length()));
  WiFiClientSecure secureClient;
  secureClient.setInsecure();
  HTTPClient http;
  http.setFollowRedirects(HTTPC_FORCE_FOLLOW_REDIRECTS);
  if (!http.begin(secureClient, audioUrl)) {
    Serial.println("[TTS] url begin fail");
    return false;
  }
  http.setTimeout(180000);
  int httpCode = http.GET();
  if (httpCode != 200) {
    Serial.println("[TTS] url GET fail: " + String(httpCode));
    http.end();
    return false;
  }

  WiFiClient* stream = http.getStreamPtr();
  stream->setTimeout(40);
  stream->setTimeout(40);
  stream->setTimeout(40);
  uint8_t header[64];
  size_t got = 0;
  unsigned long start = millis();
  while (got < sizeof(header)) {
    if (stream->available()) {
      size_t n = stream->readBytes((char*)(header + got), sizeof(header) - got);
      if (n > 0) got += n;
    } else {
      if (millis() - start > 5000) break;
      delay(1);
    }
  }

  if (got < 44 || header[0] != 'R' || header[1] != 'I' || header[2] != 'F' || header[3] != 'F') {
    Serial.println("[TTS] url audio not wav");
    http.end();
    return false;
  }

  uint16_t numChannels = header[22] | (header[23] << 8);
  uint32_t sampleRate = header[24] | (header[25] << 8) | (header[26] << 16) | (header[27] << 24);
  uint16_t bitsPerSample = header[34] | (header[35] << 8);
  int headerLen = 44;
  int fmtSize = header[16] | (header[17] << 8) | (header[18] << 16) | (header[19] << 24);
  if (fmtSize > 16) headerLen = 44 + (fmtSize - 16);

  i2s.end();
  i2s.begin(I2S_MODE_STD, sampleRate, (bitsPerSample == 32) ? I2S_DATA_BIT_WIDTH_32BIT : I2S_DATA_BIT_WIDTH_16BIT, (numChannels == 2) ? I2S_SLOT_MODE_STEREO : I2S_SLOT_MODE_MONO);

  size_t written = 0;
  if (got < (size_t)headerLen) {
    size_t discard = headerLen - got;
    uint8_t skipBuf[128];
    while (discard > 0) {
      size_t rsz = min((size_t)sizeof(skipBuf), discard);
      size_t n = stream->readBytes((char*)skipBuf, rsz);
      if (n == 0) break;
      discard -= n;
    }
  }

  uint8_t preBuf[4096];
  size_t preLen = 0;
  if (got > (size_t)headerLen) {
    size_t payloadInHeader = got - headerLen;
    size_t cpy = min(payloadInHeader, (size_t)sizeof(preBuf));
    memcpy(preBuf, header + headerLen, cpy);
    preLen += cpy;
  }
  unsigned long preStart = millis();
  while (preLen < sizeof(preBuf)) {
    if (stream->available()) {
      size_t n = stream->readBytes((char*)(preBuf + preLen), sizeof(preBuf) - preLen);
      if (n > 0) preLen += n;
      else break;
    } else {
      if (millis() - preStart > 1500) break;
      delay(1);
    }
  }
  if (preLen > 0) {
    i2s.write(preBuf, preLen);
    written += preLen;
  }

  uint8_t ioBuf[2048];
  unsigned long last = millis();
  while (http.connected() || stream->available()) {
    if (stream->available()) {
      size_t n = stream->readBytes((char*)ioBuf, sizeof(ioBuf));
      if (n > 0) {
        i2s.write(ioBuf, n);
        written += n;
        last = millis();
      }
    } else {
      if (millis() - last > 5000) break;
      delay(1);
    }
  }

  http.end();
  return written > 0;
}`);

  generator.addFunction('qwen_tts_stream_play_impl', `
void qwen_tts_stream_play_impl(I2SClass &i2s, String text, String voice, String model, String language) {
  Serial.println("[TTS] fallback stream begin");
  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    Serial.println("[TTS] fallback fail: WiFi");
    return;
  }

  HTTPClient http;
  String url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);
  http.addHeader("X-DashScope-SSE", "enable");

  String safeText = qwen_escape_json(text);
  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"input\\":{\\"text\\":\\"" + safeText + "\\",";
  requestBody += "\\"voice\\":\\"" + voice + "\\",";
  requestBody += "\\"language_type\\":\\"" + language + "\\"},";
  requestBody += "\\"stream\\":true}";

  int httpResponseCode = http.POST(requestBody);
  Serial.println("[TTS] fallback HTTP: " + String(httpResponseCode));
  if (httpResponseCode != 200) {
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
    String err = http.getString();
    if (err.length() > 160) err = err.substring(0, 160);
    Serial.println(err);
    http.end();
    return;
  }

  i2s.end();
  i2s.begin(I2S_MODE_STD, 24000, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO);

  WiFiClient *stream = http.getStreamPtr();
  String lineBuffer = "";
  String b64Pending = "";
  bool headerParsed = false;
  size_t totalPlayed = 0;
  unsigned long lastDataTime = millis();

  uint8_t* decodeBuf = (uint8_t*)malloc(16384);
  if (!decodeBuf) {
    qwen_last_success = false;
    qwen_last_error = "Memory alloc failed";
    http.end();
    return;
  }

  auto decodeAndPlay = [&](String b64Data) {
    if (b64Data.length() < 4) return;
    size_t outLen = 0;
    int dret = mbedtls_base64_decode(decodeBuf, 16384, &outLen, (const unsigned char*)b64Data.c_str(), b64Data.length());
    if (dret != 0 || outLen == 0) return;

    uint8_t* pcmPtr = decodeBuf;
    size_t playLen = outLen;
    if (!headerParsed) {
      if (outLen > 44 && decodeBuf[0] == 'R' && decodeBuf[1] == 'I' && decodeBuf[2] == 'F' && decodeBuf[3] == 'F') {
        int hdrLen = 44;
        int fmtSize = decodeBuf[16] | (decodeBuf[17] << 8) | (decodeBuf[18] << 16) | (decodeBuf[19] << 24);
        if (fmtSize > 16) hdrLen = 44 + (fmtSize - 16);
        uint16_t numCh = decodeBuf[22] | (decodeBuf[23] << 8);
        uint32_t sr = decodeBuf[24] | (decodeBuf[25] << 8) | (decodeBuf[26] << 16) | (decodeBuf[27] << 24);
        uint16_t bps = decodeBuf[34] | (decodeBuf[35] << 8);
        i2s.end();
        i2s.begin(I2S_MODE_STD, sr, (bps == 32) ? I2S_DATA_BIT_WIDTH_32BIT : I2S_DATA_BIT_WIDTH_16BIT, (numCh == 2) ? I2S_SLOT_MODE_STEREO : I2S_SLOT_MODE_MONO);
        if (hdrLen < (int)outLen) {
          pcmPtr = decodeBuf + hdrLen;
          playLen = outLen - hdrLen;
        } else {
          playLen = 0;
        }
      }
      headerParsed = true;
    }

    if (playLen > 0) {
      size_t w = 0;
      while (w < playLen) {
        size_t tw = min((size_t)512, playLen - w);
        i2s.write(pcmPtr + w, tw);
        w += tw;
      }
      totalPlayed += playLen;
    }
  };

  while (http.connected() || stream->available()) {
    if (!stream->available()) {
      if (millis() - lastDataTime > 12000) break;
      delay(2);
      continue;
    }
    char c = stream->read();
    lastDataTime = millis();
    if (c == '\\n') {
      lineBuffer.trim();
      if (lineBuffer.startsWith("data:")) {
        String data = lineBuffer.substring(5);
        data.trim();
        if (data == "[DONE]") break;
        int audioPos = data.indexOf("\\"audio\\":{\\"data\\":\\"");
        if (audioPos >= 0) {
          audioPos += 17;
          int audioEnd = data.indexOf("\\"", audioPos);
          if (audioEnd > audioPos) {
            b64Pending += qwen_sanitize_base64(data.substring(audioPos, audioEnd));
            int aligned = (b64Pending.length() / 4) * 4;
            if (aligned >= 4) {
              String part = b64Pending.substring(0, aligned);
              b64Pending = b64Pending.substring(aligned);
              decodeAndPlay(part);
            }
          }
        }
      }
      lineBuffer = "";
    } else if (c != '\\r') {
      lineBuffer += c;
    }
  }

  if (b64Pending.length() > 0) {
    while ((b64Pending.length() % 4) != 0) b64Pending += "=";
    decodeAndPlay(b64Pending);
  }

  free(decodeBuf);
  http.end();

  if (totalPlayed > 0) {
    qwen_last_success = true;
    qwen_last_error = "";
    Serial.println("[TTS] fallback stream ok");
  } else {
    qwen_last_success = false;
    qwen_last_error = "No audio data";
    Serial.println("[TTS] fallback stream fail");
  }
}`);

  generator.addFunction('qwen_play_base64_pcm', `
void qwen_play_base64_pcm(I2SClass &i2s, String base64Audio) {
  Serial.println("=== 播放TTS音频 ===");
  Serial.println("Base64数据长度: " + String(base64Audio.length()));

  if (base64Audio.startsWith("URL:")) {
    String audioUrl = base64Audio.substring(4);
    if (!qwen_play_wav_from_url(i2s, audioUrl)) {
      qwen_last_success = false;
      qwen_last_error = "URL play failed";
      return;
    }
    qwen_last_success = true;
    qwen_last_error = "";
    return;
  }

  size_t decodedMax = (base64Audio.length() * 3) / 4 + 4;
  uint8_t* pcmBuf = (uint8_t*)malloc(decodedMax);
  if (!pcmBuf) {
    Serial.println("鍐呭瓨鍒嗛厤澶辫触!");
    qwen_last_success = false;
    qwen_last_error = "Memory alloc failed";
    return;
  }

  size_t pcmLen = qwen_base64_decode_to_buffer(base64Audio.c_str(), pcmBuf, decodedMax);
  Serial.println("PCM数据大小: " + String(pcmLen) + " bytes");

  uint8_t* playData = pcmBuf;
  size_t playLen = pcmLen;
  qwen_omni_parse_wav_and_config_tx(i2s, pcmBuf, pcmLen, &playData, &playLen);

  if (playLen < 2) {
    Serial.println("PCM数据太短!");
    free(pcmBuf);
    qwen_last_success = false;
    qwen_last_error = "Invalid PCM data";
    return;
  }

  qwen_play_pcm_via_i2s(i2s, playData, playLen);
  free(pcmBuf);
  qwen_last_success = true;
  qwen_last_error = "";
}`);

  return `{
  String qwen_audio_tmp = ${base64Audio};
  if (qwen_audio_tmp.startsWith("URL:")) {
    qwen_play_base64_pcm(${varName}, qwen_audio_tmp);
  } else {
    qwen_play_base64_audio_to_i2s(${varName}, qwen_audio_tmp);
  }
}\n`;
};

Arduino.forBlock['qwen_omni_tts_and_play'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_spk';
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  const voice = block.getFieldValue('VOICE');
  const model = block.getFieldValue('MODEL');
  const language = block.getFieldValue('LANGUAGE');

  ensureQwenOmniI2SObject(generator, varName);
  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');
  generator.addLibrary('qwen_wifi_secure', '#include <WiFiClientSecure.h>');
  ensureQwenOmniPlaybackHelpers(generator);

  generator.addFunction('qwen_tts_stream_play_impl', `
void qwen_tts_stream_play_impl(I2SClass &i2s, String text, String voice, String model, String language) {
  Serial.println("[TTS] fallback stream begin");
  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    Serial.println("[TTS] fallback fail: WiFi");
    return;
  }

  HTTPClient http;
  String url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);
  http.addHeader("X-DashScope-SSE", "enable");

  String safeText = qwen_escape_json(text);
  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"input\\":{\\"text\\":\\"" + safeText + "\\",";
  requestBody += "\\"voice\\":\\"" + voice + "\\",";
  requestBody += "\\"language_type\\":\\"" + language + "\\"},";
  requestBody += "\\"stream\\":true}";

  int httpResponseCode = http.POST(requestBody);
  Serial.println("[TTS] fallback HTTP: " + String(httpResponseCode));
  if (httpResponseCode != 200) {
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
    String err = http.getString();
    if (err.length() > 160) err = err.substring(0, 160);
    Serial.println(err);
    http.end();
    return;
  }

  i2s.end();
  i2s.begin(I2S_MODE_STD, 24000, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO);

  WiFiClient *stream = http.getStreamPtr();
  String lineBuffer = "";
  String b64Pending = "";
  bool headerParsed = false;
  size_t totalPlayed = 0;
  unsigned long lastDataTime = millis();

  uint8_t* decodeBuf = (uint8_t*)malloc(16384);
  if (!decodeBuf) {
    qwen_last_success = false;
    qwen_last_error = "Memory alloc failed";
    http.end();
    return;
  }

  auto decodeAndPlay = [&](String b64Data) {
    if (b64Data.length() < 4) return;
    size_t outLen = 0;
    int dret = mbedtls_base64_decode(decodeBuf, 16384, &outLen, (const unsigned char*)b64Data.c_str(), b64Data.length());
    if (dret != 0 || outLen == 0) return;

    uint8_t* pcmPtr = decodeBuf;
    size_t playLen = outLen;
    if (!headerParsed) {
      if (outLen > 44 && decodeBuf[0] == 'R' && decodeBuf[1] == 'I' && decodeBuf[2] == 'F' && decodeBuf[3] == 'F') {
        int hdrLen = 44;
        int fmtSize = decodeBuf[16] | (decodeBuf[17] << 8) | (decodeBuf[18] << 16) | (decodeBuf[19] << 24);
        if (fmtSize > 16) hdrLen = 44 + (fmtSize - 16);
        uint16_t numCh = decodeBuf[22] | (decodeBuf[23] << 8);
        uint32_t sr = decodeBuf[24] | (decodeBuf[25] << 8) | (decodeBuf[26] << 16) | (decodeBuf[27] << 24);
        uint16_t bps = decodeBuf[34] | (decodeBuf[35] << 8);
        i2s.end();
        i2s.begin(I2S_MODE_STD, sr, (bps == 32) ? I2S_DATA_BIT_WIDTH_32BIT : I2S_DATA_BIT_WIDTH_16BIT, (numCh == 2) ? I2S_SLOT_MODE_STEREO : I2S_SLOT_MODE_MONO);
        if (hdrLen < (int)outLen) {
          pcmPtr = decodeBuf + hdrLen;
          playLen = outLen - hdrLen;
        } else {
          playLen = 0;
        }
      }
      headerParsed = true;
    }

    if (playLen > 0) {
      size_t w = 0;
      while (w < playLen) {
        size_t tw = min((size_t)512, playLen - w);
        i2s.write(pcmPtr + w, tw);
        w += tw;
      }
      totalPlayed += playLen;
    }
  };

  while (http.connected() || stream->available()) {
    if (!stream->available()) {
      if (millis() - lastDataTime > 12000) break;
      delay(2);
      continue;
    }
    char c = stream->read();
    lastDataTime = millis();
    if (c == '\\n') {
      lineBuffer.trim();
      if (lineBuffer.startsWith("data:")) {
        String data = lineBuffer.substring(5);
        data.trim();
        if (data == "[DONE]") break;
        int audioPos = data.indexOf("\\"audio\\":{\\"data\\":\\"");
        if (audioPos >= 0) {
          audioPos += 17;
          int audioEnd = data.indexOf("\\"", audioPos);
          if (audioEnd > audioPos) {
            b64Pending += qwen_sanitize_base64(data.substring(audioPos, audioEnd));
            int aligned = (b64Pending.length() / 4) * 4;
            if (aligned >= 4) {
              String part = b64Pending.substring(0, aligned);
              b64Pending = b64Pending.substring(aligned);
              decodeAndPlay(part);
            }
          }
        }
      }
      lineBuffer = "";
    } else if (c != '\\r') {
      lineBuffer += c;
    }
  }

  if (b64Pending.length() > 0) {
    while ((b64Pending.length() % 4) != 0) b64Pending += "=";
    decodeAndPlay(b64Pending);
  }

  free(decodeBuf);
  http.end();

  if (totalPlayed > 0) {
    qwen_last_success = true;
    qwen_last_error = "";
    Serial.println("[TTS] fallback stream ok");
  } else {
    qwen_last_success = false;
    qwen_last_error = "No audio data";
    Serial.println("[TTS] fallback stream fail");
  }
}`);

  generator.addFunction('qwen_tts_stream_play_impl_v3', `
void qwen_tts_stream_play_impl_v3(I2SClass &i2s, String text, String voice, String model, String language) {
  Serial.println("[TTS-STREAM] begin");
  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    Serial.println("[TTS-STREAM] fail: WiFi not connected");
    return;
  }

  HTTPClient http;
  String url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "text/event-stream");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);
  http.addHeader("X-DashScope-SSE", "enable");

  String safeText = qwen_escape_json(text);
  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"input\\":{\\"text\\":\\"" + safeText + "\\",";
  requestBody += "\\"voice\\":\\"" + voice + "\\",";
  requestBody += "\\"language_type\\":\\"" + language + "\\"},";
  requestBody += "\\"stream\\":true}";

  int httpResponseCode = http.POST(requestBody);
  Serial.println("[TTS-STREAM] HTTP: " + String(httpResponseCode));
  if (httpResponseCode != 200) {
    String err = http.getString();
    if (err.length() > 240) err = err.substring(0, 240);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
    Serial.println(err);
    http.end();
    return;
  }

  String fullText = "";
  size_t totalPlayed = qwen_stream_http_audio_to_i2s(http, i2s, &fullText, "TTS-STREAM");
  http.end();

  qwen_last_success = totalPlayed > 0;
  qwen_last_error = totalPlayed > 0 ? "" : (qwen_last_error.length() > 0 ? qwen_last_error : "No audio data");
  Serial.println(totalPlayed > 0 ? "[TTS-STREAM] ok" : "[TTS-STREAM] fail: no audio");
}`);

  generator.addFunction('qwen_tts_request_v2', `
String qwen_tts_request_v2(String text, String voice, String model, String language) {
  Serial.println("[TTS] request start");
  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    Serial.println("[TTS] fail: WiFi not connected");
    return "";
  }

  HTTPClient http;
  String url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
  http.begin(url);
  http.setTimeout(90000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  String safeText = qwen_escape_json(text);
  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"input\\":{\\"text\\":\\"" + safeText + "\\",";
  requestBody += "\\"voice\\":\\"" + voice + "\\",";
  requestBody += "\\"language_type\\":\\"" + language + "\\"},";
  requestBody += "\\"stream\\":false}";

  int httpResponseCode = http.POST(requestBody);
  Serial.println("[TTS] HTTP: " + String(httpResponseCode));
  String response = "";

  if (httpResponseCode == 200) {
    String body = http.getString();

    int audioPos = body.indexOf("\\"audio\\":{");
    if (audioPos < 0) audioPos = body.indexOf("\\"output\\":{\\"audio\\":{");
    if (audioPos >= 0) {
      int dataPos = body.indexOf("\\"data\\":\\"", audioPos);
      if (dataPos > audioPos) {
        dataPos += 9;
        int audioEnd = body.indexOf("\\"", dataPos);
        if (audioEnd > dataPos) response = qwen_sanitize_base64(body.substring(dataPos, audioEnd));
      }
    }

    if (response.length() == 0) {
      int urlPos = body.indexOf("\\"audio\\":{");
      if (urlPos < 0) urlPos = body.indexOf("\\"output\\":{\\"audio\\":{");
      if (urlPos >= 0) {
        int realUrlPos = body.indexOf("\\"url\\":\\"", urlPos);
        if (realUrlPos > urlPos) {
          realUrlPos += 8;
          int urlEnd = body.indexOf("\\"", realUrlPos);
          if (urlEnd > realUrlPos) {
            String audioUrl = body.substring(realUrlPos, urlEnd);
            audioUrl = qwen_unescape_json_string(audioUrl);
            response = "URL:" + audioUrl;
          }
        }
      }
    }

    if (response.length() > 0) {
      qwen_last_success = true;
      qwen_last_error = "";
      if (response.startsWith("URL:")) {
        Serial.println("[TTS] synth ok, url mode");
      } else {
        Serial.println("[TTS] synth ok, b64 len: " + String(response.length()));
      }
    } else {
      qwen_last_success = false;
      qwen_last_error = "Audio parse failed";
      Serial.println("[TTS] fail: audio parse failed");
      Serial.println(body.substring(0, min((int)body.length(), 220)));
    }
  } else {
    String err = http.getString();
    if (err.length() > 160) err = err.substring(0, 160);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
    Serial.println("[TTS] fail: HTTP " + String(httpResponseCode));
    Serial.println(err);
  }

  http.end();
  return response;
}`);
  generator.addFunction('qwen_base64_decode_to_buffer', `
size_t qwen_base64_decode_to_buffer(const char* input, uint8_t* output, size_t outputMax) {
  size_t outLen = 0;
  int ret = mbedtls_base64_decode(output, outputMax, &outLen, (const unsigned char*)input, strlen(input));
  if (ret != 0) return 0;
  return outLen;
}`);
  generator.addFunction('qwen_play_wav_from_url', `
bool qwen_play_wav_from_url(I2SClass &i2s, String audioUrl) {
  audioUrl = qwen_unescape_json_string(audioUrl);
  audioUrl.trim();
  if (!(audioUrl.startsWith("https://") || audioUrl.startsWith("http://"))) {
    Serial.println("[TTS] url invalid");
    return false;
  }
  Serial.println("[TTS] url len: " + String(audioUrl.length()));
  WiFiClientSecure secureClient;
  secureClient.setInsecure();
  HTTPClient http;
  http.setFollowRedirects(HTTPC_FORCE_FOLLOW_REDIRECTS);
  if (!http.begin(secureClient, audioUrl)) {
    Serial.println("[TTS] url begin fail");
    return false;
  }
  http.setTimeout(180000);
  int httpCode = http.GET();
  if (httpCode != 200) {
    Serial.println("[TTS] url GET fail: " + String(httpCode));
    http.end();
    return false;
  }

  WiFiClient* stream = http.getStreamPtr();
  uint8_t header[64];
  size_t got = 0;
  unsigned long start = millis();
  while (got < sizeof(header)) {
    if (stream->available()) {
      size_t n = stream->readBytes((char*)(header + got), sizeof(header) - got);
      if (n > 0) got += n;
    } else {
      if (millis() - start > 5000) break;
      delay(1);
    }
  }

  if (got < 44 || header[0] != 'R' || header[1] != 'I' || header[2] != 'F' || header[3] != 'F') {
    Serial.println("[TTS] url audio not wav");
    http.end();
    return false;
  }

  uint16_t numChannels = header[22] | (header[23] << 8);
  uint32_t sampleRate = header[24] | (header[25] << 8) | (header[26] << 16) | (header[27] << 24);
  uint16_t bitsPerSample = header[34] | (header[35] << 8);
  int headerLen = 44;
  int fmtSize = header[16] | (header[17] << 8) | (header[18] << 16) | (header[19] << 24);
  if (fmtSize > 16) headerLen = 44 + (fmtSize - 16);

  i2s.end();
  i2s.begin(I2S_MODE_STD, sampleRate, (bitsPerSample == 32) ? I2S_DATA_BIT_WIDTH_32BIT : I2S_DATA_BIT_WIDTH_16BIT, (numChannels == 2) ? I2S_SLOT_MODE_STEREO : I2S_SLOT_MODE_MONO);

  size_t written = 0;
  if (got < (size_t)headerLen) {
    size_t discard = headerLen - got;
    uint8_t skipBuf[128];
    while (discard > 0) {
      size_t rsz = min((size_t)sizeof(skipBuf), discard);
      size_t n = stream->readBytes((char*)skipBuf, rsz);
      if (n == 0) break;
      discard -= n;
    }
  }

  uint8_t preBuf[4096];
  size_t preLen = 0;
  if (got > (size_t)headerLen) {
    size_t payloadInHeader = got - headerLen;
    size_t cpy = min(payloadInHeader, (size_t)sizeof(preBuf));
    memcpy(preBuf, header + headerLen, cpy);
    preLen += cpy;
  }
  unsigned long preStart = millis();
  while (preLen < sizeof(preBuf)) {
    if (stream->available()) {
      size_t n = stream->readBytes((char*)(preBuf + preLen), sizeof(preBuf) - preLen);
      if (n > 0) preLen += n;
      else break;
    } else {
      if (millis() - preStart > 1500) break;
      delay(1);
    }
  }
  if (preLen > 0) {
    i2s.write(preBuf, preLen);
    written += preLen;
  }

  uint8_t ioBuf[2048];
  unsigned long last = millis();
  while (http.connected() || stream->available()) {
    if (stream->available()) {
      size_t n = stream->readBytes((char*)ioBuf, sizeof(ioBuf));
      if (n > 0) {
        i2s.write(ioBuf, n);
        written += n;
        last = millis();
      }
    } else {
      if (millis() - last > 5000) break;
      delay(1);
    }
  }

  http.end();
  return written > 0;
}`);
  generator.addFunction('qwen_play_pcm_via_i2s', `
void qwen_play_pcm_via_i2s(I2SClass &i2s, const uint8_t* pcmData, size_t pcmLen) {
  size_t bytesWritten = 0;
  size_t chunkSize = 1024;
  while (bytesWritten < pcmLen) {
    size_t toWrite = min(chunkSize, pcmLen - bytesWritten);
    i2s.write(pcmData + bytesWritten, toWrite);
    bytesWritten += toWrite;
  }
}`);
  generator.addFunction('qwen_omni_parse_wav_and_config_tx', `
bool qwen_omni_parse_wav_and_config_tx(I2SClass &i2s, const uint8_t* data, size_t totalLen, uint8_t** pcmOut, size_t* pcmLenOut) {
  uint32_t sampleRate = 24000;
  i2s_data_bit_width_t bitWidth = I2S_DATA_BIT_WIDTH_16BIT;
  i2s_slot_mode_t slotMode = I2S_SLOT_MODE_MONO;
  int headerLen = 0;

  if (totalLen > 44 && data[0] == 'R' && data[1] == 'I' && data[2] == 'F' && data[3] == 'F') {
    uint16_t numChannels = data[22] | (data[23] << 8);
    sampleRate = data[24] | (data[25] << 8) | (data[26] << 16) | (data[27] << 24);
    uint16_t bitsPerSample = data[34] | (data[35] << 8);
    slotMode = (numChannels == 2) ? I2S_SLOT_MODE_STEREO : I2S_SLOT_MODE_MONO;
    bitWidth = (bitsPerSample == 32) ? I2S_DATA_BIT_WIDTH_32BIT : I2S_DATA_BIT_WIDTH_16BIT;
    headerLen = 44;
    int fmtSize = data[16] | (data[17] << 8) | (data[18] << 16) | (data[19] << 24);
    if (fmtSize > 16) headerLen = 44 + (fmtSize - 16);
    Serial.println("WAV: " + String(sampleRate) + "Hz " + String(bitsPerSample) + "bit " + String(numChannels) + "ch");
  } else {
    Serial.println("PCM: " + String(sampleRate) + "Hz 16bit mono");
  }

  i2s.end();
  i2s.begin(I2S_MODE_STD, sampleRate, bitWidth, slotMode);

  *pcmOut = (uint8_t*)data + headerLen;
  *pcmLenOut = totalLen - headerLen;
  return headerLen > 0;
}`);

  generator.addFunction('qwen_play_wav_from_url', `
bool qwen_play_wav_from_url(I2SClass &i2s, String audioUrl) {
  audioUrl = qwen_unescape_json_string(audioUrl);
  audioUrl.trim();
  if (!(audioUrl.startsWith("https://") || audioUrl.startsWith("http://"))) {
    Serial.println("[OMNI] url invalid");
    return false;
  }
  Serial.println("[OMNI] url len: " + String(audioUrl.length()));
  WiFiClientSecure secureClient;
  secureClient.setInsecure();
  HTTPClient http;
  http.setFollowRedirects(HTTPC_FORCE_FOLLOW_REDIRECTS);
  if (!http.begin(secureClient, audioUrl)) {
    Serial.println("[OMNI] url begin fail");
    return false;
  }
  http.setTimeout(180000);
  int httpCode = http.GET();
  if (httpCode != 200) {
    Serial.println("[OMNI] url GET fail: " + String(httpCode));
    http.end();
    return false;
  }

  WiFiClient* stream = http.getStreamPtr();
  uint8_t header[64];
  size_t got = 0;
  unsigned long start = millis();
  while (got < sizeof(header)) {
    if (stream->available()) {
      size_t n = stream->readBytes((char*)(header + got), sizeof(header) - got);
      if (n > 0) got += n;
    } else {
      if (millis() - start > 5000) break;
      delay(1);
    }
  }

  if (got < 44 || header[0] != 'R' || header[1] != 'I' || header[2] != 'F' || header[3] != 'F') {
    http.end();
    return false;
  }

  uint16_t numChannels = header[22] | (header[23] << 8);
  uint32_t sampleRate = header[24] | (header[25] << 8) | (header[26] << 16) | (header[27] << 24);
  uint16_t bitsPerSample = header[34] | (header[35] << 8);
  int headerLen = 44;
  int fmtSize = header[16] | (header[17] << 8) | (header[18] << 16) | (header[19] << 24);
  if (fmtSize > 16) headerLen = 44 + (fmtSize - 16);

  i2s.end();
  i2s.begin(I2S_MODE_STD, sampleRate, (bitsPerSample == 32) ? I2S_DATA_BIT_WIDTH_32BIT : I2S_DATA_BIT_WIDTH_16BIT, (numChannels == 2) ? I2S_SLOT_MODE_STEREO : I2S_SLOT_MODE_MONO);

  size_t written = 0;
  uint8_t preBuf[4096];
  size_t preLen = 0;
  if (got > (size_t)headerLen) {
    size_t payloadInHeader = got - headerLen;
    size_t cpy = min(payloadInHeader, (size_t)sizeof(preBuf));
    memcpy(preBuf, header + headerLen, cpy);
    preLen += cpy;
  } else if (got < (size_t)headerLen) {
    size_t discard = headerLen - got;
    uint8_t skipBuf[128];
    while (discard > 0) {
      size_t rsz = min((size_t)sizeof(skipBuf), discard);
      size_t n = stream->readBytes((char*)skipBuf, rsz);
      if (n == 0) break;
      discard -= n;
    }
  }

  unsigned long preStart = millis();
  while (preLen < sizeof(preBuf)) {
    if (stream->available()) {
      size_t n = stream->readBytes((char*)(preBuf + preLen), sizeof(preBuf) - preLen);
      if (n > 0) preLen += n;
      else break;
    } else {
      if (millis() - preStart > 1500) break;
      delay(1);
    }
  }
  if (preLen > 0) {
    i2s.write(preBuf, preLen);
    written += preLen;
  }

  uint8_t ioBuf[2048];
  unsigned long last = millis();
  while (http.connected() || stream->available()) {
    if (stream->available()) {
      size_t n = stream->readBytes((char*)ioBuf, sizeof(ioBuf));
      if (n > 0) {
        i2s.write(ioBuf, n);
        written += n;
        last = millis();
      }
    } else {
      if (millis() - last > 5000) break;
      delay(1);
    }
  }

  http.end();
  return written > 0;
}`);

  var code = '{\n';
  code += '  Serial.println("[TTS] synth+play begin");\n';
  code += '  qwen_tts_data = qwen_tts_request_v2(' + text + ', "' + voice + '", "' + model + '", "' + language + '");\n';
  code += '  if (qwen_last_success && qwen_tts_data.length() > 0) {\n';
  code += '    if (qwen_tts_data.startsWith("URL:")) {\n';
  code += '      String audioUrl = qwen_tts_data.substring(4);\n';
  code += '      if (qwen_play_wav_from_url(' + varName + ', audioUrl)) {\n';
  code += '        Serial.println("[TTS] play ok, url mode");\n';
  code += '      } else {\n';
  code += '        Serial.println("[TTS] url mode failed, fallback stream...");\n';
  code += '        qwen_tts_stream_play_impl_v3(' + varName + ', ' + text + ', "' + voice + '", "' + model + '", "' + language + '");\n';
  code += '      }\n';
  code += '    } else {\n';
  code += '      if (qwen_play_base64_audio_to_i2s(' + varName + ', qwen_tts_data)) {\n';
  code += '        Serial.println("[TTS] play ok");\n';
  code += '      } else {\n';
  code += '        Serial.println("[TTS] fail: " + qwen_last_error);\n';
  code += '      }\n';
  code += '    }\n';
  code += '  } else {\n';
  code += '    Serial.println("[TTS] fail: " + qwen_last_error);\n';
  code += '  }\n';
  code += '  Serial.println("[TTS] synth+play end");\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['qwen_omni_tts_stream_play'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_spk';
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  const voice = block.getFieldValue('VOICE');
  const model = block.getFieldValue('MODEL');
  const language = block.getFieldValue('LANGUAGE');

  ensureQwenOmniI2SObject(generator, varName);
  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');
  ensureQwenOmniPlaybackHelpers(generator);

  generator.addFunction('qwen_tts_stream_play_impl', `
void qwen_tts_stream_play_impl(I2SClass &i2s, String text, String voice, String model, String language) {
  Serial.println("=== 通义TTS流式合成并播放开始 ===");
  Serial.println("文本: " + text);
  Serial.println("音色: " + voice);
  Serial.println("模型: " + model);
  Serial.println("语种: " + language);

  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    return;
  }

  HTTPClient http;
  String url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);
  http.addHeader("X-DashScope-SSE", "enable");

  String safeText = qwen_escape_json(text);
  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"input\\":{\\"text\\":\\"" + safeText + "\\",";
  requestBody += "\\"voice\\":\\"" + voice + "\\",";
  requestBody += "\\"language_type\\":\\"" + language + "\\"},";
  requestBody += "\\"stream\\":true}";

  Serial.println("发送TTS流式请求...");
  int httpResponseCode = http.POST(requestBody);
  Serial.println("HTTP响应码: " + String(httpResponseCode));

  if (httpResponseCode != 200) {
    String errorResponse = http.getString();
    Serial.println("HTTP閿欒: " + errorResponse);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
    http.end();
    return;
  }

  WiFiClient *stream = http.getStreamPtr();
  int totalBytes = 0;
  String lineBuffer = "";
  qwen_last_success = true;
  qwen_last_error = "";

  while (http.connected() || stream->available()) {
    if (!stream->available()) {
      delay(1);
      continue;
    }
    char c = stream->read();
    if (c == '\\n') {
      lineBuffer.trim();
      if (lineBuffer.startsWith("data:")) {
        String data = lineBuffer.substring(5);
        data.trim();
        if (data == "[DONE]") break;
        
        int audioPos = data.indexOf("\\"audio\\":{\\"data\\":\\"");
        if (audioPos >= 0) {
          audioPos += 17;
          int audioEnd = data.indexOf("\\"", audioPos);
          if (audioEnd > audioPos) {
            String b64Chunk = qwen_sanitize_base64(data.substring(audioPos, audioEnd));
            int bufLen = (b64Chunk.length() * 3) / 4 + 16;
            uint8_t *pcmBuf = (uint8_t *)malloc(bufLen);
            if (pcmBuf) {
              size_t outLen = 0;
              int ret = mbedtls_base64_decode(pcmBuf, bufLen, &outLen, (const unsigned char*)b64Chunk.c_str(), b64Chunk.length());
              if (ret == 0 && outLen > 0) {
                i2s.write(pcmBuf, outLen);
                totalBytes += outLen;
                /* progress omitted to avoid serial blocking */
              }
              free(pcmBuf);
            }
          }
        }
      }
      lineBuffer = "";
    } else if (c != '\\r') {
      lineBuffer += c;
    }
  }

  http.end();
  Serial.println("");
  Serial.println("流式播放完成，总字节数: " + String(totalBytes));
  Serial.println("=== 通义TTS流式合成并播放结束 ===");
}`);

  generator.addFunction('qwen_tts_stream_play_impl_v2', `
void qwen_tts_stream_play_impl_v2(I2SClass &i2s, String text, String voice, String model, String language) {
  Serial.println("[TTS-STREAM] begin");
  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    Serial.println("[TTS-STREAM] fail: WiFi not connected");
    return;
  }

  HTTPClient http;
  String url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);
  http.addHeader("X-DashScope-SSE", "enable");

  String safeText = qwen_escape_json(text);
  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"input\\":{\\"text\\":\\"" + safeText + "\\",";
  requestBody += "\\"voice\\":\\"" + voice + "\\",";
  requestBody += "\\"language_type\\":\\"" + language + "\\"},";
  requestBody += "\\"stream\\":true}";

  int httpResponseCode = http.POST(requestBody);
  Serial.println("[TTS-STREAM] HTTP: " + String(httpResponseCode));
  if (httpResponseCode != 200) {
    String err = http.getString();
    if (err.length() > 160) err = err.substring(0, 160);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
    Serial.println("[TTS-STREAM] fail");
    Serial.println(err);
    http.end();
    return;
  }

  i2s.end();
  i2s.begin(I2S_MODE_STD, 24000, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO);

  WiFiClient *stream = http.getStreamPtr();
  String lineBuffer = "";
  String b64Pending = "";
  unsigned long lastDataTime = millis();
  const unsigned long IDLE_TIMEOUT_MS = 12000;
  bool headerParsed = false;
  bool done = false;
  size_t totalPlayed = 0;

  uint8_t* decodeBuf = (uint8_t*)malloc(16384);
  if (!decodeBuf) {
    http.end();
    qwen_last_success = false;
    qwen_last_error = "Memory alloc failed";
    Serial.println("[TTS-STREAM] fail: memory");
    return;
  }

  auto decodeAndPlay = [&](String b64Data) {
    if (b64Data.length() < 4) return;
    size_t outLen = 0;
    int dret = mbedtls_base64_decode(decodeBuf, 16384, &outLen, (const unsigned char*)b64Data.c_str(), b64Data.length());
    if (dret != 0 || outLen == 0) return;

    uint8_t* pcmPtr = decodeBuf;
    size_t playLen = outLen;
    if (!headerParsed) {
      if (outLen > 44 && decodeBuf[0] == 'R' && decodeBuf[1] == 'I' && decodeBuf[2] == 'F' && decodeBuf[3] == 'F') {
        int hdrLen = 44;
        int fmtSize = decodeBuf[16] | (decodeBuf[17] << 8) | (decodeBuf[18] << 16) | (decodeBuf[19] << 24);
        if (fmtSize > 16) hdrLen = 44 + (fmtSize - 16);
        uint16_t numCh = decodeBuf[22] | (decodeBuf[23] << 8);
        uint32_t sr = decodeBuf[24] | (decodeBuf[25] << 8) | (decodeBuf[26] << 16) | (decodeBuf[27] << 24);
        uint16_t bps = decodeBuf[34] | (decodeBuf[35] << 8);
        i2s.end();
        i2s.begin(I2S_MODE_STD, sr, (bps == 32) ? I2S_DATA_BIT_WIDTH_32BIT : I2S_DATA_BIT_WIDTH_16BIT, (numCh == 2) ? I2S_SLOT_MODE_STEREO : I2S_SLOT_MODE_MONO);
        if (hdrLen < (int)outLen) {
          pcmPtr = decodeBuf + hdrLen;
          playLen = outLen - hdrLen;
        } else {
          playLen = 0;
        }
      }
      headerParsed = true;
    }

    if (playLen > 0) {
      size_t w = 0;
      while (w < playLen) {
        size_t tw = min((size_t)512, playLen - w);
        i2s.write(pcmPtr + w, tw);
        w += tw;
      }
      totalPlayed += playLen;
      /* progress omitted to avoid serial blocking */
    }
  };

  while (http.connected() || stream->available()) {
    if (!stream->available()) {
      if (millis() - lastDataTime > IDLE_TIMEOUT_MS) {
        Serial.println("\\n[TTS-STREAM] idle timeout");
        break;
      }
      delay(2);
      continue;
    }

    char c = stream->read();
    lastDataTime = millis();
    if (c == '\\n') {
      lineBuffer.trim();
      if (lineBuffer.startsWith("data:")) {
        String data = lineBuffer.substring(5);
        data.trim();
        if (data == "[DONE]") {
          done = true;
          break;
        }
        int audioPos = data.indexOf("\\"audio\\":{\\"data\\":\\"");
        if (audioPos >= 0) {
          audioPos += 17;
          int audioEnd = data.indexOf("\\"", audioPos);
          if (audioEnd > audioPos) {
            b64Pending += qwen_sanitize_base64(data.substring(audioPos, audioEnd));
            int aligned = (b64Pending.length() / 4) * 4;
            if (aligned >= 4) {
              String part = b64Pending.substring(0, aligned);
              b64Pending = b64Pending.substring(aligned);
              decodeAndPlay(part);
            }
          }
        }
      }
      lineBuffer = "";
    } else if (c != '\\r') {
      lineBuffer += c;
    }
  }

  if (b64Pending.length() > 0) {
    while ((b64Pending.length() % 4) != 0) b64Pending += "=";
    decodeAndPlay(b64Pending);
  }

  free(decodeBuf);
  http.end();

  if (!done) {
    Serial.println("[TTS-STREAM] end without DONE");
  }

  if (totalPlayed > 0) {
    qwen_last_success = true;
    qwen_last_error = "";
    Serial.println("\\n[TTS-STREAM] ok, bytes: " + String(totalPlayed));
  } else {
    qwen_last_success = false;
    qwen_last_error = "No audio data";
    Serial.println("\\n[TTS-STREAM] fail: no audio");
  }
}`);

  generator.addFunction('qwen_tts_stream_play_impl_v3', `
void qwen_tts_stream_play_impl_v3(I2SClass &i2s, String text, String voice, String model, String language) {
  Serial.println("[TTS-STREAM] begin");
  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    Serial.println("[TTS-STREAM] fail: WiFi not connected");
    return;
  }

  HTTPClient http;
  String url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "text/event-stream");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);
  http.addHeader("X-DashScope-SSE", "enable");

  String safeText = qwen_escape_json(text);
  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"input\\":{\\"text\\":\\"" + safeText + "\\",";
  requestBody += "\\"voice\\":\\"" + voice + "\\",";
  requestBody += "\\"language_type\\":\\"" + language + "\\"},";
  requestBody += "\\"stream\\":true}";

  int httpResponseCode = http.POST(requestBody);
  Serial.println("[TTS-STREAM] HTTP: " + String(httpResponseCode));
  if (httpResponseCode != 200) {
    String err = http.getString();
    if (err.length() > 240) err = err.substring(0, 240);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
    Serial.println(err);
    http.end();
    return;
  }

  String fullText = "";
  size_t totalPlayed = qwen_stream_http_audio_to_i2s(http, i2s, &fullText, "TTS-STREAM");
  http.end();

  qwen_last_success = totalPlayed > 0;
  qwen_last_error = totalPlayed > 0 ? "" : (qwen_last_error.length() > 0 ? qwen_last_error : "No audio data");
  Serial.println(totalPlayed > 0 ? "[TTS-STREAM] ok" : "[TTS-STREAM] fail: no audio");
}`);

  var code = 'qwen_tts_stream_play_impl_v3(' + varName + ', ' + text + ', "' + voice + '", "' + model + '", "' + language + '");\n';
  return code;
};

Arduino.forBlock['qwen_omni_omni_text'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  generator.addFunction('qwen_omni_text_request', `
String qwen_omni_text_request(String model, String message) {
  Serial.println("=== 通义全模态对话开始(仅文字/流式) ===");
  Serial.println("模型: " + model);
  Serial.println("消息: " + message);

  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = qwen_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  String safeMessage = qwen_escape_json(message);
  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"messages\\":[{\\"role\\":\\"user\\",\\"content\\":\\"" + safeMessage + "\\"}],";
  requestBody += "\\"modalities\\":[\\"text\\"],";
  requestBody += "\\"stream\\":true}";

  Serial.println("发送全模态文字请求...");
  int httpResponseCode = http.POST(requestBody);
  Serial.println("HTTP响应码: " + String(httpResponseCode));
  String response = "";

  if (httpResponseCode == 200) {
    WiFiClient* stream = http.getStreamPtr();
    String fullContent = "";
    String buffer = "";
    
    while (http.connected() || stream->available()) {
      if (stream->available()) {
        char c = stream->read();
        buffer += c;
        
        if (c == '\\n') {
          buffer.trim();
          if (buffer.startsWith("data:")) {
            String data = buffer.substring(5);
            data.trim();
            
            if (data == "[DONE]") {
              Serial.println();
              Serial.println("Omni text stream done");
              break;
            }
            
            int contentStart = data.indexOf("\\"content\\":\\"");
            if (contentStart >= 0) {
              contentStart += 11;
              int contentEnd = data.indexOf("\\"", contentStart);
              if (contentEnd > contentStart) {
                String content = data.substring(contentStart, contentEnd);
                Serial.print(content);
                fullContent += content;
                if (qwen_stream_callback != NULL) {
                  qwen_stream_chunk = content;
                  qwen_stream_callback();
                }
              }
            }
          }
          buffer = "";
        }
      }
      delay(1);
    }
    
    if (fullContent.length() > 0) {
      response = fullContent;
      qwen_last_success = true;
      qwen_last_error = "";
    } else {
      Serial.println("Omni text stream parse failed");
      qwen_last_success = false;
      qwen_last_error = "Stream parse error";
    }
  } else {
    String errorResponse = http.getString();
    Serial.println("HTTP閿欒: " + errorResponse);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  Serial.println("=== 通义全模态对话结束 ===");
  return response;
}`);

  const code = `qwen_omni_text_request("${model}", ${message})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwen_omni_omni_and_play'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_spk';
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');
  const voice = block.getFieldValue('VOICE');

  ensureQwenOmniI2SObject(generator, varName);
  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');
  ensureQwenOmniPlaybackHelpers(generator);

  generator.addFunction('qwen_omni_parse_wav_and_config_tx', `
bool qwen_omni_parse_wav_and_config_tx(I2SClass &i2s, const uint8_t* data, size_t totalLen, uint8_t** pcmOut, size_t* pcmLenOut) {
  uint32_t sampleRate = 24000;
  i2s_data_bit_width_t bitWidth = I2S_DATA_BIT_WIDTH_16BIT;
  i2s_slot_mode_t slotMode = I2S_SLOT_MODE_MONO;
  int headerLen = 0;

  if (totalLen > 44 && data[0] == 'R' && data[1] == 'I' && data[2] == 'F' && data[3] == 'F') {
    uint16_t numChannels = data[22] | (data[23] << 8);
    sampleRate = data[24] | (data[25] << 8) | (data[26] << 16) | (data[27] << 24);
    uint16_t bitsPerSample = data[34] | (data[35] << 8);
    slotMode = (numChannels == 2) ? I2S_SLOT_MODE_STEREO : I2S_SLOT_MODE_MONO;
    bitWidth = (bitsPerSample == 32) ? I2S_DATA_BIT_WIDTH_32BIT : I2S_DATA_BIT_WIDTH_16BIT;
    headerLen = 44;
    int fmtSize = data[16] | (data[17] << 8) | (data[18] << 16) | (data[19] << 24);
    if (fmtSize > 16) headerLen = 44 + (fmtSize - 16);
    Serial.println("WAV: " + String(sampleRate) + "Hz " + String(bitsPerSample) + "bit " + String(numChannels) + "ch");
  } else {
    Serial.println("PCM: " + String(sampleRate) + "Hz 16bit mono");
  }

  i2s.end();
  i2s.begin(I2S_MODE_STD, sampleRate, bitWidth, slotMode);

  *pcmOut = (uint8_t*)data + headerLen;
  *pcmLenOut = totalLen - headerLen;
  return headerLen > 0;
}`);

  generator.addFunction('qwen_omni_and_play_request_v2', `
void qwen_omni_and_play_request_v2(I2SClass &i2s, String model, String message, String voice) {
  Serial.println("[OMNI] play begin");
  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    Serial.println("[OMNI] fail: WiFi not connected");
    return;
  }

  HTTPClient http;
  String url = qwen_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  String safeMessage = qwen_escape_json(message);
  String safeSystem = qwen_escape_json("\u8bf7\u7528\u9002\u5408\u8bed\u97f3\u64ad\u653e\u7684\u7b80\u77ed\u4e2d\u6587\u56de\u7b54\uff0c\u4f18\u5148\u63a7\u5236\u572860\u5b57\u4ee5\u5185\uff1b\u5982\u679c\u4fe1\u606f\u5f88\u591a\uff0c\u5148\u7ed9\u7ed3\u8bba\u548c\u6700\u591a3\u4e2a\u8981\u70b9\uff0c\u4e0d\u8981\u5c55\u5f00\u957f\u7bc7\u5217\u8868\u3002");
  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"messages\\":[{\\"role\\":\\"system\\",\\"content\\":\\"" + safeSystem + "\\"},{\\"role\\":\\"user\\",\\"content\\":\\"" + safeMessage + "\\"}],";
  requestBody += "\\"modalities\\":[\\"text\\",\\"audio\\"],";
  requestBody += "\\"audio\\":{\\"voice\\":\\"" + voice + "\\",\\"format\\":\\"wav\\"},";
  requestBody += "\\"stream\\":true}";

  int httpResponseCode = http.POST(requestBody);
  Serial.println("[OMNI] HTTP: " + String(httpResponseCode));
  if (httpResponseCode != 200) {
    String err = http.getString();
    if (err.length() > 160) err = err.substring(0, 160);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
    Serial.println("[OMNI] fail");
    Serial.println(err);
    http.end();
    return;
  }

  i2s.end();
  i2s.begin(I2S_MODE_STD, 24000, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO);

  WiFiClient *stream = http.getStreamPtr();
  String lineBuffer = "";
  String b64Pending = "";
  String textPreview = "";
  unsigned long lastDataTime = millis();
  const unsigned long IDLE_TIMEOUT_MS = 12000;
  bool headerParsed = false;
  bool done = false;
  size_t totalPlayed = 0;

  uint8_t* decodeBuf = (uint8_t*)malloc(16384);
  if (!decodeBuf) {
    http.end();
    qwen_last_success = false;
    qwen_last_error = "Memory alloc failed";
    Serial.println("[OMNI] fail: memory");
    return;
  }

  auto decodeAndPlay = [&](String b64Data) {
    if (b64Data.length() < 4) return;
    size_t outLen = 0;
    int dret = mbedtls_base64_decode(decodeBuf, 16384, &outLen, (const unsigned char*)b64Data.c_str(), b64Data.length());
    if (dret != 0 || outLen == 0) return;

    uint8_t* pcmPtr = decodeBuf;
    size_t playLen = outLen;
    if (!headerParsed) {
      if (outLen > 44 && decodeBuf[0] == 'R' && decodeBuf[1] == 'I' && decodeBuf[2] == 'F' && decodeBuf[3] == 'F') {
        int hdrLen = 44;
        int fmtSize = decodeBuf[16] | (decodeBuf[17] << 8) | (decodeBuf[18] << 16) | (decodeBuf[19] << 24);
        if (fmtSize > 16) hdrLen = 44 + (fmtSize - 16);
        uint16_t numCh = decodeBuf[22] | (decodeBuf[23] << 8);
        uint32_t sr = decodeBuf[24] | (decodeBuf[25] << 8) | (decodeBuf[26] << 16) | (decodeBuf[27] << 24);
        uint16_t bps = decodeBuf[34] | (decodeBuf[35] << 8);
        i2s.end();
        i2s.begin(I2S_MODE_STD, sr, (bps == 32) ? I2S_DATA_BIT_WIDTH_32BIT : I2S_DATA_BIT_WIDTH_16BIT, (numCh == 2) ? I2S_SLOT_MODE_STEREO : I2S_SLOT_MODE_MONO);
        if (hdrLen < (int)outLen) {
          pcmPtr = decodeBuf + hdrLen;
          playLen = outLen - hdrLen;
        } else {
          playLen = 0;
        }
      }
      headerParsed = true;
    }

    if (playLen > 0) {
      size_t w = 0;
      while (w < playLen) {
        size_t tw = min((size_t)512, playLen - w);
        i2s.write(pcmPtr + w, tw);
        w += tw;
      }
      totalPlayed += playLen;
    }
  };

  while (http.connected() || stream->available()) {
    if (!stream->available()) {
      if (millis() - lastDataTime > IDLE_TIMEOUT_MS) {
        Serial.println("[OMNI] idle timeout");
        break;
      }
      delay(2);
      continue;
    }

    char c = stream->read();
    lastDataTime = millis();
    if (c == '\\n') {
      lineBuffer.trim();
      if (lineBuffer.startsWith("data:")) {
        String data = lineBuffer.substring(5);
        data.trim();
        if (data == "[DONE]") {
          done = true;
          break;
        }

        int contentStart = data.indexOf("\\"content\\":\\"");
        if (contentStart >= 0) {
          contentStart += 11;
          int contentEnd = data.indexOf("\\"", contentStart);
          if (contentEnd > contentStart && textPreview.length() < 160) {
            String content = data.substring(contentStart, contentEnd);
            if (textPreview.length() + content.length() > 160) {
              content = content.substring(0, 160 - textPreview.length());
            }
            textPreview += content;
          }
        }

        int audioPos = data.indexOf("\\"audio\\":{\\"data\\":\\"");
        if (audioPos >= 0) {
          audioPos += 17;
          int audioEnd = data.indexOf("\\"", audioPos);
          if (audioEnd > audioPos) {
            b64Pending += qwen_sanitize_base64(data.substring(audioPos, audioEnd));
            int aligned = (b64Pending.length() / 4) * 4;
            if (aligned >= 4) {
              String part = b64Pending.substring(0, aligned);
              b64Pending = b64Pending.substring(aligned);
              decodeAndPlay(part);
            }
          }
        }
      }
      lineBuffer = "";
    } else if (c != '\\r') {
      lineBuffer += c;
    }
  }

  if (b64Pending.length() > 0) {
    while ((b64Pending.length() % 4) != 0) b64Pending += "=";
    decodeAndPlay(b64Pending);
  }

  free(decodeBuf);
  http.end();

  if (textPreview.length() > 0) {
    Serial.println("[OMNI] text: " + textPreview);
  }

  if (!done) {
    Serial.println("[OMNI] end without DONE");
  }

  if (totalPlayed > 0) {
    qwen_omni_audio_data = "";
    qwen_last_success = true;
    qwen_last_error = "";
    Serial.println("[OMNI] play ok, bytes: " + String(totalPlayed));
  } else {
    qwen_last_success = false;
    qwen_last_error = "No audio data";
    Serial.println("[OMNI] fail: no audio");
  }
}`);

  generator.addFunction('qwen_omni_and_play_request_v3', `
void qwen_omni_and_play_request_v3(I2SClass &i2s, String model, String message, String voice) {
  Serial.println("[OMNI] play begin");
  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    Serial.println("[OMNI] fail: WiFi not connected");
    return;
  }

  HTTPClient http;
  String url = qwen_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "text/event-stream");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  String safeMessage = qwen_escape_json(message);
  String safeSystem = qwen_escape_json("\u8bf7\u7528\u9002\u5408\u8bed\u97f3\u64ad\u653e\u7684\u7b80\u77ed\u4e2d\u6587\u56de\u7b54\uff0c\u4f18\u5148\u63a7\u5236\u572860\u5b57\u4ee5\u5185\uff1b\u5982\u679c\u4fe1\u606f\u5f88\u591a\uff0c\u5148\u7ed9\u7ed3\u8bba\u548c\u6700\u591a3\u4e2a\u8981\u70b9\uff0c\u4e0d\u8981\u5c55\u5f00\u957f\u7bc7\u5217\u8868\u3002");
  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"messages\\":[{\\"role\\":\\"system\\",\\"content\\":\\"" + safeSystem + "\\"},{\\"role\\":\\"user\\",\\"content\\":\\"" + safeMessage + "\\"}],";
  requestBody += "\\"modalities\\":[\\"text\\",\\"audio\\"],";
  requestBody += "\\"audio\\":{\\"voice\\":\\"" + voice + "\\",\\"format\\":\\"wav\\"},";
  requestBody += "\\"stream\\":true,\\"stream_options\\":{\\"include_usage\\":true}}";

  int httpResponseCode = http.POST(requestBody);
  Serial.println("[OMNI] HTTP: " + String(httpResponseCode));
  if (httpResponseCode != 200) {
    String err = http.getString();
    if (err.length() > 240) err = err.substring(0, 240);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
    Serial.println(err);
    http.end();
    return;
  }

  String fullText = "";
  size_t totalPlayed = qwen_stream_http_audio_to_i2s(http, i2s, &fullText, "OMNI");
  http.end();

  qwen_omni_audio_data = "";
  qwen_last_success = totalPlayed > 0;
  qwen_last_error = totalPlayed > 0 ? "" : (qwen_last_error.length() > 0 ? qwen_last_error : "No audio data");
  Serial.println(totalPlayed > 0 ? "\\n[OMNI] play ok" : "\\n[OMNI] fail: no audio");
}`);

  var code = 'qwen_omni_and_play_request_v3(' + varName + ', "' + model + '", ' + message + ', "' + voice + '");\n';
  return code;
};

Arduino.forBlock['qwen_omni_omni_stream_play'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_spk';
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');
  const voice = block.getFieldValue('VOICE');

  ensureQwenOmniI2SObject(generator, varName);
  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');
  ensureQwenOmniPlaybackHelpers(generator);

  generator.addFunction('qwen_omni_parse_wav_and_config_tx', `
bool qwen_omni_parse_wav_and_config_tx(I2SClass &i2s, const uint8_t* data, size_t totalLen, uint8_t** pcmOut, size_t* pcmLenOut) {
  uint32_t sampleRate = 24000;
  i2s_data_bit_width_t bitWidth = I2S_DATA_BIT_WIDTH_16BIT;
  i2s_slot_mode_t slotMode = I2S_SLOT_MODE_MONO;
  int headerLen = 0;

  if (totalLen > 44 && data[0] == 'R' && data[1] == 'I' && data[2] == 'F' && data[3] == 'F') {
    uint16_t numChannels = data[22] | (data[23] << 8);
    sampleRate = data[24] | (data[25] << 8) | (data[26] << 16) | (data[27] << 24);
    uint16_t bitsPerSample = data[34] | (data[35] << 8);
    slotMode = (numChannels == 2) ? I2S_SLOT_MODE_STEREO : I2S_SLOT_MODE_MONO;
    bitWidth = (bitsPerSample == 32) ? I2S_DATA_BIT_WIDTH_32BIT : I2S_DATA_BIT_WIDTH_16BIT;
    headerLen = 44;
    int fmtSize = data[16] | (data[17] << 8) | (data[18] << 16) | (data[19] << 24);
    if (fmtSize > 16) headerLen = 44 + (fmtSize - 16);
    Serial.println("WAV: " + String(sampleRate) + "Hz " + String(bitsPerSample) + "bit " + String(numChannels) + "ch");
  } else {
    Serial.println("PCM: " + String(sampleRate) + "Hz 16bit mono");
  }

  i2s.end();
  i2s.begin(I2S_MODE_STD, sampleRate, bitWidth, slotMode);

  *pcmOut = (uint8_t*)data + headerLen;
  *pcmLenOut = totalLen - headerLen;
  return headerLen > 0;
}`);

  generator.addFunction('qwen_omni_stream_play_request', `
void qwen_omni_stream_play_request(I2SClass &i2s, String model, String message, String voice) {
  Serial.println("=== 通义全模态流式对话并播放开始 ===");
  Serial.println("模型: " + model);
  Serial.println("消息: " + message);
  Serial.println("音色: " + voice);

  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    return;
  }

  HTTPClient http;
  String url = qwen_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  String safeMessage = qwen_escape_json(message);
  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"messages\\":[{\\"role\\":\\"user\\",\\"content\\":\\"" + safeMessage + "\\"}],";
  requestBody += "\\"modalities\\":[\\"text\\",\\"audio\\"],";
  requestBody += "\\"audio\\":{\\"voice\\":\\"" + voice + "\\",\\"format\\":\\"wav\\"},";
  requestBody += "\\"stream\\":true}";

  Serial.println("发送全模态流式请求...");
  int httpResponseCode = http.POST(requestBody);
  Serial.println("HTTP响应码: " + String(httpResponseCode));

  if (httpResponseCode != 200) {
    String errorResponse = http.getString();
    Serial.println("HTTP閿欒: " + errorResponse);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
    http.end();
    return;
  }

  i2s.end();
  i2s.begin(I2S_MODE_STD, 24000, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO);

  WiFiClient *stream = http.getStreamPtr();
  String fullText = "";
  String lineBuffer = "";
  bool headerParsed = false;
  size_t totalPlayed = 0;
  uint8_t* decodeBuf = (uint8_t*)malloc(16384);
  if (!decodeBuf) Serial.println("Warning: decode buffer alloc failed");

  while (http.connected() || stream->available()) {
    if (!stream->available()) {
      delay(1);
      continue;
    }
    char c = stream->read();
    if (c == '\\n') {
      lineBuffer.trim();
      if (lineBuffer.startsWith("data:")) {
        String data = lineBuffer.substring(5);
        data.trim();
        if (data == "[DONE]") break;
        
        int contentStart = data.indexOf("\\"content\\":\\"");
        if (contentStart >= 0) {
          contentStart += 11;
          int contentEnd = data.indexOf("\\"", contentStart);
          if (contentEnd > contentStart) {
            String content = data.substring(contentStart, contentEnd);
            Serial.print(content);
            fullText += content;
            if (qwen_stream_callback != NULL) {
              qwen_stream_chunk = content;
              qwen_stream_callback();
            }
          }
        }
        
        int audioPos = data.indexOf("\\"audio\\":{\\"data\\":\\"");
        if (audioPos >= 0) {
          audioPos += 17;
          int audioEnd = data.indexOf("\\"", audioPos);
          if (audioEnd > audioPos) {
            String b64Chunk = qwen_sanitize_base64(data.substring(audioPos, audioEnd));
            if (b64Chunk.length() > 0 && decodeBuf) {
              size_t pcmLen = 0;
              int dret = mbedtls_base64_decode(decodeBuf, 16384, &pcmLen, (const unsigned char*)b64Chunk.c_str(), b64Chunk.length());
              if (dret == 0 && pcmLen > 0) {
                uint8_t* pcmPtr = decodeBuf;
                size_t toPlay = pcmLen;
                if (!headerParsed && pcmLen > 44 && decodeBuf[0] == 'R' && decodeBuf[1] == 'I' && decodeBuf[2] == 'F' && decodeBuf[3] == 'F') {
                  headerParsed = true;
                  int hdrLen = 44;
                  int fmtSz = decodeBuf[16] | (decodeBuf[17] << 8) | (decodeBuf[18] << 16) | (decodeBuf[19] << 24);
                  if (fmtSz > 16) hdrLen = 44 + (fmtSz - 16);
                  pcmPtr = decodeBuf + hdrLen;
                  toPlay = pcmLen - hdrLen;
                  uint16_t numCh = decodeBuf[22] | (decodeBuf[23] << 8);
                  uint32_t sr = decodeBuf[24] | (decodeBuf[25] << 8) | (decodeBuf[26] << 16) | (decodeBuf[27] << 24);
                  uint16_t bps = decodeBuf[34] | (decodeBuf[35] << 8);
                  if (sr != 24000 || numCh != 1 || bps != 16) {
                    i2s.end();
                    i2s.begin(I2S_MODE_STD, sr, (bps == 32) ? I2S_DATA_BIT_WIDTH_32BIT : I2S_DATA_BIT_WIDTH_16BIT, (numCh == 2) ? I2S_SLOT_MODE_STEREO : I2S_SLOT_MODE_MONO);
                  }
                  Serial.println("WAV: " + String(sr) + "Hz " + String(bps) + "bit " + String(numCh) + "ch");
                } else if (!headerParsed) {
                  headerParsed = true;
                }
                if (toPlay > 0) {
                  size_t w = 0;
                  while (w < toPlay) {
                    size_t tw = min((size_t)512, toPlay - w);
                    i2s.write(pcmPtr + w, tw);
                    w += tw;
                  }
                  totalPlayed += toPlay;
                }
              }
            }
          }
        }
      }
      lineBuffer = "";
    } else if (c != '\\r') {
      lineBuffer += c;
    }
  }

  if (decodeBuf) free(decodeBuf);
  http.end();
  Serial.println("");
  Serial.println("流式播放完成，总字节数: " + String(totalPlayed));

  i2s.end();
  i2s.begin(I2S_MODE_STD, 24000, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO);

  if (totalPlayed > 0) {
    qwen_last_success = true;
    qwen_last_error = "";
  } else {
    qwen_last_success = false;
    qwen_last_error = "No audio data";
    Serial.println("No audio data received");
  }
  Serial.println("=== 通义全模态流式对话并播放结束 ===");
}`);

  generator.addFunction('qwen_omni_stream_play_request_v2', `
void qwen_omni_stream_play_request_v2(I2SClass &i2s, String model, String message, String voice) {
  Serial.println("[OMNI-STREAM] begin");
  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    Serial.println("[OMNI-STREAM] fail: WiFi not connected");
    return;
  }

  HTTPClient http;
  String url = qwen_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  String safeMessage = qwen_escape_json(message);
  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"messages\\":[{\\"role\\":\\"user\\",\\"content\\":\\"" + safeMessage + "\\"}],";
  requestBody += "\\"modalities\\":[\\"text\\",\\"audio\\"],";
  requestBody += "\\"audio\\":{\\"voice\\":\\"" + voice + "\\",\\"format\\":\\"wav\\"},";
  requestBody += "\\"stream\\":true}";

  int httpResponseCode = http.POST(requestBody);
  Serial.println("[OMNI-STREAM] HTTP: " + String(httpResponseCode));
  if (httpResponseCode != 200) {
    String err = http.getString();
    if (err.length() > 160) err = err.substring(0, 160);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
    Serial.println("[OMNI-STREAM] fail");
    Serial.println(err);
    http.end();
    return;
  }

  i2s.end();
  i2s.begin(I2S_MODE_STD, 24000, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO);

  WiFiClient *stream = http.getStreamPtr();
  String lineBuffer = "";
  String b64Pending = "";
  unsigned long lastDataTime = millis();
  const unsigned long IDLE_TIMEOUT_MS = 12000;
  bool headerParsed = false;
  bool done = false;
  size_t totalPlayed = 0;

  uint8_t* decodeBuf = (uint8_t*)malloc(16384);
  if (!decodeBuf) {
    http.end();
    qwen_last_success = false;
    qwen_last_error = "Memory alloc failed";
    Serial.println("[OMNI-STREAM] fail: memory");
    return;
  }

  auto decodeAndPlay = [&](String b64Data) {
    if (b64Data.length() < 4) return;
    size_t outLen = 0;
    int dret = mbedtls_base64_decode(decodeBuf, 16384, &outLen, (const unsigned char*)b64Data.c_str(), b64Data.length());
    if (dret != 0 || outLen == 0) return;

    uint8_t* pcmPtr = decodeBuf;
    size_t playLen = outLen;
    if (!headerParsed) {
      if (outLen > 44 && decodeBuf[0] == 'R' && decodeBuf[1] == 'I' && decodeBuf[2] == 'F' && decodeBuf[3] == 'F') {
        int hdrLen = 44;
        int fmtSize = decodeBuf[16] | (decodeBuf[17] << 8) | (decodeBuf[18] << 16) | (decodeBuf[19] << 24);
        if (fmtSize > 16) hdrLen = 44 + (fmtSize - 16);
        uint16_t numCh = decodeBuf[22] | (decodeBuf[23] << 8);
        uint32_t sr = decodeBuf[24] | (decodeBuf[25] << 8) | (decodeBuf[26] << 16) | (decodeBuf[27] << 24);
        uint16_t bps = decodeBuf[34] | (decodeBuf[35] << 8);
        i2s.end();
        i2s.begin(I2S_MODE_STD, sr, (bps == 32) ? I2S_DATA_BIT_WIDTH_32BIT : I2S_DATA_BIT_WIDTH_16BIT, (numCh == 2) ? I2S_SLOT_MODE_STEREO : I2S_SLOT_MODE_MONO);
        if (hdrLen < (int)outLen) {
          pcmPtr = decodeBuf + hdrLen;
          playLen = outLen - hdrLen;
        } else {
          playLen = 0;
        }
      }
      headerParsed = true;
    }

    if (playLen > 0) {
      size_t w = 0;
      while (w < playLen) {
        size_t tw = min((size_t)512, playLen - w);
        i2s.write(pcmPtr + w, tw);
        w += tw;
      }
      totalPlayed += playLen;
      /* progress omitted to avoid serial blocking */
    }
  };

  while (http.connected() || stream->available()) {
    if (!stream->available()) {
      if (millis() - lastDataTime > IDLE_TIMEOUT_MS) {
        Serial.println("\\n[OMNI-STREAM] idle timeout");
        break;
      }
      delay(2);
      continue;
    }

    char c = stream->read();
    lastDataTime = millis();
    if (c == '\\n') {
      lineBuffer.trim();
      if (lineBuffer.startsWith("data:")) {
        String data = lineBuffer.substring(5);
        data.trim();
        if (data == "[DONE]") {
          done = true;
          break;
        }

        int contentStart = data.indexOf("\\"content\\":\\"");
        if (contentStart >= 0) {
          contentStart += 11;
          int contentEnd = data.indexOf("\\"", contentStart);
          if (contentEnd > contentStart) {
            String content = data.substring(contentStart, contentEnd);
            Serial.print(content);
            if (qwen_stream_callback != NULL) {
              qwen_stream_chunk = content;
              qwen_stream_callback();
            }
          }
        }

        int audioPos = data.indexOf("\\"audio\\":{\\"data\\":\\"");
        if (audioPos >= 0) {
          audioPos += 17;
          int audioEnd = data.indexOf("\\"", audioPos);
          if (audioEnd > audioPos) {
            String b64Chunk = qwen_sanitize_base64(data.substring(audioPos, audioEnd));
            b64Pending += b64Chunk;
            int aligned = (b64Pending.length() / 4) * 4;
            if (aligned >= 4) {
              String part = b64Pending.substring(0, aligned);
              b64Pending = b64Pending.substring(aligned);
              decodeAndPlay(part);
            }
          }
        }
      }
      lineBuffer = "";
    } else if (c != '\\r') {
      lineBuffer += c;
    }
  }

  if (b64Pending.length() > 0) {
    while ((b64Pending.length() % 4) != 0) b64Pending += "=";
    decodeAndPlay(b64Pending);
  }

  free(decodeBuf);
  http.end();

  if (!done) {
    Serial.println("[OMNI-STREAM] end without DONE");
  }

  if (totalPlayed > 0) {
    qwen_last_success = true;
    qwen_last_error = "";
    Serial.println("\\n[OMNI-STREAM] ok, bytes: " + String(totalPlayed));
  } else {
    qwen_last_success = false;
    qwen_last_error = "No audio data";
    Serial.println("\\n[OMNI-STREAM] fail: no audio");
  }
}`);

  generator.addFunction('qwen_omni_stream_play_request_v3', `
void qwen_omni_stream_play_request_v3(I2SClass &i2s, String model, String message, String voice) {
  Serial.println("[OMNI-STREAM] begin");
  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    Serial.println("[OMNI-STREAM] fail: WiFi not connected");
    return;
  }

  HTTPClient http;
  String url = qwen_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "text/event-stream");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  String safeMessage = qwen_escape_json(message);
  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"messages\\":[{\\"role\\":\\"user\\",\\"content\\":\\"" + safeMessage + "\\"}],";
  requestBody += "\\"modalities\\":[\\"text\\",\\"audio\\"],";
  requestBody += "\\"audio\\":{\\"voice\\":\\"" + voice + "\\",\\"format\\":\\"wav\\"},";
  requestBody += "\\"stream\\":true,\\"stream_options\\":{\\"include_usage\\":true}}";

  int httpResponseCode = http.POST(requestBody);
  Serial.println("[OMNI-STREAM] HTTP: " + String(httpResponseCode));
  if (httpResponseCode != 200) {
    String err = http.getString();
    if (err.length() > 240) err = err.substring(0, 240);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
    Serial.println(err);
    http.end();
    return;
  }

  String fullText = "";
  size_t totalPlayed = qwen_stream_http_audio_to_i2s(http, i2s, &fullText, "OMNI-STREAM");
  http.end();

  qwen_last_success = totalPlayed > 0;
  qwen_last_error = totalPlayed > 0 ? "" : (qwen_last_error.length() > 0 ? qwen_last_error : "No audio data");
  Serial.println(totalPlayed > 0 ? "\\n[OMNI-STREAM] ok" : "\\n[OMNI-STREAM] fail: no audio");
}`);

  var code = 'qwen_omni_stream_play_request_v3(' + varName + ', "' + model + '", ' + message + ', "' + voice + '");\n';
  return code;
};

Arduino.forBlock['qwen_omni_omni_get_audio'] = function(block, generator) {
  return ['qwen_omni_audio_data', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['qwen_omni_tts_voice_design'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_spk';
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  const voiceDesc = generator.valueToCode(block, 'VOICE_DESC', Arduino.ORDER_ATOMIC) || '""';

  ensureQwenOmniI2SObject(generator, varName);
  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');
  ensureQwenOmniPlaybackHelpers(generator);

  generator.addFunction('qwen_tts_voice_design_request', `
void qwen_tts_voice_design_request(I2SClass &i2s, String text, String voiceDesc) {
  Serial.println("=== 通义TTS音色设计合成开始(流式) ===");
  Serial.println("文本: " + text);
  Serial.println("音色描述: " + voiceDesc);

  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    return;
  }

  HTTPClient http;
  String url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);
  http.addHeader("X-DashScope-SSE", "enable");

  String safeText = qwen_escape_json(text);
  String safeVoiceDesc = qwen_escape_json(voiceDesc);
  String requestBody = "{\\"model\\":\\"qwen3-tts-vd\\",";
  requestBody += "\\"input\\":{\\"text\\":\\"" + safeText + "\\",";
  requestBody += "\\"voice\\":\\"" + safeVoiceDesc + "\\"},";
  requestBody += "\\"stream\\":true}";

  Serial.println("发送TTS音色设计请求...");
  int httpResponseCode = http.POST(requestBody);
  Serial.println("HTTP响应码: " + String(httpResponseCode));

  if (httpResponseCode != 200) {
    String errorResponse = http.getString();
    Serial.println("HTTP閿欒: " + errorResponse);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
    http.end();
    return;
  }

  WiFiClient *stream = http.getStreamPtr();
  int totalBytes = 0;
  String lineBuffer = "";
  qwen_last_success = true;
  qwen_last_error = "";

  while (http.connected() || stream->available()) {
    if (!stream->available()) {
      delay(1);
      continue;
    }
    char c = stream->read();
    if (c == '\\n') {
      lineBuffer.trim();
      if (lineBuffer.startsWith("data:")) {
        String data = lineBuffer.substring(5);
        data.trim();
        if (data == "[DONE]") break;
        
        int audioPos = data.indexOf("\\"audio\\":{\\"data\\":\\"");
        if (audioPos >= 0) {
          audioPos += 17;
          int audioEnd = data.indexOf("\\"", audioPos);
          if (audioEnd > audioPos) {
            String b64Chunk = qwen_sanitize_base64(data.substring(audioPos, audioEnd));
            int bufLen = (b64Chunk.length() * 3) / 4 + 16;
            uint8_t *pcmBuf = (uint8_t *)malloc(bufLen);
            if (pcmBuf) {
              size_t outLen = 0;
              int ret = mbedtls_base64_decode(pcmBuf, bufLen, &outLen, (const unsigned char*)b64Chunk.c_str(), b64Chunk.length());
              if (ret == 0 && outLen > 0) {
                i2s.write(pcmBuf, outLen);
                totalBytes += outLen;
                /* progress omitted to avoid serial blocking */
              }
              free(pcmBuf);
            }
          }
        }
      }
      lineBuffer = "";
    } else if (c != '\\r') {
      lineBuffer += c;
    }
  }

  http.end();
  Serial.println("");
  Serial.println("音色设计合成播放完成，总字节数: " + String(totalBytes));
  Serial.println("=== 通义TTS音色设计合成结束 ===");
}`);

  generator.addFunction('qwen_tts_voice_design_request_v2', `
void qwen_tts_voice_design_request_v2(I2SClass &i2s, String text, String voiceDesc) {
  Serial.println("[TTS-VD] begin");
  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    return;
  }

  HTTPClient http;
  String url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "text/event-stream");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);
  http.addHeader("X-DashScope-SSE", "enable");

  String safeText = qwen_escape_json(text);
  String safeVoiceDesc = qwen_escape_json(voiceDesc);
  String requestBody = "{\\"model\\":\\"qwen3-tts-vd\\",";
  requestBody += "\\"input\\":{\\"text\\":\\"" + safeText + "\\",";
  requestBody += "\\"voice\\":\\"" + safeVoiceDesc + "\\"},";
  requestBody += "\\"stream\\":true}";

  int httpResponseCode = http.POST(requestBody);
  Serial.println("[TTS-VD] HTTP: " + String(httpResponseCode));
  if (httpResponseCode != 200) {
    String err = http.getString();
    if (err.length() > 240) err = err.substring(0, 240);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
    Serial.println(err);
    http.end();
    return;
  }

  String fullText = "";
  size_t totalPlayed = qwen_stream_http_audio_to_i2s(http, i2s, &fullText, "TTS-VD");
  http.end();

  qwen_last_success = totalPlayed > 0;
  qwen_last_error = totalPlayed > 0 ? "" : (qwen_last_error.length() > 0 ? qwen_last_error : "No audio data");
  Serial.println(totalPlayed > 0 ? "[TTS-VD] ok" : "[TTS-VD] fail: no audio");
}`);

  var code = 'qwen_tts_voice_design_request_v2(' + varName + ', ' + text + ', ' + voiceDesc + ');\n';
  return code;
};

Arduino.forBlock['qwen_omni_omni_voice_chat'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s';
  const duration = generator.valueToCode(block, 'DURATION', Arduino.ORDER_ATOMIC) || '3';
  const model = block.getFieldValue('MODEL');
  const voice = block.getFieldValue('VOICE');
  const beep = block.getFieldValue('BEEP') !== 'FALSE';
  const prompt = qwenOmniVoiceChatPromptCode(generator.valueToCode(block, 'PROMPT', Arduino.ORDER_ATOMIC) || '""');

  if (block.getField('MIC_VAR') || block.getField('SPK_VAR')) {
    return Arduino.forBlock['qwen_omni_omni_voice_chat_dual_i2s'](block, generator);
  }

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');
  ensureQwenOmniUploadHelpers(generator);

  generator.addFunction('qwen_omni_parse_wav_and_config_tx', `
bool qwen_omni_parse_wav_and_config_tx(I2SClass &i2s, const uint8_t* data, size_t totalLen, uint8_t** pcmOut, size_t* pcmLenOut) {
  uint32_t sampleRate = 24000;
  i2s_data_bit_width_t bitWidth = I2S_DATA_BIT_WIDTH_16BIT;
  i2s_slot_mode_t slotMode = I2S_SLOT_MODE_MONO;
  int headerLen = 0;

  if (totalLen > 44 && data[0] == 'R' && data[1] == 'I' && data[2] == 'F' && data[3] == 'F') {
    uint16_t numChannels = data[22] | (data[23] << 8);
    sampleRate = data[24] | (data[25] << 8) | (data[26] << 16) | (data[27] << 24);
    uint16_t bitsPerSample = data[34] | (data[35] << 8);
    slotMode = (numChannels == 2) ? I2S_SLOT_MODE_STEREO : I2S_SLOT_MODE_MONO;
    bitWidth = (bitsPerSample == 32) ? I2S_DATA_BIT_WIDTH_32BIT : I2S_DATA_BIT_WIDTH_16BIT;
    headerLen = 44;
    int fmtSize = data[16] | (data[17] << 8) | (data[18] << 16) | (data[19] << 24);
    if (fmtSize > 16) headerLen = 44 + (fmtSize - 16);
    Serial.println("WAV: " + String(sampleRate) + "Hz " + String(bitsPerSample) + "bit " + String(numChannels) + "ch");
  } else {
    Serial.println("PCM: " + String(sampleRate) + "Hz 16bit mono");
  }

  i2s.end();
  i2s.begin(I2S_MODE_STD, sampleRate, bitWidth, slotMode);

  *pcmOut = (uint8_t*)data + headerLen;
  *pcmLenOut = totalLen - headerLen;
  return headerLen > 0;
}`);

  generator.addFunction('qwen_voice_chat_build_wav_header', String.raw`
void qwen_voice_chat_build_wav_header(uint8_t* header, uint32_t dataSize, uint32_t sampleRate) {
  memset(header, 0, 44);
  memcpy(header, "RIFF", 4);
  uint32_t fileSize = dataSize + 36;
  header[4] = fileSize & 0xFF; header[5] = (fileSize >> 8) & 0xFF;
  header[6] = (fileSize >> 16) & 0xFF; header[7] = (fileSize >> 24) & 0xFF;
  memcpy(header + 8, "WAVE", 4);
  memcpy(header + 12, "fmt ", 4);
  header[16] = 16; header[17] = 0; header[18] = 0; header[19] = 0;
  header[20] = 1; header[21] = 0;
  header[22] = 1; header[23] = 0;
  header[24] = sampleRate & 0xFF; header[25] = (sampleRate >> 8) & 0xFF;
  header[26] = (sampleRate >> 16) & 0xFF; header[27] = (sampleRate >> 24) & 0xFF;
  uint32_t byteRate = sampleRate * 2;
  header[28] = byteRate & 0xFF; header[29] = (byteRate >> 8) & 0xFF;
  header[30] = (byteRate >> 16) & 0xFF; header[31] = (byteRate >> 24) & 0xFF;
  header[32] = 2; header[33] = 0;
  header[34] = 16; header[35] = 0;
  memcpy(header + 36, "data", 4);
  header[40] = dataSize & 0xFF; header[41] = (dataSize >> 8) & 0xFF;
  header[42] = (dataSize >> 16) & 0xFF; header[43] = (dataSize >> 24) & 0xFF;
}`);

  generator.addFunction('qwen_omni_voice_chat_request', `
void qwen_omni_voice_chat_request(I2SClass &i2s, String model, String voice, String prompt, float duration) {
  Serial.println("=== 通义全模态语音对话开始 ===");
  Serial.println("模型: " + model);
  Serial.println("音色: " + voice);
  Serial.println("提问: " + prompt);
  Serial.println("Record duration: " + String(duration) + "s");

  qwen_last_success = false;
  qwen_last_error = "";
  qwen_omni_audio_data = "";

  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_error = "WiFi not connected";
    Serial.println("Error: WiFi not connected");
    return;
  }

  uint32_t sampleRate = 24000;
  size_t totalSamples = (size_t)(sampleRate * duration);
  size_t pcmBytes = totalSamples * sizeof(int16_t);
  size_t wavBytes = 44 + pcmBytes;

  Serial.println("配置I2S RX通道...");
  i2s.configureRX(sampleRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO);

  Serial.println("开始录音... 采样数: " + String(totalSamples));
  uint8_t* pcmBuf = (uint8_t*)malloc(pcmBytes);
  if (!pcmBuf) {
    qwen_last_error = "PCM alloc failed";
    Serial.println("閿欒: PCM鍐呭瓨鍒嗛厤澶辫触");
    return;
  }

  size_t bytesRead = 0;
  unsigned long recordStart = millis();
  while (bytesRead < pcmBytes) {
    size_t toRead = min((size_t)4096, pcmBytes - bytesRead);
    size_t n = i2s.readBytes((char*)(pcmBuf + bytesRead), toRead);
    if (n > 0) {
      bytesRead += n;
    }
    if (millis() - recordStart > (unsigned long)(duration * 1000 + 2000)) {
      Serial.println("录音超时");
      break;
    }
  }
  Serial.println("录音完成: " + String(bytesRead) + " bytes");
  pcmBytes = bytesRead;
  wavBytes = 44 + pcmBytes;

  size_t base64Len = ((wavBytes + 2) / 3) * 4 + 4;
  uint8_t* wavBuf = (uint8_t*)malloc(wavBytes);
  if (!wavBuf) {
    free(pcmBuf);
    qwen_last_error = "WAV alloc failed";
    return;
  }
  qwen_voice_chat_build_wav_header(wavBuf, (uint32_t)pcmBytes, sampleRate);
  memcpy(wavBuf + 44, pcmBuf, pcmBytes);
  free(pcmBuf);

  char* b64Buf = (char*)malloc(base64Len);
  if (!b64Buf) {
    free(wavBuf);
    qwen_last_error = "Base64 alloc failed";
    return;
  }
  size_t outLen = 0;
  int ret = mbedtls_base64_encode((unsigned char*)b64Buf, base64Len, &outLen, wavBuf, wavBytes);
  free(wavBuf);
  if (ret != 0) {
    free(b64Buf);
    qwen_last_error = "Base64 encode failed";
    return;
  }
  b64Buf[outLen] = '\\0';
  String audioBase64 = String(b64Buf);
  free(b64Buf);
  Serial.println("Base64编码完成: " + String(audioBase64.length()) + " 字符");

  String safePrompt = qwen_escape_json(prompt);
  String contentJson;
  if (prompt.length() > 0) {
    contentJson = "[{\\"type\\":\\"input_audio\\",\\"input_audio\\":{\\"data\\":\\"data:;base64," + audioBase64 + "\\",\\"format\\":\\"wav\\"}},{\\"type\\":\\"text\\",\\"text\\":\\"" + safePrompt + "\\"}]";
  } else {
    contentJson = "[{\\"type\\":\\"input_audio\\",\\"input_audio\\":{\\"data\\":\\"data:;base64," + audioBase64 + "\\",\\"format\\":\\"wav\\"}}]";
  }

  HTTPClient http;
  String url = qwen_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"messages\\":[{\\"role\\":\\"user\\",\\"content\\":" + contentJson + "}],";
  requestBody += "\\"modalities\\":[\\"text\\",\\"audio\\"],";
  requestBody += "\\"audio\\":{\\"voice\\":\\"" + voice + "\\",\\"format\\":\\"wav\\"},";
  requestBody += "\\"stream\\":true}";

  Serial.println("发送全模态语音请求...");
  int httpResponseCode = http.POST(requestBody);
  Serial.println("HTTP响应码: " + String(httpResponseCode));

  if (httpResponseCode != 200) {
    String errBody = http.getString();
    if (errBody.length() > 200) errBody = errBody.substring(0, 200);
    Serial.println("HTTP閿欒: " + errBody);
    qwen_last_error = "HTTP " + String(httpResponseCode) + ": " + errBody;
    http.end();
    return;
  }

  WiFiClient *stream = http.getStreamPtr();
  String fullText = "";
  String fullAudio = "";
  String lineBuffer = "";

  while (http.connected() || stream->available()) {
    if (!stream->available()) {
      delay(1);
      continue;
    }
    char c = stream->read();
    if (c == '\\n') {
      lineBuffer.trim();
      if (lineBuffer.startsWith("data:")) {
        String data = lineBuffer.substring(5);
        data.trim();
        if (data == "[DONE]") break;

        int contentStart = data.indexOf("\\"content\\":\\"");
        if (contentStart >= 0) {
          contentStart += 11;
          int contentEnd = data.indexOf("\\"", contentStart);
          if (contentEnd > contentStart) {
            String content = data.substring(contentStart, contentEnd);
            fullText += content;
            Serial.print(content);
            if (qwen_stream_callback != NULL) {
              qwen_stream_chunk = content;
              qwen_stream_callback();
            }
          }
        }

        int audioPos = data.indexOf("\\"audio\\":{\\"data\\":\\"");
        if (audioPos >= 0) {
          audioPos += 17;
          int audioEnd = data.indexOf("\\"", audioPos);
          if (audioEnd > audioPos) {
            fullAudio += qwen_sanitize_base64(data.substring(audioPos, audioEnd));
            /* progress omitted to avoid serial blocking */
          }
        }
      }
      lineBuffer = "";
    } else if (c != '\\r') {
      lineBuffer += c;
    }
  }

  http.end();
  Serial.println("");

  if (fullAudio.length() > 0) {
    Serial.println("收集到音频数据: " + String(fullAudio.length()) + " 字符");
    size_t decodedMax = (fullAudio.length() * 3) / 4 + 4;
    uint8_t* playBuf = (uint8_t*)malloc(decodedMax);
    if (playBuf) {
      size_t playLen = 0;
      int dret = mbedtls_base64_decode(playBuf, decodedMax, &playLen, (const unsigned char*)fullAudio.c_str(), fullAudio.length());
      if (dret == 0 && playLen > 0) {
        uint8_t* pcmPlay = playBuf;
        size_t pcmLen = playLen;
        qwen_omni_parse_wav_and_config_tx(i2s, playBuf, playLen, &pcmPlay, &pcmLen);
        Serial.println("播放语音回复，大小: " + String(pcmLen) + " bytes");
        size_t written = 0;
        while (written < pcmLen) {
          size_t toWrite = min((size_t)1024, pcmLen - written);
          i2s.write(pcmPlay + written, toWrite);
          written += toWrite;
        }
        Serial.println("播放完成!");
      }
      free(playBuf);
    }
    qwen_omni_audio_data = fullAudio;
    qwen_last_success = true;
    qwen_last_error = "";
  } else {
    qwen_last_success = false;
    qwen_last_error = "No audio response";
    Serial.println("No audio data received");
  }

  Serial.println("回复文本: " + fullText);
  Serial.println("=== 通义全模态语音对话结束 ===");
}`);

  generator.addFunction('qwen_omni_voice_chat_request_v2', `
void qwen_omni_voice_chat_request_v2(I2SClass &i2s, String model, String voice, String prompt, float duration) {
  Serial.println("[VOICE-CHAT] begin");
  qwen_last_success = false;
  qwen_last_error = "";
  qwen_omni_audio_data = "";

  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_error = "WiFi not connected";
    Serial.println("[VOICE-CHAT] fail: WiFi not connected");
    return;
  }

  uint32_t sampleRate = 16000;
  size_t totalSamples = (size_t)(sampleRate * duration);
  size_t pcmBytes = totalSamples * sizeof(int16_t);
  size_t wavBytes = 44 + pcmBytes;
  uint8_t* wavBuf = (uint8_t*)qwen_audio_alloc_buffer(wavBytes, "voice-chat-wav");
  if (!wavBuf) {
    qwen_last_error = "WAV alloc failed";
    return;
  }

  i2s.configureRX(sampleRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO);
  Serial.println("[VOICE-CHAT] record " + String(duration) + "s");

  size_t bytesRead = 0;
  unsigned long recordStart = millis();
  while (bytesRead < pcmBytes) {
    size_t toRead = min((size_t)4096, pcmBytes - bytesRead);
    size_t n = i2s.readBytes((char*)(wavBuf + 44 + bytesRead), toRead);
    if (n > 0) bytesRead += n;
    if (millis() - recordStart > (unsigned long)(duration * 1000 + 1000)) {
      Serial.println("[VOICE-CHAT] record timeout");
      break;
    }
  }
  if (bytesRead % sizeof(int16_t) != 0) bytesRead -= bytesRead % sizeof(int16_t);
  qwen_voice_chat_build_wav_header(wavBuf, (uint32_t)bytesRead, sampleRate);
  wavBytes = 44 + bytesRead;
  Serial.println("[VOICE-CHAT] wav bytes: " + String(wavBytes));

  String safePrompt = qwen_escape_json(prompt);
  String safeSystem = qwen_escape_json((qwen_system_prompt.length() > 0 ? qwen_system_prompt + "\\n" : "") + "\u8bf7\u7528\u9002\u5408\u8bed\u97f3\u64ad\u653e\u7684\u7b80\u77ed\u4e2d\u6587\u56de\u7b54\uff0c\u4f18\u5148\u63a7\u5236\u572860\u5b57\u4ee5\u5185\uff1b\u5982\u679c\u4fe1\u606f\u5f88\u591a\uff0c\u5148\u7ed9\u7ed3\u8bba\u548c\u6700\u591a3\u4e2a\u8981\u70b9\uff0c\u4e0d\u8981\u5c55\u5f00\u957f\u7bc7\u5217\u8868\u3002");
  String requestPrefix = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[";
  requestPrefix += "{\\"role\\":\\"system\\",\\"content\\":\\"" + safeSystem + "\\"},";
  requestPrefix += "{\\"role\\":\\"user\\",\\"content\\":[{\\"type\\":\\"input_audio\\",\\"input_audio\\":{\\"data\\":\\"data:;base64,";

  String requestSuffix = "\\",\\"format\\":\\"wav\\"}}";
  if (prompt.length() > 0) {
    requestSuffix += ",{\\"type\\":\\"text\\",\\"text\\":\\"" + safePrompt + "\\"}";
  }
  requestSuffix += "]}],";
  requestSuffix += "\\"modalities\\":[\\"text\\",\\"audio\\"],";
  requestSuffix += "\\"audio\\":{\\"voice\\":\\"" + voice + "\\",\\"format\\":\\"wav\\"},";
  requestSuffix += "\\"stream\\":true,\\"stream_options\\":{\\"include_usage\\":true}}";

  QwenBase64JsonStream requestStream(requestPrefix, wavBuf, wavBytes, requestSuffix);

  HTTPClient http;
  String url = qwen_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "text/event-stream");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  Serial.println("[VOICE-CHAT] request bytes: " + String(requestStream.contentLength()));
  int httpResponseCode = http.sendRequest("POST", &requestStream, requestStream.contentLength());
  free(wavBuf);
  Serial.println("[VOICE-CHAT] HTTP: " + String(httpResponseCode));

  if (httpResponseCode != 200) {
    String errBody = http.getString();
    if (errBody.length() > 240) errBody = errBody.substring(0, 240);
    qwen_last_error = "HTTP " + String(httpResponseCode) + ": " + errBody;
    Serial.println(errBody);
    http.end();
    return;
  }

  String fullText = "";
  size_t totalPlayed = qwen_stream_http_audio_to_i2s(http, i2s, &fullText, "VOICE-CHAT");
  http.end();

  if (totalPlayed > 0) {
    qwen_last_success = true;
    qwen_last_error = "";
    Serial.println("\\n[VOICE-CHAT] ok, bytes: " + String(totalPlayed));
  } else {
    qwen_last_success = false;
    qwen_last_error = qwen_last_error.length() > 0 ? qwen_last_error : "No audio response";
    Serial.println("\\n[VOICE-CHAT] fail: no audio");
  }
  Serial.println("[VOICE-CHAT] text: " + fullText);
}`);

  var code = 'qwen_omni_voice_chat_request_v2(' + varName + ', "' + model + '", "' + voice + '", ' + prompt + ', ' + duration + ');\n';
  return code;
};

Arduino.forBlock['qwen_omni_omni_record_text'] = function(block, generator) {
  var micField = block.getField('MIC_VAR');
  var micName = micField ? micField.getText() : 'i2s_mic';
  const duration = generator.valueToCode(block, 'DURATION', Arduino.ORDER_ATOMIC) || '3';
  const model = block.getFieldValue('MODEL');
  const prompt = generator.valueToCode(block, 'PROMPT', Arduino.ORDER_ATOMIC) || '""';

  ensureQwenOmniI2SObject(generator, micName);
  ensureQwenOmniI2SHelpers(generator);
  ensureQwenOmniUploadHelpers(generator);

  generator.addFunction('qwen_voice_chat_build_wav_header', String.raw`
void qwen_voice_chat_build_wav_header(uint8_t* header, uint32_t dataSize, uint32_t sampleRate) {
  memset(header, 0, 44);
  memcpy(header, "RIFF", 4);
  uint32_t fileSize = dataSize + 36;
  header[4] = fileSize & 0xFF; header[5] = (fileSize >> 8) & 0xFF;
  header[6] = (fileSize >> 16) & 0xFF; header[7] = (fileSize >> 24) & 0xFF;
  memcpy(header + 8, "WAVE", 4);
  memcpy(header + 12, "fmt ", 4);
  header[16] = 16; header[17] = 0; header[18] = 0; header[19] = 0;
  header[20] = 1; header[21] = 0;
  header[22] = 1; header[23] = 0;
  header[24] = sampleRate & 0xFF; header[25] = (sampleRate >> 8) & 0xFF;
  header[26] = (sampleRate >> 16) & 0xFF; header[27] = (sampleRate >> 24) & 0xFF;
  uint32_t byteRate = sampleRate * 2;
  header[28] = byteRate & 0xFF; header[29] = (byteRate >> 8) & 0xFF;
  header[30] = (byteRate >> 16) & 0xFF; header[31] = (byteRate >> 24) & 0xFF;
  header[32] = 2; header[33] = 0;
  header[34] = 16; header[35] = 0;
  memcpy(header + 36, "data", 4);
  header[40] = dataSize & 0xFF; header[41] = (dataSize >> 8) & 0xFF;
  header[42] = (dataSize >> 16) & 0xFF; header[43] = (dataSize >> 24) & 0xFF;
}`);

  generator.addFunction('qwen_omni_record_text_request', String.raw`
String qwen_omni_record_text_request(I2SClass &i2sMic, String model, String prompt, float duration) {
  Serial.println("[OMNI-REC-TEXT] begin");
  qwen_last_success = false;
  qwen_last_error = "";

  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_error = "WiFi not connected";
    Serial.println("[OMNI-REC-TEXT] fail: WiFi not connected");
    return "";
  }

  uint32_t sampleRate = 16000;
  size_t totalSamples = (size_t)(sampleRate * duration);
  size_t pcmBytes = totalSamples * sizeof(int16_t);
  size_t wavBytes = 44 + pcmBytes;
  uint8_t* wavBuf = (uint8_t*)qwen_audio_alloc_buffer(wavBytes, "record-text-wav");
  if (!wavBuf) {
    qwen_last_error = "WAV alloc failed";
    return "";
  }

  if (!qwen_i2s_restart_microphone(i2sMic, sampleRate)) {
    qwen_last_error = "Microphone begin failed";
    free(wavBuf);
    return "";
  }

  Serial.println("[OMNI-REC-TEXT] record " + String(duration) + "s");
  size_t bytesRead = qwen_i2s_record_pcm(i2sMic, wavBuf + 44, pcmBytes, duration, "OMNI-REC-TEXT");
  qwen_voice_chat_build_wav_header(wavBuf, (uint32_t)bytesRead, sampleRate);
  wavBytes = 44 + bytesRead;
  i2sMic.end();
  Serial.println("[OMNI-REC-TEXT] wav bytes: " + String(wavBytes));

  String safeSystem = qwen_escape_json(qwen_system_prompt);
  String safePrompt = qwen_escape_json(prompt.length() > 0 ? prompt : String("请只把音频内容转写成文字，不要回答、解释或补充。"));
  String requestPrefix = "{\"model\":\"" + model + "\",\"messages\":[";
  if (qwen_system_prompt.length() > 0) {
    requestPrefix += "{\"role\":\"system\",\"content\":\"" + safeSystem + "\"},";
  }
  requestPrefix += "{\"role\":\"user\",\"content\":[{\"type\":\"input_audio\",\"input_audio\":{\"data\":\"data:;base64,";

  String requestSuffix = "\",\"format\":\"wav\"}},{\"type\":\"text\",\"text\":\"" + safePrompt + "\"}]}],";
  requestSuffix += "\"modalities\":[\"text\"],";
  requestSuffix += "\"stream\":true,\"stream_options\":{\"include_usage\":true}}";

  QwenBase64JsonStream requestStream(requestPrefix, wavBuf, wavBytes, requestSuffix);

  HTTPClient http;
  String url = qwen_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "text/event-stream");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  Serial.println("[OMNI-REC-TEXT] request bytes: " + String(requestStream.contentLength()));
  int httpResponseCode = http.sendRequest("POST", &requestStream, requestStream.contentLength());
  free(wavBuf);
  Serial.println("[OMNI-REC-TEXT] HTTP: " + String(httpResponseCode));

  if (httpResponseCode != 200) {
    String errBody = http.getString();
    if (errBody.length() > 240) errBody = errBody.substring(0, 240);
    qwen_last_error = "HTTP " + String(httpResponseCode) + ": " + errBody;
    Serial.println(errBody);
    http.end();
    return "";
  }

  WiFiClient* stream = http.getStreamPtr();
  String fullText = "";
  String lineBuffer = "";
  unsigned long lastDataMs = millis();
  while (http.connected() || stream->available()) {
    if (!stream->available()) {
      if (millis() - lastDataMs > 120000) {
        qwen_last_error = "Stream timeout";
        Serial.println("[OMNI-REC-TEXT] stream timeout");
        break;
      }
      delay(1);
      continue;
    }
    lastDataMs = millis();
    char c = stream->read();
    if (c == '\n') {
      lineBuffer.trim();
      if (lineBuffer.startsWith("data:")) {
        String data = lineBuffer.substring(5);
        data.trim();
        if (data == "[DONE]") break;
        int contentStart = data.indexOf("\"content\":\"");
        if (contentStart >= 0) {
          contentStart += 11;
          int contentEnd = data.indexOf("\"", contentStart);
          if (contentEnd > contentStart) {
            String content = qwen_unescape_json_string(data.substring(contentStart, contentEnd));
            fullText += content;
            Serial.print(content);
            if (qwen_stream_callback != NULL) {
              qwen_stream_chunk = content;
              qwen_stream_callback();
            }
          }
        }
      }
      lineBuffer = "";
    } else if (c != '\r') {
      lineBuffer += c;
    }
  }
  http.end();
  Serial.println("");

  qwen_last_success = fullText.length() > 0;
  qwen_last_error = fullText.length() > 0 ? "" : (qwen_last_error.length() > 0 ? qwen_last_error : "No text response");
  Serial.println("[OMNI-REC-TEXT] text: " + fullText);
  return fullText;
}`);

  const code = `qwen_omni_record_text_request(${micName}, "${model}", ${prompt}, ${duration})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwen_omni_omni_voice_chat_dual_i2s'] = function(block, generator) {
  var micField = block.getField('MIC_VAR');
  var spkField = block.getField('SPK_VAR');
  var micName = micField ? micField.getText() : 'i2s_mic';
  var spkName = spkField ? spkField.getText() : 'i2s_spk';
  const duration = generator.valueToCode(block, 'DURATION', Arduino.ORDER_ATOMIC) || '3';
  const model = block.getFieldValue('MODEL');
  const voice = block.getFieldValue('VOICE');
  const beep = block.getFieldValue('BEEP') !== 'FALSE';
  const prompt = qwenOmniVoiceChatPromptCode(generator.valueToCode(block, 'PROMPT', Arduino.ORDER_ATOMIC) || '""');

  ensureQwenOmniI2SObject(generator, micName);
  ensureQwenOmniI2SObject(generator, spkName);
  ensureQwenOmniI2SHelpers(generator);
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');
  generator.addLibrary('qwen_math', '#include <math.h>');
  ensureQwenOmniUploadHelpers(generator);

  generator.addFunction('qwen_voice_chat_build_wav_header', String.raw`
void qwen_voice_chat_build_wav_header(uint8_t* header, uint32_t dataSize, uint32_t sampleRate) {
  memset(header, 0, 44);
  memcpy(header, "RIFF", 4);
  uint32_t fileSize = dataSize + 36;
  header[4] = fileSize & 0xFF; header[5] = (fileSize >> 8) & 0xFF;
  header[6] = (fileSize >> 16) & 0xFF; header[7] = (fileSize >> 24) & 0xFF;
  memcpy(header + 8, "WAVE", 4);
  memcpy(header + 12, "fmt ", 4);
  header[16] = 16; header[17] = 0; header[18] = 0; header[19] = 0;
  header[20] = 1; header[21] = 0;
  header[22] = 1; header[23] = 0;
  header[24] = sampleRate & 0xFF; header[25] = (sampleRate >> 8) & 0xFF;
  header[26] = (sampleRate >> 16) & 0xFF; header[27] = (sampleRate >> 24) & 0xFF;
  uint32_t byteRate = sampleRate * 2;
  header[28] = byteRate & 0xFF; header[29] = (byteRate >> 8) & 0xFF;
  header[30] = (byteRate >> 16) & 0xFF; header[31] = (byteRate >> 24) & 0xFF;
  header[32] = 2; header[33] = 0;
  header[34] = 16; header[35] = 0;
  memcpy(header + 36, "data", 4);
  header[40] = dataSize & 0xFF; header[41] = (dataSize >> 8) & 0xFF;
  header[42] = (dataSize >> 16) & 0xFF; header[43] = (dataSize >> 24) & 0xFF;
}`);

  generator.addFunction('qwen_omni_voice_chat_request_dual_i2s', `
void qwen_omni_voice_chat_request_dual_i2s(I2SClass &i2sMic, I2SClass &i2sSpk, String model, String voice, String prompt, float duration, bool beep) {
  Serial.println("[VOICE-CHAT-2I2S] begin");
  qwen_last_success = false;
  qwen_last_error = "";
  qwen_omni_audio_data = "";

  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_error = "WiFi not connected";
    Serial.println("[VOICE-CHAT-2I2S] fail: WiFi not connected");
    return;
  }

  uint32_t sampleRate = 16000;
  size_t totalSamples = (size_t)(sampleRate * duration);
  size_t pcmBytes = totalSamples * sizeof(int16_t);
  size_t wavBytes = 44 + pcmBytes;
  uint8_t* wavBuf = (uint8_t*)qwen_audio_alloc_buffer(wavBytes, "voice-chat-wav");
  if (!wavBuf) {
    qwen_last_error = "WAV alloc failed";
    return;
  }

  Serial.println("[VOICE-CHAT-2I2S] record " + String(duration) + "s");
  if (beep) qwen_play_prompt_tone(i2sSpk, 1000, 50);

  if (!qwen_i2s_restart_microphone(i2sMic, sampleRate)) {
    qwen_last_error = "Microphone begin failed";
    free(wavBuf);
    return;
  }
  delay(30);

  size_t bytesRead = qwen_i2s_record_pcm(i2sMic, wavBuf + 44, pcmBytes, duration, "VOICE-CHAT-2I2S");
  if (beep) qwen_play_prompt_tone(i2sSpk, 800, 50);

  if (bytesRead == 0) {
    qwen_last_error = "No microphone audio captured";
    Serial.println("[VOICE-CHAT-2I2S] fail: no microphone audio captured");
    free(wavBuf);
    return;
  }

  uint32_t peakAbs = 0;
  uint64_t sumAbs = 0;
  size_t sampleCount = bytesRead / sizeof(int16_t);
  int16_t* samples = (int16_t*)(wavBuf + 44);
  for (size_t i = 0; i < sampleCount; i++) {
    int32_t v = samples[i];
    uint32_t absV = (v < 0) ? (uint32_t)(-v) : (uint32_t)v;
    if (absV > peakAbs) peakAbs = absV;
    sumAbs += absV;
  }
  uint32_t avgAbs = sampleCount > 0 ? (uint32_t)(sumAbs / sampleCount) : 0;
  qwen_voice_chat_build_wav_header(wavBuf, (uint32_t)bytesRead, sampleRate);
  wavBytes = 44 + bytesRead;
  Serial.println("[VOICE-CHAT-2I2S] record bytes: " + String(bytesRead) + " PCM, " + String(wavBytes) + " WAV");
  Serial.println("[VOICE-CHAT-2I2S] mic level peak: " + String(peakAbs) + ", avg: " + String(avgAbs));
  i2sMic.end();

  String safePrompt = qwen_escape_json(prompt);
  String safeSystem = qwen_escape_json((qwen_system_prompt.length() > 0 ? qwen_system_prompt + "\\n" : "") + "\u8bf7\u7528\u9002\u5408\u8bed\u97f3\u64ad\u653e\u7684\u7b80\u77ed\u4e2d\u6587\u56de\u7b54\uff0c\u4f18\u5148\u63a7\u5236\u572860\u5b57\u4ee5\u5185\uff1b\u5982\u679c\u4fe1\u606f\u5f88\u591a\uff0c\u5148\u7ed9\u7ed3\u8bba\u548c\u6700\u591a3\u4e2a\u8981\u70b9\uff0c\u4e0d\u8981\u5c55\u5f00\u957f\u7bc7\u5217\u8868\u3002");
  String requestPrefix = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[";
  requestPrefix += "{\\"role\\":\\"system\\",\\"content\\":\\"" + safeSystem + "\\"},";
  requestPrefix += "{\\"role\\":\\"user\\",\\"content\\":[{\\"type\\":\\"input_audio\\",\\"input_audio\\":{\\"data\\":\\"data:;base64,";

  String requestSuffix = "\\",\\"format\\":\\"wav\\"}}";
  if (prompt.length() > 0) {
    requestSuffix += ",{\\"type\\":\\"text\\",\\"text\\":\\"" + safePrompt + "\\"}";
  }
  requestSuffix += "]}],";
  requestSuffix += "\\"modalities\\":[\\"text\\",\\"audio\\"],";
  requestSuffix += "\\"audio\\":{\\"voice\\":\\"" + voice + "\\",\\"format\\":\\"wav\\"},";
  requestSuffix += "\\"stream\\":true,\\"stream_options\\":{\\"include_usage\\":true}}";

  QwenBase64JsonStream requestStream(requestPrefix, wavBuf, wavBytes, requestSuffix);

  HTTPClient http;
  String url = qwen_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "text/event-stream");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  Serial.println("[VOICE-CHAT-2I2S] request bytes: " + String(requestStream.contentLength()));
  int httpResponseCode = http.sendRequest("POST", &requestStream, requestStream.contentLength());
  free(wavBuf);
  Serial.println("[VOICE-CHAT-2I2S] HTTP: " + String(httpResponseCode));

  if (httpResponseCode != 200) {
    String errBody = http.getString();
    if (errBody.length() > 240) errBody = errBody.substring(0, 240);
    qwen_last_error = "HTTP " + String(httpResponseCode) + ": " + errBody;
    Serial.println(errBody);
    http.end();
    return;
  }

  String fullText = "";
  size_t totalPlayed = qwen_stream_http_audio_to_i2s(http, i2sSpk, &fullText, "VOICE-CHAT-2I2S");
  http.end();

  if (totalPlayed > 0) {
    qwen_last_success = true;
    qwen_last_error = "";
    Serial.println("\\n[VOICE-CHAT-2I2S] ok, bytes: " + String(totalPlayed));
  } else {
    qwen_last_success = false;
    qwen_last_error = qwen_last_error.length() > 0 ? qwen_last_error : "No audio response";
    Serial.println("\\n[VOICE-CHAT-2I2S] fail: no audio");
  }
  Serial.println("[VOICE-CHAT-2I2S] text: " + fullText);
}`);

  var code = 'qwen_omni_voice_chat_request_dual_i2s(' + micName + ', ' + spkName + ', "' + model + '", "' + voice + '", ' + prompt + ', ' + duration + ', ' + (beep ? 'true' : 'false') + ');\n';
  return code;
};




