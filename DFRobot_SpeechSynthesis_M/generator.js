/**
 * DFRobot语音合成模块代码生成器
 * 支持I2C和串口两种通信方式，支持中英文混合播报
 */

// I2C初始化
Arduino.forBlock['speech_init_i2c'] = function(block, generator) {
    // 变量重命名监听
    if (!block._speechVarMonitorAttached) {
        block._speechVarMonitorAttached = true;
        block._speechVarLastName = block.getFieldValue('VAR') || 'tts';
        const varField = block.getField('VAR');
        if (varField && typeof varField.setValidator === 'function') {
            varField.setValidator(function(newName) {
                const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
                const oldName = block._speechVarLastName;
                if (workspace && newName && newName !== oldName) {
                    renameVariableInBlockly(block, oldName, newName, 'SpeechSynthesis');
                    block._speechVarLastName = newName;
                }
                return newName;
            });
        }
    }

    var varName = block.getFieldValue('VAR') || 'tts';
    var wire = block.getFieldValue('WIRE') || 'Wire';
    var version = block.getFieldValue('VERSION') || 'eV1';

    // 添加库引用
    generator.addLibrary('SpeechSynthesis', '#include <DFRobot_SpeechSynthesis_M.h>');

    // 注册变量
    registerVariableToBlockly(varName, 'SpeechSynthesis');

    // 添加对象 - 传入Wire指针
    generator.addObject(varName, 'DFRobot_SpeechSynthesis_I2C ' + varName + '(&' + wire + ');');

    // 生成初始化代码 - Wire.begin()由用户通过I2C初始化块控制
    var code = varName + '.begin(' + varName + '.' + version + ');\n';

    return code;
};

// 串口初始化
Arduino.forBlock['speech_init_uart'] = function(block, generator) {
    // 变量重命名监听
    if (!block._speechVarMonitorAttached) {
        block._speechVarMonitorAttached = true;
        block._speechVarLastName = block.getFieldValue('VAR') || 'tts';
        const varField = block.getField('VAR');
        if (varField && typeof varField.setValidator === 'function') {
            varField.setValidator(function(newName) {
                const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
                const oldName = block._speechVarLastName;
                if (workspace && newName && newName !== oldName) {
                    renameVariableInBlockly(block, oldName, newName, 'SpeechSynthesis');
                    block._speechVarLastName = newName;
                }
                return newName;
            });
        }
    }

    var varName = block.getFieldValue('VAR') || 'tts';
    var serial = block.getFieldValue('SERIAL') || 'Serial1';
    var version = block.getFieldValue('VERSION') || 'eV1';

    // 添加库引用 - 不需要单独引入Wire/Serial，库内部会处理
    generator.addLibrary('SpeechSynthesis', '#include <DFRobot_SpeechSynthesis_M.h>');

    // 注册变量
    registerVariableToBlockly(varName, 'SpeechSynthesis');

    // 添加对象
    generator.addObject(varName, 'DFRobot_SpeechSynthesis_UART ' + varName + ';');

    // 根据平台生成不同的初始化代码 - 使用实例访问枚举值
    var boardConfig = window['boardConfig'];
    if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1) {
        // ESP32平台使用HardwareSerial
        generator.addSetup(varName + '_begin', varName + '.begin(' + varName + '.' + version + ', &' + serial + ', 16, 17);');
    } else {
        // 其他平台
        generator.addSetupBegin(serial + '_begin', serial + '.begin(115200);');
        generator.addSetup(varName + '_begin', varName + '.begin(' + varName + '.' + version + ', ' + serial + ');');
    }

    return '';
};

// 播报文字
Arduino.forBlock['speech_speak'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'tts';
    var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';

    return varName + '.speak(' + text + ');\n';
};

// 设置音量
Arduino.forBlock['speech_set_volume'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'tts';
    var volume = block.getFieldValue('VOLUME');

    return varName + '.setVolume(' + volume + ');\n';
};

// 设置语速
Arduino.forBlock['speech_set_speed'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'tts';
    var speed = block.getFieldValue('SPEED');

    return varName + '.setSpeed(' + speed + ');\n';
};

// 设置语调
Arduino.forBlock['speech_set_tone'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'tts';
    var tone = block.getFieldValue('TONE');

    return varName + '.setTone(' + tone + ');\n';
};

// 设置发音人
Arduino.forBlock['speech_set_sound_type'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'tts';
    var type = block.getFieldValue('TYPE');

    return varName + '.setSoundType(' + varName + '.' + type + ');\n';
};

// 设置英文发音方式
Arduino.forBlock['speech_set_english_pron'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'tts';
    var pron = block.getFieldValue('PRON');

    return varName + '.setEnglishPron(' + varName + '.' + pron + ');\n';
};

// 设置数字语言
Arduino.forBlock['speech_set_language'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'tts';
    var lang = block.getFieldValue('LANG');

    return varName + '.setLanguage(' + varName + '.' + lang + ');\n';
};

// 设置数字读法
Arduino.forBlock['speech_set_digital_pron'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'tts';
    var pron = block.getFieldValue('PRON');

    return varName + '.setDigitalPron(' + varName + '.' + pron + ');\n';
};

// 设置合成风格
Arduino.forBlock['speech_set_style'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'tts';
    var style = block.getFieldValue('STYLE');

    return varName + '.setSpeechStyle(' + varName + '.' + style + ');\n';
};

// 启用/禁用韵律
Arduino.forBlock['speech_enable_rhythm'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'tts';
    var enable = block.getFieldValue('ENABLE');

    return varName + '.enableRhythm(' + enable + ');\n';
};

// 启用/禁用拼音合成
Arduino.forBlock['speech_enable_pinyin'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'tts';
    var enable = block.getFieldValue('ENABLE');

    return varName + '.enablePINYIN(' + enable + ');\n';
};

// 停止播报
Arduino.forBlock['speech_stop'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'tts';

    return varName + '.stopSynthesis();\n';
};

// 暂停播报
Arduino.forBlock['speech_pause'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'tts';

    return varName + '.pauseSynthesis();\n';
};

// 恢复播报
Arduino.forBlock['speech_resume'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'tts';

    return varName + '.recoverSynthesis();\n';
};

// 等待播报完成
Arduino.forBlock['speech_wait'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'tts';

    return varName + '.wait();\n';
};

// 恢复默认设置
Arduino.forBlock['speech_reset'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'tts';

    return varName + '.reset();\n';
};

// 进入休眠
Arduino.forBlock['speech_sleep'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'tts';

    return varName + '.sleep();\n';
};

// 唤醒
Arduino.forBlock['speech_wakeup'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'tts';

    return varName + '.wakeup();\n';
};
