'use strict';

function seeedCanAddLibrary(generator) {
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('Seeed_CAN', '#include <mcp2515_can.h>');
}

function seeedCanOrder(generator, name, fallback) {
  if (generator && typeof generator[name] === 'number') {
    return generator[name];
  }
  if (typeof Arduino !== 'undefined' && typeof Arduino[name] === 'number') {
    return Arduino[name];
  }
  return fallback;
}

function seeedCanFieldText(block, fieldName, fallback) {
  var field = block.getField(fieldName);
  if (field && typeof field.getText === 'function') {
    var text = field.getText();
    if (text) {
      return text;
    }
  }

  var value = block.getFieldValue(fieldName);
  return value || fallback;
}

function seeedCanRegisterVariable(varName, varType) {
  if (typeof globalThis !== 'undefined' && typeof globalThis.registerVariableToBlockly === 'function') {
    globalThis.registerVariableToBlockly(varName, varType);
  }
}

function seeedCanRenameVariable(block, oldName, newName, varType) {
  if (typeof globalThis !== 'undefined' && typeof globalThis.renameVariableInBlockly === 'function') {
    globalThis.renameVariableInBlockly(block, oldName, newName, varType);
  }
}

function seeedCanAttachVarMonitor(block, varType) {
  if (block._seeedCanVarMonitorAttached) {
    return;
  }

  block._seeedCanVarMonitorAttached = true;
  block._seeedCanVarLastName = seeedCanFieldText(block, 'VAR', 'can');
  seeedCanRegisterVariable(block._seeedCanVarLastName, varType);

  var varField = block.getField('VAR');
  if (!varField) {
    return;
  }

  var originalFinishEditing = varField.onFinishEditing_;
  varField.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }

    var workspace = block.workspace ||
      (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
    var oldName = block._seeedCanVarLastName;
    var nextName = newName || seeedCanFieldText(block, 'VAR', oldName);

    if (workspace && nextName && nextName !== oldName) {
      seeedCanRenameVariable(block, oldName, nextName, varType);
    }

    if (nextName) {
      block._seeedCanVarLastName = nextName;
    }
  };
}

