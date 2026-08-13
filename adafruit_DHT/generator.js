// 定义DHT块的动态扩展
if (Blockly.Extensions.isRegistered('dht_init_dynamic')) {
  Blockly.Extensions.unregister('dht_init_dynamic');
}
Blockly.Extensions.register('dht_init_dynamic', function () {
  // 获取i18n翻译
  const i18n = window.__BLOCKLY_LIB_I18N__?.['@aily-project/lib-dht']?.extensions?.dht_init_dynamic || {};
  const i2cLabel = i18n.i2c_interface || 'I2C接口';
  const pinLabel = i18n.pin || '引脚';

  this.updateShape_ = function (dhtType) {
    if (this.getInput('PIN_SET')) this.removeInput('PIN_SET');
    if (this.getInput('WIRE_SET')) this.removeInput('WIRE_SET');
    switch (dhtType) {
      case 'DHT20':
        const i2cOptions = (window.boardConfig && window.boardConfig.i2c) ? window.boardConfig.i2c : [['I2C0','I2C0']];
        this.appendDummyInput('WIRE_SET')
            .appendField(i2cLabel)
            .appendField(new Blockly.FieldDropdown(i2cOptions), 'WIRE');
        break;
      default:
        const pinOptions = (window.boardConfig && window.boardConfig.digitalPins) ? window.boardConfig.digitalPins : [['D2','2'], ['D3','3'], ['D4','4'], ['D5','5'], ['D6','6'], ['D7','7'], ['D8','8'], ['D9','9'], ['D10','10'], ['D11','11'], ['D12','12'], ['D13','13']];
        this.appendDummyInput('PIN_SET')
            .appendField(pinLabel)
            .appendField(new Blockly.FieldDropdown(pinOptions), 'PIN');
        break;
    }
  };
  this.getField('TYPE').setValidator(option => {
    this.updateShape_(option);
    return option;
  });
  // 初始化形状
  this.updateShape_(this.getFieldValue('TYPE'));

  // ABS import resolves field_variable references while blocks are being
  // created, before Arduino code generation runs. Register the sensor
  // variable at extension time so a later dht_read_* block can bind to its ID.
  const dhtBlock = this;
  const varField = this.getField('VAR');
  const getWorkspace = () => dhtBlock.workspace
    || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
  const workspace = getWorkspace();

  // Toolbox flyout blocks share the target workspace's variable map. Creating
  // a variable while the flyout is rendering refreshes the toolbox and creates
  // this block again, causing an infinite recursion. The real workspace block
  // is created separately when the user drags it out, so defer variable
  // registration until then.
  if (workspace && workspace.isFlyout) return;

  const ensureVariable = name => {
    if (!workspace || !name) return { model: null, created: false };
    const existing = workspace.getVariable(name);
    if (existing) return { model: existing, created: false };
    return { model: workspace.createVariable(name, 'DHT'), created: true };
  };

  dhtBlock._dhtVarLastName = this.getFieldValue('VAR') || 'dht';
  const initialVariable = ensureVariable(dhtBlock._dhtVarLastName);
  dhtBlock._dhtOwnedVariableId = initialVariable.created && initialVariable.model
    ? initialVariable.model.getId()
    : null;
  dhtBlock._dhtVarMonitorAttached = true;

  if (varField && typeof varField.setValidator === 'function') {
    const originalValidator = typeof varField.getValidator === 'function'
      ? varField.getValidator()
      : null;
    varField.setValidator(function (newName) {
      const originalResult = typeof originalValidator === 'function'
        ? originalValidator.call(this, newName)
        : newName;
      if (originalResult === null) return null;
      const resolvedName = String(originalResult === undefined ? newName : originalResult).trim();
      if (!resolvedName) return null;

      const oldName = dhtBlock._dhtVarLastName;
      if (workspace && resolvedName !== oldName) {
        const existingTarget = workspace.getVariable(resolvedName);
        const ownedVariable = dhtBlock._dhtOwnedVariableId
          ? workspace.getVariableById(dhtBlock._dhtOwnedVariableId)
          : null;
        if (existingTarget) {
          // Never rename a variable that predated this init block.
          dhtBlock._dhtOwnedVariableId = null;
        } else if (ownedVariable && ownedVariable.name === oldName) {
          workspace.renameVariableById(ownedVariable.getId(), resolvedName);
        } else {
          const created = workspace.createVariable(resolvedName, 'DHT');
          dhtBlock._dhtOwnedVariableId = created.getId();
        }
        dhtBlock._dhtVarLastName = resolvedName;
      }
      return resolvedName;
    });
  }
});

// 通用库管理函数，确保不重复添加库
function ensureLibrary(generator, libraryKey, libraryCode) {
  if (!generator.libraries_) {
    generator.libraries_ = {};
  }
  if (!generator.libraries_[libraryKey]) {
    generator.addLibrary(libraryKey, libraryCode);
  }
}

function ensureDHTLibrary(generator) {
  ensureLibrary(generator, 'DHT_include', '#include <DHT.h>');
}

function ensureDHT20Library(generator) {
  ensureLibrary(generator, 'Wire_include', '#include <Wire.h>');
  ensureLibrary(generator, 'DHT20_include', '#include <DHT20.h>');
}

// 初始化类型映射表
if (!Arduino.dhtTypeMap) {
  Arduino.dhtTypeMap = {};
}

