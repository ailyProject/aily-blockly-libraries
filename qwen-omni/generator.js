// 通义千问Qwen-Omni API库代码生成器

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

  // 添加流式HTTP请求函数
  generator.addFunction('qwen_simple_request', `
String qwen_simple_request(String model, String message, bool enableThinking) {
  Serial.println("=== 通义千问API调用开始(流式) ===");
  Serial.println("模型: " + model);
  Serial.println("消息: " + message);

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("错误: WiFi未连接");
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
              Serial.println("流式传输完成");
              break;
            }
            
            int contentStart = data.indexOf("\\"content\\":\\"");
            if (contentStart >= 0) {
              contentStart += 11;
              int contentEnd = data.indexOf("\\"", contentStart);
              if (contentEnd > contentStart) {
                String content = data.substring(contentStart, contentEnd);
                Serial.print(content); // 实时输出
                fullContent += content;
                // 调用流式回调
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
      Serial.println("流式解析失败");
      qwen_last_success = false;
      qwen_last_error = "Stream parse error";
    }
  } else {
    String errorResponse = http.getString();
    Serial.println("HTTP错误: " + errorResponse);
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
                Serial.print(content); // 实时输出
                fullContent += content;
                // 调用流式回调
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

Arduino.forBlock['qwen_omni_chat'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  const code = `qwen_simple_request("${model}", ${message}, false)`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwen_omni_chat_simple'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';

  const code = `qwen_simple_request("qwen-turbo", ${message}, false)`;
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
  return 'qwen_chat_history = "";\nSerial.println("对话历史已清空");\n';
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

// 流式回调相关
Arduino.forBlock['qwen_omni_set_stream_callback'] = function(block, generator) {
  const callback = generator.statementToCode(block, 'CALLBACK');
  
  // 生成回调函数
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
                Serial.print(content); // 实时输出
                fullContent += content;
                // 调用流式回调
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
                Serial.print(content); // 实时输出
                fullContent += content;
                // 调用流式回调
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

// 图像生成功能
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
  http.setTimeout(120000); // 120秒超时
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
    Serial.println("HTTP错误: " + errorResponse);
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

  // 复用图像生成函数
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
  http.setTimeout(120000);
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
  http.setTimeout(120000);
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
              Serial.println("TTS流式传输完成");
              break;
            }
            
            Serial.println("SSE: " + data.substring(0, min((int)data.length(), 80)));
            int outputAudioDataPos = data.indexOf("\\"audio\\":{\\"data\\":\\"");
            if (outputAudioDataPos >= 0) {
              outputAudioDataPos += 18;
              int endPos = data.indexOf("\\"", outputAudioDataPos);
              if (endPos > outputAudioDataPos) {
                String audioChunk = data.substring(outputAudioDataPos, endPos);
                fullAudio += audioChunk;
                Serial.print(".");
              }
            }
          }
          buffer = "";
        }
      } else {
        if (millis() - lastDataTime > 30000) {
          Serial.println("TTS流式超时");
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
      Serial.println("TTS流式解析失败");
      qwen_last_success = false;
      qwen_last_error = "Stream parse error";
    }
  } else {
    String errorResponse = http.getString();
    Serial.println("HTTP错误: " + errorResponse);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  Serial.println("=== 通义TTS语音合成结束 ===");
  return response;
}`);

  const code = `qwen_tts_request(${text}, "${voice}", "${model}", "${language}")`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwen_omni_tts_play'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s';
  const base64Audio = generator.valueToCode(block, 'BASE64_AUDIO', Arduino.ORDER_ATOMIC) || '""';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');

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

  generator.addFunction('qwen_play_base64_pcm', `
void qwen_play_base64_pcm(I2SClass &i2s, String base64Audio) {
  Serial.println("=== 播放TTS音频 ===");
  Serial.println("Base64数据长度: " + String(base64Audio.length()));

  size_t decodedMax = (base64Audio.length() * 3) / 4 + 4;
  uint8_t* pcmBuf = (uint8_t*)malloc(decodedMax);
  if (!pcmBuf) {
    Serial.println("内存分配失败!");
    qwen_last_success = false;
    qwen_last_error = "Memory alloc failed";
    return;
  }

  size_t pcmLen = qwen_base64_decode_to_buffer(base64Audio.c_str(), pcmBuf, decodedMax);
  Serial.println("PCM数据大小: " + String(pcmLen) + " bytes");

  if (pcmLen < 2) {
    Serial.println("PCM数据太短!");
    free(pcmBuf);
    qwen_last_success = false;
    qwen_last_error = "Invalid PCM data";
    return;
  }

  qwen_play_pcm_via_i2s(i2s, pcmBuf, pcmLen);
  free(pcmBuf);
  qwen_last_success = true;
  qwen_last_error = "";
}`);

  return `qwen_play_base64_pcm(${varName}, ${base64Audio});\n`;
};

