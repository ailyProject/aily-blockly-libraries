// Ticker 库的 generator.js
// 用于存储已创建的回调函数名称
if (!Arduino.tickerCallbacks) {
    Arduino.tickerCallbacks = new Map();
    Arduino.tickerCallbackCounter = 0;
}

// 生成唯一的回调函数名
Arduino.getTickerCallbackName = function (tickerVar, blockId) {
    const key = `${tickerVar}_${blockId}`;
    if (!Arduino.tickerCallbacks.has(key)) {
        Arduino.tickerCallbackCounter++;
        Arduino.tickerCallbacks.set(key, `ticker_callback_${Arduino.tickerCallbackCounter}`);
    }
    return Arduino.tickerCallbacks.get(key);
};

Arduino.forBlock['ticker_attach_ms'] = function (block, generator) {
    const tickerVar = block.getFieldValue('TICKER') || 'ticker1';
    const interval = generator.valueToCode(block, 'INTERVAL', generator.ORDER_ATOMIC) || '1000';
    const callback = generator.statementToCode(block, 'CALLBACK');

    // 添加库引用
    generator.addLibrary('#include <Ticker.h>', '#include <Ticker.h>');

    // 注册 Blockly 变量，类型为 Ticker
    if (typeof registerVariableToBlockly === 'function') {
        registerVariableToBlockly(tickerVar, 'Ticker');
    }

    // 实例化 Ticker 对象
    generator.addObject(`Ticker ${tickerVar}`, `Ticker ${tickerVar};`);

    // 生成唯一的回调函数名
    const callbackName = Arduino.getTickerCallbackName(tickerVar, block.id);

    const functionCode = `void ${callbackName}() {\n${callback}}`;
    generator.addFunction(callbackName, functionCode);

    // 返回 attach_ms 调用代码
    return `${tickerVar}.attach_ms(${interval}, ${callbackName});\n`;
};

Arduino.forBlock['ticker_once_ms'] = function (block, generator) {
    const tickerVar = block.getFieldValue('TICKER') || 'ticker1';
    const interval = generator.valueToCode(block, 'INTERVAL', generator.ORDER_ATOMIC) || '1000';
    const callback = generator.statementToCode(block, 'CALLBACK');

    // 添加库引用
    generator.addLibrary('#include <Ticker.h>', '#include <Ticker.h>');

    // 注册 Blockly 变量，类型为 Ticker
    if (typeof registerVariableToBlockly === 'function') {
        registerVariableToBlockly(tickerVar, 'Ticker');
    }

    // 实例化 Ticker 对象
    generator.addObject(`Ticker ${tickerVar}`, `Ticker ${tickerVar};`);

    // 生成唯一的回调函数名
    const callbackName = Arduino.getTickerCallbackName(tickerVar, block.id);

    const functionCode = `void ${callbackName}() {\n${callback}}`;
    generator.addFunction(callbackName, functionCode);

    // 返回 once_ms 调用代码
    return `${tickerVar}.once_ms(${interval}, ${callbackName});\n`;
};

Arduino.forBlock['ticker_detach'] = function (block, generator) {
    const varField = block.getField('TICKER');
    const tickerVar = varField ? varField.getText() : 'ticker1';

    // 添加库引用
    generator.addLibrary('#include <Ticker.h>', '#include <Ticker.h>');

    return `${tickerVar}.detach();\n`;
};

Arduino.forBlock['ticker_active'] = function (block, generator) {
    const varField = block.getField('TICKER');
    const tickerVar = varField ? varField.getText() : 'ticker1';

    // 添加库引用
    generator.addLibrary('#include <Ticker.h>', '#include <Ticker.h>');

    return [`${tickerVar}.active()`, generator.ORDER_ATOMIC];
};
