// TLx493D 3D磁传感器库的代码生成器

// 传感器型号到C++类名的映射
var TLX493D_TYPE_MAP = {
  'A1B6': 'TLx493D_A1B6',
  'A2B6': 'TLx493D_A2B6',
  'A2BW': 'TLx493D_A2BW',
  'P2B6': 'TLx493D_P2B6',
  'W2B6': 'TLx493D_W2B6',
  'W2BW': 'TLx493D_W2BW',
  'P3B6': 'TLx493D_P3B6'
};

// 确保TLx493D相关库已添加
function ensureTLx493DLibraries(generator) {
  generator.addLibrary('wire', '#include <Wire.h>');
  generator.addLibrary('tlx493d', '#include <TLx493D_inc.hpp>');
  generator.addVariable('_tlx493d_ns', 'using namespace ifx::tlx493d;');
}

// 确保Wire已初始化
function ensureWireBegin(wire, generator) {
  var wireBeginKey = 'wire_' + wire + '_begin';
  var isAlreadyInitialized = false;

  if (generator.setupCodes_) {
    if (generator.setupCodes_[wireBeginKey]) {
      isAlreadyInitialized = true;
    }
  }

  if (!isAlreadyInitialized) {
    var pinComment = '';
    try {
      var pins = null;
      var customPins = window['customI2CPins'];
      if (customPins && customPins[wire]) {
        pins = customPins[wire];
      } else {
        var boardConfig = window['boardConfig'];
        if (boardConfig && boardConfig.i2cPins && boardConfig.i2cPins[wire]) {
          pins = boardConfig.i2cPins[wire];
        }
      }
      if (pins) {
        var sdaPin = pins.find(function(pin) { return pin[0] === 'SDA'; });
        var sclPin = pins.find(function(pin) { return pin[0] === 'SCL'; });
        if (sdaPin && sclPin) {
          pinComment = '  // ' + wire + ': SDA=' + sdaPin[1] + ', SCL=' + sclPin[1] + '\n  ';
        }
      }
    } catch (e) {}
    generator.addSetup(wireBeginKey, pinComment + wire + '.begin();\n');
  }
}

// Transport recovery is per sensor. An unsupported command does not mean the device disconnected.
function ensureTLx493DConnection(generator, name) {
  var online = '_tlx493d_online_' + name;
  generator.addVariable(online, 'bool ' + online + ' = false;');
  var ready = '_tlx493d_connected_' + name;
  generator.addFunction(ready, 'bool ' + ready + '() {\n' +
    '  static bool attempted = false;\n' +
    '  static bool initialized = false;\n' +
    '  static unsigned long lastAttempt = 0;\n' +
    '  if (' + online + ') return true;\n' +
    '  if (attempted && millis() - lastAttempt < 100) return false;\n' +
    '  attempted = true; lastAttempt = millis();\n' +
    '  if (initialized) return ' + online + ' = ' + name + '.setDefaultConfig();\n' +
    '  initialized = ' + name + '.begin();\n' +
    '  return ' + online + ' = initialized;\n' +
    '}\n');
  return { online: online, ready: ready + '()' };
}

// ============ 初始化块 ============
Arduino.forBlock['tlx493d_init'] = function(block, generator) {
  // 变量重命名监听器
  if (!block._tlx493dVarMonitorAttached) {
    block._tlx493dVarMonitorAttached = true;
    block._tlx493dVarLastName = block.getFieldValue('VAR') || 'mag';
    registerVariableToBlockly(block._tlx493dVarLastName, 'TLx493D');
    var varField = block.getField('VAR');
    if (varField) {
      var originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        var workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        var oldName = block._tlx493dVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'TLx493D');
          block._tlx493dVarLastName = newName;
        }
      };
    }
  }

  var varName = block.getFieldValue('VAR') || 'mag';
  var sensorType = block.getFieldValue('TYPE') || 'P3B6';
  var address = block.getFieldValue('ADDRESS') || 'TLx493D_IIC_ADDR_A0_e';
  var wire = block.getFieldValue('WIRE') || 'Wire';

  var cppType = TLX493D_TYPE_MAP[sensorType] || 'TLx493D_P3B6';

  // 添加库和namespace
  ensureTLx493DLibraries(generator);

  // 添加全局对象声明
  generator.addObject(varName, cppType + ' ' + varName + '(' + wire + ', ' + address + ');');

  // 确保Wire已初始化
  ensureWireBegin(wire, generator);

  // 返回setup中的初始化代码
  var code = '';
  var connection = ensureTLx493DConnection(generator, varName);
  code += 'if (!' + connection.ready + ') {\n';
  code += '  Serial.println("TLx493D sensor ' + varName + ' init failed!");\n';
  code += '}\n';

  return code;
};

