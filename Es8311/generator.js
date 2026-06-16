/**
 * ES8311 Audio Codec Library Generator
 * ESP32 I2S audio record/playback with optional Qwen Omni cloud audio chat.
 */
'use strict';

function ensureEs8311QwenState(generator) {
  generator.addVariable('es8311_qwen_api_key', 'String es8311_qwen_api_key = "";');
  generator.addVariable('es8311_qwen_base_url', 'String es8311_qwen_base_url = "";');
  generator.addVariable('es8311_qwen_last_text', 'String es8311_qwen_last_text = "";');
  generator.addVariable('es8311_qwen_last_success', 'bool es8311_qwen_last_success = false;');
  generator.addVariable('es8311_qwen_last_error', 'String es8311_qwen_last_error = "";');
  generator.addVariable('es8311_qwen_stop_requested', 'bool es8311_qwen_stop_requested = false;');
}

function ensureEs8311QwenSupport(generator) {
  ensureEs8311QwenState(generator);

  generator.addLibrary('WiFiClientSecure', '#include <WiFiClientSecure.h>');
  generator.addLibrary('ArduinoJson', '#include <ArduinoJson.h>');
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');
  generator.addLibrary('driver_i2s', '#include "driver/i2s.h"');
  generator.addLibrary('ES8311Audio', '#include <ES8311Audio.h>');

  generator.addFunction('es8311_qwen_json_escape', String.raw`
String es8311_qwen_json_escape(String input) {
  input.replace("\\", "\\\\");
  input.replace("\"", "\\\"");
  input.replace("\n", "\\n");
  input.replace("\r", "\\r");
  input.replace("\t", "\\t");
  return input;
}`);

  generator.addFunction('es8311_qwen_parse_base_url', String.raw`
bool es8311_qwen_parse_base_url(String baseUrl, String &host, uint16_t &port, String &basePath) {
  host = "";
  port = 443;
  basePath = "";

  if (!baseUrl.startsWith("https://")) {
    return false;
  }

  baseUrl = baseUrl.substring(8);
  int slashIndex = baseUrl.indexOf('/');
  String hostPort = slashIndex >= 0 ? baseUrl.substring(0, slashIndex) : baseUrl;
  basePath = slashIndex >= 0 ? baseUrl.substring(slashIndex) : "";

  int colonIndex = hostPort.indexOf(':');
  if (colonIndex >= 0) {
    host = hostPort.substring(0, colonIndex);
    port = (uint16_t)hostPort.substring(colonIndex + 1).toInt();
  } else {
    host = hostPort;
  }

  return host.length() > 0 && port > 0;
}`);

  generator.addFunction('es8311_qwen_base64_encoded_length', String.raw`
size_t es8311_qwen_base64_encoded_length(size_t inputLength) {
  return ((inputLength + 2) / 3) * 4;
}`);

  generator.addFunction('es8311_qwen_base64_emit_block', String.raw`
void es8311_qwen_base64_emit_block(Client &out, const uint8_t* data, size_t len, char* outBuf, size_t &outPos) {
  static const char* table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  uint32_t block = 0;
  block |= ((uint32_t)data[0]) << 16;
  if (len > 1) block |= ((uint32_t)data[1]) << 8;
  if (len > 2) block |= (uint32_t)data[2];

  if (outPos + 4 > 384) {
    out.write((const uint8_t*)outBuf, outPos);
    outPos = 0;
  }

  outBuf[outPos++] = table[(block >> 18) & 0x3F];
  outBuf[outPos++] = table[(block >> 12) & 0x3F];
  outBuf[outPos++] = len > 1 ? table[(block >> 6) & 0x3F] : '=';
  outBuf[outPos++] = len > 2 ? table[block & 0x3F] : '=';
}`);

  generator.addFunction('es8311_qwen_base64_stream_write', String.raw`
void es8311_qwen_base64_stream_write(Client &out, const uint8_t* data, size_t len, uint8_t* tail, size_t &tailLen) {
  char outBuf[384];
  size_t outPos = 0;

  if (tailLen > 0) {
    while (tailLen < 3 && len > 0) {
      tail[tailLen++] = *data++;
      len--;
    }
    if (tailLen == 3) {
      es8311_qwen_base64_emit_block(out, tail, 3, outBuf, outPos);
      tailLen = 0;
    }
  }

  while (len >= 3) {
    es8311_qwen_base64_emit_block(out, data, 3, outBuf, outPos);
    data += 3;
    len -= 3;
  }

  while (len > 0) {
    tail[tailLen++] = *data++;
    len--;
  }

  if (outPos > 0) {
    out.write((const uint8_t*)outBuf, outPos);
  }
}`);

  generator.addFunction('es8311_qwen_base64_stream_flush', String.raw`
void es8311_qwen_base64_stream_flush(Client &out, uint8_t* tail, size_t tailLen) {
  if (tailLen == 0) return;

  char outBuf[4];
  size_t outPos = 0;
  es8311_qwen_base64_emit_block(out, tail, tailLen, outBuf, outPos);
  if (outPos > 0) {
    out.write((const uint8_t*)outBuf, outPos);
  }
}`);

  generator.addFunction('es8311_qwen_write_u16_le', String.raw`
void es8311_qwen_write_u16_le(uint8_t* dest, uint16_t value) {
  dest[0] = (uint8_t)(value & 0xFF);
  dest[1] = (uint8_t)((value >> 8) & 0xFF);
}`);

  generator.addFunction('es8311_qwen_write_u32_le', String.raw`
void es8311_qwen_write_u32_le(uint8_t* dest, uint32_t value) {
  dest[0] = (uint8_t)(value & 0xFF);
  dest[1] = (uint8_t)((value >> 8) & 0xFF);
  dest[2] = (uint8_t)((value >> 16) & 0xFF);
  dest[3] = (uint8_t)((value >> 24) & 0xFF);
}`);

  generator.addFunction('es8311_qwen_build_wav_header', String.raw`
void es8311_qwen_build_wav_header(uint8_t* header, uint32_t dataSize, uint32_t sampleRate) {
  memset(header, 0, 44);
  memcpy(header, "RIFF", 4);
  es8311_qwen_write_u32_le(header + 4, dataSize + 36);
  memcpy(header + 8, "WAVE", 4);
  memcpy(header + 12, "fmt ", 4);
  es8311_qwen_write_u32_le(header + 16, 16);
  es8311_qwen_write_u16_le(header + 20, 1);
  es8311_qwen_write_u16_le(header + 22, 1);
  es8311_qwen_write_u32_le(header + 24, sampleRate);
  es8311_qwen_write_u32_le(header + 28, sampleRate * 2);
  es8311_qwen_write_u16_le(header + 32, 2);
  es8311_qwen_write_u16_le(header + 34, 16);
  memcpy(header + 36, "data", 4);
  es8311_qwen_write_u32_le(header + 40, dataSize);
}`);

  generator.addFunction('es8311_qwen_write_wav_as_base64', String.raw`
bool es8311_qwen_write_wav_as_base64(Client &out, ES8311Audio &audio) {
  int16_t* pcmBuffer = audio.getBuffer();
  size_t pcmBytes = audio.getBufferSize();
  if (pcmBuffer == nullptr || pcmBytes == 0) {
    return false;
  }

  uint8_t wavHeader[44];
  uint8_t tail[3] = {0, 0, 0};
  size_t tailLen = 0;
  const uint8_t* pcmBytesPtr = (const uint8_t*)pcmBuffer;
  size_t remaining = pcmBytes;

  es8311_qwen_build_wav_header(wavHeader, (uint32_t)pcmBytes, 16000);
  es8311_qwen_base64_stream_write(out, wavHeader, sizeof(wavHeader), tail, tailLen);

  while (remaining > 0) {
    size_t chunk = remaining > 2048 ? 2048 : remaining;
    es8311_qwen_base64_stream_write(out, pcmBytesPtr, chunk, tail, tailLen);
    pcmBytesPtr += chunk;
    remaining -= chunk;
  }

  es8311_qwen_base64_stream_flush(out, tail, tailLen);
  return true;
}`);

  generator.addFunction('es8311_qwen_play_audio_chunk', String.raw`
bool es8311_qwen_play_audio_chunk(ES8311Audio &audio, const char* base64Data) {
  static uint8_t* decodedBuffer = nullptr;
  static size_t decodedCapacity = 0;

  if (base64Data == nullptr || base64Data[0] == '\0') {
    return true;
  }

  size_t inputLength = strlen(base64Data);
  size_t requiredLength = ((inputLength + 3) / 4) * 3 + 4;
  if (requiredLength > decodedCapacity) {
    uint8_t* newBuffer = (uint8_t*)realloc(decodedBuffer, requiredLength);
    if (newBuffer == nullptr) {
      return false;
    }
    decodedBuffer = newBuffer;
    decodedCapacity = requiredLength;
  }

  size_t outputLength = 0;
  int decodeResult = mbedtls_base64_decode(
    decodedBuffer,
    decodedCapacity,
    &outputLength,
    (const unsigned char*)base64Data,
    inputLength
  );

  if (decodeResult != 0 || outputLength == 0) {
    return false;
  }

  size_t sampleCount = outputLength / sizeof(int16_t);
  if (sampleCount == 0) {
    return true;
  }

  // Reuse the shared streaming engine: Qwen Omni emits 24kHz PCM, resampled to 16kHz inside streamWrite.
  return audio.streamWrite((const int16_t*)decodedBuffer, sampleCount);
}`);

  generator.addFunction('es8311_qwen_audio_chat_request', String.raw`
String es8311_qwen_audio_chat_request(ES8311Audio &audio, String model, String prompt, String voice, bool backgroundPlay) {
  es8311_qwen_last_success = false;
  es8311_qwen_last_error = "";
  es8311_qwen_last_text = "";
  es8311_qwen_stop_requested = false;

  if (es8311_qwen_api_key.length() == 0) {
    es8311_qwen_last_error = "Missing API key";
    return "";
  }

  if (es8311_qwen_base_url.length() == 0) {
    es8311_qwen_last_error = "Missing base URL";
    return "";
  }

  if (audio.getBuffer() == nullptr || audio.getBufferSize() == 0) {
    es8311_qwen_last_error = "No recording";
    return "";
  }

  String host = "";
  String basePath = "";
  uint16_t port = 443;
  if (!es8311_qwen_parse_base_url(es8311_qwen_base_url, host, port, basePath)) {
    es8311_qwen_last_error = "Invalid base URL";
    return "";
  }

  String path = basePath;
  if (path.endsWith("/")) {
    path.remove(path.length() - 1);
  }
  path += "/chat/completions";
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  size_t pcmBytes = audio.getBufferSize();
  size_t totalWavBytes = 44 + pcmBytes;
  size_t base64Length = es8311_qwen_base64_encoded_length(totalWavBytes);
  String safePrompt = es8311_qwen_json_escape(prompt);

  String jsonPrefix = "{\"model\":\"" + model + "\",\"messages\":[{\"role\":\"user\",\"content\":[{\"type\":\"input_audio\",\"input_audio\":{\"data\":\"data:;base64,";
  String jsonSuffix = "\",\"format\":\"wav\"}},{\"type\":\"text\",\"text\":\"" + safePrompt + "\"}]}],\"modalities\":[\"text\",\"audio\"],\"audio\":{\"voice\":\"" + voice + "\",\"format\":\"wav\"},\"stream\":true,\"stream_options\":{\"include_usage\":true}}";
  size_t contentLength = (size_t)jsonPrefix.length() + base64Length + (size_t)jsonSuffix.length();

  WiFiClientSecure client;
  client.setInsecure();
  client.setTimeout(60000);

  if (!client.connect(host.c_str(), port)) {
    es8311_qwen_last_error = "Connect failed";
    return "";
  }

  client.print("POST ");
  client.print(path);
  client.print(" HTTP/1.1\r\n");
  client.print("Host: ");
  client.print(host);
  client.print("\r\n");
  client.print("User-Agent: Aily-ES8311\r\n");
  client.print("Connection: close\r\n");
  client.print("Accept: text/event-stream\r\n");
  client.print("Cache-Control: no-cache\r\n");
  client.print("Content-Type: application/json\r\n");
  client.print("Authorization: Bearer ");
  client.print(es8311_qwen_api_key);
  client.print("\r\n");
  client.print("Content-Length: ");
  client.print(String(contentLength));
  client.print("\r\n\r\n");

  client.print(jsonPrefix);
  if (!es8311_qwen_write_wav_as_base64(client, audio)) {
    client.stop();
    es8311_qwen_last_error = "WAV encode failed";
    return "";
  }
  client.print(jsonSuffix);

  String statusLine = client.readStringUntil('\n');
  statusLine.trim();
  int httpCode = 0;
  int firstSpace = statusLine.indexOf(' ');
  if (firstSpace >= 0) {
    int secondSpace = statusLine.indexOf(' ', firstSpace + 1);
    if (secondSpace > firstSpace) {
      httpCode = statusLine.substring(firstSpace + 1, secondSpace).toInt();
    }
  }

  bool isChunked = false;
  while (client.connected()) {
    String headerLine = client.readStringUntil('\n');
    if (headerLine == "\r" || headerLine.length() == 0) {
      break;
    }
    headerLine.toLowerCase();
    if (headerLine.startsWith("transfer-encoding:") && headerLine.indexOf("chunked") >= 0) {
      isChunked = true;
    }
  }

  if (httpCode != 200) {
    String errorBody = client.readString();
    errorBody.trim();
    if (errorBody.length() > 120) {
      errorBody = errorBody.substring(0, 120);
    }
    client.stop();
    es8311_qwen_last_error = errorBody.length() > 0 ? "HTTP " + String(httpCode) + ": " + errorBody : "HTTP " + String(httpCode);
    audio.streamEnd();
    return "";
  }

  audio.streamBegin(24000);

  bool gotResponseChunk = false;
  bool streamDone = false;

  size_t lineCap = 32768;          // grows on demand: Qwen audio delta lines can exceed 100KB
  const size_t LINE_CAP_MAX = 2097152;
  char* lineBuf = (char*)malloc(lineCap);
  if (lineBuf == nullptr) {
    client.stop();
    audio.streamEnd();
    es8311_qwen_last_error = "Out of memory";
    return "";
  }
  size_t lineLen = 0;
  bool lineOverflow = false;

  // HTTP chunked transfer decoding state
  long chunkSize = 0;
  long chunkRemaining = 0;
  int chunkState = 0;        // 0=size line, 1=payload, 2=skip CRLF after payload
  bool inChunkExt = false;

  unsigned long lastDataMs = millis();
  static uint8_t readBuf[1024];

  while (!streamDone && (client.connected() || client.available())) {
    if (es8311_qwen_stop_requested) {
      client.stop();
      free(lineBuf);
      es8311_qwen_last_error = "Stopped";
      audio.streamEnd();
      return "";
    }

    int availBytes = client.available();
    if (availBytes <= 0) {
      if (!client.connected()) {
        break;
      }
      if (millis() - lastDataMs > 20000) {
        break;
      }
      delay(1);
      continue;
    }

    int n = client.read(readBuf, availBytes > (int)sizeof(readBuf) ? (int)sizeof(readBuf) : availBytes);
    if (n <= 0) {
      delay(1);
      continue;
    }
    lastDataMs = millis();

    for (int bi = 0; bi < n; bi++) {
      uint8_t byteVal = readBuf[bi];

      // strip HTTP chunked framing so chunk-size headers never corrupt SSE lines
      if (isChunked) {
        if (chunkState == 0) {
          if (byteVal == '\n') {
            if (chunkSize == 0) {
              streamDone = true;
              break;
            }
            chunkRemaining = chunkSize;
            chunkSize = 0;
            inChunkExt = false;
            chunkState = 1;
          } else if (byteVal == ';') {
            inChunkExt = true;
          } else if (!inChunkExt) {
            if (byteVal >= '0' && byteVal <= '9') chunkSize = chunkSize * 16 + (byteVal - '0');
            else if (byteVal >= 'a' && byteVal <= 'f') chunkSize = chunkSize * 16 + (byteVal - 'a' + 10);
            else if (byteVal >= 'A' && byteVal <= 'F') chunkSize = chunkSize * 16 + (byteVal - 'A' + 10);
          }
          continue;
        }
        if (chunkState == 2) {
          if (byteVal == '\n') {
            chunkState = 0;
          }
          continue;
        }
        // chunkState == 1: payload byte, falls through below
        if (--chunkRemaining == 0) {
          chunkState = 2;
        }
      }

      char ch = (char)byteVal;
      if (ch != '\n') {
        if (lineLen >= lineCap - 1 && !lineOverflow) {
          if (lineCap < LINE_CAP_MAX) {
            size_t newCap = lineCap * 2;
            char* newBuf = (char*)realloc(lineBuf, newCap);
            if (newBuf != nullptr) {
              lineBuf = newBuf;
              lineCap = newCap;
            } else {
              lineOverflow = true;
            }
          } else {
            lineOverflow = true;
          }
        }
        if (!lineOverflow) {
          lineBuf[lineLen++] = ch;
        }
        continue;
      }

      // full line assembled
      if (lineOverflow) {
        Serial.println("[ES8311] SSE line too long, dropped");
        lineLen = 0;
        lineOverflow = false;
        continue;
      }
      lineBuf[lineLen] = '\0';
      while (lineLen > 0 && (lineBuf[lineLen - 1] == '\r' || lineBuf[lineLen - 1] == ' ')) {
        lineBuf[--lineLen] = '\0';
      }
      char* linePtr = lineBuf;
      while (*linePtr == ' ') linePtr++;
      bool isDataLine = (strncmp(linePtr, "data:", 5) == 0);
      char* dataPtr = linePtr + 5;
      lineLen = 0;

      if (!isDataLine) {
        continue;
      }
      while (*dataPtr == ' ') dataPtr++;

      if (strcmp(dataPtr, "[DONE]") == 0) {
        streamDone = true;
        break;
      }

      JsonDocument doc;
      DeserializationError jsonError = deserializeJson(doc, dataPtr);
      if (jsonError) {
        Serial.println("[ES8311] SSE parse fail");
        continue;
      }
      JsonArray choices = doc["choices"].as<JsonArray>();
      if (choices.isNull() || choices.size() == 0) {
        continue;
      }
      JsonObject delta = choices[0]["delta"].as<JsonObject>();
      const char* content = delta["content"];
      const char* audioData = delta["audio"]["data"];

      if (content != nullptr && content[0] != '\0') {
        es8311_qwen_last_text += String(content);
        Serial.print(content);
        gotResponseChunk = true;
      }

      if (audioData != nullptr && audioData[0] != '\0') {
        if (!es8311_qwen_play_audio_chunk(audio, audioData)) {
          client.stop();
          free(lineBuf);
          es8311_qwen_last_error = "Audio decode failed";
          audio.streamEnd();
          return "";
        }
        gotResponseChunk = true;
      }
    }
  }

  client.stop();
  free(lineBuf);
  if (backgroundPlay) {
    audio.streamFinishAsync();   // return now; the rest keeps playing in the background
  } else {
    audio.streamEnd();           // block until playback finishes
  }

  if (!gotResponseChunk) {
    es8311_qwen_last_error = "Empty response";
    return "";
  }

  es8311_qwen_last_success = true;
  es8311_qwen_last_error = "";
  return es8311_qwen_last_text;
}`);
}

