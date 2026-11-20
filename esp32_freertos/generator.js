// BEGIN shared FreeRTOS symbol resolver
function ailyFreeRtosSymbol(generator, block, family, role, label) {
  const variableTypes = { esp32: 'ESP32FreeRTOS', avr: 'FreeRTOS', r4: 'R4FreeRTOS', seeed: 'SeeedFreeRTOS', stm32: 'STM32FreeRTOS' };
  const roleTypes = { task: 'Task', handle: 'Task', queue: 'Queue', semaphore: 'Semaphore' };
  const defaults = { task: 'TaskBlink', queue: 'sensorQueue', semaphore: 'syncSem' };
  const workspace = block.workspace;
  const variables = workspace?.getVariableMap?.();
  const resolveLabel = (target, platform, kind, text) => {
    const type = variableTypes[platform] + roleTypes[kind];
    const model = target.getField('VAR')?.getVariable?.();
    if (model?.type === type) return model.name;
    // Legacy create blocks still store the name in an ordinary text field.
    const namedModel = variables?.getVariable?.(text, type);
    return namedModel?.name ?? text;
  };
  const legacyName = (kind, name) => kind === 'handle' ? name + 'Handle' : name;
  const owner = (platform, kind, name) => JSON.stringify([platform, kind, name]);
  const currentName = resolveLabel(block, family, role, String(label));
  const legacy = legacyName(role, currentName);

  // Arduino creates a fresh codeDict per generation. Cache only the claims for
  // that pass so reordering blocks cannot give one of two owners the old name.
  const generation = generator.codeDict;
  const scopes = ailyFreeRtosSymbol.scopes ??= new WeakMap();
  let scope = generation && scopes.get(generation);
  if (!scope) {
    const claims = new Map();
    const reserve = (platform, kind, name) => {
      const symbol = legacyName(kind, name);
      if (!claims.has(symbol)) claims.set(symbol, new Set());
      claims.get(symbol).add(owner(platform, kind, name));
    };
    for (const target of workspace?.getAllBlocks?.(false) ?? []) {
      const declaration = /^(esp32|avr|r4|seeed|stm32)_freertos_(task|queue|semaphore)_(create|function)$/.exec(target.type);
      if (!declaration || target.isEnabled?.() === false || target.getInheritedDisabled?.()) continue;
      const [, platform, kind, operation] = declaration;
      const text = operation === 'create' ? target.getFieldValue('VAR') : target.getField('VAR')?.getText();
      const name = resolveLabel(target, platform, kind, text || defaults[kind]);
      reserve(platform, kind, name);
      if (kind === 'task') reserve(platform, 'handle', name);
    }
    const ordinary = new Set(['Serial', 'Serial1', 'Serial2', 'Wire', 'SPI', 'setup', 'loop']);
    const rtosTypes = new Set(Object.values(variableTypes).flatMap(prefix => Object.values(roleTypes).map(kind => prefix + kind)));
    for (const model of variables?.getAllVariables?.() ?? []) {
      if (!rtosTypes.has(model.type)) ordinary.add(model.name);
    }
    const nameDb = generator.nameDB_;
    for (const name of nameDb?.getUserNames?.('PROCEDURE') ?? []) ordinary.add(nameDb.getName(name, 'PROCEDURE'));
    const cppKeywords = 'alignas alignof and and_eq asm auto bitand bitor bool break case catch char char8_t char16_t char32_t class compl concept const const_cast consteval constexpr constinit continue co_await co_return co_yield decltype default delete do double dynamic_cast else enum explicit export extern false float for friend goto if inline int long mutable namespace new noexcept not not_eq nullptr operator or or_eq private protected public register reinterpret_cast requires return short signed sizeof static static_assert static_cast struct switch template this thread_local throw true try typedef typeid typename union unsigned using virtual void volatile wchar_t while xor xor_eq';
    for (const word of cppKeywords.split(' ').concat((generator.RESERVED_WORDS_ || '').split(','))) ordinary.add(word);
    scope = { claims, ordinary };
    if (generation) scopes.set(generation, scope);
  }

  const owners = scope.claims.get(legacy);
  const available = !owners || (owners.size === 1 && owners.has(owner(family, role, currentName)));
  if (/^[A-Za-z][A-Za-z0-9_]*$/.test(legacy) && !legacy.includes('__') && !legacy.startsWith('ailyRtos_')
      && available && !scope.ordinary.has(legacy)) return legacy;

  // Escape the complete label, not a lossy spelling or a hash. Roles and
  // platforms have disjoint namespaces, with no C++ implementation prefix.
  const encoded = Array.from(currentName, character => character.codePointAt(0).toString(16)).join('_');
  let symbol = 'ailyRtos_' + family + '_' + role + '_' + encoded;
  while (scope.ordinary.has(symbol)) symbol += 'x';
  return symbol;
}
// END shared FreeRTOS symbol resolver

