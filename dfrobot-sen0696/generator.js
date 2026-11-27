
function sen0696GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'imu');
}
function sen0696Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}
function sen0696Core() {
  if (typeof window === 'undefined' || !window.boardConfig) return '';
  return [window.boardConfig.core, window.boardConfig.board, window.boardConfig.fqbn].filter(Boolean).join(' ');
}
function sen0696AttachVar(block, typeName) {
  if (block.sen0696VarMonitorAttached) return;
  block.sen0696VarMonitorAttached = true;
  block.sen0696VarLastName = block.getFieldValue('VAR') || 'imu';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block.sen0696VarLastName, typeName);
  }
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block.sen0696VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block.sen0696VarLastName, newName, typeName);
      block.sen0696VarLastName = newName;
    }
  };
}

function sen0696EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('DFRobot_Multi_DOF_IMU', '#include "DFRobot_Multi_DOF_IMU.h"');
}
function sen0696EnsureData(generator, varName) {
  generator.addObject(varName + 'Accel', 'DFRobot_Multi_DOF_IMU::sSensorData_t ' + varName + 'Accel;');
  generator.addObject(varName + 'Gyro', 'DFRobot_Multi_DOF_IMU::sSensorData_t ' + varName + 'Gyro;');
  generator.addObject(varName + 'Mag', 'DFRobot_Multi_DOF_IMU::sSensorData_t ' + varName + 'Mag;');
  generator.addObject(varName + 'Pressure', 'float ' + varName + 'Pressure = 0;');
  generator.addObject(varName + 'Altitude', 'float ' + varName + 'Altitude = 0;');

}
Arduino.forBlock['sen0696_init_i2c'] = function(block, generator) {
  sen0696AttachVar(block, 'DFRobot_Multi_DOF_IMU');
  sen0696EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'imu';
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var address = block.getFieldValue('ADDRESS') || '0x4A';
  generator.addObject(varName, 'DFRobot_Multi_DOF_IMU_I2C ' + varName + '(DFRobot_Multi_DOF_IMU::eSensorModel10DOF, &' + wire + ', ' + address + ');');
  return 'while (!' + varName + '.begin()) {\n  delay(1000);\n}\n' + varName + '.setSensorMode(DFRobot_Multi_DOF_IMU::eNormalMode);\n' + varName + '.setAccelRange(DFRobot_Multi_DOF_IMU::eAccelRange2G);\n' + varName + '.setGyroRange(DFRobot_Multi_DOF_IMU::eGyroRange250DPS);\n';
};
// The editor refreshes SERIAL from the active board. Keep the routing choice in a stable field.
if (typeof Blockly !== 'undefined') {
  const extension = 'sen0696_port_mode';
  if (Blockly.Extensions.isRegistered(extension)) Blockly.Extensions.unregister(extension);
  Blockly.Extensions.register(extension, function () {
    const mode = this.getField('PORT_MODE');
    const show = value => {
      this.getField('SERIAL').setVisible(value === 'BOARD');
      if (this.rendered) this.render();
    };
    mode.setValidator(value => { show(value); return value; });
    show(mode.getValue());
  });
}

