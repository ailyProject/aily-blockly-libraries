// 'use strict';

// if (typeof registerVariableToBlockly !== 'function') {
//   function registerVariableToBlockly(varName, varType) {
//     // Fallback implementation if core library not available
//   }
// }

// if (typeof renameVariableInBlockly !== 'function') {
//   function renameVariableInBlockly(block, oldName, newName, varType) {
//     // Fallback implementation if core library not available
//   }
// }

// 检测是否为ESP32核心
function isESP32Core() {
  const boardConfig = window['boardConfig'];
  return boardConfig && boardConfig.core && boardConfig.core.indexOf('esp32') > -1;
}

function ensureTftEspiLibraries(generator) {
  generator.addLibrary('TFT_eSPI', '#include <TFT_eSPI.h>');

  if (isESP32Core()) {
    generator.addLibrary('FS', '#include <FS.h>');
    generator.addLibrary('SPIFFS', '#include <SPIFFS.h>');
  }
}

// 清理值中的外层括号（如将"(-1)"转为"-1"）
function cleanValue(value) {
  if (typeof value === 'string') {
    // 去除外层括号：(value) -> value
    return value.replace(/^\((.+)\)$/, '$1');
  }
  return value;
}

if (!Arduino.tft_espi) {
  Arduino.tft_espi = true;
  Arduino.tft_espi_type = '';
  Arduino.tft_espi_frequency = 0;
  Arduino.tft_espi_width = 0;
  Arduino.tft_espi_height = 0;
  Arduino.tft_espi_miso = -1;
  Arduino.tft_espi_mosi = -1;
  Arduino.tft_espi_sclk = -1;
  Arduino.tft_espi_cs = -1;
  Arduino.tft_espi_dc = -1;
  Arduino.tft_espi_rst = -1;
  Arduino.tft_espi_bl = -1;
  Arduino.tft_espi_bl_level = '';
  Arduino.tft_espi_color_mode = 'TFT_RGB';
  Arduino.tft_espi_use_hspi = false;
}

if (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace) {
  setTimeout(() => {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) return;

    if (workspace._tftEspiDeletedListenerAdded) return;

    const deleteListener = function(event) {
      if (event.type === Blockly.Events.BLOCK_DELETE) {
        if (event.oldJson && event.oldJson.type === 'tftespi_setup') {
          window['projectService'].removeMacro(Arduino.tft_espi_type)
            .then(() => {
              console.log('Macro removed:', Arduino.tft_espi_type);
              Arduino.tft_espi_type = '';
              return window['projectService'].removeMacro('TFT_WIDTH');
            })
            .then(() => {
              Arduino.tft_espi_frequency = 0;
              return window['projectService'].removeMacro('TFT_FREQUENCY');
            })
            .then(() => {
              console.log('Macro removed: TFT_WIDTH');
              Arduino.tft_espi_width = 0;
              return window['projectService'].removeMacro('TFT_HEIGHT');
            })
            .then(() => {
              console.log('Macro removed: TFT_HEIGHT');
              Arduino.tft_espi_height = 0;
              return window['projectService'].removeMacro('TFT_MISO');
            })
            .then(() => {
              console.log('Macro removed: TFT_MISO');
              Arduino.tft_espi_miso = -1;
              return window['projectService'].removeMacro('TFT_MOSI');
            })
            .then(() => {
              console.log('Macro removed: TFT_MOSI');
              Arduino.tft_espi_mosi = -1;
              return window['projectService'].removeMacro('TFT_SCLK');
            })
            .then(() => {
              console.log('Macro removed: TFT_SCLK');
              Arduino.tft_espi_sclk = -1;
              return window['projectService'].removeMacro('TFT_CS');
            })
            .then(() => {
              console.log('Macro removed: TFT_CS');
              Arduino.tft_espi_cs = -1;
              return window['projectService'].removeMacro('TFT_DC');
            })
            .then(() => {
              console.log('Macro removed: TFT_DC');
              Arduino.tft_espi_dc = -1;
              return window['projectService'].removeMacro('TFT_RST');
            })
            .then(() => {
              console.log('Macro removed: TFT_RST');
              Arduino.tft_espi_rst = -1;
            })
            .then(() => {
              console.log('Macro removed: TFT_BL');
              Arduino.tft_espi_bl = -1;
              return window['projectService'].removeMacro('TFT_BL');
            })
            .then(() => {
              console.log('Macro removed: TFT_BL_LEVEL');
              Arduino.tft_espi_bl_level = '';
              return window['projectService'].removeMacro('TFT_BACKLIGHT_ON');
            })
            .then(() => {
              if (isESP32Core() && Arduino.tft_espi_use_hspi) {
                Arduino.tft_espi_use_hspi = false;
                return window['projectService'].removeMacro('USE_HSPI_PORT');
              }
            })
            .then(() => {
              console.log('All TFT_eSPI related macros removed.');
            })
            .catch(err => console.error('Error removing macros:', err));
        }
      }
    };

    workspace.addChangeListener(deleteListener);
    workspace._tftEspiDeletedListenerAdded = true;
    workspace._tftEspiDeleteListener = deleteListener;

    if (typeof workspace.dispose === 'function') {
      const _origDispose = workspace.dispose.bind(workspace);
      workspace.dispose = function() {
        try {
          if (workspace._tftEspiDeleteListener) {
            workspace.removeChangeListener(workspace._tftEspiDeleteListener);
            workspace._tftEspiDeleteListener = null;
          }
        } catch (e) {
          // console.error('Error during workspace dispose:', e);
        }
        workspace._tftEspiDeletedListenerAdded = false;
        _origDispose();
      };
    }
  }, 100);
}

