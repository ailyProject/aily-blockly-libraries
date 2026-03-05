/**
 * SimpleFOC Library Generator for Aily Blockly
 * 
 * This generator converts Blockly blocks to SimpleFOC Arduino code
 */

// Utility function to get variable name from field_variable
function getVarName(block, fieldName) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : 'motor';
}

// Utility function to get value code
function getValueCode(block, fieldName, generator, order = generator.ORDER_ATOMIC) {
  return generator.valueToCode(block, fieldName, order) || '0';
}

// Utility function to register variable rename listener
function setupVarMonitor(block, varFieldName, varType, defaultValue) {
  const monitorKey = '_' + varType + 'VarMonitorAttached';
  const lastNameKey = '_' + varType + 'VarLastName';
  
  if (!block[monitorKey]) {
    block[monitorKey] = true;
    block[lastNameKey] = block.getFieldValue(varFieldName) || defaultValue;
    
    // Register variable to Blockly system
    if (typeof registerVariableToBlockly === 'function') {
      registerVariableToBlockly(block[lastNameKey], varType);
    }
    
    const varField = block.getField(varFieldName);
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block[lastNameKey];
        if (workspace && newName && newName !== oldName) {
          if (typeof renameVariableInBlockly === 'function') {
            renameVariableInBlockly(block, oldName, newName, varType);
          }
          block[lastNameKey] = newName;
        }
      };
    }
  }
}

// BLDC Motor creation
Arduino.forBlock['simplefoc_bldc_create'] = function(block, generator) {
  setupVarMonitor(block, 'VAR', 'BLDCMotor', 'motor');
  
  const varName = block.getFieldValue('VAR') || 'motor';
  const polePairs = getValueCode(block, 'POLE_PAIRS', generator);
  const r = getValueCode(block, 'R', generator);
  const kv = getValueCode(block, 'KV', generator);
  
  generator.addLibrary('SimpleFOC', '#include <SimpleFOC.h>');
  
  let code;
  if (r !== '0' && kv !== '0') {
    code = `BLDCMotor ${varName} = BLDCMotor(${polePairs}, ${r}, ${kv});\n`;
  } else if (r !== '0') {
    code = `BLDCMotor ${varName} = BLDCMotor(${polePairs}, ${r});\n`;
  } else {
    code = `BLDCMotor ${varName} = BLDCMotor(${polePairs});\n`;
  }
  
  generator.addVariable(varName, code);
  return '';
};

// Stepper Motor creation
Arduino.forBlock['simplefoc_stepper_create'] = function(block, generator) {
  setupVarMonitor(block, 'VAR', 'StepperMotor', 'stepper');
  
  const varName = block.getFieldValue('VAR') || 'stepper';
  const polePairs = getValueCode(block, 'POLE_PAIRS', generator);
  const r = getValueCode(block, 'R', generator);
  
  generator.addLibrary('SimpleFOC', '#include <SimpleFOC.h>');
  
  let code;
  if (r !== '0') {
    code = `StepperMotor ${varName} = StepperMotor(${polePairs}, ${r});\n`;
  } else {
    code = `StepperMotor ${varName} = StepperMotor(${polePairs});\n`;
  }
  
  generator.addVariable(varName, code);
  return '';
};

// 3PWM Driver creation
Arduino.forBlock['simplefoc_driver_3pwm_create'] = function(block, generator) {
  setupVarMonitor(block, 'VAR', 'BLDCDriver3PWM', 'driver');
  
  const varName = block.getFieldValue('VAR') || 'driver';
  const pinA = getValueCode(block, 'PIN_A', generator);
  const pinB = getValueCode(block, 'PIN_B', generator);
  const pinC = getValueCode(block, 'PIN_C', generator);
  const enable = getValueCode(block, 'ENABLE', generator);
  
  generator.addLibrary('SimpleFOC', '#include <SimpleFOC.h>');
  
  let code;
  if (enable !== '0') {
    code = `BLDCDriver3PWM ${varName} = BLDCDriver3PWM(${pinA}, ${pinB}, ${pinC}, ${enable});\n`;
  } else {
    code = `BLDCDriver3PWM ${varName} = BLDCDriver3PWM(${pinA}, ${pinB}, ${pinC});\n`;
  }
  
  generator.addVariable(varName, code);
  return '';
};

