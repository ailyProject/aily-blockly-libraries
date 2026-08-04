/**
 * [INPUT]: 依赖 Aily Arduino generator 的宏、库、setup、loop 注入能力与板型配置
 * [OUTPUT]: 注册 OpenCodexMicro 积木生成器，输出板型宏、BLE/Preferences 依赖和控制器调用
 * [POS]: 库的代码生成入口，把 Blockly 语义转换为 ESP32-S3 与学而思小喵共享的固件门面 API
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

function openCodexAddMacro(generator, key, line) {
  if (typeof generator.addMacro === 'function') {
    generator.addMacro(key, line);
    return;
  }
  // Fallback for generators that only expose addLibrary/addObject.
  generator.addLibrary('macro_' + key, line);
}

function openCodexEnsureSerial(generator) {
  generator.addSetupBegin('opencodex_serial', 'Serial.begin(115200);');
}

function openCodexEnsureStack(generator) {
  // Must live at sketch global scope on ESP32 Arduino.
  generator.addObject(
    'opencodex_loop_stack',
    'SET_LOOP_TASK_STACK_SIZE(16 * 1024);'
  );
}

function openCodexApplyS3Macros(generator) {
  const macros = {
    CODEX_BOARD_S3: '#define CODEX_BOARD_S3 1',
    USER_SETUP_LOADED: '#define USER_SETUP_LOADED 1',
    USE_HSPI_PORT: '#define USE_HSPI_PORT 1',
    ST7789_DRIVER: '#define ST7789_DRIVER 1',
    TFT_RGB_ORDER: '#define TFT_RGB_ORDER TFT_BGR',
    TFT_WIDTH: '#define TFT_WIDTH 240',
    TFT_HEIGHT: '#define TFT_HEIGHT 320',
    TFT_INVERSION_OFF: '#define TFT_INVERSION_OFF',
    TFT_BL: '#define TFT_BL 8',
    TFT_BACKLIGHT_ON: '#define TFT_BACKLIGHT_ON HIGH',
    TFT_MISO: '#define TFT_MISO 15',
    TFT_MOSI: '#define TFT_MOSI 17',
    TFT_SCLK: '#define TFT_SCLK 16',
    TFT_CS: '#define TFT_CS 5',
    TFT_DC: '#define TFT_DC 7',
    TFT_RST: '#define TFT_RST 6',
    TOUCH_CS: '#define TOUCH_CS -1',
    TOUCH_SDA: '#define TOUCH_SDA 10',
    TOUCH_SCL: '#define TOUCH_SCL 13',
    TOUCH_INT: '#define TOUCH_INT 12',
    TOUCH_RST: '#define TOUCH_RST 9',
    TOUCH_MAP_MODE: '#define TOUCH_MAP_MODE 0',
    SPI_FREQUENCY: '#define SPI_FREQUENCY 27000000',
    LOAD_GLCD: '#define LOAD_GLCD 1',
    LOAD_FONT2: '#define LOAD_FONT2 1',
    LOAD_FONT4: '#define LOAD_FONT4 1',
    LOAD_FONT6: '#define LOAD_FONT6 1',
    LOAD_FONT7: '#define LOAD_FONT7 1',
    LOAD_FONT8: '#define LOAD_FONT8 1',
    LOAD_GFXFF: '#define LOAD_GFXFF 1',
    SMOOTH_FONT: '#define SMOOTH_FONT 1',
    BOARD_HAS_PSRAM: '#define BOARD_HAS_PSRAM 1'
  };
  Object.keys(macros).forEach(function (key) {
    openCodexAddMacro(generator, key, macros[key]);
  });
}

function openCodexApplyXueersiMacros(generator) {
  const macros = {
    CODEX_BOARD_XUEERSI: '#define CODEX_BOARD_XUEERSI 1',
    USER_SETUP_LOADED: '#define USER_SETUP_LOADED 1',
    ST7735_DRIVER: '#define ST7735_DRIVER 1',
    ST7735_BLACKTAB: '#define ST7735_BLACKTAB 1',
    TFT_RGB_ORDER: '#define TFT_RGB_ORDER TFT_RGB',
    TFT_WIDTH: '#define TFT_WIDTH 128',
    TFT_HEIGHT: '#define TFT_HEIGHT 160',
    TFT_INVERSION_OFF: '#define TFT_INVERSION_OFF',
    TFT_MOSI: '#define TFT_MOSI 23',
    TFT_SCLK: '#define TFT_SCLK 18',
    TFT_CS: '#define TFT_CS 5',
    TFT_DC: '#define TFT_DC 4',
    TFT_RST: '#define TFT_RST 19',
    TOUCH_CS: '#define TOUCH_CS -1',
    SPI_FREQUENCY: '#define SPI_FREQUENCY 30000000',
    LOAD_GLCD: '#define LOAD_GLCD 1',
    XUEERSI_CHORD_WINDOW_MS: '#define XUEERSI_CHORD_WINDOW_MS 80',
    XUEERSI_LONG_PRESS_MS: '#define XUEERSI_LONG_PRESS_MS 500',
    XUEERSI_DOUBLE_CLICK_MS: '#define XUEERSI_DOUBLE_CLICK_MS 350',
    XUEERSI_SOUND_ENABLED: '#define XUEERSI_SOUND_ENABLED 1',
    XUEERSI_BUZZER_DUTY: '#define XUEERSI_BUZZER_DUTY 96',
    XUEERSI_TFT_ROTATION: '#define XUEERSI_TFT_ROTATION 3'
  };
  Object.keys(macros).forEach(function (key) {
    openCodexAddMacro(generator, key, macros[key]);
  });
}

function openCodexEnsureRuntime(generator, board) {
  if (board === 'XUEERSI') {
    openCodexApplyXueersiMacros(generator);
  } else {
    openCodexApplyS3Macros(generator);
  }

  openCodexEnsureLibrary(generator);
  openCodexEnsureStack(generator);
  openCodexEnsureSerial(generator);
  generator.addSetupBegin('opencodex_begin', 'openCodexBegin();');
  generator.addLoopBegin('opencodex_update', 'openCodexUpdate();');
}

Arduino.forBlock['opencodex_begin'] = function (block, generator) {
  var board = block.getFieldValue('BOARD') || 'S3';
  // Soft board adaptation: if current Aily board is classic ESP32 and user left default S3,
  // keep the explicit dropdown value (user intent wins). Only use boardConfig for macros that
  // depend on core family (always ESP32 Arduino BLE stack).
  if (typeof window !== 'undefined' && window.boardConfig && window.boardConfig.core) {
    var core = String(window.boardConfig.core || '');
    if (core.indexOf('esp32') === -1) {
      // Library is ESP32-only; still generate so the compile error is clear upstream.
    }
  }
  openCodexEnsureRuntime(generator, board);
  return '';
};

function openCodexEnsureLibrary(generator) {
  // Arduino-ESP32 3.x BLE2902 uses Preferences, but Aily resolves top-level includes only.
  generator.addLibrary('opencodex_ble_preferences', '#include <Preferences.h>');
  generator.addLibrary('opencodex_header', '#include <OpenCodexMicro.h>');
}

Arduino.forBlock['opencodex_connected'] = function (block, generator) {
  openCodexEnsureLibrary(generator);
  return ['openCodexConnected()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['opencodex_encrypted'] = function (block, generator) {
  openCodexEnsureLibrary(generator);
  return ['openCodexEncrypted()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['opencodex_host_ready'] = function (block, generator) {
  openCodexEnsureLibrary(generator);
  return ['openCodexHostReady()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['opencodex_set_page'] = function (block, generator) {
  openCodexEnsureLibrary(generator);
  var page = block.getFieldValue('PAGE') || 'Tasks';
  return 'openCodexSetPage(UiPage::' + page + ');\n';
};

Arduino.forBlock['opencodex_get_page'] = function (block, generator) {
  openCodexEnsureLibrary(generator);
  return ['static_cast<uint8_t>(openCodexGetPage())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['opencodex_send_key'] = function (block, generator) {
  openCodexEnsureLibrary(generator);
  var key = block.getFieldValue('KEY') || 'ACT06';
  var action = block.getFieldValue('ACTION') || '1';
  var agent = generator.valueToCode(block, 'AGENT', generator.ORDER_ATOMIC) || '-1';
  return 'openCodexSendKey("' + key + '", ' + action + ', ' + agent + ');\n';
};

Arduino.forBlock['opencodex_send_joystick'] = function (block, generator) {
  openCodexEnsureLibrary(generator);
  var angle = generator.valueToCode(block, 'ANGLE', generator.ORDER_ATOMIC) || '0';
  var distance = generator.valueToCode(block, 'DISTANCE', generator.ORDER_ATOMIC) || '0';
  return 'openCodexSendJoystick(' + angle + ', ' + distance + ');\n';
};

Arduino.forBlock['opencodex_set_battery'] = function (block, generator) {
  openCodexEnsureLibrary(generator);
  var percent = generator.valueToCode(block, 'PERCENT', generator.ORDER_ATOMIC) || '100';
  var charging = generator.valueToCode(block, 'CHARGING', generator.ORDER_ATOMIC) || 'false';
  return 'openCodexSetBattery(' + percent + ', ' + charging + ');\n';
};

Arduino.forBlock['opencodex_play_sound'] = function (block, generator) {
  openCodexEnsureLibrary(generator);
  var cue = block.getFieldValue('CUE') || 'Success';
  return 'openCodexPlaySound(BoardSoundCue::' + cue + ');\n';
};

Arduino.forBlock['opencodex_stop_sound'] = function (block, generator) {
  openCodexEnsureLibrary(generator);
  return 'openCodexStopSound();\n';
};
