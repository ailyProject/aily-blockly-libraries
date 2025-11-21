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
  const ssid = generator.valueToCode(block, 'SSID', generator.ORDER_ATOMIC) || '""';
  const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
  const model = block.getFieldValue('MODEL');
  const resolution = block.getFieldValue('RESOLUTION');

  // 添加必要的库引用
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
  if (s->id.PID == OV3660_PID) {
    s->set_vflip(s, 1);
    s->set_brightness(s, 1);
    s->set_saturation(s, -2);
  }
  if(config.pixel_format == PIXFORMAT_JPEG){
    s->set_framesize(s, FRAMESIZE_QVGA);
  }

#if defined(CAMERA_MODEL_M5STACK_WIDE) || defined(CAMERA_MODEL_M5STACK_ESP32CAM)
  s->set_vflip(s, 1);
  s->set_hmirror(s, 1);
#endif

#if defined(CAMERA_MODEL_ESP32S3_EYE)
  s->set_vflip(s, 1);
#endif

  WiFi.begin(${ssid}, ${password});
  WiFi.setSleep(false);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  
  int ledPin = -1;
#if defined(LED_GPIO_NUM)
  ledPin = LED_GPIO_NUM;
#endif
  startCameraServer(ledPin);
  
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
