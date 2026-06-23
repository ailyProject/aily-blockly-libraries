function seeedAS5600EnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('Seeed_AS5600', '#include <AS5600.h>');
}

function seeedAS5600WireBeginCode() {
  const boardConfig = (typeof window !== 'undefined' && window['boardConfig']) ? window['boardConfig'] : null;
  if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1) {
    return 'Wire.begin();';
  }
  return 'Wire.begin();';
}

function seeedAS5600EnsureInstance(generator, varName) {
  seeedAS5600EnsureLibrary(generator);
  generator.addVariable(varName, 'AMS_5600 ' + varName + ';');
}

function seeedAS5600GetVarName(block, fallback) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : fallback;
}

function seeedAS5600AttachVarMonitor(block) {
  if (block._varMonitorAttached) {
    return;
  }
  block._varMonitorAttached = true;
  block._varLastName = block.getFieldValue('VAR') || 'as5600';
  registerVariableToBlockly(block._varLastName, 'AMS_5600');
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
        renameVariableInBlockly(block, oldName, newName, 'AMS_5600');
        block._varLastName = newName;
      }
    };
  }
}

function seeedAS5600AngleCode(varName, angleType) {
  return angleType === 'SCALED' ? varName + '.getScaledAngle()' : varName + '.getRawAngle()';
}

function seeedAS5600EnsureAngleHelper(generator) {
  let functionDef = '';
  functionDef += 'float seeed_as5600_rawToDegrees(word angle) {\n';
  functionDef += '  return angle * 0.087890625;\n';
  functionDef += '}\n';
  generator.addFunction('seeed_as5600_rawToDegrees', functionDef, true);
}

function seeedAS5600PositionSuffix(target) {
  if (target === 'END') {
    return 'EndPosition';
  }
  if (target === 'MAX') {
    return 'MaxAngle';
  }
  return 'StartPosition';
}

Arduino.forBlock['seeed_as5600_init'] = function(block, generator) {
  seeedAS5600AttachVarMonitor(block);
  const varName = block.getFieldValue('VAR') || 'as5600';
  registerVariableToBlockly(varName, 'AMS_5600');
  seeedAS5600EnsureInstance(generator, varName);
  generator.addSetupBegin('seeed_as5600_wire_begin', seeedAS5600WireBeginCode());
  return '';
};

Arduino.forBlock['seeed_as5600_get_address'] = function(block, generator) {
  const varName = seeedAS5600GetVarName(block, 'as5600');
  seeedAS5600EnsureInstance(generator, varName);
  return [varName + '.getAddress()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_as5600_read_angle'] = function(block, generator) {
  const varName = seeedAS5600GetVarName(block, 'as5600');
  const angleType = block.getFieldValue('ANGLE_TYPE') || 'RAW';
  const unit = block.getFieldValue('UNIT') || 'RAW';
  const angleCode = seeedAS5600AngleCode(varName, angleType);
  seeedAS5600EnsureInstance(generator, varName);
  if (unit === 'DEGREES') {
    seeedAS5600EnsureAngleHelper(generator);
    return ['seeed_as5600_rawToDegrees(' + angleCode + ')', generator.ORDER_ATOMIC];
  }
  return [angleCode, generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_as5600_detect_magnet'] = function(block, generator) {
  const varName = seeedAS5600GetVarName(block, 'as5600');
  seeedAS5600EnsureInstance(generator, varName);
  return [varName + '.detectMagnet() == 1', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_as5600_magnet_status'] = function(block, generator) {
  const varName = seeedAS5600GetVarName(block, 'as5600');
  const status = block.getFieldValue('STATUS') || 'GOOD';
  const statusValue = status === 'WEAK' ? '1' : (status === 'GOOD' ? '2' : (status === 'STRONG' ? '3' : '0'));
  seeedAS5600EnsureInstance(generator, varName);
  return [varName + '.getMagnetStrength() == ' + statusValue, generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_as5600_get_magnet_strength'] = function(block, generator) {
  const varName = seeedAS5600GetVarName(block, 'as5600');
  seeedAS5600EnsureInstance(generator, varName);
  return [varName + '.getMagnetStrength()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_as5600_get_magnitude'] = function(block, generator) {
  const varName = seeedAS5600GetVarName(block, 'as5600');
  seeedAS5600EnsureInstance(generator, varName);
  return [varName + '.getMagnitude()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_as5600_get_agc'] = function(block, generator) {
  const varName = seeedAS5600GetVarName(block, 'as5600');
  seeedAS5600EnsureInstance(generator, varName);
  return [varName + '.getAgc()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_as5600_set_position_current'] = function(block, generator) {
  const varName = seeedAS5600GetVarName(block, 'as5600');
  const target = block.getFieldValue('TARGET') || 'START';
  seeedAS5600EnsureInstance(generator, varName);
  return varName + '.set' + seeedAS5600PositionSuffix(target) + '();\n';
};

Arduino.forBlock['seeed_as5600_set_position'] = function(block, generator) {
  const varName = seeedAS5600GetVarName(block, 'as5600');
  const target = block.getFieldValue('TARGET') || 'START';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  seeedAS5600EnsureInstance(generator, varName);
  return varName + '.set' + seeedAS5600PositionSuffix(target) + '(' + value + ');\n';
};

Arduino.forBlock['seeed_as5600_get_position'] = function(block, generator) {
  const varName = seeedAS5600GetVarName(block, 'as5600');
  const target = block.getFieldValue('TARGET') || 'START';
  seeedAS5600EnsureInstance(generator, varName);
  return [varName + '.get' + seeedAS5600PositionSuffix(target) + '()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_as5600_set_output_mode'] = function(block, generator) {
  const varName = seeedAS5600GetVarName(block, 'as5600');
  const mode = block.getFieldValue('MODE') || '0';
  seeedAS5600EnsureInstance(generator, varName);
  return varName + '.setOutPut(' + mode + ');\n';
};

Arduino.forBlock['seeed_as5600_get_conf'] = function(block, generator) {
  const varName = seeedAS5600GetVarName(block, 'as5600');
  seeedAS5600EnsureInstance(generator, varName);
  return [varName + '.getConf()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_as5600_set_conf'] = function(block, generator) {
  const varName = seeedAS5600GetVarName(block, 'as5600');
  const config = generator.valueToCode(block, 'CONFIG', generator.ORDER_ATOMIC) || '0';
  seeedAS5600EnsureInstance(generator, varName);
  return varName + '.setConf(' + config + ');\n';
};

Arduino.forBlock['seeed_as5600_get_burn_count'] = function(block, generator) {
  const varName = seeedAS5600GetVarName(block, 'as5600');
  seeedAS5600EnsureInstance(generator, varName);
  return [varName + '.getBurnCount()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_as5600_burn_angle'] = function(block, generator) {
  const varName = seeedAS5600GetVarName(block, 'as5600');
  seeedAS5600EnsureInstance(generator, varName);
  return [varName + '.burnAngle()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_as5600_burn_settings'] = function(block, generator) {
  const varName = seeedAS5600GetVarName(block, 'as5600');
  seeedAS5600EnsureInstance(generator, varName);
  return [varName + '.burnMaxAngleAndConfig()', generator.ORDER_ATOMIC];
};