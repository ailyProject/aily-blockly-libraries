function esp32Value(generator, block, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}
function esp32Var(block, name, fallback) {
  var f = block.getField(name);
  return f ? f.getText() : fallback;
}
function esp32SafeName(name, fallback) {
  var clean = String(name || fallback).replace(/[^A-Za-z0-9_]/g, '_');
  return /^[A-Za-z_]/.test(clean) ? clean : '_' + clean;
}

function ensureEsp32Sr(generator){generator.addLibrary('esp32_esp_sr','#include <ESP_SR.h>');generator.addObject('esp32_sr_state','volatile int esp32_sr_last_event = -1;\nvolatile int esp32_sr_last_command = -1;\nvolatile int esp32_sr_last_phrase = -1;');generator.addFunction('esp32_sr_event_handler','void esp32_sr_event_handler(sr_event_t event, int command_id, int phrase_id) {\n  esp32_sr_last_event = (int)event;\n  esp32_sr_last_command = command_id;\n  esp32_sr_last_phrase = phrase_id;\n}');}
Arduino.forBlock['esp32_esp_sr_begin']=function(b,g){ensureEsp32Sr(g);var i=esp32SafeName(esp32Var(b,'I2S','I2S'),'I2S');var a=[1,2,3,4].map(function(n){return '{'+n+', '+esp32Value(g,b,'CMD'+n,'"command '+n+'"')+'}';}).join(',\n  ');g.addObject('esp32_sr_commands','static const sr_cmd_t esp32_sr_commands[] = {\n  '+a+'\n};');g.addSetupBegin('esp32_sr_callback','ESP_SR.onEvent(esp32_sr_event_handler);');return ['ESP_SR.begin('+i+', esp32_sr_commands, sizeof(esp32_sr_commands) / sizeof(sr_cmd_t), '+(b.getFieldValue('CHANNELS')||'SR_CHANNELS_MONO')+', SR_MODE_WAKEWORD, '+esp32Value(g,b,'FORMAT','"M"')+')',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_esp_sr_control']=function(b,g){ensureEsp32Sr(g);return ['ESP_SR.'+(b.getFieldValue('ACTION')||'pause')+'()',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_esp_sr_set_mode']=function(b,g){ensureEsp32Sr(g);return ['ESP_SR.setMode('+(b.getFieldValue('MODE')||'SR_MODE_WAKEWORD')+')',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_esp_sr_last_event']=function(b,g){ensureEsp32Sr(g);return ['esp32_sr_last_event',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_esp_sr_last_command']=function(b,g){ensureEsp32Sr(g);return ['esp32_sr_last_command',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_esp_sr_last_phrase']=function(b,g){ensureEsp32Sr(g);return ['esp32_sr_last_phrase',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_esp_sr_event_constant']=function(b,g){ensureEsp32Sr(g);return [b.getFieldValue('EVENT')||'SR_EVENT_WAKEWORD',g.ORDER_ATOMIC];};
