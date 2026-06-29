function seeedFreeRTOSOrderAtomic(generator) {
  return generator.ORDER_ATOMIC || Arduino.ORDER_ATOMIC;
}

function seeedFreeRTOSOrderFunctionCall(generator) {
  return generator.ORDER_FUNCTION_CALL || Arduino.ORDER_FUNCTION_CALL;
}

function seeedFreeRTOSSanitizeName(name, fallback) {
  const source = String(name || fallback || 'item');
  let sanitized = source.replace(/[^A-Za-z0-9_]/g, '_');
  if (!/^[A-Za-z_]/.test(sanitized)) {
    sanitized = '_' + sanitized;
  }
  return sanitized;
}

function seeedFreeRTOSEscapeString(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function seeedFreeRTOSGetInputName(block, fallback) {
  return block.getFieldValue('VAR') || fallback;
}

function seeedFreeRTOSGetVarName(block, fallback) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : fallback;
}

function seeedFreeRTOSTaskHandleName(taskName) {
  return seeedFreeRTOSSanitizeName(taskName, 'Task') + 'Handle';
}

function seeedFreeRTOSPriorityExpression(priority) {
  const priorityValue = String(priority || '0');
  if (priorityValue === '0') {
    return 'tskIDLE_PRIORITY';
  }
  return 'tskIDLE_PRIORITY + ' + priorityValue;
}

function seeedFreeRTOSWaitTicks(block, generator) {
  const waitMode = block.getFieldValue('WAIT_MODE') || 'MS';
  if (waitMode === 'FOREVER') {
    return 'portMAX_DELAY';
  }
  const waitMs = generator.valueToCode(block, 'WAIT_MS', seeedFreeRTOSOrderAtomic(generator)) || '0';
  return 'pdMS_TO_TICKS(' + waitMs + ')';
}

function ensureSeeedFreeRTOSLibrary(generator) {
  const boardConfig = typeof window !== 'undefined' ? window['boardConfig'] : null;
  if (boardConfig && boardConfig.core && boardConfig.core.indexOf('samd') === -1) {
    // Seeed_Arduino_FreeRTOS is documented for Seeed/Arduino SAMD boards.
  }
  generator.addLibrary('SeeedArduinoFreeRTOS', '#include <Seeed_Arduino_FreeRTOS.h>');
}

function ensureSeeedFreeRTOSSchedulerStart(generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  generator.addSetupEnd('seeed_freertos_startup_delay', 'vNopDelayMS(1000);');
  generator.addSetupEnd('seeed_freertos_start_scheduler', 'vTaskStartScheduler();');
}

function ensureSeeedFreeRTOSTinyUSB(generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  generator.addLibrary(
    'SeeedArduinoFreeRTOSTinyUSB',
    '#if defined(USE_TINYUSB)\n#include <Adafruit_TinyUSB.h>\nextern void tinyusb_task();\n#endif'
  );
}

function ensureSerialBeginForSeeedFreeRTOS(generator, serial, baud) {
  generator.addSetupBegin('seeed_freertos_error_serial_begin_' + serial, serial + '.begin(' + baud + ');');
}

function registerSeeedFreeRTOSVariable(varName, varType) {
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(varName, varType);
  }
}

function attachSeeedFreeRTOSVarMonitor(block, varType, fallback) {
  if (!block._seeedFreeRTOSVarMonitorAttached) {
    block._seeedFreeRTOSVarMonitorAttached = true;
    block._seeedFreeRTOSVarLastName = block.getFieldValue('VAR') || fallback;
    registerSeeedFreeRTOSVariable(block._seeedFreeRTOSVarLastName, varType);
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._seeedFreeRTOSVarLastName;
        if (workspace && newName && newName !== oldName && typeof renameVariableInBlockly === 'function') {
          renameVariableInBlockly(block, oldName, newName, varType);
          block._seeedFreeRTOSVarLastName = newName;
        }
      };
    }
  }
}

