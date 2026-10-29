// PID控制器库 Generator
// 支持基础PID控制、自适应参数调节、基于测量值的比例控制等功能

// 获取变量名的辅助函数
function getVariableName(block, fieldName) {
  const variableField = block.getField(fieldName);
  if (variableField && variableField.getVariable) {
    const variableModel = variableField.getVariable();
    return variableModel.name;
  }
  return block.getFieldValue(fieldName);
}

// 预设参数配置
const PID_PRESETS = {
    temperature: { kp: 2.0, ki: 0.1, kd: 0.5 },
    motor_speed: { kp: 1.5, ki: 0.8, kd: 0.2 },
    position: { kp: 3.0, ki: 0.05, kd: 1.0 },
    level: { kp: 1.8, ki: 0.3, kd: 0.4 },
    custom: { kp: 2.0, ki: 5.0, kd: 1.0 }
};

// 避免重复加载扩展
if (Blockly.Extensions.isRegistered('pid_preset_extension')) {
  Blockly.Extensions.unregister('pid_preset_extension');
}

// 注册预设参数切换扩展
Blockly.Extensions.register('pid_preset_extension', function() {
    this.getField('PRESET').setValidator(function(newValue) {
        const sourceBlock = this.getSourceBlock();
        if (newValue && newValue !== 'custom' && PID_PRESETS[newValue]) {
            const preset = PID_PRESETS[newValue];
            sourceBlock.setFieldValue(preset.kp, 'KP');
            sourceBlock.setFieldValue(preset.ki, 'KI');
            sourceBlock.setFieldValue(preset.kd, 'KD');
        }
        return newValue;
    });
});

// 初始化PID控制器
// Explicit workspace-model ownership; variable dropdown constraints alone are consumers.
Arduino.modelDeclarations = Arduino.modelDeclarations || {};
Arduino.modelDeclarations.pid_init = {
    version: 1,
    scope: 'workspace',
    fields: { PID_NAME: 'PID', INPUT: 'double', OUTPUT: 'double', SETPOINT: 'double' },
    shared: ['INPUT', 'OUTPUT', 'SETPOINT']
};
Arduino.forBlock['pid_init'] = function(block, generator) {
    const pidName = getVariableName(block, 'PID_NAME');
    const inputVar = getVariableName(block, 'INPUT');
    const outputVar = getVariableName(block, 'OUTPUT');
    const setpointVar = getVariableName(block, 'SETPOINT');
    if (typeof registerVariableToBlockly === 'function') {
        registerVariableToBlockly(pidName, 'PID');
        registerVariableToBlockly(inputVar, 'double');
        registerVariableToBlockly(outputVar, 'double');
        registerVariableToBlockly(setpointVar, 'double');
    }
    const kp = block.getFieldValue('KP');
    const ki = block.getFieldValue('KI');
    const kd = block.getFieldValue('KD');
    const direction = block.getFieldValue('DIRECTION');

    // 添加库引用
    generator.addLibrary('pid_lib', '#include <PID_v1.h>');
    
    // 添加变量声明
    generator.addVariable(`pid_var_${inputVar}`, `double ${inputVar};`);
    generator.addVariable(`pid_var_${outputVar}`, `double ${outputVar};`);
    generator.addVariable(`pid_var_${setpointVar}`, `double ${setpointVar};`);
    generator.addVariable(`pid_tuning_${pidName}`, `double Kp_${pidName} = ${kp}, Ki_${pidName} = ${ki}, Kd_${pidName} = ${kd};`);
    
    // 添加PID对象
    generator.addObject(`pid_object_${pidName}`, `PID ${pidName}(&${inputVar}, &${outputVar}, &${setpointVar}, Kp_${pidName}, Ki_${pidName}, Kd_${pidName}, ${direction});`);
    
    // 在setup中启用PID
    generator.addSetup(`pid_mode_${pidName}`, `${pidName}.SetMode(AUTOMATIC);`);

    return '';
};

