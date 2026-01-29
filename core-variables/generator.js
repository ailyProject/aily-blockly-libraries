Blockly.getMainWorkspace().registerButtonCallback(
  "CREATE_VARIABLE",
  (button) => {
    const workspace = button.getTargetWorkspace();
    Blockly.Variables.createVariableButtonHandler(
      workspace,
      (varName) => {
        Blockly.Msg.VARIABLES_CURRENT_NAME = varName;
        // 获取变量分类
        const toolbox = workspace.getToolbox();
        const allCategories = toolbox.getToolboxItems();
        const variableCategory = allCategories.find(item =>
          item.name_ === "Variables" || (item.getContents && item.getContents()[0]?.callbackKey === "CREATE_VARIABLE")
        );

        // 获取原始工具箱定义
        const originalToolboxDef = workspace.options.languageTree;

        // 找到变量类别并更新其内容
        for (let category of originalToolboxDef.contents) {
          if ((category.name === "Variables" ||
            (category.contents && category.contents[0]?.callbackKey === "CREATE_VARIABLE"))) {
            // 更新该类别的内容
            if (category.contents.length === 1) {
              category.contents = [
                {
                  "kind": "button",
                  "text": "新建变量",
                  "callbackKey": "CREATE_VARIABLE"
                },
                {
                  "kind": "block",
                  "type": "variable_define"
                },
                {
                  "kind": "block",
                  "type": "variable_define_scoped"
                },
                {
                  "kind": "block",
                  "type": "variable_define_advanced"
                },
                {
                  "kind": "block",
                  "type": "variable_define_advanced_scoped"
                },
                {
                  "kind": "block",
                  "type": "variables_set"
                },
                {
                  "kind": "block",
                  "type": "type_cast"
                }
              ];
            }

            // 获取当前时间戳
            const varId = workspace.getVariable(varName).getId();
            category.contents.push({
              "kind": "block",
              "type": "variables_get",
              "fields": {
                "VAR": {
                  "id": varId,
                  "name": varName,
                  "type": "string"
                }
              }
            })

            refreshToolbox(workspace);
            break;
          }
        }

        // 触发所有监听器
        // variableCreationListeners.forEach(listener => listener(varName));
      },
      null
    );
  },
);

Blockly.getMainWorkspace().addChangeListener((event) => {
  // 当工作区完成加载时调用
  if (event.type === Blockly.Events.FINISHED_LOADING) {
    loadExistingVariablesToToolbox(Blockly.getMainWorkspace());
  }
  if (event.type === Blockly.Events.VAR_DELETE) {
    // console.log("删除的变量ID: ", event.varId);
    // 获取当前工作区
    const workspace = Blockly.getMainWorkspace();

    // 从工具箱中删除变量
    // 获取原始工具箱定义
    const originalToolboxDef = workspace.options.languageTree;

    // 找到变量类别并更新其内容
    for (let category of originalToolboxDef.contents) {
      if ((category.name === "Variables" ||
        (category.contents && category.contents[0]?.callbackKey === "CREATE_VARIABLE"))) {

        // 首先过滤删除的变量
        category.contents = category.contents.filter(item => {
          // Check if this is a variables_get block with the deleted variable's ID
          if (item.type === "variables_get" &&
            item.fields &&
            item.fields.VAR &&
            item.fields.VAR.id === event.varId) {
            return false; // Remove this item
          }
          return true; // Keep all other items
        });
        
        // 检查删除后是否还有变量
        const allVariables = workspace.getAllVariables();
        
        // 如果没有变量了，重置为只有"新建变量"按钮
        if (allVariables.length === 0) {
          category.contents = [
            {
              "kind": "button",
              "text": "新建变量",
              "callbackKey": "CREATE_VARIABLE"
            },
            {
              "kind": "block",
              "type": "variable_define"
            },
            {
              "kind": "block",
              "type": "variable_define_scoped"
            },
            {
              "kind": "block",
              "type": "variable_define_advanced"
            },
            {
              "kind": "block",
              "type": "variable_define_advanced_scoped"
            },
            {
              "kind": "block",
              "type": "variables_set"
            },
            {
              "kind": "block",
              "type": "type_cast"
            }
          ];
        } else {
          // 更新最后使用的变量名
          Blockly.Msg.VARIABLES_CURRENT_NAME = allVariables.at(-1)?.name;
        }

        refreshToolbox(workspace);
        break;
      }
    }
  }

  // 监听块删除事件 - 当 variable_define 相关块被删除时，清理未使用的变量
  if (event.type === Blockly.Events.BLOCK_DELETE) {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) return;

    // 检查删除的块是否是变量定义块
    const defineBlockTypes = [
      'variable_define',
      'variable_define_scoped',
      'variable_define_advanced',
      'variable_define_advanced_scoped'
    ];

    // 递归从 oldJson 中提取所有被删除的变量定义块的变量名
    function extractDeletedVarNames(blockJson, varNames = []) {
      if (!blockJson) return varNames;
      
      // 检查当前块是否是变量定义块
      if (defineBlockTypes.includes(blockJson.type) && blockJson.fields?.VAR) {
        varNames.push(blockJson.fields.VAR);
      }
      
      // 递归检查所有输入中的子块
      if (blockJson.inputs) {
        for (const inputName in blockJson.inputs) {
          const input = blockJson.inputs[inputName];
          if (input && input.block) {
            extractDeletedVarNames(input.block, varNames);
          }
        }
      }
      
      // 递归检查 next 连接的块
      if (blockJson.next && blockJson.next.block) {
        extractDeletedVarNames(blockJson.next.block, varNames);
      }
      
      return varNames;
    }

    // 获取所有被删除的变量名
    const deletedVarNames = extractDeletedVarNames(event.oldJson);
    if (deletedVarNames.length === 0) return;

    // 获取工作区中所有剩余的块
    const allBlocks = workspace.getAllBlocks(false);

    // 对每个被删除的变量名进行检查
    for (const deletedVarName of deletedVarNames) {
      let isVariableUsed = false;

      for (const block of allBlocks) {
        // 检查其他变量定义块
        if (defineBlockTypes.includes(block.type)) {
          const varField = block.getField('VAR');
          if (varField && varField.getText() === deletedVarName) {
            isVariableUsed = true;
            break;
          }
        }

        // 检查变量获取块
        if (block.type === 'variables_get' || block.type === 'variables_get_dynamic') {
          const varField = block.getField('VAR');
          if (varField && varField.getText() === deletedVarName) {
            isVariableUsed = true;
            break;
          }
        }

        // 检查变量设置块
        if (block.type === 'variables_set' || block.type === 'variables_set_dynamic') {
          const varField = block.getField('VAR');
          if (varField && varField.getText() === deletedVarName) {
            isVariableUsed = true;
            break;
          }
        }
      }

      // 如果变量未被使用，则删除它
      if (!isVariableUsed) {
        // 查找并删除变量（检查所有类型的变量）
        const variable = workspace.getAllVariables().find(v => v.name === deletedVarName);
        if (variable) {
          // 删除变量会触发 VAR_DELETE 事件，自动更新工具箱
          workspace.deleteVariableById(variable.getId());
          // console.log("变量已删除:", deletedVarName);
        }
      }
    }
  }
})

