function stm32FreeRTOSOrderAtomic(generator) {
  return generator.ORDER_ATOMIC || Arduino.ORDER_ATOMIC;
}

function stm32FreeRTOSOrderFunctionCall(generator) {
  return generator.ORDER_FUNCTION_CALL || Arduino.ORDER_FUNCTION_CALL;
}

function stm32FreeRTOSSanitizeName(name, fallback) {
  const source = String(name || fallback || 'item');
  let sanitized = source.replace(/[^A-Za-z0-9_]/g, '_');
  if (!/^[A-Za-z_]/.test(sanitized)) {
    sanitized = '_' + sanitized;
  }
  return sanitized;
}

function stm32FreeRTOSEscapeString(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function stm32FreeRTOSGetInputName(block, fallback) {
  return block.getFieldValue('VAR') || fallback;
}

function stm32FreeRTOSGetVarName(block, fallback) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : fallback;
}

function stm32FreeRTOSTaskHandleName(taskName) {
  return stm32FreeRTOSSanitizeName(taskName, 'Task') + 'Handle';
}

function stm32FreeRTOSWaitTicks(block, generator) {
  const waitMode = block.getFieldValue('WAIT_MODE') || 'MS';
  if (waitMode === 'FOREVER') {
    return 'portMAX_DELAY';
  }
  const waitMs = generator.valueToCode(block, 'WAIT_MS', stm32FreeRTOSOrderAtomic(generator)) || '0';
  return 'pdMS_TO_TICKS(' + waitMs + ')';
}

function ensureSTM32FreeRTOSLibrary(generator) {
  generator.addLibrary('STM32FreeRTOS', '#include <STM32FreeRTOS.h>');
}

function ensureSTM32FreeRTOSQueueLibrary(generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  generator.addLibrary('STM32FreeRTOSQueue', '#include <queue.h>');
}

function ensureSTM32FreeRTOSSemaphoreLibrary(generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  generator.addLibrary('STM32FreeRTOSSemaphore', '#include <semphr.h>');
}

function ensureSTM32FreeRTOSSchedulerStart(generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  generator.addSetupEnd('stm32_freertos_start_scheduler', 'vTaskStartScheduler();');
}

function registerSTM32FreeRTOSVariable(varName, varType) {
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, varType);
  }
}

function attachSTM32FreeRTOSVarMonitor(block, varType, fallback) {
  if (!block._stm32FreeRTOSVarMonitorAttached) {
    block._stm32FreeRTOSVarMonitorAttached = true;
    block._stm32FreeRTOSVarLastName = block.getFieldValue('VAR') || fallback;
    registerSTM32FreeRTOSVariable(block._stm32FreeRTOSVarLastName, varType);
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._stm32FreeRTOSVarLastName;
        if (workspace && newName && newName !== oldName && typeof renameVariableInBlockly === 'function') {
          renameVariableInBlockly(block, oldName, newName, varType);
          block._stm32FreeRTOSVarLastName = newName;
        }
      };
    }
  }
}

Arduino.forBlock['stm32_freertos_task_create'] = function(block, generator) {
  attachSTM32FreeRTOSVarMonitor(block, 'STM32FreeRTOSTask', 'TaskBlink');
  const taskLabel = stm32FreeRTOSGetInputName(block, 'TaskBlink');
  const taskName = stm32FreeRTOSSanitizeName(taskLabel, 'TaskBlink');
  const stackSize = block.getFieldValue('STACK_SIZE') || '256';
  const priority = block.getFieldValue('PRIORITY') || '2';
  const handleName = stm32FreeRTOSTaskHandleName(taskLabel);

  ensureSTM32FreeRTOSSchedulerStart(generator);
  registerSTM32FreeRTOSVariable(taskLabel, 'STM32FreeRTOSTask');
  generator.addObject('stm32_freertos_task_handle_' + taskName, 'TaskHandle_t ' + handleName + ' = NULL;');
  generator.addFunction('stm32_freertos_task_prototype_' + taskName, 'void ' + taskName + '(void *pvParameters);');

  return 'xTaskCreate(\n' +
    '  ' + taskName + ',\n' +
    '  "' + stm32FreeRTOSEscapeString(taskLabel) + '",\n' +
    '  ' + stackSize + ',\n' +
    '  NULL,\n' +
    '  ' + priority + ',\n' +
    '  &' + handleName + '\n' +
    ');\n';
};

