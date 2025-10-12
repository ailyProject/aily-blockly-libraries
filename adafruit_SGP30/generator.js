// SGP30 Generator Functions

Arduino.forBlock['sgp30_init'] = function(block, generator) {
    generator.addLibrary('#include "Adafruit_SGP30.h"', '#include "Adafruit_SGP30.h"');
    generator.addObject('Adafruit_SGP30 sgp', 'Adafruit_SGP30 sgp;');
    
    // 添加I2C初始化
    generator.addSetupBegin('WIRE_BEGIN', 'Wire.begin();');
    generator.addLibrary('WIRE_INCLUDE', '#include <Wire.h>');

    var code = 'if (!sgp.begin()) {\n';
    code += '  Serial.println("SGP30 sensor not found!");\n';
    code += '  while(1);\n';
    code += '}\n';
    code += 'Serial.println("SGP30 sensor initialized");\n';
    
    return code;
};

Arduino.forBlock['sgp30_measure'] = function(block, generator) {
    var code = 'if (!sgp.IAQmeasure()) {\n';
    code += '  Serial.println("SGP30 measurement failed");\n';
    code += '}\n';
    
    return code;
};

Arduino.forBlock['sgp30_get_tvoc'] = function(block, generator) {
    return ['sgp.TVOC', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sgp30_get_eco2'] = function(block, generator) {
    return ['sgp.eCO2', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sgp30_measure_raw'] = function(block, generator) {
    var code = 'if (!sgp.IAQmeasureRaw()) {\n';
    code += '  Serial.println("SGP30 raw measurement failed");\n';
    code += '}\n';
    
    return code;
};

Arduino.forBlock['sgp30_get_raw_h2'] = function(block, generator) {
    return ['sgp.rawH2', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sgp30_get_raw_ethanol'] = function(block, generator) {
    return ['sgp.rawEthanol', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sgp30_set_humidity'] = function(block, generator) {
    generator.addFunction('getAbsoluteHumidity', 
        'uint32_t getAbsoluteHumidity(float temperature, float humidity) {\n' +
        '  const float absoluteHumidity = 216.7f * ((humidity / 100.0f) * 6.112f * exp((17.62f * temperature) / (243.12f + temperature)) / (273.15f + temperature));\n' +
        '  const uint32_t absoluteHumidityScaled = static_cast<uint32_t>(1000.0f * absoluteHumidity);\n' +
        '  return absoluteHumidityScaled;\n' +
        '}\n'
    );
    
    var temperature = generator.valueToCode(block, 'TEMPERATURE', generator.ORDER_ATOMIC) || '22.0';
    var humidity = generator.valueToCode(block, 'HUMIDITY', generator.ORDER_ATOMIC) || '45.0';
    
    var code = 'sgp.setHumidity(getAbsoluteHumidity(' + temperature + ', ' + humidity + '));\n';
    
    return code;
};

Arduino.forBlock['sgp30_get_baseline'] = function(block, generator) {
    // 固定变量名
    var eco2_var = 'eco2_baseline';
    var tvoc_var = 'tvoc_baseline';

    generator.addVariable('uint16_t ' + eco2_var, 'uint16_t ' + eco2_var + ';');
    generator.addVariable('uint16_t ' + tvoc_var, 'uint16_t ' + tvoc_var + ';');

    var code = 'if (!sgp.getIAQBaseline(&' + eco2_var + ', &' + tvoc_var + ')) {\n';
    code += '  Serial.println("Failed to get baseline readings");\n';
    code += '}\n';
    return code;
};

Arduino.forBlock['sgp30_set_baseline'] = function(block, generator) {
    var eco2_base = generator.valueToCode(block, 'ECO2_BASE', generator.ORDER_ATOMIC) || '0x8E68';
    var tvoc_base = generator.valueToCode(block, 'TVOC_BASE', generator.ORDER_ATOMIC) || '0x8F41';
    
    var code = 'sgp.setIAQBaseline(' + eco2_base + ', ' + tvoc_base + ');\n';
    
    return code;
};

Arduino.forBlock['sgp30_get_serial'] = function(block, generator) {
    var code = 'String(sgp.serialnumber[0], HEX) + String(sgp.serialnumber[1], HEX) + String(sgp.serialnumber[2], HEX)';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['sgp30_simple_measure'] = function(block, generator) {
    generator.addLibrary('#include <Wire.h>', '#include <Wire.h>');
    generator.addLibrary('#include "Adafruit_SGP30.h"', '#include "Adafruit_SGP30.h"');
    generator.addObject('Adafruit_SGP30 sgp', 'Adafruit_SGP30 sgp;');
    
    var type = block.getFieldValue('TYPE');
    
    // 自动初始化
    generator.addSetupBegin('sgp30_auto_init', 
        'if (!sgp.begin()) {\n' +
        '  Serial.println("SGP30 sensor not found!");\n' +
        '  while(1);\n' +
        '}\n'
    );
    
    var code = '';
    if (type === 'TVOC') {
        code = '(sgp.IAQmeasure() ? sgp.TVOC : 0)';
    } else if (type === 'ECO2') {
        code = '(sgp.IAQmeasure() ? sgp.eCO2 : 0)';
    }
    
    return [code, generator.ORDER_CONDITIONAL];
};
