/**
 * AccelStepper 步进电机库代码生成器
 */

// 避免重复加载扩展
if (Blockly.Extensions.isRegistered('accel_stepper_init_extension')) {
  Blockly.Extensions.unregister('accel_stepper_init_extension');
}

// 注册初始化扩展，用于根据接口类型隐藏不必要的引脚
Blockly.Extensions.register('accel_stepper_init_extension', function() {
  // 获取接口类型字段
  var interfaceField = this.getField('INTERFACE');
  
  // 监听接口类型变化
  var thisBlock = this;
  interfaceField.setValidator(function(newValue) {
    // 根据接口类型显示/隐藏相应引脚
    var pin3Field = thisBlock.getField('PIN3');
    var pin4Field = thisBlock.getField('PIN4');
    
    switch(newValue) {
      case 'DRIVER':
      case 'FULL2WIRE':
        // 2引脚模式，隐藏pin3和pin4
        if (pin3Field) pin3Field.setVisible(false);
        if (pin4Field) pin4Field.setVisible(false);
        break;
      case 'FULL3WIRE':
      case 'HALF3WIRE':
        // 3引脚模式，显示pin3，隐藏pin4
        if (pin3Field) pin3Field.setVisible(true);
        if (pin4Field) pin4Field.setVisible(false);
        break;
      case 'FULL4WIRE':
      case 'HALF4WIRE':
        // 4引脚模式，显示所有引脚
        if (pin3Field) pin3Field.setVisible(true);
        if (pin4Field) pin4Field.setVisible(true);
        break;
    }
    
    // 更新块的外观
    thisBlock.render();
    return newValue;
  });
  
  // 初始化时设置引脚可见性
  var initialValue = interfaceField.getValue();
  interfaceField.getValidator()(initialValue);
});

Arduino.forBlock['accel_stepper_init'] = function(block, generator) {
    var stepperName = Arduino.nameDB_.getName(block.getFieldValue('STEPPER_NAME'), Blockly.VARIABLE_CATEGORY_NAME);
    var interface = block.getFieldValue('INTERFACE');
    var pin1 = block.getFieldValue('PIN1');
    var pin2 = block.getFieldValue('PIN2');
    var pin3 = block.getFieldValue('PIN3');
    var pin4 = block.getFieldValue('PIN4');
    
    // 添加AccelStepper库引用
    generator.addLibrary('AccelStepper', '#include <AccelStepper.h>');
    
    // 根据接口类型生成不同的对象声明
    var objectDeclaration = '';
    switch(interface) {
        case 'DRIVER':
            objectDeclaration = 'AccelStepper ' + stepperName + '(AccelStepper::DRIVER, ' + pin1 + ', ' + pin2 + ');';
            break;
        case 'FULL2WIRE':
            objectDeclaration = 'AccelStepper ' + stepperName + '(AccelStepper::FULL2WIRE, ' + pin1 + ', ' + pin2 + ');';
            break;
        case 'FULL3WIRE':
            objectDeclaration = 'AccelStepper ' + stepperName + '(AccelStepper::FULL3WIRE, ' + pin1 + ', ' + pin2 + ', ' + pin3 + ');';
            break;
        case 'FULL4WIRE':
            objectDeclaration = 'AccelStepper ' + stepperName + '(AccelStepper::FULL4WIRE, ' + pin1 + ', ' + pin2 + ', ' + pin3 + ', ' + pin4 + ');';
            break;
        case 'HALF3WIRE':
            objectDeclaration = 'AccelStepper ' + stepperName + '(AccelStepper::HALF3WIRE, ' + pin1 + ', ' + pin2 + ', ' + pin3 + ');';
            break;
        case 'HALF4WIRE':
            objectDeclaration = 'AccelStepper ' + stepperName + '(AccelStepper::HALF4WIRE, ' + pin1 + ', ' + pin2 + ', ' + pin3 + ', ' + pin4 + ');';
            break;
        default:
            objectDeclaration = 'AccelStepper ' + stepperName + '(AccelStepper::FULL4WIRE, ' + pin1 + ', ' + pin2 + ', ' + pin3 + ', ' + pin4 + ');';
    }
    
    // 添加对象声明
    generator.addObject(stepperName, objectDeclaration);
    
    // 添加基本初始化设置（可选的默认值）
    generator.addSetupBegin(stepperName + '_init', 
        stepperName + '.setMaxSpeed(1000.0);\n' +
        '  ' + stepperName + '.setAcceleration(500.0);'
    );
    
    return '';
};

Arduino.forBlock['accel_stepper_set_max_speed'] = function(block, generator) {
    var stepperName = Arduino.nameDB_.getName(block.getFieldValue('STEPPER_NAME'), Blockly.VARIABLE_CATEGORY_NAME);
    var speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '1000';
    
    var code = stepperName + '.setMaxSpeed(' + speed + ');\n';
    return code;
};

Arduino.forBlock['accel_stepper_set_acceleration'] = function(block, generator) {
    var stepperName = Arduino.nameDB_.getName(block.getFieldValue('STEPPER_NAME'), Blockly.VARIABLE_CATEGORY_NAME);
    var acceleration = generator.valueToCode(block, 'ACCELERATION', generator.ORDER_ATOMIC) || '500';
    
    var code = stepperName + '.setAcceleration(' + acceleration + ');\n';
    return code;
};

