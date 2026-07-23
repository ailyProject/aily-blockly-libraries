'use strict';

const FLUXGARAGE_ROBOEYES_TYPE = 'FluxGarageRoboEyes';

function fluxGarageRoboEyesEnsureLibrary(generator) {
  generator.addLibrary('FluxGarage_RoboEyes', '#include <FluxGarage_RoboEyes.h>');
}

function fluxGarageRoboEyesScreenConfig(screen) {
  const screens = {
    SSD1306_128X64: {
      className: 'Adafruit_SSD1306',
      header: 'Adafruit_SSD1306',
      width: 128,
      height: 64
    },
    SSD1306_128X32: {
      className: 'Adafruit_SSD1306',
      header: 'Adafruit_SSD1306',
      width: 128,
      height: 32
    },
    SH1106G_128X64: {
      className: 'Adafruit_SH1106G',
      header: 'Adafruit_SH110X',
      width: 128,
      height: 64
    }
  };
  return screens[screen] || screens.SSD1306_128X64;
}

function fluxGarageRoboEyesSafeIdentifier(value, fallback) {
  let name = String(value || fallback || 'roboEyes')
    .replace(/[^A-Za-z0-9_]/g, '_');
  if (!name) name = fallback || 'roboEyes';
  if (/^[0-9]/.test(name)) name = '_' + name;
  return name;
}

function fluxGarageRoboEyesGetFieldVariable(block) {
  const field = block.getField('VAR');
  const value = field && typeof field.getText === 'function'
    ? field.getText()
    : block.getFieldValue('VAR');
  return fluxGarageRoboEyesSafeIdentifier(value, 'roboEyes');
}

function fluxGarageRoboEyesGetValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function fluxGarageRoboEyesAddObject(generator, rawVarName, displayName, displayDeclaration) {
  const varName = fluxGarageRoboEyesSafeIdentifier(rawVarName, 'roboEyes');

  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(rawVarName, FLUXGARAGE_ROBOEYES_TYPE);
  }
  generator.addObject(
    'fluxgarage_roboeyes_display_' + displayName,
    displayDeclaration
  );
  generator.addObject(
    'fluxgarage_roboeyes_object_' + varName,
    'RoboEyes<decltype(' + displayName + ')> ' + varName + '(' + displayName + ');'
  );
  generator.addLoopBegin(
    'fluxgarage_roboeyes_update_' + varName,
    varName + '.update();'
  );

  return varName;
}

function fluxGarageRoboEyesAttachRenameMonitor(block) {
  if (block._fluxGarageRoboEyesVarMonitorAttached) return;
  block._fluxGarageRoboEyesVarMonitorAttached = true;
  block._fluxGarageRoboEyesVarLastName = block.getFieldValue('VAR') || 'roboEyes';

  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(
      block._fluxGarageRoboEyesVarLastName,
      FLUXGARAGE_ROBOEYES_TYPE
    );
  }

  const varField = block.getField('VAR');
  if (!varField) return;

  const originalFinishEditing = varField.onFinishEditing_;
  varField.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, newName);
    }
    const workspace = block.workspace || (
      typeof Blockly !== 'undefined' &&
      Blockly.getMainWorkspace &&
      Blockly.getMainWorkspace()
    );
    const oldName = block._fluxGarageRoboEyesVarLastName;
    if (
      workspace &&
      newName &&
      newName !== oldName &&
      typeof renameVariableInBlockly === 'function'
    ) {
      renameVariableInBlockly(
        block,
        oldName,
        newName,
        FLUXGARAGE_ROBOEYES_TYPE
      );
      block._fluxGarageRoboEyesVarLastName = newName;
    }
  };
}

