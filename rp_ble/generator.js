// Raspberry Pi Pico BLE (BTstack) Blockly库生成器
// 基于BTstackLib的Blockly实现

'use strict';

// 确保添加BTstack库
function ensureBTstackLib(generator) {
    generator.addLibrary('BTstackLib', '#include <BTstackLib.h>');
}

// 添加BTstack.loop()到主循环
function ensureBTstackLoop(generator) {
    generator.addLoopBegin('BTstack.loop();', 'BTstack.loop();');
}

// ==================== 初始化模块 ====================

// 初始化BLE（带设备名称）
Arduino.forBlock['rp_ble_setup'] = function(block, generator) {
    const name = generator.valueToCode(block, 'NAME', Arduino.ORDER_ATOMIC) || '"Pico BLE"';
    
    ensureBTstackLib(generator);
    ensureBTstackLoop(generator);
    
    return 'BTstack.setup(' + name + ');\n';
};

// 初始化BLE（简单模式）
Arduino.forBlock['rp_ble_setup_simple'] = function(block, generator) {
    ensureBTstackLib(generator);
    ensureBTstackLoop(generator);
    
    return 'BTstack.setup();\n';
};

// ==================== 广播模块 ====================

// 开始广播
Arduino.forBlock['rp_ble_start_advertising'] = function(block, generator) {
    ensureBTstackLib(generator);
    return 'BTstack.startAdvertising();\n';
};

// 停止广播
Arduino.forBlock['rp_ble_stop_advertising'] = function(block, generator) {
    ensureBTstackLib(generator);
    return 'BTstack.stopAdvertising();\n';
};

// 配置iBeacon
Arduino.forBlock['rp_ble_ibeacon_configure'] = function(block, generator) {
    const uuid = generator.valueToCode(block, 'UUID', Arduino.ORDER_ATOMIC) || '"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0"';
    const major = generator.valueToCode(block, 'MAJOR', Arduino.ORDER_ATOMIC) || '1';
    const minor = generator.valueToCode(block, 'MINOR', Arduino.ORDER_ATOMIC) || '1';
    
    ensureBTstackLib(generator);
    
    // 添加UUID变量
    const uuidVarName = '_ibeacon_uuid';
    generator.addVariable(uuidVarName, 'UUID ' + uuidVarName + '(' + uuid + ');');
    
    return 'BTstack.iBeaconConfigure(&' + uuidVarName + ', ' + major + ', ' + minor + ');\n';
};

// ==================== 扫描模块 ====================

// 开始扫描
Arduino.forBlock['rp_ble_start_scanning'] = function(block, generator) {
    ensureBTstackLib(generator);
    return 'BTstack.bleStartScanning();\n';
};

// 停止扫描
Arduino.forBlock['rp_ble_stop_scanning'] = function(block, generator) {
    ensureBTstackLib(generator);
    return 'BTstack.bleStopScanning();\n';
};

// 扫描到广播回调
Arduino.forBlock['rp_ble_on_advertisement'] = function(block, generator) {
    const advVarName = block.getFieldValue('ADV_VAR') || 'bleAdv';
    const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
    
    ensureBTstackLib(generator);
    
    // 注册变量到Blockly
    registerVariableToBlockly(advVarName, 'BLEAdvertisement');
    
    // 创建回调函数
    const callbackName = 'ble_advertisement_callback';
    const functionDef = `void ${callbackName}(BLEAdvertisement *${advVarName}) {
${handlerCode}
}`;
    
    generator.addFunction(callbackName, functionDef);
    
    // 在setup中设置回调
    const setupCode = 'BTstack.setBLEAdvertisementCallback(' + callbackName + ');';
    generator.addSetupBegin('ble_adv_callback_setup', setupCode);
    
    return '';
};

// 获取广播设备地址
Arduino.forBlock['rp_ble_adv_get_address'] = function(block, generator) {
    const varField = block.getField('ADV_VAR');
    const advVarName = varField ? varField.getText() : 'bleAdv';
    
    ensureBTstackLib(generator);
    
    return [advVarName + '->getBdAddr()->getAddressString()', Arduino.ORDER_MEMBER];
};

// 获取广播RSSI
Arduino.forBlock['rp_ble_adv_get_rssi'] = function(block, generator) {
    const varField = block.getField('ADV_VAR');
    const advVarName = varField ? varField.getText() : 'bleAdv';
    
    ensureBTstackLib(generator);
    
    return [advVarName + '->getRssi()', Arduino.ORDER_MEMBER];
};

