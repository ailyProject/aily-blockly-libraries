// DeepSeek AI API code generator for Aily Blockly.

function deepseek_ai_sanitize_text_code(code) {
  code = (code || '""').trim();
  if (code.length < 2 || code[0] !== '"' || code[code.length - 1] !== '"') {
    return code;
  }

  const body = code.slice(1, -1);
  let out = '';
  let slashCount = 0;
  for (const ch of body) {
    if (ch === '"' && (slashCount % 2) === 0) {
      out += '\\"';
    } else {
      out += ch;
    }
    slashCount = ch === '\\' ? slashCount + 1 : 0;
  }
  return `"${out}"`;
}

Arduino.forBlock['deepseek_ai_config'] = function(block, generator) {
  const apiKey = generator.valueToCode(block, 'API_KEY', Arduino.ORDER_ATOMIC) || '""';
  const baseUrl = generator.valueToCode(block, 'BASE_URL', Arduino.ORDER_ATOMIC) || '"https://api.deepseek.com"';

  generator.addLibrary('deepseek_ai_wifi', '#include <WiFi.h>');
  generator.addLibrary('deepseek_ai_http', '#include <HTTPClient.h>');
  generator.addLibrary('deepseek_ai_secure', '#include <WiFiClientSecure.h>');

  generator.addVariable('deepseek_ai_api_key', 'String deepseek_ai_api_key = ' + apiKey + ';');
  generator.addVariable('deepseek_ai_base_url', 'String deepseek_ai_base_url = ' + baseUrl + ';');
  generator.addVariable('deepseek_ai_system_prompt', 'String deepseek_ai_system_prompt = "";');
  generator.addVariable('deepseek_ai_history', 'String deepseek_ai_history = "";');
  generator.addVariable('deepseek_ai_last_success', 'bool deepseek_ai_last_success = false;');
  generator.addVariable('deepseek_ai_last_error', 'String deepseek_ai_last_error = "";');
  generator.addVariable('deepseek_ai_last_reasoning', 'String deepseek_ai_last_reasoning = "";');
  generator.addVariable('deepseek_ai_stream_chunk', 'String deepseek_ai_stream_chunk = "";');
  generator.addVariable('deepseek_ai_stream_callback', 'void (*deepseek_ai_stream_callback)(void) = NULL;');

  generator.addFunction('deepseek_ai_escape_json', String.raw`
String deepseek_ai_escape_json(String input) {
  input.replace("\\", "\\\\");
  input.replace("\"", "\\\"");
  input.replace("\n", "\\n");
  input.replace("\r", "\\r");
  input.replace("\t", "\\t");
  return input;
}`);

  generator.addFunction('deepseek_ai_hex_value', String.raw`
int deepseek_ai_hex_value(char ch) {
  if (ch >= '0' && ch <= '9') return ch - '0';
  if (ch >= 'a' && ch <= 'f') return ch - 'a' + 10;
  if (ch >= 'A' && ch <= 'F') return ch - 'A' + 10;
  return -1;
}`);

  generator.addFunction('deepseek_ai_read_hex4', String.raw`
int deepseek_ai_read_hex4(String input, int pos) {
  if (pos < 0 || pos + 3 >= (int)input.length()) return -1;
  int value = 0;
  for (int i = 0; i < 4; i++) {
    int nibble = deepseek_ai_hex_value(input.charAt(pos + i));
    if (nibble < 0) return -1;
    value = (value << 4) | nibble;
  }
  return value;
}`);

  generator.addFunction('deepseek_ai_append_utf8', String.raw`
void deepseek_ai_append_utf8(String &out, unsigned long codepoint) {
  if (codepoint <= 0x7F) {
    out += (char)codepoint;
  } else if (codepoint <= 0x7FF) {
    out += (char)(0xC0 | (codepoint >> 6));
    out += (char)(0x80 | (codepoint & 0x3F));
  } else if (codepoint <= 0xFFFF) {
    out += (char)(0xE0 | (codepoint >> 12));
    out += (char)(0x80 | ((codepoint >> 6) & 0x3F));
    out += (char)(0x80 | (codepoint & 0x3F));
  } else {
    out += (char)(0xF0 | (codepoint >> 18));
    out += (char)(0x80 | ((codepoint >> 12) & 0x3F));
    out += (char)(0x80 | ((codepoint >> 6) & 0x3F));
    out += (char)(0x80 | (codepoint & 0x3F));
  }
}`);

  generator.addFunction('deepseek_ai_unescape_json_string', String.raw`
String deepseek_ai_unescape_json_string(String input) {
  String out = "";
  out.reserve(input.length());
  bool escaped = false;
  for (int i = 0; i < (int)input.length(); i++) {
    char ch = input.charAt(i);
    if (escaped) {
      if (ch == 'n') {
        out += '\n';
      } else if (ch == 'r') {
        out += '\r';
      } else if (ch == 't') {
        out += '\t';
      } else if (ch == 'b') {
        out += '\b';
      } else if (ch == 'f') {
        out += '\f';
      } else if (ch == '"' || ch == '\\' || ch == '/') {
        out += ch;
      } else if (ch == 'u') {
        int high = deepseek_ai_read_hex4(input, i + 1);
        if (high >= 0) {
          unsigned long codepoint = (unsigned long)high;
          if (high >= 0xD800 && high <= 0xDBFF && i + 10 < (int)input.length() && input.charAt(i + 5) == '\\' && input.charAt(i + 6) == 'u') {
            int low = deepseek_ai_read_hex4(input, i + 7);
            if (low >= 0xDC00 && low <= 0xDFFF) {
              codepoint = 0x10000UL + (((unsigned long)high - 0xD800UL) << 10) + ((unsigned long)low - 0xDC00UL);
              i += 10;
            } else {
              i += 4;
            }
          } else {
            i += 4;
          }
          deepseek_ai_append_utf8(out, codepoint);
        } else {
          out += "\\u";
        }
      } else {
        out += ch;
      }
      escaped = false;
    } else if (ch == '\\') {
      escaped = true;
    } else {
      out += ch;
    }
  }
  if (escaped) out += '\\';
  return out;
}`);

  generator.addFunction('deepseek_ai_extract_json_string', String.raw`
String deepseek_ai_extract_json_string(String json, String key, int fromIndex) {
  String pattern = "\"" + key + "\":\"";
  int start = json.indexOf(pattern, fromIndex);
  if (start < 0) return "";
  start += pattern.length();
  String raw = "";
  raw.reserve(64);
  bool escaped = false;
  for (int i = start; i < (int)json.length(); i++) {
    char ch = json.charAt(i);
    if (escaped) {
      raw += '\\';
      raw += ch;
      escaped = false;
    } else if (ch == '\\') {
      escaped = true;
    } else if (ch == '"') {
      return deepseek_ai_unescape_json_string(raw);
    } else {
      raw += ch;
    }
  }
  return "";
}`);

  generator.addFunction('deepseek_ai_endpoint', String.raw`
String deepseek_ai_endpoint() {
  String base = deepseek_ai_base_url;
  base.trim();
  while (base.endsWith("/")) {
    base.remove(base.length() - 1);
  }
  return base + "/chat/completions";
}`);

  generator.addFunction('deepseek_ai_append_message_json', String.raw`
void deepseek_ai_append_message_json(String &messages, String role, String content, bool &hasAny) {
  if (hasAny) messages += ",";
  messages += "{\"role\":\"" + role + "\",\"content\":\"" + deepseek_ai_escape_json(content) + "\"}";
  hasAny = true;
}`);

  generator.addFunction('deepseek_ai_append_history_pair', String.raw`
void deepseek_ai_append_history_pair(String userMessage, String assistantMessage) {
  if (deepseek_ai_history.length() > 0) {
    deepseek_ai_history += ",";
  }
  deepseek_ai_history += "{\"role\":\"user\",\"content\":\"" + deepseek_ai_escape_json(userMessage) + "\"}";
  deepseek_ai_history += ",{\"role\":\"assistant\",\"content\":\"" + deepseek_ai_escape_json(assistantMessage) + "\"}";

  if (deepseek_ai_history.length() > 7000) {
    int cut = deepseek_ai_history.indexOf("},{", deepseek_ai_history.length() - 6000);
    if (cut > 0) {
      deepseek_ai_history = deepseek_ai_history.substring(cut + 2);
    }
  }
}`);

  generator.addFunction('deepseek_ai_build_body', String.raw`
String deepseek_ai_build_body(String model, String message, bool enableThinking, String reasoningEffort, bool useHistory, bool jsonMode, bool streamMode) {
  String messages = "";
  messages.reserve(deepseek_ai_system_prompt.length() + deepseek_ai_history.length() + message.length() + 256);
  bool hasAny = false;

  if (deepseek_ai_system_prompt.length() > 0) {
    deepseek_ai_append_message_json(messages, "system", deepseek_ai_system_prompt, hasAny);
  }
  if (useHistory && deepseek_ai_history.length() > 0) {
    if (hasAny) messages += ",";
    messages += deepseek_ai_history;
    hasAny = true;
  }
  deepseek_ai_append_message_json(messages, "user", message, hasAny);

  String requestBody = "{\"model\":\"" + model + "\",\"messages\":[" + messages + "]";
  requestBody.reserve(requestBody.length() + 256);
  requestBody += ",\"stream\":";
  requestBody += streamMode ? "true" : "false";
  requestBody += ",\"max_tokens\":";
  requestBody += String(enableThinking ? 4096 : 2048);

  if (model.startsWith("deepseek-v4")) {
    requestBody += ",\"thinking\":{\"type\":\"";
    requestBody += enableThinking ? "enabled" : "disabled";
    requestBody += "\"}";
    if (enableThinking && reasoningEffort.length() > 0) {
      requestBody += ",\"reasoning_effort\":\"" + deepseek_ai_escape_json(reasoningEffort) + "\"";
    }
  }

  if (jsonMode) {
    requestBody += ",\"response_format\":{\"type\":\"json_object\"}";
  }
  requestBody += "}";
  return requestBody;
}`);

  generator.addFunction('deepseek_ai_prepare_http', String.raw`
bool deepseek_ai_prepare_http(HTTPClient &http, WiFiClientSecure &client) {
  if (WiFi.status() != WL_CONNECTED) {
    deepseek_ai_last_success = false;
    deepseek_ai_last_error = "WiFi not connected";
    return false;
  }

  client.setInsecure();
  if (!http.begin(client, deepseek_ai_endpoint())) {
    deepseek_ai_last_success = false;
    deepseek_ai_last_error = "HTTP begin failed";
    return false;
  }
  http.setReuse(false);
  http.setTimeout(120000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + deepseek_ai_api_key);
  return true;
}`);

  generator.addFunction('deepseek_ai_request', String.raw`
String deepseek_ai_request(String model, String message, bool enableThinking, String reasoningEffort, bool useHistory, bool jsonMode) {
  deepseek_ai_last_success = false;
  deepseek_ai_last_error = "";
  deepseek_ai_last_reasoning = "";
  deepseek_ai_stream_chunk = "";

  HTTPClient http;
  WiFiClientSecure client;
  if (!deepseek_ai_prepare_http(http, client)) {
    return "";
  }

  String requestBody = deepseek_ai_build_body(model, message, enableThinking, reasoningEffort, useHistory, jsonMode, false);
  Serial.println("[DeepSeek] request start");
  int httpCode = http.POST(requestBody);
  Serial.println("[DeepSeek] HTTP: " + String(httpCode));

  String response = "";
  if (httpCode == 200) {
    String body = http.getString();
    deepseek_ai_last_reasoning = deepseek_ai_extract_json_string(body, "reasoning_content", 0);
    response = deepseek_ai_extract_json_string(body, "content", 0);
    if (response.length() > 0 || deepseek_ai_last_reasoning.length() > 0) {
      deepseek_ai_last_success = true;
      if (useHistory && response.length() > 0) {
        deepseek_ai_append_history_pair(message, response);
      }
    } else {
      deepseek_ai_last_error = "No content in response";
    }
  } else {
    String body = http.getString();
    if (body.length() > 160) body = body.substring(0, 160);
    deepseek_ai_last_error = "HTTP " + String(httpCode) + ": " + body;
  }

  http.end();
  return response;
}`);

  generator.addFunction('deepseek_ai_stream_request', String.raw`
String deepseek_ai_stream_request(String model, String message, bool enableThinking, String reasoningEffort, bool useHistory, bool jsonMode) {
  deepseek_ai_last_success = false;
  deepseek_ai_last_error = "";
  deepseek_ai_last_reasoning = "";
  deepseek_ai_stream_chunk = "";

  HTTPClient http;
  WiFiClientSecure client;
  if (!deepseek_ai_prepare_http(http, client)) {
    return "";
  }

  String requestBody = deepseek_ai_build_body(model, message, enableThinking, reasoningEffort, useHistory, jsonMode, true);
  Serial.println("[DeepSeek] stream request start");
  int httpCode = http.POST(requestBody);
  Serial.println("[DeepSeek] HTTP: " + String(httpCode));

  String fullContent = "";
  if (httpCode == 200) {
    WiFiClient *stream = http.getStreamPtr();
    String line = "";
    line.reserve(256);
    bool done = false;
    unsigned long lastByteAt = millis();

    while (http.connected() || stream->available()) {
      if (stream->available()) {
        char ch = stream->read();
        lastByteAt = millis();

        if (ch == '\n') {
          line.trim();
          if (line.startsWith("data:")) {
            String data = line.substring(5);
            data.trim();

            if (data == "[DONE]") {
              done = true;
              break;
            }

            String reasoning = deepseek_ai_extract_json_string(data, "reasoning_content", 0);
            if (reasoning.length() > 0) {
              deepseek_ai_last_reasoning += reasoning;
            }

            String content = deepseek_ai_extract_json_string(data, "content", 0);
            if (content.length() > 0) {
              fullContent += content;
              deepseek_ai_stream_chunk = content;
              if (deepseek_ai_stream_callback != NULL) {
                deepseek_ai_stream_callback();
              }
            }
          }
          line = "";
        } else if (ch != '\r') {
          line += ch;
          if (line.length() > 2048) {
            line = "";
          }
        }
      } else {
        if (millis() - lastByteAt > 60000) {
          deepseek_ai_last_error = "Stream timeout";
          break;
        }
        delay(1);
      }
    }

    if (fullContent.length() > 0 || deepseek_ai_last_reasoning.length() > 0) {
      deepseek_ai_last_success = true;
      if (!done && deepseek_ai_last_error.length() == 0) {
        deepseek_ai_last_error = "Stream ended before DONE";
      }
      if (useHistory && fullContent.length() > 0) {
        deepseek_ai_append_history_pair(message, fullContent);
      }
    } else if (deepseek_ai_last_error.length() == 0) {
      deepseek_ai_last_error = "No stream content";
    }
  } else {
    String body = http.getString();
    if (body.length() > 160) body = body.substring(0, 160);
    deepseek_ai_last_error = "HTTP " + String(httpCode) + ": " + body;
  }

  http.end();
  return fullContent;
}`);

  return '';
};

