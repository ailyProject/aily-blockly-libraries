// Generator.js for EVLabMotion library

// 取出 field_variable 上显示的变量名，与 core-variables 的处理方式保持一致
Arduino.evlabMotionVarName = function (block, fieldName, fallback) {
  const field = block.getField(fieldName);
  return (field && field.getText()) || fallback;
};

// 速度/方向都是 uint8_t 参数，超过 255 会静默绕回（256 变 0，电机反而停转），
// 所以在生成代码时就钳进范围：字面量直接算出来，表达式交给 constrain()。
Arduino.evlabMotionClampByte = function (value) {
  const literal = Number(value);
  if (Number.isFinite(literal)) return String(Math.min(Math.max(Math.round(literal), 0), 255));
  return 'constrain(' + value + ', 0, 255)';
};

Arduino.evlabMotionEnsureLibrary = function (generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('EVLabMotion', '#include <EVLabMotion.h>');
};

// 回读帧和最后发送帧都要用 uint8_t[3] 出参，图形化里取单个字节更实用
Arduino.evlabMotionEnsureFrameHelpers = function (generator) {
  let code = '';
  code += 'int evlabMotionReadFrameByte(EVLabMotion &dev, uint8_t index) {\n';
  code += '  uint8_t frame[EVLABMOTION_FRAME_SIZE];\n';
  code += '  if (dev.readFrame(frame) != EVLABMOTION_FRAME_SIZE) return -1;\n';
  code += '  if (index >= EVLABMOTION_FRAME_SIZE) return -1;\n';
  code += '  return frame[index];\n';
  code += '}\n';
  generator.addFunction('evlabMotionReadFrameByte', code);
};

Arduino.evlabMotionEnsureLastFrameHelpers = function (generator) {
  let code = '';
  code += 'int evlabMotionLastFrameByte(EVLabMotion &dev, uint8_t index) {\n';
  code += '  uint8_t frame[EVLABMOTION_FRAME_SIZE];\n';
  code += '  if (index >= EVLABMOTION_FRAME_SIZE) return -1;\n';
  code += '  dev.getLastFrame(frame);\n';
  code += '  return frame[index];\n';
  code += '}\n';
  generator.addFunction('evlabMotionLastFrameByte', code);
};

