// Generator.js for INA226 library

Arduino.forBlock['ina226_init'] = function(block, generator) {
  // Variable rename listener
  if (!block._ina226VarMonitorAttached) {
    block._ina226VarMonitorAttached = true;
    block._ina226VarLastName = block.getFieldValue('VAR') || 'ina226';
    registerVariableToBlockly(block._ina226VarLastName, 'INA226');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._ina226VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'INA226');
          block._ina226VarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'ina226';
  const address = block.getFieldValue('ADDRESS') || '0x40';
  const wire = block.getFieldValue('WIRE') || 'Wire';
  const maxAmps = generator.valueToCode(block, 'MAX_AMPS', generator.ORDER_ATOMIC) || '1';
  const shuntRes = generator.valueToCode(block, 'SHUNT_RES', generator.ORDER_ATOMIC) || '100000';

  // Libraries
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('INA226', '#include <INA226.h>');

  // Serial
  ensureSerialBegin('Serial', generator);

  // Object declaration
  if (wire && wire !== 'Wire' && wire !== '') {
    generator.addObject(varName, 'INA226 ' + varName + '(' + address + ', &' + wire + ');');
  } else {
    generator.addObject(varName, 'INA226 ' + varName + '(' + address + ');');
  }

  // Wire begin dedup
  const wireBeginKey = `wire_${wire}_begin`;
  if (!generator.setupCodes_ || !generator.setupCodes_[wireBeginKey]) {
    let pinComment = '';
    try {
      const boardConfig = window['boardConfig'];
      if (boardConfig && boardConfig.i2cPins && boardConfig.i2cPins[wire]) {
        const pins = boardConfig.i2cPins[wire];
        const sdaPin = pins.find(p => p[0] === 'SDA');
        const sclPin = pins.find(p => p[0] === 'SCL');
        if (sdaPin && sclPin) {
          pinComment = '  // ' + wire + ': SDA=' + sdaPin[1] + ', SCL=' + sclPin[1] + '\n  ';
        }
      }
    } catch (e) {}
    generator.addSetup(wireBeginKey, pinComment + wire + '.begin();\n');
  }

  // Init code
  let setupCode = '';
  setupCode += '// 初始化INA226功率监测芯片 ' + varName + '\n';
  setupCode += 'if (' + varName + '.begin(' + maxAmps + ', ' + shuntRes + ')) {\n';
  setupCode += '  Serial.println("INA226 ' + varName + ' 初始化成功!");\n';
  setupCode += '} else {\n';
  setupCode += '  Serial.println("警告: INA226 ' + varName + ' 初始化失败，请检查接线!");\n';
  setupCode += '}\n';

  return setupCode;
};

Arduino.forBlock['ina226_read_value'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ina226';
  const type = block.getFieldValue('TYPE') || 'BUS_VOLTAGE';

  generator.addLibrary('INA226', '#include <INA226.h>');

  switch (type) {
    case 'BUS_VOLTAGE':
      return [varName + '.getBusVoltage()', generator.ORDER_FUNCTION_CALL];
    case 'SHUNT_VOLTAGE':
      return [varName + '.getShuntVoltage_mV()', generator.ORDER_FUNCTION_CALL];
    case 'CURRENT':
      return [varName + '.getCurrent_mA()', generator.ORDER_FUNCTION_CALL];
    case 'POWER':
      return [varName + '.getPower_mW()', generator.ORDER_FUNCTION_CALL];
    default:
      return [varName + '.getBusVoltage()', generator.ORDER_FUNCTION_CALL];
  }
};

Arduino.forBlock['ina226_set_averaging'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ina226';
  const avg = block.getFieldValue('AVG') || '1';

  generator.addLibrary('INA226', '#include <INA226.h>');

  return varName + '.setAveraging(' + avg + ');\n';
};
