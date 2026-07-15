function getTaojingchiSerial(generator) {
    return generator.taojingchiSerialPort || 'Serial1';
}

Arduino.forBlock['taojingchi_stm32_init'] = function(block, generator) {
    const serialPort = block.getFieldValue('SERIAL_PORT') || 'Serial1';
    const baud = block.getFieldValue('BAUD') || '9600';
    
    generator.taojingchiSerialPort = serialPort;
    generator.addSetup('taojingchi_stm32_init', serialPort + '.begin(' + baud + ');');
    
    return '';
};

Arduino.forBlock['taojingchi_stm32_backlight'] = function(block, generator) {
    const brightness = generator.valueToCode(block, 'BRIGHTNESS', Arduino.ORDER_ATOMIC) || '100';
    const serialObj = getTaojingchiSerial(generator);
    
    const code = serialObj + '.print("dim=" + String(' + brightness + '));\n' +
        serialObj + '.write(0xFF);\n' +
        serialObj + '.write(0xFF);\n' +
        serialObj + '.write(0xFF);\n' +
        'delay(10);\n';
    return code;
};

Arduino.forBlock['taojingchi_stm32_display_page'] = function(block, generator) {
    const page = generator.valueToCode(block, 'PAGE', Arduino.ORDER_ATOMIC) || '0';
    const serialObj = getTaojingchiSerial(generator);
    
    const code = serialObj + '.print("page" + String(' + page + '));\n' +
        serialObj + '.write(0xFF);\n' +
        serialObj + '.write(0xFF);\n' +
        serialObj + '.write(0xFF);\n' +
        'delay(10);\n';
    return code;
};

Arduino.forBlock['taojingchi_stm32_set_var'] = function(block, generator) {
    const varName = block.getFieldValue('VARNAME');
    const value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '0';
    const serialObj = getTaojingchiSerial(generator);
    
    const code = serialObj + '.print("' + varName + '=" + String((int)' + value + '));\n' +
        serialObj + '.write(0xFF);\n' +
        serialObj + '.write(0xFF);\n' +
        serialObj + '.write(0xFF);\n' +
        'delay(10);\n';
    return code;
};

Arduino.forBlock['taojingchi_stm32_display_image'] = function(block, generator) {
    const page = generator.valueToCode(block, 'PAGE', Arduino.ORDER_ATOMIC) || '0';
    const img = generator.valueToCode(block, 'IMG', Arduino.ORDER_ATOMIC) || '0';
    const id = generator.valueToCode(block, 'ID', Arduino.ORDER_ATOMIC) || '0';
    const serialObj = getTaojingchiSerial(generator);
    
    const code = serialObj + '.print("page" + String(' + page + ') + ".p' +
        '" + String(' + img + ') + ".pic=" + String(' + id + '));\n' +
        serialObj + '.write(0xFF);\n' +
        serialObj + '.write(0xFF);\n' +
        serialObj + '.write(0xFF);\n' +
        'delay(10);\n';
    return code;
};

Arduino.forBlock['taojingchi_stm32_send_command'] = function(block, generator) {
    const command = generator.valueToCode(block, 'COMMAND', Arduino.ORDER_ATOMIC) || '"CMD"';
    const serialObj = getTaojingchiSerial(generator);
    
    const code = serialObj + '.print(' + command + ');\n' +
        serialObj + '.write(0xFF);\n' +
        serialObj + '.write(0xFF);\n' +
        serialObj + '.write(0xFF);\n' +
        'delay(10);\n';
    return code;
};

Arduino.forBlock['taojingchi_stm32_send_data'] = function(block, generator) {
    const command = generator.valueToCode(block, 'COMMAND', Arduino.ORDER_ATOMIC) || '"CMD"';
    const value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '0';
    const serialObj = getTaojingchiSerial(generator);
    
    const code = serialObj + '.print(' + command + ');\n' +
        serialObj + '.print("=");\n' +
        serialObj + '.print(String((int)' + value + '));\n' +
        serialObj + '.write(0xFF);\n' +
        serialObj + '.write(0xFF);\n' +
        serialObj + '.write(0xFF);\n' +
        'delay(10);\n';
    return code;
};
