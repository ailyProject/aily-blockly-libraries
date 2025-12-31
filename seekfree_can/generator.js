Arduino.forBlock['esp32c3_can_begin'] = function (block, generator) {
    // 添加CAN通信库引用
    generator.addLibrary('#include "seekfree_can.h"', '#include "seekfree_can.h"');
    // 创建CAN通信对象
    generator.addObject('ESP32C3_CAN esp32c3_can', 'ESP32C3_CAN esp32c3_can;');
    // 添加初始化代码到setup部分
    generator.addSetup('esp32c3_can.begin()', 'esp32c3_can.begin();');
	
	ensureSerialBegin("Serial", generator);
	
    return '';
};



