Arduino.forBlock['json_document_init'] = function(block, generator) {
  // 监听NAME输入值的变化，自动重命名Blockly变量
  if (!block._jsonDocVarMonitorAttached) {
    block._jsonDocVarMonitorAttached = true;
    block._jsonDocVarLastName = block.getFieldValue('NAME') || 'doc';
    const nameField = block.getField('NAME');
    if (nameField && typeof nameField.setValidator === 'function') {
      nameField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._jsonDocVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'JsonDocument');
          block._jsonDocVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const docName = block.getFieldValue('NAME') || 'doc';
  
  registerVariableToBlockly(docName, 'JsonDocument');

  ensureArduinoJsonLib(generator);

  let code = 'JsonDocument ' + docName + ';\n';
  return code;
};

Arduino.forBlock['json_document_add_value'] = function(block, generator) {

  const varField = block.getField('VAR');
  const docName = varField ? varField.getText() : 'doc';
  
  const keyValue = block.getFieldValue('KEY') || 'key';
  
  // 解析路径字符串
  const parsedPath = parseJsonPath(keyValue);
  
  const data = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '""';

  ensureArduinoJsonLib(generator);

  let code = docName + parsedPath + ' = ' + data + ';\n';

  return code;
};

Arduino.forBlock['json_document_add_array'] = function(block, generator) {
  // 监听ARRAY_NAME输入值的变化，自动重命名Blockly变量
  if (!block._jsonDocArrayMonitorAttached) {
    block._jsonDocArrayMonitorAttached = true;
    block._jsonDocArrayLastName = block.getFieldValue('ARRAY_NAME') || 'array';
    const arrayField = block.getField('ARRAY_NAME');
    if (arrayField && typeof arrayField.setValidator === 'function') {
      arrayField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._jsonDocArrayLastName;
        if (workspace && newName && newName !== oldName) {
          block._jsonDocArrayLastName = newName;
        }
        return newName;
      });
    }
  }
  
  const varField = block.getField('VAR');
  const docName = varField ? varField.getText() : 'doc';
  
  const arrayName = block.getFieldValue('ARRAY_NAME') || 'array';

  registerVariableToBlockly(arrayName, 'JsonArray');
  ensureArduinoJsonLib(generator);

  let code = 'JsonArray ' + arrayName + ' = ' + docName + '["' + arrayName + '"].to<JsonArray>();\n';
  return code;
};

Arduino.forBlock['json_document_add_array_value'] = function(block, generator) {
  const arrayField = block.getField('ARRAY_NAME');
  const arrayName = arrayField ? arrayField.getText() : 'array';

  const value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '""';

  ensureArduinoJsonLib(generator);

  let code = arrayName + '.add(' + value + ');\n';
  return code;
};

Arduino.forBlock['json_document_get_value'] = function(block, generator) {
  const varField = block.getField('VAR');
  const docName = varField ? varField.getText() : 'doc';

  const keyValue = block.getFieldValue('KEY') || 'key';
  
  // 解析路径字符串
  const parsedPath = parseJsonPath(keyValue);

  ensureArduinoJsonLib(generator);

  let code = docName + parsedPath;
  return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['json_document_get_value_type'] = function(block, generator) {
  const varField = block.getField('VAR');
  const docName = varField ? varField.getText() : 'doc';

  const keyValue = block.getFieldValue('KEY') || 'key';
  const type = block.getFieldValue('TYPE') || 'String';
  
  // 解析路径字符串
  const parsedPath = parseJsonPath(keyValue);
  
  const typeMap = {
    'bool': 'as<bool>()',
    'int': 'as<int>()',
    'unsigned int': 'as<unsigned int>()',
    'long': 'as<long>()',
    'unsigned long': 'as<unsigned long>()',
    'float': 'as<float>()',
    'double': 'as<double>()',
    'const char*': 'as<const char*>()',
    'String': 'as<String>()',
    'JsonArrayConst': 'as<JsonArrayConst>()',
    'JsonObjectConst': 'as<JsonObjectConst>()'
  };

  if (!typeMap[type]) {
    throw new Error('Unsupported type: ' + type);
  }

  ensureArduinoJsonLib(generator);
  let code = docName + parsedPath + '.' + typeMap[type];

  return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['json_document_get_array'] = function(block, generator) {
  const varField = block.getField('VAR');
  const docName = varField ? varField.getText() : 'doc';

  const arrayName = block.getFieldValue('ARRAY_NAME') || 'array';
  const index = generator.valueToCode(block, 'INDEX', Arduino.ORDER_ATOMIC) || '0';

  ensureArduinoJsonLib(generator);

  // 解析数组路径
  const parsedArrayPath = parseJsonPath(arrayName);
  let code = docName + parsedArrayPath + '[' + index + ']';
  return [code, Arduino.ORDER_MEMBER];
};

Arduino.forBlock['json_document_serialize_to_somewhere'] = function(block, generator) {
  const varField = block.getField('VAR');
  const docName = varField ? varField.getText() : 'doc';

  const output = generator.valueToCode(block, 'OUTPUT', Arduino.ORDER_ATOMIC) || '""';

  if (!output || output === '""') {
    throw new Error('Output must be a valid variable.');
  }

  ensureArduinoJsonLib(generator);

  let code = 'serializeJson(' + docName + ', ' + output + ');\n';
  return code;
};

Arduino.forBlock['json_document_deserialize_from_somewhere'] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._jsonDocVarMonitorAttached) {
    block._jsonDocVarMonitorAttached = true;
    block._jsonDocVarLastName = block.getFieldValue('VAR') || 'doc';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._jsonDocVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'JsonDocument');
          block._jsonDocVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varField = block.getField('VAR');
  const docName = varField ? varField.getText() : 'doc';

  const input = generator.valueToCode(block, 'INPUT', Arduino.ORDER_ATOMIC) || '""';

  if (!input || input === '""') {
    throw new Error('Input must be a valid variable.');
  }

  registerVariableToBlockly(docName, 'JsonDocument');
  ensureArduinoJsonLib(generator);

  ensureSerialBegin('Serial', generator);

  let code = 'JsonDocument ' + docName + ';\n';
  code += 'DeserializationError error = deserializeJson(' + docName + ', ' + input + ');\n';
  code += 'if (error) {\n';
  code += '  Serial.print(F("deserializeJson() failed: "));\n';
  code += '  Serial.println(error.f_str());\n';
  code += '  return;\n';
  code += '}\n';
  
  return code;
};

function parseJsonPath(pathStr) {
  // 解析路径字符串，支持 key, key[0], data.key, data[0].key 等格式
  const path = pathStr.replace(/"/g, ''); // 移除引号
  const parts = [];
  
  // 分割路径，支持点号和方括号
  const tokens = path.split(/[\.\[\]]/).filter(token => token !== '');
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (/^\d+$/.test(token)) {
      // 数字索引
      parts.push('[' + token + ']');
    } else {
      // 字符串键
      parts.push('["' + token + '"]');
    }
  }
  
  return parts.join('');
}

function ensureArduinoJsonLib(generator) {
  generator.addLibrary('ArduinoJson', '#include <ArduinoJson.h>');
}