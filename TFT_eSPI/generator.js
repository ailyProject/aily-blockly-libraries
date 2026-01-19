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
    const varField = block.getField('VAR');
    if (varField && typeof varField.setValidator === 'function') {
      varField.setValidator(function(newName) {
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._tftespiVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'TFT_eSPI');
          block._tftespiVarLastName = newName;
        }
        return newName;
      });
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
    
    if (isESP32Core() && !Arduino.tft_espi_use_hspi) {
      Arduino.tft_espi_use_hspi = true;
      promise = promise.then(() => window['projectService'].addMacro('USE_HSPI_PORT'));
    }
    
    promise
      .then(() => console.log('Macro added:', model))
      .catch(err => console.error('Error adding macro:', err));
  }

  generator.addLibrary('TFT_eSPI', '#include <TFT_eSPI.h>');
  registerVariableToBlockly(varName, 'TFT_eSPI');
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