// const blockVariableMap = new Map();

// 将原有的函数定义修改为 Blockly 的全局方法
addVariableToToolbox = function (block, varName) {
  try {
    // 获取块的唯一ID
    // const blockId = block.id;

    // 保存块和变量的关系
    // if (!blockVariableMap.has(blockId)) {
    //   blockVariableMap.set(blockId, []);
    // }

    // 添加变量到这个块的列表中
    // const varList = blockVariableMap.get(blockId);
    // if (!varList.includes(varName)) {
    //   varList.push(varName);
    // }

    const workspace = block.workspace;
    if (!workspace || !varName) return;
    // 获取工具箱
    const toolbox = workspace.getToolbox();
    if (!toolbox) return;

    const allCategories = toolbox.getToolboxItems();
    const variableCategory = allCategories.find(item =>
      item.name_ === "Variables" || (item.getContents && item.getContents()[0]?.callbackKey === "CREATE_VARIABLE")
    );

    // 确保变量存在，如果不存在则创建
    // 使用 getAllVariables 查找任意类型的变量（getVariable 需要类型匹配）
    let variable = workspace.getAllVariables().find(v => v.name === varName);
    if (!variable) {
      // 如果变量不存在，先创建它
      workspace.createVariable(varName, "");
      variable = workspace.getVariable(varName, "");
    }
    
    // 如果仍然获取不到变量，则退出
    if (!variable) {
      console.log("无法创建或获取变量:", varName);
      return;
    }

    // 获取原始工具箱定义
    const originalToolboxDef = workspace.options.languageTree;
    if (!originalToolboxDef) return;

    // 找到变量类别并更新其内容
    let variableCategoryFound = false;
    for (let category of originalToolboxDef.contents) {
      if ((category.name === "Variables" ||
        (category.contents && category.contents[0]?.callbackKey === "CREATE_VARIABLE"))) {
        variableCategoryFound = true;
        if (category.contents.length === 1) {
          category.contents = [
            {
              "kind": "button",
              "text": "新建变量",
              "callbackKey": "CREATE_VARIABLE"
            },
            {
              "kind": "block",
              "type": "variable_define"
            },
            {
              "kind": "block",
              "type": "variable_define_scoped"
            },
            {
              "kind": "block",
              "type": "variable_define_advanced"
            },
            {
              "kind": "block",
              "type": "variable_define_advanced_scoped"
            },
            {
              "kind": "block",
              "type": "variables_set"
            },
            {
              "kind": "block",
              "type": "type_cast"
            }
          ];
        }

        // 同步工具箱：确保工作区中的所有变量都有对应的 get 块
        const allVariables = workspace.getAllVariables();
        let needRefresh = false;
        
        for (const v of allVariables) {
          // 检查这个变量是否已经在工具箱中（通过 ID 检查，因为名称可能会变）
          const varExistsInToolbox = category.contents.some(item =>
            item.type === 'variables_get' &&
            item.fields && item.fields.VAR && 
            item.fields.VAR.id === v.getId()
          );
          
          if (!varExistsInToolbox) {
            category.contents.push({
              "kind": "block",
              "type": "variables_get",
              "fields": {
                "VAR": {
                  "id": v.getId(),
                  "name": v.name,
                  "type": v.type || "int"
                }
              }
            });
            needRefresh = true;
          } else {
            // 更新工具箱中已有块的名称（变量可能被重命名了）
            category.contents.forEach(item => {
              if (item.type === 'variables_get' &&
                  item.fields && item.fields.VAR && 
                  item.fields.VAR.id === v.getId() &&
                  item.fields.VAR.name !== v.name) {
                item.fields.VAR.name = v.name;
                needRefresh = true;
              }
            });
          }
        }
        
        if (needRefresh) {
          Blockly.Msg.VARIABLES_CURRENT_NAME = varName;
          refreshToolbox(workspace, openVariableItem = false);
          // console.log("变量已同步到工具箱");
        }
        break;
      }
    }
    
    // 如果没有找到变量分类，尝试创建一个基本的变量分类
    if (!variableCategoryFound) {
      console.log("变量分类未找到，可能需要手动初始化工具箱");
    }
  } catch (e) {
    console.log("添加循环变量到工具箱时出错:", e);
  }
};

