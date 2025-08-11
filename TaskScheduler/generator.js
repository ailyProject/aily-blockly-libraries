// TaskScheduler库代码生成器
// 全局变量用于跟踪配置状态
var taskSchedulerConfig = {
    statusRequest: false,
    timeout: false,
    sleepOnIdle: false,
    priority: false,
    ltsPointer: false,
    microRes: false
};

// 任务调度器配置块
Arduino.forBlock['taskscheduler_config'] = function(block, generator) {
    var statusRequest = block.getFieldValue('STATUS_REQUEST') === 'TRUE';
    var timeout = block.getFieldValue('TIMEOUT') === 'TRUE';
    var sleepOnIdle = block.getFieldValue('SLEEP_ON_IDLE') === 'TRUE';
    var priority = block.getFieldValue('PRIORITY') === 'TRUE';
    var ltsPointer = block.getFieldValue('LTS_POINTER') === 'TRUE';
    var microRes = block.getFieldValue('MICRO_RES') === 'TRUE';
    
    // 更新全局配置
    taskSchedulerConfig.statusRequest = statusRequest;
    taskSchedulerConfig.timeout = timeout;
    taskSchedulerConfig.sleepOnIdle = sleepOnIdle;
    taskSchedulerConfig.priority = priority;
    taskSchedulerConfig.ltsPointer = ltsPointer;
    taskSchedulerConfig.microRes = microRes;
    
    // 生成宏定义
    if (statusRequest) {
        generator.addMacro('_TASK_STATUS_REQUEST', '#define _TASK_STATUS_REQUEST');
    }
    if (timeout) {
        generator.addMacro('_TASK_TIMEOUT', '#define _TASK_TIMEOUT');
    }
    if (sleepOnIdle) {
        generator.addMacro('_TASK_SLEEP_ON_IDLE_RUN', '#define _TASK_SLEEP_ON_IDLE_RUN');
    }
    if (priority) {
        generator.addMacro('_TASK_PRIORITY', '#define _TASK_PRIORITY');
    }
    if (ltsPointer) {
        generator.addMacro('_TASK_LTS_POINTER', '#define _TASK_LTS_POINTER');
    }
    if (microRes) {
        generator.addMacro('_TASK_MICRO_RES', '#define _TASK_MICRO_RES');
    }
    
    // 添加库引用
    generator.addLibrary('TaskScheduler', '#include <TaskScheduler.h>');
    
    return '';
};

// 创建调度器
Arduino.forBlock['taskscheduler_create'] = function(block, generator) {
    var schedulerName = generator.getVariableName(block.getFieldValue('SCHEDULER'), 'Scheduler');
    
    generator.addLibrary('TaskScheduler', '#include <TaskScheduler.h>');
    generator.addObject('scheduler_' + schedulerName, 'Scheduler ' + schedulerName + ';');
    generator.addSetupBegin('scheduler_init_' + schedulerName, schedulerName + '.init();');
    
    return '';
};

// 调度器执行任务
Arduino.forBlock['taskscheduler_execute'] = function(block, generator) {
    var schedulerName = generator.getVariableName(block.getFieldValue('SCHEDULER'), 'Scheduler');
    
    return schedulerName + '.execute();\\n';
};

// 创建任务
Arduino.forBlock['task_create'] = function(block, generator) {
    var taskName = generator.getVariableName(block.getFieldValue('TASK'), 'Task');
    var interval = generator.valueToCode(block, 'INTERVAL', generator.ORDER_ATOMIC) || '1000';
    var iterations = generator.valueToCode(block, 'ITERATIONS', generator.ORDER_ATOMIC) || 'TASK_FOREVER';
    var callback = block.getFieldValue('CALLBACK') || 'taskCallback';
    
    generator.addLibrary('TaskScheduler', '#include <TaskScheduler.h>');
    
    // 创建回调函数
    var callbackFunction = 'void ' + callback + '() {\\n  // 在这里添加任务代码\\n}';
    generator.addFunction('callback_' + callback, callbackFunction);
    
    // 创建任务对象
    var taskDeclaration = 'Task ' + taskName + '(' + interval + ', ' + iterations + ', &' + callback + ');';
    generator.addObject('task_' + taskName, taskDeclaration);
    
    return '';
};

// 创建简单任务
Arduino.forBlock['task_create_simple'] = function(block, generator) {
    var taskName = generator.getVariableName(block.getFieldValue('TASK'), 'Task');
    var interval = generator.valueToCode(block, 'INTERVAL', generator.ORDER_ATOMIC) || '1000';
    var statements = generator.statementToCode(block, 'DO');
    
    generator.addLibrary('TaskScheduler', '#include <TaskScheduler.h>');
    
    // 创建回调函数
    var callbackName = taskName + 'Callback';
    var callbackFunction = 'void ' + callbackName + '() {\\n' + statements + '}';
    generator.addFunction('callback_' + callbackName, callbackFunction);
    
    // 创建任务对象
    var taskDeclaration = 'Task ' + taskName + '(' + interval + ', TASK_FOREVER, &' + callbackName + ');';
    generator.addObject('task_' + taskName, taskDeclaration);
    
    return '';
};

// 调度器添加任务
Arduino.forBlock['scheduler_add_task'] = function(block, generator) {
    var schedulerName = generator.getVariableName(block.getFieldValue('SCHEDULER'), 'Scheduler');
    var taskName = generator.getVariableName(block.getFieldValue('TASK'), 'Task');
    
    generator.addSetupBegin('add_task_' + taskName, schedulerName + '.addTask(' + taskName + ');');
    
    return '';
};

