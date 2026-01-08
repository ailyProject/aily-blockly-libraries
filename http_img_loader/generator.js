'use strict';

// 错误代码缓存（用于getLastError）
// let httpImgLastError = 0;

if (!Arduino.imgLoader) {
  Arduino.imgLoader = true;
  Arduino.imgLoaderInited = false;
}

// 监听块删除事件（将监听器绑定到工作区实例，避免重载/热替换时重复添加）
if (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace) {
  // 延迟添加监听器,确保工作区已初始化
  setTimeout(() => {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) return;

    if (!workspace._httpImgDeleteListenerAdded) return;

    const deleteListener = function(event) {
      if (event.type === Blockly.Events.BLOCK_DELETE) {
        if (event.oldJson && event.oldJson.type == 'lvgl_http_img_init') {
          if (Arduino.imgLoaderInited) {
            window['projectService'].removeMaro('LV_USE_TJPGD')
              .then(() => {
                return window['projectService'].removeMaro('LV_USE_FS_ARDUINO_ESP_LITTLEFS');
              })
              .then(() => {
                return window['projectService'].removeMaro('LV_FS_ARDUINO_ESP_LITTLEFS_LETTER');
              })
              .then(() => {
                return window['projectService'].removeMaro('LV_USE_STDLIB_MALLOC');
              })
              .catch((err) => {
                console.error('Error removing macros for LVGL HTTP Image Loader:', err);
              });
            Arduino.imgLoaderInited = false;
          }
        }
      }
    };

    workspace.addChangeListener(deleteListener);
    workspace._httpImgDeleteListenerAdded = true;
    workspace._httpImgDeleteListener = deleteListener;

    if (typeof workspace.dispose === 'function') {
      const _origDispose = workspace.dispose.bind(workspace);
      workspace.dispose = function() {
        try {
          if (workspace._httpImgDeleteListener) {
            workspace.removeChangeListener(workspace._httpImgDeleteListener);
            workspace._httpImgDeleteListener = null;
          }
        } catch (e) {
          // console.error('Error during disposal of HTTP Image Loader listener:', e);
        }
        workspace._httpImgDeleteListenerAdded = false;
        _origDispose();
      };
    }
  }, 100);
}

// 存储模式转换
function getStorageModeString(mode) {
  switch (mode) {
    case 'LITTLEFS': return 'STORAGE_MODE_LITTLEFS';
    case 'PSRAM': return 'STORAGE_MODE_PSRAM';
    case 'AUTO':
    default:
      return 'STORAGE_MODE_AUTO';
  }
}

// PSRAM模式转换
function getPsramModeString(mode) {
  switch (mode) {
    case 'AVAILABLE': return 'PSRAM_MODE_AVAILABLE';
    case 'NONE': return 'PSRAM_MODE_NONE';
    case 'AUTO':
    default:
      return 'PSRAM_MODE_AUTO';
  }
}

// 确保必要的库引用
function ensureHttpImgLibraries(generator) {
  // WiFi库
  // generator.addLibrary('WiFi', '#include <WiFi.h>');
  
  // // HTTPClient库
  // generator.addLibrary('HTTPClient', '#include <HTTPClient.h>');
  
  // // LittleFS库
  // generator.addLibrary('LittleFS', '#include <LittleFS.h>');
  
  // // LVGL库
  // generator.addLibrary('LVGL', '#include <lvgl.h>');
  
  // FreeRTOS（FreeRTOS相关头文件已经在Arduino框架中包含）
  
  // ESP heap caps
  // generator.addLibrary('ESP_heap_caps', '#include <esp_heap_caps.h>');
  
  // HTTP图片加载器库
  generator.addLibrary('LVGL_HTTP_Image_Loader', '#include <lvgl_http_image_loader.h>');
}

