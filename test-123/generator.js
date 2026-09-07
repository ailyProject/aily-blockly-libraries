Arduino.forBlock['led_matrix_init'] = function(block, generator) {
  generator.addLibrary('ArduinoGraphics', '#include "ArduinoGraphics.h"');
  generator.addLibrary('Arduino_LED_Matrix', '#include "Arduino_LED_Matrix.h"');
  generator.addObject('matrix', 'ArduinoLEDMatrix matrix;');
  
  var code = 'matrix.begin();\n';
  return code;
};

Arduino.forBlock['led_matrix_clear'] = function(block, generator) {
  var code = 'matrix.clear();\n';
  return code;
};

Arduino.forBlock['led_matrix_display_text'] = function(block, generator) {
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""';
  var direction = block.getFieldValue('DIRECTION');
  var speed = generator.valueToCode(block, 'SPEED', Arduino.ORDER_ATOMIC) || '100';
  
  var code = 'matrix.beginDraw();\n';
  code += 'matrix.textFont(Font_5x7);\n';
  code += 'matrix.beginText(0, 1, 0xFFFFFF);\n';
  code += 'matrix.println(' + text + ');\n';
  code += 'matrix.textScrollSpeed(' + speed + ');\n';
  code += 'matrix.endText(' + direction + ');\n';
  
  return code;
};

Arduino.forBlock['led_matrix_display_frame'] = function(block, generator) {
  var frame = generator.valueToCode(block, 'FRAME', Arduino.ORDER_ATOMIC);

  var code;

  // 检查是否是Arduino R4官方常量名称
  if (frame && frame.startsWith('LEDMATRIX_')) {
    // 直接使用Arduino R4官方常量
    code = 'matrix.loadFrame(' + frame + ');\n';
  } else {
    // 自定义数组，需要生成数组定义
    var arrayName = 'led_matrix_' + generateArrayHash(frame);

    generator.addMacro(arrayName,
      '// 自定义图案 - 12x8 LED矩阵\n' +
      'const uint32_t ' + arrayName + '[] = ' + frame + ';'
    );

    code = 'matrix.loadFrame(' + arrayName + ');\n';
  }

  return code;
};

Arduino.forBlock['led_matrix_display_frame_set'] = function(block, generator) {
  var pattern = block.getFieldValue('MATRIX');

  // 解析矩阵编辑器的数据并转换为Arduino代码
  var matrixData;

  if (Array.isArray(pattern)) {
    // 处理二维数组格式（来自field_led_matrix组件）
    matrixData = convertLedMatrixToUint32(pattern);
  } else {
    // 默认空图案
    matrixData = ['0x0', '0x0', '0x0'];
  }

  // 基于矩阵内容生成固定的数组名
  var arrayName = 'led_matrix_' + generateMatrixHash(pattern);

  // 生成自定义图案数组
  generator.addMacro(arrayName,
    '// 自定义图案 - 12x8 LED矩阵\n' +
    'const uint32_t ' + arrayName + '[] = {\n' +
    '  ' + matrixData.join(',\n  ') + '\n' +
    '};'
  );

  var code = 'matrix.loadFrame(' + arrayName + ');\n';
  return code;
};



Arduino.forBlock['led_matrix_custom_pattern'] = function(block, generator) {
  var pattern = block.getFieldValue('MATRIX');

  // 解析矩阵编辑器的数据并转换为Arduino代码
  var matrixData;

  if (Array.isArray(pattern)) {
    // 处理二维数组格式（来自field_led_matrix组件）
    matrixData = convertLedMatrixToUint32(pattern);
  } else {
    // 默认空图案
    matrixData = ['0x0', '0x0', '0x0'];
  }
  
  // // 基于矩阵内容生成固定的数组名
  // var arrayName = 'led_matrix_' + generateMatrixHash(pattern);

  // // 生成自定义图案数组
  // generator.addMacro(arrayName,
  //   '// 自定义图案 - 12x8 LED矩阵\n' +
  //   'const uint32_t ' + arrayName + '[] = {\n' +
  //   '  ' + matrixData.join(',\n  ') + '\n' +
  //   '};'
  // );

  // // 返回数组名（用于动画序列）
  // return [arrayName, Arduino.ORDER_ATOMIC];
  // 检查是否作为input_value连接到动画块中
  var parentConnection = block.outputConnection && block.outputConnection.targetConnection;
  var isInAnimation = false;
  var animationDelay = '100';

  // 只有当作为input_value连接时才检查动画上下文
  if (parentConnection && parentConnection.getSourceBlock) {
    var parentBlock = parentConnection.getSourceBlock();
    if (parentBlock && parentBlock.type === 'led_matrix_display_animation') {
      isInAnimation = true;
      animationDelay = parentBlock.getFieldValue('DELAY') || '100';
    }
  }

  // 根据是否在动画中生成不同格式的数组
  var code;
  if (isInAnimation) {
    // 在动画中：生成4个元素的数组（包含延迟）
    code = '{' + matrixData.join(',') + ',' + animationDelay + '}';
  } else {
    // 单独使用：生成3个元素的数组
    code = '{' + matrixData.join(',') + '}';
  }

  return [code, Arduino.ORDER_ATOMIC];
};

