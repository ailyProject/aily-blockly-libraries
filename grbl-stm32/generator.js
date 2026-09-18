// @aily-project/lib-grbl-stm32 generator
Arduino.forBlock['grbl_init'] = function (block, generator) {
  const obj = generator.getValue(block, 'VAR', 'field_variable')
  const stepX = block.getFieldValue('STEP_X')
  const dirX = block.getFieldValue('DIR_X')
  const stepY = block.getFieldValue('STEP_Y')
  const dirY = block.getFieldValue('DIR_Y')
  const stepZ = block.getFieldValue('STEP_Z')
  const dirZ = block.getFieldValue('DIR_Z')
  const en = block.getFieldValue('ENABLE')
  const limX = block.getFieldValue('LIM_X')
  const limY = block.getFieldValue('LIM_Y')
  const limZ = block.getFieldValue('LIM_Z')
  const laser = block.getFieldValue('LASER')
  generator.addLibrary('grbl_stm32', '#include "GrblSTM32.h"')
  generator.addObject('grbl_' + obj, 'GrblSTM32 ' + obj + '(' + stepX + ',' + dirX + ',' + stepY + ',' + dirY + ',' + stepZ + ',' + dirZ + ',' + en + ',' + limX + ',' + limY + ',' + limZ + ',' + laser + ');')
  return ''
}

Arduino.forBlock['grbl_begin'] = function (block, generator) {
  const obj = generator.getValue(block, 'VAR', 'field_variable')
  const port = block.getFieldValue('PORT')
  const baud = block.getFieldValue('BAUD')
  generator.addLibrary('grbl_stm32', '#include "GrblSTM32.h"')
  if (port === 'USART1') {
    generator.addSetupBegin('grbl_' + obj + '_begin', obj + '.attachUSART1(' + baud + ');\n')
  } else {
    generator.addSetupBegin('grbl_' + obj + '_begin', port + '.begin(' + baud + ');\n' + obj + '.attachSerial(' + port + ');\n')
  }
  return ''
}

Arduino.forBlock['grbl_tick'] = function (block, generator) {
  const obj = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('grbl_stm32', '#include "GrblSTM32.h"')
  return obj + '.tick();\n'
}

Arduino.forBlock['grbl_is_idle'] = function (block, generator) {
  const obj = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('grbl_stm32', '#include "GrblSTM32.h"')
  return [obj + '.isIdle()', Arduino.ORDER_ATOMIC]
}
