// @aily-project/lib-ws2812 代码生成器（引脚直控版）
// 无对象变量：每个积木直接携带 DATA_PIN 引脚，底层按引脚路由到对应灯带。

Arduino.forBlock['ws2812_init'] = function (block, generator) {
  const dataPin = block.getFieldValue('DATA_PIN')
  const count = block.getFieldValue('COUNT')

  generator.addLibrary('AilyWS2812', '#include <AilyWS2812.h>')
  return 'ailyWs2812Init(' + dataPin + ', ' + count + ');\n'
}

Arduino.forBlock['ws2812_fill'] = function (block, generator) {
  const dataPin = block.getFieldValue('DATA_PIN')
  const red = generator.valueToCode(block, 'RED', generator.ORDER_ATOMIC) || '0'
  const green = generator.valueToCode(block, 'GREEN', generator.ORDER_ATOMIC) || '0'
  const blue = generator.valueToCode(block, 'BLUE', generator.ORDER_ATOMIC) || '0'

  generator.addLibrary('AilyWS2812', '#include <AilyWS2812.h>')
  return 'ailyWs2812Fill(' + dataPin + ', ' + red + ', ' + green + ', ' + blue + ');\n'
}

Arduino.forBlock['ws2812_set_pixel'] = function (block, generator) {
  const dataPin = block.getFieldValue('DATA_PIN')
  const index = generator.valueToCode(block, 'INDEX', generator.ORDER_ATOMIC) || '0'
  const red = generator.valueToCode(block, 'RED', generator.ORDER_ATOMIC) || '0'
  const green = generator.valueToCode(block, 'GREEN', generator.ORDER_ATOMIC) || '0'
  const blue = generator.valueToCode(block, 'BLUE', generator.ORDER_ATOMIC) || '0'

  generator.addLibrary('AilyWS2812', '#include <AilyWS2812.h>')
  return (
    'ailyWs2812SetPixel(' + dataPin + ', ' + index + ', ' + red + ', ' + green + ', ' + blue + ');\n'
  )
}

Arduino.forBlock['ws2812_set_brightness'] = function (block, generator) {
  const dataPin = block.getFieldValue('DATA_PIN')
  const brightness = generator.valueToCode(block, 'BRIGHTNESS', generator.ORDER_ATOMIC) || '255'

  generator.addLibrary('AilyWS2812', '#include <AilyWS2812.h>')
  return 'ailyWs2812SetBrightness(' + dataPin + ', ' + brightness + ');\n'
}

Arduino.forBlock['ws2812_clear'] = function (block, generator) {
  const dataPin = block.getFieldValue('DATA_PIN')

  generator.addLibrary('AilyWS2812', '#include <AilyWS2812.h>')
  return 'ailyWs2812Clear(' + dataPin + ');\n'
}

Arduino.forBlock['ws2812_show'] = function (block, generator) {
  const dataPin = block.getFieldValue('DATA_PIN')

  generator.addLibrary('AilyWS2812', '#include <AilyWS2812.h>')
  return 'ailyWs2812Show(' + dataPin + ');\n'
}

Arduino.forBlock['ws2812_is_ready'] = function (block, generator) {
  const dataPin = block.getFieldValue('DATA_PIN')

  generator.addLibrary('AilyWS2812', '#include <AilyWS2812.h>')
  return ['ailyWs2812IsReady(' + dataPin + ') ? 1 : 0', generator.ORDER_ATOMIC]
}
