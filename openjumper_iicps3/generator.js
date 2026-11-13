// Older projects stored receiver names as plain text fields. Convert those
// saved values before FieldVariable reads them as model IDs or untyped models.
if (Blockly.Extensions.isRegistered('openjumper_ps3_reference')) {
  Blockly.Extensions.unregister('openjumper_ps3_reference');
}
Blockly.Extensions.register('openjumper_ps3_reference', function() {
  const field = this.getField('PS3_NAME');
  const loadState = field.loadState;
  field.loadState = function(state) {
    if (typeof state === 'string') state = { name: state, type: 'OpenJumperPS3' };
    loadState.call(this, state);
  };
  const fromXml = field.fromXml;
  field.fromXml = function(element) {
    if (!element.getAttribute('variabletype') && !element.getAttribute('variableType')) {
      element = element.cloneNode(true);
      element.setAttribute('variabletype', 'OpenJumperPS3');
    }
    fromXml.call(this, element);
  };
});

function openJumperPs3ObjectName(block, generator) {
  const workspace = block.workspace;
  const variables = workspace && workspace.getVariableMap && workspace.getVariableMap();
  const type = 'OpenJumperPS3';
  function sync(name) {
    name = name || 'ps3';
    let model = variables && variables.getVariableById(block._openJumperPs3VariableId);
    if (model && name !== block._openJumperPs3LastName) {
      variables.renameVariable(model, name);
      model = variables.getVariable(name, type);
    }
    if (!model && variables) model = variables.getVariable(name, type) || variables.createVariable(name, type);
    block._openJumperPs3LastName = name;
    if (model) block._openJumperPs3VariableId = model.getId();
    return model;
  }
  const raw = block.getFieldValue('PS3_NAME') || 'ps3';
  if (!block._openJumperPs3VarMonitorAttached) {
    registerVariableToBlockly(raw, type);
    sync(raw);
    block._openJumperPs3VarMonitorAttached = true;
    const field = block.getField('PS3_NAME');
    const originalFinish = field && field.onFinishEditing_;
    if (field) field.onFinishEditing_ = function(newName) {
      if (typeof originalFinish === 'function') originalFinish.call(this, newName);
      sync(newName);
    };
  }
  const model = sync(raw);
  registerVariableToBlockly(raw, type);
  if (generator.nameDB_ && model) return generator.nameDB_.getName(model.getId(), 'VARIABLE');
  return raw;
}

// Initialize an I2C receiver. The instance name also keys its declaration.
Arduino.forBlock['openjumper_iicps3_init'] = function(block, generator) {
  const name = openJumperPs3ObjectName(block, generator);
  generator.addLibrary('OpenJumperPS3', '#include <OpenJumperPS3.h>');
  generator.addVariable(name, 'OpenJumperPS3 ' + name + ';');
  generator.addSetupBegin('Wire.begin', 'Wire.begin();\n');
  return '';
};

function openJumperPs3ReferenceName(block, generator) {
  if (typeof generator.getValue === 'function') {
    return generator.getValue(block, 'PS3_NAME', 'field_variable');
  }
  const field = block.getField('PS3_NAME');
  return field ? field.getText() : 'ps3';
}

Arduino.forBlock['openjumper_iicps3_run'] = function(block, generator) {
  return openJumperPs3ReferenceName(block, generator) + '.run();\n';
};

Arduino.forBlock['openjumper_iicps3_butstate'] = function(block, generator) {
  return [openJumperPs3ReferenceName(block, generator) + '.ps3Data.' + block.getFieldValue('IICPS3_BTN'), generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['openjumper_iicps3_xy'] = function(block, generator) {
  return [openJumperPs3ReferenceName(block, generator) + '.ps3Data.' + block.getFieldValue('IICPS3_XY'), generator.ORDER_FUNCTION_CALL];
};
