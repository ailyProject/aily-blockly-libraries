// @aily-project/lib-tgam 代码生成器
// TGAM 脑电波模块：UART 读取信号质量、注意力、放松度

Arduino.forBlock['tgam_init'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  const serialPort = block.getFieldValue('SERIAL') || 'Serial'
  const rx = generator.valueToCode(block, 'RX', generator.ORDER_ATOMIC) || '16'
  const tx = generator.valueToCode(block, 'TX', generator.ORDER_ATOMIC) || '17'
  const baud = block.getFieldValue('BAUD') || '57600'

  generator.addLibrary('TGAM', '#include "TGAM.h"')
  generator.addObject('tgam_object_' + objectName, 'TGAM ' + objectName + '(' + serialPort + ');')

  // 板卡自适应：ESP32 系列的外设串口（Serial1/Serial2）可指定 RX/TX 引脚；
  // 其它板卡（含 Arduino UNO 的 Serial）生成普通 begin(baud)
  const boardConfig = (typeof window !== 'undefined' && window['boardConfig']) || null
  const core = (boardConfig && boardConfig.core) || ''
  let beginCode
  if (core.indexOf('esp32') > -1 && serialPort !== 'Serial') {
    beginCode = serialPort + '.begin(' + baud + ', SERIAL_8N1, ' + rx + ', ' + tx + ');\n'
  } else {
    beginCode = serialPort + '.begin(' + baud + ');\n'
  }
  generator.addSetupBegin('tgam_begin_' + objectName, beginCode)
  // 与核心串口库联动：登记串口已初始化，避免 serial_print/println 自动注入 begin(9600) 覆盖波特率
  if (typeof Arduino !== 'undefined' && Arduino.addedSerialInitCode && typeof Arduino.addedSerialInitCode.add === 'function') {
    Arduino.addedSerialInitCode.add(serialPort)
  }
  // 自动在loop开头解析串口数据，用户无需手动调用update
  generator.addLoopBegin('tgam_update_' + objectName, objectName + '.update();\n')
  return ''
}

Arduino.forBlock['tgam_signal_quality'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('TGAM', '#include "TGAM.h"')
  return [objectName + '.signalQuality()', generator.ORDER_ATOMIC]
}

Arduino.forBlock['tgam_attention'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('TGAM', '#include "TGAM.h"')
  return [objectName + '.attention()', generator.ORDER_ATOMIC]
}

Arduino.forBlock['tgam_meditation'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('TGAM', '#include "TGAM.h"')
  return [objectName + '.meditation()', generator.ORDER_ATOMIC]
}

Arduino.forBlock['tgam_signal_good'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('TGAM', '#include "TGAM.h"')
  return [objectName + '.signalGood()', generator.ORDER_ATOMIC]
}

Arduino.forBlock['tgam_has_new_data'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('TGAM', '#include "TGAM.h"')
  return [objectName + '.hasNewData()', generator.ORDER_ATOMIC]
}
