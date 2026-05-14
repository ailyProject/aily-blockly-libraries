"use strict";

const ARDUINO_FFT_VARIABLE_TYPE = "ArduinoFFT";
const ARDUINO_FFT_DEFAULT_NAME = "fft";
const ARDUINO_FFT_DEFAULT_FREQUENCY = "5000";

Arduino.forBlock['arduino_fft_init'] = function(block, generator) {
  attachFFTInputVarMonitor(block, 'VAR', ARDUINO_FFT_VARIABLE_TYPE, ARDUINO_FFT_DEFAULT_NAME);

  const fftName = sanitizeFFTIdentifier(block.getFieldValue('VAR') || ARDUINO_FFT_DEFAULT_NAME, ARDUINO_FFT_DEFAULT_NAME);
  const dataType = block.getFieldValue('DATA_TYPE') || 'double';
  const samples = block.getFieldValue('SAMPLES') || '64';
  const samplingFrequency = generator.valueToCode(block, 'SAMPLING_FREQUENCY', Arduino.ORDER_ATOMIC) || ARDUINO_FFT_DEFAULT_FREQUENCY;

  registerFFTVariable(fftName, ARDUINO_FFT_VARIABLE_TYPE);
  ensureArduinoFFTLibrary(generator);
  const context = ensureFFTStorage(generator, fftName, dataType, samples);

  generator.addVariable(context.frequencyKey, dataType + ' ' + context.frequencyName + ' = 0;');
  generator.addVariable(context.objectKey, 'ArduinoFFT<' + dataType + '> ' + fftName + ';');

  return context.frequencyName + ' = ' + samplingFrequency + ';\n' +
    fftName + ' = ArduinoFFT<' + dataType + '>(' + context.realName + ', ' + context.imagName + ', ' + context.samplesName + ', ' + context.frequencyName + ');\n';
};

Arduino.forBlock['arduino_fft_set_sample'] = function(block, generator) {
  const fftName = getFFTVariableName(block);
  const context = getFFTContext(fftName);
  const index = generator.valueToCode(block, 'INDEX', Arduino.ORDER_ATOMIC) || '0';
  const real = generator.valueToCode(block, 'REAL', Arduino.ORDER_ATOMIC) || '0';
  const imag = generator.valueToCode(block, 'IMAG', Arduino.ORDER_ATOMIC) || '0';

  ensureArduinoFFTLibrary(generator);

  return '{\n' +
    '  uint16_t arduinoFFT_index = (uint16_t)(' + index + ');\n' +
    '  if (arduinoFFT_index < ' + context.samplesName + ') {\n' +
    '    ' + context.realName + '[arduinoFFT_index] = ' + real + ';\n' +
    '    ' + context.imagName + '[arduinoFFT_index] = ' + imag + ';\n' +
    '  }\n' +
    '}\n';
};

Arduino.forBlock['arduino_fft_clear_samples'] = function(block, generator) {
  const fftName = getFFTVariableName(block);
  const context = getFFTContext(fftName);

  ensureArduinoFFTLibrary(generator);

  return 'for (uint16_t arduinoFFT_i = 0; arduinoFFT_i < ' + context.samplesName + '; arduinoFFT_i++) {\n' +
    '  ' + context.realName + '[arduinoFFT_i] = 0;\n' +
    '  ' + context.imagName + '[arduinoFFT_i] = 0;\n' +
    '}\n';
};

Arduino.forBlock['arduino_fft_sample_analog'] = function(block, generator) {
  const fftName = getFFTVariableName(block);
  const context = getFFTContext(fftName);
  const pin = generator.valueToCode(block, 'PIN', Arduino.ORDER_ATOMIC) || 'A0';
  const offset = generator.valueToCode(block, 'OFFSET', Arduino.ORDER_ATOMIC) || '0';
  const scale = generator.valueToCode(block, 'SCALE', Arduino.ORDER_ATOMIC) || '1';

  ensureArduinoFFTLibrary(generator);
  ensureFFTSampleAnalogHelper(generator);

  return 'arduinoFFT_sampleAnalog(' + context.realName + ', ' + context.imagName + ', ' + context.samplesName + ', ' + context.frequencyName + ', ' + pin + ', ' + offset + ', ' + scale + ');\n';
};

