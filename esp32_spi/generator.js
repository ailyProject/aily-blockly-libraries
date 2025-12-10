'use strict';

// 全局拦截 Blockly FieldDropdown 验证逻辑，允许自定义SPI值通过验证
(function installSPIFieldValidator() {
  const tryInstall = function() {
    if (typeof Blockly !== 'undefined' && Blockly.Field && Blockly.FieldDropdown) {
      // 检查是否已经安装过
      if (Blockly.FieldDropdown.prototype._spiValidatorInstalled) {
        return;
      }
      
      // 保存原始的 doClassValidation_ 方法
      const originalDoClassValidation = Blockly.FieldDropdown.prototype.doClassValidation_;
      
      // 获取已保存的串口验证标记
      const serialValidatorInstalled = Blockly.FieldDropdown.prototype._serialValidatorInstalled;
      
      // 重写 FieldDropdown 的验证方法
      Blockly.FieldDropdown.prototype.doClassValidation_ = function(newValue) {
        // 检查是否是 SPI 字段
        if (this.name === 'SPI') {
          // 检查是否是已注册的自定义SPI
          const customSPIs = window['customESPSPIs'];
          if (customSPIs && customSPIs[newValue]) {
            return newValue;
          }
          
          // 检查是否是标准SPI选项（SPI, HSPI, VSPI等）
          const boardConfig = window['boardConfig'];
          if (boardConfig && boardConfig.spi) {
            const standardOptions = boardConfig.spiOriginal || boardConfig.spi;
            const isStandardOption = standardOptions.some(option => option[1] === newValue);
            if (isStandardOption) {
              return originalDoClassValidation ? originalDoClassValidation.call(this, newValue) : newValue;
            }
          }
          
          // 对于非标准选项，在加载期间临时允许通过（可能是待注册的自定义SPI）
          return newValue;
        }
        // 如果已安装串口验证器，调用它（保持兼容性）
        if (serialValidatorInstalled && this.name === 'SERIAL') {
          const customPorts = window['customSerialPorts'];
          if (customPorts && customPorts[newValue]) {
            return newValue;
          }
        }
        // 否则调用原始验证逻辑
        return originalDoClassValidation ? originalDoClassValidation.call(this, newValue) : newValue;
      };
      
      // 标记已安装
      Blockly.FieldDropdown.prototype._spiValidatorInstalled = true;
    } else {
      // Blockly 还未加载，延迟重试
      setTimeout(tryInstall, 100);
    }
  };
  
  tryInstall();
})();

// 动态SPI配置管理 - 参考core-serial实现
Blockly.getMainWorkspace().addChangeListener((event) => {
  // 当工作区完成加载时调用
  if (event.type === Blockly.Events.FINISHED_LOADING) {
    // console.log('ESP32-SPI: FINISHED_LOADING 事件触发');
    loadExistingSPIBlockToToolbox(Blockly.getMainWorkspace());
  }
});

// 检测是否为ESP32核心
function isESP32Core() {
  const boardConfig = window['boardConfig'];
  const result = boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1;
  // console.log('ESP32-SPI: isESP32Core 检查:', {
  //   boardConfig: !!boardConfig,
  //   core: boardConfig?.core,
  //   result: result
  // });
  return result;
}

function loadExistingSPIBlockToToolbox(workspace) {
  if (!workspace) return;

  // console.log("ESP32-SPI: loadExistingSPIBlockToToolbox 被调用");

  // 获取原始工具箱定义
  const originalToolboxDef = workspace.options.languageTree;
  if (!originalToolboxDef) {
    // console.log("ESP32-SPI: 没有找到 originalToolboxDef");
    return;
  }

  for (let category of originalToolboxDef.contents) {
    // console.log("ESP32-SPI: 检查类别:", category.name);
    const isSPICategory = category.name === "SPI" || 
                          category.name === "ESP32 SPI" ||
                          (category.contents && category.contents[0] && 
                           category.contents[0].type && category.contents[0].type.startsWith("esp32_spi_"));
    // console.log("ESP32-SPI: 是否为SPI类别:", isSPICategory, category.name);
    
    if (isSPICategory) {
      // console.log("ESP32-SPI: 找到SPI类别，共有 %d 个块", category.contents?.length);

      // 检测是否为ESP32核心
      if (isESP32Core()) {
        // console.log("ESP32-SPI: 检测到ESP32核心，开始更新");

        // 更新SPI引脚信息
        updateESPSPIBlocksWithCustomPorts();
        
        // 立即更新工作区中所有现有的SPI块
        const allBlocks = workspace.getAllBlocks();
        allBlocks.forEach(block => {
          if (block.getField && block.getField('SPI')) {
            updateESPSPIBlockDropdownWithCustomPorts(block);
            // updateESPSPIBlockDropdownWithCustomPorts 内部的 setValue 已经触发渲染
          }
        });
      }
    }
  }
}

// Arduino.forBlock['esp32_spi_create'] = function(block, generator) {
//   // 设置变量重命名监听
//   if (!block._spiVarMonitorAttached) {
//     block._spiVarMonitorAttached = true;
//     block._spiVarLastName = block.getFieldValue('VAR') || 'SPI';
//     const varField = block.getField('VAR');
//     if (varField && typeof varField.setValidator === 'function') {
//       varField.setValidator(function(newName) {
//         const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
//         const oldName = block._spiVarLastName;
//         if (workspace && newName && newName !== oldName) {
//           renameVariableInBlockly(block, oldName, newName, 'SPIClass');
//           block._spiVarLastName = newName;
//         }
//         return newName;
//       });
//     }
//   }

