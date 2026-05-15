/**
 * Grove Motor Driver TB6612FNG - Blockly Code Generator
 * SeeedStudio Grove I2C Motor Driver
 */

// Ensure required libraries are included
function ensureTB6612FNGLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('TB6612FNG', '#include "Grove_Motor_Driver_TB6612FNG.h"');
}

// === Init Block ===
Arduino.forBlock['tb6612fng_init'] = function(block, generator) {
  var varName = block.getFieldValue('VAR') || 'motor';
  var addr = block.getFieldValue('ADDR') || '0x14';

  // Variable rename listener
  if (!block._varMonitorAttached) {
    block._varMonitorAttached = true;
    var field = block.getField('VAR');
    if (field) {
      var oldValue = varName;
      field.setValidator(function(newValue) {
        if (newValue !== oldValue) {
          renameVariableInBlockly(block, oldValue, newValue, 'MotorDriver');
          oldValue = newValue;
        }
        return newValue;
      });
    }
  }

  // Register variable
  registerVariableToBlockly(varName, 'MotorDriver');

  ensureTB6612FNGLib(generator);

  // Declare object
  generator.addObject(varName, 'MotorDriver ' + varName + ';');

  // Init in setup
  generator.addSetupBegin(varName + '_wire', 'Wire.begin();');
  generator.addSetupBegin(varName + '_init', varName + '.init(' + addr + ');');

  return '';
};

// === DC Motor Run ===
Arduino.forBlock['tb6612fng_dc_run'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var channel = block.getFieldValue('CHANNEL') || 'MOTOR_CHA';
  var speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '0';

  ensureTB6612FNGLib(generator);

  return varName + '.dcMotorRun(' + channel + ', ' + speed + ');\n';
};

// === DC Motor Brake ===
Arduino.forBlock['tb6612fng_dc_brake'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var channel = block.getFieldValue('CHANNEL') || 'MOTOR_CHA';

  ensureTB6612FNGLib(generator);

  return varName + '.dcMotorBrake(' + channel + ');\n';
};

// === DC Motor Stop ===
Arduino.forBlock['tb6612fng_dc_stop'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var channel = block.getFieldValue('CHANNEL') || 'MOTOR_CHA';

  ensureTB6612FNGLib(generator);

  return varName + '.dcMotorStop(' + channel + ');\n';
};

// === Stepper Run ===
Arduino.forBlock['tb6612fng_stepper_run'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var mode = block.getFieldValue('MODE') || 'FULL_STEP';
  var steps = generator.valueToCode(block, 'STEPS', generator.ORDER_ATOMIC) || '200';
  var rpm = generator.valueToCode(block, 'RPM', generator.ORDER_ATOMIC) || '120';

  ensureTB6612FNGLib(generator);

  return varName + '.stepperRun(' + mode + ', ' + steps + ', ' + rpm + ');\n';
};

// === Stepper Stop ===
Arduino.forBlock['tb6612fng_stepper_stop'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';

  ensureTB6612FNGLib(generator);

  return varName + '.stepperStop();\n';
};

// === Stepper Keep Run ===
Arduino.forBlock['tb6612fng_stepper_keep_run'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';
  var mode = block.getFieldValue('MODE') || 'FULL_STEP';
  var rpm = generator.valueToCode(block, 'RPM', generator.ORDER_ATOMIC) || '120';
  var dir = block.getFieldValue('DIR') || 'true';

  ensureTB6612FNGLib(generator);

  return varName + '.stepperKeepRun(' + mode + ', ' + rpm + ', ' + dir + ');\n';
};

// === Standby ===
Arduino.forBlock['tb6612fng_standby'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';

  ensureTB6612FNGLib(generator);

  return varName + '.standby();\n';
};

// === Not Standby ===
Arduino.forBlock['tb6612fng_not_standby'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'motor';

  ensureTB6612FNGLib(generator);

  return varName + '.notStandby();\n';
};
