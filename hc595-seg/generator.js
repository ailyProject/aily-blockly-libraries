// @aily-project/lib-hc595-seg

Arduino.forBlock["hc595seg_init"] = function (block, generator) {
  registerVariableToBlockly(block.getFieldValue("NAME"), "HC595Seg");
  const name = block.getFieldValue('NAME');
  const sdi = block.getFieldValue('SDI');
  const sclk = block.getFieldValue('SCLK');
  const load = block.getFieldValue('LOAD');
  const polarity = block.getFieldValue('POLARITY') === 'COMMON_ANODE' ? 'HC595SegPolarity::HC595SEG_COMMON_ANODE' : 'HC595SegPolarity::HC595SEG_COMMON_CATHODE';
  generator.addLibrary('hc595seg', '#include "HC595Seg.h"');
  generator.addObject('hc595seg_' + name, 'HC595Seg ' + name + ';');
  generator.addSetupBegin('hc595seg_' + name, name + '.begin(' + sdi + ', ' + sclk + ', ' + load + ', ' + polarity + ');\n');
  return '';
};

Arduino.forBlock["hc595seg_set_digit"] = function (block, generator) {
  const name = generator.getValue(block, 'DISP', 'field_variable');
  const digit = block.getFieldValue('DIGIT');
  const code = generator.valueToCode(block, 'CODE', Arduino.ORDER_ATOMIC) || '0';
  generator.addLibrary('hc595seg', '#include "HC595Seg.h"');
  return name + '.setSegment(' + digit + ', ' + code + ');\n';
};

Arduino.forBlock["hc595seg_segcode"] = function (block, generator) {
  const name = generator.getValue(block, 'DISP', 'field_variable');
  const ch = block.getFieldValue('CHAR');
  generator.addLibrary('hc595seg', '#include "HC595Seg.h"');
  return [name + ".segCode('" + ch + "')", Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["hc595seg_clear"] = function (block, generator) {
  const name = generator.getValue(block, 'DISP', 'field_variable');
  generator.addLibrary('hc595seg', '#include "HC595Seg.h"');
  return name + '.clear();\n';
};
