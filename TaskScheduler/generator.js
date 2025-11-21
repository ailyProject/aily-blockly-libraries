// TaskScheduler库代码生成器
// 全局变量用于跟踪配置状态
var taskSchedulerConfig = {
  statusRequest: false,
  timeout: false,
  sleepOnIdle: false,
  priority: false,
  ltsPointer: false,
  microRes: false,
};

// 获取变量名的简化版本
function getVariableName(block, fieldName, fallbackName) {
  const field = block && block.getField ? block.getField(fieldName) : null;
  if (field) {
    // 对于field_variable，使用getText()获取变量名
    return field.getText() || fallbackName;
  }
  return block.getFieldValue(fieldName) || fallbackName;
}

// 自动生成唯一的变量名
function ensureUniqueVariableName(block, fieldName, basePrefix) {
  // 如果块已经初始化过，直接返回当前值
  if (block._uniqueNameAssigned) {
    return block.getFieldValue(fieldName) || basePrefix;
  }

  const workspace = block.workspace;
  if (!workspace) {
    return basePrefix;
  }

  // 获取当前字段值
  const currentValue = block.getFieldValue(fieldName);

  // 如果用户已经修改过名称（不是默认值），则保留用户的修改
  if (currentValue && currentValue !== basePrefix) {
    block._uniqueNameAssigned = true;
    return currentValue;
  }

  // 查找所有已使用的变量名
  const usedNames = new Set();

  // 获取工作区中所有变量
  const variables = workspace.getAllVariables
    ? workspace.getAllVariables()
    : [];
  variables.forEach(function (variable) {
    usedNames.add(variable.name);
  });

  // 同时检查所有field_input字段（因为可能还没注册为变量）
  const allBlocks = workspace.getAllBlocks ? workspace.getAllBlocks() : [];
  allBlocks.forEach(function (b) {
    if (b.id === block.id) return; // 跳过当前块

    // 检查所有字段
    const fields = b.inputList
      ? b.inputList.flatMap((input) => input.fieldRow)
      : [];
    fields.forEach(function (field) {
      if (field.name === fieldName && field.getValue) {
        const value = field.getValue();
        if (value) usedNames.add(value);
      }
    });
  });

  // 提取基础名称和数字
  const match = basePrefix.match(/^(.*?)(\d+)$/);
  const prefix = match ? match[1] : basePrefix;
  let number = match ? parseInt(match[2], 10) : 1;

  // 生成唯一名称
  let uniqueName = basePrefix;
  while (usedNames.has(uniqueName)) {
    number++;
    uniqueName = prefix + number;
  }

  // 设置新的唯一名称
  const field = block.getField(fieldName);
  if (field && typeof field.setValue === "function") {
    field.setValue(uniqueName);
  }

  block._uniqueNameAssigned = true;
  return uniqueName;
}

// 任务调度器配置块
Arduino.forBlock["taskscheduler_config"] = function (block, generator) {
  var statusRequest = block.getFieldValue("STATUS_REQUEST") === "TRUE";
  var timeout = block.getFieldValue("TIMEOUT") === "TRUE";
  var sleepOnIdle = block.getFieldValue("SLEEP_ON_IDLE") === "TRUE";
  var priority = block.getFieldValue("PRIORITY") === "TRUE";
  var ltsPointer = block.getFieldValue("LTS_POINTER") === "TRUE";
  var microRes = block.getFieldValue("MICRO_RES") === "TRUE";

  // 更新全局配置
  taskSchedulerConfig.statusRequest = statusRequest;
  taskSchedulerConfig.timeout = timeout;
  taskSchedulerConfig.sleepOnIdle = sleepOnIdle;
  taskSchedulerConfig.priority = priority;
  taskSchedulerConfig.ltsPointer = ltsPointer;
  taskSchedulerConfig.microRes = microRes;

  // 生成宏定义
  if (statusRequest) {
    generator.addMacro("_TASK_STATUS_REQUEST", "#define _TASK_STATUS_REQUEST");
  }
  if (timeout) {
    generator.addMacro("_TASK_TIMEOUT", "#define _TASK_TIMEOUT");
  }
  if (sleepOnIdle) {
    generator.addMacro(
      "_TASK_SLEEP_ON_IDLE_RUN",
      "#define _TASK_SLEEP_ON_IDLE_RUN",
    );
  }
  if (priority) {
    generator.addMacro("_TASK_PRIORITY", "#define _TASK_PRIORITY");
  }
  if (ltsPointer) {
    generator.addMacro("_TASK_LTS_POINTER", "#define _TASK_LTS_POINTER");
  }
  if (microRes) {
    generator.addMacro("_TASK_MICRO_RES", "#define _TASK_MICRO_RES");
  }

  // 添加库引用
  generator.addLibrary("TaskScheduler", "#include <TaskScheduler.h>");

  return "";
};

