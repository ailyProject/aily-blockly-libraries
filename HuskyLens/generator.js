/**
 * HuskyLens AI摄像头库代码生成器
 * DFRobot HuskyLens - 支持人脸识别、物体追踪、巡线等多种AI功能
 */

// I2C初始化（直到成功）
Arduino.forBlock['huskylens_init_i2c_until'] = function (block, generator) {
    // 变量重命名监听
    if (!block._huskyVarMonitorAttached) {
        block._huskyVarMonitorAttached = true;
        block._huskyVarLastName = block.getFieldValue('VAR') || 'huskylens';
        const varField = block.getField('VAR');
        if (varField && typeof varField.setValidator === 'function') {
            varField.setValidator(function (newName) {
                const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
                const oldName = block._huskyVarLastName;
                if (workspace && newName && newName !== oldName) {
                    renameVariableInBlockly(block, oldName, newName, 'HUSKYLENS');
                    block._huskyVarLastName = newName;
                }
                return newName;
            });
        }
    }

    var varName = block.getFieldValue('VAR') || 'huskylens';
    var wire = block.getFieldValue('WIRE') || 'Wire';

    generator.addLibrary('Wire', '#include <Wire.h>');
    generator.addLibrary('HUSKYLENS', '#include "HUSKYLENS.h"');
    registerVariableToBlockly(varName, 'HUSKYLENS');
    generator.addObject(varName, 'HUSKYLENS ' + varName + ';');
    generator.addSetup(varName + '_begin', 'while (!' + varName + '.begin(' + wire + ')) {\n    Serial.println(F("HuskyLens begin failed!"));\n    delay(100);\n  }');
    return '';
};

// I2C初始化
Arduino.forBlock['huskylens_init_i2c'] = function (block, generator) {
    // 变量重命名监听
    if (!block._huskyVarMonitorAttached) {
        block._huskyVarMonitorAttached = true;
        block._huskyVarLastName = block.getFieldValue('VAR') || 'huskylens';
        const varField = block.getField('VAR');
        if (varField && typeof varField.setValidator === 'function') {
            varField.setValidator(function (newName) {
                const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
                const oldName = block._huskyVarLastName;
                if (workspace && newName && newName !== oldName) {
                    renameVariableInBlockly(block, oldName, newName, 'HUSKYLENS');
                    block._huskyVarLastName = newName;
                }
                return newName;
            });
        }
    }

    var varName = block.getFieldValue('VAR') || 'huskylens';
    var wire = block.getFieldValue('WIRE') || 'Wire';

    // 添加库引用
    generator.addLibrary('Wire', '#include <Wire.h>');
    generator.addLibrary('HUSKYLENS', '#include "HUSKYLENS.h"');

    // 注册变量
    registerVariableToBlockly(varName, 'HUSKYLENS');

    // 添加对象
    generator.addObject(varName, 'HUSKYLENS ' + varName + ';');

    // 初始化
    generator.addSetup(varName + '_begin', varName + '.begin(' + wire + ');');

    return '';
};

// 串口初始化
Arduino.forBlock['huskylens_init_serial'] = function (block, generator) {
    // 变量重命名监听
    if (!block._huskyVarMonitorAttached) {
        block._huskyVarMonitorAttached = true;
        block._huskyVarLastName = block.getFieldValue('VAR') || 'huskylens';
        const varField = block.getField('VAR');
        if (varField && typeof varField.setValidator === 'function') {
            varField.setValidator(function (newName) {
                const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
                const oldName = block._huskyVarLastName;
                if (workspace && newName && newName !== oldName) {
                    renameVariableInBlockly(block, oldName, newName, 'HUSKYLENS');
                    block._huskyVarLastName = newName;
                }
                return newName;
            });
        }
    }

    var varName = block.getFieldValue('VAR') || 'huskylens';
    var serial = block.getFieldValue('SERIAL') || 'Serial1';

    // 添加库引用
    generator.addLibrary('HUSKYLENS', '#include "HUSKYLENS.h"');

    // 注册变量
    registerVariableToBlockly(varName, 'HUSKYLENS');

    // 添加对象
    generator.addObject(varName, 'HUSKYLENS ' + varName + ';');

    // 初始化串口和HuskyLens
    generator.addSetup(serial + '_begin', serial + '.begin(9600);');
    generator.addSetupEnd(varName + '_begin', 'while (!' + varName + '.begin(' + serial + ')) {\n    Serial.println(F("HuskyLens begin failed!"));\n    delay(100);\n  }');

    return '';
};

// 切换算法
Arduino.forBlock['huskylens_set_algorithm'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var algorithm = block.getFieldValue('ALGORITHM');

    return varName + '.writeAlgorithm(' + algorithm + ');\n';
};

// 切换算法直到成功
Arduino.forBlock['huskylens_set_algorithm_until'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var algorithm = block.getFieldValue('ALGORITHM');

    return 'while (!' + varName + '.writeAlgorithm(' + algorithm + ')) {\n  delay(100);\n}\n';
};

// 请求数据
Arduino.forBlock['huskylens_request'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    return varName + '.request();\n';
};

// 请求方框数据
Arduino.forBlock['huskylens_request_blocks'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    return varName + '.requestBlocks();\n';
};

// 请求箭头数据
Arduino.forBlock['huskylens_request_arrows'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    return varName + '.requestArrows();\n';
};

// 获取数据数量
Arduino.forBlock['huskylens_available'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    return [varName + '.available()', generator.ORDER_ATOMIC];
};

// 是否已学习
Arduino.forBlock['huskylens_is_learned'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    return [varName + '.isLearned()', generator.ORDER_ATOMIC];
};

// 已学习ID数量
Arduino.forBlock['huskylens_count_learned_ids'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    return [varName + '.countLearnedIDs()', generator.ORDER_ATOMIC];
};

