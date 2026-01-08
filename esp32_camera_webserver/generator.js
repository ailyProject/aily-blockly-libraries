// 全局变量用于存储自定义引脚配置
var customPinConfig = null;

Arduino.forBlock['esp32_camera_custom_pins'] = function (block, generator) {
  const dataPins = generator.valueToCode(block, 'DATA_PINS', generator.ORDER_ATOMIC) || '"11,12,13,14,15,16,17,18"';
  const xclk = generator.valueToCode(block, 'XCLK', generator.ORDER_ATOMIC) || '10';
  const pclk = generator.valueToCode(block, 'PCLK', generator.ORDER_ATOMIC) || '9';
  const vsync = generator.valueToCode(block, 'VSYNC', generator.ORDER_ATOMIC) || '8';
  const href = generator.valueToCode(block, 'HREF', generator.ORDER_ATOMIC) || '7';
  const sda = generator.valueToCode(block, 'SDA', generator.ORDER_ATOMIC) || '5';
  const scl = generator.valueToCode(block, 'SCL', generator.ORDER_ATOMIC) || '4';
  const pwdn = generator.valueToCode(block, 'PWDN', generator.ORDER_ATOMIC) || '-1';
  const reset = generator.valueToCode(block, 'RESET', generator.ORDER_ATOMIC) || '-1';

  // 解析数据引脚字符串
  const dataPinsCode = `
  String dataPinsStr = ${dataPins};
  int dataPins[8];
  int pinIndex = 0;
  int startPos = 0;
  for(int i = 0; i <= dataPinsStr.length(); i++){
    if(i == dataPinsStr.length() || dataPinsStr[i] == ','){
      dataPins[pinIndex++] = dataPinsStr.substring(startPos, i).toInt();
      startPos = i + 1;
    }
  }
  `;

  // 保存自定义配置
  customPinConfig = {
    dataPinsCode: dataPinsCode,
    xclk: xclk,
    pclk: pclk,
    vsync: vsync,
    href: href,
    sda: sda,
    scl: scl,
    pwdn: pwdn,
    reset: reset
  };

  return dataPinsCode;
};

