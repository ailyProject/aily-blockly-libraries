// 动态串口配置管理 - 参考aily-iic实现
// 在最开始就拦截 Blockly 的字段验证
// 全局拦截 Blockly FieldDropdown 验证逻辑，允许自定义串口值通过验证
(function installSerialFieldValidator() {
  const tryInstall = function() {
    if (typeof Blockly !== 'undefined' && Blockly.Field && Blockly.FieldDropdown) {
      // 检查是否已经安装过
      if (Blockly.FieldDropdown.prototype._serialValidatorInstalled) {
        return;
      }
      
      // 保存原始的 doClassValidation_ 方法
      const originalDoClassValidation = Blockly.FieldDropdown.prototype.doClassValidation_;
      
      // 重写 FieldDropdown 的验证方法
      Blockly.FieldDropdown.prototype.doClassValidation_ = function(newValue) {
        // 检查是否是 SERIAL 字段且值为自定义串口
        if (this.name === 'SERIAL') {
          const customPorts = window['customSerialPorts'];
          if (customPorts && customPorts[newValue]) {
            return newValue; // 允许自定义串口值通过验证
          }
        }
        // 否则调用原始验证逻辑
        return originalDoClassValidation ? originalDoClassValidation.call(this, newValue) : newValue;
      };
      
      // 标记已安装
      Blockly.FieldDropdown.prototype._serialValidatorInstalled = true;
    } else {
      // Blockly 还未加载，延迟重试
      setTimeout(tryInstall, 100);
    }
  };
  
  tryInstall();
})();

// 通用的更新所有相关串口块的函数
function updateAllSerialBlocksInWorkspace(customSerialName) {
  try {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) return;
    
    const allBlocks = workspace.getAllBlocks();
    allBlocks.forEach(b => {
      if (b.getField && b.getField('SERIAL')) {
        try {
          updateSerialBlockDropdownWithCustomPorts(b);
          b.render();
        } catch (e) {
          // 忽略已销毁的块
        }
      }
    });
  } catch (e) {
    // 忽略错误
  }
}

// 更新自定义串口配置的辅助函数
function updateCustomSerialConfig(customName, serialPort, rxPin, txPin, baudRate) {
  try {
    // 检查配置是否已更改（参考IIC实现）
    let configChanged = true;
    
    if (window['customSerialPorts'] && window['customSerialPorts'][customName]) {
      const existingConfig = window['customSerialPorts'][customName];
      
      if (existingConfig.serialPort === serialPort && 
          existingConfig.rxPin === rxPin && 
          existingConfig.txPin === txPin && 
          existingConfig.baudRate === baudRate) {
        configChanged = false;
      }
    }
    
    // 只有当配置确实变化时才更新
    if (configChanged) {
      if (!window['customSerialPorts']) {
        window['customSerialPorts'] = {};
      }
      if (!window['customSerialConfigs']) {
        window['customSerialConfigs'] = {};
      }
      
      window['customSerialPorts'][customName] = {
        serialPort: serialPort,
        rxPin: rxPin,
        txPin: txPin,
        baudRate: baudRate
      };
      window['customSerialConfigs'][customName] = true;
      
      // 立即更新UI
      updateSerialBlocksWithCustomPorts();
      updateAllSerialBlocksInWorkspace(customName);
    }
  } catch (e) {
    // 忽略错误
  }
}

Blockly.getMainWorkspace().addChangeListener((event) => {
  // 当工作区完成加载时调用
  if (event.type === Blockly.Events.FINISHED_LOADING) {
    loadExistingSerialBlockToToolbox(Blockly.getMainWorkspace());
  }
});

function isAVRCore() {
  const boardConfig = window['boardConfig'];
  return boardConfig && boardConfig.core && boardConfig.core.indexOf('avr') > -1;
}

// 检测是否为ESP32核心
function isESP32Core() {
  const boardConfig = window['boardConfig'];
  return boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1;
}

// 从 uploadParam 中获取 ESP32 芯片型号
function getESP32ChipType() {
  try {
    const boardConfig = window['boardConfig'];
    if (!boardConfig || !boardConfig.uploadParam) {
      return null;
    }
    
    // 解析 uploadParam，例如: "esptool --chip esp32s3"
    const match = boardConfig.uploadParam.match(/--chip\s+(esp32\w*)/i);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
    
    return null;
  } catch (e) {
    // console.error('获取 ESP32 芯片型号失败:', e);
    return null;
  }
}

// 根据芯片型号获取 UART 数量
function getUARTCountForChip(chipType) {
  if (!chipType) return 3; // 默认返回 3 个 UART
  
  // ESP32 芯片型号对应的 UART 数量
  const uartMap = {
    'esp32': 3,      // ESP32: UART0, UART1, UART2
    'esp32s2': 2,    // ESP32-S2: UART0, UART1
    'esp32s3': 3,    // ESP32-S3: UART0, UART1, UART2
    'esp32c3': 2,    // ESP32-C3: UART0, UART1
    'esp32c6': 3,    // ESP32-C6: UART0, UART1, UART2
    'esp32h2': 3,    // ESP32-H2: UART0, UART1, UART2
    'esp32p4': 6,    // ESP32-P4: UART0-UART5
  };
  
  return uartMap[chipType] || 3; // 默认 3 个
}

// 生成 UART 选项
function generateUARTOptions() {
  const chipType = getESP32ChipType();
  const uartCount = getUARTCountForChip(chipType);
  
  const options = [];
  for (let i = 0; i < uartCount; i++) {
    options.push([`UART${i}`, `UART${i}`]);
  }
  
  return options;
}

