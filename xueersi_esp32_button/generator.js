'use strict';

const XUEERSI_ESP32_BUTTONS = {
  UP: { pin: 2, name: 'Up', object: 'xueersiButtonUp', mode: 'INPUT_PULLUP' },
  DOWN: { pin: 13, name: 'Down', object: 'xueersiButtonDown', mode: 'INPUT_PULLUP' },
  LEFT: { pin: 27, name: 'Left', object: 'xueersiButtonLeft', mode: 'INPUT_PULLUP' },
  RIGHT: { pin: 35, name: 'Right', object: 'xueersiButtonRight', mode: 'INPUT' },
  A: { pin: 34, name: 'A', object: 'xueersiButtonA', mode: 'INPUT' },
  B: { pin: 12, name: 'B', object: 'xueersiButtonB', mode: 'INPUT_PULLUP' }
};

const XUEERSI_ESP32_BUTTON_EVENTS = {
  CLICK: { method: 'attachClick', suffix: 'Click' },
  DOUBLE_CLICK: { method: 'attachDoubleClick', suffix: 'DoubleClick' },
  MULTI_CLICK: { method: 'attachMultiClick', suffix: 'MultiClick' },
  PRESS: { method: 'attachPress', suffix: 'Press' },
  LONG_PRESS_START: { method: 'attachLongPressStart', suffix: 'LongPressStart' },
  DURING_LONG_PRESS: { method: 'attachDuringLongPress', suffix: 'DuringLongPress' },
  LONG_PRESS_STOP: { method: 'attachLongPressStop', suffix: 'LongPressStop' }
};

function xueersiEsp32ButtonInfo(key) {
  return XUEERSI_ESP32_BUTTONS[key] || XUEERSI_ESP32_BUTTONS.UP;
}

function xueersiEsp32EnsureButton(generator, key) {
  const button = xueersiEsp32ButtonInfo(key);
  generator.addLibrary('xueersi_esp32_onebutton', '#include <OneButton.h>');
  generator.addVariable(button.object, 'OneButton ' + button.object + ';');
  generator.addSetupBegin(
    'xueersi_esp32_button_setup_' + key,
    button.object + '.setup(' + button.pin + ', ' + button.mode + ', true);'
  );
  generator.addLoopBegin(
    'xueersi_esp32_button_tick_' + key,
    button.object + '.tick();'
  );
  return button;
}

function xueersiEsp32EnsureAllButtons(generator) {
  Object.keys(XUEERSI_ESP32_BUTTONS).forEach(function(key) {
    xueersiEsp32EnsureButton(generator, key);
  });
}

function xueersiEsp32ValueToCode(block, generator, name, fallback) {
  if (generator.valueToCode) {
    return generator.valueToCode(block, name, generator.ORDER_ATOMIC || Arduino.ORDER_ATOMIC) || fallback;
  }
  return fallback;
}

Arduino.forBlock['xueersi_esp32_button_setup'] = function(block, generator) {
  xueersiEsp32EnsureAllButtons(generator);
  return '';
};

Arduino.forBlock['xueersi_esp32_button_is_pressed'] = function(block, generator) {
  const key = block.getFieldValue('BUTTON') || 'UP';
  const button = xueersiEsp32EnsureButton(generator, key);
  return ['(digitalRead(' + button.pin + ') == LOW)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['xueersi_esp32_button_on_event'] = function(block, generator) {
  const key = block.getFieldValue('BUTTON') || 'UP';
  const eventKey = block.getFieldValue('EVENT') || 'CLICK';
  const button = xueersiEsp32EnsureButton(generator, key);
  const event = XUEERSI_ESP32_BUTTON_EVENTS[eventKey] || XUEERSI_ESP32_BUTTON_EVENTS.CLICK;
  const handlerCode = generator.statementToCode(block, 'DO') || '';
  const callbackName = 'onXueersi' + button.name + event.suffix;

  generator.addFunction(callbackName, 'void ' + callbackName + '() {\n' + handlerCode + '}\n');
  generator.addSetupEnd(
    'xueersi_esp32_button_' + key + '_' + eventKey + '_register',
    button.object + '.' + event.method + '(' + callbackName + ');'
  );
  return '';
};

Arduino.forBlock['xueersi_esp32_button_set_debounce_ms'] = function(block, generator) {
  const key = block.getFieldValue('BUTTON') || 'UP';
  const button = xueersiEsp32EnsureButton(generator, key);
  const ms = xueersiEsp32ValueToCode(block, generator, 'MS', '50');
  return button.object + '.setDebounceMs(' + ms + ');\n';
};

Arduino.forBlock['xueersi_esp32_button_set_click_ms'] = function(block, generator) {
  const key = block.getFieldValue('BUTTON') || 'UP';
  const button = xueersiEsp32EnsureButton(generator, key);
  const ms = xueersiEsp32ValueToCode(block, generator, 'MS', '400');
  return button.object + '.setClickMs(' + ms + ');\n';
};

Arduino.forBlock['xueersi_esp32_button_set_press_ms'] = function(block, generator) {
  const key = block.getFieldValue('BUTTON') || 'UP';
  const button = xueersiEsp32EnsureButton(generator, key);
  const ms = xueersiEsp32ValueToCode(block, generator, 'MS', '800');
  return button.object + '.setPressMs(' + ms + ');\n';
};

Arduino.forBlock['xueersi_esp32_button_set_long_press_interval_ms'] = function(block, generator) {
  const key = block.getFieldValue('BUTTON') || 'UP';
  const button = xueersiEsp32EnsureButton(generator, key);
  const ms = xueersiEsp32ValueToCode(block, generator, 'MS', '1000');
  return button.object + '.setLongPressIntervalMs(' + ms + ');\n';
};

Arduino.forBlock['xueersi_esp32_button_is_long_pressed'] = function(block, generator) {
  const key = block.getFieldValue('BUTTON') || 'UP';
  const button = xueersiEsp32EnsureButton(generator, key);
  return [button.object + '.isLongPressed()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['xueersi_esp32_button_get_pressed_ms'] = function(block, generator) {
  const key = block.getFieldValue('BUTTON') || 'UP';
  const button = xueersiEsp32EnsureButton(generator, key);
  return [button.object + '.getPressedMs()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['xueersi_esp32_button_get_number_clicks'] = function(block, generator) {
  const key = block.getFieldValue('BUTTON') || 'UP';
  const button = xueersiEsp32EnsureButton(generator, key);
  return [button.object + '.getNumberClicks()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['xueersi_esp32_button_reset'] = function(block, generator) {
  const key = block.getFieldValue('BUTTON') || 'UP';
  const button = xueersiEsp32EnsureButton(generator, key);
  return button.object + '.reset();\n';
};
