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

function ensureCameraRuntime(generator) {
  ensureScreenAndCamera(generator);
  generator.addSetupBegin('k10_initBgCamera', 'k10.initBgCamerImage();');
  generator.addSetupBegin('k10_setBgCamera_off', 'k10.setBgCamerImage(false);');
  generator.addSetupBegin('k10_creatCanvas_cam', 'k10.creatCanvas();');
}

function ensureCameraBase64(generator) {
  ensureCameraRuntime(generator);
  generator.addLibrary('k10_esp_camera', '#include <esp_camera.h>');
  generator.addLibrary('k10_img_converters', '#include <img_converters.h>');
  generator.addLibrary('k10_mbedtls_base64', '#include <mbedtls/base64.h>');
  generator.addLibrary('k10_heap_caps', '#include <esp_heap_caps.h>');
  generator.addLibrary('k10_freertos', '#include <freertos/FreeRTOS.h>');
  generator.addLibrary('k10_freertos_queue', '#include <freertos/queue.h>');
  generator.addVariable('k10_camera_queue_extern', 'extern QueueHandle_t xQueueCamer;');
  generator.addVariable('k10_camera_play_state_extern', 'extern uint8_t camPlayState;');
  generator.addFunction('k10_camera_photo_base64', String.raw`
String k10CameraPhotoBase64() {
  Serial.println("[K10-CAM] capture base64 begin");
  if (xQueueCamer == NULL) {
    Serial.println("[K10-CAM] camera queue not ready");
    return "";
  }

  bool wasPreviewing = (camPlayState == 1);
  k10.setBgCamerImage(false);
  delay(120);

  camera_fb_t *staleFrame = NULL;
  uint8_t droppedFrames = 0;
  while (xQueueReceive(xQueueCamer, &staleFrame, 0) == pdTRUE) {
    if (staleFrame != NULL) {
      esp_camera_fb_return(staleFrame);
      staleFrame = NULL;
    }
    droppedFrames++;
    if (droppedFrames >= 4) {
      break;
    }
  }
  if (droppedFrames > 0) {
    Serial.println("[K10-CAM] dropped stale frames: " + String(droppedFrames));
  }

  camera_fb_t *frame = NULL;
  for (uint8_t i = 0; i < 5 && frame == NULL; i++) {
    if (xQueueReceive(xQueueCamer, &frame, pdMS_TO_TICKS(1000)) == pdTRUE && frame != NULL) {
      break;
    }
    delay(50);
  }
  if (frame == NULL) {
    Serial.println("[K10-CAM] capture timeout");
    if (wasPreviewing) {
      k10.setBgCamerImage(true);
    }
    return "";
  }
  Serial.println("[K10-CAM] frame len: " + String(frame->len));

  uint8_t *jpgBuf = NULL;
  size_t jpgLen = 0;
  const uint8_t *imageBuf = frame->buf;
  size_t imageLen = frame->len;
  bool freeJpg = false;

  if (frame->format != PIXFORMAT_JPEG) {
    if (!frame2jpg(frame, 80, &jpgBuf, &jpgLen) || jpgBuf == NULL || jpgLen == 0) {
      Serial.println("[K10-CAM] jpeg convert failed");
      esp_camera_fb_return(frame);
      if (wasPreviewing) {
        k10.setBgCamerImage(true);
      }
      return "";
    }
    imageBuf = jpgBuf;
    imageLen = jpgLen;
    freeJpg = true;
  }

  size_t encodedLen = ((imageLen + 2) / 3) * 4;
  unsigned char *encoded = NULL;
  if (psramFound()) {
    encoded = (unsigned char *)heap_caps_malloc(encodedLen + 1, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
  }
  if (!encoded) {
    encoded = (unsigned char *)heap_caps_malloc(encodedLen + 1, MALLOC_CAP_8BIT);
  }
  if (!encoded) {
    Serial.println("[K10-CAM] base64 memory failed");
    if (freeJpg) free(jpgBuf);
    esp_camera_fb_return(frame);
    if (wasPreviewing) {
      k10.setBgCamerImage(true);
    }
    return "";
  }

  size_t outLen = 0;
  int ret = mbedtls_base64_encode(encoded, encodedLen + 1, &outLen, imageBuf, imageLen);
  String result = "";
  if (ret == 0) {
    encoded[outLen] = '\0';
    result.reserve(outLen + 1);
    result = (const char *)encoded;
  } else {
    Serial.println("[K10-CAM] base64 encode failed: " + String(ret));
  }

  free(encoded);
  if (freeJpg) free(jpgBuf);
  esp_camera_fb_return(frame);
  delay(50);
  if (wasPreviewing) {
    k10.setBgCamerImage(true);
  }
  Serial.println("[K10-CAM] base64 len: " + String(result.length()));
  return result;
}`);
}

// ========== 初始化摄像头 ==========
Arduino.forBlock['k10_camera_init'] = function(block, generator) {
  ensureCameraRuntime(generator);
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

// ========== Photo to Base64 ==========
Arduino.forBlock['k10_photo_base64'] = function(block, generator) {
  ensureCameraBase64(generator);
  return ['k10CameraPhotoBase64()', generator.ORDER_FUNCTION_CALL];
};

// ========== 初始化AI ==========
Arduino.forBlock['k10_ai_init'] = function(block, generator) {
  var mode = block.getFieldValue('MODE');
  ensureAI(generator);
  ensureCameraRuntime(generator);
  generator.addSetupBegin('ai_initAi', 'ai.initAi();');
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
