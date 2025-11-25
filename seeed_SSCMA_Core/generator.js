'use strict';

// SSCMA Micro Core库的代码生成器
Arduino.forBlock['sscma_core_create'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'ai';
  
  // 添加库引用
  generator.addLibrary('SSCMA_Micro_Core', '#include <SSCMA_Micro_Core.h>');
  
  // 注册变量到Blockly系统
  registerVariableToBlockly(varName, 'SSCMAMicroCore');
  
  // 添加变量声明
  generator.addVariable(varName, 'SSCMAMicroCore ' + varName + ';');
  
  return '';
};

Arduino.forBlock['sscma_core_create_video_capture'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'camera';
  
  // 添加库引用
  generator.addLibrary('SSCMA_Micro_Core', '#include <SSCMA_Micro_Core.h>');
  
  // 注册变量到Blockly系统
  registerVariableToBlockly(varName, 'VideoCapture');
  
  // 添加变量声明
  generator.addVariable(varName, 'SSCMAMicroCore::VideoCapture ' + varName + ';');
  
  return '';
};

Arduino.forBlock['sscma_core_begin'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  
  // 添加库引用
  generator.addLibrary('SSCMA_Micro_Core', '#include <SSCMA_Micro_Core.h>');
  
  // 生成初始化代码
  let code = 'MA_RETURN_IF_UNEXPECTED(' + varName + '.begin(SSCMAMicroCore::Config::DefaultConfig));\n';
  
  return code;
};

Arduino.forBlock['sscma_core_video_capture_begin'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'camera';
  
  // 添加库引用
  generator.addLibrary('SSCMA_Micro_Core', '#include <SSCMA_Micro_Core.h>');
  
  // 生成初始化代码
  let code = 'MA_RETURN_IF_UNEXPECTED(' + varName + '.begin(SSCMAMicroCore::VideoCapture::DefaultCameraConfigXIAOS3));\n';
  
  return code;
};

Arduino.forBlock['sscma_core_set_loop_task_stack_size'] = function(block, generator) {
  const size = generator.valueToCode(block, 'SIZE', generator.ORDER_ATOMIC) || '40 * 1024';
  
  // 添加库引用
  generator.addLibrary('SSCMA_Micro_Core', '#include <SSCMA_Micro_Core.h>');
  
  // 生成设置栈大小代码
  let code = 'SET_LOOP_TASK_STACK_SIZE(' + size + ');\n';

  generator.addMacro('SET_LOOP_TASK_STACK_SIZE', code);
  
  return '';
};

Arduino.forBlock['sscma_core_invoke'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  const frame = generator.valueToCode(block, 'FRAME', generator.ORDER_ATOMIC) || 'nullptr';
  
  // 添加库引用
  generator.addLibrary('SSCMA_Micro_Core', '#include <SSCMA_Micro_Core.h>');
  
  // 生成推理代码
  let code = 'MA_RETURN_IF_UNEXPECTED(' + varName + '.invoke(' + frame + '));\n';
  
  return code;
};