Arduino.forBlock['arduino_fft_generate_tone'] = function(block, generator) {
  const fftName = getFFTVariableName(block);
  const context = getFFTContext(fftName);
  const frequency = generator.valueToCode(block, 'FREQUENCY', Arduino.ORDER_ATOMIC) || '1000';
  const amplitude = generator.valueToCode(block, 'AMPLITUDE', Arduino.ORDER_ATOMIC) || '100';
  const offset = generator.valueToCode(block, 'OFFSET', Arduino.ORDER_ATOMIC) || '0';

  ensureArduinoFFTLibrary(generator);
  ensureFFTGenerateToneHelper(generator);

  return 'arduinoFFT_generateTone(' + context.realName + ', ' + context.imagName + ', ' + context.samplesName + ', ' + context.frequencyName + ', ' + frequency + ', ' + amplitude + ', ' + offset + ');\n';
};

Arduino.forBlock['arduino_fft_dc_removal'] = function(block, generator) {
  const fftName = getFFTVariableName(block);
  ensureArduinoFFTLibrary(generator);
  return fftName + '.dcRemoval();\n';
};

Arduino.forBlock['arduino_fft_windowing'] = function(block, generator) {
  const fftName = getFFTVariableName(block);
  const windowType = block.getFieldValue('WINDOW_TYPE') || 'FFT_WIN_TYP_HAMMING';
  const direction = block.getFieldValue('DIRECTION') || 'FFT_FORWARD';
  const compensation = checkboxToBoolean(block, 'COMPENSATION');

  ensureArduinoFFTLibrary(generator);

  return fftName + '.windowing(' + windowType + ', ' + direction + ', ' + compensation + ');\n';
};

Arduino.forBlock['arduino_fft_compute'] = function(block, generator) {
  const fftName = getFFTVariableName(block);
  const direction = block.getFieldValue('DIRECTION') || 'FFT_FORWARD';

  ensureArduinoFFTLibrary(generator);

  return fftName + '.compute(' + direction + ');\n';
};

Arduino.forBlock['arduino_fft_complex_to_magnitude'] = function(block, generator) {
  const fftName = getFFTVariableName(block);
  ensureArduinoFFTLibrary(generator);
  return fftName + '.complexToMagnitude();\n';
};

Arduino.forBlock['arduino_fft_process'] = function(block, generator) {
  const fftName = getFFTVariableName(block);
  const windowType = block.getFieldValue('WINDOW_TYPE') || 'FFT_WIN_TYP_HAMMING';
  const removeDc = block.getFieldValue('REMOVE_DC') === 'TRUE';
  const compensation = checkboxToBoolean(block, 'COMPENSATION');

  ensureArduinoFFTLibrary(generator);

  let code = '';
  if (removeDc) {
    code += fftName + '.dcRemoval();\n';
  }
  code += fftName + '.windowing(' + windowType + ', FFT_FORWARD, ' + compensation + ');\n';
  code += fftName + '.compute(FFT_FORWARD);\n';
  code += fftName + '.complexToMagnitude();\n';
  return code;
};

