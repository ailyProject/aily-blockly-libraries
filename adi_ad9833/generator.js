// _varMonitorAttached: the init field hook below monitors variable renames.
function adi_ad9833EnsureLibrary(generator) {
  generator.addLibrary('adi_ad9833_0', '#include <Aily_AD9833.h>');
}

function adi_ad9833Variable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'ad9833');
}

function adi_ad9833AttachVariable(block) {
  if (block._adi_ad9833VariableAttached) return;
  block._adi_ad9833VariableAttached = true;
  block._adi_ad9833LastName = block.getFieldValue('VAR') || 'ad9833';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._adi_ad9833LastName, 'AilyAD9833');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._adi_ad9833LastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._adi_ad9833LastName, newName, 'AilyAD9833');
      block._adi_ad9833LastName = newName;
    }
  };
}

function adi_ad9833EnsureExtras(generator, varName) {
  // No cached data objects required.
}

Arduino.forBlock['adi_ad9833_init'] = function(block, generator) {
  adi_ad9833AttachVariable(block);
  adi_ad9833EnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'ad9833';
  var cs = block.getFieldValue('CS') || "10";
  var refclk = block.getFieldValue('REFCLK') || "25000000";
  var objectCode = "AilyAD9833 " + String(varName) + "(" + String(cs) + ", &SPI, " + String(refclk) + ");";
  generator.addObject('adi_ad9833_object_' + varName, objectCode);
  adi_ad9833EnsureExtras(generator, varName);
  var beginCall = String(varName) + ".begin()";
  generator.addSetupBegin('adi_ad9833_begin_' + varName, 'while (!(' + beginCall + ')) { delay(100); }');
  return '';
};

Arduino.forBlock['adi_ad9833_action'] = function(block, generator) {
  adi_ad9833EnsureLibrary(generator);
  var varName = adi_ad9833Variable(block);
  adi_ad9833EnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "enable";
  var actions = {
    "enable": String(varName) + ".enableOutput(true);",
    "disable": String(varName) + ".enableOutput(false);"
  };
  return (actions[action] || actions["enable"]) + '\n';
};

Arduino.forBlock['adi_ad9833_set'] = function(block, generator) {
  adi_ad9833EnsureLibrary(generator);
  var varName = adi_ad9833Variable(block);
  adi_ad9833EnsureExtras(generator, varName);
  var setting = block.getFieldValue('SETTING') || "frequency";
  var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || "1000";
  var settings = {
    "frequency": String(varName) + ".setFrequency((float)" + String(value) + ");",
    "phase": String(varName) + ".setPhase((float)" + String(value) + ");",
    "waveform": String(varName) + ".setWaveform((AilyAD9833::Waveform)constrain((int)" + String(value) + ", 0, 2));"
  };
  return (settings[setting] || settings["frequency"]) + '\n';
};

