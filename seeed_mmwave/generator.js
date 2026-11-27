
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
    if (serialType === 'SOFTWARE' || serialType === 'ROUTED1') {
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
  const serialType = block.getFieldValue('SERIAL_TYPE') || 'AUTO';
  const portName = varName + 'Serial';
  ensureMmwaveLib(generator);

  let declaration;
  let begin;
  if (serialType === 'SOFTWARE') {
    const rx = block.getFieldValue('RX_PIN') || '2';
    const tx = block.getFieldValue('TX_PIN') || '3';
    generator.addLibrary('softwareserial', '#include <SoftwareSerial.h>');
    declaration = 'SoftwareSerial ' + portName + '(' + rx + ', ' + tx + ');';
    begin = portName + '.begin(9600);';
  } else {
    const n = serialType === 'SERIAL2' ? '2' : '1';
    const automatic = serialType === 'AUTO';
    const routed = serialType === 'ROUTED1';
    const rx = block.getFieldValue('RX_PIN') || '2';
    const tx = block.getFieldValue('TX_PIN') || '3';
    const lines = [
      '#if defined(ARDUINO_ARCH_STM32) && defined(USART' + n + ') && !defined(HAVE_HWSERIAL' + n + ')',
      'Uart ' + portName + '(USART' + n + ');'
    ];
    if (automatic) {
      lines.push('#elif !defined(ARDUINO_ARCH_ESP32) && !defined(ARDUINO_ARCH_STM32) && !defined(HAVE_HWSERIAL1) && !defined(SERIAL_PORT_HARDWARE1)',
        '#include <SoftwareSerial.h>', 'SoftwareSerial ' + portName + '(2, 3);');
    }
    lines.push('#else', 'auto& ' + portName + ' = Serial' + n + ';', '#endif');
    declaration = lines.join('\n');
    const setup = [];
    if (routed) {
      setup.push('#if defined(ARDUINO_ARCH_ESP32)', portName + '.begin(9600, SERIAL_8N1, ' + rx + ', ' + tx + ');',
        '#else', '#if defined(ARDUINO_ARCH_STM32)', portName + '.setRx(' + rx + ');', portName + '.setTx(' + tx + ');', '#endif');
    } else if (automatic) {
      setup.push('#if defined(ARDUINO_XIAO_ESP32S3)', portName + '.begin(9600, SERIAL_8N1, D7, D6);', '#else');
    }
    setup.push(portName + '.begin(9600);');
    if (routed || automatic) setup.push('#endif');
    begin = setup.join('\n');
  }
  generator.addVariable('mmwave_serial_' + varName, declaration);
  generator.addVariable('mmwave_obj_' + varName, 'Seeed_HSP24 ' + varName + '(' + portName + ');');
  generator.addVariable('mmwave_status_' + varName, 'Seeed_HSP24::RadarStatus ' + varName + '_status;');

  // UARTs may share the boot console pins. Keep the author's setup order.
  let container = block;
  while (container && container.type !== 'arduino_setup') {
    container = container.getSurroundParent ? container.getSurroundParent() : null;
  }
  if (container) return begin + '\n';
  generator.addSetupBegin('mmwave_begin_' + varName, begin + '\n');
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

// Distance value — returns detected distance in cm
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

  return varName + '.setDetectionDistance(' + distance + ', ' + duration + ');\n';
};

// Set gate sensitivity
Arduino.forBlock['mmwave_set_gate_sensitivity'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'radar';
  const gate = generator.valueToCode(block, 'GATE', generator.ORDER_ATOMIC) || '0';
  const movePower = generator.valueToCode(block, 'MOVE_POWER', generator.ORDER_ATOMIC) || '50';
  const staticPower = generator.valueToCode(block, 'STATIC_POWER', generator.ORDER_ATOMIC) || '50';

  return varName + '.setGatePower(' + gate + ', ' + movePower + ', ' + staticPower + ');\n';
};

// Set resolution
Arduino.forBlock['mmwave_set_resolution'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'radar';
  const resolution = block.getFieldValue('RESOLUTION') || '0';

  return varName + '.setResolution(' + resolution + ');\n';
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

  return varName + '.rebootRadar();\n';
};

// Factory reset
Arduino.forBlock['mmwave_factory_reset'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'radar';

  return varName + '.refactoryRadar();\n';
};

// Engineering mode toggle
Arduino.forBlock['mmwave_engineering_mode'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'radar';
  const mode = block.getFieldValue('MODE');

  return varName + (mode === 'ENABLE' ? '.enableEngineeringModel();\n' : '.disableEngineeringModel();\n');
};
