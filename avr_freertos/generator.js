function avrFreeRTOSOrderAtomic(generator) {
  return generator.ORDER_ATOMIC || Arduino.ORDER_ATOMIC;
}

function avrFreeRTOSOrderFunctionCall(generator) {
  return generator.ORDER_FUNCTION_CALL || Arduino.ORDER_FUNCTION_CALL;
}

function avrFreeRTOSSanitizeName(name, fallback) {
  const source = String(name || fallback || 'item');
  let sanitized = source.replace(/[^A-Za-z0-9_]/g, '_');
  if (!/^[A-Za-z_]/.test(sanitized)) {
    sanitized = '_' + sanitized;
  }
  return sanitized;
}

function avrFreeRTOSEscapeString(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function avrFreeRTOSGetInputName(block, fallback) {
  return block.getFieldValue('VAR') || fallback;
}

function avrFreeRTOSGetVarName(block, fallback) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : fallback;
}

function avrFreeRTOSTaskHandleName(taskName) {
  return avrFreeRTOSSanitizeName(taskName, 'Task') + 'Handle';
}

function avrFreeRTOSWaitTicks(block, generator) {
  const waitMode = block.getFieldValue('WAIT_MODE') || 'MS';
  if (waitMode === 'FOREVER') {
    return 'portMAX_DELAY';
  }
  const waitMs = generator.valueToCode(block, 'WAIT_MS', avrFreeRTOSOrderAtomic(generator)) || '0';
  return '(' + waitMs + ' / portTICK_PERIOD_MS)';
}

function ensureAvrFreeRTOSLibrary(generator) {
  const boardConfig = typeof window !== 'undefined' ? window['boardConfig'] : null;
  if (boardConfig && boardConfig.core && boardConfig.core.indexOf('avr') === -1) {
    // AVR FreeRTOS is packaged for arduino:avr boards.
  }
  generator.addLibrary('AVRFreeRTOS', '#include <Arduino_FreeRTOS.h>');
}

function ensureAvrFreeRTOSQueueLibrary(generator) {
  ensureAvrFreeRTOSLibrary(generator);
  generator.addLibrary('AVRFreeRTOSQueue', '#include <queue.h>');
}

function ensureAvrFreeRTOSSemaphoreLibrary(generator) {
  ensureAvrFreeRTOSLibrary(generator);
  generator.addLibrary('AVRFreeRTOSSemaphore', '#include <semphr.h>');
}

function ensureSerialBegin(generator) {
  generator.addSetupBegin('avr_freertos_serial_begin', 'Serial.begin(9600);');
}

function registerAvrFreeRTOSVariable(varName, varType) {
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, varType);
  }
}

function attachAvrFreeRTOSVarMonitor(block, varType, fallback) {
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || fallback;
    registerAvrFreeRTOSVariable(block._varLastName, varType);
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._varLastName;
        if (workspace && newName && newName !== oldName && typeof renameVariableInBlockly === 'function') {
          renameVariableInBlockly(block, oldName, newName, varType);
          block._varLastName = newName;
        }
      };
    }
  }
}

Arduino.forBlock['avr_freertos_task_create'] = function(block, generator) {
  attachAvrFreeRTOSVarMonitor(block, 'FreeRTOSTask', 'TaskBlink');
  const taskLabel = avrFreeRTOSGetInputName(block, 'TaskBlink');
  const taskName = avrFreeRTOSSanitizeName(taskLabel, 'TaskBlink');
  const stackSize = block.getFieldValue('STACK_SIZE') || '128';
  const priority = block.getFieldValue('PRIORITY') || '1';
  const handleName = avrFreeRTOSTaskHandleName(taskLabel);

  ensureAvrFreeRTOSLibrary(generator);
  registerAvrFreeRTOSVariable(taskLabel, 'FreeRTOSTask');
  generator.addObject('avr_freertos_task_handle_' + taskName, 'TaskHandle_t ' + handleName + ' = NULL;');
  generator.addFunction('avr_freertos_task_prototype_' + taskName, 'void ' + taskName + '(void *pvParameters);');

  return 'xTaskCreate(\n' +
    '  ' + taskName + ',\n' +
    '  "' + avrFreeRTOSEscapeString(taskLabel) + '",\n' +
    '  ' + stackSize + ',\n' +
    '  NULL,\n' +
    '  ' + priority + ',\n' +
    '  &' + handleName + '\n' +
    ');\n';
};