Arduino.forBlock['accel_stepper_set_speed'] = function(block, generator) {
    var stepperName = Arduino.nameDB_.getName(block.getFieldValue('STEPPER_NAME'), Blockly.VARIABLE_CATEGORY_NAME);
    var speed = generator.valueToCode(block, 'SPEED', generator.ORDER_ATOMIC) || '100';
    
    var code = stepperName + '.setSpeed(' + speed + ');\n';
    return code;
};

Arduino.forBlock['accel_stepper_move_to'] = function(block, generator) {
    var stepperName = Arduino.nameDB_.getName(block.getFieldValue('STEPPER_NAME'), Blockly.VARIABLE_CATEGORY_NAME);
    var position = generator.valueToCode(block, 'POSITION', generator.ORDER_ATOMIC) || '0';
    
    var code = stepperName + '.moveTo(' + position + ');\n';
    return code;
};

Arduino.forBlock['accel_stepper_move'] = function(block, generator) {
    var stepperName = Arduino.nameDB_.getName(block.getFieldValue('STEPPER_NAME'), Blockly.VARIABLE_CATEGORY_NAME);
    var steps = generator.valueToCode(block, 'STEPS', generator.ORDER_ATOMIC) || '100';
    
    var code = stepperName + '.move(' + steps + ');\n';
    return code;
};

Arduino.forBlock['accel_stepper_run'] = function(block, generator) {
    var stepperName = Arduino.nameDB_.getName(block.getFieldValue('STEPPER_NAME'), Blockly.VARIABLE_CATEGORY_NAME);
    
    var code = stepperName + '.run();\n';
    return code;
};

Arduino.forBlock['accel_stepper_run_speed'] = function(block, generator) {
    var stepperName = Arduino.nameDB_.getName(block.getFieldValue('STEPPER_NAME'), Blockly.VARIABLE_CATEGORY_NAME);
    
    var code = stepperName + '.runSpeed();\n';
    return code;
};

Arduino.forBlock['accel_stepper_run_to_position'] = function(block, generator) {
    var stepperName = Arduino.nameDB_.getName(block.getFieldValue('STEPPER_NAME'), Blockly.VARIABLE_CATEGORY_NAME);
    
    var code = stepperName + '.runToPosition();\n';
    return code;
};

Arduino.forBlock['accel_stepper_run_to_new_position'] = function(block, generator) {
    var stepperName = Arduino.nameDB_.getName(block.getFieldValue('STEPPER_NAME'), Blockly.VARIABLE_CATEGORY_NAME);
    var position = generator.valueToCode(block, 'POSITION', generator.ORDER_ATOMIC) || '0';
    
    var code = stepperName + '.runToNewPosition(' + position + ');\n';
    return code;
};

Arduino.forBlock['accel_stepper_stop'] = function(block, generator) {
    var stepperName = Arduino.nameDB_.getName(block.getFieldValue('STEPPER_NAME'), Blockly.VARIABLE_CATEGORY_NAME);
    
    var code = stepperName + '.stop();\n';
    return code;
};

Arduino.forBlock['accel_stepper_current_position'] = function(block, generator) {
    var stepperName = Arduino.nameDB_.getName(block.getFieldValue('STEPPER_NAME'), Blockly.VARIABLE_CATEGORY_NAME);
    
    var code = stepperName + '.currentPosition()';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['accel_stepper_target_position'] = function(block, generator) {
    var stepperName = Arduino.nameDB_.getName(block.getFieldValue('STEPPER_NAME'), Blockly.VARIABLE_CATEGORY_NAME);
    
    var code = stepperName + '.targetPosition()';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['accel_stepper_distance_to_go'] = function(block, generator) {
    var stepperName = Arduino.nameDB_.getName(block.getFieldValue('STEPPER_NAME'), Blockly.VARIABLE_CATEGORY_NAME);
    
    var code = stepperName + '.distanceToGo()';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['accel_stepper_is_running'] = function(block, generator) {
    var stepperName = Arduino.nameDB_.getName(block.getFieldValue('STEPPER_NAME'), Blockly.VARIABLE_CATEGORY_NAME);
    
    var code = stepperName + '.isRunning()';
    return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock['accel_stepper_set_current_position'] = function(block, generator) {
    var stepperName = Arduino.nameDB_.getName(block.getFieldValue('STEPPER_NAME'), Blockly.VARIABLE_CATEGORY_NAME);
    var position = generator.valueToCode(block, 'POSITION', generator.ORDER_ATOMIC) || '0';
    
    var code = stepperName + '.setCurrentPosition(' + position + ');\n';
    return code;
};

Arduino.forBlock['accel_stepper_speed'] = function(block, generator) {
    var stepperName = Arduino.nameDB_.getName(block.getFieldValue('STEPPER_NAME'), Blockly.VARIABLE_CATEGORY_NAME);
    
    var code = stepperName + '.speed()';
    return [code, generator.ORDER_ATOMIC];
};