Arduino.forBlock['fluxgarage_roboeyes_i2c_init'] = function(block, generator) {
  fluxGarageRoboEyesAttachRenameMonitor(block);

  const rawVarName = block.getFieldValue('VAR') || 'roboEyes';
  const displayName = fluxGarageRoboEyesSafeIdentifier(
    block.getFieldValue('DISPLAY'),
    'display'
  );
  const screen = block.getFieldValue('SCREEN') || 'SSD1306_128X64';
  const config = fluxGarageRoboEyesScreenConfig(screen);
  const address = fluxGarageRoboEyesGetValue(block, generator, 'ADDRESS', '0x3C');
  const rst = fluxGarageRoboEyesGetValue(block, generator, 'RST', '-1');
  const fps = fluxGarageRoboEyesGetValue(block, generator, 'FPS', '60');

  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
  generator.addLibrary(config.header, '#include <' + config.header + '.h>');
  fluxGarageRoboEyesEnsureLibrary(generator);

  const displayDeclaration = config.className + ' ' + displayName + '(' +
    config.width + ', ' + config.height + ', &Wire, ' + rst + ');';
  const varName = fluxGarageRoboEyesAddObject(
    generator,
    rawVarName,
    displayName,
    displayDeclaration
  );
  const displayBegin = config.className === 'Adafruit_SSD1306'
    ? displayName + '.begin(SSD1306_SWITCHCAPVCC, ' + address + ');\n'
    : displayName + '.begin(' + address + ', true);\n';

  return displayBegin + varName + '.begin(' + config.width + ', ' +
    config.height + ', ' + fps + ');\n';
};

Arduino.forBlock['fluxgarage_roboeyes_spi_init'] = function(block, generator) {
  fluxGarageRoboEyesAttachRenameMonitor(block);

  const rawVarName = block.getFieldValue('VAR') || 'roboEyes';
  const displayName = fluxGarageRoboEyesSafeIdentifier(
    block.getFieldValue('DISPLAY'),
    'display'
  );
  const screen = block.getFieldValue('SCREEN') || 'SSD1306_128X64';
  const config = fluxGarageRoboEyesScreenConfig(screen);
  const dc = fluxGarageRoboEyesGetValue(block, generator, 'DC', '9');
  const cs = fluxGarageRoboEyesGetValue(block, generator, 'CS', '10');
  const rst = fluxGarageRoboEyesGetValue(block, generator, 'RST', '-1');
  const fps = fluxGarageRoboEyesGetValue(block, generator, 'FPS', '60');

  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('Adafruit_GFX', '#include <Adafruit_GFX.h>');
  generator.addLibrary(config.header, '#include <' + config.header + '.h>');
  fluxGarageRoboEyesEnsureLibrary(generator);

  const displayDeclaration = config.className + ' ' + displayName + '(' +
    config.width + ', ' + config.height + ', &SPI, ' + dc + ', ' + rst +
    ', ' + cs + ');';
  const varName = fluxGarageRoboEyesAddObject(
    generator,
    rawVarName,
    displayName,
    displayDeclaration
  );
  const displayBegin = config.className === 'Adafruit_SSD1306'
    ? displayName + '.begin(SSD1306_SWITCHCAPVCC);\n'
    : displayName + '.begin(0, true);\n';

  return displayBegin + varName + '.begin(' + config.width + ', ' +
    config.height + ', ' + fps + ');\n';
};

Arduino.forBlock['fluxgarage_roboeyes_init'] = function(block, generator) {
  fluxGarageRoboEyesAttachRenameMonitor(block);

  const rawVarName = block.getFieldValue('VAR') || 'roboEyes';
  const varName = fluxGarageRoboEyesSafeIdentifier(rawVarName, 'roboEyes');
  const displayName = fluxGarageRoboEyesSafeIdentifier(
    block.getFieldValue('DISPLAY'),
    'display'
  );
  const width = fluxGarageRoboEyesGetValue(block, generator, 'WIDTH', '128');
  const height = fluxGarageRoboEyesGetValue(block, generator, 'HEIGHT', '64');
  const fps = fluxGarageRoboEyesGetValue(block, generator, 'FPS', '60');

  fluxGarageRoboEyesEnsureLibrary(generator);
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(rawVarName, FLUXGARAGE_ROBOEYES_TYPE);
  }
  generator.addObject(
    'fluxgarage_roboeyes_object_' + varName,
    'RoboEyes<decltype(' + displayName + ')> ' + varName + '(' + displayName + ');'
  );
  generator.addLoopBegin(
    'fluxgarage_roboeyes_update_' + varName,
    varName + '.update();'
  );

  return varName + '.begin(' + width + ', ' + height + ', ' + fps + ');\n';
};

