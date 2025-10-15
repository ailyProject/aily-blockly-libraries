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

Arduino.forBlock['dht_init'] = function (block, generator) {
  // 添加引脚动态显示逻辑
  if (!block._pinVisibilityAttached) {
    block._pinVisibilityAttached = true;
    
    const typeField = block.getField('TYPE');
    if (typeField && typeof typeField.setValidator === 'function') {
      typeField.setValidator(function(newValue) {
        const pinField = block.getField('PIN');
        if (pinField && typeof pinField.setVisible === 'function') {
          // DHT20 使用I2C，隐藏引脚；其他显示引脚
          pinField.setVisible(newValue !== 'DHT20');
        }
        return newValue;
      });
    }
    
    // 初始化时检查当前值
    const currentType = block.getFieldValue('TYPE');
    const pinField = block.getField('PIN');
    if (pinField && typeof pinField.setVisible === 'function' && currentType === 'DHT20') {
      pinField.setVisible(false);
    }
  }
  
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._dhtVarMonitorAttached) {
    block._dhtVarMonitorAttached = true;
    block._dhtVarLastName = block.getFieldValue('VAR') || 'dht';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._dhtVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'DHT');
          block._dhtVarLastName = newName;
        }
        return newName;
      });
    }
  }

  var varName = block.getFieldValue('VAR') || 'dht';
  var dht_type = block.getFieldValue('TYPE');
  var pin = block.getFieldValue('PIN');

  // 保存类型映射
  Arduino.dhtTypeMap[varName] = dht_type;

  // DHT20 特殊处理（I2C接口）
  if (dht_type === 'DHT20') {
    // 注册Blockly变量，类型为DHT20
    registerVariableToBlockly(varName, 'DHT20');
    
    // 确保DHT20库已添加
    ensureDHT20Library(generator);
    
    // 添加DHT20对象定义（使用Wire）
    var dht20Def = 'DHT20 ' + varName + '(&Wire);';
    generator.addVariable(varName, dht20Def);
    
    generator.sensorVarName = varName;
    
    // 在setup中初始化I2C和DHT20
    generator.addSetupBegin('wire_begin', 'Wire.begin();');
    generator.addSetupBegin(varName + '_begin', varName + '.begin();');
  } else {
    // DHT11/22/21 处理（单总线接口）
    // 注册Blockly变量，类型为DHT，同名变量只注册一次
    registerVariableToBlockly(varName, 'DHT');
    
    // 确保DHT库已添加
    ensureDHTLibrary(generator);
    
    // 添加DHT对象定义，使用用户指定的变量名
    var dhtDef = 'DHT ' + varName + '(' + pin + ', ' + dht_type + ');';
    generator.addVariable(varName, dhtDef);
    
    generator.sensorVarName = varName;
    
    // 在setup中初始化DHT对象
    generator.addSetupBegin(varName + '_begin', varName + '.begin();');
  }

  // 使用ensureDHTInit确保DHT传感器初始化
  // ensureDHTInit(pin, dht_type, generator);

  return '';
};

Arduino.forBlock['dht_read_temperature'] = function (block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dht';
  
  // 通过类型映射表检查是否为DHT20
  const dhtType = Arduino.dhtTypeMap[varName] || 'DHT11';
  
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
  const dhtType = Arduino.dhtTypeMap[varName] || 'DHT11';
  
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
  const dhtType = Arduino.dhtTypeMap[varName] || 'DHT11';
  
  // DHT20 的成功判断方式不同
  if (dhtType === 'DHT20') {
    return ['(' + varName + '.read() == DHT20_OK)', Arduino.ORDER_RELATIONAL];
  }
  
  return ['!isnan(' + varName + '.readTemperature()) && !isnan(' + varName + '.readHumidity())', Arduino.ORDER_LOGICAL_AND];
};

