// 跟踪已初始化的DHT传感器
// 在每次代码生成时重置跟踪状态
if (!Arduino.dhtCodeGeneration) {
  Arduino.dhtCodeGeneration = true;

  // 保存原始的代码生成方法
  const originalWorkspaceToCode = Arduino.workspaceToCode;

  // 重写代码生成方法以在开始时重置DHT跟踪
  Arduino.workspaceToCode = function(workspace) {
    // 重置DHT初始化跟踪
    Arduino.initializedDHTSensors = new Set();
    Arduino.addedDHTInitCode = new Set();

    // 调用原始方法
    return originalWorkspaceToCode ? originalWorkspaceToCode.call(this, workspace) : '';
  };
}

if (!Arduino.initializedDHTSensors) {
  Arduino.initializedDHTSensors = new Set();
}

if (!Arduino.addedDHTInitCode) {
  Arduino.addedDHTInitCode = new Set();
}

// 辅助函数，确保DHT传感器已被初始化
function ensureDHTInit(pin, dht_type, generator) {
  // 创建唯一的DHT标识符
  var dhtId = pin + '_' + dht_type.toLowerCase();
  var dhtObjName = 'dht_' + dhtId;

  // 检查这个DHT传感器是否已经添加过初始化代码
  if (!Arduino.addedDHTInitCode.has(dhtId)) {
    // 添加DHT库
    generator.addLibrary('DHT_include', '#include <DHT.h>');

    // 创建DHT对象
    var dhtDef = 'DHT ' + dhtObjName + '(' + pin + ', ' + dht_type + ');';
    generator.addVariable(dhtObjName + '_def', dhtDef);

    // 在setup中初始化DHT
    generator.addSetupBegin(dhtObjName + '_begin', dhtObjName + '.begin();');

    // 标记为已添加初始化代码
    Arduino.addedDHTInitCode.add(dhtId);
    Arduino.initializedDHTSensors.add(dhtId);
  }

  return dhtObjName;
}

Arduino.forBlock['dht_init'] = function (block, generator) {
    var dht_type = block.getFieldValue('TYPE');
    var pin = block.getFieldValue('PIN');

    // 使用ensureDHTInit确保DHT传感器初始化
    ensureDHTInit(pin, dht_type, generator);

    return '';
};

Arduino.forBlock['dht_read_temperature'] = function (block, generator) {
    var dht_type = block.getFieldValue('TYPE');
    var pin = block.getFieldValue('PIN');

    // 使用ensureDHTInit确保DHT传感器初始化并获取对象名
    var dhtObjName = ensureDHTInit(pin, dht_type, generator);

    return [dhtObjName + '.readTemperature()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['dht_read_humidity'] = function (block, generator) {
    var dht_type = block.getFieldValue('TYPE');
    var pin = block.getFieldValue('PIN');

    // 使用ensureDHTInit确保DHT传感器初始化并获取对象名
    var dhtObjName = ensureDHTInit(pin, dht_type, generator);

    return [dhtObjName + '.readHumidity()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['dht_read_success'] = function (block, generator) {
    var dht_type = block.getFieldValue('TYPE');
    var pin = block.getFieldValue('PIN');

    // 使用ensureDHTInit确保DHT传感器初始化并获取对象名
    var dhtObjName = ensureDHTInit(pin, dht_type, generator);

    return ['!isnan(' + dhtObjName + '.readTemperature()) && !isnan(' + dhtObjName + '.readHumidity())', Arduino.ORDER_LOGICAL_AND];
};