function ensureEs8311StreamUrlSupport(generator) {
  ensureEs8311QwenState(generator);   // shares the es8311_qwen_stop_requested flag with es8311_stop

  generator.addLibrary('WiFiClient', '#include <WiFiClient.h>');
  generator.addLibrary('WiFiClientSecure', '#include <WiFiClientSecure.h>');
  generator.addLibrary('ES8311Audio', '#include <ES8311Audio.h>');

  generator.addFunction('es8311_stream_play_url', String.raw`
bool es8311_stream_play_url(ES8311Audio &audio, String url, uint32_t srcRate) {
  bool isHttps = url.startsWith("https://");
  bool isHttp = url.startsWith("http://");
  if (!isHttps && !isHttp) {
    return false;
  }

  String rest = url.substring(isHttps ? 8 : 7);
  int slash = rest.indexOf('/');
  String hostPort = slash >= 0 ? rest.substring(0, slash) : rest;
  String path = slash >= 0 ? rest.substring(slash) : "/";
  uint16_t port = isHttps ? 443 : 80;
  int colon = hostPort.indexOf(':');
  String host = hostPort;
  if (colon >= 0) {
    host = hostPort.substring(0, colon);
    port = (uint16_t)hostPort.substring(colon + 1).toInt();
  }

  WiFiClientSecure secureClient;
  WiFiClient plainClient;
  Client* client;
  if (isHttps) {
    secureClient.setInsecure();
    secureClient.setTimeout(15000);
    client = &secureClient;
  } else {
    plainClient.setTimeout(15000);
    client = &plainClient;
  }

  if (!client->connect(host.c_str(), port)) {
    return false;
  }

  client->print("GET ");
  client->print(path);
  client->print(" HTTP/1.0\r\n");   // HTTP/1.0: server must not use chunked framing, keeps the PCM byte stream clean
  client->print("Host: ");
  client->print(host);
  client->print("\r\n");
  client->print("User-Agent: Aily-ES8311\r\n");
  client->print("Connection: close\r\n\r\n");

  String statusLine = client->readStringUntil('\n');
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
    String headerLine = client->readStringUntil('\n');
    if (headerLine == "\r" || headerLine.length() == 0) {
      break;
    }
  }
  if (httpCode != 200) {
    client->stop();
    return false;
  }

  es8311_qwen_stop_requested = false;
  audio.streamBegin(srcRate);

  uint8_t buf[1024];
  size_t bufFill = 0;
  bool headerChecked = false;

  while (client->connected() || client->available()) {
    if (es8311_qwen_stop_requested) {
      break;
    }
    if (!client->available()) {
      if (!client->connected()) {
        break;
      }
      delay(1);
      continue;
    }

    int n = client->read(buf + bufFill, sizeof(buf) - bufFill);
    if (n <= 0) {
      if (!client->connected()) {
        break;
      }
      delay(1);
      continue;
    }
    bufFill += (size_t)n;

    uint8_t* p = buf;
    size_t len = bufFill;

    if (!headerChecked) {
      if (bufFill < 44) {
        continue;   // wait for enough bytes to test for a 44-byte WAV header
      }
      headerChecked = true;
      if (memcmp(buf, "RIFF", 4) == 0 && memcmp(buf + 8, "WAVE", 4) == 0) {
        p = buf + 44;
        len = bufFill - 44;
      }
    }

    size_t usable = len & ~((size_t)1);   // even byte count -> whole int16 samples
    if (usable > 0) {
      audio.streamWrite((const int16_t*)p, usable / sizeof(int16_t));
    }
    size_t leftover = len - usable;       // 0 or 1 dangling byte, carried to next read
    if (leftover) {
      buf[0] = p[usable];
    }
    bufFill = leftover;
  }

  client->stop();
  audio.streamEnd();
  return true;
}`);
}

