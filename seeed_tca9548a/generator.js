// TCA9548A 8路I2C集线器 generator.js

Arduino.forBlock['tca9548a_init'] = function(block, generator) {
  generator.addLibrary('TCA9548A_H', '#include <TCA9548A.h>\n#include <Wire.h>');
  generator.addVariable('tca9548a_mux', 'TCA9548A<TwoWire> tca9548a_mux;');
  var address = block.getFieldValue('ADDRESS') || '0x70';
  return 'Wire.begin();\ntca9548a_mux.begin(Wire, ' + address + ');\n';
};

Arduino.forBlock['tca9548a_open_channel'] = function(block, generator) {
  generator.addLibrary('TCA9548A_H', '#include <TCA9548A.h>\n#include <Wire.h>');
  generator.addVariable('tca9548a_mux', 'TCA9548A<TwoWire> tca9548a_mux;');
  var channel = block.getFieldValue('CHANNEL') || 'TCA_CHANNEL_0';
  return 'tca9548a_mux.openChannel(' + channel + ');\n';
};

Arduino.forBlock['tca9548a_close_channel'] = function(block, generator) {
  generator.addLibrary('TCA9548A_H', '#include <TCA9548A.h>\n#include <Wire.h>');
  generator.addVariable('tca9548a_mux', 'TCA9548A<TwoWire> tca9548a_mux;');
  var channel = block.getFieldValue('CHANNEL') || 'TCA_CHANNEL_0';
  return 'tca9548a_mux.closeChannel(' + channel + ');\n';
};

Arduino.forBlock['tca9548a_close_all'] = function(block, generator) {
  generator.addLibrary('TCA9548A_H', '#include <TCA9548A.h>\n#include <Wire.h>');
  generator.addVariable('tca9548a_mux', 'TCA9548A<TwoWire> tca9548a_mux;');
  return 'tca9548a_mux.closeAll();\n';
};
