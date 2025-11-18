/**
 * ESP32蓝牙游戏手柄库代码生成器
 */

// 全局变量跟踪
Arduino.esp32BleGamepadInitialized = false;
Arduino.esp32BleGamepadPins = {};

Arduino.forBlock['esp32_ble_gamepad_init'] = function (block, generator) {
    var deviceName = generator.valueToCode(block, 'DEVICE_NAME', generator.ORDER_ATOMIC) || '"ESP32 Gamepad"';
    
    // 添加必要的库引用

    generator.addLibrary('GamepadDevice', '#include <GamepadDevice.h>');
    generator.addLibrary('BleCompositeHID', '#include <BleCompositeHID.h>');
    
    // 添加全局对象
    generator.addObject('compositeHID', 'BleCompositeHID compositeHID(' + deviceName + ', "aily Project", 100);');
    generator.addObject('gamepad', 'GamepadDevice* gamepad;');
    
    // 添加初始化代码到setup
    generator.addSetupBegin('gamepad_init', 
        'gamepad = new GamepadDevice();\n' +
        '  compositeHID.addDevice(gamepad);\n' +
        '  compositeHID.begin();'
    );
    
    Arduino.esp32BleGamepadInitialized = true;
    return '';
};

Arduino.forBlock['esp32_ble_gamepad_connected'] = function (block, generator) {
    if (!Arduino.esp32BleGamepadInitialized) {
        // 自动初始化
    
        generator.addLibrary('GamepadDevice', '#include <GamepadDevice.h>');
        generator.addLibrary('BleCompositeHID', '#include <BleCompositeHID.h>');
        
        generator.addObject('compositeHID', 'BleCompositeHID compositeHID;');
        generator.addObject('gamepad', 'GamepadDevice* gamepad;');
        
        generator.addSetupBegin('gamepad_init', 
            'gamepad = new GamepadDevice();\n' +
            '  compositeHID.addDevice(gamepad);\n' +
            '  compositeHID.begin();'
        );
        
        Arduino.esp32BleGamepadInitialized = true;
    } 
    
    var code = 'compositeHID.isConnected()';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_ble_gamepad_press_button'] = function (block, generator) {
    var button = block.getFieldValue('BUTTON');
    
    if (!Arduino.esp32BleGamepadInitialized) {
        // 自动初始化
    
        generator.addLibrary('GamepadDevice', '#include <GamepadDevice.h>');
        generator.addLibrary('BleCompositeHID', '#include <BleCompositeHID.h>');
        
        generator.addObject('compositeHID', 'BleCompositeHID compositeHID;');
        generator.addObject('gamepad', 'GamepadDevice* gamepad;');
        
        generator.addSetupBegin('gamepad_init', 
            'gamepad = new GamepadDevice();\n' +
            '  compositeHID.addDevice(gamepad);\n' +
            '  compositeHID.begin();'
        );
        
        Arduino.esp32BleGamepadInitialized = true;
    }
    
    var code = 'gamepad->press(' + button + ');\n';
    return code;
};

Arduino.forBlock['esp32_ble_gamepad_release_button'] = function (block, generator) {
    var button = block.getFieldValue('BUTTON');
    
    if (!Arduino.esp32BleGamepadInitialized) {
        // 自动初始化
    
        generator.addLibrary('GamepadDevice', '#include <GamepadDevice.h>');
        generator.addLibrary('BleCompositeHID', '#include <BleCompositeHID.h>');
        
        generator.addObject('compositeHID', 'BleCompositeHID compositeHID;');
        generator.addObject('gamepad', 'GamepadDevice* gamepad;');
        
        generator.addSetupBegin('gamepad_init', 
            'gamepad = new GamepadDevice();\n' +
            '  compositeHID.addDevice(gamepad);\n' +
            '  compositeHID.begin();'
        );
        
        Arduino.esp32BleGamepadInitialized = true;
    }
    
    var code = 'gamepad->release(' + button + ');\n';
    return code;
};

