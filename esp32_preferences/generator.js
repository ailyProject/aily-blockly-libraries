'use strict';

function ensureEsp32Preferences(generator) {
  generator.addLibrary('Preferences', '#include <Preferences.h>');
  generator.addObject('preferences_obj', 'Preferences preferences;');
}

function esp32PreferencesValue(generator, block, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function esp32PreferencesRawField(block, name, fallback) {
  var value = block.getFieldValue(name);
  value = value == null ? '' : String(value).trim();
  return value || fallback;
}

function esp32PreferencesCallStatement(generator, method, args) {
  ensureEsp32Preferences(generator);
  return 'preferences.' + method + '(' + args.join(', ') + ');\n';
}

function esp32PreferencesCallValue(generator, method, args) {
  ensureEsp32Preferences(generator);
  return ['preferences.' + method + '(' + args.join(', ') + ')', generator.ORDER_FUNCTION_CALL];
}

function esp32PreferencesPutScalar(block, generator, method, valueFallback) {
  var key = esp32PreferencesValue(generator, block, 'KEY', '"key"');
  var value = esp32PreferencesValue(generator, block, 'VALUE', valueFallback);
  return esp32PreferencesCallStatement(generator, method, [key, value]);
}

function esp32PreferencesGetScalar(block, generator, method, defaultFallback) {
  var key = esp32PreferencesValue(generator, block, 'KEY', '"key"');
  var defaultValue = esp32PreferencesValue(generator, block, 'DEFAULT', defaultFallback);
  return esp32PreferencesCallValue(generator, method, [key, defaultValue]);
}

Arduino.forBlock['esp32_preferences_begin'] = function(block, generator) {
  var namespace = esp32PreferencesValue(generator, block, 'NAMESPACE', '"storage"');
  var readOnly = block.getFieldValue('READONLY') || 'false';
  return esp32PreferencesCallStatement(generator, 'begin', [namespace, readOnly]);
};

Arduino.forBlock['esp32_preferences_begin_partition'] = function(block, generator) {
  var namespace = esp32PreferencesValue(generator, block, 'NAMESPACE', '"storage"');
  var readOnly = block.getFieldValue('READONLY') || 'false';
  var partition = esp32PreferencesValue(generator, block, 'PARTITION', 'NULL');
  return esp32PreferencesCallStatement(generator, 'begin', [namespace, readOnly, partition]);
};

Arduino.forBlock['esp32_preferences_end'] = function(block, generator) {
  return esp32PreferencesCallStatement(generator, 'end', []);
};

Arduino.forBlock['esp32_preferences_clear'] = function(block, generator) {
  return esp32PreferencesCallStatement(generator, 'clear', []);
};

Arduino.forBlock['esp32_preferences_remove'] = function(block, generator) {
  var key = esp32PreferencesValue(generator, block, 'KEY', '"key"');
  return esp32PreferencesCallStatement(generator, 'remove', [key]);
};

Arduino.forBlock['esp32_preferences_put_char'] = function(block, generator) {
  return esp32PreferencesPutScalar(block, generator, 'putChar', '0');
};

Arduino.forBlock['esp32_preferences_get_char'] = function(block, generator) {
  return esp32PreferencesGetScalar(block, generator, 'getChar', '0');
};

Arduino.forBlock['esp32_preferences_put_uchar'] = function(block, generator) {
  return esp32PreferencesPutScalar(block, generator, 'putUChar', '0');
};

Arduino.forBlock['esp32_preferences_get_uchar'] = function(block, generator) {
  return esp32PreferencesGetScalar(block, generator, 'getUChar', '0');
};

Arduino.forBlock['esp32_preferences_put_short'] = function(block, generator) {
  return esp32PreferencesPutScalar(block, generator, 'putShort', '0');
};

Arduino.forBlock['esp32_preferences_get_short'] = function(block, generator) {
  return esp32PreferencesGetScalar(block, generator, 'getShort', '0');
};

Arduino.forBlock['esp32_preferences_put_ushort'] = function(block, generator) {
  return esp32PreferencesPutScalar(block, generator, 'putUShort', '0');
};

Arduino.forBlock['esp32_preferences_get_ushort'] = function(block, generator) {
  return esp32PreferencesGetScalar(block, generator, 'getUShort', '0');
};

Arduino.forBlock['esp32_preferences_put_int'] = function(block, generator) {
  return esp32PreferencesPutScalar(block, generator, 'putInt', '0');
};

Arduino.forBlock['esp32_preferences_get_int'] = function(block, generator) {
  return esp32PreferencesGetScalar(block, generator, 'getInt', '0');
};

Arduino.forBlock['esp32_preferences_put_uint'] = function(block, generator) {
  return esp32PreferencesPutScalar(block, generator, 'putUInt', '0');
};

Arduino.forBlock['esp32_preferences_get_uint'] = function(block, generator) {
  return esp32PreferencesGetScalar(block, generator, 'getUInt', '0');
};

Arduino.forBlock['esp32_preferences_put_long'] = function(block, generator) {
  return esp32PreferencesPutScalar(block, generator, 'putLong', '0');
};

Arduino.forBlock['esp32_preferences_get_long'] = function(block, generator) {
  return esp32PreferencesGetScalar(block, generator, 'getLong', '0');
};

Arduino.forBlock['esp32_preferences_put_ulong'] = function(block, generator) {
  return esp32PreferencesPutScalar(block, generator, 'putULong', '0');
};

Arduino.forBlock['esp32_preferences_get_ulong'] = function(block, generator) {
  return esp32PreferencesGetScalar(block, generator, 'getULong', '0');
};

Arduino.forBlock['esp32_preferences_put_long64'] = function(block, generator) {
  return esp32PreferencesPutScalar(block, generator, 'putLong64', '0');
};

Arduino.forBlock['esp32_preferences_get_long64'] = function(block, generator) {
  return esp32PreferencesGetScalar(block, generator, 'getLong64', '0');
};

Arduino.forBlock['esp32_preferences_put_ulong64'] = function(block, generator) {
  return esp32PreferencesPutScalar(block, generator, 'putULong64', '0');
};

Arduino.forBlock['esp32_preferences_get_ulong64'] = function(block, generator) {
  return esp32PreferencesGetScalar(block, generator, 'getULong64', '0');
};

Arduino.forBlock['esp32_preferences_put_float'] = function(block, generator) {
  return esp32PreferencesPutScalar(block, generator, 'putFloat', '0.0');
};

Arduino.forBlock['esp32_preferences_get_float'] = function(block, generator) {
  return esp32PreferencesGetScalar(block, generator, 'getFloat', '0.0');
};

Arduino.forBlock['esp32_preferences_put_double'] = function(block, generator) {
  return esp32PreferencesPutScalar(block, generator, 'putDouble', '0.0');
};

Arduino.forBlock['esp32_preferences_get_double'] = function(block, generator) {
  return esp32PreferencesGetScalar(block, generator, 'getDouble', '0.0');
};

Arduino.forBlock['esp32_preferences_put_bool'] = function(block, generator) {
  return esp32PreferencesPutScalar(block, generator, 'putBool', 'false');
};

Arduino.forBlock['esp32_preferences_get_bool'] = function(block, generator) {
  return esp32PreferencesGetScalar(block, generator, 'getBool', 'false');
};

Arduino.forBlock['esp32_preferences_put_string'] = function(block, generator) {
  return esp32PreferencesPutScalar(block, generator, 'putString', '""');
};

Arduino.forBlock['esp32_preferences_get_string'] = function(block, generator) {
  return esp32PreferencesGetScalar(block, generator, 'getString', '""');
};

Arduino.forBlock['esp32_preferences_put_bytes'] = function(block, generator) {
  var key = esp32PreferencesValue(generator, block, 'KEY', '"key"');
  var buffer = esp32PreferencesRawField(block, 'BUFFER', 'buffer');
  var length = esp32PreferencesValue(generator, block, 'LENGTH', '0');
  return esp32PreferencesCallStatement(generator, 'putBytes', [key, buffer, length]);
};

Arduino.forBlock['esp32_preferences_get_bytes'] = function(block, generator) {
  var key = esp32PreferencesValue(generator, block, 'KEY', '"key"');
  var buffer = esp32PreferencesRawField(block, 'BUFFER', 'buffer');
  var maxLength = esp32PreferencesValue(generator, block, 'MAX_LENGTH', '0');
  return esp32PreferencesCallValue(generator, 'getBytes', [key, buffer, maxLength]);
};

Arduino.forBlock['esp32_preferences_get_string_length'] = function(block, generator) {
  var key = esp32PreferencesValue(generator, block, 'KEY', '"key"');
  return esp32PreferencesCallValue(generator, 'getStringLength', [key]);
};

Arduino.forBlock['esp32_preferences_get_bytes_length'] = function(block, generator) {
  var key = esp32PreferencesValue(generator, block, 'KEY', '"key"');
  return esp32PreferencesCallValue(generator, 'getBytesLength', [key]);
};

Arduino.forBlock['esp32_preferences_is_key'] = function(block, generator) {
  var key = esp32PreferencesValue(generator, block, 'KEY', '"key"');
  return esp32PreferencesCallValue(generator, 'isKey', [key]);
};

Arduino.forBlock['esp32_preferences_get_type'] = function(block, generator) {
  var key = esp32PreferencesValue(generator, block, 'KEY', '"key"');
  return esp32PreferencesCallValue(generator, 'getType', [key]);
};

Arduino.forBlock['esp32_preferences_type_constant'] = function(block, generator) {
  ensureEsp32Preferences(generator);
  return [block.getFieldValue('TYPE') || 'PT_INVALID', generator.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_preferences_free_entries'] = function(block, generator) {
  return esp32PreferencesCallValue(generator, 'freeEntries', []);
};