Arduino.forBlock['sscma_core_get_managed_frame'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'camera';
  
  // 添加库引用
  generator.addLibrary('SSCMA_Micro_Core', '#include <SSCMA_Micro_Core.h>');
  
  // 生成获取帧代码
  let code = varName + '.getManagedFrame()';
  
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['sscma_core_register_boxes_callback'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'sscma_core_boxes_' + varName;
  
  // 添加库引用
  generator.addLibrary('SSCMA_Micro_Core', '#include <SSCMA_Micro_Core.h>');
  
  // 生成回调函数
  const functionDef = 'void ' + callbackName + '(const std::vector<SSCMAMicroCore::Box>& boxes, void* user_context) {\n' +
    handlerCode +
    '}\n';
  
  // 注册回调函数
  generator.addFunction(callbackName, functionDef);
  
  // 生成注册代码
  let code = varName + '.registerBoxesCallback(' + callbackName + ');\n';
  generator.addSetupEnd(code, code);
  
  return '';
};

Arduino.forBlock['sscma_core_register_classes_callback'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'sscma_core_classes_' + varName;
  
  // 添加库引用
  generator.addLibrary('SSCMA_Micro_Core', '#include <SSCMA_Micro_Core.h>');
  
  // 生成回调函数
  const functionDef = 'void ' + callbackName + '(const std::vector<SSCMAMicroCore::Class>& classes, void* user_context) {\n' +
    handlerCode +
    '}\n';
  
  // 注册回调函数
  generator.addFunction(callbackName, functionDef);
  
  // 生成注册代码
  let code = varName + '.registerClassesCallback(' + callbackName + ');\n';
  generator.addSetupEnd(code, code);
  
  return '';
};

Arduino.forBlock['sscma_core_register_points_callback'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'sscma_core_points_' + varName;
  
  // 添加库引用
  generator.addLibrary('SSCMA_Micro_Core', '#include <SSCMA_Micro_Core.h>');
  
  // 生成回调函数
  const functionDef = 'void ' + callbackName + '(const std::vector<SSCMAMicroCore::Point>& points, void* user_context) {\n' +
    handlerCode +
    '}\n';
  
  // 注册回调函数
  generator.addFunction(callbackName, functionDef);
  
  // 生成注册代码
  let code = varName + '.registerPointsCallback(' + callbackName + ');\n';
  generator.addSetupEnd(code, code);
  
  return '';
};

Arduino.forBlock['sscma_core_register_keypoints_callback'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'sscma_core_keypoints_' + varName;
  
  // 添加库引用
  generator.addLibrary('SSCMA_Micro_Core', '#include <SSCMA_Micro_Core.h>');
  
  // 生成回调函数
  const functionDef = 'void ' + callbackName + '(const std::vector<SSCMAMicroCore::Keypoints>& keypoints, void* user_context) {\n' +
    handlerCode +
    '}\n';
  
  // 注册回调函数
  generator.addFunction(callbackName, functionDef);
  
  // 生成注册代码
  let code = varName + '.registerKeypointsCallback(' + callbackName + ');\n';
  generator.addSetupEnd(code, code);
  
  return '';
};

Arduino.forBlock['sscma_core_register_perf_callback'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  const callbackName = 'sscma_core_perf_' + varName;
  
  // 添加库引用
  generator.addLibrary('SSCMA_Micro_Core', '#include <SSCMA_Micro_Core.h>');
  
  // 生成回调函数
  const functionDef = 'void ' + callbackName + '(const SSCMAMicroCore::Perf& perf, void* user_context) {\n' +
    handlerCode +
    '}\n';
  
  // 注册回调函数
  generator.addFunction(callbackName, functionDef);
  
  // 生成注册代码
  let code = varName + '.registerPerfCallback(' + callbackName + ');\n';
  generator.addSetupEnd(code, code);
  
  return '';
};

Arduino.forBlock['sscma_core_get_boxes'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  // 添加库引用
  generator.addLibrary('SSCMA_Micro_Core', '#include <SSCMA_Micro_Core.h>');
  
  // 生成遍历获取边界框代码
  let code = '';
  code += 'for (const auto& box : ' + varName + '.getBoxes()) {\n';
  code += '  // 处理每个边界框 box\n';
  code += handlerCode;
  code += '}\n';

  return code;
};

Arduino.forBlock['sscma_core_get_boxes_info'] = function(block, generator) {
  const property = block.getFieldValue('PROPERTY');

  let code = '';
  code += 'box.' + property;

  return [code, generator.ORDER_ATOMIC];
}

Arduino.forBlock['sscma_core_get_classes'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  // 添加库引用
  generator.addLibrary('SSCMA_Micro_Core', '#include <SSCMA_Micro_Core.h>');
  
  // 生成遍历获取分类结果代码
  let code = '';
  code += 'for (const auto& cls : ' + varName + '.getClasses()) {\n';
  code += '  // 处理每个分类结果 cls\n';
  code += handlerCode;
  code += '}\n';
  
  return code;
};

Arduino.forBlock['sscma_core_get_classes_info'] = function(block, generator) {
  const property = block.getFieldValue('PROPERTY');

  let code = '';
  code += 'cls.' + property;

  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['sscma_core_get_points'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  // 添加库引用
  generator.addLibrary('SSCMA_Micro_Core', '#include <SSCMA_Micro_Core.h>');
  
  // 生成遍历获取点检测结果代码
  let code = '';
  code += 'for (const auto& point : ' + varName + '.getPoints()) {\n';
  code += '  // 处理每个点检测结果 point\n';
  code += handlerCode;
  code += '}\n';
  
  return code;
};

Arduino.forBlock['sscma_core_get_points_info'] = function(block, generator) {
  const property = block.getFieldValue('PROPERTY');

  let code = '';
  code += 'point.' + property;

  return [code, generator.ORDER_ATOMIC];
}

Arduino.forBlock['sscma_core_get_keypoints'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  // 添加库引用
  generator.addLibrary('SSCMA_Micro_Core', '#include <SSCMA_Micro_Core.h>');
  
  // 生成遍历获取关键点代码
  let code = '';
  code += 'for (const auto& kp : ' + varName + '.getKeypoints()) {\n';
  code += '  // 处理每个关键点 keypoint\n';
  code += handlerCode;
  code += '}\n';
  
  return code;
};

Arduino.forBlock['sscma_core_get_keypoints_info'] = function(block, generator) {
  const property = block.getFieldValue('PROPERTY');

  let code = '';
  code += 'kp.box.' + property;

  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['sscma_core_get_keypoints_points'] = function(block, generator) {
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
  
  // 添加库引用
  generator.addLibrary('SSCMA_Micro_Core', '#include <SSCMA_Micro_Core.h>');
  
  // 生成遍历获取关键点组中的点代码
  let code = '';
  code += 'for (const auto& point : kp.points) {\n';
  code += '  // 处理每个点 point\n';
  code += handlerCode;
  code += '}\n';
  
  return code;
};

Arduino.forBlock['sscma_core_get_keypoints_points_info'] = function(block, generator) {
  const property = block.getFieldValue('PROPERTY');

  let code = '';
  code += 'point.' + property;

  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['sscma_core_get_perf'] = function(block, generator) {
  // 设置变量重命名监听
  if (!generator._prefVarMonitorAttached) {
    generator._prefVarMonitorAttached = true;
    generator._prefVarLastName = block.getFieldValue('PERF_VAR') || 'perf';
    const varField = block.getField('PERF_VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = generator._prefVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVarialbleInBlockly(block, oldName, newName, 'Perf');
          generator._prefVarLastName = newName;
        }
        return newName;
      });
    }
  }
  
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'ai';
  const perfVarName = block.getFieldValue('PERF_VAR') || 'perf';
  
  // 添加库引用
  generator.addLibrary('SSCMA_Micro_Core', '#include <SSCMA_Micro_Core.h>');
  
  // 注册变量到Blockly系统
  registerVariableToBlockly(perfVarName, 'SSCMAMicroCore::Perf');

  let code = '';
  code += 'auto ' + perfVarName + ' = ' + varName + '.getPerf();\n';
  
  return code;
};

Arduino.forBlock['sscma_core_get_perf_info'] = function(block, generator) {
  const varField = block.getField('PERF_VAR');
  const varName = varField ? varField.getText() : 'perf';
  const property = block.getFieldValue('PROPERTY');

  let code = '';
  code += varName + '.' + property;

  return [code, generator.ORDER_ATOMIC];
}

Arduino.forBlock['sscma_core_box_info'] = function(block, generator) {
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
  const h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';
  const score = generator.valueToCode(block, 'SCORE', generator.ORDER_ATOMIC) || '0';
  const target = generator.valueToCode(block, 'TARGET', generator.ORDER_ATOMIC) || '0';
  
  // 确保Serial已初始化
  ensureSerialBegin("Serial", generator);
  
  // 生成边界框信息输出代码
  let code = 'Serial.printf("Box: x=%f, y=%f, w=%f, h=%f, score=%f, target=%d\\n", ' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + score + ', ' + target + ');\n';
  
  return code;
};

Arduino.forBlock['sscma_core_class_info'] = function(block, generator) {
  const target = generator.valueToCode(block, 'TARGET', generator.ORDER_ATOMIC) || '0';
  const score = generator.valueToCode(block, 'SCORE', generator.ORDER_ATOMIC) || '0';
  
  // 确保Serial已初始化
  ensureSerialBegin("Serial", generator);
  
  // 生成分类信息输出代码
  let code = 'Serial.printf("Class: target=%d, score=%f\\n", ' + target + ', ' + score + ');\n';
  
  return code;
};

Arduino.forBlock['sscma_core_point_info'] = function(block, generator) {
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const z = generator.valueToCode(block, 'Z', generator.ORDER_ATOMIC) || '0';
  const score = generator.valueToCode(block, 'SCORE', generator.ORDER_ATOMIC) || '0';
  const target = generator.valueToCode(block, 'TARGET', generator.ORDER_ATOMIC) || '0';
  
  // 确保Serial已初始化
  ensureSerialBegin("Serial", generator);
  
  // 生成点信息输出代码
  let code = 'Serial.printf("Point: x=%f, y=%f, z=%f, score=%f, target=%d\\n", ' + x + ', ' + y + ', ' + z + ', ' + score + ', ' + target + ');\n';
  
  return code;
};

Arduino.forBlock['sscma_core_perf_info'] = function(block, generator) {
  const preprocess = generator.valueToCode(block, 'PREPROCESS', generator.ORDER_ATOMIC) || '0';
  const inference = generator.valueToCode(block, 'INFERENCE', generator.ORDER_ATOMIC) || '0';
  const postprocess = generator.valueToCode(block, 'POSTPROCESS', generator.ORDER_ATOMIC) || '0';
  
  // 确保Serial已初始化
  ensureSerialBegin("Serial", generator);
  
  // 生成性能信息输出代码
  let code = 'Serial.printf("Perf: preprocess=%dms, inference=%dms, postprocess=%dms\\n", ' + preprocess + ', ' + inference + ', ' + postprocess + ');\n';
  
  return code;
};
