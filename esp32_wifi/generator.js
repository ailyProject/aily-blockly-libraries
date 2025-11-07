// ESP32 WiFi库代码生成器

// WiFi连接
Arduino.forBlock['esp32_wifi_begin'] = function(block, generator) {
    const ssid = generator.valueToCode(block, 'SSID', Arduino.ORDER_ATOMIC) || '""';
    const password = generator.valueToCode(block, 'PASSWORD', Arduino.ORDER_ATOMIC) || '""';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = `WiFi.begin(${ssid}, ${password});\n`;
    return code;
};

// WiFi连接状态
Arduino.forBlock['esp32_wifi_status'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = 'WiFi.status()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// WiFi已连接
Arduino.forBlock['esp32_wifi_connected'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = '(WiFi.status() == WL_CONNECTED)';
    return [code, Arduino.ORDER_RELATIONAL];
};

// 断开WiFi连接
Arduino.forBlock['esp32_wifi_disconnect'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = 'WiFi.disconnect();\n';
    return code;
};

// 获取本地IP地址
Arduino.forBlock['esp32_wifi_local_ip'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = 'WiFi.localIP().toString()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 获取信号强度
Arduino.forBlock['esp32_wifi_rssi'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = 'WiFi.RSSI()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 扫描WiFi网络
Arduino.forBlock['esp32_wifi_scan'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = 'WiFi.scanNetworks()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 获取扫描结果
Arduino.forBlock['esp32_wifi_get_scan_result'] = function(block, generator) {
    const index = generator.valueToCode(block, 'INDEX', Arduino.ORDER_ATOMIC) || '0';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = `WiFi.SSID(${index})`;
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 创建WiFi热点
Arduino.forBlock['esp32_wifi_ap_mode'] = function(block, generator) {
    const ssid = generator.valueToCode(block, 'SSID', Arduino.ORDER_ATOMIC) || '""';
    const password = generator.valueToCode(block, 'PASSWORD', Arduino.ORDER_ATOMIC) || '""';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = `WiFi.softAP(${ssid}, ${password});\n`;
    return code;
};

// 获取热点IP地址
Arduino.forBlock['esp32_wifi_ap_ip'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const code = 'WiFi.softAPIP().toString()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 连接到服务器
Arduino.forBlock['esp32_wifi_client_connect'] = function(block, generator) {
    const host = generator.valueToCode(block, 'HOST', Arduino.ORDER_ATOMIC) || '""';
    const port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC) || '80';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient wifiClient', 'NetworkClient wifiClient;');
    
    const code = `wifiClient.connect(${host}, ${port})`;
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 发送数据
Arduino.forBlock['esp32_wifi_client_print'] = function(block, generator) {
    const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '""';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient wifiClient', 'NetworkClient wifiClient;');
    
    const code = `wifiClient.print(${data});\n`;
    return code;
};

// 客户端有数据可读
Arduino.forBlock['esp32_wifi_client_available'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient wifiClient', 'NetworkClient wifiClient;');
    
    const code = 'wifiClient.available()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取服务器响应
Arduino.forBlock['esp32_wifi_client_read_string'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient wifiClient', 'NetworkClient wifiClient;');
    
    const code = 'wifiClient.readString()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 关闭客户端连接
Arduino.forBlock['esp32_wifi_client_stop'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient wifiClient', 'NetworkClient wifiClient;');
    
    const code = 'wifiClient.stop();\n';
    return code;
};

// HTTP GET请求
Arduino.forBlock['esp32_wifi_http_get'] = function(block, generator) {
    const url = generator.valueToCode(block, 'URL', Arduino.ORDER_ATOMIC) || '""';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <HTTPClient.h>', '#include <HTTPClient.h>');
    generator.addVariable('HTTPClient http', 'HTTPClient http;');
    
    generator.addFunction('esp32_wifi_http_get_function', 
        'String httpGET(String url) {\n' +
        '  http.begin(url);\n' +
        '  int httpCode = http.GET();\n' +
        '  String payload = "";\n' +
        '  if (httpCode > 0) {\n' +
        '    payload = http.getString();\n' +
        '  }\n' +
        '  http.end();\n' +
        '  return payload;\n' +
        '}\n'
    );
    
    const code = `httpGET(${url})`;
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// HTTP POST请求
Arduino.forBlock['esp32_wifi_http_post'] = function(block, generator) {
    const url = generator.valueToCode(block, 'URL', Arduino.ORDER_ATOMIC) || '""';
    const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '""';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <HTTPClient.h>', '#include <HTTPClient.h>');
    generator.addVariable('HTTPClient http', 'HTTPClient http;');
    
    generator.addFunction('esp32_wifi_http_post_function', 
        'String httpPOST(String url, String data) {\n' +
        '  http.begin(url);\n' +
        '  http.addHeader("Content-Type", "application/x-www-form-urlencoded");\n' +
        '  int httpCode = http.POST(data);\n' +
        '  String payload = "";\n' +
        '  if (httpCode > 0) {\n' +
        '    payload = http.getString();\n' +
        '  }\n' +
        '  http.end();\n' +
        '  return payload;\n' +
        '}\n'
    );
    
    const code = `httpPOST(${url}, ${data})`;
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// HTTP POST JSON请求
Arduino.forBlock['esp32_wifi_http_post_json'] = function(block, generator) {
    const url = generator.valueToCode(block, 'URL', Arduino.ORDER_ATOMIC) || '""';
    const jsonData = generator.valueToCode(block, 'JSON_DATA', Arduino.ORDER_ATOMIC) || '""';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <HTTPClient.h>', '#include <HTTPClient.h>');
    generator.addVariable('HTTPClient http', 'HTTPClient http;');
    
    generator.addFunction('esp32_wifi_http_post_json_function', 
        'String httpPOSTJSON(String url, String jsonData) {\n' +
        '  http.begin(url);\n' +
        '  http.addHeader("Content-Type", "application/json");\n' +
        '  int httpCode = http.POST(jsonData);\n' +
        '  String payload = "";\n' +
        '  if (httpCode > 0) {\n' +
        '    payload = http.getString();\n' +
        '  }\n' +
        '  http.end();\n' +
        '  return payload;\n' +
        '}\n'
    );
    
    const code = `httpPOSTJSON(${url}, ${jsonData})`;
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 通用HTTP请求
Arduino.forBlock['esp32_wifi_http_request'] = function(block, generator) {
    const method = block.getFieldValue('METHOD');
    const url = generator.valueToCode(block, 'URL', Arduino.ORDER_ATOMIC) || '""';
    const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '""';
    const contentType = generator.valueToCode(block, 'CONTENT_TYPE', Arduino.ORDER_ATOMIC) || '"application/x-www-form-urlencoded"';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <HTTPClient.h>', '#include <HTTPClient.h>');
    generator.addVariable('HTTPClient http', 'HTTPClient http;');
    
    generator.addFunction('esp32_wifi_http_request_function', 
        'String httpRequest(String method, String url, String data, String contentType) {\n' +
        '  http.begin(url);\n' +
        '  if (data.length() > 0) {\n' +
        '    http.addHeader("Content-Type", contentType);\n' +
        '  }\n' +
        '  int httpCode = -1;\n' +
        '  if (method == "GET") {\n' +
        '    httpCode = http.GET();\n' +
        '  } else if (method == "POST") {\n' +
        '    httpCode = http.POST(data);\n' +
        '  } else if (method == "PUT") {\n' +
        '    httpCode = http.PUT(data);\n' +
        '  } else if (method == "DELETE") {\n' +
        '    httpCode = http.sendRequest("DELETE", data);\n' +
        '  } else if (method == "PATCH") {\n' +
        '    httpCode = http.PATCH(data);\n' +
        '  }\n' +
        '  String payload = "";\n' +
        '  if (httpCode > 0) {\n' +
        '    payload = http.getString();\n' +
        '  }\n' +
        '  http.end();\n' +
        '  return payload;\n' +
        '}\n'
    );
    
    const code = `httpRequest("${method}", ${url}, ${data}, ${contentType})`;
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// WiFi事件处理
Arduino.forBlock['esp32_wifi_event_handler'] = function(block, generator) {
    const event = block.getFieldValue('EVENT');
    const handler = generator.statementToCode(block, 'HANDLER');
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    
    const functionName = `wifiEvent_${event.replace(/ARDUINO_EVENT_WIFI_STA_/, '').toLowerCase()}`;
    
    generator.addFunction(`${functionName}_function`,
        `void ${functionName}(WiFiEvent_t event, WiFiEventInfo_t info) {\n${handler}}\n`
    );
    
    generator.addSetupBegin(`wifi_event_${event}`, `WiFi.onEvent(${functionName}, ${event});\n`);
    
    return '';
};

// NTP时钟功能

// 初始化NTP时钟（基础版本）
Arduino.forBlock['esp32_wifi_ntp_begin'] = function(block, generator) {
    const ntpServer = generator.valueToCode(block, 'NTP_SERVER', Arduino.ORDER_ATOMIC) || '"pool.ntp.org"';
    const timezoneOffset = generator.valueToCode(block, 'TIMEZONE_OFFSET', Arduino.ORDER_ATOMIC) || '8';

    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <time.h>', '#include <time.h>');

    // 添加NTP初始化函数
    generator.addFunction('ntp_init_function',
        'void initNTP(const char* ntpServer, long timezoneOffset) {\n' +
        '  configTime(timezoneOffset * 3600, 0, ntpServer);\n' +
        '  Serial.println("正在同步NTP时间...");\n' +
        '  struct tm timeinfo;\n' +
        '  int retry = 0;\n' +
        '  while (!getLocalTime(&timeinfo) && retry < 10) {\n' +
        '    delay(1000);\n' +
        '    retry++;\n' +
        '    Serial.print(".");\n' +
        '  }\n' +
        '  if (retry < 10) {\n' +
        '    Serial.println("\\nNTP时间同步成功!");\n' +
        '  } else {\n' +
        '    Serial.println("\\nNTP时间同步失败!");\n' +
        '  }\n' +
        '}\n'
    );

    const code = `initNTP(${ntpServer}, ${timezoneOffset});\n`;
    return code;
};

// 初始化NTP时钟（高级版本）
Arduino.forBlock['esp32_wifi_ntp_begin_advanced'] = function(block, generator) {
    const ntpServer = generator.valueToCode(block, 'NTP_SERVER', Arduino.ORDER_ATOMIC) || '"pool.ntp.org"';
    const timezoneOffset = generator.valueToCode(block, 'TIMEZONE_OFFSET', Arduino.ORDER_ATOMIC) || '8';
    const daylightOffset = generator.valueToCode(block, 'DAYLIGHT_OFFSET', Arduino.ORDER_ATOMIC) || '0';

    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <time.h>', '#include <time.h>');

    // 添加高级NTP初始化函数
    generator.addFunction('ntp_init_advanced_function',
        'void initNTPAdvanced(const char* ntpServer, long timezoneOffset, int daylightOffset) {\n' +
        '  configTime(timezoneOffset * 3600, daylightOffset * 3600, ntpServer);\n' +
        '  Serial.println("正在同步NTP时间...");\n' +
        '  struct tm timeinfo;\n' +
        '  int retry = 0;\n' +
        '  while (!getLocalTime(&timeinfo) && retry < 10) {\n' +
        '    delay(1000);\n' +
        '    retry++;\n' +
        '    Serial.print(".");\n' +
        '  }\n' +
        '  if (retry < 10) {\n' +
        '    Serial.println("\\nNTP时间同步成功!");\n' +
        '  } else {\n' +
        '    Serial.println("\\nNTP时间同步失败!");\n' +
        '  }\n' +
        '}\n'
    );

    const code = `initNTPAdvanced(${ntpServer}, ${timezoneOffset}, ${daylightOffset});\n`;
    return code;
};

// 获取当前时间
Arduino.forBlock['esp32_wifi_get_time'] = function(block, generator) {
    const format = block.getFieldValue('FORMAT');

    generator.addLibrary('#include <time.h>', '#include <time.h>');

    // 添加时间获取函数
    generator.addFunction('get_time_function',
        'String getTimeString(String format) {\n' +
        '  struct tm timeinfo;\n' +
        '  if (!getLocalTime(&timeinfo)) {\n' +
        '    return "时间未同步";\n' +
        '  }\n' +
        '  \n' +
        '  if (format == "FULL") {\n' +
        '    char timeStr[64];\n' +
        '    strftime(timeStr, sizeof(timeStr), "%Y-%m-%d %H:%M:%S", &timeinfo);\n' +
        '    return String(timeStr);\n' +
        '  } else if (format == "YEAR") {\n' +
        '    return String(timeinfo.tm_year + 1900);\n' +
        '  } else if (format == "MONTH") {\n' +
        '    return String(timeinfo.tm_mon + 1);\n' +
        '  } else if (format == "DAY") {\n' +
        '    return String(timeinfo.tm_mday);\n' +
        '  } else if (format == "HOUR") {\n' +
        '    return String(timeinfo.tm_hour);\n' +
        '  } else if (format == "MINUTE") {\n' +
        '    return String(timeinfo.tm_min);\n' +
        '  } else if (format == "SECOND") {\n' +
        '    return String(timeinfo.tm_sec);\n' +
        '  } else if (format == "WEEKDAY") {\n' +
        '    const char* weekdays[] = {"星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"};\n' +
        '    return String(weekdays[timeinfo.tm_wday]);\n' +
        '  } else if (format == "TIMESTAMP") {\n' +
        '    return String(mktime(&timeinfo));\n' +
        '  }\n' +
        '  return "未知格式";\n' +
        '}\n'
    );

    const code = `getTimeString("${format}")`;
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 获取格式化时间
Arduino.forBlock['esp32_wifi_get_formatted_time'] = function(block, generator) {
    const formatString = generator.valueToCode(block, 'FORMAT_STRING', Arduino.ORDER_ATOMIC) || '"%Y-%m-%d %H:%M:%S"';

    generator.addLibrary('#include <time.h>', '#include <time.h>');

    // 添加格式化时间函数
    generator.addFunction('get_formatted_time_function',
        'String getFormattedTime(const char* format) {\n' +
        '  struct tm timeinfo;\n' +
        '  if (!getLocalTime(&timeinfo)) {\n' +
        '    return "时间未同步";\n' +
        '  }\n' +
        '  char timeStr[128];\n' +
        '  strftime(timeStr, sizeof(timeStr), format, &timeinfo);\n' +
        '  return String(timeStr);\n' +
        '}\n'
    );

    const code = `getFormattedTime(${formatString})`;
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 检查NTP时间是否已同步
Arduino.forBlock['esp32_wifi_ntp_synced'] = function(block, generator) {
    generator.addLibrary('#include <time.h>', '#include <time.h>');

    // 添加同步检查函数
    generator.addFunction('ntp_synced_function',
        'bool isNTPSynced() {\n' +
        '  struct tm timeinfo;\n' +
        '  return getLocalTime(&timeinfo);\n' +
        '}\n'
    );

    const code = 'isNTPSynced()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 获取Unix时间戳
Arduino.forBlock['esp32_wifi_get_epoch_time'] = function(block, generator) {
    generator.addLibrary('#include <time.h>', '#include <time.h>');

    // 添加时间戳获取函数
    generator.addFunction('get_epoch_time_function',
        'unsigned long getEpochTime() {\n' +
        '  struct tm timeinfo;\n' +
        '  if (!getLocalTime(&timeinfo)) {\n' +
        '    return 0;\n' +
        '  }\n' +
        '  return mktime(&timeinfo);\n' +
        '}\n'
    );

    const code = 'getEpochTime()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 设置时区
Arduino.forBlock['esp32_wifi_set_timezone'] = function(block, generator) {
    const timezone = block.getFieldValue('TIMEZONE');

    generator.addLibrary('#include <time.h>', '#include <time.h>');

    if (timezone === 'CUSTOM') {
        // 如果选择自定义，不生成代码，需要用户使用自定义时区块
        return '// 请使用"设置自定义时区"积木块\n';
    }

    const code = `setenv("TZ", "${timezone}", 1);\ntzset();\n`;
    return code;
};

// 设置自定义时区
Arduino.forBlock['esp32_wifi_set_custom_timezone'] = function(block, generator) {
    const timezoneString = generator.valueToCode(block, 'TIMEZONE_STRING', Arduino.ORDER_ATOMIC) || '"CST-8"';

    generator.addLibrary('#include <time.h>', '#include <time.h>');

    const code = `setenv("TZ", ${timezoneString}, 1);\ntzset();\n`;
    return code;
};

// 扩展：简化的WiFi连接块
if (Blockly.Extensions.isRegistered('esp32_wifi_simple_connect_extension')) {
    Blockly.Extensions.unregister('esp32_wifi_simple_connect_extension');
}

Blockly.Extensions.register('esp32_wifi_simple_connect_extension', function() {
    // 可以添加额外的验证或行为
});

// ==================== TCP服务器相关 ====================

// 启动TCP服务器
Arduino.forBlock['esp32_wifi_tcp_server_begin'] = function(block, generator) {
    const port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC) || '80';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkServer tcpServer', `NetworkServer tcpServer(${port});`);
    generator.addVariable('NetworkClient tcpServerClient', 'NetworkClient tcpServerClient;');
    
    generator.addSetupEnd('tcp_server_begin', 'tcpServer.begin();\n');
    
    return '';
};

// 接受客户端连接
Arduino.forBlock['esp32_wifi_tcp_server_accept'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkServer tcpServer', 'NetworkServer tcpServer(80);');
    generator.addVariable('NetworkClient tcpServerClient', 'NetworkClient tcpServerClient;');
    
    const code = '(tcpServerClient = tcpServer.accept())';
    return [code, Arduino.ORDER_ASSIGNMENT];
};

// 检查服务器客户端连接状态
Arduino.forBlock['esp32_wifi_tcp_server_connected'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient tcpServerClient', 'NetworkClient tcpServerClient;');
    
    const code = 'tcpServerClient.connected()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 检查服务器是否有数据可读
Arduino.forBlock['esp32_wifi_tcp_server_available'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient tcpServerClient', 'NetworkClient tcpServerClient;');
    
    const code = 'tcpServerClient.available()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 从服务器客户端读取数据
Arduino.forBlock['esp32_wifi_tcp_server_read'] = function(block, generator) {
    const readType = block.getFieldValue('READ_TYPE');
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient tcpServerClient', 'NetworkClient tcpServerClient;');
    
    let code;
    if (readType === 'STRING') {
        code = 'tcpServerClient.readString()';
    } else if (readType === 'BYTE') {
        code = '(char)tcpServerClient.read()';
    } else if (readType === 'LINE') {
        code = 'tcpServerClient.readStringUntil(\'\\n\')';
    }
    
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 服务器发送数据
Arduino.forBlock['esp32_wifi_tcp_server_write'] = function(block, generator) {
    const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '""';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient tcpServerClient', 'NetworkClient tcpServerClient;');
    
    const code = `tcpServerClient.print(${data});\n`;
    return code;
};

// 服务器发送数据并换行
Arduino.forBlock['esp32_wifi_tcp_server_println'] = function(block, generator) {
    const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '""';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient tcpServerClient', 'NetworkClient tcpServerClient;');
    
    const code = `tcpServerClient.println(${data});\n`;
    return code;
};

// 断开服务器客户端连接
Arduino.forBlock['esp32_wifi_tcp_server_stop_client'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient tcpServerClient', 'NetworkClient tcpServerClient;');
    
    const code = 'tcpServerClient.stop();\n';
    return code;
};

// ==================== TCP客户端相关 ====================

// TCP客户端连接
Arduino.forBlock['esp32_wifi_tcp_client_connect'] = function(block, generator) {
    const host = generator.valueToCode(block, 'HOST', Arduino.ORDER_ATOMIC) || '""';
    const port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC) || '80';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient tcpClient', 'NetworkClient tcpClient;');
    
    const code = `tcpClient.connect(${host}, ${port})`;
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// TCP客户端连接状态
Arduino.forBlock['esp32_wifi_tcp_client_connected'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient tcpClient', 'NetworkClient tcpClient;');
    
    const code = 'tcpClient.connected()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// TCP客户端有数据可读
Arduino.forBlock['esp32_wifi_tcp_client_available'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient tcpClient', 'NetworkClient tcpClient;');
    
    const code = 'tcpClient.available()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// TCP客户端读取数据
Arduino.forBlock['esp32_wifi_tcp_client_read'] = function(block, generator) {
    const readType = block.getFieldValue('READ_TYPE');
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient tcpClient', 'NetworkClient tcpClient;');
    
    let code;
    if (readType === 'STRING') {
        code = 'tcpClient.readString()';
    } else if (readType === 'BYTE') {
        code = 'String((char)tcpClient.read())';
    } else if (readType === 'LINE') {
        code = 'tcpClient.readStringUntil(\'\\n\')';
    }
    
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// TCP客户端发送数据
Arduino.forBlock['esp32_wifi_tcp_client_write'] = function(block, generator) {
    const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '""';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient tcpClient', 'NetworkClient tcpClient;');
    
    const code = `tcpClient.print(${data});\n`;
    return code;
};

// TCP客户端发送数据并换行
Arduino.forBlock['esp32_wifi_tcp_client_println'] = function(block, generator) {
    const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '""';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient tcpClient', 'NetworkClient tcpClient;');
    
    const code = `tcpClient.println(${data});\n`;
    return code;
};

// TCP客户端断开连接
Arduino.forBlock['esp32_wifi_tcp_client_stop'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addVariable('NetworkClient tcpClient', 'NetworkClient tcpClient;');
    
    const code = 'tcpClient.stop();\n';
    return code;
};

// ==================== UDP通信相关 ====================

// 初始化UDP
Arduino.forBlock['esp32_wifi_udp_begin'] = function(block, generator) {
    const port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC) || '8888';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <NetworkUdp.h>', '#include <NetworkUdp.h>');
    generator.addVariable('NetworkUDP udp', 'NetworkUDP udp;');
    
    const code = `udp.begin(${port});\n`;
    return code;
};

// 开始UDP数据包
Arduino.forBlock['esp32_wifi_udp_begin_packet'] = function(block, generator) {
    const ip = generator.valueToCode(block, 'IP', Arduino.ORDER_ATOMIC) || '"192.168.1.100"';
    const port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC) || '8888';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <NetworkUdp.h>', '#include <NetworkUdp.h>');
    generator.addVariable('NetworkUDP udp', 'NetworkUDP udp;');
    
    const code = `udp.beginPacket(${ip}, ${port});\n`;
    return code;
};

// UDP写入数据
Arduino.forBlock['esp32_wifi_udp_write'] = function(block, generator) {
    const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '""';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <NetworkUdp.h>', '#include <NetworkUdp.h>');
    generator.addVariable('NetworkUDP udp', 'NetworkUDP udp;');
    
    const code = `udp.print(${data});\n`;
    return code;
};

// 发送UDP数据包
Arduino.forBlock['esp32_wifi_udp_end_packet'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <NetworkUdp.h>', '#include <NetworkUdp.h>');
    generator.addVariable('NetworkUDP udp', 'NetworkUDP udp;');
    
    const code = 'udp.endPacket();\n';
    return code;
};

// 发送UDP数据包（简化版）
Arduino.forBlock['esp32_wifi_udp_send_packet'] = function(block, generator) {
    const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '""';
    const ip = generator.valueToCode(block, 'IP', Arduino.ORDER_ATOMIC) || '"192.168.1.100"';
    const port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC) || '8888';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <NetworkUdp.h>', '#include <NetworkUdp.h>');
    generator.addVariable('NetworkUDP udp', 'NetworkUDP udp;');
    
    const code = `udp.beginPacket(${ip}, ${port});\n` +
                 `udp.print(${data});\n` +
                 `udp.endPacket();\n`;
    return code;
};

// 检查UDP数据包
Arduino.forBlock['esp32_wifi_udp_parse_packet'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <NetworkUdp.h>', '#include <NetworkUdp.h>');
    generator.addVariable('NetworkUDP udp', 'NetworkUDP udp;');
    
    const code = 'udp.parsePacket()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// UDP可读字节数
Arduino.forBlock['esp32_wifi_udp_available'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <NetworkUdp.h>', '#include <NetworkUdp.h>');
    generator.addVariable('NetworkUDP udp', 'NetworkUDP udp;');
    
    const code = 'udp.available()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 读取UDP数据
Arduino.forBlock['esp32_wifi_udp_read'] = function(block, generator) {
    const readType = block.getFieldValue('READ_TYPE');
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <NetworkUdp.h>', '#include <NetworkUdp.h>');
    generator.addVariable('NetworkUDP udp', 'NetworkUDP udp;');
    
    let code;
    if (readType === 'STRING') {
        // 添加读取字符串函数
        generator.addFunction('udp_read_string_function',
            'String udpReadString() {\n' +
            '  String data = "";\n' +
            '  int len = udp.available();\n' +
            '  if (len > 0) {\n' +
            '    char buffer[len + 1];\n' +
            '    udp.read(buffer, len);\n' +
            '    buffer[len] = 0;\n' +
            '    data = String(buffer);\n' +
            '  }\n' +
            '  return data;\n' +
            '}\n'
        );
        code = 'udpReadString()';
    } else if (readType === 'BYTE') {
        code = 'String((char)udp.read())';
    }
    
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// UDP远程IP地址
Arduino.forBlock['esp32_wifi_udp_remote_ip'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <NetworkUdp.h>', '#include <NetworkUdp.h>');
    generator.addVariable('NetworkUDP udp', 'NetworkUDP udp;');
    
    const code = 'udp.remoteIP().toString()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// UDP远程端口
Arduino.forBlock['esp32_wifi_udp_remote_port'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <NetworkUdp.h>', '#include <NetworkUdp.h>');
    generator.addVariable('NetworkUDP udp', 'NetworkUDP udp;');
    
    const code = 'udp.remotePort()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 停止UDP
Arduino.forBlock['esp32_wifi_udp_stop'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <NetworkUdp.h>', '#include <NetworkUdp.h>');
    generator.addVariable('NetworkUDP udp', 'NetworkUDP udp;');
    
    const code = 'udp.stop();\n';
    return code;
};

// UDP广播
Arduino.forBlock['esp32_wifi_udp_broadcast'] = function(block, generator) {
    const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '""';
    const port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC) || '8888';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <NetworkUdp.h>', '#include <NetworkUdp.h>');
    generator.addVariable('NetworkUDP udp', 'NetworkUDP udp;');
    
    // 添加广播函数
    generator.addFunction('udp_broadcast_function',
        'void udpBroadcast(String data, int port) {\n' +
        '  IPAddress broadcastIP = WiFi.localIP();\n' +
        '  broadcastIP[3] = 255;\n' +
        '  udp.beginPacket(broadcastIP, port);\n' +
        '  udp.print(data);\n' +
        '  udp.endPacket();\n' +
        '}\n'
    );
    
    const code = `udpBroadcast(${data}, ${port});\n`;
    return code;
};

// ==================== 异步UDP相关 ====================

// 初始化异步UDP
Arduino.forBlock['esp32_wifi_async_udp_begin'] = function(block, generator) {
    const port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC) || '1234';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <AsyncUDP.h>', '#include <AsyncUDP.h>');
    generator.addVariable('AsyncUDP asyncUdp', 'AsyncUDP asyncUdp;');
    
    return '';
};

// 异步UDP监听
Arduino.forBlock['esp32_wifi_async_udp_listen'] = function(block, generator) {
    const port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC) || '1234';
    const callback = generator.statementToCode(block, 'CALLBACK');
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <AsyncUDP.h>', '#include <AsyncUDP.h>');
    generator.addVariable('AsyncUDP asyncUdp', 'AsyncUDP asyncUdp;');
    generator.addVariable('AsyncUDPPacket asyncUdpPacket', 'AsyncUDPPacket asyncUdpPacket;');
    
    // 添加回调处理函数
    const functionName = 'asyncUdpCallback';
    generator.addFunction(`${functionName}_function`,
        `void ${functionName}(AsyncUDPPacket packet) {\n` +
        `  asyncUdpPacket = packet;\n` +
        callback +
        `}\n`
    );
    
    const code = `if (asyncUdp.listen(${port})) {\n` +
                 `  asyncUdp.onPacket(${functionName});\n` +
                 `}\n`;
    return code;
};

// 异步UDP发送
Arduino.forBlock['esp32_wifi_async_udp_send'] = function(block, generator) {
    const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '""';
    const ip = generator.valueToCode(block, 'IP', Arduino.ORDER_ATOMIC) || '"192.168.1.100"';
    const port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC) || '1234';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <AsyncUDP.h>', '#include <AsyncUDP.h>');
    generator.addVariable('AsyncUDP asyncUdp', 'AsyncUDP asyncUdp;');
    
    // 添加异步发送函数
    generator.addFunction('async_udp_send_function',
        'void asyncUdpSend(String data, String ip, int port) {\n' +
        '  IPAddress targetIP;\n' +
        '  targetIP.fromString(ip);\n' +
        '  asyncUdp.writeTo((const uint8_t*)data.c_str(), data.length(), targetIP, port);\n' +
        '}\n'
    );
    
    const code = `asyncUdpSend(${data}, ${ip}, ${port});\n`;
    return code;
};

// 异步UDP广播
Arduino.forBlock['esp32_wifi_async_udp_broadcast'] = function(block, generator) {
    const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '""';
    const port = generator.valueToCode(block, 'PORT', Arduino.ORDER_ATOMIC) || '1234';
    
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <AsyncUDP.h>', '#include <AsyncUDP.h>');
    generator.addVariable('AsyncUDP asyncUdp', 'AsyncUDP asyncUdp;');
    
    const code = `asyncUdp.broadcast(${data});\n`;
    return code;
};

// 异步UDP数据包内容
Arduino.forBlock['esp32_wifi_async_udp_packet_data'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <AsyncUDP.h>', '#include <AsyncUDP.h>');
    generator.addVariable('AsyncUDPPacket asyncUdpPacket', 'AsyncUDPPacket asyncUdpPacket;');
    
    // 添加数据读取函数
    generator.addFunction('async_udp_packet_data_function',
        'String getAsyncUdpPacketData() {\n' +
        '  char data[asyncUdpPacket.length() + 1];\n' +
        '  memcpy(data, asyncUdpPacket.data(), asyncUdpPacket.length());\n' +
        '  data[asyncUdpPacket.length()] = 0;\n' +
        '  return String(data);\n' +
        '}\n'
    );
    
    const code = 'getAsyncUdpPacketData()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 异步UDP数据包长度
Arduino.forBlock['esp32_wifi_async_udp_packet_length'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <AsyncUDP.h>', '#include <AsyncUDP.h>');
    generator.addVariable('AsyncUDPPacket asyncUdpPacket', 'AsyncUDPPacket asyncUdpPacket;');
    
    const code = 'asyncUdpPacket.length()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 异步UDP数据包远程IP
Arduino.forBlock['esp32_wifi_async_udp_packet_remote_ip'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <AsyncUDP.h>', '#include <AsyncUDP.h>');
    generator.addVariable('AsyncUDPPacket asyncUdpPacket', 'AsyncUDPPacket asyncUdpPacket;');
    
    const code = 'asyncUdpPacket.remoteIP().toString()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 异步UDP数据包远程端口
Arduino.forBlock['esp32_wifi_async_udp_packet_remote_port'] = function(block, generator) {
    generator.addLibrary('#include <WiFi.h>', '#include <WiFi.h>');
    generator.addLibrary('#include <AsyncUDP.h>', '#include <AsyncUDP.h>');
    generator.addVariable('AsyncUDPPacket asyncUdpPacket', 'AsyncUDPPacket asyncUdpPacket;');
    
    const code = 'asyncUdpPacket.remotePort()';
    return [code, Arduino.ORDER_FUNCTION_CALL];
};

