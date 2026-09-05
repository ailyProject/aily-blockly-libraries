// @aily-project/lib-microbit-daplog 代码生成器
// 全局单例 DapLog（定义于 src/microbit_daplog/microbit_daplog.cpp），无需创建变量。

function ensureDaplogLibrary(generator) {
  generator.addLibrary('microbit_daplog', '#include <microbit_daplog.h>')
}

// 按积木的 COL1..COLn 输入生成 DapLog.logRow({String(...), ...});
function generateLogRow(block, generator) {
  ensureDaplogLibrary(generator)
  const parts = []
  let i = 1
  while (block.getInput('COL' + i)) {
    const v = generator.valueToCode(block, 'COL' + i, Arduino.ORDER_ATOMIC) || '""'
    parts.push('String(' + v + ')')
    i++
  }
  if (parts.length === 0) return ''
  return 'DapLog.logRow({' + parts.join(', ') + '});\n'
}

Arduino.forBlock['daplog_begin'] = function (block, generator) {
  ensureDaplogLibrary(generator)
  return 'DapLog.begin();\n'
}

Arduino.forBlock['daplog_log_row'] = function (block, generator) {
  ensureDaplogLibrary(generator)
  const children = generator.statementToCode(block, 'STACK') || ''
  let code = 'DapLog.beginRow();\n'
  if (children) code += children
  code += 'DapLog.endRow();\n'
  return code
}

Arduino.forBlock['daplog_add_col'] = function (block, generator) {
  ensureDaplogLibrary(generator)
  const v = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '""'
  return 'DapLog.col(String(' + v + '));\n'
}

Arduino.forBlock['daplog_log_row1'] = function (block, generator) {
  return generateLogRow(block, generator)
}

Arduino.forBlock['daplog_log_row2'] = function (block, generator) {
  return generateLogRow(block, generator)
}

Arduino.forBlock['daplog_log_row4'] = function (block, generator) {
  return generateLogRow(block, generator)
}

Arduino.forBlock['daplog_log_row5'] = function (block, generator) {
  return generateLogRow(block, generator)
}

Arduino.forBlock['daplog_log_row6'] = function (block, generator) {
  return generateLogRow(block, generator)
}

Arduino.forBlock['daplog_clear'] = function (block, generator) {
  ensureDaplogLibrary(generator)
  return 'DapLog.clear();\n'
}

Arduino.forBlock['daplog_remount'] = function (block, generator) {
  ensureDaplogLibrary(generator)
  return 'DapLog.remount();\n'
}

Arduino.forBlock['daplog_ready'] = function (block, generator) {
  ensureDaplogLibrary(generator)
  return ['DapLog.ready()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['daplog_used_bytes'] = function (block, generator) {
  ensureDaplogLibrary(generator)
  return ['DapLog.usedBytes()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['daplog_row_count'] = function (block, generator) {
  ensureDaplogLibrary(generator)
  return ['DapLog.rowCount()', Arduino.ORDER_ATOMIC]
}

Arduino.forBlock['daplog_status'] = function (block, generator) {
  ensureDaplogLibrary(generator)
  return ['DapLog.status()', Arduino.ORDER_ATOMIC]
}
