// @aily-project/lib-grbl-stm32 generator
Arduino.forBlock['grbl_init'] = function (block, generator) {
  const obj = generator.getValue(block, 'VAR', 'field_variable')
  const enMode = block.getFieldValue('ENABLE_MODE')
  const pin = (name, fallback) => generator.valueToCode(block, name, Arduino.ORDER_ATOMIC) || String(fallback)
  let en = pin('ENABLE', 6)
  if (enMode === 'BYPASS') { en = '0xFFFFFFFFUL' } // 旁路：永久使能，不控制 EN 引脚
  const stepX = pin('STEP_X', 0)
  const dirX = pin('DIR_X', 3)
  const stepY = pin('STEP_Y', 1)
  const dirY = pin('DIR_Y', 4)
  const stepZ = pin('STEP_Z', 2)
  const dirZ = pin('DIR_Z', 5)
  const limX = pin('LIM_X', 26)
  const limY = pin('LIM_Y', 27)
  const limZ = pin('LIM_Z', 28)
  const laser = pin('LASER', 8)
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