Arduino.forBlock['es8311_init'] = function(block, generator) {
  const es8311Type = 'ES8311';

  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'audio';
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._varLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, es8311Type);
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'audio';
  const wire = block.getFieldValue('WIRE') || 'Wire';
  const address = block.getFieldValue('ADDRESS') || '0x18';

  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('ES8311Audio', '#include <ES8311Audio.h>');

  registerVariableToBlockly(varName, es8311Type);
  generator.addObject(varName, 'ES8311Audio ' + varName + ';');
  generator.addSetup('wire_' + wire + '_begin', wire + '.begin();');
  ensureSerialBegin('Serial', generator);

  return varName + '.beginI2C(' + wire + ', ' + address + ');\n';
};

Arduino.forBlock['es8311_i2s_config'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'audio';
  const mck = block.getFieldValue('MCK') || '46';
  const bck = block.getFieldValue('BCK') || '39';
  const ws = block.getFieldValue('WS') || '2';
  const dout = block.getFieldValue('DOUT') || '38';
  const din = block.getFieldValue('DIN') || '40';
  const duration = generator.valueToCode(block, 'DURATION', generator.ORDER_ATOMIC) || '5';

  generator.addLibrary('ES8311Audio', '#include <ES8311Audio.h>');

  return varName + '.beginI2S(' + mck + ', ' + bck + ', ' + ws + ', ' + dout + ', ' + din + ', ' + duration + ');\n';
};

