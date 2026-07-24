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

function ensureEsp32OpenThread(generator){generator.addLibrary('esp32_openthread','#include <OThread.h>');}
Arduino.forBlock['esp32_openthread_begin']=function(b,g){ensureEsp32OpenThread(g);return 'OThread.begin('+esp32Value(g,b,'AUTO','true')+');\n';};
Arduino.forBlock['esp32_openthread_end']=function(b,g){ensureEsp32OpenThread(g);return 'OThread.end();\n';};
Arduino.forBlock['esp32_openthread_control']=function(b,g){ensureEsp32OpenThread(g);return 'OThread.'+(b.getFieldValue('ACTION')||'start')+'();\n';};
Arduino.forBlock['esp32_openthread_running']=function(b,g){ensureEsp32OpenThread(g);return ['(bool)OThread',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_openthread_role']=function(b,g){ensureEsp32OpenThread(g);return ['String(OThread.otGetStringDeviceRole())',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_openthread_has_dataset']=function(b,g){ensureEsp32OpenThread(g);return ['OThread.hasActiveDataset()',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_openthread_dataset']=function(b,g){ensureEsp32OpenThread(g);var n=esp32SafeName(esp32Var(b,'DATASET','threadDataset'),'threadDataset');g.addObject('esp32_ot_dataset_'+n,'DataSet '+n+';');return n+'.initNew();\n'+n+'.setNetworkName('+esp32Value(g,b,'NAME','"aily-thread"')+');\n'+n+'.setChannel('+esp32Value(g,b,'CHANNEL','15')+');\n'+n+'.setPanId('+esp32Value(g,b,'PANID','0x1234')+');\nOThread.commitDataSet('+n+');\n';};
Arduino.forBlock['esp32_openthread_network_number']=function(b,g){ensureEsp32OpenThread(g);return ['OThread.'+(b.getFieldValue('INFO')||'getChannel')+'()',g.ORDER_ATOMIC];};
Arduino.forBlock['esp32_openthread_network_text']=function(b,g){ensureEsp32OpenThread(g);var m=b.getFieldValue('INFO')||'getNetworkName';return [m==='getNetworkName'?'OThread.getNetworkName()':'OThread.'+m+'().toString()',g.ORDER_ATOMIC];};