// Code generation may visit root blocks in a different order from their
// visual/layout order. Resolve the sensor type from the workspace first so a
// read block never depends on dht_init having already populated dhtTypeMap in
// the same generation pass.
function getDHTTypeForVariable(block, varName) {
  const workspace = block && block.workspace;
  if (workspace && typeof workspace.getBlocksByType === 'function') {
    const initBlocks = workspace.getBlocksByType('dht_init', false) || [];
    const initBlock = initBlocks.find(candidate => candidate.getFieldValue('VAR') === varName);
    const configuredType = initBlock && initBlock.getFieldValue('TYPE');
    if (configuredType) return configuredType;
  }
  return Arduino.dhtTypeMap[varName] || 'DHT11';
}

Arduino.forBlock['dht_init'] = function (block, generator) {
  // 检查块是否连接到代码流程中，如果是独立块则不生成代码
  // 使用全局函数，支持指定目标块类型
  const isConnected = isBlockConnected(block);
  
  // 添加引脚动态显示逻辑
  // if (!block._pinVisibilityAttached) {
  //   block._pinVisibilityAttached = true;
    
  //   const typeField = block.getField('TYPE');
  //   if (typeField && typeof typeField.setValidator === 'function') {
  //     typeField.setValidator(function(newValue) {
  //       const pinField = block.getField('PIN');
  //       if (pinField && typeof pinField.setVisible === 'function') {
  //         // DHT20 使用I2C，隐藏引脚；其他显示引脚
  //         pinField.setVisible(newValue !== 'DHT20');
  //       }
  //       return newValue;
  //     });
  //   }
    
  //   // 初始化时检查当前值
  //   const currentType = block.getFieldValue('TYPE');
  //   const pinField = block.getField('PIN');
  //   if (pinField && typeof pinField.setVisible === 'function' && currentType === 'DHT20') {
  //     pinField.setVisible(false);
  //   }
  // }
  
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._dhtVarMonitorAttached) {
    block._dhtVarMonitorAttached = true;
    block._dhtVarLastName = block.getFieldValue('VAR') || 'dht';
    // 初次注册变量到 Blockly 系统（仅执行一次）
    registerVariableToBlockly(block._dhtVarLastName, 'DHT');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._dhtVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'DHT');
          block._dhtVarLastName = newName;
        }
      };
    }
  }

  var varName = block.getFieldValue('VAR') || 'dht';
  var dht_type = block.getFieldValue('TYPE');
  // var pin = block.getFieldValue('PIN');

  // 保存类型映射
  Arduino.dhtTypeMap[varName] = dht_type;

  let code = '';
  // DHT20 特殊处理（I2C接口）
  if (dht_type === 'DHT20') {
    var wire = block.getFieldValue('WIRE');
    // 注册Blockly变量，类型为DHT20
    
    // 确保DHT20库已添加
    ensureDHT20Library(generator);
    
    // 添加DHT20对象定义（使用Wire）
    var dht20Def = 'DHT20 ' + varName + '(&' + wire + ');';
    generator.addObject(varName, dht20Def);
    
    generator.sensorVarName = varName;
    
    // 在setup中初始化I2C和DHT20
    generator.addSetup(`wire_${wire}_begin`, wire + '.begin();');
    // generator.addSetup(`${varName}_begin`, varName + '.begin();');
    code += `${varName}.read();\n`; // 读取以初始化传感器
  } else {
    var pin = block.getFieldValue('PIN');
    // DHT11/22/21 处理（单总线接口）
    // 注册Blockly变量，类型为DHT，同名变量只注册一次
    registerVariableToBlockly(varName, 'DHT');
    
    // 确保DHT库已添加
    ensureDHTLibrary(generator);
    
    // 添加DHT对象定义，使用用户指定的变量名
    var dhtDef = 'DHT ' + varName + '(' + pin + ', ' + dht_type + ');';
    generator.addObject(varName, dhtDef);
    
    generator.sensorVarName = varName;
    
    // 在setup中初始化DHT对象
    // generator.addSetupBegin(varName + '_begin', varName + '.begin();');
    code += `${varName}.begin();\n`;
  }

  if (!isConnected) {
    return '';
  }

  // 使用ensureDHTInit确保DHT传感器初始化
  // ensureDHTInit(pin, dht_type, generator);

  return code;
};

Arduino.forBlock['dht_read_temperature'] = function (block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dht';
  
  // 通过类型映射表检查是否为DHT20
  const dhtType = getDHTTypeForVariable(block, varName);
  
  // DHT20 需要先调用read()再获取数据
  if (dhtType === 'DHT20') {
    return ['(' + varName + '.read(), ' + varName + '.getTemperature())', Arduino.ORDER_COMMA];
  }
  
  return [varName + '.readTemperature()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['dht_read_humidity'] = function (block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dht';
  
  // 通过类型映射表检查是否为DHT20
  const dhtType = getDHTTypeForVariable(block, varName);
  
  // DHT20 需要先调用read()再获取数据
  if (dhtType === 'DHT20') {
    return ['(' + varName + '.read(), ' + varName + '.getHumidity())', Arduino.ORDER_COMMA];
  }
  
  return [varName + '.readHumidity()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['dht_read_success'] = function (block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dht';
  
  // 通过类型映射表检查是否为DHT20
  const dhtType = getDHTTypeForVariable(block, varName);
  
  // DHT20 的成功判断方式不同
  if (dhtType === 'DHT20') {
    return ['(' + varName + '.read() == DHT20_OK)', Arduino.ORDER_RELATIONAL];
  }
  
  return ['!isnan(' + varName + '.readTemperature()) && !isnan(' + varName + '.readHumidity())', Arduino.ORDER_LOGICAL_AND];
};

