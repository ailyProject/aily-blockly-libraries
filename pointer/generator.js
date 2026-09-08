// @aily-project/lib-pointer generators. Registered directly at script top level.

Arduino.forBlock['pointer_define'] = function (block, generator) {
  const name = block.getFieldValue('VAR')
  const type = block.getFieldValue('TYPE')
  const value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '0'
  generator.addObject('pointer_define_' + name, type + ' ' + name + ' = ' + value + ';')
  return ''
}

Arduino.forBlock['pointer_address_of'] = function (block, generator) {
  const value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '0'
  return ['(&' + value + ')', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['pointer_dereference_get'] = function (block, generator) {
  const value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '0'
  return ['(*(' + value + '))', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['pointer_dereference_set'] = function (block, generator) {
  const pointer = generator.valueToCode(block, 'PTR', Arduino.ORDER_ATOMIC) || '0'
  const value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '0'
  return '(*(' + pointer + ') = ' + value + ');\n'
}
