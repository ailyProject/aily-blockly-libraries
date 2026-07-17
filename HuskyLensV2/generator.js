/**
 * HuskyLensV2 代码生成器
 * 对齐官方 DFRobot_HuskylensV2 v1.0.9 API
 */

const HLV2_TYPE = 'HUSKYLENSV2';

function hlv2AttachVarMonitor(block, defaultName) {
  if (block._hlv2VarMonitorAttached) return;
  block._hlv2VarMonitorAttached = true;
  block._hlv2VarLastName = block.getFieldValue('VAR') || defaultName;
  registerVariableToBlockly(block._hlv2VarLastName, HLV2_TYPE);
  const varField = block.getField('VAR');
  if (!varField) return;
  const originalFinishEditing = varField.onFinishEditing_;
  varField.onFinishEditing_ = function (newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }
    const workspace =
      block.workspace ||
      (typeof Blockly !== 'undefined' &&
        Blockly.getMainWorkspace &&
        Blockly.getMainWorkspace());
    const oldName = block._hlv2VarLastName;
    if (workspace && newName && newName !== oldName) {
      renameVariableInBlockly(block, oldName, newName, HLV2_TYPE);
      block._hlv2VarLastName = newName;
    }
  };
}

function hlv2VarNameFromInput(block) {
  return block.getFieldValue('VAR') || 'huskylens';
}

function hlv2VarNameFromField(block) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : 'huskylens';
}

function hlv2EnsureCore(generator, varName) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary(
    'DFRobot_HuskylensV2',
    '#include <DFRobot_HuskylensV2.h>'
  );
  registerVariableToBlockly(varName, HLV2_TYPE);
  generator.addObject(varName, 'HuskylensV2 ' + varName + ';');
}

function hlv2Algo(block) {
  return block.getFieldValue('ALGORITHM') || 'ALGORITHM_ANY';
}

function hlv2ResultExpr(block, generator) {
  return (
    generator.valueToCode(block, 'RESULT', generator.ORDER_ATOMIC) || 'NULL'
  );
}

function hlv2ResultItem(block, generator, field) {
  const result = hlv2ResultExpr(block, generator);
  // 官方 Result* 指针访问；空指针时返回 -1 / 空串由宏处理
  const code = 'RET_ITEM_NUM(' + result + ', Result, ' + field + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
}

function hlv2ResultStr(block, generator, field) {
  const result = hlv2ResultExpr(block, generator);
  const code = 'RET_ITEM_STR(' + result + ', Result, ' + field + ')';
  return [code, generator.ORDER_FUNCTION_CALL];
}

function hlv2SerialBaud(serial) {
  // 官方: AVR 9600，ESP32/其他 115200
  const boardConfig =
    typeof window !== 'undefined' ? window['boardConfig'] : null;
  const core =
    boardConfig && boardConfig.core ? String(boardConfig.core).toLowerCase() : '';
  if (core.indexOf('avr') > -1 || core.indexOf('megaavr') > -1) {
    return '9600';
  }
  return '115200';
}

// ========== 初始化 ==========
Arduino.forBlock['huskylensv2_init_i2c_until'] = function (block, generator) {
  hlv2AttachVarMonitor(block, 'huskylens');
  const varName = hlv2VarNameFromInput(block);
  const wire = block.getFieldValue('WIRE') || 'Wire';
  hlv2EnsureCore(generator, varName);
  generator.addSetup('wire_' + wire + '_begin', wire + '.begin();');
  generator.addSetup(
    varName + '_begin',
    'while (!' +
      varName +
      '.begin(' +
      wire +
      ')) {\n    delay(100);\n  }'
  );
  return '';
};

Arduino.forBlock['huskylensv2_init_i2c'] = function (block, generator) {
  hlv2AttachVarMonitor(block, 'huskylens');
  const varName = hlv2VarNameFromInput(block);
  const wire = block.getFieldValue('WIRE') || 'Wire';
  hlv2EnsureCore(generator, varName);
  generator.addSetup('wire_' + wire + '_begin', wire + '.begin();');
  generator.addSetup(varName + '_begin', varName + '.begin(' + wire + ');');
  return '';
};

Arduino.forBlock['huskylensv2_init_serial'] = function (block, generator) {
  hlv2AttachVarMonitor(block, 'huskylens');
  const varName = hlv2VarNameFromInput(block);
  const serial = block.getFieldValue('SERIAL') || 'Serial1';
  const baud = hlv2SerialBaud(serial);
  hlv2EnsureCore(generator, varName);
  generator.addSetup(serial + '_begin', serial + '.begin(' + baud + ');');
  generator.addSetup(
    varName + '_begin',
    'while (!' +
      varName +
      '.begin(' +
      serial +
      ')) {\n    delay(100);\n  }'
  );
  return '';
};