// 添加这个函数来加载已有的变量到工具箱中
function loadExistingVariablesToToolbox(workspace) {
  if (!workspace) return;

  // 获取所有现有变量
  let allVariables = workspace.getAllVariables();
  // const allVariables = workspace.getVariableMap().getAllVariables;
  if (allVariables.length === 0) {
    // return;
    // registerVariableToBlockly('i', 'int');
    // addVariableToToolbox(workspace, 'i');

    // allVariables = workspace.getAllVariables();
  }

  // 获取原始工具箱定义
  const originalToolboxDef = workspace.options.languageTree;
  if (!originalToolboxDef) return;

  // 找到变量类别
  for (let category of originalToolboxDef.contents) {
    if ((category.name === "Variables" ||
      (category.contents && category.contents[0]?.callbackKey === "CREATE_VARIABLE"))) {

      // 确保类别内容包含基本的变量块
      if (category.contents.length === 1) {
        category.contents = [
          {
            "kind": "button",
            "text": "新建变量",
            "callbackKey": "CREATE_VARIABLE"
          },
          {
            "kind": "block",
            "type": "variable_define"
          },
          {
            "kind": "block",
            "type": "variable_define_scoped"
          },
          {
            "kind": "block",
            "type": "variable_define_advanced"
          },
          {
            "kind": "block",
            "type": "variable_define_advanced_scoped"
          },
          {
            "kind": "block",
            "type": "variables_set"
          },
          {
            "kind": "block",
            "type": "type_cast"
          }
        ];
      }

      // 为每个变量添加一个获取块
      allVariables.forEach(variable => {
        // 检查变量是否已存在于工具箱中
        const varExists = category.contents.some(item =>
          item.fields && item.fields.VAR && item.fields.VAR.id === variable.getId()
        );

        if (!varExists) {
          category.contents.push({
            "kind": "block",
            "type": "variables_get",
            "fields": {
              "VAR": {
                "id": variable.getId(),
                "name": variable.name,
                "type": variable.type || "string"
              }
            }
          });
        }
      });

      // 更新最后使用的变量名
      if (allVariables.length > 0) {
        Blockly.Msg.VARIABLES_CURRENT_NAME = allVariables[allVariables.length - 1].name;
      }

      // 刷新工具箱
      refreshToolbox(workspace, false);
      break;
    }
  }
}

// 更新toolbox
function refreshToolbox(oldWorkspace, openVariableItem = true) {
  const originalToolboxDef = oldWorkspace.options.languageTree;
  oldWorkspace.updateToolbox(originalToolboxDef);

  const workspace = Blockly.getMainWorkspace();
  const toolbox = workspace.getToolbox();
  const allCategories = toolbox.getToolboxItems();
  const variableCategory = allCategories.find(item =>
    item.name_ === "Variables" || (item.getContents && item.getContents()[0]?.callbackKey === "CREATE_VARIABLE")
  );
  if (toolbox.isVisible_ && openVariableItem) {
    toolbox.setSelectedItem(variableCategory);
  }

  // console.log("工具箱已更新");
}

function registerVariableToBlockly(varName, varType) {
  // 获取当前工作区
  const workspace = Blockly.getMainWorkspace();
  if (workspace && workspace.createVariable && varName) {
    // 检查是否已存在同名变量（不考虑类型）
    const existingVar = workspace.getVariable(varName);
    if (existingVar) {
      return; // 已存在，无需创建
    }
    
    // 创建新变量（如果varType为undefined，Blockly会创建无类型变量）
    if (varType !== undefined) {
      workspace.createVariable(varName, varType);
    } else {
      workspace.createVariable(varName, '');
    }
    // console.log('Variable registered to Blockly:', varName, varType);
  }
}

