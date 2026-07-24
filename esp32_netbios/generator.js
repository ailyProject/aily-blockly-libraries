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

function ensureEsp32Netbios(generator) { generator.addLibrary('esp32_netbios', '#include <NetBIOS.h>'); }
Arduino.forBlock['esp32_netbios_begin'] = function(block, generator) { ensureEsp32Netbios(generator); return ['NBNS.begin('+esp32Value(generator,block,'NAME','"esp32"')+')', generator.ORDER_ATOMIC]; };
Arduino.forBlock['esp32_netbios_end'] = function(block, generator) { ensureEsp32Netbios(generator); return 'NBNS.end();\n'; };
