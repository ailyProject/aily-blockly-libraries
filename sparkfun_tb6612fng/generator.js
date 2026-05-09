function tb6612fngEnsureLib(generator) {
  generator.addLibrary('SparkFun_TB6612FNG', '#include <SparkFun_TB6612.h>');
}

function tb6612fngGetVar(block) {
  var f = block.getField('VAR');
  return f ? f.getText() : (block.getFieldValue('VAR') || 'motor1');
}

function tb6612fngAttachVar(block) {
  if (block._tb6612fngVarAttached) return;
  block._tb6612fngVarAttached = true;
  block._tb6612fngVarLastName = block.getFieldValue('VAR') || 'motor1';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._tb6612fngVarLastName, 'Motor');
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._tb6612fngVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._tb6612fngVarLastName, newName, 'Motor');
      block._tb6612fngVarLastName = newName;
    }
  };
}

Arduino.forBlock['tb6612fng_init'] = function(block, generator) {
  tb6612fngAttachVar(block);
  tb6612fngEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'motor1';
  var in1 = generator.valueToCode(block, 'IN1', generator.ORDER_NONE) || '2';
  var in2 = generator.valueToCode(block, 'IN2', generator.ORDER_NONE) || '3';
  var pwm = generator.valueToCode(block, 'PWM', generator.ORDER_NONE) || '9';
  var offset = block.getFieldValue('OFFSET') || '1';
  var stby = generator.valueToCode(block, 'STBY', generator.ORDER_NONE) || '8';
  generator.addVariable(varName, 'Motor ' + varName + '(' + in1 + ', ' + in2 + ', ' + pwm + ', ' + offset + ', ' + stby + ');');
  return '';
};

Arduino.forBlock['tb6612fng_drive'] = function(block, generator) {
  tb6612fngEnsureLib(generator);
  var speed = generator.valueToCode(block, 'SPEED', generator.ORDER_NONE) || '255';
  return tb6612fngGetVar(block) + '.drive(' + speed + ');\n';
};

Arduino.forBlock['tb6612fng_brake'] = function(block, generator) {
  tb6612fngEnsureLib(generator);
  return tb6612fngGetVar(block) + '.brake();\n';
};

Arduino.forBlock['tb6612fng_standby'] = function(block, generator) {
  tb6612fngEnsureLib(generator);
  var pin = generator.valueToCode(block, 'PIN', generator.ORDER_NONE) || '8';
  var state = block.getFieldValue('STATE') || 'HIGH';
  return 'digitalWrite(' + pin + ', ' + state + ');\n';
};
