// @aily-project/lib-eeg102w

Arduino.forBlock["eeg102w_connect"] = function (block, generator) {
  const t = generator.valueToCode(block, 'TIMEOUT', Arduino.ORDER_ATOMIC) || '10';
  generator.addLibrary('eeg102w', '#include "EEG102W.h"');
  return 'EEG102W.connect(' + t + ');\n';
};

Arduino.forBlock["eeg102w_connected"] = function (block, generator) {
  generator.addLibrary('eeg102w', '#include "EEG102W.h"');
  return ['EEG102W.isConnected()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["eeg102w_metric"] = function (block, generator) {
  const map = { FOCUS: 'focus', RELAX: 'relax', FATIGUE: 'fatigue', MEDITATION: 'meditation' };
  const fn = map[block.getFieldValue('METRIC')] || 'focus';
  generator.addLibrary('eeg102w', '#include "EEG102W.h"');
  return ['EEG102W.' + fn + '()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["eeg102w_raw"] = function (block, generator) {
  const ch = block.getFieldValue('CH') === '2' ? '2' : '1';
  generator.addLibrary('eeg102w', '#include "EEG102W.h"');
  return ['EEG102W.rawValue(' + ch + ')', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["eeg102w_battery"] = function (block, generator) {
  generator.addLibrary('eeg102w', '#include "EEG102W.h"');
  return ['EEG102W.battery()', Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["eeg102w_leadoff"] = function (block, generator) {
  generator.addLibrary('eeg102w', '#include "EEG102W.h"');
  return ['EEG102W.leadOff()', Arduino.ORDER_ATOMIC];
};
