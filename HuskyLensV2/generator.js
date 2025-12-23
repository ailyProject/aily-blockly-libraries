// HuskyLensV2 Arduino代码生成器

// 初始化类生成器
Arduino.forBlock['huskylensv2_init_i2c_until'] = function(block, generator) {
    const varName = block.getFieldValue('VAR');
    const wire = block.getFieldValue('WIRE');

    generator.addLibrary('huskylensv2', '#include <DFRobot_HuskylensV2.h>');
    generator.addObject(varName, 'HuskylensV2 ' + varName + ';');
    registerVariableToBlockly(varName, 'HuskylensV2');

    generator.addSetup(`wire_${wire}_begin`, wire + '.begin();');
    generator.addSetup(varName + '_begin', 'while (!' + varName + '.begin(' + wire + ')) {\n    delay(100);\n  }');

    return '';
};

Arduino.forBlock['huskylensv2_init_i2c'] = function(block, generator) {
    const varName = block.getFieldValue('VAR');
    const wire = block.getFieldValue('WIRE');

    generator.addLibrary('huskylensv2', '#include <DFRobot_HuskylensV2.h>');
    generator.addObject(varName, 'HuskylensV2 ' + varName + ';');
    registerVariableToBlockly(varName, 'HuskylensV2');

    generator.addSetup(`wire_${wire}_begin`, wire + '.begin();');
    generator.addSetup(varName + '_begin', varName + '.begin(' + wire + ');');

    return '';
};

Arduino.forBlock['huskylensv2_init_serial'] = function(block, generator) {
    const varName = block.getFieldValue('VAR');
    const serial = block.getFieldValue('SERIAL');

    generator.addLibrary('huskylensv2', '#include <DFRobot_HuskylensV2.h>');
    generator.addObject(varName, 'HuskylensV2 ' + varName + ';');
    registerVariableToBlockly(varName, 'HuskylensV2');

    generator.addSetup(serial + '_begin', serial + '.begin(9600);');
    generator.addSetup(varName + '_begin', 'while (!' + varName + '.begin(&' + serial + ')) {\n    delay(100);\n  }');

    return '';
};

// 算法切换类生成器
Arduino.forBlock['huskylensv2_set_algorithm'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const algorithm = block.getFieldValue('ALGORITHM');

    return varName + '.switchAlgorithm(' + algorithm + ');\n';
};

Arduino.forBlock['huskylensv2_set_algorithm_until'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const algorithm = block.getFieldValue('ALGORITHM');

    return 'while (!' + varName + '.switchAlgorithm(' + algorithm + ')) {\n  delay(100);\n}\n';
};

// 数据获取类生成器
Arduino.forBlock['huskylensv2_get_result'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    return varName + '.getResult();\n';
};

// 状态查询类生成器
Arduino.forBlock['huskylensv2_available'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    const code = varName + '.available()';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_count_learned'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    const code = varName + '.countLearned()';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_count_id'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC);

    const code = varName + '.countID(' + id + ')';
    return [code, generator.ORDER_ATOMIC];
};

// 结果获取类生成器
Arduino.forBlock['huskylensv2_get_center'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    const code = varName + '.getCenter()';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_get_by_index'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC);

    const code = varName + '.getByIndex(' + index + ')';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_get_by_id'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC);

    const code = varName + '.getByID(' + id + ')';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_get_by_id_index'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC);
    const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC);

    const code = varName + '.getByID(' + id + ', ' + index + ')';
    return [code, generator.ORDER_ATOMIC];
};

// 学习功能类生成器
Arduino.forBlock['huskylensv2_learn'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    return varName + '.learn();\n';
};

Arduino.forBlock['huskylensv2_learn_block'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC);
    const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC);
    const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC);
    const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC);

    return varName + '.learn(' + x + ', ' + y + ', ' + width + ', ' + height + ');\n';
};

Arduino.forBlock['huskylensv2_forget'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    return varName + '.forget();\n';
};

// 拍照截图类生成器
Arduino.forBlock['huskylensv2_take_photo'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const resolution = block.getFieldValue('RESOLUTION');

    const code = varName + '.takePhoto(' + resolution + ')';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_take_screenshot'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    const code = varName + '.takeScreenshot()';
    return [code, generator.ORDER_ATOMIC];
};

// 绘图功能类生成器
Arduino.forBlock['huskylensv2_draw_rect'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const color = block.getFieldValue('COLOR');
    const lineWidth = generator.valueToCode(block, 'LINEWIDTH', generator.ORDER_ATOMIC);
    const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC);
    const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC);
    const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC);
    const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC);

    return varName + '.drawRect(' + color + ', ' + lineWidth + ', ' + x + ', ' + y + ', ' + width + ', ' + height + ');\n';
};

Arduino.forBlock['huskylensv2_draw_unique_rect'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const color = block.getFieldValue('COLOR');
    const lineWidth = generator.valueToCode(block, 'LINEWIDTH', generator.ORDER_ATOMIC);
    const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC);
    const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC);
    const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC);
    const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC);

    return varName + '.drawUniqueRect(' + color + ', ' + lineWidth + ', ' + x + ', ' + y + ', ' + width + ', ' + height + ');\n';
};

Arduino.forBlock['huskylensv2_clear_rect'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    return varName + '.clearRect();\n';
};

Arduino.forBlock['huskylensv2_draw_text'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const color = block.getFieldValue('COLOR');
    const fontSize = generator.valueToCode(block, 'FONTSIZE', generator.ORDER_ATOMIC);
    const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC);
    const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC);
    const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC);

    return varName + '.drawText(' + color + ', ' + fontSize + ', ' + x + ', ' + y + ', ' + text + ');\n';
};

