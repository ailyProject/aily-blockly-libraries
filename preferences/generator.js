Arduino.forBlock['preferences_begin'] = function(block, generator) {
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'prefs';
    registerVariableToBlockly(block._varLastName, 'Preferences');
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
          renameVariableInBlockly(block, oldName, newName, 'Preferences');
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'prefs';
  const namespace = generator.valueToCode(block, 'NAMESPACE', generator.ORDER_ATOMIC) || '"myapp"';
  const readOnly = block.getFieldValue('READONLY') === 'true';

  generator.addLibrary('Preferences', '#include <Preferences.h>');
  generator.addObject(varName, 'Preferences ' + varName + ';');

  return varName + '.begin(' + namespace + ', ' + (readOnly ? 'true' : 'false') + ');\n';
};

Arduino.forBlock['preferences_end'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'prefs';
  generator.addLibrary('Preferences', '#include <Preferences.h>');
  return varName + '.end();\n';
};

Arduino.forBlock['preferences_clear'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'prefs';
  generator.addLibrary('Preferences', '#include <Preferences.h>');
  return varName + '.clear();\n';
};

Arduino.forBlock['preferences_remove'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'prefs';
  const key = generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || '"key"';
  generator.addLibrary('Preferences', '#include <Preferences.h>');
  return varName + '.remove(' + key + ');\n';
};

Arduino.forBlock['preferences_put'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'prefs';
  const type = block.getFieldValue('TYPE');
  const key = generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || '"key"';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('Preferences', '#include <Preferences.h>');

  const typeMap = {
    'int': 'putInt',
    'float': 'putFloat',
    'bool': 'putBool',
    'string': 'putString'
  };

  const method = typeMap[type] || 'putInt';
  return varName + '.' + method + '(' + key + ', ' + value + ');\n';
};

Arduino.forBlock['preferences_get'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'prefs';
  const type = block.getFieldValue('TYPE');
  const key = generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || '"key"';
  const defaultValue = generator.valueToCode(block, 'DEFAULT', generator.ORDER_ATOMIC) || '0';

  generator.addLibrary('Preferences', '#include <Preferences.h>');

  const typeMap = {
    'int': 'getInt',
    'float': 'getFloat',
    'bool': 'getBool',
    'string': 'getString'
  };

  const method = typeMap[type] || 'getInt';
  return [varName + '.' + method + '(' + key + ', ' + defaultValue + ')', generator.ORDER_ATOMIC];
};
