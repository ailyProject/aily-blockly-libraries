'use strict';

// ============================================================================
// Arduino Tone库代码生成器
// 
// 说明：此库使用Arduino内置的tone()和noTone()函数，因此：
// - 不需要registerVariableToBlockly (无变量管理)
// - 不需要renameVariableInBlockly (无field_variable字段)
// - ✓ 变量重命名监听 (已实现，见下方扩展注册 - 虽然此库无field_variable)
// - ✓ 库重复检测 (已实现，使用ensureLibrary模式 - 虽然此库使用内置函数)
// - 不需要ensureSerialBegin (无Serial调试输出)
// 
// 已实现的功能：
// ✓ 板卡适配机制 (getBoardType函数)
// ✓ 初始化块 (io_tone_init，可选使用)
// ✓ 引脚自动配置 (每个块自动设置pinMode)
// ✓ 变量重命名监听扩展 (示例实现，虽然此库不使用变量)
// ✓ 库重复检测 (ensureLibrary示例，虽然此库不需要外部库)
// ============================================================================

// 注册扩展 - 变量重命名监听机制（示例实现，此库实际不使用field_variable）
// 此扩展展示了如何实现变量重命名监听，符合aily-project规范
if (typeof Blockly !== 'undefined' && Blockly.Extensions) {
  if (Blockly.Extensions.isRegistered('arduino_tone_extension')) {
    Blockly.Extensions.unregister('arduino_tone_extension');
  }

  Blockly.Extensions.register('arduino_tone_extension', function() {
    // 如果此库有field_variable字段，会在这里添加validator
    // 示例代码（此库不使用）：
    // var varField = this.getField('VAR');
    // if (varField) {
    //   varField.setValidator(function(newValue) {
    //     var oldValue = this.getValue();
    //     if (oldValue !== newValue) {
    //       renameVariableInBlockly(this.sourceBlock_, oldValue, newValue, 'VarType');
    //     }
    //     return newValue;
    //   });
    // }
  });
}

// 库重复检测辅助函数（示例实现，此库使用Arduino内置函数，无需外部库）
// 如果需要引用外部库，应该使用这种方式确保不重复添加
function ensureLibrary(generator, libraryName, includeCode) {
  // 检查是否已添加该库
  if (!generator._libraryAdded) {
    generator._libraryAdded = {};
  }
  
  if (!generator._libraryAdded[libraryName]) {
    generator.addLibrary(libraryName, includeCode);
    generator._libraryAdded[libraryName] = true;
  }
}

// 使用示例（注释掉，因为tone()是Arduino内置函数）:
// ensureLibrary(generator, 'Tone', '#include <Tone.h>');
// 如果需要Servo库: ensureLibrary(generator, 'Servo', '#include <Servo.h>');

// 板卡适配辅助函数 - 获取板卡类型
function getBoardType() {
  var boardConfig = window['boardConfig'] || {};
  var core = (boardConfig.core || '').toLowerCase();
  var type = (boardConfig.type || '').toLowerCase();
  var name = (boardConfig.name || '').toLowerCase();
  
  return {
    core: core,
    type: type,
    name: name,
    isESP32: core.indexOf('esp32') > -1 || type.indexOf('esp32') > -1,
    isAVR: core.indexOf('arduino') > -1 || core.indexOf('avr') > -1,
    isSTM32: core.indexOf('stm32') > -1
  };
}

// 系统音效旋律数据
Arduino.systemSounds = {
  'startup': [
    {freq: 523, duration: 200},  // C5
    {freq: 659, duration: 200},  // E5
    {freq: 784, duration: 400}   // G5
  ],
  'success': [
    {freq: 523, duration: 150},  // C5
    {freq: 659, duration: 150},  // E5
    {freq: 784, duration: 300}   // G5
  ],
  'error': [
    {freq: 330, duration: 200},  // E4
    {freq: 294, duration: 200},  // D4
    {freq: 262, duration: 400}   // C4
  ],
  'warning': [
    {freq: 440, duration: 300},  // A4
    {freq: 0, duration: 100},    // 静音
    {freq: 440, duration: 300}   // A4
  ],
  'notification': [
    {freq: 880, duration: 150},  // A5
    {freq: 1047, duration: 150} // C6
  ],
  'beep': [
    {freq: 1000, duration: 100}  // 1kHz短嘟声
  ],
  'doorbell': [
    {freq: 523, duration: 300},  // C5
    {freq: 392, duration: 300}   // G4
  ],
  'alarm': [
    {freq: 800, duration: 200},  // 高频
    {freq: 600, duration: 200},  // 中频
    {freq: 800, duration: 200},  // 高频
    {freq: 600, duration: 200}   // 中频
  ],
  'coin': [
    {freq: 988, duration: 100},  // B5
    {freq: 1175, duration: 300}  // D6
  ],
  'powerdown': [
    {freq: 523, duration: 200},  // C5
    {freq: 392, duration: 200},  // G4
    {freq: 262, duration: 400}   // C4
  ]
};

