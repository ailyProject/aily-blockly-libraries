Arduino.forBlock['si7021_begin'] = function(block, generator) {
  var nameDB = generator.nameDB || generator.nameDB_;
  var objectName = nameDB.getName(block.getFieldValue('OBJECT'), 'VARIABLE');

// 添加库引用
generator.addLibrary('#include <Adafruit_Si7021.h>', '#include <Adafruit_Si7021.h>');
// 添加I2C初始化
generator.addSetupBegin('WIRE_BEGIN', 'Wire.begin();');
generator.addLibrary('WIRE_INCLUDE', '#include <Wire.h>');

// 添加对象声明
generator.addObject('Adafruit_Si7021 ' + objectName, 'Adafruit_Si7021 ' + objectName + ' = Adafruit_Si7021();');

// 初始化代码
var code = 'if (!' + objectName + '.begin()) {\n';
code += ' Serial.println("Did not find Si7021 sensor!");\n';
code += ' while (true);\n';
code += '}\n';

return code;
};

Arduino.forBlock['si7021_read_temperature'] = function(block, generator) {
  var nameDB = generator.nameDB || generator.nameDB_;
  var objectName = nameDB.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
  var code = objectName + '.readTemperature()';
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['si7021_read_humidity'] = function(block, generator) {
  var nameDB = generator.nameDB || generator.nameDB_;
  var objectName = nameDB.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
  var code = objectName + '.readHumidity()';
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['si7021_heater_control'] = function(block, generator) {
  var nameDB = generator.nameDB || generator.nameDB_;
  var objectName = nameDB.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
  var state = block.getFieldValue('STATE');
  var code = objectName + '.heater(' + state + ');\n';
  return code;
};

Arduino.forBlock['si7021_is_heater_enabled'] = function(block, generator) {
  var nameDB = generator.nameDB || generator.nameDB_;
  var objectName = nameDB.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
  var code = objectName + '.isHeaterEnabled()';
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['si7021_set_heat_level'] = function(block, generator) {
  var nameDB = generator.nameDB || generator.nameDB_;
  var objectName = nameDB.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
  var level = block.getFieldValue('LEVEL');
  var code = objectName + '.setHeatLevel(' + level + ');\n';
  return code;
};

Arduino.forBlock['si7021_get_model'] = function(block, generator) {
  var nameDB = generator.nameDB || generator.nameDB_;
  var objectName = nameDB.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
  var code = 'String(' + objectName + '.getModel())';
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['si7021_get_revision'] = function(block, generator) {
  var nameDB = generator.nameDB || generator.nameDB_;
  var objectName = nameDB.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
  var code = objectName + '.getRevision()';
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['si7021_reset'] = function(block, generator) {
  var nameDB = generator.nameDB || generator.nameDB_;
  var objectName = nameDB.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
  var code = objectName + '.reset();\n';
  return code;
};

Arduino.forBlock['si7021_read_serial_number'] = function(block, generator) {
  var nameDB = generator.nameDB || generator.nameDB_;
  var objectName = nameDB.getName(block.getFieldValue('OBJECT'), 'VARIABLE');
  var code = objectName + '.readSerialNumber();\n';
  code += 'Serial.print("Si7021序列号: ");\n';
  code += 'Serial.print(' + objectName + '.sernum_a, HEX);\n';
  code += 'Serial.print("-");\n';
  code += 'Serial.println(' + objectName + '.sernum_b, HEX);\n';
  return code;
};