// ============ 读取温度 ============
Arduino.forBlock['tlx493d_get_temperature'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'mag';

  ensureTLx493DLibraries(generator);

  // 生成辅助函数
  var connection = ensureTLx493DConnection(generator, varName);
  var funcName = '_tlx493d_getTemp_' + varName;
  var funcDef = 'double ' + funcName + '() {\n' +
    '  double temp = 0;\n' +
    '  if (!' + connection.ready + ') return NAN;\n' +
    '  if (!' + varName + '.getTemperature(&temp)) { ' + connection.online + ' = false; return NAN; }\n' +
    '  return temp;\n' +
    '}\n';
  generator.addFunction(funcName, funcDef);

  return [funcName + '()', generator.ORDER_FUNCTION_CALL];
};

// ============ 读取磁场轴 ============
Arduino.forBlock['tlx493d_get_magnetic_field'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'mag';
  var axis = block.getFieldValue('AXIS') || 'X';

  ensureTLx493DLibraries(generator);

  // 为每个轴生成辅助函数
  var connection = ensureTLx493DConnection(generator, varName);
  var funcName = '_tlx493d_getMag' + axis + '_' + varName;
  var returnVar = axis.toLowerCase();
  var funcDef = 'double ' + funcName + '() {\n' +
    '  double x = 0, y = 0, z = 0;\n' +
    '  if (!' + connection.ready + ') return NAN;\n' +
    '  if (!' + varName + '.getMagneticField(&x, &y, &z)) { ' + connection.online + ' = false; return NAN; }\n' +
    '  return ' + returnVar + ';\n' +
    '}\n';
  generator.addFunction(funcName, funcDef);

  return [funcName + '()', generator.ORDER_FUNCTION_CALL];
};

// ============ 设置灵敏度 ============
Arduino.forBlock['tlx493d_set_sensitivity'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'mag';
  var range = block.getFieldValue('RANGE') || 'TLx493D_FULL_RANGE_e';

  ensureTLx493DLibraries(generator);

  return varName + '.setSensitivity(' + range + ');\n';
};

// ============ 设置电源模式 ============
Arduino.forBlock['tlx493d_set_power_mode'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'mag';
  var mode = block.getFieldValue('MODE') || 'TLx493D_FAST_MODE_e';

  ensureTLx493DLibraries(generator);

  return varName + '.setPowerMode(' + mode + ');\n';
};

// ============ 数据有效性检查 ============
Arduino.forBlock['tlx493d_has_valid_data'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'mag';

  ensureTLx493DLibraries(generator);

  var connection = ensureTLx493DConnection(generator, varName);
  var funcName = '_tlx493d_valid_' + varName;
  generator.addFunction(funcName, 'bool ' + funcName + '() {\n' +
    '  if (!' + connection.ready + ') return false;\n' +
    '  if (!' + varName + '.readRegisters()) { ' + connection.online + ' = false; return false; }\n' +
    '  return ' + varName + '.hasValidData();\n' +
    '}\n');
  return [funcName + '()', generator.ORDER_FUNCTION_CALL];
};

// ============ 软件复位 ============
Arduino.forBlock['tlx493d_software_reset'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'mag';

  ensureTLx493DLibraries(generator);

  return varName + '.softwareReset();\n';
};
