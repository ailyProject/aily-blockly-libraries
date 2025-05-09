
function getVariableName(block) {
  const variableField = block.getField('STEPPER');
  const variableModel = variableField.getVariable();
  console.log("name: ", variableModel.name);
  return variableModel.name;
}

Arduino.forBlock['stepper_init'] = function (block, generator) {
  var variable_stepper = getVariableName(block);
  var steps_per_rev = block.getFieldValue('STEPS');
  var pin1 = block.getFieldValue('PIN1');
  var pin2 = block.getFieldValue('PIN2');
  var pin3 = block.getFieldValue('PIN3');
  var pin4 = block.getFieldValue('PIN4');

  // 添加步进电机库
  generator.addLibrary('#include <Stepper.h>', '#include <Stepper.h>');

  // 创建步进电机对象
  generator.addVariable('Stepper ' + variable_stepper, 'Stepper ' + variable_stepper + '(' + steps_per_rev + ', ' + pin1 + ', ' + pin2 + ', ' + pin3 + ', ' + pin4 + ');');

  return '';
};

Arduino.forBlock['stepper_set_speed'] = function (block, generator) {
  var variable_stepper = getVariableName(block);
  var speed = block.getFieldValue('SPEED');

  var code = variable_stepper + '.setSpeed(' + speed + ');\n';
  return code;
};

Arduino.forBlock['stepper_step'] = function (block, generator) {
  var variable_stepper = getVariableName(block);
  var steps = generator.valueToCode(block, 'STEPS', Arduino.ORDER_ATOMIC);

  var code = variable_stepper + '.step(' + steps + ');\n';
  return code;
};
