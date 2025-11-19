Arduino.forBlock['RemoteControl2g4_init'] = function (block, generator) {
    // 添加 OpenJumper RemoteControl 的头文件
    generator.addLibrary('OJRC24_include', '#include"OpenJumper_RemoteControl.h"');

    // 创建 OJPAD 对象
    var ojpadDef = 'OJPAD MyCar = OJPAD();';
    generator.addVariable('ojpad_def', ojpadDef);

    return '';
};

Arduino.forBlock['RemoteControl2g4_run'] = function (block, generator) {
    // 确保包含 OpenJumper 头文件，并声明 MyCar 对象（以防未通过 init 块声明）
    //generator.addLibrary('OJRC24_include', '#include"OpenJumper_RemoteControl.h"');
    //generator.addVariable('ojpad_def', 'OJPAD MyCar = OJPAD();');

    // 生成对 MyCar 的调用
    var code = 'MyCar.OpenJumper_RemoteControl_run();\n';

    return code;
};

Arduino.forBlock['RemoteControl2g4_RD'] = function (block, generator) {
    // 确保包含 OpenJumper 头文件，并声明 MyCar 对象（以防未通过 init 块声明）
    //generator.addLibrary('OJRC24_include', '#include"OpenJumper_RemoteControl.h"');
    //generator.addVariable('ojpad_def', 'OJPAD MyCar = OJPAD();');

    // 生成对 MyCar.SerialState() 的调用表达式
    var code = 'MyCar.SerialState()';

    return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['RemoteControl_btn'] = function (block, generator) {
    // 确保包含 OpenJumper 头文件，并声明 MyCar 对象（若 init 未使用）
    //generator.addLibrary('OJRC24_include', '#include"OpenJumper_RemoteControl.h"');
    //generator.addVariable('ojpad_def', 'OJPAD MyCar = OJPAD();');

    // 读取下拉框选择的按键常量
    var button = block.getFieldValue('BUTTON');

    // 生成 MyCar.Button(PAD_XXX) 表达式
    var code = 'MyCar.Button(' + button + ')';

    return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['RemoteControl_joy'] = function (block, generator) {
    // 确保包含 OpenJumper 头文件，并声明 MyCar 对象（若 init 未使用）
    //generator.addLibrary('OJRC24_include', '#include"OpenJumper_RemoteControl.h"');
    //generator.addVariable('ojpad_def', 'OJPAD MyCar = OJPAD();');

    // 读取下拉框选择的摇杆常量
    var joy = block.getFieldValue('JOY');

    // 生成 MyCar.Joy(PAD_XXX) 表达式
    var code = 'MyCar.Analog(' + joy + ')';

    return [code, Arduino.ORDER_FUNCTION_CALL];
};