Arduino.forBlock['qwen_omni_tts_and_play'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s';
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  const voice = block.getFieldValue('VOICE');
  const model = block.getFieldValue('MODEL');
  const language = block.getFieldValue('LANGUAGE');

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');

  generator.addFunction('qwen_tts_request', null);
  generator.addFunction('qwen_base64_decode_to_buffer', null);
  generator.addFunction('qwen_play_pcm_via_i2s', null);

  var code = '{\n';
  code += '  qwen_tts_data = qwen_tts_request(' + text + ', "' + voice + '", "' + model + '", "' + language + '");\n';
  code += '  if (qwen_last_success && qwen_tts_data.length() > 0) {\n';
  code += '    size_t decodedMax = (qwen_tts_data.length() * 3) / 4 + 4;\n';
  code += '    uint8_t* pcmBuf = (uint8_t*)malloc(decodedMax);\n';
  code += '    if (pcmBuf) {\n';
  code += '      size_t pcmLen = qwen_base64_decode_to_buffer(qwen_tts_data.c_str(), pcmBuf, decodedMax);\n';
  code += '      if (pcmLen > 0) {\n';
  code += '        qwen_play_pcm_via_i2s(' + varName + ', pcmBuf, pcmLen);\n';
  code += '      }\n';
  code += '      free(pcmBuf);\n';
  code += '    }\n';
  code += '  }\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['qwen_omni_tts_stream_play'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s';
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  const voice = block.getFieldValue('VOICE');
  const model = block.getFieldValue('MODEL');
  const language = block.getFieldValue('LANGUAGE');

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');

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
  http.setTimeout(120000);
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
    Serial.println("HTTP错误: " + errorResponse);
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
          audioPos += 18;
          int audioEnd = data.indexOf("\\"", audioPos);
          if (audioEnd > audioPos) {
            String b64Chunk = data.substring(audioPos, audioEnd);
            int bufLen = (b64Chunk.length() * 3) / 4 + 16;
            uint8_t *pcmBuf = (uint8_t *)malloc(bufLen);
            if (pcmBuf) {
              size_t outLen = 0;
              int ret = mbedtls_base64_decode(pcmBuf, bufLen, &outLen, (const unsigned char*)b64Chunk.c_str(), b64Chunk.length());
              if (ret == 0 && outLen > 0) {
                i2s.write(pcmBuf, outLen);
                totalBytes += outLen;
                Serial.print(".");
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

  var code = 'qwen_tts_stream_play_impl(' + varName + ', ' + text + ', "' + voice + '", "' + model + '", "' + language + '");\n';
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
  http.setTimeout(120000);
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
              Serial.println("全模态文字流式传输完成");
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
      Serial.println("全模态文字流式解析失败");
      qwen_last_success = false;
      qwen_last_error = "Stream parse error";
    }
  } else {
    String errorResponse = http.getString();
    Serial.println("HTTP错误: " + errorResponse);
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
  var varName = varField ? varField.getText() : 'i2s';
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');
  const voice = block.getFieldValue('VOICE');

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');

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

  generator.addFunction('qwen_omni_and_play_request', `
void qwen_omni_and_play_request(I2SClass &i2s, String model, String message, String voice) {
  Serial.println("=== 通义全模态对话并播放开始(流式) ===");
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
  http.setTimeout(120000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  String safeMessage = qwen_escape_json(message);
  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"messages\\":[{\\"role\\":\\"user\\",\\"content\\":\\"" + safeMessage + "\\"}],";
  requestBody += "\\"modalities\\":[\\"text\\",\\"audio\\"],";
  requestBody += "\\"audio\\":{\\"voice\\":\\"" + voice + "\\",\\"format\\":\\"wav\\"},";
  requestBody += "\\"stream\\":true}";

  Serial.println("发送全模态请求...");
  int httpResponseCode = http.POST(requestBody);
  Serial.println("HTTP响应码: " + String(httpResponseCode));

  if (httpResponseCode != 200) {
    String errorResponse = http.getString();
    Serial.println("HTTP错误: " + errorResponse);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
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
            Serial.print(content);
            fullText += content;
          }
        }
        
        int audioPos = data.indexOf("\\"audio\\":{\\"data\\":\\"");
        if (audioPos >= 0) {
          audioPos += 18;
          int audioEnd = data.indexOf("\\"", audioPos);
          if (audioEnd > audioPos) {
            fullAudio += data.substring(audioPos, audioEnd);
            Serial.print(".");
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
    size_t decodedMax = (fullAudio.length() * 3) / 4 + 4;
    uint8_t* pcmBuf = (uint8_t*)malloc(decodedMax);
    if (pcmBuf) {
      size_t outLen = 0;
      int ret = mbedtls_base64_decode(pcmBuf, decodedMax, &outLen, (const unsigned char*)fullAudio.c_str(), fullAudio.length());
      if (ret == 0 && outLen > 0) {
        uint8_t* playData = pcmBuf;
        size_t playLen = outLen;
        qwen_omni_parse_wav_and_config_tx(i2s, pcmBuf, outLen, &playData, &playLen);
        Serial.println("播放音频，大小: " + String(playLen) + " bytes");
        size_t bytesWritten = 0;
        while (bytesWritten < playLen) {
          size_t toWrite = min((size_t)1024, playLen - bytesWritten);
          i2s.write(playData + bytesWritten, toWrite);
          bytesWritten += toWrite;
        }
      }
      free(pcmBuf);
    }
    i2s.end();
    i2s.begin(I2S_MODE_STD, 24000, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO);
    qwen_omni_audio_data = fullAudio;
    qwen_last_success = true;
    qwen_last_error = "";
    Serial.println("全模态对话并播放完成");
  } else {
    qwen_last_success = false;
    qwen_last_error = "No audio data";
    Serial.println("未收到音频数据");
  }
  Serial.println("=== 通义全模态对话并播放结束 ===");
}`);

  var code = 'qwen_omni_and_play_request(' + varName + ', "' + model + '", ' + message + ', "' + voice + '");\n';
  return code;
};

Arduino.forBlock['qwen_omni_omni_stream_play'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s';
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');
  const voice = block.getFieldValue('VOICE');

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');

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
  http.setTimeout(120000);
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
    Serial.println("HTTP错误: " + errorResponse);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
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
          audioPos += 18;
          int audioEnd = data.indexOf("\\"", audioPos);
          if (audioEnd > audioPos) {
            fullAudio += data.substring(audioPos, audioEnd);
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
    uint8_t* pcmBuf = (uint8_t*)malloc(decodedMax);
    if (pcmBuf) {
      size_t outLen = 0;
      int ret = mbedtls_base64_decode(pcmBuf, decodedMax, &outLen, (const unsigned char*)fullAudio.c_str(), fullAudio.length());
      if (ret == 0 && outLen > 0) {
        uint8_t* playData = pcmBuf;
        size_t playLen = outLen;
        qwen_omni_parse_wav_and_config_tx(i2s, pcmBuf, outLen, &playData, &playLen);
        Serial.println("播放音频，大小: " + String(playLen) + " bytes");
        size_t bytesWritten = 0;
        while (bytesWritten < playLen) {
          size_t toWrite = min((size_t)1024, playLen - bytesWritten);
          i2s.write(playData + bytesWritten, toWrite);
          bytesWritten += toWrite;
        }
        Serial.println("播放完成!");
      }
      free(pcmBuf);
    }
    i2s.end();
    i2s.begin(I2S_MODE_STD, 24000, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO);
    qwen_omni_audio_data = fullAudio;
    qwen_last_success = true;
    qwen_last_error = "";
  } else {
    qwen_last_success = false;
    qwen_last_error = "No audio data";
    Serial.println("未收到音频数据");
  }
  Serial.println("=== 通义全模态流式对话并播放结束 ===");
}`);

  var code = 'qwen_omni_stream_play_request(' + varName + ', "' + model + '", ' + message + ', "' + voice + '");\n';
  return code;
};

Arduino.forBlock['qwen_omni_omni_get_audio'] = function(block, generator) {
  return ['qwen_omni_audio_data', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['qwen_omni_tts_voice_design'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s';
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  const voiceDesc = generator.valueToCode(block, 'VOICE_DESC', Arduino.ORDER_ATOMIC) || '""';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');

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
  http.setTimeout(120000);
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
    Serial.println("HTTP错误: " + errorResponse);
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
          audioPos += 18;
          int audioEnd = data.indexOf("\\"", audioPos);
          if (audioEnd > audioPos) {
            String b64Chunk = data.substring(audioPos, audioEnd);
            int bufLen = (b64Chunk.length() * 3) / 4 + 16;
            uint8_t *pcmBuf = (uint8_t *)malloc(bufLen);
            if (pcmBuf) {
              size_t outLen = 0;
              int ret = mbedtls_base64_decode(pcmBuf, bufLen, &outLen, (const unsigned char*)b64Chunk.c_str(), b64Chunk.length());
              if (ret == 0 && outLen > 0) {
                i2s.write(pcmBuf, outLen);
                totalBytes += outLen;
                Serial.print(".");
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

  var code = 'qwen_tts_voice_design_request(' + varName + ', ' + text + ', ' + voiceDesc + ');\n';
  return code;
};

Arduino.forBlock['qwen_omni_omni_voice_chat'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'i2s';
  const duration = generator.valueToCode(block, 'DURATION', Arduino.ORDER_ATOMIC) || '3';
  const model = block.getFieldValue('MODEL');
  const voice = block.getFieldValue('VOICE');
  const prompt = generator.valueToCode(block, 'PROMPT', Arduino.ORDER_ATOMIC) || '""';

  generator.addLibrary('ESP_I2S', '#include <ESP_I2S.h>');
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');

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
  Serial.println("录音时长: " + String(duration) + "秒");

  qwen_last_success = false;
  qwen_last_error = "";
  qwen_omni_audio_data = "";

  if (WiFi.status() != WL_CONNECTED) {
    qwen_last_error = "WiFi not connected";
    Serial.println("错误: WiFi未连接");
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
    Serial.println("错误: PCM内存分配失败");
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
  http.setTimeout(120000);
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
    Serial.println("HTTP错误: " + errBody);
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
          audioPos += 18;
          int audioEnd = data.indexOf("\\"", audioPos);
          if (audioEnd > audioPos) {
            fullAudio += data.substring(audioPos, audioEnd);
            Serial.print(".");
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
    Serial.println("未收到音频数据");
  }

  Serial.println("回复文本: " + fullText);
  Serial.println("=== 通义全模态语音对话结束 ===");
}`);

  var code = 'qwen_omni_voice_chat_request(' + varName + ', "' + model + '", "' + voice + '", ' + prompt + ', ' + duration + ');\n';
  return code;
};



