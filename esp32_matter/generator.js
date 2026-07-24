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

function ensureEsp32Matter(generator){generator.addLibrary('esp32_matter','#include <Matter.h>');}
function matterVar(b,n,d){return esp32SafeName(esp32Var(b,n,d),d);}
Arduino.forBlock['esp32_matter_begin']=function(b,g){ensureEsp32Matter(g);return 'Matter.begin();\n';};
Arduino.forBlock['esp32_matter_status']=function(b,g){ensureEsp32Matter(g);return ['Matter.'+(b.getFieldValue('STATUS')||'isDeviceCommissioned')+'()',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_matter_pairing_code']=function(b,g){ensureEsp32Matter(g);return ['Matter.'+(b.getFieldValue('CODE')||'getManualPairingCode')+'()',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_matter_decommission']=function(b,g){ensureEsp32Matter(g);return 'Matter.decommission();\n';};
Arduino.forBlock['esp32_matter_create_onoff_light']=function(b,g){ensureEsp32Matter(g);var n=matterVar(b,'DEVICE','matterLight');g.addObject('esp32_matter_'+n,'MatterOnOffLight '+n+';');return n+'.begin('+esp32Value(g,b,'STATE','false')+');\n';};
Arduino.forBlock['esp32_matter_create_dimmable_light']=function(b,g){ensureEsp32Matter(g);var n=matterVar(b,'DEVICE','matterDimmer');g.addObject('esp32_matter_'+n,'MatterDimmableLight '+n+';');return n+'.begin('+esp32Value(g,b,'STATE','false')+', '+esp32Value(g,b,'BRIGHTNESS','64')+');\n';};
Arduino.forBlock['esp32_matter_light_set']=function(b,g){ensureEsp32Matter(g);var n=matterVar(b,'DEVICE','matterLight');return n+'.'+(b.getFieldValue('PROPERTY')||'setOnOff')+'('+esp32Value(g,b,'VALUE','false')+');\n';};
Arduino.forBlock['esp32_matter_light_get']=function(b,g){ensureEsp32Matter(g);var n=matterVar(b,'DEVICE','matterLight');return [n+'.'+(b.getFieldValue('PROPERTY')||'getOnOff')+'()',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_matter_create_numeric_sensor']=function(b,g){ensureEsp32Matter(g);var n=matterVar(b,'DEVICE','matterSensor'),c=b.getFieldValue('SENSOR')||'MatterTemperatureSensor';g.addObject('esp32_matter_'+n,c+' '+n+';');return n+'.begin((double)('+esp32Value(g,b,'VALUE','0')+'));\n';};
Arduino.forBlock['esp32_matter_numeric_sensor_set']=function(b,g){ensureEsp32Matter(g);var n=matterVar(b,'DEVICE','matterSensor');return n+'.'+(b.getFieldValue('METHOD')||'setTemperature')+'((double)('+esp32Value(g,b,'VALUE','0')+'));\n';};
Arduino.forBlock['esp32_matter_create_boolean_sensor']=function(b,g){ensureEsp32Matter(g);var n=matterVar(b,'DEVICE','matterContact'),c=b.getFieldValue('SENSOR')||'MatterContactSensor';g.addObject('esp32_matter_'+n,c+' '+n+';');return n+'.begin('+esp32Value(g,b,'VALUE','false')+');\n';};
Arduino.forBlock['esp32_matter_boolean_sensor_set']=function(b,g){ensureEsp32Matter(g);var n=matterVar(b,'DEVICE','matterContact');return n+'.'+(b.getFieldValue('METHOD')||'setContact')+'('+esp32Value(g,b,'VALUE','false')+');\n';};
