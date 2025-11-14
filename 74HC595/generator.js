function getVariableName(block) {
  const variableField = block.getField('VAR');
  const variableName = variableField ? variableField.getText() : 'hc1';
  return variableName;
}

function ensureLibrary(generator, libraryKey, libraryCode) {
  if (!generator.libraries_) {
    generator.libraries_ = {};
  }
  if (!generator.libraries_[libraryKey]) {
    generator.addLibrary(libraryKey, libraryCode);
  }
}

function ensure74HC595Library(generator) {
  ensureLibrary(generator, '74HC595_include', '#include <ShiftRegister74HC595.h>');
}

Arduino.forBlock['74hc595_create'] = function(block, generator) {
  // 监听VAR输入值的变化，自动更新变量名
  if (!block._hcVarMonitorAttached) {
    block._hcVarMonitorAttached = true;
    block._hcVarLastName = block.getFieldValue('VAR') || 'hc1';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._hcVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'HC');
          block._hcVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const hcName = block.getFieldValue('VAR') || 'hc1';

  registerVariableToBlockly(hcName, 'HC');

  var hcnum = generator.valueToCode(block, 'HCNUMBER', Arduino.ORDER_ATOMIC) || '1';
  var hcdtPin = block.getFieldValue("HCDATA_PIN");
  var hclkPin = block.getFieldValue("HCCLOCK_PIN");
  var hclhPin = block.getFieldValue("HCLATCH_PIN");
  ensure74HC595Library(generator);
  generator.addVariable(hcName, 'ShiftRegister74HC595<'+hcnum+'> ' + hcName + '(' + hcdtPin + ', ' + hclkPin + ', ' + hclhPin + ');\n');
  return '';
};

Arduino.forBlock['74hc595_set'] = function(block, generator) {
  const hcnm = getVariableName(block);
  const pin = Arduino.valueToCode(block, "HCPIN", Arduino.ORDER_ATOMIC);
  const value = block.getFieldValue("VALUE");
  
  const code = hcnm + '.set(' + pin + ', ' + value + ');\n';
  return code;
};

Arduino.forBlock['74hc595_setAll'] = function(block, generator) {
  const hcnm = getVariableName(block);
  const allst = block.getFieldValue("ALLSTATE");

  const code = hcnm + '.setAll' + allst + '();\n';
  return code;
};

Arduino.forBlock['74hc595_setAllBin'] = function(block, generator) {
  const hcnm = getVariableName(block);
  const hcarray = block.getFieldValue("HCARRAY") || "";

  const code = hcnm + '.setAll(' + hcarray + ');\n';
  return code;
};

Arduino.forBlock['74hc595_getstate'] = function(block, generator) {
  const hcnm = getVariableName(block);
  var hcopstate = generator.valueToCode(block, 'HCOUTPSTATE', Arduino.ORDER_ATOMIC) || '0';

  return hcnm + '.get('+hcopstate+');';
};