function loadExistingSerialBlockToToolbox(workspace) {
  if (!workspace) return;

  // console.log("加载现有Serial块到工具箱");

  // 获取原始工具箱定义
  const originalToolboxDef = workspace.options.languageTree;
  if (!originalToolboxDef) return;

  let toolboxUpdated = false;

  for (let category of originalToolboxDef.contents) {
    // console.log("检查类别:", category);
    if (category.name === "串口" || (category.contents && category.contents[0] && 
        category.contents[0].type && category.contents[0].type.startsWith("serial_"))) {
      // console.log("找到串口类别，共有 %d 个块", category.contents.length);

      // 找到是否有serial_begin_esp32_custom块
      const hasCustomBlock = category.contents.some(block => 
        block.type === "serial_begin_esp32_custom");

      // 检测是否为ESP32核心
      if (!hasCustomBlock && isESP32Core()) {
        // console.log("检测到ESP32核心");

        const serialBeginIndex = category.contents.findIndex(block =>
          block.type === "serial_begin");
        
        const newBlock = {
          "kind": "block",
          "type": "serial_begin_esp32_custom"
        };

        if (serialBeginIndex >= 0) {
          // 在serial_begin块后插入serial_begin_esp32_custom块
          // console.log("在 serial_begin 块后插入 serial_begin_esp32_custom 块");
          category.contents.splice(serialBeginIndex + 1, 0, newBlock);
        } else {
          // 添加 serial_begin_esp32_custom 块到工具箱
          // console.log("添加 serial_begin_esp32_custom 块到工具箱开头");
          category.contents.unshift(newBlock);
        }
        
        toolboxUpdated = true;
        // if (!hasCustomBlock) {
        //   // console.log("添加 serial_begin_esp32_custom 块到工具箱");
        //   category.contents.push({
        //     "kind": "block",
        //     "type": "serial_begin_esp32_custom"
        //   });
        // } else {
        //   // console.log("工具箱中已存在 serial_begin_esp32_custom 块");
        // }
      }

      const hasSoftwareBlock = category.contents.some(block =>
        block.type === "serial_begin_software");

      if (!hasSoftwareBlock && isAVRCore()) {
        // console.log("检测到AVR核心");

        const serialBeginIndex = category.contents.findIndex(block =>
          block.type === "serial_begin");

        const newBlock1 = {
          "kind": "block",
          "type": "serial_begin_software"
        };

        const newBlock2 = {
          "kind": "block",
          "type": "serial_listen_software"
        };

        if (serialBeginIndex >= 0) {
          // 在serial_begin块后插入serial_begin_software块
          // console.log("在 serial_begin 块后插入 serial_begin_software 块");
          category.contents.splice(serialBeginIndex + 1, 0, newBlock1);
          category.contents.splice(serialBeginIndex + 2, 0, newBlock2);
        } else {
          // 添加 serial_begin_software 块到工具箱
          // console.log("添加 serial_begin_software 块到工具箱开头");
          category.contents.unshift(newBlock1);
          category.contents.unshift(newBlock2);
        }

        toolboxUpdated = true;
      }
    }
  }

  // 刷新工具箱显示
  if (toolboxUpdated) {
    // console.log("刷新工具箱显示");
    workspace.updateToolbox(originalToolboxDef);
  }

}

// 跟踪已初始化的串口
// 在每次代码生成时重置跟踪状态
if (!Arduino.serialCodeGeneration) {
  Arduino.serialCodeGeneration = true;
  
  // 保存原始的代码生成方法
  const originalWorkspaceToCode = Arduino.workspaceToCode;
  
  // 重写代码生成方法以在开始时重置串口跟踪
  Arduino.workspaceToCode = function(workspace) {
    // 重置串口初始化跟踪
    Arduino.initializedSerialPorts = new Set();
    Arduino.addedSerialInitCode = new Set();
    
    // 调用原始方法
    return originalWorkspaceToCode ? originalWorkspaceToCode.call(this, workspace) : '';
  };
}

if (!Arduino.initializedSerialPorts) {
  Arduino.initializedSerialPorts = new Set();
}

if (!Arduino.addedSerialInitCode) {
  Arduino.addedSerialInitCode = new Set();
}

Arduino.forBlock["serial_begin"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  const speed = block.getFieldValue("SPEED");
  
  ensureSerialBegin(obj, generator, speed);
  
  // 标记这个串口为已初始化
  Arduino.initializedSerialPorts.add(obj);
  Arduino.addedSerialInitCode.add(obj);
  
  // generator.addSetupBegin(`serial_${obj}_begin`, `${obj}.begin(${speed});`);
  return ``;
};

Arduino.forBlock["serial_print"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  const content = Arduino.valueToCode(block, "VAR", Arduino.ORDER_ATOMIC);
  // 如果没有初始化过这个串口，自动添加默认初始化
  ensureSerialBegin(obj, generator);
  return `${obj}.print(${content});\n`;
};

Arduino.forBlock["serial_println"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  const content = Arduino.valueToCode(block, "VAR", Arduino.ORDER_ATOMIC);
  ensureSerialBegin(obj, generator);
  return `${obj}.println(${content});\n`;
};