// 快速PID控制设置
Arduino.forBlock['pid_quick_setup'] = function(block, generator) {
    const inputPin = block.getFieldValue('INPUT_PIN');
    const outputPin = block.getFieldValue('OUTPUT_PIN');
    const setpoint = generator.valueToCode(block, 'SETPOINT', Arduino.ORDER_ATOMIC) || '100';
    const application = block.getFieldValue('APPLICATION');
    
    // 根据应用场景选择参数
    const preset = PID_PRESETS[application] || PID_PRESETS.custom;
    
    // 添加库引用
    generator.addLibrary('pid_lib', '#include <PID_v1.h>');
    
    // 添加变量
    generator.addVariable('pid_quick_vars', `double quickPidInput, quickPidOutput, quickPidSetpoint = ${setpoint};`);
    generator.addVariable('pid_quick_tuning', `double quickKp = ${preset.kp}, quickKi = ${preset.ki}, quickKd = ${preset.kd};`);
    
    // 添加PID对象
    generator.addObject('pid_quick_object', `PID quickPID(&quickPidInput, &quickPidOutput, &quickPidSetpoint, quickKp, quickKi, quickKd, DIRECT);`);
    
    // 在setup中设置
    generator.addSetup('pid_quick_setup', `quickPID.SetMode(AUTOMATIC);\n  quickPID.SetOutputLimits(0, 255);`);
    generator.addSetup(`pid_quick_pin_${outputPin}`, `pinMode(${outputPin}, OUTPUT);`);
    
    return `quickPidInput = analogRead(${inputPin});\nquickPID.Compute();\nanalogWrite(${outputPin}, quickPidOutput);\n`;
};

// PID控制循环
Arduino.forBlock['pid_control_loop'] = function(block, generator) {
    const pidName = getVariableName(block, 'PID_NAME');
    const readInput = generator.statementToCode(block, 'READ_INPUT');
    const writeOutput = generator.statementToCode(block, 'WRITE_OUTPUT');
    
    return `${readInput}${pidName}.Compute();\n${writeOutput}`;
};

// 执行一次PID计算
Arduino.forBlock['pid_compute'] = function(block, generator) {
    const pidName = getVariableName(block, 'PID_NAME');
    return `${pidName}.Compute();\n`;
};

// 设置PID工作模式
Arduino.forBlock['pid_set_mode'] = function(block, generator) {
    const pidName = getVariableName(block, 'PID_NAME');
    const mode = block.getFieldValue('MODE');
    return `${pidName}.SetMode(${mode});\n`;
};

// 设置PID参数
Arduino.forBlock['pid_set_tunings'] = function(block, generator) {
    const pidName = getVariableName(block, 'PID_NAME');
    const kp = generator.valueToCode(block, 'KP', Arduino.ORDER_ATOMIC) || '2';
    const ki = generator.valueToCode(block, 'KI', Arduino.ORDER_ATOMIC) || '5';
    const kd = generator.valueToCode(block, 'KD', Arduino.ORDER_ATOMIC) || '1';
    return `${pidName}.SetTunings(${kp}, ${ki}, ${kd});\n`;
};

// 设置PID输出范围
Arduino.forBlock['pid_set_output_limits'] = function(block, generator) {
    const pidName = getVariableName(block, 'PID_NAME');
    const min = generator.valueToCode(block, 'MIN', Arduino.ORDER_ATOMIC) || '0';
    const max = generator.valueToCode(block, 'MAX', Arduino.ORDER_ATOMIC) || '255';
    return `${pidName}.SetOutputLimits(${min}, ${max});\n`;
};

