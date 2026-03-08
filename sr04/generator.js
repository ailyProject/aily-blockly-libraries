Arduino.forBlock['sr04_setup'] = function(block, generator) {
  // 设置变量重命名监听器
  if (!block._sr04VarMonitorAttached) {
    block._sr04VarMonitorAttached = true;
    block._sr04VarLastName = block.getFieldValue('VAR') || 'sr04';
    // 初次注册变量到 Blockly 系统（仅执行一次）
    registerVariableToBlockly(block._sr04VarLastName, 'UltraSonicDistanceSensor');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._sr04VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'UltraSonicDistanceSensor');
          block._sr04VarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'sr04';
  const trigPin = generator.valueToCode(block, 'TRIG_PIN', generator.ORDER_ATOMIC) || '2';
  const echoPin = generator.valueToCode(block, 'ECHO_PIN', generator.ORDER_ATOMIC) || '3';
  const maxDistance = block.getFieldValue('MAX_DISTANCE') || 400;

  // 添加库和变量（自动去重）
  generator.addLibrary('HCSR04', '#include <HCSR04.h>');
  generator.addVariable(varName, 'UltraSonicDistanceSensor ' + varName + '(' + trigPin + ', ' + echoPin + ', ' + maxDistance + ');');

  return '';
};

Arduino.forBlock['sr04_measure_distance'] = function(block, generator) {
  const varId = block.getFieldValue('VAR');
  const variable = block.workspace.getVariableById(varId);
  const varName = variable ? variable.name : 'sr04';

  generator.addLibrary('HCSR04', '#include <HCSR04.h>');

  return [varName + '.measureDistanceCm()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sr04_measure_distance_with_temp'] = function(block, generator) {
  const varId = block.getFieldValue('VAR');
  const variable = block.workspace.getVariableById(varId);
  const varName = variable ? variable.name : 'sr04';
  const temperature = generator.valueToCode(block, 'TEMPERATURE', generator.ORDER_ATOMIC) || '20';

  generator.addLibrary('HCSR04', '#include <HCSR04.h>');

  return [varName + '.measureDistanceCm(' + temperature + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sr04_measure_quick'] = function(block, generator) {
  const trigPin = generator.valueToCode(block, 'TRIG_PIN', generator.ORDER_ATOMIC) || '2';
  const echoPin = generator.valueToCode(block, 'ECHO_PIN', generator.ORDER_ATOMIC) || '3';

  generator.addLibrary('HCSR04', '#include <HCSR04.h>');

  // 生成辅助函数
  const funcName = 'sr04_quick_measure';
  const functionDef = 'float ' + funcName + '(int trigPin, int echoPin) {\n' +
    '  pinMode(trigPin, OUTPUT);\n' +
    '  pinMode(echoPin, INPUT);\n' +
    '  digitalWrite(trigPin, LOW);\n' +
    '  delayMicroseconds(2);\n' +
    '  digitalWrite(trigPin, HIGH);\n' +
    '  delayMicroseconds(10);\n' +
    '  digitalWrite(trigPin, LOW);\n' +
    '  unsigned long duration = pulseIn(echoPin, HIGH, 25000);\n' +
    '  if (duration == 0) return -1.0;\n' +
    '  return duration * 0.01715;\n' +
    '}\n';

  generator.addFunction(funcName, functionDef);

  return [funcName + '(' + trigPin + ', ' + echoPin + ')', generator.ORDER_ATOMIC];
};
