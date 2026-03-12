
// Seeed 24GHz mmWave Radar Library Generator

// Dynamic extension for mmwave_init — show/hide RX/TX pins based on serial type
if (Blockly.Extensions.isRegistered('mmwave_init_dynamic')) {
  Blockly.Extensions.unregister('mmwave_init_dynamic');
}
Blockly.Extensions.register('mmwave_init_dynamic', function () {
  const i18n = window.__BLOCKLY_LIB_I18N__?.['@aily-project/lib-seeed-mmwave']?.extensions?.mmwave_init_dynamic || {};
  const rxLabel = i18n.rx_pin || 'RX引脚';
  const txLabel = i18n.tx_pin || 'TX引脚';

  this.updateShape_ = function (serialType) {
    if (this.getInput('RX_SET')) this.removeInput('RX_SET');
    if (this.getInput('TX_SET')) this.removeInput('TX_SET');
    if (serialType === 'SOFTWARE') {
      const pinOptions = (window.boardConfig && window.boardConfig.digitalPins)
        ? window.boardConfig.digitalPins
        : [['D2','2'],['D3','3'],['D4','4'],['D5','5'],['D6','6'],['D7','7'],['D8','8'],['D9','9'],['D10','10'],['D11','11'],['D12','12'],['D13','13']];
      this.appendDummyInput('RX_SET')
          .appendField(rxLabel)
          .appendField(new Blockly.FieldDropdown(pinOptions), 'RX_PIN');
      this.appendDummyInput('TX_SET')
          .appendField(txLabel)
          .appendField(new Blockly.FieldDropdown(pinOptions), 'TX_PIN');
    }
  };
  this.getField('SERIAL_TYPE').setValidator(option => {
    this.updateShape_(option);
    return option;
  });
  this.updateShape_(this.getFieldValue('SERIAL_TYPE'));
});

// Helper: ensure mmwave library is included
function ensureMmwaveLib(generator) {
  generator.addLibrary('mmwave_for_xiao', '#include <mmwave_for_xiao.h>');
}

// Helper: target status to string function
function ensureTargetStatusFunction(generator) {
  const funcDef =
    'const char* mmwave_targetStatusToString(Seeed_HSP24::TargetStatus status) {\n' +
    '  switch (status) {\n' +
    '    case Seeed_HSP24::TargetStatus::NoTarget: return "NoTarget";\n' +
    '    case Seeed_HSP24::TargetStatus::MovingTarget: return "MovingTarget";\n' +
    '    case Seeed_HSP24::TargetStatus::StaticTarget: return "StaticTarget";\n' +
    '    case Seeed_HSP24::TargetStatus::BothTargets: return "BothTargets";\n' +
    '    default: return "Unknown";\n' +
    '  }\n' +
    '}\n';
  generator.addFunction('mmwave_targetStatusToString', funcDef);
}

// Init block — create serial + Seeed_HSP24 object
Arduino.forBlock['mmwave_init'] = function(block, generator) {
  // Variable rename listener
  if (!block._mmwaveVarMonitorAttached) {
    block._mmwaveVarMonitorAttached = true;
    block._mmwaveVarLastName = block.getFieldValue('VAR') || 'radar';
    registerVariableToBlockly(block._mmwaveVarLastName, 'SeeedMmwave');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._mmwaveVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'SeeedMmwave');
          block._mmwaveVarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'radar';
  const serialType = block.getFieldValue('SERIAL_TYPE') || 'SOFTWARE';

  ensureMmwaveLib(generator);

  if (serialType === 'SOFTWARE') {
    const rxPin = block.getFieldValue('RX_PIN') || '2';
    const txPin = block.getFieldValue('TX_PIN') || '3';
    generator.addLibrary('softwareserial', '#include <SoftwareSerial.h>');
    generator.addVariable('mmwave_serial_' + varName, 'SoftwareSerial ' + varName + 'Serial(' + rxPin + ', ' + txPin + ');');
    generator.addVariable('mmwave_obj_' + varName, 'Seeed_HSP24 ' + varName + '(' + varName + 'Serial);');
    generator.addSetupBegin('mmwave_begin_' + varName, varName + 'Serial.begin(9600);\n');
  } else {
    // Hardware serial: Serial1 or Serial2
    const hwSerial = serialType === 'SERIAL1' ? 'Serial1' : 'Serial2';
    generator.addVariable('mmwave_obj_' + varName, 'Seeed_HSP24 ' + varName + '(' + hwSerial + ');');
    generator.addSetupBegin('mmwave_begin_' + varName, hwSerial + '.begin(9600);\n');
  }

  generator.addVariable('mmwave_status_' + varName, 'Seeed_HSP24::RadarStatus ' + varName + '_status;');

  return '';
};

