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

function ensureEsp32WifiProv(generator){generator.addLibrary('esp32_wifiprov','#include <WiFiProv.h>');}
Arduino.forBlock['esp32_wifiprov_begin_softap']=function(b,g){ensureEsp32WifiProv(g);return 'WiFiProv.beginProvision(NETWORK_PROV_SCHEME_SOFTAP, NETWORK_PROV_SCHEME_HANDLER_NONE, NETWORK_PROV_SECURITY, '+esp32Value(g,b,'POP','"abcd1234"')+', '+esp32Value(g,b,'NAME','"PROV_ESP32"')+', '+esp32Value(g,b,'KEY','NULL')+', NULL, '+esp32Value(g,b,'RESET','false')+');\n';};
Arduino.forBlock['esp32_wifiprov_begin_ble']=function(b,g){ensureEsp32WifiProv(g);return '#if (defined(CONFIG_BLUEDROID_ENABLED) || defined(CONFIG_NIMBLE_ENABLED)) && __has_include("esp_bt.h")\nWiFiProv.beginProvision(NETWORK_PROV_SCHEME_BLE, NETWORK_PROV_SCHEME_HANDLER_FREE_BTDM, NETWORK_PROV_SECURITY, '+esp32Value(g,b,'POP','"abcd1234"')+', '+esp32Value(g,b,'NAME','"PROV_ESP32"')+', NULL, NULL, '+esp32Value(g,b,'RESET','false')+');\n#endif\n';};
Arduino.forBlock['esp32_wifiprov_end']=function(b,g){ensureEsp32WifiProv(g);return 'WiFiProv.endProvision();\n';};
Arduino.forBlock['esp32_wifiprov_disable_auto_stop']=function(b,g){ensureEsp32WifiProv(g);return ['WiFiProv.disableAutoStop('+esp32Value(g,b,'DELAY','1000')+')',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_wifiprov_print_qr']=function(b,g){ensureEsp32WifiProv(g);return 'WiFiProv.printQR('+esp32Value(g,b,'NAME','"PROV_ESP32"')+', '+esp32Value(g,b,'POP','"abcd1234"')+', "'+(b.getFieldValue('TRANSPORT')||'softap')+'", Serial);\n';};
