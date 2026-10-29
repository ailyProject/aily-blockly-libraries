// @aily-project/lib-jq6500

Arduino.forBlock["jq6500_init"] = function (block, generator) {
  registerVariableToBlockly(block.getFieldValue("NAME"), "JQ6500_Serial");
  const name = block.getFieldValue('NAME')
  const rx = block.getFieldValue('RX_PIN')
  const tx = block.getFieldValue('TX_PIN')
  generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>')
  generator.addLibrary('JQ6500', '#include "JQ6500.h"')
  generator.addObject('jq6500_serial_' + name, 'SoftwareSerial ' + name + '_serial(' + rx + ', ' + tx + ');')
  generator.addObject('jq6500_' + name, 'JQ6500_Serial ' + name + '(' + name + '_serial);')
  generator.addSetupBegin('jq6500_' + name, name + '_serial.begin(9600);')
  return ''
};

Arduino.forBlock["jq6500_reset"] = function (block, generator) {
  const name = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('JQ6500', '#include "JQ6500.h"')
  return name + '.reset();\n'
};

Arduino.forBlock["jq6500_set_volume"] = function (block, generator) {
  const name = generator.getValue(block, 'VAR', 'field_variable')
  const vol = generator.valueToCode(block, 'VOLUME', generator.ORDER_ATOMIC) || '30'
  generator.addLibrary('JQ6500', '#include "JQ6500.h"')
  return name + '.setVolume(' + vol + ');\n'
};

Arduino.forBlock["jq6500_play_index"] = function (block, generator) {
  const name = generator.getValue(block, 'VAR', 'field_variable')
  const idx = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '1'
  generator.addLibrary('JQ6500', '#include "JQ6500.h"')
  return name + '.playFileByIndexNumber(' + idx + ');\n'
};

Arduino.forBlock["jq6500_set_loop"] = function (block, generator) {
  const name = generator.getValue(block, 'VAR', 'field_variable')
  const mode = block.getFieldValue('MODE')
  generator.addLibrary('JQ6500', '#include "JQ6500.h"')
  return name + '.setLoopMode(' + mode + ');\n'
};