//   const varName = block.getFieldValue('VAR') || 'SPI';
//   const bus = block.getFieldValue('BUS') || 'VSPI';

//   // 添加库引用
//   generator.addLibrary('SPI', '#include <SPI.h>');
  
//   // 注册变量到Blockly系统
//   registerVariableToBlockly(varName, 'SPIClass');
  
//   // 生成变量声明
//   generator.addObject(varName, 'SPIClass *' + varName + ' = new SPIClass(' + bus + ');');

//   return '';
// };

function updateAllESPSPIBlocksInWorkspace(spiName) {
  try {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) return;
    
    const allBlocks = workspace.getAllBlocks();
    allBlocks.forEach(b => {
      if (b.getField && b.getField('SPI')) {
        try {
          const blockSpi = b.getFieldValue('SPI');
          // 只更新特定 SPI 实例的块或全部块（当 spiName 为空时）
          if (!spiName || blockSpi === spiName) {
            updateESPSPIBlockDropdownWithCustomPorts(b);
            b.render();
          }
        } catch (e) {
          // 忽略已销毁的块
        }
      }
    });
  } catch (e) {
    // 忽略错误
  }
}

// 更新自定义SPI配置的辅助函数（参考 core-serial）
function updateCustomESPSPIConfig(customName, sckPin, misoPin, mosiPin, ssPin) {
  try {
    let configChanged = true;
    
    if (window['customESPSPIs'] && window['customESPSPIs'][customName]) {
      const existingConfig = window['customESPSPIs'][customName];
      
      if (existingConfig.sck === sckPin && 
          existingConfig.miso === misoPin && 
          existingConfig.mosi === mosiPin && 
          existingConfig.ss === ssPin) {
        configChanged = false;
      }
    }
    
    // 只有当配置确实变化时才更新
    if (configChanged) {
      if (!window['customESPSPIs']) {
        window['customESPSPIs'] = {};
      }
      if (!window['customESPSPIConfigs']) {
        window['customESPSPIConfigs'] = {};
      }
      
      window['customESPSPIs'][customName] = {
        sck: sckPin,
        miso: misoPin,
        mosi: mosiPin,
        ss: ssPin
      };
      window['customESPSPIConfigs'][customName] = true;
      
      // 立即更新UI
      updateESPSPIBlocksWithCustomPorts();
      updateAllESPSPIBlocksInWorkspace(customName);
    }
  } catch (e) {
    // 忽略错误
  }
}

// 更新单个SPI块的下拉菜单选项
function updateESPSPIBlockDropdownWithCustomPorts(block, config) {
  try {
    // 检查block是否有SPI字段
    if (!block || !block.getField || !block.getField('SPI')) return;
    
    const boardConfig = config || window['boardConfig'];
    if (!boardConfig || !boardConfig.spi) {
      return;
    }
    
    const spiField = block.getField('SPI');
    if (!spiField) return;
    
    const optionsWithCustom = generateESPSPIOptionsWithCustom(boardConfig);
    const currentValue = spiField.getValue();

    // 更新下拉菜单选项
    if (optionsWithCustom.length > 0) {
      // 更新字段的选项生成器
      spiField.menuGenerator_ = optionsWithCustom;
      spiField.getOptions = function() {
        return optionsWithCustom;
      };

      // 检查当前值是否在新的选项列表中
      const matchingOption = optionsWithCustom.find(([text, value]) => value === currentValue);

      if (currentValue && matchingOption) {
        // 强制调用setValue刷新UI（即使值未变，setValue也会刷新显示文本）
        spiField.setValue(currentValue);
      } else if (currentValue) {
        // 当前值在选项中不存在，但保持原值（可能是待注册的自定义SPI）
        // 不强制重置，让全局验证拦截器处理
        try {
          spiField.setValue(currentValue);
        } catch (e) {
          // 忽略错误
        }
      } else {
        // 没有当前值，设置为第一个选项
        spiField.setValue(optionsWithCustom[0][1]);
      }
    }
  } catch (e) {
    // 忽略错误
  }
}

// 生成带自定义SPI信息的选项（参考 core-serial 实现）
function generateESPSPIOptionsWithCustom(boardConfig) {
  const originalSPIs = boardConfig.spiOriginal || boardConfig.spi;
  const result = [...originalSPIs]; // 复制原始选项
  
  // 添加自定义SPI选项
  const customESPSPIs = window['customESPSPIs'];
  if (customESPSPIs) {
    Object.keys(customESPSPIs).forEach(customName => {
      const config = customESPSPIs[customName];
      const displayText = `${customName}(SCK:${config.sck}, MISO:${config.miso}, MOSI:${config.mosi}, SS:${config.ss})`;
      result.push([displayText, customName]);
    });
  }
  
  return result;
}