// LED矩阵预设图案块
Arduino.forBlock['led_matrix_preset_pattern'] = function(block, generator) {
  var selectedPattern = block.getFieldValue('PATTERN');
  var field = block.getField('PATTERN');
  var patternName = field.getSelectedPatternName();

  // Arduino R4官方图标名称映射
  var iconNameMap = {
    '蓝牙': 'LEDMATRIX_BLUETOOTH',
    '启动器': 'LEDMATRIX_BOOTLOADER_ON',
    '芯片': 'LEDMATRIX_CHIP',
    '云WiFi': 'LEDMATRIX_CLOUD_WIFI',
    '危险': 'LEDMATRIX_DANGER',
    '基础笑脸': 'LEDMATRIX_EMOJI_BASIC',
    '开心笑脸': 'LEDMATRIX_EMOJI_HAPPY',
    '伤心脸': 'LEDMATRIX_EMOJI_SAD',
    '大心形': 'LEDMATRIX_HEART_BIG',
    '小心形': 'LEDMATRIX_HEART_SMALL',
    '点赞': 'LEDMATRIX_LIKE',
    '音符': 'LEDMATRIX_MUSIC_NOTE',
    '电阻': 'LEDMATRIX_RESISTOR',
    'UNO': 'LEDMATRIX_UNO'
  };

  // 获取Arduino R4官方常量名称
  var arduinoConstantName = null;
  if (patternName && iconNameMap[patternName]) {
    arduinoConstantName = iconNameMap[patternName];
  }

  // console.info('Selected Pattern:', selectedPattern);
  // console.info('Pattern Name:', patternName);
  // console.info('Arduino Constant:', arduinoConstantName);

  // 解析选中的预设图案数据（用于自定义图案的备用方案）
  var matrixData;
  var selectedPattern = block.getFieldValue('PATTERN');

  if (Array.isArray(selectedPattern)) {
    // 处理二维数组格式（来自field_led_pattern_selector组件）
    matrixData = convertLedMatrixToUint32(selectedPattern);
  } else if (typeof selectedPattern === 'object' && selectedPattern.hex) {
    // 处理新的十六进制格式（Arduino R4官方图标）
    matrixData = selectedPattern.hex;
  } else {
    // 默认空图案
    matrixData = ['0x0', '0x0', '0x0'];
  }

  // 检查是否作为input_value连接到动画块中
  var parentConnection = block.outputConnection && block.outputConnection.targetConnection;
  var isInAnimation = false;
  var animationDelay = '66'; // Arduino R4官方图标默认延迟

  // 只有当作为input_value连接时才检查动画上下文
  if (parentConnection && parentConnection.getSourceBlock) {
    var parentBlock = parentConnection.getSourceBlock();
    if (parentBlock && parentBlock.type === 'led_matrix_display_animation') {
      isInAnimation = true;
      animationDelay = parentBlock.getFieldValue('DELAY') || '66';
    }
  }

  // 根据是否在动画中生成不同格式的代码
  var code;
  if (arduinoConstantName) {
    // 使用Arduino R4官方常量名称
    code = arduinoConstantName;
  } else {
    // 使用自定义十六进制数组
    if (isInAnimation) {
      // 在动画中：生成4个元素的数组（包含延迟）
      code = '{' + matrixData.join(',') + ',' + animationDelay + '}';
    } else {
      // 单独使用：生成3个元素的数组
      code = '{' + matrixData.join(',') + '}';
    }
  }

  return [code, Arduino.ORDER_ATOMIC];
};