function renameVariableInBlockly(block, oldName, newName, varType) {
  const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
  if (workspace) {
    const oldVar = workspace.getVariable(oldName, varType);
    const existVar = workspace.getVariable(newName, varType);
    
    if (oldVar && !existVar) {
      // 旧变量存在且新变量不存在，执行重命名
      workspace.renameVariableById(oldVar.getId(), newName);
      if (typeof refreshToolbox === 'function') refreshToolbox(workspace, false);
    } else if (!oldVar && !existVar) {
      // 旧变量不存在（可能是复制块的情况），新变量也不存在，创建新变量
      registerVariableToBlockly(newName, varType);
      addVariableToToolbox(block, newName);
    }
    // 如果 existVar 已存在，说明新变量已经存在，不需要做任何事
  }
}

// 重命名变量
function renameVariable(block, oldName, newName, vtype) {
  try {
    // console.log("rename variable: ", oldName, newName);
    const workspace = block.workspace;
    if (!workspace || !oldName || !newName) return;

    Blockly.Msg.VARIABLES_CURRENT_NAME = newName;
    newNameExisting = Blockly.Variables.nameUsedWithAnyType(newName, workspace);
    if (newNameExisting) {
      // console.log(`变量 ${newName} 已存在，无法重命名`);
      return;
    }

    // 获取工具箱
    const toolbox = workspace.getToolbox();
    if (!toolbox) return;

    const allCategories = toolbox.getToolboxItems();
    const variableCategory = allCategories.find(item =>
      item.name_ === "Variables" || (item.getContents && item.getContents()[0]?.callbackKey === "CREATE_VARIABLE")
    );

    // 获取原始工具箱定义
    const originalToolboxDef = workspace.options.languageTree;
    if (!originalToolboxDef) return;

    // 检查旧变量是否仍被其他块引用
    const blocks = workspace.getAllBlocks(false);
    let isOldVarStillReferenced = false;

    // 排除当前正在编辑的块，检查其他块是否引用了旧变量
    for (const otherBlock of blocks) {
      if (otherBlock.id !== block.id) {
        // 检查变量获取块
        if (otherBlock.type === 'variables_get' || otherBlock.type === 'variables_get_dynamic') {
          const varField = otherBlock.getField('VAR');
          if (varField && varField.getText() === oldName) {
            isOldVarStillReferenced = true;
            break;
          }
        }
        // 检查变量设置块
        if (otherBlock.type === 'variables_set' || otherBlock.type === 'variables_set_dynamic') {
          const varField = otherBlock.getField('VAR');
          if (varField && varField.getText() === oldName) {
            isOldVarStillReferenced = true;
            break;
          }
        }

        // 检查变量定义块
        if (otherBlock.type === 'variable_define' || otherBlock.type === 'variable_define_scoped' || 
          otherBlock.type === 'variable_define_advanced' || otherBlock.type === 'variable_define_advanced_scoped') {
          const varField = otherBlock.getField('VAR');
          if (varField && varField.getText() === oldName) {
            isOldVarStillReferenced = true;
            break;
          }
        }
      }
    }

    // 找到变量类别并更新其内容
    for (let category of originalToolboxDef.contents) {
      // console.log("category: ", category);
      if ((category.name === "Variables" ||
        (category.contents && category.contents[0]?.callbackKey === "CREATE_VARIABLE"))) {

        // console.log("isOldVarStillReferenced: ", isOldVarStillReferenced);
        if (isOldVarStillReferenced) {
          workspace.createVariable(newName, vtype)
          const timestamp = new Date().getTime();
          category.contents.push({
            "kind": "block",
            "type": "variables_get",
            "fields": {
              "VAR": {
                "id": "varName" + timestamp,
                "name": newName,
                "type": "string"
              }
            }
          });
        } else {
          // 如果旧变量未被引用，直接替换名称
          // 获取旧variable的ID
          const oldVariable = workspace.getVariable(oldName, vtype);
          if (oldVariable) {
            const oldVariableId = oldVariable.getId();
            // console.log("oldVariableId: ", oldVariableId);
            workspace.renameVariableById(oldVariableId, newName);
            category.contents.forEach(item => {
              if (item.fields && item.fields.VAR && item.fields.VAR.name === oldName) {
                item.fields.VAR.name = newName;
              }
            });
          }
        }

        // refreshToolbox(workspace);
        break;
      }
    }
  } catch (e) {
    // console.log("重命名变量时出错:", e);
  }
}

// 全局变量存储所有入口块类型 - 使用 window 对象避免重复声明
if (typeof window !== 'undefined') {
  if (!window.ENTRY_BLOCK_TYPES) {
    window.ENTRY_BLOCK_TYPES = ['arduino_setup', 'arduino_loop'];
  }
} else {
  // Node.js 环境下的处理
  if (typeof global !== 'undefined' && !global.ENTRY_BLOCK_TYPES) {
    global.ENTRY_BLOCK_TYPES = ['arduino_setup', 'arduino_loop'];
  }
}