function esp32FreeRTOSOrderAtomic(generator) {
  return generator.ORDER_ATOMIC || Arduino.ORDER_ATOMIC;
}

function esp32FreeRTOSOrderFunctionCall(generator) {
  return generator.ORDER_FUNCTION_CALL || Arduino.ORDER_FUNCTION_CALL;
}

function esp32FreeRTOSSanitizeName(name, fallback) {
  const source = String(name || fallback || 'item');
  let sanitized = source.replace(/[^A-Za-z0-9_]/g, '_');
  if (!/^[A-Za-z_]/.test(sanitized)) {
    sanitized = '_' + sanitized;
  }
  return sanitized;
}

function esp32FreeRTOSEscapeString(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function esp32FreeRTOSGetInputName(block, fallback) {
  return block.getFieldValue('VAR') || fallback;
}

function esp32FreeRTOSGetVarName(block, fallback) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : fallback;
}

function esp32FreeRTOSWaitTicks(block, generator) {
  const waitMode = block.getFieldValue('WAIT_MODE') || 'MS';
  if (waitMode === 'FOREVER') {
    return 'portMAX_DELAY';
  }
  const waitMs = generator.valueToCode(block, 'WAIT_MS', esp32FreeRTOSOrderAtomic(generator)) || '0';
  return 'pdMS_TO_TICKS(' + waitMs + ')';
}

function ensureESP32FreeRTOSLibrary(generator) {
  const boardConfig = typeof window !== 'undefined' ? window['boardConfig'] : null;
  if (boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') === -1) {
    // ESP32 FreeRTOS APIs are provided by the ESP32 Arduino core.
  }
  generator.addLibrary('ESP32FreeRTOSArduino', '#include <Arduino.h>');
  generator.addLibrary('ESP32FreeRTOS', '#include <freertos/FreeRTOS.h>');
  generator.addLibrary('ESP32FreeRTOSTask', '#include <freertos/task.h>');
}

function ensureESP32FreeRTOSQueueLibrary(generator) {
  ensureESP32FreeRTOSLibrary(generator);
  generator.addLibrary('ESP32FreeRTOSQueue', '#include <freertos/queue.h>');
}

function ensureESP32FreeRTOSSemaphoreLibrary(generator) {
  ensureESP32FreeRTOSLibrary(generator);
  generator.addLibrary('ESP32FreeRTOSSemaphore', '#include <freertos/semphr.h>');
}

function registerESP32FreeRTOSVariable(varName, varType) {
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, varType);
  }
}

function attachESP32FreeRTOSVarMonitor(block, varType, fallback) {
  if (!block._esp32FreeRTOSVarMonitorAttached) {
    block._esp32FreeRTOSVarMonitorAttached = true;
    block._esp32FreeRTOSVarLastName = block.getFieldValue('VAR') || fallback;
    registerESP32FreeRTOSVariable(block._esp32FreeRTOSVarLastName, varType);
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._esp32FreeRTOSVarLastName;
        if (workspace && newName && newName !== oldName && typeof renameVariableInBlockly === 'function') {
          renameVariableInBlockly(block, oldName, newName, varType);
          block._esp32FreeRTOSVarLastName = newName;
        }
      };
    }
  }
}

