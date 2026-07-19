function tm1650EnsureLibrary(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('AilyTM1650', '#include <AilyTM1650.h>');
}

function tm1650VariableName(block) {
  const field = block.getField('VAR');
  return field ? field.getText() : 'display';
}

function tm1650AttachRenameMonitor(block, varName) {
  if (block._varMonitorAttached) {
    return;
  }

  block._varMonitorAttached = true;
  block._varLastName = varName;
  registerVariableToBlockly(varName, 'TM1650Display');

  const field = block.getField('VAR');
  if (!field) {
    return;
  }

  const originalFinishEditing = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }
    const workspace = block.workspace ||
      (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace &&
        Blockly.getMainWorkspace());
    const oldName = block._varLastName;
    if (workspace && newName && newName !== oldName) {
      renameVariableInBlockly(
        block,
        oldName,
        newName,
        'TM1650Display'
      );
      block._varLastName = newName;
    }
  };
}

function tm1650AddWireSetup(generator, sda, scl) {
  const boardConfig = window['boardConfig'];
  const core = boardConfig && boardConfig.core ? boardConfig.core : '';
  let beginCode;

  if (core.indexOf('esp32') > -1 || core.indexOf('esp8266') > -1) {
    beginCode = 'Wire.begin(' + sda + ', ' + scl + ');';
  } else if (core) {
    beginCode = 'Wire.begin();';
  } else {
    beginCode =
      '#if defined(ARDUINO_ARCH_ESP32) || defined(ESP8266)\n' +
      'Wire.begin(' + sda + ', ' + scl + ');\n' +
      '#else\n' +
      'Wire.begin();\n' +
      '#endif';
  }

  generator.addSetupBegin(
    'tm1650_wire_begin',
    beginCode + '\nWire.setClock(100000);'
  );
}

function tm1650AddHardwareWireSetup(generator) {
  generator.addSetupBegin(
    'tm1650_wire_begin',
    'Wire.begin();\nWire.setClock(100000);'
  );
}

function tm1650AddDisplayObject(block, generator, varName, digits) {
  tm1650EnsureLibrary(generator);
  tm1650AttachRenameMonitor(block, varName);
  registerVariableToBlockly(varName, 'TM1650Display');
  generator.addObject(
    'tm1650_' + varName,
    'AilyTM1650 ' + varName + '(' + digits + ');'
  );
}

function tm1650BrightnessCode(generator, block) {
  return generator.valueToCode(
    block,
    'BRIGHTNESS',
    generator.ORDER_ATOMIC
  ) || '3';
}

Arduino.forBlock['tm1650_init_hardware'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'display';
  const digits = block.getFieldValue('DIGITS') || '4';
  const brightness = tm1650BrightnessCode(generator, block);

  tm1650AddDisplayObject(block, generator, varName, digits);
  tm1650AddHardwareWireSetup(generator);

  return varName + '.init();\n' +
    varName + '.setBrightness(constrain(' + brightness + ', 0, 7));\n';
};

Arduino.forBlock['tm1650_init'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'display';
  const digits = block.getFieldValue('DIGITS') || '4';
  const sda =
    generator.valueToCode(block, 'SDA', generator.ORDER_ATOMIC) || '8';
  const scl =
    generator.valueToCode(block, 'SCL', generator.ORDER_ATOMIC) || '9';
  const brightness =
    generator.valueToCode(block, 'BRIGHTNESS', generator.ORDER_ATOMIC) || '3';

  tm1650AddDisplayObject(block, generator, varName, digits);
  tm1650AddWireSetup(generator, sda, scl);

  return varName + '.init();\n' +
    varName + '.setBrightness(constrain(' + brightness + ', 0, 7));\n';
};

Arduino.forBlock['tm1650_show_text'] = function(block, generator) {
  const varName = tm1650VariableName(block);
  const value =
    generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  tm1650EnsureLibrary(generator);
  return varName + '.displayValue(String(' + value + '));\n';
};

Arduino.forBlock['tm1650_show_number'] = function(block, generator) {
  const varName = tm1650VariableName(block);
  const value =
    generator.valueToCode(block, 'NUMBER', generator.ORDER_ATOMIC) || '0';
  const decimals = block.getFieldValue('DECIMALS') || '0';
  tm1650EnsureLibrary(generator);
  return varName + '.displayNumber(' + value + ', ' + decimals + ');\n';
};

Arduino.forBlock['tm1650_clear'] = function(block, generator) {
  const varName = tm1650VariableName(block);
  tm1650EnsureLibrary(generator);
  return varName + '.clear();\n';
};

