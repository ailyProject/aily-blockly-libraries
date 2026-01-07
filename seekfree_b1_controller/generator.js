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
	// 添加初始化代码到setup部分
	generator.addSetup('ch422.begin()', 'ch422.begin();');
    generator.addSetup('esp32c3_can.begin()', 'esp32c3_can.begin();');
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

Arduino.forBlock['imu660ma_init'] = function (block, generator) {
    generator.addLibrary('#include "seekfree_can.h"', '#include "seekfree_can.h"');
    generator.addLibrary('#include "seekfree_imu660ma.h"', '#include "seekfree_imu660ma.h"');
    generator.addObject('IMU660MA imu660ma', 'IMU660MA imu660ma;');
	
	const power_index = block.getFieldValue('power_index');
	
    generator.addSetup('imu660ma.begin(' + power_index + ')', 'imu660ma.begin(' + power_index + ');');

    return '';
};

Arduino.forBlock['imu660ma_calibration_acc'] = function (block, generator) {
    return 'imu660ma.calibration_acc();\n';
};

Arduino.forBlock['imu660ma_calibration_gyro'] = function (block, generator) {
    return 'imu660ma.calibration_gyro();\n';
};

Arduino.forBlock['imu660ma_calibration_yaw'] = function (block, generator) {
	var yaw = generator.valueToCode(block, 'yaw', generator.ORDER_ATOMIC) || '0';
    return 'imu660ma.calibration_yaw(' + yaw + ');\n';
};

Arduino.forBlock['imu660ma_get_acc'] = function (block, generator) {
    var axis = block.getFieldValue('AXIS');

    generator.addVariable('int16_t acc_x_data', 'int16_t acc_x_data');
    generator.addVariable('int16_t acc_y_data', 'int16_t acc_y_data');
    generator.addVariable('int16_t acc_z_data', 'int16_t acc_z_data');

    var code = '';
    if (axis === 'X') {
        code = '(imu660ma.get_acc(acc_x_data, acc_y_data, acc_z_data) == 0 ? acc_x_data : 0)';
    } else if (axis === 'Y') {
        code = '(imu660ma.get_acc(acc_x_data, acc_y_data, acc_z_data) == 0 ? acc_y_data : 0)';
    } else {
        code = '(imu660ma.get_acc(acc_x_data, acc_y_data, acc_z_data) == 0 ? acc_z_data : 0)';
    }

    return [code, Arduino.ORDER_CONDITIONAL];
};

Arduino.forBlock['imu660ma_get_gyro'] = function (block, generator) {
    var axis = block.getFieldValue('AXIS');

    generator.addVariable('int16_t gyro_x_data', 'int16_t gyro_x_data');
    generator.addVariable('int16_t gyro_y_data', 'int16_t gyro_y_data');
    generator.addVariable('int16_t gyro_z_data', 'int16_t gyro_z_data');

    var code = '';
    if (axis === 'X') {
        code = '(imu660ma.get_gyro(gyro_x_data, gyro_y_data, gyro_z_data) == 0 ? gyro_x_data : 0)';
    } else if (axis === 'Y') {
        code = '(imu660ma.get_gyro(gyro_x_data, gyro_y_data, gyro_z_data) == 0 ? gyro_y_data : 0)';
    } else {
        code = '(imu660ma.get_gyro(gyro_x_data, gyro_y_data, gyro_z_data) == 0 ? gyro_z_data : 0)';
    }

    return [code, Arduino.ORDER_CONDITIONAL];
};

Arduino.forBlock['imu660ma_get_angle'] = function (block, generator) {
    var angle = block.getFieldValue('ANGLE');

    var code = '';
    if (angle === 'PITCH') {
        generator.addVariable('float pitch_data', 'float pitch_data;');
        code = '(imu660ma.get_pitch(pitch_data) == 0 ? pitch_data : 0)';
    } else if (angle === 'ROLL') {
        generator.addVariable('float roll_data', 'float roll_data;');
        code = '(imu660ma.get_roll(roll_data) == 0 ? roll_data : 0)';
    } else {
        generator.addVariable('float yaw_data', 'float yaw_data;');
        code = '(imu660ma.get_yaw(yaw_data) == 0 ? yaw_data : 0)';
    }

    return [code, Arduino.ORDER_CONDITIONAL];
};

