// ESP32 Task Generator
// 基于DFRobot_Task库的代码生成器

// 创建任务块
Arduino.forBlock['esp32_task_new'] = function (block, generator) {
    // 添加库引用
    generator.addLibrary('DFRobot_Task', '#include <DFRobot_Task.h>');

    // 获取任务名称
    const taskName = block.getFieldValue('TASK_NAME') || 'task1';

    // 获取setup和loop代码
    const setupCode = generator.statementToCode(block, 'SETUP') || '';
    const loopCode = generator.statementToCode(block, 'LOOP') || '';

    // 生成任务定义宏
    let code = 'newTask(' + taskName + ');\n';

    // 生成setup函数
    code += 'void ' + taskName + '::setup() {\n';
    code += setupCode;
    code += '}\n\n';

    // 生成loop函数
    code += 'void ' + taskName + '::loop() {\n';
    code += loopCode;
    code += '}\n\n';

    // 将任务定义添加到全局作用域
    generator.addFunction('task_' + taskName, code);

    return ''; // Hat模式块返回空字符串
};

// 启动指定任务
Arduino.forBlock['esp32_task_start'] = function (block, generator) {
    // 添加库引用
    generator.addLibrary('DFRobot_Task', '#include <DFRobot_Task.h>');

    // 获取任务名称
    const taskName = generator.valueToCode(block, 'TASK_NAME', generator.ORDER_ATOMIC) || '""';

    // 如果是字符串字面量，移除引号并使用宏
    if (taskName.startsWith('"') && taskName.endsWith('"')) {
        const cleanName = taskName.slice(1, -1);
        return 'taskStart(' + cleanName + ');\n';
    }

    // 如果是变量，使用函数形式
    return 'mpythonFiberStart(' + taskName + ');\n';
};

// 启动所有任务
Arduino.forBlock['esp32_task_start_all'] = function (block, generator) {
    // 添加库引用
    generator.addLibrary('DFRobot_Task', '#include <DFRobot_Task.h>');

    return 'taskStart();\n';
};

// 释放指定任务
Arduino.forBlock['esp32_task_free'] = function (block, generator) {
    // 添加库引用
    generator.addLibrary('DFRobot_Task', '#include <DFRobot_Task.h>');

    // 获取任务名称
    const taskName = generator.valueToCode(block, 'TASK_NAME', generator.ORDER_ATOMIC) || '""';

    // 如果是字符串字面量，移除引号并使用宏
    if (taskName.startsWith('"') && taskName.endsWith('"')) {
        const cleanName = taskName.slice(1, -1);
        return 'taskFree(' + cleanName + ');\n';
    }

    // 如果是变量，使用函数形式
    return 'mpythonFiberFree(' + taskName + ');\n';
};

// 释放所有任务
Arduino.forBlock['esp32_task_free_all'] = function (block, generator) {
    // 添加库引用
    generator.addLibrary('DFRobot_Task', '#include <DFRobot_Task.h>');

    return 'taskFree();\n';
};

// 任务延时
Arduino.forBlock['esp32_task_delay'] = function (block, generator) {
    // 获取延时时间
    const delayTime = generator.valueToCode(block, 'DELAY_TIME', generator.ORDER_ATOMIC) || '1000';

    return 'delay(' + delayTime + ');\n';
};