// LED矩阵预设动画块
Arduino.forBlock['led_matrix_preset_animation'] = function(block, generator) {
  var field = block.getField('PATTERN');
  var patternName = field.getSelectedPatternName();

  // Arduino R4官方动画名称映射
  var animationNameMap = {
    '启动动画': 'LEDMATRIX_ANIMATION_STARTUP',
    '俄罗斯方块介绍': 'LEDMATRIX_ANIMATION_TETRIS_INTRO',
    'ATmega芯片': 'LEDMATRIX_ANIMATION_ATMEGA',
    'LED水平闪烁': 'LEDMATRIX_ANIMATION_LED_BLINK_HORIZONTAL',
    'LED垂直闪烁': 'LEDMATRIX_ANIMATION_LED_BLINK_VERTICAL',
    '箭头指南针': 'LEDMATRIX_ANIMATION_ARROWS_COMPASS',
    '音频波形': 'LEDMATRIX_ANIMATION_AUDIO_WAVEFORM',
    '电池': 'LEDMATRIX_ANIMATION_BATTERY',
    '弹跳球': 'LEDMATRIX_ANIMATION_BOUNCING_BALL',
    '虫子': 'LEDMATRIX_ANIMATION_BUG',
    '检查': 'LEDMATRIX_ANIMATION_CHECK',
    '云': 'LEDMATRIX_ANIMATION_CLOUD',
    '下载': 'LEDMATRIX_ANIMATION_DOWNLOAD',
    'DVD标志': 'LEDMATRIX_ANIMATION_DVD',
    '心跳线': 'LEDMATRIX_ANIMATION_HEARTBEAT_LINE',
    '心跳': 'LEDMATRIX_ANIMATION_HEARTBEAT',
    '无限循环加载': 'LEDMATRIX_ANIMATION_INFINITY_LOOP_LOADER',
    '时钟加载': 'LEDMATRIX_ANIMATION_LOAD_CLOCK',
    '加载': 'LEDMATRIX_ANIMATION_LOAD',
    '锁': 'LEDMATRIX_ANIMATION_LOCK',
    '通知': 'LEDMATRIX_ANIMATION_NOTIFICATION',
    '开源': 'LEDMATRIX_ANIMATION_OPENSOURCE',
    '旋转硬币': 'LEDMATRIX_ANIMATION_SPINNING_COIN',
    '俄罗斯方块': 'LEDMATRIX_ANIMATION_TETRIS',
    'WiFi搜索': 'LEDMATRIX_ANIMATION_WIFI_SEARCH',
    '沙漏': 'LEDMATRIX_ANIMATION_HOURGLASS'
  };

  // 获取Arduino R4官方动画常量名称
  var animationConstantName = null;
  if (patternName && animationNameMap[patternName]) {
    animationConstantName = animationNameMap[patternName];
  }

  // console.info('Animation Pattern Name:', patternName);
  // console.info('Animation Constant:', animationConstantName);

  var code;
  if (animationConstantName) {
    // 使用Arduino R4官方动画常量
    code = 'matrix.loadSequence(' + animationConstantName + ');\nmatrix.play(true);\n';
  } else {
    // 默认代码
    code = '// 未选择动画\n';
  }

  return code;
};

