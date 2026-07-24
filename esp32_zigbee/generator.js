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

function ensureEsp32Zigbee(generator){generator.addLibrary('esp32_zigbee','#include <Zigbee.h>');}
function zbVar(b,n,d){return esp32SafeName(esp32Var(b,n,d),d);}
Arduino.forBlock['esp32_zigbee_begin']=function(b,g){ensureEsp32Zigbee(g);return ['Zigbee.begin('+(b.getFieldValue('ROLE')||'ZIGBEE_END_DEVICE')+', '+esp32Value(g,b,'ERASE','false')+')',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_zigbee_connected']=function(b,g){ensureEsp32Zigbee(g);return ['Zigbee.connected()',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_zigbee_network']=function(b,g){ensureEsp32Zigbee(g);var m=b.getFieldValue('ACTION')||'openNetwork';return 'Zigbee.'+m+'('+(m==='openNetwork'?esp32Value(g,b,'SECONDS','180'):'')+');\n';};
Arduino.forBlock['esp32_zigbee_factory_reset']=function(b,g){ensureEsp32Zigbee(g);return 'Zigbee.factoryReset();\n';};
Arduino.forBlock['esp32_zigbee_create_light']=function(b,g){ensureEsp32Zigbee(g);var n=zbVar(b,'DEVICE','zigbeeLight');g.addObject('esp32_zb_'+n,'ZigbeeLight '+n+'('+esp32Value(g,b,'ENDPOINT','10')+');');return 'Zigbee.addEndpoint(&'+n+');\n';};
Arduino.forBlock['esp32_zigbee_set_light']=function(b,g){ensureEsp32Zigbee(g);return zbVar(b,'DEVICE','zigbeeLight')+'.setLight('+esp32Value(g,b,'STATE','false')+');\n';};
Arduino.forBlock['esp32_zigbee_get_light']=function(b,g){ensureEsp32Zigbee(g);return [zbVar(b,'DEVICE','zigbeeLight')+'.getLightState()',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_zigbee_create_temp']=function(b,g){ensureEsp32Zigbee(g);var n=zbVar(b,'DEVICE','zigbeeTemp');g.addObject('esp32_zb_'+n,'ZigbeeTempSensor '+n+'('+esp32Value(g,b,'ENDPOINT','10')+');');return 'Zigbee.addEndpoint(&'+n+');\n';};
Arduino.forBlock['esp32_zigbee_set_temp']=function(b,g){ensureEsp32Zigbee(g);var n=zbVar(b,'DEVICE','zigbeeTemp');return n+'.setTemperature('+esp32Value(g,b,'VALUE','25')+');\n'+n+'.reportTemperature();\n';};
Arduino.forBlock['esp32_zigbee_create_occupancy']=function(b,g){ensureEsp32Zigbee(g);var n=zbVar(b,'DEVICE','zigbeeOccupancy');g.addObject('esp32_zb_'+n,'ZigbeeOccupancySensor '+n+'('+esp32Value(g,b,'ENDPOINT','10')+');');return 'Zigbee.addEndpoint(&'+n+');\n';};
Arduino.forBlock['esp32_zigbee_set_occupancy']=function(b,g){ensureEsp32Zigbee(g);var n=zbVar(b,'DEVICE','zigbeeOccupancy');return n+'.setOccupancy('+esp32Value(g,b,'VALUE','false')+');\n'+n+'.report();\n';};
Arduino.forBlock['esp32_zigbee_create_contact']=function(b,g){ensureEsp32Zigbee(g);var n=zbVar(b,'DEVICE','zigbeeContact');g.addObject('esp32_zb_'+n,'ZigbeeContactSwitch '+n+'('+esp32Value(g,b,'ENDPOINT','10')+');');return 'Zigbee.addEndpoint(&'+n+');\n';};
Arduino.forBlock['esp32_zigbee_set_contact']=function(b,g){ensureEsp32Zigbee(g);return zbVar(b,'DEVICE','zigbeeContact')+'.'+(b.getFieldValue('STATE')||'setClosed')+'();\n';};
