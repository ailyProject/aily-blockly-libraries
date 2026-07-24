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

function ensureEsp32Ppp(generator) { generator.addLibrary('esp32_ppp', '#include <PPP.h>'); }
Arduino.forBlock['esp32_ppp_set_apn']=function(b,g){ensureEsp32Ppp(g);return 'PPP.setApn('+esp32Value(g,b,'APN','"internet"')+');\nPPP.setPin('+esp32Value(g,b,'PIN','""')+');\n';};
Arduino.forBlock['esp32_ppp_set_pins']=function(b,g){ensureEsp32Ppp(g);return 'PPP.setPins('+esp32Value(g,b,'TX','17')+', '+esp32Value(g,b,'RX','16')+', '+esp32Value(g,b,'RTS','-1')+', '+esp32Value(g,b,'CTS','-1')+');\n';};
Arduino.forBlock['esp32_ppp_set_reset']=function(b,g){ensureEsp32Ppp(g);return 'PPP.setResetPin('+esp32Value(g,b,'RST','-1')+', '+esp32Value(g,b,'ACTIVE_LOW','true')+');\n';};
Arduino.forBlock['esp32_ppp_begin']=function(b,g){ensureEsp32Ppp(g);return ['PPP.begin('+(b.getFieldValue('MODEL')||'PPP_MODEM_GENERIC')+', '+esp32Value(g,b,'UART','1')+', '+esp32Value(g,b,'BAUD','115200')+')',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_ppp_end']=function(b,g){ensureEsp32Ppp(g);return 'PPP.end();\n';};
Arduino.forBlock['esp32_ppp_attached']=function(b,g){ensureEsp32Ppp(g);return ['PPP.attached()',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_ppp_sync']=function(b,g){ensureEsp32Ppp(g);return ['PPP.sync()',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_ppp_info_number']=function(b,g){ensureEsp32Ppp(g);return ['PPP.'+(b.getFieldValue('INFO')||'RSSI')+'()',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_ppp_info_text']=function(b,g){ensureEsp32Ppp(g);return ['PPP.'+(b.getFieldValue('INFO')||'IMEI')+'()',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_ppp_sms']=function(b,g){ensureEsp32Ppp(g);return ['PPP.sms('+esp32Value(g,b,'NUMBER','""')+', '+esp32Value(g,b,'MESSAGE','""')+')',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_ppp_at']=function(b,g){ensureEsp32Ppp(g);return ['PPP.cmd('+esp32Value(g,b,'COMMAND','"AT"')+', '+esp32Value(g,b,'TIMEOUT','1000')+')',g.ORDER_ATOMIC];};