Arduino.forBlock['es8311_record'] = function(block) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  return varName + '.record();\n';
};

Arduino.forBlock['es8311_record_start'] = function(block) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  return varName + '.recordStart();\n';
};

Arduino.forBlock['es8311_record_stop'] = function(block) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  return varName + '.recordStop();\n';
};

Arduino.forBlock['es8311_is_recording'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  return [varName + '.isRecording()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['es8311_is_speaking'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  return [varName + '.isStreaming()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['es8311_play'] = function(block) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  return varName + '.play();\n';
};

Arduino.forBlock['es8311_has_recording'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  return [varName + '.hasRecording()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['es8311_set_volume'] = function(block) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  const volume = block.getFieldValue('VOLUME');
  return varName + '.setVolume(' + volume + ');\n';
};

Arduino.forBlock['es8311_set_mic_gain'] = function(block) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  const gain = block.getFieldValue('GAIN') || '0';
  return varName + '.setMicGain(' + gain + ');\n';
};

Arduino.forBlock['es8311_stop'] = function(block, generator) {
  ensureEs8311QwenState(generator);
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  return 'es8311_qwen_stop_requested = true;\n' + varName + '.stop();\n';
};

Arduino.forBlock['es8311_sound_level'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  return [varName + '.getSoundLevel()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['es8311_mute'] = function(block) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  const mode = block.getFieldValue('MODE') || '0';
  return varName + '.mute(' + mode + ');\n';
};

Arduino.forBlock['es8311_play_tone'] = function(block) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  const freq = block.getFieldValue('FREQ');
  const duration = block.getFieldValue('DURATION');
  return varName + '.playTone(' + freq + ', ' + duration + ');\n';
};

Arduino.forBlock['es8311_alc_enable'] = function(block) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  const enable = block.getFieldValue('ENABLE') || 'true';
  return varName + '.alcEnable(' + enable + ');\n';
};