// 温度PID控制
Arduino.forBlock['pid_temperature_control'] = function(block, generator) {
    const tempPin = block.getFieldValue('TEMP_PIN');
    const heaterPin = block.getFieldValue('HEATER_PIN');
    const targetTemp = generator.valueToCode(block, 'TARGET_TEMP', Arduino.ORDER_ATOMIC) || '25';
    
    const preset = PID_PRESETS.temperature;
    
    // 添加库引用
    generator.addLibrary('pid_lib', '#include <PID_v1.h>');
    
    // 添加变量
    generator.addVariable('pid_temp_vars', `double tempInput, tempOutput, tempSetpoint = ${targetTemp};`);
    generator.addVariable('pid_temp_tuning', `double tempKp = ${preset.kp}, tempKi = ${preset.ki}, tempKd = ${preset.kd};`);
    
    // 添加PID对象
    generator.addObject('pid_temp_object', `PID tempPID(&tempInput, &tempOutput, &tempSetpoint, tempKp, tempKi, tempKd, DIRECT);`);
    
    // 在setup中设置
    generator.addSetup('pid_temp_setup', `tempPID.SetMode(AUTOMATIC);\n  tempPID.SetOutputLimits(0, 255);`);
    generator.addSetup(`pid_temp_pin_${heaterPin}`, `pinMode(${heaterPin}, OUTPUT);`);
    
    // 添加温度转换函数
    generator.addFunction('temp_convert_function', `
float readTemperature(int pin) {
  int reading = analogRead(pin);
  float voltage = reading * 5.0 / 1024.0;
  return (voltage - 0.5) * 100.0; // LM35温度传感器转换
}`);
    
    return `tempInput = readTemperature(${tempPin});\ntempPID.Compute();\nanalogWrite(${heaterPin}, tempOutput);\n`;
};

// 电机速度PID控制
Arduino.forBlock['pid_motor_speed_control'] = function(block, generator) {
    const encoderPin = block.getFieldValue('ENCODER_PIN');
    const motorPin = block.getFieldValue('MOTOR_PIN');
    const targetRpm = generator.valueToCode(block, 'TARGET_RPM', Arduino.ORDER_ATOMIC) || '100';
    
    const preset = PID_PRESETS.motor_speed;
    
    // 添加库引用
    generator.addLibrary('pid_lib', '#include <PID_v1.h>');
    
    // 添加变量
    generator.addVariable('pid_motor_vars', `double motorInput, motorOutput, motorSetpoint = ${targetRpm};\nvolatile int encoderCount = 0;\nlong lastTime = 0;`);
    generator.addVariable('pid_motor_tuning', `double motorKp = ${preset.kp}, motorKi = ${preset.ki}, motorKd = ${preset.kd};`);
    
    // 添加PID对象
    generator.addObject('pid_motor_object', `PID motorPID(&motorInput, &motorOutput, &motorSetpoint, motorKp, motorKi, motorKd, DIRECT);`);
    
    // 在setup中设置
    generator.addSetup('pid_motor_setup', `motorPID.SetMode(AUTOMATIC);\n  motorPID.SetOutputLimits(0, 255);`);
    generator.addSetup(`pid_motor_pin_${motorPin}`, `pinMode(${motorPin}, OUTPUT);`);
    generator.addSetup(`pid_motor_encoder_${encoderPin}`, `pinMode(${encoderPin}, INPUT_PULLUP);\n  attachInterrupt(digitalPinToInterrupt(${encoderPin}), encoderISR, RISING);`);
    
    // 添加编码器中断函数和转速计算
    generator.addFunction('encoder_functions', `
void encoderISR() {
  encoderCount++;
}

float calculateRPM() {
  long currentTime = millis();
  if (currentTime - lastTime >= 1000) {
    float rpm = (encoderCount * 60.0) / ((currentTime - lastTime) / 1000.0);
    encoderCount = 0;
    lastTime = currentTime;
    return rpm;
  }
  return motorInput;
}`);
    
    return `motorInput = calculateRPM();\nmotorPID.Compute();\nanalogWrite(${motorPin}, motorOutput);\n`;
};

// 获取PID输入值
Arduino.forBlock['pid_get_input'] = function(block, generator) {
    const inputVar = getVariableName(block, 'INPUT');
    
    return [`${inputVar}`, Arduino.ORDER_ATOMIC];
};

// 获取PID输出值
Arduino.forBlock['pid_get_output'] = function(block, generator) {
    const outputVar = getVariableName(block, 'OUTPUT');
    
    return [`${outputVar}`, Arduino.ORDER_ATOMIC];
};

// 设置PID目标值
Arduino.forBlock['pid_set_setpoint'] = function(block, generator) {
    const setpointVar = getVariableName(block, 'SETPOINT');
    const value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '0';
    
    return `${setpointVar} = ${value};\n`;
};