// ========== 算法 ==========
Arduino.forBlock['huskylensv2_set_algorithm'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  return varName + '.switchAlgorithm(' + algorithm + ');\n';
};

Arduino.forBlock['huskylensv2_set_algorithm_until'] = function (
  block,
  generator
) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  return (
    'while (!' +
    varName +
    '.switchAlgorithm(' +
    algorithm +
    ')) {\n  delay(100);\n}\n'
  );
};

// ========== 数据获取 ==========
Arduino.forBlock['huskylensv2_get_result'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  return varName + '.getResult(' + algorithm + ');\n';
};

Arduino.forBlock['huskylensv2_get_result_until'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  return (
    'while (!' +
    varName +
    '.getResult(' +
    algorithm +
    ')) {\n  delay(100);\n}\n'
  );
};

Arduino.forBlock['huskylensv2_available'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  return [
    varName + '.available(' + algorithm + ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

Arduino.forBlock['huskylensv2_result_count'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  return [
    varName + '.getCachedResultNum(' + algorithm + ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

Arduino.forBlock['huskylensv2_count_learned'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  return [
    varName + '.getCachedResultLearnedNum(' + algorithm + ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

Arduino.forBlock['huskylensv2_count_id'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  const id =
    generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '1';
  return [
    varName + '.getCachedResultNumByID(' + algorithm + ', ' + id + ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

Arduino.forBlock['huskylensv2_max_id'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  return [
    varName + '.getCachedResultMaxID(' + algorithm + ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

// ========== 结果获取 ==========
Arduino.forBlock['huskylensv2_pop_result'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  return [
    varName + '.popCachedResult(' + algorithm + ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

Arduino.forBlock['huskylensv2_get_center'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  return [
    varName + '.getCachedCenterResult(' + algorithm + ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

Arduino.forBlock['huskylensv2_get_by_index'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  const index =
    generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  return [
    varName +
      '.getCachedResultByIndex(' +
      algorithm +
      ', ' +
      index +
      ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

Arduino.forBlock['huskylensv2_get_by_id'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  const id =
    generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '1';
  return [
    varName + '.getCachedResultByID(' + algorithm + ', ' + id + ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

Arduino.forBlock['huskylensv2_get_by_id_index'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  const id =
    generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '1';
  const index =
    generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  return [
    varName +
      '.getCachedIndexResultByID(' +
      algorithm +
      ', ' +
      id +
      ', ' +
      index +
      ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

// ========== 巡线分支 ==========
Arduino.forBlock['huskylensv2_current_branch'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  return [
    varName + '.getCurrentBranch(' + algorithm + ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

Arduino.forBlock['huskylensv2_upcoming_branch_count'] = function (
  block,
  generator
) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  return [
    varName + '.getUpcomingBranchCount(' + algorithm + ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

Arduino.forBlock['huskylensv2_get_branch'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  const index =
    generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0';
  return [
    varName + '.getBranch(' + algorithm + ', ' + index + ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

// ========== 学习 ==========
Arduino.forBlock['huskylensv2_learn'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  return varName + '.learn(' + algorithm + ');\n';
};

Arduino.forBlock['huskylensv2_learn_value'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  return [
    varName + '.learn(' + algorithm + ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

Arduino.forBlock['huskylensv2_learn_block'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width =
    generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '100';
  const height =
    generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '100';
  return (
    varName +
    '.learnBlock(' +
    algorithm +
    ', ' +
    x +
    ', ' +
    y +
    ', ' +
    width +
    ', ' +
    height +
    ');\n'
  );
};

Arduino.forBlock['huskylensv2_learn_block_value'] = function (
  block,
  generator
) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width =
    generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '100';
  const height =
    generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '100';
  return [
    varName +
      '.learnBlock(' +
      algorithm +
      ', ' +
      x +
      ', ' +
      y +
      ', ' +
      width +
      ', ' +
      height +
      ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

Arduino.forBlock['huskylensv2_forget'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  return varName + '.forget(' + algorithm + ');\n';
};

// ========== 拍照截图 ==========
Arduino.forBlock['huskylensv2_take_photo'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const resolution =
    block.getFieldValue('RESOLUTION') || 'RESOLUTION_1280x720';
  return [
    varName + '.takePhoto(' + resolution + ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

Arduino.forBlock['huskylensv2_take_screenshot'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  return [varName + '.takeScreenshot()', generator.ORDER_FUNCTION_CALL];
};

// ========== 绘图 ==========
Arduino.forBlock['huskylensv2_draw_rect'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const color = block.getFieldValue('COLOR') || 'COLOR_WHITE';
  const lineWidth =
    generator.valueToCode(block, 'LINEWIDTH', generator.ORDER_ATOMIC) || '2';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width =
    generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '100';
  const height =
    generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '100';
  return (
    varName +
    '.drawRect(' +
    color +
    ', ' +
    lineWidth +
    ', ' +
    x +
    ', ' +
    y +
    ', ' +
    width +
    ', ' +
    height +
    ');\n'
  );
};

Arduino.forBlock['huskylensv2_draw_unique_rect'] = function (
  block,
  generator
) {
  const varName = hlv2VarNameFromField(block);
  const color = block.getFieldValue('COLOR') || 'COLOR_WHITE';
  const lineWidth =
    generator.valueToCode(block, 'LINEWIDTH', generator.ORDER_ATOMIC) || '2';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width =
    generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '100';
  const height =
    generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '100';
  return (
    varName +
    '.drawUniqueRect(' +
    color +
    ', ' +
    lineWidth +
    ', ' +
    x +
    ', ' +
    y +
    ', ' +
    width +
    ', ' +
    height +
    ');\n'
  );
};

Arduino.forBlock['huskylensv2_clear_rect'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  return varName + '.clearRect();\n';
};

Arduino.forBlock['huskylensv2_draw_text'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const color = block.getFieldValue('COLOR') || 'COLOR_WHITE';
  const fontSize =
    generator.valueToCode(block, 'FONTSIZE', generator.ORDER_ATOMIC) || '16';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '10';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '10';
  const text =
    generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  return (
    varName +
    '.drawText(' +
    color +
    ', ' +
    fontSize +
    ', ' +
    x +
    ', ' +
    y +
    ', ' +
    text +
    ');\n'
  );
};

Arduino.forBlock['huskylensv2_clear_text'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  return varName + '.clearText();\n';
};

// ========== 知识库 ==========
Arduino.forBlock['huskylensv2_save_knowledge'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  const id =
    generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '1';
  return (
    varName + '.saveKnowledges(' + algorithm + ', ' + id + ');\n'
  );
};

Arduino.forBlock['huskylensv2_load_knowledge'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  const id =
    generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '1';
  return (
    varName + '.loadKnowledges(' + algorithm + ', ' + id + ');\n'
  );
};

// ========== 音乐 / 命名 ==========
Arduino.forBlock['huskylensv2_play_music'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const name =
    generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  const volume =
    generator.valueToCode(block, 'VOLUME', generator.ORDER_ATOMIC) || '50';
  return varName + '.playMusic(' + name + ', ' + volume + ');\n';
};

Arduino.forBlock['huskylensv2_set_name'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  const id =
    generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '1';
  const name =
    generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
  return (
    varName +
    '.setNameByID(' +
    algorithm +
    ', ' +
    id +
    ', ' +
    name +
    ');\n'
  );
};

// ========== 算法参数 ==========
Arduino.forBlock['huskylensv2_get_algo_param_bool'] = function (
  block,
  generator
) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  const key =
    generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || '""';
  return [
    varName + '.getAlgoParamBool(' + algorithm + ', ' + key + ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

Arduino.forBlock['huskylensv2_get_algo_param_float'] = function (
  block,
  generator
) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  const key =
    generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || '""';
  return [
    varName + '.getAlgoParamFloat(' + algorithm + ', ' + key + ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

Arduino.forBlock['huskylensv2_get_algo_param_string'] = function (
  block,
  generator
) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  const key =
    generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || '""';
  return [
    varName + '.getAlgoParamString(' + algorithm + ', ' + key + ')',
    generator.ORDER_FUNCTION_CALL
  ];
};

Arduino.forBlock['huskylensv2_set_algo_param_bool'] = function (
  block,
  generator
) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  const key =
    generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || '""';
  const value =
    generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || 'false';
  return (
    varName +
    '.setAlgoParamBool(' +
    algorithm +
    ', ' +
    key +
    ', ' +
    value +
    ');\n'
  );
};

Arduino.forBlock['huskylensv2_set_algo_param_float'] = function (
  block,
  generator
) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  const key =
    generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || '""';
  const value =
    generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  return (
    varName +
    '.setAlgoParamFloat(' +
    algorithm +
    ', ' +
    key +
    ', ' +
    value +
    ');\n'
  );
};

Arduino.forBlock['huskylensv2_set_algo_param_string'] = function (
  block,
  generator
) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  const key =
    generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || '""';
  const value =
    generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
  return (
    varName +
    '.setAlgoParamString(' +
    algorithm +
    ', ' +
    key +
    ', ' +
    value +
    ');\n'
  );
};

Arduino.forBlock['huskylensv2_update_algo_params'] = function (
  block,
  generator
) {
  const varName = hlv2VarNameFromField(block);
  const algorithm = hlv2Algo(block);
  return varName + '.updateAlgoParams(' + algorithm + ');\n';
};

// ========== 结果属性 ==========
Arduino.forBlock['huskylensv2_result_id'] = function (block, generator) {
  return hlv2ResultItem(block, generator, 'ID');
};

Arduino.forBlock['huskylensv2_result_x'] = function (block, generator) {
  return hlv2ResultItem(block, generator, 'xCenter');
};

Arduino.forBlock['huskylensv2_result_y'] = function (block, generator) {
  return hlv2ResultItem(block, generator, 'yCenter');
};

Arduino.forBlock['huskylensv2_result_width'] = function (block, generator) {
  return hlv2ResultItem(block, generator, 'width');
};

Arduino.forBlock['huskylensv2_result_height'] = function (block, generator) {
  return hlv2ResultItem(block, generator, 'height');
};

Arduino.forBlock['huskylensv2_result_name'] = function (block, generator) {
  return hlv2ResultStr(block, generator, 'name');
};

Arduino.forBlock['huskylensv2_result_content'] = function (block, generator) {
  return hlv2ResultStr(block, generator, 'content');
};

Arduino.forBlock['huskylensv2_result_confidence'] = function (
  block,
  generator
) {
  return hlv2ResultItem(block, generator, 'confidence');
};

Arduino.forBlock['huskylensv2_result_type'] = function (block, generator) {
  const result = hlv2ResultExpr(block, generator);
  return [
    '((' + result + ') ? (' + result + ')->type : -1)',
    generator.ORDER_CONDITIONAL
  ];
};

Arduino.forBlock['huskylensv2_is_valid'] = function (block, generator) {
  const result = hlv2ResultExpr(block, generator);
  return ['((' + result + ') != NULL)', generator.ORDER_RELATIONAL];
};

Arduino.forBlock['huskylensv2_result_pitch'] = function (block, generator) {
  return hlv2ResultItem(block, generator, 'pitch');
};

Arduino.forBlock['huskylensv2_result_yaw'] = function (block, generator) {
  return hlv2ResultItem(block, generator, 'yaw');
};

Arduino.forBlock['huskylensv2_result_roll'] = function (block, generator) {
  return hlv2ResultItem(block, generator, 'roll');
};

Arduino.forBlock['huskylensv2_result_azimuth'] = function (block, generator) {
  return hlv2ResultItem(block, generator, 'azimuth');
};

Arduino.forBlock['huskylensv2_result_classid'] = function (block, generator) {
  return hlv2ResultItem(block, generator, 'classID');
};

Arduino.forBlock['huskylensv2_result_xtarget'] = function (block, generator) {
  return hlv2ResultItem(block, generator, 'xTarget');
};

Arduino.forBlock['huskylensv2_result_ytarget'] = function (block, generator) {
  return hlv2ResultItem(block, generator, 'yTarget');
};

Arduino.forBlock['huskylensv2_result_angle'] = function (block, generator) {
  return hlv2ResultItem(block, generator, 'angle');
};

Arduino.forBlock['huskylensv2_result_length'] = function (block, generator) {
  return hlv2ResultItem(block, generator, 'length');
};

Arduino.forBlock['huskylensv2_result_level'] = function (block, generator) {
  return hlv2ResultItem(block, generator, 'level');
};

Arduino.forBlock['huskylensv2_result_steering'] = function (block, generator) {
  return hlv2ResultItem(block, generator, 'steering');
};

Arduino.forBlock['huskylensv2_result_throttle'] = function (block, generator) {
  return hlv2ResultItem(block, generator, 'throttle');
};

// Face 关键点（LARGE_MEMORY）
function hlv2FacePoint(block, generator, point) {
  const result = hlv2ResultExpr(block, generator);
  const axis = block.getFieldValue('AXIS') || 'x';
  const field = point + '_' + axis;
  const code =
    'RET_ITEM_NUM(static_cast<FaceResult*>(' +
    result +
    '), FaceResult, ' +
    field +
    ')';
  return [code, generator.ORDER_FUNCTION_CALL];
}

Arduino.forBlock['huskylensv2_face_leye'] = function (block, generator) {
  return hlv2FacePoint(block, generator, 'leye');
};
Arduino.forBlock['huskylensv2_face_reye'] = function (block, generator) {
  return hlv2FacePoint(block, generator, 'reye');
};
Arduino.forBlock['huskylensv2_face_nose'] = function (block, generator) {
  return hlv2FacePoint(block, generator, 'nose');
};
Arduino.forBlock['huskylensv2_face_lmouth'] = function (block, generator) {
  return hlv2FacePoint(block, generator, 'lmouth');
};
Arduino.forBlock['huskylensv2_face_rmouth'] = function (block, generator) {
  return hlv2FacePoint(block, generator, 'rmouth');
};

// Hand / Pose 通用关键点字段读取
Arduino.forBlock['huskylensv2_hand_point'] = function (block, generator) {
  const result = hlv2ResultExpr(block, generator);
  const point = block.getFieldValue('POINT') || 'wrist';
  const axis = block.getFieldValue('AXIS') || 'x';
  const field = point + '_' + axis;
  const code =
    'RET_ITEM_NUM(static_cast<HandResult*>(' +
    result +
    '), HandResult, ' +
    field +
    ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['huskylensv2_pose_point'] = function (block, generator) {
  const result = hlv2ResultExpr(block, generator);
  const point = block.getFieldValue('POINT') || 'nose';
  const axis = block.getFieldValue('AXIS') || 'x';
  const field = point + '_' + axis;
  const code =
    'RET_ITEM_NUM(static_cast<PoseResult*>(' +
    result +
    '), PoseResult, ' +
    field +
    ')';
  return [code, generator.ORDER_FUNCTION_CALL];
};

// ========== 多算法 / 录制 ==========
Arduino.forBlock['huskylensv2_set_multi_algorithm'] = function (
  block,
  generator
) {
  const varName = hlv2VarNameFromField(block);
  const a1 =
    block.getFieldValue('ALGORITHM1') || 'ALGORITHM_FACE_RECOGNITION';
  const a2 =
    block.getFieldValue('ALGORITHM2') || 'ALGORITHM_OBJECT_TRACKING';
  const a3 = block.getFieldValue('ALGORITHM3') || 'ALGORITHM_ANY';
  return (
    varName +
    '.setMultiAlgorithm(' +
    a1 +
    ', ' +
    a2 +
    ', ' +
    a3 +
    ');\n'
  );
};

Arduino.forBlock['huskylensv2_set_multi_algorithm_ratio'] = function (
  block,
  generator
) {
  const varName = hlv2VarNameFromField(block);
  const r1 =
    generator.valueToCode(block, 'RATIO1', generator.ORDER_ATOMIC) || '0';
  const r2 =
    generator.valueToCode(block, 'RATIO2', generator.ORDER_ATOMIC) || '1';
  const r3 =
    generator.valueToCode(block, 'RATIO3', generator.ORDER_ATOMIC) || '-1';
  return (
    varName +
    '.setMultiAlgorithmRatio(' +
    r1 +
    ', ' +
    r2 +
    ', ' +
    r3 +
    ');\n'
  );
};

Arduino.forBlock['huskylensv2_start_recording'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const type = block.getFieldValue('TYPE') || 'MEDIA_TYPE_VIDEO';
  const duration =
    generator.valueToCode(block, 'DURATION', generator.ORDER_ATOMIC) || '-1';
  const filename =
    generator.valueToCode(block, 'FILENAME', generator.ORDER_ATOMIC) || '""';
  const resolution =
    block.getFieldValue('RESOLUTION') || 'RESOLUTION_DEFAULT';
  return (
    varName +
    '.startRecording(' +
    type +
    ', ' +
    duration +
    ', ' +
    filename +
    ', ' +
    resolution +
    ');\n'
  );
};

Arduino.forBlock['huskylensv2_stop_recording'] = function (block, generator) {
  const varName = hlv2VarNameFromField(block);
  const type = block.getFieldValue('TYPE') || 'MEDIA_TYPE_VIDEO';
  return varName + '.stopRecording(' + type + ');\n';
};
