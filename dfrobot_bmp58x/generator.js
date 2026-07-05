function bmp58xEnsureLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('DFRobot_BMP58X', '#include <DFRobot_BMP58X.h>');
}

function bmp58xGetVar(block) {
  var field = block.getField('VAR');
  return field ? field.getText() : (block.getFieldValue('VAR') || 'bmp58x');
}

function bmp58xValue(block, generator, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function bmp58xCore() {
  if (typeof window === 'undefined' || !window.boardConfig) return '';
  return String(window.boardConfig.core || window.boardConfig.board || '');
}

function bmp58xAttachVar(block) {
  if (block._bmp58xVarAttached) return;
  block._bmp58xVarAttached = true;
  block._bmp58xVarLastName = block.getFieldValue('VAR') || 'bmp58x';
  if (typeof registerVariableToBlockly === 'function') {
    registerVariableToBlockly(block._bmp58xVarLastName, 'DFRobot_BMP58X');
  }
  var field = block.getField('VAR');
  if (!field) return;
  var originalFinish = field.onFinishEditing_;
  field.onFinishEditing_ = function(newName) {
    if (typeof originalFinish === 'function') originalFinish.call(this, newName);
    if (newName && newName !== block._bmp58xVarLastName && typeof renameVariableInBlockly === 'function') {
      renameVariableInBlockly(block, block._bmp58xVarLastName, newName, 'DFRobot_BMP58X');
      block._bmp58xVarLastName = newName;
    }
  };
}

function bmp58xBeginCode(varName) {
  return 'while (!' + varName + '.begin()) {\n  delay(1000);\n}\n';
}

Arduino.forBlock['bmp58x_init_i2c'] = function(block, generator) {
  bmp58xAttachVar(block);
  bmp58xEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'bmp58x';
  var wire = block.getFieldValue('WIRE') || 'Wire';
  var address = block.getFieldValue('ADDRESS') || '0x47';
  generator.addObject(varName, 'DFRobot_BMP58X_I2C ' + varName + '(&' + wire + ', ' + address + ');');
  return bmp58xBeginCode(varName);
};

Arduino.forBlock['bmp58x_init_spi'] = function(block, generator) {
  bmp58xAttachVar(block);
  bmp58xEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'bmp58x';
  var spi = block.getFieldValue('SPI') || 'SPI';
  var cs = bmp58xValue(block, generator, 'CS', '5');
  generator.addObject(varName, 'DFRobot_BMP58X_SPI ' + varName + '(&' + spi + ', ' + cs + ');');
  return bmp58xBeginCode(varName);
};

Arduino.forBlock['bmp58x_init_uart'] = function(block, generator) {
  bmp58xAttachVar(block);
  bmp58xEnsureLib(generator);
  var varName = block.getFieldValue('VAR') || 'bmp58x';
  var serialName = block.getFieldValue('SERIAL') || 'Serial1';
  var address = block.getFieldValue('ADDRESS') || '0x47';
  var rx = bmp58xValue(block, generator, 'RX', '25');
  var tx = bmp58xValue(block, generator, 'TX', '26');
  var core = bmp58xCore();
  if (core.indexOf('arduino:avr:uno') !== -1 || core.indexOf('esp8266') !== -1) {
    generator.addLibrary('SoftwareSerial', '#include <SoftwareSerial.h>');
    generator.addObject(varName + '_serial', 'SoftwareSerial ' + varName + 'Serial(' + rx + ', ' + tx + ');');
    generator.addObject(varName, 'DFRobot_BMP58X_UART ' + varName + '(&' + varName + 'Serial, 9600, ' + address + ');');
  } else if (core.indexOf('esp32') !== -1) {
    generator.addObject(varName, 'DFRobot_BMP58X_UART ' + varName + '(&' + serialName + ', 9600, ' + address + ', ' + rx + ', ' + tx + ');');
  } else {
    generator.addObject(varName, 'DFRobot_BMP58X_UART ' + varName + '(&' + serialName + ', 9600, ' + address + ');');
  }
  return bmp58xBeginCode(varName);
};

Arduino.forBlock['bmp58x_read_value'] = function(block, generator) {
  bmp58xEnsureLib(generator);
  var varName = bmp58xGetVar(block);
  var map = {
    TEMP: varName + '.readTempC()',
    PRESS: varName + '.readPressPa()',
    ALT: varName + '.readAltitudeM()'
  };
  return [map[block.getFieldValue('DATA') || 'PRESS'] || map.PRESS, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['bmp58x_set_measure_mode'] = function(block, generator) {
  bmp58xEnsureLib(generator);
  return bmp58xGetVar(block) + '.setMeasureMode(DFRobot_BMP58X::' + (block.getFieldValue('MODE') || 'eNormal') + ');\n';
};

Arduino.forBlock['bmp58x_set_odr'] = function(block, generator) {
  bmp58xEnsureLib(generator);
  return bmp58xGetVar(block) + '.setODR(DFRobot_BMP58X::' + (block.getFieldValue('ODR') || 'eOdr5Hz') + ');\n';
};

Arduino.forBlock['bmp58x_set_osr'] = function(block, generator) {
  bmp58xEnsureLib(generator);
  var temp = block.getFieldValue('TEMP') || 'eOverSampling16';
  var press = block.getFieldValue('PRESS') || 'eOverSampling16';
  return bmp58xGetVar(block) + '.setOSR(DFRobot_BMP58X::' + temp + ', DFRobot_BMP58X::' + press + ');\n';
};

Arduino.forBlock['bmp58x_set_iir'] = function(block, generator) {
  bmp58xEnsureLib(generator);
  var temp = block.getFieldValue('TEMP') || 'eFilter15';
  var press = block.getFieldValue('PRESS') || 'eFilter15';
  return bmp58xGetVar(block) + '.configIIR(DFRobot_BMP58X::' + temp + ', DFRobot_BMP58X::' + press + ');\n';
};

Arduino.forBlock['bmp58x_calibrate_altitude'] = function(block, generator) {
  bmp58xEnsureLib(generator);
  var altitude = bmp58xValue(block, generator, 'ALTITUDE', '0');
  return bmp58xGetVar(block) + '.calibratedAbsoluteDifference(' + altitude + ');\n';
};

Arduino.forBlock['bmp58x_set_uart_baud'] = function(block, generator) {
  bmp58xEnsureLib(generator);
  return bmp58xGetVar(block) + '.setBaud(DFRobot_BMP58X_UART::' + (block.getFieldValue('BAUD') || 'e9600') + ');\n';
};

Arduino.forBlock['bmp58x_reset'] = function(block, generator) {
  bmp58xEnsureLib(generator);
  return bmp58xGetVar(block) + '.reset();\n';
};
