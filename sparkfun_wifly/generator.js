function wiflyEnsureLib(generator) {
  generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
  generator.addLibrary('WiFly', '#include <WiFly.h>');
}

Arduino.forBlock['wifly_init'] = function(block, generator) {
  wiflyEnsureLib(generator);
  generator.addVariable('_wiflySerial', 'SoftwareSerial _wiflySerial(2, 3);');
  return '_wiflySerial.begin(9600);\nWiFly.begin(_wiflySerial);\n';
};

Arduino.forBlock['wifly_join'] = function(block, generator) {
  wiflyEnsureLib(generator);
  var ssid = generator.valueToCode(block, 'SSID', generator.ORDER_NONE) || '""';
  var pass = generator.valueToCode(block, 'PASS', generator.ORDER_NONE) || '""';
  return ['WiFly.join(' + ssid + ', ' + pass + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifly_connected'] = function(block, generator) {
  wiflyEnsureLib(generator);
  return ['WiFly.isConnected()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifly_open'] = function(block, generator) {
  wiflyEnsureLib(generator);
  var host = generator.valueToCode(block, 'HOST', generator.ORDER_NONE) || '""';
  var port = generator.valueToCode(block, 'PORT', generator.ORDER_NONE) || '80';
  return ['WiFly.open(' + host + ', ' + port + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['wifly_print'] = function(block, generator) {
  wiflyEnsureLib(generator);
  var data = generator.valueToCode(block, 'DATA', generator.ORDER_NONE) || '""';
  return 'WiFly.print(' + data + ');\n';
};

Arduino.forBlock['wifly_available'] = function(block, generator) {
  wiflyEnsureLib(generator);
  return ['WiFly.available()', generator.ORDER_FUNCTION_CALL];
};
