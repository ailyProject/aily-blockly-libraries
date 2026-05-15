// ADS1115 16位ADC generator.js

Arduino.forBlock['ads1115_init'] = function(block, generator) {
  generator.addLibrary('ADS1115_H', '#include <ADS1115.h>\n#include <Wire.h>');
  generator.addVariable('ads1115_adc', 'ADS1115<TwoWire> ads1115_adc(Wire);');
  var address = block.getFieldValue('ADDRESS') || 'ADS1115_GND_ADDRESS';
  return 'Wire.begin();\nads1115_adc.begin(' + address + ');\n';
};

Arduino.forBlock['ads1115_set_gain'] = function(block, generator) {
  generator.addLibrary('ADS1115_H', '#include <ADS1115.h>\n#include <Wire.h>');
  generator.addVariable('ads1115_adc', 'ADS1115<TwoWire> ads1115_adc(Wire);');
  var gain = block.getFieldValue('GAIN') || 'ADS1115_PGA_2_048';
  return 'ads1115_adc.setPGAGain(' + gain + ');\n';
};

Arduino.forBlock['ads1115_read_raw'] = function(block, generator) {
  generator.addLibrary('ADS1115_H', '#include <ADS1115.h>\n#include <Wire.h>');
  generator.addVariable('ads1115_adc', 'ADS1115<TwoWire> ads1115_adc(Wire);');
  var channel = block.getFieldValue('CHANNEL') || 'channel0';
  return ['ads1115_adc.getConversionResults(' + channel + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['ads1115_read_voltage'] = function(block, generator) {
  generator.addLibrary('ADS1115_H', '#include <ADS1115.h>\n#include <Wire.h>');
  generator.addVariable('ads1115_adc', 'ADS1115<TwoWire> ads1115_adc(Wire);');
  var channel = block.getFieldValue('CHANNEL') || 'channel0';
  var vrange = block.getFieldValue('VRANGE') || '2.048';

  generator.addFunction('ads1115_toVoltage', [
    'float ads1115_toVoltage(int16_t raw, float vrange) {',
    '  return raw * vrange / 32767.0;',
    '}'
  ].join('\n'));

  return ['ads1115_toVoltage(ads1115_adc.getConversionResults(' + channel + '), ' + vrange + ')', generator.ORDER_FUNCTION_CALL];
};
