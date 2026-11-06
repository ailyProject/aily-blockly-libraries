// ESP32USBHost：USB OTG 主机（HID 键鼠 + U 盘挂到 /usb）。本库不管 USB 口供电，智盒板 IBox S31 用 XL9555 库把 P07 拉高

// I2C 引脚按板卡选：aily_iic 设过的自定义引脚 > 芯片自己的板卡配置 > 板卡 i2cPins > Wire 默认引脚
Arduino.esp32UsbHostWireBegin = function (generator, devicePins) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  let pins = null;
  try {
    const board = window['boardConfig'] || {};
    const custom = window['customI2CPins'] && window['customI2CPins']['Wire'];
    const pick = list => {
      const sda = list && list.find(p => p[0] === 'SDA');
      const scl = list && list.find(p => p[0] === 'SCL');
      return sda && scl ? { sda: sda[1], scl: scl[1] } : null;
    };
    if (custom) pins = pick(custom);
    else if (devicePins && devicePins.sda != null && devicePins.scl != null) pins = { sda: devicePins.sda, scl: devicePins.scl };
    else pins = pick(board.i2cPins && board.i2cPins['Wire']);
    // 只有 ESP32 的 Wire.begin 能带引脚
    if (!(board.core && String(board.core).indexOf('esp32') > -1)) pins = null;
  } catch (e) {
    pins = null;
  }
  const code = pins ? 'Wire.begin(' + pins.sda + ', ' + pins.scl + ');' : 'Wire.begin();';
  let old = null;
  try {
    old = generator.codeDict.setups_begin['wire_Wire_begin'];
  } catch (e) {}
  generator.addSetupBegin('wire_Wire_begin', code, !!(pins && old && /\.begin\(\s*\)/.test(old)));
};

// 当前开发板 board.json 里的某项配置（没有就是 null）
Arduino.esp32UsbHostBoardConfig = function (key) {
  try {
    const board = window['boardConfig'];
    return board && board[key] ? board[key] : null;
  } catch (e) {
    return null;
  }
};

Arduino.esp32UsbHostEnsure = function (generator) {
  generator.addLibrary('ESP32USBHost', '#include <ESP32USBHost.h>');
  generator.addVariable('esp32_usb_host', 'ESP32USBHost esp32_usb_host;');
  // 后台任务在更新状态，每次读都拷一份快照
  generator.addFunction('esp32_usb_host_snap', [
    'ESP32USBSnapshot esp32_usb_host_snap() {',
    '  ESP32USBSnapshot s;',
    '  esp32_usb_host.snapshot(s);',
    '  return s;',
    '}',
  ].join('\n'));
};

Arduino.esp32UsbHostMouseEnsure = function (generator) {
  Arduino.esp32UsbHostEnsure(generator);
  generator.addVariable('esp32_usb_host_mouse_zero', 'int esp32_usb_host_mouse_x0 = 0, esp32_usb_host_mouse_y0 = 0, esp32_usb_host_mouse_w0 = 0;');
};

// U 盘文件用 POSIX 接口，路径前面补上挂载点 /usb
Arduino.esp32UsbHostFileEnsure = function (generator) {
  Arduino.esp32UsbHostEnsure(generator);
  generator.addLibrary('esp32_usb_host_posix', '#include <stdio.h>\n#include <sys/stat.h>');
  generator.addFunction('esp32_usb_host_path', [
    'String esp32_usb_host_path(const String &path) {',
    '  return String(ESP32USBHost::mountPoint()) + (path.startsWith("/") ? path : "/" + path);',
    '}',
  ].join('\n'));
};

Arduino.esp32UsbHostText = function (block, name, generator) {
  return 'String(' + (generator.valueToCode(block, name, generator.ORDER_ATOMIC) || '""') + ')';
};

Arduino.forBlock['esp32_usb_host_init'] = function (block, generator) {
  Arduino.esp32UsbHostEnsure(generator);
  return 'esp32_usb_host.begin();\n';
};