Arduino.forBlock['es8311_record_slot'] = function(block) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  const slot = block.getFieldValue('SLOT') || '0';
  return varName + '.recordSlot(' + slot + ');\n';
};

Arduino.forBlock['es8311_play_slot'] = function(block) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  const slot = block.getFieldValue('SLOT') || '0';
  return varName + '.playSlot(' + slot + ');\n';
};

Arduino.forBlock['es8311_play_loop'] = function(block) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  return varName + '.playLoop();\n';
};

Arduino.forBlock['es8311_stream_begin'] = function(block) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  const rate = block.getFieldValue('RATE') || '16000';
  return varName + '.streamBegin(' + rate + ');\n';
};

Arduino.forBlock['es8311_stream_end'] = function(block) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  return varName + '.streamEnd();\n';
};

Arduino.forBlock['es8311_stream_play_url'] = function(block, generator) {
  ensureEs8311StreamUrlSupport(generator);
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';
  const rate = block.getFieldValue('RATE') || '16000';
  return 'es8311_stream_play_url(' + varName + ', ' + url + ', ' + rate + ');\n';
};

Arduino.forBlock['es8311_qwen_config'] = function(block, generator) {
  ensureEs8311QwenSupport(generator);
  const apiKey = generator.valueToCode(block, 'API_KEY', generator.ORDER_ATOMIC) || '""';
  const baseUrl = generator.valueToCode(block, 'BASE_URL', generator.ORDER_ATOMIC) || '"https://dashscope.aliyuncs.com/compatible-mode/v1"';

  let code = '';
  code += 'es8311_qwen_api_key = ' + apiKey + ';\n';
  code += 'es8311_qwen_base_url = ' + baseUrl + ';\n';
  code += 'es8311_qwen_last_success = false;\n';
  code += 'es8311_qwen_last_error = "";\n';
  code += 'es8311_qwen_last_text = "";\n';
  code += 'es8311_qwen_stop_requested = false;\n';
  return code;
};

