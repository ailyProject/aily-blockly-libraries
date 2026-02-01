// 智谱AI GLM API库代码生成器

Arduino.forBlock['zhipu_glm_config'] = function(block, generator) {
  const apiKey = generator.valueToCode(block, 'API_KEY', Arduino.ORDER_ATOMIC) || '""';
  const baseUrl = generator.valueToCode(block, 'BASE_URL', Arduino.ORDER_ATOMIC) || '"https://open.bigmodel.cn/api/paas/v4"';

  // 添加必要的库引用
  generator.addLibrary('zhipu_wifi', '#include <WiFi.h>');
  generator.addLibrary('zhipu_http', '#include <HTTPClient.h>');

  // 添加全局变量
  generator.addVariable('zhipu_api_key', 'String zhipu_api_key = ' + apiKey + ';');
  generator.addVariable('zhipu_base_url', 'String zhipu_base_url = ' + baseUrl + ';');
  generator.addVariable('zhipu_system_prompt', 'String zhipu_system_prompt = "";');
  generator.addVariable('zhipu_last_success', 'bool zhipu_last_success = false;');
  generator.addVariable('zhipu_last_error', 'String zhipu_last_error = "";');
  generator.addVariable('zhipu_stream_chunk', 'String zhipu_stream_chunk = "";');
  generator.addVariable('zhipu_stream_callback', 'void (*zhipu_stream_callback)(void) = NULL;');
  generator.addVariable('zhipu_history', 'String zhipu_history = "";');

  generator.addFunction('zhipu_escape_json', String.raw`
String zhipu_escape_json(String input) {
  input.replace("\\", "\\\\");
  input.replace("\"", "\\\"");
  input.replace("\n", "\\n");
  input.replace("\r", "\\r");
  return input;
}`);

  generator.addFunction('zhipu_simple_request', `
String zhipu_simple_request(String model, String message, bool enableThinking, bool useHistory) {
  Serial.println("=== 智谱AI API调用开始(流式) ===");
  Serial.println("模型: " + model);
  Serial.println("消息: " + message);

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("错误: WiFi未连接");
    zhipu_last_success = false;
    zhipu_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = zhipu_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(60000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + zhipu_api_key);

  String messages = "";
  messages.reserve(zhipu_system_prompt.length() + zhipu_history.length() + message.length() + 256);
  bool hasAny = false;
  if (zhipu_system_prompt.length() > 0) {
    messages += "{\\"role\\":\\"system\\",\\"content\\":\\"" + zhipu_escape_json(zhipu_system_prompt) + "\\"}";
    hasAny = true;
  }
  if (useHistory && zhipu_history.length() > 0) {
    if (hasAny) messages += ",";
    messages += zhipu_history;
    hasAny = true;
  }
  if (hasAny) messages += ",";
  messages += "{\\"role\\":\\"user\\",\\"content\\":\\"" + zhipu_escape_json(message) + "\\"}";

  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[" + messages + "]";
  requestBody.reserve(requestBody.length() + 256);
  requestBody += ",\\"stream\\":true";
  
  if (enableThinking) {
    requestBody += ",\\"thinking\\":{\\"type\\":\\"enabled\\"}";
    requestBody += ",\\"max_tokens\\":65536";
    requestBody += ",\\"temperature\\":1.0";
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
        
        // 检查是否收到完整的一行
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
            
            // 解析JSON中的content
            int contentStart = data.indexOf("\\"content\\":\\"");
            if (contentStart >= 0) {
              contentStart += 11;
              int contentEnd = data.indexOf("\\"", contentStart);
              if (contentEnd > contentStart) {
                String content = data.substring(contentStart, contentEnd);
                Serial.print(content); // 实时输出
                fullContent += content;
                // 调用流式回调
                if (zhipu_stream_callback != NULL) {
                  zhipu_stream_chunk = content;
                  zhipu_stream_callback();
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
        String safeUser = zhipu_escape_json(message);
        String safeAssistant = zhipu_escape_json(fullContent);
        if (zhipu_history.length() > 0) {
          zhipu_history += ",";
        }
        zhipu_history += "{\\"role\\":\\"user\\",\\"content\\":\\"" + safeUser + "\\"},{\\"role\\":\\"assistant\\",\\"content\\":\\"" + safeAssistant + "\\"}";
      }
      zhipu_last_success = true;
      zhipu_last_error = "";
    } else {
      Serial.println("流式解析失败");
      zhipu_last_success = false;
      zhipu_last_error = "Stream parse error";
    }
  } else {
    String errorResponse = http.getString();
    Serial.println("HTTP错误: " + errorResponse);
    zhipu_last_success = false;
    zhipu_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  Serial.println("=== 智谱AI API调用结束 ===");
  return response;
}`);

  return '';
};