// 检查是否为iBeacon
Arduino.forBlock['rp_ble_adv_is_ibeacon'] = function(block, generator) {
    const varField = block.getField('ADV_VAR');
    const advVarName = varField ? varField.getText() : 'bleAdv';
    
    ensureBTstackLib(generator);
    
    return [advVarName + '->isIBeacon()', Arduino.ORDER_MEMBER];
};

// 检查设备名前缀
Arduino.forBlock['rp_ble_adv_name_has_prefix'] = function(block, generator) {
    const varField = block.getField('ADV_VAR');
    const advVarName = varField ? varField.getText() : 'bleAdv';
    const prefix = generator.valueToCode(block, 'PREFIX', Arduino.ORDER_ATOMIC) || '""';
    
    ensureBTstackLib(generator);
    
    return [advVarName + '->nameHasPrefix(' + prefix + ')', Arduino.ORDER_MEMBER];
};

// ==================== GATT服务模块 ====================

// 添加GATT服务
Arduino.forBlock['rp_ble_add_service'] = function(block, generator) {
    const uuid = generator.valueToCode(block, 'UUID', Arduino.ORDER_ATOMIC) || '"B8E06067-62AD-41BA-9231-206AE80AB551"';
    
    ensureBTstackLib(generator);
    
    return 'BTstack.addGATTService(new UUID(' + uuid + '));\n';
};

// 添加静态特征
Arduino.forBlock['rp_ble_add_characteristic'] = function(block, generator) {
    const uuid = generator.valueToCode(block, 'UUID', Arduino.ORDER_ATOMIC) || '"f897177b-aee8-4767-8ecc-cc694fd5fcef"';
    const props = block.getFieldValue('PROPS') || 'ATT_PROPERTY_READ';
    const value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '"Hello"';
    
    ensureBTstackLib(generator);
    
    return 'BTstack.addGATTCharacteristic(new UUID(' + uuid + '), ' + props + ', ' + value + ');\n';
};

// 添加动态特征
Arduino.forBlock['rp_ble_add_characteristic_dynamic'] = function(block, generator) {
    const uuid = generator.valueToCode(block, 'UUID', Arduino.ORDER_ATOMIC) || '"f897177b-aee8-4767-8ecc-cc694fd5fce0"';
    const props = block.getFieldValue('PROPS') || 'ATT_PROPERTY_READ | ATT_PROPERTY_WRITE';
    const charId = generator.valueToCode(block, 'CHAR_ID', Arduino.ORDER_ATOMIC) || '0';
    
    ensureBTstackLib(generator);
    
    return 'BTstack.addGATTCharacteristicDynamic(new UUID(' + uuid + '), ' + props + ', ' + charId + ');\n';
};

// ==================== 连接回调模块 ====================

// 设备连接回调
Arduino.forBlock['rp_ble_on_device_connected'] = function(block, generator) {
    const devVarName = block.getFieldValue('DEV_VAR') || 'bleDevice';
    const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
    
    ensureBTstackLib(generator);
    
    // 注册变量到Blockly
    registerVariableToBlockly(devVarName, 'BLEDevice');
    
    // 创建回调函数
    const callbackName = 'ble_device_connected_callback';
    const functionDef = `void ${callbackName}(BLEStatus status, BLEDevice *${devVarName}) {
  if (status == BLE_STATUS_OK) {
${handlerCode}
  }
}`;
    
    generator.addFunction(callbackName, functionDef);
    
    // 在setup中设置回调
    const setupCode = 'BTstack.setBLEDeviceConnectedCallback(' + callbackName + ');';
    generator.addSetupBegin('ble_connected_callback_setup', setupCode);
    
    return '';
};

// 设备断开连接回调
Arduino.forBlock['rp_ble_on_device_disconnected'] = function(block, generator) {
    const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
    
    ensureBTstackLib(generator);
    
    // 创建回调函数
    const callbackName = 'ble_device_disconnected_callback';
    const functionDef = `void ${callbackName}(BLEDevice *device) {
${handlerCode}
}`;
    
    generator.addFunction(callbackName, functionDef);
    
    // 在setup中设置回调
    const setupCode = 'BTstack.setBLEDeviceDisconnectedCallback(' + callbackName + ');';
    generator.addSetupBegin('ble_disconnected_callback_setup', setupCode);
    
    return '';
};

