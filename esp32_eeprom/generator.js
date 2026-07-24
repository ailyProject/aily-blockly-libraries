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

function ensureEsp32Eeprom(generator) { generator.addLibrary('esp32_eeprom', '#include <EEPROM.h>'); }
Arduino.forBlock['esp32_eeprom_begin'] = function(block, generator) { ensureEsp32Eeprom(generator); return 'EEPROM.begin(' + esp32Value(generator, block, 'SIZE', '512') + ');\n'; };
Arduino.forBlock['esp32_eeprom_read'] = function(block, generator) { ensureEsp32Eeprom(generator); return ['EEPROM.read(' + esp32Value(generator, block, 'ADDRESS', '0') + ')', generator.ORDER_ATOMIC]; };
Arduino.forBlock['esp32_eeprom_write'] = function(block, generator) { ensureEsp32Eeprom(generator); return 'EEPROM.write(' + esp32Value(generator, block, 'ADDRESS', '0') + ', ' + esp32Value(generator, block, 'VALUE', '0') + ');\n'; };
Arduino.forBlock['esp32_eeprom_read_typed'] = function(block, generator) { ensureEsp32Eeprom(generator); var m=block.getFieldValue('METHOD') || 'readInt'; return ['EEPROM.'+m+'('+esp32Value(generator,block,'ADDRESS','0')+')', generator.ORDER_ATOMIC]; };
Arduino.forBlock['esp32_eeprom_write_typed'] = function(block, generator) { ensureEsp32Eeprom(generator); var m=block.getFieldValue('METHOD') || 'writeInt'; return 'EEPROM.'+m+'('+esp32Value(generator,block,'ADDRESS','0')+', '+esp32Value(generator,block,'VALUE','0')+');\n'; };
Arduino.forBlock['esp32_eeprom_read_string'] = function(block, generator) { ensureEsp32Eeprom(generator); return ['EEPROM.readString('+esp32Value(generator,block,'ADDRESS','0')+')', generator.ORDER_ATOMIC]; };
Arduino.forBlock['esp32_eeprom_write_string'] = function(block, generator) { ensureEsp32Eeprom(generator); return 'EEPROM.writeString('+esp32Value(generator,block,'ADDRESS','0')+', '+esp32Value(generator,block,'TEXT','String()')+');\n'; };
Arduino.forBlock['esp32_eeprom_commit'] = function(block, generator) { ensureEsp32Eeprom(generator); return ['EEPROM.commit()', generator.ORDER_ATOMIC]; };
Arduino.forBlock['esp32_eeprom_end'] = function(block, generator) { ensureEsp32Eeprom(generator); return 'EEPROM.end();\n'; };
Arduino.forBlock['esp32_eeprom_length'] = function(block, generator) { ensureEsp32Eeprom(generator); return ['EEPROM.length()', generator.ORDER_ATOMIC]; };
Arduino.forBlock['esp32_eeprom_dirty'] = function(block, generator) { ensureEsp32Eeprom(generator); return ['EEPROM.isDirty()', generator.ORDER_ATOMIC]; };
