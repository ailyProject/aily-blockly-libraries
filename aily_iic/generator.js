/**
 * Wire (I2C) library for Arduino - Combined generator code for Blockly
 */

// 通用库管理函数，确保不重复添加库
function ensureLibrary(generator, libraryKey, libraryCode) {
  if (!generator.libraries_) {
    generator.libraries_ = {};
  }
  if (!generator.libraries_[libraryKey]) {
    generator.addLibrary(libraryKey, libraryCode);
  }
}

// 通用添加Wire库代码，确保不会重复添加
function ensureWireLibrary(generator) {
  ensureLibrary(generator, 'wire', '#include <Wire.h>');
}

// 通用的获取ADDRESS值函数，避免重复代码
function getAddressValue(block, generator, defaultValue = '8') {
  try {
    if (block.getInput('ADDRESS')) {
      return generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || defaultValue;
    }
  } catch (e) {
    // 忽略错误
  }
  return defaultValue;
}

// 通用的更新所有相关I2C块的函数
function updateAllWireBlocksInWorkspace(wire) {
  try {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) return;
    
    const allBlocks = workspace.getAllBlocks();
    allBlocks.forEach(b => {
      if (b.getField && b.getField('WIRE')) {
        try {
          const blockWire = b.getFieldValue('WIRE');
          if (!wire || blockWire === wire) {
            updateBlockDropdownWithPinInfo(b);
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

// 更新自定义引脚配置的辅助函数
function updateCustomPinConfig(wire, sdaValue, sclValue) {
  try {
    // 检查引脚值是否已更改
    let pinsChanged = true;
    
    if (window['customI2CPins'] && window['customI2CPins'][wire]) {
      const existingPins = window['customI2CPins'][wire];
      const existingSda = existingPins.find(p => p[0] === 'SDA');
      const existingScl = existingPins.find(p => p[0] === 'SCL');
      
      if (existingSda && existingScl && 
          existingSda[1] === sdaValue && existingScl[1] === sclValue) {
        pinsChanged = false;
      }
    }
    
    // 只有当引脚值确实变化时才更新
    if (pinsChanged) {
      if (!window['customI2CPins']) {
        window['customI2CPins'] = {};
      }
      if (!window['customI2CWires']) {
        window['customI2CWires'] = {};
      }
      
      window['customI2CPins'][wire] = [
        ['SDA', sdaValue],
        ['SCL', sclValue]
      ];
      window['customI2CWires'][wire] = true;
      
      // 立即更新UI
      updateI2CBlocksWithPinInfo();
      updateAllWireBlocksInWorkspace(wire);
    }
  } catch (e) {
    // 忽略错误
  }
}

// // 确保Serial已初始化，兼容core-serial的去重机制
// function ensureSerialBegin(serialPort, generator) {
//   // 初始化Arduino的Serial相关全局变量，兼容core-serial
//   if (!Arduino.addedSerialInitCode) {
//     Arduino.addedSerialInitCode = new Set();
//   }
  
//   // 检查这个串口是否已经添加过初始化代码（无论是用户设置的还是默认的）
//   if (!Arduino.addedSerialInitCode.has(serialPort)) {
//     // 只有在没有添加过任何初始化代码时才添加默认初始化
//     generator.addSetupBegin(`serial_${serialPort}_begin`, `${serialPort}.begin(9600);`);
//     // 标记为已添加初始化代码
//     Arduino.addedSerialInitCode.add(serialPort);
//   }
// }

/**
 * Wire.begin() / Wire.begin(address)
 * 根据模式字段生成不同的代码：
 * - 主模式 (MASTER): Wire.begin() - 无参数版本
 * - 从模式 (SLAVE): Wire.begin(address) - 仅地址参数版本
 * 从模式下的地址输入由 wire_begin_mutator 扩展动态添加
 */
Arduino.forBlock['wire_begin'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var mode = block.getFieldValue('MODE');
  
  // 获取引脚注释信息
  var pinComment = '';
  try {
    let pins = null;
    const customPins = window['customI2CPins'];
    if (customPins && customPins[wire]) {
      pins = customPins[wire];
    } else {
      const boardConfig = window['boardConfig'];
      if (boardConfig && boardConfig.i2cPins && boardConfig.i2cPins[wire]) {
        pins = boardConfig.i2cPins[wire];
      }
    }
    if (pins) {
      const sdaPin = pins.find(pin => pin[0] === 'SDA');
      const sclPin = pins.find(pin => pin[0] === 'SCL');
      if (sdaPin && sclPin) {
        pinComment = '  // ' + wire + ': SDA=' + sdaPin[1] + ', SCL=' + sclPin[1] + '\n  ';
      }
    }
  } catch (e) {
    // 忽略引脚注释生成错误
  }

  // 根据模式生成不同的代码
  var code = '';
  // var setupKey = 'wire_begin_' + wire;
  
  if (mode === 'SLAVE') {
    // 从模式：Wire.begin(address) - 使用默认引脚
    var address = getAddressValue(block, generator);
    
    code = wire + '.begin(' + address + '); // 从设备模式 设备地址: ' + address + '\n';
    // setupKey = 'wire_begin_' + wire + '_slave_' + address;
  } else {
    // 主模式：Wire.begin()
    code = wire + '.begin(); // 主设备模式\n';
    // setupKey = 'wire_begin_' + wire + '_master';
  }
  
  // 组合最终代码并添加到setup部分
  var fullCode = pinComment + code;
  if (!generator.setupCodes_ || !generator.setupCodes_[`wire_${wire}_begin`]) {
    generator.addSetup(`wire_${wire}_begin`, fullCode);
  }
  
  return '';
};

/**
 * Wire.setClock(frequency)
 */
Arduino.forBlock['wire_set_clock'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var frequency = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC);
  return wire + '.setClock(' + frequency + ');\n';
};

/**
 * Wire.begin(sda, scl) / Wire.begin(address, sda, scl) for ESP32
 * 根据模式字段生成不同的代码：
 * - 主模式 (MASTER): Wire.begin(sda, scl)
 * - 从模式 (SLAVE): Wire.begin(address, sda, scl)
 * 从模式下的地址输入由 wire_begin_with_settings_mutator 扩展动态添加
 */
Arduino.forBlock['wire_begin_with_settings'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var mode = block.getFieldValue('MODE');
  var sda = generator.valueToCode(block, 'SDA', generator.ORDER_ATOMIC);
  var scl = generator.valueToCode(block, 'SCL', generator.ORDER_ATOMIC);
  
  // 添加引脚注释
  var pinComment = '  // ' + wire + ': SDA=' + sda + ', SCL=' + scl + ' (custom)';
  var code = '';
  var setupKey = '';
  
  // 根据模式生成不同的代码
  if (mode === 'SLAVE') {
    // 从模式：Wire.begin(address, sda, scl) - 从设备模式下参数顺序为地址在前
    var address = getAddressValue(block, generator);

    code = pinComment + ' 从设备模式 设备地址: ' + address + '\n  ' + wire + '.begin(' + address + ', ' + sda + ', ' + scl + ');\n';
    // setupKey = `wire_${wire}_begin_slave_${address}_${sda}_${scl}`;
  } else {
    // 主模式：Wire.begin(sda, scl)
    code = pinComment + ' 主设备模式\n  ' + wire + '.begin(' + sda + ', ' + scl + ');\n';
    // setupKey = 'wire_begin_' + wire + '_' + sda + '_' + scl + '_master';
  }
  
  // 为每个Wire实例使用基础的setupKey，避免与wire_begin冲突
  var baseSetupKey = `wire_${wire}_begin`;
  
  // 检查是否已经初始化过这个Wire实例（任何形式的初始化）
  if (!generator.setupCodes_ || (!generator.setupCodes_[baseSetupKey] && !generator.setupCodes_[setupKey])) {
    generator.addSetup(baseSetupKey, code);
    // 同时标记基础key，防止后续的wire_begin重复初始化
    generator.addSetup(baseSetupKey, '// Wire ' + wire + ' initialized with custom pins\n');
  }
  
  // 动态更新自定义I2C引脚信息，不修改全局boardConfig
  try {
    // 使用独立的自定义引脚配置存储
    if (!window['customI2CPins']) {
      window['customI2CPins'] = {};
    }
    if (!window['customI2CWires']) {
      window['customI2CWires'] = {};
    }
    
    // 存储当前Wire实例的自定义引脚信息
    window['customI2CPins'][wire] = [
      ['SDA', sda],
      ['SCL', scl]
    ];
    window['customI2CWires'][wire] = true;
    
    // 延迟更新UI确保立即生效
    setTimeout(() => {
      updateI2CBlocksWithPinInfo();
      updateAllWireBlocksInWorkspace(wire);
    }, 50);
  } catch (e) {
    // 静默处理错误
  }
  
  return '';
};

/**
 * Wire.beginTransmission(address)
 */
Arduino.forBlock['wire_begin_transmission'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC);
  return wire + '.beginTransmission(' + address + ');\n';
};

/**
 * Wire.write(data) 支持多样参数
 */
Arduino.forBlock['wire_write'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var data = generator.valueToCode(block, 'DATA', generator.ORDER_ATOMIC);
  return wire + '.write(' + data + ');\n';
};

/**
 * Wire.endTransmission()
 */
Arduino.forBlock['wire_end_transmission'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  return wire + '.endTransmission();\n';
};

/**
 * Wire.requestFrom(address, quantity)
 */
Arduino.forBlock['wire_request_from'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC);
  var quantity = generator.valueToCode(block, 'QUANTITY', generator.ORDER_ATOMIC);
  return wire + '.requestFrom(' + address + ', ' + quantity + ');\n';
};

/**
 * Wire.available()
 */
Arduino.forBlock['wire_available'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  return [wire + '.available()', generator.ORDER_FUNCTION_CALL];
};

/**
 * Wire.read()
 */
Arduino.forBlock['wire_read'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  return [wire + '.read()', generator.ORDER_FUNCTION_CALL];
};

/**
 * 获取Wire对象引用
 * 返回Wire对象名称，可以用在需要Wire实例的函数或表达式中
 */
Arduino.forBlock['wire_variables'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  // 返回Wire对象名称作为表达式
  return [wire, generator.ORDER_ATOMIC];
};

/**
 * Wire.onReceive(function)
 */
Arduino.forBlock['wire_on_receive'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var callback = generator.statementToCode(block, 'CALLBACK');
  
  // 根据Wire实例生成唯一的函数名
  var funName = wire.toLowerCase() + 'ReceiveHandler';
  var funcKey = 'wire_receive_' + wire.toLowerCase();
  
  var funcDef = 'void ' + funName + '(int numBytes) {\n' + callback + '}\n';
  generator.addFunction(funcKey, funcDef);
  var setupFunc = wire + '.onReceive(' + funName + ');\n';
  generator.addSetup('wire_on_receive_' + wire, setupFunc);
  return '';
};

/**
 * Wire.onRequest(function)
 */
Arduino.forBlock['wire_on_request'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var callback = generator.statementToCode(block, 'CALLBACK');
  
  // 根据Wire实例生成唯一的函数名
  var funName = wire.toLowerCase() + 'RequestHandler';
  var funcKey = 'wire_request_' + wire.toLowerCase();
  
  var funcDef = 'void ' + funName + '() {\n' + callback + '}\n';
  generator.addFunction(funcKey, funcDef);
  var setupFunc = wire + '.onRequest(' + funName + ');\n';
  generator.addSetup('wire_on_request_' + wire, setupFunc);
  return '';
};

/**
 * Wire扫描I2C设备
 */
Arduino.forBlock['wire_scan'] = function(block, generator) {
  ensureWireLibrary(generator);
  var wire = block.getFieldValue('WIRE') || 'Wire';
  
  // 确保Serial已初始化（兼容core-serial的去重机制）
  ensureSerialBegin('Serial', generator);
  
  // 生成扫描函数名，确保每个Wire实例有独立的扫描函数
  var scanFuncName = wire.toLowerCase() + 'ScanI2CDevices';
  var funcKey = 'wire_scan_function_' + wire.toLowerCase();
  
  // 创建扫描函数定义
  var funcDef = 'void ' + scanFuncName + '() {\n';
  funcDef += '  int nDevices = 0;\n';
  funcDef += '  int address, error;\n';
  funcDef += '  \n';
  funcDef += '  Serial.println("Scanning for I2C devices ...");\n';
  funcDef += '  for (address = 0x01; address < 0x7f; address++) {\n';
  funcDef += '    ' + wire + '.beginTransmission(address);\n';
  funcDef += '    error = ' + wire + '.endTransmission();\n';
  funcDef += '    if (error == 0) {\n';
  funcDef += '      Serial.printf("I2C device found at address 0x%02X\\n", address);\n';
  funcDef += '      nDevices++;\n';
  funcDef += '    } else if (error != 2) {\n';
  funcDef += '      Serial.printf("Error %d at address 0x%02X\\n", error, address);\n';
  funcDef += '    }\n';
  funcDef += '  }\n';
  funcDef += '  if (nDevices == 0) {\n';
  funcDef += '    Serial.println("No I2C devices found");\n';
  funcDef += '  } else {\n';
  funcDef += '    Serial.printf("Found %d I2C device(s)\\n", nDevices);\n';
  funcDef += '  }\n';
  funcDef += '}\n';
  
  // 添加函数定义
  generator.addFunction(funcKey, funcDef);
  
  // 返回函数调用代码，作为执行语句而不是表达式
  return scanFuncName + '();\n';
};

// 检测是否为ESP32核心
function isESP32Core() {
  const boardConfig = window['boardConfig'];
  return boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1;
}

// 动态添加wire_begin_with_settings块的功能（参考core-variables实现）
function addWireBeginWithSettingsBlock() {
  try {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) return;

    // 获取原始工具箱定义
    const originalToolboxDef = workspace.options.languageTree;
    if (!originalToolboxDef) return;

    // 找到I2C类别并更新其内容
    for (let category of originalToolboxDef.contents) {
      if (category.name === "I2C" || category.name === "new_iic" ||
          (category.contents && category.contents.some(item => 
            item.type === "wire_begin" || item.type === "wire_set_clock"))) {
        
        // 检查是否已经存在wire_begin_with_settings block
        const blockExists = category.contents.some(item => 
          item.type === "wire_begin_with_settings"
        );

        if (!blockExists && isESP32Core()) {
          // 在wire_begin后面添加wire_begin_with_settings
          const wireBeginIndex = category.contents.findIndex(item => 
            item.type === "wire_begin"
          );
          
          const newBlock = {
            "kind": "block",
            "type": "wire_begin_with_settings",
            "inputs": {
              "SDA": {
                "shadow": {
                  "type": "math_number",
                  "fields": {
                    "NUM": "21"
                  }
                }
              },
              "SCL": {
                "shadow": {
                  "type": "math_number",
                  "fields": {
                    "NUM": "22"
                  }
                }
              }
            }
          };
          
          if (wireBeginIndex >= 0) {
            // 在wire_begin后面插入新的block
            category.contents.splice(wireBeginIndex + 1, 0, newBlock);
          } else {
            // 如果找不到wire_begin，就添加到前面
            category.contents.unshift(newBlock);
          }
        }
        break;
      }
    }
  } catch (e) {
    // 静默处理错误
  }
}

// 动态更新I2C块的下拉菜单，添加引脚信息（扩展版，支持所有I2C块）
function updateI2CBlocksWithPinInfo() {
  try {
    // 检查开发板配置
    const boardConfig = window['boardConfig'];
    if (!boardConfig || !boardConfig.i2c) {
      return;
    }

    // 使用原始的i2c配置，避免重复添加引脚信息
    const originalI2C = boardConfig.i2cOriginal || boardConfig.i2c;
    
    // 创建带引脚信息的I2C选项（不修改原始boardConfig）
    const i2cOptionsWithPins = generateI2COptionsWithPins(boardConfig);

    // 备份原始配置并临时更新配置（不修改原始boardConfig）
    if (!boardConfig.i2cOriginal) {
      boardConfig.i2cOriginal = [...originalI2C];
    }
    
    // 创建临时配置对象，避免修改原始boardConfig
    const tempConfig = {
      ...boardConfig,
      i2c: i2cOptionsWithPins
    };
    
    // 更新工作区中所有现有的I2C块
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      const allBlocks = workspace.getAllBlocks();
      allBlocks.forEach(block => {
        // 扩展到所有包含WIRE字段的block
        if (block.getField && block.getField('WIRE')) {
          // 更新下拉菜单选项
          updateBlockDropdownWithPinInfo(block, tempConfig);
          // 强制重绘以确保UI立即更新
          block.render();
        }
      });
    }
  } catch (e) {
    // 静默处理错误
  }
}

// 简化的I2C块初始化函数（扩展版，支持所有I2C块）
function initializeI2CBlock(block) {
  try {
    // 检查block是否有WIRE字段
    const wireField = block.getField('WIRE');
    if (!wireField) return;
    
    // 延迟初始化，等待boardConfig加载
    setTimeout(() => {
      updateBlockDropdownWithPinInfo(block);
      
      const boardConfig = window['boardConfig'];
      if (boardConfig && boardConfig.i2c && boardConfig.i2c.length > 0) {
        const currentValue = wireField.getValue();
        
        // 检查当前值是否在选项列表中
        const options = generateI2COptionsWithPins(boardConfig);
        const matchingOption = options.find(([text, value]) => value === currentValue);
        
        // 只有在没有当前值或当前值无效的情况下才设置默认值
        if (!currentValue || !matchingOption) {
          try {
            wireField.setValue(boardConfig.i2c[0][1]);
          } catch (e) {
            // 如果设置失败，可能是因为选项尚未正确加载
            // 稍后在updateBlockDropdownWithPinInfo中会再次尝试
          }
        }
        
        // 设置显示文本将由updateBlockDropdownWithPinInfo完成
      }
    }, 100);
  } catch (e) {
    // 忽略错误
  }
}

// 扩展的I2C块扩展注册（支持所有包含WIRE字段的block）
function addI2CPinInfoExtensions() {
  if (typeof Blockly === 'undefined' || !Blockly.Extensions) return;
  
  try {
    // 所有需要支持引脚信息显示的I2C block类型
    const i2cBlockTypes = [
      'wire_begin',
      'wire_begin_with_settings', 
      'wire_set_clock',
      'wire_begin_transmission',
      'wire_write',
      'wire_end_transmission',
      'wire_request_from',
      'wire_available',
      'wire_read',
      'wire_variables',
      'wire_on_receive',
      'wire_on_request',
      'wire_scan'
    ];

    // 为每种block类型注册扩展
    i2cBlockTypes.forEach(blockType => {
      const extensionName = blockType + '_pin_info';
      
      // 先检查扩展是否存在，如果存在则先取消注册
      if (Blockly.Extensions.isRegistered && Blockly.Extensions.isRegistered(extensionName)) {
        Blockly.Extensions.unregister(extensionName);
      }
      
      // 然后注册扩展
      Blockly.Extensions.register(extensionName, function() {
        setTimeout(() => {
          initializeI2CBlock(this);
          // 为wire_begin_with_settings特别添加输入监听器
          if (this.type === 'wire_begin_with_settings') {
            addInputChangeListener(this);
          }
        }, 50);
      });
    });

    // 保持原有的扩展名兼容性
    // 检查并移除wire_begin_pin_info
    if (Blockly.Extensions.isRegistered && Blockly.Extensions.isRegistered('wire_begin_pin_info')) {
      Blockly.Extensions.unregister('wire_begin_pin_info');
    }
    
    // 注册wire_begin_pin_info
    Blockly.Extensions.register('wire_begin_pin_info', function() {
      setTimeout(() => {
        initializeI2CBlock(this);
      }, 50);
    });

    // 检查并移除wire_begin_with_settings_pin_info
    if (Blockly.Extensions.isRegistered && Blockly.Extensions.isRegistered('wire_begin_with_settings_pin_info')) {
      Blockly.Extensions.unregister('wire_begin_with_settings_pin_info');
    }
    
    // 注册wire_begin_with_settings_pin_info
    Blockly.Extensions.register('wire_begin_with_settings_pin_info', function() {
      setTimeout(() => {
        initializeI2CBlock(this);
        addInputChangeListener(this);
      }, 50);
    });
  } catch (e) {
    // 忽略扩展注册错误
  }
}



// 生成带引脚信息的I2C选项（不修改原始配置）
function generateI2COptionsWithPins(boardConfig) {
  const originalI2C = boardConfig.i2cOriginal || boardConfig.i2c;
  
  return originalI2C.map(([displayName, value]) => {
    // 移除已有的引脚信息，重新生成
    const cleanDisplayName = displayName.replace(/\(SDA=\d+,\s*SCL=\d+\)/, '').trim();
    
    // 优先使用自定义引脚信息，再使用boardConfig中的引脚信息
    let pins = null;
    let isCustom = false;
    
    // 检查自定义引脚配置
    const customPins = window['customI2CPins'];
    if (customPins && customPins[value]) {
      pins = customPins[value];
      isCustom = true;
    }
    // 回退到boardConfig中的引脚信息
    else if (boardConfig.i2cPins && boardConfig.i2cPins[value]) {
      pins = boardConfig.i2cPins[value];
      isCustom = false;
    }
    
    if (pins) {
      const sdaPin = pins.find(pin => pin[0] === 'SDA');
      const sclPin = pins.find(pin => pin[0] === 'SCL');
      if (sdaPin && sclPin) {
        const suffix = isCustom ? ' (自定义)' : '';
        return [cleanDisplayName + '(SDA:' + sdaPin[1] + ', SCL:' + sclPin[1] + ')' + suffix, value];
      }
    }
    
    return [cleanDisplayName, value];
  });
}

// 更新单个block的下拉菜单选项（扩展版，支持所有I2C块）
function updateBlockDropdownWithPinInfo(block, config) {
  try {
    // 检查block是否有WIRE字段
    if (!block || !block.getField || !block.getField('WIRE')) return;
    
    const boardConfig = config || window['boardConfig'];
    if (!boardConfig || !boardConfig.i2c) {
      return;
    }
    
    const wireField = block.getField('WIRE');
    if (!wireField) return;
    
    const optionsWithPins = generateI2COptionsWithPins(boardConfig);

    // 更新下拉菜单选项
    if (optionsWithPins.length > 0) {
      // 更新字段的选项生成器
      wireField.menuGenerator_ = optionsWithPins;
      wireField.getOptions = function() {
        return optionsWithPins;
      };

      // 获取当前值
      const currentValue = wireField.getValue();
      // 检查当前值是否在新的选项列表中
      const matchingOption = optionsWithPins.find(([text, value]) => value === currentValue);

      if (currentValue && matchingOption) {
        // 强制调用setValue刷新UI（即使值未变，setValue也会刷新显示文本）
        wireField.setValue(currentValue);
      } else {
        // 当前值无效，设置为第一个选项
        wireField.setValue(optionsWithPins[0][1]);
      }
    }
  } catch (e) {
    // 忽略错误
  }
}

// 刷新I2C工具箱（参考core-variables的实现）
function refreshI2CToolbox(workspace) {
  try {
    if (!workspace) return;
    
    // 使用与core-variables相同的刷新方法
    const originalToolboxDef = workspace.options.languageTree;
    if (originalToolboxDef) {
      workspace.updateToolbox(originalToolboxDef);
    }
  } catch (e) {
    // 静默处理错误
  }
}

// 监听工作区变化，在工作区加载完成后添加ESP32专用块和更新引脚信息
if (typeof Blockly !== 'undefined') {
  // 立即注册扩展
  addI2CPinInfoExtensions();

  // 添加工作区变化监听器
  const addI2CBlocksListener = function(event) {
    // 当工作区完成加载时调用
    if (event.type === Blockly.Events.FINISHED_LOADING) {
      // 延迟执行以确保所有初始化完成
      setTimeout(() => {
        // 首先添加wire_begin_with_settings块
        addWireBeginWithSettingsBlock();
        
        // 然后更新引脚信息
        updateI2CBlocksWithPinInfo();
        
        // 刷新工具箱以使用新的块定义
        const workspace = Blockly.getMainWorkspace();
        if (workspace) {
          refreshI2CToolbox(workspace);
        }
      }, 200);
    }
    
    // 监听块删除事件，清理自定义引脚配置
    if (event.type === Blockly.Events.BLOCK_DELETE) {
      try {
        // 检查删除的是否是wire_begin_with_settings块
        if (event.oldXml) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(event.oldXml, "text/xml");
          const blockElement = xmlDoc.querySelector('block');
          
          if (blockElement && blockElement.getAttribute('type') === 'wire_begin_with_settings') {
            // 从XML中提取Wire实例信息
            const wireField = xmlDoc.querySelector('field[name="WIRE"]');
            const wire = wireField ? wireField.textContent || 'Wire' : 'Wire';
            
            // 延迟清理，确保删除操作完成
            setTimeout(() => {
              clearCustomPinConfig(wire);
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
        workspace.addChangeListener(addI2CBlocksListener);
      } else {
        // 如果工作区还未创建，延迟添加监听器
        setTimeout(() => {
          const delayedWorkspace = Blockly.getMainWorkspace();
          if (delayedWorkspace) {
            delayedWorkspace.addChangeListener(addI2CBlocksListener);
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
    addWireBeginWithSettingsBlock();
    updateI2CBlocksWithPinInfo();
    
    // 刷新工具箱
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      refreshI2CToolbox(workspace);
    }
  }, 200);
}

// 添加全局函数，供外部手动调用
window.updateI2CPinInfo = function() {
  updateI2CBlocksWithPinInfo();
  const workspace = Blockly.getMainWorkspace();
  if (workspace) {
    refreshI2CToolbox(workspace);
  }
};

// 合并多个相似的全局函数
window.addWireBeginWithSettingsToToolbox = window.updateI2CPinInfo;
window.forceAddWireBeginWithSettings = window.updateI2CPinInfo;
window.ensureI2CBlocks = function() {
  addWireBeginWithSettingsBlock();
  window.updateI2CPinInfo();
};

// 清理未使用的自定义引脚配置
window.cleanupUnusedCustomPins = function() {
  try {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace || !window['customI2CPins']) return;
    
    const allBlocks = workspace.getAllBlocks();
    const usedWires = new Set();
    
    // 收集所有仍在使用的Wire实例
    allBlocks.forEach(block => {
      if (block.type === 'wire_begin_with_settings') {
        try {
          const wire = block.getFieldValue('WIRE') || 'Wire';
          usedWires.add(wire);
        } catch (e) {
          // 忽略错误（可能是正在销毁的块）
        }
      }
    });
    
    // 清理未使用的自定义配置
    const customPins = window['customI2CPins'];
    const customWires = window['customI2CWires'];
    
    let configChanged = false;
    Object.keys(customPins).forEach(wire => {
      if (!usedWires.has(wire)) {
        delete customPins[wire];
        if (customWires) {
          delete customWires[wire];
        }
        configChanged = true;
      }
    });
    
    // 更新UI
    if (configChanged) {
      updateI2CBlocksWithPinInfo();
      setTimeout(() => updateAllWireBlocksInWorkspace(), 100);
    }
  } catch (e) {
    // 忽略错误
  }
};

// 强制重置所有自定义引脚配置
window.forceResetCustomPins = function() {
  try {
    // 清空所有自定义配置
    if (window['customI2CPins']) {
      window['customI2CPins'] = {};
    }
    if (window['customI2CWires']) {
      window['customI2CWires'] = {};
    }
    
    // 立即更新UI
    updateI2CBlocksWithPinInfo();
    updateAllWireBlocksInWorkspace();
  } catch (e) {
    // 忽略错误
  }
};

// 为wire_begin_with_settings块添加输入变化监听器
function addInputChangeListener(block) {
  if (!block || block.type !== 'wire_begin_with_settings') return;
  
  try {
    // 监听SDA和SCL输入变化
    const sdaInput = block.getInput('SDA');
    const sclInput = block.getInput('SCL');
    
    if (sdaInput && sclInput) {
      // 存储当前Wire实例以便检测变化
      let currentWire = block.getFieldValue('WIRE') || 'Wire';
      
      // 创建变化监听函数
      const updatePinInfo = function() {
        const newWire = block.getFieldValue('WIRE') || 'Wire';
        const sdaConnection = sdaInput.connection;
        const sclConnection = sclInput.connection;
        
        // 检测Wire实例是否已更改
        if (currentWire !== newWire) {
          // Wire实例已更改，清理旧的Wire实例的自定义配置
          clearCustomPinConfig(currentWire);
          // 更新当前Wire实例记录
          currentWire = newWire;
        }
        
        if (sdaConnection && sdaConnection.targetBlock() && 
            sclConnection && sclConnection.targetBlock()) {
          
          const sdaBlock = sdaConnection.targetBlock();
          const sclBlock = sclConnection.targetBlock();
          
          // 如果连接的是数字块，获取其值
          if (sdaBlock.type === 'math_number' && sclBlock.type === 'math_number') {
            const sdaValue = sdaBlock.getFieldValue('NUM');
            const sclValue = sclBlock.getFieldValue('NUM');
            
            // 更新自定义引脚配置
            updateCustomPinConfig(newWire, sdaValue, sclValue);
          }
        }
      };
      
      // 获取当前连接的SDA/SCL块ID，以便监听其字段变化
      const getConnectedBlockIds = () => {
        const ids = [];
        const sdaConn = sdaInput.connection;
        const sclConn = sclInput.connection;
        
        if (sdaConn && sdaConn.targetBlock()) {
          ids.push(sdaConn.targetBlock().id);
        }
        if (sclConn && sclConn.targetBlock()) {
          ids.push(sclConn.targetBlock().id);
        }
        return ids;
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
            
            // 特别检查WIRE字段变化
            if (event.type === Blockly.Events.CHANGE && 
                event.element === 'field' && 
                event.name === 'WIRE') {
              // 获取新选择的Wire实例
              const newWire = block.getFieldValue('WIRE') || 'Wire';
              
              // 尝试获取默认引脚配置
              try {
                const boardConfig = window['boardConfig'];
                if (boardConfig && boardConfig.i2cPins && boardConfig.i2cPins[newWire]) {
                  const pins = boardConfig.i2cPins[newWire];
                  const sdaPin = pins.find(pin => pin[0] === 'SDA');
                  const sclPin = pins.find(pin => pin[0] === 'SCL');
                  
                  if (sdaPin && sclPin) {
                    // 更新SDA和SCL输入中的数字块值
                    const sdaConnection = sdaInput.connection;
                    const sclConnection = sclInput.connection;
                    
                    if (sdaConnection && sdaConnection.targetBlock() &&
                        sdaConnection.targetBlock().type === 'math_number') {
                      sdaConnection.targetBlock().setFieldValue(sdaPin[1], 'NUM');
                    }
                    
                    if (sclConnection && sclConnection.targetBlock() &&
                        sclConnection.targetBlock().type === 'math_number') {
                      sclConnection.targetBlock().setFieldValue(sclPin[1], 'NUM');
                    }
                    
                    // 强制块重绘
                    block.render();
                  }
                }
              } catch (e) {
                // 忽略错误
              }
              
              // 立即触发updatePinInfo以清理旧配置并应用新配置
              setTimeout(updatePinInfo, 20);
            } 
            // 特别检查连接的数字块的NUM字段变化
            else if (event.type === Blockly.Events.CHANGE && 
                     event.element === 'field' && 
                     event.name === 'NUM') {
              // 获取连接的块IDs
              const connectedBlockIds = getConnectedBlockIds();
              
              // 如果变化的是连接的SDA或SCL数字块
              if (connectedBlockIds.includes(event.blockId)) {
                // 立即更新引脚信息
                updatePinInfo();
                
                // 强制立即更新UI
                setTimeout(() => {
                  // 更新工作区中所有使用相同Wire实例的块
                  const workspace = Blockly.getMainWorkspace();
                  if (workspace) {
                    const wire = block.getFieldValue('WIRE') || 'Wire';
                    const allBlocks = workspace.getAllBlocks();
                    allBlocks.forEach(b => {
                      if (b.getField && b.getField('WIRE') && 
                          b.getFieldValue('WIRE') === wire) {
                        // 更新下拉菜单选项并触发重绘
                        updateBlockDropdownWithPinInfo(b);
                        b.render();
                      }
                    });
                  }
                }, 10);
              }
              
              // 其他变化（例如MODE字段变化等）
              setTimeout(updatePinInfo, 50);
            } else {
              // 其他变化
              setTimeout(updatePinInfo, 50);
            }
          }
        };
        
        block.workspace.addChangeListener(changeListener);
        
        // 存储原始的dispose方法引用
        const originalDispose = block.dispose;
        
        // 重写dispose方法
        block.dispose = function(healStack) {
          // 清除自定义引脚配置
          try {
            const wire = this.getFieldValue('WIRE') || 'Wire';
            
            // 延迟清理，确保块完全销毁后再检查
            setTimeout(() => {
              clearCustomPinConfig(wire);
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
              const wire = block.getFieldValue('WIRE') || 'Wire';
              setTimeout(() => {
                clearCustomPinConfig(wire);
              }, 100);
            } catch (e) {
              // 忽略错误
            }
          }
        };
        
        block.workspace.addChangeListener(deleteListener);
      }
    }
  } catch (e) {
    // 忽略错误
  }
}

// 清除指定Wire实例的自定义引脚配置
function clearCustomPinConfig(wire) {
  try {
    // 直接获取配置，不检查其他块，因为我们现在是在切换Wire时调用
    // 这确保了当用户在下拉菜单中切换Wire实例时，旧的自定义配置会被清除
    let configChanged = false;
    
    if (window['customI2CPins'] && window['customI2CPins'][wire]) {
      delete window['customI2CPins'][wire];
      configChanged = true;
    }
    if (window['customI2CWires'] && window['customI2CWires'][wire]) {
      delete window['customI2CWires'][wire];
      configChanged = true;
    }
    
    // 只有配置真的改变了才更新UI
    if (configChanged) {
      // 立即更新UI，恢复默认引脚显示
      updateI2CBlocksWithPinInfo();
      
      // 更新所有相关的I2C块
      const workspace = Blockly.getMainWorkspace();
      if (workspace) {
        setTimeout(() => {
          const allBlocks = workspace.getAllBlocks();
          allBlocks.forEach(b => {
            if (b.getField && b.getField('WIRE')) {
              try {
                const blockWire = b.getFieldValue('WIRE');
                if (blockWire === wire) {
                  updateBlockDropdownWithPinInfo(b);
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

/**
 * 根据I2C模式动态显示地址输入
 * 当模式为从设备（SLAVE）时，添加地址输入字段
 * 当模式为主设备（MASTER）时，移除地址输入字段
 * 该扩展在 block.json 中通过 "extensions": ["wire_begin_pin_info", "wire_begin_mutator"] 激活
 */
// 检查并移除已存在的扩展注册
if (Blockly && Blockly.Extensions && Blockly.Extensions.isRegistered) {
  // 检查并移除wire_begin_mutator
  if (Blockly.Extensions.isRegistered('wire_begin_mutator')) {
    Blockly.Extensions.unregister('wire_begin_mutator');
  }
  // 同时检查并移除wire_begin_with_settings_mutator
  if (Blockly.Extensions.isRegistered('wire_begin_with_settings_mutator')) {
    Blockly.Extensions.unregister('wire_begin_with_settings_mutator');
  }
}

// 重新注册扩展，参考blinker库的实现方式
if (Blockly && Blockly.Extensions) {
  Blockly.Extensions.register('wire_begin_mutator', function() {
    // 定义updateShape_函数作为block的方法
    this.updateShape_ = function(mode) {
      try {
        // 检查是否有ADDRESS输入
        var addressInput = this.getInput('ADDRESS');
        
        if (mode === 'SLAVE') {
          // 从模式: 显示地址输入
          if (!addressInput) {
            addressInput = this.appendValueInput('ADDRESS')
              .setCheck('Number')
              .appendField('从设备地址');
              
            // 添加默认的数字块
            if (!this.isInFlyout) {
              var shadowBlock = this.workspace.newBlock('math_number');
              shadowBlock.setFieldValue('8', 'NUM');
              shadowBlock.setShadow(true);
              shadowBlock.initSvg();
              shadowBlock.render();
              this.getInput('ADDRESS').connection.connect(shadowBlock.outputConnection);
            }
            
            if (!this.isInFlyout) {
              this.render();
            }
          }
        } else {
          // 主模式: 移除地址输入
          if (addressInput) {
            this.removeInput('ADDRESS');
            
            if (!this.isInFlyout) {
              this.render();
            }
          }
        }
      } catch (e) {
        // 忽略错误
      }
    };

    // 为MODE字段添加验证器，在字段值变化时更新块形状
    this.getField('MODE').setValidator(function(option) {
      // this指向字段，getSourceBlock()获取所属的块
      this.getSourceBlock().updateShape_(option);
      return option; // 返回新值
    });
    
    // 初始状态根据当前MODE值设置块形状
    this.updateShape_(this.getFieldValue('MODE'));
  });
  
  // 为 wire_begin_with_settings 添加类似的 mutator 扩展
  Blockly.Extensions.register('wire_begin_with_settings_mutator', function() {
    // 定义updateShape_函数作为block的方法
    this.updateShape_ = function(mode) {
      try {
        // 检查是否有ADDRESS输入
        var addressInput = this.getInput('ADDRESS');
        
        if (mode === 'SLAVE') {
          // 从模式: 显示地址输入
          if (!addressInput) {
            // 将ADDRESS输入插入到SCL输入之后
            var sclInput = this.getInput('SCL');
            var position = this.inputList.indexOf(sclInput);
            
            if (position !== -1) {
              addressInput = this.appendValueInput('ADDRESS')
                .setCheck('Number')
                .appendField('从设备地址');
                
              // 移动ADDRESS输入到正确位置（SCL后面）
              if (position + 1 < this.inputList.length) {
                this.moveInputBefore('ADDRESS', this.inputList[position + 1].name);
              }
              
              // 添加默认的数字块
              if (!this.isInFlyout) {
                var shadowBlock = this.workspace.newBlock('math_number');
                shadowBlock.setFieldValue('8', 'NUM');
                shadowBlock.setShadow(true);
                shadowBlock.initSvg();
                shadowBlock.render();
                this.getInput('ADDRESS').connection.connect(shadowBlock.outputConnection);
              }
              
              if (!this.isInFlyout) {
                this.render();
              }
            }
          }
        } else {
          // 主模式: 移除地址输入
          if (addressInput) {
            this.removeInput('ADDRESS');
            
            if (!this.isInFlyout) {
              this.render();
            }
          }
        }
      } catch (e) {
        // 忽略错误
      }
    };

    // 为MODE字段添加验证器，在字段值变化时更新块形状
    this.getField('MODE').setValidator(function(option) {
      // this指向字段，getSourceBlock()获取所属的块
      this.getSourceBlock().updateShape_(option);
      return option; // 返回新值
    });
    
    // 初始状态根据当前MODE值设置块形状
    this.updateShape_(this.getFieldValue('MODE'));
  });
}

/**
 * 由于扩展可能在不同环境下被多次加载，确保在初始化时检查扩展的存在性
 * 1. 在页面初始加载时
 * 2. 每次工作区重新加载时
 * 3. 每次添加新块时
 * 避免"Extension already registered"错误
 */

// 初始化完成后，监听工作区加载事件，确保已有的wire_begin和wire_begin_with_settings块被正确初始化
if (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace) {
  try {
    Blockly.getMainWorkspace().addChangeListener(function(event) {
      if (event.type === Blockly.Events.FINISHED_LOADING) {
        setTimeout(() => {
          const workspace = Blockly.getMainWorkspace();
          if (workspace) {
            // 查找所有需要更新的I2C块
            const blocksToUpdate = workspace.getAllBlocks().filter(block => 
              block.type === 'wire_begin' || block.type === 'wire_begin_with_settings');
            
            // 重新触发每个块的MODE字段验证器，以更新块的形状
            blocksToUpdate.forEach(block => {
              if (block.getField('MODE')) {
                const currentMode = block.getFieldValue('MODE');
                block.getField('MODE').setValue(currentMode);
              }
            });
          }
        }, 200);
      }
    });
  } catch (e) {
    // 忽略错误
  }
}