// 创建调度器
Arduino.forBlock["taskscheduler_create"] = function (block, generator) {
  // 自动生成唯一的变量名
  const schedulerName = ensureUniqueVariableName(
    block,
    "SCHEDULER",
    "scheduler",
  );

  // 设置变量重命名监听
  if (!block._schedulerVarMonitorAttached) {
    block._schedulerVarMonitorAttached = true;
    block._schedulerVarLastName = schedulerName;
    const varField = block.getField("SCHEDULER");
    if (varField && typeof varField.setValidator === "function") {
      varField.setValidator(function (newName) {
        const workspace =
          block.workspace ||
          (typeof Blockly !== "undefined" &&
            Blockly.getMainWorkspace &&
            Blockly.getMainWorkspace());
        const oldName = block._schedulerVarLastName;
        if (
          workspace &&
          newName &&
          newName !== oldName &&
          typeof renameVariableInBlockly === "function"
        ) {
          renameVariableInBlockly(block, oldName, newName, "");
          block._schedulerVarLastName = newName;
        }
        return newName;
      });
    }
  }

  generator.addLibrary("TaskScheduler", "#include <TaskScheduler.h>");

  // 注册变量到Blockly
  if (typeof registerVariableToBlockly === "function") {
    registerVariableToBlockly(schedulerName, "");
  }

  generator.addObject(
    "scheduler_" + schedulerName,
    "Scheduler " + schedulerName + ";",
  );
  generator.addSetupBegin(
    "scheduler_init_" + schedulerName,
    schedulerName + ".init();",
  );

  return "";
};

// 调度器执行任务
Arduino.forBlock["taskscheduler_execute"] = function (block, generator) {
  const schedulerRaw = getVariableName(block, "SCHEDULER", "scheduler");
  const schedulerName = generator.getVariableName
    ? generator.getVariableName(schedulerRaw, "Scheduler")
    : schedulerRaw;

  return schedulerName + ".execute();\n";
};

// 创建任务
Arduino.forBlock["task_create"] = function (block, generator) {
  // 获取任务名（使用 field_input）
  const taskName = block.getFieldValue("TASK") || "task1";

  var interval =
    generator.valueToCode(block, "INTERVAL", generator.ORDER_ATOMIC) || "1000";
  var iterations =
    generator.valueToCode(block, "ITERATIONS", generator.ORDER_ATOMIC) ||
    "TASK_FOREVER";
  var callbackName = block.getFieldValue("CALLBACK") || "taskCallback";

  generator.addLibrary("TaskScheduler", "#include <TaskScheduler.h>");

  // 只声明回调函数原型，不定义函数体（由用户使用自定义函数定义）
  // 使用回调函数名作为唯一标识，避免重复声明
  var prototype = "void " + callbackName + "();";
  generator.addVariable("prototype_" + callbackName, prototype);

  // 创建任务对象，使用任务名作为唯一标识
  var taskDeclaration =
    "Task " +
    taskName +
    "(" +
    interval +
    ", " +
    iterations +
    ", &" +
    callbackName +
    ");";
  generator.addObject("task_" + taskName, taskDeclaration);

  return "";
};

// 创建简单任务
Arduino.forBlock["task_create_simple"] = function (block, generator) {
  // 自动生成唯一的变量名
  const taskName = ensureUniqueVariableName(block, "TASK", "task1");

  // 设置变量重命名监听
  if (!block._taskSimpleVarMonitorAttached) {
    block._taskSimpleVarMonitorAttached = true;
    block._taskSimpleVarLastName = taskName;
    const varField = block.getField("TASK");
    if (varField && typeof varField.setValidator === "function") {
      varField.setValidator(function (newName) {
        const workspace =
          block.workspace ||
          (typeof Blockly !== "undefined" &&
            Blockly.getMainWorkspace &&
            Blockly.getMainWorkspace());
        const oldName = block._taskSimpleVarLastName;
        if (
          workspace &&
          newName &&
          newName !== oldName &&
          typeof renameVariableInBlockly === "function"
        ) {
          renameVariableInBlockly(block, oldName, newName, "");
          block._taskSimpleVarLastName = newName;
        }
        return newName;
      });
    }
  }
  var interval =
    generator.valueToCode(block, "INTERVAL", generator.ORDER_ATOMIC) || "1000";
  var statements = generator.statementToCode(block, "DO");

  generator.addLibrary("TaskScheduler", "#include <TaskScheduler.h>");

  // 注册变量到Blockly
  if (typeof registerVariableToBlockly === "function") {
    registerVariableToBlockly(taskName, "");
  }

  // Add the function prototype before the object is declared.
  var callbackName = taskName + "Callback";
  var prototype = "void " + callbackName + "();";
  generator.addVariable("prototype_" + callbackName, prototype);

  // 创建回调函数
  var callbackFunction = "void " + callbackName + "() {\n" + statements + "}";
  generator.addFunction("callback_" + callbackName, callbackFunction);

  // 创建任务对象
  var taskDeclaration =
    "Task " +
    taskName +
    "(" +
    interval +
    ", TASK_FOREVER, &" +
    callbackName +
    ");";
  generator.addObject("task_" + taskName, taskDeclaration);

  return "";
};