Arduino.forBlock['esp32_freertos_task_create'] = function(block, generator) {
  attachESP32FreeRTOSVarMonitor(block, 'ESP32FreeRTOSTask', 'TaskBlink');
  const taskLabel = esp32FreeRTOSGetInputName(block, 'TaskBlink');
  const taskName = ailyFreeRtosSymbol(generator, block, 'esp32', 'task', taskLabel);
  const stackSize = block.getFieldValue('STACK_SIZE') || '4096';
  const priority = block.getFieldValue('PRIORITY') || '1';
  const core = block.getFieldValue('CORE') || 'AUTO';
  const handleName = ailyFreeRtosSymbol(generator, block, 'esp32', 'handle', taskLabel);

  ensureESP32FreeRTOSLibrary(generator);
  registerESP32FreeRTOSVariable(taskLabel, 'ESP32FreeRTOSTask');
  generator.addObject('esp32_freertos_task_handle_' + taskName, 'TaskHandle_t ' + handleName + ' = NULL;');
  generator.addFunction('esp32_freertos_task_prototype_' + taskName, 'void ' + taskName + '(void *pvParameters);');

  if (core === 'AUTO') {
    return 'xTaskCreate(\n' +
      '  ' + taskName + ',\n' +
      '  "' + esp32FreeRTOSEscapeString(taskLabel) + '",\n' +
      '  ' + stackSize + ',\n' +
      '  NULL,\n' +
      '  ' + priority + ',\n' +
      '  &' + handleName + '\n' +
      ');\n';
  }

  return 'xTaskCreatePinnedToCore(\n' +
    '  ' + taskName + ',\n' +
    '  "' + esp32FreeRTOSEscapeString(taskLabel) + '",\n' +
    '  ' + stackSize + ',\n' +
    '  NULL,\n' +
    '  ' + priority + ',\n' +
    '  &' + handleName + ',\n' +
    '  ' + core + '\n' +
    ');\n';
};

Arduino.forBlock['esp32_freertos_task_function'] = function(block, generator) {
  const taskLabel = esp32FreeRTOSGetVarName(block, 'TaskBlink');
  const taskName = ailyFreeRtosSymbol(generator, block, 'esp32', 'task', taskLabel);
  const taskCode = generator.statementToCode(block, 'TASK_CODE') || '';

  ensureESP32FreeRTOSLibrary(generator);
  const functionDef = 'void ' + taskName + '(void *pvParameters) {\n' +
    '  (void) pvParameters;\n\n' +
    '  for (;;) {\n' +
    taskCode +
    '  }\n' +
    '}\n';
  generator.addFunction('esp32_freertos_task_function_' + taskName, functionDef);
  return '';
};

Arduino.forBlock['esp32_freertos_task_delay_ms'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  const ms = generator.valueToCode(block, 'MS', esp32FreeRTOSOrderAtomic(generator)) || '1000';
  return 'vTaskDelay(pdMS_TO_TICKS(' + ms + '));\n';
};

Arduino.forBlock['esp32_freertos_task_delay_ticks'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  const ticks = generator.valueToCode(block, 'TICKS', esp32FreeRTOSOrderAtomic(generator)) || '1';
  return 'vTaskDelay(' + ticks + ');\n';
};

Arduino.forBlock['esp32_freertos_task_suspend'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  const taskLabel = esp32FreeRTOSGetVarName(block, 'TaskBlink');
  return 'vTaskSuspend(' + ailyFreeRtosSymbol(generator, block, 'esp32', 'handle', taskLabel) + ');\n';
};

Arduino.forBlock['esp32_freertos_task_resume'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  const taskLabel = esp32FreeRTOSGetVarName(block, 'TaskBlink');
  return 'vTaskResume(' + ailyFreeRtosSymbol(generator, block, 'esp32', 'handle', taskLabel) + ');\n';
};

Arduino.forBlock['esp32_freertos_task_delete'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  const taskLabel = esp32FreeRTOSGetVarName(block, 'TaskBlink');
  const handleName = ailyFreeRtosSymbol(generator, block, 'esp32', 'handle', taskLabel);
  return 'vTaskDelete(' + handleName + ');\n' + handleName + ' = NULL;\n';
};

Arduino.forBlock['esp32_freertos_task_delete_current'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  return 'vTaskDelete(NULL);\n';
};

Arduino.forBlock['esp32_freertos_task_notify'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  const taskLabel = esp32FreeRTOSGetVarName(block, 'TaskBlink');
  return 'xTaskNotifyGive(' + ailyFreeRtosSymbol(generator, block, 'esp32', 'handle', taskLabel) + ');\n';
};

Arduino.forBlock['esp32_freertos_task_notify_from_isr'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  const taskLabel = esp32FreeRTOSGetVarName(block, 'TaskBlink');
  const handleName = ailyFreeRtosSymbol(generator, block, 'esp32', 'handle', taskLabel);
  return '{\n' +
    '  BaseType_t xHigherPriorityTaskWoken = pdFALSE;\n' +
    '  vTaskNotifyGiveFromISR(' + handleName + ', &xHigherPriorityTaskWoken);\n' +
    '  if (xHigherPriorityTaskWoken == pdTRUE) {\n' +
    '    portYIELD_FROM_ISR();\n' +
    '  }\n' +
    '}\n';
};