Arduino.forBlock['photoelectricity_init'] = function (block, generator) {
    generator.addLibrary('#include "seekfree_can.h"', '#include "seekfree_can.h"');
    generator.addLibrary('#include "seekfree_photoelectricity.h"', '#include "seekfree_photoelectricity.h"');
    generator.addObject('PHOTOELECTRICITY location', 'PHOTOELECTRICITY location;');
	
	const power_index = block.getFieldValue('power_index');
	
    generator.addSetup('location.begin(' + power_index + ')', 'location.begin(' + power_index + ');');

    return '';
};

Arduino.forBlock['photoelectricity_set_black'] = function (block, generator) {
	var device_id = block.getFieldValue('DEVICE_ID');
	var code = 'location.set_black(' + device_id + ');\n';
    return code;
};

Arduino.forBlock['photoelectricity_set_white'] = function (block, generator) {
	var device_id = block.getFieldValue('DEVICE_ID');
	var code = 'location.set_white(' + device_id + ');\n';
    return code;
};

Arduino.forBlock['photoelectricity_get_position'] = function (block, generator) {
    var device_id = block.getFieldValue('DEVICE_ID');

	generator.addVariable('int16_t photoelectricity_position', 'int16_t photoelectricity_position;');
	
	var code = '';
	code = '(location.get_position(' + device_id + ', photoelectricity_position) == 0 ? photoelectricity_position : 0)';

    return [code, Arduino.ORDER_CONDITIONAL];
};

Arduino.forBlock['photoelectricity_get_value'] = function (block, generator) {
    var device_id = block.getFieldValue('DEVICE_ID');
	var channel = block.getFieldValue('CHANNEL');

	generator.addVariable('int16_t photoelectricity_value', 'int16_t photoelectricity_value;');
	
	var code = '';
	code = '(location.get_value(' + device_id + ', ' + channel + ', ' + 'photoelectricity_value) == 0 ? photoelectricity_value : 0)';

    return [code, Arduino.ORDER_CONDITIONAL];
};

Arduino.forBlock['photoelectricity_get_value_bin'] = function (block, generator) {
    var device_id = block.getFieldValue('DEVICE_ID');
	var channel = block.getFieldValue('CHANNEL');

	generator.addVariable('uint8_t photoelectricity_value_bin', 'uint8_t photoelectricity_value_bin;');
	var code = '';
	code = '(location.get_value_bin(' + device_id + ', ' + channel + ', ' + 'photoelectricity_value_bin) == 0 ? photoelectricity_value_bin : 0)';

    return [code, Arduino.ORDER_CONDITIONAL];
};

Arduino.forBlock['photoelectricity_get_black_num'] = function (block, generator) {
    var device_id = block.getFieldValue('DEVICE_ID');
	var channel = block.getFieldValue('CHANNEL');

	generator.addVariable('uint8_t black_num', 'uint8_t black_num;');
	var code = '';
	code = '(location.get_black_num(' + device_id + ', ' + 'black_num) == 0 ? black_num : 0)';

    return [code, Arduino.ORDER_CONDITIONAL];
};

Arduino.forBlock['photoelectricity_get_white_num'] = function (block, generator) {
    var device_id = block.getFieldValue('DEVICE_ID');
	var channel = block.getFieldValue('CHANNEL');

	generator.addVariable('uint8_t white_num', 'uint8_t white_num;');
	var code = '';
	code = '(location.get_white_num(' + device_id + ', ' + 'white_num) == 0 ? white_num : 0)';

    return [code, Arduino.ORDER_CONDITIONAL];
};

Arduino.forBlock['ch422_set_beep'] = function (block, generator) {
    var state = block.getFieldValue('STATE');

    // 添加CH422库引用和对象（如果尚未添加）
    generator.addLibrary('#include "seekfree_expansion_ch422.h"', '#include "seekfree_expansion_ch422.h"');
    generator.addObject('CH422 ch422', 'CH422 ch422;');

    var code = 'ch422.set_beep(' + state + ');\n';
    return code;
};

Arduino.forBlock['ch422_set_led'] = function (block, generator) {
    var color = block.getFieldValue('COLOR');
    var state = block.getFieldValue('STATE');

    // 添加CH422库引用和对象（如果尚未添加）
    generator.addLibrary('#include "seekfree_expansion_ch422.h"', '#include "seekfree_expansion_ch422.h"');
    generator.addObject('CH422 ch422', 'CH422 ch422;');

    var code = 'ch422.set_' + color + '_led(' + state + ');\n';
    return code;
};