// 6PWM Driver creation
Arduino.forBlock['simplefoc_driver_6pwm_create'] = function(block, generator) {
  setupVarMonitor(block, 'VAR', 'BLDCDriver6PWM', 'driver');
  
  const varName = block.getFieldValue('VAR') || 'driver';
  const pinAH = getValueCode(block, 'PIN_AH', generator);
  const pinAL = getValueCode(block, 'PIN_AL', generator);
  const pinBH = getValueCode(block, 'PIN_BH', generator);
  const pinBL = getValueCode(block, 'PIN_BL', generator);
  const pinCH = getValueCode(block, 'PIN_CH', generator);
  const pinCL = getValueCode(block, 'PIN_CL', generator);
  
  generator.addLibrary('SimpleFOC', '#include <SimpleFOC.h>');
  
  const code = `BLDCDriver6PWM ${varName} = BLDCDriver6PWM(${pinAH}, ${pinAL}, ${pinBH}, ${pinBL}, ${pinCH}, ${pinCL});\n`;
  generator.addVariable(varName, code);
  return '';
};

// Encoder creation
Arduino.forBlock['simplefoc_encoder_create'] = function(block, generator) {
  setupVarMonitor(block, 'VAR', 'Encoder', 'encoder');
  
  const varName = block.getFieldValue('VAR') || 'encoder';
  const pinA = getValueCode(block, 'PIN_A', generator);
  const pinB = getValueCode(block, 'PIN_B', generator);
  const cpr = getValueCode(block, 'CPR', generator);
  
  generator.addLibrary('SimpleFOC', '#include <SimpleFOC.h>');
  
  const code = `Encoder ${varName} = Encoder(${pinA}, ${pinB}, ${cpr});\n`;
  generator.addVariable(varName, code);
  
  // Add interrupt handler functions
  const doA = `void doA_${varName}(){${varName}.handleA();}`;
  const doB = `void doB_${varName}(){${varName}.handleB();}`;
  generator.addFunction(`encoder_doA_${varName}`, doA);
  generator.addFunction(`encoder_doB_${varName}`, doB);
  
  return '';
};

// Magnetic Sensor SPI creation
Arduino.forBlock['simplefoc_magnetic_spi_create'] = function(block, generator) {
  setupVarMonitor(block, 'VAR', 'MagneticSensorSPI', 'sensor');
  
  const varName = block.getFieldValue('VAR') || 'sensor';
  const cs = getValueCode(block, 'CS', generator);
  
  generator.addLibrary('SimpleFOC', '#include <SimpleFOC.h>');
  
  const code = `MagneticSensorSPI ${varName} = MagneticSensorSPI(${cs});\n`;
  generator.addVariable(varName, code);
  return '';
};

// Magnetic Sensor I2C creation
Arduino.forBlock['simplefoc_magnetic_i2c_create'] = function(block, generator) {
  setupVarMonitor(block, 'VAR', 'MagneticSensorI2C', 'sensor');
  
  const varName = block.getFieldValue('VAR') || 'sensor';
  const address = getValueCode(block, 'ADDRESS', generator);
  
  generator.addLibrary('SimpleFOC', '#include <SimpleFOC.h>');
  
  const code = `MagneticSensorI2C ${varName} = MagneticSensorI2C(${address});\n`;
  generator.addVariable(varName, code);
  return '';
};

// Low-side current sense creation
Arduino.forBlock['simplefoc_lowside_current_sense_create'] = function(block, generator) {
  setupVarMonitor(block, 'VAR', 'LowsideCurrentSense', 'current_sense');
  
  const varName = block.getFieldValue('VAR') || 'current_sense';
  const pinA = getValueCode(block, 'PIN_A', generator);
  const pinB = getValueCode(block, 'PIN_B', generator);
  const pinC = getValueCode(block, 'PIN_C', generator);
  const shuntR = getValueCode(block, 'SHUNT_R', generator);
  const gain = getValueCode(block, 'GAIN', generator);
  
  generator.addLibrary('SimpleFOC', '#include <SimpleFOC.h>');
  
  const code = `LowsideCurrentSense ${varName} = LowsideCurrentSense(${shuntR}, ${gain}, ${pinA}, ${pinB}, ${pinC});\n`;
  generator.addVariable(varName, code);
  return '';
};