Arduino.forBlock['esp32_freertos_task_wait_notification'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  const waitTicks = esp32FreeRTOSWaitTicks(block, generator);
  return ['(ulTaskNotifyTake(pdTRUE, ' + waitTicks + ') > 0)', esp32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['esp32_freertos_queue_create'] = function(block, generator) {
  attachESP32FreeRTOSVarMonitor(block, 'ESP32FreeRTOSQueue', 'sensorQueue');
  const queueLabel = esp32FreeRTOSGetInputName(block, 'sensorQueue');
  const queueName = ailyFreeRtosSymbol(generator, block, 'esp32', 'queue', queueLabel);
  const queueLength = block.getFieldValue('QUEUE_LENGTH') || '10';
  const dataType = block.getFieldValue('DATA_TYPE') || 'int';

  ensureESP32FreeRTOSQueueLibrary(generator);
  registerESP32FreeRTOSVariable(queueLabel, 'ESP32FreeRTOSQueue');
  generator.addObject('esp32_freertos_queue_' + queueName, 'QueueHandle_t ' + queueName + ' = NULL;');
  return queueName + ' = xQueueCreate(' + queueLength + ', sizeof(' + dataType + '));\n';
};

Arduino.forBlock['esp32_freertos_queue_send'] = function(block, generator) {
  const queueLabel = esp32FreeRTOSGetVarName(block, 'sensorQueue');
  const queueName = ailyFreeRtosSymbol(generator, block, 'esp32', 'queue', queueLabel);
  const dataType = block.getFieldValue('DATA_TYPE') || 'int';
  const data = generator.valueToCode(block, 'DATA', esp32FreeRTOSOrderAtomic(generator)) || '0';
  const waitTicks = esp32FreeRTOSWaitTicks(block, generator);
  const tempName = 'esp32FreeRTOSQueueItem_' + queueName;

  ensureESP32FreeRTOSQueueLibrary(generator);
  return '{\n' +
    '  ' + dataType + ' ' + tempName + ' = ' + data + ';\n' +
    '  xQueueSend(' + queueName + ', &' + tempName + ', ' + waitTicks + ');\n' +
    '}\n';
};

Arduino.forBlock['esp32_freertos_queue_receive_do'] = function(block, generator) {
  const queueLabel = esp32FreeRTOSGetVarName(block, 'sensorQueue');
  const queueName = ailyFreeRtosSymbol(generator, block, 'esp32', 'queue', queueLabel);
  const dataType = block.getFieldValue('DATA_TYPE') || 'int';
  const itemName = esp32FreeRTOSSanitizeName(block.getFieldValue('ITEM_VAR'), 'queueValue');
  const waitTicks = esp32FreeRTOSWaitTicks(block, generator);
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  ensureESP32FreeRTOSQueueLibrary(generator);
  return '{\n' +
    '  ' + dataType + ' ' + itemName + ';\n' +
    '  if (xQueueReceive(' + queueName + ', &' + itemName + ', ' + waitTicks + ') == pdPASS) {\n' +
    handlerCode +
    '  }\n' +
    '}\n';
};

Arduino.forBlock['esp32_freertos_queue_messages_waiting'] = function(block, generator) {
  ensureESP32FreeRTOSQueueLibrary(generator);
  const queueLabel = esp32FreeRTOSGetVarName(block, 'sensorQueue');
  const queueName = ailyFreeRtosSymbol(generator, block, 'esp32', 'queue', queueLabel);
  return ['uxQueueMessagesWaiting(' + queueName + ')', esp32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['esp32_freertos_semaphore_create'] = function(block, generator) {
  attachESP32FreeRTOSVarMonitor(block, 'ESP32FreeRTOSSemaphore', 'syncSem');
  const semaphoreLabel = esp32FreeRTOSGetInputName(block, 'syncSem');
  const semaphoreName = ailyFreeRtosSymbol(generator, block, 'esp32', 'semaphore', semaphoreLabel);
  const semaphoreType = block.getFieldValue('SEMAPHORE_TYPE') || 'BINARY';
  const maxCount = block.getFieldValue('MAX_COUNT') || '10';
  const initialCount = block.getFieldValue('INITIAL_COUNT') || '0';

  ensureESP32FreeRTOSSemaphoreLibrary(generator);
  registerESP32FreeRTOSVariable(semaphoreLabel, 'ESP32FreeRTOSSemaphore');
  generator.addObject('esp32_freertos_semaphore_' + semaphoreName, 'SemaphoreHandle_t ' + semaphoreName + ' = NULL;');

  if (semaphoreType === 'MUTEX') {
    return semaphoreName + ' = xSemaphoreCreateMutex();\n';
  }
  if (semaphoreType === 'COUNTING') {
    return semaphoreName + ' = xSemaphoreCreateCounting(' + maxCount + ', ' + initialCount + ');\n';
  }
  return semaphoreName + ' = xSemaphoreCreateBinary();\n';
};

Arduino.forBlock['esp32_freertos_semaphore_take'] = function(block, generator) {
  ensureESP32FreeRTOSSemaphoreLibrary(generator);
  const semaphoreLabel = esp32FreeRTOSGetVarName(block, 'syncSem');
  const semaphoreName = ailyFreeRtosSymbol(generator, block, 'esp32', 'semaphore', semaphoreLabel);
  const waitTicks = esp32FreeRTOSWaitTicks(block, generator);
  return ['(xSemaphoreTake(' + semaphoreName + ', ' + waitTicks + ') == pdTRUE)', esp32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['esp32_freertos_semaphore_give'] = function(block, generator) {
  ensureESP32FreeRTOSSemaphoreLibrary(generator);
  const semaphoreLabel = esp32FreeRTOSGetVarName(block, 'syncSem');
  const semaphoreName = ailyFreeRtosSymbol(generator, block, 'esp32', 'semaphore', semaphoreLabel);
  return 'xSemaphoreGive(' + semaphoreName + ');\n';
};

Arduino.forBlock['esp32_freertos_semaphore_give_from_isr'] = function(block, generator) {
  ensureESP32FreeRTOSSemaphoreLibrary(generator);
  const semaphoreLabel = esp32FreeRTOSGetVarName(block, 'syncSem');
  const semaphoreName = ailyFreeRtosSymbol(generator, block, 'esp32', 'semaphore', semaphoreLabel);
  return '{\n' +
    '  BaseType_t xHigherPriorityTaskWoken = pdFALSE;\n' +
    '  xSemaphoreGiveFromISR(' + semaphoreName + ', &xHigherPriorityTaskWoken);\n' +
    '  if (xHigherPriorityTaskWoken == pdTRUE) {\n' +
    '    portYIELD_FROM_ISR();\n' +
    '  }\n' +
    '}\n';
};

Arduino.forBlock['esp32_freertos_attach_interrupt'] = function(block, generator) {
  const pin = block.getFieldValue('PIN') || '2';
  const mode = block.getFieldValue('MODE') || 'LOW';
  const functionName = 'esp32FreeRTOSInterruptPin' + esp32FreeRTOSSanitizeName(pin, '2');
  const isrCode = generator.statementToCode(block, 'ISR_CODE') || '';

  ensureESP32FreeRTOSLibrary(generator);
  generator.addFunction('esp32_freertos_interrupt_' + pin, 'void ' + functionName + '() {\n' + isrCode + '}\n');
  generator.addSetupBegin('esp32_freertos_interrupt_pin_mode_' + pin, 'pinMode(' + pin + ', INPUT_PULLUP);');
  generator.addSetupBegin('esp32_freertos_attach_interrupt_' + pin, 'attachInterrupt(digitalPinToInterrupt(' + pin + '), ' + functionName + ', ' + mode + ');');
  return '';
};

Arduino.forBlock['esp32_freertos_get_tick_count'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  return ['xTaskGetTickCount()', esp32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['esp32_freertos_get_task_count'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  return ['uxTaskGetNumberOfTasks()', esp32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['esp32_freertos_get_task_name'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  const taskLabel = esp32FreeRTOSGetVarName(block, 'TaskBlink');
  return ['pcTaskGetName(' + ailyFreeRtosSymbol(generator, block, 'esp32', 'handle', taskLabel) + ')', esp32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['esp32_freertos_get_current_task_name'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  return ['pcTaskGetName(NULL)', esp32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['esp32_freertos_get_stack_high_water_mark'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  const taskLabel = esp32FreeRTOSGetVarName(block, 'TaskBlink');
  return ['uxTaskGetStackHighWaterMark(' + ailyFreeRtosSymbol(generator, block, 'esp32', 'handle', taskLabel) + ')', esp32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['esp32_freertos_get_current_stack_high_water_mark'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  return ['uxTaskGetStackHighWaterMark(NULL)', esp32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['esp32_freertos_get_free_heap_size'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  return ['xPortGetFreeHeapSize()', esp32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['esp32_freertos_get_current_core'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  return ['xPortGetCoreID()', esp32FreeRTOSOrderFunctionCall(generator)];
};
