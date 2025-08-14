Arduino.forBlock['as5600_init'] = function(block, generator) {
  var address = block.getFieldValue('ADDRESS');
  var dirPin = block.getFieldValue('DIR_PIN');
  
  generator.addLibrary('#include <AS5600.h>', '#include <AS5600.h>');
  generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
  
  if (address === '0x40') {
    generator.addObject('AS5600L as5600', 'AS5600L as5600(' + address + ');');
  } else {
    generator.addObject('AS5600 as5600', 'AS5600 as5600;');
  }
  
  var setupCode = 'Wire.begin();\n';
  if (dirPin === '255') {
    setupCode += '  as5600.begin();';
  } else {
    setupCode += '  as5600.begin(' + dirPin + ');';
  }
  
  generator.addSetupBegin('as5600_init', setupCode);
  
  return '';
};

Arduino.forBlock['as5600_read_angle'] = function(block, generator) {
  // Default to degrees if field missing to avoid "missing UNIT connection" issues
  var unit = block.getFieldValue('UNIT') || 'degrees';
  var code = '';
  
  if (unit === 'degrees') {
    code = 'as5600.readAngle() * 0.087890625';
  } else if (unit === 'radians') {
    code = 'as5600.readAngle() * 0.00153398078788564';
  } else {
    code = 'as5600.readAngle()';
  }
  
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['as5600_read_raw_angle'] = function(block, generator) {
  var code = 'as5600.rawAngle()';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['as5600_set_direction'] = function(block, generator) {
  var direction = block.getFieldValue('DIRECTION');
  var code = 'as5600.setDirection(' + direction + ');\n';
  return code;
};

Arduino.forBlock['as5600_set_offset'] = function(block, generator) {
  var offset = generator.valueToCode(block, 'OFFSET', Arduino.ORDER_ATOMIC) || '0';
  var code = 'as5600.setOffset(' + offset + ');\n';
  return code;
};

Arduino.forBlock['as5600_get_offset'] = function(block, generator) {
  var code = 'as5600.getOffset()';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['as5600_detect_magnet'] = function(block, generator) {
  var code = 'as5600.detectMagnet()';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['as5600_magnet_status'] = function(block, generator) {
  var status = block.getFieldValue('STATUS');
  var code = '';
  
  if (status === 'strong') {
    code = 'as5600.magnetTooStrong()';
  } else {
    code = 'as5600.magnetTooWeak()';
  }
  
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['as5600_read_magnitude'] = function(block, generator) {
  var code = 'as5600.readMagnitude()';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['as5600_read_agc'] = function(block, generator) {
  var code = 'as5600.readAGC()';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['as5600_angular_speed'] = function(block, generator) {
  // Default to degrees if field missing to avoid runtime errors
  var unit = block.getFieldValue('UNIT') || 'degrees';
  var mode = '0';
  
  if (unit === 'radians') {
    mode = '1';
  } else if (unit === 'rpm') {
    mode = '2';
  }
  
  var code = 'as5600.getAngularSpeed(' + mode + ')';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['as5600_cumulative_position'] = function(block, generator) {
  var code = 'as5600.getCumulativePosition()';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['as5600_revolutions'] = function(block, generator) {
  var code = 'as5600.getRevolutions()';
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['as5600_reset_position'] = function(block, generator) {
  var position = generator.valueToCode(block, 'POSITION', Arduino.ORDER_ATOMIC) || '0';
  var code = 'as5600.resetCumulativePosition(' + position + ');\n';
  return code;
};

Arduino.forBlock['as5600_set_power_mode'] = function(block, generator) {
  var mode = block.getFieldValue('MODE');
  var code = 'as5600.setPowerMode(' + mode + ');\n';
  return code;
};

Arduino.forBlock['as5600_set_output_mode'] = function(block, generator) {
  var mode = block.getFieldValue('MODE');
  var code = 'as5600.setOutputMode(' + mode + ');\n';
  return code;
};

Arduino.forBlock['as5600_is_connected'] = function(block, generator) {
  var code = 'as5600.isConnected()';
  return [code, Arduino.ORDER_ATOMIC];
};