Arduino.forBlock['deepseek_ai_set_system_prompt'] = function(block, generator) {
  const systemPrompt = deepseek_ai_sanitize_text_code(generator.valueToCode(block, 'SYSTEM_PROMPT', Arduino.ORDER_ATOMIC) || '""');
  return `deepseek_ai_system_prompt = ${systemPrompt};\n`;
};

Arduino.forBlock['deepseek_ai_chat'] = function(block, generator) {
  const message = deepseek_ai_sanitize_text_code(generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""');
  const model = block.getFieldValue('MODEL');
  return [`deepseek_ai_request("${model}", ${message}, false, "", false, false)`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['deepseek_ai_thinking_chat'] = function(block, generator) {
  const message = deepseek_ai_sanitize_text_code(generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""');
  const model = block.getFieldValue('MODEL');
  const effort = block.getFieldValue('EFFORT') || 'high';
  return [`deepseek_ai_request("${model}", ${message}, true, "${effort}", false, false)`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['deepseek_ai_history_chat'] = function(block, generator) {
  const message = deepseek_ai_sanitize_text_code(generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""');
  const model = block.getFieldValue('MODEL');
  return [`deepseek_ai_request("${model}", ${message}, false, "", true, false)`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['deepseek_ai_json_chat'] = function(block, generator) {
  const message = deepseek_ai_sanitize_text_code(generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""');
  const model = block.getFieldValue('MODEL');
  return [`deepseek_ai_request("${model}", ${message}, false, "", false, true)`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['deepseek_ai_stream_chat'] = function(block, generator) {
  const message = deepseek_ai_sanitize_text_code(generator.valueToCode(block, 'MESSAGE', Arduino.ORDER_ATOMIC) || '""');
  const model = block.getFieldValue('MODEL');
  return `deepseek_ai_stream_request("${model}", ${message}, false, "", false, false);\n`;
};

Arduino.forBlock['deepseek_ai_set_stream_callback'] = function(block, generator) {
  const callback = generator.statementToCode(block, 'CALLBACK');

  generator.addFunction('deepseek_ai_user_stream_callback', `
void deepseek_ai_user_stream_callback() {
${callback}}`);

  return 'deepseek_ai_stream_callback = deepseek_ai_user_stream_callback;\n';
};

Arduino.forBlock['deepseek_ai_get_stream_chunk'] = function() {
  return ['deepseek_ai_stream_chunk', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['deepseek_ai_clear_stream_callback'] = function() {
  return 'deepseek_ai_stream_callback = NULL;\n';
};

Arduino.forBlock['deepseek_ai_clear_history'] = function() {
  return 'deepseek_ai_history = "";\n';
};

Arduino.forBlock['deepseek_ai_get_response_status'] = function() {
  return ['deepseek_ai_last_success', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['deepseek_ai_get_error_message'] = function() {
  return ['deepseek_ai_last_error', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['deepseek_ai_get_reasoning'] = function() {
  return ['deepseek_ai_last_reasoning', Arduino.ORDER_ATOMIC];
};
