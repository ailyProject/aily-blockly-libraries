// _varMonitorAttached: the init field hook below monitors variable renames.
function dfrobot_human_detectionEnsureLibrary(generator) {
  generator.addLibrary('dfrobot_human_detection_0', '#include <DFRobot_HumanDetection.h>');
}

function dfrobot_human_detectionVariable(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'human');
}

function dfrobot_human_detectionAttachVariable(block) {
  if (block._dfrobot_human_detectionVariableAttached) return;
  block._dfrobot_human_detectionVariableAttached = true;
  block._dfrobot_human_detectionLastName = block.getFieldValue('VAR') || 'human';
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(block._dfrobot_human_detectionLastName, 'DFRobot_HumanDetection');
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._dfrobot_human_detectionLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._dfrobot_human_detectionLastName, newName, 'DFRobot_HumanDetection');
      block._dfrobot_human_detectionLastName = newName;
    }
  };
}

function dfrobot_human_detectionEnsureExtras(generator, varName) {
  // No cached data objects required.
}

if (Blockly.Extensions.isRegistered('dfrobot_c1001_uart')) Blockly.Extensions.unregister('dfrobot_c1001_uart');
Blockly.Extensions.register('dfrobot_c1001_uart', function () {
  const mode = this.getField('PORT_MODE');
  const show = value => {
    this.getField('SERIAL').setVisible(value === 'BOARD');
    this.getField('RX_PIN').getParentInput().setVisible(value === 'ROUTED1');
    if (this.rendered) this.render();
  };
  mode.setValidator(value => { show(value); return value; });
  show(mode.getValue());

});

Arduino.forBlock['dfrobot_human_detection_init'] = function(block, generator) {
  dfrobot_human_detectionAttachVariable(block);
  dfrobot_human_detectionEnsureLibrary(generator);
  const name = block.getFieldValue('VAR') || 'human';
  const mode = block.getFieldValue('PORT_MODE') || 'BOARD';
  const selection = mode === 'BOARD' ? (block.getFieldValue('SERIAL') || 'Serial1') : mode;
  const routed = selection === 'ROUTED1';
  const automatic = selection === 'AUTO';
  const board = typeof window !== 'undefined' ? window.boardConfig : null;
  const supported = board?.serialPort?.map(option => option[1]) || [];
  const defaultPort = !supported.length || supported.includes('Serial1') || board?.core?.endsWith(':avr')
    ? 'Serial1' : supported[0];
  const serial = automatic ? defaultPort : routed ? 'Serial1' : selection;
  const numbered = /^Serial(\d+)$/.exec(serial);
  let port = serial;
  let begin = port + '.begin(115200);';
  if (numbered) {
    const n = numbered[1];
    port = 'c1001' + (automatic ? 'Auto' : '') + 'Port' + n;
    const declaration = ['#if defined(ARDUINO_ARCH_STM32) && defined(USART'+n+') && !defined(HAVE_HWSERIAL'+n+')',
      'Uart '+port+'(USART'+n+');'];
    if (automatic) declaration.push('#elif defined(ARDUINO_ARCH_AVR) && !defined(HAVE_HWSERIAL1)',
      '#include <SoftwareSerial.h>', 'SoftwareSerial '+port+'(2, 3);');
    declaration.push('#else','auto& '+port+' = '+serial+';','#endif');
    generator.addObject('dfrobot_c1001_port_'+port, declaration.join('\n'));
    begin = port+'.begin(115200);';
    if (routed) {
      const rx = block.getFieldValue('RX_PIN') || '2';
      const tx = block.getFieldValue('TX_PIN') || '3';
      begin = ['#if defined(ARDUINO_ARCH_ESP32)',port+'.begin(115200, SERIAL_8N1, '+rx+', '+tx+');',
        '#else','#if defined(ARDUINO_ARCH_STM32)',port+'.setRx('+rx+');',port+'.setTx('+tx+');','#endif',begin,'#endif'].join('\n');
    } else if (automatic) {
      begin = ['#if defined(ARDUINO_XIAO_ESP32S3)',port+'.begin(115200, SERIAL_8N1, D7, D6);','#else',begin,'#endif'].join('\n');
    }
  }
  generator.addObject('dfrobot_human_detection_object_'+name, 'DFRobot_HumanDetection '+name+'(&'+port+');');
  const code = begin+'\nif ('+name+'.begin() == 0) '+name+'.configWorkMode('+name+'.eSleepMode);\n';
  let parent = block;
  while (parent && parent.type !== 'arduino_setup') parent = parent.getSurroundParent?.();
  if (parent) return code;
  generator.addSetupBegin('dfrobot_human_detection_init_'+name, code);
  return '';
};

Arduino.forBlock['dfrobot_human_detection_read'] = function(block, generator) {
  dfrobot_human_detectionEnsureLibrary(generator);
  var varName = dfrobot_human_detectionVariable(block);
  dfrobot_human_detectionEnsureExtras(generator, varName);
  var data = block.getFieldValue('DATA') || "presence";
  var expressions = {
    "presence": String(varName) + ".smHumanData(" + String(varName) + ".eHumanPresence)",
    "movement": String(varName) + ".smHumanData(" + String(varName) + ".eHumanMovement)",
    "range": String(varName) + ".smHumanData(" + String(varName) + ".eHumanMovingRange)",
    "distance": String(varName) + ".smHumanData(" + String(varName) + ".eHumanDistance)",
    "heart_rate": String(varName) + ".getHeartRate()",
    "breathing": String(varName) + ".getBreatheValue()",
    "mode": String(varName) + ".getWorkMode()"
  };
  return [expressions[data] || expressions["presence"], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['dfrobot_human_detection_action'] = function(block, generator) {
  dfrobot_human_detectionEnsureLibrary(generator);
  var varName = dfrobot_human_detectionVariable(block);
  dfrobot_human_detectionEnsureExtras(generator, varName);
  var action = block.getFieldValue('ACTION') || "sleep_mode";
  var actions = {
    "sleep_mode": String(varName) + ".configWorkMode(" + String(varName) + ".eSleepMode);",
    "fall_mode": String(varName) + ".configWorkMode(" + String(varName) + ".eFallingMode);"
  };
  return (actions[action] || actions["sleep_mode"]) + '\n';
};