function seeedCanUnquoteStringLiteral(code) {
  var trimmed = (code || '').trim();
  if (trimmed.length < 2) {
    return null;
  }

  var quote = trimmed.charAt(0);
  if ((quote !== '"' && quote !== "'") || trimmed.charAt(trimmed.length - 1) !== quote) {
    return null;
  }

  return trimmed.slice(1, -1)
    .replace(/\\(["'\\])/g, '$1')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t');
}

function seeedCanDataInitializer(dataCode) {
  var code = (dataCode || '').trim();
  if (!code) {
    return '{0,0,0,0,0,0,0,0}';
  }

  if (code.charAt(0) === '{' && code.charAt(code.length - 1) === '}') {
    return code;
  }

  var text = seeedCanUnquoteStringLiteral(code);
  if (text === null) {
    return null;
  }

  var trimmedText = text.trim();
  if (trimmedText.charAt(0) === '{' && trimmedText.charAt(trimmedText.length - 1) === '}') {
    return trimmedText;
  }

  if (trimmedText.indexOf(',') !== -1) {
    return '{' + trimmedText + '}';
  }

  return null;
}

function seeedCanTempName(block, name) {
  var id = block && block.id ? String(block.id) : 'tmp';
  return 'seeed_can_' + name + '_' + id.replace(/[^A-Za-z0-9_]/g, '_');
}

Arduino.forBlock['seeed_can_create'] = function(block, generator) {
  var varName = seeedCanFieldText(block, 'VAR', 'can');
  var csPin = block.getFieldValue('CS_PIN') || '9';

  seeedCanAttachVarMonitor(block, 'MCP_CAN');
  seeedCanAddLibrary(generator);

  generator.addVariable(varName, 'mcp2515_can ' + varName + '(' + csPin + ');');
  return '';
};

Arduino.forBlock['seeed_can_begin'] = function(block, generator) {
  var varName = seeedCanFieldText(block, 'VAR', 'can');
  var speed = block.getFieldValue('SPEED') || 'CAN_5KBPS';
  var clock = block.getFieldValue('CLOCK') || 'MCP_8MHz';

  seeedCanAddLibrary(generator);
  return varName + '.begin(' + speed + ', ' + clock + ');\n';
};

Arduino.forBlock['seeed_can_send'] = function(block, generator) {
  var varName = seeedCanFieldText(block, 'VAR', 'can');
  var atomicOrder = seeedCanOrder(generator, 'ORDER_ATOMIC', 0);
  var id = generator.valueToCode(block, 'ID', atomicOrder) || '0x00';
  var ext = block.getFieldValue('EXT') || '0';
  var data = generator.valueToCode(block, 'DATA', atomicOrder) || '{0,0,0,0,0,0,0,0}';
  var initializer = seeedCanDataInitializer(data);
  var dataExpr = data;
  var code = '';

  seeedCanAddLibrary(generator);

  if (initializer) {
    dataExpr = seeedCanTempName(block, 'data');
    code += 'byte ' + dataExpr + '[8] = ' + initializer + ';\n';
  }

  code += varName + '.sendMsgBuf(' + id + ', ' + ext + ', 8, ' + dataExpr + ');\n';
  return code;
};

Arduino.forBlock['seeed_can_receive_check'] = function(block, generator) {
  var varName = seeedCanFieldText(block, 'VAR', 'can');
  var equalityOrder = seeedCanOrder(
    generator,
    'ORDER_EQUALITY',
    seeedCanOrder(generator, 'ORDER_FUNCTION_CALL', 0)
  );

  seeedCanAddLibrary(generator);
  return ['(' + varName + '.checkReceive() == CAN_MSGAVAIL)', equalityOrder];
};

Arduino.forBlock['seeed_can_receive'] = function(block, generator) {
  var varName = seeedCanFieldText(block, 'VAR', 'can');
  var lenVar = seeedCanFieldText(block, 'LEN', 'len');
  var idVar = seeedCanFieldText(block, 'ID', 'id');
  var dataVar = seeedCanFieldText(block, 'DATA', 'data');

  seeedCanAddLibrary(generator);

  generator.addVariable(lenVar, 'byte ' + lenVar + ' = 0;');
  generator.addVariable(dataVar, 'byte ' + dataVar + '[8];');
  generator.addVariable(idVar, 'unsigned long ' + idVar + ' = 0;');

  return varName + '.readMsgBuf(&' + lenVar + ', ' + dataVar + ');\n' +
    idVar + ' = ' + varName + '.getCanId();\n';
};

Arduino.forBlock['seeed_can_get_id'] = function(block, generator) {
  var varName = seeedCanFieldText(block, 'VAR', 'can');
  var functionOrder = seeedCanOrder(generator, 'ORDER_FUNCTION_CALL', 0);

  seeedCanAddLibrary(generator);
  return [varName + '.getCanId()', functionOrder];
};

Arduino.forBlock['seeed_can_init_mask'] = function(block, generator) {
  var varName = seeedCanFieldText(block, 'VAR', 'can');
  var atomicOrder = seeedCanOrder(generator, 'ORDER_ATOMIC', 0);
  var num = block.getFieldValue('NUM') || '0';
  var ext = block.getFieldValue('EXT') || '0';
  var mask = generator.valueToCode(block, 'MASK', atomicOrder) || '0x000';

  seeedCanAddLibrary(generator);
  return varName + '.init_Mask(' + num + ', ' + ext + ', ' + mask + ');\n';
};

Arduino.forBlock['seeed_can_init_filter'] = function(block, generator) {
  var varName = seeedCanFieldText(block, 'VAR', 'can');
  var atomicOrder = seeedCanOrder(generator, 'ORDER_ATOMIC', 0);
  var num = block.getFieldValue('NUM') || '0';
  var ext = block.getFieldValue('EXT') || '0';
  var filter = generator.valueToCode(block, 'FILTER', atomicOrder) || '0x000';

  seeedCanAddLibrary(generator);
  return varName + '.init_Filt(' + num + ', ' + ext + ', ' + filter + ');\n';
};

Arduino.forBlock['seeed_can_set_mode'] = function(block, generator) {
  var varName = seeedCanFieldText(block, 'VAR', 'can');
  var mode = block.getFieldValue('MODE') || 'MODE_NORMAL';

  if (mode === 'MODE_LISTEN') {
    mode = 'MODE_LISTENONLY';
  }

  seeedCanAddLibrary(generator);
  return varName + '.setMode(' + mode + ');\n';
};

Arduino.forBlock['seeed_can_sleep'] = function(block, generator) {
  var varName = seeedCanFieldText(block, 'VAR', 'can');

  seeedCanAddLibrary(generator);
  return varName + '.sleep();\n';
};

Arduino.forBlock['seeed_can_wake'] = function(block, generator) {
  var varName = seeedCanFieldText(block, 'VAR', 'can');

  seeedCanAddLibrary(generator);
  return varName + '.wake();\n';
};

Arduino.forBlock['seeed_can_check_error'] = function(block, generator) {
  var varName = seeedCanFieldText(block, 'VAR', 'can');
  var functionOrder = seeedCanOrder(generator, 'ORDER_FUNCTION_CALL', 0);

  seeedCanAddLibrary(generator);
  return [varName + '.checkError()', functionOrder];
};
