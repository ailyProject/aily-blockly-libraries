'use strict';

function ensureM5CoreS3(generator) {
  if (typeof ensureM5StackDevice === 'function') {
    ensureM5StackDevice(generator);
  } else {
    generator.addLibrary('m5stack_unified', '#include <M5Unified.h>');
    generator.addSetupBegin('m5stack_device_begin', 'auto ailyM5Config = M5.config();\nM5.begin(ailyM5Config);');
    generator.addLoopBegin('m5stack_device_update', 'M5.update();');
  }
  generator.addLibrary('m5stack_cores3_official', '#include <M5CoreS3.h>');
}

function ensureM5CoreS3LTR(generator) {
  ensureM5CoreS3(generator);
  generator.addVariable('aily_m5cores3_ltr_ready', 'bool ailyM5CoreS3LTRReady = false;');
  generator.addFunction('aily_m5cores3_ltr_begin',
    'bool ailyM5CoreS3LTRBegin() {\n' +
    '  Ltr5xx_Init_Basic_Para config = LTR5XX_BASE_PARA_CONFIG_DEFAULT;\n' +
    '  if (!CoreS3.Ltr553.begin(&config)) return false;\n' +
    '  return CoreS3.Ltr553.setPsMode(LTR5XX_PS_ACTIVE_MODE) && CoreS3.Ltr553.setAlsMode(LTR5XX_ALS_ACTIVE_MODE);\n' +
    '}\n');
  generator.addSetupEnd('m5cores3_ltr_begin', 'ailyM5CoreS3LTRReady = ailyM5CoreS3LTRBegin();');
}

function ensureM5CoreS3Camera(generator) {
  ensureM5CoreS3(generator);
  generator.addVariable('aily_m5cores3_camera_ready', 'bool ailyM5CoreS3CameraReady = false;');
  generator.addSetupEnd('m5cores3_camera_begin', 'ailyM5CoreS3CameraReady = CoreS3.Camera.begin();');
}

Arduino.forBlock['m5cores3_ltr_init'] = function(block, generator) {
  ensureM5CoreS3LTR(generator);
  return '';
};

Arduino.forBlock['m5cores3_ltr_available'] = function(block, generator) {
  ensureM5CoreS3LTR(generator);
  return ['ailyM5CoreS3LTRReady', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5cores3_ltr_value'] = function(block, generator) {
  ensureM5CoreS3LTR(generator);
  const method = block.getFieldValue('VALUE') === 'AMBIENT' ? 'getAlsValue' : 'getPsValue';
  return ['(ailyM5CoreS3LTRReady ? CoreS3.Ltr553.' + method + '() : 0)', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5cores3_camera_init'] = function(block, generator) {
  ensureM5CoreS3Camera(generator);
  return '';
};

Arduino.forBlock['m5cores3_camera_available'] = function(block, generator) {
  ensureM5CoreS3Camera(generator);
  return ['ailyM5CoreS3CameraReady', generator.ORDER_ATOMIC];
};

Arduino.forBlock['m5cores3_camera_capture_display'] = function(block, generator) {
  ensureM5CoreS3Camera(generator);
  generator.addFunction('aily_m5cores3_camera_capture_display',
    'bool ailyM5CoreS3CameraCaptureDisplay() {\n' +
    '  if (!ailyM5CoreS3CameraReady || !CoreS3.Camera.get() || !CoreS3.Camera.fb) return false;\n' +
    '  camera_fb_t* frame = CoreS3.Camera.fb;\n' +
    '  M5.Display.pushImage(0, 0, frame->width, frame->height, (uint16_t*)frame->buf);\n' +
    '  CoreS3.Camera.free(); return true;\n' +
    '}\n');
  return ['ailyM5CoreS3CameraCaptureDisplay()', generator.ORDER_ATOMIC];
};