Arduino.forBlock['esp32_usb_host_state'] = function (block, generator) {
  const what = block.getFieldValue('WHAT');
  Arduino.esp32UsbHostEnsure(generator);
  const code = {
    STARTED: 'esp32_usb_host.started()',
    CONNECTED: '(esp32_usb_host_snap().state == USBH_USB_STATE_CONNECTED)',
    MSC: 'esp32_usb_host.mscMounted()',
    LEFT: 'esp32_usb_host_snap().mouse_left',
    RIGHT: 'esp32_usb_host_snap().mouse_right',
    MIDDLE: 'esp32_usb_host_snap().mouse_middle',
    BACK: 'esp32_usb_host_snap().mouse_back',
    FORWARD: 'esp32_usb_host_snap().mouse_forward',
    CHANGED: 'esp32_usb_host.changed()',
  }[what] || 'esp32_usb_host.started()';
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_usb_host_value'] = function (block, generator) {
  const what = block.getFieldValue('WHAT');
  Arduino.esp32UsbHostMouseEnsure(generator);
  const code = {
    MX: '(esp32_usb_host_snap().mouse_x - esp32_usb_host_mouse_x0)',
    MY: '(esp32_usb_host_snap().mouse_y - esp32_usb_host_mouse_y0)',
    KEY: '(int)esp32_usb_host_snap().last_key',
    INPUTS: '(long)esp32_usb_host_snap().input_count',
    CONNECTS: '(long)esp32_usb_host_snap().connect_count',
    MSC_MB: '(long)esp32_usb_host_snap().msc_mb',
    MSC_FILES: 'esp32_usb_host_snap().msc_files',
    WHEEL: '(esp32_usb_host_snap().mouse_wheel - esp32_usb_host_mouse_w0)',
  }[what] || '0';
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_usb_host_mouse_zero'] = function (block, generator) {
  Arduino.esp32UsbHostMouseEnsure(generator);
  return '{\n  ESP32USBSnapshot s = esp32_usb_host_snap();\n  esp32_usb_host_mouse_x0 = s.mouse_x;\n  esp32_usb_host_mouse_y0 = s.mouse_y;\n  esp32_usb_host_mouse_w0 = s.mouse_wheel;\n}\n';
};

// 键盘：按键 / 字符各排一个队，按行输入在库里做
Arduino.esp32UsbHostCharEnsure = function (generator) {
  Arduino.esp32UsbHostEnsure(generator);
  // 库里字符 0 表示没有，转成空文本
  generator.addFunction('esp32_usb_host_chr', [
    'String esp32_usb_host_chr(char c) {',
    '  return c ? String(c) : String();',
    '}',
  ].join('\n'));
};