// 初始化块
Arduino.forBlock['lvgl_http_img_init'] = function(block, generator) {
  // 获取参数
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '240';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '240';
  const psramMode = getPsramModeString(block.getFieldValue('PSRAM_MODE'));
  const storageMode = getStorageModeString(block.getFieldValue('STORAGE_MODE'));
  const maxSize = generator.valueToCode(block, 'MAX_SIZE', generator.ORDER_ATOMIC) || '512';
  const timeout = generator.valueToCode(block, 'TIMEOUT', generator.ORDER_ATOMIC) || '15000';
  const debug = block.getFieldValue('DEBUG') === 'TRUE' ? 'true' : 'false';

  if (debug === 'true') {
    ensureSerialBegin('Serial', generator);
  }
  // 确保库引用
  ensureHttpImgLibraries(generator);

  // 设置宏
  if (!Arduino.imgLoaderInited) {
    // 构建 Promise 链
    let promise = Promise.resolve();

    promise = promise.then(() => window['projectService'].addMacro('LV_USE_TJPGD=1'));
    promise = promise.then(() => window['projectService'].addMacro('LV_USE_FS_ARDUINO_ESP_LITTLEFS=1'));
    promise = promise.then(() => window['projectService'].addMacro("LV_FS_ARDUINO_ESP_LITTLEFS_LETTER='L'"));
    promise = promise.then(() => window['projectService'].addMacro('LV_USE_STDLIB_MALLOC=LV_STDLIB_CLIB'));

    promise.catch((err) => {
      console.error('Error adding macros for LVGL HTTP Image Loader:', err);
    });

    Arduino.imgLoaderInited = true;
  }

  // 生成初始化代码
  let code = 'HttpImageConfig httpImgConfig;\n';
  code += `httpImgConfig.screenWidth = ${width};\n`;
  code += `httpImgConfig.screenHeight = ${height};\n`;
  code += `httpImgConfig.psramMode = ${psramMode};\n`;
  code += `httpImgConfig.storageMode = ${storageMode};\n`;
  code += `httpImgConfig.maxFileSizePsram = ${maxSize} * 1024;\n`;
  code += `httpImgConfig.maxFileSizeNoPsram = 50 * 1024;\n`;
  code += `httpImgConfig.timeoutMs = ${timeout};\n`;
  code += `httpImgConfig.chunkSize = 4096;\n`;
  code += `httpImgConfig.decodeImmediately = true;\n`;
  code += `httpImgConfig.debug = ${debug};\n`;
  code += `httpImageLoader().init(httpImgConfig);\n`;

  return code;
};

// 加载图片块
Arduino.forBlock['lvgl_http_img_load'] = function(block, generator) {
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'img';

  // 确保库引用
  ensureHttpImgLibraries(generator);

  // 生成加载代码
  const code = `http_img_err_t httpImgLastError = httpImageLoader().load(${url}, ${varName});\n`;
  
  return code;
};

// 获取图片信息块
Arduino.forBlock['lvgl_http_img_get_info'] = function(block, generator) {
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';

  // 确保库引用
  ensureHttpImgLibraries(generator);

  // 生成代码（获取文件大小）
  const code = `httpImageLoader().getInfo(${url}, NULL) == HTTP_IMG_OK ? 0 : -1`;

  return [code, generator.ORDER_ATOMIC];
};

// 检查图片是否可加载块
Arduino.forBlock['lvgl_http_img_check'] = function(block, generator) {
  const url = generator.valueToCode(block, 'URL', generator.ORDER_ATOMIC) || '""';

  // 确保库引用
  ensureHttpImgLibraries(generator);

  // 生成代码（检查是否可加载）
  const code = `httpImageLoader().checkLoadable(${url}) == HTTP_IMG_OK`;

  return [code, generator.ORDER_ATOMIC];
};

// 检测是否有PSRAM块
Arduino.forBlock['lvgl_http_img_has_psram'] = function(block, generator) {
  // 确保库引用
  ensureHttpImgLibraries(generator);

  // 生成代码
  const code = 'httpImageLoader().hasPsram()';

  return [code, generator.ORDER_ATOMIC];
};

// 获取最大允许图片大小块
Arduino.forBlock['lvgl_http_img_get_max_size'] = function(block, generator) {
  // 确保库引用
  ensureHttpImgLibraries(generator);

  // 生成代码
  const code = 'httpImageLoader().getMaxSize()';

  return [code, generator.ORDER_ATOMIC];
};

// 获取最后错误代码块
Arduino.forBlock['lvgl_http_img_get_last_error'] = function(block, generator) {
  // 确保库引用
  ensureHttpImgLibraries(generator);

  // 生成代码
  const code = 'httpImgLastError';

  return [code, generator.ORDER_ATOMIC];
};

// 错误代码转字符串块
Arduino.forBlock['lvgl_http_img_err_to_string'] = function(block, generator) {
  const errCode = generator.valueToCode(block, 'ERR_CODE', generator.ORDER_ATOMIC) || '0';

  // 确保库引用
  ensureHttpImgLibraries(generator);

  // 生成代码
  const code = `httpImageLoader().errToStr((http_img_err_t)${errCode})`;

  return [code, generator.ORDER_ATOMIC];
};

// 清理块
Arduino.forBlock['lvgl_http_img_cleanup'] = function(block, generator) {
  // 确保库引用
  ensureHttpImgLibraries(generator);

  // 生成代码
  const code = 'httpImageLoader().cleanup();\n';

  return code;
};