Arduino.forBlock['tftespi_setup'] = function(block, generator) {
  if (!block._tftespiVarMonitorAttached) {
    block._tftespiVarMonitorAttached = true;
    block._tftespiVarLastName = block.getFieldValue('VAR') || 'tft';
    // 初次注册变量到 Blockly 系统（仅执行一次）
    registerVariableToBlockly(block._tftespiVarLastName, 'TFT_eSPI');
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._tftespiVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'TFT_eSPI');
          block._tftespiVarLastName = newName;
        }
      };
    }
  }

  const varName = block.getFieldValue('VAR') || 'tft';
  const model = block.getFieldValue('MODEL') || 'ILI9341_DRIVER';
  const frequency = block.getFieldValue('FREQUENCY') || '40000000';
  const width = cleanValue(generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '240');
  const height = cleanValue(generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '320');
  const miso = cleanValue(generator.valueToCode(block, 'MISO', generator.ORDER_ATOMIC) || '-1');
  const mosi = cleanValue(generator.valueToCode(block, 'MOSI', generator.ORDER_ATOMIC) || '-1');
  const sclk = cleanValue(generator.valueToCode(block, 'SCLK', generator.ORDER_ATOMIC) || '-1');
  const cs = cleanValue(generator.valueToCode(block, 'CS', generator.ORDER_ATOMIC) || '-1');
  const dc = cleanValue(generator.valueToCode(block, 'DC', generator.ORDER_ATOMIC) || '-1');
  const rst = cleanValue(generator.valueToCode(block, 'RST', generator.ORDER_ATOMIC) || '-1');
  const bl = cleanValue(generator.valueToCode(block, 'BL', generator.ORDER_ATOMIC) || '-1');
  const blLevel = block.getFieldValue('BL_LEVEL') || 'HIGH';
  const colorMode = block.getFieldValue('COLOR_MODE') || 'TFT_RGB';
  // const rotation = block.getFieldValue('ROTATION') || '0';

  if (Arduino.tft_espi_type !== model ||
      Arduino.tft_espi_frequency != frequency ||
      Arduino.tft_espi_width != width ||
      Arduino.tft_espi_height != height ||
      Arduino.tft_espi_miso != miso ||
      Arduino.tft_espi_mosi != mosi ||
      Arduino.tft_espi_sclk != sclk ||
      Arduino.tft_espi_cs != cs ||
      Arduino.tft_espi_dc != dc ||
      Arduino.tft_espi_rst != rst ||
      Arduino.tft_espi_bl != bl ||
      Arduino.tft_espi_bl_level != blLevel ||
      Arduino.tft_espi_color_mode != colorMode ||
      (isESP32Core() && !Arduino.tft_espi_use_hspi)) {
    
    // 先保存旧的 model 用于删除
    const oldModel = Arduino.tft_espi_type;
    const needRemoveOldModel = oldModel !== '' && oldModel !== model;
    
    // 构建 Promise 链
    let promise = Promise.resolve();
    
    // 如果需要，先删除旧的 model macro
    // if (needRemoveOldModel) {
      console.log('Removing old macro:', oldModel);
      promise = promise.then(() => window['projectService'].removeMacro(oldModel));
    // }
    
    // 更新并添加新的 model
    Arduino.tft_espi_type = model;
    promise = promise.then(() => window['projectService'].addMacro(model));
    
    // 添加其他宏
    // if (Arduino.tft_espi_frequency != frequency) {
      Arduino.tft_espi_frequency = frequency;
      promise = promise.then(() => window['projectService'].addMacro(`TFT_FREQUENCY=${frequency}`));
    // }
    
    // if (Arduino.tft_espi_width != width) {
      Arduino.tft_espi_width = width;
      promise = promise.then(() => window['projectService'].addMacro(`TFT_WIDTH=${width}`));
    // }
    
    // if (Arduino.tft_espi_height != height) {
      Arduino.tft_espi_height = height;
      promise = promise.then(() => window['projectService'].addMacro(`TFT_HEIGHT=${height}`));
    // }
    
    // if (Arduino.tft_espi_miso != miso) {
      Arduino.tft_espi_miso = miso;
      promise = promise.then(() => window['projectService'].addMacro(`TFT_MISO=${miso}`));
    // }
    
    // if (Arduino.tft_espi_mosi != mosi) {
      Arduino.tft_espi_mosi = mosi;
      promise = promise.then(() => window['projectService'].addMacro(`TFT_MOSI=${mosi}`));
    // }
    
    // if (Arduino.tft_espi_sclk != sclk) {
      Arduino.tft_espi_sclk = sclk;
      promise = promise.then(() => window['projectService'].addMacro(`TFT_SCLK=${sclk}`));
    // }
    
    // if (Arduino.tft_espi_cs != cs) {
      Arduino.tft_espi_cs = cs;
      promise = promise.then(() => window['projectService'].addMacro(`TFT_CS=${cs}`));
    // }
    
    // if (Arduino.tft_espi_dc != dc) {
      Arduino.tft_espi_dc = dc;
      promise = promise.then(() => window['projectService'].addMacro(`TFT_DC=${dc}`));
    // }
    
    // if (Arduino.tft_espi_dc != dc) {
      Arduino.tft_espi_dc = dc;
      promise = promise.then(() => window['projectService'].addMacro(`TFT_DC=${dc}`));
    // }
    
    // if (Arduino.tft_espi_rst != rst) {
      Arduino.tft_espi_rst = rst;
      promise = promise.then(() => window['projectService'].addMacro(`TFT_RST=${rst}`));
    // }

    // if (Arduino.tft_espi_bl != bl) {
      Arduino.tft_espi_bl = bl;
      promise = promise.then(() => window['projectService'].addMacro(`TFT_BL=${bl}`));
    // }

    // if (Arduino.tft_espi_bl_level != blLevel) {
      Arduino.tft_espi_bl_level = blLevel;
      const blMacro = blLevel === 'HIGH' ? 'TFT_BACKLIGHT_ON=HIGH' : 'TFT_BACKLIGHT_ON=LOW';
      promise = promise.then(() => window['projectService'].addMacro(blMacro));
    // }

    // if (Arduino.tft_espi_color_mode != colorMode) {
      Arduino.tft_espi_color_mode = colorMode;
      promise = promise.then(() => window['projectService'].addMacro(`TFT_RGB_ORDER=${colorMode}`));
    // }
    
    if (isESP32Core() && !Arduino.tft_espi_use_hspi) {
      Arduino.tft_espi_use_hspi = true;
      promise = promise.then(() => window['projectService'].addMacro('USE_HSPI_PORT'));
    }
    
    promise
      .then(() => console.log('Macro added:', model))
      .catch(err => console.error('Error adding macro:', err));
  }

  generator.addMacro("TFT_MODEL", `#define ${model}`);
  generator.addMacro("TFT_FREQUENCY", `#define TFT_FREQUENCY ${frequency}`);
  generator.addMacro("TFT_WIDTH", `#define TFT_WIDTH ${width}`);
  generator.addMacro("TFT_HEIGHT", `#define TFT_HEIGHT ${height}`);
  generator.addMacro("TFT_MISO", `#define TFT_MISO ${miso}`);
  generator.addMacro("TFT_MOSI", `#define TFT_MOSI ${mosi}`);
  generator.addMacro("TFT_SCLK", `#define TFT_SCLK ${sclk}`);
  generator.addMacro("TFT_CS", `#define TFT_CS ${cs}`);
  generator.addMacro("TFT_DC", `#define TFT_DC ${dc}`);
  generator.addMacro("TFT_RST", `#define TFT_RST ${rst}`);
  generator.addMacro("TFT_BL", `#define TFT_BL ${bl}`);
  const blMacro = blLevel === 'HIGH' ? '#define TFT_BACKLIGHT_ON HIGH' : '#define TFT_BACKLIGHT_ON LOW';
  generator.addMacro("TFT_BACKLIGHT_ON", blMacro);
  generator.addMacro("TFT_RGB_ORDER", `#define TFT_RGB_ORDER ${colorMode}`);

  if (isESP32Core() && Arduino.tft_espi_use_hspi) {
    generator.addMacro("USE_HSPI_PORT", '#define USE_HSPI_PORT');
  }

  ensureTftEspiLibraries(generator);
  generator.addVariable(varName, 'TFT_eSPI ' + varName + ' = TFT_eSPI();');

  let code = varName + '.init();\n';
  // code += varName + `.setRotation(${rotation});\n`;

  return code;
};

