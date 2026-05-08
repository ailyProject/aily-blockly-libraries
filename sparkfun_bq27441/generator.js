function bq27441EnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('BQ27441', '#include <SparkFunBQ27441.h>');
}

function bq27441Bool(value) {
  return value === 'TRUE' ? 'true' : 'false';
}

Arduino.forBlock['bq27441_begin'] = function(block, generator) {
  bq27441EnsureLibrary(generator);
  var capacity = generator.valueToCode(block, 'CAPACITY', generator.ORDER_ATOMIC) || '850';
  generator.addVariable('bq27441_ready', 'bool bq27441_ready = false;');
  return 'bq27441_ready = lipo.begin();\nif (bq27441_ready) {\n  lipo.setCapacity(' + capacity + ');\n}\n';
};

Arduino.forBlock['bq27441_is_ready'] = function(block, generator) {
  bq27441EnsureLibrary(generator);
  return ['bq27441_ready', generator.ORDER_ATOMIC];
};

Arduino.forBlock['bq27441_set_capacity'] = function(block, generator) {
  bq27441EnsureLibrary(generator);
  var capacity = generator.valueToCode(block, 'CAPACITY', generator.ORDER_ATOMIC) || '850';
  return 'lipo.setCapacity(' + capacity + ');\n';
};

Arduino.forBlock['bq27441_voltage'] = function(block, generator) {
  bq27441EnsureLibrary(generator);
  return ['lipo.voltage()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bq27441_current'] = function(block, generator) {
  bq27441EnsureLibrary(generator);
  return ['lipo.current(' + (block.getFieldValue('TYPE') || 'AVG') + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bq27441_capacity'] = function(block, generator) {
  bq27441EnsureLibrary(generator);
  return ['lipo.capacity(' + (block.getFieldValue('TYPE') || 'REMAIN') + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bq27441_power'] = function(block, generator) {
  bq27441EnsureLibrary(generator);
  return ['lipo.power()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bq27441_soc'] = function(block, generator) {
  bq27441EnsureLibrary(generator);
  return ['lipo.soc(' + (block.getFieldValue('TYPE') || 'FILTERED') + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bq27441_soh'] = function(block, generator) {
  bq27441EnsureLibrary(generator);
  return ['lipo.soh(' + (block.getFieldValue('TYPE') || 'PERCENT') + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bq27441_temperature'] = function(block, generator) {
  bq27441EnsureLibrary(generator);
  return ['lipo.temperature(' + (block.getFieldValue('TYPE') || 'BATTERY') + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bq27441_flags'] = function(block, generator) {
  bq27441EnsureLibrary(generator);
  return ['lipo.flags()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bq27441_status'] = function(block, generator) {
  bq27441EnsureLibrary(generator);
  return ['lipo.status()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bq27441_set_gpout_function'] = function(block, generator) {
  bq27441EnsureLibrary(generator);
  return 'lipo.setGPOUTFunction(' + (block.getFieldValue('FUNCTION') || 'SOC_INT') + ');\n';
};

Arduino.forBlock['bq27441_set_gpout_polarity'] = function(block, generator) {
  bq27441EnsureLibrary(generator);
  return 'lipo.setGPOUTPolarity(' + bq27441Bool(block.getFieldValue('ACTIVE_HIGH') || 'TRUE') + ');\n';
};