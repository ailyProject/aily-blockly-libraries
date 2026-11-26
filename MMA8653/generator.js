// MMA8653 加速度传感器代码生成器

function ensureMMA8653Lib(generator) {
    generator.addLibrary('Wire_include', '#include <Wire.h>');
    generator.addLibrary('MMA8653_include', '#include <MMA8653.h>');
    generator.addVariable('mma8653_obj', 'MMA8653 accel;');
}

Arduino.forBlock['mma8653_init'] = function (block, generator) {
    var range = block.getFieldValue('RANGE');
    var resolution = block.getFieldValue('RESOLUTION');
    var dataRate = block.getFieldValue('DATA_RATE');

    ensureMMA8653Lib(generator);

    var initCode = 'Wire.begin();\n';
    initCode += 'if (!accel.init(' + range + ', ' + resolution + ', ' + dataRate + ')) {\n';
    initCode += '  Serial.println("MMA8653 not found! Check wiring.");\n';
    initCode += '}\n';

    generator.addSetupBegin('mma8653_init', initCode);

    return '';
};

Arduino.forBlock['mma8653_set_mode'] = function (block, generator) {
    var mode = block.getFieldValue('MODE');

    ensureMMA8653Lib(generator);

    return 'accel.setMODS(' + mode + ');\n';
};

Arduino.forBlock['mma8653_begin'] = function (block, generator) {
    ensureMMA8653Lib(generator);

    return 'accel.begin();\n';
};

