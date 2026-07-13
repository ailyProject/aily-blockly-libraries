// 小米MiMo AI API库代码生成器

function ensureMimoAudioBufferHelpers(generator) {
  generator.addLibrary('mimo_heap_caps', '#include <esp_heap_caps.h>');
  generator.addFunction('mimo_audio_alloc_buffer', String.raw`
void* mimo_audio_alloc_buffer(size_t len, const char* tag) {
  void* ptr = NULL;
  if (psramFound()) {
    ptr = heap_caps_malloc(len, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
  }
  if (!ptr) {
    ptr = heap_caps_malloc(len, MALLOC_CAP_8BIT);
  }
  if (!ptr) {
    Serial.println("[MIMO-AUDIO] alloc failed: " + String(tag) + " " + String(len));
  }
  return ptr;
}

size_t mimo_base64_encoded_len(size_t len) {
  return ((len + 2) / 3) * 4;
}`);
}

function ensureMimoPlaybackHelpers(generator) {
  ensureMimoBaseHelpers(generator);
  ensureMimoI2SHelpers(generator);
  ensureMimoI2SCompat(generator);
  ensureMimoAudioBufferHelpers(generator);
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');
  generator.addLibrary('mimo_freertos', '#include <freertos/FreeRTOS.h>');
  generator.addLibrary('mimo_freertos_task', '#include <freertos/task.h>');
  generator.addLibrary('mimo_freertos_stream_buffer', '#include <freertos/stream_buffer.h>');

  generator.addVariable('mimo_playback_storage', 'uint8_t* mimo_playback_storage = NULL;');
  generator.addVariable('mimo_playback_stream_struct', 'StaticStreamBuffer_t mimo_playback_stream_struct;');
  generator.addVariable('mimo_playback_stream', 'StreamBufferHandle_t mimo_playback_stream = NULL;');
  generator.addVariable('mimo_playback_task_handle', 'TaskHandle_t mimo_playback_task_handle = NULL;');
  generator.addVariable('mimo_playback_i2s', 'I2SClass* mimo_playback_i2s = NULL;');
  generator.addVariable('mimo_playback_done', 'volatile bool mimo_playback_done = false;');
  generator.addVariable('mimo_playback_total_played', 'volatile size_t mimo_playback_total_played = 0;');
  generator.addVariable('mimo_playback_started', 'bool mimo_playback_started = false;');
  generator.addVariable('mimo_playback_buffered', 'size_t mimo_playback_buffered = 0;');
  generator.addVariable('mimo_playback_underruns', 'volatile uint32_t mimo_playback_underruns = 0;');
  generator.addVariable('mimo_playback_sample_rate', 'uint32_t mimo_playback_sample_rate = 24000;');
  generator.addVariable('mimo_playback_bits_per_sample', 'uint16_t mimo_playback_bits_per_sample = 16;');
  generator.addVariable('mimo_playback_channels', 'uint16_t mimo_playback_channels = 1;');
  generator.addVariable('mimo_audio_stream_chunks', 'size_t mimo_audio_stream_chunks = 0;');

  generator.addFunction('mimo_stream_playback_helpers', String.raw`
#define MIMO_PLAYBACK_BUFFER_SIZE 196608
#define MIMO_PLAYBACK_PREBUFFER_SIZE 32768
#define MIMO_PLAYBACK_CHUNK_SIZE 4096
#define MIMO_DECODE_BUF_SIZE 16384

bool mimo_i2s_prepare_es8311_playback(I2SClass &i2s, uint32_t sampleRate, i2s_data_bit_width_t bitWidth, i2s_slot_mode_t slotMode);
void mimo_k10_set_amp(bool enabled);
size_t mimo_k10_write_pcm(const uint8_t* data, size_t len, uint16_t channels, uint16_t bitsPerSample);

void mimo_play_prompt_tone(I2SClass &i2s, int freq, int durationMs) {
  const uint32_t toneRate = 16000;
  if (!mimo_i2s_prepare_es8311_playback(i2s, toneRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO)) {
    if (mimo_i2s_speaker_bclk_pin >= 0 && mimo_i2s_speaker_lrclk_pin >= 0 && mimo_i2s_speaker_din_pin >= 0) {
      i2s.end();
      delay(20);
      i2s.setPins(mimo_i2s_speaker_bclk_pin, mimo_i2s_speaker_lrclk_pin, mimo_i2s_speaker_din_pin, -1, -1);
      i2s.begin(I2S_MODE_STD, toneRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO, I2S_STD_SLOT_BOTH);
    } else {
      i2s.end();
      delay(20);
      i2s.begin(I2S_MODE_STD, toneRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO, I2S_STD_SLOT_BOTH);
    }
  } else if (mimo_i2s_mic_mode != 3 && mimo_i2s_mic_mode != 4 && mimo_i2s_speaker_bclk_pin >= 0 && mimo_i2s_speaker_lrclk_pin >= 0 && mimo_i2s_speaker_din_pin >= 0) {
    i2s.end();
    delay(20);
    i2s.setPins(mimo_i2s_speaker_bclk_pin, mimo_i2s_speaker_lrclk_pin, mimo_i2s_speaker_din_pin, -1, -1);
    i2s.begin(I2S_MODE_STD, toneRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO, I2S_STD_SLOT_BOTH);
  }
  size_t samples = toneRate * durationMs / 1000;
  int16_t* buf = (int16_t*)malloc(samples * sizeof(int16_t));
  if (!buf) {
    Serial.println("[MIMO-AUDIO] prompt tone alloc failed");
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
      Serial.println("[MIMO-AUDIO] prompt tone timeout");
      break;
    }
    size_t n = 0;
    if (mimo_i2s_mic_mode == 4) {
      n = mimo_k10_write_pcm((uint8_t*)buf + written, bytes - written, 1, 16);
    } else {
      n = i2s.write((uint8_t*)buf + written, bytes - written);
    }
    if (n == 0) delay(1);
    else written += n;
  }
  free(buf);
  delay(durationMs + 20);
  Serial.println("[MIMO-AUDIO] prompt tone done, bytes: " + String(written));
}

void mimo_playback_task_entry(void* param) {
  uint8_t chunk[MIMO_PLAYBACK_CHUNK_SIZE];
  while (!mimo_playback_done || xStreamBufferBytesAvailable(mimo_playback_stream) > 0) {
    size_t n = xStreamBufferReceive(mimo_playback_stream, chunk, sizeof(chunk), pdMS_TO_TICKS(20));
    if (n == 0) {
      if (!mimo_playback_done) mimo_playback_underruns++;
      delay(1);
      continue;
    }
    size_t writtenTotal = 0;
    while (writtenTotal < n) {
      if (!mimo_playback_i2s) break;
      size_t written = 0;
      if (mimo_i2s_mic_mode == 4) {
        written = mimo_k10_write_pcm(chunk + writtenTotal, n - writtenTotal, mimo_playback_channels, mimo_playback_bits_per_sample);
      } else {
        written = mimo_playback_i2s->write(chunk + writtenTotal, n - writtenTotal);
      }
      if (written == 0) {
        delay(1);
      } else {
        writtenTotal += written;
        mimo_playback_total_played += written;
      }
    }
    delay(0);
  }
  mimo_playback_task_handle = NULL;
  vTaskDelete(NULL);
}

bool mimo_prepare_stream_playback(I2SClass &i2s) {
  mimo_playback_i2s = &i2s;
  mimo_playback_done = false;
  mimo_playback_total_played = 0;
  mimo_playback_started = false;
  mimo_playback_buffered = 0;
  mimo_playback_underruns = 0;
  mimo_playback_sample_rate = 24000;
  mimo_playback_bits_per_sample = 16;
  mimo_playback_channels = 1;
  mimo_audio_stream_chunks = 0;

  if (!mimo_playback_storage) {
    mimo_playback_storage = (uint8_t*)mimo_audio_alloc_buffer(MIMO_PLAYBACK_BUFFER_SIZE, "playback-stream");
    if (!mimo_playback_storage) return false;
  }

  if (!mimo_playback_stream) {
    mimo_playback_stream = xStreamBufferCreateStatic(
      MIMO_PLAYBACK_BUFFER_SIZE, 1, mimo_playback_storage, &mimo_playback_stream_struct);
  } else {
    xStreamBufferReset(mimo_playback_stream);
  }

  if (!mimo_playback_stream) {
    Serial.println("[MIMO-AUDIO] stream buffer create failed");
    return false;
  }
  return true;
}

bool mimo_start_stream_playback() {
  if (mimo_playback_started) return true;
  if (!mimo_playback_i2s) return false;

  mimo_playback_i2s->end();
  i2s_data_bit_width_t bitWidth = (mimo_playback_bits_per_sample == 32) ? I2S_DATA_BIT_WIDTH_32BIT : I2S_DATA_BIT_WIDTH_16BIT;
  i2s_slot_mode_t slotMode = (mimo_playback_channels == 2) ? I2S_SLOT_MODE_STEREO : I2S_SLOT_MODE_MONO;
  bool ok = mimo_i2s_prepare_es8311_playback(*mimo_playback_i2s, mimo_playback_sample_rate, bitWidth, slotMode);
  bool helperPreparedPlayback = (mimo_i2s_mic_mode == 4) || (mimo_i2s_mic_mode == 3 && mimo_i2s_mic_es8311_dac_pin >= 0);
  if (ok && !helperPreparedPlayback) {
    ok = mimo_playback_i2s->begin(I2S_MODE_STD, mimo_playback_sample_rate, bitWidth, slotMode, I2S_STD_SLOT_BOTH);
  }
  if (!ok) {
    Serial.println("[MIMO-AUDIO] I2S begin failed");
    return false;
  }
  Serial.println("[MIMO-AUDIO] playback start: " + String(mimo_playback_sample_rate) + "Hz " + String(mimo_playback_bits_per_sample) + "bit " + String(mimo_playback_channels) + "ch");

  BaseType_t taskOk = xTaskCreatePinnedToCore(
    mimo_playback_task_entry, "mimo_tts_play", 12288, NULL, 6, &mimo_playback_task_handle, ARDUINO_RUNNING_CORE);
  if (taskOk != pdPASS) {
    mimo_playback_task_handle = NULL;
    Serial.println("[MIMO-AUDIO] playback task create failed");
    return false;
  }

  mimo_playback_started = true;
  Serial.println("[MIMO-AUDIO] prebuffer ready, play");
  return true;
}

bool mimo_queue_stream_playback(const uint8_t* data, size_t len) {
  if (!mimo_playback_stream || len == 0) return false;

  size_t sentTotal = 0;
  while (sentTotal < len) {
    size_t toSend = min((size_t)4096, len - sentTotal);
    size_t sent = xStreamBufferSend(
      mimo_playback_stream, data + sentTotal, toSend, pdMS_TO_TICKS(3000));
    if (sent == 0) {
      Serial.println("[MIMO-AUDIO] playback buffer timeout");
      return false;
    }

    sentTotal += sent;
    mimo_playback_buffered += sent;
    if (!mimo_playback_started && mimo_playback_buffered >= MIMO_PLAYBACK_PREBUFFER_SIZE) {
      if (!mimo_start_stream_playback()) return false;
    }
  }
  return true;
}

size_t mimo_finish_stream_playback() {
  if (mimo_playback_stream && !mimo_playback_started && mimo_playback_buffered > 0) {
    mimo_start_stream_playback();
  }
  mimo_playback_done = true;
  unsigned long startMs = millis();
  while (mimo_playback_task_handle && millis() - startMs < 60000) {
    delay(10);
  }
  if (mimo_playback_task_handle) {
    Serial.println("[MIMO-AUDIO] wait playback timeout");
  }
  if (mimo_i2s_mic_mode == 4) {
    delay(30);
    mimo_k10_set_amp(false);
  }
  return mimo_playback_total_played;
}

void mimo_play_decoded_audio(I2SClass &i2s, uint8_t* decodeBuf, size_t outLen, bool &headerParsed, size_t &queuedAudio) {
  if (outLen == 0) return;

  uint8_t* pcmPtr = decodeBuf;
  size_t playLen = outLen;
  if (!headerParsed) {
    if (outLen > 44 && decodeBuf[0] == 'R' && decodeBuf[1] == 'I' && decodeBuf[2] == 'F' && decodeBuf[3] == 'F') {
      int hdrLen = 44;
      int fmtSize = decodeBuf[16] | (decodeBuf[17] << 8) | (decodeBuf[18] << 16) | (decodeBuf[19] << 24);
      if (fmtSize > 16) hdrLen = 44 + (fmtSize - 16);
      mimo_playback_channels = decodeBuf[22] | (decodeBuf[23] << 8);
      mimo_playback_sample_rate = decodeBuf[24] | (decodeBuf[25] << 8) | (decodeBuf[26] << 16) | (decodeBuf[27] << 24);
      mimo_playback_bits_per_sample = decodeBuf[34] | (decodeBuf[35] << 8);
      if (hdrLen < (int)outLen) {
        pcmPtr = decodeBuf + hdrLen;
        playLen = outLen - hdrLen;
      } else {
        playLen = 0;
      }
      Serial.println("[MIMO-AUDIO] WAV: " + String(mimo_playback_sample_rate) + "Hz " + String(mimo_playback_bits_per_sample) + "bit " + String(mimo_playback_channels) + "ch");
    } else {
      mimo_playback_sample_rate = 24000;
      mimo_playback_bits_per_sample = 16;
      mimo_playback_channels = 1;
      Serial.println("[MIMO-AUDIO] PCM: 24000Hz 16bit mono");
    }
    headerParsed = true;
  }

  if (playLen > 0 && mimo_queue_stream_playback(pcmPtr, playLen)) {
    queuedAudio += playLen;
  }
}

void mimo_decode_and_queue_base64(I2SClass &i2s, String &b64Data, uint8_t* decodeBuf, bool &headerParsed, size_t &queuedAudio) {
  if (b64Data.length() == 0) return;
  while ((b64Data.length() % 4) != 0) b64Data += "=";

  const size_t maxB64In = (MIMO_DECODE_BUF_SIZE / 3) * 4;
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
      decodeBuf, MIMO_DECODE_BUF_SIZE, &outLen, (const unsigned char*)b64Data.c_str() + offset, partLen);
    if (ret == 0) {
      mimo_play_decoded_audio(i2s, decodeBuf, outLen, headerParsed, queuedAudio);
    } else {
      Serial.println("[MIMO-AUDIO] base64 decode failed: " + String(ret));
    }
    offset += partLen;
  }
}

bool mimo_play_base64_audio_to_i2s(I2SClass &i2s, String base64Audio) {
  Serial.println("[MIMO-AUDIO] play base64 len: " + String(base64Audio.length()));
  if (base64Audio.length() == 0 || base64Audio.startsWith("URL:")) {
    mimo_last_success = false;
    mimo_last_error = base64Audio.startsWith("URL:") ? "URL audio needs URL player" : "Empty audio";
    return false;
  }

  if (!mimo_prepare_stream_playback(i2s)) {
    mimo_last_success = false;
    mimo_last_error = "Playback buffer init failed";
    return false;
  }

  uint8_t* decodeBuf = (uint8_t*)mimo_audio_alloc_buffer(MIMO_DECODE_BUF_SIZE, "decode");
  if (!decodeBuf) {
    mimo_playback_done = true;
    mimo_last_success = false;
    mimo_last_error = "Decode alloc failed";
    return false;
  }

  bool headerParsed = false;
  size_t queuedAudio = 0;
  String cleanAudio = mimo_sanitize_base64(base64Audio);
  mimo_decode_and_queue_base64(i2s, cleanAudio, decodeBuf, headerParsed, queuedAudio);
  free(decodeBuf);
  size_t played = mimo_finish_stream_playback();

  mimo_last_success = played > 0;
  mimo_last_error = played > 0 ? "" : "No audio data";
  Serial.println("[MIMO-AUDIO] queued: " + String(queuedAudio) + ", played: " + String(played));
  return played > 0;
}`);

  generator.addFunction('mimo_sse_audio_sink', String.raw`
class MimoSseAudioSink : public Stream {
public:
  MimoSseAudioSink(I2SClass &i2s, uint8_t* decodeBuf, String* fullText, size_t &queuedAudio)
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
        mimo_last_error = (end > start) ? data.substring(start, end) : data.substring(0, min((int)data.length(), 240));
      } else {
        mimo_last_error = data.substring(0, min((int)data.length(), 240));
      }
      Serial.println("[MIMO-AUDIO] API error: " + mimo_last_error);
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
        if (mimo_stream_callback != NULL) {
          mimo_stream_chunk = content;
          mimo_stream_callback();
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
          String b64Data = mimo_sanitize_base64(data.substring(audioPos, audioEnd));
          if (b64Data.length() > 0) {
            mimo_audio_stream_chunks++;
            if (mimo_audio_stream_chunks <= 3) {
              Serial.println("[MIMO-AUDIO] audio chunk b64 len: " + String(b64Data.length()));
            }
          }
          mimo_decode_and_queue_base64(i2s_, b64Data, decodeBuf_, headerParsed_, queuedAudio_);
        }
      }
    }
  }
};

size_t mimo_stream_http_audio_to_i2s(HTTPClient &http, I2SClass &i2s, String *fullText, const char* tag) {
  if (!mimo_prepare_stream_playback(i2s)) {
    mimo_last_error = "Playback buffer init failed";
    return 0;
  }

  uint8_t* decodeBuf = (uint8_t*)mimo_audio_alloc_buffer(MIMO_DECODE_BUF_SIZE, "decode");
  if (!decodeBuf) {
    mimo_playback_done = true;
    mimo_last_error = "Decode alloc failed";
    return 0;
  }

  size_t queuedAudio = 0;
  MimoSseAudioSink sink(i2s, decodeBuf, fullText, queuedAudio);
  int streamResult = http.writeToStream(&sink);
  if (streamResult < 0) {
    mimo_last_error = HTTPClient::errorToString(streamResult);
    Serial.println(String("[") + tag + "] stream error: " + mimo_last_error);
  }

  free(decodeBuf);
  size_t played = mimo_finish_stream_playback();
  Serial.println(String("[") + tag + "] audio chunks: " + String(mimo_audio_stream_chunks) + ", queued: " + String(queuedAudio) + ", played: " + String(played) + ", underruns: " + String(mimo_playback_underruns));
  return played;
}`);
}