Arduino.forBlock['tftespi_set_rotation'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const rotation = block.getFieldValue('ROTATION') || '0';

  let code = varName + `.setRotation(${rotation});\n`;

  return code;
};

Arduino.forBlock['tftespi_invert_display'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const invert = block.getFieldValue('INVERT') || 'false';

  let code = varName + `.invertDisplay(${invert});\n`;

  return code;
}

Arduino.forBlock['tftespi_fill_screen'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.fillScreen(' + color + ');\n';

  return code;
};

Arduino.forBlock['tftespi_draw_pixel'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.drawPixel(' + x + ', ' + y + ', ' + color + ');\n';

  return code;
};

Arduino.forBlock['tftespi_draw_line'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
  const y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
  const x2 = generator.valueToCode(block, 'X2', generator.ORDER_ATOMIC) || '0';
  const y2 = generator.valueToCode(block, 'Y2', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.drawLine(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + color + ');\n';

  return code;
};

Arduino.forBlock['tftespi_draw_rect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
  const h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.drawRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + color + ');\n';

  return code;
};

Arduino.forBlock['tftespi_fill_rect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
  const h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.fillRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + color + ');\n';

  return code;
};

Arduino.forBlock['tftespi_draw_round_rect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
  const h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';
  const radius = generator.valueToCode(block, 'RADIUS', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.drawRoundRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + radius + ', ' + color + ');\n';

  return code;
};

Arduino.forBlock['tftespi_fill_round_rect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
  const h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';
  const radius = generator.valueToCode(block, 'RADIUS', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.fillRoundRect(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + radius + ', ' + color + ');\n';

  return code;
};

Arduino.forBlock['tftespi_fill_rect_v_gradient'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
  const h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';
  const color1 = generator.valueToCode(block, 'COLOR1', generator.ORDER_ATOMIC) || '0';
  const color2 = generator.valueToCode(block, 'COLOR2', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.fillRectVGradient(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + color1 + ', ' + color2 + ');\n';

  return code;
};

Arduino.forBlock['tftespi_fill_rect_h_gradient'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const w = generator.valueToCode(block, 'W', generator.ORDER_ATOMIC) || '0';
  const h = generator.valueToCode(block, 'H', generator.ORDER_ATOMIC) || '0';
  const color1 = generator.valueToCode(block, 'COLOR1', generator.ORDER_ATOMIC) || '0';
  const color2 = generator.valueToCode(block, 'COLOR2', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.fillRectHGradient(' + x + ', ' + y + ', ' + w + ', ' + h + ', ' + color1 + ', ' + color2 + ');\n';

  return code;
};

Arduino.forBlock['tftespi_draw_circle'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const radius = generator.valueToCode(block, 'RADIUS', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.drawCircle(' + x + ', ' + y + ', ' + radius + ', ' + color + ');\n';

  return code;
};

Arduino.forBlock['tftespi_fill_circle'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const radius = generator.valueToCode(block, 'RADIUS', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.fillCircle(' + x + ', ' + y + ', ' + radius + ', ' + color + ');\n';

  return code;
};

Arduino.forBlock['tftespi_draw_ellipse'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const rx = generator.valueToCode(block, 'RX', generator.ORDER_ATOMIC) || '0';
  const ry = generator.valueToCode(block, 'RY', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.drawEllipse(' + x + ', ' + y + ', ' + rx + ', ' + ry + ', ' + color + ');\n';

  return code;
};

Arduino.forBlock['tftespi_fill_ellipse'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const rx = generator.valueToCode(block, 'RX', generator.ORDER_ATOMIC) || '0';
  const ry = generator.valueToCode(block, 'RY', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.fillEllipse(' + x + ', ' + y + ', ' + rx + ', ' + ry + ', ' + color + ');\n';

  return code;
};

Arduino.forBlock['tftespi_draw_triangle'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
  const y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
  const x2 = generator.valueToCode(block, 'X2', generator.ORDER_ATOMIC) || '0';
  const y2 = generator.valueToCode(block, 'Y2', generator.ORDER_ATOMIC) || '0';
  const x3 = generator.valueToCode(block, 'X3', generator.ORDER_ATOMIC) || '0';
  const y3 = generator.valueToCode(block, 'Y3', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.drawTriangle(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + x3 + ', ' + y3 + ', ' + color + ');\n';

  return code;
};

Arduino.forBlock['tftespi_fill_triangle'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
  const y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
  const x2 = generator.valueToCode(block, 'X2', generator.ORDER_ATOMIC) || '0';
  const y2 = generator.valueToCode(block, 'Y2', generator.ORDER_ATOMIC) || '0';
  const x3 = generator.valueToCode(block, 'X3', generator.ORDER_ATOMIC) || '0';
  const y3 = generator.valueToCode(block, 'Y3', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.fillTriangle(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + x3 + ', ' + y3 + ', ' + color + ');\n';

  return code;
};

Arduino.forBlock['tftespi_draw_string'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';

  let code = varName + '.drawString(' + text + ', ' + x + ', ' + y + ');\n';

  return code;
};

Arduino.forBlock['tftespi_set_text_color'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  let code = varName + '.setTextColor(' + color + ');\n';

  return code;
};

Arduino.forBlock['tftespi_set_text_size'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const size = block.getFieldValue('SIZE') || '1';

  let code = varName + '.setTextSize(' + size + ');\n';

  return code;
};

Arduino.forBlock['tftespi_set_text_font'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const font = block.getFieldValue('FONT') || '1';

  let code = varName + '.setTextFont(' + font + ');\n';

  return code;
};

Arduino.forBlock['tftespi_color_rgb565'] = function(block, generator) {
  const varName = varField ? varField.getText() : 'tft';
  const color = block.getFieldValue('COLOR');
  
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  let code = varName + '.color565(' + r + ', ' + g + ', ' + b + ')';
  
  return [code, generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['tftespi_color'] = function(block, generator) {
  const color = block.getFieldValue('COLOR') || 'TFT_WHITE';

  let code = color;
  
  return [code, generator.ORDER_ATOMIC];
};

function tftespiDecodeBase64Frame(frameValue, expectedByteLength, frameIndex) {
  if (typeof frameValue !== 'string') {
    console.error(`[tftespi_animation] Frame ${frameIndex} is not a Base64 string`);
    return null;
  }

  const base64 = frameValue.trim();
  const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  if (!base64 || base64.length % 4 !== 0 || !base64Pattern.test(base64)) {
    console.error(`[tftespi_animation] Frame ${frameIndex} contains invalid Base64 data`);
    return null;
  }

  try {
    let bytes;
    if (typeof atob === 'function') {
      const binary = atob(base64);
      bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    } else if (typeof Buffer !== 'undefined') {
      bytes = Uint8Array.from(Buffer.from(base64, 'base64'));
    } else {
      console.error('[tftespi_animation] Base64 decoder is unavailable');
      return null;
    }

    if (bytes.length !== expectedByteLength) {
      console.error(`[tftespi_animation] Frame ${frameIndex} has ${bytes.length} bytes; expected ${expectedByteLength}`);
      return null;
    }
    return bytes;
  } catch (error) {
    console.error(`[tftespi_animation] Failed to decode frame ${frameIndex}:`, error);
    return null;
  }
}

function tftespiSwapRgb565RedBlue(value) {
  const red5 = (value >> 11) & 0x1F;
  const green6 = (value >> 5) & 0x3F;
  const blue5 = value & 0x1F;
  return (blue5 << 11) | (green6 << 5) | red5;
}

function tftespiSwapRgb332RedBlue(value) {
  const red3 = (value >> 5) & 0x07;
  const green3 = (value >> 2) & 0x07;
  const blue2 = value & 0x03;
  const swappedRed3 = (blue2 << 1) | (blue2 >> 1);
  const swappedBlue2 = red3 >> 1;
  return (swappedRed3 << 5) | (green3 << 2) | swappedBlue2;
}

function tftespiAnimationNeedsRedBlueSwap(block) {
  const needsRedBlueSwap = model => [
    'ILI9341_DRIVER',
    'ILI9341_2_DRIVER',
    'ST7735_DRIVER',
    'ST7789_DRIVER',
    'ST7789_2_DRIVER'
  ].includes(model);
  if (Arduino.tft_espi_type) {
    return needsRedBlueSwap(Arduino.tft_espi_type);
  }

  const workspace = block && block.workspace;
  if (workspace && typeof workspace.getBlocksByType === 'function') {
    const setupBlocks = workspace.getBlocksByType('tftespi_setup', false);
    return setupBlocks.some(setupBlock => needsRedBlueSwap(setupBlock.getFieldValue('MODEL')));
  }

  return false;
}

function tftespiFormatRgb565Frame(bytes, swapRedBlue) {
  const values = [];
  for (let offset = 0; offset < bytes.length; offset += 2) {
    const sourceValue = (bytes[offset] << 8) | bytes[offset + 1];
    const value = swapRedBlue ? tftespiSwapRgb565RedBlue(sourceValue) : sourceValue;
    values.push(`0x${value.toString(16).padStart(4, '0').toUpperCase()}`);
  }

  const lines = [];
  for (let index = 0; index < values.length; index += 12) {
    lines.push(`  ${values.slice(index, index + 12).join(', ')}`);
  }
  return lines.join(',\n');
}

function tftespiFormatRgb332Frame(bytes, swapRedBlue) {
  const values = Array.from(bytes, sourceValue => {
    const value = swapRedBlue ? tftespiSwapRgb332RedBlue(sourceValue) : sourceValue;
    return `0x${value.toString(16).padStart(2, '0').toUpperCase()}`;
  });
  const lines = [];
  for (let index = 0; index < values.length; index += 16) {
    lines.push(`  ${values.slice(index, index + 16).join(', ')}`);
  }
  return lines.join(',\n');
}

function tftespiGetAnimationSignature(format, encoding, width, height, fps, encodedFrames, swapRedBlue) {
  let hash1 = 0x811C9DC5;
  let hash2 = 0x9E3779B9;
  const updateHash = (value) => {
    const text = String(value);
    for (let index = 0; index < text.length; index++) {
      const code = text.charCodeAt(index);
      hash1 = Math.imul(hash1 ^ code, 0x01000193);
      hash2 = Math.imul(hash2 ^ code, 0x85EBCA77);
    }
  };

  updateHash(`${format}:${encoding}:${width}:${height}:${fps}:${swapRedBlue ? 'display-rb-swap' : 'native'}:${encodedFrames.length}|`);
  for (const encodedFrame of encodedFrames) {
    updateHash(encodedFrame);
    updateHash('|');
  }
  return `${(hash1 >>> 0).toString(16).padStart(8, '0')}${(hash2 >>> 0).toString(16).padStart(8, '0')}`;
}

function tftespiGetAnimationData(block) {
  let animationData = block.getFieldValue('CUSTOM_ANIMATION');

  if (typeof animationData === 'string') {
    try {
      animationData = JSON.parse(animationData);
    } catch (error) {
      console.error('[tftespi_animation] Failed to parse animation field value:', error);
      return null;
    }
  }

  if (!animationData || typeof animationData !== 'object') {
    console.error('[tftespi_animation] Animation data is missing');
    return null;
  }
  const format = animationData.format;
  const encoding = animationData.encoding;
  const isRgb565 = format === 'rgb565' && encoding === 'rgb565-be-base64';
  const isRgb332 = format === 'rgb332' && encoding === 'rgb332-base64';
  if (animationData.version !== 1 || (!isRgb565 && !isRgb332)) {
    console.error('[tftespi_animation] Unsupported animation version, format, or encoding');
    return null;
  }

  const width = animationData.width;
  const height = animationData.height;
  const fps = animationData.fps;
  if (!Number.isInteger(width) || width <= 0 || width > 65535 ||
      !Number.isInteger(height) || height <= 0 || height > 65535) {
    console.error('[tftespi_animation] Width and height must be positive 16-bit integers');
    return null;
  }
  if (!Number.isFinite(fps) || fps <= 0) {
    console.error('[tftespi_animation] FPS must be a positive number');
    return null;
  }
  if (!Array.isArray(animationData.frames)) {
    console.error('[tftespi_animation] Animation frames must be an array');
    return null;
  }
  // A newly dragged block intentionally starts empty until a GIF or MP4 is uploaded.
  if (animationData.frames.length === 0) {
    return null;
  }
  if (animationData.frames.length > 65535) {
    console.error('[tftespi_animation] Animation cannot contain more than 65535 frames');
    return null;
  }

  const expectedByteLength = width * height * (isRgb332 ? 1 : 2);
  if (!Number.isSafeInteger(expectedByteLength)) {
    console.error('[tftespi_animation] Animation dimensions are too large');
    return null;
  }

  const swapRedBlue = tftespiAnimationNeedsRedBlueSwap(block);
  const frames = [];
  for (let index = 0; index < animationData.frames.length; index++) {
    const binary = tftespiDecodeBase64Frame(animationData.frames[index], expectedByteLength, index);
    if (binary === null) {
      return null;
    }
    frames.push(isRgb332
      ? tftespiFormatRgb332Frame(binary, swapRedBlue)
      : tftespiFormatRgb565Frame(binary, swapRedBlue));
  }

  return {
    width,
    height,
    fps,
    format,
    swapRedBlue,
    signature: tftespiGetAnimationSignature(format, encoding, width, height, fps, animationData.frames, swapRedBlue),
    frames
  };
}

function tftespiGetBlockSymbolSuffix(block) {
  const suffix = String(block.id || 'block').replace(/[^a-zA-Z0-9]/g, '');
  return suffix || 'block';
}

function tftespiGetVariableCodeName(block, fieldName, fallbackName) {
  const field = block.getField(fieldName);
  if (field && typeof field.getText === 'function') {
    const fieldText = field.getText();
    if (fieldText) {
      return fieldText;
    }
  }

  const fieldValue = block.getFieldValue(fieldName);
  const variable = block.workspace && typeof block.workspace.getVariableById === 'function'
    ? block.workspace.getVariableById(fieldValue)
    : null;
  return variable && variable.name ? variable.name : fallbackName;
}

function tftespiGetFrameVariableCodeName(block, generator) {
  if (generator && typeof generator.getValue === 'function') {
    const generatedName = generator.getValue(block, 'FRAME_VAR', 'field_variable');
    if (generatedName && generatedName !== '?') {
      return generatedName;
    }
  }

  const variableId = block.getFieldValue('FRAME_VAR');
  if (variableId && generator && generator.nameDB_ && typeof generator.nameDB_.getName === 'function') {
    return generator.nameDB_.getName(variableId, 'VARIABLE');
  }

  return tftespiGetVariableCodeName(block, 'FRAME_VAR', 'tftAnimationFrame');
}

function tftespiGetAnimationPrefix(block, generator) {
  if (typeof block.getInputTargetBlock === 'function') {
    const animationBlock = block.getInputTargetBlock('ANIMATION');
    if (!animationBlock || animationBlock.type !== 'tftespi_animation') {
      console.error('[TFT_eSPI animation] The animation input must be connected directly to an animation data block');
      return null;
    }
  }

  const animationCode = generator.valueToCode(block, 'ANIMATION', generator.ORDER_ATOMIC);
  if (!animationCode) {
    return null;
  }

  const match = String(animationCode).trim().match(/^(tftespi_animation_[0-9a-f]{16})_frames$/);
  if (!match) {
    console.error('[TFT_eSPI animation] The animation input must be connected directly to an animation data block');
    return null;
  }
  return match[1];
}

Arduino.forBlock['tftespi_animation'] = function(block, generator) {
  ensureTftEspiLibraries(generator);
  const animationData = tftespiGetAnimationData(block);
  if (!animationData) {
    return ['', generator.ORDER_ATOMIC];
  }

  const { width, height, fps, format, swapRedBlue, signature, frames } = animationData;
  const symbolPrefix = `tftespi_animation_${signature}`;
  const frameType = format === 'rgb332' ? 'uint8_t' : 'uint16_t';
  const formatLabel = format.toUpperCase();
  const frameNames = [];
  const frameDeclarations = [];
  const frameNameByData = new Map();

  for (let index = 0; index < frames.length; index++) {
    const existingFrameName = frameNameByData.get(frames[index]);
    if (existingFrameName) {
      frameNames.push(existingFrameName);
      continue;
    }

    const frameName = `${symbolPrefix}_frame_${index}`;
    frameNameByData.set(frames[index], frameName);
    frameNames.push(frameName);
    frameDeclarations.push(`static const ${frameType} ${frameName}[] PROGMEM = {
${frames[index]}
};`);
  }

  const frameDelay = Math.max(1, Math.round(1000 / fps));
  const colorConversionLabel = swapRedBlue ? ', display R/B corrected' : '';
  const animationDeclaration = `// TFT_eSPI animation (${width}x${height}, ${frameNames.length} frames, ${frameDeclarations.length} unique, ${fps} FPS, ${formatLabel}${colorConversionLabel})
${frameDeclarations.join('\n\n')}
static const ${frameType}* const ${symbolPrefix}_frames[] = {
  ${frameNames.join(',\n  ')}
};
static const uint16_t ${symbolPrefix}_width = ${width};
static const uint16_t ${symbolPrefix}_height = ${height};
static const uint16_t ${symbolPrefix}_frame_count = ${frameNames.length};
static const uint32_t ${symbolPrefix}_frame_delay = ${frameDelay};`;

  generator.addVariable(symbolPrefix, animationDeclaration);
  return [`${symbolPrefix}_frames`, generator.ORDER_ATOMIC];
};

function tftespiAddAnimationRenderHelper(generator) {
  generator.addFunction('tftespi_draw_animation_frame', `void tftespiDrawAnimationFrame(TFT_eSPI &tftespiDisplay, int32_t tftespiX, int32_t tftespiY, uint16_t tftespiWidth, uint16_t tftespiHeight, const uint16_t *tftespiFrame) {
  bool tftespiPreviousSwapBytes = tftespiDisplay.getSwapBytes();
  // RGB565 constants are native-endian uint16_t values; swap bytes for TFT transport.
  tftespiDisplay.setSwapBytes(true);
  tftespiDisplay.pushImage(tftespiX, tftespiY, tftespiWidth, tftespiHeight, tftespiFrame);
  tftespiDisplay.setSwapBytes(tftespiPreviousSwapBytes);
}

void tftespiDrawAnimationFrame(TFT_eSPI &tftespiDisplay, int32_t tftespiX, int32_t tftespiY, uint16_t tftespiWidth, uint16_t tftespiHeight, const uint8_t *tftespiFrame) {
  tftespiDisplay.pushImage(tftespiX, tftespiY, tftespiWidth, tftespiHeight, tftespiFrame, true);
}`);
}

function tftespiAddAnimationFrameByIndexHelper(generator) {
  tftespiAddAnimationRenderHelper(generator);
  generator.addFunction('tftespi_draw_animation_frame_by_index', `void tftespiDrawAnimationFrameByIndex(TFT_eSPI &tftespiDisplay, int32_t tftespiX, int32_t tftespiY, uint16_t tftespiWidth, uint16_t tftespiHeight, const uint16_t * const tftespiFrames[], uint16_t tftespiFrameCount, int32_t tftespiFrameIndex) {
  if (tftespiFrameCount == 0) {
    return;
  }
  if (tftespiFrameIndex < 0) {
    tftespiFrameIndex = 0;
  }
  if (tftespiFrameIndex >= (int32_t)tftespiFrameCount) {
    tftespiFrameIndex = tftespiFrameCount - 1;
  }
  tftespiDrawAnimationFrame(tftespiDisplay, tftespiX, tftespiY, tftespiWidth, tftespiHeight, tftespiFrames[tftespiFrameIndex]);
}

void tftespiDrawAnimationFrameByIndex(TFT_eSPI &tftespiDisplay, int32_t tftespiX, int32_t tftespiY, uint16_t tftespiWidth, uint16_t tftespiHeight, const uint8_t * const tftespiFrames[], uint16_t tftespiFrameCount, int32_t tftespiFrameIndex) {
  if (tftespiFrameCount == 0) {
    return;
  }
  if (tftespiFrameIndex < 0) {
    tftespiFrameIndex = 0;
  }
  if (tftespiFrameIndex >= (int32_t)tftespiFrameCount) {
    tftespiFrameIndex = tftespiFrameCount - 1;
  }
  tftespiDrawAnimationFrame(tftespiDisplay, tftespiX, tftespiY, tftespiWidth, tftespiHeight, tftespiFrames[tftespiFrameIndex]);
}`);
}

Arduino.forBlock['tftespi_play_animation'] = function(block, generator) {
  ensureTftEspiLibraries(generator);
  const display = tftespiGetVariableCodeName(block, 'VAR', 'tft');
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const animationPrefix = tftespiGetAnimationPrefix(block, generator);
  if (!animationPrefix) {
    return '// No TFT_eSPI animation data\n';
  }

  tftespiAddAnimationRenderHelper(generator);
  const playMode = block.getFieldValue('PLAY_MODE') || 'BLOCKING';
  const loop = block.getFieldValue('LOOP') === 'TRUE';

  if (playMode === 'NON_BLOCKING') {
    const statePrefix = `tftespi_animation_state_${tftespiGetBlockSymbolSuffix(block)}`;
    generator.addVariable(`${statePrefix}_frame`, `uint16_t ${statePrefix}_frame = 0;`);
    generator.addVariable(`${statePrefix}_last_ms`, `uint32_t ${statePrefix}_last_ms = 0;`);
    generator.addVariable(`${statePrefix}_started`, `bool ${statePrefix}_started = false;`);
    generator.addVariable(`${statePrefix}_done`, `bool ${statePrefix}_done = false;`);

    let code = `if (!${statePrefix}_done) {\n`;
    code += `  uint32_t ${statePrefix}_now = millis();\n`;
    code += `  if (!${statePrefix}_started || ${statePrefix}_now - ${statePrefix}_last_ms >= ${animationPrefix}_frame_delay) {\n`;
    code += `    tftespiDrawAnimationFrame(${display}, ${x}, ${y}, ${animationPrefix}_width, ${animationPrefix}_height, ${animationPrefix}_frames[${statePrefix}_frame]);\n`;
    code += `    ${statePrefix}_last_ms = ${statePrefix}_now;\n`;
    code += `    ${statePrefix}_started = true;\n`;
    code += `    ${statePrefix}_frame++;\n`;
    code += `    if (${statePrefix}_frame >= ${animationPrefix}_frame_count) {\n`;
    if (loop) {
      code += `      ${statePrefix}_frame = 0;\n`;
    } else {
      code += `      ${statePrefix}_frame = ${animationPrefix}_frame_count - 1;\n`;
      code += `      ${statePrefix}_done = true;\n`;
    }
    code += '    }\n';
    code += '  }\n';
    code += '}\n';
    return code;
  }

  let code = `for (uint16_t tftespiFrameIndex = 0; tftespiFrameIndex < ${animationPrefix}_frame_count; tftespiFrameIndex++) {\n`;
  code += '  uint32_t tftespiFrameStartedAt = millis();\n';
  code += `  tftespiDrawAnimationFrame(${display}, ${x}, ${y}, ${animationPrefix}_width, ${animationPrefix}_height, ${animationPrefix}_frames[tftespiFrameIndex]);\n`;
  code += '  uint32_t tftespiFrameRenderTime = millis() - tftespiFrameStartedAt;\n';
  code += `  if (tftespiFrameRenderTime < ${animationPrefix}_frame_delay) {\n`;
  code += `    delay(${animationPrefix}_frame_delay - tftespiFrameRenderTime);\n`;
  code += '  }\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['tftespi_draw_animation_frame'] = function(block, generator) {
  ensureTftEspiLibraries(generator);
  const display = tftespiGetVariableCodeName(block, 'VAR', 'tft');
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const frame = generator.valueToCode(block, 'FRAME', generator.ORDER_ATOMIC) || '0';
  const animationPrefix = tftespiGetAnimationPrefix(block, generator);
  if (!animationPrefix) {
    return '// No TFT_eSPI animation data\n';
  }

  tftespiAddAnimationFrameByIndexHelper(generator);
  return `tftespiDrawAnimationFrameByIndex(${display}, ${x}, ${y}, ${animationPrefix}_width, ${animationPrefix}_height, ${animationPrefix}_frames, ${animationPrefix}_frame_count, ${frame});\n`;
};

Arduino.forBlock['tftespi_animation_frame_count'] = function(block, generator) {
  ensureTftEspiLibraries(generator);
  const animationPrefix = tftespiGetAnimationPrefix(block, generator);
  if (!animationPrefix) {
    return ['0', generator.ORDER_ATOMIC];
  }

  return [`${animationPrefix}_frame_count`, generator.ORDER_ATOMIC];
};

Arduino.forBlock['tftespi_step_animation_frame'] = function(block, generator) {
  ensureTftEspiLibraries(generator);
  const frameVariable = tftespiGetFrameVariableCodeName(block, generator);
  const target = generator.valueToCode(block, 'TARGET', generator.ORDER_ATOMIC) || '0';
  const frameCount = generator.valueToCode(block, 'FRAME_COUNT', generator.ORDER_ATOMIC) || '1';
  const direction = block.getFieldValue('DIRECTION') || 'AUTO';
  const symbolSuffix = tftespiGetBlockSymbolSuffix(block);
  const targetVariable = `tftespi_animation_target_${symbolSuffix}`;
  const countVariable = `tftespi_animation_frame_count_${symbolSuffix}`;

  let code = `int32_t ${countVariable} = (int32_t)(${frameCount});\n`;
  code += `if (${countVariable} > 0) {\n`;
  code += `  int32_t ${targetVariable} = constrain((int32_t)(${target}), 0, ${countVariable} - 1);\n`;
  code += `  ${frameVariable} = constrain((int32_t)${frameVariable}, 0, ${countVariable} - 1);\n`;

  if (direction === 'FORWARD') {
    code += `  if (${frameVariable} != ${targetVariable}) {\n`;
    code += `    ${frameVariable}++;\n`;
    code += `    if (${frameVariable} >= ${countVariable}) {\n`;
    code += `      ${frameVariable} = 0;\n`;
    code += '    }\n';
    code += '  }\n';
  } else if (direction === 'BACKWARD') {
    code += `  if (${frameVariable} != ${targetVariable}) {\n`;
    code += `    if (${frameVariable} <= 0) {\n`;
    code += `      ${frameVariable} = ${countVariable} - 1;\n`;
    code += '    } else {\n';
    code += `      ${frameVariable}--;\n`;
    code += '    }\n';
    code += '  }\n';
  } else {
    code += `  if (${frameVariable} < ${targetVariable}) {\n`;
    code += `    ${frameVariable}++;\n`;
    code += `  } else if (${frameVariable} > ${targetVariable}) {\n`;
    code += `    ${frameVariable}--;\n`;
    code += '  }\n';
  }

  code += '}\n';
  return code;
};

if (Blockly.Extensions.isRegistered('tftespi_animation_play_dynamic_inputs')) {
  Blockly.Extensions.unregister('tftespi_animation_play_dynamic_inputs');
}

Blockly.Extensions.register('tftespi_animation_play_dynamic_inputs', function() {
  let renderScheduled = false;

  const getLoopInput = () => {
    return this.inputList.find(input => input.fieldRow && input.fieldRow.some(field => field.name === 'LOOP'));
  };

  const scheduleRender = () => {
    if (!this.rendered || renderScheduled) {
      return;
    }
    renderScheduled = true;
    Promise.resolve().then(() => {
      renderScheduled = false;
      const rootBlock = typeof this.getRootBlock === 'function' ? this.getRootBlock() : this;
      if (rootBlock && rootBlock.rendered) {
        rootBlock.render();
      } else if (this.rendered) {
        this.render();
      }
    });
  };

  const updatePlaybackMode = modeValue => {
    const loopInput = getLoopInput();
    if (loopInput) {
      loopInput.setVisible(modeValue === 'NON_BLOCKING');
    }
    scheduleRender();
  };

  const playModeField = this.getField('PLAY_MODE');
  if (playModeField) {
    playModeField.setValidator(option => {
      updatePlaybackMode(option);
      return option;
    });
  }

  updatePlaybackMode(this.getFieldValue('PLAY_MODE'));
});