// 动态更新SPI块的下拉菜单，添加引脚信息（参考aily-iic实现）
function updateESPSPIBlocksWithCustomPorts() {
  try {
    // 检查开发板配置
    const boardConfig = window['boardConfig'];
    if (!boardConfig || !boardConfig.spi) {
      // console.log('ESP32-SPI: boardConfig 或 boardConfig.spi 不存在');
      return;
    }

    // 使用原始的spi配置，避免重复添加引脚信息
    const originalSPIs = boardConfig.spiOriginal || boardConfig.spi;
    
    // 备份原始配置（只在第一次时）
    if (!boardConfig.spiOriginal) {
      boardConfig.spiOriginal = [...originalSPIs];
      // console.log('ESP32-SPI: 备份原始配置', boardConfig.spiOriginal);
    }
    
    // 创建带引脚信息的SPI选项（不修改原始boardConfig）
    const spiOptionsWithPins = generateESPSPIOptionsWithCustom(boardConfig);
    // console.log('ESP32-SPI: 生成的SPI选项（带引脚信息）:', spiOptionsWithPins);
    
    // 创建临时配置对象，避免修改原始boardConfig（参考IIC实现）
    const tempConfig = {
      ...boardConfig,
      spi: spiOptionsWithPins
    };
    
    // 更新工作区中所有现有的SPI块
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      const allBlocks = workspace.getAllBlocks();
      allBlocks.forEach(block => {
        // 扩展到所有包含SPI字段的block
        if (block.getField && block.getField('SPI')) {
          // 更新下拉菜单选项
          updateESPSPIBlockDropdownWithCustomPorts(block, tempConfig);
          // 强制重绘以确保UI立即曹新（参考IIC实现）
          block.render();
        }
      });
    }
  } catch (e) {
    // console.error('ESP32-SPI: updateESPSPIBlocksWithCustomPorts 错误:', e);
    // 静默处理错误
  }
}

function ensureLibrary(generator, libraryKey, libraryCode) {
  if (!generator.libraries_) {
    generator.libraries_ = {};
  }
  if (!generator.libraries_[libraryKey]) {
    generator.addLibrary(libraryKey, libraryCode);
  }
}

function ensureSPILibrary(generator) {
  ensureLibrary(generator, 'SPI', '#include <SPI.h>');
}


Arduino.forBlock['esp32_spi_begin'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'SPI';
  const bus = block.getFieldValue('BUS') || 'HSPI';

  ensureSPILibrary(generator);

  let code = '';

  if (bus === 'VSPI') {
    // 宏定义代码
    let macroCode = '';
    macroCode += '#if !defined(CONFIG_IDF_TARGET_ESP32)\n';
    macroCode += '#define VSPI FSPI\n';
    macroCode += '#endif\n';

    generator.addMacro('esp32_spi_vspi_define', macroCode);

    generator.addObject(varName, 'SPIClass ' + varName + '(VSPI);');
  }

  generator.addSetup(`spi_${varName}_begin`, `${varName}.begin(); // 初始化SPI ${varName}`);

  return '';
}

Arduino.forBlock['esp32_spi_begin_custom'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'SPI';
  const bus = block.getFieldValue('BUS') || 'HSPI';
  
  const sck = generator.valueToCode(block, 'SCK', generator.ORDER_ATOMIC) || '-1';
  const miso = generator.valueToCode(block, 'MISO', generator.ORDER_ATOMIC) || '-1';
  const mosi = generator.valueToCode(block, 'MOSI', generator.ORDER_ATOMIC) || '-1';
  const ss = generator.valueToCode(block, 'SS', generator.ORDER_ATOMIC) || '-1';

  // 动态更新自定义SPI配置
  updateCustomESPSPIConfig(varName, sck, miso, mosi, ss);

  ensureSPILibrary(generator);

  if (bus === 'VSPI') {
    // 宏定义代码
    let macroCode = '';
    macroCode += '#if !defined(CONFIG_IDF_TARGET_ESP32)\n';
    macroCode += '#define VSPI FSPI\n';
    macroCode += '#endif\n';

    generator.addMacro('esp32_spi_vspi_define', macroCode);
    generator.addObject(varName, 'SPIClass ' + varName + '(VSPI);');
  }

  // 添加初始化代码到setup部分
  const setupKey = `spi_${varName}_begin`;
  const setupCode = `${varName}.begin(${sck}, ${miso}, ${mosi}, ${ss}); // 自定义SPI ${varName}`;
  generator.addSetup(setupKey, setupCode);

  return '';
};

// Arduino.forBlock['esp32_spi_settings'] = function(block, generator) {
//   const varField = block.getField('VAR');
//   const varName = varField ? varField.getText() : 'SPI';
  
//   const frequency = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC) || '1000000';
//   const bitOrder = block.getFieldValue('BIT_ORDER') || 'MSBFIRST';
//   const mode = block.getFieldValue('MODE') || '0';

//   generator.addLibrary('SPI', '#include <SPI.h>');

//   let code = '';
//   code += varName + '.setFrequency(' + frequency + ');\n';
//   code += varName + '.setBitOrder(' + bitOrder + ');\n';
//   code += varName + '.setDataMode(' + mode + ');\n';
  
//   return code;
// };

Arduino.forBlock['esp32_spi_begin_transaction'] = function(block, generator) {
  const spiName = block.getFieldValue('SPI') || 'SPI';

  ensureSPILibrary(generator);

  const frequency = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC) || '1000000';
  const bitOrder = block.getFieldValue('BIT_ORDER') || 'MSBFIRST';
  const mode = block.getFieldValue('MODE') || '0';

  // 使用默认设置开始事务
  let code = spiName + '.beginTransaction(SPISettings(' + frequency + ', ' + bitOrder + ', SPI_MODE' + mode + '));\n';
  
  return code;
};