function ensureMimoTtsHelpers(generator) {
  ensureMimoBaseHelpers(generator);
  generator.addFunction('mimo_tts_request', String.raw`
String mimo_tts_request(String text, String voice, String model, String style = "") {
  Serial.println("[MIMO-TTS] synth begin");
  if (WiFi.status() != WL_CONNECTED) {
    mimo_last_success = false;
    mimo_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = mimo_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(120000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("api-key", mimo_api_key);

  String safeText = mimo_escape_json(text);
  String safeStyle = mimo_escape_json(style);
  String requestBody = "{\"model\":\"" + model + "\",\"messages\":[";
  if (style.length() > 0) {
    requestBody += "{\"role\":\"user\",\"content\":\"" + safeStyle + "\"},";
  }
  requestBody += "{\"role\":\"assistant\",\"content\":\"" + safeText + "\"}";
  requestBody += "],\"audio\":{\"format\":\"wav\",\"voice\":\"" + voice + "\"}}";

  int httpResponseCode = http.POST(requestBody);
  Serial.println("[MIMO-TTS] HTTP: " + String(httpResponseCode));
  String response = "";
  if (httpResponseCode == 200) {
    String payload = http.getString();
    int dataStart = payload.indexOf("\"data\":\"");
    if (dataStart >= 0) {
      dataStart += 8;
      int dataEnd = payload.indexOf("\"", dataStart);
      if (dataEnd > dataStart) {
        response = mimo_sanitize_base64(payload.substring(dataStart, dataEnd));
        mimo_last_success = response.length() > 0;
        mimo_last_error = response.length() > 0 ? "" : "No audio data";
      }
    }
    if (response.length() == 0 && mimo_last_error.length() == 0) {
      mimo_last_success = false;
      mimo_last_error = "Parse error";
    }
  } else {
    String err = http.getString();
    if (err.length() > 200) err = err.substring(0, 200);
    mimo_last_success = false;
    mimo_last_error = "HTTP " + String(httpResponseCode) + ": " + err;
  }
  http.end();
  return response;
}
`);

  generator.addFunction('mimo_tts_with_style_request', String.raw`
String mimo_tts_with_style_request(String text, String voice, String style, String model) {
  return mimo_tts_request(text, voice, model, style);
}
`);

  generator.addFunction('mimo_tts_voice_design_request', String.raw`
String mimo_tts_voice_design_request(String voiceDesc, String text) {
  Serial.println("[MIMO-TTS] voice design begin");
  if (WiFi.status() != WL_CONNECTED) {
    mimo_last_success = false;
    mimo_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = mimo_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(120000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("api-key", mimo_api_key);

  String safeDesc = mimo_escape_json(voiceDesc);
  String safeText = mimo_escape_json(text);
  String requestBody = "{\"model\":\"mimo-v2.5-tts-voicedesign\",\"messages\":[";
  requestBody += "{\"role\":\"user\",\"content\":\"" + safeDesc + "\"},";
  requestBody += "{\"role\":\"assistant\",\"content\":\"" + safeText + "\"}";
  requestBody += "],\"audio\":{\"format\":\"wav\"}}";

  int httpResponseCode = http.POST(requestBody);
  Serial.println("[MIMO-TTS] HTTP: " + String(httpResponseCode));
  String response = "";
  if (httpResponseCode == 200) {
    String payload = http.getString();
    int dataStart = payload.indexOf("\"data\":\"");
    if (dataStart >= 0) {
      dataStart += 8;
      int dataEnd = payload.indexOf("\"", dataStart);
      if (dataEnd > dataStart) response = mimo_sanitize_base64(payload.substring(dataStart, dataEnd));
    }
    mimo_last_success = response.length() > 0;
    mimo_last_error = response.length() > 0 ? "" : "No audio data";
  } else {
    String err = http.getString();
    if (err.length() > 200) err = err.substring(0, 200);
    mimo_last_success = false;
    mimo_last_error = "HTTP " + String(httpResponseCode) + ": " + err;
  }
  http.end();
  return response;
}
`);

  generator.addFunction('mimo_tts_voice_clone_request', String.raw`
String mimo_tts_voice_clone_request(String voiceBase64, String format, String style, String text) {
  Serial.println("[MIMO-TTS] voice clone begin");
  if (WiFi.status() != WL_CONNECTED) {
    mimo_last_success = false;
    mimo_last_error = "WiFi not connected";
    return "";
  }

  format.toLowerCase();
  if (format != "mp3" && format != "wav") format = "wav";
  String cleanVoice = mimo_sanitize_base64(voiceBase64);
  if (cleanVoice.length() == 0) {
    mimo_last_success = false;
    mimo_last_error = "Voice sample is empty";
    return "";
  }

  HTTPClient http;
  String url = mimo_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("api-key", mimo_api_key);

  String safeStyle = mimo_escape_json(style);
  String safeText = mimo_escape_json(text);
  String mimeType = (format == "mp3") ? "audio/mpeg" : "audio/wav";
  String requestBody = "{\"model\":\"mimo-v2.5-tts-voiceclone\",\"messages\":[";
  requestBody += "{\"role\":\"user\",\"content\":\"" + safeStyle + "\"},";
  requestBody += "{\"role\":\"assistant\",\"content\":\"" + safeText + "\"}";
  requestBody += "],\"audio\":{\"format\":\"wav\",\"voice\":\"data:" + mimeType + ";base64," + cleanVoice + "\"}}";

  int httpResponseCode = http.POST(requestBody);
  Serial.println("[MIMO-TTS] HTTP: " + String(httpResponseCode));
  String response = "";
  if (httpResponseCode == 200) {
    String payload = http.getString();
    int dataStart = payload.indexOf("\"data\":\"");
    if (dataStart >= 0) {
      dataStart += 8;
      int dataEnd = payload.indexOf("\"", dataStart);
      if (dataEnd > dataStart) response = mimo_sanitize_base64(payload.substring(dataStart, dataEnd));
    }
    mimo_last_success = response.length() > 0;
    mimo_last_error = response.length() > 0 ? "" : "No audio data";
  } else {
    String err = http.getString();
    if (err.length() > 200) err = err.substring(0, 200);
    mimo_last_success = false;
    mimo_last_error = "HTTP " + String(httpResponseCode) + ": " + err;
  }
  http.end();
  return response;
}
`);
}

function ensureMimoTtsStreamHelpers(generator) {
  ensureMimoPlaybackHelpers(generator);
  ensureMimoTtsHelpers(generator);
  generator.addFunction('mimo_tts_stream_play_impl', String.raw`
void mimo_tts_stream_play_impl(I2SClass &i2s, String text, String voice, String style = "") {
  Serial.println("[MIMO-TTS-STREAM] begin");
  if (WiFi.status() != WL_CONNECTED) {
    mimo_last_success = false;
    mimo_last_error = "WiFi not connected";
    return;
  }

  HTTPClient http;
  String url = mimo_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("api-key", mimo_api_key);

  String safeText = mimo_escape_json(text);
  String safeStyle = mimo_escape_json(style);
  String requestBody = "{\"model\":\"mimo-v2.5-tts\",\"messages\":[";
  if (style.length() > 0) {
    requestBody += "{\"role\":\"user\",\"content\":\"" + safeStyle + "\"},";
  }
  requestBody += "{\"role\":\"assistant\",\"content\":\"" + safeText + "\"}";
  requestBody += "],\"audio\":{\"format\":\"pcm16\",\"voice\":\"" + voice + "\"},\"stream\":true}";

  int httpResponseCode = http.POST(requestBody);
  Serial.println("[MIMO-TTS-STREAM] HTTP: " + String(httpResponseCode));
  if (httpResponseCode != 200) {
    String err = http.getString();
    if (err.length() > 200) err = err.substring(0, 200);
    mimo_last_success = false;
    mimo_last_error = "HTTP " + String(httpResponseCode) + ": " + err;
    http.end();
    return;
  }

  String fullText = "";
  size_t played = mimo_stream_http_audio_to_i2s(http, i2s, &fullText, "MIMO-TTS-STREAM");
  http.end();
  mimo_last_success = played > 0;
  mimo_last_error = played > 0 ? "" : (mimo_last_error.length() > 0 ? mimo_last_error : "No audio data");
}
`);

  generator.addFunction('mimo_tts_stream_play_with_style_impl', String.raw`
void mimo_tts_stream_play_with_style_impl(I2SClass &i2s, String text, String voice, String style) {
  mimo_tts_stream_play_impl(i2s, text, voice, style);
}
`);
}