Arduino.forBlock["serial_read"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  const type = block.getFieldValue("TYPE");
  ensureSerialBegin(obj, generator);
  return [`${obj}.${type}`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["serial_read_until"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  const terminator = Arduino.valueToCode(block, "TERMINATOR", Arduino.ORDER_ATOMIC);
  ensureSerialBegin(obj, generator);
  return [`${obj}.readStringUntil(${terminator})`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["serial_available"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  ensureSerialBegin(obj, generator);
  return [`${obj}.available()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["serial_flush"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  ensureSerialBegin(obj, generator);
  return `${obj}.flush();\n`;
};

Arduino.forBlock["serial_parseint"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  ensureSerialBegin(obj, generator);
  return [`${obj}.parseInt()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["serial_write"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  const data =
    Arduino.valueToCode(block, "DATA", Arduino.ORDER_ATOMIC) || '\"\"';
  ensureSerialBegin(obj, generator);
  return `${obj}.write(${data});\n`;
};

Arduino.forBlock["serial_read_string"] = function (block, generator) {
  const obj = block.getFieldValue("SERIAL");
  ensureSerialBegin(obj, generator);
  return [`${obj}.readString()`, Arduino.ORDER_FUNCTION_CALL];
};

// 注册 serial_begin_esp32_custom 块的扩展，用于动态更新 UART 选项
if (typeof Blockly !== 'undefined' && Blockly.Extensions) {
  try {
    // 检查并移除已存在的扩展
    if (Blockly.Extensions.isRegistered && Blockly.Extensions.isRegistered('serial_begin_esp32_custom_extension')) {
      Blockly.Extensions.unregister('serial_begin_esp32_custom_extension');
    }

    if (Blockly.Extensions.isRegistered && Blockly.Extensions.isRegistered('serial_begin_software_extension')) {
      Blockly.Extensions.unregister('serial_begin_software_extension');
    }
    
    // 注册扩展
    Blockly.Extensions.register('serial_begin_esp32_custom_extension', function() {
      // 检查块是否在 flyout 中
      if (this.isInFlyout) {
        return;
      }
      
      try {
        // 立即同步注册自定义串口配置（确保加载时配置就绪）
        const varName = this.getFieldValue('VAR') || 'SerialCustom';
        const serialPort = this.getFieldValue('UART') || 'UART0';
        const rxPin = this.getFieldValue('RX') || '0';
        const txPin = this.getFieldValue('TX') || '0';
        const baudrate = this.getFieldValue('SPEED') || '9600';
        
        if (!window['customSerialPorts']) {
          window['customSerialPorts'] = {};
        }
        if (!window['customSerialConfigs']) {
          window['customSerialConfigs'] = {};
        }
        
        window['customSerialPorts'][varName] = {
          serialPort: serialPort,
          rxPin: rxPin,
          txPin: txPin,
          baudRate: baudrate
        };
        window['customSerialConfigs'][varName] = true;
      } catch (e) {
        // 忽略错误
      }
      
      setTimeout(() => {
        try {
          const uartField = this.getField('UART');
          if (uartField) {
            // 获取动态 UART 选项
            const uartOptions = generateUARTOptions();

            // console.log('更新 UART 下拉框选项:', uartOptions);
            
            // 更新下拉框选项
            uartField.menuGenerator_ = uartOptions;
            uartField.getOptions = function() {
              return uartOptions;
            };
            
            // 获取当前值
            const currentValue = uartField.getValue();
            
            // 检查当前值是否在新选项中
            const matchingOption = uartOptions.find(([text, value]) => value === currentValue);
            
            if (currentValue && matchingOption) {
              // 当前值有效，保持不变
              uartField.setValue(currentValue);
            } else if (uartOptions.length > 0) {
              // 当前值无效，设置为第一个选项
              uartField.setValue(uartOptions[0][1]);
            }
          }
          
          // 更新UI显示
          updateSerialBlocksWithCustomPorts();
          addSerialInputChangeListener(this);
        } catch (e) {
          // console.error('初始化 UART 下拉框失败:', e);
        }
      }, 50);
    });

    Blockly.Extensions.register('serial_begin_software_extension', function() {
      // 检查块是否在 flyout 中
      if (this.isInFlyout) {
        return;
      }

      try {
        // 立即同步注册自定义串口配置（确保加载时配置就绪）
        const varName = this.getFieldValue('VAR') || 'SerialSoftware';
        const rxPin = this.getFieldValue('RX') || '0';
        const txPin = this.getFieldValue('TX') || '0';
        const baudrate = this.getFieldValue('SPEED') || '9600';

        if (!window['customSerialPorts']) {
          window['customSerialPorts'] = {};
        }
        if (!window['customSerialConfigs']) {
          window['customSerialConfigs'] = {};
        }

        window['customSerialPorts'][varName] = {
          serialPort: 'SoftwareSerial',
          rxPin: rxPin,
          txPin: txPin,
          baudRate: baudrate
        };
        window['customSerialConfigs'][varName] = true;
      } catch (e) {
        // 忽略错误
      }

      setTimeout(() => {
        updateSerialBlocksWithCustomPorts();
        addSerialSoftwareInputChangeListener(this);
      }, 50);
    });
  } catch (e) {
    // console.error('注册 serial_begin_esp32_custom_extension 扩展失败:', e);
  }
}

Arduino.forBlock["serial_begin_esp32_custom"] = function (block, generator) {
  // 设置变量重命名监听
  if (!block._esp32VarMonitorAttached) {
    block._esp32VarMonitorAttached = true;
    block._esp32VarLastName = block.getFieldValue("VAR") || 'SerialCustom';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._esp32VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'Serial');
          block._esp32VarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue("VAR") || 'SerialCustom';
  const serialPort = block.getFieldValue("UART");
  const baudrate = block.getFieldValue("SPEED");
  const rxPin = block.getFieldValue("RX");
  const txPin = block.getFieldValue("TX");

  // 动态更新自定义串口配置
  updateCustomSerialConfig(varName, serialPort, rxPin, txPin, baudrate);

  // 从串口名称中提取端口号 (Serial=0, Serial1=1, Serial2=2, etc.)
  let port = 0;
  if (serialPort && serialPort.startsWith("UART")) {
    const match = serialPort.match(/UART(\d*)/);
    if (match && match[1]) {
      port = parseInt(match[1]);
    }
  }
  
  // 生成ESP32 HardwareSerial初始化代码
  generator.addLibrary('HardwareSerial', '#include <HardwareSerial.h>');
  generator.addObject(varName, `HardwareSerial ${varName}(${port});`);
  
  let code = `${varName}.begin(${baudrate}, SERIAL_8N1, ${rxPin}, ${txPin});\n`;
  generator.addSetupBegin(`serial_${varName}_begin`, code);

  Arduino.initializedSerialPorts.add(varName);
  Arduino.addedSerialInitCode.add(varName);

  return '';
}

Arduino.forBlock["serial_begin_software"] = function (block, generator) {
  // 设置变量重命名监听
  if (!block._softwareVarMonitorAttached) {
    block._softwareVarMonitorAttached = true;
    block._softwareVarLastName = block.getFieldValue("VAR") || 'mySerial';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._softwareVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'Serial');
          block._softwareVarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue("VAR") || 'mySerial';
  const baudrate = block.getFieldValue("SPEED");
  const rxPin = block.getFieldValue("RX");
  const txPin = block.getFieldValue("TX");

  updateCustomSerialConfig(varName, "softwareSerial", rxPin, txPin, baudrate);

  generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
  generator.addObject(varName, `SoftwareSerial ${varName}(${rxPin}, ${txPin});`);

  let code = `${varName}.begin(${baudrate});\n`;
  generator.addSetupBegin(`serial_${varName}_begin`, code);

  Arduino.initializedSerialPorts.add(varName);
  Arduino.addedSerialInitCode.add(varName);

  return '';
}

Arduino.forBlock["serial_listen_software"] = function (block, generator) {
  const varName = block.getFieldValue("VAR") || 'mySerial';
  return `${varName}.listen();\n`;
};

// 辅助函数，确保串口已被初始化
function ensureSerialBegin(serialPort, generator, baudrate = 9600) {
  // 检查是否是自定义串口，如果是则跳过默认初始化
  const customSerialPorts = window['customSerialPorts'];
  if (customSerialPorts && customSerialPorts[serialPort]) {
    // 这是一个自定义串口，已通过serial_begin_esp32_custom初始化，跳过
    return;
  }
  
  // 检查这个串口是否已经添加过初始化代码（无论是用户设置的还是默认的）
  if (!Arduino.addedSerialInitCode.has(serialPort) || baudrate != 9600) {
    // console.log(`Adding default serial initialization for ${serialPort} at ${baudrate} baud.`);
    // 只有在没有添加过任何初始化代码时才添加默认初始化
    generator.addSetupBegin(`serial_${serialPort}_begin`, `${serialPort}.begin(${baudrate});`);
    // 标记为已添加初始化代码
    Arduino.addedSerialInitCode.add(serialPort);
  } else {
    // console.log(`Serial port ${serialPort} already initialized.`);
  }
}

// 简化的串口块初始化函数
function initializeSerialBlock(block) {
  try {
    // 检查block是否有SERIAL字段
    const serialField = block.getField('SERIAL');
    if (!serialField) return;
    
    // 先立即同步更新一次（不等待，确保加载时配置就绪）
    const currentValue = serialField.getValue();
    updateSerialBlockDropdownWithCustomPorts(block);
    
    // 如果当前值存在且看起来是自定义串口名称，强制保留它
    if (currentValue) {
      try {
        // 重新获取选项并验证
        const boardConfig = window['boardConfig'];
        if (boardConfig) {
          const options = generateSerialPortOptionsWithCustom(boardConfig);
          const matchingOption = options.find(([text, value]) => value === currentValue);
          
          // 如果找到匹配选项，确保设置正确
          if (matchingOption) {
            serialField.setValue(currentValue);
          }
        }
      } catch (e) {
        // 忽略错误
      }
    }
    
    // 延迟初始化，等待boardConfig加载（用于UI更新）
    setTimeout(() => {
      updateSerialBlockDropdownWithCustomPorts(block);
      
      const boardConfig = window['boardConfig'];
      if (boardConfig && boardConfig.serialPort && boardConfig.serialPort.length > 0) {
        const savedValue = serialField.getValue();
        
        // 检查当前值是否在选项列表中
        const options = generateSerialPortOptionsWithCustom(boardConfig);
        const matchingOption = options.find(([text, value]) => value === savedValue);
        
        // 只有在没有当前值或当前值无效的情况下才设置默认值
        if (!savedValue || !matchingOption) {
          try {
            serialField.setValue(boardConfig.serialPort[0][1]);
          } catch (e) {
            // 如果设置失败，可能是因为选项尚未正确加载
            // 稍后在updateSerialBlockDropdownWithCustomPorts中会再次尝试
          }
        }
      }
    }, 100);
  } catch (e) {
    // 忽略错误
  }
}

// 串口块扩展注册
function addSerialCustomPortExtensions() {
  if (typeof Blockly === 'undefined' || !Blockly.Extensions) return;
  
  try {
    // 所有需要支持自定义串口显示的串口block类型
    const serialBlockTypes = [
      'serial_begin',
      'serial_available',
      'serial_read',
      'serial_read_until',
      'serial_print',
      'serial_println',
      'serial_write',
      'serial_read_string',
      'serial_begin_esp32_custom',
      'serial_begin_software'
    ];

    // 为每种block类型注册扩展
    serialBlockTypes.forEach(blockType => {
      const extensionName = blockType + '_custom_port';
      
      // 先检查扩展是否存在，如果存在则先取消注册
      if (Blockly.Extensions.isRegistered && Blockly.Extensions.isRegistered(extensionName)) {
        Blockly.Extensions.unregister(extensionName);
      }
      
      // 注册扩展
      Blockly.Extensions.register(extensionName, function() {
        setTimeout(() => {
          initializeSerialBlock(this);
          // 为 serial_begin_esp32_custom 添加字段变化监听器
          if (this.type === 'serial_begin_esp32_custom') {
            addSerialInputChangeListener(this);
          }
          // 为 serial_begin_software 添加字段变化监听器
          if (this.type === 'serial_begin_software') {
            addSerialSoftwareInputChangeListener(this);
          }
        }, 50);
      });
    });
  } catch (e) {
    // console.error('[Serial Debug] 扩展注册错误:', e);
  }
}

// 为serial_begin_esp32_custom块添加输入变化监听器
function addSerialInputChangeListener(block) {
  if (!block || block.type !== 'serial_begin_esp32_custom') return;
  
  try {
    // 存储当前自定义名称以便检测变化
    let currentCustomName = block.getFieldValue('VAR') || 'SerialCustom';
    
    // 创建变化监听函数
    const updateSerialInfo = function() {
      const newCustomName = block.getFieldValue('VAR') || 'SerialCustom';
      const serialPort = block.getFieldValue('UART');
      const rxPin = block.getFieldValue('RX');
      const txPin = block.getFieldValue('TX');
      const baudrate = block.getFieldValue('SPEED');
      
      // 检测自定义名称是否已更改
      if (currentCustomName !== newCustomName) {
        // console.log(`Serial VAR名称从 ${currentCustomName} 更改为 ${newCustomName}`);
        // 自定义名称已更改，清理旧的自定义配置
        clearCustomSerialConfig(currentCustomName);
        // 立即执行全面清理，确保旧配置被移除
        setTimeout(() => {
          window.cleanupUnusedCustomSerialPorts();
        }, 10);
        // 更新当前自定义名称记录
        currentCustomName = newCustomName;
      }
      
      // 更新自定义串口配置
      if (newCustomName && serialPort && rxPin && txPin && baudrate) {
        updateCustomSerialConfig(newCustomName, serialPort, rxPin, txPin, baudrate);
      }
    };
    
    // 为block添加变化监听器
    if (block.workspace) {
      const changeListener = function(event) {
        // 监听块变化、字段变化
        if ((event.type === Blockly.Events.CHANGE) && 
            (event.blockId === block.id)) {
          
          // 特别检查各个字段变化
          if (event.element === 'field' && 
              (event.name === 'VAR' || event.name === 'UART' || 
               event.name === 'RX' || event.name === 'TX' || event.name === 'SPEED')) {
            // VAR变化特殊处理：立即清理旧配置并更新UI
            if (event.name === 'VAR') {
              const oldName = currentCustomName;
              const newName = block.getFieldValue('VAR') || 'SerialCustom';
              
              if (oldName !== newName) {
                // console.log(`Serial VAR变化: ${oldName} -> ${newName}`);
                // 立即清理旧配置
                clearCustomSerialConfig(oldName);
                // 立即执行全面清理
                setTimeout(() => {
                  window.cleanupUnusedCustomSerialPorts();
                }, 5);
              }
            }
            // 延迟执行以确保字段值已更新
            setTimeout(updateSerialInfo, 10);
          }
        }
      };
      
      block.workspace.addChangeListener(changeListener);
      
      // 存储原始的dispose方法引用
      const originalDispose = block.dispose;
      
      // 重写dispose方法
      block.dispose = function(healStack) {
        // 清除自定义串口配置
        try {
          const customName = this.getFieldValue('VAR') || 'SerialCustom';
          
          // 延迟清理，确保块完全销毁后再检查
          setTimeout(() => {
            clearCustomSerialConfig(customName);
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
            const customName = block.getFieldValue('VAR') || 'SerialCustom';
            setTimeout(() => {
              clearCustomSerialConfig(customName);
            }, 100);
          } catch (e) {
            // 忽略错误
          }
        }
      };
      
      block.workspace.addChangeListener(deleteListener);
      
      // 初始化时调用一次
      setTimeout(updateSerialInfo, 50);
    }
  } catch (e) {
    // 忽略错误
  }
}

// 为serial_begin_software块添加输入变化监听器
function addSerialSoftwareInputChangeListener(block) {
  if (!block || block.type !== 'serial_begin_software') return;
  
  try {
    // 存储当前自定义名称以便检测变化
    let currentCustomName = block.getFieldValue('VAR') || 'SerialSoftware';
    
    // 创建变化监听函数
    const updateSerialInfo = function() {
      const newCustomName = block.getFieldValue('VAR') || 'SerialSoftware';
      const rxPin = block.getFieldValue('RX');
      const txPin = block.getFieldValue('TX');
      const baudrate = block.getFieldValue('SPEED');
      
      // 检测自定义名称是否已更改
      if (currentCustomName !== newCustomName) {
        // console.log(`Software Serial VAR名称从 ${currentCustomName} 更改为 ${newCustomName}`);
        // 自定义名称已更改，清理旧的自定义配置
        clearCustomSerialConfig(currentCustomName);
        // 立即执行全面清理，确保旧配置被移除
        setTimeout(() => {
          window.cleanupUnusedCustomSerialPorts();
        }, 10);
        // 更新当前自定义名称记录
        currentCustomName = newCustomName;
      }
      
      // 更新自定义串口配置
      if (newCustomName && rxPin && txPin && baudrate) {
        updateCustomSerialConfig(newCustomName, 'SoftwareSerial', rxPin, txPin, baudrate);
      }
    };
    
    // 为block添加变化监听器
    if (block.workspace) {
      const changeListener = function(event) {
        // 监听块变化、字段变化
        if ((event.type === Blockly.Events.CHANGE) && 
            (event.blockId === block.id)) {
          
          // 特别检查各个字段变化
          if (event.element === 'field' && 
              (event.name === 'VAR' || event.name === 'RX' || 
               event.name === 'TX' || event.name === 'SPEED')) {
            // VAR变化特殊处理：立即清理旧配置并更新UI
            if (event.name === 'VAR') {
              const oldName = currentCustomName;
              const newName = block.getFieldValue('VAR') || 'SerialSoftware';
              
              if (oldName !== newName) {
                // console.log(`Software Serial VAR变化: ${oldName} -> ${newName}`);
                // 立即清理旧配置
                clearCustomSerialConfig(oldName);
                // 立即执行全面清理
                setTimeout(() => {
                  window.cleanupUnusedCustomSerialPorts();
                }, 5);
              }
            }
            // 延迟执行以确保字段值已更新
            setTimeout(updateSerialInfo, 10);
          }
        }
      };
      
      block.workspace.addChangeListener(changeListener);
      
      // 存储原始的dispose方法引用
      const originalDispose = block.dispose;
      
      // 重写dispose方法
      block.dispose = function(healStack) {
        // 清除自定义串口配置
        try {
          const customName = this.getFieldValue('VAR') || 'SerialSoftware';
          
          // 延迟清理，确保块完全销毁后再检查
          setTimeout(() => {
            clearCustomSerialConfig(customName);
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
            const customName = block.getFieldValue('VAR') || 'SerialSoftware';
            setTimeout(() => {
              clearCustomSerialConfig(customName);
            }, 100);
          } catch (e) {
            // 忽略错误
          }
        }
      };
      
      block.workspace.addChangeListener(deleteListener);
      
      // 初始化时调用一次
      setTimeout(updateSerialInfo, 50);
    }
  } catch (e) {
    // 忽略错误
  }
}

// 动态更新串口块的下拉菜单，添加自定义串口配置
function updateSerialBlocksWithCustomPorts() {
  try {
    // 检查开发板配置
    const boardConfig = window['boardConfig'];
    if (!boardConfig || !boardConfig.serialPort) {
      return;
    }

    // 使用原始的serialPort配置，避免重复添加自定义串口信息
    const originalSerialPorts = boardConfig.serialPortOriginal || boardConfig.serialPort;
    
    // 创建带自定义串口信息的选项（不修改原始boardConfig）
    const serialPortOptionsWithCustom = generateSerialPortOptionsWithCustom(boardConfig);

    // 备份原始配置并临时更新配置（不修改原始boardConfig）
    if (!boardConfig.serialPortOriginal) {
      boardConfig.serialPortOriginal = [...originalSerialPorts];
    }
    
    // 创建临时配置对象，避免修改原始boardConfig
    const tempConfig = {
      ...boardConfig,
      serialPort: serialPortOptionsWithCustom
    };
    
    // 更新工作区中所有现有的串口块
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      const allBlocks = workspace.getAllBlocks();
      allBlocks.forEach(block => {
        // 扩展到所有包含SERIAL字段的block
        if (block.getField && block.getField('SERIAL')) {
          // 更新下拉菜单选项
          updateSerialBlockDropdownWithCustomPorts(block, tempConfig);
          // 强制重绘以确保UI立即更新
          block.render();
        }
      });
    }
  } catch (e) {
    // 静默处理错误
  }
}

// 生成带自定义串口信息的选项（不修改原始配置）
function generateSerialPortOptionsWithCustom(boardConfig) {
  const originalSerialPorts = boardConfig.serialPortOriginal || boardConfig.serialPort;
  const result = [...originalSerialPorts]; // 复制原始选项
  
  // 添加自定义串口选项
  const customSerialPorts = window['customSerialPorts'];
  if (customSerialPorts) {
    Object.keys(customSerialPorts).forEach(customName => {
      const config = customSerialPorts[customName];
      const displayText = `${customName}(${config.serialPort} RX:${config.rxPin} TX:${config.txPin})`;
      result.push([displayText, customName]);
    });
  }
  
  return result;
}

// 更新单个串口块的下拉菜单选项
function updateSerialBlockDropdownWithCustomPorts(block, config) {
  try {
    // 检查block是否有SERIAL字段
    if (!block || !block.getField || !block.getField('SERIAL')) return;
    
    const boardConfig = config || window['boardConfig'];
    if (!boardConfig || !boardConfig.serialPort) {
      return;
    }
    
    const serialField = block.getField('SERIAL');
    if (!serialField) return;
    
    const optionsWithCustom = generateSerialPortOptionsWithCustom(boardConfig);
    const currentValue = serialField.getValue();

    // 更新下拉菜单选项
    if (optionsWithCustom.length > 0) {
      // 更新字段的选项生成器
      serialField.menuGenerator_ = optionsWithCustom;
      serialField.getOptions = function() {
        return optionsWithCustom;
      };

      // 检查当前值是否在新的选项列表中
      const matchingOption = optionsWithCustom.find(([text, value]) => value === currentValue);

      if (currentValue && matchingOption) {
        // 强制调用 setValue 刷新 UI
        serialField.setValue(currentValue);
      } else {
        // 当前值无效，设置为第一个选项
        serialField.setValue(optionsWithCustom[0][1]);
      }
    }
  } catch (e) {
    // console.error('[Serial Debug] 更新下拉选项时出错:', e);
  }
}

// 清除指定自定义串口的配置
function clearCustomSerialConfig(customName) {
  try {
    let configChanged = false;
    
    if (window['customSerialPorts'] && window['customSerialPorts'][customName]) {
      delete window['customSerialPorts'][customName];
      configChanged = true;
    }
    if (window['customSerialConfigs'] && window['customSerialConfigs'][customName]) {
      delete window['customSerialConfigs'][customName];
      configChanged = true;
    }
    
    // 只有配置真的改变了才更新UI
    if (configChanged) {
      // 立即更新UI，恢复默认串口显示
      updateSerialBlocksWithCustomPorts();
      
      // 只更新使用这个特定串口实例的块（参考IIC，不调用render）
      const workspace = Blockly.getMainWorkspace();
      if (workspace) {
        setTimeout(() => {
          const allBlocks = workspace.getAllBlocks();
          allBlocks.forEach(b => {
            if (b.getField && b.getField('SERIAL')) {
              try {
                const blockSerial = b.getFieldValue('SERIAL');
                // 只更新使用被删除的 customName 的块
                if (blockSerial === customName) {
                  updateSerialBlockDropdownWithCustomPorts(b);
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
window.updateSerialCustomPorts = function() {
  updateSerialBlocksWithCustomPorts();
};

// 清理未使用的自定义串口配置 - 优化版，检查所有串口相关块的VAR名称
window.cleanupUnusedCustomSerialPorts = function() {
  try {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace || !window['customSerialPorts']) return;
    
    const allBlocks = workspace.getAllBlocks();
    const usedCustomNames = new Set();
    const activeSerialNames = new Set();
    
    // 收集所有串口相关块中使用的VAR/SERIAL名称
    allBlocks.forEach(block => {
      try {
        // 1. serial_begin_esp32_custom块的VAR字段
        if (block.type === 'serial_begin_esp32_custom') {
          const customName = block.getFieldValue('VAR');
          if (customName) {
            usedCustomNames.add(customName);
            activeSerialNames.add(customName);
          }
        }
        else if (block.type === 'serial_begin_software') {
          const customName = block.getFieldValue('VAR');
          if (customName) {
            usedCustomNames.add(customName);
            activeSerialNames.add(customName);
          }
        }
        // 2. 其他serial块的SERIAL下拉字段
        else if (block.getField && block.getField('SERIAL')) {
          const serialName = block.getFieldValue('SERIAL');
          if (serialName) {
            activeSerialNames.add(serialName);
          }
        }
      } catch (e) {
        // 忽略错误（可能是正在销毁的块）
      }
    });
    
    // 清理未使用的自定义配置
    const customPorts = window['customSerialPorts'];
    const customConfigs = window['customSerialConfigs'];
    
    let configChanged = false;
    
    // 检查每个自定义串口配置是否仍在使用中
    Object.keys(customPorts).forEach(customName => {
      // 如果这个自定义名称不在任何活跃的串口块中使用，则删除它
      if (!activeSerialNames.has(customName)) {
        delete customPorts[customName];
        if (customConfigs) {
          delete customConfigs[customName];
        }
        configChanged = true;
      }
    });
    
    // 如果有配置变化，更新UI
    if (configChanged) {
      updateSerialBlocksWithCustomPorts();
      setTimeout(() => updateAllSerialBlocksInWorkspace(), 100);
    }
  } catch (e) {
    // 忽略错误
  }
};

// 监听工作区变化，在工作区加载完成后更新串口信息
if (typeof Blockly !== 'undefined') {
  // 立即注册扩展
  addSerialCustomPortExtensions();

  // 添加工作区变化监听器
  const addSerialBlocksListener = function(event) {
    // 在块创建时立即注册自定义串口配置
    if (event.type === Blockly.Events.BLOCK_CREATE) {
      try {
        const workspace = Blockly.getMainWorkspace();
        if (!workspace) return;
        
        const block = workspace.getBlockById(event.blockId);
        if (block && block.type === 'serial_begin_esp32_custom') {
          const varName = block.getFieldValue('VAR') || 'SerialCustom';
          const serialPort = block.getFieldValue('UART') || 'UART0';
          const rxPin = block.getFieldValue('RX') || '0';
          const txPin = block.getFieldValue('TX') || '0';
          const baudrate = block.getFieldValue('SPEED') || '9600';
          
          if (!window['customSerialPorts']) {
            window['customSerialPorts'] = {};
          }
          if (!window['customSerialConfigs']) {
            window['customSerialConfigs'] = {};
          }
          
          window['customSerialPorts'][varName] = {
            serialPort: serialPort,
            rxPin: rxPin,
            txPin: txPin,
            baudRate: baudrate
          };
          window['customSerialConfigs'][varName] = true;
          
          // 立即更新所有串口块的下拉选项
          updateSerialBlocksWithCustomPorts();
        } else if (block && block.type === 'serial_begin_software') {
          const varName = block.getFieldValue('VAR') || 'SerialSoftware';
          const rxPin = block.getFieldValue('RX') || '0';
          const txPin = block.getFieldValue('TX') || '0';
          const baudrate = block.getFieldValue('SPEED') || '9600';

          if (!window['customSerialPorts']) {
            window['customSerialPorts'] = {};
          }
          if (!window['customSerialConfigs']) {
            window['customSerialConfigs'] = {};
          }

          window['customSerialPorts'][varName] = {
            serialPort: 'SoftwareSerial',
            rxPin: rxPin,
            txPin: txPin,
            baudRate: baudrate
          };
          window['customSerialConfigs'][varName] = true;

          // 立即更新所有串口块的下拉选项
          updateSerialBlocksWithCustomPorts();
        }
      } catch (e) {
        // 忽略错误
      }
    }
    
    // 当工作区完成加载时调用
    if (event.type === Blockly.Events.FINISHED_LOADING) {
      setTimeout(() => {
        // 清理残留的自定义配置
        if (window['customSerialPorts']) {
          window['customSerialPorts'] = {};
        }
        if (window['customSerialConfigs']) {
          window['customSerialConfigs'] = {};
        }
        
        // 扫描工作区中所有的 serial_begin_esp32_custom 块，预先注册配置
        const workspace = Blockly.getMainWorkspace();
        if (workspace) {
          const allBlocks = workspace.getAllBlocks();
          allBlocks.forEach(block => {
            if (block.type === 'serial_begin_esp32_custom') {
              try {
                const varName = block.getFieldValue('VAR') || 'SerialCustom';
                const serialPort = block.getFieldValue('UART') || 'UART0';
                const rxPin = block.getFieldValue('RX') || '0';
                const txPin = block.getFieldValue('TX') || '0';
                const baudrate = block.getFieldValue('SPEED') || '9600';
                
                if (!window['customSerialPorts']) {
                  window['customSerialPorts'] = {};
                }
                if (!window['customSerialConfigs']) {
                  window['customSerialConfigs'] = {};
                }
                
                window['customSerialPorts'][varName] = {
                  serialPort: serialPort,
                  rxPin: rxPin,
                  txPin: txPin,
                  baudRate: baudrate
                };
                window['customSerialConfigs'][varName] = true;
              } catch (e) {
                // 忽略错误
              }
            } else if (block.type === 'serial_begin_software') {
              try {
                const varName = block.getFieldValue('VAR') || 'SerialSoftware';
                const rxPin = block.getFieldValue('RX') || '0';
                const txPin = block.getFieldValue('TX') || '0';
                const baudrate = block.getFieldValue('SPEED') || '9600';

                if (!window['customSerialPorts']) {
                  window['customSerialPorts'] = {};
                }
                if (!window['customSerialConfigs']) {
                  window['customSerialConfigs'] = {};
                }

                window['customSerialPorts'][varName] = {
                  serialPort: 'SoftwareSerial',
                  rxPin: rxPin,
                  txPin: txPin,
                  baudRate: baudrate
                };
                window['customSerialConfigs'][varName] = true;
              } catch (e) {
                // 忽略错误
              }
            }
          });
        }
        
        // 更新串口信息
        updateSerialBlocksWithCustomPorts();
      }, 200);
    }
    
    // 监听块删除事件，清理自定义串口配置
    if (event.type === Blockly.Events.BLOCK_DELETE) {
      try {
        // 检查删除的是否是serial_begin_esp32_custom块
        if (event.oldXml) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(event.oldXml, "text/xml");
          const blockElement = xmlDoc.querySelector('block');
          
          if (blockElement && blockElement.getAttribute('type') === 'serial_begin_esp32_custom') {
            // 从XML中提取自定义串口名称信息
            const varField = xmlDoc.querySelector('field[name="VAR"]');
            const customName = varField ? varField.textContent || 'SerialCustom' : 'SerialCustom';
            
            // 延迟清理，确保删除操作完成
            setTimeout(() => {
              clearCustomSerialConfig(customName);
              window.cleanupUnusedCustomSerialPorts();
            }, 50);
          } else if (blockElement && blockElement.getAttribute('type') === 'serial_begin_software') {
            // 从XML中提取自定义串口名称信息
            const varField = xmlDoc.querySelector('field[name="VAR"]');
            const customName = varField ? varField.textContent || 'SerialSoftware' : 'SerialSoftware';

            // 延迟清理，确保删除操作完成
            setTimeout(() => {
              clearCustomSerialConfig(customName);
              window.cleanupUnusedCustomSerialPorts();
            }, 50);
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
        workspace.addChangeListener(addSerialBlocksListener);
      } else {
        // 如果工作区还未创建，延迟添加监听器
        setTimeout(() => {
          const delayedWorkspace = Blockly.getMainWorkspace();
          if (delayedWorkspace) {
            delayedWorkspace.addChangeListener(addSerialBlocksListener);
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
  setTimeout(() => {
    updateSerialBlocksWithCustomPorts();
  }, 200);
}

// 强制重置所有自定义串口配置
window.forceResetCustomSerialPorts = function() {
  try {
    // 清空所有自定义配置
    if (window['customSerialPorts']) {
      window['customSerialPorts'] = {};
    }
    if (window['customSerialConfigs']) {
      window['customSerialConfigs'] = {};
    }
    
    // 立即更新UI
    updateSerialBlocksWithCustomPorts();
    updateAllSerialBlocksInWorkspace();
  } catch (e) {
    // 忽略错误
  }
};

// 强制重新验证所有自定义串口配置
window.validateAllCustomSerialPorts = function() {
  try {
    window.cleanupUnusedCustomSerialPorts();
  } catch (e) {
    // 忽略错误
  }
};