Arduino.forBlock['esp32_ble_gamepad_button_with_pin'] = function (block, generator) {
    var pin = block.getFieldValue('PIN');
    var pinMode = block.getFieldValue('PIN_MODE');
    var button = block.getFieldValue('BUTTON');
    
    if (!Arduino.esp32BleGamepadInitialized) {
        // 自动初始化
    
        generator.addLibrary('GamepadDevice', '#include <GamepadDevice.h>');
        generator.addLibrary('BleCompositeHID', '#include <BleCompositeHID.h>');
        
        generator.addObject('compositeHID', 'BleCompositeHID compositeHID;');
        generator.addObject('gamepad', 'GamepadDevice* gamepad;');
        
        generator.addSetupBegin('gamepad_init', 
            'gamepad = new GamepadDevice();\n' +
            '  compositeHID.addDevice(gamepad);\n' +
            '  compositeHID.begin();'
        );
        
        Arduino.esp32BleGamepadInitialized = true;
    }
    
    // 添加引脚初始化
    generator.addSetupBegin('pin_' + pin + '_init', 'pinMode(' + pin + ', ' + pinMode + ');');
    
    // 添加按键状态变量
    var buttonStateVar = 'previousButton' + pin + 'State';
    generator.addVariable(buttonStateVar, 'int ' + buttonStateVar + ' = HIGH;');
    
    // 生成按键检测代码
    var activeLevel = (pinMode === 'INPUT_PULLUP') ? 'LOW' : 'HIGH'; 
    var inactiveLevel = (pinMode === 'INPUT_PULLUP') ? 'HIGH' : 'LOW';
    
    var code = 'if (compositeHID.isConnected()) {\n' +
               '    int currentButton' + pin + 'State = digitalRead(' + pin + ');\n' +
               '    if (currentButton' + pin + 'State != ' + buttonStateVar + ') {\n' +
               '      if (currentButton' + pin + 'State == ' + activeLevel + ') {\n' +
               '        gamepad->press(' + button + ');\n' +
               '      } else {\n' +
               '        gamepad->release(' + button + ');\n' +
               '      }\n' +
               '    }\n' +
               '    ' + buttonStateVar + ' = currentButton' + pin + 'State;\n' +
               '  }\n';
    
    return code;
};

Arduino.forBlock['esp32_ble_gamepad_set_axes'] = function (block, generator) {
    var xAxis = generator.valueToCode(block, 'X_AXIS', generator.ORDER_ATOMIC) || '0';
    var yAxis = generator.valueToCode(block, 'Y_AXIS', generator.ORDER_ATOMIC) || '0';
    
    if (!Arduino.esp32BleGamepadInitialized) {
        // 自动初始化
    
        generator.addLibrary('GamepadDevice', '#include <GamepadDevice.h>');
        generator.addLibrary('BleCompositeHID', '#include <BleCompositeHID.h>');
        
        generator.addObject('compositeHID', 'BleCompositeHID compositeHID;');
        generator.addObject('gamepad', 'GamepadDevice* gamepad;');
        
        generator.addSetupBegin('gamepad_init', 
            'gamepad = new GamepadDevice();\n' +
            '  compositeHID.addDevice(gamepad);\n' +
            '  compositeHID.begin();'
        );
        
        Arduino.esp32BleGamepadInitialized = true;
    }
    
    var code = 'gamepad->setLeftThumb(' + xAxis + ', ' + yAxis + ');\n';
    return code;
};

