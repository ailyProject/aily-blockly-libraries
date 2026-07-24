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

function ensureEsp32Rainmaker(generator){generator.addLibrary('esp32_rainmaker','#include <RMaker.h>\n#include <RMakerUtils.h>');}
function rmVar(b,n,d){return esp32SafeName(esp32Var(b,n,d),d);}
Arduino.forBlock['esp32_rainmaker_init_node']=function(b,g){ensureEsp32Rainmaker(g);var n=rmVar(b,'NODE','rainmakerNode');g.addObject('esp32_rmaker_node_'+n,'Node '+n+';');return n+' = RMaker.initNode('+esp32Value(g,b,'NAME','"Aily Node"')+');\n';};
Arduino.forBlock['esp32_rainmaker_add_device']=function(b,g){ensureEsp32Rainmaker(g);var n=rmVar(b,'NODE','rainmakerNode'),d=rmVar(b,'DEVICE','rainmakerDevice'),c=b.getFieldValue('CLASS')||'Switch';g.addObject('esp32_rmaker_device_'+d,'::'+c+' '+d+';');var val=esp32Value(g,b,'VALUE',c==='TemperatureSensor'?'25.0':'true');return d+' = ::'+c+'('+esp32Value(g,b,'NAME','"Device"')+', NULL, '+val+');\n'+n+'.addDevice('+d+');\n';};
Arduino.forBlock['esp32_rainmaker_enable_service']=function(b,g){ensureEsp32Rainmaker(g);return 'RMaker.'+(b.getFieldValue('SERVICE')||'enableTZService()')+';\n';};
Arduino.forBlock['esp32_rainmaker_start']=function(b,g){ensureEsp32Rainmaker(g);return 'RMaker.start();\n';};
Arduino.forBlock['esp32_rainmaker_stop']=function(b,g){ensureEsp32Rainmaker(g);return 'RMaker.stop();\n';};
Arduino.forBlock['esp32_rainmaker_report']=function(b,g){ensureEsp32Rainmaker(g);var d=rmVar(b,'DEVICE','rainmakerDevice');return d+'.updateAndReportParam('+esp32Value(g,b,'PARAM','"Power"')+', '+esp32Value(g,b,'VALUE','false')+');\n';};
Arduino.forBlock['esp32_rainmaker_reset']=function(b,g){ensureEsp32Rainmaker(g);return (b.getFieldValue('RESET')||'RMakerFactoryReset')+'('+esp32Value(g,b,'SECONDS','2')+');\n';};
Arduino.forBlock['esp32_rainmaker_node_id']=function(b,g){ensureEsp32Rainmaker(g);return ['String('+rmVar(b,'NODE','rainmakerNode')+'.getNodeID())',g.ORDER_ATOMIC];};
