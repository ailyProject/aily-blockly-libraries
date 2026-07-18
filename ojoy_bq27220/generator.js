'use strict';

// 板卡适配机制
function isESP32Core() {
  const boardConfig = window['boardConfig'];
  return boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1;
}

function getBQVarName(block) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : 'gauge';
}

Arduino.forBlock['bq27220_init'] = function(block, generator) {
  const BQ27220_TYPE = 'BQ27220';

  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    block._varLastName = block.getFieldValue('VAR') || 'gauge';
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._varLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, BQ27220_TYPE);
          block._varLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'gauge';
  // OJoy 板卡 I2C 固定：Wire, SDA=5, SCL=4 (与 RTC/IMU 共用)
  const address = block.getFieldValue('ADDRESS') || '0x55';

  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('bq27220', '#include "bq27220.h"');
  registerVariableToBlockly(varName, BQ27220_TYPE);
  generator.addObject(varName, 'BQ27220 ' + varName + ';');
  // OJoy 主 I2C 统一初始化(id 与其它 OJoy 主总线库一致 -> 自动去重, 全局只发一次)
  generator.addSetup('ojoy_i2c_wire', 'Wire.begin(5, 4, 400000); // OJoy 主I2C SDA5/SCL4 (音频/RTC/IMU/电量计共用)');

  let setupCode = varName + '.begin(&Wire, ' + address + ', 400000);\n';
  return setupCode;
};

Arduino.forBlock['bq27220_basic_read'] = function(block, generator) {
  const varName = getBQVarName(block);
  const type = block.getFieldValue('TYPE') || 'voltage';

  const methodMap = {
    'voltage': 'getVoltage',
    'current': 'getCurrent',
    'avg_current': 'getAvgCurrent',
    'temperature': 'getTemperature',
    'soc': 'getSoc'
  };

  const method = methodMap[type];
  if (method) {
    return [varName + '.' + method + '()', generator.ORDER_FUNCTION_CALL];
  }
  return ['0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['bq27220_time_read'] = function(block, generator) {
  const varName = getBQVarName(block);
  const type = block.getFieldValue('TYPE') || 'tte';

  const methodMap = {
    'tte': 'getTimeToEmpty',
    'ttf': 'getTimeToFull'
  };

  const method = methodMap[type];
  if (method) {
    return [varName + '.' + method + '()', generator.ORDER_FUNCTION_CALL];
  }
  return ['0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['bq27220_capacity_read'] = function(block, generator) {
  const varName = getBQVarName(block);
  const type = block.getFieldValue('TYPE') || 'remaining_capacity';

  const methodMap = {
    'remaining_capacity': 'getRemainingCapacity',
    'full_charge_capacity': 'getFullChargeCapacity',
    'cycle_count': 'getCycleCount',
    'soh': 'getSoh'
  };

  const method = methodMap[type];
  if (method) {
    return [varName + '.' + method + '()', generator.ORDER_FUNCTION_CALL];
  }
  return ['0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['bq27220_set_design_capacity'] = function(block, generator) {
  const varName = getBQVarName(block);
  const capacity = generator.valueToCode(block, 'CAPACITY', generator.ORDER_ATOMIC) || '3000';
  return varName + '.setDesignCapacity((uint16_t)(' + capacity + '));\n';
};
