function grideyeEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('GridEYE', '#include <SparkFun_GridEYE_Arduino_Library/SparkFun_GridEYE_Arduino_Library.h>');
}

function grideyeGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'grideye');
}

function grideyeAttachVar(block) {
  if (block._grideyeVarAttached) return;
  block._grideyeVarAttached = true;
  block._grideyeVarLastName = block.getFieldValue('VAR') || 'grideye';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._grideyeVarLastName, 'GridEYE');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._grideyeVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._grideyeVarLastName, newName, 'GridEYE');
      block._grideyeVarLastName = newName;
    }
  };
}

Arduino.forBlock['grideye_init'] = function(block, generator) {
  grideyeAttachVar(block);
  grideyeEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'grideye';
  var address = block.getFieldValue('ADDRESS') || '0x69';
  generator.addVariable(varName, 'GridEYE ' + varName + ';');
  return 'Wire.begin();\n' + varName + '.begin(' + address + ');\n';
};

Arduino.forBlock['grideye_get_pixel_temp'] = function(block, generator) {
  grideyeEnsureLib(generator);
  var pixel = generator.valueToCode(block, 'PIXEL', generator.ORDER_ATOMIC) || '0';
  return [grideyeGetVar(block) + '.getPixelTemperature(' + pixel + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['grideye_get_device_temp'] = function(block, generator) {
  grideyeEnsureLib(generator);
  return [grideyeGetVar(block) + '.getDeviceTemperature()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['grideye_set_framerate'] = function(block, generator) {
  grideyeEnsureLib(generator);
  var rate = block.getFieldValue('RATE') || '1';
  if (rate === '1') {
    return grideyeGetVar(block) + '.setFramerate1FPS();\n';
  } else {
    return grideyeGetVar(block) + '.setFramerate10FPS();\n';
  }
};

Arduino.forBlock['grideye_power'] = function(block, generator) {
  grideyeEnsureLib(generator);
  var mode = block.getFieldValue('MODE') || 'wake';
  if (mode === 'wake') {
    return grideyeGetVar(block) + '.wake();\n';
  } else {
    return grideyeGetVar(block) + '.sleep();\n';
  }
};

Arduino.forBlock['grideye_set_interrupt'] = function(block, generator) {
  grideyeEnsureLib(generator);
  var upper = generator.valueToCode(block, 'UPPER', generator.ORDER_ATOMIC) || '40.0';
  var lower = generator.valueToCode(block, 'LOWER', generator.ORDER_ATOMIC) || '20.0';
  return grideyeGetVar(block) + '.setUpperInterruptValue(' + upper + ');\n' +
    grideyeGetVar(block) + '.setLowerInterruptValue(' + lower + ');\n';
};

Arduino.forBlock['grideye_moving_avg'] = function(block, generator) {
  grideyeEnsureLib(generator);
  var enable = block.getFieldValue('ENABLE') || 'enable';
  if (enable === 'enable') {
    return grideyeGetVar(block) + '.movingAverageEnable();\n';
  } else {
    return grideyeGetVar(block) + '.movingAverageDisable();\n';
  }
};
