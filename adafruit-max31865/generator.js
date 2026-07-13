/**
 * Adafruit MAX31865 RTD Sensor - Blockly Generator
 * Supports PT100/PT1000 RTD sensor via SPI interface
 */

// ============================================================
// Extension: Dynamic SPI mode switching (Hardware/Software)
// ============================================================
if (typeof Blockly !== 'undefined' && Blockly.Extensions) {
  if (Blockly.Extensions.isRegistered('max31865_spi_mode_extension')) {
    Blockly.Extensions.unregister('max31865_spi_mode_extension');
  }
  Blockly.Extensions.register('max31865_spi_mode_extension', function() {
    var block = this;
    block.updateShape_ = function(mode) {
      // Remove SW pin inputs if they exist
      if (block.getInput('SW_MOSI')) block.removeInput('SW_MOSI');
      if (block.getInput('SW_MISO')) block.removeInput('SW_MISO');
      if (block.getInput('SW_SCK')) block.removeInput('SW_SCK');

      if (mode === 'SW') {
        // Add software SPI pin inputs
        block.appendDummyInput('SW_SCK')
          .appendField('SCK引脚')
          .appendField(new Blockly.FieldDropdown(
            (typeof window !== 'undefined' && window['boardConfig'] && window['boardConfig'].digitalPins) || [['D5', '5'], ['D18', '18'], ['D19', '19']]
          ), 'SW_SCK_PIN');
        block.appendDummyInput('SW_MOSI')
          .appendField('MOSI引脚')
          .appendField(new Blockly.FieldDropdown(
            (typeof window !== 'undefined' && window['boardConfig'] && window['boardConfig'].digitalPins) || [['D23', '23'], ['D21', '21']]
          ), 'SW_MOSI_PIN');
        block.appendDummyInput('SW_MISO')
          .appendField('MISO引脚')
          .appendField(new Blockly.FieldDropdown(
            (typeof window !== 'undefined' && window['boardConfig'] && window['boardConfig'].digitalPins) || [['D19', '19'], ['D22', '22']]
          ), 'SW_MISO_PIN');
      }
    };

    var spiModeField = block.getField('SPI_MODE');
    if (spiModeField) {
      spiModeField.setValidator(function(option) {
        block.updateShape_(option);
        return option;
      });
    }
    block.updateShape_(block.getFieldValue('SPI_MODE'));
  });
}

// ============================================================
// Init block - variable management + SPI setup
// ============================================================
Arduino.forBlock['max31865_init'] = function(block, generator) {
  // 1. Variable rename listener
  if (!block._max31865VarMonitorAttached) {
    block._max31865VarMonitorAttached = true;
    block._max31865VarLastName = block.getFieldValue('VAR') || 'rtd';
    registerVariableToBlockly(block._max31865VarLastName, 'Adafruit_MAX31865');
    var varField = block.getField('VAR');
    if (varField) {
      var originalFinishEditing = varField.onFinishEditing_;
      var capturedBlock = block;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        var workspace = capturedBlock.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        var oldName = capturedBlock._max31865VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(capturedBlock, oldName, newName, 'Adafruit_MAX31865');
          capturedBlock._max31865VarLastName = newName;
        }
      };
    }
  }

  // 2. Extract parameters
  var varName = block.getFieldValue('VAR') || 'rtd';
  var spiMode = block.getFieldValue('SPI_MODE');
  var csPin = block.getFieldValue('CS_PIN');
  var wires = block.getFieldValue('WIRES');
  var swSck = block.getFieldValue('SW_SCK_PIN');
  var swMosi = block.getFieldValue('SW_MOSI_PIN');
  var swMiso = block.getFieldValue('SW_MISO_PIN');

  // 3. Library includes
  generator.addLibrary('SPI', '#include <SPI.h>');
  generator.addLibrary('Adafruit_SPIDevice', '#include <Adafruit_SPIDevice.h>');
  generator.addLibrary('Adafruit_MAX31865', '#include <Adafruit_MAX31865.h>');

  // 4. Object declaration
  if (spiMode === 'SW') {
    generator.addObject(varName,
      'Adafruit_MAX31865 ' + varName + '(' + csPin + ', ' + swMosi + ', ' + swMiso + ', ' + swSck + ');');
  } else {
    generator.addObject(varName, 'Adafruit_MAX31865 ' + varName + '(' + csPin + ');');
  }

  // 5. SPI bus initialization (dedup with spi_${spi}_begin key)
  var spiBeginKey = 'spi_SPI_begin';
  if (!generator.setupCodes_ || !generator.setupCodes_[spiBeginKey]) {
    generator.addSetupBegin(spiBeginKey, 'SPI.begin();\n');
  }

  // 6. Sensor begin
  generator.addSetup(varName + '_begin',
    varName + '.begin(' + wires + ');\n');

  return '';
};

// ============================================================
// Read temperature - Value output block
// ============================================================
Arduino.forBlock['max31865_read_temperature'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'rtd';
  var rtdNominal = generator.valueToCode(block, 'RTD_NOMINAL', generator.ORDER_ATOMIC) || '100';
  var refResistor = generator.valueToCode(block, 'REF_RESISTOR', generator.ORDER_ATOMIC) || '430';

  return [varName + '.temperature(' + rtdNominal + ', ' + refResistor + ')', generator.ORDER_FUNCTION_CALL];
};

// ============================================================
// Read raw RTD value - Value output block
// ============================================================
Arduino.forBlock['max31865_read_rtd'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'rtd';

  return [varName + '.readRTD()', generator.ORDER_FUNCTION_CALL];
};

// ============================================================
// Read fault status - Value output block
// ============================================================
Arduino.forBlock['max31865_read_fault'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'rtd';

  return [varName + '.readFault()', generator.ORDER_FUNCTION_CALL];
};

// ============================================================
// Clear fault - Statement block
// ============================================================
Arduino.forBlock['max31865_clear_fault'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'rtd';

  return varName + '.clearFault();\n';
};

// ============================================================
// Set wire type - Statement block
// ============================================================
Arduino.forBlock['max31865_set_wires'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'rtd';
  var wires = block.getFieldValue('WIRES');

  return varName + '.setWires(' + wires + ');\n';
};

// ============================================================
// Auto convert toggle - Statement block
// ============================================================
Arduino.forBlock['max31865_auto_convert'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'rtd';
  var enable = block.getFieldValue('ENABLE') === 'TRUE';

  return varName + '.autoConvert(' + (enable ? 'true' : 'false') + ');\n';
};

// ============================================================
// 50Hz filter toggle - Statement block
// ============================================================
Arduino.forBlock['max31865_enable_50hz'] = function(block, generator) {
  var varField = block.getField('VAR');
  var varName = varField ? varField.getText() : 'rtd';
  var enable = block.getFieldValue('ENABLE') === 'TRUE';

  return varName + '.enable50Hz(' + (enable ? 'true' : 'false') + ');\n';
};