Arduino.forBlock['avr_freertos_task_function'] = function(block, generator) {
  const taskLabel = avrFreeRTOSGetVarName(block, 'TaskBlink');
  const taskName = avrFreeRTOSSanitizeName(taskLabel, 'TaskBlink');
  const taskCode = generator.statementToCode(block, 'TASK_CODE') || '';

  ensureAvrFreeRTOSLibrary(generator);
  const functionDef = 'void ' + taskName + '(void *pvParameters) {\n' +
    '  (void) pvParameters;\n\n' +
    '  for (;;) {\n' +
    taskCode +
    '  }\n' +
    '}\n';
  generator.addFunction('avr_freertos_task_function_' + taskName, functionDef);
  return '';
};

Arduino.forBlock['avr_freertos_task_delay_ms'] = function(block, generator) {
  ensureAvrFreeRTOSLibrary(generator);
  const ms = generator.valueToCode(block, 'MS', avrFreeRTOSOrderAtomic(generator)) || '1000';
  return 'vTaskDelay(' + ms + ' / portTICK_PERIOD_MS);\n';
};

Arduino.forBlock['avr_freertos_task_delay_ticks'] = function(block, generator) {
  ensureAvrFreeRTOSLibrary(generator);
  const ticks = generator.valueToCode(block, 'TICKS', avrFreeRTOSOrderAtomic(generator)) || '1';
  return 'vTaskDelay(' + ticks + ');\n';
};

Arduino.forBlock['avr_freertos_task_suspend'] = function(block, generator) {
  ensureAvrFreeRTOSLibrary(generator);
  const taskLabel = avrFreeRTOSGetVarName(block, 'TaskBlink');
  return 'vTaskSuspend(' + avrFreeRTOSTaskHandleName(taskLabel) + ');\n';
};

Arduino.forBlock['avr_freertos_task_resume'] = function(block, generator) {
  ensureAvrFreeRTOSLibrary(generator);
  const taskLabel = avrFreeRTOSGetVarName(block, 'TaskBlink');
  return 'vTaskResume(' + avrFreeRTOSTaskHandleName(taskLabel) + ');\n';
};

Arduino.forBlock['avr_freertos_task_delete'] = function(block, generator) {
  ensureAvrFreeRTOSLibrary(generator);
  const taskLabel = avrFreeRTOSGetVarName(block, 'TaskBlink');
  const handleName = avrFreeRTOSTaskHandleName(taskLabel);
  return 'vTaskDelete(' + handleName + ');\n' + handleName + ' = NULL;\n';
};

Arduino.forBlock['avr_freertos_task_delete_current'] = function(block, generator) {
  ensureAvrFreeRTOSLibrary(generator);
  return 'vTaskDelete(NULL);\n';
};

Arduino.forBlock['avr_freertos_task_notify'] = function(block, generator) {
  ensureAvrFreeRTOSLibrary(generator);
  const taskLabel = avrFreeRTOSGetVarName(block, 'TaskBlink');
  return 'xTaskNotifyGive(' + avrFreeRTOSTaskHandleName(taskLabel) + ');\n';
};

Arduino.forBlock['avr_freertos_task_notify_from_isr'] = function(block, generator) {
  ensureAvrFreeRTOSLibrary(generator);
  const taskLabel = avrFreeRTOSGetVarName(block, 'TaskBlink');
  const handleName = avrFreeRTOSTaskHandleName(taskLabel);
  return '{\n' +
    '  BaseType_t xHigherPriorityTaskWoken = pdFALSE;\n' +
    '  vTaskNotifyGiveFromISR(' + handleName + ', &xHigherPriorityTaskWoken);\n' +
    '  if (xHigherPriorityTaskWoken == pdTRUE) {\n' +
    '    taskYIELD();\n' +
    '  }\n' +
    '}\n';
};