Arduino.forBlock['stm32_freertos_task_function'] = function(block, generator) {
  const taskLabel = stm32FreeRTOSGetVarName(block, 'TaskBlink');
  const taskName = stm32FreeRTOSSanitizeName(taskLabel, 'TaskBlink');
  const taskCode = generator.statementToCode(block, 'TASK_CODE') || '';

  ensureSTM32FreeRTOSLibrary(generator);
  const functionDef = 'void ' + taskName + '(void *pvParameters) {\n' +
    '  (void) pvParameters;\n\n' +
    '  for (;;) {\n' +
    taskCode +
    '  }\n' +
    '}\n';
  generator.addFunction('stm32_freertos_task_function_' + taskName, functionDef);
  return '';
};

Arduino.forBlock['stm32_freertos_start_scheduler'] = function(block, generator) {
  ensureSTM32FreeRTOSSchedulerStart(generator);
  return '';
};

Arduino.forBlock['stm32_freertos_task_delay_ms'] = function(block, generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  const ms = generator.valueToCode(block, 'MS', stm32FreeRTOSOrderAtomic(generator)) || '1000';
  return 'vTaskDelay(pdMS_TO_TICKS(' + ms + '));\n';
};

Arduino.forBlock['stm32_freertos_task_delay_ticks'] = function(block, generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  const ticks = generator.valueToCode(block, 'TICKS', stm32FreeRTOSOrderAtomic(generator)) || '1';
  return 'vTaskDelay(' + ticks + ');\n';
};

Arduino.forBlock['stm32_freertos_task_suspend'] = function(block, generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  const taskLabel = stm32FreeRTOSGetVarName(block, 'TaskBlink');
  return 'vTaskSuspend(' + stm32FreeRTOSTaskHandleName(taskLabel) + ');\n';
};

Arduino.forBlock['stm32_freertos_task_resume'] = function(block, generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  const taskLabel = stm32FreeRTOSGetVarName(block, 'TaskBlink');
  return 'vTaskResume(' + stm32FreeRTOSTaskHandleName(taskLabel) + ');\n';
};

Arduino.forBlock['stm32_freertos_task_delete'] = function(block, generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  const taskLabel = stm32FreeRTOSGetVarName(block, 'TaskBlink');
  const handleName = stm32FreeRTOSTaskHandleName(taskLabel);
  return 'vTaskDelete(' + handleName + ');\n' + handleName + ' = NULL;\n';
};

Arduino.forBlock['stm32_freertos_task_delete_current'] = function(block, generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  return 'vTaskDelete(NULL);\n';
};

Arduino.forBlock['stm32_freertos_task_notify'] = function(block, generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  const taskLabel = stm32FreeRTOSGetVarName(block, 'TaskBlink');
  return 'xTaskNotifyGive(' + stm32FreeRTOSTaskHandleName(taskLabel) + ');\n';
};

Arduino.forBlock['stm32_freertos_task_notify_from_isr'] = function(block, generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  const taskLabel = stm32FreeRTOSGetVarName(block, 'TaskBlink');
  const handleName = stm32FreeRTOSTaskHandleName(taskLabel);
  return '{\n' +
    '  BaseType_t xHigherPriorityTaskWoken = pdFALSE;\n' +
    '  vTaskNotifyGiveFromISR(' + handleName + ', &xHigherPriorityTaskWoken);\n' +
    '  portYIELD_FROM_ISR(xHigherPriorityTaskWoken);\n' +
    '}\n';
};

