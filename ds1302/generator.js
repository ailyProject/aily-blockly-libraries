/**
 * DS1302 RTC Library Generator for Aily Blockly
 * Based on msparks/arduino-ds1302 library
 */

// DS1302 Setup - Initialize the RTC module
Arduino.forBlock['ds1302_setup'] = function(block, generator) {
  // Set up variable rename listener
  if (!block._ds1302VarMonitorAttached) {
    block._ds1302VarMonitorAttached = true;
    block._ds1302VarLastName = block.getFieldValue('VAR') || 'rtc';
    registerVariableToBlockly(block._ds1302VarLastName, 'DS1302');
    
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._ds1302VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'DS1302');
          block._ds1302VarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'rtc';
  const cePin = generator.valueToCode(block, 'CE_PIN', generator.ORDER_ATOMIC) || '5';
  const ioPin = generator.valueToCode(block, 'IO_PIN', generator.ORDER_ATOMIC) || '6';
  const sclkPin = generator.valueToCode(block, 'SCLK_PIN', generator.ORDER_ATOMIC) || '7';

  // Add library and variable
  generator.addLibrary('DS1302', '#include <DS1302.h>');
  generator.addVariable(varName, 'DS1302 ' + varName + '(' + cePin + ', ' + ioPin + ', ' + sclkPin + ');');

  return '';
};

// DS1302 Set Write Protect
Arduino.forBlock['ds1302_set_write_protect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'rtc';
  const enable = block.getFieldValue('ENABLE') === 'TRUE';

  return varName + '.writeProtect(' + (enable ? 'true' : 'false') + ');\n';
};

// DS1302 Set Halt
Arduino.forBlock['ds1302_set_halt'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'rtc';
  const halt = block.getFieldValue('HALT') === 'TRUE';

  return varName + '.halt(' + (halt ? 'true' : 'false') + ');\n';
};

// DS1302 Get Time
Arduino.forBlock['ds1302_get_time'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'rtc';

  generator.addLibrary('DS1302', '#include <DS1302.h>');
  
  return [varName + '.time()', generator.ORDER_ATOMIC];
};

// DS1302 Set Time
Arduino.forBlock['ds1302_set_time'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'rtc';
  
  const year = generator.valueToCode(block, 'YEAR', generator.ORDER_ATOMIC) || '2024';
  const month = generator.valueToCode(block, 'MONTH', generator.ORDER_ATOMIC) || '1';
  const day = generator.valueToCode(block, 'DAY', generator.ORDER_ATOMIC) || '1';
  const hour = generator.valueToCode(block, 'HOUR', generator.ORDER_ATOMIC) || '0';
  const minute = generator.valueToCode(block, 'MINUTE', generator.ORDER_ATOMIC) || '0';
  const second = generator.valueToCode(block, 'SECOND', generator.ORDER_ATOMIC) || '0';
  const weekday = generator.valueToCode(block, 'WEEKDAY', generator.ORDER_ATOMIC) || '1';

  const timeVarName = 'time_' + varName;
  const code = 'Time ' + timeVarName + '(' + year + ', ' + month + ', ' + day + ', ' + hour + ', ' + minute + ', ' + second + ', (Time::Day)' + weekday + ');\n' +
               varName + '.time(' + timeVarName + ');\n';
  
  return code;
};

// Time Get Year
Arduino.forBlock['ds1302_get_year'] = function(block, generator) {
  const time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || 'Time(2099, 1, 1, 0, 0, 0, Time::kSunday)';
  
  return [time + '.yr', generator.ORDER_ATOMIC];
};

// Time Get Month
Arduino.forBlock['ds1302_get_month'] = function(block, generator) {
  const time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || 'Time(2099, 1, 1, 0, 0, 0, Time::kSunday)';
  
  return [time + '.mon', generator.ORDER_ATOMIC];
};

// Time Get Day
Arduino.forBlock['ds1302_get_day'] = function(block, generator) {
  const time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || 'Time(2099, 1, 1, 0, 0, 0, Time::kSunday)';
  
  return [time + '.date', generator.ORDER_ATOMIC];
};

// Time Get Hour
Arduino.forBlock['ds1302_get_hour'] = function(block, generator) {
  const time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || 'Time(2099, 1, 1, 0, 0, 0, Time::kSunday)';
  
  return [time + '.hr', generator.ORDER_ATOMIC];
};

// Time Get Minute
Arduino.forBlock['ds1302_get_minute'] = function(block, generator) {
  const time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || 'Time(2099, 1, 1, 0, 0, 0, Time::kSunday)';
  
  return [time + '.min', generator.ORDER_ATOMIC];
};

// Time Get Second
Arduino.forBlock['ds1302_get_second'] = function(block, generator) {
  const time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || 'Time(2099, 1, 1, 0, 0, 0, Time::kSunday)';
  
  return [time + '.sec', generator.ORDER_ATOMIC];
};

// Time Get Weekday
Arduino.forBlock['ds1302_get_weekday'] = function(block, generator) {
  const time = generator.valueToCode(block, 'TIME', generator.ORDER_ATOMIC) || 'Time(2099, 1, 1, 0, 0, 0, Time::kSunday)';
  
  return [time + '.day', generator.ORDER_ATOMIC];
};

// DS1302 Write RAM
Arduino.forBlock['ds1302_write_ram'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'rtc';
  
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';

  return varName + '.writeRam(' + address + ', ' + value + ');\n';
};

// DS1302 Read RAM
Arduino.forBlock['ds1302_read_ram'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'rtc';
  
  const address = generator.valueToCode(block, 'ADDRESS', generator.ORDER_ATOMIC) || '0';

  return [varName + '.readRam(' + address + ')', generator.ORDER_ATOMIC];
};
