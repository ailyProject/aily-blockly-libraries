function esp8266EnsureLib(generator) {
  generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
  generator.addLibrary('SparkFunESP8266WiFi', '#include <SparkFun_ESP8266_AT_Arduino_Library/SparkFunESP8266WiFi.h>');
}

Arduino.forBlock['esp8266at_begin'] = function(block, generator) {
  esp8266EnsureLib(generator);
  var baud = block.getFieldValue('BAUD') || '9600';
  var port = block.getFieldValue('PORT') || '0';
  // port 0 = ESP8266_SOFTWARE_SERIAL, port 1 = ESP8266_HARDWARE_SERIAL
  var portConst = (port === '0') ? 'ESP8266_SOFTWARE_SERIAL' : 'ESP8266_HARDWARE_SERIAL';
  return 'esp8266.begin(' + baud + ', ' + portConst + ');\n';
};

Arduino.forBlock['esp8266at_connect'] = function(block, generator) {
  esp8266EnsureLib(generator);
  var ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  var pwd = generator.valueToCode(block, 'PWD', generator.ORDER_ATOMIC) || '""';
  return 'esp8266.connect(' + ssid + ', ' + pwd + ');\n';
};

Arduino.forBlock['esp8266at_disconnect'] = function(block, generator) {
  esp8266EnsureLib(generator);
  return 'esp8266.disconnect();\n';
};

Arduino.forBlock['esp8266at_is_connected'] = function(block, generator) {
  esp8266EnsureLib(generator);
  return ['esp8266.status() == STATION_GOT_IP', generator.ORDER_EQUALITY];
};

Arduino.forBlock['esp8266at_local_ip'] = function(block, generator) {
  esp8266EnsureLib(generator);
  return ['esp8266.localIP().toString()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp8266at_tcp_connect'] = function(block, generator) {
  esp8266EnsureLib(generator);
  var linkId = block.getFieldValue('LINK_ID') || '0';
  var host = generator.valueToCode(block, 'HOST', generator.ORDER_ATOMIC) || '""';
  var port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '80';
  return 'esp8266.tcpConnect(' + linkId + ', ' + host + ', ' + port + ');\n';
};

Arduino.forBlock['esp8266at_tcp_send'] = function(block, generator) {
  esp8266EnsureLib(generator);
  var linkId = block.getFieldValue('LINK_ID') || '0';
  var data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '""';
  return 'esp8266.print(' + linkId + ', ' + data + ');\n';
};

Arduino.forBlock['esp8266at_close'] = function(block, generator) {
  esp8266EnsureLib(generator);
  var linkId = block.getFieldValue('LINK_ID') || '0';
  return 'esp8266.close(' + linkId + ');\n';
};
