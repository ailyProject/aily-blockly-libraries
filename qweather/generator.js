// @aily-project/lib-qweather

Arduino.forBlock["qweather_setup"] = function (block, generator) {
  const host = generator.valueToCode(block, 'HOST', Arduino.ORDER_ATOMIC) || '"devapi.qweather.com"';
  const key = generator.valueToCode(block, 'KEY', Arduino.ORDER_ATOMIC) || '""';
  const id = generator.valueToCode(block, 'LOC_ID', Arduino.ORDER_ATOMIC) || '"101010100"';
  const nm = generator.valueToCode(block, 'LOC_NAME', Arduino.ORDER_ATOMIC) || '""';
  generator.addLibrary('qweather', '#include "QWeather.h"');
  return 'qweatherSetup(' + host + ', ' + key + ', ' + id + ', ' + nm + ');\n';
};

Arduino.forBlock["qweather_update"] = function (block, generator) {
  generator.addLibrary('qweather', '#include "QWeather.h"');
  return 'qweatherUpdate();\n';
};

Arduino.forBlock["qweather_ok"] = function (block, generator) {
  generator.addLibrary('qweather', '#include "QWeather.h"');
  return ['qweatherOk()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["qweather_get_temp"] = function (block, generator) {
  generator.addLibrary('qweather', '#include "QWeather.h"');
  return ['qweatherGetTemp()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["qweather_get_high"] = function (block, generator) {
  generator.addLibrary('qweather', '#include "QWeather.h"');
  return ['qweatherGetHigh()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["qweather_get_low"] = function (block, generator) {
  generator.addLibrary('qweather', '#include "QWeather.h"');
  return ['qweatherGetLow()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["qweather_get_text"] = function (block, generator) {
  generator.addLibrary('qweather', '#include "QWeather.h"');
  return ['String(qweatherGetText())', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["qweather_get_city"] = function (block, generator) {
  generator.addLibrary('qweather', '#include "QWeather.h"');
  return ['String(qweatherGetCity())', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["qweather_f_high"] = function (block, generator) {
  const day = generator.valueToCode(block, 'DAY', Arduino.ORDER_ATOMIC) || '0';
  generator.addLibrary('qweather', '#include "QWeather.h"');
  return ['qweatherGetFHigh(' + day + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["qweather_f_low"] = function (block, generator) {
  const day = generator.valueToCode(block, 'DAY', Arduino.ORDER_ATOMIC) || '0';
  generator.addLibrary('qweather', '#include "QWeather.h"');
  return ['qweatherGetFLow(' + day + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["qweather_f_text"] = function (block, generator) {
  const day = generator.valueToCode(block, 'DAY', Arduino.ORDER_ATOMIC) || '0';
  generator.addLibrary('qweather', '#include "QWeather.h"');
  return ['String(qweatherGetFText(' + day + '))', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["qweather_f_date"] = function (block, generator) {
  const day = generator.valueToCode(block, 'DAY', Arduino.ORDER_ATOMIC) || '0';
  generator.addLibrary('qweather', '#include "QWeather.h"');
  return ['String(qweatherGetFDate(' + day + '))', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["qweather_ui_open"] = function (block, generator) {
  generator.addLibrary('qweather', '#include "QWeather.h"');
  if (window['projectService']) {
    window['projectService'].addMacro('LV_FONT_MONTSERRAT_48=1');
  }
  return 'qweatherUiOpen();\n';
}
Arduino.forBlock["qweather_ui_show"] = function (block, generator) {
  generator.addLibrary('qweather', '#include "QWeather.h"');
  return 'qweatherUiShow();\n';
}
Arduino.forBlock["qweather_ui_set_time"] = function (block, generator) {
  generator.addLibrary('qweather', '#include "QWeather.h"');
  const h = generator.valueToCode(block, 'HOUR', Arduino.ORDER_ATOMIC) || '0';
  const mi = generator.valueToCode(block, 'MINUTE', Arduino.ORDER_ATOMIC) || '0';
  const mo = generator.valueToCode(block, 'MONTH', Arduino.ORDER_ATOMIC) || '1';
  const md = generator.valueToCode(block, 'MDAY', Arduino.ORDER_ATOMIC) || '1';
  return 'qweatherUiSetTime(' + h + ', ' + mi + ', ' + mo + ', ' + md + ');\n';
}
Arduino.forBlock["qweather_ui_attach"] = function (block, generator) {
  generator.addLibrary('qweather', '#include "QWeather.h"');
  if (window['projectService']) { window['projectService'].addMacro('LV_FONT_MONTSERRAT_48=1'); }
  const parent = generator.getValue(block, 'PARENT', 'field_variable') || 'NULL';
  return 'qweatherUiAttach((void*)' + parent + ');\n';
}
