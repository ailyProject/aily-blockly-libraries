// Generator.js for dfrobot_maqueen_motor

// 取出 field_variable 上显示的变量名，与 core-variables 的处理方式保持一致
Arduino.maqueenVarName = function (block, fieldName, fallback) {
  const field = block.getField(fieldName);
  return (field && field.getText()) || fallback;
};

// 字面量直接算出范围内的值，表达式交给 constrain()
Arduino.maqueenClamp = function (value, low, high) {
  const literal = Number(value);
  if (value !== '' && Number.isFinite(literal)) return String(Math.min(Math.max(Math.round(literal), low), high));
  return 'constrain(' + value + ', ' + low + ', ' + high + ')';
};

// 没开 USB CDC On Boot 时 Serial 就是 UART0，这是它的默认引脚
Arduino.maqueenUart0Pins = function (boardType) {
  if (/esp32s[23]/.test(boardType)) return ['43', '44'];
  if (/:esp32$/.test(boardType)) return ['1', '3'];
  return [];
};

// ESP32 板（掌控板等）在 aily 里用通用 esp32 / esp32s3 变体编译，
// 不带引脚的 Wire.begin() 会落在变体默认引脚上（esp32s3 是 8/9），
// 掌控板 2.0 的 I2C 在 23/22、3.0 在 44/43，所以按板卡配置显式指定 SDA/SCL。
// 放在 setup 最前面，早于其他库不带引脚的 Wire.begin()。
// 返回 I2C 是否占用了 UART0 的默认引脚（掌控板 3.0 就是这样）。
Arduino.maqueenEnsureWire = function (generator) {
  let sda = null;
  let scl = null;
  let boardType = '';
  let isEsp32 = false;
  try {
    const boardConfig = window['boardConfig'];
    if (boardConfig) {
      isEsp32 = String(boardConfig.core || '').indexOf('esp32') > -1;
      boardType = String(boardConfig.type || '');
      const pins = boardConfig.i2cPins && boardConfig.i2cPins['Wire'];
      if (pins) {
        const sdaPin = pins.find(p => p[0] === 'SDA');
        const sclPin = pins.find(p => p[0] === 'SCL');
        if (sdaPin && sclPin) {
          sda = String(sdaPin[1]);
          scl = String(sclPin[1]);
        }
      }
    }
  } catch (e) {}

  const explicitPins = isEsp32 && sda !== null && scl !== null;
  const uart0 = explicitPins ? Arduino.maqueenUart0Pins(boardType) : [];
  const sharesUart0 = uart0.indexOf(sda) > -1 || uart0.indexOf(scl) > -1;

  let code = '';
  if (sda !== null && scl !== null) code += '// Wire: SDA=' + sda + ', SCL=' + scl + '\n';
  if (sharesUart0) {
    code += '// 注意：这两个脚也是串口 UART0 的默认引脚。板卡菜单没开 USB CDC On Boot 时，\n';
    code += '// Serial.begin() 会占用它们并关掉 I2C，电机就收不到命令\n';
  }
  code += explicitPins ? 'Wire.begin(' + sda + ', ' + scl + ');\n' : 'Wire.begin();\n';
  generator.addSetupBegin('wire_Wire_begin', code);
  return sharesUart0;
};

Arduino.maqueenEnsureLibrary = function (generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('Maqueen_Motor', '#include <Maqueen_Motor.h>');
};

Arduino.forBlock['maqueen_motor_init'] = function (block, generator) {
  // 变量改名监听
  if (!block._maqueenVarMonitorAttached) {
    block._maqueenVarMonitorAttached = true;
    block._maqueenVarLastName = block.getFieldValue('VAR') || 'maqueen';
    registerVariableToBlockly(block._maqueenVarLastName, 'Maqueen_Motor');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function (newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._maqueenVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'Maqueen_Motor');
          block._maqueenVarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'maqueen';
  Arduino.maqueenEnsureLibrary(generator);
  const sharesUart0 = Arduino.maqueenEnsureWire(generator);
  generator.addObject(varName, 'Maqueen_Motor ' + varName + ';');

  // I2C 与 UART0 共用引脚时不能碰 Serial，只做检测；要看连接状态用「已连接」积木
  if (sharesUart0) return varName + '.begin();\n';

  ensureSerialBegin('Serial', generator);
  let code = '';
  code += 'if (!' + varName + '.begin()) {\n';
  code += '  Serial.println("未检测到电机驱动（I2C 地址 0x10），请检查连接并打开电源");\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['maqueen_motor_run'] = function (block, generator) {
  const varName = Arduino.maqueenVarName(block, 'VAR', 'maqueen');
  const index = block.getFieldValue('INDEX') || 'MAQUEEN_MOTOR_ALL';
  const dir = block.getFieldValue('DIR') || 'MAQUEEN_MOTOR_CW';
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '0';
  Arduino.maqueenEnsureLibrary(generator);
  return varName + '.motorRun(' + index + ', ' + dir + ', ' + Arduino.maqueenClamp(speed, 0, 255) + ');\n';
};

Arduino.forBlock['maqueen_motor_stop'] = function (block, generator) {
  const varName = Arduino.maqueenVarName(block, 'VAR', 'maqueen');
  const index = block.getFieldValue('INDEX') || 'MAQUEEN_MOTOR_ALL';
  Arduino.maqueenEnsureLibrary(generator);
  return varName + '.motorStop(' + index + ');\n';
};

Arduino.forBlock['maqueen_motor_move'] = function (block, generator) {
  const varName = Arduino.maqueenVarName(block, 'VAR', 'maqueen');
  const action = block.getFieldValue('ACTION') || 'FORWARD';
  const speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '0';
  const s = Arduino.maqueenClamp(speed, 0, 255);
  Arduino.maqueenEnsureLibrary(generator);
  // 原地转向：一侧正转、另一侧反转
  const plan = {
    FORWARD: [['MAQUEEN_MOTOR_ALL', 'MAQUEEN_MOTOR_CW']],
    BACKWARD: [['MAQUEEN_MOTOR_ALL', 'MAQUEEN_MOTOR_CCW']],
    LEFT: [['MAQUEEN_MOTOR_LEFT', 'MAQUEEN_MOTOR_CCW'], ['MAQUEEN_MOTOR_RIGHT', 'MAQUEEN_MOTOR_CW']],
    RIGHT: [['MAQUEEN_MOTOR_LEFT', 'MAQUEEN_MOTOR_CW'], ['MAQUEEN_MOTOR_RIGHT', 'MAQUEEN_MOTOR_CCW']],
  }[action] || [['MAQUEEN_MOTOR_ALL', 'MAQUEEN_MOTOR_CW']];
  return plan.map(p => varName + '.motorRun(' + p[0] + ', ' + p[1] + ', ' + s + ');\n').join('');
};

Arduino.forBlock['maqueen_motor_is_connected'] = function (block, generator) {
  const varName = Arduino.maqueenVarName(block, 'VAR', 'maqueen');
  Arduino.maqueenEnsureLibrary(generator);
  return [varName + '.isConnected()', generator.ORDER_FUNCTION_CALL];
};
