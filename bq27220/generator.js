'use strict';

// 板卡适配机制
function isESP32Core() {
  const boardConfig = window['boardConfig'];
  return boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1;
}

// I2C 引脚按板卡选：aily_iic 设过的自定义引脚 > 板卡 batteryConfig（BQ27220）> 板卡 i2cPins > 默认引脚。
// 放在 setup 最前面；别的库先放了不带引脚的 begin() 时换掉它
function bq27220WireBegin(generator, wire) {
  let pins = null;
  try {
    const board = window['boardConfig'] || {};
    const custom = window['customI2CPins'] && window['customI2CPins'][wire];
    const cfg = board.batteryConfig;
    const pick = list => {
      const sda = list && list.find(p => p[0] === 'SDA');
      const scl = list && list.find(p => p[0] === 'SCL');
      return sda && scl ? { sda: sda[1], scl: scl[1] } : null;
    };
    if (custom) pins = pick(custom);
    else if (wire === 'Wire' && cfg && /^bq27220$/i.test(String(cfg.gauge || '')) && cfg.pins && cfg.pins.sda != null && cfg.pins.scl != null) {
      pins = { sda: cfg.pins.sda, scl: cfg.pins.scl };
    } else pins = pick(board.i2cPins && board.i2cPins[wire]);
    if (!isESP32Core()) pins = null;
  } catch (e) {
    pins = null;
  }
  const key = 'wire_' + wire + '_begin';
  const code = pins ? wire + '.begin(' + pins.sda + ', ' + pins.scl + ');' : wire + '.begin();';
  let old = null;
  try {
    old = generator.codeDict.setups_begin[key];
  } catch (e) {}
  generator.addSetupBegin(key, code, !!(pins && old && /\.begin\(\s*\)/.test(old)));
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
  const wire = block.getFieldValue('WIRE') || 'Wire';
  const address = block.getFieldValue('ADDRESS') || '0x55';

  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('bq27220', '#include "bq27220.h"');
  registerVariableToBlockly(varName, BQ27220_TYPE);
  generator.addObject(varName, 'BQ27220 ' + varName + ';');
  bq27220WireBegin(generator, wire);
  ensureSerialBegin('Serial', generator);

  let setupCode = varName + '.begin(&' + wire + ', ' + address + ', 400000);\n';
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

// 电压法电量：电量计没有标定时它自己的 SOC 不准（比如智盒板 IBox S31），按电压估算。
// 每个电量计变量一份状态，loop 开头每 100ms 采一次：EMA 平滑（约 1s）→ 单节锂电池放电曲线 → 2% 迟滞；
// 平滑电压低于 3.3V 连续约 3s 算"该关机了"
function ensureBQEstimate(block, generator) {
  const varName = getBQVarName(block);
  generator.addVariable('bq27220_estimate_type', [
    'struct BQ27220Estimate {',
    '  float avg = 0;',
    '  int pct = -1;',
    '  int lowCount = 0;',
    '  uint32_t at = 0;',
    '  bool sampled = false;',
    '};',
  ].join('\n'));
  generator.addVariable(varName + '_estimate', 'BQ27220Estimate ' + varName + '_estimate;');
  generator.addFunction('bq27220_estimate_update', [
    'void bq27220_estimate_update(BQ27220 &gauge, BQ27220Estimate &e) {',
    '  const uint32_t now = millis();',
    '  if (e.sampled && (uint32_t)(now - e.at) < 100) return;',
    '  e.at = now;',
    '  e.sampled = true;',
    '  const int mv = gauge.getVoltage();',
    '  if (mv > 0) e.avg = e.avg == 0 ? (float)mv : e.avg + ((float)mv - e.avg) * 0.1f;',
    '  const int smooth = (int)(e.avg + 0.5f);',
    '  if (smooth <= 0) return;',
    '  static const int V[] = {3300, 3600, 3700, 3750, 3800, 3850, 3900, 3950, 4000, 4100, 4200};',
    '  static const int P[] = {0, 12, 28, 38, 50, 60, 68, 75, 83, 92, 100};',
    '  int pct = smooth >= V[10] ? 100 : 0;',
    '  for (int i = 1; i < 11 && smooth > V[0] && smooth < V[10]; i++) {',
    '    if (smooth < V[i]) {',
    '      pct = P[i - 1] + (P[i] - P[i - 1]) * (smooth - V[i - 1]) / (V[i] - V[i - 1]);',
    '      break;',
    '    }',
    '  }',
    '  if (e.pct < 0 || pct >= e.pct + 2 || pct <= e.pct - 2) e.pct = pct;',
    '  if (smooth < 3300) {',
    '    if (e.lowCount < 30) e.lowCount++;',
    '  } else {',
    '    e.lowCount = 0;',
    '  }',
    '}',
  ].join('\n'));
  generator.addLoopBegin(varName + '_estimate_update', 'bq27220_estimate_update(' + varName + ', ' + varName + '_estimate);\n');
  return varName;
}

Arduino.forBlock['bq27220_voltage_percent'] = function(block, generator) {
  const varName = ensureBQEstimate(block, generator);
  generator.addFunction('bq27220_voltage_percent', [
    'int bq27220_voltage_percent(BQ27220 &gauge, BQ27220Estimate &e) {',
    '  bq27220_estimate_update(gauge, e);',
    '  return e.pct < 0 ? 0 : e.pct;',
    '}',
  ].join('\n'));
  return ['bq27220_voltage_percent(' + varName + ', ' + varName + '_estimate)', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bq27220_battery_state'] = function(block, generator) {
  const varName = ensureBQEstimate(block, generator);
  generator.addFunction('bq27220_battery_low', [
    'bool bq27220_battery_low(BQ27220 &gauge, BQ27220Estimate &e) {',
    '  bq27220_estimate_update(gauge, e);',
    '  return e.pct >= 0 && e.pct <= 10;',
    '}',
  ].join('\n'));
  generator.addFunction('bq27220_should_shutdown', [
    'bool bq27220_should_shutdown(BQ27220 &gauge, BQ27220Estimate &e) {',
    '  bq27220_estimate_update(gauge, e);',
    '  return e.lowCount >= 30;',
    '}',
  ].join('\n'));
  const fn = block.getFieldValue('STATE') === 'SHUTDOWN' ? 'bq27220_should_shutdown' : 'bq27220_battery_low';
  return [fn + '(' + varName + ', ' + varName + '_estimate)', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bq27220_deep_sleep'] = function(block, generator) {
  generator.addLibrary('esp_sleep', '#include <esp_sleep.h>');
  return 'Serial.flush();\nesp_deep_sleep_start();\n';
};