Arduino.forBlock['esp32_usb_host_new_key'] = function (block, generator) {
  Arduino.esp32UsbHostEnsure(generator);
  return ['(int)ESP32USBHost::nextKey()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_usb_host_key_char'] = function (block, generator) {
  const code = generator.valueToCode(block, 'CODE', generator.ORDER_ATOMIC) || '0';
  Arduino.esp32UsbHostCharEnsure(generator);
  return ['esp32_usb_host_chr(ESP32USBHost::lastKeyChar((uint8_t)(' + code + ')))', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_usb_host_key_name'] = function (block, generator) {
  const code = generator.valueToCode(block, 'CODE', generator.ORDER_ATOMIC) || '0';
  Arduino.esp32UsbHostEnsure(generator);
  return ['ESP32USBHost::keyName((uint8_t)(' + code + '))', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_usb_host_new_char'] = function (block, generator) {
  Arduino.esp32UsbHostCharEnsure(generator);
  return ['esp32_usb_host_chr(ESP32USBHost::nextChar())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_usb_host_key_held'] = function (block, generator) {
  const key = String(block.getFieldValue('KEY') || 'ENTER');
  Arduino.esp32UsbHostEnsure(generator);
  // 修饰键看左右两边的位：Ctrl 0x11，Shift 0x22，Alt 0x44
  const mods = { CTRL: '0x11', SHIFT: '0x22', ALT: '0x44' }[key];
  if (mods) return ['((ESP32USBHost::modifiers() & ' + mods + ') != 0)', generator.ORDER_ATOMIC];
  const special = { ENTER: 0x28, ESC: 0x29, BACKSPACE: 0x2A, TAB: 0x2B, SPACE: 0x2C, RIGHT: 0x4F, LEFT: 0x50, DOWN: 0x51, UP: 0x52 };
  let code = special[key];
  const edit = { INSERT: 0x49, HOME: 0x4A, PAGEUP: 0x4B, DELETE: 0x4C, END: 0x4D, PAGEDOWN: 0x4E };
  if (code === undefined) code = edit[key];
  if (code === undefined && /^F([1-9]|1[0-2])$/.test(key)) code = 0x3A + Number(key.slice(1)) - 1;
  if (code === undefined && /^[A-Z]$/.test(key)) code = 0x04 + key.charCodeAt(0) - 65;
  if (code === undefined && /^N[0-9]$/.test(key)) code = key[1] === '0' ? 0x27 : 0x1E + Number(key[1]) - 1;
  if (code === undefined) code = 0x28;
  return ['ESP32USBHost::keyHeld(0x' + code.toString(16).toUpperCase().padStart(2, '0') + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_usb_host_typing'] = function (block, generator) {
  Arduino.esp32UsbHostEnsure(generator);
  return ['ESP32USBHost::typing()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_usb_host_line_ready'] = function (block, generator) {
  Arduino.esp32UsbHostEnsure(generator);
  return ['ESP32USBHost::lineReady()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_usb_host_read_line'] = function (block, generator) {
  Arduino.esp32UsbHostEnsure(generator);
  return ['ESP32USBHost::takeLine()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_usb_host_clear_input'] = function (block, generator) {
  Arduino.esp32UsbHostEnsure(generator);
  return 'ESP32USBHost::clearInput();\n';
};

Arduino.forBlock['esp32_usb_host_text'] = function (block, generator) {
  const field = { DEVICE: 'device', INPUT: 'last_input', STATUS: 'status', MSC_INFO: 'msc_info', RAW: 'last_raw' }[block.getFieldValue('WHAT')] || 'status';
  Arduino.esp32UsbHostEnsure(generator);
  return ['String(esp32_usb_host_snap().' + field + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_usb_host_file_write'] = function (block, generator) {
  const append = block.getFieldValue('MODE') === 'APPEND' ? 'true' : 'false';
  const path = Arduino.esp32UsbHostText(block, 'PATH', generator);
  const text = Arduino.esp32UsbHostText(block, 'TEXT', generator);
  Arduino.esp32UsbHostFileEnsure(generator);
  generator.addFunction('esp32_usb_host_file_write', [
    'bool esp32_usb_host_file_write(const String &path, const String &text, bool append) {',
    '  if (!esp32_usb_host.mscMounted()) return false;',
    '  FILE *f = fopen(esp32_usb_host_path(path).c_str(), append ? "a" : "w");',
    '  if (!f) return false;',
    '  const size_t written = fwrite(text.c_str(), 1, text.length(), f);',
    '  fclose(f);',
    '  return written == text.length();',
    '}',
  ].join('\n'));
  return 'esp32_usb_host_file_write(' + path + ', ' + text + ', ' + append + ');\n';
};

Arduino.forBlock['esp32_usb_host_file_read'] = function (block, generator) {
  const path = Arduino.esp32UsbHostText(block, 'PATH', generator);
  Arduino.esp32UsbHostFileEnsure(generator);
  generator.addFunction('esp32_usb_host_file_read', [
    'String esp32_usb_host_file_read(const String &path) {',
    '  String text;',
    '  if (!esp32_usb_host.mscMounted()) return text;',
    '  FILE *f = fopen(esp32_usb_host_path(path).c_str(), "r");',
    '  if (!f) return text;',
    '  char buf[129];',
    '  size_t got;',
    '  while (text.length() < 8192 && (got = fread(buf, 1, sizeof(buf) - 1, f)) > 0) {',
    '    buf[got] = 0;',
    '    text += buf;',
    '  }',
    '  fclose(f);',
    '  return text;',
    '}',
  ].join('\n'));
  return ['esp32_usb_host_file_read(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_usb_host_file_exists'] = function (block, generator) {
  const path = Arduino.esp32UsbHostText(block, 'PATH', generator);
  Arduino.esp32UsbHostFileEnsure(generator);
  generator.addFunction('esp32_usb_host_file_exists', [
    'bool esp32_usb_host_file_exists(const String &path) {',
    '  struct stat st;',
    '  return esp32_usb_host.mscMounted() && stat(esp32_usb_host_path(path).c_str(), &st) == 0;',
    '}',
  ].join('\n'));
  return ['esp32_usb_host_file_exists(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['esp32_usb_host_file_remove'] = function (block, generator) {
  const path = Arduino.esp32UsbHostText(block, 'PATH', generator);
  Arduino.esp32UsbHostFileEnsure(generator);
  return 'if (esp32_usb_host.mscMounted()) remove(esp32_usb_host_path(' + path + ').c_str());\n';
};