// LED矩阵动画序列块
Arduino.forBlock['led_matrix_display_animation'] = function(block, generator) {
  var frames = [];
  var hasArduinoR4Icons = false;

  // 收集所有动画帧（使用itemCount属性）
  for (var i = 0; i < block.itemCount; i++) {
    var frameCode = generator.valueToCode(block, 'ADD' + i, Arduino.ORDER_ATOMIC);
    if (frameCode) {
      // 检查是否包含Arduino R4官方常量
      if (frameCode.startsWith('LEDMATRIX_')) {
        hasArduinoR4Icons = true;
      }
      frames.push(frameCode);
    }
  }

  if (frames.length === 0) {
    return '// 没有动画帧\n';
  }

  var code;

  if (hasArduinoR4Icons && frames.every(frame => frame.startsWith('LEDMATRIX_'))) {
    // 所有帧都是Arduino R4官方常量，使用简化的动画代码
    var animationName = 'arduino_r4_animation_' + generateAnimationHash(frames);

    generator.addMacro(animationName,
      '// Arduino R4官方图标动画序列\n' +
      'const uint32_t* ' + animationName + '[] = {\n' +
      '  ' + frames.join(',\n  ') + '\n' +
      '};'
    );

    code = '// 播放Arduino R4官方图标动画\n';
    code += 'for (int i = 0; i < ' + frames.length + '; i++) {\n';
    code += '  matrix.loadFrame(' + animationName + '[i]);\n';
    code += '  delay(66); // Arduino R4官方延迟\n';
    code += '}\n';
  } else {
    // 包含自定义图案，使用传统的动画序列
    var animationName = 'animation_' + generateAnimationHash(frames);

    generator.addMacro(animationName,
      '// LED矩阵动画序列\n' +
      'const uint32_t ' + animationName + '[][4] = {\n' +
      '  ' + frames.join(',\n  ') + '\n' +
      '};'
    );

    code = 'matrix.loadSequence(' + animationName + ');\nmatrix.play(true);\n';
  }

  return code;
};

// 检查并移除已存在的LED矩阵动画扩展注册
if (Blockly.Extensions.isRegistered('led_matrix_animation_extension')) {
  Blockly.Extensions.unregister('led_matrix_animation_extension');
}

// LED矩阵动画动态扩展（参考core-lists的list_dynamic_extension）
Blockly.Extensions.register('led_matrix_animation_extension', function () {
  // 最小输入数量
  this.minInputs = 2;
  // 输入项计数
  this.itemCount = this.minInputs;

  this.findInputIndexForConnection = function (connection) {
    let connectionIndex = -1;
    for (let i = 0; i < this.inputList.length; i++) {
      if (this.inputList[i].connection == connection) {
        connectionIndex = i;
      }
    }

    if (connectionIndex == this.inputList.length - 1) {
      return this.inputList.length + 1;
    }

    const nextInput = this.inputList[connectionIndex + 1];
    const nextConnection = nextInput?.connection?.targetConnection;
    if (nextConnection && !nextConnection.getSourceBlock().isInsertionMarker()) {
      return connectionIndex + 1;
    }

    return null;
  };

  this.onPendingConnection = function (connection) {
    const insertIndex = this.findInputIndexForConnection(connection);
    if (insertIndex == null) {
      return;
    }

    this.appendValueInput(`ADD${Blockly.utils.idGenerator.genUid()}`);
    this.moveNumberedInputBefore(this.inputList.length - 1, insertIndex);
  };

  this.finalizeConnections = function () {
    const targetConns = this.removeUnnecessaryEmptyConns(
      this.inputList.map((i) => i.connection?.targetConnection),
    );

    this.tearDownBlock();
    this.addItemInputs(targetConns);
    this.itemCount = targetConns.length;
  };

  this.tearDownBlock = function () {
    // 只删除动态添加的输入（ADD2及以后）
    for (let i = this.inputList.length - 1; i >= 0; i--) {
      const inputName = this.inputList[i].name;
      // 保留原始的ADD0和ADD1，只删除动态添加的
      if (inputName.startsWith('ADD') && inputName !== 'ADD0' && inputName !== 'ADD1') {
        this.removeInput(inputName);
      }
    }
  };

  this.removeUnnecessaryEmptyConns = function (targetConns) {
    const filteredConns = [...targetConns];
    for (let i = filteredConns.length - 1; i >= 0; i--) {
      if (!filteredConns[i] && filteredConns.length > this.minInputs) {
        filteredConns.splice(i, 1);
      }
    }
    return filteredConns;
  };

  this.addItemInputs = function (targetConns) {
    // 从ADD2开始添加动态输入
    for (let i = this.minInputs; i < targetConns.length; i++) {
      const inputName = `ADD${i}`;
      const input = this.appendValueInput(inputName);
      input.setCheck("Array");
      const targetConn = targetConns[i];
      if (targetConn) input.connection?.connect(targetConn);
    }
  };

  this.isCorrectlyFormatted = function () {
    // 检查动态输入是否正确格式化
    let dynamicInputIndex = this.minInputs;
    for (let i = 0; i < this.inputList.length; i++) {
      const inputName = this.inputList[i].name;
      if (inputName.startsWith('ADD') && inputName !== 'ADD0' && inputName !== 'ADD1') {
        if (inputName !== `ADD${dynamicInputIndex}`) return false;
        dynamicInputIndex++;
      }
    }
    return true;
  };

  // 监听连接事件
  this.onchange = function (event) {
    if (!this.workspace || this.isInFlyout) {
      return;
    }

    if (event && (event.type === Blockly.Events.BLOCK_MOVE || event.type === Blockly.Events.BLOCK_DELETE)) {
      if (!this.isCorrectlyFormatted()) {
        Blockly.Events.disable();
        this.finalizeConnections();
        if (this instanceof Blockly.BlockSvg) this.initSvg();
        Blockly.Events.enable();
      }
    }
  };
});