Arduino.forBlock['arduino_fft_major_peak'] = function(block, generator) {
  const fftName = getFFTVariableName(block);
  ensureArduinoFFTLibrary(generator);
  return [fftName + '.majorPeak()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['arduino_fft_major_peak_parabola'] = function(block, generator) {
  const fftName = getFFTVariableName(block);
  ensureArduinoFFTLibrary(generator);
  return [fftName + '.majorPeakParabola()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['arduino_fft_peak_magnitude'] = function(block, generator) {
  const fftName = getFFTVariableName(block);
  ensureArduinoFFTLibrary(generator);
  ensureFFTPeakMagnitudeHelper(generator);
  return ['arduinoFFT_peakMagnitude(' + fftName + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['arduino_fft_bin_frequency'] = function(block, generator) {
  const fftName = getFFTVariableName(block);
  const context = getFFTContext(fftName);
  const index = generator.valueToCode(block, 'INDEX', Arduino.ORDER_ATOMIC) || '0';

  ensureArduinoFFTLibrary(generator);
  ensureFFTBinFrequencyHelper(generator);

  return ['arduinoFFT_binFrequency(' + context.samplesName + ', ' + context.frequencyName + ', ' + index + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['arduino_fft_bin_magnitude'] = function(block, generator) {
  const fftName = getFFTVariableName(block);
  const context = getFFTContext(fftName);
  const index = generator.valueToCode(block, 'INDEX', Arduino.ORDER_ATOMIC) || '0';

  ensureArduinoFFTLibrary(generator);
  ensureFFTBinMagnitudeHelper(generator);

  return ['arduinoFFT_binMagnitude(' + context.realName + ', ' + context.samplesName + ', ' + index + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['arduino_fft_band_magnitude'] = function(block, generator) {
  const fftName = getFFTVariableName(block);
  const context = getFFTContext(fftName);
  const bandIndex = generator.valueToCode(block, 'BAND_INDEX', Arduino.ORDER_ATOMIC) || '0';
  const bandCount = block.getFieldValue('BAND_COUNT') || '8';

  ensureArduinoFFTLibrary(generator);
  ensureFFTBandMagnitudeHelper(generator);

  return ['arduinoFFT_bandMagnitude(' + context.realName + ', ' + context.samplesName + ', ' + bandIndex + ', ' + bandCount + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock['arduino_fft_print_bins'] = function(block, generator) {
  const fftName = getFFTVariableName(block);
  const context = getFFTContext(fftName);
  const serialPort = block.getFieldValue('SERIAL') || 'Serial';
  const startIndex = generator.valueToCode(block, 'START_INDEX', Arduino.ORDER_ATOMIC) || '1';
  const endIndex = generator.valueToCode(block, 'END_INDEX', Arduino.ORDER_ATOMIC) || '(' + context.samplesName + ' / 2)';

  ensureArduinoFFTLibrary(generator);
  ensureSerialBegin(serialPort, generator);
  ensureFFTPrintBinsHelper(generator);

  return 'arduinoFFT_printBins(' + serialPort + ', ' + context.realName + ', ' + context.samplesName + ', ' + context.frequencyName + ', ' + startIndex + ', ' + endIndex + ');\n';
};

Arduino.forBlock['arduino_fft_revision'] = function(block, generator) {
  ensureArduinoFFTLibrary(generator);
  return ['FFT_LIB_REV', Arduino.ORDER_ATOMIC];
};

function ensureArduinoFFTLibrary(generator) {
  const boardConfig = typeof window !== 'undefined' ? window['boardConfig'] : null;
  if (boardConfig && boardConfig.core) {
    String(boardConfig.core);
  }
  generator.addLibrary('ArduinoFFT', '#include <arduinoFFT.h>');
}

function ensureFFTStorage(generator, fftName, dataType, samples) {
  const context = getFFTContext(fftName);
  generator.addVariable(context.samplesKey, 'const uint16_t ' + context.samplesName + ' = ' + samples + ';');
  generator.addVariable(context.realKey, dataType + ' ' + context.realName + '[' + context.samplesName + '];');
  generator.addVariable(context.imagKey, dataType + ' ' + context.imagName + '[' + context.samplesName + '];');
  return context;
}

function getFFTContext(fftName) {
  const name = sanitizeFFTIdentifier(fftName || ARDUINO_FFT_DEFAULT_NAME, ARDUINO_FFT_DEFAULT_NAME);
  return {
    objectKey: 'arduino_fft_object_' + name,
    samplesKey: 'arduino_fft_samples_' + name,
    realKey: 'arduino_fft_real_' + name,
    imagKey: 'arduino_fft_imag_' + name,
    frequencyKey: 'arduino_fft_frequency_' + name,
    samplesName: name + '_samples',
    realName: name + '_real',
    imagName: name + '_imag',
    frequencyName: name + '_samplingFrequency'
  };
}

function getFFTVariableName(block) {
  attachFFTVariableFieldMonitor(block, 'VAR', ARDUINO_FFT_VARIABLE_TYPE, ARDUINO_FFT_DEFAULT_NAME);
  const varField = block.getField('VAR');
  const rawName = varField && typeof varField.getText === 'function' ? varField.getText() : ARDUINO_FFT_DEFAULT_NAME;
  const fftName = sanitizeFFTIdentifier(rawName, ARDUINO_FFT_DEFAULT_NAME);
  registerFFTVariable(fftName, ARDUINO_FFT_VARIABLE_TYPE);
  return fftName;
}

function attachFFTInputVarMonitor(block, fieldName, varType, fallback) {
  if (block._varMonitorAttached) {
    return;
  }

  block._varMonitorAttached = true;
  block._varLastName = sanitizeFFTIdentifier(block.getFieldValue(fieldName) || fallback, fallback);
  registerFFTVariable(block._varLastName, varType);

  const varField = block.getField(fieldName);
  if (!varField) {
    return;
  }

  if (typeof varField.setValidator === 'function') {
    varField.setValidator(function(newName) {
      return sanitizeFFTIdentifier(newName || fallback, fallback);
    });
  }

  const originalFinishEditing = varField.onFinishEditing_;
  varField.onFinishEditing_ = function(newName) {
    const nextName = sanitizeFFTIdentifier(newName || fallback, fallback);
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, nextName);
    }
    const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
    const oldName = block._varLastName;
    if (workspace && oldName && nextName && oldName !== nextName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, oldName, nextName, varType);
    }
    block._varLastName = nextName;
    registerFFTVariable(nextName, varType);
    return nextName;
  };
}

function attachFFTVariableFieldMonitor(block, fieldName, varType, fallback) {
  const varField = block.getField(fieldName);
  if (!varField || varField._arduinoFFTVarMonitorAttached) {
    return;
  }

  varField._arduinoFFTVarMonitorAttached = true;
  varField._arduinoFFTLastName = sanitizeFFTIdentifier(
    typeof varField.getText === 'function' ? varField.getText() : fallback,
    fallback
  );

  const originalFinishEditing = varField.onFinishEditing_;
  varField.onFinishEditing_ = function(newName) {
    const nextName = sanitizeFFTIdentifier(newName || fallback, fallback);
    if (typeof originalFinishEditing === 'function') {
      originalFinishEditing.call(this, nextName);
    }
    const oldName = varField._arduinoFFTLastName;
    if (oldName && nextName && oldName !== nextName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, oldName, nextName, varType);
    }
    varField._arduinoFFTLastName = nextName;
    registerFFTVariable(nextName, varType);
    return nextName;
  };
}

function registerFFTVariable(varName, varType) {
  if (typeof registerVariableToBlockly === 'function' && varName) {
    registerVariableToBlockly(varName, varType);
  }
}

function sanitizeFFTIdentifier(value, fallback) {
  let name = String(value || fallback || ARDUINO_FFT_DEFAULT_NAME).trim().replace(/[^A-Za-z0-9_]/g, '_');
  if (!name) {
    name = fallback || ARDUINO_FFT_DEFAULT_NAME;
  }
  if (!/^[A-Za-z_]/.test(name)) {
    name = '_' + name;
  }
  return name;
}

function checkboxToBoolean(block, fieldName) {
  return block.getFieldValue(fieldName) === 'TRUE' ? 'true' : 'false';
}

function ensureSerialBegin(serialPort, generator) {
  if (generator && typeof generator.addSetupBegin === 'function') {
    generator.addSetupBegin('arduino_fft_' + serialPort + '_begin', serialPort + '.begin(115200);');
  }
}

function ensureFFTSampleAnalogHelper(generator) {
  const code = `template <typename T>
void arduinoFFT_sampleAnalog(T *realData, T *imagData, uint16_t samples, T samplingFrequency, int pin, T offset, T scale) {
  if (samplingFrequency <= 0) {
    return;
  }
  unsigned long samplingPeriodUs = (unsigned long)round(1000000.0 / samplingFrequency);
  unsigned long microseconds = micros();
  for (uint16_t i = 0; i < samples; i++) {
    realData[i] = (((T)analogRead(pin)) - offset) * scale;
    imagData[i] = 0;
    while (micros() - microseconds < samplingPeriodUs) {
    }
    microseconds += samplingPeriodUs;
  }
}`;
  generator.addFunction('arduinoFFT_sampleAnalog', code);
}

function ensureFFTGenerateToneHelper(generator) {
  const code = `template <typename T>
void arduinoFFT_generateTone(T *realData, T *imagData, uint16_t samples, T samplingFrequency, T frequency, T amplitude, T offset) {
  if (samplingFrequency <= 0) {
    return;
  }
  T ratio = (T)twoPi * frequency / samplingFrequency;
  for (uint16_t i = 0; i < samples; i++) {
    realData[i] = offset + (amplitude * sin((T)i * ratio));
    imagData[i] = 0;
  }
}`;
  generator.addFunction('arduinoFFT_generateTone', code);
}

function ensureFFTPeakMagnitudeHelper(generator) {
  const code = `template <typename T>
T arduinoFFT_peakMagnitude(ArduinoFFT<T> &fft) {
  T frequency = 0;
  T magnitude = 0;
  fft.majorPeak(&frequency, &magnitude);
  return magnitude;
}`;
  generator.addFunction('arduinoFFT_peakMagnitude', code);
}

function ensureFFTBinFrequencyHelper(generator) {
  const code = `template <typename T>
T arduinoFFT_binFrequency(uint16_t samples, T samplingFrequency, uint16_t index) {
  if (samples == 0) {
    return 0;
  }
  return ((T)index * samplingFrequency) / (T)samples;
}`;
  generator.addFunction('arduinoFFT_binFrequency', code);
}

function ensureFFTBinMagnitudeHelper(generator) {
  const code = `template <typename T>
T arduinoFFT_binMagnitude(T *magnitudes, uint16_t samples, uint16_t index) {
  uint16_t halfSamples = samples >> 1;
  if (index >= halfSamples) {
    return 0;
  }
  return magnitudes[index];
}`;
  generator.addFunction('arduinoFFT_binMagnitude', code);
}

function ensureFFTBandMagnitudeHelper(generator) {
  const code = `template <typename T>
T arduinoFFT_bandMagnitude(T *magnitudes, uint16_t samples, uint16_t bandIndex, uint16_t bandCount) {
  uint16_t halfSamples = samples >> 1;
  if (halfSamples <= 1 || bandCount == 0 || bandIndex >= bandCount) {
    return 0;
  }
  uint16_t startBin = (uint32_t)bandIndex * halfSamples / bandCount;
  uint16_t endBin = ((uint32_t)(bandIndex + 1) * halfSamples / bandCount);
  if (endBin > 0) {
    endBin--;
  }
  if (startBin < 1) {
    startBin = 1;
  }
  if (endBin >= halfSamples) {
    endBin = halfSamples - 1;
  }
  if (startBin > endBin) {
    return 0;
  }
  T maxValue = 0;
  for (uint16_t i = startBin; i <= endBin; i++) {
    if (magnitudes[i] > maxValue) {
      maxValue = magnitudes[i];
    }
  }
  return maxValue;
}`;
  generator.addFunction('arduinoFFT_bandMagnitude', code);
}

function ensureFFTPrintBinsHelper(generator) {
  const code = `template <typename T>
void arduinoFFT_printBins(Stream &serial, T *magnitudes, uint16_t samples, T samplingFrequency, uint16_t startBin, uint16_t endBin) {
  uint16_t halfSamples = samples >> 1;
  if (halfSamples == 0) {
    return;
  }
  if (endBin >= halfSamples) {
    endBin = halfSamples - 1;
  }
  if (startBin > endBin) {
    return;
  }
  for (uint16_t i = startBin; i <= endBin; i++) {
    serial.print(((T)i * samplingFrequency) / (T)samples, 6);
    serial.print("Hz ");
    serial.println(magnitudes[i], 4);
  }
}`;
  generator.addFunction('arduinoFFT_printBins', code);
}