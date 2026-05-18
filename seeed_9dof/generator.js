'use strict';

function seeed9dofEnsureLibraries(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('Seeed9DOF_ICM20600', '#include <ICM20600.h>');
  generator.addLibrary('Seeed9DOF_AK09918', '#include <AK09918.h>');
}

function seeed9dofEnsureCore(generator) {
  seeed9dofEnsureLibraries(generator);
  generator.addObject('seeed9dof_wrapper_class', `class Seeed9DOF {
 public:
  ICM20600 icm;
  AK09918 mag;

  Seeed9DOF(bool ad0 = true) : icm(ad0), mag() {}

  AK09918_err_type_t begin(AK09918_mode_type_t mode) {
    Wire.begin();
    icm.initialize();
    AK09918_err_type_t err = mag.initialize();
    if (err != AK09918_ERR_OK) {
      return err;
    }
    if (mode != AK09918_NORMAL) {
      mag.switchMode(AK09918_POWER_DOWN);
      delay(1);
      err = mag.switchMode(mode);
    }
    return err;
  }
};`);
}

function seeed9dofSanitizeName(name) {
  var clean = String(name || 'imu').replace(/[^A-Za-z0-9_]/g, '_');
  if (!/^[A-Za-z_]/.test(clean)) {
    clean = '_' + clean;
  }
  return clean || 'imu';
}

function seeed9dofGetVar(block) {
  var varField = block.getField('VAR');
  return varField ? varField.getText() : (block.getFieldValue('VAR') || 'imu');
}

function seeed9dofCodeVar(block) {
  return seeed9dofSanitizeName(seeed9dofGetVar(block));
}

function seeed9dofAttachVarMonitor(block) {
  if (block._seeed9dofVarMonitorAttached) {
    return;
  }

  block._seeed9dofVarMonitorAttached = true;
  block._seeed9dofVarLastName = block.getFieldValue('VAR') || 'imu';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._seeed9dofVarLastName, 'Seeed9DOF');
  }

  var varField = block.getField('VAR');
  if (varField) {
    var originalFinishEditing = varField.onFinishEditing_;
    varField.onFinishEditing_ = function(newName) {
      if (typeof originalFinishEditing === 'function') {
        originalFinishEditing.call(this, newName);
      }
      var workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
      var oldName = block._seeed9dofVarLastName;
      if (workspace && newName && newName !== oldName && typeof renameVariableInBlockly === 'function') {
        renameVariableInBlockly(block, oldName, newName, 'Seeed9DOF');
        block._seeed9dofVarLastName = newName;
      }
    };
  }
}

function seeed9dofEnsureInstance(generator, varName, ad0) {
  seeed9dofEnsureCore(generator);
  generator.addObject('seeed9dof_' + varName, 'Seeed9DOF ' + varName + '(' + ad0 + ');');
  generator.addVariable('seeed9dof_err_' + varName, 'AK09918_err_type_t _seeed9dof_err_' + varName + ' = AK09918_ERR_OK;');
  seeed9dofEnsureOffsets(generator, varName);
}

function seeed9dofEnsureOffsets(generator, varName) {
  generator.addVariable('seeed9dof_offsets_' + varName,
    'int32_t _seeed9dof_offset_x_' + varName + ' = 0;\n' +
    'int32_t _seeed9dof_offset_y_' + varName + ' = 0;\n' +
    'int32_t _seeed9dof_offset_z_' + varName + ' = 0;');
}

function seeed9dofEnsureSerial(generator, serialPort) {
  if (typeof ensureSerialBegin === 'function') {
    ensureSerialBegin(serialPort, generator);
  } else {
    generator.addSetupBegin('serial_' + serialPort + '_begin', serialPort + '.begin(9600);');
  }
}