// 特征读取回调
Arduino.forBlock['rp_ble_on_characteristic_read'] = function(block, generator) {
    const charIdVar = block.getFieldValue('CHAR_ID_VAR') || 'charId';
    const bufferVar = block.getFieldValue('BUFFER_VAR') || 'buffer';
    const sizeVar = block.getFieldValue('SIZE_VAR') || 'bufferSize';
    const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
    const returnSize = generator.valueToCode(block, 'RETURN_SIZE', Arduino.ORDER_ATOMIC) || '0';
    
    ensureBTstackLib(generator);
    
    // 注册变量到Blockly
    registerVariableToBlockly(bufferVar, 'uint8_t*');
    
    // 创建回调函数
    const callbackName = 'ble_gatt_read_callback';
    const functionDef = `uint16_t ${callbackName}(uint16_t ${charIdVar}, uint8_t * ${bufferVar}, uint16_t ${sizeVar}) {
${handlerCode}
  return ${returnSize};
}`;
    
    generator.addFunction(callbackName, functionDef);
    
    // 在setup中设置回调
    const setupCode = 'BTstack.setGATTCharacteristicRead(' + callbackName + ');';
    generator.addSetupBegin('ble_gatt_read_callback_setup', setupCode);
    
    return '';
};

// 特征写入回调
Arduino.forBlock['rp_ble_on_characteristic_write'] = function(block, generator) {
    const charIdVar = block.getFieldValue('CHAR_ID_VAR') || 'charId';
    const dataVar = block.getFieldValue('DATA_VAR') || 'data';
    const lenVar = block.getFieldValue('LEN_VAR') || 'dataLen';
    const handlerCode = generator.statementToCode(block, 'HANDLER') || '';
    
    ensureBTstackLib(generator);
    
    // 创建回调函数
    const callbackName = 'ble_gatt_write_callback';
    const functionDef = `int ${callbackName}(uint16_t ${charIdVar}, uint8_t *${dataVar}, uint16_t ${lenVar}) {
${handlerCode}
  return 0;
}`;
    
    generator.addFunction(callbackName, functionDef);
    
    // 在setup中设置回调
    const setupCode = 'BTstack.setGATTCharacteristicWrite(' + callbackName + ');';
    generator.addSetupBegin('ble_gatt_write_callback_setup', setupCode);
    
    return '';
};

// 写入缓冲区
Arduino.forBlock['rp_ble_write_buffer'] = function(block, generator) {
    const varField = block.getField('BUFFER_VAR');
    const bufferVar = varField ? varField.getText() : 'buffer';
    const data = generator.valueToCode(block, 'DATA', Arduino.ORDER_ATOMIC) || '0';
    
    ensureBTstackLib(generator);
    
    // 检测数据类型，生成不同的代码
    if (data.startsWith('"') || data.startsWith("'")) {
        // 字符串类型
        return 'if (' + bufferVar + ') { memcpy(' + bufferVar + ', ' + data + ', strlen(' + data + ')); }\n';
    } else {
        // 数字类型，写入单字节
        return 'if (' + bufferVar + ') { ' + bufferVar + '[0] = (uint8_t)(' + data + '); }\n';
    }
};

// ==================== 连接管理模块 ====================

// 连接BLE设备（通过地址）
Arduino.forBlock['rp_ble_connect'] = function(block, generator) {
    const address = generator.valueToCode(block, 'ADDRESS', Arduino.ORDER_ATOMIC) || '"00:00:00:00:00:00"';
    const timeout = generator.valueToCode(block, 'TIMEOUT', Arduino.ORDER_ATOMIC) || '10000';
    
    ensureBTstackLib(generator);
    
    return 'BTstack.bleConnect(PUBLIC_ADDRESS, ' + address + ', ' + timeout + ');\n';
};

// 连接BLE广播设备
Arduino.forBlock['rp_ble_connect_adv'] = function(block, generator) {
    const varField = block.getField('ADV_VAR');
    const advVarName = varField ? varField.getText() : 'bleAdv';
    const timeout = generator.valueToCode(block, 'TIMEOUT', Arduino.ORDER_ATOMIC) || '10000';
    
    ensureBTstackLib(generator);
    
    return 'BTstack.bleConnect(' + advVarName + ', ' + timeout + ');\n';
};

// 断开BLE设备
Arduino.forBlock['rp_ble_disconnect'] = function(block, generator) {
    const varField = block.getField('DEV_VAR');
    const devVarName = varField ? varField.getText() : 'bleDevice';
    
    ensureBTstackLib(generator);
    
    return 'BTstack.bleDisconnect(' + devVarName + ');\n';
};