Arduino.forBlock['avr_freertos_task_wait_notification'] = function(block, generator) {
  ensureAvrFreeRTOSLibrary(generator);
  const waitTicks = avrFreeRTOSWaitTicks(block, generator);
  return ['(ulTaskNotifyTake(pdTRUE, ' + waitTicks + ') > 0)', avrFreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['avr_freertos_queue_create'] = function(block, generator) {
  attachAvrFreeRTOSVarMonitor(block, 'FreeRTOSQueue', 'sensorQueue');
  const queueLabel = avrFreeRTOSGetInputName(block, 'sensorQueue');
  const queueName = avrFreeRTOSSanitizeName(queueLabel, 'sensorQueue');
  const queueLength = block.getFieldValue('QUEUE_LENGTH') || '10';
  const dataType = block.getFieldValue('DATA_TYPE') || 'int';

  ensureAvrFreeRTOSQueueLibrary(generator);
  registerAvrFreeRTOSVariable(queueLabel, 'FreeRTOSQueue');
  generator.addObject('avr_freertos_queue_' + queueName, 'QueueHandle_t ' + queueName + ' = NULL;');
  return queueName + ' = xQueueCreate(' + queueLength + ', sizeof(' + dataType + '));\n';
};

Arduino.forBlock['avr_freertos_queue_send'] = function(block, generator) {
  const queueLabel = avrFreeRTOSGetVarName(block, 'sensorQueue');
  const queueName = avrFreeRTOSSanitizeName(queueLabel, 'sensorQueue');
  const dataType = block.getFieldValue('DATA_TYPE') || 'int';
  const data = generator.valueToCode(block, 'DATA', avrFreeRTOSOrderAtomic(generator)) || '0';
  const waitTicks = avrFreeRTOSWaitTicks(block, generator);
  const tempName = 'avrFreeRTOSQueueItem_' + queueName;

  ensureAvrFreeRTOSQueueLibrary(generator);
  return '{\n' +
    '  ' + dataType + ' ' + tempName + ' = ' + data + ';\n' +
    '  xQueueSend(' + queueName + ', &' + tempName + ', ' + waitTicks + ');\n' +
    '}\n';
};

Arduino.forBlock['avr_freertos_queue_receive_do'] = function(block, generator) {
  const queueLabel = avrFreeRTOSGetVarName(block, 'sensorQueue');
  const queueName = avrFreeRTOSSanitizeName(queueLabel, 'sensorQueue');
  const dataType = block.getFieldValue('DATA_TYPE') || 'int';
  const itemName = avrFreeRTOSSanitizeName(block.getFieldValue('ITEM_VAR'), 'queueValue');
  const waitTicks = avrFreeRTOSWaitTicks(block, generator);
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  ensureAvrFreeRTOSQueueLibrary(generator);
  return '{\n' +
    '  ' + dataType + ' ' + itemName + ';\n' +
    '  if (xQueueReceive(' + queueName + ', &' + itemName + ', ' + waitTicks + ') == pdPASS) {\n' +
    handlerCode +
    '  }\n' +
    '}\n';
};

Arduino.forBlock['avr_freertos_queue_messages_waiting'] = function(block, generator) {
  ensureAvrFreeRTOSQueueLibrary(generator);
  const queueLabel = avrFreeRTOSGetVarName(block, 'sensorQueue');
  const queueName = avrFreeRTOSSanitizeName(queueLabel, 'sensorQueue');
  return ['uxQueueMessagesWaiting(' + queueName + ')', avrFreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['avr_freertos_semaphore_create'] = function(block, generator) {
  attachAvrFreeRTOSVarMonitor(block, 'FreeRTOSSemaphore', 'syncSem');
  const semaphoreLabel = avrFreeRTOSGetInputName(block, 'syncSem');
  const semaphoreName = avrFreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
  const semaphoreType = block.getFieldValue('SEMAPHORE_TYPE') || 'BINARY';
  const maxCount = block.getFieldValue('MAX_COUNT') || '10';
  const initialCount = block.getFieldValue('INITIAL_COUNT') || '0';

  ensureAvrFreeRTOSSemaphoreLibrary(generator);
  registerAvrFreeRTOSVariable(semaphoreLabel, 'FreeRTOSSemaphore');
  generator.addObject('avr_freertos_semaphore_' + semaphoreName, 'SemaphoreHandle_t ' + semaphoreName + ' = NULL;');

  if (semaphoreType === 'MUTEX') {
    return semaphoreName + ' = xSemaphoreCreateMutex();\n';
  }
  if (semaphoreType === 'COUNTING') {
    return semaphoreName + ' = xSemaphoreCreateCounting(' + maxCount + ', ' + initialCount + ');\n';
  }
  return semaphoreName + ' = xSemaphoreCreateBinary();\n';
};

Arduino.forBlock['avr_freertos_semaphore_take'] = function(block, generator) {
  ensureAvrFreeRTOSSemaphoreLibrary(generator);
  const semaphoreLabel = avrFreeRTOSGetVarName(block, 'syncSem');
  const semaphoreName = avrFreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
  const waitTicks = avrFreeRTOSWaitTicks(block, generator);
  return ['(xSemaphoreTake(' + semaphoreName + ', ' + waitTicks + ') == pdTRUE)', avrFreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['avr_freertos_semaphore_give'] = function(block, generator) {
  ensureAvrFreeRTOSSemaphoreLibrary(generator);
  const semaphoreLabel = avrFreeRTOSGetVarName(block, 'syncSem');
  const semaphoreName = avrFreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
  return 'xSemaphoreGive(' + semaphoreName + ');\n';
};

Arduino.forBlock['avr_freertos_semaphore_give_from_isr'] = function(block, generator) {
  ensureAvrFreeRTOSSemaphoreLibrary(generator);
  const semaphoreLabel = avrFreeRTOSGetVarName(block, 'syncSem');
  const semaphoreName = avrFreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
  return '{\n' +
    '  BaseType_t xHigherPriorityTaskWoken = pdFALSE;\n' +
    '  xSemaphoreGiveFromISR(' + semaphoreName + ', &xHigherPriorityTaskWoken);\n' +
    '  if (xHigherPriorityTaskWoken == pdTRUE) {\n' +
    '    taskYIELD();\n' +
    '  }\n' +
    '}\n';
};

Arduino.forBlock['avr_freertos_attach_interrupt'] = function(block, generator) {
  const pin = block.getFieldValue('PIN') || '2';
  const mode = block.getFieldValue('MODE') || 'LOW';
  const functionName = 'avrFreeRTOSInterruptPin' + pin;
  const isrCode = generator.statementToCode(block, 'ISR_CODE') || '';

  ensureAvrFreeRTOSLibrary(generator);
  generator.addFunction('avr_freertos_interrupt_' + pin, 'void ' + functionName + '() {\n' + isrCode + '}\n');
  generator.addSetupBegin('avr_freertos_interrupt_pin_mode_' + pin, 'pinMode(' + pin + ', INPUT_PULLUP);');
  generator.addSetupBegin('avr_freertos_attach_interrupt_' + pin, 'attachInterrupt(digitalPinToInterrupt(' + pin + '), ' + functionName + ', ' + mode + ');');
  return '';
};

Arduino.forBlock['avr_freertos_get_tick_count'] = function(block, generator) {
  ensureAvrFreeRTOSLibrary(generator);
  return ['xTaskGetTickCount()', avrFreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['avr_freertos_get_task_count'] = function(block, generator) {
  ensureAvrFreeRTOSLibrary(generator);
  return ['uxTaskGetNumberOfTasks()', avrFreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['avr_freertos_get_task_name'] = function(block, generator) {
  ensureAvrFreeRTOSLibrary(generator);
  const taskLabel = avrFreeRTOSGetVarName(block, 'TaskBlink');
  return ['pcTaskGetName(' + avrFreeRTOSTaskHandleName(taskLabel) + ')', avrFreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['avr_freertos_get_current_task_name'] = function(block, generator) {
  ensureAvrFreeRTOSLibrary(generator);
  return ['pcTaskGetName(NULL)', avrFreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['avr_freertos_get_stack_high_water_mark'] = function(block, generator) {
  ensureAvrFreeRTOSLibrary(generator);
  const taskLabel = avrFreeRTOSGetVarName(block, 'TaskBlink');
  return ['uxTaskGetStackHighWaterMark(' + avrFreeRTOSTaskHandleName(taskLabel) + ')', avrFreeRTOSOrderFunctionCall(generator)];
};