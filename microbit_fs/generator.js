// @aily-project/lib-microbitfs
// micro:bit V2 文件系统积木（microbitfs 引擎，完整移植自 micropython-microbit-v2）
// 快速操作模式：全局单例 API，无对象变量；每次文件操作独立打开/关闭。

function microbitfsEnsure(generator) {
  generator.addLibrary('MBMicroBitFS', '#include <MBMicroBitFS.h>')
}

function microbitfsEscapeText(text) {
  return String(text).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

Arduino.forBlock['microbitfs_begin'] = function (block, generator) {
  microbitfsEnsure(generator)
  var rebuild = block.getFieldValue('REBUILD') === 'TRUE' ? 'true' : 'false'
  return 'microbitfsBegin(' + rebuild + ');\n'
}

Arduino.forBlock['microbitfs_format'] = function (block, generator) {
  microbitfsEnsure(generator)
  return 'microbitfsFormat();\n'
}

Arduino.forBlock['microbitfs_write'] = function (block, generator) {
  microbitfsEnsure(generator)
  var file = microbitfsEscapeText(block.getFieldValue('FILE') || 'data.txt')
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""'
  return 'microbitfsWrite("' + file + '", ' + text + ');\n'
}

Arduino.forBlock['microbitfs_append_line'] = function (block, generator) {
  microbitfsEnsure(generator)
  var file = microbitfsEscapeText(block.getFieldValue('FILE') || 'data.txt')
  var text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC) || '""'
  return 'microbitfsAppendLine("' + file + '", ' + text + ');\n'
}

Arduino.forBlock['microbitfs_append_number'] = function (block, generator) {
  microbitfsEnsure(generator)
  var file = microbitfsEscapeText(block.getFieldValue('FILE') || 'data.txt')
  var value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '0'
  var dec = Number(block.getFieldValue('DECIMALS'))
  if (!isFinite(dec)) {
    dec = 2
  }
  dec = Math.max(0, Math.min(7, Math.round(dec)))
  return 'microbitfsAppendNumber("' + file + '", ' + value + ', ' + dec + ');\n'
}

Arduino.forBlock['microbitfs_read'] = function (block, generator) {
  microbitfsEnsure(generator)
  var file = microbitfsEscapeText(block.getFieldValue('FILE') || 'data.txt')
  return ['microbitfsRead("' + file + '")', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['microbitfs_read_line'] = function (block, generator) {
  microbitfsEnsure(generator)
  var file = microbitfsEscapeText(block.getFieldValue('FILE') || 'data.txt')
  var line = generator.valueToCode(block, 'LINE', Arduino.ORDER_ATOMIC) || '0'
  return ['microbitfsReadLine("' + file + '", ' + line + ')', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['microbitfs_line_count'] = function (block, generator) {
  microbitfsEnsure(generator)
  var file = microbitfsEscapeText(block.getFieldValue('FILE') || 'data.txt')
  return ['microbitfsLineCount("' + file + '")', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['microbitfs_exists'] = function (block, generator) {
  microbitfsEnsure(generator)
  var file = microbitfsEscapeText(block.getFieldValue('FILE') || 'data.txt')
  return ['microbitfsExists("' + file + '")', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['microbitfs_file_size'] = function (block, generator) {
  microbitfsEnsure(generator)
  var file = microbitfsEscapeText(block.getFieldValue('FILE') || 'data.txt')
  return ['microbitfsFileSize("' + file + '")', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['microbitfs_remove'] = function (block, generator) {
  microbitfsEnsure(generator)
  var file = microbitfsEscapeText(block.getFieldValue('FILE') || 'data.txt')
  return 'microbitfsRemove("' + file + '");\n'
}

Arduino.forBlock['microbitfs_list_files'] = function (block, generator) {
  microbitfsEnsure(generator)
  return ['microbitfsListFiles()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['microbitfs_file_count'] = function (block, generator) {
  microbitfsEnsure(generator)
  return ['microbitfsFileCount()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['microbitfs_free_kb'] = function (block, generator) {
  microbitfsEnsure(generator)
  return ['microbitfsFreeKB()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['microbitfs_used_kb'] = function (block, generator) {
  microbitfsEnsure(generator)
  return ['microbitfsUsedKB()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['microbitfs_dir_exists'] = function (block, generator) {
  microbitfsEnsure(generator)
  var dir = microbitfsEscapeText(block.getFieldValue('DIR') || '')
  return ['microbitfsDirExists("' + dir + '")', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['microbitfs_dir_list'] = function (block, generator) {
  microbitfsEnsure(generator)
  var dir = microbitfsEscapeText(block.getFieldValue('DIR') || '')
  return ['microbitfsDirList("' + dir + '")', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['microbitfs_dir_file_count'] = function (block, generator) {
  microbitfsEnsure(generator)
  var dir = microbitfsEscapeText(block.getFieldValue('DIR') || '')
  return ['microbitfsDirFileCount("' + dir + '")', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['microbitfs_dir_remove'] = function (block, generator) {
  microbitfsEnsure(generator)
  var dir = microbitfsEscapeText(block.getFieldValue('DIR') || '')
  return 'microbitfsDirRemove("' + dir + '");\n'
}