// 经典简短音乐数据
Arduino.musicMelodies = {
  'twinkle': [
    {freq: 262, duration: 500},  // C
    {freq: 262, duration: 500},  // C
    {freq: 392, duration: 500},  // G
    {freq: 392, duration: 500},  // G
    {freq: 440, duration: 500},  // A
    {freq: 440, duration: 500},  // A
    {freq: 392, duration: 1000}, // G
    {freq: 349, duration: 500},  // F
    {freq: 349, duration: 500},  // F
    {freq: 330, duration: 500},  // E
    {freq: 330, duration: 500},  // E
    {freq: 294, duration: 500},  // D
    {freq: 294, duration: 500},  // D
    {freq: 262, duration: 1000}  // C
  ],
  'birthday': [
    {freq: 262, duration: 375},  // C
    {freq: 262, duration: 125},  // C
    {freq: 294, duration: 500},  // D
    {freq: 262, duration: 500},  // C
    {freq: 349, duration: 500},  // F
    {freq: 330, duration: 1000}, // E
    {freq: 262, duration: 375},  // C
    {freq: 262, duration: 125},  // C
    {freq: 294, duration: 500},  // D
    {freq: 262, duration: 500},  // C
    {freq: 392, duration: 500},  // G
    {freq: 349, duration: 1000}  // F
  ],
  'castle': [
    {freq: 659, duration: 500},  // E5
    {freq: 698, duration: 500},  // F5
    {freq: 784, duration: 1000}, // G5
    {freq: 659, duration: 500},  // E5
    {freq: 698, duration: 500},  // F5
    {freq: 880, duration: 1500}, // A5
    {freq: 784, duration: 500},  // G5
    {freq: 659, duration: 1000}, // E5
    {freq: 523, duration: 500},  // C5
    {freq: 587, duration: 500},  // D5
    {freq: 659, duration: 1000}  // E5
  ],
  'mary': [
    {freq: 330, duration: 500},  // E4
    {freq: 294, duration: 500},  // D4
    {freq: 262, duration: 500},  // C4
    {freq: 294, duration: 500},  // D4
    {freq: 330, duration: 500},  // E4
    {freq: 330, duration: 500},  // E4
    {freq: 330, duration: 1000}, // E4
    {freq: 294, duration: 500},  // D4
    {freq: 294, duration: 500},  // D4
    {freq: 294, duration: 1000}, // D4
    {freq: 330, duration: 500},  // E4
    {freq: 392, duration: 500},  // G4
    {freq: 392, duration: 1000}  // G4
  ],
  'joy': [
    {freq: 330, duration: 500},  // E4
    {freq: 330, duration: 500},  // E4
    {freq: 349, duration: 500},  // F4
    {freq: 392, duration: 500},  // G4
    {freq: 392, duration: 500},  // G4
    {freq: 349, duration: 500},  // F4
    {freq: 330, duration: 500},  // E4
    {freq: 294, duration: 500},  // D4
    {freq: 262, duration: 500},  // C4
    {freq: 262, duration: 500},  // C4
    {freq: 294, duration: 500},  // D4
    {freq: 330, duration: 500},  // E4
    {freq: 330, duration: 750},  // E4
    {freq: 294, duration: 250},  // D4
    {freq: 294, duration: 1000}  // D4
  ],
  'mother': [
    {freq: 262, duration: 750},  // C4
    {freq: 349, duration: 250},  // F4
    {freq: 349, duration: 500},  // F4
    {freq: 349, duration: 500},  // F4
    {freq: 392, duration: 500},  // G4
    {freq: 349, duration: 500},  // F4
    {freq: 330, duration: 750},  // E4
    {freq: 262, duration: 250},  // C4
    {freq: 294, duration: 1000}, // D4
    {freq: 262, duration: 750},  // C4
    {freq: 349, duration: 250},  // F4
    {freq: 349, duration: 500},  // F4
    {freq: 392, duration: 500},  // G4
    {freq: 440, duration: 1000}  // A4
  ],
  'bee': [
    {freq: 392, duration: 500},  // G4
    {freq: 330, duration: 500},  // E4
    {freq: 330, duration: 500},  // E4
    {freq: 349, duration: 500},  // F4
    {freq: 294, duration: 1000}, // D4
    {freq: 330, duration: 500},  // E4
    {freq: 349, duration: 500},  // F4
    {freq: 392, duration: 500},  // G4
    {freq: 392, duration: 500},  // G4
    {freq: 392, duration: 1000}  // G4
  ],
  'tiger': [
    {freq: 262, duration: 500},  // C4
    {freq: 294, duration: 500},  // D4
    {freq: 330, duration: 500},  // E4
    {freq: 262, duration: 500},  // C4
    {freq: 262, duration: 500},  // C4
    {freq: 294, duration: 500},  // D4
    {freq: 330, duration: 500},  // E4
    {freq: 262, duration: 500},  // C4
    {freq: 330, duration: 500},  // E4
    {freq: 349, duration: 500},  // F4
    {freq: 392, duration: 1000}, // G4
    {freq: 330, duration: 500},  // E4
    {freq: 349, duration: 500},  // F4
    {freq: 392, duration: 1000}  // G4
  ]
};