function seeed9dofEnsureMagAxisHelper(generator) {
  generator.addFunction('seeed9dof_read_mag_axis', `int32_t seeed9dof_read_mag_axis(AK09918 &mag, uint8_t axis, bool raw) {
  int32_t x = 0;
  int32_t y = 0;
  int32_t z = 0;
  AK09918_err_type_t err = raw ? mag.getRawData(&x, &y, &z) : mag.getData(&x, &y, &z);
  if (err != AK09918_ERR_OK) {
    return 0;
  }
  if (axis == 0) return x;
  if (axis == 1) return y;
  return z;
}`);
}

function seeed9dofEnsureCalibrationHelper(generator) {
  generator.addFunction('seeed9dof_calibrate_magnet', `void seeed9dof_calibrate_magnet(AK09918 &mag, uint32_t timeout, int32_t *offsetX, int32_t *offsetY, int32_t *offsetZ) {
  int32_t x = 0;
  int32_t y = 0;
  int32_t z = 0;
  int32_t minX = 0;
  int32_t maxX = 0;
  int32_t minY = 0;
  int32_t maxY = 0;
  int32_t minZ = 0;
  int32_t maxZ = 0;

  if (mag.getData(&x, &y, &z) != AK09918_ERR_OK) {
    return;
  }

  minX = maxX = x;
  minY = maxY = y;
  minZ = maxZ = z;
  uint32_t startTime = millis();

  while ((millis() - startTime) < timeout) {
    if (mag.getData(&x, &y, &z) == AK09918_ERR_OK) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
    delay(100);
  }

  *offsetX = minX + (maxX - minX) / 2;
  *offsetY = minY + (maxY - minY) / 2;
  *offsetZ = minZ + (maxZ - minZ) / 2;
}`);
}

function seeed9dofEnsureHeadingHelper(generator) {
  generator.addLibrary('math', '#include <math.h>');
  generator.addFunction('seeed9dof_heading', `double seeed9dof_heading(ICM20600 &icm, AK09918 &mag, double declination, int32_t offsetX, int32_t offsetY, int32_t offsetZ) {
  int16_t accX = icm.getAccelerationX();
  int16_t accY = icm.getAccelerationY();
  int16_t accZ = icm.getAccelerationZ();
  int32_t magX = 0;
  int32_t magY = 0;
  int32_t magZ = 0;

  if (mag.getData(&magX, &magY, &magZ) != AK09918_ERR_OK) {
    return 0.0;
  }

  magX -= offsetX;
  magY -= offsetY;
  magZ -= offsetZ;

  double roll = atan2((double)accY, (double)accZ);
  double pitch = atan2(-(double)accX, sqrt((double)accY * accY + (double)accZ * accZ));
  double xHeading = magX * cos(pitch) + magY * sin(roll) * sin(pitch) + magZ * cos(roll) * sin(pitch);
  double yHeading = magY * cos(roll) - magZ * sin(pitch);
  double heading = 180.0 + 57.2957795 * atan2(yHeading, xHeading) + declination;

  while (heading < 0.0) heading += 360.0;
  while (heading >= 360.0) heading -= 360.0;
  return heading;
}`);
}

Arduino.forBlock['seeed_9dof_init'] = function(block, generator) {
  seeed9dofAttachVarMonitor(block);

  var rawName = block.getFieldValue('VAR') || 'imu';
  var varName = seeed9dofSanitizeName(rawName);
  var ad0 = block.getFieldValue('AD0') || 'true';
  var magMode = block.getFieldValue('MAG_MODE') || 'AK09918_CONTINUOUS_100HZ';

  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(rawName, 'Seeed9DOF');
  }

  seeed9dofEnsureInstance(generator, varName, ad0);
  seeed9dofEnsureSerial(generator, 'Serial');

  return '_seeed9dof_err_' + varName + ' = ' + varName + '.begin(' + magMode + ');\n' +
    'if (_seeed9dof_err_' + varName + ' != AK09918_ERR_OK) {\n' +
    '  Serial.println(' + varName + '.mag.strError(_seeed9dof_err_' + varName + '));\n' +
    '}\n';
};

