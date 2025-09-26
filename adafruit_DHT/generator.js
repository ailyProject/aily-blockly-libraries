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

Arduino.forBlock['dht_init'] = function (block, generator) {
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

  // 使用ensureDHTInit确保DHT传感器初始化
  // ensureDHTInit(pin, dht_type, generator);

  return '';
};

Arduino.forBlock['dht_read_temperature'] = function (block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dht';

  // 使用ensureDHTInit确保DHT传感器初始化并获取对象名
  // 直接使用块中的变量名作为对象名
  return [varName + '.readTemperature()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['dht_read_humidity'] = function (block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dht';

  // 使用ensureDHTInit确保DHT传感器初始化并获取对象名
  // 直接使用块中的变量名作为对象名
  return [varName + '.readHumidity()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['dht_read_success'] = function (block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'dht';

  // 使用ensureDHTInit确保DHT传感器初始化并获取对象名
  // 直接使用块中的变量名作为对象名
  return ['!isnan(' + varName + '.readTemperature()) && !isnan(' + varName + '.readHumidity())', Arduino.ORDER_LOGICAL_AND];
};

