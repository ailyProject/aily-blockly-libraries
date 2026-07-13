// Schedule Manager - Generator
// Global object pattern: uses `Sched` singleton, no variable management needed

Arduino.forBlock['sched_begin'] = function(block, generator) {
  const tftVar = block.getField('TFT');
  const tftName = tftVar ? tftVar.getText() : 'tft';
  generator.addLibrary('ScheduleManager', '#include "schedule_manager.h"');
  return 'Sched.begin(&' + tftName + ');\n';
};

Arduino.forBlock['sched_load'] = function(block, generator) {
  generator.addLibrary('ScheduleManager', '#include "schedule_manager.h"');
  return 'Sched.load();\n';
};

Arduino.forBlock['sched_show'] = function(block, generator) {
  generator.addLibrary('ScheduleManager', '#include "schedule_manager.h"');
  return 'Sched.show();\n';
};

Arduino.forBlock['sched_set_defaults'] = function(block, generator) {
  generator.addLibrary('ScheduleManager', '#include "schedule_manager.h"');
  const days = ['D0','D1','D2','D3','D4','D5','D6'];
  let code = '{\n';
  code += '  String defs[7][8];\n';
  for (let d = 0; d < 7; d++) {
    const raw = block.getFieldValue(days[d]) || '';
    const items = raw.split(',').map(s => s.trim());
    for (let p = 0; p < 8; p++) {
      const val = items[p] || '';
      code += '  defs[' + d + '][' + p + '] = "' + val + '";\n';
    }
  }
  code += '  Sched.setDefaultSchedule(defs);\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['sched_start_server'] = function(block, generator) {
  generator.addLibrary('ScheduleManager', '#include "schedule_manager.h"');
  const port = generator.valueToCode(block, 'PORT', generator.ORDER_ATOMIC) || '8080';
  return 'Sched.startServer(' + port + ');\n';
};

Arduino.forBlock['sched_handle_client'] = function(block, generator) {
  generator.addLibrary('ScheduleManager', '#include "schedule_manager.h"');
  return 'Sched.handleClient();\n';
};

Arduino.forBlock['sched_day_prev'] = function(block, generator) {
  generator.addLibrary('ScheduleManager', '#include "schedule_manager.h"');
  return 'Sched.dayPrev(); Sched.show();\n';
};

Arduino.forBlock['sched_day_next'] = function(block, generator) {
  generator.addLibrary('ScheduleManager', '#include "schedule_manager.h"');
  return 'Sched.dayNext(); Sched.show();\n';
};

Arduino.forBlock['sched_set_weekday'] = function(block, generator) {
  generator.addLibrary('ScheduleManager', '#include "schedule_manager.h"');
  const wd = block.getFieldValue('WD') || '1';
  return 'Sched.setWeekday(' + wd + ');\n';
};

Arduino.forBlock['sched_is_dirty'] = function(block, generator) {
  generator.addLibrary('ScheduleManager', '#include "schedule_manager.h"');
  return ['Sched.isDirty()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sched_clear_dirty'] = function(block, generator) {
  generator.addLibrary('ScheduleManager', '#include "schedule_manager.h"');
  return 'Sched.clearDirty();\n';
};

Arduino.forBlock['sched_get_mode'] = function(block, generator) {
  generator.addLibrary('ScheduleManager', '#include "schedule_manager.h"');
  return ['Sched.getMode()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['sched_set_mode'] = function(block, generator) {
  generator.addLibrary('ScheduleManager', '#include "schedule_manager.h"');
  const mode = block.getFieldValue('MODE') || '0';
  return 'Sched.setMode(' + mode + ');\n';
};
