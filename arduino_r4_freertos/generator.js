function r4FreeRTOSOrderAtomic(generator) {
  return generator.ORDER_ATOMIC || Arduino.ORDER_ATOMIC;
}

function r4FreeRTOSOrderFunctionCall(generator) {
  return generator.ORDER_FUNCTION_CALL || Arduino.ORDER_FUNCTION_CALL;
}

function r4FreeRTOSSanitizeName(name, fallback) {
  const source = String(name || fallback || 'item');
  let sanitized = source.replace(/[^A-Za-z0-9_]/g, '_');
  if (!/^[A-Za-z_]/.test(sanitized)) {
    sanitized = '_' + sanitized;
  }
  return sanitized;
}

function r4FreeRTOSEscapeString(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function r4FreeRTOSGetInputName(block, fallback) {
  return block.getFieldValue('VAR') || fallback;
}

function r4FreeRTOSGetVarName(block, fallback) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : fallback;
}

function r4FreeRTOSTaskHandleName(taskName) {
  return r4FreeRTOSSanitizeName(taskName, 'Task') + 'Handle';
}

function r4FreeRTOSWaitTicks(block, generator) {
  const waitMode = block.getFieldValue('WAIT_MODE') || 'MS';
  if (waitMode === 'FOREVER') {
    return 'portMAX_DELAY';
  }
  const waitMs = generator.valueToCode(block, 'WAIT_MS', r4FreeRTOSOrderAtomic(generator)) || '0';
  return 'pdMS_TO_TICKS(' + waitMs + ')';
}

function ensureR4FreeRTOSLibrary(generator) {
  const boardConfig = typeof window !== 'undefined' ? window['boardConfig'] : null;
  if (boardConfig && boardConfig.core && boardConfig.core.indexOf('renesas_uno') === -1) {
    // Arduino_FreeRTOS in this package targets Arduino UNO R4 Minima/WiFi cores.
  }
  generator.addLibrary('ArduinoFreeRTOS', '#include <Arduino_FreeRTOS.h>');
}

function ensureR4FreeRTOSQueueLibrary(generator) {
  ensureR4FreeRTOSLibrary(generator);
}

function ensureR4FreeRTOSSemaphoreLibrary(generator) {
  ensureR4FreeRTOSLibrary(generator);
}

function ensureR4FreeRTOSSchedulerStart(generator) {
  ensureR4FreeRTOSLibrary(generator);
  generator.addSetupEnd('r4_freertos_start_scheduler', 'vTaskStartScheduler();');
}

function ensureSerialBegin(generator) {
  generator.addSetupBegin('r4_freertos_serial_begin', 'Serial.begin(115200);');
}

function registerR4FreeRTOSVariable(varName, varType) {
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, varType);
  }
}

function attachR4FreeRTOSVarMonitor(block, varType, fallback) {
  if (!block._r4FreeRTOSVarMonitorAttached) {
    block._r4FreeRTOSVarMonitorAttached = true;
    block._r4FreeRTOSVarLastName = block.getFieldValue('VAR') || fallback;
    registerR4FreeRTOSVariable(block._r4FreeRTOSVarLastName, varType);
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._r4FreeRTOSVarLastName;
        if (workspace && newName && newName !== oldName && typeof renameVariableInBlockly === 'function') {
          renameVariableInBlockly(block, oldName, newName, varType);
          block._r4FreeRTOSVarLastName = newName;
        }
      };
    }
  }
}

Arduino.forBlock['r4_freertos_task_create'] = function(block, generator) {
  attachR4FreeRTOSVarMonitor(block, 'R4FreeRTOSTask', 'TaskBlink');
  const taskLabel = r4FreeRTOSGetInputName(block, 'TaskBlink');
  const taskName = r4FreeRTOSSanitizeName(taskLabel, 'TaskBlink');
  const stackSize = block.getFieldValue('STACK_SIZE') || '128';
  const priority = block.getFieldValue('PRIORITY') || '1';
  const handleName = r4FreeRTOSTaskHandleName(taskLabel);

  ensureR4FreeRTOSSchedulerStart(generator);
  registerR4FreeRTOSVariable(taskLabel, 'R4FreeRTOSTask');
  generator.addObject('r4_freertos_task_handle_' + taskName, 'TaskHandle_t ' + handleName + ' = NULL;');
  generator.addFunction('r4_freertos_task_prototype_' + taskName, 'void ' + taskName + '(void *pvParameters);');

  return 'xTaskCreate(\n' +
    '  ' + taskName + ',\n' +
    '  "' + r4FreeRTOSEscapeString(taskLabel) + '",\n' +
    '  ' + stackSize + ',\n' +
    '  NULL,\n' +
    '  ' + priority + ',\n' +
    '  &' + handleName + '\n' +
    ');\n';
};

