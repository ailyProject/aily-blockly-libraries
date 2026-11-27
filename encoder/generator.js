Arduino.addReservedWords('ailyEncoderFirst,AilyEncoderState');

function ailyEncoderName(block, generator) {
  return generator.nameDB_.getName(block.getFieldValue('ENCODER'), Blockly.Names.NameType.VARIABLE);
}

Arduino.forBlock['encoder_init'] = function(block, generator) {
  const name = ailyEncoderName(block, generator);
  const pinA = block.getFieldValue('PIN_A') || '2';
  const pinB = block.getFieldValue('PIN_B') || '3';
  generator.addLibrary('aily_encoder', '#include <AilyEncoderState.h>');
  generator.addObject(name, `AilyEncoderState ${name}(${pinA}, ${pinB});`);
  // Existing event blocks have no ENCODER field. Bind them to the first
  // initialized encoder, matching their behavior in saved projects.
  generator.addObject('aily.encoder:first', `AilyEncoderState& ailyEncoderFirst = ${name};`);
  generator.addSetupBegin('aily_encoder_start_' + name, `(void)${name}.read();`);
  generator.addLoopBegin('aily_encoder_poll_' + name, `${name}.poll();`);
  return '';
};

Arduino.forBlock['encoder_value_changed'] = function(block, generator) {
  return ['ailyEncoderFirst.direction != 0', generator.ORDER_EQUALITY];
};

Arduino.forBlock['encoder_state_change'] = function(block, generator) {
  const conditions = {
    LEFT: 'direction < 0', RIGHT: 'direction > 0',
    ABOVE_LIMIT: 'aboveLimit', BELOW_LIMIT: 'belowLimit',
  };
  const condition = conditions[block.getFieldValue('STATE')];
  if (!condition) return '';
  return `if (ailyEncoderFirst.${condition}) {\n${generator.statementToCode(block, 'DO')}}\n`;
};

Arduino.forBlock['encoder_get_property'] = function(block, generator) {
  const name = ailyEncoderName(block, generator);
  const property = { POSITION: 'read()', DIRECTION: 'direction',
    UPPER_LIMIT: 'upperLimit', LOWER_LIMIT: 'lowerLimit' }[block.getFieldValue('PROPERTY')];
  return [name + '.' + property, generator.ORDER_ATOMIC];
};

Arduino.forBlock['encoder_set_property'] = function(block, generator) {
  const name = ailyEncoderName(block, generator);
  const value = generator.valueToCode(block, 'VALUE', generator.ORDER_NONE) || '0';
  switch (block.getFieldValue('PROPERTY')) {
    case 'position': return `${name}.write(${value});\n`;
    case 'upper_limit': return `${name}.upperLimit = ${value};\n`;
    case 'lower_limit': return `${name}.lowerLimit = ${value};\n`;
    default: return '';
  }
};
