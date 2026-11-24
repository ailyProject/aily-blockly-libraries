// HM3301 PM2.5 激光粉尘传感器 Generator

// 注册板卡识别扩展 - I2C版本
if (Blockly.Extensions && Blockly.Extensions.isRegistered && Blockly.Extensions.isRegistered('hm3301_i2c_board_extension')) {
  Blockly.Extensions.unregister('hm3301_i2c_board_extension');
}

if (Blockly.Extensions && Blockly.Extensions.register) {
  Blockly.Extensions.register('hm3301_i2c_board_extension', function() {
    var boardConfig = window['boardConfig'] || {};
    var boardCore = (boardConfig.core || '').toLowerCase();
    var boardType = (boardConfig.type || '').toLowerCase();
    var boardName = (boardConfig.name || '').toLowerCase();

    var isESP32 = boardCore.indexOf('esp32') > -1 ||
                  boardType.indexOf('esp32') > -1 ||
                  boardName.indexOf('esp32') > -1;
    var isMega2560 = boardCore.indexOf('mega') > -1 ||
                    boardType.indexOf('mega') > -1 ||
                    boardName.indexOf('mega') > -1 ||
                    boardName.indexOf('2560') > -1;

    this.boardType_ = isESP32 ? 'ESP32' : (isMega2560 ? 'MEGA' : 'UNO');

    // 读取 i18n
    var i18n = (window.__BLOCKLY_LIB_I18N__ || {})['@aily-project/lib-seeed-hm3301'];
    var extI18n = (i18n && i18n.extensions && i18n.extensions.hm3301_i2c_board_extension) || {};
    var sdaLabel = extI18n.sda_pin || 'SDA引脚';
    var sclLabel = extI18n.scl_pin || 'SCL引脚';

    if (isESP32) {
      var digitalPins = (boardConfig.digitalPins || []);
      var pinOptions = digitalPins.length > 0 ? digitalPins : [
        ['21', '21'], ['22', '22'], ['19', '19'], ['23', '23'],
        ['18', '18'], ['5', '5'], ['17', '17'], ['16', '16']
      ];

      var wirePins = (boardConfig.i2cPins && boardConfig.i2cPins.Wire) || [];
      function optionsFor(role) {
        var route = wirePins.find(function(pair) { return pair[0] === role; });
        var selected = route ? route[1] : role;
        var options = pinOptions.filter(function(pair) { return pair[1] !== selected; });
        var first = pinOptions.find(function(pair) { return pair[1] === selected; }) || [role, selected];
        return [first].concat(options);
      }
      this.appendDummyInput('PIN_INPUT')
        .appendField(sdaLabel)
        .appendField(new Blockly.FieldDropdown(optionsFor('SDA')), 'SDA_PIN')
        .appendField(sclLabel)
        .appendField(new Blockly.FieldDropdown(optionsFor('SCL')), 'SCL_PIN');

      this.setTooltip(extI18n.tooltip_esp32 || '初始化HM3301传感器，ESP32需要设置SDA/SCL引脚');
    } else {
      if (isMega2560) {
        this.setTooltip(extI18n.tooltip_mega || '初始化HM3301传感器（Mega2560 I2C引脚固定: SDA->20, SCL->21）');
      } else {
        this.setTooltip(extI18n.tooltip_uno || '初始化HM3301传感器（Arduino UNO I2C引脚固定: SDA->A4, SCL->A5）');
      }
    }
  });
}

// 数据索引映射
var HM3301_INDEX_MAP = {
  'PM1_0_STD': 2,
  'PM2_5_STD': 3,
  'PM10_STD': 4,
  'PM1_0_ATM': 5,
  'PM2_5_ATM': 6,
  'PM10_ATM': 7
};

Arduino.forBlock['hm3301_init'] = function(block, generator) {
  var sdaPin = block.getFieldValue('SDA_PIN') || '21';
  var sclPin = block.getFieldValue('SCL_PIN') || '22';

  var config = window['boardConfig'] || {};
  var core = (config.core || '').toLowerCase();
  var type = (config.type || '').toLowerCase();
  var name = (config.name || '').toLowerCase();

  var isESP32 = core.indexOf('esp32') > -1 ||
                type.indexOf('esp32') > -1 ||
                name.indexOf('esp32') > -1;

  generator.addLibrary('include_Seeed_HM330X', '#include <Seeed_HM330X.h>');
  generator.addObject('hm3301_sensor', 'HM330X hm3301_sensor;');
  generator.addVariable('hm3301_buf', 'uint8_t hm3301_buf[30];');

  // 辅助函数：读取并解析指定索引的值
  generator.addFunction('hm3301_read_value', 
    'uint16_t hm3301_read_value(uint8_t index) {\n' +
    '  if (hm3301_sensor.read_sensor_value(hm3301_buf, 29)) {\n' +
    '    return 0;\n' +
    '  }\n' +
    '  return (uint16_t)hm3301_buf[index * 2] << 8 | hm3301_buf[index * 2 + 1];\n' +
    '}'
  );

  var initCode = '';
  if (isESP32) {
    initCode = 'Wire.begin(' + sdaPin + ', ' + sclPin + ');\n  hm3301_sensor.init();';
  } else {
    initCode = 'hm3301_sensor.init();';
  }

  generator.addSetupBegin('hm3301_init', initCode);

  return '';
};

Arduino.forBlock['hm3301_read'] = function(block, generator) {
  var type = block.getFieldValue('TYPE');
  var index = HM3301_INDEX_MAP[type] || 3;

  generator.addLibrary('include_Seeed_HM330X', '#include <Seeed_HM330X.h>');
  generator.addObject('hm3301_sensor', 'HM330X hm3301_sensor;');
  generator.addVariable('hm3301_buf', 'uint8_t hm3301_buf[30];');

  generator.addFunction('hm3301_read_value',
    'uint16_t hm3301_read_value(uint8_t index) {\n' +
    '  if (hm3301_sensor.read_sensor_value(hm3301_buf, 29)) {\n' +
    '    return 0;\n' +
    '  }\n' +
    '  return (uint16_t)hm3301_buf[index * 2] << 8 | hm3301_buf[index * 2 + 1];\n' +
    '}'
  );

  return ['hm3301_read_value(' + index + ')', generator.ORDER_ATOMIC];
};
