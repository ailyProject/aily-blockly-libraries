function lm35Read(block, generator, calibrated) {
  generator.addLibrary('AilyLM35', '#include <AilyLM35.h>');
  const pin = block.getFieldValue('PIN') || 'A0';
  const expression = calibrated
    ? 'AilyLM35::readCalibrated(' + pin + ', ' + Number(block.getFieldValue('REFERENCE_MV')) + ', ' + Number(block.getFieldValue('MAX_CODE')) + ')'
    : 'AilyLM35::readCelsius(' + pin + ')';
  return [expression, generator.ORDER_FUNCTION_CALL];
}

Arduino.forBlock['lm35_read'] = (block, generator) => lm35Read(block, generator, false);
Arduino.forBlock['lm35_read_calibrated'] = (block, generator) => lm35Read(block, generator, true);
