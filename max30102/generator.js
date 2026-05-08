// MAX30102 pulse oximeter Blockly generator

function ensureMAX30102Library(generator) {
  generator.addLibrary('wire', '#include <Wire.h>');
  generator.addLibrary('max30102', '#include "max30102.h"');
  generator.addLibrary('max30102_rf_algorithm', '#include "algorithm_by_RF.h"');
  generator.addLibrary('max30102_settings', '#include "max30102_settings.h"');
}

function ensureMAX30102Support(generator) {
  ensureMAX30102Library(generator);

  generator.addVariable('max30102_int_pin', 'int8_t _ailyMax30102IntPin = -1;');
  generator.addVariable('max30102_ir_buffer', 'uint32_t _ailyMax30102IrBuffer[BUFFER_SIZE];');
  generator.addVariable('max30102_red_buffer', 'uint32_t _ailyMax30102RedBuffer[BUFFER_SIZE];');
  generator.addVariable('max30102_last_red', 'uint32_t _ailyMax30102LastRed = 0;');
  generator.addVariable('max30102_last_ir', 'uint32_t _ailyMax30102LastIr = 0;');
  generator.addVariable('max30102_spo2', 'float _ailyMax30102SpO2 = 0.0;');
  generator.addVariable('max30102_ratio', 'float _ailyMax30102Ratio = 0.0;');
  generator.addVariable('max30102_correlation', 'float _ailyMax30102Correlation = 0.0;');
  generator.addVariable('max30102_temperature', 'float _ailyMax30102Temperature = 0.0;');
  generator.addVariable('max30102_heart_rate', 'int32_t _ailyMax30102HeartRate = 0;');
  generator.addVariable('max30102_spo2_valid', 'int8_t _ailyMax30102SpO2Valid = 0;');
  generator.addVariable('max30102_hr_valid', 'int8_t _ailyMax30102HeartRateValid = 0;');
  generator.addVariable('max30102_last_ok', 'bool _ailyMax30102LastOK = false;');
  generator.addVariable('max30102_initialized', 'bool _ailyMax30102Initialized = false;');
  generator.addVariable('max30102_finger_threshold', 'uint32_t _ailyMax30102FingerThreshold = 50000;');
  generator.addVariable('max30102_sample_averaging', 'SampleAveraging _ailyMax30102SampleAveraging = AVG_4;');
  generator.addVariable('max30102_adc_range', 'SPO2_ADC_Range _ailyMax30102AdcRange = ADC_RANGE_4096;');
  generator.addVariable('max30102_sample_rate', 'SPO2_SampleRate _ailyMax30102SampleRate = SPO2_RATE_100;');
  generator.addVariable('max30102_pulse_width', 'SPO2_PulseWidth _ailyMax30102PulseWidth = PW_411;');

  const helperCode =
`bool ailyMax30102ApplySpO2Config() {
  if (!setSampleAveraging(_ailyMax30102SampleAveraging)) return false;
  if (!setSPO2ADCRange(_ailyMax30102AdcRange)) return false;
  if (!setSPO2SampleRate(_ailyMax30102SampleRate)) return false;
  if (!setSPO2PulseWidth(_ailyMax30102PulseWidth)) return false;
  return true;
}

bool ailyMax30102SetSpO2Config(SampleAveraging averaging, SPO2_ADC_Range adcRange, SPO2_SampleRate sampleRate, SPO2_PulseWidth pulseWidth) {
  _ailyMax30102SampleAveraging = averaging;
  _ailyMax30102AdcRange = adcRange;
  _ailyMax30102SampleRate = sampleRate;
  _ailyMax30102PulseWidth = pulseWidth;
  if (!_ailyMax30102Initialized) {
    return true;
  }
  return ailyMax30102ApplySpO2Config();
}

bool ailyMax30102Configure() {
  maxim_max30102_reset();
  delay(1000);

  uint8_t dummy;
  maxim_max30102_read_reg(REG_INTR_STATUS_1, &dummy);

  if (!maxim_max30102_write_reg(REG_INTR_ENABLE_1, 0xc0)) return false;
  if (!maxim_max30102_write_reg(REG_INTR_ENABLE_2, 0x00)) return false;
  if (!maxim_max30102_write_reg(REG_FIFO_WR_PTR, 0x00)) return false;
  if (!maxim_max30102_write_reg(REG_OVF_COUNTER, 0x00)) return false;
  if (!maxim_max30102_write_reg(REG_FIFO_RD_PTR, 0x00)) return false;
  if (!maxim_max30102_write_reg(REG_FIFO_CONFIG, 0x0f)) return false;
  if (!maxim_max30102_write_reg(REG_MODE_CONFIG, 0x03)) return false;
  if (!maxim_max30102_write_reg(REG_SPO2_CONFIG, 0x00)) return false;
  if (!ailyMax30102ApplySpO2Config()) return false;
  if (!maxim_max30102_write_reg(REG_LED1_PA, 0x24)) return false;
  if (!maxim_max30102_write_reg(REG_LED2_PA, 0x24)) return false;
  if (!maxim_max30102_write_reg(REG_PILOT_PA, 0x7f)) return false;
  return true;
}

bool ailyMax30102Begin(uint8_t sdaPin, uint8_t sclPin, uint8_t intPin) {
  _ailyMax30102IntPin = intPin;
  pinMode(_ailyMax30102IntPin, INPUT);
#if defined(ESP32)
  Wire.begin(sdaPin, sclPin);
#else
  (void)sdaPin;
  (void)sclPin;
  Wire.begin();
#endif
  Wire.setClock(400000L);
  _ailyMax30102Initialized = ailyMax30102Configure();
  _ailyMax30102LastOK = _ailyMax30102Initialized;
  return _ailyMax30102Initialized;
}

bool ailyMax30102Measure(uint32_t timeoutMs) {
  if (!_ailyMax30102Initialized || _ailyMax30102IntPin < 0) {
    _ailyMax30102LastOK = false;
    return false;
  }

  uint32_t measureStartMs = millis();
  for (int32_t i = 0; i < BUFFER_SIZE; i++) {
    while (digitalRead(_ailyMax30102IntPin) == HIGH) {
      if (timeoutMs > 0 && (millis() - measureStartMs) > timeoutMs) {
        _ailyMax30102LastOK = false;
        return false;
      }
      delay(1);
    }
    if (!maxim_max30102_read_fifo(&_ailyMax30102RedBuffer[i], &_ailyMax30102IrBuffer[i])) {
      _ailyMax30102LastOK = false;
      return false;
    }
  }

  _ailyMax30102LastRed = _ailyMax30102RedBuffer[BUFFER_SIZE - 1];
  _ailyMax30102LastIr = _ailyMax30102IrBuffer[BUFFER_SIZE - 1];
  rf_heart_rate_and_oxygen_saturation(
    _ailyMax30102IrBuffer,
    BUFFER_SIZE,
    _ailyMax30102RedBuffer,
    &_ailyMax30102SpO2,
    &_ailyMax30102SpO2Valid,
    &_ailyMax30102HeartRate,
    &_ailyMax30102HeartRateValid,
    &_ailyMax30102Ratio,
    &_ailyMax30102Correlation
  );

  int8_t integerTemperature = 0;
  uint8_t fractionalTemperature = 0;
  if (maxim_max30102_read_temperature(&integerTemperature, &fractionalTemperature)) {
    _ailyMax30102Temperature = integerTemperature + ((float)fractionalTemperature) / 16.0;
  }

  _ailyMax30102LastOK = (_ailyMax30102SpO2Valid == 1 && _ailyMax30102HeartRateValid == 1);
  return _ailyMax30102LastOK;
}`;

  generator.addFunction('aily_max30102_support', helperCode);
}