Arduino.forBlock['sen0696_init_uart'] = function(block, generator) {
  sen0696AttachVar(block, 'DFRobot_Multi_DOF_IMU');
  sen0696EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'imu';
  var address = block.getFieldValue('ADDRESS') || '0x4A';
  var core = sen0696Core();
  const mode = block.getFieldValue('PORT_MODE') || 'BOARD';
  const automatic = mode === 'AUTO';
  const selected = mode === 'BOARD' ? (block.getFieldValue('SERIAL') || 'Serial1') :
    mode === 'ROUTED2' ? 'Serial2' : 'Serial1';
  const rx = block.getFieldValue('RX') || '16';
  const tx = block.getFieldValue('TX') || '17';
  const numbered = /^Serial([12])$/.exec(selected);
  let port = selected;
  let beforeBegin = '';
  if (core.includes('arduino:avr') || core.includes('esp8266')) {
    generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
    port = varName + 'Serial';
    generator.addObject(varName + '_serial', 'SoftwareSerial ' + port + '(' + rx + ', ' + tx + ');');
  } else if (numbered) {
    port = 'sen0696Port' + numbered[1];
    const n = numbered[1];
    generator.addObject('sen0696_uart_' + n, [
      '#if defined(ARDUINO_ARCH_STM32) && defined(USART' + n + ') && !defined(HAVE_HWSERIAL' + n + ')',
      'Uart ' + port + '(USART' + n + ');',
      '#else', 'auto& ' + port + ' = ' + selected + ';', '#endif',
    ].join('\n'));
    if (mode === 'ROUTED1' || mode === 'ROUTED2') {
      beforeBegin = ['#if defined(ARDUINO_ARCH_STM32)', port + '.setRx(' + rx + ');',
        port + '.setTx(' + tx + ');', '#endif', ''].join('\n');
    }
  }
  const decl = 'DFRobot_Multi_DOF_IMU_UART ' + varName + '(DFRobot_Multi_DOF_IMU::eSensorModel10DOF, &' + port + ', 9600, ' + address;
  // The packed driver opens the port in begin(). Supply pins to its ESP32 constructor.
  const object = automatic
    ? ['#if defined(ARDUINO_XIAO_ESP32S3)', decl + ', D7, D6);', '#else', decl + ');', '#endif'].join('\n')
    : decl + (core.includes('esp32') ? ', ' + rx + ', ' + tx : '') + ');';
  generator.addObject(varName, object);
  return beforeBegin + 'while (!' + varName + '.begin()) {\n  delay(1000);\n}\n' + varName + '.setSensorMode(DFRobot_Multi_DOF_IMU::eNormalMode);\n' + varName + '.setAccelRange(DFRobot_Multi_DOF_IMU::eAccelRange2G);\n' + varName + '.setGyroRange(DFRobot_Multi_DOF_IMU::eGyroRange250DPS);\n';
};
Arduino.forBlock['sen0696_set_mode'] = function(block, generator) {
  sen0696EnsureLib(generator);
  return sen0696GetVar(block) + '.setSensorMode(DFRobot_Multi_DOF_IMU::' + (block.getFieldValue('MODE') || 'eNormalMode') + ');\n';
};
Arduino.forBlock['sen0696_set_accel'] = function(block, generator) {
  sen0696EnsureLib(generator);
  return sen0696GetVar(block) + '.setAccelRange(DFRobot_Multi_DOF_IMU::' + (block.getFieldValue('RANGE') || 'eAccelRange2G') + ');\n';
};
Arduino.forBlock['sen0696_set_gyro'] = function(block, generator) {
  sen0696EnsureLib(generator);
  return sen0696GetVar(block) + '.setGyroRange(DFRobot_Multi_DOF_IMU::' + (block.getFieldValue('RANGE') || 'eGyroRange250DPS') + ');\n';
};
Arduino.forBlock['sen0696_read'] = function(block, generator) {
  sen0696EnsureLib(generator);
  var varName = sen0696GetVar(block);
  sen0696EnsureData(generator, varName);
  return [varName + '.get10dofData(&' + varName + 'Accel, &' + varName + 'Gyro, &' + varName + 'Mag, &' + varName + 'Pressure, false)', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['sen0696_get_data'] = function(block, generator) {
  var varName = sen0696GetVar(block);
  sen0696EnsureData(generator, varName);
  var data = block.getFieldValue('DATA') || 'ACC_X';
  var map = {ACC_X: varName + 'Accel.x', ACC_Y: varName + 'Accel.y', ACC_Z: varName + 'Accel.z', GYR_X: varName + 'Gyro.x', GYR_Y: varName + 'Gyro.y', GYR_Z: varName + 'Gyro.z', MAG_X: varName + 'Mag.x', MAG_Y: varName + 'Mag.y', MAG_Z: varName + 'Mag.z'};
  return [map[data] || map.ACC_X, generator.ORDER_ATOMIC];
};
Arduino.forBlock['sen0696_reset'] = function(block, generator) {
  return sen0696GetVar(block) + '.reset();\n';
};
Arduino.forBlock['sen0696_step'] = function(block, generator) {
  return [sen0696GetVar(block) + '.getStepCount()', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['sen0696_tap'] = function(block, generator) {
  return [sen0696GetVar(block) + '.getTap() == ' + (block.getFieldValue('TYPE') || '1'), generator.ORDER_EQUALITY];
};
Arduino.forBlock['sen0696_orient'] = function(block, generator) {
  return ['(' + sen0696GetVar(block) + '.getOrientation() >> 8) == ' + (block.getFieldValue('TYPE') || '1'), generator.ORDER_EQUALITY];
};
Arduino.forBlock['sen0696_set_int'] = function(block, generator) {
  var pin = block.getFieldValue('PIN') || 'eImuIntPin1';
  var typ = block.getFieldValue('ITYPE') || 'eInt1_2DataReady';
  return sen0696GetVar(block) + '.setInt(DFRobot_Multi_DOF_IMU::' + pin + ', DFRobot_Multi_DOF_IMU::' + typ + ');\n';
};

Arduino.forBlock['sen0696_pressure'] = function(block, generator) {
  var varName = sen0696GetVar(block);
  sen0696EnsureData(generator, varName);
  return [varName + 'Pressure', generator.ORDER_ATOMIC];
};
Arduino.forBlock['sen0696_altitude'] = function(block, generator) {
  var varName = sen0696GetVar(block);
  sen0696EnsureData(generator, varName);
  return ['(' + varName + '.get10dofData(&' + varName + 'Accel, &' + varName + 'Gyro, &' + varName + 'Mag, &' + varName + 'Altitude, true) ? ' + varName + 'Altitude : 0)', generator.ORDER_ATOMIC];
};
Arduino.forBlock['sen0696_cal_alt'] = function(block, generator) {
  var alt = sen0696Value(block, generator, 'ALT', '540');
  return sen0696GetVar(block) + '.calibrateAltitude(' + alt + ');\n';
};
