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

  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[";
  if (qwen_system_prompt.length() > 0) {
    requestBody += "{\\"role\\":\\"system\\",\\"content\\":\\"" + qwen_system_prompt + "\\"},";
  }
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":\\"" + message + "\\"}]";
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
              Serial.println("流式传输完成");
              break;
            }
            
            int contentStart = data.indexOf("\\"content\\":\\"");
            if (contentStart >= 0) {
              contentStart += 11;
              int contentEnd = data.indexOf("\\"", contentStart);
              if (contentEnd > contentStart) {
                fullContent += data.substring(contentStart, contentEnd);
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
      Serial.println("流式解析成功，AI回复: " + response);
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
  if (qwen_chat_history.length() > 0) {
    qwen_chat_history += ",";
  }
  qwen_chat_history += "{\\"role\\":\\"user\\",\\"content\\":\\"" + message + "\\"}";

  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[";
  if (qwen_system_prompt.length() > 0) {
    requestBody += "{\\"role\\":\\"system\\",\\"content\\":\\"" + qwen_system_prompt + "\\"},";
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
            if (data == "[DONE]") break;
            int contentStart = data.indexOf("\\"content\\":\\"");
            if (contentStart >= 0) {
              contentStart += 11;
              int contentEnd = data.indexOf("\\"", contentStart);
              if (contentEnd > contentStart) {
                fullContent += data.substring(contentStart, contentEnd);
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
      qwen_chat_history += ",{\\"role\\":\\"assistant\\",\\"content\\":\\"" + response + "\\"}";
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
            if (data == "[DONE]") break;
            int contentStart = data.indexOf("\\"content\\":\\"");
            if (contentStart >= 0) {
              contentStart += 11;
              int contentEnd = data.indexOf("\\"", contentStart);
              if (contentEnd > contentStart) {
                fullContent += data.substring(contentStart, contentEnd);
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
            if (data == "[DONE]") break;
            int contentStart = data.indexOf("\\"content\\":\\"");
            if (contentStart >= 0) {
              contentStart += 11;
              int contentEnd = data.indexOf("\\"", contentStart);
              if (contentEnd > contentStart) {
                fullContent += data.substring(contentStart, contentEnd);
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
  requestBody += "\\"input\\":{\\"prompt\\":\\"" + prompt + "\\"},";
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
  requestBody += "\\"input\\":{\\"prompt\\":\\"" + prompt + "\\"},";
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



