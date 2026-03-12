/**
 * Grove HCHO Sensor Library Generator
 * Based on WSP2110 semiconductor VOC gas sensor
 * https://wiki.seeedstudio.com/Grove-HCHO_Sensor/
 */

// Helper function to register variable rename listener
function setupVariableRenameListener(block, varKey, varType) {
  const listenerKey = '_hchoVarMonitor_' + varKey;
  const lastNameKey = '_hchoVarLastName_' + varKey;
  
  if (!block[listenerKey]) {
    block[listenerKey] = true;
    block[lastNameKey] = block.getFieldValue('VAR') || 'hcho';
    registerVariableToBlockly(block[lastNameKey], varType);
    
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block[lastNameKey];
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, varType);
          block[lastNameKey] = newName;
        }
      };
    }
  }
}

// Block: Initialize HCHO sensor
Arduino.forBlock['grove_hcho_init'] = function(block, generator) {
  setupVariableRenameListener(block, 'init', 'GroveHCHO');
  
  const varName = block.getFieldValue('VAR') || 'hcho';
  const pin = block.getFieldValue('PIN');
  const r0 = block.getFieldValue('R0');
  
  // Add math library for log10 and pow functions
  generator.addLibrary('Math', '#include <math.h>');
  
  // Register variable
  registerVariableToBlockly(varName, 'GroveHCHO');
  
  // Generate variable declaration with pin and R0 stored
  // We'll use a struct to store sensor parameters
  const structDef = `struct GroveHCHO {
  int pin;
  double r0;
  GroveHCHO(int p, double r) : pin(p), r0(r) {}
  int readRaw() { return analogRead(pin); }
  double getRs() {
    int val = readRaw();
    return (1023.0 / val) - 1.0;
  }
  double getPPM() {
    double rs = getRs();
    return pow(10.0, ((log10(rs / r0) - 0.0827) / (-0.4807)));
  }
  double calibrateR0() {
    int val = readRaw();
    return (1023.0 / val) - 1.0;
  }
};`;
  
  generator.addFunction('GroveHCHO_struct', structDef);
  generator.addVariable(varName, 'GroveHCHO ' + varName + '(' + pin + ', ' + r0 + ');');
  
  return '';
};

// Block: Read raw analog value
Arduino.forBlock['grove_hcho_read_raw'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'hcho';
  
  return [varName + '.readRaw()', generator.ORDER_ATOMIC];
};

// Block: Read sensor resistance Rs
Arduino.forBlock['grove_hcho_read_rs'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'hcho';
  
  return [varName + '.getRs()', generator.ORDER_ATOMIC];
};

// Block: Read HCHO concentration in ppm
Arduino.forBlock['grove_hcho_read_ppm'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'hcho';
  
  return [varName + '.getPPM()', generator.ORDER_ATOMIC];
};

// Block: Calibrate and get R0 value
Arduino.forBlock['grove_hcho_calibrate_r0'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'hcho';
  
  return [varName + '.calibrateR0()', generator.ORDER_ATOMIC];
};