Arduino.forBlock['esp32_spi_end_transaction'] = function(block, generator) {
  const spiName = block.getFieldValue('SPI') || 'SPI';

  ensureSPILibrary(generator);

  let code = spiName + '.endTransaction();\n';
  
  return code;
};

Arduino.forBlock['esp32_spi_transfer'] = function(block, generator) {
  const spiName = block.getFieldValue('SPI') || 'SPI';
  
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '0';

  ensureSPILibrary(generator);

  let code = spiName + '.transfer(' + data + ')';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_spi_transfer16'] = function(block, generator) {
  const spiName = block.getFieldValue('SPI') || 'SPI';
  
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '0';

  ensureSPILibrary(generator);

  let code = spiName + '.transfer16(' + data + ')';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_spi_write'] = function(block, generator) {
  const spiName = block.getFieldValue('SPI') || 'SPI';
  
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || '0';

  ensureSPILibrary(generator);

  let code = spiName + '.write(' + data + ');\n';
  
  return code;
};

Arduino.forBlock['esp32_spi_write_bytes'] = function(block, generator) {
  const spiName = block.getFieldValue('SPI') || 'SPI';
  
  const data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC) || 'NULL';
  const length = generator.valueToCode(block, 'LENGTH', generator.ORDER_ATOMIC) || '0';

  ensureSPILibrary(generator);

  let code = spiName + '.writeBytes(' + data + ', ' + length + ');\n';
  
  return code;
};

Arduino.forBlock['esp32_spi_set_frequency'] = function(block, generator) {
  const spiName = block.getFieldValue('SPI') || 'SPI';
  
  const frequency = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC) || '1000000';

  ensureSPILibrary(generator);

  let code = spiName + '.setFrequency(' + frequency + ');\n';
  
  return code;
};

Arduino.forBlock['esp32_spi_set_bit_order'] = function(block, generator) {
  const spiName = block.getFieldValue('SPI') || 'SPI';
  
  const bitOrder = block.getFieldValue('BIT_ORDER') || 'MSBFIRST';

  ensureSPILibrary(generator);

  let code = spiName + '.setBitOrder(' + bitOrder + ');\n';
  
  return code;
};

Arduino.forBlock['esp32_spi_set_data_mode'] = function(block, generator) {
  const spiName = block.getFieldValue('SPI') || 'SPI';
  
  const mode = block.getFieldValue('MODE') || '0';

  ensureSPILibrary(generator);

  let code = spiName + '.setDataMode(' + mode + ');\n';
  
  return code;
};