Arduino.forBlock['mma8653_read_x'] = function (block, generator) {
    ensureMMA8653Lib(generator);

    generator.addVariable('mma8653_x', 'int16_t mma8653_x;');
    generator.addVariable('mma8653_y', 'int16_t mma8653_y;');
    generator.addVariable('mma8653_z', 'int16_t mma8653_z;');

    var funcCode = 'int16_t mma8653_getX() {\n';
    funcCode += '  if (!accel.tryReadSensor(&mma8653_x, &mma8653_y, &mma8653_z)) return INT16_MIN;\n';
    funcCode += '  return mma8653_x;\n';
    funcCode += '}';

    generator.addFunction('mma8653_getX_func', funcCode);

    return ['mma8653_getX()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mma8653_read_y'] = function (block, generator) {
    ensureMMA8653Lib(generator);

    generator.addVariable('mma8653_x', 'int16_t mma8653_x;');
    generator.addVariable('mma8653_y', 'int16_t mma8653_y;');
    generator.addVariable('mma8653_z', 'int16_t mma8653_z;');

    var funcCode = 'int16_t mma8653_getY() {\n';
    funcCode += '  if (!accel.tryReadSensor(&mma8653_x, &mma8653_y, &mma8653_z)) return INT16_MIN;\n';
    funcCode += '  return mma8653_y;\n';
    funcCode += '}';

    generator.addFunction('mma8653_getY_func', funcCode);

    return ['mma8653_getY()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mma8653_read_z'] = function (block, generator) {
    ensureMMA8653Lib(generator);

    generator.addVariable('mma8653_x', 'int16_t mma8653_x;');
    generator.addVariable('mma8653_y', 'int16_t mma8653_y;');
    generator.addVariable('mma8653_z', 'int16_t mma8653_z;');

    var funcCode = 'int16_t mma8653_getZ() {\n';
    funcCode += '  if (!accel.tryReadSensor(&mma8653_x, &mma8653_y, &mma8653_z)) return INT16_MIN;\n';
    funcCode += '  return mma8653_z;\n';
    funcCode += '}';

    generator.addFunction('mma8653_getZ_func', funcCode);

    return ['mma8653_getZ()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mma8653_read_xyz'] = function (block, generator) {
    var varX = generator.nameDB_.getName(block.getFieldValue('VAR_X'), 'VARIABLE');
    var varY = generator.nameDB_.getName(block.getFieldValue('VAR_Y'), 'VARIABLE');
    var varZ = generator.nameDB_.getName(block.getFieldValue('VAR_Z'), 'VARIABLE');
    addVariableToToolbox(block, varX);
    addVariableToToolbox(block, varY);
    addVariableToToolbox(block, varZ);

    ensureMMA8653Lib(generator);

    generator.addVariable(varX, 'int16_t ' + varX + ';');
    generator.addVariable(varY, 'int16_t ' + varY + ';');
    generator.addVariable(varZ, 'int16_t ' + varZ + ';');

    var code = 'if (!accel.tryReadSensor(&' + varX + ', &' + varY + ', &' + varZ + ')) {\n'
        + '  ' + varX + ' = ' + varY + ' = ' + varZ + ' = INT16_MIN;\n}\n';

    return code;
};

Arduino.forBlock['mma8653_set_range'] = function (block, generator) {
    var range = block.getFieldValue('RANGE');

    ensureMMA8653Lib(generator);

    return 'accel.setRange(' + range + ');\n';
};

Arduino.forBlock['mma8653_set_data_rate'] = function (block, generator) {
    var dataRate = block.getFieldValue('DATA_RATE');

    ensureMMA8653Lib(generator);

    return 'accel.setDataRate(' + dataRate + ');\n';
};

Arduino.forBlock['mma8653_set_resolution'] = function (block, generator) {
    var resolution = block.getFieldValue('RESOLUTION');

    ensureMMA8653Lib(generator);

    return 'accel.setResolution(' + resolution + ');\n';
};

Arduino.forBlock['mma8653_is_active'] = function (block, generator) {
    ensureMMA8653Lib(generator);

    return ['accel.isActive()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mma8653_check_connection'] = function (block, generator) {
    ensureMMA8653Lib(generator);

    return ['accel.whoAmI()', Arduino.ORDER_FUNCTION_CALL];
};

// 倾角计功能 - 共用的加速度变量和数学库
function ensureMMA8653TiltVars(generator) {
    ensureMMA8653Lib(generator);
    generator.addVariable('mma8653_x', 'int16_t mma8653_x;');
    generator.addVariable('mma8653_y', 'int16_t mma8653_y;');
    generator.addVariable('mma8653_z', 'int16_t mma8653_z;');
}

Arduino.forBlock['mma8653_get_roll'] = function (block, generator) {
    ensureMMA8653TiltVars(generator);

    var funcCode = 'float mma8653_getRoll() {\n';
    funcCode += '  if (!accel.tryReadSensor(&mma8653_x, &mma8653_y, &mma8653_z)) return NAN;\n';
    funcCode += '  return atan2((float)mma8653_y, (float)mma8653_z) * 180.0 / PI;\n';
    funcCode += '}';

    generator.addFunction('mma8653_getRoll_func', funcCode);

    return ['mma8653_getRoll()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mma8653_get_pitch'] = function (block, generator) {
    ensureMMA8653TiltVars(generator);

    var funcCode = 'float mma8653_getPitch() {\n';
    funcCode += '  if (!accel.tryReadSensor(&mma8653_x, &mma8653_y, &mma8653_z)) return NAN;\n';
    funcCode += '  return atan2(-(float)mma8653_x, sqrt((float)mma8653_y * mma8653_y + (float)mma8653_z * mma8653_z)) * 180.0 / PI;\n';
    funcCode += '}';

    generator.addFunction('mma8653_getPitch_func', funcCode);

    return ['mma8653_getPitch()', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['mma8653_get_tilt'] = function (block, generator) {
    ensureMMA8653TiltVars(generator);

    var funcCode = 'float mma8653_getTilt() {\n';
    funcCode += '  if (!accel.tryReadSensor(&mma8653_x, &mma8653_y, &mma8653_z)) return NAN;\n';
    funcCode += '  float g = sqrt((float)mma8653_x * mma8653_x + (float)mma8653_y * mma8653_y + (float)mma8653_z * mma8653_z);\n';
    funcCode += '  if (g == 0) return 0;\n';
    funcCode += '  return acos((float)mma8653_z / g) * 180.0 / PI;\n';
    funcCode += '}';

    generator.addFunction('mma8653_getTilt_func', funcCode);

    return ['mma8653_getTilt()', Arduino.ORDER_FUNCTION_CALL];
};
