function mlx90642EnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('MLX90642', '#include <Arduino.h>\nextern "C" {\n#include <MLX90642.h>\n#include <MLX90642_depends.h>\n}');
}

function mlx90642GetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'mlx90642');
}

function mlx90642Value(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function mlx90642Addr(varName) {
  return varName + '_addr';
}

function mlx90642Frame(varName) {
  return varName + '_frame';
}

function mlx90642AttachVar(block) {
  if (block._mlx90642VarAttached) return;
  block._mlx90642VarAttached = true;
  block._mlx90642VarLastName = block.getFieldValue('VAR') || 'mlx90642';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._mlx90642VarLastName, 'MLX90642');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._mlx90642VarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._mlx90642VarLastName, newName, 'MLX90642');
      block._mlx90642VarLastName = newName;
    }
  };
}

function mlx90642EnsureFrameHelpers(generator) {
  generator.addFunction('mlx90642_pixel_raw', 'uint16_t mlx90642PixelRaw(const uint16_t *frame, int x, int y) {\n  if (x < 0) x = 0;\n  if (x > 31) x = 31;\n  if (y < 0) y = 0;\n  if (y > 23) y = 23;\n  return frame[y * 32 + x];\n}\n');
  generator.addFunction('mlx90642_pixel_c', 'float mlx90642PixelC(const uint16_t *frame, int x, int y) {\n  return ((int16_t)mlx90642PixelRaw(frame, x, y)) / 100.0f;\n}\n');
  generator.addFunction('mlx90642_frame_stat_c', 'float mlx90642FrameStatC(const uint16_t *frame, uint8_t mode) {\n  int16_t minValue = (int16_t)frame[0];\n  int16_t maxValue = minValue;\n  int32_t sum = 0;\n  for (uint16_t i = 0; i < MLX90642_TOTAL_NUMBER_OF_PIXELS; i++) {\n    int16_t value = (int16_t)frame[i];\n    if (value < minValue) minValue = value;\n    if (value > maxValue) maxValue = value;\n    sum += value;\n  }\n  if (mode == 0) return minValue / 100.0f;\n  if (mode == 1) return maxValue / 100.0f;\n  return (sum / (float)MLX90642_TOTAL_NUMBER_OF_PIXELS) / 100.0f;\n}\n');
}

function mlx90642EnsurePrintHelper(generator) {
  mlx90642EnsureFrameHelpers(generator);
  generator.addFunction('mlx90642_print_frame_csv', 'void mlx90642PrintFrameCsv(Stream &out, const uint16_t *frame) {\n  for (uint8_t y = 0; y < 24; y++) {\n    for (uint8_t x = 0; x < 32; x++) {\n      out.print(mlx90642PixelC(frame, x, y), 2);\n      if (x < 31) out.print(",");\n    }\n    out.println();\n  }\n}\n');
}

Arduino.forBlock['mlx90642_init'] = function(block, generator) {
  mlx90642AttachVar(block);
  mlx90642EnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'mlx90642';
  var sda = mlx90642Value(block, generator, 'SDA', '16');
  var scl = mlx90642Value(block, generator, 'SCL', '15');
  var address = block.getFieldValue('ADDRESS') || '0x66';
  var mode = block.getFieldValue('MODE') || 'MLX90642_CONT_MEAS_MODE';
  var rate = block.getFieldValue('RATE') || 'MLX90642_REF_RATE_8HZ';
  var format = block.getFieldValue('FORMAT') || 'MLX90642_TEMPERATURE_OUTPUT';
  generator.addObject(mlx90642Addr(varName), 'const uint8_t ' + mlx90642Addr(varName) + ' = ' + address + ';');
  generator.addObject(mlx90642Frame(varName), 'uint16_t ' + mlx90642Frame(varName) + '[MLX90642_TOTAL_NUMBER_OF_PIXELS];');
  return 'MLX90642_I2CInit(' + sda + ', ' + scl + ');\n' +
    'MLX90642_WakeUp(' + mlx90642Addr(varName) + ');\n' +
    'while (MLX90642_Init(' + mlx90642Addr(varName) + ') != 0) {\n  delay(500);\n}\n' +
    'MLX90642_SetMeasMode(' + mlx90642Addr(varName) + ', ' + mode + ');\n' +
    'MLX90642_SetRefreshRate(' + mlx90642Addr(varName) + ', ' + rate + ');\n' +
    'MLX90642_SetOutputFormat(' + mlx90642Addr(varName) + ', ' + format + ');\n' +
    'delay(300);\n';
};

Arduino.forBlock['mlx90642_data_ready'] = function(block, generator) {
  mlx90642EnsureLib(generator);
  var varName = mlx90642GetVar(block);
  return ['(MLX90642_IsDataReady(' + mlx90642Addr(varName) + ') == MLX90642_YES)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['mlx90642_read_frame'] = function(block, generator) {
  mlx90642EnsureLib(generator);
  var varName = mlx90642GetVar(block);
  return 'MLX90642_GetImage(' + mlx90642Addr(varName) + ', ' + mlx90642Frame(varName) + ');\n';
};

Arduino.forBlock['mlx90642_measure_now'] = function(block, generator) {
  mlx90642EnsureLib(generator);
  var varName = mlx90642GetVar(block);
  return ['(MLX90642_MeasureNow(' + mlx90642Addr(varName) + ', ' + mlx90642Frame(varName) + ') == 0)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['mlx90642_pixel_value'] = function(block, generator) {
  mlx90642EnsureLib(generator);
  mlx90642EnsureFrameHelpers(generator);
  var varName = mlx90642GetVar(block);
  var x = mlx90642Value(block, generator, 'X', '0');
  var y = mlx90642Value(block, generator, 'Y', '0');
  var unit = block.getFieldValue('UNIT') || 'C';
  var fn = unit === 'RAW' ? 'mlx90642PixelRaw' : 'mlx90642PixelC';
  return [fn + '(' + mlx90642Frame(varName) + ', ' + x + ', ' + y + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mlx90642_frame_stat'] = function(block, generator) {
  mlx90642EnsureLib(generator);
  mlx90642EnsureFrameHelpers(generator);
  var varName = mlx90642GetVar(block);
  var map = { MIN: '0', MAX: '1', AVG: '2' };
  var stat = map[block.getFieldValue('STAT') || 'AVG'] || '2';
  return ['mlx90642FrameStatC(' + mlx90642Frame(varName) + ', ' + stat + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mlx90642_progress'] = function(block, generator) {
  mlx90642EnsureLib(generator);
  var varName = mlx90642GetVar(block);
  return ['MLX90642_GetProgress(' + mlx90642Addr(varName) + ')', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mlx90642_print_frame_csv'] = function(block, generator) {
  mlx90642EnsureLib(generator);
  mlx90642EnsurePrintHelper(generator);
  var varName = mlx90642GetVar(block);
  var serialName = block.getFieldValue('SERIAL') || 'Serial';
  var baud = mlx90642Value(block, generator, 'BAUD', '921600');
  generator.addSetupBegin('mlx90642_' + serialName + '_begin', serialName + '.begin(' + baud + ');');
  return 'mlx90642PrintFrameCsv(' + serialName + ', ' + mlx90642Frame(varName) + ');\n';
};

Arduino.forBlock['mlx90642_sleep'] = function(block, generator) {
  mlx90642EnsureLib(generator);
  var varName = mlx90642GetVar(block);
  return 'MLX90642_GotoSleep(' + mlx90642Addr(varName) + ');\n';
};
