/**
 * Grove PIR Motion Sensor Library Generator
 * Supports simple PIR motion detection
 */

// 初始化 PIR 传感器
Arduino.forBlock['grove_pir_init'] = function(block, generator) {
  // 变量重命名监听器
  if (!block._pirVarMonitorAttached) {
    block._pirVarMonitorAttached = true;
    block._pirLastName = block.getFieldValue('VAR') || 'pir';
    registerVariableToBlockly(block._pirLastName, 'GrovePIR');
    
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._pirLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'GrovePIR');
          block._pirLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'pir';
  const pin = generator.valueToCode(block, 'PIN', generator.ORDER_ATOMIC) || '2';

  // 注册变量
  registerVariableToBlockly(varName, 'GrovePIR');
  
  // 添加变量声明 - PIR传感器只需要存储引脚号
  generator.addVariable(varName + '_pin', 'int ' + varName + '_pin = ' + pin + ';');

  // 生成初始化代码
  return 'pinMode(' + varName + '_pin, INPUT);\n';
};

// 读取 PIR 传感器状态
Arduino.forBlock['grove_pir_read'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'pir';

  return ['digitalRead(' + varName + '_pin)', generator.ORDER_ATOMIC];
};

// 判断是否检测到运动
Arduino.forBlock['grove_pir_motion_detected'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'pir';

  return ['digitalRead(' + varName + '_pin) == HIGH', generator.ORDER_ATOMIC];
};