Arduino.forBlock['esp32_spi_get_ss_pin'] = function(block, generator) {
  const spiName = block.getFieldValue('SPI') || 'SPI';
  
  ensureSPILibrary(generator);
  let code = spiName + '.pinSS()';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

// 简化的SPI块初始化函数
function initializeESPSPIBlock(block) {
  try {
    // 检查block是否有SPI字段
    const spiField = block.getField('SPI');
    if (!spiField) return;
    
    // 先立即同步更新一次（不等待，确保加载时配置就绪）
    const currentValue = spiField.getValue();
    updateESPSPIBlockDropdownWithCustomPorts(block);
    
    // 如果当前值存在且看起来是自定义SPI名称，强制保留它
    if (currentValue) {
      try {
        // 重新获取选项并验证
        const boardConfig = window['boardConfig'];
        if (boardConfig) {
          const options = generateESPSPIOptionsWithCustom(boardConfig);
          const matchingOption = options.find(([text, value]) => value === currentValue);
          
          // 如果找到匹配选项，确保设置正确
          if (matchingOption) {
            spiField.setValue(currentValue);
          }
        }
      } catch (e) {
        // 忽略错误
      }
    }
    
    // 延迟初始化，等待boardConfig加载（用于UI更新）
    setTimeout(() => {
      // 检查块是否在 flyout 中，如果是则不更新
      if (block.isInFlyout) {
        return;
      }
      
      updateESPSPIBlockDropdownWithCustomPorts(block);
      
      const boardConfig = window['boardConfig'];
      if (boardConfig && boardConfig.spi && boardConfig.spi.length > 0) {
        const savedValue = spiField.getValue();
        
        // 检查当前值是否在选项列表中
        const options = generateESPSPIOptionsWithCustom(boardConfig);
        const matchingOption = options.find(([text, value]) => value === savedValue);
        
        // 只有在没有当前值或当前值无效的情况下才设置默认值
        if (!savedValue || !matchingOption) {
          try {
            spiField.setValue(boardConfig.spi[0][1]);
          } catch (e) {
            // 如果设置失败，可能是因为选项尚未正确加载
          }
        }
      }
    }, 100);
  } catch (e) {
    // 忽略错误
  }
}

// SPI块扩展注册
function addESPSPICustomPortExtensions() {
  if (typeof Blockly === 'undefined' || !Blockly.Extensions) return;
  
  try {
    // 所有需要支持自定义SPI显示的SPI block类型
    const spiBlockTypes = [
      'esp32_spi_create',
      'esp32_spi_begin',
      'esp32_spi_begin_custom',
      'esp32_spi_settings',
      'esp32_spi_begin_transaction',
      'esp32_spi_end_transaction',
      'esp32_spi_transfer',
      'esp32_spi_transfer16',
      'esp32_spi_write',
      'esp32_spi_write_bytes',
      'esp32_spi_set_frequency',
      'esp32_spi_set_bit_order',
      'esp32_spi_set_data_mode',
      'esp32_spi_get_ss_pin'
    ];

    // 为每种block类型注册扩展
    spiBlockTypes.forEach(blockType => {
      const extensionName = blockType + '_custom_port';
      
      // 先检查扩展是否存在，如果存在则先取消注册
      if (Blockly.Extensions.isRegistered && Blockly.Extensions.isRegistered(extensionName)) {
        Blockly.Extensions.unregister(extensionName);
      }
      
      // 然后注册扩展
      Blockly.Extensions.register(extensionName, function() {
        // 如果是 esp32_spi_begin_custom，立即同步注册配置
        if (this.type === 'esp32_spi_begin_custom' && !this.isInFlyout) {
          try {
            const varName = this.getFieldValue('VAR') || 'SPI';
            
            // 尝试从连接的引脚块获取实际值
            const getShadowOrConnectedValue = (inputName) => {
              const input = this.getInput(inputName);
              if (input && input.connection) {
                const targetBlock = input.connection.targetBlock();
                if (targetBlock && targetBlock.type === 'math_number') {
                  return targetBlock.getFieldValue('NUM') || '-1';
                }
              }
              return '-1';
            };
            
            const sckPin = getShadowOrConnectedValue('SCK');
            const misoPin = getShadowOrConnectedValue('MISO');
            const mosiPin = getShadowOrConnectedValue('MOSI');
            const ssPin = getShadowOrConnectedValue('SS');
            
            if (!window['customESPSPIs']) {
              window['customESPSPIs'] = {};
            }
            if (!window['customESPSPIConfigs']) {
              window['customESPSPIConfigs'] = {};
            }
            
            window['customESPSPIs'][varName] = {
              sck: sckPin,
              miso: misoPin,
              mosi: mosiPin,
              ss: ssPin
            };
            window['customESPSPIConfigs'][varName] = true;
          } catch (e) {
            // 忽略错误
          }
        }
        
        setTimeout(() => {
          initializeESPSPIBlock(this);
          // 为esp32_spi_begin_custom特别添加输入监听器
          if (this.type === 'esp32_spi_begin_custom') {
            addESPSPIInputChangeListener(this);
          }
        }, 50);
      });
    });
  } catch (e) {
    // 忽略扩展注册错误
  }
}

// 为esp32_spi_begin_custom块添加输入变化监听器
function addESPSPIInputChangeListener(block) {
  if (!block || block.type !== 'esp32_spi_begin_custom') return;
  
  try {
    // 获取当前连接的引脚块ID，以便监听其字段变化
    const getConnectedBlockIds = () => {
      const ids = [];
      const inputs = ['SCK', 'MISO', 'MOSI', 'SS'];
      
      inputs.forEach(inputName => {
        const input = block.getInput(inputName);
        if (input && input.connection && input.connection.targetBlock()) {
          ids.push(input.connection.targetBlock().id);
        }
      });
      return ids;
    };
    
    // 存储当前自定义名称以便检测变化
    let currentCustomName = block.getFieldValue('VAR') || 'SPI';
    
    // 创建变化监听函数
    const updateSPIInfo = function() {
      const newCustomName = block.getFieldValue('VAR') || 'SPI';
      const bus = block.getFieldValue('BUS') || 'HSPI';
      
      // 获取引脚连接
      const sckInput = block.getInput('SCK');
      const misoInput = block.getInput('MISO');
      const mosiInput = block.getInput('MOSI');
      const ssInput = block.getInput('SS');
      
      // 检测自定义名称是否已更改
      if (currentCustomName !== newCustomName) {
        // console.log(`SPI VAR名称从 ${currentCustomName} 更改为 ${newCustomName}`);
        // 自定义名称已更改，清理旧的自定义配置
        clearCustomESPSPIConfig(currentCustomName);
        // 立即执行全面清理，确保旧配置被移除
        setTimeout(() => {
          window.cleanupUnusedCustomESPSPIs();
        }, 10);
        // 更新当前自定义名称记录
        currentCustomName = newCustomName;
      }
      
      if (sckInput && sckInput.connection && sckInput.connection.targetBlock() &&
          misoInput && misoInput.connection && misoInput.connection.targetBlock() &&
          mosiInput && mosiInput.connection && mosiInput.connection.targetBlock() &&
          ssInput && ssInput.connection && ssInput.connection.targetBlock()) {
        
        const sckBlock = sckInput.connection.targetBlock();
        const misoBlock = misoInput.connection.targetBlock();
        const mosiBlock = mosiInput.connection.targetBlock();
        const ssBlock = ssInput.connection.targetBlock();
        
        // 如果连接的是数字块，获取其值
        if (sckBlock.type === 'math_number' && misoBlock.type === 'math_number' &&
            mosiBlock.type === 'math_number' && ssBlock.type === 'math_number') {
          const sckValue = sckBlock.getFieldValue('NUM');
          const misoValue = misoBlock.getFieldValue('NUM');
          const mosiValue = mosiBlock.getFieldValue('NUM');
          const ssValue = ssBlock.getFieldValue('NUM');
          
          // 更新自定义SPI配置
          updateCustomESPSPIConfig(newCustomName, sckValue, misoValue, mosiValue, ssValue);
        }
      }
    };
    
    // 为block添加变化监听器
    if (block.workspace) {
      const changeListener = function(event) {
        // 获取当前连接的数字块ID
        const connectedBlockIds = getConnectedBlockIds();
        
        // 监听块变化、字段变化和连接的数字块的字段变化
        if ((event.type === Blockly.Events.BLOCK_CHANGE || 
             event.type === Blockly.Events.BLOCK_MOVE ||
             event.type === Blockly.Events.CHANGE) && 
            (event.blockId === block.id || 
             connectedBlockIds.includes(event.blockId) ||
             (event.blockId && block.getDescendants().some(b => b.id === event.blockId)))) {
          
          // 特别检查VAR或BUS字段变化
          if (event.type === Blockly.Events.CHANGE && 
              event.element === 'field' && 
              (event.name === 'VAR' || event.name === 'BUS')) {
            // VAR变化特殊处理：立即清理旧配置并更新UI
            if (event.name === 'VAR') {
              const oldName = currentCustomName;
              const newName = block.getFieldValue('VAR') || 'SPI';
              
              if (oldName !== newName) {
                // console.log(`ESP SPI VAR变化: ${oldName} -> ${newName}`);
                // 立即清理旧配置
                clearCustomESPSPIConfig(oldName);
                // 立即执行全面清理
                setTimeout(() => {
                  window.cleanupUnusedCustomESPSPIs();
                }, 5);
              }
            }
            // 延迟执行以确保字段值已更新
            setTimeout(updateSPIInfo, 10);
          } 
          // 监听引脚连接变化
          else if (event.type === Blockly.Events.BLOCK_MOVE ||
                   (event.type === Blockly.Events.CHANGE && event.element === 'field' && event.name === 'NUM')) {
            // 延迟执行以确保连接状态已更新
            setTimeout(updateSPIInfo, 50);
          }
        }
      };
      
      block.workspace.addChangeListener(changeListener);
      
      // 存储原始的dispose方法引用
      const originalDispose = block.dispose;
      
      // 重写dispose方法
      block.dispose = function(healStack) {
        // 清除自定义SPI配置
        try {
          const customName = this.getFieldValue('VAR') || 'SPI';
          
          // 延迟清理，确保块完全销毁后再检查
          setTimeout(() => {
            clearCustomESPSPIConfig(customName);
          }, 100);
        } catch (e) {
          // 忽略错误
        }
        
        // 移除变化监听器
        try {
          if (this.workspace) {
            this.workspace.removeChangeListener(changeListener);
          }
        } catch (e) {
          // 忽略错误
        }
        
        // 调用原始的dispose方法
        if (originalDispose) {
          originalDispose.call(this, healStack);
        }
      };
      
      // 也监听块删除事件作为备选方案
      const blockId = block.id;
      const deleteListener = function(event) {
        if (event.type === Blockly.Events.BLOCK_DELETE && event.blockId === blockId) {
          try {
            const customName = block.getFieldValue('VAR') || 'SPI';
            setTimeout(() => {
              clearCustomESPSPIConfig(customName);
            }, 100);
          } catch (e) {
            // 忽略错误
          }
        }
      };
      
      block.workspace.addChangeListener(deleteListener);
      
      // 初始化时调用一次
      setTimeout(updateSPIInfo, 50);
    }
  } catch (e) {
    // 忽略错误
  }
}

// 清除指定自定义SPI的配置
function clearCustomESPSPIConfig(customName) {
  try {
    let configChanged = false;
    
    if (window['customESPSPIs'] && window['customESPSPIs'][customName]) {
      delete window['customESPSPIs'][customName];
      configChanged = true;
    }
    if (window['customESPSPIConfigs'] && window['customESPSPIConfigs'][customName]) {
      delete window['customESPSPIConfigs'][customName];
      configChanged = true;
    }
    
    // 只有配置真的改变了才更新UI
    if (configChanged) {
      // 立即更新UI，恢复默认SPI显示
      updateESPSPIBlocksWithCustomPorts();
      
      // 只更新使用这个特定 SPI 实例的块（参考IIC，不调用render）
      const workspace = Blockly.getMainWorkspace();
      if (workspace) {
        setTimeout(() => {
          const allBlocks = workspace.getAllBlocks();
          allBlocks.forEach(b => {
            if (b.getField && b.getField('SPI')) {
              try {
                const blockSpi = b.getFieldValue('SPI');
                // 只更新使用被删除的 customName 的块
                if (blockSpi === customName) {
                  updateESPSPIBlockDropdownWithCustomPorts(b);
                }
              } catch (e) {
                // 忽略已销毁的块
              }
            }
          });
        }, 50);
      }
    }
  } catch (e) {
    // 忽略错误
  }
}

// 添加全局函数，供外部手动调用
window.updateESPSPICustomPorts = function() {
  updateESPSPIBlocksWithCustomPorts();
  const workspace = Blockly.getMainWorkspace();
  if (workspace) {
    refreshSPIToolbox(workspace);
  }
};

// 刷新SPI工具箱（参考aily-iic的实现）
function refreshSPIToolbox(workspace) {
  try {
    if (!workspace) return;
    
    // 使用与aily-iic相同的刷新方法
    const originalToolboxDef = workspace.options.languageTree;
    if (originalToolboxDef) {
      workspace.updateToolbox(originalToolboxDef);
    }
  } catch (e) {
    // 静默处理错误
  }
}

// 清理未使用的自定义SPI配置 - 优化版，检查所有SPI相关块的VAR名称
window.cleanupUnusedCustomESPSPIs = function() {
  try {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace || !window['customESPSPIs']) return;
    
    const allBlocks = workspace.getAllBlocks();
    const usedCustomNames = new Set();
    const activeSPINames = new Set();
    
    // 收集所有SPI相关块中使用的VAR/SPI名称
    allBlocks.forEach(block => {
      try {
        // 1. esp32_spi_begin_custom块的VAR字段
        if (block.type === 'esp32_spi_begin_custom') {
          const customName = block.getFieldValue('VAR');
          if (customName) {
            usedCustomNames.add(customName);
            activeSPINames.add(customName);
          }
        }
        // 2. esp32_spi_begin块的VAR字段
        else if (block.type === 'esp32_spi_begin') {
          const varName = block.getFieldValue('VAR');
          if (varName) {
            activeSPINames.add(varName);
          }
        }
        // 3. 其他SPI块的SPI下拉字段
        else if (block.getField && block.getField('SPI')) {
          const spiName = block.getFieldValue('SPI');
          if (spiName) {
            activeSPINames.add(spiName);
          }
        }
      } catch (e) {
        // 忽略错误（可能是正在销毁的块）
      }
    });
    
    // 清理未使用的自定义配置
    const customSPIs = window['customESPSPIs'];
    const customConfigs = window['customESPSPIConfigs'];
    
    let configChanged = false;
    
    // 检查每个自定义SPI配置是否仍在使用中
    Object.keys(customSPIs).forEach(customName => {
      // 如果这个自定义名称不在任何活跃的SPI块中使用，则删除它
      if (!activeSPINames.has(customName)) {
        // console.log(`清理未使用的自定义SPI配置: ${customName}`);
        delete customSPIs[customName];
        if (customConfigs) {
          delete customConfigs[customName];
        }
        configChanged = true;
      }
    });
    
    // 如果有配置变化，更新UI
    if (configChanged) {
      // console.log('检测到自定义SPI配置变化，更新UI...');
      updateESPSPIBlocksWithCustomPorts();
      setTimeout(() => updateAllESPSPIBlocksInWorkspace(), 100);
    }
  } catch (e) {
    // console.error('清理自定义SPI配置时出错:', e);
  }
};

