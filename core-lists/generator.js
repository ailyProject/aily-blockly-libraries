// ============================================================
// 数组库 - 重构优化版本
// 更简洁、更易用的数组操作积木块
// ============================================================

// 辅助函数：检查块是否在函数作用域内
function isInFunctionScope(block) {
  let currentBlock = block;
  while (currentBlock) {
    if (currentBlock.type === 'procedures_defnoreturn' || 
        currentBlock.type === 'procedures_defreturn' ||
        currentBlock.type === 'function_definition' ||
        currentBlock.type === 'custom_function' ||
        currentBlock.type === 'arduino_setup' || 
        currentBlock.type === 'arduino_loop') {
      return true;
    }
    currentBlock = currentBlock.getParent();
  }
  return false;
}

// 辅助函数：获取数据类型的默认值
function getDefaultValue(type) {
  switch (type) {
    case "String": return '""';
    case "char": return "'\\0'";
    case "float":
    case "double": return "0.0";
    default: return "0";
  }
}

// ============================================================
// 代码生成器
// ============================================================

// 创建空数组
Arduino.forBlock["list_create_empty"] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._listVarMonitorAttached) {
    block._listVarMonitorAttached = true;
    block._listVarLastName = block.getFieldValue('VAR') || 'myList';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._listVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'LISTS');
          block._listVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue("VAR") || "myList";
  const type = block.getFieldValue("TYPE");
  const length = generator.valueToCode(block, "LENGTH", Arduino.ORDER_ATOMIC) || "10";
  
  registerVariableToBlockly(varName, 'LISTS');
  
  const isLocal = isInFunctionScope(block);
  const declaration = `${type} ${varName}[${length}];`;
  
  if (isLocal) {
    return declaration + "\n";
  } else {
    generator.addVariable("var_declare_" + varName, declaration);
    return "";
  }
};

// 创建带初始值的数组
Arduino.forBlock["list_create_with_values"] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._listVarMonitorAttached) {
    block._listVarMonitorAttached = true;
    block._listVarLastName = block.getFieldValue('VAR') || 'myList';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._listVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'LISTS');
          block._listVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue("VAR") || "myList";
  const type = block.getFieldValue("TYPE");
  const values = generator.valueToCode(block, "VALUES", Arduino.ORDER_ATOMIC) || "{0}";
  
  registerVariableToBlockly(varName, 'LISTS');
  
  const isLocal = isInFunctionScope(block);
  
  // 从values中提取元素数量
  let length = 1;
  if (values.startsWith('{') && values.endsWith('}')) {
    const inner = values.slice(1, -1).trim();
    if (inner) {
      length = inner.split(',').length;
    }
  }
  
  const declaration = `${type} ${varName}[${length}] = ${values};`;
  
  if (isLocal) {
    return declaration + "\n";
  } else {
    generator.addVariable("var_declare_" + varName, declaration);
    return "";
  }
};