/**
 * 注册Hat块类型到入口块列表
 * @param {string|string[]} blockTypes - 要注册的块类型，可以是单个字符串或字符串数组
 */
function registerHatBlock(blockTypes) {
  const entryTypes = (typeof window !== 'undefined') ? window.ENTRY_BLOCK_TYPES : 
                     (typeof global !== 'undefined') ? global.ENTRY_BLOCK_TYPES : null;
  
  if (!entryTypes) {
    console.warn('registerHatBlock: ENTRY_BLOCK_TYPES 未初始化');
    return;
  }

  if (typeof blockTypes === 'string') {
    blockTypes = [blockTypes];
  }

  if (Array.isArray(blockTypes)) {
    blockTypes.forEach(blockType => {
      if (typeof blockType === 'string' && !entryTypes.includes(blockType)) {
        entryTypes.push(blockType);
        // console.log(`Hat块类型已注册: ${blockType}`);
      }
    });
  } else {
    console.warn('registerHatBlock: 参数必须是字符串或字符串数组');
  }
}

/**
 * 获取当前所有已注册的入口块类型
 * @returns {string[]} 入口块类型数组
 */
function getRegisteredHatBlocks() {
  const entryTypes = (typeof window !== 'undefined') ? window.ENTRY_BLOCK_TYPES : 
                     (typeof global !== 'undefined') ? global.ENTRY_BLOCK_TYPES : 
                     ['arduino_setup', 'arduino_loop'];
  return [...entryTypes];
}

/**
 * 移除已注册的Hat块类型
 * @param {string|string[]} blockTypes - 要移除的块类型
 */
function unregisterHatBlock(blockTypes) {
  const entryTypes = (typeof window !== 'undefined') ? window.ENTRY_BLOCK_TYPES : 
                     (typeof global !== 'undefined') ? global.ENTRY_BLOCK_TYPES : null;
  
  if (!entryTypes) {
    console.warn('unregisterHatBlock: ENTRY_BLOCK_TYPES 未初始化');
    return;
  }

  if (typeof blockTypes === 'string') {
    blockTypes = [blockTypes];
  }

  if (Array.isArray(blockTypes)) {
    blockTypes.forEach(blockType => {
      const index = entryTypes.indexOf(blockType);
      if (index > -1) {
        entryTypes.splice(index, 1);
        // console.log(`Hat块类型已移除: ${blockType}`);
      }
    });
  }
}

// 将注册函数暴露到全局，供其他库调用
if (typeof window !== 'undefined') {
  window.registerHatBlock = registerHatBlock;
  window.getRegisteredHatBlocks = getRegisteredHatBlocks;
  window.unregisterHatBlock = unregisterHatBlock;
}

// 自动注册常见的Hat块类型
registerHatBlock([
  'pubsub_set_callback',
  'blinker_button',
  'blinker_slider',
  'blinker_colorpicker',
  'blinker_joystick',
  'blinker_chart',
  'blinker_heartbeat',
  'blinker_data_handler'
]);

/**
 * 检查块是否连接到代码流程中
 * @param {Blockly.Block} block - 要检查的块
 * @param {string|string[]|null} targetBlockType - 可选，指定目标块类型或类型数组
 *   - 如果不传或为null，则检查是否连接到任意入口块（ENTRY_BLOCK_TYPES）
 *   - 如果传入字符串，则检查是否连接到该类型的块
 *   - 如果传入数组，则检查是否连接到数组中任一类型的块
 * @returns {boolean} 是否连接
 */
function isBlockConnected(block, targetBlockType = null) {
  if (!block) return false;

  // 获取入口块类型列表
  const entryTypes = (typeof window !== 'undefined') ? window.ENTRY_BLOCK_TYPES : 
                     (typeof global !== 'undefined') ? global.ENTRY_BLOCK_TYPES : 
                     ['arduino_setup', 'arduino_loop'];

  // 确定要查找的目标类型
  let targetTypes;
  if (targetBlockType === null || targetBlockType === undefined) {
    // 未指定目标类型时，检查是否连接到任意入口块
    targetTypes = entryTypes;
  } else {
    // 将目标类型统一为数组
    targetTypes = Array.isArray(targetBlockType) ? targetBlockType : [targetBlockType];
  }

  // 向上遍历查找目标块
  const visited = new Set();
  let currentBlock = block;

  while (currentBlock) {
    if (visited.has(currentBlock.id)) break;
    visited.add(currentBlock.id);

    // 检查当前块是否为目标类型
    if (targetTypes.includes(currentBlock.type)) {
      return true;
    }

    // 向上遍历：依次检查包围父块、前置连接、输出连接
    let nextBlock = null;

    // 1. 检查包围的父块（块嵌套在语句输入中）
    const surroundParent = currentBlock.getSurroundParent();
    if (surroundParent) {
      nextBlock = surroundParent;
    }
    // 2. 检查前置连接（语句块的上方块）
    else if (currentBlock.previousConnection && currentBlock.previousConnection.isConnected()) {
      nextBlock = currentBlock.previousConnection.targetBlock();
    }
    // 3. 检查输出连接（表达式块所连接的块）
    else if (currentBlock.outputConnection && currentBlock.outputConnection.isConnected()) {
      nextBlock = currentBlock.outputConnection.targetBlock();
    }

    currentBlock = nextBlock;
  }

  return false;
}


