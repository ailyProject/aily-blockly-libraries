// IBoxS31_USBHost：USB-A 口主机（HID 键鼠 + U 盘挂到 /usb），VBUS 由 XL9555 @0x27 P07 打开

// 引脚和 I2C 地址按智盒板 IBox S31 写死，换成别的板时在代码里留个提醒
Arduino.iboxs31BoardNote = function () {
  try {
    const boardConfig = window['boardConfig'];
    const name = boardConfig && boardConfig.name ? String(boardConfig.name) : '';
    if (name && !/ibox\s*s31/i.test(name)) {
      return '// 注意：当前开发板是 ' + name + '，本库按智盒板 IBox S31 的引脚和 I2C 地址编写\n';
    }
  } catch (e) {}
  return '';
};

Arduino.iboxs31UsbhostEnsure = function (generator) {
  generator.addLibrary('IBoxS31_USBHost', '#include <IBoxS31_USBHost.h>');
  generator.addVariable('iboxs31_usbhost', 'IBoxS31_USBHost iboxs31_usbhost;');
  // 后台任务在更新状态，每次读都拷一份快照
  generator.addFunction('iboxs31_usbhost_snap', [
    'IBoxS31_USBSnapshot iboxs31_usbhost_snap() {',
    '  IBoxS31_USBSnapshot s;',
    '  iboxs31_usbhost.snapshot(s);',
    '  return s;',
    '}',
  ].join('\n'));
};

Arduino.iboxs31UsbhostMouseEnsure = function (generator) {
  Arduino.iboxs31UsbhostEnsure(generator);
  generator.addVariable('iboxs31_usbhost_mouse_zero', 'int iboxs31_usbhost_mouse_x0 = 0, iboxs31_usbhost_mouse_y0 = 0, iboxs31_usbhost_mouse_w0 = 0;');
};

// U 盘文件用 POSIX 接口，路径前面补上挂载点 /usb
Arduino.iboxs31UsbhostFileEnsure = function (generator) {
  Arduino.iboxs31UsbhostEnsure(generator);
  generator.addLibrary('iboxs31_usbhost_posix', '#include <stdio.h>\n#include <sys/stat.h>');
  generator.addFunction('iboxs31_usbhost_path', [
    'String iboxs31_usbhost_path(const String &path) {',
    '  return String(IBoxS31_USBHost::mountPoint()) + (path.startsWith("/") ? path : "/" + path);',
    '}',
  ].join('\n'));
};

Arduino.iboxs31UsbhostText = function (block, name, generator) {
  return 'String(' + (generator.valueToCode(block, name, generator.ORDER_ATOMIC) || '""') + ')';
};

Arduino.forBlock['iboxs31_usbhost_init'] = function (block, generator) {
  const vbus = block.getFieldValue('VBUS') === 'false' ? 'false' : 'true';
  Arduino.iboxs31UsbhostEnsure(generator);
  return Arduino.iboxs31BoardNote() + 'iboxs31_usbhost.begin(' + vbus + ', Wire, 0, 1);\n';
};

Arduino.forBlock['iboxs31_usbhost_vbus'] = function (block, generator) {
  const on = block.getFieldValue('STATE') === 'false' ? 'false' : 'true';
  Arduino.iboxs31UsbhostEnsure(generator);
  return 'IBoxS31_USBHost::setVbus(' + on + ');\n';
};

