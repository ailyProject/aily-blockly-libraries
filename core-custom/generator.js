// ============================================================
// lib-core-custom Generator
// 自定义代码库 - 用于补充标准Blockly库未提供的功能
// ============================================================

// ===== 自定义代码插入 =====

Arduino.forBlock['custom_code'] = function (block, generator) {
    const code = block.getFieldValue('CODE');
    return code + '\n';
};

Arduino.forBlock['custom_code2'] = function (block, generator) {
    const code = block.getFieldValue('CODE');
    return [code, generator.ORDER_ATOMIC];
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

// ===== 预处理指令 =====

Arduino.forBlock['custom_macro'] = function (block, generator) {
    const name = block.getFieldValue('NAME');
    const value = block.getFieldValue('VALUE');
    const code = '#define ' + name + ' ' + value;
    generator.addMacro(name, code);
    return '';
};

Arduino.forBlock['custom_library'] = function (block, generator) {
    const libName = block.getFieldValue('LIB_NAME');
    // 智能判断是否需要添加尖括号
    let code;
    if (libName.startsWith('<') || libName.startsWith('"')) {
        code = '#include ' + libName;
    } else if (libName.endsWith('.h') || libName.endsWith('.hpp')) {
        code = '#include <' + libName + '>';
    } else {
        code = '#include <' + libName + '.h>';
    }
    generator.addLibrary(libName.replace(/[<>"]/g, ''), code);
    return '';
};

// ===== 条件编译 =====

Arduino.forBlock['custom_ifdef'] = function (block, generator) {
    const macro = block.getFieldValue('MACRO');
    const statements = generator.statementToCode(block, 'CODE');
    
    let code = '#ifdef ' + macro + '\n';
    code += statements;
    code += '#endif // ' + macro + '\n';
    
    return code;
};

Arduino.forBlock['custom_ifndef'] = function (block, generator) {
    const macro = block.getFieldValue('MACRO');
    const statements = generator.statementToCode(block, 'CODE');
    
    let code = '#ifndef ' + macro + '\n';
    code += statements;
    code += '#endif // !' + macro + '\n';
    
    return code;
};

Arduino.forBlock['custom_ifdef_else'] = function (block, generator) {
    const macro = block.getFieldValue('MACRO');
    const ifCode = generator.statementToCode(block, 'IF_CODE');
    const elseCode = generator.statementToCode(block, 'ELSE_CODE');
    
    let code = '#ifdef ' + macro + '\n';
    code += ifCode;
    code += '#else\n';
    code += elseCode;
    code += '#endif // ' + macro + '\n';
    
    return code;
};

// ===== 函数定义与调用 =====

Arduino.forBlock['custom_function'] = function (block, generator) {
    const name = block.getFieldValue('NAME');
    const returnType = block.getFieldValue('RETURN');
    const params = block.getFieldValue('PARAMS');
    const body = generator.statementToCode(block, 'BODY');

    const code = returnType + ' ' + name + '(' + params + ') {\n' + body + '}';
    generator.addFunction(name, code);
    return '';
};

Arduino.forBlock['custom_function_text'] = function (block, generator) {
    const name = block.getFieldValue('NAME');
    const returnType = block.getFieldValue('RETURN');
    const params = block.getFieldValue('PARAMS');
    const body = block.getFieldValue('BODY');
    
    // 格式化函数体（处理缩进）
    const formattedBody = body.split('\n').map(line => '  ' + line).join('\n');

    const code = returnType + ' ' + name + '(' + params + ') {\n' + formattedBody + '\n}';
    generator.addFunction(name, code);
    return '';
};

Arduino.forBlock['custom_function_call'] = function (block, generator) {
    const name = block.getFieldValue('NAME');
    const args = block.getFieldValue('ARGS');
    return name + '(' + args + ');\n';
};

Arduino.forBlock['custom_function_call_return'] = function (block, generator) {
    const name = block.getFieldValue('NAME');
    const args = block.getFieldValue('ARGS');
    return [name + '(' + args + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['custom_return'] = function (block, generator) {
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_NONE) || '';
    if (value) {
        return 'return ' + value + ';\n';
    }
    return 'return;\n';
};

Arduino.forBlock['custom_return_void'] = function (block, generator) {
    return 'return;\n';
};

// ===== 注释 =====

Arduino.forBlock['comment'] = function (block, generator) {
    const text = block.getFieldValue('TEXT');
    return '// ' + text + '\n';
};

Arduino.forBlock['comment_multiline'] = function (block, generator) {
    const text = block.getFieldValue('TEXT');
    const lines = text.split('\n');
    
    let code = '/*\n';
    for (const line of lines) {
        code += ' * ' + line + '\n';
    }
    code += ' */\n';
    
    return code;
};

Arduino.forBlock['comment_wrapper'] = function (block, generator) {
    const text = block.getFieldValue('TEXT');
    const statements = generator.statementToCode(block, 'STATEMENTS');
    
    let code = '// ===== [BEGIN] ' + text + ' =====\n';
    code += statements;
    code += '// ===== [END] ' + text + ' =====\n';
    
    return code;
};

// ===== 高级运算符与表达式 =====

Arduino.forBlock['custom_sizeof'] = function (block, generator) {
    const target = block.getFieldValue('TARGET');
    return ['sizeof(' + target + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['custom_cast'] = function (block, generator) {
    const type = block.getFieldValue('TYPE');
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_NONE) || '0';
    return ['(' + type + ')' + value, generator.ORDER_UNARY_PREFIX];
};

Arduino.forBlock['custom_ternary'] = function (block, generator) {
    const condition = generator.valueToCode(block, 'CONDITION', generator.ORDER_CONDITIONAL) || 'true';
    const ifTrue = generator.valueToCode(block, 'IF_TRUE', generator.ORDER_CONDITIONAL) || '0';
    const ifFalse = generator.valueToCode(block, 'IF_FALSE', generator.ORDER_CONDITIONAL) || '0';
    return ['(' + condition + ' ? ' + ifTrue + ' : ' + ifFalse + ')', generator.ORDER_CONDITIONAL];
};

Arduino.forBlock['custom_pointer_ref'] = function (block, generator) {
    const op = block.getFieldValue('OP');
    const varName = block.getFieldValue('VAR');
    return [op + varName, generator.ORDER_UNARY_PREFIX];
};

Arduino.forBlock['custom_array_access'] = function (block, generator) {
    const array = block.getFieldValue('ARRAY');
    const index = generator.valueToCode(block, 'INDEX', generator.ORDER_NONE) || '0';
    return [array + '[' + index + ']', generator.ORDER_MEMBER];
};

Arduino.forBlock['custom_struct_access'] = function (block, generator) {
    const struct = block.getFieldValue('STRUCT');
    const op = block.getFieldValue('OP');
    const member = block.getFieldValue('MEMBER');
    return [struct + op + member, generator.ORDER_MEMBER];
};
