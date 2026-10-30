// IBoxS31_LED：板载 WS2812 ×4（IO38），颜色统一用 0xRRGGBB

// 引脚和 I2C 地址按智盒板 IBox S31 写死，换成别的板时在代码里留个提醒
Arduino.iboxs31BoardNote = function () {
  try {
    const boardConfig = window['boardConfig'];
    const name = boardConfig && boardConfig.name ? String(boardConfig.name) : '';
    if (name && !/ibox\s*s31/i.test(name)) {
      return '// 注意：当前开发板是 ' + name + '，本库按智盒板 IBox S31 的引脚和 I2C 地址编写\n';
    }
  } catch (e) {}
  return '';
};

Arduino.iboxs31LedEnsure = function (generator) {
  generator.addLibrary('IBoxS31_LED', '#include <IBoxS31_LED.h>');
  generator.addVariable('iboxs31_led', 'IBoxS31_LED iboxs31_led;');
};

Arduino.iboxs31LedValue = function (block, name, fallback, generator) {
  return '(int)(' + (generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback) + ')';
};

Arduino.iboxs31LedColour = function (block, name, fallback, generator) {
  return '(uint32_t)(' + (generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback) + ')';
};

Arduino.iboxs31LedByte = function (block, name, fallback, generator) {
  return '(uint8_t)constrain(' + Arduino.iboxs31LedValue(block, name, fallback, generator) + ', 0, 255)';
};

Arduino.forBlock['iboxs31_led_init'] = function (block, generator) {
  const pin = String(block.getFieldValue('DATA_PIN') || '38').replace(/[^0-9A-Za-z_]/g, '') || '38';
  const count = Math.min(1024, Math.max(1, Math.round(Number(block.getFieldValue('COUNT')) || 4)));
  Arduino.iboxs31LedEnsure(generator);
  return Arduino.iboxs31BoardNote() + 'iboxs31_led.begin(' + pin + ', ' + count + ');\niboxs31_led.setAutoShow(true);\n';
};

Arduino.forBlock['iboxs31_led_brightness'] = function (block, generator) {
  const level = Arduino.iboxs31LedByte(block, 'BRIGHTNESS', '50', generator);
  Arduino.iboxs31LedEnsure(generator);
  return 'iboxs31_led.setBrightness(' + level + ');\n';
};

// 积木里序号从 1 数，库里从 0 数
Arduino.forBlock['iboxs31_led_set_pixel'] = function (block, generator) {
  const index = Arduino.iboxs31LedValue(block, 'INDEX', '1', generator);
  const colour = Arduino.iboxs31LedColour(block, 'COLOR', '0xFF0000', generator);
  Arduino.iboxs31LedEnsure(generator);
  return 'iboxs31_led.setPixel(' + index + ' - 1, ' + colour + ');\n';
};

Arduino.forBlock['iboxs31_led_set_range'] = function (block, generator) {
  const start = Arduino.iboxs31LedValue(block, 'START', '1', generator);
  const end = Arduino.iboxs31LedValue(block, 'END', '1', generator);
  const colour = Arduino.iboxs31LedColour(block, 'COLOR', '0x00FF00', generator);
  Arduino.iboxs31LedEnsure(generator);
  return 'iboxs31_led.fillRange(' + start + ' - 1, ' + end + ' - 1, ' + colour + ');\n';
};

Arduino.forBlock['iboxs31_led_fill'] = function (block, generator) {
  const colour = Arduino.iboxs31LedColour(block, 'COLOR', '0x0000FF', generator);
  Arduino.iboxs31LedEnsure(generator);
  return 'iboxs31_led.fill(' + colour + ');\n';
};

