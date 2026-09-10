// @aily-project/lib-ld2410c 图形块代码生成器
// 每个块在脚本顶层直接注册 Arduino.forBlock 处理器。

Arduino.forBlock['ld2410c_init'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  const rx = block.getFieldValue('RX')
  const tx = block.getFieldValue('TX')
  const baud = block.getFieldValue('BAUD')

  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  generator.addObject('ld2410c_' + objectName, 'LD2410C ' + objectName + '(' + rx + ', ' + tx + ', ' + baud + ');')
  generator.addSetupBegin('ld2410c_' + objectName + '_begin', objectName + '.begin();\n')
  return ''
}

Arduino.forBlock['ld2410c_read_frame'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return objectName + '.readFrame();\n'
}

Arduino.forBlock['ld2410c_new_frame'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return [objectName + '.newFrame()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ld2410c_frame_valid'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return [objectName + '.frameValid()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ld2410c_frame_byte'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  const index = generator.valueToCode(block, 'INDEX', Arduino.ORDER_ATOMIC) || '1'
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return [objectName + '.frameByte(' + index + ')', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ld2410c_data_byte'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  const index = generator.valueToCode(block, 'INDEX', Arduino.ORDER_ATOMIC) || '1'
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return [objectName + '.dataByte(' + index + ')', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ld2410c_frame_length'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return [objectName + '.frameLength()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ld2410c_data_length'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return [objectName + '.dataLength()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ld2410c_mode'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return [objectName + '.mode()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ld2410c_target_status'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return [objectName + '.targetStatus()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ld2410c_moving_distance'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return [objectName + '.movingDistance()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ld2410c_moving_energy'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return [objectName + '.movingEnergy()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ld2410c_static_distance'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return [objectName + '.staticDistance()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ld2410c_static_energy'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return [objectName + '.staticEnergy()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ld2410c_detect_distance'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return [objectName + '.detectDistance()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ld2410c_move_gate_count'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return [objectName + '.moveGateCount()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ld2410c_static_gate_count'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return [objectName + '.staticGateCount()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ld2410c_move_gate_energy'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  const index = generator.valueToCode(block, 'INDEX', Arduino.ORDER_ATOMIC) || '1'
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return [objectName + '.moveGateEnergy(' + index + ')', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ld2410c_static_gate_energy'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  const index = generator.valueToCode(block, 'INDEX', Arduino.ORDER_ATOMIC) || '1'
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return [objectName + '.staticGateEnergy(' + index + ')', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ld2410c_photosensitive'] = function (block, generator) {
  const objectName = generator.getValue(block, 'VAR', 'field_variable')
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return [objectName + '.photosensitive()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['ld2410c_poll_auto'] = function (block, generator) {
  generator.addLibrary('ld2410c', '#include "LD2410C.h"')
  return 'LD2410C::poll();\n'
}