// Motor link driver
Arduino.forBlock['simplefoc_motor_link_driver'] = function(block, generator) {
  const motorName = getVarName(block, 'MOTOR');
  const driverName = getVarName(block, 'DRIVER');
  
  return `${motorName}.linkDriver(&${driverName});\n`;
};

// Motor link sensor
Arduino.forBlock['simplefoc_motor_link_sensor'] = function(block, generator) {
  const motorName = getVarName(block, 'MOTOR');
  const sensorName = getVarName(block, 'SENSOR');
  
  return `${motorName}.linkSensor(&${sensorName});\n`;
};

// Driver init
Arduino.forBlock['simplefoc_driver_init'] = function(block, generator) {
  const driverName = getVarName(block, 'DRIVER');
  const voltage = getValueCode(block, 'VOLTAGE', generator);
  
  let code = `${driverName}.voltage_power_supply = ${voltage};\n`;
  code += `${driverName}.init();\n`;
  return code;
};

// Sensor init
Arduino.forBlock['simplefoc_sensor_init'] = function(block, generator) {
  const sensorName = getVarName(block, 'SENSOR');
  
  return `${sensorName}.init();\n`;
};

// Encoder enable interrupts
Arduino.forBlock['simplefoc_encoder_enable_interrupts'] = function(block, generator) {
  const sensorName = getVarName(block, 'SENSOR');
  
  return `${sensorName}.enableInterrupts(doA_${sensorName}, doB_${sensorName});\n`;
};

// Motor init
Arduino.forBlock['simplefoc_motor_init'] = function(block, generator) {
  const motorName = getVarName(block, 'MOTOR');
  
  return `${motorName}.init();\n`;
};

// Motor init FOC
Arduino.forBlock['simplefoc_motor_initfoc'] = function(block, generator) {
  const motorName = getVarName(block, 'MOTOR');
  
  return `${motorName}.initFOC();\n`;
};

// Motor set controller mode
Arduino.forBlock['simplefoc_motor_set_controller'] = function(block, generator) {
  const motorName = getVarName(block, 'MOTOR');
  const mode = block.getFieldValue('MODE');
  
  const modeMap = {
    'torque': 'MotionControlType::torque',
    'velocity': 'MotionControlType::velocity',
    'angle': 'MotionControlType::angle',
    'velocity_openloop': 'MotionControlType::velocity_openloop',
    'angle_openloop': 'MotionControlType::angle_openloop'
  };
  
  return `${motorName}.controller = ${modeMap[mode]};\n`;
};

// Motor set torque mode
Arduino.forBlock['simplefoc_motor_set_torque'] = function(block, generator) {
  const motorName = getVarName(block, 'MOTOR');
  const mode = block.getFieldValue('MODE');
  
  const modeMap = {
    'voltage': 'TorqueControlType::voltage',
    'dc_current': 'TorqueControlType::dc_current',
    'foc_current': 'TorqueControlType::foc_current',
    'estimated_current': 'TorqueControlType::estimated_current'
  };
  
  return `${motorName}.torque_controller = ${modeMap[mode]};\n`;
};

// Motor move
Arduino.forBlock['simplefoc_motor_move'] = function(block, generator) {
  const motorName = getVarName(block, 'MOTOR');
  const target = getValueCode(block, 'TARGET', generator);
  
  return `${motorName}.move(${target});\n`;
};

// Motor loop FOC
Arduino.forBlock['simplefoc_motor_loopfoc'] = function(block, generator) {
  const motorName = getVarName(block, 'MOTOR');
  
  // Auto-add to loop begin to ensure FOC runs fast
  const focCode = `${motorName}.loopFOC();`;
  generator.addLoopBegin(focCode, focCode);
  
  return '';
};

// Motor PID velocity
Arduino.forBlock['simplefoc_motor_pid_velocity'] = function(block, generator) {
  const motorName = getVarName(block, 'MOTOR');
  const p = getValueCode(block, 'P', generator);
  const i = getValueCode(block, 'I', generator);
  const d = getValueCode(block, 'D', generator);
  const ramp = getValueCode(block, 'RAMP', generator);
  const limit = getValueCode(block, 'LIMIT', generator);
  
  let code = `${motorName}.PID_velocity.P = ${p};\n`;
  code += `${motorName}.PID_velocity.I = ${i};\n`;
  code += `${motorName}.PID_velocity.D = ${d};\n`;
  code += `${motorName}.PID_velocity.output_ramp = ${ramp};\n`;
  code += `${motorName}.PID_velocity.limit = ${limit};\n`;
  
  return code;
};