// 调度器添加任务
Arduino.forBlock["scheduler_add_task"] = function (block, generator) {
  const schedulerRaw = getVariableName(block, "SCHEDULER", "scheduler");
  const schedulerName = generator.getVariableName
    ? generator.getVariableName(schedulerRaw, "Scheduler")
    : schedulerRaw;
  const taskRaw = getVariableName(block, "TASK", "task1");
  const taskName = generator.getVariableName
    ? generator.getVariableName(taskRaw, "Task")
    : taskRaw;

  generator.addSetupBegin(
    "add_task_" + taskName,
    schedulerName + ".addTask(" + taskName + ");",
  );

  return "";
};

// 启用任务
Arduino.forBlock["task_enable"] = function (block, generator) {
  const taskRaw = getVariableName(block, "TASK", "task1");
  const taskName = generator.getVariableName
    ? generator.getVariableName(taskRaw, "Task")
    : taskRaw;

  return taskName + ".enable();\n";
};

// 禁用任务
Arduino.forBlock["task_disable"] = function (block, generator) {
  const taskRaw = getVariableName(block, "TASK", "task1");
  const taskName = generator.getVariableName
    ? generator.getVariableName(taskRaw, "Task")
    : taskRaw;

  return taskName + ".disable();\n";
};

// 重启任务
Arduino.forBlock["task_restart"] = function (block, generator) {
  const taskRaw = getVariableName(block, "TASK", "task1");
  const taskName = generator.getVariableName
    ? generator.getVariableName(taskRaw, "Task")
    : taskRaw;

  return taskName + ".restart();\n";
};

// 延迟任务
Arduino.forBlock["task_delay"] = function (block, generator) {
  const taskRaw = getVariableName(block, "TASK", "task1");
  const taskName = generator.getVariableName
    ? generator.getVariableName(taskRaw, "Task")
    : taskRaw;
  var delay =
    generator.valueToCode(block, "DELAY", generator.ORDER_ATOMIC) || "1000";

  return taskName + ".delay(" + delay + ");\n";
};

// 设置任务间隔
Arduino.forBlock["task_set_interval"] = function (block, generator) {
  const taskRaw = getVariableName(block, "TASK", "task1");
  const taskName = generator.getVariableName
    ? generator.getVariableName(taskRaw, "Task")
    : taskRaw;
  var interval =
    generator.valueToCode(block, "INTERVAL", generator.ORDER_ATOMIC) || "1000";

  return taskName + ".setInterval(" + interval + ");\n";
};

// 检查任务是否启用
Arduino.forBlock["task_is_enabled"] = function (block, generator) {
  const taskRaw = getVariableName(block, "TASK", "task1");
  const taskName = generator.getVariableName
    ? generator.getVariableName(taskRaw, "Task")
    : taskRaw;

  return [taskName + ".isEnabled()", generator.ORDER_FUNCTION_CALL];
};

// 检查是否首次运行
Arduino.forBlock["task_is_first_iteration"] = function (block, generator) {
  const taskRaw = getVariableName(block, "TASK", "task1");
  const taskName = generator.getVariableName
    ? generator.getVariableName(taskRaw, "Task")
    : taskRaw;

  return [taskName + ".isFirstIteration()", generator.ORDER_FUNCTION_CALL];
};

// 检查是否最后一次运行
Arduino.forBlock["task_is_last_iteration"] = function (block, generator) {
  const taskRaw = getVariableName(block, "TASK", "task1");
  const taskName = generator.getVariableName
    ? generator.getVariableName(taskRaw, "Task")
    : taskRaw;

  return [taskName + ".isLastIteration()", generator.ORDER_FUNCTION_CALL];
};