// 添加一个防抖函数
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// 防抖函数保留，但不再用于variable_define的重命名

Arduino.forBlock["variable_define"] = function (block, generator) {
  // 1. 设置变量重命名监听（按照库规范实现）
  // 使用块 ID 来标记，避免复制块时标志被复制的问题
  const monitorKey = '_varMonitor_' + block.id;
  if (!block[monitorKey]) {
    block[monitorKey] = true;
    block._varLastName = block.getFieldValue('VAR') || 'variable';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._varLastName;
        if (workspace && newName && newName !== oldName) {
          // 重命名时也不强制设置类型，保持与原变量一致
          // const currentType = block.getFieldValue("TYPE") || 'int';
          // console.log("Renaming variable from", oldName, "to", newName, "with type", currentType);
          // renameVariableInBlockly(block, oldName, newName, currentType);
          renameVariableInBlockly(block, oldName, newName, undefined);
          block._varLastName = newName;
        }
        return newName;
      });
    }
  }

  const gorp = block.getFieldValue("GORP");
  let type = block.getFieldValue("TYPE");
  const name = block.getFieldValue("VAR");
  let value = Arduino.valueToCode(block, "VALUE", Arduino.ORDER_ATOMIC);

  // 2. 自动注册变量到Blockly系统
  if (name) {
    // 不强制设置类型，让Blockly使用默认的无类型变量
    registerVariableToBlockly(name, undefined);
    // 将变量添加到工具箱，这会自动触发展开效果
    addVariableToToolbox(block, name);
  }

  let defaultValue = "";

  // 首先统一处理类型转换
  if (type === "string") {
    type = "String"; // Arduino 使用 String 类型
  }

  if (!value) {
    switch (type) {
      case "String":
        // Arduino中字符串使用String或char数组
        defaultValue = `""`;
        break;
      case "char":
        defaultValue = `''`;
        break;
      default:
        defaultValue = 0;
    }
  } else {
    // 如果有值，使用默认值
    defaultValue = value;
  }

  type = type.replace(/volatile\s/, "");
  if (isBlockConnected(block)) {
    return `${type} ${name} = ${defaultValue};\n`;
  } else {
    if (value) {
      Arduino.addVariable(`${type}_${name}`, `${type} ${name} = ${value};`);
    } else {
      Arduino.addVariable(`${type}_${name}`, `${type} ${name};`);
    }
    return "";
  }
};

Arduino.forBlock["variable_define_scoped"] = function (block, generator) {
  // 1. 设置变量重命名监听（按照库规范实现）
  // 使用块 ID 来标记，避免复制块时标志被复制的问题
  const monitorKey = '_varMonitor_' + block.id;
  if (!block[monitorKey]) {
    block[monitorKey] = true;
    block._varLastName = block.getFieldValue('VAR') || 'variable';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._varLastName;
        if (workspace && newName && newName !== oldName) {
          // 重命名时也不强制设置类型，保持与原变量一致
          // const currentType = block.getFieldValue("TYPE") || 'int';
          // renameVariableInBlockly(block, oldName, newName, currentType);
          renameVariableInBlockly(block, oldName, newName, undefined);
          block._varLastName = newName;
        }
        return newName;
      });
    }
  }

  const gorp = block.getFieldValue("GORP");
  let type = block.getFieldValue("TYPE");
  const name = block.getFieldValue("VAR");
  let value = Arduino.valueToCode(block, "VALUE", Arduino.ORDER_ATOMIC);
  const scope = block.getFieldValue("SCOPE"); // local or global

  // 2. 自动注册变量到Blockly系统
  if (name) {
    // 不强制设置类型，让Blockly使用默认的无类型变量
    registerVariableToBlockly(name, undefined);
    // 将变量添加到工具箱，这会自动触发展开效果
    addVariableToToolbox(block, name);
  }

  let defaultValue = "";

  // 首先统一处理类型转换
  if (type === "string") {
    type = "String"; // Arduino 使用 String 类型
  }

  if (!value) {
    switch (type) {
      case "String":
        // Arduino中字符串使用String或char数组
        defaultValue = `""`;
        break;
      case "char":
        defaultValue = `''`;
        break;
      default:
        defaultValue = 0;
    }
  } else {
    // 如果有值，使用默认值
    defaultValue = value;
  }

  type = type.replace(/volatile\s/, "");
  if (scope === "local") {
    return `${type} ${name} = ${defaultValue};\n`;
  } else {
    if (value) {
      Arduino.addVariable(`${type}_${name}`, `${type} ${name} = ${value};`);
    } else {
      Arduino.addVariable(`${type}_${name}`, `${type} ${name};`);
    }
    return "";
  }
};

