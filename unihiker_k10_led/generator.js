// Helper: convert #RRGGBB to 0xRRGGBB
function colorToHex(color) {
  if (color && color.startsWith('#')) {
    return '0x' + color.substring(1).toUpperCase();
  }
  return color;
}

function ensureK10(generator) {
  generator.addLibrary('SPIFFS', '#include <SPIFFS.h>');
  generator.addLibrary('unihiker_k10', '#include <unihiker_k10.h>');
  generator.addVariable('k10', 'UNIHIKER_K10 k10;');
  generator.addSetupBegin('k10_begin', 'k10.begin();');
}

// ========== 设置亮度 ==========
Arduino.forBlock['k10_rgb_brightness'] = function(block, generator) {
  var brightness = block.getFieldValue('BRIGHTNESS');
  ensureK10(generator);
  return 'k10.rgb->brightness(round(' + brightness + '));\n';
};

// ========== 设置开关 ==========
Arduino.forBlock['k10_rgb_switch'] = function(block, generator) {
  var index = block.getFieldValue('INDEX');
  var state = block.getFieldValue('STATE');
  var color = state === 'ON' ? '0xFFFFFF' : '0x000000';
  ensureK10(generator);
  return 'k10.rgb->write(' + index + ', ' + color + ');\n';
};

// ========== 设置颜色 ==========
Arduino.forBlock['k10_rgb_write'] = function(block, generator) {
  var index = block.getFieldValue('INDEX');
  var r = generator.valueToCode(block, 'R', generator.ORDER_ATOMIC) || '0';
  var g = generator.valueToCode(block, 'G', generator.ORDER_ATOMIC) || '0';
  var b = generator.valueToCode(block, 'B', generator.ORDER_ATOMIC) || '0';
  ensureK10(generator);
  return 'k10.rgb->write(' + index + ', ' + r + ', ' + g + ', ' + b + ');\n';
};