// 监听工作区变化，在工作区加载完成后更新SPI信息
if (typeof Blockly !== 'undefined') {
  // 立即注册扩展
  addESPSPICustomPortExtensions();

  // 添加工作区变化监听器
  const addESPSPIBlocksListener = function(event) {
    // 在块创建时立即注册自定义SPI配置
    if (event.type === Blockly.Events.BLOCK_CREATE) {
      try {
        const workspace = Blockly.getMainWorkspace();
        if (!workspace) return;
        
        const block = workspace.getBlockById(event.blockId);
        if (block && block.type === 'esp32_spi_begin_custom') {
          const varName = block.getFieldValue('VAR') || 'SPI';
          
          // 尝试获取引脚值
          const getShadowOrConnectedValue = (inputName) => {
            const input = block.getInput(inputName);
            if (input && input.connection) {
              const targetBlock = input.connection.targetBlock();
              if (targetBlock && targetBlock.type === 'math_number') {
                return targetBlock.getFieldValue('NUM') || '-1';
              }
            }
            return '-1';
          };
          
          const sckPin = getShadowOrConnectedValue('SCK');
          const misoPin = getShadowOrConnectedValue('MISO');
          const mosiPin = getShadowOrConnectedValue('MOSI');
          const ssPin = getShadowOrConnectedValue('SS');
          
          if (!window['customESPSPIs']) {
            window['customESPSPIs'] = {};
          }
          if (!window['customESPSPIConfigs']) {
            window['customESPSPIConfigs'] = {};
          }
          
          window['customESPSPIs'][varName] = {
            sck: sckPin,
            miso: misoPin,
            mosi: mosiPin,
            ss: ssPin
          };
          window['customESPSPIConfigs'][varName] = true;
          
          // 立即更新所有SPI块的下拉选项
          updateESPSPIBlocksWithCustomPorts();
        }
      } catch (e) {
        // 忽略错误
      }
    }
    
    // 当工作区完成加载时调用
    if (event.type === Blockly.Events.FINISHED_LOADING) {
      setTimeout(() => {
        // 清理残留的自定义配置
        if (window['customESPSPIs']) {
          window['customESPSPIs'] = {};
        }
        if (window['customESPSPIConfigs']) {
          window['customESPSPIConfigs'] = {};
        }
        
        // 扫描工作区中所有的 esp32_spi_begin_custom 块，预先注册配置
        const workspace = Blockly.getMainWorkspace();
        if (workspace) {
          const allBlocks = workspace.getAllBlocks();
          allBlocks.forEach(block => {
            if (block.type === 'esp32_spi_begin_custom') {
              try {
                const varName = block.getFieldValue('VAR') || 'SPI';
                
                // 对于 input_value 类型，直接获取连接的块的值
                const getShadowOrConnectedValue = (inputName) => {
                  const input = block.getInput(inputName);
                  if (!input || !input.connection) return '-1';
                  
                  const targetBlock = input.connection.targetBlock();
                  if (targetBlock && targetBlock.type === 'math_number') {
                    return targetBlock.getFieldValue('NUM') || '-1';
                  }
                  
                  return '-1';
                };
                
                const sckPin = getShadowOrConnectedValue('SCK');
                const misoPin = getShadowOrConnectedValue('MISO');
                const mosiPin = getShadowOrConnectedValue('MOSI');
                const ssPin = getShadowOrConnectedValue('SS');
                
                if (!window['customESPSPIs']) {
                  window['customESPSPIs'] = {};
                }
                if (!window['customESPSPIConfigs']) {
                  window['customESPSPIConfigs'] = {};
                }
                
                window['customESPSPIs'][varName] = {
                  sck: sckPin,
                  miso: misoPin,
                  mosi: mosiPin,
                  ss: ssPin
                };
                window['customESPSPIConfigs'][varName] = true;
              } catch (e) {
                // 忽略错误
              }
            }
          });
        }
        
        // 更新SPI信息
        updateESPSPIBlocksWithCustomPorts();
      }, 200);
    }
    
    // 监听块删除事件，清理自定义SPI配置
    if (event.type === Blockly.Events.BLOCK_DELETE) {
      try {
        // 检查删除的是否是esp32_spi_begin_custom块
        if (event.oldXml) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(event.oldXml, "text/xml");
          const blockElement = xmlDoc.querySelector('block');
          
          if (blockElement && blockElement.getAttribute('type') === 'esp32_spi_begin_custom') {
            // 从XML中提取自定义SPI名称信息
            const varField = xmlDoc.querySelector('field[name="VAR"]');
            const customName = varField ? varField.textContent || 'SPI' : 'SPI';
            
            // 延迟清理，确保删除操作完成
            setTimeout(() => {
              clearCustomESPSPIConfig(customName);
            }, 100);
          }
        }
      } catch (e) {
        // 静默处理错误
      }
    }
  };

  // 尝试添加监听器
  try {
    if (Blockly.getMainWorkspace) {
      const workspace = Blockly.getMainWorkspace();
      if (workspace) {
        workspace.addChangeListener(addESPSPIBlocksListener);
      } else {
        // 如果工作区还未创建，延迟添加监听器
        setTimeout(() => {
          const delayedWorkspace = Blockly.getMainWorkspace();
          if (delayedWorkspace) {
            delayedWorkspace.addChangeListener(addESPSPIBlocksListener);
          }
        }, 500);
      }
    }
  } catch (e) {
    // 静默处理错误
  }
}

