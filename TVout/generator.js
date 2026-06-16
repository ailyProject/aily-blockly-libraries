'use strict';

function tvoutEnsureLibrary(generator) {
  generator.addLibrary('TVout', '#include <TVout.h>');
  generator.addLibrary('TVoutFonts', '#include <fontALL.h>');
}

function tvoutGetVarName(block) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : 'TV';
}

function tvoutValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function tvoutRegisterVariable(block, varType) {
  if (block._tvoutVarMonitorAttached) return;

  block._tvoutVarMonitorAttached = true;
  block._tvoutVarLastName = block.getFieldValue('VAR') || 'TV';

  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._tvoutVarLastName, varType);
  }

  const varField = block.getField('VAR');
  if (!varField) return;

  const originalFinishEditing = varField.onFinishEditing_;
  varField.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }

    const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
    const oldName = block._tvoutVarLastName;
    if (workspace && newName && newName !== oldName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, oldName, newName, varType);
      block._tvoutVarLastName = newName;
    }
  };
}

Arduino.forBlock['tvout_begin'] = function(block, generator) {
  const varType = 'TVout';
  tvoutRegisterVariable(block, varType);

  const varName = block.getFieldValue('VAR') || 'TV';
  const mode = block.getFieldValue('MODE') || 'NTSC';
  const width = tvoutValue(block, generator, 'WIDTH', '120');
  const height = tvoutValue(block, generator, 'HEIGHT', '96');
  const font = block.getFieldValue('FONT') || 'font6x8';

  tvoutEnsureLibrary(generator);
  generator.addObject(varName, 'TVout ' + varName + ';');

  return varName + '.begin(' + mode + ', ' + width + ', ' + height + ');\n' +
    varName + '.select_font(' + font + ');\n';
};

Arduino.forBlock['tvout_end'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  return varName + '.end();\n';
};

Arduino.forBlock['tvout_select_font'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  const font = block.getFieldValue('FONT') || 'font6x8';
  return varName + '.select_font(' + font + ');\n';
};

Arduino.forBlock['tvout_clear'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  return varName + '.fill(BLACK);\n';
};

Arduino.forBlock['tvout_fill'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  const color = block.getFieldValue('COLOR') || 'BLACK';
  return varName + '.fill(' + color + ');\n';
};

Arduino.forBlock['tvout_set_pixel'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  const x = tvoutValue(block, generator, 'X', '0');
  const y = tvoutValue(block, generator, 'Y', '0');
  const color = block.getFieldValue('COLOR') || 'WHITE';
  return varName + '.set_pixel(' + x + ', ' + y + ', ' + color + ');\n';
};

Arduino.forBlock['tvout_get_pixel'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  const x = tvoutValue(block, generator, 'X', '0');
  const y = tvoutValue(block, generator, 'Y', '0');
  return [varName + '.get_pixel(' + x + ', ' + y + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['tvout_draw_line'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  const x0 = tvoutValue(block, generator, 'X0', '0');
  const y0 = tvoutValue(block, generator, 'Y0', '0');
  const x1 = tvoutValue(block, generator, 'X1', '10');
  const y1 = tvoutValue(block, generator, 'Y1', '10');
  const color = block.getFieldValue('COLOR') || 'WHITE';
  return varName + '.draw_line(' + x0 + ', ' + y0 + ', ' + x1 + ', ' + y1 + ', ' + color + ');\n';
};

Arduino.forBlock['tvout_draw_rect'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  const x = tvoutValue(block, generator, 'X', '0');
  const y = tvoutValue(block, generator, 'Y', '0');
  const width = tvoutValue(block, generator, 'WIDTH', '16');
  const height = tvoutValue(block, generator, 'HEIGHT', '16');
  const color = block.getFieldValue('COLOR') || 'WHITE';
  const fill = block.getFieldValue('FILL') || 'NONE';
  const args = [x, y, width, height, color];
  if (fill !== 'NONE') args.push(fill);
  return varName + '.draw_rect(' + args.join(', ') + ');\n';
};

Arduino.forBlock['tvout_draw_circle'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  const x = tvoutValue(block, generator, 'X', '32');
  const y = tvoutValue(block, generator, 'Y', '32');
  const radius = tvoutValue(block, generator, 'RADIUS', '8');
  const color = block.getFieldValue('COLOR') || 'WHITE';
  const fill = block.getFieldValue('FILL') || 'NONE';
  const args = [x, y, radius, color];
  if (fill !== 'NONE') args.push(fill);
  return varName + '.draw_circle(' + args.join(', ') + ');\n';
};

Arduino.forBlock['tvout_shift'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  const distance = tvoutValue(block, generator, 'DISTANCE', '1');
  const direction = block.getFieldValue('DIRECTION') || 'UP';
  return varName + '.shift(' + distance + ', ' + direction + ');\n';
};

Arduino.forBlock['tvout_set_cursor'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  const x = tvoutValue(block, generator, 'X', '0');
  const y = tvoutValue(block, generator, 'Y', '0');
  return varName + '.set_cursor(' + x + ', ' + y + ');\n';
};

Arduino.forBlock['tvout_print'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  const text = tvoutValue(block, generator, 'TEXT', '""');
  return varName + '.print(' + text + ');\n';
};

Arduino.forBlock['tvout_println'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  const text = tvoutValue(block, generator, 'TEXT', '""');
  return varName + '.println(' + text + ');\n';
};

Arduino.forBlock['tvout_print_at'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  const x = tvoutValue(block, generator, 'X', '0');
  const y = tvoutValue(block, generator, 'Y', '0');
  const text = tvoutValue(block, generator, 'TEXT', '""');
  return varName + '.print(' + x + ', ' + y + ', ' + text + ');\n';
};

Arduino.forBlock['tvout_delay'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  const ms = tvoutValue(block, generator, 'MS', '1000');
  return varName + '.delay(' + ms + ');\n';
};

Arduino.forBlock['tvout_delay_frame'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  const frames = tvoutValue(block, generator, 'FRAMES', '1');
  return varName + '.delay_frame(' + frames + ');\n';
};

Arduino.forBlock['tvout_millis'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  return [varName + '.millis()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['tvout_resolution'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  const axis = block.getFieldValue('AXIS') || 'hres';
  return [varName + '.' + axis + '()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['tvout_tone'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  const frequency = tvoutValue(block, generator, 'FREQUENCY', '440');
  const duration = tvoutValue(block, generator, 'DURATION', '0');
  return varName + '.tone(' + frequency + ', ' + duration + ');\n';
};

Arduino.forBlock['tvout_no_tone'] = function(block, generator) {
  tvoutEnsureLibrary(generator);
  const varName = tvoutGetVarName(block);
  return varName + '.noTone();\n';
};