Arduino.forBlock['iboxs31_usbhost_state'] = function (block, generator) {
  const what = block.getFieldValue('WHAT');
  Arduino.iboxs31UsbhostEnsure(generator);
  const code = {
    STARTED: 'iboxs31_usbhost.started()',
    CONNECTED: '(iboxs31_usbhost_snap().state == IBOX_USB_STATE_CONNECTED)',
    MSC: 'iboxs31_usbhost.mscMounted()',
    LEFT: 'iboxs31_usbhost_snap().mouse_left',
    RIGHT: 'iboxs31_usbhost_snap().mouse_right',
    MIDDLE: 'iboxs31_usbhost_snap().mouse_middle',
    BACK: 'iboxs31_usbhost_snap().mouse_back',
    FORWARD: 'iboxs31_usbhost_snap().mouse_forward',
    CHANGED: 'iboxs31_usbhost.changed()',
    VBUS: 'IBoxS31_USBHost::vbusOn()',
  }[what] || 'iboxs31_usbhost.started()';
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['iboxs31_usbhost_value'] = function (block, generator) {
  const what = block.getFieldValue('WHAT');
  Arduino.iboxs31UsbhostMouseEnsure(generator);
  const code = {
    MX: '(iboxs31_usbhost_snap().mouse_x - iboxs31_usbhost_mouse_x0)',
    MY: '(iboxs31_usbhost_snap().mouse_y - iboxs31_usbhost_mouse_y0)',
    KEY: '(int)iboxs31_usbhost_snap().last_key',
    INPUTS: '(long)iboxs31_usbhost_snap().input_count',
    CONNECTS: '(long)iboxs31_usbhost_snap().connect_count',
    MSC_MB: '(long)iboxs31_usbhost_snap().msc_mb',
    MSC_FILES: 'iboxs31_usbhost_snap().msc_files',
    WHEEL: '(iboxs31_usbhost_snap().mouse_wheel - iboxs31_usbhost_mouse_w0)',
  }[what] || '0';
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['iboxs31_usbhost_mouse_zero'] = function (block, generator) {
  Arduino.iboxs31UsbhostMouseEnsure(generator);
  return '{\n  IBoxS31_USBSnapshot s = iboxs31_usbhost_snap();\n  iboxs31_usbhost_mouse_x0 = s.mouse_x;\n  iboxs31_usbhost_mouse_y0 = s.mouse_y;\n  iboxs31_usbhost_mouse_w0 = s.mouse_wheel;\n}\n';
};

// 键盘：按键 / 字符各排一个队，按行输入在库里做
Arduino.iboxs31UsbhostCharEnsure = function (generator) {
  Arduino.iboxs31UsbhostEnsure(generator);
  // 库里字符 0 表示没有，转成空文本
  generator.addFunction('iboxs31_usbhost_chr', [
    'String iboxs31_usbhost_chr(char c) {',
    '  return c ? String(c) : String();',
    '}',
  ].join('\n'));
};

Arduino.forBlock['iboxs31_usbhost_new_key'] = function (block, generator) {
  Arduino.iboxs31UsbhostEnsure(generator);
  return ['(int)IBoxS31_USBHost::nextKey()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['iboxs31_usbhost_key_char'] = function (block, generator) {
  const code = generator.valueToCode(block, 'CODE', generator.ORDER_ATOMIC) || '0';
  Arduino.iboxs31UsbhostCharEnsure(generator);
  return ['iboxs31_usbhost_chr(IBoxS31_USBHost::lastKeyChar((uint8_t)(' + code + ')))', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_usbhost_key_name'] = function (block, generator) {
  const code = generator.valueToCode(block, 'CODE', generator.ORDER_ATOMIC) || '0';
  Arduino.iboxs31UsbhostEnsure(generator);
  return ['IBoxS31_USBHost::keyName((uint8_t)(' + code + '))', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_usbhost_new_char'] = function (block, generator) {
  Arduino.iboxs31UsbhostCharEnsure(generator);
  return ['iboxs31_usbhost_chr(IBoxS31_USBHost::nextChar())', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_usbhost_key_held'] = function (block, generator) {
  const key = String(block.getFieldValue('KEY') || 'ENTER');
  Arduino.iboxs31UsbhostEnsure(generator);
  // 修饰键看左右两边的位：Ctrl 0x11，Shift 0x22，Alt 0x44
  const mods = { CTRL: '0x11', SHIFT: '0x22', ALT: '0x44' }[key];
  if (mods) return ['((IBoxS31_USBHost::modifiers() & ' + mods + ') != 0)', generator.ORDER_ATOMIC];
  const special = { ENTER: 0x28, ESC: 0x29, BACKSPACE: 0x2A, TAB: 0x2B, SPACE: 0x2C, RIGHT: 0x4F, LEFT: 0x50, DOWN: 0x51, UP: 0x52 };
  let code = special[key];
  const edit = { INSERT: 0x49, HOME: 0x4A, PAGEUP: 0x4B, DELETE: 0x4C, END: 0x4D, PAGEDOWN: 0x4E };
  if (code === undefined) code = edit[key];
  if (code === undefined && /^F([1-9]|1[0-2])$/.test(key)) code = 0x3A + Number(key.slice(1)) - 1;
  if (code === undefined && /^[A-Z]$/.test(key)) code = 0x04 + key.charCodeAt(0) - 65;
  if (code === undefined && /^N[0-9]$/.test(key)) code = key[1] === '0' ? 0x27 : 0x1E + Number(key[1]) - 1;
  if (code === undefined) code = 0x28;
  return ['IBoxS31_USBHost::keyHeld(0x' + code.toString(16).toUpperCase().padStart(2, '0') + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_usbhost_typing'] = function (block, generator) {
  Arduino.iboxs31UsbhostEnsure(generator);
  return ['IBoxS31_USBHost::typing()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_usbhost_line_ready'] = function (block, generator) {
  Arduino.iboxs31UsbhostEnsure(generator);
  return ['IBoxS31_USBHost::lineReady()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_usbhost_read_line'] = function (block, generator) {
  Arduino.iboxs31UsbhostEnsure(generator);
  return ['IBoxS31_USBHost::takeLine()', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_usbhost_clear_input'] = function (block, generator) {
  Arduino.iboxs31UsbhostEnsure(generator);
  return 'IBoxS31_USBHost::clearInput();\n';
};

Arduino.forBlock['iboxs31_usbhost_text'] = function (block, generator) {
  const field = { DEVICE: 'device', INPUT: 'last_input', STATUS: 'status', MSC_INFO: 'msc_info', RAW: 'last_raw' }[block.getFieldValue('WHAT')] || 'status';
  Arduino.iboxs31UsbhostEnsure(generator);
  return ['String(iboxs31_usbhost_snap().' + field + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_usbhost_file_write'] = function (block, generator) {
  const append = block.getFieldValue('MODE') === 'APPEND' ? 'true' : 'false';
  const path = Arduino.iboxs31UsbhostText(block, 'PATH', generator);
  const text = Arduino.iboxs31UsbhostText(block, 'TEXT', generator);
  Arduino.iboxs31UsbhostFileEnsure(generator);
  generator.addFunction('iboxs31_usbhost_file_write', [
    'bool iboxs31_usbhost_file_write(const String &path, const String &text, bool append) {',
    '  if (!iboxs31_usbhost.mscMounted()) return false;',
    '  FILE *f = fopen(iboxs31_usbhost_path(path).c_str(), append ? "a" : "w");',
    '  if (!f) return false;',
    '  const size_t written = fwrite(text.c_str(), 1, text.length(), f);',
    '  fclose(f);',
    '  return written == text.length();',
    '}',
  ].join('\n'));
  return 'iboxs31_usbhost_file_write(' + path + ', ' + text + ', ' + append + ');\n';
};

Arduino.forBlock['iboxs31_usbhost_file_read'] = function (block, generator) {
  const path = Arduino.iboxs31UsbhostText(block, 'PATH', generator);
  Arduino.iboxs31UsbhostFileEnsure(generator);
  generator.addFunction('iboxs31_usbhost_file_read', [
    'String iboxs31_usbhost_file_read(const String &path) {',
    '  String text;',
    '  if (!iboxs31_usbhost.mscMounted()) return text;',
    '  FILE *f = fopen(iboxs31_usbhost_path(path).c_str(), "r");',
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
  return ['iboxs31_usbhost_file_read(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_usbhost_file_exists'] = function (block, generator) {
  const path = Arduino.iboxs31UsbhostText(block, 'PATH', generator);
  Arduino.iboxs31UsbhostFileEnsure(generator);
  generator.addFunction('iboxs31_usbhost_file_exists', [
    'bool iboxs31_usbhost_file_exists(const String &path) {',
    '  struct stat st;',
    '  return iboxs31_usbhost.mscMounted() && stat(iboxs31_usbhost_path(path).c_str(), &st) == 0;',
    '}',
  ].join('\n'));
  return ['iboxs31_usbhost_file_exists(' + path + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['iboxs31_usbhost_file_remove'] = function (block, generator) {
  const path = Arduino.iboxs31UsbhostText(block, 'PATH', generator);
  Arduino.iboxs31UsbhostFileEnsure(generator);
  return 'if (iboxs31_usbhost.mscMounted()) remove(iboxs31_usbhost_path(' + path + ').c_str());\n';
};