Arduino.forBlock['evlabmotion_init'] = function (block, generator) {
  // 变量改名监听
  if (!block._evlabMotionVarMonitorAttached) {
    block._evlabMotionVarMonitorAttached = true;
    block._evlabMotionVarLastName = block.getFieldValue('VAR') || 'motion';
    registerVariableToBlockly(block._evlabMotionVarLastName, 'EVLabMotion');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function (newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._evlabMotionVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'EVLabMotion');
          block._evlabMotionVarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'motion';
  const wire = block.getFieldValue('WIRE') || 'Wire';

  Arduino.evlabMotionEnsureLibrary(generator);
  ensureSerialBegin('Serial', generator);

  // 协处理器地址固定 0x10，构造函数只需要指定 I2C 总线
  if (wire && wire !== 'Wire' && wire !== '') {
    generator.addObject(varName, 'EVLabMotion ' + varName + '(&' + wire + ');');
  } else {
    generator.addObject(varName, 'EVLabMotion ' + varName + ';');
  }

  // Wire.begin 去重，多个库共用同一条总线时只初始化一次。
  // 必须用 addSetupBegin：本块返回的 begin() 落在用户 setup 正文里，
  // 总线要比它先起来。
  const wireBeginKey = 'wire_' + wire + '_begin';
  let pinComment = '';
  try {
    const boardConfig = window['boardConfig'];
    if (boardConfig && boardConfig.i2cPins && boardConfig.i2cPins[wire]) {
      const pins = boardConfig.i2cPins[wire];
      const sdaPin = pins.find(p => p[0] === 'SDA');
      const sclPin = pins.find(p => p[0] === 'SCL');
      if (sdaPin && sclPin) {
        pinComment = '// ' + wire + ': SDA=' + sdaPin[1] + ', SCL=' + sclPin[1] + '\n';
      }
    }
  } catch (e) {}
  generator.addSetupBegin(wireBeginKey, pinComment + wire + '.begin();\n');

  let code = '';
  code += '// 初始化 EasyVoiceLab 1306 运动协处理器 ' + varName + '\n';
  code += 'if (!' + varName + '.begin()) {\n';
  code += '  Serial.print("运动模块初始化失败，未在地址 0x");\n';
  code += '  Serial.print(' + varName + '.getAddress(), HEX);\n';
  code += '  Serial.println(" 找到协处理器，请检查接线与上拉电阻");\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['evlabmotion_is_connected'] = function (block, generator) {
  const varName = Arduino.evlabMotionVarName(block, 'VAR', 'motion');
  Arduino.evlabMotionEnsureLibrary(generator);
  return [varName + '.isConnected()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['evlabmotion_get_address'] = function (block, generator) {
  const varName = Arduino.evlabMotionVarName(block, 'VAR', 'motion');
  Arduino.evlabMotionEnsureLibrary(generator);
  return [varName + '.getAddress()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['evlabmotion_set_servo'] = function (block, generator) {
  const varName = Arduino.evlabMotionVarName(block, 'VAR', 'motion');
  const index = block.getFieldValue('INDEX') || '1';
  const angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_NONE) || '90';
  Arduino.evlabMotionEnsureLibrary(generator);
  return varName + '.setServo(' + index + ', ' + angle + ');\n';
};

Arduino.forBlock['evlabmotion_set_all_servos'] = function (block, generator) {
  const varName = Arduino.evlabMotionVarName(block, 'VAR', 'motion');
  const angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_NONE) || '90';
  Arduino.evlabMotionEnsureLibrary(generator);
  return varName + '.setAllServos(' + angle + ');\n';
};

Arduino.forBlock['evlabmotion_motor_run'] = function (block, generator) {
  const varName = Arduino.evlabMotionVarName(block, 'VAR', 'motion');
  const index = block.getFieldValue('INDEX') || '1';
  const dir = block.getFieldValue('DIR') || 'FORWARD';
  const speed = Arduino.evlabMotionClampByte(generator.valueToCode(block, 'SPEED', generator.ORDER_NONE) || '0');
  Arduino.evlabMotionEnsureLibrary(generator);
  const method = dir === 'BACKWARD' ? '.backward(' : '.forward(';
  return varName + method + index + ', ' + speed + ');\n';
};

Arduino.forBlock['evlabmotion_set_motor'] = function (block, generator) {
  const varName = Arduino.evlabMotionVarName(block, 'VAR', 'motion');
  const index = block.getFieldValue('INDEX') || '1';
  const dir = Arduino.evlabMotionClampByte(generator.valueToCode(block, 'DIR', generator.ORDER_NONE) || '1');
  const speed = Arduino.evlabMotionClampByte(generator.valueToCode(block, 'SPEED', generator.ORDER_NONE) || '0');
  Arduino.evlabMotionEnsureLibrary(generator);
  return varName + '.setMotor(' + index + ', ' + dir + ', ' + speed + ');\n';
};

Arduino.forBlock['evlabmotion_stop_motor'] = function (block, generator) {
  const varName = Arduino.evlabMotionVarName(block, 'VAR', 'motion');
  const index = block.getFieldValue('INDEX') || '1';
  Arduino.evlabMotionEnsureLibrary(generator);
  return varName + '.stopMotor(' + index + ');\n';
};

Arduino.forBlock['evlabmotion_stop_motors'] = function (block, generator) {
  const varName = Arduino.evlabMotionVarName(block, 'VAR', 'motion');
  Arduino.evlabMotionEnsureLibrary(generator);
  return varName + '.stopMotors();\n';
};

Arduino.forBlock['evlabmotion_send_frame'] = function (block, generator) {
  const varName = Arduino.evlabMotionVarName(block, 'VAR', 'motion');
  const id = generator.valueToCode(block, 'ID', generator.ORDER_NONE) || '0';
  const arg1 = generator.valueToCode(block, 'ARG1', generator.ORDER_NONE) || '0';
  const arg2 = generator.valueToCode(block, 'ARG2', generator.ORDER_NONE) || '0';
  Arduino.evlabMotionEnsureLibrary(generator);
  return varName + '.sendFrame(' + id + ', ' + arg1 + ', ' + arg2 + ');\n';
};

Arduino.forBlock['evlabmotion_verify'] = function (block, generator) {
  const varName = Arduino.evlabMotionVarName(block, 'VAR', 'motion');
  Arduino.evlabMotionEnsureLibrary(generator);
  return [varName + '.verify()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['evlabmotion_read_frame_byte'] = function (block, generator) {
  const varName = Arduino.evlabMotionVarName(block, 'VAR', 'motion');
  const part = block.getFieldValue('PART') || '0';
  Arduino.evlabMotionEnsureLibrary(generator);
  Arduino.evlabMotionEnsureFrameHelpers(generator);
  return ['evlabMotionReadFrameByte(' + varName + ', ' + part + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['evlabmotion_last_frame_byte'] = function (block, generator) {
  const varName = Arduino.evlabMotionVarName(block, 'VAR', 'motion');
  const part = block.getFieldValue('PART') || '0';
  Arduino.evlabMotionEnsureLibrary(generator);
  Arduino.evlabMotionEnsureLastFrameHelpers(generator);
  return ['evlabMotionLastFrameByte(' + varName + ', ' + part + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['evlabmotion_last_error'] = function (block, generator) {
  const varName = Arduino.evlabMotionVarName(block, 'VAR', 'motion');
  Arduino.evlabMotionEnsureLibrary(generator);
  return [varName + '.lastError()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['evlabmotion_last_write'] = function (block, generator) {
  const varName = Arduino.evlabMotionVarName(block, 'VAR', 'motion');
  Arduino.evlabMotionEnsureLibrary(generator);
  return [varName + '.lastWrite()', generator.ORDER_FUNCTION_CALL];
};

// 母线电流：10mΩ 采样电阻 + INA199A1(50V/V)，接协处理器 P01(ADC CH7)。
// 基准电压不写死——实测板子是 1.26V 而不是图纸标的 2.5V，所以由 begin() 在
// 电机停止时采一次基线当零点，换板换批次都自动适应。
// 需要带电流采集的协处理器固件，旧固件读回 0 会被库判为"无电流数据"。
Arduino.forBlock['evlabmotion_calibrate_zero'] = function (block, generator) {
  const varName = Arduino.evlabMotionVarName(block, 'VAR', 'motion');
  Arduino.evlabMotionEnsureLibrary(generator);
  return varName + '.calibrateZero();\n';
};

Arduino.forBlock['evlabmotion_current_amps'] = function (block, generator) {
  const varName = Arduino.evlabMotionVarName(block, 'VAR', 'motion');
  Arduino.evlabMotionEnsureLibrary(generator);
  return [varName + '.readCurrentAmps()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['evlabmotion_current_raw'] = function (block, generator) {
  const varName = Arduino.evlabMotionVarName(block, 'VAR', 'motion');
  Arduino.evlabMotionEnsureLibrary(generator);
  return [varName + '.readCurrentRaw()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['evlabmotion_error_const'] = function (block, generator) {
  const code = block.getFieldValue('CODE') || 'EVLABMOTION_OK';
  Arduino.evlabMotionEnsureLibrary(generator);
  return [code, generator.ORDER_ATOMIC];
};