Arduino.forBlock['esp32_ble_gamepad_set_hat'] = function (block, generator) {
    var hatDirection = block.getFieldValue('HAT_DIRECTION');
    
    if (!Arduino.esp32BleGamepadInitialized) {
        // 自动初始化
    
        generator.addLibrary('GamepadDevice', '#include <GamepadDevice.h>');
        generator.addLibrary('BleCompositeHID', '#include <BleCompositeHID.h>');
        
        generator.addObject('compositeHID', 'BleCompositeHID compositeHID;');
        generator.addObject('gamepad', 'GamepadDevice* gamepad;');
        
        generator.addSetupBegin('gamepad_init', 
            'gamepad = new GamepadDevice();\n' +
            '  compositeHID.addDevice(gamepad);\n' +
            '  compositeHID.begin();'
        );
        
        Arduino.esp32BleGamepadInitialized = true;
    }
    
    var code = 'gamepad->setHat1(' + hatDirection + ');\n';
    return code;
};

Arduino.forBlock['esp32_ble_gamepad_special_button'] = function (block, generator) {
    var specialButton = block.getFieldValue('SPECIAL_BUTTON');
    
    if (!Arduino.esp32BleGamepadInitialized) {
        // 自动初始化
    
        generator.addLibrary('GamepadDevice', '#include <GamepadDevice.h>');
        generator.addLibrary('BleCompositeHID', '#include <BleCompositeHID.h>');
        
        generator.addObject('compositeHID', 'BleCompositeHID compositeHID;');
        generator.addObject('gamepad', 'GamepadDevice* gamepad;');
        
        generator.addSetupBegin('gamepad_init', 
            'gamepad = new GamepadDevice();\n' +
            '  compositeHID.addDevice(gamepad);\n' +
            '  compositeHID.begin();'
        );
        
        Arduino.esp32BleGamepadInitialized = true;
    }
    
    var code = 'gamepad->press' + specialButton + '();\n';
    return code;
};

Arduino.forBlock['esp32_ble_gamepad_release_special_button'] = function (block, generator) {
    var specialButton = block.getFieldValue('SPECIAL_BUTTON');
    
    if (!Arduino.esp32BleGamepadInitialized) {
        // 自动初始化
    
        generator.addLibrary('GamepadDevice', '#include <GamepadDevice.h>');
        generator.addLibrary('BleCompositeHID', '#include <BleCompositeHID.h>');
        
        generator.addObject('compositeHID', 'BleCompositeHID compositeHID;');
        generator.addObject('gamepad', 'GamepadDevice* gamepad;');
        
        generator.addSetupBegin('gamepad_init', 
            'gamepad = new GamepadDevice();\n' +
            '  compositeHID.addDevice(gamepad);\n' +
            '  compositeHID.begin();'
        );
        
        Arduino.esp32BleGamepadInitialized = true;
    }
    
    var code = 'gamepad->release' + specialButton + '();\n';
    return code;
};

Arduino.forBlock['esp32_ble_gamepad_analog_read'] = function (block, generator) {
    var analogPin = block.getFieldValue('ANALOG_PIN');
    var axis = block.getFieldValue('AXIS');
    
    if (!Arduino.esp32BleGamepadInitialized) {
        // 自动初始化
    
        generator.addLibrary('GamepadDevice', '#include <GamepadDevice.h>');
        generator.addLibrary('BleCompositeHID', '#include <BleCompositeHID.h>');
        
        generator.addObject('compositeHID', 'BleCompositeHID compositeHID;');
        generator.addObject('gamepad', 'GamepadDevice* gamepad;');
        
        generator.addSetupBegin('gamepad_init', 
            'gamepad = new GamepadDevice();\n' +
            '  compositeHID.addDevice(gamepad);\n' +
            '  compositeHID.begin();'
        );
        
        Arduino.esp32BleGamepadInitialized = true;
    }
    
    // 生成模拟读取和映射代码
    var code = '{\n' +
               '    int potValue = analogRead(' + analogPin + ');\n' +
               '    int adjustedValue = map(potValue, 0, 4095, -32768, 32767);\n' +
               '    gamepad->set' + axis + '(adjustedValue);\n' +
               '  }\n';
    
    return code;
};