Arduino.forBlock['huskylensv2_clear_text'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';

    return varName + '.clearText();\n';
};

// 知识库管理类生成器
Arduino.forBlock['huskylensv2_save_knowledge'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC);

    return varName + '.saveKnowledge(' + id + ');\n';
};

Arduino.forBlock['huskylensv2_load_knowledge'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC);

    return varName + '.loadKnowledge(' + id + ');\n';
};

// 音乐播放类生成器
Arduino.forBlock['huskylensv2_play_music'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC);
    const volume = generator.valueToCode(block, 'VOLUME', generator.ORDER_ATOMIC);

    return varName + '.playMusic(' + name + ', ' + volume + ');\n';
};

// 设置名称类生成器
Arduino.forBlock['huskylensv2_set_name'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC);
    const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC);

    return varName + '.setName(' + id + ', ' + name + ');\n';
};

// 结果属性类生成器
Arduino.forBlock['huskylensv2_result_id'] = function(block, generator) {
    const result = generator.valueToCode(block, 'RESULT', generator.ORDER_ATOMIC);

    const code = result + '.ID';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_result_x'] = function(block, generator) {
    const result = generator.valueToCode(block, 'RESULT', generator.ORDER_ATOMIC);

    const code = result + '.xCenter';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_result_y'] = function(block, generator) {
    const result = generator.valueToCode(block, 'RESULT', generator.ORDER_ATOMIC);

    const code = result + '.yCenter';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_result_width'] = function(block, generator) {
    const result = generator.valueToCode(block, 'RESULT', generator.ORDER_ATOMIC);

    const code = result + '.width';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_result_height'] = function(block, generator) {
    const result = generator.valueToCode(block, 'RESULT', generator.ORDER_ATOMIC);

    const code = result + '.height';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_result_name'] = function(block, generator) {
    const result = generator.valueToCode(block, 'RESULT', generator.ORDER_ATOMIC);

    const code = result + '.name';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_result_content'] = function(block, generator) {
    const result = generator.valueToCode(block, 'RESULT', generator.ORDER_ATOMIC);

    const code = result + '.content';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_result_confidence'] = function(block, generator) {
    const result = generator.valueToCode(block, 'RESULT', generator.ORDER_ATOMIC);

    const code = result + '.confidence';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_result_type'] = function(block, generator) {
    const result = generator.valueToCode(block, 'RESULT', generator.ORDER_ATOMIC);

    const code = result + '.type';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_is_valid'] = function(block, generator) {
    const result = generator.valueToCode(block, 'RESULT', generator.ORDER_ATOMIC);

    const code = result + '.isValid()';
    return [code, generator.ORDER_ATOMIC];
};

// 多算法功能类生成器
Arduino.forBlock['huskylensv2_set_multi_algorithm'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const algorithm1 = block.getFieldValue('ALGORITHM1');
    const algorithm2 = block.getFieldValue('ALGORITHM2');
    const algorithm3 = block.getFieldValue('ALGORITHM3');

    return varName + '.setMultiAlgorithm(' + algorithm1 + ', ' + algorithm2 + ', ' + algorithm3 + ');\n';
};

Arduino.forBlock['huskylensv2_set_multi_algorithm_ratio'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const ratio1 = generator.valueToCode(block, 'RATIO1', generator.ORDER_ATOMIC);
    const ratio2 = generator.valueToCode(block, 'RATIO2', generator.ORDER_ATOMIC);
    const ratio3 = generator.valueToCode(block, 'RATIO3', generator.ORDER_ATOMIC);

    return varName + '.setMultiAlgorithmRatio(' + ratio1 + ', ' + ratio2 + ', ' + ratio3 + ');\n';
};

// 媒体录制类生成器
Arduino.forBlock['huskylensv2_start_recording'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const type = block.getFieldValue('TYPE');
    const duration = generator.valueToCode(block, 'DURATION', generator.ORDER_ATOMIC);
    const filename = generator.valueToCode(block, 'FILENAME', generator.ORDER_ATOMIC);
    const resolution = block.getFieldValue('RESOLUTION');

    return varName + '.startRecording(' + type + ', ' + duration + ', ' + filename + ', ' + resolution + ');\n';
};

Arduino.forBlock['huskylensv2_stop_recording'] = function(block, generator) {
    const varField = block.getField('VAR');
    const varName = varField ? varField.getText() : 'huskylens';
    const type = block.getFieldValue('TYPE');

    return varName + '.stopRecording(' + type + ');\n';
};

// 结果角度和类别ID类生成器
Arduino.forBlock['huskylensv2_result_pitch'] = function(block, generator) {
    const result = generator.valueToCode(block, 'RESULT', generator.ORDER_ATOMIC);

    const code = result + '.pitch';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_result_yaw'] = function(block, generator) {
    const result = generator.valueToCode(block, 'RESULT', generator.ORDER_ATOMIC);

    const code = result + '.yaw';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_result_roll'] = function(block, generator) {
    const result = generator.valueToCode(block, 'RESULT', generator.ORDER_ATOMIC);

    const code = result + '.roll';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_result_azimuth'] = function(block, generator) {
    const result = generator.valueToCode(block, 'RESULT', generator.ORDER_ATOMIC);

    const code = result + '.azimuth';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['huskylensv2_result_classid'] = function(block, generator) {
    const result = generator.valueToCode(block, 'RESULT', generator.ORDER_ATOMIC);

    const code = result + '.classID';
    return [code, generator.ORDER_ATOMIC];
};