// Update status — read latest radar data into cached struct
Arduino.forBlock['mmwave_update_status'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'radar';

  return varName + '_status = ' + varName + '.getStatus();\n';
};

// Target status check — boolean comparison
Arduino.forBlock['mmwave_target_is'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'radar';
  const status = block.getFieldValue('STATUS');

  return ['(' + varName + '_status.targetStatus == Seeed_HSP24::TargetStatus::' + status + ')', generator.ORDER_EQUALITY];
};

// Target status text — returns string description
Arduino.forBlock['mmwave_target_status'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'radar';

  ensureTargetStatusFunction(generator);

  return ['String(mmwave_targetStatusToString(' + varName + '_status.targetStatus))', generator.ORDER_ATOMIC];
};

// Distance value — returns detected distance in mm
Arduino.forBlock['mmwave_distance'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'radar';

  return [varName + '_status.distance', generator.ORDER_ATOMIC];
};

// Set detection distance and no-target timeout
Arduino.forBlock['mmwave_set_detection'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'radar';
  const distance = generator.valueToCode(block, 'DISTANCE', generator.ORDER_ATOMIC) || '8';
  const duration = generator.valueToCode(block, 'DURATION', generator.ORDER_ATOMIC) || '5';

  let code = varName + '.enableConfigMode();\n';
  code += varName + '.setDetectionDistance(' + distance + ', ' + duration + ');\n';
  code += varName + '.disableConfigMode();\n';
  return code;
};

// Set gate sensitivity
Arduino.forBlock['mmwave_set_gate_sensitivity'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'radar';
  const gate = generator.valueToCode(block, 'GATE', generator.ORDER_ATOMIC) || '0';
  const movePower = generator.valueToCode(block, 'MOVE_POWER', generator.ORDER_ATOMIC) || '50';
  const staticPower = generator.valueToCode(block, 'STATIC_POWER', generator.ORDER_ATOMIC) || '50';

  let code = varName + '.enableConfigMode();\n';
  code += varName + '.setGatePower(' + gate + ', ' + movePower + ', ' + staticPower + ');\n';
  code += varName + '.disableConfigMode();\n';
  return code;
};

// Set resolution
Arduino.forBlock['mmwave_set_resolution'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'radar';
  const resolution = block.getFieldValue('RESOLUTION') || '0';

  let code = varName + '.enableConfigMode();\n';
  code += varName + '.setResolution(' + resolution + ');\n';
  code += varName + '.disableConfigMode();\n';
  return code;
};

// Get firmware version
Arduino.forBlock['mmwave_get_version'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'radar';

  return [varName + '.getVersion()', generator.ORDER_ATOMIC];
};

// Reboot radar
Arduino.forBlock['mmwave_reboot'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'radar';

  let code = varName + '.enableConfigMode();\n';
  code += varName + '.rebootRadar();\n';
  return code;
};

// Factory reset
Arduino.forBlock['mmwave_factory_reset'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'radar';

  let code = varName + '.enableConfigMode();\n';
  code += varName + '.refactoryRadar();\n';
  return code;
};

// Engineering mode toggle
Arduino.forBlock['mmwave_engineering_mode'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'radar';
  const mode = block.getFieldValue('MODE');

  let code = varName + '.enableConfigMode();\n';
  if (mode === 'ENABLE') {
    code += varName + '.enableEngineeringModel();\n';
  } else {
    code += varName + '.disableEngineeringModel();\n';
  }
  code += varName + '.disableConfigMode();\n';
  return code;
};
