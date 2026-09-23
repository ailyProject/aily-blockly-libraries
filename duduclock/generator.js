// @aily-project/lib-duduclock

Arduino.forBlock["dudu_set_api_host"] = function (block, generator) {
  generator.addLibrary('DuduClock', '#include "DuduClock.h"');
    const host = generator.valueToCode(block, 'HOST', generator.ORDER_ATOMIC) || '""';
    return 'duduSetApiHost(' + host + ');\n';
};

Arduino.forBlock["dudu_set_weather_key"] = function (block, generator) {
  generator.addLibrary('DuduClock', '#include "DuduClock.h"');
    const key = generator.valueToCode(block, 'KEY', generator.ORDER_ATOMIC) || '""';
    return 'duduSetWeatherKey(' + key + ');\n';
};

Arduino.forBlock["dudu_init"] = function (block, generator) {
  generator.addLibrary('DuduClock', '#include "DuduClock.h"');
  generator.addLibrary('TFT_eSPI', '#include <TFT_eSPI.h>');
  // 同步宏注册（与 lib-jinyichen-st7789 等效；项目配置中亦已持久化同一套宏）
  generator.addMacro("TFT_MODEL", "#define ST7789_DRIVER");
  generator.addMacro("TFT_FREQUENCY", "#define TFT_FREQUENCY 40000000");
  generator.addMacro("TFT_WIDTH", "#define TFT_WIDTH 240");
  generator.addMacro("TFT_HEIGHT", "#define TFT_HEIGHT 320");
  generator.addMacro("TFT_MISO", "#define TFT_MISO 19");
  generator.addMacro("TFT_MOSI", "#define TFT_MOSI 23");
  generator.addMacro("TFT_SCLK", "#define TFT_SCLK 18");
  generator.addMacro("TFT_CS", "#define TFT_CS 5");
  generator.addMacro("TFT_DC", "#define TFT_DC 4");
  generator.addMacro("TFT_RST", "#define TFT_RST 19");
  generator.addMacro("TFT_BL", "#define TFT_BL -1");
  generator.addMacro("TFT_BACKLIGHT_ON", "#define TFT_BACKLIGHT_ON HIGH");
  generator.addMacro("TFT_RGB_ORDER", "#define TFT_RGB_ORDER TFT_BGR");
  generator.addMacro("USE_HSPI_PORT", "#define USE_HSPI_PORT");
  generator.addVariable('tft', 'TFT_eSPI tft = TFT_eSPI();');
  generator.addVariable('dudu_clk', 'TFT_eSprite clk = TFT_eSprite(&tft);');
  return 'duduInit();\n';
};

Arduino.forBlock["dudu_has_config"] = function (block, generator) {
  generator.addLibrary('DuduClock', '#include "DuduClock.h"');
    return ['duduHasConfig()', generator.ORDER_ATOMIC];
};

Arduino.forBlock["dudu_start_config_portal"] = function (block, generator) {
  generator.addLibrary('DuduClock', '#include "DuduClock.h"');
    return 'duduStartConfigPortal();\n';
};

Arduino.forBlock["dudu_connect_wifi"] = function (block, generator) {
  generator.addLibrary('DuduClock', '#include "DuduClock.h"');
    const t = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '30';
    return 'duduConnectWifi(' + t + ');\n';
};

Arduino.forBlock["dudu_sync_data"] = function (block, generator) {
  generator.addLibrary('DuduClock', '#include "DuduClock.h"');
    return 'duduSyncData();\n';
};

Arduino.forBlock["dudu_start_tasks"] = function (block, generator) {
  generator.addLibrary('DuduClock', '#include "DuduClock.h"');
    return 'duduStartTasks();\n';
};

Arduino.forBlock["dudu_run"] = function (block, generator) {
  generator.addLibrary('DuduClock', '#include "DuduClock.h"');
    return 'duduRun();\n';
};

Arduino.forBlock["dudu_click"] = function (block, generator) {
  generator.addLibrary('DuduClock', '#include "DuduClock.h"');
    return 'duduClick();\n';
};

Arduino.forBlock["dudu_double_click"] = function (block, generator) {
  generator.addLibrary('DuduClock', '#include "DuduClock.h"');
    return 'duduDoubleClick();\n';
};

Arduino.forBlock["dudu_long_press"] = function (block, generator) {
  generator.addLibrary('DuduClock', '#include "DuduClock.h"');
    return 'duduLongPress();\n';
};