Arduino.forBlock["variable_define_advanced"] = function (block, generator) {
  // 1. 设置变量重命名监听
  // 使用块 ID 来标记，避免复制块时标志被复制的问题
  const monitorKey = '_varMonitor_' + block.id;
  if (!block[monitorKey]) {
    block[monitorKey] = true;
    block._varLastName = block.getFieldValue('VAR') || 'variable';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._varLastName;
        if (workspace && newName && newName !== oldName) {
          // const currentStorage = block.getFieldValue("STORAGE") || '';
          // const currentQualifier = block.getFieldValue("QUALIFIER") || '';
          // const currentType = block.getFieldValue("TYPE") || 'int';
          // let fullType = "";
          // if (currentStorage) fullType += currentStorage + " ";
          // if (currentQualifier) fullType += currentQualifier + " ";
          // fullType += currentType;
          // renameVariableInBlockly(block, oldName, newName, fullType || '');
          renameVariableInBlockly(block, oldName, newName, undefined);
          block._varLastName = newName;
        }
        return newName;
      });
    }
  }

  const storage = block.getFieldValue("STORAGE");  // static, extern, ""
  const qualifier = block.getFieldValue("QUALIFIER");  // const, volatile, const volatile, ""
  let type = block.getFieldValue("TYPE");
  const name = block.getFieldValue("VAR");
  let value = Arduino.valueToCode(block, "VALUE", Arduino.ORDER_ATOMIC);

  // 2. 自动注册变量到Blockly系统
  if (name) {
    // let fullType = "";
    // if (storage) fullType += storage + " ";
    // if (qualifier) fullType += qualifier + " ";
    // fullType += type;
    registerVariableToBlockly(name, undefined);
    addVariableToToolbox(block, name);
  }

  let defaultValue = "";

  // 首先统一处理类型转换
  if (type === "string") {
    type = "String";
  }
  
  // 如果使用固定宽度整数类型，自动包含 stdint.h
  if (/^(u?int(8|16|32|64)_t|size_t)$/.test(type)) {
    generator.addLibrary("stdint", "#include <stdint.h>");
  }

  if (!value) {
    switch (type) {
      case "String":
        defaultValue = `""`;
        break;
      case "char":
        defaultValue = `''`;
        break;
      case "void*":
        defaultValue = "NULL";
        break;
      default:
        defaultValue = 0;
    }
  } else {
    defaultValue = value;
  }

  // 构建变量声明字符串
  let declaration = "";
  
  // 添加存储类说明符（storage class specifier）
  if (storage) {
    declaration += storage + " ";
  }
  
  // 添加类型限定符（type qualifier）
  if (qualifier) {
    declaration += qualifier + " ";
  }
  
  // 添加类型和变量名
  declaration += type + " " + name;
  
  // extern 不能有初始化值（只是声明）
  if (storage === "extern") {
    if (isBlockConnected(block)) {
      return declaration + ";\n";
    } else {
      Arduino.addVariable(`${storage}_${qualifier}_${type}_${name}`, declaration + ";");
      return "";
    }
  }
  
  // 其他情况添加初始化值
  declaration += " = " + defaultValue;

  if (isBlockConnected(block)) {
    return declaration + ";\n";
  } else {
    Arduino.addVariable(`${storage}_${qualifier}_${type}_${name}`, declaration + ";");
    return "";
  }
};