Arduino.forBlock['iboxs31_led_bar'] = function (block, generator) {
  const start = Arduino.iboxs31LedValue(block, 'START', '1', generator);
  const end = Arduino.iboxs31LedValue(block, 'END', '4', generator);
  const level = Arduino.iboxs31LedValue(block, 'LEVEL', '0', generator);
  const fg = Arduino.iboxs31LedColour(block, 'FOREGROUND', '0x00FF00', generator);
  const bg = Arduino.iboxs31LedColour(block, 'BACKGROUND', '0x000000', generator);
  Arduino.iboxs31LedEnsure(generator);
  return 'iboxs31_led.bar(' + start + ' - 1, ' + end + ' - 1, ' + level + ', ' + fg + ', ' + bg + ');\n';
};

Arduino.forBlock['iboxs31_led_rainbow'] = function (block, generator) {
  // 色调一圈 256，超出的绕回去
  const hue = '(uint8_t)(' + Arduino.iboxs31LedValue(block, 'HUE', '0', generator) + ' & 0xFF)';
  const delta = '(uint8_t)(' + Arduino.iboxs31LedValue(block, 'DELTA', '64', generator) + ' & 0xFF)';
  Arduino.iboxs31LedEnsure(generator);
  return 'iboxs31_led.rainbow(' + hue + ', ' + delta + ');\n';
};

Arduino.forBlock['iboxs31_led_effect'] = function (block, generator) {
  const effects = ['RAINBOW', 'BREATH', 'CHASE', 'TWINKLE', 'BLINK'];
  const effect = effects.indexOf(block.getFieldValue('EFFECT')) >= 0 ? block.getFieldValue('EFFECT') : 'RAINBOW';
  const colour = Arduino.iboxs31LedColour(block, 'COLOR', '0x00A0FF', generator);
  const speed = '(uint8_t)constrain(' + Arduino.iboxs31LedValue(block, 'SPEED', '5', generator) + ', 1, 10)';
  Arduino.iboxs31LedEnsure(generator);
  return 'iboxs31_led.effect(IBoxS31_LED::' + effect + ', ' + colour + ', ' + speed + ');\n';
};

Arduino.forBlock['iboxs31_led_clear'] = function (block, generator) {
  Arduino.iboxs31LedEnsure(generator);
  return 'iboxs31_led.clear();\n';
};

Arduino.forBlock['iboxs31_led_auto_show'] = function (block, generator) {
  const on = block.getFieldValue('STATE') === 'false' ? 'false' : 'true';
  Arduino.iboxs31LedEnsure(generator);
  return 'iboxs31_led.setAutoShow(' + on + ');\n';
};

Arduino.forBlock['iboxs31_led_show'] = function (block, generator) {
  Arduino.iboxs31LedEnsure(generator);
  return 'iboxs31_led.show();\n';
};

Arduino.forBlock['iboxs31_led_count'] = function (block, generator) {
  Arduino.iboxs31LedEnsure(generator);
  return ['iboxs31_led.count()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_led_color'] = function (block, generator) {
  const hex = String(block.getFieldValue('COLOR') || '#000000').replace('#', '');
  const value = /^[0-9a-fA-F]{6}$/.test(hex) ? hex.toUpperCase() : '000000';
  return ['0x' + value, generator.ORDER_ATOMIC];
};

Arduino.forBlock['iboxs31_led_rgb'] = function (block, generator) {
  const r = Arduino.iboxs31LedByte(block, 'RED', '0', generator);
  const g = Arduino.iboxs31LedByte(block, 'GREEN', '0', generator);
  const b = Arduino.iboxs31LedByte(block, 'BLUE', '0', generator);
  Arduino.iboxs31LedEnsure(generator);
  return ['IBoxS31_LED::rgb(' + r + ', ' + g + ', ' + b + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_led_hsv'] = function (block, generator) {
  const h = '(uint8_t)(' + Arduino.iboxs31LedValue(block, 'HUE', '0', generator) + ' & 0xFF)';
  const s = Arduino.iboxs31LedByte(block, 'SATURATION', '255', generator);
  const v = Arduino.iboxs31LedByte(block, 'VALUE', '255', generator);
  Arduino.iboxs31LedEnsure(generator);
  return ['IBoxS31_LED::hsv(' + h + ', ' + s + ', ' + v + ')', generator.ORDER_FUNCTION_CALL];
};
