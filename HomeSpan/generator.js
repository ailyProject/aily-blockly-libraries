'use strict';

function ailySafeName(name, fallback) {
  const raw = String(name || fallback || 'obj').trim();
  const safe = raw.replace(/[^A-Za-z0-9_]/g, '_').replace(/^[^A-Za-z_]+/, '');
  return safe || fallback || 'obj';
}

function ailyFieldVar(block, field, fallback) {
  const varField = block.getField(field);
  return ailySafeName(varField ? varField.getText() : block.getFieldValue(field), fallback);
}

function ailyValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function ailyRegister(name, type) {
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(name, type);
  }
}

function ailyBlockId(block) {
  return String(block.id || Math.random().toString(36).slice(2)).replace(/[^A-Za-z0-9_]/g, '_');
}


function homespanEnsure(generator) {
  generator.addLibrary('HomeSpan', '#include <HomeSpan.h>');
  generator.addFunction('aily_homespan_led_service', 'struct AilyHomeSpanLED : Service::LightBulb {\n  int ledPin;\n  SpanCharacteristic *power;\n  AilyHomeSpanLED(int pin) : Service::LightBulb() {\n    power = new Characteristic::On();\n    ledPin = pin;\n    pinMode(ledPin, OUTPUT);\n  }\n  boolean update() override {\n    digitalWrite(ledPin, power->getNewVal());\n    return true;\n  }\n};\n');
}
Arduino.forBlock['homespan_begin'] = function(block, generator) { homespanEnsure(generator); const name = ailyValue(block, generator, 'NAME', '"Aily HomeSpan"'); if (block.getFieldValue('SERIAL') === 'TRUE') { if (typeof ensureSerialBegin === 'function') ensureSerialBegin('Serial', generator); else generator.addSetupBegin('serial_begin', 'Serial.begin(115200);'); } generator.addLoopBegin('homespan_poll', 'homeSpan.poll();'); return 'homeSpan.begin(' + block.getFieldValue('CATEGORY') + ', ' + name + ');\n'; };
Arduino.forBlock['homespan_poll'] = function(block, generator) { homespanEnsure(generator); return 'homeSpan.poll();\n'; };
Arduino.forBlock['homespan_accessory_info'] = function(block, generator) { homespanEnsure(generator); const name = ailyValue(block, generator, 'NAME', '"Accessory"'); const manufacturer = ailyValue(block, generator, 'MANUFACTURER', '"Aily"'); const model = ailyValue(block, generator, 'MODEL', '"ESP32"'); return 'new SpanAccessory();\n  new Service::AccessoryInformation();\n    new Characteristic::Identify();\n    new Characteristic::Name(' + name + ');\n    new Characteristic::Manufacturer(' + manufacturer + ');\n    new Characteristic::Model(' + model + ');\n'; };
Arduino.forBlock['homespan_lightbulb_service'] = function(block, generator) { homespanEnsure(generator); const on = block.getFieldValue('ON') === 'TRUE' ? 'true' : 'false'; return 'new Service::LightBulb();\n  new Characteristic::On(' + on + ');\n'; };
Arduino.forBlock['homespan_led_lightbulb_service'] = function(block, generator) { homespanEnsure(generator); const pin = ailyValue(block, generator, 'PIN', '2'); return 'new AilyHomeSpanLED(' + pin + ');\n'; };
Arduino.forBlock['homespan_outlet_service'] = function(block, generator) { homespanEnsure(generator); const on = block.getFieldValue('ON') === 'TRUE' ? 'true' : 'false'; return 'new Service::Outlet();\n  new Characteristic::On(' + on + ');\n  new Characteristic::OutletInUse(true);\n'; };
Arduino.forBlock['homespan_set_pairing_code'] = function(block, generator) { homespanEnsure(generator); return 'homeSpan.setPairingCode("' + (block.getFieldValue('CODE') || '11122333') + '");\n'; };
Arduino.forBlock['homespan_set_qr_id'] = function(block, generator) { homespanEnsure(generator); return 'homeSpan.setQRID("' + (block.getFieldValue('QRID') || 'HSPN') + '");\n'; };