// 设置PID输入值
Arduino.forBlock['pid_set_input'] = function(block, generator) {
    const inputVar = getVariableName(block, 'INPUT');
    const value = generator.valueToCode(block, 'VALUE', Arduino.ORDER_ATOMIC) || '0';
    
    return `${inputVar} = ${value};\n`;
};

// 自适应PID控制
Arduino.forBlock['pid_adaptive_control'] = function(block, generator) {
    const pidName = getVariableName(block, 'PID_NAME');
    const inputVar = getVariableName(block, 'INPUT');
    const setpointVar = getVariableName(block, 'SETPOINT');
    const threshold = block.getFieldValue('THRESHOLD');
    const aggKp = block.getFieldValue('AGG_KP');
    const aggKi = block.getFieldValue('AGG_KI');
    const aggKd = block.getFieldValue('AGG_KD');
    const consKp = block.getFieldValue('CONS_KP');
    const consKi = block.getFieldValue('CONS_KI');
    const consKd = block.getFieldValue('CONS_KD');
    
    // 添加库引用
    generator.addLibrary('pid_lib', '#include <PID_v1.h>');
    
    // 添加自适应参数变量
    generator.addVariable(`adaptive_${pidName}`, `double aggKp_${pidName} = ${aggKp}, aggKi_${pidName} = ${aggKi}, aggKd_${pidName} = ${aggKd};`);
    generator.addVariable(`conservative_${pidName}`, `double consKp_${pidName} = ${consKp}, consKi_${pidName} = ${consKi}, consKd_${pidName} = ${consKd};`);
    
    const code = `double gap_${pidName} = abs(${setpointVar} - ${inputVar});
if (gap_${pidName} < ${threshold}) {
    ${pidName}.SetTunings(consKp_${pidName}, consKi_${pidName}, consKd_${pidName});
} else {
    ${pidName}.SetTunings(aggKp_${pidName}, aggKi_${pidName}, aggKd_${pidName});
}
${pidName}.Compute();
`;
    
    return code;
};

// PID比例控制模式设置 (P_ON_M vs P_ON_E)
Arduino.forBlock['pid_set_proportional_mode'] = function(block, generator) {
    const pidName = getVariableName(block, 'PID_NAME');
    const mode = block.getFieldValue('MODE'); // P_ON_M 或 P_ON_E
    const direction = block.getFieldValue('DIRECTION');
    
    // 注意：需要重新初始化PID对象来改变比例模式
    const inputVar = getVariableName(block, 'INPUT');
    const outputVar = getVariableName(block, 'OUTPUT');
    const setpointVar = getVariableName(block, 'SETPOINT');
    const kp = generator.valueToCode(block, 'KP', Arduino.ORDER_ATOMIC) || '2';
    const ki = generator.valueToCode(block, 'KI', Arduino.ORDER_ATOMIC) || '5';
    const kd = generator.valueToCode(block, 'KD', Arduino.ORDER_ATOMIC) || '1';
    
    return `${pidName} = PID(&${inputVar}, &${outputVar}, &${setpointVar}, ${kp}, ${ki}, ${kd}, ${mode}, ${direction});\n${pidName}.SetMode(AUTOMATIC);\n`;
};

// 判断条件：PID是否达到目标值
Arduino.forBlock['pid_is_at_setpoint'] = function(block, generator) {
    const inputVar = getVariableName(block, 'INPUT');
    const setpointVar = getVariableName(block, 'SETPOINT');
    const tolerance = block.getFieldValue('TOLERANCE');
    
    const code = `abs(${setpointVar} - ${inputVar}) <= ${tolerance}`;
    return [code, Arduino.ORDER_RELATIONAL];
};

// 获取PID误差值
Arduino.forBlock['pid_get_error'] = function(block, generator) {
    const inputVar = getVariableName(block, 'INPUT');
    const setpointVar = getVariableName(block, 'SETPOINT');
    
    const code = `(${setpointVar} - ${inputVar})`;
    return [code, Arduino.ORDER_ADDITIVE];
};