Arduino.forBlock['es8311_qwen_audio_chat'] = function(block, generator) {
  ensureEs8311QwenSupport(generator);
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'audio';
  const prompt = generator.valueToCode(block, 'PROMPT', generator.ORDER_ATOMIC) || '"What does this audio say?"';
  const model = block.getFieldValue('MODEL') || 'qwen3.5-omni-plus';
  const voice = block.getFieldValue('VOICE') || 'Tina';
  const playMode = block.getFieldValue('PLAY_MODE') || 'WAIT';
  const background = playMode === 'BACKGROUND' ? 'true' : 'false';
  return 'es8311_qwen_audio_chat_request(' + varName + ', "' + model + '", ' + prompt + ', "' + voice + '", ' + background + ');\n';
};

Arduino.forBlock['es8311_qwen_get_last_text'] = function(block, generator) {
  ensureEs8311QwenState(generator);
  return ['es8311_qwen_last_text', generator.ORDER_ATOMIC];
};

Arduino.forBlock['es8311_qwen_get_last_success'] = function(block, generator) {
  ensureEs8311QwenState(generator);
  return ['es8311_qwen_last_success', generator.ORDER_ATOMIC];
};

Arduino.forBlock['es8311_qwen_get_last_error'] = function(block, generator) {
  ensureEs8311QwenState(generator);
  return ['es8311_qwen_last_error', generator.ORDER_ATOMIC];
};
