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

  // 添加简化的HTTP请求函数
  generator.addFunction('qwen_simple_request', `
String qwen_simple_request(String model, String message) {
  Serial.println("=== 通义千问API调用开始 ===");
  Serial.println("模型: " + model);
  Serial.println("消息: " + message);

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("错误: WiFi未连接");
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    return "";
  }
  Serial.println("WiFi连接正常");

  HTTPClient http;
  String url = qwen_base_url + "/chat/completions";
  Serial.println("请求URL: " + url);
  http.begin(url);
  http.setTimeout(30000); // 30秒超时
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);
  Serial.println("请求头设置完成");

  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[";
  if (qwen_system_prompt.length() > 0) {
    requestBody += "{\\"role\\":\\"system\\",\\"content\\":\\"" + qwen_system_prompt + "\\"},";
  }
  requestBody += "{\\"role\\":\\"user\\",\\"content\\":\\"" + message + "\\"}]";

  // 如果是omni模型，必须使用stream=true
  if (model.indexOf("omni") >= 0) {
    requestBody += ",\\"stream\\":true";
  }
  requestBody += "}";

  Serial.println("请求体: " + requestBody);
  Serial.println("发送HTTP请求...");
  int httpResponseCode = http.POST(requestBody);
  Serial.println("HTTP响应码: " + String(httpResponseCode));
  String response = "";

  if (httpResponseCode == 200) {
    String payload = http.getString();
    Serial.println("API响应: " + payload);

    // 检查是否是流式响应
    if (model.indexOf("omni") >= 0 && payload.indexOf("data:") >= 0) {
      Serial.println("处理流式响应...");
      // 解析流式响应
      String fullContent = "";
      int dataPos = 0;
      while ((dataPos = payload.indexOf("data:", dataPos)) >= 0) {
        dataPos += 5; // 跳过"data:"
        int lineEnd = payload.indexOf("\\n", dataPos);
        if (lineEnd < 0) lineEnd = payload.length();

        String dataLine = payload.substring(dataPos, lineEnd);
        dataLine.trim();

        if (dataLine == "[DONE]") break;
        if (dataLine.length() == 0) continue;

        // 解析JSON中的content
        int contentStart = dataLine.indexOf("\\"content\\":\\"") + 11;
        int contentEnd = dataLine.indexOf("\\"", contentStart);
        if (contentStart > 10 && contentEnd > contentStart) {
          String content = dataLine.substring(contentStart, contentEnd);
          fullContent += content;
        }
        dataPos = lineEnd + 1;
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
      // 普通响应解析
      int start = payload.indexOf("\\"content\\":\\"") + 11;
      int end = payload.indexOf("\\"", start);
      if (start > 10 && end > start) {
        response = payload.substring(start, end);
        Serial.println("解析成功，AI回复: " + response);
        qwen_last_success = true;
        qwen_last_error = "";
      } else {
        Serial.println("解析失败，无法找到content字段");
        qwen_last_success = false;
        qwen_last_error = "Parse error";
      }
    }
  } else {
    String errorResponse = http.getString();
    Serial.println("HTTP错误响应: " + errorResponse);
    qwen_last_success = false;
    qwen_last_error = "HTTP " + String(httpResponseCode);
  }

  http.end();
  Serial.println("=== 通义千问API调用结束 ===");
  return response;
}`);

  return '';
};

Arduino.forBlock['qwen_omni_chat'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  const code = `qwen_simple_request("${model}", ${message})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwen_omni_chat_with_history'] = function(block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');

  // 简化版本，暂时与普通对话相同
  const code = `qwen_simple_request("${model}", ${message})`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['qwen_omni_clear_history'] = function() {
  return '// Clear history - simplified version\n';
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

  // 添加图片对话函数
  generator.addFunction('qwen_vision_request', `
String qwen_vision_request(String model, String base64Image, String message) {
  Serial.println("=== 通义千问VL图片对话开始 ===");
  Serial.println("模型: " + model);
  Serial.println("提示词: " + message);

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("错误: WiFi未连接");
    qwen_last_success = false;
    qwen_last_error = "WiFi not connected";
    return "";
  }

  HTTPClient http;
  String url = qwen_base_url + "/chat/completions";
  http.begin(url);
  http.setTimeout(60000); // 60秒超时（图片处理需要更长时间）
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + qwen_api_key);

  // 构建JSON请求体
  String requestBody = "{\\"model\\":\\"" + model + "\\",\\"messages\\":[{\\"role\\":\\"user\\",\\"content\\":[";
  requestBody += "{\\"type\\":\\"image_url\\",\\"image_url\\":{\\"url\\":\\"data:image/jpeg;base64," + base64Image + "\\"}},";
  requestBody += "{\\"type\\":\\"text\\",\\"text\\":\\"" + message + "\\"}";
  requestBody += "]}]}";

  Serial.println("发送HTTP请求...");
  int httpResponseCode = http.POST(requestBody);
  Serial.println("HTTP响应码: " + String(httpResponseCode));
  String response = "";

  if (httpResponseCode == 200) {
    String payload = http.getString();
    Serial.println("API响应长度: " + String(payload.length()));

    // 解析响应
    int start = payload.indexOf("\\"content\\":\\"") + 11;
    int end = payload.indexOf("\\"", start);
    if (start > 10 && end > start) {
      response = payload.substring(start, end);
      Serial.println("解析成功，AI回复: " + response);
      qwen_last_success = true;
      qwen_last_error = "";
    } else {
      Serial.println("解析失败");
      qwen_last_success = false;
      qwen_last_error = "Parse error";
    }
  } else {
    String errorResponse = http.getString();
    Serial.println("HTTP错误: " + errorResponse);
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
