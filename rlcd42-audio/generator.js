// @aily-project/lib-rlcd42-audio

Arduino.forBlock["rlcd42_audio_init"] = function (block, generator) {
  generator.addLibrary('rlcd42_audio', '#include "Es7210Mic.h"');
  const gain = block.getFieldValue('GAIN');
  return 'es7210MicBegin(' + gain + ');\n';
};

Arduino.forBlock["rlcd42_audio_mute"] = function (block, generator) {
  generator.addLibrary('rlcd42_audio', '#include "Es7210Mic.h"');
  const muted = block.getFieldValue('MUTE') === 'MUTE';
  return 'es7210MicSetMute(' + (muted ? 'true' : 'false') + ');\n';
};