// 检查并移除已存在的LED矩阵动画变异器注册
if (Blockly.Extensions.isRegistered('led_matrix_animation_mutator')) {
  Blockly.Extensions.unregister('led_matrix_animation_mutator');
}

// 定义LED矩阵动画变异器来处理序列化
Blockly.Extensions.registerMutator('led_matrix_animation_mutator', {
  mutationToDom: function () {
    if (!this.isDeadOrDying()) {
      Blockly.Events.disable();
      this.finalizeConnections();
      if (this instanceof Blockly.BlockSvg) this.initSvg();
      Blockly.Events.enable();
    }
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('items', `${this.itemCount}`);
    return container;
  },

  domToMutation: function (xmlElement) {
    this.itemCount = Math.max(
      parseInt(xmlElement.getAttribute('items') || '0', 10),
      this.minInputs,
    );
    for (let i = this.minInputs; i < this.itemCount; i++) {
      const input = this.appendValueInput(`ADD${i}`);
      input.setCheck("Array");
    }
  },

  saveExtraState: function () {
    if (!this.isDeadOrDying() && !this.isCorrectlyFormatted()) {
      Blockly.Events.disable();
      this.finalizeConnections();
      if (this instanceof Blockly.BlockSvg) this.initSvg();
      Blockly.Events.enable();
    }
    return {
      itemCount: this.itemCount,
    };
  },

  loadExtraState: function (state) {
    if (typeof state === 'string') {
      this.domToMutation(Blockly.utils.xml.textToDom(state));
      return;
    }
    this.itemCount = state['itemCount'] || 0;
    for (let i = this.minInputs; i < this.itemCount; i++) {
      const input = this.appendValueInput(`ADD${i}`);
      input.setCheck("Array");
    }
  }
});

// 辅助函数：将LED矩阵二维数组转换为uint32_t数组（用于field_led_matrix组件）
function convertLedMatrixToUint32(matrixArray) {
  if (!Array.isArray(matrixArray)) {
    return ['0x0', '0x0', '0x0'];
  }

  var height = matrixArray.length;
  var width = matrixArray[0] ? matrixArray[0].length : 0;

  // 检查矩阵尺寸，支持8x8或12x8
  if (height === 8 && width === 8) {
    // 8x8矩阵，需要扩展到12x8（在右侧填充0）
    return convert8x8ToUint32(matrixArray);
  } else if (height === 8 && width === 12) {
    // 12x8矩阵
    return convert12x8ToUint32(matrixArray);
  } else {
    // 不支持的尺寸，返回空图案
    return ['0x0', '0x0', '0x0'];
  }
}

// 将8x8矩阵转换为Arduino R4的12x8格式
function convert8x8ToUint32(matrixArray) {
  // 将8x8矩阵扩展为12x8（右侧填充0）
  var bits = [];
  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 12; col++) {
      if (col < 8 && matrixArray[row] && matrixArray[row][col]) {
        bits.push(1);
      } else {
        bits.push(0);
      }
    }
  }

  return bitsToUint32Array(bits);
}

// 将12x8矩阵转换为uint32_t数组
function convert12x8ToUint32(matrixArray) {
  var bits = [];
  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 12; col++) {
      if (matrixArray[row] && matrixArray[row][col]) {
        bits.push(1);
      } else {
        bits.push(0);
      }
    }
  }

  return bitsToUint32Array(bits);
}

