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

  // 添加流式HTTP请求函数
  generator.addFunction('zhipu_simple_request', `
String zhipu_simple_request(String model, String message, bool enableThinking) {
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

  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[";
  if (zhipu_system_prompt.length() > 0) {
    requestBody += "{\\"role\\":\\"system\\",\\"content\\":\\"" + zhipu_system_prompt + "\\"},";
  }
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":\\"" + message + "\\"}]";
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

  const code = `zhipu_simple_request("${model}", ${message}, false)`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['zhipu_glm_chat_with_thinking'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  const code = `zhipu_simple_request("${model}", ${message}, true)`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['zhipu_glm_chat_with_history'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  // 简化版本，暂时与普通对话相同
  const code = `zhipu_simple_request("${model}", ${message}, false)`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['zhipu_glm_clear_history'] = function() {
  return '// Clear history - simplified version\n';
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

  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[{\\"role\\":\\"user\\",\\"content\\":[";
  requestBody += "{\\"type\\":\\"image_url\\",\\"image_url\\":{\\"url\\":\\"data:image/jpeg;base64," + base64Image + "\\"}},";
  requestBody += "{\\"type\\":\\"text\\",\\"text\\":\\"" + message + "\\"}";
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

  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[{\\"role\\":\\"user\\",\\"content\\":[";
  requestBody += "{\\"type\\":\\"image_url\\",\\"image_url\\":{\\"url\\":\\"" + imageUrl + "\\"}},";
  requestBody += "{\\"type\\":\\"text\\",\\"text\\":\\"" + message + "\\"}";
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



