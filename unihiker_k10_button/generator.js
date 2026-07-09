// Ensure k10 object is initialized
function ensureK10(generator) {
  generator.addLibrary('SPIFFS', '#include <SPIFFS.h>');
  generator.addLibrary('unihiker_k10', '#include <unihiker_k10.h>');
  generator.addVariable('k10', 'UNIHIKER_K10 k10;');
  generator.addSetupBegin('k10_begin', 'k10.begin();');
}

// ========== 按键轮询 ==========
Arduino.forBlock['k10_button_pressed'] = function(block, generator) {
  var button = block.getFieldValue('BTN');
  ensureK10(generator);
  return ['(k10.' + button + '->isPressed())', generator.ORDER_ATOMIC];
};

// ========== 按键回调 ==========
Arduino.forBlock['k10_button_callback'] = function(block, generator) {
  var button = block.getFieldValue('BTN');
  var event = block.getFieldValue('EVENT');
  var handlerCode = generator.statementToCode(block, 'DO') || '';
  var setterName = (event === 'released') ? 'setUnPressedCallback' : 'setPressedCallback';
  var eventCap = event.charAt(0).toUpperCase() + event.slice(1);
  var callbackName = 'onK10_' + button + '_' + eventCap;

  ensureK10(generator);

  // Forward declare and define callback function
  generator.addVariable(callbackName + '_decl', 'void ' + callbackName + '();');
  var functionDef = 'void ' + callbackName + '() {\n' + handlerCode + '}\n';
  generator.addFunction(callbackName, functionDef);

  // Register callback in setup
  generator.addSetupEnd(callbackName + '_reg', 'k10.' + button + '->' + setterName + '(' + callbackName + ');');

  return '';
};
