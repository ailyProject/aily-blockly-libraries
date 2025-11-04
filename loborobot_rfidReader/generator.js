// RFID读卡器库 - 代码生成器

// 初始化RFID读卡器
Arduino.forBlock['rfid_setup'] = function(block, generator) {
  // 1. 设置变量重命名监听
  if (!block._rfidVarMonitorAttached) {
    block._rfidVarMonitorAttached = true;
    block._rfidVarLastName = block.getFieldValue('VAR') || 'rfidReader';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._rfidVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'RFIDReader');
          block._rfidVarLastName = newName;
        }
        return newName;
      });
    }
  }

  // 2. 参数提取
  const varName = block.getFieldValue('VAR') || 'rfidReader';
  const rxPin = block.getFieldValue('RX_PIN');
  const txPin = block.getFieldValue('TX_PIN');
  const enablePin = block.getFieldValue('ENABLE_PIN');

  // 3. 添加库引用
  generator.addLibrary('#include <SoftwareSerial.h>', '#include <SoftwareSerial.h>');

  // 4. 注册变量到Blockly系统
  registerVariableToBlockly(varName, 'RFIDReader');

  // 5. 声明变量
  generator.addVariable('SoftwareSerial ' + varName, 'SoftwareSerial ' + varName + '(' + rxPin + ', ' + txPin + ');');
  generator.addVariable('int ' + varName + '_enablePin', 'int ' + varName + '_enablePin = ' + enablePin + ';');
  generator.addVariable('String ' + varName + '_currentTag', 'String ' + varName + '_currentTag = "";');
  generator.addVariable('String ' + varName + '_lastTag', 'String ' + varName + '_lastTag = "";');

  // 6. 添加读取标签的函数
  const readFunctionName = varName + '_readTag';
  const readFunction = `void ${readFunctionName}(String &tagString) {
  int bytesread = 0;
  int val = 0;
  char code[10];
  String tagCode = "";
  
  if (${varName}.available() > 0) {
    if ((val = ${varName}.read()) == 10) {
      bytesread = 0;
      while (bytesread < 10) {
        if (${varName}.available() > 0) {
          val = ${varName}.read();
          if ((val == 10) || (val == 13)) {
            break;
          }
          code[bytesread] = val;
          bytesread++;
        }
      }
      if (bytesread == 10) {
        for (int x = 0; x < 10; x++) {
          tagCode += code[x];
        }
        tagString = tagCode;
        while (${varName}.available() > 0) {
          ${varName}.read();
        }
      }
      bytesread = 0;
      tagCode = "";
    }
  }
}`;
  generator.addFunction(readFunctionName, readFunction);

  // 7. 生成初始化代码
  let setupCode = '';
  setupCode += varName + '.begin(2400);\n';
  setupCode += 'pinMode(' + varName + '_enablePin, OUTPUT);\n';
  setupCode += 'digitalWrite(' + varName + '_enablePin, LOW);\n';

  generator.addSetupBegin(varName + '_setup', setupCode);

  return '';
};

// 当RFID读取到标签时（事件回调块 - hat模式）
Arduino.forBlock['rfid_on_tag_read'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'rfidReader';
  const tagVarField = block.getField('TAG_VAR');
  const tagVarName = tagVarField ? tagVarField.getText() : 'tagID';
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  // 注册标签ID变量
  registerVariableToBlockly(tagVarName, 'String');
  generator.addVariable('String ' + tagVarName, 'String ' + tagVarName + ' = "";');

  // 在loop中添加读取和回调逻辑
  const loopCode = `if (${varName}.available() > 0) {
  ${varName}_readTag(${varName}_currentTag);
}
if (${varName}_currentTag != ${varName}_lastTag && ${varName}_currentTag != "") {
  ${varName}_lastTag = ${varName}_currentTag;
  ${tagVarName} = ${varName}_currentTag;
${handlerCode}
}
`;

  generator.addLoopBegin(varName + '_tag_check', loopCode);

  return ''; // hat模式块返回空字符串
};

// 检查RFID是否有数据可读
Arduino.forBlock['rfid_available'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'rfidReader';

  const code = varName + '.available() > 0';
  return [code, generator.ORDER_RELATIONAL];
};

// 读取RFID标签ID
Arduino.forBlock['rfid_read_tag'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'rfidReader';

  // 调用读取函数
  const code = varName + '_currentTag';
  return [code, generator.ORDER_ATOMIC];
};

// 启用/禁用RFID读卡器
Arduino.forBlock['rfid_enable'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'rfidReader';
  const state = block.getFieldValue('STATE');

  const code = 'digitalWrite(' + varName + '_enablePin, ' + state + ');\n';
  return code;
};