Arduino.forBlock['fluxgarage_roboeyes_set_framerate'] = function(block, generator) {
  const varName = fluxGarageRoboEyesGetFieldVariable(block);
  const fps = fluxGarageRoboEyesGetValue(block, generator, 'FPS', '60');
  fluxGarageRoboEyesEnsureLibrary(generator);
  return varName + '.setFramerate(' + fps + ');\n';
};

Arduino.forBlock['fluxgarage_roboeyes_set_colors'] = function(block, generator) {
  const varName = fluxGarageRoboEyesGetFieldVariable(block);
  const background = fluxGarageRoboEyesGetValue(block, generator, 'BACKGROUND', '0');
  const main = fluxGarageRoboEyesGetValue(block, generator, 'MAIN', '1');
  fluxGarageRoboEyesEnsureLibrary(generator);
  return varName + '.setDisplayColors(' + background + ', ' + main + ');\n';
};

Arduino.forBlock['fluxgarage_roboeyes_set_dimensions'] = function(block, generator) {
  const varName = fluxGarageRoboEyesGetFieldVariable(block);
  const leftWidth = fluxGarageRoboEyesGetValue(block, generator, 'LEFT_WIDTH', '36');
  const rightWidth = fluxGarageRoboEyesGetValue(block, generator, 'RIGHT_WIDTH', '36');
  const leftHeight = fluxGarageRoboEyesGetValue(block, generator, 'LEFT_HEIGHT', '36');
  const rightHeight = fluxGarageRoboEyesGetValue(block, generator, 'RIGHT_HEIGHT', '36');
  fluxGarageRoboEyesEnsureLibrary(generator);
  return (
    varName + '.setWidth(' + leftWidth + ', ' + rightWidth + ');\n' +
    varName + '.setHeight(' + leftHeight + ', ' + rightHeight + ');\n'
  );
};

Arduino.forBlock['fluxgarage_roboeyes_set_border_radius'] = function(block, generator) {
  const varName = fluxGarageRoboEyesGetFieldVariable(block);
  const left = fluxGarageRoboEyesGetValue(block, generator, 'LEFT', '8');
  const right = fluxGarageRoboEyesGetValue(block, generator, 'RIGHT', '8');
  fluxGarageRoboEyesEnsureLibrary(generator);
  return varName + '.setBorderradius(' + left + ', ' + right + ');\n';
};

Arduino.forBlock['fluxgarage_roboeyes_set_spacing'] = function(block, generator) {
  const varName = fluxGarageRoboEyesGetFieldVariable(block);
  const space = fluxGarageRoboEyesGetValue(block, generator, 'SPACE', '10');
  fluxGarageRoboEyesEnsureLibrary(generator);
  return varName + '.setSpacebetween(' + space + ');\n';
};

Arduino.forBlock['fluxgarage_roboeyes_set_mood'] = function(block, generator) {
  const varName = fluxGarageRoboEyesGetFieldVariable(block);
  const mood = block.getFieldValue('MOOD') || 'DEFAULT';
  fluxGarageRoboEyesEnsureLibrary(generator);
  return varName + '.setMood(' + mood + ');\n';
};

Arduino.forBlock['fluxgarage_roboeyes_set_position'] = function(block, generator) {
  const varName = fluxGarageRoboEyesGetFieldVariable(block);
  const position = block.getFieldValue('POSITION') || 'DEFAULT';
  fluxGarageRoboEyesEnsureLibrary(generator);
  return varName + '.setPosition(' + position + ');\n';
};

Arduino.forBlock['fluxgarage_roboeyes_set_feature'] = function(block, generator) {
  const varName = fluxGarageRoboEyesGetFieldVariable(block);
  const feature = block.getFieldValue('FEATURE') || 'CURIOSITY';
  const enabled = fluxGarageRoboEyesGetValue(block, generator, 'ENABLED', 'true');
  const methods = {
    CURIOSITY: 'setCuriosity',
    CYCLOPS: 'setCyclops',
    SWEAT: 'setSweat'
  };
  fluxGarageRoboEyesEnsureLibrary(generator);
  return varName + '.' + (methods[feature] || methods.CURIOSITY) + '(' + enabled + ');\n';
};

