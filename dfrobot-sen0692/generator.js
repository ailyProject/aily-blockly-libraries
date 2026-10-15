
function sen0692GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'imu');
}
function sen0692Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}
function sen0692Core() {
  if (typeof window === 'undefined' || !window.boardConfig) return '';
  return String(window.boardConfig.core || window.boardConfig.board || '');
}
function sen0692AttachVar(block, typeName) {
  if (block.sen0692VarMonitorAttached) return;
  block.sen0692VarMonitorAttached = true;
  block.sen0692VarLastName = block.getFieldValue('VAR') || 'imu';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block.sen0692VarLastName, typeName);
  }
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block.sen0692VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block.sen0692VarLastName, newName, typeName);
      block.sen0692VarLastName = newName;
    }
  };
}

function sen0692EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('DFRobot_Multi_DOF_IMU', '#include "DFRobot_Multi_DOF_IMU.h"');
}
function sen0692EnsureData(generator, varName) {
  generator.addObject(varName + 'Accel', 'DFRobot_Multi_DOF_IMU::sSensorData_t ' + varName + 'Accel;');
  generator.addObject(varName + 'Gyro', 'DFRobot_Multi_DOF_IMU::sSensorData_t ' + varName + 'Gyro;');

}
Arduino.forBlock['sen0692_init_i2c'] = function(block, generator) {
  sen0692AttachVar(block, 'DFRobot_Multi_DOF_IMU');
  sen0692EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'imu';
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var address = block.getFieldValue('ADDRESS') || '0x4A';
  generator.addObject(varName, 'DFRobot_Multi_DOF_IMU_I2C ' + varName + '(DFRobot_Multi_DOF_IMU::eSensorModel6DOF, &' + wire + ', ' + address + ');');
  return 'while (!' + varName + '.begin()) {\n  delay(1000);\n}\n' + varName + '.setSensorMode(DFRobot_Multi_DOF_IMU::eNormalMode);\n' + varName + '.setAccelRange(DFRobot_Multi_DOF_IMU::eAccelRange2G);\n' + varName + '.setGyroRange(DFRobot_Multi_DOF_IMU::eGyroRange250DPS);\n';
};
Arduino.forBlock['sen0692_init_uart'] = function(block, generator) {
  sen0692AttachVar(block, 'DFRobot_Multi_DOF_IMU');
  sen0692EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'imu';
  var address = block.getFieldValue('ADDRESS') || '0x4A';
  var core = sen0692Core();
  var serialName = block.getFieldValue('SERIAL') || 'Serial1';
  var rx = block.getFieldValue('RX') || '16';
  var tx = block.getFieldValue('TX') || '17';
  if (core.indexOf('arduino:avr') !== -1 || core.indexOf('esp8266') !== -1) {
    generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
    generator.addObject(varName + '_serial', 'SoftwareSerial ' + varName + 'Serial(' + rx + ', ' + tx + ');');
    generator.addObject(varName, 'DFRobot_Multi_DOF_IMU_UART ' + varName + '(DFRobot_Multi_DOF_IMU::eSensorModel6DOF, &' + varName + 'Serial, 9600, ' + address + ');');
  } else if (core.indexOf('esp32') !== -1) {
    generator.addObject(varName, 'DFRobot_Multi_DOF_IMU_UART ' + varName + '(DFRobot_Multi_DOF_IMU::eSensorModel6DOF, &' + serialName + ', 9600, ' + address + ', ' + rx + ', ' + tx + ');');
  } else {
    generator.addObject(varName, 'DFRobot_Multi_DOF_IMU_UART ' + varName + '(DFRobot_Multi_DOF_IMU::eSensorModel6DOF, &' + serialName + ', 9600, ' + address + ');');
  }
  return 'while (!' + varName + '.begin()) {\n  delay(1000);\n}\n' + varName + '.setSensorMode(DFRobot_Multi_DOF_IMU::eNormalMode);\n' + varName + '.setAccelRange(DFRobot_Multi_DOF_IMU::eAccelRange2G);\n' + varName + '.setGyroRange(DFRobot_Multi_DOF_IMU::eGyroRange250DPS);\n';
};
Arduino.forBlock['sen0692_set_mode'] = function(block, generator) {
  sen0692EnsureLib(generator);
  return sen0692GetVar(block) + '.setSensorMode(DFRobot_Multi_DOF_IMU::' + (block.getFieldValue('MODE') || 'eNormalMode') + ');\n';
};
Arduino.forBlock['sen0692_set_accel'] = function(block, generator) {
  sen0692EnsureLib(generator);
  return sen0692GetVar(block) + '.setAccelRange(DFRobot_Multi_DOF_IMU::' + (block.getFieldValue('RANGE') || 'eAccelRange2G') + ');\n';
};
Arduino.forBlock['sen0692_set_gyro'] = function(block, generator) {
  sen0692EnsureLib(generator);
  return sen0692GetVar(block) + '.setGyroRange(DFRobot_Multi_DOF_IMU::' + (block.getFieldValue('RANGE') || 'eGyroRange250DPS') + ');\n';
};
Arduino.forBlock['sen0692_read'] = function(block, generator) {
  sen0692EnsureLib(generator);
  var varName = sen0692GetVar(block);
  sen0692EnsureData(generator, varName);
  return [varName + '.get6dofData(&' + varName + 'Accel, &' + varName + 'Gyro)', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['sen0692_get_data'] = function(block, generator) {
  var varName = sen0692GetVar(block);
  sen0692EnsureData(generator, varName);
  var data = block.getFieldValue('DATA') || 'ACC_X';
  var map = {ACC_X: varName + 'Accel.x', ACC_Y: varName + 'Accel.y', ACC_Z: varName + 'Accel.z', GYR_X: varName + 'Gyro.x', GYR_Y: varName + 'Gyro.y', GYR_Z: varName + 'Gyro.z'};
  return [map[data] || map.ACC_X, generator.ORDER_ATOMIC];
};
Arduino.forBlock['sen0692_reset'] = function(block, generator) {
  return sen0692GetVar(block) + '.reset();\n';
};
Arduino.forBlock['sen0692_step'] = function(block, generator) {
  return [sen0692GetVar(block) + '.getStepCount()', generator.ORDER_FUNCTION_CALL];
};
Arduino.forBlock['sen0692_tap'] = function(block, generator) {
  return [sen0692GetVar(block) + '.getTap() == ' + (block.getFieldValue('TYPE') || '1'), generator.ORDER_EQUALITY];
};
Arduino.forBlock['sen0692_orient'] = function(block, generator) {
  return ['(' + sen0692GetVar(block) + '.getOrientation() >> 8) == ' + (block.getFieldValue('TYPE') || '1'), generator.ORDER_EQUALITY];
};
Arduino.forBlock['sen0692_set_int'] = function(block, generator) {
  var pin = block.getFieldValue('PIN') || 'eImuIntPin1';
  var typ = block.getFieldValue('ITYPE') || 'eInt1_2DataReady';
  return sen0692GetVar(block) + '.setInt(DFRobot_Multi_DOF_IMU::' + pin + ', DFRobot_Multi_DOF_IMU::' + typ + ');\n';
};