function ensureMimoBaseHelpers(generator) {
  generator.addFunction('mimo_sanitize_base64', String.raw`
String mimo_sanitize_base64(String input) {
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

  generator.addFunction('mimo_unescape_json_string', String.raw`
String mimo_unescape_json_string(String input) {
  input.replace("\\/", "/");
  input.replace("\\u0026", "&");
  input.replace("\\u003d", "=");
  input.replace("\\u002b", "+");
  input.replace("\\u002f", "/");
  input.replace("\\n", "\n");
  input.replace("\\r", "\r");
  input.replace("\\t", "\t");
  input.replace("\\\"", "\"");
  input.replace("\\\\", "\\");
  return input;
}`);
}

function ensureMimoUploadHelpers(generator) {
  ensureMimoBaseHelpers(generator);
  ensureMimoAudioBufferHelpers(generator);

  generator.addFunction('mimo_base64_json_stream', String.raw`
class MimoBase64JsonStream : public Stream {
public:
  MimoBase64JsonStream(const String& prefix, const uint8_t* data, size_t dataLen, const String& suffix)
    : prefix_(prefix), data_(data), dataLen_(dataLen), suffix_(suffix), pos_(0) {
    b64Len_ = mimo_base64_encoded_len(dataLen_);
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

function ensureMimoWavHelpers(generator) {
  generator.addFunction('mimo_build_wav_header', String.raw`
void mimo_build_wav_header(uint8_t* header, uint32_t dataSize, uint32_t sampleRate) {
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
}

function ensureMimoAsrBaseHelpers(generator) {
  ensureMimoBaseHelpers(generator);

  generator.addFunction('mimo_asr_common_helpers', String.raw`
String mimo_asr_normalize_language(String language) {
  language.toLowerCase();
  if (language != "zh" && language != "en") return "auto";
  return language;
}

String mimo_asr_normalize_format(String format) {
  format.toLowerCase();
  return format == "mp3" ? "mp3" : "wav";
}

String mimo_asr_extract_content(const String& payload) {
  int contentStart = payload.indexOf("\"content\":\"");
  if (contentStart < 0) return "";
  contentStart += 11;
  int contentEnd = -1;
  bool escaped = false;
  for (int i = contentStart; i < (int)payload.length(); i++) {
    char ch = payload.charAt(i);
    if (ch == '\"' && !escaped) {
      contentEnd = i;
      break;
    }
    if (ch == '\\' && !escaped) escaped = true;
    else escaped = false;
  }
  if (contentEnd <= contentStart) return "";
  return mimo_unescape_json_string(payload.substring(contentStart, contentEnd));
}`);

  generator.addFunction('mimo_asr_base64_request', String.raw`
String mimo_asr_base64_request(String base64Audio, String format, String language) {
  Serial.println("[MIMO-ASR] Base64 recognition begin");
  mimo_last_success = false;
  mimo_last_error = "";
  if (WiFi.status() != WL_CONNECTED) {
    mimo_last_error = "WiFi not connected";
    return "";
  }

  format = mimo_asr_normalize_format(format);
  language = mimo_asr_normalize_language(language);
  String cleanAudio = mimo_sanitize_base64(base64Audio);
  if (cleanAudio.length() == 0) {
    mimo_last_error = "Audio Base64 is empty";
    return "";
  }

  HTTPClient http;
  String url = mimo_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("api-key", mimo_api_key);

  String requestBody;
  requestBody.reserve(cleanAudio.length() + 256);
  requestBody = "{\"model\":\"mimo-v2.5-asr\",\"messages\":[{\"role\":\"user\",\"content\":[";
  requestBody += "{\"type\":\"input_audio\",\"input_audio\":{\"data\":\"" + cleanAudio + "\",\"format\":\"" + format + "\"}}";
  requestBody += "]}],\"asr_options\":{\"language\":\"" + language + "\"}}";

  int httpResponseCode = http.POST(requestBody);
  Serial.println("[MIMO-ASR] HTTP: " + String(httpResponseCode));
  if (httpResponseCode == 200) {
    String response = mimo_asr_extract_content(http.getString());
    http.end();
    mimo_last_success = response.length() > 0;
    mimo_last_error = response.length() > 0 ? "" : "No transcription";
    return response;
  }

  String err = http.getString();
  if (err.length() > 240) err = err.substring(0, 240);
  http.end();
  mimo_last_error = "HTTP " + String(httpResponseCode) + ": " + err;
  return "";
}`);
}

function ensureMimoI2SAsrHelpers(generator) {
  ensureMimoAsrBaseHelpers(generator);
  ensureMimoUploadHelpers(generator);
  ensureMimoWavHelpers(generator);

  generator.addFunction('mimo_i2s_asr_request', String.raw`
String mimo_i2s_asr_request(I2SClass &i2sMic, float duration, String language) {
  Serial.println("[MIMO-ASR] I2S recognition begin");
  mimo_last_success = false;
  mimo_last_error = "";
  if (WiFi.status() != WL_CONNECTED) {
    mimo_last_error = "WiFi not connected";
    return "";
  }
  if (duration <= 0) {
    mimo_last_error = "Invalid record duration";
    return "";
  }

  language = mimo_asr_normalize_language(language);
  const uint32_t sampleRate = 16000;
  size_t pcmBytes = (size_t)(sampleRate * duration) * sizeof(int16_t);
  size_t wavBytes = 44 + pcmBytes;
  uint8_t* wavBuf = (uint8_t*)mimo_audio_alloc_buffer(wavBytes, "asr-wav");
  if (!wavBuf) {
    mimo_last_error = "WAV alloc failed";
    return "";
  }

  if (!mimo_i2s_restart_microphone(i2sMic, sampleRate)) {
    free(wavBuf);
    mimo_last_error = "Microphone begin failed";
    return "";
  }

  size_t bytesRead = mimo_i2s_record_pcm(i2sMic, wavBuf + 44, pcmBytes, duration, "MIMO-ASR");
  if (bytesRead == 0) {
    free(wavBuf);
    i2sMic.end();
    mimo_last_error = "No microphone audio captured";
    return "";
  }

  mimo_build_wav_header(wavBuf, (uint32_t)bytesRead, sampleRate);
  wavBytes = 44 + bytesRead;
  i2sMic.end();

  String requestPrefix = "{\"model\":\"mimo-v2.5-asr\",\"messages\":[{\"role\":\"user\",\"content\":[";
  requestPrefix += "{\"type\":\"input_audio\",\"input_audio\":{\"data\":\"";
  String requestSuffix = "\",\"format\":\"wav\"}}]}],\"asr_options\":{\"language\":\"" + language + "\"}}";
  MimoBase64JsonStream requestStream(requestPrefix, wavBuf, wavBytes, requestSuffix);

  HTTPClient http;
  String url = mimo_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("api-key", mimo_api_key);
  int httpResponseCode = http.sendRequest("POST", &requestStream, requestStream.contentLength());
  free(wavBuf);
  Serial.println("[MIMO-ASR] HTTP: " + String(httpResponseCode));

  if (httpResponseCode == 200) {
    String response = mimo_asr_extract_content(http.getString());
    http.end();
    mimo_last_success = response.length() > 0;
    mimo_last_error = response.length() > 0 ? "" : "No transcription";
    return response;
  }

  String err = http.getString();
  if (err.length() > 240) err = err.substring(0, 240);
  http.end();
  mimo_last_error = "HTTP " + String(httpResponseCode) + ": " + err;
  return "";
}`);
}

function mimoOmniI2SKey(varName) {
  return String(varName).replace(/[^A-Za-z0-9_]/g, '_');
}

function ensureMimoI2SCompat(generator) {
  generator.addLibrary('ESP_I2S', String.raw`
#if __has_include(<unihiker_k10.h>)
#include <SPIFFS.h>
#include <unihiker_k10.h>
#endif

#if __has_include(<ESP_I2S.h>)
#include <ESP_I2S.h>
#else
#include <Arduino.h>
#include <driver/i2s.h>

typedef i2s_bits_per_sample_t i2s_data_bit_width_t;
typedef enum {
  I2S_SLOT_MODE_MONO = 1,
  I2S_SLOT_MODE_STEREO = 2
} i2s_slot_mode_t;
static const int I2S_MODE_STD = 0;
static const int I2S_MODE_PDM_RX = 1;
static const i2s_data_bit_width_t I2S_DATA_BIT_WIDTH_16BIT = I2S_BITS_PER_SAMPLE_16BIT;
static const i2s_data_bit_width_t I2S_DATA_BIT_WIDTH_32BIT = I2S_BITS_PER_SAMPLE_32BIT;
static const int I2S_STD_SLOT_BOTH = 0;

class I2SClass : public Stream {
public:
  I2SClass() : _bclk(-1), _lrclk(-1), _dout(-1), _din(-1), _mclk(-1), _timeoutMs(20), _installed(false) {}

  void setPins(int bclk, int lrclk, int dout, int din, int mclk = -1) {
    _bclk = bclk;
    _lrclk = lrclk;
    _dout = dout;
    _din = din;
    _mclk = mclk;
  }

  void setPinsPdmRx(int clk, int din) {
    _bclk = clk;
    _lrclk = -1;
    _dout = -1;
    _din = din;
    _mclk = -1;
  }

  bool begin(int mode, uint32_t sampleRate, i2s_data_bit_width_t bitWidth, i2s_slot_mode_t slotMode, int slotMask = I2S_STD_SLOT_BOTH) {
    (void)mode;
    (void)slotMask;
    end();
    i2s_config_t config = {
      .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX | I2S_MODE_TX),
      .sample_rate = sampleRate,
      .bits_per_sample = (i2s_bits_per_sample_t)bitWidth,
      .channel_format = (slotMode == I2S_SLOT_MODE_STEREO) ? I2S_CHANNEL_FMT_RIGHT_LEFT : I2S_CHANNEL_FMT_ONLY_LEFT,
      .communication_format = I2S_COMM_FORMAT_STAND_I2S,
      .intr_alloc_flags = ESP_INTR_FLAG_LEVEL2,
      .dma_buf_count = 3,
      .dma_buf_len = 300,
      .use_apll = false,
      .tx_desc_auto_clear = true,
      .fixed_mclk = 0,
      .mclk_multiple = I2S_MCLK_MULTIPLE_DEFAULT,
      .bits_per_chan = I2S_BITS_PER_CHAN_16BIT
    };
    i2s_pin_config_t pins = {
      .mck_io_num = _mclk,
      .bck_io_num = _bclk,
      .ws_io_num = _lrclk,
      .data_out_num = _dout,
      .data_in_num = _din
    };
    esp_err_t ok = i2s_driver_install(I2S_NUM_0, &config, 0, NULL);
    if (ok != ESP_OK) return false;
    ok = i2s_set_pin(I2S_NUM_0, &pins);
    if (ok != ESP_OK) {
      i2s_driver_uninstall(I2S_NUM_0);
      return false;
    }
    i2s_zero_dma_buffer(I2S_NUM_0);
    _installed = true;
    return true;
  }

  void configureRX(uint32_t sampleRate, i2s_data_bit_width_t bitWidth, i2s_slot_mode_t slotMode) {
    begin(I2S_MODE_STD, sampleRate, bitWidth, slotMode, I2S_STD_SLOT_BOTH);
  }

  void end() {
    if (_installed) {
      i2s_driver_uninstall(I2S_NUM_0);
      _installed = false;
    }
  }

  void setTimeout(unsigned long timeoutMs) {
    _timeoutMs = timeoutMs;
  }

  size_t readBytes(char* buffer, size_t length) {
    size_t got = 0;
    if (!_installed || length == 0) return 0;
    i2s_read(I2S_NUM_0, buffer, length, &got, pdMS_TO_TICKS(_timeoutMs));
    return got;
  }

  size_t write(uint8_t b) override {
    return write(&b, 1);
  }

  size_t write(const uint8_t* buffer, size_t size) override {
    size_t written = 0;
    if (!_installed || size == 0) return 0;
    i2s_write(I2S_NUM_0, buffer, size, &written, pdMS_TO_TICKS(_timeoutMs));
    return written;
  }

  int available() override { return 0; }
  int read() override { return -1; }
  int peek() override { return -1; }
  void flush() override {}

private:
  int _bclk;
  int _lrclk;
  int _dout;
  int _din;
  int _mclk;
  unsigned long _timeoutMs;
  bool _installed;
};
#endif`);
}

function mimoOmniVoiceChatPromptCode(prompt) {
  const promptCode = String(prompt || '""').trim();
  if (promptCode === '"请描述一下你听到的内容"' || promptCode === "'请描述一下你听到的内容'") {
    return '"请用简短友好的方式回答，适合语音播报"';
  }
  return promptCode;
}

function ensureMimoI2SObject(generator, varName) {
  ensureMimoI2SCompat(generator);
  generator.addVariable('I2SClass_' + mimoOmniI2SKey(varName), 'I2SClass ' + varName + ';');
}

function ensureMimoI2SHelpers(generator) {
  ensureMimoI2SCompat(generator);
  ensureMimoAudioBufferHelpers(generator);
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('mimo_math', '#include <math.h>');
  generator.addVariable('mimo_i2s_mic_bclk_pin', 'int mimo_i2s_mic_bclk_pin = -1;');
  generator.addVariable('mimo_i2s_mic_lrclk_pin', 'int mimo_i2s_mic_lrclk_pin = -1;');
  generator.addVariable('mimo_i2s_mic_sd_pin', 'int mimo_i2s_mic_sd_pin = -1;');
  generator.addVariable('mimo_i2s_speaker_bclk_pin', 'int mimo_i2s_speaker_bclk_pin = -1;');
  generator.addVariable('mimo_i2s_speaker_lrclk_pin', 'int mimo_i2s_speaker_lrclk_pin = -1;');
  generator.addVariable('mimo_i2s_speaker_din_pin', 'int mimo_i2s_speaker_din_pin = -1;');
  generator.addVariable('mimo_i2s_mic_mode', 'int mimo_i2s_mic_mode = 0;');
  generator.addVariable('mimo_i2s_mic_pdm_clk_pin', 'int mimo_i2s_mic_pdm_clk_pin = -1;');
  generator.addVariable('mimo_i2s_mic_pdm_din_pin', 'int mimo_i2s_mic_pdm_din_pin = -1;');
  generator.addVariable('mimo_i2s_mic_es8311_sda_pin', 'int mimo_i2s_mic_es8311_sda_pin = -1;');
  generator.addVariable('mimo_i2s_mic_es8311_scl_pin', 'int mimo_i2s_mic_es8311_scl_pin = -1;');
  generator.addVariable('mimo_i2s_mic_es8311_addr', 'uint8_t mimo_i2s_mic_es8311_addr = 0x18;');
  generator.addVariable('mimo_i2s_mic_es8311_mclk_pin', 'int mimo_i2s_mic_es8311_mclk_pin = -1;');
  generator.addVariable('mimo_i2s_mic_es8311_dac_pin', 'int mimo_i2s_mic_es8311_dac_pin = -1;');
  generator.addVariable('mimo_i2s_mic_es8311_pa_pin', 'int mimo_i2s_mic_es8311_pa_pin = -1;');
  generator.addVariable('mimo_i2s_mic_es8311_gain_reg', 'uint8_t mimo_i2s_mic_es8311_gain_reg = 0x24;');
  generator.addVariable('mimo_i2s_k10_sample_rate', 'uint32_t mimo_i2s_k10_sample_rate = 16000;');
  generator.addFunction('mimo_i2s_audio_helpers', String.raw`
void mimo_es8311_set_pa(int paPin, bool enabled) {
  if (paPin < 0) return;
  pinMode(paPin, OUTPUT);
  digitalWrite(paPin, enabled ? HIGH : LOW);
  Serial.println("[ES8311] PA_EN pin " + String(paPin) + (enabled ? " HIGH" : " LOW"));
}

bool mimo_es8311_write_reg(uint8_t address, uint8_t reg, uint8_t value) {
  Wire.beginTransmission(address);
  Wire.write(reg);
  Wire.write(value);
  return Wire.endTransmission() == 0;
}

int mimo_es8311_read_reg(uint8_t address, uint8_t reg) {
  Wire.beginTransmission(address);
  Wire.write(reg);
  if (Wire.endTransmission(false) != 0) return -1;
  if (Wire.requestFrom((int)address, 1) != 1) return -1;
  return Wire.read();
}

bool mimo_es8311_config_clock(uint8_t address, uint32_t sampleRate, bool useMclk) {
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
  ok &= mimo_es8311_write_reg(address, 0x02, reg02);
  ok &= mimo_es8311_write_reg(address, 0x05, ((adcDiv - 1) << 4) | (dacDiv - 1));
  ok &= mimo_es8311_write_reg(address, 0x03, (fsMode << 6) | adcOsr);
  ok &= mimo_es8311_write_reg(address, 0x04, dacOsr);
  ok &= mimo_es8311_write_reg(address, 0x07, lrckH);
  ok &= mimo_es8311_write_reg(address, 0x08, lrckL);
  ok &= mimo_es8311_write_reg(address, 0x06, (bclkDiv < 19) ? (bclkDiv - 1) : bclkDiv);

  Serial.println("[ES8311] clock config rate=" + String(sampleRate) + " mclk=" + String(mclk) + " reg02=" + String(reg02, HEX));
  return ok;
}

bool mimo_es8311_begin(uint8_t address, int sdaPin, int sclPin, uint8_t micGainReg, bool useMclk) {
  Serial.println("[ES8311] codec begin");
  Wire.begin(sdaPin, sclPin);
  Wire.setClock(100000);
  delay(20);

  bool ok = true;
  ok &= mimo_es8311_write_reg(address, 0x00, 0x80);
  delay(20);
  ok &= mimo_es8311_write_reg(address, 0x01, 0x30);
  ok &= mimo_es8311_write_reg(address, 0x02, 0x00);
  ok &= mimo_es8311_write_reg(address, 0x03, 0x10);
  ok &= mimo_es8311_write_reg(address, 0x16, 0x24);
  ok &= mimo_es8311_write_reg(address, 0x04, 0x10);
  ok &= mimo_es8311_write_reg(address, 0x05, 0x00);
  ok &= mimo_es8311_write_reg(address, 0x0B, 0x00);
  ok &= mimo_es8311_write_reg(address, 0x0C, 0x00);
  ok &= mimo_es8311_write_reg(address, 0x10, 0x1F);
  ok &= mimo_es8311_write_reg(address, 0x11, 0x7F);
  ok &= mimo_es8311_write_reg(address, 0x00, 0x80);
  ok &= mimo_es8311_write_reg(address, 0x00, 0x80);
  ok &= mimo_es8311_write_reg(address, 0x01, useMclk ? 0x3F : 0xBF);
  ok &= mimo_es8311_write_reg(address, 0x02, 0x00);
  ok &= mimo_es8311_write_reg(address, 0x03, 0x10);
  ok &= mimo_es8311_write_reg(address, 0x04, 0x10);
  ok &= mimo_es8311_write_reg(address, 0x05, 0x00);
  ok &= mimo_es8311_write_reg(address, 0x06, 0x03);
  ok &= mimo_es8311_write_reg(address, 0x07, 0x00);
  ok &= mimo_es8311_write_reg(address, 0x08, 0xFF);
  ok &= mimo_es8311_write_reg(address, 0x09, 0x0C);
  ok &= mimo_es8311_write_reg(address, 0x0A, 0x0C);
  ok &= mimo_es8311_write_reg(address, 0x13, 0x10);
  ok &= mimo_es8311_write_reg(address, 0x1B, 0x0A);
  ok &= mimo_es8311_write_reg(address, 0x1C, 0x6A);
  ok &= mimo_es8311_write_reg(address, 0x44, 0x08);
  ok &= mimo_es8311_write_reg(address, 0x31, 0x00);
  ok &= mimo_es8311_write_reg(address, 0x32, 0xC0);
  ok &= mimo_es8311_write_reg(address, 0x17, 0xBF);
  ok &= mimo_es8311_write_reg(address, 0x0E, 0x02);
  ok &= mimo_es8311_write_reg(address, 0x12, 0x00);
  ok &= mimo_es8311_write_reg(address, 0x14, 0x1A);
  ok &= mimo_es8311_write_reg(address, 0x0D, 0x01);
  ok &= mimo_es8311_write_reg(address, 0x15, 0x40);
  ok &= mimo_es8311_write_reg(address, 0x16, micGainReg);
  ok &= mimo_es8311_write_reg(address, 0x37, 0x08);
  ok &= mimo_es8311_write_reg(address, 0x45, 0x00);
  ok &= mimo_es8311_config_clock(address, 16000, useMclk);

  Serial.println("[ES8311] DAC enabled, volume 192");
  Serial.println("[ES8311] clock source: " + String(useMclk ? "MCLK" : "BCLK/LRCLK"));
  Serial.println("[ES8311] reg09=" + String(mimo_es8311_read_reg(address, 0x09), HEX) + " reg31=" + String(mimo_es8311_read_reg(address, 0x31), HEX) + " reg32=" + String(mimo_es8311_read_reg(address, 0x32), HEX));
  Serial.println(ok ? "[ES8311] codec ready" : "[ES8311] codec begin failed");
  return ok;
}

bool mimo_i2s_begin_speaker(I2SClass &i2s, int bclkPin, int lrclkPin, int dinPin, uint32_t sampleRate) {
  Serial.println("[I2S] speaker begin");
  mimo_i2s_speaker_bclk_pin = bclkPin;
  mimo_i2s_speaker_lrclk_pin = lrclkPin;
  mimo_i2s_speaker_din_pin = dinPin;
  i2s.end();
  i2s.setPins(bclkPin, lrclkPin, dinPin, -1, -1);
  bool ok = i2s.begin(I2S_MODE_STD, sampleRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO, I2S_STD_SLOT_BOTH);
  Serial.println(ok ? "[I2S] speaker ready" : "[I2S] speaker begin failed");
  return ok;
}

bool mimo_i2s_begin_microphone(I2SClass &i2s, int bclkPin, int lrclkPin, int sdPin, uint32_t sampleRate) {
  Serial.println("[I2S] microphone begin");
  mimo_i2s_mic_bclk_pin = bclkPin;
  mimo_i2s_mic_lrclk_pin = lrclkPin;
  mimo_i2s_mic_sd_pin = sdPin;
  mimo_i2s_mic_mode = 1;
  mimo_i2s_mic_pdm_clk_pin = -1;
  mimo_i2s_mic_pdm_din_pin = -1;
  mimo_i2s_mic_es8311_sda_pin = -1;
  mimo_i2s_mic_es8311_scl_pin = -1;
  mimo_i2s_mic_es8311_mclk_pin = -1;
  mimo_i2s_mic_es8311_dac_pin = -1;
  mimo_i2s_mic_es8311_pa_pin = -1;
  i2s.end();
  i2s.setPins(bclkPin, lrclkPin, -1, sdPin, -1);
  bool ok = i2s.begin(I2S_MODE_STD, sampleRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO, I2S_STD_SLOT_BOTH);
  Serial.println(ok ? "[I2S] microphone ready" : "[I2S] microphone begin failed");
  return ok;
}

bool mimo_i2s_begin_pdm_microphone(I2SClass &i2s, int clkPin, int dinPin, uint32_t sampleRate) {
  Serial.println("[I2S] PDM microphone begin");
#if defined(SOC_I2S_SUPPORTS_PDM_RX) && SOC_I2S_SUPPORTS_PDM_RX
  mimo_i2s_mic_bclk_pin = -1;
  mimo_i2s_mic_lrclk_pin = -1;
  mimo_i2s_mic_sd_pin = -1;
  mimo_i2s_mic_mode = 2;
  mimo_i2s_mic_pdm_clk_pin = clkPin;
  mimo_i2s_mic_pdm_din_pin = dinPin;
  mimo_i2s_mic_es8311_sda_pin = -1;
  mimo_i2s_mic_es8311_scl_pin = -1;
  mimo_i2s_mic_es8311_mclk_pin = -1;
  mimo_i2s_mic_es8311_dac_pin = -1;
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

void mimo_k10_set_amp(bool enabled) {
#if __has_include(<unihiker_k10.h>)
  digital_write(eAmp_Gain, enabled ? 1 : 0);
#else
  (void)enabled;
#endif
}

bool mimo_i2s_begin_k10_audio(I2SClass &i2s, uint32_t sampleRate) {
  Serial.println("[K10-AUDIO] built-in microphone + speaker begin");
#if __has_include(<unihiker_k10.h>)
  mimo_i2s_mic_bclk_pin = IIS_BLCK;
  mimo_i2s_mic_lrclk_pin = IIS_LRCK;
  mimo_i2s_mic_sd_pin = IIS_DSIN;
  mimo_i2s_speaker_bclk_pin = IIS_BLCK;
  mimo_i2s_speaker_lrclk_pin = IIS_LRCK;
  mimo_i2s_speaker_din_pin = IIS_DOUT;
  mimo_i2s_mic_mode = 4;
  mimo_i2s_mic_pdm_clk_pin = -1;
  mimo_i2s_mic_pdm_din_pin = -1;
  mimo_i2s_mic_es8311_sda_pin = -1;
  mimo_i2s_mic_es8311_scl_pin = -1;
  mimo_i2s_mic_es8311_mclk_pin = IIS_MCLK;
  mimo_i2s_mic_es8311_dac_pin = -1;
  mimo_i2s_mic_es8311_pa_pin = -1;
  mimo_i2s_k10_sample_rate = sampleRate;
  mimo_k10_set_amp(false);

  esp_err_t rateOk = i2s_set_sample_rates(I2S_NUM_0, sampleRate);
  if (rateOk == ESP_OK) {
    i2s_zero_dma_buffer(I2S_NUM_0);
    Serial.println("[K10-AUDIO] ready (reuse SDK I2S)");
    return true;
  }

  init_board();
  rateOk = i2s_set_sample_rates(I2S_NUM_0, sampleRate);
  if (rateOk == ESP_OK) {
    i2s_zero_dma_buffer(I2S_NUM_0);
    Serial.println("[K10-AUDIO] ready (init board I2S)");
    return true;
  }

  i2s.end();
  delay(20);
  i2s.setPins(IIS_BLCK, IIS_LRCK, IIS_DOUT, IIS_DSIN, IIS_MCLK);
  bool ok = i2s.begin(I2S_MODE_STD, sampleRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_STEREO, I2S_STD_SLOT_BOTH);
  Serial.println(ok ? "[K10-AUDIO] ready" : "[K10-AUDIO] begin failed");
  return ok;
#else
  (void)i2s;
  (void)sampleRate;
  Serial.println("[K10-AUDIO] unihiker_k10.h not found");
  return false;
#endif
}

size_t mimo_k10_record_mono_pcm(uint8_t* pcmBuf, size_t pcmBytes, float durationSeconds, const char* tag) {
#if __has_include(<unihiker_k10.h>)
  size_t bytesRead = 0;
  unsigned long recordStart = millis();
  unsigned long maxMs = (unsigned long)(durationSeconds * 1000 + 1200);
  uint8_t* stereoBuf = (uint8_t*)mimo_audio_alloc_buffer(6400, "k10-rec");
  if (!stereoBuf) return 0;
  if (xI2SMutex) xSemaphoreTake(xI2SMutex, portMAX_DELAY);
  mimo_k10_set_amp(true);
  while (bytesRead + sizeof(int16_t) <= pcmBytes) {
    if (millis() - recordStart > maxMs) {
      Serial.println(String("[") + tag + "] K10 record timeout");
      break;
    }
    size_t got = 0;
    size_t want = min((size_t)6400, ((pcmBytes - bytesRead) / sizeof(int16_t)) * sizeof(int16_t) * 2);
    if (want == 0) break;
    esp_err_t err = i2s_read(I2S_NUM_0, stereoBuf, want, &got, pdMS_TO_TICKS(250));
    if (err != ESP_OK || got < sizeof(int16_t) * 2) {
      delay(1);
      continue;
    }
    size_t pairs = got / (sizeof(int16_t) * 2);
    int16_t* out = (int16_t*)(pcmBuf + bytesRead);
    size_t room = (pcmBytes - bytesRead) / sizeof(int16_t);
    size_t toCopy = min(pairs, room);
    int16_t* in = (int16_t*)stereoBuf;
    for (size_t i = 0; i < toCopy; i++) {
      int32_t left = in[i * 2];
      int32_t right = in[i * 2 + 1];
      out[i] = (int16_t)((left + right) / 2);
    }
    bytesRead += toCopy * sizeof(int16_t);
  }
  mimo_k10_set_amp(false);
  if (xI2SMutex) xSemaphoreGive(xI2SMutex);
  free(stereoBuf);
  if (bytesRead % sizeof(int16_t) != 0) bytesRead -= bytesRead % sizeof(int16_t);
  Serial.println(String("[") + tag + "] K10 expected PCM bytes: " + String((size_t)(durationSeconds * 16000) * sizeof(int16_t)) + ", captured: " + String(bytesRead));
  return bytesRead;
#else
  (void)pcmBuf;
  (void)pcmBytes;
  (void)durationSeconds;
  (void)tag;
  return 0;
#endif
}

size_t mimo_k10_write_pcm(const uint8_t* data, size_t len, uint16_t channels, uint16_t bitsPerSample) {
#if __has_include(<unihiker_k10.h>)
  if (len == 0) return 0;
  mimo_k10_set_amp(true);
  if (xI2SMutex) xSemaphoreTake(xI2SMutex, portMAX_DELAY);
  if (bitsPerSample == 16 && channels == 1) {
    if (len < sizeof(int16_t)) {
      if (xI2SMutex) xSemaphoreGive(xI2SMutex);
      return len;
    }
    const int16_t* mono = (const int16_t*)data;
    size_t samples = len / sizeof(int16_t);
    static int16_t stereoBuf[1024];
    size_t done = 0;
    while (done < samples) {
      size_t n = min((size_t)512, samples - done);
      for (size_t i = 0; i < n; i++) {
        int16_t v = mono[done + i];
        stereoBuf[i * 2] = v;
        stereoBuf[i * 2 + 1] = v;
      }
      size_t written = 0;
      i2s_write(I2S_NUM_0, stereoBuf, n * sizeof(int16_t) * 2, &written, pdMS_TO_TICKS(200));
      if (written == 0) break;
      done += written / (sizeof(int16_t) * 2);
    }
    if (xI2SMutex) xSemaphoreGive(xI2SMutex);
    return done * sizeof(int16_t);
  }
  size_t written = 0;
  i2s_write(I2S_NUM_0, data, len, &written, pdMS_TO_TICKS(200));
  if (xI2SMutex) xSemaphoreGive(xI2SMutex);
  return written;
#else
  (void)data;
  (void)len;
  (void)channels;
  (void)bitsPerSample;
  return 0;
#endif
}

bool mimo_i2s_begin_es8311_microphone(I2SClass &i2s, int sdaPin, int sclPin, uint8_t address, int bclkPin, int lrclkPin, int sdoutPin, int mclkPin, uint32_t sampleRate, uint8_t micGainReg) {
  Serial.println("[I2S] ES8311 microphone begin");
  mimo_i2s_mic_bclk_pin = bclkPin;
  mimo_i2s_mic_lrclk_pin = lrclkPin;
  mimo_i2s_mic_sd_pin = sdoutPin;
  mimo_i2s_mic_mode = 3;
  mimo_i2s_mic_pdm_clk_pin = -1;
  mimo_i2s_mic_pdm_din_pin = -1;
  mimo_i2s_mic_es8311_sda_pin = sdaPin;
  mimo_i2s_mic_es8311_scl_pin = sclPin;
  mimo_i2s_mic_es8311_addr = address;
  mimo_i2s_mic_es8311_mclk_pin = mclkPin;
  mimo_i2s_mic_es8311_dac_pin = -1;
  mimo_i2s_mic_es8311_pa_pin = -1;
  mimo_i2s_mic_es8311_gain_reg = micGainReg;

  bool codecOk = mimo_es8311_begin(address, sdaPin, sclPin, micGainReg, mclkPin >= 0);
  codecOk &= mimo_es8311_config_clock(address, sampleRate, mclkPin >= 0);
  i2s.end();
  delay(20);
  i2s.setPins(bclkPin, lrclkPin, -1, sdoutPin, mclkPin);
  bool i2sOk = i2s.begin(I2S_MODE_STD, sampleRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO, I2S_STD_SLOT_BOTH);
  Serial.println((codecOk && i2sOk) ? "[I2S] ES8311 microphone ready" : "[I2S] ES8311 microphone begin failed");
  return codecOk && i2sOk;
}

bool mimo_i2s_begin_es8311_audio(I2SClass &i2s, int sdaPin, int sclPin, uint8_t address, int bclkPin, int lrclkPin, int dacDinPin, int adcDoutPin, int mclkPin, uint32_t sampleRate, uint8_t micGainReg, int paPin) {
  Serial.println("[I2S] ES8311 audio codec begin");
  mimo_i2s_mic_bclk_pin = bclkPin;
  mimo_i2s_mic_lrclk_pin = lrclkPin;
  mimo_i2s_mic_sd_pin = adcDoutPin;
  mimo_i2s_mic_mode = 3;
  mimo_i2s_mic_pdm_clk_pin = -1;
  mimo_i2s_mic_pdm_din_pin = -1;
  mimo_i2s_mic_es8311_sda_pin = sdaPin;
  mimo_i2s_mic_es8311_scl_pin = sclPin;
  mimo_i2s_mic_es8311_addr = address;
  mimo_i2s_mic_es8311_mclk_pin = mclkPin;
  mimo_i2s_mic_es8311_dac_pin = dacDinPin;
  mimo_i2s_mic_es8311_pa_pin = paPin;
  mimo_i2s_mic_es8311_gain_reg = micGainReg;

  bool codecOk = mimo_es8311_begin(address, sdaPin, sclPin, micGainReg, mclkPin >= 0);
  codecOk &= mimo_es8311_config_clock(address, sampleRate, mclkPin >= 0);
  mimo_es8311_set_pa(paPin, true);
  i2s.end();
  delay(20);
  i2s.setPins(bclkPin, lrclkPin, dacDinPin, adcDoutPin, mclkPin);
  bool i2sOk = i2s.begin(I2S_MODE_STD, sampleRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO, I2S_STD_SLOT_BOTH);
  Serial.println((codecOk && i2sOk) ? "[I2S] ES8311 audio codec ready" : "[I2S] ES8311 audio codec begin failed");
  return codecOk && i2sOk;
}

bool mimo_i2s_prepare_es8311_playback(I2SClass &i2s, uint32_t sampleRate, i2s_data_bit_width_t bitWidth, i2s_slot_mode_t slotMode) {
  if (mimo_i2s_mic_mode == 4) {
    (void)bitWidth;
    (void)slotMode;
    return mimo_i2s_begin_k10_audio(i2s, sampleRate);
  }
  if (mimo_i2s_mic_mode != 3 || mimo_i2s_mic_es8311_dac_pin < 0) return true;
  if (mimo_i2s_mic_es8311_sda_pin < 0 || mimo_i2s_mic_es8311_scl_pin < 0 || mimo_i2s_mic_bclk_pin < 0 || mimo_i2s_mic_lrclk_pin < 0) return false;

  bool codecOk = mimo_es8311_begin(mimo_i2s_mic_es8311_addr, mimo_i2s_mic_es8311_sda_pin, mimo_i2s_mic_es8311_scl_pin, mimo_i2s_mic_es8311_gain_reg, mimo_i2s_mic_es8311_mclk_pin >= 0);
  codecOk &= mimo_es8311_config_clock(mimo_i2s_mic_es8311_addr, sampleRate, mimo_i2s_mic_es8311_mclk_pin >= 0);
  mimo_es8311_set_pa(mimo_i2s_mic_es8311_pa_pin, true);
  i2s.end();
  delay(20);
  i2s.setPins(mimo_i2s_mic_bclk_pin, mimo_i2s_mic_lrclk_pin, mimo_i2s_mic_es8311_dac_pin, mimo_i2s_mic_sd_pin, mimo_i2s_mic_es8311_mclk_pin);
  bool i2sOk = i2s.begin(I2S_MODE_STD, sampleRate, bitWidth, slotMode, I2S_STD_SLOT_BOTH);
  Serial.println((codecOk && i2sOk) ? "[I2S] ES8311 playback ready" : "[I2S] ES8311 playback begin failed");
  return codecOk && i2sOk;
}

bool mimo_i2s_restart_microphone(I2SClass &i2s, uint32_t sampleRate) {
  if (mimo_i2s_mic_mode == 4) {
    return mimo_i2s_begin_k10_audio(i2s, sampleRate);
  }

  if (mimo_i2s_mic_mode == 3 && mimo_i2s_mic_es8311_sda_pin >= 0 && mimo_i2s_mic_es8311_scl_pin >= 0 && mimo_i2s_mic_bclk_pin >= 0 && mimo_i2s_mic_lrclk_pin >= 0 && mimo_i2s_mic_sd_pin >= 0) {
    if (mimo_i2s_mic_es8311_dac_pin >= 0) {
      return mimo_i2s_begin_es8311_audio(i2s, mimo_i2s_mic_es8311_sda_pin, mimo_i2s_mic_es8311_scl_pin, mimo_i2s_mic_es8311_addr, mimo_i2s_mic_bclk_pin, mimo_i2s_mic_lrclk_pin, mimo_i2s_mic_es8311_dac_pin, mimo_i2s_mic_sd_pin, mimo_i2s_mic_es8311_mclk_pin, sampleRate, mimo_i2s_mic_es8311_gain_reg, mimo_i2s_mic_es8311_pa_pin);
    }
    return mimo_i2s_begin_es8311_microphone(i2s, mimo_i2s_mic_es8311_sda_pin, mimo_i2s_mic_es8311_scl_pin, mimo_i2s_mic_es8311_addr, mimo_i2s_mic_bclk_pin, mimo_i2s_mic_lrclk_pin, mimo_i2s_mic_sd_pin, mimo_i2s_mic_es8311_mclk_pin, sampleRate, mimo_i2s_mic_es8311_gain_reg);
  }

  if (mimo_i2s_mic_mode == 2 && mimo_i2s_mic_pdm_clk_pin >= 0 && mimo_i2s_mic_pdm_din_pin >= 0) {
    return mimo_i2s_begin_pdm_microphone(i2s, mimo_i2s_mic_pdm_clk_pin, mimo_i2s_mic_pdm_din_pin, sampleRate);
  }

  if (mimo_i2s_mic_mode == 1 && mimo_i2s_mic_bclk_pin >= 0 && mimo_i2s_mic_lrclk_pin >= 0 && mimo_i2s_mic_sd_pin >= 0) {
    return mimo_i2s_begin_microphone(i2s, mimo_i2s_mic_bclk_pin, mimo_i2s_mic_lrclk_pin, mimo_i2s_mic_sd_pin, sampleRate);
  }

  Serial.println("[I2S] microphone pins not cached, configure RX only");
  i2s.end();
  delay(20);
  i2s.configureRX(sampleRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO);
  return true;
}

size_t mimo_i2s_record_pcm(I2SClass &i2s, uint8_t* pcmBuf, size_t pcmBytes, float durationSeconds, const char* tag) {
  if (mimo_i2s_mic_mode == 4) {
    (void)i2s;
    return mimo_k10_record_mono_pcm(pcmBuf, pcmBytes, durationSeconds, tag);
  }

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


Arduino.forBlock['mimo_config'] = function(block, generator) {
  var apiKey = generator.valueToCode(block, 'API_KEY', Arduino.ORDER_ATOMIC) || '""';
  var baseUrl = generator.valueToCode(block, 'BASE_URL', Arduino.ORDER_ATOMIC) || '"https://api.xiaomimimo.com/v1"';

  generator.addLibrary('mimo_wifi', '#include <WiFi.h>');
  generator.addLibrary('mimo_http', '#include <HTTPClient.h>');

  generator.addVariable('mimo_api_key', 'String mimo_api_key = ' + apiKey + ';');
  generator.addVariable('mimo_base_url', 'String mimo_base_url = ' + baseUrl + ';');
  generator.addVariable('mimo_system_prompt', 'String mimo_system_prompt = "";');
  generator.addVariable('mimo_last_success', 'bool mimo_last_success = false;');
  generator.addVariable('mimo_last_error', 'String mimo_last_error = "";');
  generator.addVariable('mimo_stream_chunk', 'String mimo_stream_chunk = "";');
  generator.addVariable('mimo_stream_callback', 'void (*mimo_stream_callback)(void) = NULL;');
  generator.addVariable('mimo_history', 'String mimo_history = "";');

  generator.addFunction('mimo_escape_json', String.raw`
String mimo_escape_json(String input) {
  input.replace("\\", "\\\\");
  input.replace("\"", "\\\"");
  input.replace("\n", "\\n");
  input.replace("\r", "\\r");
  return input;
}`);

  generator.addFunction('mimo_simple_request', `
String mimo_simple_request(String model, String message, bool useHistory, String thinkingType) {
  Serial.println("=== 小米MiMo AI调用开始(流式) ===");
  Serial.println("模型: " + model);
  Serial.println("消息: " + message);

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("错误: WiFi未连接");
    mimo_last_success = false;
    mimo_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = mimo_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(60000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("api-key", mimo_api_key);

  String messages = "";
  messages.reserve(mimo_system_prompt.length() + mimo_history.length() + message.length() + 256);
  bool hasAny = false;
  if (mimo_system_prompt.length() > 0) {
    messages += "{\\"role\\":\\"system\\",\\"content\\":\\"" + mimo_escape_json(mimo_system_prompt) + "\\"}";
    hasAny = true;
  }
  if (useHistory && mimo_history.length() > 0) {
    if (hasAny) messages += ",";
    messages += mimo_history;
    hasAny = true;
  }
  if (hasAny) messages += ",";
  messages += "{\\"role\\":\\"user\\",\\"content\\":\\"" + mimo_escape_json(message) + "\\"}";

  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[" + messages + "]";
  requestBody += ",\\"stream\\":true,\\"max_completion_tokens\\":2048";
  requestBody += ",\\"thinking\\":{\\"type\\":\\"" + thinkingType + "\\"}";
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
              Serial.println("流式传输完成");
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
                if (mimo_stream_callback != NULL) {
                  mimo_stream_chunk = content;
                  mimo_stream_callback();
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
      if (useHistory) {
        String safeUser = mimo_escape_json(message);
        String safeAssistant = mimo_escape_json(fullContent);
        if (mimo_history.length() > 0) {
          mimo_history += ",";
        }
        mimo_history += "{\\"role\\":\\"user\\",\\"content\\":\\"" + safeUser + "\\"},{\\"role\\":\\"assistant\\",\\"content\\":\\"" + safeAssistant + "\\"}";
      }
      mimo_last_success = true;
      mimo_last_error = "";
    } else {
      Serial.println("流式解析失败");
      mimo_last_success = false;
      mimo_last_error = "Stream parse error";
    }
  } else {
    String errorResponse = http.getString();
    Serial.println("HTTP错误: " + errorResponse);
    mimo_last_success = false;
    mimo_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  Serial.println("=== 小米MiMo AI调用结束 ===");
  return response;
}`);

  return '';
};


Arduino.forBlock['mimo_i2s_speaker_init'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_spk';
  const bclk = generator.valueToCode(block, 'BCLK', Arduino.ORDER_ATOMIC) || '15';
  const lrclk = generator.valueToCode(block, 'LRCLK', Arduino.ORDER_ATOMIC) || '16';
  const din = generator.valueToCode(block, 'DIN', Arduino.ORDER_ATOMIC) || '7';
  const sampleRate = generator.valueToCode(block, 'SAMPLE_RATE', Arduino.ORDER_ATOMIC) || '24000';
  ensureMimoI2SObject(generator, varName);
  ensureMimoI2SHelpers(generator);
  return 'mimo_i2s_begin_speaker(' + varName + ', ' + bclk + ', ' + lrclk + ', ' + din + ', ' + sampleRate + ');\n';
};

Arduino.forBlock['mimo_k10_audio_init'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_k10';
  const sampleRate = generator.valueToCode(block, 'SAMPLE_RATE', Arduino.ORDER_ATOMIC) || '16000';
  ensureMimoI2SObject(generator, varName);
  ensureMimoI2SHelpers(generator);
  return 'mimo_i2s_begin_k10_audio(' + varName + ', ' + sampleRate + ');\n';
};

Arduino.forBlock['mimo_i2s_mic_init'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_mic';
  const bclk = generator.valueToCode(block, 'BCLK', Arduino.ORDER_ATOMIC) || '5';
  const lrclk = generator.valueToCode(block, 'LRCLK', Arduino.ORDER_ATOMIC) || '4';
  const sd = generator.valueToCode(block, 'SD', Arduino.ORDER_ATOMIC) || '6';
  const sampleRate = generator.valueToCode(block, 'SAMPLE_RATE', Arduino.ORDER_ATOMIC) || '16000';
  ensureMimoI2SObject(generator, varName);
  ensureMimoI2SHelpers(generator);
  return 'mimo_i2s_begin_microphone(' + varName + ', ' + bclk + ', ' + lrclk + ', ' + sd + ', ' + sampleRate + ');\n';
};

Arduino.forBlock['mimo_pdm_mic_init'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_mic';
  const clk = generator.valueToCode(block, 'CLK', Arduino.ORDER_ATOMIC) || '42';
  const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '41';
  const sampleRate = generator.valueToCode(block, 'SAMPLE_RATE', Arduino.ORDER_ATOMIC) || '16000';
  ensureMimoI2SObject(generator, varName);
  ensureMimoI2SHelpers(generator);
  return 'mimo_i2s_begin_pdm_microphone(' + varName + ', ' + clk + ', ' + data + ', ' + sampleRate + ');\n';
};

Arduino.forBlock['mimo_es8311_mic_init'] = function(block, generator) {
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
  ensureMimoI2SObject(generator, varName);
  ensureMimoI2SHelpers(generator);
  return 'mimo_i2s_begin_es8311_microphone(' + varName + ', ' + sda + ', ' + scl + ', (uint8_t)(' + address + '), ' + bclk + ', ' + lrclk + ', ' + sdout + ', ' + mclk + ', ' + sampleRate + ', (uint8_t)(' + micGain + '));\n';
};

Arduino.forBlock['mimo_es8311_audio_init'] = function(block, generator) {
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
  ensureMimoI2SObject(generator, varName);
  ensureMimoI2SHelpers(generator);
  return 'mimo_i2s_begin_es8311_audio(' + varName + ', ' + sda + ', ' + scl + ', (uint8_t)(' + address + '), ' + bclk + ', ' + lrclk + ', ' + dacDin + ', ' + adcDout + ', ' + mclk + ', ' + sampleRate + ', (uint8_t)(' + micGain + '), ' + paEn + ');\n';
};

Arduino.forBlock['mimo_i2s_prompt_tone'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_spk';
  const freq = generator.valueToCode(block, 'FREQ', Arduino.ORDER_ATOMIC) || '1000';
  const duration = generator.valueToCode(block, 'DURATION', Arduino.ORDER_ATOMIC) || '300';
  ensureMimoI2SObject(generator, varName);
  ensureMimoPlaybackHelpers(generator);
  return 'mimo_play_prompt_tone(' + varName + ', ' + freq + ', ' + duration + ');\n';
};

Arduino.forBlock['mimo_chat'] = function(block, generator) {
  var message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  var model = block.getFieldValue('MODEL');
  var thinking = block.getFieldValue('THINKING') || 'disabled';

  var code = 'mimo_simple_request("' + model + '", ' + message + ', false, "' + thinking + '")';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_chat_with_history'] = function(block, generator) {
  var message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  var model = block.getFieldValue('MODEL');
  var thinking = block.getFieldValue('THINKING') || 'disabled';

  var code = 'mimo_simple_request("' + model + '", ' + message + ', true, "' + thinking + '")';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_clear_history'] = function() {
  return 'mimo_history = "";\n';
};

Arduino.forBlock['mimo_set_system_prompt'] = function(block, generator) {
  var systemPrompt = generator.valueToCode(block, 'SYSTEM_PROMPT', Arduino.ORDER_ATOMIC) || '""';
  return 'mimo_system_prompt = ' + systemPrompt + ';\n';
};

Arduino.forBlock['mimo_image_understand_url'] = function(block, generator) {
  var imageUrl = generator.valueToCode(block, 'IMAGE_URL', Arduino.ORDER_ATOMIC) || '""';
  var message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  var model = block.getFieldValue('MODEL') || 'mimo-v2.5';

  generator.addFunction('mimo_image_url_request', `
String mimo_image_url_request(String imageUrl, String message, String model) {
  Serial.println("=== 小米MiMo图片理解开始(URL) ===");

  if (WiFi.status() != WL_CONNECTED) {
    mimo_last_success = false;
    mimo_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = mimo_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(60000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("api-key", mimo_api_key);

  String safeMessage = mimo_escape_json(message);
  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[";
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":[";
  requestBody += "{\\"type\\":\\"image_url\\",\\"image_url\\":{\\"url\\":\\"" + imageUrl + "\\"}},";
  requestBody += "{\\"type\\":\\"text\\",\\"text\\":\\"" + safeMessage + "\\"}";
  requestBody += "]}],\\"stream\\":true,\\"max_completion_tokens\\":2048,\\"thinking\\":{\\"type\\":\\"disabled\\"}}";

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
                Serial.print(content);
                fullContent += content;
                if (mimo_stream_callback != NULL) {
                  mimo_stream_chunk = content;
                  mimo_stream_callback();
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
      mimo_last_success = true;
      mimo_last_error = "";
    } else {
      mimo_last_success = false;
      mimo_last_error = "Stream parse error";
    }
  } else {
    mimo_last_success = false;
    mimo_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  return response;
}`);

  var code = 'mimo_image_url_request(' + imageUrl + ', ' + message + ', "' + model + '")';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_image_understand_base64'] = function(block, generator) {
  var imageBase64 = generator.valueToCode(block, 'IMAGE_BASE64', Arduino.ORDER_ATOMIC) || '""';
  var message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  var model = block.getFieldValue('MODEL') || 'mimo-v2.5';

  generator.addFunction('mimo_image_base64_request', `
String mimo_image_base64_request(String base64Image, String message, String model) {
  Serial.println("=== 小米MiMo图片理解开始(Base64) ===");

  if (WiFi.status() != WL_CONNECTED) {
    mimo_last_success = false;
    mimo_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = mimo_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(60000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("api-key", mimo_api_key);

  String safeMessage = mimo_escape_json(message);
  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[";
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":[";
  requestBody += "{\\"type\\":\\"image_url\\",\\"image_url\\":{\\"url\\":\\"data:image/jpeg;base64," + base64Image + "\\"}},";
  requestBody += "{\\"type\\":\\"text\\",\\"text\\":\\"" + safeMessage + "\\"}";
  requestBody += "]}],\\"stream\\":true,\\"max_completion_tokens\\":2048,\\"thinking\\":{\\"type\\":\\"disabled\\"}}";

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
                Serial.print(content);
                fullContent += content;
                if (mimo_stream_callback != NULL) {
                  mimo_stream_chunk = content;
                  mimo_stream_callback();
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
      mimo_last_success = true;
      mimo_last_error = "";
    } else {
      mimo_last_success = false;
      mimo_last_error = "Stream parse error";
    }
  } else {
    mimo_last_success = false;
    mimo_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  return response;
}`);

  var code = 'mimo_image_base64_request(' + imageBase64 + ', ' + message + ', "' + model + '")';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_image_understand_capture'] = function(block, generator) {
  var message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  var model = block.getFieldValue('MODEL') || 'mimo-v2.5';

  generator.addLibrary('mimo_wifi_client_secure', '#include <WiFiClientSecure.h>');
  generator.addLibrary('mimo_wifi_client', '#include <WiFiClient.h>');
  generator.addLibrary('mimo_esp_camera', '#include <esp_camera.h>');

  generator.addFunction('mimo_parse_base_url', `
bool mimo_parse_base_url(String baseUrl, bool &isHttps, String &host, uint16_t &port, String &basePath) {
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

  generator.addFunction('mimo_base64_length', `
size_t mimo_base64_length(size_t inputLen) {
  return ((inputLen + 2) / 3) * 4;
}`);

  generator.addFunction('mimo_base64_write', `
void mimo_base64_write(Client &out, const uint8_t* data, size_t len) {
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

  generator.addFunction('mimo_image_capture_request', `
String mimo_image_capture_request(String message, String model) {
  Serial.println("=== 小米MiMo图片理解开始(直接拍照) ===");

  if (WiFi.status() != WL_CONNECTED) {
    mimo_last_success = false;
    mimo_last_error = "WiFi not connected";
    return "";
  }

  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb) {
    mimo_last_success = false;
    mimo_last_error = "Camera capture failed";
    return "";
  }

  bool isHttps = true;
  String host = "";
  uint16_t port = 443;
  String basePath = "";
  if (!mimo_parse_base_url(mimo_base_url, isHttps, host, port, basePath)) {
    esp_camera_fb_return(fb);
    mimo_last_success = false;
    mimo_last_error = "Invalid base URL";
    return "";
  }

  String path = basePath;
  if (path.endsWith("/")) path.remove(path.length() - 1);
  path += "/chat/completions";

  String safeMessage = mimo_escape_json(message);
  String jsonPrefix = "{\\\"model\\\":\\\"" + model + "\\\",\\\"messages\\\":[{\\\"role\\\":\\\"user\\\",\\\"content\\\":[{\\\"type\\\":\\\"image_url\\\",\\\"image_url\\\":{\\\"url\\\":\\\"data:image/jpeg;base64,";
  String jsonSuffix = "\\\"}},{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"" + safeMessage + "\\\"}]}],\\\"stream\\\":true,\\\"max_completion_tokens\\\":2048,\\\"thinking\\\":{\\\"type\\\":\\\"disabled\\\"}}";

  size_t base64Len = mimo_base64_length(fb->len);
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
    mimo_last_success = false;
    mimo_last_error = "Connect failed";
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
  client->print("Content-Type: application/json\\r\\n");
  client->print("api-key: ");
  client->print(mimo_api_key);
  client->print("\\r\\n");
  client->print("Content-Length: ");
  client->print(String(contentLen));
  client->print("\\r\\n\\r\\n");

  client->print(jsonPrefix);
  mimo_base64_write(*client, fb->buf, fb->len);
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

  String response = "";
  if (httpCode != 200) {
    mimo_last_success = false;
    mimo_last_error = "HTTP " + String(httpCode);
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
          int contentStart = data.indexOf("\\"content\\":\\"");
          if (contentStart >= 0) {
            contentStart += 11;
            int contentEnd = data.indexOf("\\"", contentStart);
            if (contentEnd > contentStart) {
              String content = data.substring(contentStart, contentEnd);
              Serial.print(content);
              fullContent += content;
              if (mimo_stream_callback != NULL) {
                mimo_stream_chunk = content;
                mimo_stream_callback();
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
    response = fullContent;
    mimo_last_success = true;
    mimo_last_error = "";
  } else {
    mimo_last_success = false;
    mimo_last_error = "Stream parse error";
  }
  return response;
}`);

  var code = 'mimo_image_capture_request(' + message + ', "' + model + '")';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_audio_understand'] = function(block, generator) {
  var audioUrl = generator.valueToCode(block, 'AUDIO_URL', Arduino.ORDER_ATOMIC) || '""';
  var message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  var model = block.getFieldValue('MODEL') || 'mimo-v2.5';

  generator.addFunction('mimo_audio_request', `
String mimo_audio_request(String audioUrl, String message, String model) {
  Serial.println("=== 小米MiMo音频理解开始 ===");
  Serial.println("音频URL: " + audioUrl);

  if (WiFi.status() != WL_CONNECTED) {
    mimo_last_success = false;
    mimo_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = mimo_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(60000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("api-key", mimo_api_key);

  String safeMessage = mimo_escape_json(message);
  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[";
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":[";
  requestBody += "{\\"type\\":\\"input_audio\\",\\"input_audio\\":{\\"data\\":\\"" + audioUrl + "\\"}},";
  requestBody += "{\\"type\\":\\"text\\",\\"text\\":\\"" + safeMessage + "\\"}";
  requestBody += "]}],\\"stream\\":true,\\"max_completion_tokens\\":2048,\\"thinking\\":{\\"type\\":\\"disabled\\"}}";

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
                Serial.print(content);
                fullContent += content;
                if (mimo_stream_callback != NULL) {
                  mimo_stream_chunk = content;
                  mimo_stream_callback();
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
      mimo_last_success = true;
      mimo_last_error = "";
    } else {
      mimo_last_success = false;
      mimo_last_error = "Stream parse error";
    }
  } else {
    mimo_last_success = false;
    mimo_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  return response;
}`);

  var code = 'mimo_audio_request(' + audioUrl + ', ' + message + ', "' + model + '")';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_audio_understand_base64'] = function(block, generator) {
  var audioBase64 = generator.valueToCode(block, 'AUDIO_BASE64', Arduino.ORDER_ATOMIC) || '""';
  var message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  var model = block.getFieldValue('MODEL') || 'mimo-v2.5';

  generator.addFunction('mimo_audio_base64_request', `
String mimo_audio_base64_request(String base64Audio, String message, String model) {
  Serial.println("=== 小米MiMo音频理解开始(Base64) ===");

  if (WiFi.status() != WL_CONNECTED) {
    mimo_last_success = false;
    mimo_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = mimo_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(60000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("api-key", mimo_api_key);

  String safeMessage = mimo_escape_json(message);
  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[";
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":[";
  requestBody += "{\\"type\\":\\"input_audio\\",\\"input_audio\\":{\\"data\\":\\"data:audio/wav;base64," + base64Audio + "\\"}},";
  requestBody += "{\\"type\\":\\"text\\",\\"text\\":\\"" + safeMessage + "\\"}";
  requestBody += "]}],\\"stream\\":true,\\"max_completion_tokens\\":2048,\\"thinking\\":{\\"type\\":\\"disabled\\"}}";

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
                Serial.print(content);
                fullContent += content;
                if (mimo_stream_callback != NULL) {
                  mimo_stream_chunk = content;
                  mimo_stream_callback();
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
      mimo_last_success = true;
      mimo_last_error = "";
    } else {
      mimo_last_success = false;
      mimo_last_error = "Stream parse error";
    }
  } else {
    mimo_last_success = false;
    mimo_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  return response;
}`);

  var code = 'mimo_audio_base64_request(' + audioBase64 + ', ' + message + ', "' + model + '")';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_asr_base64'] = function(block, generator) {
  var audioBase64 = generator.valueToCode(block, 'AUDIO_BASE64', Arduino.ORDER_ATOMIC) || '""';
  var format = block.getFieldValue('FORMAT') || 'wav';
  var language = block.getFieldValue('LANGUAGE') || 'auto';

  ensureMimoAsrBaseHelpers(generator);
  var code = 'mimo_asr_base64_request(' + audioBase64 + ', "' + format + '", "' + language + '")';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_video_understand'] = function(block, generator) {
  var videoUrl = generator.valueToCode(block, 'VIDEO_URL', Arduino.ORDER_ATOMIC) || '""';
  var message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  var fps = block.getFieldValue('FPS');
  var model = block.getFieldValue('MODEL') || 'mimo-v2.5';

  generator.addFunction('mimo_video_request', `
String mimo_video_request(String videoUrl, String message, String fps, String model) {
  Serial.println("=== 小米MiMo视频理解开始 ===");
  Serial.println("视频URL: " + videoUrl);
  Serial.println("帧率: " + fps);

  if (WiFi.status() != WL_CONNECTED) {
    mimo_last_success = false;
    mimo_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = mimo_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(120000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("api-key", mimo_api_key);

  String safeMessage = mimo_escape_json(message);
  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[";
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":[";
  requestBody += "{\\"type\\":\\"video_url\\",\\"video_url\\":{\\"url\\":\\"" + videoUrl + "\\"},\\"fps\\":" + fps + ",\\"media_resolution\\":\\"default\\"},";
  requestBody += "{\\"type\\":\\"text\\",\\"text\\":\\"" + safeMessage + "\\"}";
  requestBody += "]}],\\"stream\\":true,\\"max_completion_tokens\\":2048,\\"thinking\\":{\\"type\\":\\"disabled\\"}}";

  Serial.println("发送视频理解请求...");
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
                if (mimo_stream_callback != NULL) {
                  mimo_stream_chunk = content;
                  mimo_stream_callback();
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
      mimo_last_success = true;
      mimo_last_error = "";
    } else {
      mimo_last_success = false;
      mimo_last_error = "Stream parse error";
    }
  } else {
    mimo_last_success = false;
    mimo_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  return response;
}`);

  var code = 'mimo_video_request(' + videoUrl + ', ' + message + ', "' + fps + '", "' + model + '")';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_video_understand_base64'] = function(block, generator) {
  var videoBase64 = generator.valueToCode(block, 'VIDEO_BASE64', Arduino.ORDER_ATOMIC) || '""';
  var message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  var fps = block.getFieldValue('FPS');
  var model = block.getFieldValue('MODEL') || 'mimo-v2.5';

  generator.addFunction('mimo_video_base64_request', `
String mimo_video_base64_request(String base64Video, String message, String fps, String model) {
  Serial.println("=== 小米MiMo视频理解开始(Base64) ===");

  if (WiFi.status() != WL_CONNECTED) {
    mimo_last_success = false;
    mimo_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = mimo_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(120000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("api-key", mimo_api_key);

  String safeMessage = mimo_escape_json(message);
  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[";
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":[";
  requestBody += "{\\"type\\":\\"video_url\\",\\"video_url\\":{\\"url\\":\\"data:video/mp4;base64," + base64Video + "\\"},\\"fps\\":" + fps + ",\\"media_resolution\\":\\"default\\"},";
  requestBody += "{\\"type\\":\\"text\\",\\"text\\":\\"" + safeMessage + "\\"}";
  requestBody += "]}],\\"stream\\":true,\\"max_completion_tokens\\":2048,\\"thinking\\":{\\"type\\":\\"disabled\\"}}";

  Serial.println("发送视频理解请求...");
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
                if (mimo_stream_callback != NULL) {
                  mimo_stream_chunk = content;
                  mimo_stream_callback();
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
      mimo_last_success = true;
      mimo_last_error = "";
    } else {
      mimo_last_success = false;
      mimo_last_error = "Stream parse error";
    }
  } else {
    mimo_last_success = false;
    mimo_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  return response;
}`);

  var code = 'mimo_video_base64_request(' + videoBase64 + ', ' + message + ', "' + fps + '", "' + model + '")';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_tts'] = function(block, generator) {
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  var voice = block.getFieldValue('VOICE');
  var model = block.getFieldValue('MODEL');

  ensureMimoBaseHelpers(generator);
  ensureMimoTtsHelpers(generator);
  var code = 'mimo_tts_request(' + text + ', "' + voice + '", "' + model + '")';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_tts_with_style'] = function(block, generator) {
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  var voice = block.getFieldValue('VOICE');
  var model = block.getFieldValue('MODEL');
  var style = generator.valueToCode(block, 'STYLE', Arduino.ORDER_ATOMIC) || '""';

  ensureMimoBaseHelpers(generator);
  ensureMimoTtsHelpers(generator);
  var code = 'mimo_tts_with_style_request(' + text + ', "' + voice + '", ' + style + ', "' + model + '")';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_tts_voice_design'] = function(block, generator) {
  var voiceDesc = generator.valueToCode(block, 'VOICE_DESC', Arduino.ORDER_ATOMIC) || '""';
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';

  ensureMimoBaseHelpers(generator);
  ensureMimoTtsHelpers(generator);
  var code = 'mimo_tts_voice_design_request(' + voiceDesc + ', ' + text + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_tts_voice_clone'] = function(block, generator) {
  var voiceBase64 = generator.valueToCode(block, 'VOICE_AUDIO_BASE64', Arduino.ORDER_ATOMIC) || '""';
  var format = block.getFieldValue('FORMAT') || 'wav';
  var style = generator.valueToCode(block, 'STYLE', Arduino.ORDER_ATOMIC) || '""';
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';

  ensureMimoTtsHelpers(generator);
  var code = 'mimo_tts_voice_clone_request(' + voiceBase64 + ', "' + format + '", ' + style + ', ' + text + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_play_tts'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_spk';
  var base64Audio = generator.valueToCode(block, 'BASE64_AUDIO', Arduino.ORDER_ATOMIC) || '""';

  ensureMimoI2SObject(generator, varName);
  ensureMimoPlaybackHelpers(generator);
  return 'mimo_play_base64_audio_to_i2s(' + varName + ', ' + base64Audio + ');\n';
};

Arduino.forBlock['mimo_tts_and_play'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_spk';
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  var voice = block.getFieldValue('VOICE');
  var model = block.getFieldValue('MODEL');

  ensureMimoI2SObject(generator, varName);
  ensureMimoBaseHelpers(generator);
  ensureMimoTtsHelpers(generator);
  ensureMimoPlaybackHelpers(generator);

  var code = '{\n';
  code += '  String _ttsData = mimo_tts_request(' + text + ', "' + voice + '", "' + model + '");\n';
  code += '  if (mimo_last_success && _ttsData.length() > 0) {\n';
  code += '    mimo_play_base64_audio_to_i2s(' + varName + ', _ttsData);\n';
  code += '  }\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['mimo_tts_and_play_with_style'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_spk';
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  var voice = block.getFieldValue('VOICE');
  var model = block.getFieldValue('MODEL');
  var style = generator.valueToCode(block, 'STYLE', Arduino.ORDER_ATOMIC) || '""';

  ensureMimoI2SObject(generator, varName);
  ensureMimoBaseHelpers(generator);
  ensureMimoTtsHelpers(generator);
  ensureMimoPlaybackHelpers(generator);

  var code = '{\n';
  code += '  String _ttsData = mimo_tts_with_style_request(' + text + ', "' + voice + '", ' + style + ', "' + model + '");\n';
  code += '  if (mimo_last_success && _ttsData.length() > 0) {\n';
  code += '    mimo_play_base64_audio_to_i2s(' + varName + ', _ttsData);\n';
  code += '  }\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['mimo_tts_and_play_voice_design'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_spk';
  var voiceDesc = generator.valueToCode(block, 'VOICE_DESC', Arduino.ORDER_ATOMIC) || '""';
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';

  ensureMimoI2SObject(generator, varName);
  ensureMimoBaseHelpers(generator);
  ensureMimoTtsHelpers(generator);
  ensureMimoPlaybackHelpers(generator);

  var code = '{\n';
  code += '  String _ttsData = mimo_tts_voice_design_request(' + voiceDesc + ', ' + text + ');\n';
  code += '  if (mimo_last_success && _ttsData.length() > 0) {\n';
  code += '    mimo_play_base64_audio_to_i2s(' + varName + ', _ttsData);\n';
  code += '  }\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['mimo_tts_and_play_voice_clone'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_spk';
  var voiceBase64 = generator.valueToCode(block, 'VOICE_AUDIO_BASE64', Arduino.ORDER_ATOMIC) || '""';
  var format = block.getFieldValue('FORMAT') || 'wav';
  var style = generator.valueToCode(block, 'STYLE', Arduino.ORDER_ATOMIC) || '""';
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';

  ensureMimoI2SObject(generator, varName);
  ensureMimoTtsHelpers(generator);
  ensureMimoPlaybackHelpers(generator);

  var code = '{\n';
  code += '  String _ttsData = mimo_tts_voice_clone_request(' + voiceBase64 + ', "' + format + '", ' + style + ', ' + text + ');\n';
  code += '  if (mimo_last_success && _ttsData.length() > 0) {\n';
  code += '    mimo_play_base64_audio_to_i2s(' + varName + ', _ttsData);\n';
  code += '  }\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['mimo_tts_stream_play'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_spk';
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  var voice = block.getFieldValue('VOICE');

  ensureMimoI2SObject(generator, varName);
  ensureMimoBaseHelpers(generator);
  ensureMimoTtsStreamHelpers(generator);
  return 'mimo_tts_stream_play_impl(' + varName + ', ' + text + ', "' + voice + '");\n';
};

Arduino.forBlock['mimo_tts_stream_play_with_style'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s_spk';
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  var voice = block.getFieldValue('VOICE');
  var style = generator.valueToCode(block, 'STYLE', Arduino.ORDER_ATOMIC) || '""';

  ensureMimoI2SObject(generator, varName);
  ensureMimoBaseHelpers(generator);
  ensureMimoTtsStreamHelpers(generator);
  return 'mimo_tts_stream_play_with_style_impl(' + varName + ', ' + text + ', "' + voice + '", ' + style + ');\n';
};

function ensureMimoRecordTextHelpers(generator) {
  generator.addFunction('mimo_voice_chat_build_wav_header', String.raw`
void mimo_voice_chat_build_wav_header(uint8_t* header, uint32_t dataSize, uint32_t sampleRate) {
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

  generator.addFunction('mimo_i2s_record_text_request', String.raw`
String mimo_i2s_record_text_request(I2SClass &i2sMic, String model, String prompt, float duration) {
  Serial.println("[MIMO-REC-TEXT] begin");
  mimo_last_success = false;
  mimo_last_error = "";

  if (WiFi.status() != WL_CONNECTED) {
    mimo_last_error = "WiFi not connected";
    return "";
  }

  uint32_t sampleRate = 16000;
  size_t totalSamples = (size_t)(sampleRate * duration);
  size_t pcmBytes = totalSamples * sizeof(int16_t);
  size_t wavBytes = 44 + pcmBytes;
  uint8_t* wavBuf = (uint8_t*)mimo_audio_alloc_buffer(wavBytes, "record-text-wav");
  if (!wavBuf) {
    mimo_last_error = "WAV alloc failed";
    return "";
  }

  if (!mimo_i2s_restart_microphone(i2sMic, sampleRate)) {
    mimo_last_error = "Microphone begin failed";
    free(wavBuf);
    return "";
  }

  Serial.println("[MIMO-REC-TEXT] record " + String(duration) + "s");
  size_t bytesRead = mimo_i2s_record_pcm(i2sMic, wavBuf + 44, pcmBytes, duration, "MIMO-REC-TEXT");
  if (bytesRead == 0) {
    mimo_last_error = "No microphone audio captured";
    free(wavBuf);
    i2sMic.end();
    return "";
  }

  mimo_voice_chat_build_wav_header(wavBuf, (uint32_t)bytesRead, sampleRate);
  wavBytes = 44 + bytesRead;
  i2sMic.end();
  Serial.println("[MIMO-REC-TEXT] wav bytes: " + String(wavBytes));

  String finalPrompt = prompt.length() > 0 ? prompt : String("\u8bf7\u53ea\u628a\u97f3\u9891\u5185\u5bb9\u8f6c\u5199\u6210\u6587\u5b57\uff0c\u4e0d\u8981\u56de\u7b54\u3001\u89e3\u91ca\u6216\u8865\u5145\u3002");
  String safeSystem = mimo_escape_json(mimo_system_prompt);
  String safePrompt = mimo_escape_json(finalPrompt);
  String requestPrefix = "{\"model\":\"" + model + "\",\"messages\":[";
  if (mimo_system_prompt.length() > 0) {
    requestPrefix += "{\"role\":\"system\",\"content\":\"" + safeSystem + "\"},";
  }
  requestPrefix += "{\"role\":\"user\",\"content\":[{\"type\":\"input_audio\",\"input_audio\":{\"data\":\"data:audio/wav;base64,";
  String requestSuffix = "\"}},{\"type\":\"text\",\"text\":\"" + safePrompt + "\"}]}],\"stream\":true,\"max_completion_tokens\":2048,\"thinking\":{\"type\":\"disabled\"}}";

  MimoBase64JsonStream requestStream(requestPrefix, wavBuf, wavBytes, requestSuffix);
  HTTPClient http;
  String url = mimo_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(180000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "text/event-stream");
  http.addHeader("api-key", mimo_api_key);

  Serial.println("[MIMO-REC-TEXT] request bytes: " + String(requestStream.contentLength()));
  int httpResponseCode = http.sendRequest("POST", &requestStream, requestStream.contentLength());
  free(wavBuf);
  Serial.println("[MIMO-REC-TEXT] HTTP: " + String(httpResponseCode));

  if (httpResponseCode != 200) {
    String errBody = http.getString();
    if (errBody.length() > 240) errBody = errBody.substring(0, 240);
    mimo_last_error = "HTTP " + String(httpResponseCode) + ": " + errBody;
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
        mimo_last_error = "Stream timeout";
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
            String content = mimo_unescape_json_string(data.substring(contentStart, contentEnd));
            fullText += content;
            Serial.print(content);
            if (mimo_stream_callback != NULL) {
              mimo_stream_chunk = content;
              mimo_stream_callback();
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

  mimo_last_success = fullText.length() > 0;
  mimo_last_error = fullText.length() > 0 ? "" : (mimo_last_error.length() > 0 ? mimo_last_error : "No text response");
  Serial.println("[MIMO-REC-TEXT] text: " + fullText);
  return fullText;
}`);

}

Arduino.forBlock['mimo_i2s_record_text'] = function(block, generator) {
  var micField = block.getField('MIC_VAR');
  var micName = micField ? micField.getText() : 'i2s_mic';
  const duration = generator.valueToCode(block, 'DURATION', Arduino.ORDER_ATOMIC) || '3';
  const model = block.getFieldValue('MODEL');
  const prompt = generator.valueToCode(block, 'PROMPT', Arduino.ORDER_ATOMIC) || '""';

  ensureMimoI2SObject(generator, micName);
  ensureMimoI2SHelpers(generator);
  ensureMimoUploadHelpers(generator);

  ensureMimoRecordTextHelpers(generator);
  const code = `mimo_i2s_record_text_request(${micName}, "${model}", ${prompt}, ${duration})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_i2s_asr'] = function(block, generator) {
  var micField = block.getField('MIC_VAR');
  var micName = micField ? micField.getText() : 'i2s_mic';
  const duration = generator.valueToCode(block, 'DURATION', Arduino.ORDER_ATOMIC) || '3';
  const language = block.getFieldValue('LANGUAGE') || 'auto';

  ensureMimoI2SObject(generator, micName);
  ensureMimoI2SHelpers(generator);
  ensureMimoI2SAsrHelpers(generator);
  const code = 'mimo_i2s_asr_request(' + micName + ', ' + duration + ', "' + language + '")';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_voice_chat'] = function(block, generator) {
  var micField = block.getField('MIC_VAR');
  var spkField = block.getField('SPK_VAR');
  var micName = micField ? micField.getText() : 'i2s_mic';
  var spkName = spkField ? spkField.getText() : 'i2s_spk';
  const duration = generator.valueToCode(block, 'DURATION', Arduino.ORDER_ATOMIC) || '3';
  const model = block.getFieldValue('MODEL');
  const voice = block.getFieldValue('VOICE');
  const ttsModel = block.getFieldValue('TTS_MODEL');
  const beep = block.getFieldValue('BEEP') !== 'FALSE';
  const prompt = generator.valueToCode(block, 'PROMPT', Arduino.ORDER_ATOMIC) || '""';

  ensureMimoI2SObject(generator, micName);
  ensureMimoI2SObject(generator, spkName);
  ensureMimoI2SHelpers(generator);
  ensureMimoUploadHelpers(generator);
  ensureMimoTtsHelpers(generator);
  ensureMimoPlaybackHelpers(generator);
  ensureMimoRecordTextHelpers(generator);

  generator.addFunction('mimo_voice_chat_request', String.raw`
void mimo_voice_chat_request(I2SClass &i2sMic, I2SClass &i2sSpk, String model, String voice, String ttsModel, String prompt, float duration, bool beep) {
  Serial.println("[MIMO-VOICE-CHAT] begin");
  String finalPrompt = prompt.length() > 0 ? prompt : String("\u8bf7\u7528\u7b80\u77ed\u53cb\u597d\u7684\u65b9\u5f0f\u56de\u7b54\u97f3\u9891\u4e2d\u7684\u95ee\u9898\uff0c\u9002\u5408\u8bed\u97f3\u64ad\u62a5\u3002");
  if (beep) mimo_play_prompt_tone(i2sSpk, 1000, 50);
  String answer = mimo_i2s_record_text_request(i2sMic, model, finalPrompt, duration);
  if (beep) mimo_play_prompt_tone(i2sSpk, 800, 50);

  if (!mimo_last_success || answer.length() == 0) {
    Serial.println("[MIMO-VOICE-CHAT] record/text failed: " + mimo_last_error);
    return;
  }

  String audio = mimo_tts_request(answer, voice, ttsModel);
  if (mimo_last_success && audio.length() > 0) {
    mimo_play_base64_audio_to_i2s(i2sSpk, audio);
  } else {
    Serial.println("[MIMO-VOICE-CHAT] tts failed: " + mimo_last_error);
  }
}`);

  return 'mimo_voice_chat_request(' + micName + ', ' + spkName + ', "' + model + '", "' + voice + '", "' + ttsModel + '", ' + prompt + ', ' + duration + ', ' + (beep ? 'true' : 'false') + ');\n';
};

Arduino.forBlock['mimo_get_response_status'] = function() {
  return ['mimo_last_success', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['mimo_get_error_message'] = function() {
  return ['mimo_last_error', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['mimo_set_stream_callback'] = function(block, generator) {
  var callback = generator.statementToCode(block, 'CALLBACK');
  
  generator.addFunction('mimo_user_stream_callback', `
void mimo_user_stream_callback() {
${callback}}`);
  
  return 'mimo_stream_callback = mimo_user_stream_callback;\n';
};

Arduino.forBlock['mimo_get_stream_chunk'] = function() {
  return ['mimo_stream_chunk', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['mimo_clear_stream_callback'] = function() {
  return 'mimo_stream_callback = NULL;\n';
};