// 数组值列表
Arduino.forBlock["list_values"] = function(block, generator) {
  const items = [];
  // dynamic_inputs_mutator 使用 extraCount 存储额外输入数量
  // 总数量 = extraCount + 1 (基础的 INPUT0)
  const extraCount = block.extraCount_ || 0;
  const count = extraCount + 1;
  
  for (let i = 0; i < count; i++) {
    const value = generator.valueToCode(block, "INPUT" + i, Arduino.ORDER_ATOMIC) || "0";
    items.push(value);
  }
  return ['{' + items.join(', ') + '}', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["list_values_simple"] = function(block, generator) {
  const list = block.getFieldValue("LIST") || "0";

  return ['{' + list + '}', Arduino.ORDER_ATOMIC];
}

// 获取数组元素
Arduino.forBlock["list_get"] = function(block, generator) {
  const variable = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const varName = variable ? variable.name : "myList";
  const index = generator.valueToCode(block, "INDEX", Arduino.ORDER_ATOMIC) || "0";
  return [`${varName}[${index}]`, Arduino.ORDER_ATOMIC];
};

// 设置数组元素
Arduino.forBlock["list_set"] = function(block, generator) {
  const variable = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const varName = variable ? variable.name : "myList";
  const index = generator.valueToCode(block, "INDEX", Arduino.ORDER_ATOMIC) || "0";
  const value = generator.valueToCode(block, "VALUE", Arduino.ORDER_ASSIGNMENT) || "0";
  return `${varName}[${index}] = ${value};\n`;
};

// 获取数组长度
Arduino.forBlock["list_length"] = function(block, generator) {
  const variable = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const varName = variable ? variable.name : "myList";
  return [`(sizeof(${varName}) / sizeof(${varName}[0]))`, Arduino.ORDER_ATOMIC];
};

// 查找元素索引
Arduino.forBlock["list_find"] = function(block, generator) {
  const variable = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const varName = variable ? variable.name : "myList";
  const value = generator.valueToCode(block, "VALUE", Arduino.ORDER_ATOMIC) || "0";
  
  const funcName = `_listFind_${varName}`;
  const funcCode = `
int ${funcName}(int searchValue) {
  int size = sizeof(${varName}) / sizeof(${varName}[0]);
  for (int i = 0; i < size; i++) {
    if (${varName}[i] == searchValue) return i;
  }
  return -1;
}`;
  generator.addFunction(funcName, funcCode);
  
  return [`${funcName}(${value})`, Arduino.ORDER_FUNCTION_CALL];
};

// 检查数组是否包含元素
Arduino.forBlock["list_contains"] = function(block, generator) {
  const variable = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const varName = variable ? variable.name : "myList";
  const value = generator.valueToCode(block, "VALUE", Arduino.ORDER_ATOMIC) || "0";
  
  const funcName = `_listContains_${varName}`;
  const funcCode = `
bool ${funcName}(int searchValue) {
  int size = sizeof(${varName}) / sizeof(${varName}[0]);
  for (int i = 0; i < size; i++) {
    if (${varName}[i] == searchValue) return true;
  }
  return false;
}`;
  generator.addFunction(funcName, funcCode);
  
  return [`${funcName}(${value})`, Arduino.ORDER_FUNCTION_CALL];
};

// 数组统计（最小/最大/求和/平均）
Arduino.forBlock["list_min_max"] = function(block, generator) {
  const variable = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const varName = variable ? variable.name : "myList";
  const mode = block.getFieldValue("MODE");
  
  let funcName, funcCode;
  
  switch (mode) {
    case "min":
      funcName = `_listMin_${varName}`;
      funcCode = `
auto ${funcName}() {
  int size = sizeof(${varName}) / sizeof(${varName}[0]);
  auto minVal = ${varName}[0];
  for (int i = 1; i < size; i++) {
    if (${varName}[i] < minVal) minVal = ${varName}[i];
  }
  return minVal;
}`;
      break;
    case "max":
      funcName = `_listMax_${varName}`;
      funcCode = `
auto ${funcName}() {
  int size = sizeof(${varName}) / sizeof(${varName}[0]);
  auto maxVal = ${varName}[0];
  for (int i = 1; i < size; i++) {
    if (${varName}[i] > maxVal) maxVal = ${varName}[i];
  }
  return maxVal;
}`;
      break;
    case "sum":
      funcName = `_listSum_${varName}`;
      funcCode = `
long ${funcName}() {
  int size = sizeof(${varName}) / sizeof(${varName}[0]);
  long sum = 0;
  for (int i = 0; i < size; i++) {
    sum += ${varName}[i];
  }
  return sum;
}`;
      break;
    case "avg":
      funcName = `_listAvg_${varName}`;
      funcCode = `
float ${funcName}() {
  int size = sizeof(${varName}) / sizeof(${varName}[0]);
  long sum = 0;
  for (int i = 0; i < size; i++) {
    sum += ${varName}[i];
  }
  return (float)sum / size;
}`;
      break;
  }
  
  generator.addFunction(funcName, funcCode);
  return [`${funcName}()`, Arduino.ORDER_FUNCTION_CALL];
};

// 数组排序
Arduino.forBlock["list_sort"] = function(block, generator) {
  const variable = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const varName = variable ? variable.name : "myList";
  const order = block.getFieldValue("ORDER");
  
  const funcName = `_listSort_${varName}_${order}`;
  const comparison = order === "asc" ? ">" : "<";
  
  const funcCode = `
void ${funcName}() {
  int size = sizeof(${varName}) / sizeof(${varName}[0]);
  for (int i = 0; i < size - 1; i++) {
    for (int j = 0; j < size - i - 1; j++) {
      if (${varName}[j] ${comparison} ${varName}[j + 1]) {
        auto temp = ${varName}[j];
        ${varName}[j] = ${varName}[j + 1];
        ${varName}[j + 1] = temp;
      }
    }
  }
}`;
  
  generator.addFunction(funcName, funcCode);
  return `${funcName}();\n`;
};

// 反转数组
Arduino.forBlock["list_reverse"] = function(block, generator) {
  const variable = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const varName = variable ? variable.name : "myList";
  
  const funcName = `_listReverse_${varName}`;
  const funcCode = `
void ${funcName}() {
  int size = sizeof(${varName}) / sizeof(${varName}[0]);
  for (int i = 0; i < size / 2; i++) {
    auto temp = ${varName}[i];
    ${varName}[i] = ${varName}[size - 1 - i];
    ${varName}[size - 1 - i] = temp;
  }
}`;
  
  generator.addFunction(funcName, funcCode);
  return `${funcName}();\n`;
};

// 填充数组
Arduino.forBlock["list_fill"] = function(block, generator) {
  const variable = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const varName = variable ? variable.name : "myList";
  const value = generator.valueToCode(block, "VALUE", Arduino.ORDER_ATOMIC) || "0";
  
  const funcName = `_listFill_${varName}`;
  const funcCode = `
void ${funcName}(int fillValue) {
  int size = sizeof(${varName}) / sizeof(${varName}[0]);
  for (int i = 0; i < size; i++) {
    ${varName}[i] = fillValue;
  }
}`;
  
  generator.addFunction(funcName, funcCode);
  return `${funcName}(${value});\n`;
};

// 复制数组
Arduino.forBlock["list_copy"] = function(block, generator) {
  const fromVar = block.workspace.getVariableById(block.getFieldValue("FROM"));
  const toVar = block.workspace.getVariableById(block.getFieldValue("TO"));
  const fromName = fromVar ? fromVar.name : "myList";
  const toName = toVar ? toVar.name : "copyList";
  
  const funcName = `_listCopy_${fromName}_to_${toName}`;
  const funcCode = `
void ${funcName}() {
  int size = sizeof(${fromName}) / sizeof(${fromName}[0]);
  for (int i = 0; i < size; i++) {
    ${toName}[i] = ${fromName}[i];
  }
}`;
  
  generator.addFunction(funcName, funcCode);
  return `${funcName}();\n`;
};

// 遍历数组
Arduino.forBlock["list_foreach"] = function(block, generator) {
  const variable = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const varName = variable ? variable.name : "myList";
  const itemName = block.getFieldValue("ITEM") || "item";
  const doCode = generator.statementToCode(block, "DO");
  
  return `for (int _i = 0; _i < (sizeof(${varName}) / sizeof(${varName}[0])); _i++) {
  auto ${itemName} = ${varName}[_i];
${doCode}}\n`;
};

// 遍历数组（带索引）
Arduino.forBlock["list_foreach_index"] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._itemVarMonitorAttached) {
    block._itemVarMonitorAttached = true;
    block._itemVarLastName = block.getFieldValue('ITEM') || 'item';
    const varField = block.getField('ITEM');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._itemVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, undefined);
          block._itemVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const variable = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const varName = variable ? variable.name : "myList";
  const indexName = block.getFieldValue("INDEX") || "i";
  const itemName = block.getFieldValue("ITEM") || "item";
  const doCode = generator.statementToCode(block, "DO");

  registerVariableToBlockly(itemName, undefined);
  
  return `for (int ${indexName} = 0; ${indexName} < (sizeof(${varName}) / sizeof(${varName}[0])); ${indexName}++) {
  auto ${itemName} = ${varName}[${indexName}];
${doCode}}\n`;
};