// Motor PID angle
Arduino.forBlock['simplefoc_motor_pid_angle'] = function(block, generator) {
  const motorName = getVarName(block, 'MOTOR');
  const p = getValueCode(block, 'P', generator);
  const velLimit = getValueCode(block, 'VEL_LIMIT', generator);
  
  let code = `${motorName}.P_angle.P = ${p};\n`;
  code += `${motorName}.velocity_limit = ${velLimit};\n`;
  
  return code;
};

// Motor PID current
Arduino.forBlock['simplefoc_motor_pid_current'] = function(block, generator) {
  const motorName = getVarName(block, 'MOTOR');
  const p = getValueCode(block, 'P', generator);
  const i = getValueCode(block, 'I', generator);
  const d = getValueCode(block, 'D', generator);
  const limit = getValueCode(block, 'LIMIT', generator);
  
  let code = `${motorName}.PID_current_q.P = ${p};\n`;
  code += `${motorName}.PID_current_q.I = ${i};\n`;
  code += `${motorName}.PID_current_q.D = ${d};\n`;
  code += `${motorName}.PID_current_q.limit = ${limit};\n`;
  code += `${motorName}.PID_current_d.P = ${p};\n`;
  code += `${motorName}.PID_current_d.I = ${i};\n`;
  code += `${motorName}.PID_current_d.D = ${d};\n`;
  code += `${motorName}.PID_current_d.limit = ${limit};\n`;
  
  return code;
};

// Motor set limits
Arduino.forBlock['simplefoc_motor_set_limits'] = function(block, generator) {
  const motorName = getVarName(block, 'MOTOR');
  const voltageLimit = getValueCode(block, 'VOLTAGE_LIMIT', generator);
  const currentLimit = getValueCode(block, 'CURRENT_LIMIT', generator);
  
  let code = `${motorName}.voltage_limit = ${voltageLimit};\n`;
  code += `${motorName}.current_limit = ${currentLimit};\n`;
  
  return code;
};

// Motor get angle
Arduino.forBlock['simplefoc_motor_get_angle'] = function(block, generator) {
  const motorName = getVarName(block, 'MOTOR');
  
  return [`${motorName}.shaftAngle()`, generator.ORDER_ATOMIC];
};

// Motor get velocity
Arduino.forBlock['simplefoc_motor_get_velocity'] = function(block, generator) {
  const motorName = getVarName(block, 'MOTOR');
  
  return [`${motorName}.shaftVelocity()`, generator.ORDER_ATOMIC];
};

// Motor enable
Arduino.forBlock['simplefoc_motor_enable'] = function(block, generator) {
  const motorName = getVarName(block, 'MOTOR');
  
  return `${motorName}.enable();\n`;
};

// Motor disable
Arduino.forBlock['simplefoc_motor_disable'] = function(block, generator) {
  const motorName = getVarName(block, 'MOTOR');
  
  return `${motorName}.disable();\n`;
};

// Current sense link driver
Arduino.forBlock['simplefoc_current_sense_link_driver'] = function(block, generator) {
  const currentSenseName = getVarName(block, 'CURRENT_SENSE');
  const driverName = getVarName(block, 'DRIVER');
  
  return `${currentSenseName}.linkDriver(&${driverName});\n`;
};

// Motor link current sense
Arduino.forBlock['simplefoc_motor_link_current_sense'] = function(block, generator) {
  const motorName = getVarName(block, 'MOTOR');
  const currentSenseName = getVarName(block, 'CURRENT_SENSE');
  
  return `${motorName}.linkCurrentSense(&${currentSenseName});\n`;
};

// Current sense init
Arduino.forBlock['simplefoc_current_sense_init'] = function(block, generator) {
  const currentSenseName = getVarName(block, 'CURRENT_SENSE');
  
  return `${currentSenseName}.init();\n`;
};