Arduino.forBlock['max30102_init'] = function(block, generator) {
  ensureMAX30102Support(generator);
  const sdaPin = block.getFieldValue('SDA_PIN') || '0';
  const sclPin = block.getFieldValue('SCL_PIN') || '0';
  const intPin = block.getFieldValue('INT_PIN') || '0';
  return 'ailyMax30102Begin(' + sdaPin + ', ' + sclPin + ', ' + intPin + ');\n';
};

Arduino.forBlock['max30102_measure'] = function(block, generator) {
  ensureMAX30102Support(generator);
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '5000';
  return 'ailyMax30102Measure(' + timeout + ');\n';
};

Arduino.forBlock['max30102_get_value'] = function(block, generator) {
  ensureMAX30102Support(generator);
  const value = block.getFieldValue('VALUE') || 'SPO2';
  const valueMap = {
    SPO2: '_ailyMax30102SpO2',
    HEART_RATE: '_ailyMax30102HeartRate',
    TEMPERATURE: '_ailyMax30102Temperature',
    RED: '_ailyMax30102LastRed',
    IR: '_ailyMax30102LastIr',
    RATIO: '_ailyMax30102Ratio',
    CORRELATION: '_ailyMax30102Correlation'
  };
  return [valueMap[value] || '_ailyMax30102SpO2', generator.ORDER_ATOMIC];
};

Arduino.forBlock['max30102_is_valid'] = function(block, generator) {
  ensureMAX30102Support(generator);
  const target = block.getFieldValue('TARGET') || 'MEASURE';
  const validMap = {
    MEASURE: '_ailyMax30102LastOK',
    INIT: '_ailyMax30102Initialized',
    SPO2: '(_ailyMax30102SpO2Valid == 1)',
    HEART_RATE: '(_ailyMax30102HeartRateValid == 1)',
    FINGER: '(_ailyMax30102LastIr > _ailyMax30102FingerThreshold)'
  };
  return [validMap[target] || '_ailyMax30102LastOK', generator.ORDER_ATOMIC];
};

Arduino.forBlock['max30102_reset'] = function(block, generator) {
  ensureMAX30102Support(generator);
  return 'maxim_max30102_reset();\n';
};

Arduino.forBlock['max30102_set_led_amplitude'] = function(block, generator) {
  ensureMAX30102Support(generator);
  const led1 = generator.valueToCode(block, 'LED1', generator.ORDER_ATOMIC) || '36';
  const led2 = generator.valueToCode(block, 'LED2', generator.ORDER_ATOMIC) || '36';
  return 'setLED1PulseAmplitude((uint8_t)(' + led1 + '));\n' +
    'setLED2PulseAmplitude((uint8_t)(' + led2 + '));\n';
};

Arduino.forBlock['max30102_config_spo2'] = function(block, generator) {
  ensureMAX30102Support(generator);
  const averaging = block.getFieldValue('AVERAGING') || 'AVG_4';
  const adcRange = block.getFieldValue('ADC_RANGE') || 'ADC_RANGE_4096';
  const sampleRate = block.getFieldValue('SAMPLE_RATE') || 'SPO2_RATE_100';
  const pulseWidth = block.getFieldValue('PULSE_WIDTH') || 'PW_411';
  return 'ailyMax30102SetSpO2Config(' + averaging + ', ' + adcRange + ', ' + sampleRate + ', ' + pulseWidth + ');\n';
};

Arduino.forBlock['max30102_set_finger_threshold'] = function(block, generator) {
  ensureMAX30102Support(generator);
  const threshold = generator.valueToCode(block, 'THRESHOLD', generator.ORDER_ATOMIC) || '50000';
  return '_ailyMax30102FingerThreshold = (uint32_t)(' + threshold + ');\n';
};
