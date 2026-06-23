'use strict';

function getHeartRateBoardConfig() {
  return (typeof window !== 'undefined' && window['boardConfig']) ? window['boardConfig'] : {};
}

function getHeartRateDefaultPin() {
  const boardConfig = getHeartRateBoardConfig();
  if (boardConfig.analogPins && boardConfig.analogPins.length > 0) {
    return boardConfig.analogPins[0][1];
  }
  return 'A0';
}


Arduino.forBlock['heartrate_init'] = function(block, generator) {
  const HEART_RATE_TYPE = 'HeartRate';
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'heartSensor';
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._varLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, HEART_RATE_TYPE);
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'heartSensor';
  const pin = block.getFieldValue('PIN') || getHeartRateDefaultPin();

  generator.addLibrary('HeartRate', '#include "heartrate.h"');
  registerVariableToBlockly(varName, HEART_RATE_TYPE);
  generator.addObject(varName, HEART_RATE_TYPE + ' ' + varName + ';');
  ensureSerialBegin("Serial", generator);

  return varName + '.begin(' + pin + ');\n';
};

Arduino.forBlock['heartrate_update'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'heartSensor';
  return varName + '.update();\n';
};

Arduino.forBlock['heartrate_get_bpm'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'heartSensor';
  return [varName + '.getBPM()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['heartrate_get_wave'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'heartSensor';
  return [varName + '.getWave()', generator.ORDER_ATOMIC];
};
