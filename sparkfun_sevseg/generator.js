function sevsegEnsureLibrary(generator) {
  generator.addLibrary('SevSeg', '#include <SevSeg.h>');
}

function sevsegGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'display');
}

function sevsegAttachVar(block) {
  if (block._sevsegVarAttached) return;
  block._sevsegVarAttached = true;
  block._sevsegVarLastName = block.getFieldValue('VAR') || 'display';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._sevsegVarLastName, 'SevSeg');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var oldFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof oldFinish === 'function') oldFinish.call(this, newName);
    if (newName && newName !== block._sevsegVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._sevsegVarLastName, newName, 'SevSeg');
      block._sevsegVarLastName = newName;
    }
  };
}

function sevsegValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function sevsegEnsureTextHelper(generator) {
  generator.addFunction('sevseg_display_text_helper', 'void sevsegDisplayText(SevSeg &display, String text, byte decimalPlace) {\n  char buffer[10];\n  text.toCharArray(buffer, sizeof(buffer));\n  display.DisplayString(buffer, decimalPlace);\n}\n');
}

Arduino.forBlock['sevseg_init'] = function(block, generator) {
  sevsegAttachVar(block);
  sevsegEnsureLibrary(generator);
  var varName = block.getFieldValue('VAR') || 'display';
  var mode = block.getFieldValue('MODE') || 'COMMON_CATHODE';
  var digits = sevsegValue(block, generator, 'DIGITS', '4');
  var d1 = sevsegValue(block, generator, 'D1', '2');
  var d2 = sevsegValue(block, generator, 'D2', '3');
  var d3 = sevsegValue(block, generator, 'D3', '4');
  var d4 = sevsegValue(block, generator, 'D4', '5');
  var a = sevsegValue(block, generator, 'A', '6');
  var b = sevsegValue(block, generator, 'B', '7');
  var c = sevsegValue(block, generator, 'C', '8');
  var d = sevsegValue(block, generator, 'D', '9');
  var e = sevsegValue(block, generator, 'E', '10');
  var f = sevsegValue(block, generator, 'F', '11');
  var g = sevsegValue(block, generator, 'G', '12');
  var dp = sevsegValue(block, generator, 'DP', '13');
  var brightness = sevsegValue(block, generator, 'BRIGHTNESS', '100');
  generator.addVariable(varName, 'SevSeg ' + varName + ';');
  return varName + '.Begin(' + mode + ', ' + digits + ', ' + d1 + ', ' + d2 + ', ' + d3 + ', ' + d4 + ', ' + a + ', ' + b + ', ' + c + ', ' + d + ', ' + e + ', ' + f + ', ' + g + ', ' + dp + ');\n' + varName + '.SetBrightness(' + brightness + ');\n';
};

Arduino.forBlock['sevseg_display_text'] = function(block, generator) {
  sevsegEnsureLibrary(generator);
  sevsegEnsureTextHelper(generator);
  var varName = sevsegGetVar(block);
  var text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '"0000"';
  var decimal = sevsegValue(block, generator, 'DECIMAL', '0');
  return 'sevsegDisplayText(' + varName + ', String(' + text + '), ' + decimal + ');\n';
};

Arduino.forBlock['sevseg_set_brightness'] = function(block, generator) {
  var brightness = sevsegValue(block, generator, 'BRIGHTNESS', '100');
  return sevsegGetVar(block) + '.SetBrightness(' + brightness + ');\n';
};