// 创建二维数组
Arduino.forBlock["list2d_create"] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._listVarMonitorAttached) {
    block._listVarMonitorAttached = true;
    block._listVarLastName = block.getFieldValue('VAR') || 'matrix';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._listVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'LISTS');
          block._listVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue("VAR") || "matrix";
  const type = block.getFieldValue("TYPE");
  const rows = generator.valueToCode(block, "ROWS", Arduino.ORDER_ATOMIC) || "3";
  const cols = generator.valueToCode(block, "COLS", Arduino.ORDER_ATOMIC) || "3";
  
  registerVariableToBlockly(varName, 'LISTS');
  
  const isLocal = isInFunctionScope(block);
  const declaration = `${type} ${varName}[${rows}][${cols}];`;
  
  if (isLocal) {
    return declaration + "\n";
  } else {
    generator.addVariable("var_declare_" + varName, declaration);
    return "";
  }
};

// 创建带初始值的二维数组
Arduino.forBlock["list2d_create_with_values"] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._listVarMonitorAttached) {
    block._listVarMonitorAttached = true;
    block._listVarLastName = block.getFieldValue('VAR') || 'matrix';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._listVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'LISTS');
          block._listVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue("VAR") || "matrix";
  const type = block.getFieldValue("TYPE");
  
  registerVariableToBlockly(varName, 'LISTS');
  
  // 收集所有行数据
  const rows = [];
  const extraCount = block.extraCount_ || 0;
  const rowCount = extraCount + 1;
  
  let maxCols = 0;
  for (let i = 0; i < rowCount; i++) {
    const rowValue = generator.valueToCode(block, "INPUT" + i, Arduino.ORDER_ATOMIC) || "{0}";
    rows.push(rowValue);
    
    // 计算最大列数
    if (rowValue.startsWith('{') && rowValue.endsWith('}')) {
      const inner = rowValue.slice(1, -1).trim();
      if (inner) {
        const colCount = inner.split(',').length;
        if (colCount > maxCols) maxCols = colCount;
      }
    }
  }
  
  if (maxCols === 0) maxCols = 1;
  
  const isLocal = isInFunctionScope(block);
  const declaration = `${type} ${varName}[${rowCount}][${maxCols}] = {${rows.join(', ')}};`;
  
  if (isLocal) {
    return declaration + "\n";
  } else {
    generator.addVariable("var_declare_" + varName, declaration);
    return "";
  }
};

