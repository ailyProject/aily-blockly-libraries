// DFRobot_ASR_M语音识别模块库的代码生成器

// 通用库管理函数，确保不重复添加库
function ensureLibrary(generator, libraryKey, libraryCode) {
  if (!generator.libraries_) {
    generator.libraries_ = {};
  }
  if (!generator.libraries_[libraryKey]) {
    generator.addLibrary(libraryKey, libraryCode);
  }
}

// 确保Wire库和DFRobot_ASR_M库
function ensureASRLibraries(generator) {
  ensureLibrary(generator, 'wire', '#include <Wire.h>');
  ensureLibrary(generator, 'dfrobot_asr', '#include <DFRobot_ASR_M.h>');
}

// 初始化语音识别模块
Arduino.forBlock['dfrobot_asr_init'] = function(block, generator) {
  const mode = block.getFieldValue('MODE') || 'LOOP';
  const micMode = block.getFieldValue('MIC_MODE') || 'MIC';
  const address = block.getFieldValue('ADDRESS') || '0x4F';
  const wire = block.getFieldValue('WIRE') || 'Wire';

  // 固定使用asr作为变量名
  const varName = 'asr';

  // 添加必要的库
  ensureASRLibraries(generator);
  ensureSerialBegin('Serial', generator);

  // 添加DFRobot_ASR对象变量到全局变量区域
  generator.addObject(varName, 'DFRobot_ASR ' + varName + '(&' + wire + ', ' + address + ');');

  // 生成初始化代码
  let setupCode = '// 初始化DFRobot语音识别模块 ' + varName + '\n';
  
  // 初始化Wire
  if (wire && wire !== 'Wire' && wire !== '') {
    const wireBeginKey = `wire_${wire}_begin`;
    var isAlreadyInitialized = false;
    if (generator.setupCodes_) {
      if (generator.setupCodes_[wireBeginKey]) {
        isAlreadyInitialized = true;
      } else {
        for (var key in generator.setupCodes_) {
          if (key.startsWith('wire_begin_' + wire + '_') && key !== wireBeginKey) {
            isAlreadyInitialized = true;
            break;
          }
        }
      }
    }
    if (!isAlreadyInitialized) {
      var pinComment = '';
      try {
        let pins = null;
        const customPins = window['customI2CPins'];
        if (customPins && customPins[wire]) {
          pins = customPins[wire];
        } else {
          const boardConfig = window['boardConfig'];
          if (boardConfig && boardConfig.i2cPins && boardConfig.i2cPins[wire]) {
            pins = boardConfig.i2cPins[wire];
          }
        }
        if (pins) {
          const sdaPin = pins.find(pin => pin[0] === 'SDA');
          const sclPin = pins.find(pin => pin[0] === 'SCL');
          if (sdaPin && sclPin) {
            pinComment = '  // ' + wire + ': SDA=' + sdaPin[1] + ', SCL=' + sclPin[1] + '\n  ';
          }
        }
      } catch (e) {}
      generator.addSetup(wireBeginKey, pinComment + wire + '.begin();\n');
    }
  } else {
    const wireBeginKey = `wire_${wire}_begin`;
    var isAlreadyInitialized = false;
    if (generator.setupCodes_) {
      if (generator.setupCodes_[wireBeginKey]) {
        isAlreadyInitialized = true;
      } else {
        for (var key in generator.setupCodes_) {
          if (key.startsWith('wire_begin_Wire_') && key !== wireBeginKey) {
            isAlreadyInitialized = true;
            break;
          }
        }
      }
    }
    if (!isAlreadyInitialized) {
      var pinComment = '';
      try {
        let pins = null;
        const customPins = window['customI2CPins'];
        if (customPins && customPins['Wire']) {
          pins = customPins['Wire'];
        } else {
          const boardConfig = window['boardConfig'];
          if (boardConfig && boardConfig.i2cPins && boardConfig.i2cPins['Wire']) {
            pins = boardConfig.i2cPins['Wire'];
          }
        }
        if (pins) {
          const sdaPin = pins.find(pin => pin[0] === 'SDA');
          const sclPin = pins.find(pin => pin[0] === 'SCL');
          if (sdaPin && sclPin) {
            pinComment = '  // Wire: SDA=' + sdaPin[1] + ', SCL=' + sclPin[1] + '\n  ';
          }
        }
      } catch (e) {}
      generator.addSetup(wireBeginKey, pinComment + 'Wire.begin();\n');
    }
  }

  // 初始化ASR模块
  setupCode += 'if (' + varName + '.begin(' + mode + ', ' + micMode + ') == 0) {\n';
  setupCode += '  Serial.println("DFRobot语音识别模块 ' + varName + ' 初始化成功!");\n';
  setupCode += '} else {\n';
  setupCode += '  Serial.println("警告: DFRobot语音识别模块 ' + varName + ' 初始化失败，请检查接线!");\n';
  setupCode += '}\n';
  
  return setupCode;
};

// 添加语音词条
Arduino.forBlock['dfrobot_asr_add_command'] = function(block, generator) {
  const words = block.getFieldValue('WORDS') || '';
  const id = block.getFieldValue('ID') || '1';
  
  return 'asr.addCommand("' + words + '", ' + id + ');\n';
};

// 开始语音识别
Arduino.forBlock['dfrobot_asr_start'] = function(block, generator) {
  return 'asr.start();\n';
};

// 读取语音识别结果
Arduino.forBlock['dfrobot_asr_read'] = function(block, generator) {
  return ['asr.read()', Arduino.ORDER_ATOMIC];
};

// 设置I2C地址
Arduino.forBlock['dfrobot_asr_set_i2c_addr'] = function(block, generator) {
  const address = block.getFieldValue('ADDR') || '0x50';
  
  return 'asr.setI2CAddr(' + address + ');\n';
};
