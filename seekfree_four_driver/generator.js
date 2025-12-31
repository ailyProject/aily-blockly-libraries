Arduino.forBlock['four_driver_init'] = function (block, generator) {
    // 添加必要的库引用和对象创建
    generator.addLibrary('#include "seekfree_can.h"', '#include "seekfree_can.h"');
    generator.addLibrary('#include "seekfree_expansion_ch422.h"', '#include "seekfree_expansion_ch422.h"');
    generator.addLibrary('#include "seekfree_imu660ma.h"', '#include "seekfree_imu660ma.h"');
    generator.addLibrary('#include "seekfree_four_driver.h"', '#include "seekfree_four_driver.h"');

    generator.addObject('CH422 ch422', 'CH422 ch422;');
    generator.addObject('ESP32C3_CAN esp32c3_can', 'ESP32C3_CAN esp32c3_can;');
    generator.addObject('IMU660MA imu660ma', 'IMU660MA imu660ma;');
    generator.addObject('FOUR_DRIVER four_driver', 'FOUR_DRIVER four_driver;');
	
	ensureSerialBegin("Serial", generator);
	
	const power_index = block.getFieldValue('power_index');

    generator.addSetup('four_driver.begin(' + power_index + ')', 'four_driver.begin(' + power_index + ');');

    return '';
};

Arduino.forBlock['four_driver_set_speed'] = function (block, generator) {
	var speed1 = generator.valueToCode(block, 'speed1', generator.ORDER_ATOMIC) || '0';
	var speed2 = generator.valueToCode(block, 'speed2', generator.ORDER_ATOMIC) || '0';
	var speed3 = generator.valueToCode(block, 'speed3', generator.ORDER_ATOMIC) || '0';
	var speed4 = generator.valueToCode(block, 'speed4', generator.ORDER_ATOMIC) || '0';
	
    // 生成函数调用代码
	var code = 'four_driver.set_speed(1, 2, ' + speed1 + ');\n four_driver.set_speed(1, 3, ' + speed2 + ');\n four_driver.set_speed(1, 0, ' + speed3 + ');\n four_driver.set_speed(1, 1, ' + speed4 + ');\n four_driver.set_speed_ready(1);\n';
    return code;
};

Arduino.forBlock['four_driver_move'] = function (block, generator) {
    const direction = block.getFieldValue('DIRECTION');
    const distance = block.getFieldValue('DISTANCE');
    const speed = block.getFieldValue('SPEED');

    // 生成函数调用代码
    return `four_driver.move(${direction}, ${speed}, ${distance});\n`;
};

Arduino.forBlock['four_driver_turn'] = function (block, generator) {
	const direction = block.getFieldValue('DIRECTION');
    const angle = block.getFieldValue('ANGLE');
    const speed = block.getFieldValue('SPEED');

    // 生成函数调用代码
    return `four_driver.turn(${angle} * ${direction}, ${speed});\n`;
};

Arduino.forBlock['four_driver_track'] = function (block, generator) {
	var coord_x = generator.valueToCode(block, 'coord_x', Arduino.ORDER_ATOMIC);
    var coord_y = generator.valueToCode(block, 'coord_y', Arduino.ORDER_ATOMIC);

	// 生成函数调用代码
    var code = 'four_driver.track(' + coord_x + ', ' + coord_y + ')';
    
    // 返回数组包含代码和运算符优先级
    return [code, Arduino.ORDER_FUNCTION_CALL];
};