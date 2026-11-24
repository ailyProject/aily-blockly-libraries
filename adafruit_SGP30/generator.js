// The stock driver performs synchronous I²C commands. Retry a missing device
// on a later operation so the rest of the Arduino sketch can keep running.
function sgp30Support(generator) {
    generator.addLibrary('WIRE_INCLUDE', '#include <Wire.h>');
    generator.addLibrary('ADAFRUIT_SGP30_INCLUDE', '#include "Adafruit_SGP30.h"');
    generator.addObject('Adafruit_SGP30 sgp', 'Adafruit_SGP30 sgp;');
    generator.addObject('sgp30Connection', [
        'TwoWire *sgp30Bus = &Wire;',
        'bool sgp30Connected = false;',
        'bool sgp30Attempted = false;',
        'unsigned long sgp30LastAttempt = 0;'
    ].join('\n'));
    generator.addFunction('sgp30EnsureReady', [
        'bool sgp30EnsureReady() {',
        '  if (sgp30Connected) return true;',
        '  const unsigned long now = millis();',
        '  if (sgp30Attempted && now - sgp30LastAttempt < 1000UL) return false;',
        '  sgp30Attempted = true;',
        '  sgp30LastAttempt = now;',
        '  sgp30Connected = sgp.begin(sgp30Bus);',
        '  return sgp30Connected;',
        '}'
    ].join('\n'));
}

Arduino.forBlock['sgp30_init'] = function(block, generator) {
    sgp30Support(generator);
    const wire = block.getFieldValue('WIRE') || 'Wire';
    return 'sgp30Bus = &' + wire + ';\n' +
        'sgp30Connected = false;\nsgp30Attempted = false;\n' +
        'Serial.println(sgp30EnsureReady() ? "SGP30 sensor initialized" : "SGP30 sensor not found!");\n';
};

function sgp30Measurement(generator, raw) {
    sgp30Support(generator);
    const method = raw ? 'sgp30ReadRaw' : 'sgp30ReadIAQ';
    const call = raw ? 'sgp.IAQmeasureRaw()' : 'sgp.IAQmeasure()';
    generator.addFunction(method, [
        'bool ' + method + '() {',
        '  if (sgp30EnsureReady() && ' + call + ') return true;',
        '  sgp30Connected = false;',
        raw ? '  sgp.rawH2 = sgp.rawEthanol = 0;' : '  sgp.eCO2 = sgp.TVOC = 0;',
        '  return false;',
        '}'
    ].join('\n'));
    return method + '()';
}

Arduino.forBlock['sgp30_measure'] = function(block, generator) {
    return 'if (!' + sgp30Measurement(generator, false) + ') Serial.println("SGP30 measurement failed");\n';
};
Arduino.forBlock['sgp30_measure_raw'] = function(block, generator) {
    return 'if (!' + sgp30Measurement(generator, true) + ') Serial.println("SGP30 raw measurement failed");\n';
};

for (const [type, member] of Object.entries({
    sgp30_get_tvoc: 'TVOC', sgp30_get_eco2: 'eCO2',
    sgp30_get_raw_h2: 'rawH2', sgp30_get_raw_ethanol: 'rawEthanol'
})) {
    Arduino.forBlock[type] = function(block, generator) {
        sgp30Support(generator);
        return ['(sgp30Connected ? sgp.' + member + ' : 0)', generator.ORDER_ATOMIC];
    };
}

Arduino.forBlock['sgp30_set_humidity'] = function(block, generator) {
    sgp30Support(generator);
    generator.addFunction('getAbsoluteHumidity',
        'uint32_t getAbsoluteHumidity(float temperature, float humidity) {\n' +
        '  const float absoluteHumidity = 216.7f * ((humidity / 100.0f) * 6.112f * exp((17.62f * temperature) / (243.12f + temperature)) / (273.15f + temperature));\n' +
        '  return static_cast<uint32_t>(1000.0f * absoluteHumidity);\n' +
        '}\n'
    );
    const temperature = generator.valueToCode(block, 'TEMPERATURE', generator.ORDER_ATOMIC) || '22.0';
    const humidity = generator.valueToCode(block, 'HUMIDITY', generator.ORDER_ATOMIC) || '45.0';
    return 'if (sgp30EnsureReady()) sgp.setHumidity(getAbsoluteHumidity(' + temperature + ', ' + humidity + '));\n';
};

Arduino.forBlock['sgp30_get_baseline'] = function(block, generator) {
    sgp30Support(generator);
    const eco2 = generator.nameDB_.getName(block.getFieldValue('ECO2_BASE'), 'VARIABLE');
    const tvoc = generator.nameDB_.getName(block.getFieldValue('TVOC_BASE'), 'VARIABLE');
    generator.addVariable(eco2, 'uint16_t ' + eco2 + ';');
    generator.addVariable(tvoc, 'uint16_t ' + tvoc + ';');
    return '{\n  uint16_t co2Word = 0, tvocWord = 0;\n' +
        '  if (!sgp30EnsureReady() || !sgp.getIAQBaseline(&co2Word, &tvocWord)) {\n' +
        '    sgp30Connected = false;\n    co2Word = tvocWord = 0;\n' +
        '    Serial.println("Failed to get baseline readings");\n  }\n' +
        '  ' + eco2 + ' = co2Word;\n  ' + tvoc + ' = tvocWord;\n}\n';
};

Arduino.forBlock['sgp30_set_baseline'] = function(block, generator) {
    sgp30Support(generator);
    const eco2 = generator.valueToCode(block, 'ECO2_BASE', generator.ORDER_ATOMIC) || '0x8E68';
    const tvoc = generator.valueToCode(block, 'TVOC_BASE', generator.ORDER_ATOMIC) || '0x8F41';
    return 'if (sgp30EnsureReady()) sgp30Connected = sgp.setIAQBaseline(' + eco2 + ', ' + tvoc + ');\n';
};

Arduino.forBlock['sgp30_get_serial'] = function(block, generator) {
    sgp30Support(generator);
    return ['(sgp30Connected ? String(sgp.serialnumber[0], HEX) + String(sgp.serialnumber[1], HEX) + String(sgp.serialnumber[2], HEX) : String())', generator.ORDER_ATOMIC];
};

// Compatibility for callers that registered their own quick-measure definition.
Arduino.forBlock['sgp30_simple_measure'] = function(block, generator) {
    const member = block.getFieldValue('TYPE') === 'TVOC' ? 'TVOC' : 'eCO2';
    return ['(' + sgp30Measurement(generator, false) + ' ? sgp.' + member + ' : 0)', generator.ORDER_ATOMIC];
};