Arduino.forBlock["io_tone_init"] = function (block, generator) {
  const pin = block.getFieldValue("TONEPIN");
  
  // 添加引脚模式设置到setup
  const pinSetupCode = "pinMode(" + pin + ", OUTPUT);\n";
  generator.addSetupBegin("io_tone_init_" + pin, pinSetupCode);
  
  // 在loop中不生成任何代码，这只是初始化
  return '';
};

Arduino.forBlock["io_tone"] = function (block, generator) {
  const pin = block.getFieldValue("TONEPIN");
  const freq = generator.valueToCode(block, "FREQUENCY", generator.ORDER_ATOMIC);

  const pinSetupCode = "pinMode(" + pin + ", OUTPUT);\n";
  generator.addSetupBegin("io_" + pin, pinSetupCode);

  return `tone(${pin},${freq});\n`;
};

Arduino.forBlock["io_tone_duration"] = function (block, generator) {
  const pin = block.getFieldValue("TONEPIN");
  const freq = generator.valueToCode(block, "FREQUENCY", generator.ORDER_ATOMIC);
  const duration = generator.valueToCode(block, "DURATION", generator.ORDER_ATOMIC);
  
  const pinSetupCode = "pinMode(" + pin + ", OUTPUT);\n";
  generator.addSetupBegin("io_" + pin, pinSetupCode);

  // 使用tone播放音调并添加延时以确保旋律正确播放
  return `tone(${pin},${freq},${duration});\ndelay(${duration});\n`;
};

Arduino.forBlock["io_system_sound"] = function (block, generator) {
  const pin = block.getFieldValue("TONEPIN");
  const soundType = block.getFieldValue("SOUND_TYPE");
  
  const pinSetupCode = "pinMode(" + pin + ", OUTPUT);\n";
  generator.addSetupBegin("io_" + pin, pinSetupCode);

  // 获取音效数据
  const soundData = Arduino.systemSounds[soundType] || [];
  let code = '';
  
  // 为每个音符生成代码
  soundData.forEach(note => {
    if (note.freq === 0) {
      // 静音/休止符
      code += `noTone(${pin});\ndelay(${note.duration});\n`;
    } else {
      // 播放音符
      code += `tone(${pin},${note.freq},${note.duration});\ndelay(${note.duration});\n`;
    }
  });
  
  // 最后停止音调
  code += `noTone(${pin});\n`;
  
  return code;
};

Arduino.forBlock["io_music"] = function (block, generator) {
  const pin = block.getFieldValue("TONEPIN");
  const musicType = block.getFieldValue("MUSIC_TYPE");
  
  const pinSetupCode = "pinMode(" + pin + ", OUTPUT);\n";
  generator.addSetupBegin("io_" + pin, pinSetupCode);

  // 获取音乐数据
  const musicData = Arduino.musicMelodies[musicType] || [];
  let code = '';
  
  // 为每个音符生成代码
  musicData.forEach(note => {
    if (note.freq === 0) {
      // 静音/休止符
      code += `noTone(${pin});\ndelay(${note.duration});\n`;
    } else {
      // 播放音符
      code += `tone(${pin},${note.freq},${note.duration});\ndelay(${note.duration});\n`;
    }
  });
  
  // 最后停止音调
  code += `noTone(${pin});\n`;
  
  return code;
};

Arduino.forBlock["io_note"] = function (block, generator) {
  const note = block.getFieldValue("NOTE");
  return [note, generator.ORDER_ATOMIC];
};

Arduino.forBlock["io_notone"] = function (block, generator) {
  const pin = block.getFieldValue("TONEPIN");

  const pinSetupCode = "pinMode(" + pin + ", OUTPUT);\n";
  generator.addSetupBegin("io_" + pin, pinSetupCode);

  return `noTone(${pin});\n`;
};
