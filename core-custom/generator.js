Arduino.forBlock['custom_code'] = function (block, generator) {
    const code = block.getFieldValue('CODE');
    return code + '\n';
};

Arduino.forBlock['custom_macro'] = function (block, generator) {
    const name = block.getFieldValue('NAME');
    const value = block.getFieldValue('VALUE');
    const code = '#define ' + name + ' ' + value;
    generator.addMacro(name, code);
    return '';
};

Arduino.forBlock['custom_library'] = function (block, generator) {
    const libName = block.getFieldValue('LIB_NAME');
    const code = '#include <' + libName + '>';
    generator.addLibrary(libName, code);
    return '';
};

Arduino.forBlock['custom_variable'] = function (block, generator) {
    const type = block.getFieldValue('TYPE');
    const name = block.getFieldValue('NAME');
    const value = block.getFieldValue('VALUE');
    const code = type + ' ' + name + ' = ' + value + ';';
    generator.addVariable(name, code);
    return '';
};

Arduino.forBlock['custom_function'] = function (block, generator) {
    const name = block.getFieldValue('NAME');
    const returnType = block.getFieldValue('RETURN');
    const params = block.getFieldValue('PARAMS');
    const body = block.getFieldValue('BODY');

    const code = returnType + ' ' + name + '(' + params + ') {\n' + body + '\n}';
    generator.addFunction(name, code);
    return '';
};

Arduino.forBlock['custom_insert_code'] = function (block, generator) {
    const position = block.getFieldValue('POSITION');
    const code = block.getFieldValue('CODE');
    const tag = 'custom_insert_' + position + '_' + Math.random().toString(36).substr(2, 9);

    switch (position) {
        case 'macro':
            generator.addMacro(tag, code);
            break;
        case 'library':
            generator.addLibrary(tag, code);
            break;
        case 'variable':
            generator.addVariable(tag, code);
            break;
        case 'object':
            generator.addObject(tag, code);
            break;
        case 'function':
            generator.addFunction(tag, code);
            break;
    }
    return '';
};

Arduino.forBlock['comment'] = function (block, generator) {
    const text = block.getFieldValue('TEXT');
    return '// ' + text + '\n';
};

Arduino.forBlock['comment_wrapper'] = function (block, generator) {
    const text = block.getFieldValue('TEXT');
    const statements = generator.statementToCode(block, 'STATEMENTS');
    
    let code = '// [BEGIN] ' + text + '\n';
    code += statements;
    code += '// [END] ' + text + '\n';
    
    return code;
};