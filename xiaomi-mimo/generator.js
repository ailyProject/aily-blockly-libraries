// 小米MiMo AI API库代码生成器

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
String mimo_simple_request(String model, String message, bool useHistory) {
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

Arduino.forBlock['mimo_chat'] = function(block, generator) {
  var message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  var model = block.getFieldValue('MODEL');

  var code = 'mimo_simple_request("' + model + '", ' + message + ', false)';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_chat_with_history'] = function(block, generator) {
  var message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  var model = block.getFieldValue('MODEL');

  var code = 'mimo_simple_request("' + model + '", ' + message + ', true)';
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

  generator.addFunction('mimo_image_url_request', `
String mimo_image_url_request(String imageUrl, String message) {
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
  String requestBody = "{\\"model\\":\\"mimo-v2.5\\",\\"messages\\":[";
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":[";
  requestBody += "{\\"type\\":\\"image_url\\",\\"image_url\\":{\\"url\\":\\"" + imageUrl + "\\"}},";
  requestBody += "{\\"type\\":\\"text\\",\\"text\\":\\"" + safeMessage + "\\"}";
  requestBody += "]}],\\"stream\\":true,\\"max_completion_tokens\\":2048}";

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

  var code = 'mimo_image_url_request(' + imageUrl + ', ' + message + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_image_understand_base64'] = function(block, generator) {
  var imageBase64 = generator.valueToCode(block, 'IMAGE_BASE64', Arduino.ORDER_ATOMIC) || '""';
  var message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';

  generator.addFunction('mimo_image_base64_request', `
String mimo_image_base64_request(String base64Image, String message) {
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
  String requestBody = "{\\"model\\":\\"mimo-v2.5\\",\\"messages\\":[";
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":[";
  requestBody += "{\\"type\\":\\"image_url\\",\\"image_url\\":{\\"url\\":\\"data:image/jpeg;base64," + base64Image + "\\"}},";
  requestBody += "{\\"type\\":\\"text\\",\\"text\\":\\"" + safeMessage + "\\"}";
  requestBody += "]}],\\"stream\\":true,\\"max_completion_tokens\\":2048}";

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

  var code = 'mimo_image_base64_request(' + imageBase64 + ', ' + message + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_image_understand_capture'] = function(block, generator) {
  var message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';

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
String mimo_image_capture_request(String message) {
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
  String jsonPrefix = "{\\\"model\\\":\\\"mimo-v2.5\\\",\\\"messages\\\":[{\\\"role\\\":\\\"user\\\",\\\"content\\\":[{\\\"type\\\":\\\"image_url\\\",\\\"image_url\\\":{\\\"url\\\":\\\"data:image/jpeg;base64,";
  String jsonSuffix = "\\\"}},{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"" + safeMessage + "\\\"}]}],\\\"stream\\\":true,\\\"max_completion_tokens\\\":2048}";

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

  var code = 'mimo_image_capture_request(' + message + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_audio_understand'] = function(block, generator) {
  var audioUrl = generator.valueToCode(block, 'AUDIO_URL', Arduino.ORDER_ATOMIC) || '""';
  var message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';

  generator.addFunction('mimo_audio_request', `
String mimo_audio_request(String audioUrl, String message) {
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
  String requestBody = "{\\"model\\":\\"mimo-v2.5\\",\\"messages\\":[";
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":[";
  requestBody += "{\\"type\\":\\"input_audio\\",\\"input_audio\\":{\\"data\\":\\"" + audioUrl + "\\"}},";
  requestBody += "{\\"type\\":\\"text\\",\\"text\\":\\"" + safeMessage + "\\"}";
  requestBody += "]}],\\"stream\\":true,\\"max_completion_tokens\\":2048}";

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

  var code = 'mimo_audio_request(' + audioUrl + ', ' + message + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_audio_understand_base64'] = function(block, generator) {
  var audioBase64 = generator.valueToCode(block, 'AUDIO_BASE64', Arduino.ORDER_ATOMIC) || '""';
  var message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';

  generator.addFunction('mimo_audio_base64_request', `
String mimo_audio_base64_request(String base64Audio, String message) {
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
  String requestBody = "{\\"model\\":\\"mimo-v2.5\\",\\"messages\\":[";
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":[";
  requestBody += "{\\"type\\":\\"input_audio\\",\\"input_audio\\":{\\"data\\":\\"data:audio/wav;base64," + base64Audio + "\\"}},";
  requestBody += "{\\"type\\":\\"text\\",\\"text\\":\\"" + safeMessage + "\\"}";
  requestBody += "]}],\\"stream\\":true,\\"max_completion_tokens\\":2048}";

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

  var code = 'mimo_audio_base64_request(' + audioBase64 + ', ' + message + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_video_understand'] = function(block, generator) {
  var videoUrl = generator.valueToCode(block, 'VIDEO_URL', Arduino.ORDER_ATOMIC) || '""';
  var message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  var fps = block.getFieldValue('FPS');

  generator.addFunction('mimo_video_request', `
String mimo_video_request(String videoUrl, String message, String fps) {
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
  String requestBody = "{\\"model\\":\\"mimo-v2.5\\",\\"messages\\":[";
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":[";
  requestBody += "{\\"type\\":\\"video_url\\",\\"video_url\\":{\\"url\\":\\"" + videoUrl + "\\"},\\"fps\\":" + fps + ",\\"media_resolution\\":\\"default\\"},";
  requestBody += "{\\"type\\":\\"text\\",\\"text\\":\\"" + safeMessage + "\\"}";
  requestBody += "]}],\\"stream\\":true,\\"max_completion_tokens\\":2048}";

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

  var code = 'mimo_video_request(' + videoUrl + ', ' + message + ', "' + fps + '")';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_video_understand_base64'] = function(block, generator) {
  var videoBase64 = generator.valueToCode(block, 'VIDEO_BASE64', Arduino.ORDER_ATOMIC) || '""';
  var message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  var fps = block.getFieldValue('FPS');

  generator.addFunction('mimo_video_base64_request', `
String mimo_video_base64_request(String base64Video, String message, String fps) {
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
  String requestBody = "{\\"model\\":\\"mimo-v2.5\\",\\"messages\\":[";
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":[";
  requestBody += "{\\"type\\":\\"video_url\\",\\"video_url\\":{\\"url\\":\\"data:video/mp4;base64," + base64Video + "\\"},\\"fps\\":" + fps + ",\\"media_resolution\\":\\"default\\"},";
  requestBody += "{\\"type\\":\\"text\\",\\"text\\":\\"" + safeMessage + "\\"}";
  requestBody += "]}],\\"stream\\":true,\\"max_completion_tokens\\":2048}";

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

  var code = 'mimo_video_base64_request(' + videoBase64 + ', ' + message + ', "' + fps + '")';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_tts'] = function(block, generator) {
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  var voice = block.getFieldValue('VOICE');
  var model = block.getFieldValue('MODEL');

  generator.addFunction('mimo_tts_request', `
String mimo_tts_request(String text, String voice, String model) {
  Serial.println("=== 小米MiMo语音合成开始 ===");
  Serial.println("文本: " + text);
  Serial.println("音色: " + voice);
  Serial.println("模型: " + model);

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
  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[";
  requestBody += "{\\"role\\":\\"assistant\\",\\"content\\":\\"" + safeText + "\\"}";
  requestBody += "],\\"audio\\":{\\"format\\":\\"wav\\",\\"voice\\":\\"" + voice + "\\"}}";

  Serial.println("发送语音合成请求...");
  int httpResponseCode = http.POST(requestBody);
  Serial.println("HTTP响应码: " + String(httpResponseCode));
  String response = "";

  if (httpResponseCode == 200) {
    String payload = http.getString();
    int dataStart = payload.indexOf("\\"data\\":\\"");
    if (dataStart >= 0) {
      dataStart += 8;
      int dataEnd = payload.indexOf("\\"", dataStart);
      if (dataEnd > dataStart) {
        response = payload.substring(dataStart, dataEnd);
        Serial.println("语音合成成功，数据长度: " + String(response.length()));
        mimo_last_success = true;
        mimo_last_error = "";
      } else {
        mimo_last_success = false;
        mimo_last_error = "Parse error";
      }
    } else {
      mimo_last_success = false;
      mimo_last_error = "No audio data";
    }
  } else {
    String errorResponse = http.getString();
    Serial.println("HTTP错误: " + errorResponse);
    mimo_last_success = false;
    mimo_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  Serial.println("=== 小米MiMo语音合成结束 ===");
  return response;
}`);

  var code = 'mimo_tts_request(' + text + ', "' + voice + '", "' + model + '")';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_tts_with_style'] = function(block, generator) {
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  var voice = block.getFieldValue('VOICE');
  var model = block.getFieldValue('MODEL');
  var style = generator.valueToCode(block, 'STYLE', Arduino.ORDER_ATOMIC) || '""';

  generator.addFunction('mimo_tts_with_style_request', `
String mimo_tts_with_style_request(String text, String voice, String style, String model) {
  Serial.println("=== 小米MiMo语音合成开始(带风格) ===");
  Serial.println("文本: " + text);
  Serial.println("音色: " + voice);
  Serial.println("风格: " + style);
  Serial.println("模型: " + model);

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
  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[";
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":\\"" + safeStyle + "\\"},";
  requestBody += "{\\"role\\":\\"assistant\\",\\"content\\":\\"" + safeText + "\\"}";
  requestBody += "],\\"audio\\":{\\"format\\":\\"wav\\",\\"voice\\":\\"" + voice + "\\"}}";

  int httpResponseCode = http.POST(requestBody);
  String response = "";

  if (httpResponseCode == 200) {
    String payload = http.getString();
    int dataStart = payload.indexOf("\\"data\\":\\"");
    if (dataStart >= 0) {
      dataStart += 8;
      int dataEnd = payload.indexOf("\\"", dataStart);
      if (dataEnd > dataStart) {
        response = payload.substring(dataStart, dataEnd);
        mimo_last_success = true;
        mimo_last_error = "";
      } else {
        mimo_last_success = false;
        mimo_last_error = "Parse error";
      }
    } else {
      mimo_last_success = false;
      mimo_last_error = "No audio data";
    }
  } else {
    mimo_last_success = false;
    mimo_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  return response;
}`);

  var code = 'mimo_tts_with_style_request(' + text + ', "' + voice + '", ' + style + ', "' + model + '")';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_tts_voice_design'] = function(block, generator) {
  var voiceDesc = generator.valueToCode(block, 'VOICE_DESC', Arduino.ORDER_ATOMIC) || '""';
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';

  generator.addFunction('mimo_tts_voice_design_request', `
String mimo_tts_voice_design_request(String voiceDesc, String text) {
  Serial.println("=== 小米MiMo音色设计合成开始 ===");
  Serial.println("音色描述: " + voiceDesc);
  Serial.println("文本: " + text);

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
  String requestBody = "{\\"model\\":\\"mimo-v2.5-tts-voicedesign\\",\\"messages\\":[";
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":\\"" + safeDesc + "\\"},";
  requestBody += "{\\"role\\":\\"assistant\\",\\"content\\":\\"" + safeText + "\\"}";
  requestBody += "],\\"audio\\":{\\"format\\":\\"wav\\"}}";

  int httpResponseCode = http.POST(requestBody);
  String response = "";

  if (httpResponseCode == 200) {
    String payload = http.getString();
    int dataStart = payload.indexOf("\\"data\\":\\"");
    if (dataStart >= 0) {
      dataStart += 8;
      int dataEnd = payload.indexOf("\\"", dataStart);
      if (dataEnd > dataStart) {
        response = payload.substring(dataStart, dataEnd);
        mimo_last_success = true;
        mimo_last_error = "";
      } else {
        mimo_last_success = false;
        mimo_last_error = "Parse error";
      }
    } else {
      mimo_last_success = false;
      mimo_last_error = "No audio data";
    }
  } else {
    mimo_last_success = false;
    mimo_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  return response;
}`);

  var code = 'mimo_tts_voice_design_request(' + voiceDesc + ', ' + text + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mimo_play_tts'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s';
  var base64Audio = generator.valueToCode(block, 'BASE64_AUDIO', Arduino.ORDER_ATOMIC) || '""';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addVariable('mimo_last_success', 'bool mimo_last_success = false;');
  generator.addVariable('mimo_last_error', 'String mimo_last_error = "";');

  generator.addFunction('mimo_base64_decode_to_buffer', `
size_t mimo_base64_decode_to_buffer(const char* input, uint8_t* output, size_t maxLen) {
  static const unsigned char d[] = {
    64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,
    64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,62,64,64,64,63,
    52,53,54,55,56,57,58,59,60,61,64,64,64,64,64,64,64, 0, 1, 2, 3, 4, 5, 6,
     7, 8, 9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,64,64,64,64,64,
    64,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,
    49,50,51,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,
    64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,
    64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,
    64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,
    64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,
    64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64
  };
  size_t len = strlen(input);
  size_t outIdx = 0;
  uint32_t accum = 0;
  int bits = 0;
  for (size_t i = 0; i < len && outIdx < maxLen; i++) {
    unsigned char c = (unsigned char)input[i];
    if (c > 127 || d[c] == 64) continue;
    accum = (accum << 6) | d[c];
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output[outIdx++] = (uint8_t)((accum >> bits) & 0xFF);
    }
  }
  return outIdx;
}`);

  generator.addFunction('mimo_play_base64_wav', `
void mimo_play_base64_wav(I2SClass &i2s, String base64Audio) {
  Serial.println("=== 播放TTS音频 ===");
  Serial.println("Base64数据长度: " + String(base64Audio.length()));

  size_t decodedMax = (base64Audio.length() * 3) / 4 + 4;
  uint8_t* wavBuf = (uint8_t*)malloc(decodedMax);
  if (!wavBuf) {
    Serial.println("内存分配失败!");
    mimo_last_success = false;
    mimo_last_error = "Memory alloc failed";
    return;
  }

  size_t wavLen = mimo_base64_decode_to_buffer(base64Audio.c_str(), wavBuf, decodedMax);
  Serial.println("WAV数据大小: " + String(wavLen) + " bytes");

  if (wavLen < 44) {
    Serial.println("WAV数据太短!");
    free(wavBuf);
    mimo_last_success = false;
    mimo_last_error = "Invalid WAV data";
    return;
  }

  uint32_t sampleRate = wavBuf[24] | (wavBuf[25] << 8) | (wavBuf[26] << 16) | (wavBuf[27] << 24);
  uint16_t channels = wavBuf[22] | (wavBuf[23] << 8);
  uint16_t bitsPerSample = wavBuf[34] | (wavBuf[35] << 8);
  Serial.println("采样率: " + String(sampleRate) + " Hz, 声道: " + String(channels) + ", 位深: " + String(bitsPerSample) + " bit");

  uint16_t fmtChunkSize = wavBuf[16] | (wavBuf[17] << 8) | (wavBuf[18] << 16) | (wavBuf[19] << 24);
  size_t dataOffset = 20 + fmtChunkSize;
  if (dataOffset + 8 <= wavLen) {
    if (wavBuf[dataOffset] == 'd' && wavBuf[dataOffset+1] == 'a' && wavBuf[dataOffset+2] == 't' && wavBuf[dataOffset+3] == 'a') {
      dataOffset += 8;
    }
  }

  uint8_t* pcmData = wavBuf + dataOffset;
  size_t pcmLen = wavLen - dataOffset;
  Serial.println("PCM数据偏移: " + String(dataOffset) + ", PCM大小: " + String(pcmLen) + " bytes");

  i2s.end();
  delay(50);
  if (!i2s.begin(I2S_MODE_STD, sampleRate, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO)) {
    Serial.println("I2S重新初始化失败!");
    free(wavBuf);
    mimo_last_success = false;
    mimo_last_error = "I2S reinit failed";
    return;
  }

  size_t bytesWritten = 0;
  size_t chunkSize = 1024;
  while (bytesWritten < pcmLen) {
    size_t toWrite = min(chunkSize, pcmLen - bytesWritten);
    i2s.write(pcmData + bytesWritten, toWrite);
    bytesWritten += toWrite;
  }

  Serial.println("\\n播放完成!");
  free(wavBuf);
  mimo_last_success = true;
  mimo_last_error = "";
}`);

  return 'mimo_play_base64_wav(' + varName + ', ' + base64Audio + ');\n';
};

Arduino.forBlock['mimo_tts_and_play'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s';
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  var voice = block.getFieldValue('VOICE');
  var model = block.getFieldValue('MODEL');

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addVariable('mimo_last_success', 'bool mimo_last_success = false;');
  generator.addVariable('mimo_last_error', 'String mimo_last_error = "";');

  generator.addFunction('mimo_tts_request', null);
  generator.addFunction('mimo_base64_decode_to_buffer', null);
  generator.addFunction('mimo_play_base64_wav', null);

  var code = '{\n';
  code += '  String _ttsData = mimo_tts_request(' + text + ', "' + voice + '", "' + model + '");\n';
  code += '  if (mimo_last_success && _ttsData.length() > 0) {\n';
  code += '    mimo_play_base64_wav(' + varName + ', _ttsData);\n';
  code += '  }\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['mimo_tts_and_play_with_style'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s';
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  var voice = block.getFieldValue('VOICE');
  var model = block.getFieldValue('MODEL');
  var style = generator.valueToCode(block, 'STYLE', Arduino.ORDER_ATOMIC) || '""';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addVariable('mimo_last_success', 'bool mimo_last_success = false;');
  generator.addVariable('mimo_last_error', 'String mimo_last_error = "";');

  generator.addFunction('mimo_tts_with_style_request', null);
  generator.addFunction('mimo_base64_decode_to_buffer', null);
  generator.addFunction('mimo_play_base64_wav', null);

  var code = '{\n';
  code += '  String _ttsData = mimo_tts_with_style_request(' + text + ', "' + voice + '", ' + style + ', "' + model + '");\n';
  code += '  if (mimo_last_success && _ttsData.length() > 0) {\n';
  code += '    mimo_play_base64_wav(' + varName + ', _ttsData);\n';
  code += '  }\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['mimo_tts_and_play_voice_design'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s';
  var voiceDesc = generator.valueToCode(block, 'VOICE_DESC', Arduino.ORDER_ATOMIC) || '""';
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addVariable('mimo_last_success', 'bool mimo_last_success = false;');
  generator.addVariable('mimo_last_error', 'String mimo_last_error = "";');

  generator.addFunction('mimo_tts_request', null);
  generator.addFunction('mimo_base64_decode_to_buffer', null);
  generator.addFunction('mimo_play_base64_wav', null);

  var code = '{\n';
  code += '  String _ttsData = mimo_tts_voice_design_request(' + voiceDesc + ', ' + text + ');\n';
  code += '  if (mimo_last_success && _ttsData.length() > 0) {\n';
  code += '    mimo_play_base64_wav(' + varName + ', _ttsData);\n';
  code += '  }\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['mimo_tts_stream_play'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s';
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  var voice = block.getFieldValue('VOICE');

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addVariable('mimo_last_success', 'bool mimo_last_success = false;');
  generator.addVariable('mimo_last_error', 'String mimo_last_error = "";');

  generator.addFunction('mimo_base64_decode_to_buffer', null);
  generator.addFunction('mimo_escape_json', null);

  generator.addFunction('mimo_tts_stream_play_impl', `
void mimo_tts_stream_play_impl(I2SClass &i2s, String text, String voice) {
  Serial.println("=== 小米MiMo流式语音合成开始 ===");
  Serial.println("文本: " + text);
  Serial.println("音色: " + voice);

  if (WiFi.status() != WL_CONNECTED) {
    mimo_last_success = false;
    mimo_last_error = "WiFi not connected";
    return;
  }

  HTTPClient http;
  String url = mimo_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(120000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("api-key", mimo_api_key);

  String safeText = mimo_escape_json(text);
  String requestBody = "{\\"model\\":\\"mimo-v2-tts\\",\\"messages\\":[";
  requestBody += "{\\"role\\":\\"assistant\\",\\"content\\":\\"" + safeText + "\\"}";
  requestBody += "],\\"audio\\":{\\"format\\":\\"pcm16\\",\\"voice\\":\\"" + voice + "\\"},\\"stream\\":true}";

  Serial.println("发送流式语音合成请求...");
  int httpResponseCode = http.POST(requestBody);
  Serial.println("HTTP响应码: " + String(httpResponseCode));

  if (httpResponseCode != 200) {
    String errorResponse = http.getString();
    Serial.println("HTTP错误: " + errorResponse);
    mimo_last_success = false;
    mimo_last_error = "HTTP " + String(httpResponseCode);
    http.end();
    return;
  }

  WiFiClient *stream = http.getStreamPtr();
  int totalBytes = 0;
  String lineBuffer = "";
  mimo_last_success = true;
  mimo_last_error = "";

  while (http.connected() || stream->available()) {
    if (!stream->available()) {
      delay(1);
      continue;
    }
    char c = stream->read();
    if (c == '\\n') {
      lineBuffer.trim();
      if (lineBuffer.startsWith("data: ")) {
        String data = lineBuffer.substring(6);
        if (data == "[DONE]") break;
        int audioPos = data.indexOf("\\"audio\\":{\\"data\\":\\"");
        if (audioPos >= 0) {
          audioPos += 18;
          int audioEnd = data.indexOf("\\"", audioPos);
          if (audioEnd > audioPos) {
            String b64Chunk = data.substring(audioPos, audioEnd);
            int bufLen = (b64Chunk.length() * 3) / 4 + 16;
            uint8_t *pcmBuf = (uint8_t *)malloc(bufLen);
            if (pcmBuf) {
              int decodedLen = mimo_base64_decode_to_buffer(b64Chunk.c_str(), pcmBuf, bufLen);
              if (decodedLen > 0) {
                i2s.write(pcmBuf, decodedLen);
                totalBytes += decodedLen;
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
  Serial.println("流式播放完成，总字节数: " + String(totalBytes));
  Serial.println("=== 小米MiMo流式语音合成结束 ===");
}`);

  var code = 'mimo_tts_stream_play_impl(' + varName + ', ' + text + ', "' + voice + '");\n';
  return code;
};

Arduino.forBlock['mimo_tts_stream_play_with_style'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s';
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  var voice = block.getFieldValue('VOICE');
  var style = generator.valueToCode(block, 'STYLE', Arduino.ORDER_ATOMIC) || '""';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addVariable('mimo_last_success', 'bool mimo_last_success = false;');
  generator.addVariable('mimo_last_error', 'String mimo_last_error = "";');

  generator.addFunction('mimo_base64_decode_to_buffer', null);
  generator.addFunction('mimo_escape_json', null);

  generator.addFunction('mimo_tts_stream_play_with_style_impl', `
void mimo_tts_stream_play_with_style_impl(I2SClass &i2s, String text, String voice, String style) {
  Serial.println("=== 小米MiMo流式语音合成开始(带风格) ===");
  Serial.println("文本: " + text);
  Serial.println("音色: " + voice);
  Serial.println("风格: " + style);

  if (WiFi.status() != WL_CONNECTED) {
    mimo_last_success = false;
    mimo_last_error = "WiFi not connected";
    return;
  }

  HTTPClient http;
  String url = mimo_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(120000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("api-key", mimo_api_key);

  String safeText = mimo_escape_json(text);
  String safeStyle = mimo_escape_json(style);
  String styledContent = "<style>" + safeStyle + "</style>" + safeText;
  String requestBody = "{\\"model\\":\\"mimo-v2-tts\\",\\"messages\\":[";
  requestBody += "{\\"role\\":\\"assistant\\",\\"content\\":\\"" + styledContent + "\\"}";
  requestBody += "],\\"audio\\":{\\"format\\":\\"pcm16\\",\\"voice\\":\\"" + voice + "\\"},\\"stream\\":true}";

  Serial.println("发送流式语音合成请求...");
  int httpResponseCode = http.POST(requestBody);
  Serial.println("HTTP响应码: " + String(httpResponseCode));

  if (httpResponseCode != 200) {
    String errorResponse = http.getString();
    Serial.println("HTTP错误: " + errorResponse);
    mimo_last_success = false;
    mimo_last_error = "HTTP " + String(httpResponseCode);
    http.end();
    return;
  }

  WiFiClient *stream = http.getStreamPtr();
  int totalBytes = 0;
  String lineBuffer = "";
  mimo_last_success = true;
  mimo_last_error = "";

  while (http.connected() || stream->available()) {
    if (!stream->available()) {
      delay(1);
      continue;
    }
    char c = stream->read();
    if (c == '\\n') {
      lineBuffer.trim();
      if (lineBuffer.startsWith("data: ")) {
        String data = lineBuffer.substring(6);
        if (data == "[DONE]") break;
        int audioPos = data.indexOf("\\"audio\\":{\\"data\\":\\"");
        if (audioPos >= 0) {
          audioPos += 18;
          int audioEnd = data.indexOf("\\"", audioPos);
          if (audioEnd > audioPos) {
            String b64Chunk = data.substring(audioPos, audioEnd);
            int bufLen = (b64Chunk.length() * 3) / 4 + 16;
            uint8_t *pcmBuf = (uint8_t *)malloc(bufLen);
            if (pcmBuf) {
              int decodedLen = mimo_base64_decode_to_buffer(b64Chunk.c_str(), pcmBuf, bufLen);
              if (decodedLen > 0) {
                i2s.write(pcmBuf, decodedLen);
                totalBytes += decodedLen;
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
  Serial.println("流式播放完成，总字节数: " + String(totalBytes));
  Serial.println("=== 小米MiMo流式语音合成结束 ===");
}`);

  var code = 'mimo_tts_stream_play_with_style_impl(' + varName + ', ' + text + ', "' + voice + '", ' + style + ');\n';
  return code;
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