Arduino.forBlock['seeed_9dof_read_motion'] = function(block, generator) {
  seeed9dofEnsureCore(generator);
  var varName = seeed9dofCodeVar(block);
  var type = block.getFieldValue('TYPE') || 'ACCEL';
  var axis = block.getFieldValue('AXIS') || 'X';
  var methodMap = {
    ACCEL: 'getAcceleration',
    GYRO: 'getGyroscope',
    RAW_ACCEL: 'getRawAcceleration',
    RAW_GYRO: 'getRawGyroscope'
  };

  return [varName + '.icm.' + methodMap[type] + axis + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_9dof_read_magnetic'] = function(block, generator) {
  seeed9dofEnsureCore(generator);
  seeed9dofEnsureMagAxisHelper(generator);
  var varName = seeed9dofCodeVar(block);
  var raw = block.getFieldValue('TYPE') === 'RAW' ? 'true' : 'false';
  var axis = block.getFieldValue('AXIS') || '0';

  return ['seeed9dof_read_mag_axis(' + varName + '.mag, ' + axis + ', ' + raw + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_9dof_read_temperature'] = function(block, generator) {
  seeed9dofEnsureCore(generator);
  var varName = seeed9dofCodeVar(block);
  return [varName + '.icm.getTemperature()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_9dof_magnetic_ready'] = function(block, generator) {
  seeed9dofEnsureCore(generator);
  var varName = seeed9dofCodeVar(block);
  return [varName + '.mag.isDataReady() == AK09918_ERR_OK', generator.ORDER_RELATIONAL];
};

Arduino.forBlock['seeed_9dof_magnet_status'] = function(block, generator) {
  seeed9dofEnsureCore(generator);
  var varName = seeed9dofCodeVar(block);
  var status = block.getFieldValue('STATUS') || 'DATA_READY';
  var calls = {
    DATA_READY: varName + '.mag.isDataReady()',
    DATA_SKIP: varName + '.mag.isDataSkip()',
    SELF_TEST: varName + '.mag.selfTest()'
  };

  return [calls[status], generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_9dof_error_text'] = function(block, generator) {
  seeed9dofEnsureCore(generator);
  var varName = seeed9dofCodeVar(block);
  var errorCode = generator.valueToCode(block, 'ERROR', generator.ORDER_ATOMIC) || '0';

  return [varName + '.mag.strError((AK09918_err_type_t)(' + errorCode + '))', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_9dof_set_power_mode'] = function(block, generator) {
  seeed9dofEnsureCore(generator);
  var varName = seeed9dofCodeVar(block);
  var mode = block.getFieldValue('MODE') || 'ICM_6AXIS_LOW_POWER';

  return varName + '.icm.setPowerMode(' + mode + ');\n';
};

Arduino.forBlock['seeed_9dof_set_motion_range'] = function(block, generator) {
  seeed9dofEnsureCore(generator);
  var varName = seeed9dofCodeVar(block);
  var accRange = block.getFieldValue('ACC_RANGE') || 'RANGE_16G';
  var gyroRange = block.getFieldValue('GYRO_RANGE') || 'RANGE_2K_DPS';

  return varName + '.icm.setAccScaleRange(' + accRange + ');\n' +
    varName + '.icm.setGyroScaleRange(' + gyroRange + ');\n';
};

Arduino.forBlock['seeed_9dof_set_sample_divider'] = function(block, generator) {
  seeed9dofEnsureCore(generator);
  var varName = seeed9dofCodeVar(block);
  var divider = generator.valueToCode(block, 'DIV', generator.ORDER_ATOMIC) || '0';

  return varName + '.icm.setSampleRateDivier((uint8_t)(' + divider + '));\n';
};

Arduino.forBlock['seeed_9dof_set_magnet_mode'] = function(block, generator) {
  seeed9dofEnsureCore(generator);
  var varName = seeed9dofCodeVar(block);
  var mode = block.getFieldValue('MODE') || 'AK09918_CONTINUOUS_100HZ';

  return '_seeed9dof_err_' + varName + ' = ' + varName + '.mag.switchMode(' + mode + ');\n';
};

Arduino.forBlock['seeed_9dof_calibrate_magnet'] = function(block, generator) {
  seeed9dofEnsureCore(generator);
  seeed9dofEnsureCalibrationHelper(generator);
  var varName = seeed9dofCodeVar(block);
  var timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '10000';
  seeed9dofEnsureOffsets(generator, varName);

  return 'seeed9dof_calibrate_magnet(' + varName + '.mag, (uint32_t)(' + timeout + '), ' +
    '&_seeed9dof_offset_x_' + varName + ', &_seeed9dof_offset_y_' + varName + ', &_seeed9dof_offset_z_' + varName + ');\n';
};

Arduino.forBlock['seeed_9dof_heading'] = function(block, generator) {
  seeed9dofEnsureCore(generator);
  seeed9dofEnsureHeadingHelper(generator);
  var varName = seeed9dofCodeVar(block);
  var declination = generator.valueToCode(block, 'DECLINATION', generator.ORDER_ATOMIC) || '0';
  seeed9dofEnsureOffsets(generator, varName);

  return ['seeed9dof_heading(' + varName + '.icm, ' + varName + '.mag, ' + declination + ', ' +
    '_seeed9dof_offset_x_' + varName + ', _seeed9dof_offset_y_' + varName + ', _seeed9dof_offset_z_' + varName + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['seeed_9dof_print_all'] = function(block, generator) {
  seeed9dofEnsureCore(generator);
  seeed9dofEnsureMagAxisHelper(generator);
  seeed9dofEnsureHeadingHelper(generator);
  var varName = seeed9dofCodeVar(block);
  var serialPort = block.getFieldValue('SERIAL') || 'Serial';
  seeed9dofEnsureOffsets(generator, varName);
  seeed9dofEnsureSerial(generator, serialPort);

  var code = '';
  code += serialPort + '.print("A: ");\n';
  code += serialPort + '.print(' + varName + '.icm.getAccelerationX());\n';
  code += serialPort + '.print(", ");\n';
  code += serialPort + '.print(' + varName + '.icm.getAccelerationY());\n';
  code += serialPort + '.print(", ");\n';
  code += serialPort + '.println(' + varName + '.icm.getAccelerationZ());\n';
  code += serialPort + '.print("G: ");\n';
  code += serialPort + '.print(' + varName + '.icm.getGyroscopeX());\n';
  code += serialPort + '.print(", ");\n';
  code += serialPort + '.print(' + varName + '.icm.getGyroscopeY());\n';
  code += serialPort + '.print(", ");\n';
  code += serialPort + '.println(' + varName + '.icm.getGyroscopeZ());\n';
  code += serialPort + '.print("M: ");\n';
  code += serialPort + '.print(seeed9dof_read_mag_axis(' + varName + '.mag, 0, false));\n';
  code += serialPort + '.print(", ");\n';
  code += serialPort + '.print(seeed9dof_read_mag_axis(' + varName + '.mag, 1, false));\n';
  code += serialPort + '.print(", ");\n';
  code += serialPort + '.println(seeed9dof_read_mag_axis(' + varName + '.mag, 2, false));\n';
  code += serialPort + '.print("Temp: ");\n';
  code += serialPort + '.println(' + varName + '.icm.getTemperature());\n';
  code += serialPort + '.print("Heading: ");\n';
  code += serialPort + '.println(seeed9dof_heading(' + varName + '.icm, ' + varName + '.mag, 0, _seeed9dof_offset_x_' + varName + ', _seeed9dof_offset_y_' + varName + ', _seeed9dof_offset_z_' + varName + '));\n';

  return code;
};

Arduino.forBlock['seeed_9dof_device_id'] = function(block, generator) {
  seeed9dofEnsureCore(generator);
  var varName = seeed9dofCodeVar(block);
  var part = block.getFieldValue('PART') || 'ICM';
  var code = part === 'AK' ? varName + '.mag.getDeviceID()' : varName + '.icm.getDeviceID()';

  return [code, generator.ORDER_FUNCTION_CALL];
};