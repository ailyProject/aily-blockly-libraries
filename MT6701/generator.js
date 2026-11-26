Arduino.forBlock['mt6701_init'] = function(block, generator) {
  var objectName = generator.getVariableName(block.getFieldValue('OBJECT'));
  
  generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
  generator.addLibrary('#include "MT6701.h"', '#include "MT6701.h"');
  generator.addObject(objectName, 'MT6701 ' + objectName + ';');
  generator.addSetupBegin(objectName + '_begin', objectName + '.begin();');
  
  return '';
};

Arduino.forBlock['mt6701_init_advanced'] = function(block, generator) {
  var objectName = generator.getVariableName(block.getFieldValue('OBJECT'));
  var address = block.getFieldValue('ADDRESS');
  var interval = generator.valueToCode(block, 'INTERVAL', generator.ORDER_ATOMIC) || '50';
  
  generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
  generator.addLibrary('#include "MT6701.h"', '#include "MT6701.h"');
  generator.addObject(objectName, 'MT6701 ' + objectName + '(' + address + ', ' + interval + ');');
  generator.addSetupBegin(objectName + '_begin', objectName + '.begin();');
  
  return '';
};

Arduino.forBlock['mt6701_get_angle_radians'] = function(block, generator) {
  var objectName = generator.getVariableName(block.getFieldValue('OBJECT'));
  var code = objectName + '.getAngleRadians()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mt6701_get_angle_degrees'] = function(block, generator) {
  var objectName = generator.getVariableName(block.getFieldValue('OBJECT'));
  var code = objectName + '.getAngleDegrees()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mt6701_get_rpm'] = function(block, generator) {
  var objectName = generator.getVariableName(block.getFieldValue('OBJECT'));
  var code = objectName + '.getRPM()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mt6701_get_count'] = function(block, generator) {
  var objectName = generator.getVariableName(block.getFieldValue('OBJECT'));
  var code = objectName + '.getCount()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mt6701_get_full_turns'] = function(block, generator) {
  var objectName = generator.getVariableName(block.getFieldValue('OBJECT'));
  var code = objectName + '.getFullTurns()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mt6701_get_turns'] = function(block, generator) {
  var objectName = generator.getVariableName(block.getFieldValue('OBJECT'));
  var code = objectName + '.getTurns()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mt6701_get_accumulator'] = function(block, generator) {
  var objectName = generator.getVariableName(block.getFieldValue('OBJECT'));
  var code = objectName + '.getAccumulator()';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mt6701_update_count'] = function(block, generator) {
  var objectName = generator.getVariableName(block.getFieldValue('OBJECT'));
  var code = objectName + '.updateCount();\n';
  return code;
};