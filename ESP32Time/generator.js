Arduino.forBlock['esp32_time_init'] = function(block, generator) {
    const offset = generator.valueToCode(block, 'OFFSET', Arduino.ORDER_ATOMIC) || '0';
    
    generator.addLibrary('#include <ESP32Time.h>', '#include <ESP32Time.h>');
    generator.addObject('ESP32Time rtc;', 'ESP32Time rtc;');
    
    return 'rtc.offset = ' + offset + ';\n';
};

Arduino.forBlock['esp32_time_set_datetime'] = function(block, generator) {
    const year = generator.valueToCode(block, 'YEAR', Arduino.ORDER_ATOMIC) || '2024';
    const month = generator.valueToCode(block, 'MONTH', Arduino.ORDER_ATOMIC) || '1';
    const day = generator.valueToCode(block, 'DAY', Arduino.ORDER_ATOMIC) || '1';
    const hour = generator.valueToCode(block, 'HOUR', Arduino.ORDER_ATOMIC) || '0';
    const minute = generator.valueToCode(block, 'MINUTE', Arduino.ORDER_ATOMIC) || '0';
    const second = generator.valueToCode(block, 'SECOND', Arduino.ORDER_ATOMIC) || '0';
    
    generator.addLibrary('#include <ESP32Time.h>', '#include <ESP32Time.h>');
    generator.addObject('ESP32Time rtc;', 'ESP32Time rtc;');
    
    return 'rtc.setTime(' + second + ', ' + minute + ', ' + hour + ', ' + day + ', ' + month + ', ' + year + ');\n';
};

Arduino.forBlock['esp32_time_set_epoch'] = function(block, generator) {
    const epoch = generator.valueToCode(block, 'EPOCH', Arduino.ORDER_ATOMIC) || '1609459200';
    
    generator.addLibrary('#include <ESP32Time.h>', '#include <ESP32Time.h>');
    generator.addObject('ESP32Time rtc;', 'ESP32Time rtc;');
    
    return 'rtc.setTime(' + epoch + ');\n';
};

Arduino.forBlock['esp32_time_get_time'] = function(block, generator) {
    generator.addLibrary('#include <ESP32Time.h>', '#include <ESP32Time.h>');
    generator.addObject('ESP32Time rtc;', 'ESP32Time rtc;');
    
    return ['rtc.getTime()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_time_get_date'] = function(block, generator) {
    const format = block.getFieldValue('FORMAT');
    
    generator.addLibrary('#include <ESP32Time.h>', '#include <ESP32Time.h>');
    generator.addObject('ESP32Time rtc;', 'ESP32Time rtc;');
    
    return ['rtc.getDate(' + format + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_time_get_datetime'] = function(block, generator) {
    const format = block.getFieldValue('FORMAT');
    
    generator.addLibrary('#include <ESP32Time.h>', '#include <ESP32Time.h>');
    generator.addObject('ESP32Time rtc;', 'ESP32Time rtc;');
    
    return ['rtc.getDateTime(' + format + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_time_get_format'] = function(block, generator) {
    const format = generator.valueToCode(block, 'FORMAT', Arduino.ORDER_ATOMIC) || '"%H:%M:%S"';
    
    generator.addLibrary('#include <ESP32Time.h>', '#include <ESP32Time.h>');
    generator.addObject('ESP32Time rtc;', 'ESP32Time rtc;');
    
    return ['rtc.getTime(' + format + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_time_get_epoch'] = function(block, generator) {
    generator.addLibrary('#include <ESP32Time.h>', '#include <ESP32Time.h>');
    generator.addObject('ESP32Time rtc;', 'ESP32Time rtc;');
    
    return ['rtc.getEpoch()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_time_get_second'] = function(block, generator) {
    generator.addLibrary('#include <ESP32Time.h>', '#include <ESP32Time.h>');
    generator.addObject('ESP32Time rtc;', 'ESP32Time rtc;');
    
    return ['rtc.getSecond()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_time_get_minute'] = function(block, generator) {
    generator.addLibrary('#include <ESP32Time.h>', '#include <ESP32Time.h>');
    generator.addObject('ESP32Time rtc;', 'ESP32Time rtc;');
    
    return ['rtc.getMinute()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_time_get_hour'] = function(block, generator) {
    const format = block.getFieldValue('FORMAT');
    
    generator.addLibrary('#include <ESP32Time.h>', '#include <ESP32Time.h>');
    generator.addObject('ESP32Time rtc;', 'ESP32Time rtc;');
    
    return ['rtc.getHour(' + format + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_time_get_ampm'] = function(block, generator) {
    const lowercase = block.getFieldValue('CASE');
    
    generator.addLibrary('#include <ESP32Time.h>', '#include <ESP32Time.h>');
    generator.addObject('ESP32Time rtc;', 'ESP32Time rtc;');
    
    return ['rtc.getAmPm(' + lowercase + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_time_get_day'] = function(block, generator) {
    generator.addLibrary('#include <ESP32Time.h>', '#include <ESP32Time.h>');
    generator.addObject('ESP32Time rtc;', 'ESP32Time rtc;');
    
    return ['rtc.getDay()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_time_get_month'] = function(block, generator) {
    generator.addLibrary('#include <ESP32Time.h>', '#include <ESP32Time.h>');
    generator.addObject('ESP32Time rtc;', 'ESP32Time rtc;');
    
    return ['rtc.getMonth()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_time_get_year'] = function(block, generator) {
    generator.addLibrary('#include <ESP32Time.h>', '#include <ESP32Time.h>');
    generator.addObject('ESP32Time rtc;', 'ESP32Time rtc;');
    
    return ['rtc.getYear()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_time_get_dayofweek'] = function(block, generator) {
    generator.addLibrary('#include <ESP32Time.h>', '#include <ESP32Time.h>');
    generator.addObject('ESP32Time rtc;', 'ESP32Time rtc;');
    
    return ['rtc.getDayofWeek()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_time_get_dayofyear'] = function(block, generator) {
    generator.addLibrary('#include <ESP32Time.h>', '#include <ESP32Time.h>');
    generator.addObject('ESP32Time rtc;', 'ESP32Time rtc;');
    
    return ['rtc.getDayofYear()', Arduino.ORDER_ATOMIC];
};