Arduino.forBlock['tm1650_set_dot'] = function(block, generator) {
  const varName = tm1650VariableName(block);
  const position =
    generator.valueToCode(block, 'POSITION', generator.ORDER_ATOMIC) || '1';
  const state =
    generator.valueToCode(block, 'STATE', generator.ORDER_ATOMIC) || 'true';
  tm1650EnsureLibrary(generator);
  return varName + '.setDecimalPoint(' + position + ', ' + state + ');\n';
};

Arduino.forBlock['tm1650_set_brightness'] = function(block, generator) {
  const varName = tm1650VariableName(block);
  const mode = block.getFieldValue('MODE') || 'IMMEDIATE';
  const brightness =
    generator.valueToCode(block, 'BRIGHTNESS', generator.ORDER_ATOMIC) || '3';
  const method = mode === 'GRADUAL' ?
    'setBrightnessGradually' : 'setBrightness';
  tm1650EnsureLibrary(generator);
  return varName + '.' + method + '(constrain(' + brightness + ', 0, 7));\n';
};

Arduino.forBlock['tm1650_set_power'] = function(block, generator) {
  const varName = tm1650VariableName(block);
  const state =
    generator.valueToCode(block, 'STATE', generator.ORDER_ATOMIC) || 'true';
  tm1650EnsureLibrary(generator);
  return varName + '.displayState(' + state + ');\n';
};

Arduino.forBlock['tm1650_scroll_start'] = function(block, generator) {
  const varName = tm1650VariableName(block);
  const text =
    generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  tm1650EnsureLibrary(generator);
  return [
    varName + '.startScroll(String(' + text + '))',
    generator.ORDER_ATOMIC
  ];
};

Arduino.forBlock['tm1650_scroll_next'] = function(block, generator) {
  const varName = tm1650VariableName(block);
  tm1650EnsureLibrary(generator);
  return [varName + '.scrollNext()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['tm1650_scroll_text'] = function(block, generator) {
  const varName = tm1650VariableName(block);
  const text =
    generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  const delayMs =
    generator.valueToCode(block, 'DELAY', generator.ORDER_ATOMIC) || '500';
  const helper =
    'void ailyTm1650Scroll(AilyTM1650 &display, const String &text, ' +
    'unsigned long delayMs) {\n' +
    '  int remaining = display.startScroll(text);\n' +
    '  while (remaining > 0) {\n' +
    '    delay(delayMs);\n' +
    '    remaining = display.scrollNext();\n' +
    '  }\n' +
    '}';
  tm1650EnsureLibrary(generator);
  generator.addFunction('aily_tm1650_scroll', helper);
  return 'ailyTm1650Scroll(' + varName + ', String(' + text + '), ' +
    delayMs + ');\n';
};

Arduino.forBlock['tm1650_set_segments'] = function(block, generator) {
  const varName = tm1650VariableName(block);
  const position =
    generator.valueToCode(block, 'POSITION', generator.ORDER_ATOMIC) || '1';
  const segments =
    generator.valueToCode(block, 'SEGMENTS', generator.ORDER_ATOMIC) || '0';
  tm1650EnsureLibrary(generator);
  return varName + '.setSegments(' + position + ', ' + segments + ');\n';
};

Arduino.forBlock['tm1650_set_control'] = function(block, generator) {
  const varName = tm1650VariableName(block);
  const position =
    generator.valueToCode(block, 'POSITION', generator.ORDER_ATOMIC) || '1';
  const value =
    generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
  tm1650EnsureLibrary(generator);
  return varName + '.setControl(' + position + ', ' + value + ');\n';
};

Arduino.forBlock['tm1650_get_segments'] = function(block, generator) {
  const varName = tm1650VariableName(block);
  const position =
    generator.valueToCode(block, 'POSITION', generator.ORDER_ATOMIC) || '1';
  tm1650EnsureLibrary(generator);
  return [
    varName + '.getSegments(' + position + ')',
    generator.ORDER_ATOMIC
  ];
};

Arduino.forBlock['tm1650_get_brightness'] = function(block, generator) {
  const varName = tm1650VariableName(block);
  tm1650EnsureLibrary(generator);
  return [varName + '.getBrightness()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['tm1650_get_digits'] = function(block, generator) {
  const varName = tm1650VariableName(block);
  tm1650EnsureLibrary(generator);
  return [varName + '.getNumPositions()', generator.ORDER_ATOMIC];
};
