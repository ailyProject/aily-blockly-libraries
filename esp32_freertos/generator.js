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

function esp32FreeRTOSTaskHandleName(taskName) {
  return esp32FreeRTOSSanitizeName(taskName, 'Task') + 'Handle';
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
  const taskName = esp32FreeRTOSSanitizeName(taskLabel, 'TaskBlink');
  const stackSize = block.getFieldValue('STACK_SIZE') || '4096';
  const priority = block.getFieldValue('PRIORITY') || '1';
  const core = block.getFieldValue('CORE') || 'AUTO';
  const handleName = esp32FreeRTOSTaskHandleName(taskLabel);

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
  const taskName = esp32FreeRTOSSanitizeName(taskLabel, 'TaskBlink');
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
  return 'vTaskSuspend(' + esp32FreeRTOSTaskHandleName(taskLabel) + ');\n';
};

Arduino.forBlock['esp32_freertos_task_resume'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  const taskLabel = esp32FreeRTOSGetVarName(block, 'TaskBlink');
  return 'vTaskResume(' + esp32FreeRTOSTaskHandleName(taskLabel) + ');\n';
};

Arduino.forBlock['esp32_freertos_task_delete'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  const taskLabel = esp32FreeRTOSGetVarName(block, 'TaskBlink');
  const handleName = esp32FreeRTOSTaskHandleName(taskLabel);
  return 'vTaskDelete(' + handleName + ');\n' + handleName + ' = NULL;\n';
};

Arduino.forBlock['esp32_freertos_task_delete_current'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  return 'vTaskDelete(NULL);\n';
};

Arduino.forBlock['esp32_freertos_task_notify'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  const taskLabel = esp32FreeRTOSGetVarName(block, 'TaskBlink');
  return 'xTaskNotifyGive(' + esp32FreeRTOSTaskHandleName(taskLabel) + ');\n';
};

Arduino.forBlock['esp32_freertos_task_notify_from_isr'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  const taskLabel = esp32FreeRTOSGetVarName(block, 'TaskBlink');
  const handleName = esp32FreeRTOSTaskHandleName(taskLabel);
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
  const queueName = esp32FreeRTOSSanitizeName(queueLabel, 'sensorQueue');
  const queueLength = block.getFieldValue('QUEUE_LENGTH') || '10';
  const dataType = block.getFieldValue('DATA_TYPE') || 'int';

  ensureESP32FreeRTOSQueueLibrary(generator);
  registerESP32FreeRTOSVariable(queueLabel, 'ESP32FreeRTOSQueue');
  generator.addObject('esp32_freertos_queue_' + queueName, 'QueueHandle_t ' + queueName + ' = NULL;');
  return queueName + ' = xQueueCreate(' + queueLength + ', sizeof(' + dataType + '));\n';
};

Arduino.forBlock['esp32_freertos_queue_send'] = function(block, generator) {
  const queueLabel = esp32FreeRTOSGetVarName(block, 'sensorQueue');
  const queueName = esp32FreeRTOSSanitizeName(queueLabel, 'sensorQueue');
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
  const queueName = esp32FreeRTOSSanitizeName(queueLabel, 'sensorQueue');
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
  const queueName = esp32FreeRTOSSanitizeName(queueLabel, 'sensorQueue');
  return ['uxQueueMessagesWaiting(' + queueName + ')', esp32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['esp32_freertos_semaphore_create'] = function(block, generator) {
  attachESP32FreeRTOSVarMonitor(block, 'ESP32FreeRTOSSemaphore', 'syncSem');
  const semaphoreLabel = esp32FreeRTOSGetInputName(block, 'syncSem');
  const semaphoreName = esp32FreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
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
  const semaphoreName = esp32FreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
  const waitTicks = esp32FreeRTOSWaitTicks(block, generator);
  return ['(xSemaphoreTake(' + semaphoreName + ', ' + waitTicks + ') == pdTRUE)', esp32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['esp32_freertos_semaphore_give'] = function(block, generator) {
  ensureESP32FreeRTOSSemaphoreLibrary(generator);
  const semaphoreLabel = esp32FreeRTOSGetVarName(block, 'syncSem');
  const semaphoreName = esp32FreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
  return 'xSemaphoreGive(' + semaphoreName + ');\n';
};

Arduino.forBlock['esp32_freertos_semaphore_give_from_isr'] = function(block, generator) {
  ensureESP32FreeRTOSSemaphoreLibrary(generator);
  const semaphoreLabel = esp32FreeRTOSGetVarName(block, 'syncSem');
  const semaphoreName = esp32FreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
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
  return ['pcTaskGetName(' + esp32FreeRTOSTaskHandleName(taskLabel) + ')', esp32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['esp32_freertos_get_current_task_name'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  return ['pcTaskGetName(NULL)', esp32FreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['esp32_freertos_get_stack_high_water_mark'] = function(block, generator) {
  ensureESP32FreeRTOSLibrary(generator);
  const taskLabel = esp32FreeRTOSGetVarName(block, 'TaskBlink');
  return ['uxTaskGetStackHighWaterMark(' + esp32FreeRTOSTaskHandleName(taskLabel) + ')', esp32FreeRTOSOrderFunctionCall(generator)];
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