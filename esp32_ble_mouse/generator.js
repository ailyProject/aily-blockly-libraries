// ESP32 BLE Mouse Library Generator

Arduino.forBlock['ble_mouse_init'] = function(block, generator) {
    var deviceName = generator.valueToCode(block, 'DEVICE_NAME', Arduino.ORDER_ATOMIC) || '"BLE Mouse"';
    var manufacturer = generator.valueToCode(block, 'MANUFACTURER', Arduino.ORDER_ATOMIC) || '"ailyProject"';
    var battery = generator.valueToCode(block, 'BATTERY', Arduino.ORDER_ATOMIC) || '100';
    
    generator.addLibrary('ble_composite_hid', '#include <BleCompositeHID.h>');
    generator.addLibrary('mouse_device', '#include <MouseDevice.h>');
    generator.addVariable('mouse_device_ptr', 'MouseDevice* mouse = nullptr;');
    generator.addObject('ble_composite_hid_obj', 'BleCompositeHID compositeHID(' + deviceName + ', ' + manufacturer + ', ' + battery + ');');
    generator.addSetupEnd('ble_mouse_setup', 
        'mouse = new MouseDevice();\n' +
        '  compositeHID.addDevice(mouse);\n' +
        '  compositeHID.begin();'
    );
    
    return '';
};

Arduino.forBlock['ble_mouse_is_connected'] = function(block, generator) {
    return ['compositeHID.isConnected()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['ble_mouse_move'] = function(block, generator) {
    var x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC) || '0';
    var y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC) || '0';
    
    return 'if(mouse != nullptr && compositeHID.isConnected()) {\n' +
           '  mouse->mouseMove(' + x + ', ' + y + ');\n' +
           '  mouse->sendMouseReport();\n' +
           '}\n';
};

Arduino.forBlock['ble_mouse_click'] = function(block, generator) {
    var button = block.getFieldValue('BUTTON');
    var action = block.getFieldValue('ACTION');
    
    var code = 'if(mouse != nullptr && compositeHID.isConnected()) {\n';
    
    if (action === 'press') {
        code += '  mouse->mousePress(' + button + ');\n';
        code += '  mouse->sendMouseReport();\n';
    } else if (action === 'release') {
        code += '  mouse->mouseRelease(' + button + ');\n';
        code += '  mouse->sendMouseReport();\n';
    } else if (action === 'click') {
        code += '  mouse->mousePress(' + button + ');\n';
        code += '  mouse->sendMouseReport();\n';
        code += '  delay(50);\n';
        code += '  mouse->mouseRelease(' + button + ');\n';
        code += '  mouse->sendMouseReport();\n';
    }
    
    code += '}\n';
    return code;
};

Arduino.forBlock['ble_mouse_scroll'] = function(block, generator) {
    var scroll = generator.valueToCode(block, 'SCROLL', Arduino.ORDER_ATOMIC) || '0';
    
    return 'if(mouse != nullptr && compositeHID.isConnected()) {\n' +
           '  mouse->mouseScroll(' + scroll + ');\n' +
           '  mouse->sendMouseReport();\n' +
           '}\n';
};

Arduino.forBlock['ble_mouse_send_report'] = function(block, generator) {
    return 'if(mouse != nullptr && compositeHID.isConnected()) {\n' +
           '  mouse->sendMouseReport();\n' +
           '}\n';
};