// 获取运行次数
Arduino.forBlock["task_get_run_counter"] = function (block, generator) {
  const taskRaw = getVariableName(block, "TASK", "task1");
  const taskName = generator.getVariableName
    ? generator.getVariableName(taskRaw, "Task")
    : taskRaw;

  return [taskName + ".getRunCounter()", generator.ORDER_FUNCTION_CALL];
};

// 创建状态请求
Arduino.forBlock["status_request_create"] = function (block, generator) {
  // 自动生成唯一的变量名
  const statusRequestName = ensureUniqueVariableName(
    block,
    "STATUS_REQUEST",
    "statusRequest",
  );

  // 设置变量重命名监听
  if (!block._statusRequestVarMonitorAttached) {
    block._statusRequestVarMonitorAttached = true;
    block._statusRequestVarLastName = statusRequestName;
    const varField = block.getField("STATUS_REQUEST");
    if (varField && typeof varField.setValidator === "function") {
      varField.setValidator(function (newName) {
        const workspace =
          block.workspace ||
          (typeof Blockly !== "undefined" &&
            Blockly.getMainWorkspace &&
            Blockly.getMainWorkspace());
        const oldName = block._statusRequestVarLastName;
        if (
          workspace &&
          newName &&
          newName !== oldName &&
          typeof renameVariableInBlockly === "function"
        ) {
          renameVariableInBlockly(block, oldName, newName, "");
          block._statusRequestVarLastName = newName;
        }
        return newName;
      });
    }
  }

  if (taskSchedulerConfig.statusRequest) {
    generator.addLibrary("TaskScheduler", "#include <TaskScheduler.h>");

    // 注册变量到Blockly
    if (typeof registerVariableToBlockly === "function") {
      registerVariableToBlockly(statusRequestName, "");
    }

    generator.addObject(
      "status_request_" + statusRequestName,
      "StatusRequest " + statusRequestName + ";",
    );
  }

  return "";
};

// 设置状态请求等待
Arduino.forBlock["status_request_set_waiting"] = function (block, generator) {
  const statusRaw = getVariableName(block, "STATUS_REQUEST", "statusRequest");
  const statusRequestName = generator.getVariableName
    ? generator.getVariableName(statusRaw, "StatusRequest")
    : statusRaw;
  var count =
    generator.valueToCode(block, "COUNT", generator.ORDER_ATOMIC) || "1";

  if (taskSchedulerConfig.statusRequest) {
    return statusRequestName + ".setWaiting(" + count + ");\n";
  }
  return "// 状态请求功能未启用\n";
};

// 状态请求发出信号
Arduino.forBlock["status_request_signal"] = function (block, generator) {
  const statusRaw = getVariableName(block, "STATUS_REQUEST", "statusRequest");
  const statusRequestName = generator.getVariableName
    ? generator.getVariableName(statusRaw, "StatusRequest")
    : statusRaw;

  if (taskSchedulerConfig.statusRequest) {
    return statusRequestName + ".signal();\n";
  }
  return "// 状态请求功能未启用\n";
};

// 任务等待状态请求
Arduino.forBlock["task_wait_for"] = function (block, generator) {
  const taskRaw = getVariableName(block, "TASK", "task1");
  const taskName = generator.getVariableName
    ? generator.getVariableName(taskRaw, "Task")
    : taskRaw;
  const statusRaw = getVariableName(block, "STATUS_REQUEST", "statusRequest");
  const statusRequestName = generator.getVariableName
    ? generator.getVariableName(statusRaw, "StatusRequest")
    : statusRaw;

  if (taskSchedulerConfig.statusRequest) {
    return taskName + ".waitFor(&" + statusRequestName + ");\n";
  }
  return "// 状态请求功能未启用\n";
};

// 设置任务超时
Arduino.forBlock["task_set_timeout"] = function (block, generator) {
  const taskRaw = getVariableName(block, "TASK", "task1");
  const taskName = generator.getVariableName
    ? generator.getVariableName(taskRaw, "Task")
    : taskRaw;
  var timeout =
    generator.valueToCode(block, "TIMEOUT", generator.ORDER_ATOMIC) || "5000";

  if (taskSchedulerConfig.timeout) {
    return taskName + ".setTimeout(" + timeout + ");\n";
  }
  return "// 任务超时功能未启用\n";
};

// 检查任务是否超时
Arduino.forBlock["task_is_timed_out"] = function (block, generator) {
  const taskRaw = getVariableName(block, "TASK", "task1");
  const taskName = generator.getVariableName
    ? generator.getVariableName(taskRaw, "Task")
    : taskRaw;

  if (taskSchedulerConfig.timeout) {
    return [taskName + ".timedOut()", generator.ORDER_FUNCTION_CALL];
  }
  return ["false", generator.ORDER_ATOMIC];
};
