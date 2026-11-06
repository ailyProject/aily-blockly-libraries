function jq6500ObjectName(block, generator) {
  const workspace = block.workspace;
  const variables = workspace && workspace.getVariableMap && workspace.getVariableMap();
  const type = 'JQ6500_Serial';
  function sync(name) {
    name = name || 'mp3';
    let model = variables && variables.getVariableById(block._jq6500VariableId);
    if (model && name !== block._jq6500LastName) {
      variables.renameVariable(model, name);
      model = variables.getVariable(name, type);
    }
    if (!model && variables) model = variables.getVariable(name, type) || workspace.createVariable(name, type);
    block._jq6500LastName = name;
    if (model) block._jq6500VariableId = model.getId();
    return model;
  }
  const raw = block.getFieldValue('NAME') || 'mp3';
  if (!block._jq6500NameMonitor) {
    registerVariableToBlockly(raw, type);
    sync(raw);
    block._jq6500NameMonitor = true;
    const field = block.getField('NAME');
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

// @aily-project/lib-jq6500

Arduino.forBlock["jq6500_init"] = function (block, generator) {
  const name = jq6500ObjectName(block, generator)
  const rx = block.getFieldValue('RX_PIN')
  const tx = block.getFieldValue('TX_PIN')
  generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>')
  generator.addLibrary('JQ6500', '#include "JQ6500.h"')
  generator.addObject('jq6500_serial_' + name, 'SoftwareSerial ' + name + '_serial(' + rx + ', ' + tx + ');')
  generator.addObject('jq6500_' + name, 'class JQ6500_Serial ' + name + '(' + name + '_serial);')
  generator.addSetupBegin('jq6500_' + name, name + '_serial.begin(9600);')
  return ''
};

Arduino.forBlock["jq6500_reset"] = function (block, generator) {
  const name = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('JQ6500', '#include "JQ6500.h"')
  return name + '.reset();\n'
};

Arduino.forBlock["jq6500_set_volume"] = function (block, generator) {
  const name = generator.getValue(block, 'VAR', 'field_variable')
  const vol = generator.valueToCode(block, 'VOLUME', generator.ORDER_ATOMIC) || '30'
  generator.addLibrary('JQ6500', '#include "JQ6500.h"')
  return name + '.setVolume(' + vol + ');\n'
};

Arduino.forBlock["jq6500_play_index"] = function (block, generator) {
  const name = generator.getValue(block, 'VAR', 'field_variable')
  const idx = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1'
  generator.addLibrary('JQ6500', '#include "JQ6500.h"')
  return name + '.playFileByIndexNumber(' + idx + ');\n'
};

Arduino.forBlock["jq6500_set_loop"] = function (block, generator) {
  const name = generator.getValue(block, 'VAR', 'field_variable')
  const mode = block.getFieldValue('MODE')
  generator.addLibrary('JQ6500', '#include "JQ6500.h"')
  return name + '.setLoopMode(' + mode + ');\n'
};