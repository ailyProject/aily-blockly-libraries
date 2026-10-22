
function sen0670GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'humanPose');
}
function sen0670Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}
function sen0670Core() {
  if (typeof window === 'undefined' || !window.boardConfig) return '';
  return String(window.boardConfig.core || window.boardConfig.board || '');
}
function sen0670AttachVar(block, typeName) {
  if (block.sen0670VarMonitorAttached) return;
  block.sen0670VarMonitorAttached = true;
  block.sen0670VarLastName = block.getFieldValue('VAR') || 'humanPose';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block.sen0670VarLastName, typeName);
  }
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block.sen0670VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block.sen0670VarLastName, newName, typeName);
      block.sen0670VarLastName = newName;
    }
  };
}

function sen0670EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('DFRobot_HumanPose', '#include <DFRobot_HumanPose.h>');
}
Arduino.forBlock['sen0670_init_i2c'] = function(block, generator) {
  sen0670AttachVar(block, 'DFRobot_HumanPose');
  sen0670EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'humanPose';
  var wire = block.getFieldValue('WIRE') || 'Wire';
  generator.addObject(varName, 'DFRobot_HumanPose_I2C ' + varName + '(&' + wire + ', 0x3A);');
  return 'while (!' + varName + '.begin()) {\n  delay(1000);\n}\n';
};
Arduino.forBlock['sen0670_init_uart'] = function(block, generator) {
  sen0670AttachVar(block, 'DFRobot_HumanPose');
  sen0670EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'humanPose';
  var core = sen0670Core();
  var serialName = block.getFieldValue('SERIAL') || 'Serial1';
  var rx = block.getFieldValue('RX') || '25';
  var tx = block.getFieldValue('TX') || '26';
  if (core.indexOf('arduino:avr') !== -1 || core.indexOf('esp8266') !== -1) {
    generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
    generator.addObject(varName + '_serial', 'SoftwareSerial ' + varName + 'Serial(' + rx + ', ' + tx + ');');
    generator.addObject(varName, 'DFRobot_HumanPose_UART ' + varName + '(&' + varName + 'Serial, 9600);');
  } else if (core.indexOf('esp32') !== -1) {
    generator.addObject(varName, 'DFRobot_HumanPose_UART ' + varName + '(&' + serialName + ', 9600, ' + rx + ', ' + tx + ');');
  } else {
    generator.addObject(varName, 'DFRobot_HumanPose_UART ' + varName + '(&' + serialName + ', 9600);');
  }
  return 'while (!' + varName + '.begin()) {\n  delay(1000);\n}\n';
};
Arduino.forBlock['sen0670_set_model'] = function(block, generator) {
  return sen0670GetVar(block) + '.setModelType(DFRobot_HumanPose::' + (block.getFieldValue('MODEL') || 'eHand') + ');\n';
};
Arduino.forBlock['sen0670_get_result'] = function(block, generator) {
  return [sen0670GetVar(block) + '.getResult() == DFRobot_HumanPose::eOK', generator.ORDER_EQUALITY];
};
Arduino.forBlock['sen0670_available'] = function(block, generator) {
  return [sen0670GetVar(block) + '.availableResult()', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['sen0670_pop'] = function(block, generator) {
  var varName = sen0670GetVar(block);
  generator.addObject(varName + 'Result', 'Result *' + varName + 'Result = NULL;');
  return varName + 'Result = ' + varName + '.popResult();\n';
};
Arduino.forBlock['sen0670_field'] = function(block, generator) {
  var varName = sen0670GetVar(block);
  var field = block.getFieldValue('FIELD') || 'ID';
  var map = {ID: 'id', SCORE: 'score', X: 'xLeft', Y: 'yTop', W: 'width', H: 'height'};
  var member = map[field] || 'id';
  return ['(' + varName + 'Result ? ' + varName + 'Result->' + member + ' : 0)', generator.ORDER_ATOMIC];
};
Arduino.forBlock['sen0670_name'] = function(block, generator) {
  var varName = sen0670GetVar(block);
  return ['(' + varName + 'Result ? ' + varName + 'Result->name : String(""))', generator.ORDER_ATOMIC];
};
Arduino.forBlock['sen0670_pose_pt'] = function(block, generator) {
  var varName = sen0670GetVar(block);
  var pt = block.getFieldValue('PT') || 'nose';
  var xy = block.getFieldValue('XY') || 'x';
  return ['(' + varName + 'Result ? ((PoseResult *)' + varName + 'Result)->' + pt + '.' + xy + ' : 0)', generator.ORDER_ATOMIC];
};
Arduino.forBlock['sen0670_hand_pt'] = function(block, generator) {
  var varName = sen0670GetVar(block);
  var pt = block.getFieldValue('PT') || 'wrist';
  var xy = block.getFieldValue('XY') || 'x';
  return ['(' + varName + 'Result ? ((HandResult *)' + varName + 'Result)->' + pt + '.' + xy + ' : 0)', generator.ORDER_ATOMIC];
};
Arduino.forBlock['sen0670_set_conf'] = function(block, generator) {
  return sen0670GetVar(block) + '.setConfidence(' + sen0670Value(block, generator, 'VAL', '60') + ');\n';
};
Arduino.forBlock['sen0670_set_iou'] = function(block, generator) {
  return sen0670GetVar(block) + '.setIOU(' + sen0670Value(block, generator, 'VAL', '45') + ');\n';
};
Arduino.forBlock['sen0670_set_sim'] = function(block, generator) {
  return sen0670GetVar(block) + '.setLearnSimilarity(' + sen0670Value(block, generator, 'VAL', '80') + ');\n';
};
Arduino.forBlock['sen0670_learn_list'] = function(block, generator) {
  var varName = sen0670GetVar(block);
  var model = block.getFieldValue('MODEL') || 'eHand';
  generator.addObject(varName + 'LearnList', 'LearnList ' + varName + 'LearnList;');
  return varName + 'LearnList = ' + varName + '.getLearnList(DFRobot_HumanPose::' + model + ');\n';
};
Arduino.forBlock['sen0670_learn_size'] = function(block, generator) {
  var varName = sen0670GetVar(block);
  generator.addObject(varName + 'LearnList', 'LearnList ' + varName + 'LearnList;');
  return [varName + 'LearnList.size()', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['sen0670_learn_name'] = function(block, generator) {
  var varName = sen0670GetVar(block);
  var idx = sen0670Value(block, generator, 'INDEX', '0');
  generator.addObject(varName + 'LearnList', 'LearnList ' + varName + 'LearnList;');
  return [varName + 'LearnList[' + idx + ']', generator.ORDER_ATOMIC];
};
Arduino.forBlock['sen0670_set_en'] = function(block, generator) {
  var pin = block.getFieldValue('PIN') || '2';
  var level = block.getFieldValue('LEVEL') || 'HIGH';
  generator.addSetupBegin('sen0670_en_' + pin, 'pinMode(' + pin + ', OUTPUT);\n');
  return 'digitalWrite(' + pin + ', ' + level + ');\n';
};