// 指定ID是否已学习
Arduino.forBlock['huskylens_is_id_learned'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '1';

    return [varName + '.isLearned(' + id + ')', generator.ORDER_ATOMIC];
};

// 方框/箭头是否在画面中
Arduino.forBlock['huskylens_is_appear'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var type = block.getFieldValue('TYPE');

    return ['(' + varName + '.count' + type + '() > 0)', generator.ORDER_ATOMIC];
};

// 指定ID的方框/箭头是否在画面中
Arduino.forBlock['huskylens_is_id_appear'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '1';
    var type = block.getFieldValue('TYPE');

    return ['(' + varName + '.count' + type + '(' + id + ') > 0)', generator.ORDER_ATOMIC];
};

// 方框/箭头总数
Arduino.forBlock['huskylens_count_type'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var type = block.getFieldValue('TYPE');

    return [varName + '.count' + type + '()', generator.ORDER_ATOMIC];
};

// 指定ID的方框/箭头数量
Arduino.forBlock['huskylens_count_id_type'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '1';
    var type = block.getFieldValue('TYPE');

    return [varName + '.count' + type + '(' + id + ')', generator.ORDER_ATOMIC];
};

// 获取靠近中心的方框/箭头参数
Arduino.forBlock['huskylens_get_near_center'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var type = block.getFieldValue('TYPE');
    var param = block.getFieldValue('PARAM');
    var typeLower = type.toLowerCase() + 's';

    // 生成辅助函数
    var funcName = '_huskylens_getNearCenter' + type;
    var funcCode = 'HUSKYLENSResult ' + funcName + '(HUSKYLENS& hl) {\n';
    funcCode += '  HUSKYLENSResult result;\n';
    funcCode += '  int minDist = 99999;\n';
    funcCode += '  int centerX = 160, centerY = 120;\n';
    funcCode += '  for (int i = 0; i < hl.' + typeLower + '.available(); i++) {\n';
    funcCode += '    HUSKYLENSResult r = hl.' + typeLower + '.readDirect(i);\n';
    funcCode += '    int dist = abs(r.xCenter - centerX) + abs(r.yCenter - centerY);\n';
    funcCode += '    if (dist < minDist) {\n';
    funcCode += '      minDist = dist;\n';
    funcCode += '      result = r;\n';
    funcCode += '    }\n';
    funcCode += '  }\n';
    funcCode += '  return result;\n';
    funcCode += '}\n';
    generator.addFunction(funcName, funcCode);

    return [funcName + '(' + varName + ').' + param, generator.ORDER_MEMBER];
};

// 获取指定ID的方框/箭头参数（第一个）
Arduino.forBlock['huskylens_get_id_param'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '1';
    var type = block.getFieldValue('TYPE');
    var param = block.getFieldValue('PARAM');
    var typeLower = type.toLowerCase() + 's';

    return [varName + '.' + typeLower + '.read(' + id + ', 0).' + param, generator.ORDER_MEMBER];
};

// 获取第N个方框/箭头的参数
Arduino.forBlock['huskylens_get_index_param'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
    var type = block.getFieldValue('TYPE');
    var param = block.getFieldValue('PARAM');
    var typeLower = type.toLowerCase() + 's';

    return [varName + '.' + typeLower + '.readDirect(' + index + ').' + param, generator.ORDER_MEMBER];
};

// 获取指定ID的第N个方框/箭头的参数
Arduino.forBlock['huskylens_get_id_index_param'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '1';
    var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
    var type = block.getFieldValue('TYPE');
    var param = block.getFieldValue('PARAM');
    var typeLower = type.toLowerCase() + 's';

    return [varName + '.' + typeLower + '.read(' + id + ', ' + index + ').' + param, generator.ORDER_MEMBER];
};

// 设置自定义名称
Arduino.forBlock['huskylens_set_custom_name'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '1';
    var name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"Name"';

    return varName + '.writeName(' + name + ', ' + id + ');\n';
};

// 请求指定ID的数据
Arduino.forBlock['huskylens_request_by_id'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '1';

    return varName + '.request(' + id + ');\n';
};

// 读取方框参数
Arduino.forBlock['huskylens_read_block_param'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
    var param = block.getFieldValue('PARAM');

    return [varName + '.blocks.readDirect(' + index + ').' + param, generator.ORDER_MEMBER];
};

// 读取箭头参数
Arduino.forBlock['huskylens_read_arrow_param'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
    var param = block.getFieldValue('PARAM');

    return [varName + '.arrows.readDirect(' + index + ').' + param, generator.ORDER_MEMBER];
};

// 显示OSD文字
Arduino.forBlock['huskylens_write_osd'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
    var y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
    var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';

    return varName + '.writeOSD(' + text + ', ' + x + ', ' + y + ');\n';
};

// 清除OSD文字
Arduino.forBlock['huskylens_clear_osd'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    return varName + '.clearOSD();\n';
};

// 学习一次
Arduino.forBlock['huskylens_learn_once'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '1';

    return varName + '.learnOnece(' + id + ');\n';
};

// 遗忘学习
Arduino.forBlock['huskylens_forget_learn'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    return varName + '.forgetLearn();\n';
};

// 保存模型
Arduino.forBlock['huskylens_save_model'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';

    return varName + '.saveModelToTFCard(' + index + ');\n';
};

// 加载模型
Arduino.forBlock['huskylens_load_model'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    var index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';

    return varName + '.loadModelFromTFCard(' + index + ');\n';
};

// 拍照
Arduino.forBlock['huskylens_take_photo'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    return varName + '.takePhotoToSDCard();\n';
};

// 截屏
Arduino.forBlock['huskylens_screenshot'] = function (block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    return varName + '.screenshotToSDCard();\n';
};
