function ensureK10(generator) {
  generator.addLibrary('SPIFFS', '#include <SPIFFS.h>');
  generator.addLibrary('unihiker_k10', '#include <unihiker_k10.h>');
  generator.addVariable('k10', 'UNIHIKER_K10 k10;');
  generator.addSetupBegin('k10_begin', 'k10.begin();');
}

function ensureAI(generator) {
  ensureK10(generator);
  generator.addLibrary('AIRecognition', '#include "AIRecognition.h"');
  generator.addVariable('ai', 'AIRecognition ai;');
}

function ensureScreenAndCamera(generator) {
  ensureK10(generator);
  generator.addVariable('k10_screen_dir', 'uint8_t screen_dir = 2;');
  generator.addSetupBegin('k10_initScreen', 'k10.initScreen(screen_dir);');
}

// ========== 初始化摄像头 ==========
Arduino.forBlock['k10_camera_init'] = function(block, generator) {
  ensureScreenAndCamera(generator);
  generator.addSetupBegin('k10_initBgCamera', 'k10.initBgCamerImage();');
  generator.addSetupBegin('k10_setBgCamera_off', 'k10.setBgCamerImage(false);');
  generator.addSetupBegin('k10_creatCanvas_cam', 'k10.creatCanvas();');
  generator.addSetupEnd('k10_setBgCamera_on', 'k10.setBgCamerImage(true);');
  return '';
};

// ========== 显示摄像头画面 ==========
Arduino.forBlock['k10_camera_show'] = function(block, generator) {
  ensureK10(generator);
  return 'k10.setBgCamerImage(true);\n';
};

// ========== 拍照保存 ==========
Arduino.forBlock['k10_photo_save'] = function(block, generator) {
  var path = generator.valueToCode(block, 'FILENAME', generator.ORDER_ATOMIC) || '"S:/photo.bmp"';
  ensureK10(generator);
  generator.addSetupBegin('k10_initSDFile', 'k10.initSDFile();');
  return 'k10.photoSaveToTFCard(' + path + ');\n';
};

// ========== 初始化AI ==========
Arduino.forBlock['k10_ai_init'] = function(block, generator) {
  var mode = block.getFieldValue('MODE');
  ensureAI(generator);
  ensureScreenAndCamera(generator);
  generator.addSetupBegin('ai_initAi', 'ai.initAi();');
  generator.addSetupBegin('k10_initBgCamera', 'k10.initBgCamerImage();');
  generator.addSetupBegin('k10_setBgCamera_off', 'k10.setBgCamerImage(false);');
  generator.addSetupBegin('k10_creatCanvas_cam', 'k10.creatCanvas();');
  generator.addSetupEnd('ai_switchNoMode', 'ai.switchAiMode(AIRecognition::NoMode);');
  generator.addSetupEnd('k10_setBgCamera_on', 'k10.setBgCamerImage(true);');
  generator.addSetupEnd('ai_switchMode', 'ai.switchAiMode(AIRecognition::' + mode + ');');
  return '';
};

// ========== 切换AI模式 ==========
Arduino.forBlock['k10_ai_switch_mode'] = function(block, generator) {
  var mode = block.getFieldValue('MODE');
  ensureAI(generator);
  return 'ai.switchAiMode(AIRecognition::' + mode + ');\n';
};

// ========== 检测到内容 ==========
Arduino.forBlock['k10_ai_is_detected'] = function(block, generator) {
  var type = block.getFieldValue('TYPE');
  ensureAI(generator);
  return ['ai.isDetectContent(AIRecognition::' + type + ')', generator.ORDER_ATOMIC];
};

// ========== 获取人脸数据 ==========
Arduino.forBlock['k10_ai_get_face_data'] = function(block, generator) {
  var param = block.getFieldValue('DATA');
  ensureAI(generator);
  return ['ai.getFaceData(AIRecognition::' + param + ')', generator.ORDER_ATOMIC];
};

// ========== 获取猫狗脸数据 ==========
Arduino.forBlock['k10_ai_get_cat_data'] = function(block, generator) {
  var param = block.getFieldValue('DATA');
  ensureAI(generator);
  return ['ai.getCatData(AIRecognition::' + param + ')', generator.ORDER_ATOMIC];
};

// ========== 获取二维码内容 ==========
Arduino.forBlock['k10_ai_get_qrcode'] = function(block, generator) {
  ensureAI(generator);
  return ['ai.getQrCodeContent()', generator.ORDER_ATOMIC];
};

// ========== 设置运动检测阈值 ==========
Arduino.forBlock['k10_ai_set_motion_threshold'] = function(block, generator) {
  var threshold = generator.valueToCode(block, 'THRESHOLD', generator.ORDER_ATOMIC) || '100';
  ensureAI(generator);
  return 'ai.setMotinoThreshold(' + threshold + ');\n';
};

// ========== 识别到已知人脸 ==========
Arduino.forBlock['k10_ai_face_recognized'] = function(block, generator) {
  ensureAI(generator);
  return ['ai.isRecognized()', generator.ORDER_ATOMIC];
};

// ========== 获取人脸ID ==========
Arduino.forBlock['k10_ai_get_face_id'] = function(block, generator) {
  ensureAI(generator);
  return ['ai.getRecognitionID()', generator.ORDER_ATOMIC];
};

// ========== 人脸录入/识别命令 ==========
Arduino.forBlock['k10_ai_face_cmd'] = function(block, generator) {
  var cmd = block.getFieldValue('CMD');
  var id = generator.valueToCode(block, 'ID', generator.ORDER_ATOMIC) || '0';
  ensureAI(generator);
  return 'ai.sendFaceCmd(' + cmd + ', ' + id + ');\n';
};
