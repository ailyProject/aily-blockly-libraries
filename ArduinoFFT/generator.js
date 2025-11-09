"use strict";

Arduino.forBlock["Arduino_FFT_init"] = function (block, generator) {
  const realArray =
    ensureFFTVariableField(block, "REAL_ARRAY", FFT_TYPE_MAP.ARRAY) || "vReal";
  const imagArray =
    ensureFFTVariableField(block, "IMAG_ARRAY", FFT_TYPE_MAP.ARRAY) || "vImag";
  const samples =
    generator.valueToCode(block, "SAMPLES_COUNT", Arduino.ORDER_ATOMIC) || "64";
  const samplingFrequency =
    generator.valueToCode(block, "SAMPLING_FREQUENCY", Arduino.ORDER_ATOMIC) ||
    "5000";

  ensureArduinoFFT(
    generator,
    {
      realArray,
      imagArray,
      samples,
      samplingFrequency,
    },
    true,
  );

  const code =
    `FFT = ArduinoFFT<double>(${realArray}, ${imagArray}, ${samples}, ` +
    `${samplingFrequency});\n`;
  return code;
};

Arduino.forBlock["Arduino_FFT_windowing"] = function (block, generator) {
  const arrayName =
    ensureFFTVariableField(block, "ARRAY", FFT_TYPE_MAP.ARRAY) || "vReal";
  const windowType =
    block.getFieldValue("WINDOW_TYPE") || "FFT_WIN_TYP_HAMMING";
  const direction = block.getFieldValue("DIRECTION") || "FFT_FORWARD";

  ensureArduinoFFT(generator);

  const code =
    `FFT.windowing(${arrayName}, sizeof(${arrayName})/sizeof(${arrayName}[0]), ` +
    `${windowType}, ${direction});\n`;
  return code;
};

Arduino.forBlock["Arduino_FFT_compute"] = function (block, generator) {
  const realArray =
    ensureFFTVariableField(block, "REAL_ARRAY", FFT_TYPE_MAP.ARRAY) || "vReal";
  const imagArray =
    ensureFFTVariableField(block, "IMAG_ARRAY", FFT_TYPE_MAP.ARRAY) || "vImag";
  const samples = getSamplesValue(block, generator, "SAMPLES_COUNT", "64");
  const direction = block.getFieldValue("DIRECTION") || "FFT_FORWARD";

  ensureArduinoFFT(generator);

  const code = `FFT.compute(${realArray}, ${imagArray}, ${samples}, ${direction});\n`;
  return code;
};

Arduino.forBlock["Arduino_FFT_complex_to_magnitude"] = function (
  block,
  generator,
) {
  const realArray =
    ensureFFTVariableField(block, "REAL_ARRAY", FFT_TYPE_MAP.ARRAY) || "vReal";
  const imagArray =
    ensureFFTVariableField(block, "IMAG_ARRAY", FFT_TYPE_MAP.ARRAY) || "vImag";
  const samples = getSamplesValue(block, generator, "SAMPLES_COUNT", "64");

  ensureArduinoFFT(generator);

  const code = `FFT.complexToMagnitude(${realArray}, ${imagArray}, ${samples});\n`;
  return code;
};

