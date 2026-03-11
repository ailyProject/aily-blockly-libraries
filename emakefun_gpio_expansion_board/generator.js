Arduino.forBlock['gpio_expansion_board_init'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'gpioBoard';
  const i2cAddr = block.getFieldValue('I2C_ADDR') || '0x24';

  generator.addLibrary('GpioExpansionBoard', '#include "gpio_expansion_board.h"');
  registerVariableToBlockly(varName, 'GpioExpansionBoard');
  generator.addVariable(varName, 'GpioExpansionBoard ' + varName + '(' + i2cAddr + ');');

  return '';
};

Arduino.forBlock['gpio_expansion_board_set_mode'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'gpioBoard';
  const pin = block.getFieldValue('PIN');
  const mode = block.getFieldValue('MODE');

  const modeNames = {
    '1': 'GpioExpansionBoard::kInputPullUp',
    '2': 'GpioExpansionBoard::kInputPullDown',
    '4': 'GpioExpansionBoard::kInputFloating',
    '8': 'GpioExpansionBoard::kOutput',
    '16': 'GpioExpansionBoard::kAdc',
    '32': 'GpioExpansionBoard::kPwm'
  };

  const pinNames = {
    '0': 'GpioExpansionBoard::kGpioPinE0',
    '1': 'GpioExpansionBoard::kGpioPinE1',
    '2': 'GpioExpansionBoard::kGpioPinE2',
    '3': 'GpioExpansionBoard::kGpioPinE3',
    '4': 'GpioExpansionBoard::kGpioPinE4',
    '5': 'GpioExpansionBoard::kGpioPinE5',
    '6': 'GpioExpansionBoard::kGpioPinE6',
    '7': 'GpioExpansionBoard::kGpioPinE7'
  };

  return varName + '.SetGpioMode(' + pinNames[pin] + ', ' + modeNames[mode] + ');\n';
};

Arduino.forBlock['gpio_expansion_board_set_level'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'gpioBoard';
  const pin = block.getFieldValue('PIN');
  const level = block.getFieldValue('LEVEL');

  const pinNames = {
    '0': 'GpioExpansionBoard::kGpioPinE0',
    '1': 'GpioExpansionBoard::kGpioPinE1',
    '2': 'GpioExpansionBoard::kGpioPinE2',
    '3': 'GpioExpansionBoard::kGpioPinE3',
    '4': 'GpioExpansionBoard::kGpioPinE4',
    '5': 'GpioExpansionBoard::kGpioPinE5',
    '6': 'GpioExpansionBoard::kGpioPinE6',
    '7': 'GpioExpansionBoard::kGpioPinE7'
  };

  return varName + '.SetGpioLevel(' + pinNames[pin] + ', ' + level + ');\n';
};

Arduino.forBlock['gpio_expansion_board_get_level'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'gpioBoard';
  const pin = block.getFieldValue('PIN');

  const pinNames = {
    '0': 'GpioExpansionBoard::kGpioPinE0',
    '1': 'GpioExpansionBoard::kGpioPinE1',
    '2': 'GpioExpansionBoard::kGpioPinE2',
    '3': 'GpioExpansionBoard::kGpioPinE3',
    '4': 'GpioExpansionBoard::kGpioPinE4',
    '5': 'GpioExpansionBoard::kGpioPinE5',
    '6': 'GpioExpansionBoard::kGpioPinE6',
    '7': 'GpioExpansionBoard::kGpioPinE7'
  };

  return [varName + '.GetGpioLevel(' + pinNames[pin] + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['gpio_expansion_board_get_adc'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'gpioBoard';
  const pin = block.getFieldValue('PIN');

  const pinNames = {
    '0': 'GpioExpansionBoard::kGpioPinE0',
    '1': 'GpioExpansionBoard::kGpioPinE1',
    '2': 'GpioExpansionBoard::kGpioPinE2',
    '3': 'GpioExpansionBoard::kGpioPinE3',
    '4': 'GpioExpansionBoard::kGpioPinE4',
    '5': 'GpioExpansionBoard::kGpioPinE5',
    '6': 'GpioExpansionBoard::kGpioPinE6',
    '7': 'GpioExpansionBoard::kGpioPinE7'
  };

  return [varName + '.GetGpioAdcValue(' + pinNames[pin] + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['gpio_expansion_board_set_pwm_frequency'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'gpioBoard';
  const frequency = generator.valueToCode(block, 'FREQUENCY', generator.ORDER_ATOMIC) || '50';

  return varName + '.SetPwmFrequency(' + frequency + ');\n';
};

Arduino.forBlock['gpio_expansion_board_set_pwm_duty'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'gpioBoard';
  const pin = block.getFieldValue('PIN');
  const duty = generator.valueToCode(block, 'DUTY', generator.ORDER_ATOMIC) || '0';

  const pinNames = {
    '1': 'GpioExpansionBoard::kGpioPinE1',
    '2': 'GpioExpansionBoard::kGpioPinE2'
  };

  return varName + '.SetPwmDuty(' + pinNames[pin] + ', ' + duty + ');\n';
};

Arduino.forBlock['gpio_expansion_board_set_servo_angle'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'gpioBoard';
  const pin = block.getFieldValue('PIN');
  const angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_ATOMIC) || '0';

  const pinNames = {
    '1': 'GpioExpansionBoard::kGpioPinE1',
    '2': 'GpioExpansionBoard::kGpioPinE2'
  };

  return varName + '.SetServoAngle(' + pinNames[pin] + ', ' + angle + ');\n';
};
