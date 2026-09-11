// Aily Blockly generator for @aily-project/lib-sen0754
// DFRobot SEN0754 Ultrasonic Liquid Level Sensor (UART Modbus RTU, fixed 115200 baud)
// Target: ESP32-series boards (HardwareSerial UART1/UART2 with custom RX/TX pins)

Arduino.forBlock['sen0754_init'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  const serialPort = block.getFieldValue('SERIAL')
  const rxPin = block.getFieldValue('RX')
  const txPin = block.getFieldValue('TX')
  const uartIndex = serialPort === 'Serial2' ? 2 : 1
  const serialObj = objectName + 'Serial'

  generator.addLibrary('sen0754_include', '#include "SEN0754.h"')
  generator.addObject('sen0754_serial_' + objectName, 'HardwareSerial ' + serialObj + '(' + uartIndex + ');')
  generator.addObject('sen0754_object_' + objectName, 'SEN0754 ' + objectName + '(' + serialObj + ');')
  generator.addSetupBegin('sen0754_begin_' + objectName, serialObj + '.begin(115200, SERIAL_8N1, ' + rxPin + ', ' + txPin + ');\n')
  return ''
}

Arduino.forBlock['sen0754_set_install_height'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  const height = generator.valueToCode(block, 'HEIGHT', Arduino.ORDER_ATOMIC) || '2000'
  return objectName + '.setInstallHeight(' + height + ');\n'
}

Arduino.forBlock['sen0754_read_realtime'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  return objectName + '.readRealtime();\n'
}

Arduino.forBlock['sen0754_read_processed'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  return objectName + '.readProcessed();\n'
}

Arduino.forBlock['sen0754_get_water_level'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  return [objectName + '.getWaterLevel()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['sen0754_get_distance'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  return [objectName + '.getDistance()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['sen0754_get_temperature'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  return [objectName + '.getTemperature()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['sen0754_is_valid'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  return [objectName + '.isValid()', Arduino.ORDER_ATOMIC]
}