// 如果boardConfig已经存在，立即处理
if (window['boardConfig']) {
  // console.log('ESP32-SPI: boardConfig 已存在，立即初始化');
  setTimeout(() => {
    // console.log('ESP32-SPI: 开始执行 boardConfig 初始化');
    
    // 先清理残留的自定义配置（参考IIC实现）
    if (window['customESPSPIs']) {
      window['customESPSPIs'] = {};
    }
    if (window['customESPSPIConfigs']) {
      window['customESPSPIConfigs'] = {};
    }
    
    updateESPSPIBlocksWithCustomPorts();
    
    // 立即更新工作区中所有现有的SPI块
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      const allBlocks = workspace.getAllBlocks();
      allBlocks.forEach(block => {
        if (block.getField && block.getField('SPI')) {
          updateESPSPIBlockDropdownWithCustomPorts(block);
          // updateESPSPIBlockDropdownWithCustomPorts 内部的 setValue 已经触发渲染
        }
      });
      
      // 刷新工具箱
      refreshSPIToolbox(workspace);
    }
  }, 200);
}

// 强制重置所有自定义SPI配置
window.forceResetCustomESPSPIs = function() {
  try {
    // 清空所有自定义配置
    if (window['customESPSPIs']) {
      window['customESPSPIs'] = {};
    }
    if (window['customESPSPIConfigs']) {
      window['customESPSPIConfigs'] = {};
    }
    
    // 立即更新UI
    updateESPSPIBlocksWithCustomPorts();
    updateAllESPSPIBlocksInWorkspace();
  } catch (e) {
    // 忽略错误
  }
};

