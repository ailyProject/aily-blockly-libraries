function autodriverEnsureLibrary(generator) {
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('AutoDriver', '#include <SparkFunAutoDriver.h>');
}

function autodriverGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'motor');
}

function autodriverAttachVar(block) {
  if (block._autodriverVarAttached) return;
  block._autodriverVarAttached = true;
  block._autodriverVarLastName = block.getFieldValue('VAR') || 'motor';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._autodriverVarLastName, 'AutoDriver');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._autodriverVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._autodriverVarLastName, newName, 'AutoDriver');
      block._autodriverVarLastName = newName;
    }
  };
}

Arduino.forBlock['autodriver_init'] = function(block, generator) {
  autodriverAttachVar(block);
  autodriverEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'motor';
  var position = block.getFieldValue('POSITION') || '0';
  var cs = block.getFieldValue('CS') || '10';
  var reset = block.getFieldValue('RESET') || '6';
  var busy = block.getFieldValue('BUSY') || '7';
  generator.addVariable(varName, 'AutoDriver ' + varName + '(' + position + ', ' + cs + ', ' + reset + ', ' + busy + ');');
  return 'pinMode(' + reset + ', OUTPUT);\npinMode(' + cs + ', OUTPUT);\ndigitalWrite(' + cs + ', HIGH);\ndigitalWrite(' + reset + ', LOW);\ndigitalWrite(' + reset + ', HIGH);\nSPI.begin();\nSPI.setDataMode(SPI_MODE3);\n' + varName + '.SPIPortConnect(&SPI);\n';
};

Arduino.forBlock['autodriver_config_step_mode'] = function(block) {
  return autodriverGetVar(block) + '.configStepMode(' + (block.getFieldValue('STEP_MODE') || 'STEP_FS') + ');\n';
};

Arduino.forBlock['autodriver_set_speed'] = function(block, generator) {
  var methods = { MAX: 'setMaxSpeed', MIN: 'setMinSpeed', FULL: 'setFullSpeed' };
  var speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '1000';
  return autodriverGetVar(block) + '.' + methods[block.getFieldValue('TARGET') || 'MAX'] + '(' + speed + ');\n';
};

Arduino.forBlock['autodriver_set_accel'] = function(block, generator) {
  var method = (block.getFieldValue('TARGET') || 'ACC') === 'DEC' ? 'setDec' : 'setAcc';
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '1000';
  return autodriverGetVar(block) + '.' + method + '(' + value + ');\n';
};

Arduino.forBlock['autodriver_set_kval'] = function(block, generator) {
  var methods = { RUN: 'setRunKVAL', ACC: 'setAccKVAL', DEC: 'setDecKVAL', HOLD: 'setHoldKVAL' };
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '64';
  return autodriverGetVar(block) + '.' + methods[block.getFieldValue('TYPE') || 'RUN'] + '(' + value + ');\n';
};

Arduino.forBlock['autodriver_run'] = function(block, generator) {
  var speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '500';
  return autodriverGetVar(block) + '.run(' + (block.getFieldValue('DIR') || 'FWD') + ', ' + speed + ');\n';
};

Arduino.forBlock['autodriver_move'] = function(block, generator) {
  var steps = generator.valueToCode(block, 'STEPS', generator.ORDER_ATOMIC) || '200';
  return autodriverGetVar(block) + '.move(' + (block.getFieldValue('DIR') || 'FWD') + ', ' + steps + ');\n';
};

Arduino.forBlock['autodriver_go_to'] = function(block, generator) {
  var position = generator.valueToCode(block, 'POSITION', generator.ORDER_ATOMIC) || '0';
  return autodriverGetVar(block) + '.goTo(' + position + ');\n';
};

Arduino.forBlock['autodriver_get_position'] = function(block, generator) {
  return [autodriverGetVar(block) + '.getPos()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['autodriver_get_status'] = function(block, generator) {
  return [autodriverGetVar(block) + '.getStatus()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['autodriver_stop'] = function(block) {
  var method = (block.getFieldValue('TYPE') || 'SOFT') === 'HARD' ? 'hardStop' : 'softStop';
  return autodriverGetVar(block) + '.' + method + '();\n';
};

Arduino.forBlock['autodriver_hiz'] = function(block) {
  var method = (block.getFieldValue('TYPE') || 'SOFT') === 'HARD' ? 'hardHiZ' : 'softHiZ';
  return autodriverGetVar(block) + '.' + method + '();\n';
};

Arduino.forBlock['autodriver_reset_position'] = function(block) {
  return autodriverGetVar(block) + '.resetPos();\n';
};

Arduino.forBlock['autodriver_reset_device'] = function(block) {
  return autodriverGetVar(block) + '.resetDev();\n';
};