Arduino.forBlock['esp32_camera_webserver_init'] = function (block, generator) {
  const model = block.getFieldValue('MODEL');
  const resolution = block.getFieldValue('RESOLUTION');

  generator.addLibrary('esp_camera', '#include <esp_camera.h>');
  generator.addLibrary('WiFi', '#include <WiFi.h>');

  let pinConfig = '';

  // 如果选择自定义引脚
  if (model === 'CUSTOM') {
    if (!customPinConfig) {
      pinConfig = `
  // 请先添加"自定义摄像头引脚配置"块
  #error "请在此块之前添加'自定义摄像头引脚配置'块"
      `;
    } else {
      pinConfig = `
  config.pin_d0 = dataPins[0];
  config.pin_d1 = dataPins[1];
  config.pin_d2 = dataPins[2];
  config.pin_d3 = dataPins[3];
  config.pin_d4 = dataPins[4];
  config.pin_d5 = dataPins[5];
  config.pin_d6 = dataPins[6];
  config.pin_d7 = dataPins[7];
  config.pin_xclk = ${customPinConfig.xclk};
  config.pin_pclk = ${customPinConfig.pclk};
  config.pin_vsync = ${customPinConfig.vsync};
  config.pin_href = ${customPinConfig.href};
  config.pin_sccb_sda = ${customPinConfig.sda};
  config.pin_sccb_scl = ${customPinConfig.scl};
  config.pin_pwdn = ${customPinConfig.pwdn};
  config.pin_reset = ${customPinConfig.reset};
      `;
    }
    generator.addLibrary('app_httpd', '#include "app_httpd.h"');
  } else {
    // 使用预设型号
    generator.addMacro('CAMERA_MODEL', '#define ' + model);
    generator.addLibrary('camera_pins', '#include "camera_pins.h"');
    generator.addLibrary('app_httpd', '#include "app_httpd.h"');

    pinConfig = `
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
    `;
  }

  // 如果是FireBeetle 2 ESP32S3,需要初始化AXP313A电源管理芯片
  if (model === 'CAMERA_MODEL_DFRobot_FireBeetle2_ESP32S3') {
    generator.addLibrary('DFRobot_AXP313A', '#include "DFRobot_AXP313A.h"');
    generator.addObject('axp_object', 'DFRobot_AXP313A axp;');
    generator.addSetupBegin('axp_init', `  while(axp.begin() != 0){
    Serial.println("AXP313A init error");
    delay(1000);
  }
  axp.enableCameraPower(axp.eOV2640);`);
  }

  // 生成setup代码
  const setupCode = `
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
${pinConfig}
  config.xclk_freq_hz = 20000000;
  config.frame_size = ${resolution};
  config.pixel_format = PIXFORMAT_JPEG;
  config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.jpeg_quality = 12;
  config.fb_count = 1;

  if(config.pixel_format == PIXFORMAT_JPEG){
    if(psramFound()){
      config.jpeg_quality = 10;
      config.fb_count = 2;
      config.grab_mode = CAMERA_GRAB_LATEST;
    } else {
      config.frame_size = FRAMESIZE_SVGA;
      config.fb_location = CAMERA_FB_IN_DRAM;
    }
  } else {
    config.frame_size = FRAMESIZE_240X240;
#if CONFIG_IDF_TARGET_ESP32S3
    config.fb_count = 2;
#endif
  }

#if defined(CAMERA_MODEL_ESP_EYE)
  pinMode(13, INPUT_PULLUP);
  pinMode(14, INPUT_PULLUP);
#endif

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }

  sensor_t * s = esp_camera_sensor_get();
  // 检查用户是否设置了翻转参数，如果没有则应用默认值
  // 注意：我们通过检查sensor的默认值来判断用户是否进行了设置
  if (s->id.PID == OV3660_PID) {
    // 仅在用户未设置时应用默认值
    if(s->status.vflip == 0 && s->status.hmirror == 0) {
      s->set_vflip(s, 1);
    }
    s->set_brightness(s, 1);
    s->set_saturation(s, -2);
  }
  // 使用用户在初始化块中设置的分辨率，不再强制修改为QVGA

#if defined(CAMERA_MODEL_M5STACK_WIDE) || defined(CAMERA_MODEL_M5STACK_ESP32CAM)
  // 仅在用户未设置时应用默认值
  if(s->status.vflip == 0) {
    s->set_vflip(s, 1);
  }
  if(s->status.hmirror == 0) {
    s->set_hmirror(s, 1);
  }
#endif

#if defined(CAMERA_MODEL_ESP32S3_EYE)
  // 仅在用户未设置时应用默认值
  if(s->status.vflip == 0) {
    s->set_vflip(s, 1);
  }
#endif

  int ledPin = -1;
#if defined(LED_GPIO_NUM)
  ledPin = LED_GPIO_NUM;
#endif
  startCameraServer(ledPin);
  
  Serial.println("Camera initialized successfully");
  Serial.print("Camera Ready! Use 'http://");
  Serial.print(WiFi.localIP());
  Serial.println("' to connect");
`;

  // 重置自定义配置
  customPinConfig = null;

  return setupCode;
};

// 设置块：这些块应该放在初始化块之后使用，直接获取sensor并调用API
// 注意：不声明新的sensor变量，直接使用已存在的
Arduino.forBlock['esp32_camera_set_quality'] = function (block, generator) {
  const quality = block.getFieldValue('QUALITY');
  return `  {
    sensor_t * s = esp_camera_sensor_get();
    s->set_quality(s, ${quality});
  }
`;
};

Arduino.forBlock['esp32_camera_set_flip'] = function (block, generator) {
  const vflip = block.getFieldValue('VFLIP') === 'TRUE' ? '1' : '0';
  const hmirror = block.getFieldValue('HMIRROR') === 'TRUE' ? '1' : '0';
  return `  {
    sensor_t * s = esp_camera_sensor_get();
    s->set_vflip(s, ${vflip});
    s->set_hmirror(s, ${hmirror});
  }
`;
};

Arduino.forBlock['esp32_camera_set_brightness'] = function (block, generator) {
  const brightness = block.getFieldValue('BRIGHTNESS');
  const contrast = block.getFieldValue('CONTRAST');
  const saturation = block.getFieldValue('SATURATION');
  return `  {
    sensor_t * s = esp_camera_sensor_get();
    s->set_brightness(s, ${brightness});
    s->set_contrast(s, ${contrast});
    s->set_saturation(s, ${saturation});
  }
`;
};