// 将96位数组转换为3个uint32_t
function bitsToUint32Array(bits) {
  // 确保有96位数据
  while (bits.length < 96) {
    bits.push(0);
  }

  // 每32位组成一个uint32_t
  var result = [];
  for (var i = 0; i < 3; i++) {
    var value = 0;
    for (var j = 0; j < 32; j++) {
      var bitIndex = i * 32 + j;
      if (bitIndex < bits.length && bits[bitIndex]) {
        value |= (1 << (31 - j));
      }
    }
    // 确保值为无符号32位整数
    value = value >>> 0;
    result.push('0x' + value.toString(16));
  }

  return result;
}

// 辅助函数：将矩阵数组转换为uint32_t数组（用于FieldLedMatrix组件，保留兼容性）
function convertMatrixArrayToUint32(matrixArray) {
  return convertLedMatrixToUint32(matrixArray);
}

// 生成基于矩阵内容的哈希值，确保相同图案生成相同的数组名
function generateMatrixHash(matrixArray) {
  if (!Array.isArray(matrixArray)) {
    return 'empty';
  }

  // 将矩阵转换为字符串
  var matrixString = '';
  for (var i = 0; i < matrixArray.length; i++) {
    if (Array.isArray(matrixArray[i])) {
      for (var j = 0; j < matrixArray[i].length; j++) {
        matrixString += matrixArray[i][j] ? '1' : '0';
      }
    }
  }

  // 如果矩阵为空，返回默认名称
  if (matrixString === '' || matrixString.indexOf('1') === -1) {
    return 'empty';
  }

  // 生成简单的哈希值
  var hash = 0;
  for (var i = 0; i < matrixString.length; i++) {
    var char = matrixString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }

  // 确保哈希值为正数并转换为16进制
  return Math.abs(hash).toString(16);
}

// 生成基于动画帧序列的哈希值，确保相同动画序列生成相同的数组名
function generateAnimationHash(frameNames) {
  if (!Array.isArray(frameNames) || frameNames.length === 0) {
    return 'empty';
  }

  // 将动画帧名称序列转换为字符串
  var animationString = frameNames.join('|');

  // 如果动画序列为空，返回默认名称
  if (animationString === '') {
    return 'empty';
  }

  // 生成简单的哈希值
  var hash = 0;
  for (var i = 0; i < animationString.length; i++) {
    var char = animationString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }

  // 确保哈希值为正数并转换为16进制
  return Math.abs(hash).toString(16);
}

// 生成基于数组内容的哈希值，用于处理数组字符串格式
function generateArrayHash(arrayString) {
  if (!arrayString || arrayString === '') {
    return 'empty';
  }

  // 清理数组字符串，移除空格和大括号，只保留数据部分
  var cleanString = arrayString.replace(/[\s{}]/g, '');

  // 如果清理后为空，返回默认名称
  if (cleanString === '') {
    return 'empty';
  }

  // 生成简单的哈希值
  var hash = 0;
  for (var i = 0; i < cleanString.length; i++) {
    var char = cleanString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }

  // 确保哈希值为正数并转换为16进制
  return Math.abs(hash).toString(16);
}

// 辅助函数：将矩阵编辑器的数据转换为uint32_t数组（字符串格式，降级方案）
function parseMatrixPattern(pattern) {
  if (!pattern || pattern === '') {
    // 默认空图案
    return ['0x0', '0x0', '0x0'];
  }

  // 将8x12的矩阵转换为3个32位整数
  var result = [];
  var bits = pattern.split('').map(function(c) { return c === '1' ? 1 : 0; });

  // 确保有96位数据
  while (bits.length < 96) {
    bits.push(0);
  }

  // 每32位组成一个uint32_t
  for (var i = 0; i < 3; i++) {
    var value = 0;
    for (var j = 0; j < 32; j++) {
      var bitIndex = i * 32 + j;
      if (bitIndex < bits.length && bits[bitIndex]) {
        value |= (1 << (31 - j));
      }
    }
    // 确保值为无符号32位整数
    value = value >>> 0;
    result.push('0x' + value.toString(16));
  }

  return result;
}
