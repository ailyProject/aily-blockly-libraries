'use strict';

// Wio Terminal buttons are active-low and use the board package's built-in pin macros.
var WIO_CONTROLS = {
  WIO_KEY_A: { name: 'KeyA', object: 'wioButtonKeyA' },
  WIO_KEY_B: { name: 'KeyB', object: 'wioButtonKeyB' },
  WIO_KEY_C: { name: 'KeyC', object: 'wioButtonKeyC' },
  WIO_5S_UP: { name: 'Up', object: 'wioButtonUp' },
  WIO_5S_DOWN: { name: 'Down', object: 'wioButtonDown' },
  WIO_5S_LEFT: { name: 'Left', object: 'wioButtonLeft' },
  WIO_5S_RIGHT: { name: 'Right', object: 'wioButtonRight' },
  WIO_5S_PRESS: { name: 'Press', object: 'wioButtonPress' }
};

var WIO_CONTROL_EVENTS = {
  CLICK: { method: 'attachClick', suffix: 'Click' },
  DOUBLE_CLICK: { method: 'attachDoubleClick', suffix: 'DoubleClick' },
  MULTI_CLICK: { method: 'attachMultiClick', suffix: 'MultiClick' },
  PRESS: { method: 'attachPress', suffix: 'Press' },
  LONG_PRESS_START: { method: 'attachLongPressStart', suffix: 'LongPressStart' },
  DURING_LONG_PRESS: { method: 'attachDuringLongPress', suffix: 'DuringLongPress' },
  LONG_PRESS_STOP: { method: 'attachLongPressStop', suffix: 'LongPressStop' }
};

function wioControlInfo(key) {
  const resolvedKey = WIO_CONTROLS[key] ? key : 'WIO_KEY_A';
  return Object.assign({ key: resolvedKey }, WIO_CONTROLS[resolvedKey]);
}

function wioEnsureControl(generator, key) {
  const control = wioControlInfo(key);
  generator.addLibrary('wio_buttons_onebutton', '#include <OneButton.h>');
  generator.addVariable(control.object, 'OneButton ' + control.object + ';');
  generator.addSetupBegin(
    'wio_buttons_setup_' + control.key,
    control.object + '.setup(' + control.key + ', INPUT_PULLUP, true);'
  );
  generator.addLoopBegin(
    'wio_buttons_tick_' + control.key,
    control.object + '.tick();'
  );
  return control;
}

function wioEnsureAllControls(generator) {
  Object.keys(WIO_CONTROLS).forEach(function(key) {
    wioEnsureControl(generator, key);
  });
}

function wioValueToCode(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

Arduino.forBlock['wio_buttons_setup'] = function(block, generator) {
  wioEnsureAllControls(generator);
  return '';
};

// Retain the original block ids so existing projects remain compatible.
Arduino.forBlock['wio_button_is_pressed'] = function(block, generator) {
  const key = block.getFieldValue('BUTTON') || 'WIO_KEY_A';
  const control = wioEnsureControl(generator, key);
  return [control.object + '.debouncedValue()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wio_switch_is_pressed'] = function(block, generator) {
  const key = block.getFieldValue('DIRECTION') || 'WIO_5S_UP';
  const control = wioEnsureControl(generator, key);
  return [control.object + '.debouncedValue()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wio_control_on_event'] = function(block, generator) {
  const key = block.getFieldValue('CONTROL') || 'WIO_KEY_A';
  const eventKey = block.getFieldValue('EVENT') || 'CLICK';
  const control = wioEnsureControl(generator, key);
  const event = WIO_CONTROL_EVENTS[eventKey] || WIO_CONTROL_EVENTS.CLICK;
  const handlerCode = generator.statementToCode(block, 'DO') || '';
  const callbackName = 'onWio' + control.name + event.suffix;

  generator.addFunction(callbackName, 'void ' + callbackName + '() {\n' + handlerCode + '}\n');
  generator.addSetupEnd(
    'wio_buttons_' + control.key + '_' + eventKey + '_register',
    control.object + '.' + event.method + '(' + callbackName + ');'
  );
  return '';
};

Arduino.forBlock['wio_control_set_debounce_ms'] = function(block, generator) {
  const key = block.getFieldValue('CONTROL') || 'WIO_KEY_A';
  const control = wioEnsureControl(generator, key);
  const ms = wioValueToCode(block, generator, 'MS', '50');
  return control.object + '.setDebounceMs(' + ms + ');\n';
};

Arduino.forBlock['wio_control_set_click_ms'] = function(block, generator) {
  const key = block.getFieldValue('CONTROL') || 'WIO_KEY_A';
  const control = wioEnsureControl(generator, key);
  const ms = wioValueToCode(block, generator, 'MS', '400');
  return control.object + '.setClickMs(' + ms + ');\n';
};

Arduino.forBlock['wio_control_set_press_ms'] = function(block, generator) {
  const key = block.getFieldValue('CONTROL') || 'WIO_KEY_A';
  const control = wioEnsureControl(generator, key);
  const ms = wioValueToCode(block, generator, 'MS', '800');
  return control.object + '.setPressMs(' + ms + ');\n';
};

Arduino.forBlock['wio_control_set_long_press_interval_ms'] = function(block, generator) {
  const key = block.getFieldValue('CONTROL') || 'WIO_KEY_A';
  const control = wioEnsureControl(generator, key);
  const ms = wioValueToCode(block, generator, 'MS', '1000');
  return control.object + '.setLongPressIntervalMs(' + ms + ');\n';
};

Arduino.forBlock['wio_control_is_long_pressed'] = function(block, generator) {
  const key = block.getFieldValue('CONTROL') || 'WIO_KEY_A';
  const control = wioEnsureControl(generator, key);
  return [control.object + '.isLongPressed()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wio_control_get_pressed_ms'] = function(block, generator) {
  const key = block.getFieldValue('CONTROL') || 'WIO_KEY_A';
  const control = wioEnsureControl(generator, key);
  return [control.object + '.getPressedMs()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wio_control_get_number_clicks'] = function(block, generator) {
  const key = block.getFieldValue('CONTROL') || 'WIO_KEY_A';
  const control = wioEnsureControl(generator, key);
  return [control.object + '.getNumberClicks()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['wio_control_reset'] = function(block, generator) {
  const key = block.getFieldValue('CONTROL') || 'WIO_KEY_A';
  const control = wioEnsureControl(generator, key);
  return control.object + '.reset();\n';
};
