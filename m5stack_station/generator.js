'use strict';

function ensureM5Station(generator) {
  if (typeof ensureM5StackDevice === 'function') {
    ensureM5StackDevice(generator);
  } else {
    generator.addLibrary('m5stack_unified', '#include <M5Unified.h>');
    generator.addSetupBegin('m5stack_device_begin', 'auto ailyM5Config = M5.config();\nM5.begin(ailyM5Config);');
    generator.addLoopBegin('m5stack_device_update', 'M5.update();');
  }
  generator.addSetupBegin('m5station_usb_power_pin', 'pinMode(12, OUTPUT);');
}

function m5stationPortMask(port) {
  const masks = {
    A: 'm5::ext_port_mask_t::ext_PA',
    B1: 'm5::ext_port_mask_t::ext_PB1',
    B2: 'm5::ext_port_mask_t::ext_PB2',
    C1: 'm5::ext_port_mask_t::ext_PC1',
    C2: 'm5::ext_port_mask_t::ext_PC2'
  };
  return masks[port] || masks.A;
}

Arduino.forBlock['m5station_port_power'] = function(block, generator) {
  ensureM5Station(generator);
  const port = block.getFieldValue('PORT') || 'A';
  const enabled = block.getFieldValue('ENABLED') === 'FALSE' ? 'false' : 'true';
  if (port === 'USB') return 'digitalWrite(12, ' + (enabled === 'true' ? 'HIGH' : 'LOW') + ');\n';
  return 'M5.Power.setExtOutput(' + enabled + ', ' + m5stationPortMask(port) + ');\n';
};

Arduino.forBlock['m5station_all_ports_power'] = function(block, generator) {
  ensureM5Station(generator);
  const enabled = block.getFieldValue('ENABLED') === 'FALSE' ? 'false' : 'true';
  return 'M5.Power.setExtOutput(' + enabled + ', (m5::ext_port_mask_t)0x1F);\ndigitalWrite(12, ' + (enabled === 'true' ? 'HIGH' : 'LOW') + ');\n';
};

Arduino.forBlock['m5station_port_measure'] = function(block, generator) {
  ensureM5Station(generator);
  const channels = {
    A1: [0, 0], A2: [0, 1], B1: [0, 2],
    B2: [1, 0], C1: [1, 1], C2: [1, 2]
  };
  const channel = channels[block.getFieldValue('PORT')] || channels.A1;
  const object = 'M5.Power.Ina3221[' + channel[0] + ']';
  if (block.getFieldValue('MEASURE') === 'CURRENT') {
    return ['(' + object + '.getCurrent(' + channel[1] + ') * 1000.0f)', generator.ORDER_ATOMIC];
  }
  return [object + '.getBusVoltage(' + channel[1] + ')', generator.ORDER_ATOMIC];
};