// 启用任务
Arduino.forBlock['task_enable'] = function(block, generator) {
    var taskName = generator.getVariableName(block.getFieldValue('TASK'), 'Task');
    
    return taskName + '.enable();\\n';
};

// 禁用任务
Arduino.forBlock['task_disable'] = function(block, generator) {
    var taskName = generator.getVariableName(block.getFieldValue('TASK'), 'Task');
    
    return taskName + '.disable();\\n';
};

// 重启任务
Arduino.forBlock['task_restart'] = function(block, generator) {
    var taskName = generator.getVariableName(block.getFieldValue('TASK'), 'Task');
    
    return taskName + '.restart();\\n';
};

// 延迟任务
Arduino.forBlock['task_delay'] = function(block, generator) {
    var taskName = generator.getVariableName(block.getFieldValue('TASK'), 'Task');
    var delay = generator.valueToCode(block, 'DELAY', generator.ORDER_ATOMIC) || '1000';
    
    return taskName + '.delay(' + delay + ');\\n';
};

// 设置任务间隔
Arduino.forBlock['task_set_interval'] = function(block, generator) {
    var taskName = generator.getVariableName(block.getFieldValue('TASK'), 'Task');
    var interval = generator.valueToCode(block, 'INTERVAL', generator.ORDER_ATOMIC) || '1000';
    
    return taskName + '.setInterval(' + interval + ');\\n';
};

// 检查任务是否启用
Arduino.forBlock['task_is_enabled'] = function(block, generator) {
    var taskName = generator.getVariableName(block.getFieldValue('TASK'), 'Task');
    
    return [taskName + '.isEnabled()', generator.ORDER_FUNCTION_CALL];
};

// 检查是否首次运行
Arduino.forBlock['task_is_first_iteration'] = function(block, generator) {
    var taskName = generator.getVariableName(block.getFieldValue('TASK'), 'Task');
    
    return [taskName + '.isFirstIteration()', generator.ORDER_FUNCTION_CALL];
};

// 检查是否最后一次运行
Arduino.forBlock['task_is_last_iteration'] = function(block, generator) {
    var taskName = generator.getVariableName(block.getFieldValue('TASK'), 'Task');
    
    return [taskName + '.isLastIteration()', generator.ORDER_FUNCTION_CALL];
};

// 获取运行次数
Arduino.forBlock['task_get_run_counter'] = function(block, generator) {
    var taskName = generator.getVariableName(block.getFieldValue('TASK'), 'Task');
    
    return [taskName + '.getRunCounter()', generator.ORDER_FUNCTION_CALL];
};

// 创建状态请求
Arduino.forBlock['status_request_create'] = function(block, generator) {
    var statusRequestName = generator.getVariableName(block.getFieldValue('STATUS_REQUEST'), 'StatusRequest');
    
    if (taskSchedulerConfig.statusRequest) {
        generator.addLibrary('TaskScheduler', '#include <TaskScheduler.h>');
        generator.addObject('status_request_' + statusRequestName, 'StatusRequest ' + statusRequestName + ';');
    }
    
    return '';
};

// 设置状态请求等待
Arduino.forBlock['status_request_set_waiting'] = function(block, generator) {
    var statusRequestName = generator.getVariableName(block.getFieldValue('STATUS_REQUEST'), 'StatusRequest');
    var count = generator.valueToCode(block, 'COUNT', generator.ORDER_ATOMIC) || '1';
    
    if (taskSchedulerConfig.statusRequest) {
        return statusRequestName + '.setWaiting(' + count + ');\\n';
    }
    return '// 状态请求功能未启用\\n';
};

// 状态请求发出信号
Arduino.forBlock['status_request_signal'] = function(block, generator) {
    var statusRequestName = generator.getVariableName(block.getFieldValue('STATUS_REQUEST'), 'StatusRequest');
    
    if (taskSchedulerConfig.statusRequest) {
        return statusRequestName + '.signal();\\n';
    }
    return '// 状态请求功能未启用\\n';
};

// 任务等待状态请求
Arduino.forBlock['task_wait_for'] = function(block, generator) {
    var taskName = generator.getVariableName(block.getFieldValue('TASK'), 'Task');
    var statusRequestName = generator.getVariableName(block.getFieldValue('STATUS_REQUEST'), 'StatusRequest');
    
    if (taskSchedulerConfig.statusRequest) {
        return taskName + '.waitFor(&' + statusRequestName + ');\\n';
    }
    return '// 状态请求功能未启用\\n';
};

// 设置任务超时
Arduino.forBlock['task_set_timeout'] = function(block, generator) {
    var taskName = generator.getVariableName(block.getFieldValue('TASK'), 'Task');
    var timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '5000';
    
    if (taskSchedulerConfig.timeout) {
        return taskName + '.setTimeout(' + timeout + ');\\n';
    }
    return '// 任务超时功能未启用\\n';
};

// 检查任务是否超时
Arduino.forBlock['task_is_timed_out'] = function(block, generator) {
    var taskName = generator.getVariableName(block.getFieldValue('TASK'), 'Task');
    
    if (taskSchedulerConfig.timeout) {
        return [taskName + '.timedOut()', generator.ORDER_FUNCTION_CALL];
    }
    return ['false', generator.ORDER_ATOMIC];
};