Arduino.forBlock['key4_adc1_begin'] = function (block, generator) {
    // 添加ADC按键库引用
    generator.addLibrary('#include "seekfree_key4_adc1.h"', '#include "seekfree_key4_adc1.h"');
    // 创建ADC按键对象
    generator.addObject('KEY4_ADC1 key4_adc1', 'KEY4_ADC1 key4_adc1;');
    // 添加初始化代码到setup部分
    generator.addSetup('key4_adc1.begin()', 'key4_adc1.begin();');

    return '';
};

Arduino.forBlock['key4_adc1_read'] = function (block, generator) {
    var key_id = block.getFieldValue('KEY_ID');
	var state = block.getFieldValue('STATE');
	
    // 添加ADC按键库引用和对象（如果尚未添加）
    generator.addLibrary('#include "seekfree_key4_adc1.h"', '#include "seekfree_key4_adc1.h"');
    generator.addObject('KEY4_ADC1 key4_adc1', 'KEY4_ADC1 key4_adc1;');

	return ['key4_adc1.read_state(' + key_id + ', ' + state + ')', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['openart_mini_begin'] = function (block, generator) {
    // 添加ADC按键库引用
    generator.addLibrary('#include "seekfree_openart_mini.h"', '#include "seekfree_openart_mini.h"');
    // 创建ADC按键对象
    generator.addObject('OPENART_MINI openart_mini', 'OPENART_MINI openart_mini;');
    // 添加初始化代码到setup部分
    generator.addSetup('openart_mini.begin()', 'openart_mini.begin();');

    return '';
};

Arduino.forBlock['openart_mini_detection_object'] = function (block, generator) {
    var shape = block.getFieldValue('SHAPE');
	var rgb_value = block.getFieldValue('VALUE');
	
    // 添加ADC按键库引用和对象（如果尚未添加）
    generator.addLibrary('#include "seekfree_openart_mini.h"', '#include "seekfree_openart_mini.h"');
    generator.addObject('OPENART_MINI openart_mini', 'OPENART_MINI openart_mini;');
	
	var code = 'openart_mini.detection_object(' + shape + ', ' + rgb_value + ');\n';
	return code;
};

Arduino.forBlock['openart_mini_detection_apriltag'] = function (block, generator) {
    // 添加ADC按键库引用和对象（如果尚未添加）
    generator.addLibrary('#include "seekfree_openart_mini.h"', '#include "seekfree_openart_mini.h"');
    generator.addObject('OPENART_MINI openart_mini', 'OPENART_MINI openart_mini;');
	
	var code = 'openart_mini.detection_apriltag();\n';
	return code;
};

Arduino.forBlock['openart_mini_detection_stop'] = function (block, generator) {
    // 添加ADC按键库引用和对象（如果尚未添加）
    generator.addLibrary('#include "seekfree_openart_mini.h"', '#include "seekfree_openart_mini.h"');
    generator.addObject('OPENART_MINI openart_mini', 'OPENART_MINI openart_mini;');
	
	var code = 'openart_mini.detection_stop();\n';
	return code;
};

Arduino.forBlock['openart_mini_get_result'] = function (block, generator) {
    var type = block.getFieldValue('TYPE');
	
    // 添加ADC按键库引用和对象（如果尚未添加）
    generator.addLibrary('#include "seekfree_openart_mini.h"', '#include "seekfree_openart_mini.h"');
    generator.addObject('OPENART_MINI openart_mini', 'OPENART_MINI openart_mini;');

	return ['openart_mini.get_result(' + type + ')', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['openart_mini_get_coord_x'] = function (block, generator) {
    var type = block.getFieldValue('TYPE');
	
    // 添加ADC按键库引用和对象（如果尚未添加）
    generator.addLibrary('#include "seekfree_openart_mini.h"', '#include "seekfree_openart_mini.h"');
    generator.addObject('OPENART_MINI openart_mini', 'OPENART_MINI openart_mini;');

	return ['openart_mini.get_coord_x(' + type + ')', Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['openart_mini_get_coord_y'] = function (block, generator) {
    var type = block.getFieldValue('TYPE');
	
    // 添加ADC按键库引用和对象（如果尚未添加）
    generator.addLibrary('#include "seekfree_openart_mini.h"', '#include "seekfree_openart_mini.h"');
    generator.addObject('OPENART_MINI openart_mini', 'OPENART_MINI openart_mini;');

	return ['openart_mini.get_coord_y(' + type + ')', Arduino.ORDER_FUNCTION_CALL];
};