Arduino.forBlock['r4_freertos_task_function'] = function(block, generator) {
  const taskLabel = r4FreeRTOSGetVarName(block, 'TaskBlink');
  const taskName = r4FreeRTOSSanitizeName(taskLabel, 'TaskBlink');
  const taskCode = generator.statementToCode(block, 'TASK_CODE') || '';

  ensureR4FreeRTOSLibrary(generator);
  const functionDef = 'void ' + taskName + '(void *pvParameters) {\n' +
    '  (void) pvParameters;\n\n' +
    '  for (;;) {\n' +
    taskCode +
    '  }\n' +
    '}\n';
  generator.addFunction('r4_freertos_task_function_' + taskName, functionDef);
  return '';
};

Arduino.forBlock['r4_freertos_start_scheduler'] = function(block, generator) {
  ensureR4FreeRTOSSchedulerStart(generator);
  return '';
};

Arduino.forBlock['r4_freertos_task_delay_ms'] = function(block, generator) {
  ensureR4FreeRTOSLibrary(generator);
  const ms = generator.valueToCode(block, 'MS', r4FreeRTOSOrderAtomic(generator)) || '1000';
  return 'vTaskDelay(pdMS_TO_TICKS(' + ms + '));\n';
};

Arduino.forBlock['r4_freertos_task_delay_ticks'] = function(block, generator) {
  ensureR4FreeRTOSLibrary(generator);
  const ticks = generator.valueToCode(block, 'TICKS', r4FreeRTOSOrderAtomic(generator)) || '1';
  return 'vTaskDelay(' + ticks + ');\n';
};

Arduino.forBlock['r4_freertos_task_suspend'] = function(block, generator) {
  ensureR4FreeRTOSLibrary(generator);
  const taskLabel = r4FreeRTOSGetVarName(block, 'TaskBlink');
  return 'vTaskSuspend(' + r4FreeRTOSTaskHandleName(taskLabel) + ');\n';
};

Arduino.forBlock['r4_freertos_task_resume'] = function(block, generator) {
  ensureR4FreeRTOSLibrary(generator);
  const taskLabel = r4FreeRTOSGetVarName(block, 'TaskBlink');
  return 'vTaskResume(' + r4FreeRTOSTaskHandleName(taskLabel) + ');\n';
};

Arduino.forBlock['r4_freertos_task_delete'] = function(block, generator) {
  ensureR4FreeRTOSLibrary(generator);
  const taskLabel = r4FreeRTOSGetVarName(block, 'TaskBlink');
  const handleName = r4FreeRTOSTaskHandleName(taskLabel);
  return 'vTaskDelete(' + handleName + ');\n' + handleName + ' = NULL;\n';
};

Arduino.forBlock['r4_freertos_task_delete_current'] = function(block, generator) {
  ensureR4FreeRTOSLibrary(generator);
  return 'vTaskDelete(NULL);\n';
};

Arduino.forBlock['r4_freertos_task_notify'] = function(block, generator) {
  ensureR4FreeRTOSLibrary(generator);
  const taskLabel = r4FreeRTOSGetVarName(block, 'TaskBlink');
  return 'xTaskNotifyGive(' + r4FreeRTOSTaskHandleName(taskLabel) + ');\n';
};

Arduino.forBlock['r4_freertos_task_notify_from_isr'] = function(block, generator) {
  ensureR4FreeRTOSLibrary(generator);
  const taskLabel = r4FreeRTOSGetVarName(block, 'TaskBlink');
  const handleName = r4FreeRTOSTaskHandleName(taskLabel);
  return '{\n' +
    '  BaseType_t xHigherPriorityTaskWoken = pdFALSE;\n' +
    '  vTaskNotifyGiveFromISR(' + handleName + ', &xHigherPriorityTaskWoken);\n' +
    '  portYIELD_FROM_ISR(xHigherPriorityTaskWoken);\n' +
    '}\n';
};

