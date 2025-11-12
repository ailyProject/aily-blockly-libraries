// SPA06-003 Blockly Library Generator
// Author: Aily Blockly Conversion
// Purpose: Generate Arduino code for SPA06-003 pressure and temperature sensor

'use strict';

// Ensure library is included
function ensureSPA06Lib(generator) {
  generator.addLibrary('SPA06', '#include "SPL07-003.h"');
}

// Ensure Wire library for I2C
function ensureWireLib(generator) {
  generator.addLibrary('Wire', '#include <Wire.h>');
}

// Ensure SPI library for SPI
function ensureSPILib(generator) {
  generator.addLibrary('SPI', '#include <SPI.h>');
}

// Helper function to get variable name
function getVariableName(block, fieldName, defaultName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : defaultName;
}

// Create SPA06 sensor with I2C
Arduino.forBlock['spa06_create_i2c'] = function(block, generator) {
  // Set up variable renaming monitor
  if (!block._spa06VarMonitorAttached) {
    block._spa06VarMonitorAttached = true;
    block._spa06VarLastName = block.getFieldValue('VAR') || 'spa06';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._spa06VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'SPL07_003');
          block._spa06VarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'spa06';
  const addr = block.getFieldValue('ADDR');
  
  // Get SDA and SCL pin values from dropdown
  const sdaPin = block.getFieldValue('SDA') || '4';
  const sclPin = block.getFieldValue('SCL') || '5';

  // Add libraries
  ensureSPA06Lib(generator);
  ensureWireLib(generator);

  // Register variable and add declaration
  registerVariableToBlockly(varName, 'SPL07_003');
  generator.addVariable(varName, 'SPL07_003 ' + varName + ';');

  // Generate initialization code with custom pins
  const initCode = `Wire.begin(${sdaPin}, ${sclPin});\nif (${varName}.begin(${addr}, &Wire) == false) {\n  Serial.println("Error initializing SPL07-003 :(");\n  while(1) {}\n}\nSerial.println("Connected to SPL07-003! :)");\n`;
  
  // Return the code to be placed at the block position in setup
  return initCode;
};

// Create SPA06 sensor with SPI
Arduino.forBlock['spa06_create_spi'] = function(block, generator) {
  // Set up variable renaming monitor
  if (!block._spa06VarMonitorAttached) {
    block._spa06VarMonitorAttached = true;
    block._spa06VarLastName = block.getFieldValue('VAR') || 'spa06';
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._spa06VarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'SPL07_003');
          block._spa06VarLastName = newName;
        }
        return newName;
      });
    }
  }

  const varName = block.getFieldValue('VAR') || 'spa06';
  const pin = block.getFieldValue('PIN') || 'SS';

  // Add libraries
  ensureSPA06Lib(generator);
  ensureSPILib(generator);

  // Register variable and add declaration
  registerVariableToBlockly(varName, 'SPL07_003');
  generator.addVariable(varName, 'SPL07_003 ' + varName + ';');

  // Generate initialization code that includes SPI.begin() and sensor begin()
  const initCode = `SPI.begin();\nif (${varName}.begin(${pin}, &SPI) == false) {\n  Serial.println("Error initializing SPL07-003 :(");\n  while(1) {}\n}\nSerial.println("Connected to SPL07-003! :)");\n`;
  
  // Return the code to be placed at the block position in setup
  return initCode;
};

// Set pressure configuration
Arduino.forBlock['spa06_set_pressure_config'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');
  const rate = block.getFieldValue('RATE');
  const oversample = block.getFieldValue('OVERSAMPLE');

  ensureSPA06Lib(generator);

  const code = `${varName}.setPressureConfig(${rate}, ${oversample});\n`;
  return code;
};

// Set temperature configuration
Arduino.forBlock['spa06_set_temperature_config'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');
  const rate = block.getFieldValue('RATE');
  const oversample = block.getFieldValue('OVERSAMPLE');

  ensureSPA06Lib(generator);

  const code = `${varName}.setTemperatureConfig(${rate}, ${oversample});\n`;
  return code;
};

// Set working mode
Arduino.forBlock['spa06_set_mode'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');
  const mode = block.getFieldValue('MODE');

  ensureSPA06Lib(generator);

  const code = `${varName}.setMode(${mode});\n`;
  return code;
};

// Set temperature source
Arduino.forBlock['spa06_set_temperature_source'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');
  const source = block.getFieldValue('SOURCE');

  ensureSPA06Lib(generator);

  const code = `${varName}.setTemperatureSource(${source});\n`;
  return code;
};

// Read pressure value
Arduino.forBlock['spa06_read_pressure'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');

  ensureSPA06Lib(generator);

  const code = `${varName}.readPressure()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// Read temperature value
Arduino.forBlock['spa06_read_temperature'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');

  ensureSPA06Lib(generator);

  const code = `${varName}.readTemperature()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// Calculate altitude
Arduino.forBlock['spa06_calc_altitude'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');

  ensureSPA06Lib(generator);

  const code = `${varName}.calcAltitude()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// Check if pressure data is available
Arduino.forBlock['spa06_pressure_available'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');

  ensureSPA06Lib(generator);

  const code = `${varName}.pressureAvailable()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// Check if temperature data is available
Arduino.forBlock['spa06_temperature_available'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');

  ensureSPA06Lib(generator);

  const code = `${varName}.temperatureAvailable()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// Configure interrupt
Arduino.forBlock['spa06_configure_interrupt'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');
  const interrupt = block.getFieldValue('INTERRUPT');

  ensureSPA06Lib(generator);

  const code = `${varName}.configureInterrupt(${interrupt});\n`;
  return code;
};

// Get interrupt status
Arduino.forBlock['spa06_get_interrupt_status'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');

  ensureSPA06Lib(generator);

  const code = `${varName}.getInterruptStatus()`;
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// Set pressure offset
Arduino.forBlock['spa06_set_pressure_offset'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');
  const offset = generator.valueToCode(block, 'OFFSET', Arduino.ORDER_ATOMIC) || '0.0';

  ensureSPA06Lib(generator);

  const code = `${varName}.setPressureOffset(${offset});\n`;
  return code;
};

// Set temperature offset
Arduino.forBlock['spa06_set_temperature_offset'] = function(block, generator) {
  const varName = getVariableName(block, 'VAR', 'spa06');
  const offset = generator.valueToCode(block, 'OFFSET', Arduino.ORDER_ATOMIC) || '0.0';

  ensureSPA06Lib(generator);

  const code = `${varName}.setTemperatureOffset(${offset});\n`;
  return code;
};