// 摄像头捕获和数据访问块
// 注意：返回指针转换为unsigned long，这样可以存储在Blockly的整数变量中
// ⚠️ 重要：使用完帧后必须调用esp32_camera_release块释放内存
// 注意：esp32_camera_send_serial块会自动释放帧内存
Arduino.forBlock['esp32_camera_capture'] = function (block, generator) {
  return ['((unsigned long)esp_camera_fb_get())', generator.ORDER_ATOMIC];
};

Arduino.forBlock['esp32_camera_frame_buffer'] = function (block, generator) {
  const frame = generator.valueToCode(block, 'FRAME', generator.ORDER_ATOMIC) || '0';
  return [`(${frame} ? ((camera_fb_t*)${frame})->buf : NULL)`, generator.ORDER_CONDITIONAL];
};

Arduino.forBlock['esp32_camera_frame_len'] = function (block, generator) {
  const frame = generator.valueToCode(block, 'FRAME', generator.ORDER_ATOMIC) || '0';
  return [`(${frame} ? ((camera_fb_t*)${frame})->len : 0)`, generator.ORDER_CONDITIONAL];
};

Arduino.forBlock['esp32_camera_frame_width'] = function (block, generator) {
  const frame = generator.valueToCode(block, 'FRAME', generator.ORDER_ATOMIC) || '0';
  return [`(${frame} ? ((camera_fb_t*)${frame})->width : 0)`, generator.ORDER_CONDITIONAL];
};

Arduino.forBlock['esp32_camera_frame_height'] = function (block, generator) {
  const frame = generator.valueToCode(block, 'FRAME', generator.ORDER_ATOMIC) || '0';
  return [`(${frame} ? ((camera_fb_t*)${frame})->height : 0)`, generator.ORDER_CONDITIONAL];
};

Arduino.forBlock['esp32_camera_release'] = function (block, generator) {
  const frame = generator.valueToCode(block, 'FRAME', generator.ORDER_ATOMIC) || '0';
  return `  if(${frame}) {
    camera_fb_t* _fb = (camera_fb_t*)${frame};
    // 额外的安全检查
    if(_fb->buf && _fb->len > 0) {
      esp_camera_fb_return(_fb);
    }
  }
`;
};

Arduino.forBlock['esp32_camera_send_serial'] = function (block, generator) {
  const frame = generator.valueToCode(block, 'FRAME', generator.ORDER_ATOMIC) || '0';
  return `  camera_fb_t* _fb = (camera_fb_t*)${frame};
  if(_fb) {
    if(_fb->buf && _fb->len > 0) {
      // 发送帧开始标识
      Serial.println("===FRAME_START===");
      // 发送帧长度信息
      Serial.print("LEN:");
      Serial.println(_fb->len);
      // 发送JPEG数据
      Serial.write(_fb->buf, _fb->len);
      // 发送帧结束标识
      Serial.println("===FRAME_END===");
      Serial.flush();
    }
    // 自动释放帧内存
    esp_camera_fb_return(_fb);
  }
`;

};

// 添加拍摄照片并转换为Base64的功能块实现
Arduino.forBlock['esp32_camera_capture_and_encode_base64'] = function (block, generator) {
  // 使用ESP32自带的mbedTLS库进行Base64编码
  generator.addLibrary('mbedtls_base64', '#include <mbedtls/base64.h>');

  // 添加获取并编码图片的函数
  generator.addFunction('capture_and_encode_base64', `
String capture_and_encode_base64() {
  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb) {
    return String("");
  }

  // 计算Base64编码后的长度
  size_t out_len = 0;
  mbedtls_base64_encode(NULL, 0, &out_len, fb->buf, fb->len);

  // 分配内存并编码
  char* base64_buf = (char*)malloc(out_len + 1);
  if (base64_buf) {
    mbedtls_base64_encode((unsigned char*)base64_buf, out_len, &out_len, fb->buf, fb->len);
    base64_buf[out_len] = '\\0';
    String result = String(base64_buf);
    free(base64_buf);
    esp_camera_fb_return(fb);
    return result;
  }

  esp_camera_fb_return(fb);
  return String("");
}`);

  // 返回函数调用
  return ['capture_and_encode_base64()', generator.ORDER_ATOMIC];
};