Arduino.forBlock['seeed_freertos_task_create'] = function(block, generator) {
  attachSeeedFreeRTOSVarMonitor(block, 'SeeedFreeRTOSTask', 'TaskBlink');
  const taskLabel = seeedFreeRTOSGetInputName(block, 'TaskBlink');
  const taskName = seeedFreeRTOSSanitizeName(taskLabel, 'TaskBlink');
  const stackSize = block.getFieldValue('STACK_SIZE') || '256';
  const priority = seeedFreeRTOSPriorityExpression(block.getFieldValue('PRIORITY'));
  const handleName = seeedFreeRTOSTaskHandleName(taskLabel);

  ensureSeeedFreeRTOSSchedulerStart(generator);
  registerSeeedFreeRTOSVariable(taskLabel, 'SeeedFreeRTOSTask');
  generator.addObject('seeed_freertos_task_handle_' + taskName, 'TaskHandle_t ' + handleName + ' = NULL;');
  generator.addFunction('seeed_freertos_task_prototype_' + taskName, 'void ' + taskName + '(void *pvParameters);');

  return 'xTaskCreate(\n' +
    '  ' + taskName + ',\n' +
    '  "' + seeedFreeRTOSEscapeString(taskLabel) + '",\n' +
    '  ' + stackSize + ',\n' +
    '  NULL,\n' +
    '  ' + priority + ',\n' +
    '  &' + handleName + '\n' +
    ');\n';
};

Arduino.forBlock['seeed_freertos_task_function'] = function(block, generator) {
  const taskLabel = seeedFreeRTOSGetVarName(block, 'TaskBlink');
  const taskName = seeedFreeRTOSSanitizeName(taskLabel, 'TaskBlink');
  const taskCode = generator.statementToCode(block, 'TASK_CODE') || '';

  ensureSeeedFreeRTOSLibrary(generator);
  const functionDef = 'void ' + taskName + '(void *pvParameters) {\n' +
    '  (void) pvParameters;\n\n' +
    '  for (;;) {\n' +
    taskCode +
    '  }\n' +
    '}\n';
  generator.addFunction('seeed_freertos_task_function_' + taskName, functionDef);
  return '';
};

Arduino.forBlock['seeed_freertos_start_scheduler'] = function(block, generator) {
  ensureSeeedFreeRTOSSchedulerStart(generator);
  return '';
};

Arduino.forBlock['seeed_freertos_start_tinyusb_task'] = function(block, generator) {
  ensureSeeedFreeRTOSTinyUSB(generator);
  return '#if defined(USE_TINYUSB)\n' +
    'tinyusb_task();\n' +
    '#endif\n';
};

Arduino.forBlock['seeed_freertos_task_delay_ms'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  const ms = generator.valueToCode(block, 'MS', seeedFreeRTOSOrderAtomic(generator)) || '1000';
  return 'vTaskDelay(pdMS_TO_TICKS(' + ms + '));\n';
};

Arduino.forBlock['seeed_freertos_task_delay_ticks'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  const ticks = generator.valueToCode(block, 'TICKS', seeedFreeRTOSOrderAtomic(generator)) || '1';
  return 'vTaskDelay(' + ticks + ');\n';
};

Arduino.forBlock['seeed_freertos_nop_delay_ms'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  const ms = generator.valueToCode(block, 'MS', seeedFreeRTOSOrderAtomic(generator)) || '1000';
  return 'vNopDelayMS(' + ms + ');\n';
};

Arduino.forBlock['seeed_freertos_task_suspend'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  const taskLabel = seeedFreeRTOSGetVarName(block, 'TaskBlink');
  return 'vTaskSuspend(' + seeedFreeRTOSTaskHandleName(taskLabel) + ');\n';
};

Arduino.forBlock['seeed_freertos_task_resume'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  const taskLabel = seeedFreeRTOSGetVarName(block, 'TaskBlink');
  return 'vTaskResume(' + seeedFreeRTOSTaskHandleName(taskLabel) + ');\n';
};

Arduino.forBlock['seeed_freertos_task_delete'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  const taskLabel = seeedFreeRTOSGetVarName(block, 'TaskBlink');
  const handleName = seeedFreeRTOSTaskHandleName(taskLabel);
  return 'vTaskDelete(' + handleName + ');\n' + handleName + ' = NULL;\n';
};

Arduino.forBlock['seeed_freertos_task_delete_current'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  return 'vTaskDelete(NULL);\n';
};

Arduino.forBlock['seeed_freertos_task_notify'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  const taskLabel = seeedFreeRTOSGetVarName(block, 'TaskBlink');
  return 'xTaskNotifyGive(' + seeedFreeRTOSTaskHandleName(taskLabel) + ');\n';
};

Arduino.forBlock['seeed_freertos_task_notify_from_isr'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  const taskLabel = seeedFreeRTOSGetVarName(block, 'TaskBlink');
  const handleName = seeedFreeRTOSTaskHandleName(taskLabel);
  return '{\n' +
    '  BaseType_t xHigherPriorityTaskWoken = pdFALSE;\n' +
    '  vTaskNotifyGiveFromISR(' + handleName + ', &xHigherPriorityTaskWoken);\n' +
    '  portYIELD_FROM_ISR(xHigherPriorityTaskWoken);\n' +
    '}\n';
};