Arduino.forBlock['fluxgarage_roboeyes_set_flicker'] = function(block, generator) {
  const varName = fluxGarageRoboEyesGetFieldVariable(block);
  const axis = block.getFieldValue('AXIS') || 'HORIZONTAL';
  const enabled = fluxGarageRoboEyesGetValue(block, generator, 'ENABLED', 'true');
  const amplitude = fluxGarageRoboEyesGetValue(block, generator, 'AMPLITUDE', '2');
  const method = axis === 'VERTICAL' ? 'setVFlicker' : 'setHFlicker';
  fluxGarageRoboEyesEnsureLibrary(generator);
  return varName + '.' + method + '(' + enabled + ', ' + amplitude + ');\n';
};

Arduino.forBlock['fluxgarage_roboeyes_set_autoblinker'] = function(block, generator) {
  const varName = fluxGarageRoboEyesGetFieldVariable(block);
  const enabled = fluxGarageRoboEyesGetValue(block, generator, 'ENABLED', 'true');
  const interval = fluxGarageRoboEyesGetValue(block, generator, 'INTERVAL', '3');
  const variation = fluxGarageRoboEyesGetValue(block, generator, 'VARIATION', '2');
  fluxGarageRoboEyesEnsureLibrary(generator);
  return varName + '.setAutoblinker(' + enabled + ', ' + interval + ', ' + variation + ');\n';
};

Arduino.forBlock['fluxgarage_roboeyes_set_idle_mode'] = function(block, generator) {
  const varName = fluxGarageRoboEyesGetFieldVariable(block);
  const enabled = fluxGarageRoboEyesGetValue(block, generator, 'ENABLED', 'true');
  const interval = fluxGarageRoboEyesGetValue(block, generator, 'INTERVAL', '2');
  const variation = fluxGarageRoboEyesGetValue(block, generator, 'VARIATION', '2');
  fluxGarageRoboEyesEnsureLibrary(generator);
  return varName + '.setIdleMode(' + enabled + ', ' + interval + ', ' + variation + ');\n';
};

Arduino.forBlock['fluxgarage_roboeyes_eye_action'] = function(block, generator) {
  const varName = fluxGarageRoboEyesGetFieldVariable(block);
  const action = block.getFieldValue('ACTION') || 'OPEN';
  const target = block.getFieldValue('TARGET') || 'BOTH';
  const methods = {
    OPEN: 'open',
    CLOSE: 'close',
    BLINK: 'blink'
  };
  const method = methods[action] || methods.OPEN;
  let args = '';
  if (target === 'LEFT') args = 'true, false';
  if (target === 'RIGHT') args = 'false, true';
  fluxGarageRoboEyesEnsureLibrary(generator);
  return varName + '.' + method + '(' + args + ');\n';
};

Arduino.forBlock['fluxgarage_roboeyes_play_animation'] = function(block, generator) {
  const varName = fluxGarageRoboEyesGetFieldVariable(block);
  const animation = block.getFieldValue('ANIMATION') || 'CONFUSED';
  const method = animation === 'LAUGH' ? 'anim_laugh' : 'anim_confused';
  fluxGarageRoboEyesEnsureLibrary(generator);
  return varName + '.' + method + '();\n';
};

Arduino.forBlock['fluxgarage_roboeyes_refresh'] = function(block, generator) {
  const varName = fluxGarageRoboEyesGetFieldVariable(block);
  const mode = block.getFieldValue('MODE') || 'UPDATE';
  const method = mode === 'DRAW' ? 'drawEyes' : 'update';
  fluxGarageRoboEyesEnsureLibrary(generator);
  return varName + '.' + method + '();\n';
};

Arduino.forBlock['fluxgarage_roboeyes_get_constraint'] = function(block, generator) {
  const varName = fluxGarageRoboEyesGetFieldVariable(block);
  const axis = block.getFieldValue('AXIS') || 'X';
  const method = axis === 'Y' ? 'getScreenConstraint_Y' : 'getScreenConstraint_X';
  fluxGarageRoboEyesEnsureLibrary(generator);
  return [varName + '.' + method + '()', generator.ORDER_ATOMIC];
};