Arduino.forBlock['r4_freertos_task_wait_notification'] = function(block, generator) {
  ensureR4FreeRTOSLibrary(generator);
  const waitTicks = r4FreeRTOSWaitTicks(block, generator);
  return ['(ulTaskNotifyTake(pdTRUE, ' + waitTicks + ') > 0)', r4FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['r4_freertos_queue_create'] = function(block, generator) {
  attachR4FreeRTOSVarMonitor(block, 'R4FreeRTOSQueue', 'sensorQueue');
  const queueLabel = r4FreeRTOSGetInputName(block, 'sensorQueue');
  const queueName = r4FreeRTOSSanitizeName(queueLabel, 'sensorQueue');
  const queueLength = block.getFieldValue('QUEUE_LENGTH') || '10';
  const dataType = block.getFieldValue('DATA_TYPE') || 'int';

  ensureR4FreeRTOSQueueLibrary(generator);
  registerR4FreeRTOSVariable(queueLabel, 'R4FreeRTOSQueue');
  generator.addObject('r4_freertos_queue_' + queueName, 'QueueHandle_t ' + queueName + ' = NULL;');
  return queueName + ' = xQueueCreate(' + queueLength + ', sizeof(' + dataType + '));\n';
};

Arduino.forBlock['r4_freertos_queue_send'] = function(block, generator) {
  const queueLabel = r4FreeRTOSGetVarName(block, 'sensorQueue');
  const queueName = r4FreeRTOSSanitizeName(queueLabel, 'sensorQueue');
  const dataType = block.getFieldValue('DATA_TYPE') || 'int';
  const data = generator.valueToCode(block, 'DATA', r4FreeRTOSOrderAtomic(generator)) || '0';
  const waitTicks = r4FreeRTOSWaitTicks(block, generator);
  const tempName = 'r4FreeRTOSQueueItem_' + queueName;

  ensureR4FreeRTOSQueueLibrary(generator);
  return '{\n' +
    '  ' + dataType + ' ' + tempName + ' = ' + data + ';\n' +
    '  xQueueSend(' + queueName + ', &' + tempName + ', ' + waitTicks + ');\n' +
    '}\n';
};

Arduino.forBlock['r4_freertos_queue_receive_do'] = function(block, generator) {
  const queueLabel = r4FreeRTOSGetVarName(block, 'sensorQueue');
  const queueName = r4FreeRTOSSanitizeName(queueLabel, 'sensorQueue');
  const dataType = block.getFieldValue('DATA_TYPE') || 'int';
  const itemName = r4FreeRTOSSanitizeName(block.getFieldValue('ITEM_VAR'), 'queueValue');
  const waitTicks = r4FreeRTOSWaitTicks(block, generator);
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  ensureR4FreeRTOSQueueLibrary(generator);
  return '{\n' +
    '  ' + dataType + ' ' + itemName + ';\n' +
    '  if (xQueueReceive(' + queueName + ', &' + itemName + ', ' + waitTicks + ') == pdPASS) {\n' +
    handlerCode +
    '  }\n' +
    '}\n';
};

Arduino.forBlock['r4_freertos_queue_messages_waiting'] = function(block, generator) {
  ensureR4FreeRTOSQueueLibrary(generator);
  const queueLabel = r4FreeRTOSGetVarName(block, 'sensorQueue');
  const queueName = r4FreeRTOSSanitizeName(queueLabel, 'sensorQueue');
  return ['uxQueueMessagesWaiting(' + queueName + ')', r4FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['r4_freertos_semaphore_create'] = function(block, generator) {
  attachR4FreeRTOSVarMonitor(block, 'R4FreeRTOSSemaphore', 'syncSem');
  const semaphoreLabel = r4FreeRTOSGetInputName(block, 'syncSem');
  const semaphoreName = r4FreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
  const semaphoreType = block.getFieldValue('SEMAPHORE_TYPE') || 'BINARY';
  const maxCount = block.getFieldValue('MAX_COUNT') || '10';
  const initialCount = block.getFieldValue('INITIAL_COUNT') || '0';

  ensureR4FreeRTOSSemaphoreLibrary(generator);
  registerR4FreeRTOSVariable(semaphoreLabel, 'R4FreeRTOSSemaphore');
  generator.addObject('r4_freertos_semaphore_' + semaphoreName, 'SemaphoreHandle_t ' + semaphoreName + ' = NULL;');

  if (semaphoreType === 'COUNTING') {
    return semaphoreName + ' = xSemaphoreCreateCounting(' + maxCount + ', ' + initialCount + ');\n';
  }
  return semaphoreName + ' = xSemaphoreCreateBinary();\n';
};

Arduino.forBlock['r4_freertos_semaphore_take'] = function(block, generator) {
  ensureR4FreeRTOSSemaphoreLibrary(generator);
  const semaphoreLabel = r4FreeRTOSGetVarName(block, 'syncSem');
  const semaphoreName = r4FreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
  const waitTicks = r4FreeRTOSWaitTicks(block, generator);
  return ['(xSemaphoreTake(' + semaphoreName + ', ' + waitTicks + ') == pdTRUE)', r4FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['r4_freertos_semaphore_give'] = function(block, generator) {
  ensureR4FreeRTOSSemaphoreLibrary(generator);
  const semaphoreLabel = r4FreeRTOSGetVarName(block, 'syncSem');
  const semaphoreName = r4FreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
  return 'xSemaphoreGive(' + semaphoreName + ');\n';
};

Arduino.forBlock['r4_freertos_semaphore_give_from_isr'] = function(block, generator) {
  ensureR4FreeRTOSSemaphoreLibrary(generator);
  const semaphoreLabel = r4FreeRTOSGetVarName(block, 'syncSem');
  const semaphoreName = r4FreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
  return '{\n' +
    '  BaseType_t xHigherPriorityTaskWoken = pdFALSE;\n' +
    '  xSemaphoreGiveFromISR(' + semaphoreName + ', &xHigherPriorityTaskWoken);\n' +
    '  portYIELD_FROM_ISR(xHigherPriorityTaskWoken);\n' +
    '}\n';
};

Arduino.forBlock['r4_freertos_attach_interrupt'] = function(block, generator) {
  const pin = block.getFieldValue('PIN') || '2';
  const mode = block.getFieldValue('MODE') || 'LOW';
  const functionName = 'r4FreeRTOSInterruptPin' + r4FreeRTOSSanitizeName(pin, '2');
  const isrCode = generator.statementToCode(block, 'ISR_CODE') || '';

  ensureR4FreeRTOSLibrary(generator);
  generator.addFunction('r4_freertos_interrupt_' + pin, 'void ' + functionName + '() {\n' + isrCode + '}\n');
  generator.addSetupBegin('r4_freertos_interrupt_pin_mode_' + pin, 'pinMode(' + pin + ', INPUT_PULLUP);');
  generator.addSetupBegin('r4_freertos_attach_interrupt_' + pin, 'attachInterrupt(digitalPinToInterrupt(' + pin + '), ' + functionName + ', ' + mode + ');');
  return '';
};

Arduino.forBlock['r4_freertos_get_tick_count'] = function(block, generator) {
  ensureR4FreeRTOSLibrary(generator);
  return ['xTaskGetTickCount()', r4FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['r4_freertos_get_task_count'] = function(block, generator) {
  ensureR4FreeRTOSLibrary(generator);
  return ['uxTaskGetNumberOfTasks()', r4FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['r4_freertos_get_task_name'] = function(block, generator) {
  ensureR4FreeRTOSLibrary(generator);
  const taskLabel = r4FreeRTOSGetVarName(block, 'TaskBlink');
  return ['pcTaskGetName(' + r4FreeRTOSTaskHandleName(taskLabel) + ')', r4FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['r4_freertos_get_current_task_name'] = function(block, generator) {
  ensureR4FreeRTOSLibrary(generator);
  return ['pcTaskGetName(NULL)', r4FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['r4_freertos_get_free_heap_size'] = function(block, generator) {
  ensureR4FreeRTOSLibrary(generator);
  return ['xPortGetFreeHeapSize()', r4FreeRTOSOrderFunctionCall(generator)];
};
