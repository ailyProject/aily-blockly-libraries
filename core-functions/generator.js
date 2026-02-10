// ==================== 自定义函数库 - 代码生成器 ====================
// 块定义在 block.json，扩展和代码生成器全部在此文件

// console.log('[lib-core-functions] Loading generator.js v2');

// 防止重复加载
if (typeof window !== 'undefined' && window.__customFunctionLibLoaded__) {
  // console.log('[lib-core-functions] Already loaded, skipping');
  // 已加载过，跳过
} else {
  // console.log('[lib-core-functions] First load, initializing...');
  if (typeof window !== 'undefined') {
    window.__customFunctionLibLoaded__ = true;
  }

// i18n 动态访问函数（运行时实时读取，避免加载顺序问题）
function _getFuncI18n() {
  return (typeof window !== 'undefined' && window.__BLOCKLY_LIB_I18N__)
    ? window.__BLOCKLY_LIB_I18N__['@aily-project/lib-core-functions'] || {}
    : {};
}
function _getFuncExtI18n(extName) {
  var ext = _getFuncI18n().extensions;
  return (ext && ext[extName]) || {};
}
function _getBlocklyMsgI18n() { return _getFuncExtI18n('blockly_msg'); }
function _getCallI18n() { return _getFuncExtI18n('custom_function_call'); }
function _getCallRetI18n() { return _getFuncExtI18n('custom_function_call_return'); }
function _getParamsMutI18n() { return _getFuncExtI18n('function_params_mutator'); }

/**
 * 初始化/刷新 Blockly.Msg 国际化字符串
 * 可被多次调用——首次加载时 + FINISHED_LOADING 后 i18n 就绪时
 */
function _applyBlocklyMsgI18n() {
  var m = _getBlocklyMsgI18n();
  Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE = "function_name";
  Blockly.Msg.PROCEDURES_DEFRETURN_PROCEDURE = "function_name";
  Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE = m.PROCEDURES_DEFNORETURN_TITLE || "定义函数";
  Blockly.Msg.PROCEDURES_DEFRETURN_TITLE = m.PROCEDURES_DEFRETURN_TITLE || "定义带返回函数";
  Blockly.Msg.PROCEDURES_DEFNORETURN_DO = m.PROCEDURES_DEFNORETURN_DO || "执行";
  Blockly.Msg.PROCEDURES_DEFRETURN_RETURN = m.PROCEDURES_DEFRETURN_RETURN || "返回";
  Blockly.Msg.PROCEDURES_CALLNORETURN_HELPURL = "";
  Blockly.Msg.PROCEDURES_CALLRETURN_HELPURL = "";
  Blockly.Msg.PROCEDURES_IFRETURN_CONDITION = m.PROCEDURES_IFRETURN_CONDITION || "如果";
  Blockly.Msg.PROCEDURES_IFRETURN_VALUE = m.PROCEDURES_IFRETURN_VALUE || "返回值";
}
// 首次尝试（如果 i18n 已加载则生效，否则用 fallback，后面 FINISHED_LOADING 会再刷新）
_applyBlocklyMsgI18n();

// ==================== 常量定义 ====================

// 参数类型选项（动态获取 i18n 翻译，每次打开下拉时实时读取）
var _PARAM_TYPE_OPTIONS_FALLBACK = [
  ['int8_t (8位整型)', 'int8_t'],
  ['int16_t (16位整型)', 'int16_t'],
  ['int32_t (32位整型)', 'int32_t'],
  ['int64_t (64位整型)', 'int64_t'],
  ['uint8_t (8位无符号整型)', 'uint8_t'],
  ['uint16_t (16位无符号整型)', 'uint16_t'],
  ['uint32_t (32位无符号整型)', 'uint32_t'],
  ['uint64_t (64位无符号整型)', 'uint64_t'],
  ['---', '---'],
  ['int (整型)', 'int'],
  ['long (长整型)', 'long'],
  ['float (浮点型)', 'float'],
  ['double (双精度浮点型)', 'double'],
  ['unsigned int (无符号整型)', 'unsigned int'],
  ['unsigned long (无符号长整型)', 'unsigned long'],
  ['---', '---'],
  ['bool (布尔型)', 'bool'],
  ['char (字符型)', 'char'],
  ['byte (字节型)', 'byte'],
  ['String (字符串型)', 'String'],
  ['void* (指针)', 'void*'],
  ['size_t (大小类型)', 'size_t'],
  ['unsigned char (无符号字符型)', 'unsigned char'],
  ['---', '---'],
  ['int* (整型指针)', 'int*'],
  ['float* (浮点指针)', 'float*'],
  ['char* (字符指针)', 'char*'],
  ['byte* (字节指针)', 'byte*'],
  ['uint8_t* (无符号8位指针)', 'uint8_t*'],
  ['const char* (常量字符指针)', 'const char*'],
  ['---', '---'],
  ['int& (整型引用)', 'int&'],
  ['float& (浮点引用)', 'float&'],
  ['String& (字符串引用)', 'String&']
];
function getParamTypeOptions() {
  var i18nOpts = _getParamsMutI18n().param_type_options;
  return i18nOpts || _PARAM_TYPE_OPTIONS_FALLBACK;
}

// ==================== 辅助函数 ====================

// +/- 按钮图片
var plusImage = plusImage ||
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
  '9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMT' +
  'ggMTBoLTR2LTRjMC0xLjEwNC0uODk2LTItMi0ycy0yIC44OTYtMiAybC4wNzEgNGgtNC4wNz' +
  'FjLTEuMTA0IDAtMiAuODk2LTIgMnMuODk2IDIgMiAybDQuMDcxLS4wNzEtLjA3MSA0LjA3MW' +
  'MwIDEuMTA0Ljg5NiAyIDIgMnMyLS44OTYgMi0ydi00LjA3MWw0IC4wNzFjMS4xMDQgMCAyLS' +
  '44OTYgMi0ycy0uODk2LTItMi0yeiIgZmlsbD0id2hpdGUiIC8+PC9zdmc+Cg==';
var minusImage = minusImage ||
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAw' +
  'MC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPS' +
  'JNMTggMTFoLTEyYy0xLjEwNCAwLTIgLjg5Ni0yIDJzLjg5NiAyIDIgMmgxMmMxLjEwNCAw' +
  'IDItLjg5NiAyLTJzLS44OTYtMi0yLTJ6IiBmaWxsPSJ3aGl0ZSIgLz48L3N2Zz4K';

/**
 * 创建 + 按钮字段
 * @returns {Blockly.FieldLabel} 可点击的 + 按钮
 */
function createPlusField() {
  const field = new Blockly.FieldImage(plusImage, 15, 15, '+', function() {
    const block = this.getSourceBlock();
    if (block && typeof block.plus === 'function') {
      block.plus();
    }
  });
  return field;
}

/**
 * 创建 - 按钮字段
 * @param {number} index 参数索引（用于删除指定参数）
 * @returns {Blockly.FieldLabel} 可点击的 - 按钮
 */
function createMinusField(index) {
  const field = new Blockly.FieldImage(minusImage, 15, 15, '-', function() {
    const block = this.getSourceBlock();
    if (block && typeof block.minus === 'function') {
      block.minus(index);
    }
  });
  return field;
}

// Helper function to convert Chinese to pinyin
function convertToPinyin(text) {
  try {
    if (typeof window !== 'undefined' && window['pinyinPro']) {
      var { pinyin } = window['pinyinPro'];
      return pinyin(text, { toneType: 'none' }).replace(/\s+/g, '_');
    }
  } catch (e) {
    console.warn('PinyinPro not available, using original name');
  }
  return text;
}

// Sanitize name for C/Arduino
function sanitizeName(name) {
  let result = name;
  if (/[\u4e00-\u9fa5]/.test(name)) {
    result = convertToPinyin(name);
  }
  result = result.replace(/[^a-zA-Z0-9_]/g, '_');
  if (/^[0-9]/.test(result)) {
    result = '_' + result;
  }
  return result;
}

/**
 * 将函数参数注册为 Blockly 变量
 * @param {Blockly.Block} block 函数定义块
 * @param {string} paramName 参数名称
 */
function registerParamAsVariable(block, paramName) {
  const workspace = block.workspace;
  if (!workspace || !paramName) return;
  
  // 检查变量是否已存在
  const existingVar = workspace.getVariable(paramName);
  if (!existingVar) {
    workspace.createVariable(paramName, '');
  }
  
  // 调用全局的 addVariableToToolbox 函数（如果存在）
  if (typeof window !== 'undefined' && typeof window.addVariableToToolbox === 'function') {
    window.addVariableToToolbox(block, paramName);
  }
}

/**
 * 取消注册函数参数变量
 * @param {Blockly.Block} block 函数定义块
 * @param {string} paramName 参数名称
 */
function unregisterParamVariable(block, paramName) {
  const workspace = block.workspace;
  if (!workspace || !paramName) return;
  
  // 检查变量是否仍在被其他块使用
  const allBlocks = workspace.getAllBlocks(false);
  let isUsed = false;
  
  for (const b of allBlocks) {
    if (b.id === block.id) continue;
    
    if (b.type === 'custom_function_def' && b.params_) {
      if (b.params_.some(p => p.name === paramName)) {
        isUsed = true;
        break;
      }
    }
    
    if (b.type === 'variables_get' || b.type === 'variables_set') {
      const varField = b.getField('VAR');
      if (varField && varField.getText() === paramName) {
        isUsed = true;
        break;
      }
    }
  }
  
  if (!isUsed) {
    const variable = workspace.getVariable(paramName);
    if (variable) {
      workspace.deleteVariableById(variable.getId());
    }
  }
}

// 全局存储自定义函数定义，用于生成调用块
if (typeof window !== 'undefined') {
  window.customFunctionDefinitions = window.customFunctionDefinitions || {};
  window.customFunctionRegistry = window.customFunctionRegistry || {};
}

/**
 * 注册函数到全局 registry
 * @param {string} funcName 函数名
 * @param {Array} params 参数列表 [{type, name}, ...]
 * @param {string} returnType 返回类型
 */
function registerFunction(funcName, params, returnType) {
  if (typeof window === 'undefined' || !funcName) return;
  
  // 检查结构是否变化（决定是否需要刷新工具箱）
  const oldDef = window.customFunctionRegistry[funcName];
  const newParams = params || [];
  const newReturnType = returnType || 'void';
  const structureChanged = !oldDef ||
    (oldDef.params || []).length !== newParams.length ||
    (oldDef.returnType === 'void') !== (newReturnType === 'void');
  
  // 存储深拷贝而非引用——防止 plus()/minus() 直接修改 this.params_ 后
  // 导致 oldDef.params 与 newParams 指向同一数组使 structureChanged 失效
  const funcDef = {
    name: funcName,
    params: newParams.map(function(p) { return { type: p.type, name: p.name }; }),
    returnType: newReturnType
  };
  window.customFunctionRegistry[funcName] = funcDef;
  
  // 同步更新已在工作区中的调用块参数（标签文字等，始终执行）
  syncCallBlocksParams(funcName);
  
  // 只在函数结构变化时才刷新工具箱（参数数量变化、返回类型 void↔非void、新函数）
  if (structureChanged) {
    scheduleSyncFunctionCallsToToolbox();
  }
}

/**
 * 取消注册函数
 * @param {string} funcName 函数名
 */
function unregisterFunction(funcName) {
  if (typeof window === 'undefined' || !funcName) return;
  delete window.customFunctionRegistry[funcName];
  
  // 同步工具箱中的函数调用块
  scheduleSyncFunctionCallsToToolbox();
}

/**
 * 同步更新指定函数的所有调用块参数
 * @param {string} funcName 函数名
 */
function syncCallBlocksParams(funcName) {
  if (typeof Blockly === 'undefined') return;
  const workspace = Blockly.getMainWorkspace();
  if (!workspace) return;
  
  const funcDef = window.customFunctionRegistry[funcName];
  if (!funcDef) return;
  
  const callBlocks = workspace.getBlocksByType('custom_function_call', false)
    .concat(workspace.getBlocksByType('custom_function_call_return', false));
  
  for (const block of callBlocks) {
    // 检查块的 selectedFunction_ 或字段值
    const selectedFunc = block.selectedFunction_ || block.getFieldValue('FUNC_NAME');
    if (selectedFunc === funcName) {
      // 更新输入数量并刷新形状
      const newParamCount = funcDef.params ? funcDef.params.length : 0;
      if (block.extraCount_ !== newParamCount) {
        block.extraCount_ = newParamCount;
        block.updateShape_();
      } else {
        // 参数名/类型可能变了，重新渲染标签
        block.updateShape_();
      }
      if (block.render) {
        block.render();
      }
    }
  }
}

/**
 * 获取所有已注册函数的下拉选项
 * @returns {Array} 下拉选项数组
 */
function getFunctionDropdownOptions() {
  if (typeof window === 'undefined' || !window.customFunctionRegistry) {
    return [[_getCallI18n().no_function || '(无函数)', '__NONE__']];
  }
  const funcs = Object.keys(window.customFunctionRegistry);
  if (funcs.length === 0) {
    return [[_getCallI18n().no_function || '(无函数)', '__NONE__']];
  }
  return funcs.map(f => [f, f]);
}

/**
 * 生成唯一的函数名
 * @param {Blockly.Workspace} workspace 工作区
 * @param {string} baseName 基础名称
 * @param {string} excludeBlockId 排除的块ID（当前块自己）
 * @returns {string} 唯一的函数名
 */
function generateUniqueFunctionName(workspace, baseName, excludeBlockId) {
  if (!workspace) return baseName;
  
  // 只检查工作区中其他 custom_function_def 块的函数名
  // custom_function_call 的函数名不需要检查（调用块允许与定义块同名）
  const existingNames = new Set();
  const funcDefBlocks = workspace.getBlocksByType('custom_function_def', false);
  for (const block of funcDefBlocks) {
    if (block.id !== excludeBlockId) {
      const name = block.getFieldValue('FUNC_NAME');
      if (name) existingNames.add(name);
    }
  }
  
  // 只有在工作区中有其他同名函数定义块时才添加数字后缀
  if (!existingNames.has(baseName)) {
    return baseName;
  }
  
  // 添加数字后缀
  let counter = 1;
  let newName = baseName + counter;
  while (existingNames.has(newName)) {
    counter++;
    newName = baseName + counter;
  }
  
  return newName;
}

/**
 * 更新所有函数调用块的下拉菜单
 */
function updateAllFunctionCallBlocks() {
  if (typeof Blockly === 'undefined') return;
  const workspace = Blockly.getMainWorkspace();
  if (!workspace) return;
  
  const callBlocks = workspace.getBlocksByType('custom_function_call', false)
    .concat(workspace.getBlocksByType('custom_function_call_return', false));
  
  for (const block of callBlocks) {
    const funcField = block.getField('FUNC_NAME');
    if (funcField && typeof funcField.getOptions === 'function') {
      // 更新下拉选项
      funcField.menuGenerator_ = getFunctionDropdownOptions;
      // 如果当前选择的函数已被删除，重置为第一个可用函数
      const currentValue = funcField.getValue();
      const options = getFunctionDropdownOptions();
      const validValues = options.map(o => o[1]);
      if (!validValues.includes(currentValue) && options.length > 0) {
        funcField.setValue(options[0][1]);
      }
    }
  }
}

// ==================== 函数调用块工具箱同步 ====================

/**
 * 同步函数调用块到工具箱（参考 addVariableToToolbox 的模式）
 * 每个注册的函数在工具箱中生成预设 FUNC_NAME 的调用块
 * 
 * 采用 dirty flag 模式：registry 变化时只标记需要刷新，
 * 真正的 updateToolbox 仅在用户打开分类或项目加载完成时执行
 */
var _functionToolboxDirty = false;

function syncFunctionCallsToToolbox() {
  if (typeof Blockly === 'undefined') return;
  const workspace = Blockly.getMainWorkspace();
  if (!workspace) return;
  
  const originalToolboxDef = workspace.options.languageTree;
  if (!originalToolboxDef) return;
  
  // 找到 "自定义函数" 分类
  let funcCategory = null;
  for (let category of originalToolboxDef.contents) {
    if (category.name === '自定义函数' ||
        (category.contents && category.contents.some(item => item.type === 'custom_function_def'))) {
      funcCategory = category;
      break;
    }
  }
  if (!funcCategory || !funcCategory.contents) return;
  
  // 移除所有已有的动态 custom_function_call / custom_function_call_return 块
  funcCategory.contents = funcCategory.contents.filter(item =>
    item.type !== 'custom_function_call' && item.type !== 'custom_function_call_return'
  );
  
  // 获取所有注册的函数
  const registry = (typeof window !== 'undefined' && window.customFunctionRegistry)
    ? window.customFunctionRegistry : {};
  const funcNames = Object.keys(registry);
  
  if (funcNames.length > 0) {
    // 找到 "── 函数调用 ──" 标签的位置
    let insertIndex = funcCategory.contents.findIndex(item =>
      item.kind === 'label' && item.text && item.text.includes('函数调用')
    );
    if (insertIndex === -1) {
      // 没找到标签，在 "── 返回与参数 ──" 之前插入
      insertIndex = funcCategory.contents.findIndex(item =>
        item.kind === 'label' && item.text && item.text.includes('返回')
      );
      if (insertIndex === -1) {
        insertIndex = funcCategory.contents.length;
      }
    } else {
      insertIndex++; // 插入到标签之后
    }
    
    // 为每个函数添加调用块
    const callBlocks = [];
    for (const funcName of funcNames) {
      const funcDef = registry[funcName];
      const paramCount = funcDef.params ? funcDef.params.length : 0;
      
      // 添加 custom_function_call（语句型，始终添加）
      callBlocks.push({
        "kind": "block",
        "type": "custom_function_call",
        "fields": {
          "FUNC_NAME": funcName
        },
        "extraState": {
          "extraCount": paramCount
        }
      });
      
      // 如果是非void函数，也添加 custom_function_call_return（表达式型）
      if (funcDef.returnType && funcDef.returnType !== 'void') {
        callBlocks.push({
          "kind": "block",
          "type": "custom_function_call_return",
          "fields": {
            "FUNC_NAME": funcName
          },
          "extraState": {
            "extraCount": paramCount
          }
        });
      }
    }
    
    // 在正确位置插入
    funcCategory.contents.splice(insertIndex, 0, ...callBlocks);
  }
  
  // 在 updateToolbox 之前检查当前是否选中了函数分类
  // （因为 updateToolbox 会重建所有 toolbox items，旧引用会失效）
  var toolbox = workspace.getToolbox();
  var wasFuncCategorySelected = false;
  if (toolbox) {
    var currentItem = toolbox.getSelectedItem();
    if (currentItem && currentItem.name_ === '自定义函数') {
      wasFuncCategorySelected = true;
    }
  }
  
  // 刷新工具箱
  workspace.updateToolbox(originalToolboxDef);
  _functionToolboxDirty = false;
  
  // 如果函数分类之前被选中，用新引用重新选中以刷新 flyout
  if (wasFuncCategorySelected && toolbox) {
    var allItems = toolbox.getToolboxItems ? toolbox.getToolboxItems() : [];
    for (var i = 0; i < allItems.length; i++) {
      if (allItems[i].name_ === '自定义函数') {
        toolbox.setSelectedItem(allItems[i]);
        break;
      }
    }
  }
}

/**
 * 标记函数工具箱需要刷新，并在 50ms 防抖后执行同步
 * - dirty flag 保证切换分类时也能触发同步
 * - 50ms 防抖确保连续编辑时不会频繁刷新
 */
var _syncToolboxTimer = null;

function scheduleSyncFunctionCallsToToolbox() {
  _functionToolboxDirty = true;
  if (_syncToolboxTimer) clearTimeout(_syncToolboxTimer);
  _syncToolboxTimer = setTimeout(function() {
    syncFunctionCallsToToolbox();
    _syncToolboxTimer = null;
  }, 50);
}

/**
 * 初始化工具箱分类打开时的自动刷新监听
 * 当用户点开 "自定义函数" 分类时，如果 dirty flag 为 true 则执行同步
 */
function initToolboxSelectListener() {
  if (typeof Blockly === 'undefined') return;
  const workspace = Blockly.getMainWorkspace();
  if (!workspace || workspace.__funcToolboxSelectListener__) return;
  workspace.__funcToolboxSelectListener__ = true;
  
  workspace.addChangeListener(function(event) {
    if (event.type === Blockly.Events.TOOLBOX_ITEM_SELECT && _functionToolboxDirty) {
      // 检查选中的是否是 "自定义函数" 分类（或者任何分类切换时都刷新）
      syncFunctionCallsToToolbox();
    }
  });
}

// ==================== 函数参数 Mutator ====================

/**
 * 函数参数动态管理的 Mutator 定义
 */
var functionParamsMutator = functionParamsMutator || {
  mutationToDom: function() {
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('paramcount', this.params_.length || 0);
    const returnType = this.getFieldValue('RETURN_TYPE') || 'void';
    container.setAttribute('returntype', returnType);
    return container;
  },

  domToMutation: function(xmlElement) {
    const count = parseInt(xmlElement.getAttribute('paramcount'), 10) || 0;
    // 用默认值初始化 params_，字段值会在之后由 Blockly 恢复
    this.params_ = [];
    for (let i = 0; i < count; i++) {
      this.params_.push({ type: 'int', name: 'param' + i });
    }
    this.paramCount_ = count;
    this.updateShape_();
    const returnType = xmlElement.getAttribute('returntype') || 'void';
    this.updateReturnInput_(returnType);
  },

  saveExtraState: function() {
    // 只保存参数数量和返回类型，参数的 type/name 由 fields 自动保存
    return { 
      paramCount: this.params_.length || 0,
      returnType: this.getFieldValue('RETURN_TYPE') || 'void'
    };
  },

  loadExtraState: function(state) {
    // 兼容旧格式（params 数组）和新格式（paramCount）
    let count;
    if (state.paramCount !== undefined) {
      count = state.paramCount;
    } else if (state.params) {
      count = state.params.length;
    } else {
      count = 0;
    }
    // 用默认值初始化 params_，字段值会在之后由 Blockly 自动恢复并触发 validator 更新
    this.params_ = [];
    for (let i = 0; i < count; i++) {
      this.params_.push({ type: 'int', name: 'param' + i });
    }
    this.paramCount_ = count;
    this.updateShape_();
    if (state.returnType) {
      this.updateReturnInput_(state.returnType);
    }
  },

  updateReturnInput_: function(returnType) {
    const hasReturnInput = this.getInput('RETURN');
    
    if (returnType === 'void') {
      if (hasReturnInput) {
        this.removeInput('RETURN');
      }
    } else {
      if (!hasReturnInput) {
        this.appendValueInput('RETURN')
          .appendField(_getParamsMutI18n().return_label || '返回');
      }
    }
  },

  updateShape_: function() {
    let i = 0;
    while (this.getInput('PARAM' + i)) {
      this.removeInput('PARAM' + i);
      i++;
    }
    for (let j = 0; j < this.params_.length; j++) {
      this.addParamInput_(j, this.params_[j]);
    }
  },

  addParamInput_: function(index, param) {
    const block = this;
    const input = this.appendDummyInput('PARAM' + index);
    
    const typeDropdown = new Blockly.FieldDropdown(getParamTypeOptions, (newValue) => {
      block.params_[index].type = newValue;
      // 参数类型变化时也更新注册
      block.updateFunctionRegistry_();
    });
    typeDropdown.setValue(param.type || 'int');
    
    const nameField = new Blockly.FieldTextInput(param.name || 'param' + index, (newValue) => {
      const oldName = block.params_[index].name;
      const sanitizedName = sanitizeName(newValue || 'param' + index);
      block.params_[index].name = sanitizedName;
      
      // 重命名变量
      if (oldName !== sanitizedName && block.workspace) {
        const oldVar = block.workspace.getVariable(oldName);
        if (oldVar) {
          const existingVar = block.workspace.getVariable(sanitizedName);
          if (!existingVar) {
            block.workspace.renameVariableById(oldVar.getId(), sanitizedName);
          }
        } else {
          registerParamAsVariable(block, sanitizedName);
        }
        // 参数名称变化时也更新注册
        block.updateFunctionRegistry_();
      }
      
      return sanitizedName;
    });
    
    input.appendField('  ')
      .appendField(typeDropdown, 'PARAM_TYPE' + index)
      .appendField(nameField, 'PARAM_NAME' + index)
      .appendField(createMinusField(index), 'MINUS' + index);
    
    const stackIndex = this.inputList.findIndex(inp => inp.name === 'STACK');
    if (stackIndex > 0) {
      const paramInput = this.inputList.pop();
      this.inputList.splice(stackIndex, 0, paramInput);
    }
  },

  plus: function() {
    // console.log('[functionParamsMutator.plus] called, current params:', this.params_);
    const newParam = { type: 'int', name: 'param' + this.paramCount_ };
    this.params_.push(newParam);
    this.addParamInput_(this.params_.length - 1, newParam);
    this.paramCount_++;
    registerParamAsVariable(this, newParam.name);
    // 更新函数注册
    // console.log('[functionParamsMutator.plus] calling updateFunctionRegistry_');
    this.updateFunctionRegistry_();
  },

  minus: function(index) {
    if (this.params_.length <= 0) return;
    const deletedParam = this.params_[index];
    this.params_.splice(index, 1);
    this.paramCount_ = this.params_.length;
    this.updateShape_();
    if (deletedParam && this.workspace) {
      unregisterParamVariable(this, deletedParam.name);
    }
    // 更新函数注册
    this.updateFunctionRegistry_();
  },

  /**
   * 更新函数注册信息
   */
  updateFunctionRegistry_: function() {
    // 只有主工作区的块才注册函数，跳过工具箱预览块
    if (!this.workspace || this.workspace.isFlyout) {
      // console.log('[updateFunctionRegistry_] skipping - flyout or no workspace');
      return;
    }
    
    const funcName = this.getFieldValue('FUNC_NAME') || 'myFunction';
    const returnType = this.getFieldValue('RETURN_TYPE') || 'void';
    // console.log('[updateFunctionRegistry_] funcName:', funcName, 'params:', this.params_, 'returnType:', returnType);
    registerFunction(funcName, this.params_ || [], returnType);
  }
};

/**
 * 函数参数 Mutator 的初始化 Helper
 */
var functionParamsHelper = functionParamsHelper || function() {
  this.params_ = [];
  this.paramCount_ = 0;
  
  const block = this;
  
  // 函数名唯一性由 BLOCK_CREATE 事件处理器保证
  // （init 阶段设置的字段值会被 Blockly 序列化恢复覆盖，所以不在此处处理）
  
  const paramsInput = this.getInput('PARAMS_TITLE');
  if (paramsInput) {
    paramsInput.insertFieldAt(0, createPlusField(), 'PLUS');
  }
  
  // 监听函数名变化
  const funcNameField = this.getField('FUNC_NAME');
  if (funcNameField) {
    funcNameField.setValidator(function(newValue) {
      const oldName = block.getFieldValue('FUNC_NAME');
      const sanitizedName = sanitizeName(newValue || 'myFunction');
      
      // 如果名称变化，更新注册
      if (oldName !== sanitizedName) {
        // 先删除旧的注册
        unregisterFunction(oldName);
        // 延迟注册新函数，确保字段值已更新
        setTimeout(() => {
          block.updateFunctionRegistry_();
        }, 0);
      }
      
      return sanitizedName;
    });
  }
  
  const returnTypeField = this.getField('RETURN_TYPE');
  if (returnTypeField) {
    const originalValidator = returnTypeField.getValidator();
    returnTypeField.setValidator(function(newValue) {
      block.updateReturnInput_(newValue);
      // 更新函数注册
      setTimeout(() => {
        block.updateFunctionRegistry_();
      }, 0);
      if (originalValidator) {
        return originalValidator.call(this, newValue);
      }
      return newValue;
    });
  }
  
  // 初始注册函数
  setTimeout(() => {
    block.updateFunctionRegistry_();
  }, 100);
};

// ==================== 函数调用 Mutator ====================

var functionCallMutator = functionCallMutator || {
  extraCount: 0,
  minInputs: 1,

  mutationToDom: function() {
    if (!this.extraCount) return null;
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('extra', this.extraCount);
    return container;
  },

  domToMutation: function(xmlElement) {
    const targetCount = parseInt(xmlElement.getAttribute('extra'), 10) || 0;
    this.updateShape_(targetCount);
  },

  saveExtraState: function() {
    if (!this.extraCount) return null;
    return { extraCount: this.extraCount };
  },

  loadExtraState: function(state) {
    const targetCount = state['extraCount'] || 0;
    this.updateShape_(targetCount);
  },

  getTotalInputCount_: function() {
    return this.minInputs + this.extraCount;
  },

  getInputName_: function(index) {
    return 'INPUT' + index;
  },

  updateShape_: function(targetCount) {
    while (this.extraCount < targetCount) this.addInput_();
    while (this.extraCount > targetCount) this.removeInput_();
  },

  plus: function() {
    this.addInput_();
  },

  minus: function(index) {
    if (this.getTotalInputCount_() <= this.minInputs) return;
    this.removeInput_(index);
  },

  addInput_: function() {
    this.extraCount++;
    const inputIndex = this.getTotalInputCount_() - 1;
    const inputName = this.getInputName_(inputIndex);
    const input = this.appendValueInput(inputName);
    if (inputIndex >= this.minInputs) {
      const displayIndex = inputIndex + 1;
      input.appendField(createMinusField(displayIndex), 'MINUS' + displayIndex);
    }
  },

  removeInput_: function(displayIndex) {
    if (this.extraCount <= 0) return;
    const totalInputs = this.getTotalInputCount_();

    if (displayIndex === undefined) {
      const lastIndex = totalInputs - 1;
      this.removeInput(this.getInputName_(lastIndex));
      this.extraCount--;
      return;
    }

    const targetIndex = displayIndex - 1;
    if (targetIndex < this.minInputs || targetIndex >= totalInputs) return;

    const targetInputName = this.getInputName_(targetIndex);
    const targetInput = this.getInput(targetInputName);
    if (targetInput && targetInput.connection && targetInput.connection.isConnected()) {
      targetInput.connection.disconnect();
    }

    for (let i = targetIndex + 1; i < totalInputs; i++) {
      const currentInput = this.getInput(this.getInputName_(i));
      if (currentInput && currentInput.connection) {
        const targetConnection = currentInput.connection.targetConnection;
        if (targetConnection) {
          currentInput.connection.disconnect();
          const previousInput = this.getInput(this.getInputName_(i - 1));
          if (previousInput && previousInput.connection) {
            previousInput.connection.connect(targetConnection);
          }
        }
      }
    }

    this.removeInput(this.getInputName_(totalInputs - 1));
    this.extraCount--;
  }
};

var functionCallHelper = functionCallHelper || function() {
  if (typeof this.minInputs === 'undefined') this.minInputs = 1;
  
  let targetInput = null;
  for (let i = 0; i < this.inputList.length; i++) {
    const input = this.inputList[i];
    if (input.name && input.name.startsWith('INPUT')) {
      targetInput = input;
      break;
    }
  }
  if (targetInput) {
    targetInput.insertFieldAt(0, createPlusField(), 'PLUS');
  }
};

// ==================== 函数调用同步 Mutator ====================

/**
 * 函数调用同步 Mutator - 简化版，参考 dynamic_inputs_mutator
 * 只保存输入数量，函数名从 FUNC_NAME 字段获取
 */
var functionCallSyncMutator = functionCallSyncMutator || {
  // 注意：不在这里初始化 extraCount_ 和 selectedFunction_
  // 因为 Object.assign 会覆盖已加载的值
  // 初始化在 functionCallSyncHelper 中进行

  mutationToDom: function() {
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('inputs', this.extraCount_ || 0);
    return container;
  },

  domToMutation: function(xmlElement) {
    const targetCount = parseInt(xmlElement.getAttribute('inputs'), 10) || 0;
    this.updateShape_(targetCount);
  },

  saveExtraState: function() {
    // 只保存 extraCount_，函数名由字段自动保存
    return {
      extraCount: this.extraCount_ || 0
    };
  },

  loadExtraState: function(state) {
    const targetCount = state.extraCount || 0;
    this.updateShape_(targetCount);
  },
  
  /**
   * 获取当前 INPUT 输入数量
   */
  getCurrentInputCount_: function() {
    let count = 0;
    while (this.getInput('INPUT' + count)) {
      count++;
    }
    return count;
  },
  
  /**
   * 更新块的形状（增量式 - 只添加/删除需要的输入）
   * 参考 dynamic_inputs_mutator 的实现
   * @param {number} targetCount 目标输入数量（可选，默认使用 extraCount_）
   */
  updateShape_: function(targetCount) {
    // 如果传入了 targetCount，更新 extraCount_
    if (typeof targetCount === 'number') {
      this.extraCount_ = targetCount;
    }
    
    const currentCount = this.getCurrentInputCount_();
    
    // 移除占位符（如果有）
    if (this.getInput('PARAMS_PLACEHOLDER')) {
      this.removeInput('PARAMS_PLACEHOLDER');
    }
    
    // 增量添加输入
    while (this.getCurrentInputCount_() < this.extraCount_) {
      const inputIndex = this.getCurrentInputCount_();
      this.appendValueInput('INPUT' + inputIndex)
        .appendField(this.getInputLabel_(inputIndex));
    }
    
    // 增量删除输入（从后往前删）
    while (this.getCurrentInputCount_() > this.extraCount_) {
      const lastIndex = this.getCurrentInputCount_() - 1;
      this.removeInput('INPUT' + lastIndex);
    }
    
    // 如果没有输入，添加占位符
    if (this.extraCount_ === 0) {
      const funcName = this.selectedFunction_ || this.getFieldValue('FUNC_NAME') || '';
      if (!funcName || funcName === '__NONE__') {
        this.appendDummyInput('PARAMS_PLACEHOLDER')
          .appendField(_getCallI18n().select_function || '(请先选择函数)');
      } else {
        this.appendDummyInput('PARAMS_PLACEHOLDER')
          .appendField(_getCallI18n().no_params || '(无参数)');
      }
    }
  },
  
  /**
   * 获取输入的标签文本
   * @param {number} index 输入索引
   */
  getInputLabel_: function(index) {
    const funcName = this.selectedFunction_ || this.getFieldValue('FUNC_NAME') || '';
    const funcDef = (typeof window !== 'undefined' && window.customFunctionRegistry) 
      ? window.customFunctionRegistry[funcName] 
      : null;
    
    if (funcDef && funcDef.params && funcDef.params[index]) {
      const param = funcDef.params[index];
      return param.name + ' (' + param.type + ')';
    }
    return (_getCallI18n().param_label || '参数') + (index + 1);
  },

  /**
   * 根据函数定义更新参数（用户选择函数时调用）
   * @param {boolean} forceReset 是否强制重置（用户主动选择时为 true）
   */
  updateFromRegistry_: function(forceReset) {
    const funcDef = (typeof window !== 'undefined' && window.customFunctionRegistry) 
      ? window.customFunctionRegistry[this.selectedFunction_] 
      : null;

    // 强制重置时先清除所有输入（确保参数标签刷新，因为增量方式不会更新已有输入的标签）
    if (forceReset) {
      if (this.getInput('PARAMS_PLACEHOLDER')) {
        this.removeInput('PARAMS_PLACEHOLDER');
      }
      while (this.getCurrentInputCount_() > 0) {
        this.removeInput('INPUT' + (this.getCurrentInputCount_() - 1));
      }
    }

    // 只有在 registry 有定义，或强制重置时才更新 extraCount_
    if (funcDef && funcDef.params) {
      this.extraCount_ = funcDef.params.length;
    } else if (forceReset) {
      this.extraCount_ = 0;
    }
    // 如果 registry 没有定义且不是强制重置，保持当前 extraCount_ 不变
    
    this.updateShape_();
  }
};

/**
 * 函数调用同步 Mutator 的初始化 Helper
 */
var functionCallSyncHelper = functionCallSyncHelper || function() {
  const block = this;
  
  // 初始化属性
  if (this.selectedFunction_ === undefined) {
    this.selectedFunction_ = '';
  }
  if (this.extraCount_ === undefined) {
    this.extraCount_ = 0;
  }
  
  // 标记是否已完成初始加载
  this.hasInitialized_ = false;
  
  // 设置动态下拉选项
  const funcField = this.getField('FUNC_NAME');
  if (funcField) {
    funcField.menuGenerator_ = getFunctionDropdownOptions;
    
    // 添加选择变化监听 - 用户主动选择新函数时更新参数
    funcField.setValidator(function(newValue) {
      if (newValue === '__NONE__') {
        return newValue;
      }
      
      // 首次设置（加载恢复），只同步 selectedFunction_，不重置输入
      if (!block.hasInitialized_) {
        block.selectedFunction_ = newValue;
        block.hasInitialized_ = true;
        return newValue;
      }
      
      // 用户选择了新函数，从 registry 更新参数数量
      if (block.selectedFunction_ !== newValue) {
        block.selectedFunction_ = newValue;
        block.updateFromRegistry_(true);
      }
      return newValue;
    });
  }
};

// ==================== 注册扩展 ====================

if (Blockly.Extensions.isRegistered('function_params_mutator')) {
  Blockly.Extensions.unregister('function_params_mutator');
}
Blockly.Extensions.registerMutator(
  'function_params_mutator',
  functionParamsMutator,
  functionParamsHelper
);

if (Blockly.Extensions.isRegistered('function_call_mutator')) {
  Blockly.Extensions.unregister('function_call_mutator');
}
Blockly.Extensions.registerMutator(
  'function_call_mutator',
  functionCallMutator,
  functionCallHelper
);

// ==================== 动态定义调用块 ====================
// 使用 Blockly.Blocks 直接定义，确保扩展能正确应用

Blockly.Blocks['custom_function_call'] = {
  init: function() {
    // console.log('[custom_function_call init] creating block, id:', this.id);
    var callI18n = _getCallI18n();
    this.appendDummyInput()
      .appendField(callI18n.call_label || '调用函数')
      .appendField(new Blockly.FieldDropdown(getFunctionDropdownOptions), 'FUNC_NAME');
    this.appendDummyInput('PARAMS_PLACEHOLDER');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip(function() {
      return _getCallI18n().tooltip || '调用一个自定义函数，参数会根据函数定义自动同步';
    });
    
    // 应用 mutator 方法
    Object.assign(this, functionCallSyncMutator);
    functionCallSyncHelper.call(this);
    // console.log('[custom_function_call init] after helper, extraCount_:', this.extraCount_, 'selectedFunction_:', this.selectedFunction_);
  }
};

Blockly.Blocks['custom_function_call_return'] = {
  init: function() {
    var callRetI18n = _getCallRetI18n();
    var callI18n = _getCallI18n();
    this.appendDummyInput()
      .appendField(callRetI18n.call_label || callI18n.call_label || '调用函数')
      .appendField(new Blockly.FieldDropdown(getFunctionDropdownOptions), 'FUNC_NAME');
    this.appendDummyInput('PARAMS_PLACEHOLDER');
    this.setInputsInline(false);
    this.setOutput(true, null);
    this.setColour(290);
    this.setTooltip(function() {
      var r = _getCallRetI18n();
      return r.tooltip || '调用一个有返回值的自定义函数，参数会根据函数定义自动同步';
    });
    
    // 应用 mutator 方法
    Object.assign(this, functionCallSyncMutator);
    functionCallSyncHelper.call(this);
  }
};

// 为动态定义的调用块注册 icon
if (typeof window !== 'undefined') {
  window.__ailyBlockDefinitionsMap = window.__ailyBlockDefinitionsMap || new Map();
  window.__ailyBlockDefinitionsMap.set('custom_function_call', 'fa-light fa-function');
  window.__ailyBlockDefinitionsMap.set('custom_function_call_return', 'fa-light fa-function');
}

// 监听工作区变化，处理函数定义块的删除
if (typeof Blockly !== 'undefined') {
  const workspace = Blockly.getMainWorkspace && Blockly.getMainWorkspace();
  if (workspace) {
    // 初始化工具箱分类选择监听（dirty flag 模式）
    initToolboxSelectListener();
    
    workspace.addChangeListener(function(event) {
      // 当函数定义块被删除时
      if (event.type === Blockly.Events.BLOCK_DELETE) {
        if (event.oldJson && event.oldJson.type === 'custom_function_def') {
          const funcName = event.oldJson.fields && event.oldJson.fields.FUNC_NAME;
          if (funcName) {
            unregisterFunction(funcName);
          }
        }
      }
      
      // 块创建事件：处理从工具箱拖入的定义块和调用块
      // 使用 event.recordUndo 区分：用户操作=true，项目加载恢复=false
      if (event.type === Blockly.Events.BLOCK_CREATE && event.recordUndo) {
        setTimeout(function() {
          var block = workspace.getBlockById(event.blockId);
          if (!block) return;
          
          // 函数定义块：确保函数名唯一（在所有字段恢复完成后执行，避免被覆盖）
          if (block.type === 'custom_function_def') {
            var currentName = block.getFieldValue('FUNC_NAME') || 'myFunction';
            var uniqueName = generateUniqueFunctionName(workspace, currentName, block.id);
            if (uniqueName !== currentName) {
              block.getField('FUNC_NAME').setValue(uniqueName);
            }
            // 确保函数注册到 registry
            if (block.updateFunctionRegistry_) {
              block.updateFunctionRegistry_();
            }
          }
          
          // 函数调用块：确保参数标签从 registry 正确刷新
          // （工具箱已为每个函数生成独立条目，无需自增函数名）
          if (block.type === 'custom_function_call' || block.type === 'custom_function_call_return') {
            var funcName = block.getFieldValue('FUNC_NAME');
            if (funcName && funcName !== '__NONE__' && block.updateFromRegistry_) {
              block.selectedFunction_ = funcName;
              block.hasInitialized_ = true;
              
              // 🆕 检查是否已有子块连接（通过 ABS/JSON 加载时可能已配置）
              // 如果有子块连接，跳过强制重置以保留现有连接
              var hasConnectedInputs = false;
              var inputIndex = 0;
              while (block.getInput('INPUT' + inputIndex)) {
                var input = block.getInput('INPUT' + inputIndex);
                if (input && input.connection && input.connection.targetConnection) {
                  hasConnectedInputs = true;
                  break;
                }
                inputIndex++;
              }
              
              if (hasConnectedInputs) {
                // 已有子块连接，只更新标签不重置输入
                block.updateFromRegistry_(false);
              } else {
                // 无子块连接，可以安全地强制重置
                block.updateFromRegistry_(true);
              }
            }
          }
        }, 0);
      }
      
      // 当工作区完成加载时，重新注册所有函数并刷新调用块标签
      if (event.type === Blockly.Events.FINISHED_LOADING) {
        setTimeout(() => {
          // 重新应用 Blockly.Msg i18n（此时 i18n 数据应已加载完毕）
          _applyBlocklyMsgI18n();
          
          // 先注册所有函数定义
          const funcDefBlocks = workspace.getBlocksByType('custom_function_def', false);
          for (const block of funcDefBlocks) {
            if (block.updateFunctionRegistry_) {
              block.updateFunctionRegistry_();
            }
          }
          
          // 然后刷新所有调用块的标签（从 registry 获取参数名）
          const callBlocks = workspace.getBlocksByType('custom_function_call', false)
            .concat(workspace.getBlocksByType('custom_function_call_return', false));
          for (const block of callBlocks) {
            if (block.updateShape_) {
              block.updateShape_();
            }
          }
          
          // 同步函数调用块到工具箱
          syncFunctionCallsToToolbox();
        }, 100);
      }
    });
  }
}

// ==================== 代码生成器 ====================

// 自定义函数定义（支持返回值）
Arduino.forBlock["custom_function_def"] = function(block) {
  const originalName = block.getFieldValue('FUNC_NAME') || 'myFunction';
  const funcName = sanitizeName(originalName);
  const returnType = block.getFieldValue('RETURN_TYPE') || 'void';
  
  // 构建参数列表
  const params = block.params_ || [];
  const paramStrings = params.map(p => p.type + ' ' + sanitizeName(p.name));
  
  // 获取函数体
  const branch = Arduino.statementToCode(block, 'STACK') || '';
  
  // 获取返回值（仅当非void时）
  let returnStatement = '';
  if (returnType !== 'void') {
    const returnValue = Arduino.valueToCode(block, 'RETURN', Arduino.ORDER_NONE) || '';
    if (returnValue) {
      returnStatement = Arduino.INDENT + 'return ' + returnValue + ';\n';
    }
  }
  
  // 构建函数注释
  let comment = '';
  if (/[\u4e00-\u9fa5]/.test(originalName)) {
    comment = '// 函数: ' + originalName + '\n';
  }
  
  // 构建函数代码
  let code = comment +
    returnType + ' ' + funcName + '(' + paramStrings.join(', ') + ') {\n' +
    branch +
    returnStatement +
    '}\n';
  
  // 注册函数定义
  Arduino.definitions_['%' + funcName] = code;
  if (typeof Arduino.addFunction === 'function') {
    Arduino.addFunction(funcName, code);
  }
  
  return null;
};

// 返回语句（带值）
Arduino.forBlock["custom_function_return"] = function(block) {
  const value = Arduino.valueToCode(block, 'VALUE', Arduino.ORDER_NONE) || '0';
  return 'return ' + value + ';\n';
};

// 返回语句（无值）
Arduino.forBlock["custom_function_return_void"] = function(block) {
  return 'return;\n';
};

// 函数调用（无返回值）
Arduino.forBlock["custom_function_call"] = function(block) {
  const originalName = block.getFieldValue('FUNC_NAME') || 'myFunction';
  
  // 忽略占位符
  if (originalName === '__NONE__') {
    return '// 未选择函数\n';
  }
  
  const funcName = sanitizeName(originalName);
  
  // 收集参数
  const args = [];
  let i = 0;
  while (block.getInput('INPUT' + i)) {
    args.push(Arduino.valueToCode(block, 'INPUT' + i, Arduino.ORDER_NONE) || '0');
    i++;
  }
  
  return funcName + '(' + args.join(', ') + ');\n';
};

// 函数调用（有返回值）
Arduino.forBlock["custom_function_call_return"] = function(block) {
  const originalName = block.getFieldValue('FUNC_NAME') || 'myFunction';
  
  // 忽略占位符
  if (originalName === '__NONE__') {
    return ['0 /* 未选择函数 */', Arduino.ORDER_ATOMIC];
  }
  
  const funcName = sanitizeName(originalName);
  
  // 收集参数
  const args = [];
  let i = 0;
  while (block.getInput('INPUT' + i)) {
    args.push(Arduino.valueToCode(block, 'INPUT' + i, Arduino.ORDER_NONE) || '0');
    i++;
  }
  
  const code = funcName + '(' + args.join(', ') + ')';
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// ==================== Blockly 内置过程块 (保留兼容) ====================

Arduino.forBlock["procedures_defreturn"] = function (block) {
  const originalName = block.getFieldValue("NAME");
  let processedName = originalName;
  if (/[\u4e00-\u9fa5]/.test(originalName)) {
    processedName = convertToPinyin(originalName);
  }

  const funcName = Arduino.getProcedureName(processedName);
  let xfix1 = "";
  if (Arduino.STATEMENT_PREFIX) {
    xfix1 += Arduino.injectId(Arduino.STATEMENT_PREFIX, block);
  }
  if (Arduino.STATEMENT_SUFFIX) {
    xfix1 += Arduino.injectId(Arduino.STATEMENT_SUFFIX, block);
  }
  if (xfix1) {
    xfix1 = Arduino.prefixLines(xfix1, Arduino.INDENT);
  }
  let loopTrap = "";
  if (Arduino.INFINITE_LOOP_TRAP) {
    loopTrap = Arduino.prefixLines(
      Arduino.injectId(Arduino.INFINITE_LOOP_TRAP, block),
      Arduino.INDENT,
    );
  }
  let branch = "";
  if (block.getInput("STACK")) {
    branch = Arduino.statementToCode(block, "STACK");
  }
  let returnType = "void";
  let returnValue = "";
  if (block.getInput("RETURN")) {
    returnValue = Arduino.valueToCode(block, "RETURN", Arduino.ORDER_NONE) || "";
    if (returnValue) {
      if (returnValue.includes("\"") || returnValue.includes("'") || returnValue.includes("String(")) {
        returnType = "String";
      } else if (returnValue === "true" || returnValue === "false" ||
        returnValue.includes(" == ") || returnValue.includes(" != ") ||
        returnValue.includes(" < ") || returnValue.includes(" > ")) {
        returnType = "boolean";
      } else if (returnValue.includes(".") || /\d+\.\d+/.test(returnValue)) {
        returnType = "float";
      } else if (/^-?\d+$/.test(returnValue) || returnValue.includes("int(")) {
        returnType = "int";
      } else if (returnValue.includes("char(") || (returnValue.length === 3 &&
        returnValue.startsWith("'") && returnValue.endsWith("'"))) {
        returnType = "char";
      } else {
        returnType = "int";
      }
    }
  }
  let xfix2 = "";
  if (branch && returnValue) {
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = Arduino.INDENT + "return " + returnValue + ";\n";
  }
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    const originalVarInput = variables[i];
    const typePattern = /^(int|float|double|long|short|byte|boolean|char|String|void|\w+\*?)\s+(\w+)$/;
    const match = originalVarInput.match(typePattern);
    
    if (match) {
      args[i] = originalVarInput;
    } else {
      const varName = Arduino.getVariableName(originalVarInput);
      args[i] = "int " + varName;
    }
  }

  let functionComment = "// Custom Function: " + originalName + "\n";

  let code =
    functionComment +
    returnType + " " +
    funcName +
    "(" +
    args.join(", ") +
    ") {\n" +
    xfix1 +
    loopTrap +
    branch +
    xfix2 +
    returnValue +
    "}";
  code = Arduino.scrub_(block, code);
  Arduino.definitions_["%" + funcName] = code;
  Arduino.addFunction(funcName, code);
  return null;
};

Arduino.forBlock["procedures_defnoreturn"] = Arduino.forBlock["procedures_defreturn"];

Arduino.forBlock["procedures_callreturn"] = function (block) {
  const originalName = block.getFieldValue("NAME");
  let processedName = originalName;
  if (/[\u4e00-\u9fa5]/.test(originalName)) {
    processedName = convertToPinyin(originalName);
  }

  const funcName = Arduino.getProcedureName(processedName);
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] = Arduino.valueToCode(block, "INPUT" + i, Arduino.ORDER_NONE) || "NULL";
  }
  const code = funcName + "(" + args.join(", ") + ")";
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["procedures_callnoreturn"] = function (block) {
  const tuple = Arduino.forBlock["procedures_callreturn"](block, Arduino);
  return tuple[0] + ";\n";
};