// 强制重新验证所有自定义SPI配置
window.validateAllCustomESPSPIs = function() {
  try {
    // console.log('开始验证所有自定义SPI配置...');
    // 立即执行清理，移除所有未使用的配置
    window.cleanupUnusedCustomESPSPIs();
  } catch (e) {
    // console.error('验证自定义SPI配置时出错:', e);
  }
};

// // 调试函数：测试默认引脚信息获取和显示
// window.testESPSPIPinInfo = function() {
//   try {
//     const boardConfig = window['boardConfig'];
//     console.log('=== ESP32 SPI 引脚信息测试 ===');
//     console.log('boardConfig存在:', !!boardConfig);
    
//     if (boardConfig) {
//       console.log('boardConfig.spi:', boardConfig.spi);
//       console.log('boardConfig.spiPins:', boardConfig.spiPins);
      
//       // 测试生成选项
//       const options = generateESPSPIOptionsWithCustom(boardConfig);
//       console.log('生成的SPI选项:', options);
      
//       // 强制更新UI
//       updateESPSPIBlocksWithCustomPorts();
      
//       console.log('✅ 引脚信息测试完成，请检查SPI块的下拉菜单是否显示引脚信息');
//     } else {
//       console.log('❌ boardConfig不存在！');
//     }
//   } catch (e) {
//     console.error('测试ESP32 SPI引脚信息时出错:', e);
//   }
// };