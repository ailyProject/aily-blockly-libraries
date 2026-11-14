// @aily-project/lib-stos

Arduino.forBlock["stos_init_screen"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  return 'stos.screenBegin('+block.getFieldValue('SCL')+','+block.getFieldValue('SDA')+','+block.getFieldValue('RES')+','+block.getFieldValue('DC')+','+block.getFieldValue('CS')+','+block.getFieldValue('BLK')+');\n';
};

Arduino.forBlock["stos_init_sd"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  return 'stos.sdBegin('+block.getFieldValue('CS')+','+block.getFieldValue('SCK')+','+block.getFieldValue('MOSI')+','+block.getFieldValue('MISO')+');\n';
};

Arduino.forBlock["stos_init_keypad"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  return 'stos.keypadBegin('+block.getFieldValue('C1')+','+block.getFieldValue('C2')+','+block.getFieldValue('C3')+','+block.getFieldValue('C4')+','+block.getFieldValue('S1')+','+block.getFieldValue('S2')+','+block.getFieldValue('S3')+','+block.getFieldValue('S4')+');\n';
};

Arduino.forBlock["stos_init_joystick"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  return 'stos.joystickBegin('+block.getFieldValue('VRX')+','+block.getFieldValue('VRY')+','+block.getFieldValue('SW')+');\n';
};

Arduino.forBlock["stos_init_speaker"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  return 'stos.speakerBegin('+block.getFieldValue('POS')+');\n';
};

Arduino.forBlock["stos_when_desktop_open"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  const branch = generator.statementToCode(block, 'DO');
  return 'if (stos.whenDesktopOpen('+block.getFieldValue('APP')+')) {\n'+branch+'}\n';
};

Arduino.forBlock["stos_when_startmenu_open"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  const branch = generator.statementToCode(block, 'DO');
  return 'if (stos.whenStartMenuOpen('+block.getFieldValue('APP')+')) {\n'+branch+'}\n';
};

Arduino.forBlock["stos_when_window_btn"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  const branch = generator.statementToCode(block, 'DO');
  return 'if (stos.whenWindowButton('+block.getFieldValue('APP')+','+block.getFieldValue('BTN')+')) {\n'+branch+'}\n';
};

Arduino.forBlock["stos_when_taskbar_open"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  const branch = generator.statementToCode(block, 'DO');
  return 'if (stos.whenTaskbarOpen('+block.getFieldValue('APP')+')) {\n'+branch+'}\n';
};

Arduino.forBlock["stos_when_sd_inserted"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  const branch = generator.statementToCode(block, 'DO');
  return 'if (stos.whenSdInserted()) {\n'+branch+'}\n';
};

Arduino.forBlock["stos_when_key"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  const branch = generator.statementToCode(block, 'DO');
  return 'if (stos.whenKey('+block.getFieldValue('KEY')+')) {\n'+branch+'}\n';
};

Arduino.forBlock["stos_when_key_held"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  const branch = generator.statementToCode(block, 'DO');
  return 'if (stos.whenKeyHeld('+block.getFieldValue('KEY')+')) {\n'+branch+'}\n';
};

Arduino.forBlock["stos_when_joy"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  const branch = generator.statementToCode(block, 'DO');
  return 'if (stos.whenJoystick('+block.getFieldValue('DIR')+')) {\n'+branch+'}\n';
};

Arduino.forBlock["stos_when_editor_btn"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  const branch = generator.statementToCode(block, 'DO');
  return 'if (stos.whenEditorButton('+block.getFieldValue('BTN')+')) {\n'+branch+'}\n';
};

Arduino.forBlock["stos_when_thispc_btn"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  const branch = generator.statementToCode(block, 'DO');
  return 'if (stos.whenThisPcButton('+block.getFieldValue('BTN')+')) {\n'+branch+'}\n';
};

Arduino.forBlock["stos_when_tool"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  const branch = generator.statementToCode(block, 'DO');
  return 'if (stos.whenToolSelect('+block.getFieldValue('TOOL')+')) {\n'+branch+'}\n';
};

Arduino.forBlock["stos_when_sdcheck_btn"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  const branch = generator.statementToCode(block, 'DO');
  return 'if (stos.whenSdCheckButton('+block.getFieldValue('BTN')+')) {\n'+branch+'}\n';
};

Arduino.forBlock["stos_when_dots_btn"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  const branch = generator.statementToCode(block, 'DO');
  return 'if (stos.whenDotsButton('+block.getFieldValue('BTN')+')) {\n'+branch+'}\n';
};

Arduino.forBlock["stos_when_album_btn"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  const branch = generator.statementToCode(block, 'DO');
  return 'if (stos.whenAlbumButton('+block.getFieldValue('BTN')+')) {\n'+branch+'}\n';
};

Arduino.forBlock["stos_when_settings_btn"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  const branch = generator.statementToCode(block, 'DO');
  return 'if (stos.whenSettingsButton('+block.getFieldValue('BTN')+')) {\n'+branch+'}\n';
};

Arduino.forBlock["stos_when_offkey"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  const branch = generator.statementToCode(block, 'DO');
  return 'if (stos.whenScreenOffAnyKey()) {\n'+branch+'}\n';
};

Arduino.forBlock["stos_open_desktop"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  return 'stos.openApp(SRC_DESKTOP,'+block.getFieldValue('APP')+');\n';
};

Arduino.forBlock["stos_open_startmenu"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  return 'stos.openApp(SRC_STARTMENU,'+block.getFieldValue('APP')+');\n';
};

Arduino.forBlock["stos_window_action"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  return 'stos.windowAction('+block.getFieldValue('APP')+','+block.getFieldValue('ACT')+');\n';
};

Arduino.forBlock["stos_restore_app"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  return 'stos.restoreApp('+block.getFieldValue('APP')+');\n';
};

Arduino.forBlock["stos_read_sd"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  return 'stos.readSdFiles();\n';
};

Arduino.forBlock["stos_map_chars"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  const s = block.getFieldValue('SET') || '';
  const esc = s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return 'stos.mapChars("' + esc + '");\n';
};

Arduino.forBlock["stos_cursor_move"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  return 'stos.moveCursor('+block.getFieldValue('DIR')+');\n';
};

Arduino.forBlock["stos_text_delete"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  return 'stos.textBackspace();\n';
};

Arduino.forBlock["stos_text_confirm"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  return 'stos.textConfirm();\n';
};

Arduino.forBlock["stos_screen_off"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  return 'stos.screenOff();\n';
};

Arduino.forBlock["stos_screen_on"] = function (block, generator) {
  generator.addLibrary('stos_h','#include "STOS.h"');
  return 'stos.screenOn();\n';
};