Arduino.forBlock['stm32_freertos_task_wait_notification'] = function(block, generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  const waitTicks = stm32FreeRTOSWaitTicks(block, generator);
  return ['(ulTaskNotifyTake(pdTRUE, ' + waitTicks + ') > 0)', stm32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['stm32_freertos_queue_create'] = function(block, generator) {
  attachSTM32FreeRTOSVarMonitor(block, 'STM32FreeRTOSQueue', 'sensorQueue');
  const queueLabel = stm32FreeRTOSGetInputName(block, 'sensorQueue');
  const queueName = stm32FreeRTOSSanitizeName(queueLabel, 'sensorQueue');
  const queueLength = block.getFieldValue('QUEUE_LENGTH') || '10';
  const dataType = block.getFieldValue('DATA_TYPE') || 'int';

  ensureSTM32FreeRTOSQueueLibrary(generator);
  registerSTM32FreeRTOSVariable(queueLabel, 'STM32FreeRTOSQueue');
  generator.addObject('stm32_freertos_queue_' + queueName, 'QueueHandle_t ' + queueName + ' = NULL;');
  return queueName + ' = xQueueCreate(' + queueLength + ', sizeof(' + dataType + '));\n';
};

Arduino.forBlock['stm32_freertos_queue_send'] = function(block, generator) {
  const queueLabel = stm32FreeRTOSGetVarName(block, 'sensorQueue');
  const queueName = stm32FreeRTOSSanitizeName(queueLabel, 'sensorQueue');
  const dataType = block.getFieldValue('DATA_TYPE') || 'int';
  const data = generator.valueToCode(block, 'DATA', stm32FreeRTOSOrderAtomic(generator)) || '0';
  const waitTicks = stm32FreeRTOSWaitTicks(block, generator);
  const tempName = 'stm32FreeRTOSQueueItem_' + queueName;

  ensureSTM32FreeRTOSQueueLibrary(generator);
  return '{\n' +
    '  ' + dataType + ' ' + tempName + ' = ' + data + ';\n' +
    '  xQueueSend(' + queueName + ', &' + tempName + ', ' + waitTicks + ');\n' +
    '}\n';
};

Arduino.forBlock['stm32_freertos_queue_receive_do'] = function(block, generator) {
  const queueLabel = stm32FreeRTOSGetVarName(block, 'sensorQueue');
  const queueName = stm32FreeRTOSSanitizeName(queueLabel, 'sensorQueue');
  const dataType = block.getFieldValue('DATA_TYPE') || 'int';
  const itemName = stm32FreeRTOSSanitizeName(block.getFieldValue('ITEM_VAR'), 'queueValue');
  const waitTicks = stm32FreeRTOSWaitTicks(block, generator);
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  ensureSTM32FreeRTOSQueueLibrary(generator);
  return '{\n' +
    '  ' + dataType + ' ' + itemName + ';\n' +
    '  if (xQueueReceive(' + queueName + ', &' + itemName + ', ' + waitTicks + ') == pdPASS) {\n' +
    handlerCode +
    '  }\n' +
    '}\n';
};

Arduino.forBlock['stm32_freertos_queue_messages_waiting'] = function(block, generator) {
  ensureSTM32FreeRTOSQueueLibrary(generator);
  const queueLabel = stm32FreeRTOSGetVarName(block, 'sensorQueue');
  const queueName = stm32FreeRTOSSanitizeName(queueLabel, 'sensorQueue');
  return ['uxQueueMessagesWaiting(' + queueName + ')', stm32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['stm32_freertos_semaphore_create'] = function(block, generator) {
  attachSTM32FreeRTOSVarMonitor(block, 'STM32FreeRTOSSemaphore', 'syncSem');
  const semaphoreLabel = stm32FreeRTOSGetInputName(block, 'syncSem');
  const semaphoreName = stm32FreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
  const semaphoreType = block.getFieldValue('SEMAPHORE_TYPE') || 'BINARY';
  const maxCount = block.getFieldValue('MAX_COUNT') || '10';
  const initialCount = block.getFieldValue('INITIAL_COUNT') || '0';

  ensureSTM32FreeRTOSSemaphoreLibrary(generator);
  registerSTM32FreeRTOSVariable(semaphoreLabel, 'STM32FreeRTOSSemaphore');
  generator.addObject('stm32_freertos_semaphore_' + semaphoreName, 'SemaphoreHandle_t ' + semaphoreName + ' = NULL;');

  if (semaphoreType === 'MUTEX') {
    return semaphoreName + ' = xSemaphoreCreateMutex();\n';
  }
  if (semaphoreType === 'COUNTING') {
    return semaphoreName + ' = xSemaphoreCreateCounting(' + maxCount + ', ' + initialCount + ');\n';
  }
  return semaphoreName + ' = xSemaphoreCreateBinary();\n';
};

Arduino.forBlock['stm32_freertos_semaphore_take'] = function(block, generator) {
  ensureSTM32FreeRTOSSemaphoreLibrary(generator);
  const semaphoreLabel = stm32FreeRTOSGetVarName(block, 'syncSem');
  const semaphoreName = stm32FreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
  const waitTicks = stm32FreeRTOSWaitTicks(block, generator);
  return ['(xSemaphoreTake(' + semaphoreName + ', ' + waitTicks + ') == pdTRUE)', stm32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['stm32_freertos_semaphore_give'] = function(block, generator) {
  ensureSTM32FreeRTOSSemaphoreLibrary(generator);
  const semaphoreLabel = stm32FreeRTOSGetVarName(block, 'syncSem');
  const semaphoreName = stm32FreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
  return 'xSemaphoreGive(' + semaphoreName + ');\n';
};

Arduino.forBlock['stm32_freertos_semaphore_give_from_isr'] = function(block, generator) {
  ensureSTM32FreeRTOSSemaphoreLibrary(generator);
  const semaphoreLabel = stm32FreeRTOSGetVarName(block, 'syncSem');
  const semaphoreName = stm32FreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
  return '{\n' +
    '  BaseType_t xHigherPriorityTaskWoken = pdFALSE;\n' +
    '  xSemaphoreGiveFromISR(' + semaphoreName + ', &xHigherPriorityTaskWoken);\n' +
    '  portYIELD_FROM_ISR(xHigherPriorityTaskWoken);\n' +
    '}\n';
};

Arduino.forBlock['stm32_freertos_attach_interrupt'] = function(block, generator) {
  const pin = block.getFieldValue('PIN') || '2';
  const mode = block.getFieldValue('MODE') || 'LOW';
  const functionName = 'stm32FreeRTOSInterruptPin' + stm32FreeRTOSSanitizeName(pin, '2');
  const isrCode = generator.statementToCode(block, 'ISR_CODE') || '';

  ensureSTM32FreeRTOSLibrary(generator);
  generator.addFunction('stm32_freertos_interrupt_' + pin, 'void ' + functionName + '() {\n' + isrCode + '}\n');
  generator.addSetupBegin('stm32_freertos_interrupt_pin_mode_' + pin, 'pinMode(' + pin + ', INPUT_PULLUP);');
  generator.addSetupBegin('stm32_freertos_attach_interrupt_' + pin, 'attachInterrupt(digitalPinToInterrupt(' + pin + '), ' + functionName + ', ' + mode + ');');
  return '';
};

Arduino.forBlock['stm32_freertos_get_tick_count'] = function(block, generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  return ['xTaskGetTickCount()', stm32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['stm32_freertos_get_task_count'] = function(block, generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  return ['uxTaskGetNumberOfTasks()', stm32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['stm32_freertos_get_task_name'] = function(block, generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  const taskLabel = stm32FreeRTOSGetVarName(block, 'TaskBlink');
  return ['pcTaskGetName(' + stm32FreeRTOSTaskHandleName(taskLabel) + ')', stm32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['stm32_freertos_get_current_task_name'] = function(block, generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  return ['pcTaskGetName(NULL)', stm32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['stm32_freertos_get_stack_high_water_mark'] = function(block, generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  const taskLabel = stm32FreeRTOSGetVarName(block, 'TaskBlink');
  return ['uxTaskGetStackHighWaterMark(' + stm32FreeRTOSTaskHandleName(taskLabel) + ')', stm32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['stm32_freertos_get_idle_stack_high_water_mark'] = function(block, generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  return ['uxTaskGetStackHighWaterMark(xTaskGetIdleTaskHandle())', stm32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['stm32_freertos_get_free_heap_size'] = function(block, generator) {
  ensureSTM32FreeRTOSLibrary(generator);
  return ['xPortGetFreeHeapSize()', stm32FreeRTOSOrderFunctionCall(generator)];
};