Arduino.forBlock['zhipu_glm_chat'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  const code = `zhipu_simple_request("${model}", ${message}, false, false)`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['zhipu_glm_chat_with_thinking'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  const code = `zhipu_simple_request("${model}", ${message}, true, false)`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['zhipu_glm_chat_with_history'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  const code = `zhipu_simple_request("${model}", ${message}, false, true)`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['zhipu_glm_clear_history'] = function() {
  return 'zhipu_history = "";\n';
};

Arduino.forBlock['zhipu_glm_set_system_prompt'] = function(block, generator) {
  const systemPrompt = generator.valueToCode(block, 'SYSTEM_PROMPT', Arduino.ORDER_ATOMIC) || '""';
  return `zhipu_system_prompt = ${systemPrompt};\n`;
};

Arduino.forBlock['zhipu_glm_get_response_status'] = function() {
  return ['zhipu_last_success', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['zhipu_glm_get_error_message'] = function() {
  return ['zhipu_last_error', Arduino.ORDER_ATOMIC];
};

// 流式回调相关
Arduino.forBlock['zhipu_glm_set_stream_callback'] = function(block, generator) {
  const callback = generator.statementToCode(block, 'CALLBACK');
  
  // 生成回调函数
  generator.addFunction('zhipu_user_stream_callback', `
void zhipu_user_stream_callback() {
${callback}}`);
  
  return 'zhipu_stream_callback = zhipu_user_stream_callback;\n';
};

Arduino.forBlock['zhipu_glm_get_stream_chunk'] = function() {
  return ['zhipu_stream_chunk', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['zhipu_glm_clear_stream_callback'] = function() {
  return 'zhipu_stream_callback = NULL;\n';
};


Arduino.forBlock['zhipu_glm_vision_chat'] = function(block, generator) {
  const image = generator.valueToCode(block, 'IMAGE', Arduino.ORDER_ATOMIC) || '""';
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  // 添加图片对话函数（Base64，流式）
  generator.addFunction('zhipu_vision_request', `
String zhipu_vision_request(String model, String base64Image, String message) {
  Serial.println("=== 智谱AI视觉对话开始(流式) ===");
  Serial.println("模型: " + model);
  Serial.println("提示词: " + message);

  if (WiFi.status() != WL_CONNECTED) {
    zhipu_last_success = false;
    zhipu_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = zhipu_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(60000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + zhipu_api_key);

  String requestBody = "";
  requestBody.reserve(base64Image.length() + message.length() + model.length() + 256);
  String safeMessage = zhipu_escape_json(message);
  requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[{\\"role\\":\\"user\\",\\"content\\":[";
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
                if (zhipu_stream_callback != NULL) {
                  zhipu_stream_chunk = content;
                  zhipu_stream_callback();
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
      zhipu_last_success = true;
      zhipu_last_error = "";
    } else {
      zhipu_last_success = false;
      zhipu_last_error = "Stream parse error";
    }
  } else {
    zhipu_last_success = false;
    zhipu_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  return response;
}`);

  const code = `zhipu_vision_request("${model}", ${image}, ${message})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['zhipu_glm_vision_chat_direct_capture'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  generator.addLibrary('zhipu_wifi_client_secure', '#include <WiFiClientSecure.h>');
  generator.addLibrary('zhipu_wifi_client', '#include <WiFiClient.h>');
  generator.addLibrary('zhipu_esp_camera', '#include <esp_camera.h>');

  generator.addFunction('zhipu_parse_base_url', `
bool zhipu_parse_base_url(String baseUrl, bool &isHttps, String &host, uint16_t &port, String &basePath) {
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

  generator.addFunction('zhipu_base64_length', `
size_t zhipu_base64_length(size_t inputLen) {
  return ((inputLen + 2) / 3) * 4;
}`);

  generator.addFunction('zhipu_base64_write', `
void zhipu_base64_write(Client &out, const uint8_t* data, size_t len) {
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

  generator.addFunction('zhipu_vision_direct_capture_request', `
String zhipu_vision_direct_capture_request(String model, String message) {
  Serial.println("=== 智谱AI视觉对话开始(直接拍照/流式上传) ===");
  Serial.println("模型: " + model);
  Serial.println("提示词: " + message);

  if (WiFi.status() != WL_CONNECTED) {
    zhipu_last_success = false;
    zhipu_last_error = "WiFi not connected";
    return "";
  }

  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb) {
    zhipu_last_success = false;
    zhipu_last_error = "Camera capture failed";
    return "";
  }

  bool isHttps = true;
  String host = "";
  uint16_t port = 443;
  String basePath = "";
  if (!zhipu_parse_base_url(zhipu_base_url, isHttps, host, port, basePath)) {
    esp_camera_fb_return(fb);
    zhipu_last_success = false;
    zhipu_last_error = "Invalid base URL";
    return "";
  }

  String path = basePath;
  if (path.endsWith("/")) path.remove(path.length() - 1);
  path += "/chat/completions";

  String safeMessage = zhipu_escape_json(message);
  String jsonPrefix = "{\\\"model\\\":\\\"" + model + "\\\",\\\"messages\\\":[{\\\"role\\\":\\\"user\\\",\\\"content\\\":[{\\\"type\\\":\\\"image_url\\\",\\\"image_url\\\":{\\\"url\\\":\\\"data:image/jpeg;base64,";
  String jsonSuffix = "\\\"}},{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"" + safeMessage + "\\\"}]}],\\\"stream\\\":true}";

  size_t base64Len = zhipu_base64_length(fb->len);
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
    zhipu_last_success = false;
    zhipu_last_error = "Connect failed";
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
  client->print("Authorization: Bearer ");
  client->print(zhipu_api_key);
  client->print("\\r\\n");
  client->print("Content-Length: ");
  client->print(String(contentLen));
  client->print("\\r\\n\\r\\n");

  client->print(jsonPrefix);
  zhipu_base64_write(*client, fb->buf, fb->len);
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
    zhipu_last_success = false;
    zhipu_last_error = "HTTP " + String(httpCode);
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
              if (zhipu_stream_callback != NULL) {
                zhipu_stream_chunk = content;
                zhipu_stream_callback();
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
    zhipu_last_success = true;
    zhipu_last_error = "";
  } else {
    zhipu_last_success = false;
    zhipu_last_error = "Stream parse error";
  }
  return response;
}`);

  const code = `zhipu_vision_direct_capture_request("${model}", ${message})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['zhipu_glm_vision_url_chat'] = function(block, generator) {
  const imageUrl = generator.valueToCode(block, 'IMAGE_URL', Arduino.ORDER_ATOMIC) || '""';
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  // 添加图片URL对话函数（流式）
  generator.addFunction('zhipu_vision_url_request', `
String zhipu_vision_url_request(String model, String imageUrl, String message) {
  Serial.println("=== 智谱AI视觉URL对话开始(流式) ===");
  Serial.println("模型: " + model);
  Serial.println("图片URL: " + imageUrl);

  if (WiFi.status() != WL_CONNECTED) {
    zhipu_last_success = false;
    zhipu_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = zhipu_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(60000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + zhipu_api_key);

  String requestBody = "";
  requestBody.reserve(imageUrl.length() + message.length() + model.length() + 256);
  String safeMessage = zhipu_escape_json(message);
  requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[{\\"role\\":\\"user\\",\\"content\\":[";
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
                if (zhipu_stream_callback != NULL) {
                  zhipu_stream_chunk = content;
                  zhipu_stream_callback();
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
      zhipu_last_success = true;
      zhipu_last_error = "";
    } else {
      zhipu_last_success = false;
      zhipu_last_error = "Stream parse error";
    }
  } else {
    zhipu_last_success = false;
    zhipu_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  return response;
}`);

  const code = `zhipu_vision_url_request("${model}", ${imageUrl}, ${message})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};


// 图像生成功能
Arduino.forBlock['zhipu_glm_image_generate'] = function(block, generator) {
  const prompt = generator.valueToCode(block, 'PROMPT', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');
  const size = block.getFieldValue('SIZE');

  // 添加图像生成函数
  generator.addFunction('zhipu_image_generate', `
String zhipu_image_generate(String model, String prompt, String size) {
  Serial.println("=== 智谱AI图像生成开始 ===");
  Serial.println("模型: " + model);
  Serial.println("提示词: " + prompt);
  Serial.println("尺寸: " + size);

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("错误: WiFi未连接");
    zhipu_last_success = false;
    zhipu_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = zhipu_base_url + "/images/generations";
  http.begin(url);
  http.setTimeout(120000); // 120秒超时（图像生成需要更长时间）
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + zhipu_api_key);

  // 构建JSON请求体
  String requestBody = "";
  requestBody.reserve(prompt.length() + model.length() + size.length() + 64);
  String safePrompt = zhipu_escape_json(prompt);
  requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"prompt\\":\\"" + safePrompt + "\\",";
  requestBody += "\\"size\\":\\"" + size + "\\"}";

  Serial.println("请求体: " + requestBody);
  Serial.println("发送HTTP请求...");
  int httpResponseCode = http.POST(requestBody);
  Serial.println("HTTP响应码: " + String(httpResponseCode));
  String response = "";

  if (httpResponseCode == 200) {
    String payload = http.getString();
    Serial.println("API响应: " + payload);

    // 解析响应中的url字段
    int start = payload.indexOf("\\"url\\":\\"") + 7;
    int end = payload.indexOf("\\"", start);
    if (start > 6 && end > start) {
      response = payload.substring(start, end);
      Serial.println("解析成功，图片URL: " + response);
      zhipu_last_success = true;
      zhipu_last_error = "";
    } else {
      Serial.println("解析失败，无法找到url字段");
      zhipu_last_success = false;
      zhipu_last_error = "Parse error";
    }
  } else {
    String errorResponse = http.getString();
    Serial.println("HTTP错误响应: " + errorResponse);
    zhipu_last_success = false;
    zhipu_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  Serial.println("=== 智谱AI图像生成结束 ===");
  return response;
}`);

  const code = `zhipu_image_generate("${model}", ${prompt}, "${size}")`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['zhipu_glm_image_generate_simple'] = function(block, generator) {
  const prompt = generator.valueToCode(block, 'PROMPT', Arduino.ORDER_ATOMIC) || '""';

  // 复用图像生成函数
  generator.addFunction('zhipu_image_generate', `
String zhipu_image_generate(String model, String prompt, String size) {
  Serial.println("=== 智谱AI图像生成开始 ===");
  Serial.println("模型: " + model);
  Serial.println("提示词: " + prompt);
  Serial.println("尺寸: " + size);

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("错误: WiFi未连接");
    zhipu_last_success = false;
    zhipu_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = zhipu_base_url + "/images/generations";
  http.begin(url);
  http.setTimeout(120000); // 120秒超时
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + zhipu_api_key);

  // 构建JSON请求体
  String requestBody = "{\\"model\\":\\"" + model + "\\",";
  requestBody += "\\"prompt\\":\\"" + prompt + "\\",";
  requestBody += "\\"size\\":\\"" + size + "\\"}";

  Serial.println("请求体: " + requestBody);
  Serial.println("发送HTTP请求...");
  int httpResponseCode = http.POST(requestBody);
  Serial.println("HTTP响应码: " + String(httpResponseCode));
  String response = "";

  if (httpResponseCode == 200) {
    String payload = http.getString();
    Serial.println("API响应: " + payload);

    // 解析响应中的url字段
    int start = payload.indexOf("\\"url\\":\\"") + 7;
    int end = payload.indexOf("\\"", start);
    if (start > 6 && end > start) {
      response = payload.substring(start, end);
      Serial.println("解析成功，图片URL: " + response);
      zhipu_last_success = true;
      zhipu_last_error = "";
    } else {
      Serial.println("解析失败，无法找到url字段");
      zhipu_last_success = false;
      zhipu_last_error = "Parse error";
    }
  } else {
    String errorResponse = http.getString();
    Serial.println("HTTP错误响应: " + errorResponse);
    zhipu_last_success = false;
    zhipu_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  Serial.println("=== 智谱AI图像生成结束 ===");
  return response;
}`);

  // 使用默认模型(免费)和尺寸
  const code = `zhipu_image_generate("cogview-3-flash", ${prompt}, "1024x1024")`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};



