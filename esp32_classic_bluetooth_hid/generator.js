// SPDX-License-Identifier: MIT
'use strict';

(function () {
  const prefix = 'esp32_classic_hid_';
  const device = 'ailyClassicHIDDevice';
  const status = 'ailyClassicHIDStatus';
  const ns = 'aily_classic_hid::';
  const initializers = {
    begin_keyboard: 'keyboard', begin_mouse: 'mouse', begin_combo: 'combo',
    begin_media: 'media', begin_gamepad: 'gamepad', begin_switch: 'switch'
  };
  const keyNames = {
    SPACE: '32', RETURN: 'Return', TAB: 'Tab', ESCAPE: 'Escape',
    BACKSPACE: 'Backspace', DELETE: 'Delete', LEFT: 'LeftArrow', RIGHT: 'RightArrow',
    UP: 'UpArrow', DOWN: 'DownArrow', HOME: 'Home', END: 'End',
    PAGE_UP: 'PageUp', PAGE_DOWN: 'PageDown',
    LEFT_CTRL: 'LeftCtrl', LEFT_SHIFT: 'LeftShift', LEFT_ALT: 'LeftAlt', LEFT_GUI: 'LeftGui',
    RIGHT_CTRL: 'RightCtrl', RIGHT_SHIFT: 'RightShift', RIGHT_ALT: 'RightAlt', RIGHT_GUI: 'RightGui'
  };
  for (let i = 1; i <= 12; ++i) keyNames['F' + i] = 'F' + i;
  const keys = {};
  for (const name of Object.keys(keyNames))
    keys[name] = name === 'SPACE' ? '32' : 'ESP32ClassicBluetoothKey::' + keyNames[name];
  for (let i = 0; i < 26; ++i) keys['ASCII_' + String.fromCharCode(65 + i)] = String(97 + i);
  for (let i = 0; i < 10; ++i) keys['DIGIT_' + i] = String(48 + i);
  const modifiers = {
    LEFT_CTRL: '1', LEFT_SHIFT: '2', LEFT_ALT: '4', LEFT_GUI: '8',
    RIGHT_CTRL: '16', RIGHT_SHIFT: '32', RIGHT_ALT: '64', RIGHT_GUI: '128',
    CTRL_SHIFT: '3', CTRL_ALT: '5', CTRL_ALT_SHIFT: '7', GUI_SHIFT: '10'
  };
  const mouseButtons = {
    LEFT: 'ESP32ClassicBluetoothMouseButton::Left', RIGHT: 'ESP32ClassicBluetoothMouseButton::Right',
    MIDDLE: 'ESP32ClassicBluetoothMouseButton::Middle', BACK: 'ESP32ClassicBluetoothMouseButton::Back',
    FORWARD: 'ESP32ClassicBluetoothMouseButton::Forward'
  };
  const switchButtons = {
    Y: 'Y', X: 'X', B: 'B', A: 'A', R: 'R', ZR: 'ZR', MINUS: 'Minus', PLUS: 'Plus',
    RIGHT_STICK: 'RightStick', LEFT_STICK: 'LeftStick', HOME: 'Home', CAPTURE: 'Capture',
    DOWN: 'Down', UP: 'Up', RIGHT: 'Right', LEFT: 'Left', L: 'L', ZL: 'ZL'
  };
  const media = {
    VOLUME_UP: '0x00E9', VOLUME_DOWN: '0x00EA', MUTE: '0x00E2', PLAY_PAUSE: '0x00CD',
    NEXT: '0x00B5', PREVIOUS: '0x00B6', STOP: '0x00B7'
  };
  function suffix(block) { return block.type.slice(prefix.length); }
  function family(block) {
    const id = suffix(block);
    if (Object.prototype.hasOwnProperty.call(initializers, id)) return 'init';
    return ['keyboard', 'mouse', 'media', 'gamepad', 'switch'].find(name => id.startsWith(name + '_')) || 'common';
  }
  function enabled(block) {
    if (block.isInFlyout) return false;
    for (let current = block; current; current = typeof current.getSurroundParent === 'function'
      ? current.getSurroundParent() : typeof current.getParent === 'function' ? current.getParent() : null)
      if ((typeof current.isEnabled === 'function' && !current.isEnabled()) || current.disabled === true) return false;
    return true;
  }
  // Arduino.init() creates a new codeDict for each generation. Mode decisions
  // must never survive that boundary, even when the workspace is reused.
  const contexts = new WeakMap();
  function comboHint(modes) {
    return modes.size > 1 && [...modes].every(mode => ['keyboard', 'mouse', 'combo'].includes(mode))
      ? ' Use only the keyboard/mouse combo initializer for both input channels.' : '';
  }
  function blockTypes(blocks) { return [...new Set(blocks.map(block => block.type))].sort().join(', '); }
  function context(block, generator) {
    const workspace = block.workspace;
    const canScan = workspace && typeof workspace.getAllBlocks === 'function' && !block.isInFlyout;
    const token = generator.codeDict;
    const canCache = canScan && token && typeof token === 'object' &&
      !(typeof block.isInsertionMarker === 'function' && block.isInsertionMarker());
    const cached = canCache && contexts.get(token);
    if (cached && cached.workspace === workspace) return cached.selected;
    let blocks = [block];
    if (canScan) {
      blocks = workspace.getAllBlocks(false).filter(item => item.type.startsWith(prefix) && enabled(item));
      if (!blocks.includes(block)) blocks.push(block);
    }
    const modes = new Set(blocks.filter(item => family(item) === 'init').map(item => initializers[suffix(item)]));
    if (modes.size > 1) throw new Error('Classic Bluetooth HID: use one device mode per workspace; initializers: ' +
      [...modes].sort().join(', ') + '.' + comboHint(modes));
    const families = new Set(blocks.map(family).filter(name => name !== 'common' && name !== 'init'));
    let mode = modes.size ? [...modes][0] : null;
    if (!mode) {
      if ([...families].every(name => name === 'keyboard' || name === 'mouse'))
        mode = families.size === 2 ? 'combo' : [...families][0] || 'keyboard';
      else if (families.size === 1) mode = [...families][0];
      else throw new Error('Classic Bluetooth HID: the selected device functions require incompatible modes: ' +
        [...families].sort().join(', ') + '. Blocks: ' + blockTypes(blocks.filter(item => family(item) !== 'common')) + '.');
    }
    const allowed = mode === 'combo' ? ['keyboard', 'mouse'] : [mode];
    const conflicting = blocks.filter(item => !['common', 'init', ...allowed].includes(family(item)));
    if (conflicting.length) throw new Error('Classic Bluetooth HID: selected functions do not match the initialization mode; ' +
      'initialized mode: ' + mode + '; conflicting functions: ' + [...new Set(conflicting.map(family))].sort().join(', ') +
      '. Blocks: ' + blockTypes(conflicting) + '.' + comboHint(new Set([mode, ...families])));
    generator.addLibrary('aily_classic_hid_profiles', '#include <AilyClassicHIDProfiles.h>');
    const declarations = {
      keyboard: 'ESP32ClassicBluetoothKeyboard ' + device + ';',
      mouse: 'ESP32ClassicBluetoothMouse ' + device + ';',
      combo: 'ESP32ClassicBluetoothKeyboardMouse ' + device + ';',
      media: ns + 'MediaKeys ' + device + ';',
      gamepad: ns + 'Gamepad ' + device + ';',
      switch: 'ESP32BluetoothSwitchProController& ' + device + ' = BluetoothSwitchProController;'
    };
    if (mode === 'switch') generator.addLibrary('aily_classic_hid_switch', '#include <ESP32BluetoothSwitchProController.h>');
    generator.addObject('aily_classic_hid_device', declarations[mode]);
    generator.addObject('aily_classic_hid_status', ns + 'Status ' + status + ';');
    generator.addLoopBegin('aily_classic_hid_update', device + '.update();');
    const selected = { mode, keyboard: mode === 'combo' ? device + '.keyboard' : device, mouse: mode === 'combo' ? device + '.mouse' : device };
    if (canCache) contexts.set(token, { workspace, selected });
    return selected;
  }
  function value(block, generator, name, fallback) {
    return generator.valueToCode(block, name, generator.ORDER_ATOMIC === undefined ? 0 : generator.ORDER_ATOMIC) || fallback;
  }
  function choice(block, name, table, fallback) {
    const key = block.getFieldValue(name) || fallback;
    if (!Object.prototype.hasOwnProperty.call(table, key)) throw new Error('Classic Bluetooth HID: invalid ' + name + ' option.');
    return table[key];
  }
  function index(block, name, low, high, fallback) {
    const raw = block.getFieldValue(name);
    const text = raw === null || raw === undefined || raw === '' ? String(fallback) : String(raw);
    const number = Number(text);
    if (!Number.isInteger(number) || number < low || number > high) throw new Error('Classic Bluetooth HID: invalid ' + name + ' index.');
    return String(number);
  }
  function action(expression, target) {
    return '{\n  const bool ailyClassicAccepted = ' + expression + ';\n  ' + status + '.record(ailyClassicAccepted, ' + target + '.lastError());\n}\n';
  }
  function switchAction(expression) {
    return 'if (!' + status + '.initialized || !' + device + '.isConnected()) {\n  ' + status + '.reject("Bluetooth HID peer is not connected");\n} else {\n  ' + expression + ';\n  ' + status + '.record(true);\n}\n';
  }
  function helper(name, args) { return ns + name + '(' + args.join(', ') + ');\n'; }
  function output(generator, code) { return [code, generator.ORDER_FUNCTION_CALL === undefined ? 2 : generator.ORDER_FUNCTION_CALL]; }
  function register(id, callback) {
    Arduino.forBlock[prefix + id] = function (block, generator) { return callback(block, generator, context(block, generator)); };
  }
  for (const id of Object.keys(initializers)) register(id, function (block, generator) {
    const defaults = { keyboard: 'ESP32 Keyboard', mouse: 'ESP32 Mouse', combo: 'ESP32 Keyboard Mouse', media: 'ESP32 Media Keys', gamepad: 'ESP32 Gamepad', switch: 'Pro Controller' };
    const name = value(block, generator, 'NAME', JSON.stringify(defaults[initializers[id]]));
    return '{\n  const String ailyClassicName = String(' + name + ');\n  const bool ailyClassicAccepted = ' + device + '.begin(ailyClassicName.c_str());\n  ' + status + '.beginResult(ailyClassicAccepted, ' + device + '.lastError());\n}\n';
  });
  register('connected', (block, generator) => output(generator, device + '.isConnected()'));
  register('last_init_ok', (block, generator) => output(generator, status + '.lastBeginOk'));
  register('last_ok', (block, generator) => output(generator, status + '.lastOk'));
  register('last_error', (block, generator) => output(generator, status + '.errorFor(' + device + ')'));
  register('update', () => device + '.update();\n');
  register('end', () => '{\n  const bool ailyClassicAccepted = ' + device + '.end();\n  ' + status + '.stopped(ailyClassicAccepted, ' + device + '.lastError());\n}\n');
  register('disconnect', () => action(device + '.disconnect()', device));
  register('unpair', () => action(device + '.unpair()', device));

  register('keyboard_text', (block, generator, selected) => helper('typeText', [selected.keyboard, status, 'String(' + value(block, generator, 'TEXT', '""') + ')', choice(block, 'ENDING', { PRINT: 'false', PRINTLN: 'true' }, 'PRINT')]));
  register('keyboard_key', (block, generator, selected) => {
    const method = choice(block, 'ACTION', { PRESS: 'press', RELEASE: 'release' }, 'PRESS');
    return action(selected.keyboard + '.' + method + '(' + choice(block, 'KEY', keys, 'ASCII_A') + ')', selected.keyboard);
  });
  register('keyboard_ascii', (block, generator, selected) => helper('asciiKey', [selected.keyboard, status, 'String(' + value(block, generator, 'CHAR', '"a"') + ')', choice(block, 'ACTION', { PRESS: 'true', RELEASE: 'false' }, 'PRESS')]));
  register('keyboard_raw', (block, generator, selected) => helper('rawKey', [selected.keyboard, status, value(block, generator, 'USAGE', '4'), choice(block, 'ACTION', { PRESS: 'true', RELEASE: 'false' }, 'PRESS')]));
  register('keyboard_shortcut', (block, generator, selected) => helper('shortcut', [selected.keyboard, status, choice(block, 'MODIFIER', modifiers, 'LEFT_CTRL'), choice(block, 'KEY', keys, 'ASCII_A')]));
  register('keyboard_release_all', (block, generator, selected) => action(selected.keyboard + '.releaseAll()', selected.keyboard));
  register('keyboard_led', (block, generator, selected) => output(generator, selected.keyboard + '.' + choice(block, 'LED', { NUM: 'numLock', CAPS: 'capsLock', SCROLL: 'scrollLock' }, 'CAPS') + '()'));

  register('mouse_move', (block, generator, selected) => helper('mouseMove', [selected.mouse, status, ...['X', 'Y', 'WHEEL'].map(name => value(block, generator, name, '0'))]));
  register('mouse_button', (block, generator, selected) => {
    const method = choice(block, 'ACTION', { PRESS: 'press', RELEASE: 'release', CLICK: 'click' }, 'CLICK');
    return action(selected.mouse + '.' + method + '(' + choice(block, 'BUTTON', mouseButtons, 'LEFT') + ')', selected.mouse);
  });
  register('mouse_release_all', (block, generator, selected) => action(selected.mouse + '.releaseAll()', selected.mouse));
  register('mouse_pressed', (block, generator, selected) => output(generator, selected.mouse + '.isPressed(' + choice(block, 'BUTTON', mouseButtons, 'LEFT') + ')'));

  register('media_tap', (block) => helper('mediaTap', [device, status, choice(block, 'KEY', media, 'PLAY_PAUSE')]));
  register('media_release_all', () => action(device + '.releaseAll()', device));
  register('media_busy', (block, generator) => output(generator, device + '.busy()'));

  register('gamepad_button', (block) => helper('gpButton', [device, status, index(block, 'BUTTON', 1, 16, 1), choice(block, 'ACTION', { PRESS: 'true', RELEASE: 'false' }, 'PRESS')]));
  register('gamepad_buttons', (block, generator) => helper('gpButtons', [device, status, value(block, generator, 'MASK', '0')]));
  register('gamepad_axes', (block, generator) => helper('gpAxes', [device, status, ...['X', 'Y', 'RX', 'RY'].map(name => value(block, generator, name, '0'))]));
  register('gamepad_hat', (block) => helper('gpHat', [device, status, index(block, 'DIRECTION', 0, 8, 8)]));
  register('gamepad_reset', () => action(device + '.reset()', device));
  register('gamepad_pressed', (block, generator) => output(generator, device + '.buttonPressed(' + index(block, 'BUTTON', 1, 16, 1) + ')'));

  register('switch_button', (block) => {
    const method = choice(block, 'ACTION', { PRESS: 'press', RELEASE: 'release' }, 'PRESS');
    return switchAction(device + '.' + method + '(switchpro::' + choice(block, 'BUTTON', switchButtons, 'A') + ')');
  });
  register('switch_button_state', (block, generator) => switchAction(device + '.setButton(switchpro::' + choice(block, 'BUTTON', switchButtons, 'A') + ', ' + value(block, generator, 'PRESSED', 'false') + ')'));
  register('switch_buttons', (block, generator) => helper('swButtons', [device, status, value(block, generator, 'MASK', '0')]));
  register('switch_release_all', () => switchAction(device + '.releaseAll()'));
  register('switch_dpad', (block, generator) => switchAction(device + '.setDpad(' + ['UP', 'DOWN', 'LEFT', 'RIGHT'].map(name => value(block, generator, name, 'false')).join(', ') + ')'));
  register('switch_axes', (block, generator) => helper('switchAxes', [device, status, ...['LX', 'LY', 'RX', 'RY'].map(name => value(block, generator, name, '0'))]));
  register('switch_stick', (block, generator) => helper('swStick', [device, status, choice(block, 'SIDE', { LEFT: 'true', RIGHT: 'false' }, 'LEFT'), value(block, generator, 'X', '0'), value(block, generator, 'Y', '0')]));
  register('switch_battery', (block, generator) => helper('swBattery', [device, status, value(block, generator, 'PERCENT', '100'), value(block, generator, 'CHARGING', 'false')]));
  register('switch_status', (block, generator) => output(generator, device + '.' + choice(block, 'STATUS', { REPORT_MODE: 'inputReportMode', PLAYER_LIGHTS: 'playerLights', MALFORMED: 'malformedReports', DROPPED: 'droppedReplies', UNSUPPORTED: 'lastUnsupportedSubcommand' }, 'REPORT_MODE') + '()'));
  register('switch_feature', (block, generator) => output(generator, device + '.' + choice(block, 'FEATURE', { IMU: 'imuEnabled', VIBRATION: 'vibrationEnabled' }, 'IMU') + '()'));
  register('switch_rumble', (block, generator) => output(generator, device + '.rumbleData()[' + index(block, 'INDEX', 0, 7, 0) + ']'));
  register('switch_connect', (block, generator) => helper('swConnect', [device, status, 'String(' + value(block, generator, 'ADDRESS', '"00:11:22:33:44:55"') + ')']));
})();