Arduino.forBlock["variable_define_advanced_scoped"] = function (block, generator) {
  // 1. 设置变量重命名监听
  // 使用块 ID 来标记，避免复制块时标志被复制的问题
  const monitorKey = '_varMonitor_' + block.id;
  if (!block[monitorKey]) {
    block[monitorKey] = true;
    block._varLastName = block.getFieldValue('VAR') || 'variable';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._varLastName;
        if (workspace && newName && newName !== oldName) {
          // 获取当前块的类型信息
          // const currentStorage = block.getFieldValue("STORAGE") || '';
          // const currentQualifier = block.getFieldValue("QUALIFIER") || '';
          // const currentType = block.getFieldValue("TYPE") || 'int';
          // let fullType = "";
          // if (currentStorage) fullType += currentStorage + " ";
          // if (currentQualifier) fullType += currentQualifier + " ";
          // fullType += currentType;
          // renameVariableInBlockly(block, oldName, newName, fullType || '');
          renameVariableInBlockly(block, oldName, newName, undefined);
          block._varLastName = newName;
        }
        return newName;
      });
    }
  }

  const storage = block.getFieldValue("STORAGE");  // static, extern, ""
  const qualifier = block.getFieldValue("QUALIFIER");  // const, volatile, const volatile, ""
  let type = block.getFieldValue("TYPE");
  const name = block.getFieldValue("VAR");
  let value = Arduino.valueToCode(block, "VALUE", Arduino.ORDER_ATOMIC);
  const scope = block.getFieldValue("SCOPE"); // local or global

  // 2. 自动注册变量到Blockly系统（使用真实类型）
  if (name) {
    // 构建完整的类型字符串（包含存储类和限定符）
    // let fullType = "";
    // if (storage) fullType += storage + " ";
    // if (qualifier) fullType += qualifier + " ";
    // fullType += type;
    registerVariableToBlockly(name, undefined);
    addVariableToToolbox(block, name);
  }

  let defaultValue = "";

  // 首先统一处理类型转换
  if (type === "string") {
    type = "String";
  }
  
  // 如果使用固定宽度整数类型，自动包含 stdint.h
  if (/^(u?int(8|16|32|64)_t|size_t)$/.test(type)) {
    generator.addLibrary("stdint", "#include <stdint.h>");
  }

  if (!value) {
    switch (type) {
      case "String":
        defaultValue = `""`;
        break;
      case "char":
        defaultValue = `''`;
        break;
      case "void*":
        defaultValue = "NULL";
        break;
      default:
        defaultValue = 0;
    }
  } else {
    defaultValue = value;
  }

  // 构建变量声明字符串
  let declaration = "";
  
  // 添加存储类说明符（storage class specifier）
  if (storage) {
    declaration += storage + " ";
  }
  
  // 添加类型限定符（type qualifier）
  if (qualifier) {
    declaration += qualifier + " ";
  }
  
  // 添加类型和变量名
  declaration += type + " " + name;
  
  // extern 不能有初始化值（只是声明）
  if (storage === "extern") {
    if (scope === "local") {
      return declaration + ";\n";
    } else {
      Arduino.addVariable(`${storage}_${qualifier}_${type}_${name}`, declaration + ";");
      return "";
    }
  }
  
  // 其他情况添加初始化值
  declaration += " = " + defaultValue;

  if (scope === "local") {
    return declaration + ";\n";
  } else {
    Arduino.addVariable(`${storage}_${qualifier}_${type}_${name}`, declaration + ";");
    return "";
  }
};

Arduino.forBlock["variables_get"] = function (block, generator) {
  // Variable getter.
  const { name: code, type } = block.workspace.getVariableById(
    block.getFieldValue("VAR"),
  );
  // console.log("name: ", code);
  // setLibraryVariable(type, code);
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["variables_set"] = function (block, generator) {
  // Variable setter.
  const value =
    Arduino.valueToCode(block, "VALUE", Arduino.ORDER_ASSIGNMENT) || "0";

  const { name: code, type } = block.workspace.getVariableById(
    block.getFieldValue("VAR"),
  );

  // // 检查工作区中是否有变量定义块定义了当前变量
  // const workspace = block.workspace;
  // const allBlocks = workspace.getAllBlocks(false);
  // const defineBlockTypes = [
  //   'variable_define',
  //   'variable_define_scoped',
  //   'variable_define_advanced',
  //   'variable_define_advanced_scoped'
  // ];
  
  // let isVariableDefined = false;
  // for (const b of allBlocks) {
  //   if (defineBlockTypes.includes(b.type)) {
  //     const varField = b.getField('VAR');
  //     if (varField && varField.getText() === code) {
  //       isVariableDefined = true;
  //       break;
  //     }
  //   }
  // }
  
  // // 如果变量未被定义，自动添加全局变量声明
  // if (!isVariableDefined) {
  //   // 根据变量类型确定默认类型，如果没有类型则使用 int
  //   let varType = type || 'int';
  //   if (varType === 'string') {
  //     varType = 'String';
  //   }
  //   Arduino.addVariable(`${varType}_${code}`, `${varType} ${code};`);
  // }

  return `${code} = ${value};\n`;
};

Arduino.forBlock["type_cast"] = function (block, generator) {
  // 类型强制转换
  const value = Arduino.valueToCode(block, "VALUE", Arduino.ORDER_ATOMIC) || "0";
  const type = block.getFieldValue("TYPE");

  let code;
  
  // 如果使用固定宽度整数类型，自动包含 stdint.h
  if (/^(u?int(8|16|32|64)_t|size_t)$/.test(type)) {
    generator.addLibrary("stdint", "#include <stdint.h>");
  }

  // 根据目标类型生成相应的转换代码
  switch (type) {
    case "String":
      // 转换为字符串使用 String() 构造函数
      code = "String(" + value + ")";
      break;
    case "unsigned int":
    case "unsigned long":
      // 无符号类型需要空格
      code = "(" + type + ")" + value;
      break;
    case "void*":
      // 指针类型转换
      code = "(void*)(" + value + ")";
      break;
    default:
      // 其他类型使用标准 C++ 类型转换语法
      code = "(" + type + ")" + value;
      break;
  }

  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["variables_get_dynamic"] = Arduino.forBlock["variables_get"];
Arduino.forBlock["variables_set_dynamic"] = Arduino.forBlock["variables_set"];
Arduino.forBlock["type_cast_dynamic"] = Arduino.forBlock["type_cast"];