Arduino.forBlock['seeed_freertos_task_wait_notification'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  const waitTicks = seeedFreeRTOSWaitTicks(block, generator);
  return ['(ulTaskNotifyTake(pdTRUE, ' + waitTicks + ') > 0)', seeedFreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['seeed_freertos_queue_create'] = function(block, generator) {
  attachSeeedFreeRTOSVarMonitor(block, 'SeeedFreeRTOSQueue', 'sensorQueue');
  const queueLabel = seeedFreeRTOSGetInputName(block, 'sensorQueue');
  const queueName = seeedFreeRTOSSanitizeName(queueLabel, 'sensorQueue');
  const queueLength = block.getFieldValue('QUEUE_LENGTH') || '10';
  const dataType = block.getFieldValue('DATA_TYPE') || 'int';

  ensureSeeedFreeRTOSLibrary(generator);
  registerSeeedFreeRTOSVariable(queueLabel, 'SeeedFreeRTOSQueue');
  generator.addObject('seeed_freertos_queue_' + queueName, 'QueueHandle_t ' + queueName + ' = NULL;');
  return queueName + ' = xQueueCreate(' + queueLength + ', sizeof(' + dataType + '));\n';
};

Arduino.forBlock['seeed_freertos_queue_send'] = function(block, generator) {
  const queueLabel = seeedFreeRTOSGetVarName(block, 'sensorQueue');
  const queueName = seeedFreeRTOSSanitizeName(queueLabel, 'sensorQueue');
  const dataType = block.getFieldValue('DATA_TYPE') || 'int';
  const data = generator.valueToCode(block, 'DATA', seeedFreeRTOSOrderAtomic(generator)) || '0';
  const waitTicks = seeedFreeRTOSWaitTicks(block, generator);
  const tempName = 'seeedFreeRTOSQueueItem_' + queueName;

  ensureSeeedFreeRTOSLibrary(generator);
  return '{\n' +
    '  ' + dataType + ' ' + tempName + ' = ' + data + ';\n' +
    '  xQueueSend(' + queueName + ', &' + tempName + ', ' + waitTicks + ');\n' +
    '}\n';
};

Arduino.forBlock['seeed_freertos_queue_receive_do'] = function(block, generator) {
  const queueLabel = seeedFreeRTOSGetVarName(block, 'sensorQueue');
  const queueName = seeedFreeRTOSSanitizeName(queueLabel, 'sensorQueue');
  const dataType = block.getFieldValue('DATA_TYPE') || 'int';
  const itemName = seeedFreeRTOSSanitizeName(block.getFieldValue('ITEM_VAR'), 'queueValue');
  const waitTicks = seeedFreeRTOSWaitTicks(block, generator);
  const handlerCode = generator.statementToCode(block, 'HANDLER') || '';

  ensureSeeedFreeRTOSLibrary(generator);
  return '{\n' +
    '  ' + dataType + ' ' + itemName + ';\n' +
    '  if (xQueueReceive(' + queueName + ', &' + itemName + ', ' + waitTicks + ') == pdPASS) {\n' +
    handlerCode +
    '  }\n' +
    '}\n';
};

Arduino.forBlock['seeed_freertos_queue_messages_waiting'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  const queueLabel = seeedFreeRTOSGetVarName(block, 'sensorQueue');
  const queueName = seeedFreeRTOSSanitizeName(queueLabel, 'sensorQueue');
  return ['uxQueueMessagesWaiting(' + queueName + ')', seeedFreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['seeed_freertos_semaphore_create'] = function(block, generator) {
  attachSeeedFreeRTOSVarMonitor(block, 'SeeedFreeRTOSSemaphore', 'syncSem');
  const semaphoreLabel = seeedFreeRTOSGetInputName(block, 'syncSem');
  const semaphoreName = seeedFreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
  const semaphoreType = block.getFieldValue('SEMAPHORE_TYPE') || 'BINARY';
  const maxCount = block.getFieldValue('MAX_COUNT') || '10';
  const initialCount = block.getFieldValue('INITIAL_COUNT') || '0';

  ensureSeeedFreeRTOSLibrary(generator);
  registerSeeedFreeRTOSVariable(semaphoreLabel, 'SeeedFreeRTOSSemaphore');
  generator.addObject('seeed_freertos_semaphore_' + semaphoreName, 'SemaphoreHandle_t ' + semaphoreName + ' = NULL;');

  if (semaphoreType === 'MUTEX') {
    return semaphoreName + ' = xSemaphoreCreateMutex();\n';
  }
  if (semaphoreType === 'COUNTING') {
    return semaphoreName + ' = xSemaphoreCreateCounting(' + maxCount + ', ' + initialCount + ');\n';
  }
  return semaphoreName + ' = xSemaphoreCreateBinary();\n';
};

Arduino.forBlock['seeed_freertos_semaphore_take'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  const semaphoreLabel = seeedFreeRTOSGetVarName(block, 'syncSem');
  const semaphoreName = seeedFreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
  const waitTicks = seeedFreeRTOSWaitTicks(block, generator);
  return ['(xSemaphoreTake(' + semaphoreName + ', ' + waitTicks + ') == pdTRUE)', seeedFreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['seeed_freertos_semaphore_give'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  const semaphoreLabel = seeedFreeRTOSGetVarName(block, 'syncSem');
  const semaphoreName = seeedFreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
  return 'xSemaphoreGive(' + semaphoreName + ');\n';
};

Arduino.forBlock['seeed_freertos_semaphore_give_from_isr'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  const semaphoreLabel = seeedFreeRTOSGetVarName(block, 'syncSem');
  const semaphoreName = seeedFreeRTOSSanitizeName(semaphoreLabel, 'syncSem');
  return '{\n' +
    '  BaseType_t xHigherPriorityTaskWoken = pdFALSE;\n' +
    '  xSemaphoreGiveFromISR(' + semaphoreName + ', &xHigherPriorityTaskWoken);\n' +
    '  portYIELD_FROM_ISR(xHigherPriorityTaskWoken);\n' +
    '}\n';
};

Arduino.forBlock['seeed_freertos_attach_interrupt'] = function(block, generator) {
  const pin = block.getFieldValue('PIN') || '2';
  const mode = block.getFieldValue('MODE') || 'LOW';
  const functionName = 'seeedFreeRTOSInterruptPin' + seeedFreeRTOSSanitizeName(pin, '2');
  const isrCode = generator.statementToCode(block, 'ISR_CODE') || '';

  ensureSeeedFreeRTOSLibrary(generator);
  generator.addFunction('seeed_freertos_interrupt_' + pin, 'void ' + functionName + '() {\n' + isrCode + '}\n');
  generator.addSetupBegin('seeed_freertos_interrupt_pin_mode_' + pin, 'pinMode(' + pin + ', INPUT_PULLUP);');
  generator.addSetupBegin('seeed_freertos_attach_interrupt_' + pin, 'attachInterrupt(digitalPinToInterrupt(' + pin + '), ' + functionName + ', ' + mode + ');');
  return '';
};

Arduino.forBlock['seeed_freertos_set_error_serial'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  const serial = block.getFieldValue('SERIAL') || 'Serial';
  const baud = block.getFieldValue('BAUD') || '115200';
  ensureSerialBeginForSeeedFreeRTOS(generator, serial, baud);
  return 'vSetErrorSerial(&' + serial + ');\n';
};

Arduino.forBlock['seeed_freertos_set_error_led'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  const pin = block.getFieldValue('PIN') || '13';
  const activeState = block.getFieldValue('ACTIVE_STATE') || 'HIGH';
  return 'vSetErrorLed(' + pin + ', ' + activeState + ');\n';
};

Arduino.forBlock['seeed_freertos_get_tick_count'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  return ['xTaskGetTickCount()', seeedFreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['seeed_freertos_get_task_count'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  return ['uxTaskGetNumberOfTasks()', seeedFreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['seeed_freertos_get_task_name'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  const taskLabel = seeedFreeRTOSGetVarName(block, 'TaskBlink');
  return ['pcTaskGetName(' + seeedFreeRTOSTaskHandleName(taskLabel) + ')', seeedFreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['seeed_freertos_get_current_task_name'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  return ['pcTaskGetName(NULL)', seeedFreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['seeed_freertos_get_stack_high_water_mark'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  const taskLabel = seeedFreeRTOSGetVarName(block, 'TaskBlink');
  return ['uxTaskGetStackHighWaterMark(' + seeedFreeRTOSTaskHandleName(taskLabel) + ')', seeedFreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['seeed_freertos_get_idle_stack_high_water_mark'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  return ['uxTaskGetStackHighWaterMark(xTaskGetIdleTaskHandle())', seeedFreeRTOSOrderFunctionCall(generator)];
};

Arduino.forBlock['seeed_freertos_get_free_heap_size'] = function(block, generator) {
  ensureSeeedFreeRTOSLibrary(generator);
  return ['xPortGetFreeHeapSize()', seeedFreeRTOSOrderFunctionCall(generator)];
};