// 获取二维数组元素
Arduino.forBlock["list2d_get"] = function(block, generator) {
  const variable = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const varName = variable ? variable.name : "matrix";
  const row = generator.valueToCode(block, "ROW", Arduino.ORDER_ATOMIC) || "0";
  const col = generator.valueToCode(block, "COL", Arduino.ORDER_ATOMIC) || "0";
  return [`${varName}[${row}][${col}]`, Arduino.ORDER_ATOMIC];
};

// 设置二维数组元素
Arduino.forBlock["list2d_set"] = function(block, generator) {
  const variable = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const varName = variable ? variable.name : "matrix";
  const row = generator.valueToCode(block, "ROW", Arduino.ORDER_ATOMIC) || "0";
  const col = generator.valueToCode(block, "COL", Arduino.ORDER_ATOMIC) || "0";
  const value = generator.valueToCode(block, "VALUE", Arduino.ORDER_ASSIGNMENT) || "0";
  return `${varName}[${row}][${col}] = ${value};\n`;
};

// 获取二维数组尺寸
Arduino.forBlock["list2d_size"] = function(block, generator) {
  const variable = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const varName = variable ? variable.name : "matrix";
  const dimension = block.getFieldValue("DIMENSION");
  
  if (dimension === "rows") {
    return [`(sizeof(${varName}) / sizeof(${varName}[0]))`, Arduino.ORDER_ATOMIC];
  } else {
    return [`(sizeof(${varName}[0]) / sizeof(${varName}[0][0]))`, Arduino.ORDER_ATOMIC];
  }
};

// 数组循环移位
Arduino.forBlock["list_shift"] = function(block, generator) {
  const variable = block.workspace.getVariableById(block.getFieldValue("VAR"));
  const varName = variable ? variable.name : "myList";
  const direction = block.getFieldValue("DIRECTION");
  
  const funcName = `_listShift_${varName}_${direction}`;
  
  let funcCode;
  if (direction === "left") {
    funcCode = `
void ${funcName}() {
  int size = sizeof(${varName}) / sizeof(${varName}[0]);
  if (size > 1) {
    auto temp = ${varName}[0];
    for (int i = 0; i < size - 1; i++) {
      ${varName}[i] = ${varName}[i + 1];
    }
    ${varName}[size - 1] = temp;
  }
}`;
  } else {
    funcCode = `
void ${funcName}() {
  int size = sizeof(${varName}) / sizeof(${varName}[0]);
  if (size > 1) {
    auto temp = ${varName}[size - 1];
    for (int i = size - 1; i > 0; i--) {
      ${varName}[i] = ${varName}[i - 1];
    }
    ${varName}[0] = temp;
  }
}`;
  }
  
  generator.addFunction(funcName, funcCode);
  return `${funcName}();\n`;
};

// 从字符串创建字符数组
Arduino.forBlock["list_from_string"] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._listVarMonitorAttached) {
    block._listVarMonitorAttached = true;
    block._listVarLastName = block.getFieldValue('VAR') || 'text';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._listVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'LISTS');
          block._listVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue("VAR") || "text";
  const text = generator.valueToCode(block, "TEXT", Arduino.ORDER_ATOMIC) || '""';
  
  registerVariableToBlockly(varName, 'LISTS');
  
  const isLocal = isInFunctionScope(block);
  const declaration = `char ${varName}[] = ${text};`;
  
  if (isLocal) {
    return declaration + "\n";
  } else {
    generator.addVariable("var_declare_" + varName, declaration);
    return "";
  }
};
