// NTC Thermistor Generator for Arduino Blockly

Arduino.forBlock['ntc_init'] = function(block, generator) {
    const pin = block.getFieldValue('PIN');
    const refResistance = block.getFieldValue('REF_RESISTANCE');
    const nominalResistance = block.getFieldValue('NOMINAL_RESISTANCE');
    const nominalTemp = block.getFieldValue('NOMINAL_TEMP');
    const bValue = block.getFieldValue('B_VALUE');
    
    // 生成变量名
    const variable = `ntc_temp_${pin}`;
    
    // 添加库引用
    generator.addLibrary('ntc_lib', '#include <Thermistor.h>\n#include <NTC_Thermistor.h>');
    
    // 根据开发板类型选择合适的构造函数
    if (window['boardConfig'] && window['boardConfig'].core.indexOf('esp32') > -1) {
        // ESP32版本，使用更精确的构造函数
        generator.addObject('ntc_' + pin, 
            `NTC_Thermistor* ${variable} = new NTC_Thermistor_ESP32(${pin}, ${refResistance}, ${nominalResistance}, ${nominalTemp}, ${bValue}, 3300, 4095);`);
    } else {
        // Arduino版本
        generator.addObject('ntc_' + pin, 
            `NTC_Thermistor* ${variable} = new NTC_Thermistor(${pin}, ${refResistance}, ${nominalResistance}, ${nominalTemp}, ${bValue});`);
    }
    
    return '';
};

Arduino.forBlock['ntc_read_celsius'] = function(block, generator) {
    const pin = block.getFieldValue('PIN');
    const variable = `ntc_temp_${pin}`;
    
    // 添加库引用
    generator.addLibrary('ntc_lib', '#include <Thermistor.h>\n#include <NTC_Thermistor.h>');
    
    // 如果变量不存在，创建默认的NTC对象
    if (window['boardConfig'] && window['boardConfig'].core.indexOf('esp32') > -1) {
        generator.addObject('ntc_' + pin, 
            `NTC_Thermistor* ${variable} = new NTC_Thermistor_ESP32(${pin}, 10000, 10000, 25, 3950, 3300, 4095);`);
    } else {
        generator.addObject('ntc_' + pin, 
            `NTC_Thermistor* ${variable} = new NTC_Thermistor(${pin}, 10000, 10000, 25, 3950);`);
    }
    
    return [`${variable}->readCelsius()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ntc_read_fahrenheit'] = function(block, generator) {
    const pin = block.getFieldValue('PIN');
    const variable = `ntc_temp_${pin}`;
    
    // 添加库引用
    generator.addLibrary('ntc_lib', '#include <Thermistor.h>\n#include <NTC_Thermistor.h>');
    
    // 如果变量不存在，创建默认的NTC对象
    if (window['boardConfig'] && window['boardConfig'].core.indexOf('esp32') > -1) {
        generator.addObject('ntc_' + pin, 
            `NTC_Thermistor* ${variable} = new NTC_Thermistor_ESP32(${pin}, 10000, 10000, 25, 3950, 3300, 4095);`);
    } else {
        generator.addObject('ntc_' + pin, 
            `NTC_Thermistor* ${variable} = new NTC_Thermistor(${pin}, 10000, 10000, 25, 3950);`);
    }
    
    return [`${variable}->readFahrenheit()`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ntc_read_kelvin'] = function(block, generator) {
    const pin = block.getFieldValue('PIN');
    const variable = `ntc_temp_${pin}`;
    
    // 添加库引用
    generator.addLibrary('ntc_lib', '#include <Thermistor.h>\n#include <NTC_Thermistor.h>');
    
    // 如果变量不存在，创建默认的NTC对象
    if (window['boardConfig'] && window['boardConfig'].core.indexOf('esp32') > -1) {
        generator.addObject('ntc_' + pin, 
            `NTC_Thermistor* ${variable} = new NTC_Thermistor_ESP32(${pin}, 10000, 10000, 25, 3950, 3300, 4095);`);
    } else {
        generator.addObject('ntc_' + pin, 
            `NTC_Thermistor* ${variable} = new NTC_Thermistor(${pin}, 10000, 10000, 25, 3950);`);
    }
    
    return [`${variable}->readKelvin()`, Arduino.ORDER_FUNCTION_CALL];
};