Arduino.forBlock["Arduino_FFT_major_peak"] = function (block, generator) {
  const magnitudeArray =
    ensureFFTVariableField(block, "MAGNITUDE_ARRAY", FFT_TYPE_MAP.ARRAY) ||
    "vReal";
  const samples = getSamplesValue(block, generator, "SAMPLES_COUNT", "64");
  const samplingFrequency =
    generator.valueToCode(block, "SAMPLING_FREQUENCY", Arduino.ORDER_ATOMIC) ||
    "5000";

  ensureArduinoFFT(generator);

  const code = `FFT.majorPeak(${magnitudeArray}, ${samples}, ${samplingFrequency})`;
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["Arduino_FFT_get_band"] = function (block, generator) {
  const magnitudeArray =
    ensureFFTVariableField(block, "MAGNITUDE_ARRAY", FFT_TYPE_MAP.ARRAY) ||
    "vReal";
  const samples = getSamplesValue(block, generator, "SAMPLES_COUNT", "64");
  const samplingFrequency =
    generator.valueToCode(block, "SAMPLING_FREQUENCY", Arduino.ORDER_ATOMIC) ||
    "5000";
  const bandIndex =
    generator.valueToCode(block, "BAND_INDEX", Arduino.ORDER_ATOMIC) || "0";

  ensureArduinoFFT(generator);
  ensureFFTBandsHelper(generator);

  const code = `arduinoFFT_getBandValue(${magnitudeArray}, ${samples}, ${samplingFrequency}, ${bandIndex})`;
  return [code, Arduino.ORDER_ATOMIC];
};

function getSamplesValue(block, generator, inputName, fallback) {
  return (
    generator.valueToCode(block, inputName, Arduino.ORDER_ATOMIC) || fallback
  );
}

const FFT_TYPE_MAP = {
  ARRAY: "double[]",
};

const FFT_FIELD_TYPES = {
  REAL_ARRAY: FFT_TYPE_MAP.ARRAY,
  IMAG_ARRAY: FFT_TYPE_MAP.ARRAY,
  ARRAY: FFT_TYPE_MAP.ARRAY,
  MAGNITUDE_ARRAY: FFT_TYPE_MAP.ARRAY,
};

const FFT_DEFAULT_CONTEXT = {
  realArray: "vReal",
  imagArray: "vImag",
  samples: "64",
  samplingFrequency: "5000",
  hasDeclaration: false,
};

function ensureArduinoFFT(generator, overrides = null, forceUpdate = false) {
  const hasGeneratorApi =
    generator && typeof generator.addLibrary === "function";

  if (hasGeneratorApi) {
    generator.addLibrary("ArduinoFFT", "#include <arduinoFFT.h>");
  }

  const ctx = hasGeneratorApi
    ? getOrCreateFFTContext(generator)
    : getLegacyFFTContext();

  if (overrides) {
    updateFFTContext(ctx, overrides);
  }

  if (forceUpdate) {
    ctx.hasDeclaration = false;
  }

  if (!ctx.hasDeclaration) {
    const declaration = buildFFTInstanceCode(ctx);

    if (hasGeneratorApi && typeof generator.addVariable === "function") {
      generator.addVariable("arduinoFFT_FFT_instance", declaration);
    }
    if (hasGeneratorApi) {
      if (!generator.definitions_) {
        generator.definitions_ = {};
      }
      generator.definitions_["arduinoFFT_FFT_instance"] = declaration;
    }

    if (
      (!hasGeneratorApi ||
        (generator && typeof generator.addLibrary !== "function")) &&
      typeof Blockly !== "undefined" &&
      Blockly.Arduino &&
      typeof Blockly.Arduino.addInclude === "function"
    ) {
      Blockly.Arduino.addInclude("ArduinoFFT", "#include <arduinoFFT.h>");
      if (typeof Blockly.Arduino.addDeclaration === "function") {
        Blockly.Arduino.addDeclaration("arduinoFFT_FFT_instance", declaration);
      }
      if (Blockly.Arduino.definitions_) {
        Blockly.Arduino.definitions_["arduinoFFT_FFT_instance"] = declaration;
      }
    }

    ctx.hasDeclaration = true;
  }
}

function getOrCreateFFTContext(holder) {
  if (!holder.__arduinoFFTContext) {
    holder.__arduinoFFTContext = { ...FFT_DEFAULT_CONTEXT };
  }
  return holder.__arduinoFFTContext;
}

function getLegacyFFTContext() {
  if (!ensureArduinoFFT.__legacyContext) {
    ensureArduinoFFT.__legacyContext = { ...FFT_DEFAULT_CONTEXT };
  }
  return ensureArduinoFFT.__legacyContext;
}

function updateFFTContext(ctx, incoming) {
  ["realArray", "imagArray", "samples", "samplingFrequency"].forEach((key) => {
    if (incoming[key]) {
      ctx[key] = incoming[key];
    }
  });
}

function buildFFTInstanceCode(ctx) {
  return `/* Create FFT object */\nArduinoFFT<double> FFT = ArduinoFFT<double>(${ctx.realArray}, ${ctx.imagArray}, ${ctx.samples}, ${ctx.samplingFrequency});`;
}

function ensureFFTVariableField(block, fieldName, varType) {
  const field = block.getField(fieldName);
  if (!field) {
    return null;
  }

  const resolvedType = varType || FFT_FIELD_TYPES[fieldName];
  const variableModel =
    typeof field.getVariable === "function" ? field.getVariable() : null;
  const currentName =
    (variableModel && variableModel.name) ||
    (typeof field.getText === "function" && field.getText()) ||
    "";

  if (
    typeof registerVariableToBlockly === "function" &&
    currentName &&
    resolvedType
  ) {
    registerVariableToBlockly(currentName, resolvedType);
  }

  if (
    !field._fftValidatorAttached &&
    typeof field.setValidator === "function"
  ) {
    field._fftValidatorAttached = true;
    field._fftLastName = currentName;
    field.setValidator(function (newValue) {
      const oldName = field._fftLastName;
      if (
        newValue &&
        oldName &&
        newValue !== oldName &&
        typeof renameVariableInBlockly === "function"
      ) {
        renameVariableInBlockly(block, oldName, newValue, resolvedType);
      }
      field._fftLastName = newValue;
      if (
        typeof registerVariableToBlockly === "function" &&
        newValue &&
        resolvedType
      ) {
        registerVariableToBlockly(newValue, resolvedType);
      }
      return newValue;
    });
  }

  return currentName || null;
}

const FFT_BAND_FUNCTION_NAME = "arduinoFFT_getBandValue";

function ensureFFTBandsHelper(generator) {
  const helperCode = `
double ${FFT_BAND_FUNCTION_NAME}(double *magnitudes, int samples, double samplingFrequency, int bandIndex) {
  const int bands = 8;
  int halfSamples = samples / 2;
  if (halfSamples <= 1) {
    return 0;
  }
  int binsPerBand = halfSamples / bands;
  if (binsPerBand < 1) {
    binsPerBand = 1;
  }
  int startBin = bandIndex * binsPerBand;
  int endBin = (bandIndex + 1) * binsPerBand - 1;
  if (bandIndex >= bands - 1) {
    endBin = halfSamples - 1;
  }
  if (startBin < 1) {
    startBin = 1;
  }
  if (endBin >= halfSamples) {
    endBin = halfSamples - 1;
  }
  double maxValue = 0;
  for (int i = startBin; i <= endBin; ++i) {
    double value = magnitudes[i];
    if (value > maxValue) {
      maxValue = value;
    }
  }
  return maxValue;
}`;

  if (generator && typeof generator.addFunction === "function") {
    generator.addFunction(FFT_BAND_FUNCTION_NAME, helperCode.trim());
  } else if (
    typeof Blockly !== "undefined" &&
    Blockly.Arduino &&
    typeof Blockly.Arduino.addFunction === "function"
  ) {
    Blockly.Arduino.addFunction(FFT_BAND_FUNCTION_NAME, helperCode.trim());
  }
}
