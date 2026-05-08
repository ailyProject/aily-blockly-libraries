function adxl345EnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('ADXL345', '#include <SparkFun_ADXL345_Arduino_Library/SparkFun_ADXL345.h>');
}

function adxl345GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'adxl345');
}

function adxl345AttachVar(block) {
  if (block._adxl345VarAttached) return;
  block._adxl345VarAttached = true;
  block._adxl345VarLastName = block.getFieldValue('VAR') || 'adxl345';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._adxl345VarLastName, 'ADXL345');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._adxl345VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adxl345VarLastName, newName, 'ADXL345');
      block._adxl345VarLastName = newName;
    }
  };
}

function adxl345Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function adxl345EnsureHelpers(generator) {
  generator.addFunction('adxl345_read_axis_helper', 'int adxl345ReadAxis(ADXL345 &sensor, byte axis) {\n  int x = 0, y = 0, z = 0;\n  sensor.readAccel(&x, &y, &z);\n  if (axis == 1) return y;\n  if (axis == 2) return z;\n  return x;\n}\n');
  generator.addFunction('adxl345_read_g_axis_helper', 'double adxl345ReadGAxis(ADXL345 &sensor, byte axis) {\n  double xyz[3] = {0.0, 0.0, 0.0};\n  sensor.get_Gxyz(xyz);\n  if (axis > 2) axis = 0;\n  return xyz[axis];\n}\n');
}

Arduino.forBlock['adxl345_init'] = function(block, generator) {
  adxl345AttachVar(block);
  adxl345EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'adxl345';
  var bus = block.getFieldValue('BUS') || 'I2C';
  var cs = block.getFieldValue('CS') || '10';
  var range = block.getFieldValue('RANGE') || '16';
  var rate = block.getFieldValue('RATE') || '100.0';
  generator.addVariable(varName, bus === 'SPI' ? 'ADXL345 ' + varName + '(' + cs + ');' : 'ADXL345 ' + varName + ';');
  return varName + '.powerOn();\n' + varName + '.setRangeSetting(' + range + ');\n' + varName + '.setRate(' + rate + ');\n';
};

Arduino.forBlock['adxl345_read_axis'] = function(block, generator) {
  adxl345EnsureLibrary(generator);
  adxl345EnsureHelpers(generator);
  return ['adxl345ReadAxis(' + adxl345GetVar(block) + ', ' + (block.getFieldValue('AXIS') || '0') + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adxl345_read_g_axis'] = function(block, generator) {
  adxl345EnsureLibrary(generator);
  adxl345EnsureHelpers(generator);
  return ['adxl345ReadGAxis(' + adxl345GetVar(block) + ', ' + (block.getFieldValue('AXIS') || '0') + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adxl345_set_range'] = function(block) {
  return adxl345GetVar(block) + '.setRangeSetting(' + (block.getFieldValue('RANGE') || '16') + ');\n';
};

Arduino.forBlock['adxl345_set_rate'] = function(block) {
  return adxl345GetVar(block) + '.setRate(' + (block.getFieldValue('RATE') || '100.0') + ');\n';
};

Arduino.forBlock['adxl345_set_activity_threshold'] = function(block, generator) {
  return adxl345GetVar(block) + '.setActivityThreshold(' + adxl345Value(block, generator, 'THRESHOLD', '75') + ');\n';
};

Arduino.forBlock['adxl345_set_tap_threshold'] = function(block, generator) {
  return adxl345GetVar(block) + '.setTapThreshold(' + adxl345Value(block, generator, 'THRESHOLD', '50') + ');\n';
};

Arduino.forBlock['adxl345_get_interrupt_source'] = function(block, generator) {
  return [adxl345GetVar(block) + '.getInterruptSource()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['adxl345_interrupt_triggered'] = function(block, generator) {
  var interrupts = adxl345Value(block, generator, 'INTERRUPTS', '0');
  return [adxl345GetVar(block) + '.triggered(' + interrupts + ', ' + (block.getFieldValue('SOURCE') || 'ADXL345_ACTIVITY') + ')', generator.ORDER_FUNCTION_CALL];
};