Arduino.forBlock["procedures_ifreturn"] = function (block) {
  const condition = Arduino.valueToCode(block, "CONDITION", Arduino.ORDER_NONE) || "false";
  let code = "if (" + condition + ") {\n";
  if (Arduino.STATEMENT_SUFFIX) {
    code += Arduino.prefixLines(
      Arduino.injectId(Arduino.STATEMENT_SUFFIX, block),
      Arduino.INDENT,
    );
  }
  if (block.hasReturnValue_) {
    const value = Arduino.valueToCode(block, "VALUE", Arduino.ORDER_NONE) || "null";
    code += Arduino.INDENT + "return " + value + ";\n";
  } else {
    code += Arduino.INDENT + "return;\n";
  }
  code += "}\n";
  return code;
};

// ==================== FINISHED_LOADING 事件监听器 ====================
// 在工作区加载完成后注册函数参数为变量
if (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace) {
  // 延迟添加监听器，确保工作区已创建
  setTimeout(function() {
    const workspace = Blockly.getMainWorkspace();
    if (workspace && !workspace.__customFunctionParamsListener__) {
      workspace.__customFunctionParamsListener__ = true;
      workspace.addChangeListener(function(event) {
        if (event.type === Blockly.Events.FINISHED_LOADING) {
          // 遍历所有函数定义块，注册其参数为变量
          const funcDefBlocks = workspace.getBlocksByType('custom_function_def', false);
          const paramsToRegister = [];
          
          for (const block of funcDefBlocks) {
            if (block.params_ && block.params_.length > 0) {
              for (const param of block.params_) {
                if (param.name && !workspace.getVariable(param.name)) {
                  workspace.createVariable(param.name, '');
                  paramsToRegister.push({ block: block, name: param.name });
                }
              }
              // 更新函数注册
              if (typeof block.updateFunctionRegistry_ === 'function') {
                block.updateFunctionRegistry_();
              }
            }
          }
          
          // 延迟刷新工具箱，确保变量完全创建
          if (paramsToRegister.length > 0) {
            requestAnimationFrame(function() {
              // 使用最后一个块触发工具箱刷新
              const lastParam = paramsToRegister[paramsToRegister.length - 1];
              if (typeof window !== 'undefined' && typeof window.addVariableToToolbox === 'function') {
                window.addVariableToToolbox(lastParam.block, lastParam.name);
              }
            });
          }
        }
      });
    }
  }, 100);
}

} // 结束防止重复加载的 if-else 块
