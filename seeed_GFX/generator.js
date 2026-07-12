'use strict';

// Seeed_GFX库的代码生成器
// 支持TFT_eSPI、TFT_eSprite和EPaper类

if (!Arduino.seeed_gfx) {
  Arduino.seeed_gfx = true;
  Arduino.seeed_gfx_type = '';
  Arduino.seeed_gfx_frequency = '';
}
// 监听块删除事件（将监听器绑定到工作区实例，避免重载/热替换时重复添加）
if (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace) {
  // 延迟添加监听器,确保工作区已初始化
  setTimeout(() => {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) return;

    // 如果工作区上已标记为添加过监听器则跳过（工作区作用域）
    if (workspace._seeedGfxDeleteListenerAdded) return;

    const deleteListener = function(event) {
      if (event.type === Blockly.Events.BLOCK_DELETE) {
        if (event.oldJson && (event.oldJson.type === 'seeed_gfx_init' || event.oldJson.type === 'seeed_gfx_epaper_begin')) {
          console.log('delete BOARD_SCREEN_COMBO macro');
          window['projectService'].removeMacro('BOARD_SCREEN_COMBO')
            .then(() => {
              if (Arduino.seeed_gfx_type === '502') {
                return window['projectService'].removeMacro('USE_XIAO_EPAPER_DISPLAY_BOARD_EE04')
              }
            })
            .then(() => console.log('✅ 宏定义已移除'))
            .catch(err => console.error('❌ 失败:', err));
          Arduino.seeed_gfx_type = '';
          // Arduino.seeed_gfx_frequency = '';
        }
      }
    };

    workspace.addChangeListener(deleteListener);
    workspace._seeedGfxDeleteListenerAdded = true;
    workspace._seeedGfxDeleteListener = deleteListener;

    // 在工作区被销毁时移除监听器并清理标志（防止残留）
    // 该操作会覆盖 workspace.dispose，保留原有实现并在其中移除监听器
    if (typeof workspace.dispose === 'function') {
      const _origDispose = workspace.dispose.bind(workspace);
      workspace.dispose = function() {
        try {
          if (workspace._seeedGfxDeleteListener) {
            workspace.removeChangeListener(workspace._seeedGfxDeleteListener);
            workspace._seeedGfxDeleteListener = null;
          }
        } catch (e) {
          // 忽略移除监听器可能抛出的异常
        }
        workspace._seeedGfxDeleteListenerAdded = false;
        _origDispose();
      };
    }
  }, 100);
}

// 颜色常量定义
// const COLORS = {
//   BLACK: 0x0000,
//   WHITE: 0xFFFF,
//   RED: 0xF800,
//   GREEN: 0x07E0,
//   BLUE: 0x001F,
//   YELLOW: 0xFFE0,
//   CYAN: 0x07FF,
//   MAGENTA: 0xF81F
// };

// TFT_eSPI对象创建
Arduino.forBlock['seeed_gfx_create_tft'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'tft';
  
  // 添加库引用
  generator.addLibrary('TFT_eSPI', '#include <TFT_eSPI.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
  
  // 注册变量到Blockly系统
  registerVariableToBlockly(varName, 'TFT_eSPI');
  
  // 声明TFT对象
  generator.addVariable(varName, 'TFT_eSPI ' + varName + ' = TFT_eSPI();');
  
  return '';
};

// TFT初始化
Arduino.forBlock['seeed_gfx_init'] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._tftVarMonitorAttached) {
    block._tftVarMonitorAttached = true;
    block._tftVarLastName = block.getFieldValue('VAR') || 'tft';
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._tftVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'TFT_eSPI');
          block._tftVarLastName = newName;
        }
      };
    }
  }

  var varName = block.getFieldValue('VAR') || 'tft';

  // const modelType = block.getFieldValue('MODEL') || 'Seeed_Wio_Terminal_500';
  // const modelParts = modelType.split('_');
  // const model = modelParts.pop();
  const model = block.getFieldValue('MODEL') || '500';
  const frequency = block.getFieldValue('FREQUENCY') || '40000000';
  // window.add();
  if (Arduino.seeed_gfx_type !== model) {
    Arduino.seeed_gfx_type = model;
    console.log('Selected model:', model);
    console.log('data: ', window['packageJson']);

    if (window['projectService']) {
      window['projectService'].addMacro(`BOARD_SCREEN_COMBO=${model}`)
        .then(() => console.log('✅ 宏定义已更新'))
        .catch(err => console.error('❌ 失败:', err));
      // window['projectService'].addMacro(`BOARD_SCREEN_FREQUENCY=${frequency}`)
      //   .then(() => console.log('✅ 宏定义已更新'))
      //   .catch(err => console.error('❌ 失败:', err));
    }
  }

  generator.addMacro('BOARD_SCREEN_COMBO', '#define BOARD_SCREEN_COMBO ' + model);
  generator.addMacro('BOARD_SCREEN_FREQUENCY', '#define TFT_FREQUENCY ' + frequency);

  const messageData = {
    eventType: 'workspaceChanged',
    code: 'Blockly.JavaScript.workspaceToCode(workspace)'
  };

  // 发送消息给父窗口
  window.parent.postMessage(messageData, '*');
  // }

  // generator.addMacro('BOARD_SCREEN_COMBO', '#define BOARD_SCREEN_COMBO ' + model + '\n');
  // 添加库引用
  generator.addLibrary('TFT_eSPI', '#include <TFT_eSPI.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
  
  // 注册变量
  registerVariableToBlockly(varName, 'TFT_eSPI');
  generator.addObject(varName, 'TFT_eSPI ' + varName + ' = TFT_eSPI();');
  
  // 生成初始化代码
  return varName + '.init();\n';
};

// 填充屏幕
Arduino.forBlock['seeed_gfx_fill_screen'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.fillScreen(' + color + ');\n';
};

// 设置旋转
Arduino.forBlock['seeed_gfx_set_rotation'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const rotation = block.getFieldValue('ROTATION') || '0';
  
  return varName + '.setRotation(' + rotation + ');\n';
};

// 画点
Arduino.forBlock['seeed_gfx_draw_pixel'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.drawPixel(' + x + ', ' + y + ', ' + color + ');\n';
};

// 画线
Arduino.forBlock['seeed_gfx_draw_line'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
  const y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
  const x2 = generator.valueToCode(block, 'X2', generator.ORDER_ATOMIC) || '0';
  const y2 = generator.valueToCode(block, 'Y2', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.drawLine(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + color + ');\n';
};

// 画矩形
Arduino.forBlock['seeed_gfx_draw_rect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '10';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '10';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.drawRect(' + x + ', ' + y + ', ' + width + ', ' + height + ', ' + color + ');\n';
};

// 填充矩形
Arduino.forBlock['seeed_gfx_fill_rect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '10';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '10';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.fillRect(' + x + ', ' + y + ', ' + width + ', ' + height + ', ' + color + ');\n';
};

// 垂直渐变填充矩形
Arduino.forBlock['seeed_gfx_fill_rect_v_gradient'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '10';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '10';
  const color1 = generator.valueToCode(block, 'COLOR1', generator.ORDER_ATOMIC) || '0';
  const color2 = generator.valueToCode(block, 'COLOR2', generator.ORDER_ATOMIC) || '0';

  return varName + '.fillRectVGradient(' + x + ', ' + y + ', ' + width + ', ' + height + ', ' + color1 + ', ' + color2 + ');\n';
};

// 水平渐变填充矩形
Arduino.forBlock['seeed_gfx_fill_rect_h_gradient'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '10';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '10';
  const color1 = generator.valueToCode(block, 'COLOR1', generator.ORDER_ATOMIC) || '0';
  const color2 = generator.valueToCode(block, 'COLOR2', generator.ORDER_ATOMIC) || '0';

  return varName + '.fillRectHGradient(' + x + ', ' + y + ', ' + width + ', ' + height + ', ' + color1 + ', ' + color2 + ');\n';
};

// 画圆角矩形
Arduino.forBlock['seeed_gfx_draw_round_rect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '10';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '10';
  const radius = generator.valueToCode(block, 'RADIUS', generator.ORDER_ATOMIC) || '5';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.drawRoundRect(' + x + ', ' + y + ', ' + width + ', ' + height + ', ' + radius + ', ' + color + ');\n';
};

// 填充圆角矩形
Arduino.forBlock['seeed_gfx_fill_round_rect'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '10';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '10';
  const radius = generator.valueToCode(block, 'RADIUS', generator.ORDER_ATOMIC) || '5';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.fillRoundRect(' + x + ', ' + y + ', ' + width + ', ' + height + ', ' + radius + ', ' + color + ');\n';
};

// 画圆
Arduino.forBlock['seeed_gfx_draw_circle'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const radius = generator.valueToCode(block, 'RADIUS', generator.ORDER_ATOMIC) || '5';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.drawCircle(' + x + ', ' + y + ', ' + radius + ', ' + color + ');\n';
};

// 填充圆
Arduino.forBlock['seeed_gfx_fill_circle'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const radius = generator.valueToCode(block, 'RADIUS', generator.ORDER_ATOMIC) || '5';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.fillCircle(' + x + ', ' + y + ', ' + radius + ', ' + color + ');\n';
};

// 画三角形
Arduino.forBlock['seeed_gfx_draw_triangle'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
  const y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
  const x2 = generator.valueToCode(block, 'X2', generator.ORDER_ATOMIC) || '0';
  const y2 = generator.valueToCode(block, 'Y2', generator.ORDER_ATOMIC) || '0';
  const x3 = generator.valueToCode(block, 'X3', generator.ORDER_ATOMIC) || '0';
  const y3 = generator.valueToCode(block, 'Y3', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  return varName + '.drawTriangle(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + x3 + ', ' + y3 + ', ' + color + ');\n';
};

// 填充三角形
Arduino.forBlock['seeed_gfx_fill_triangle'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
  const y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
  const x2 = generator.valueToCode(block, 'X2', generator.ORDER_ATOMIC) || '0';
  const y2 = generator.valueToCode(block, 'Y2', generator.ORDER_ATOMIC) || '0';
  const x3 = generator.valueToCode(block, 'X3', generator.ORDER_ATOMIC) || '0';
  const y3 = generator.valueToCode(block, 'Y3', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  return varName + '.fillTriangle(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + x3 + ', ' + y3 + ', ' + color + ');\n';
};

// 画椭圆
Arduino.forBlock['seeed_gfx_draw_ellipse'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const rx = generator.valueToCode(block, 'RX', generator.ORDER_ATOMIC) || '10';
  const ry = generator.valueToCode(block, 'RY', generator.ORDER_ATOMIC) || '5';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  return varName + '.drawEllipse(' + x + ', ' + y + ', ' + rx + ', ' + ry + ', ' + color + ');\n';
};

// 填充椭圆
Arduino.forBlock['seeed_gfx_fill_ellipse'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const rx = generator.valueToCode(block, 'RX', generator.ORDER_ATOMIC) || '10';
  const ry = generator.valueToCode(block, 'RY', generator.ORDER_ATOMIC) || '5';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';

  return varName + '.fillEllipse(' + x + ', ' + y + ', ' + rx + ', ' + ry + ', ' + color + ');\n';
};

// 设置文字颜色
Arduino.forBlock['seeed_gfx_set_text_color'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  const bgcolor = generator.valueToCode(block, 'BGCOLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.setTextColor(' + color + ', ' + bgcolor + ');\n';
};

// 设置文字大小
Arduino.forBlock['seeed_gfx_set_text_size'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const size = block.getFieldValue('SIZE') || '1';
  
  return varName + '.setTextSize(' + size + ');\n';
};

// 设置光标位置
Arduino.forBlock['seeed_gfx_set_cursor'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.setCursor(' + x + ', ' + y + ');\n';
};

// 打印文字
Arduino.forBlock['seeed_gfx_print'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  
  return varName + '.print(' + text + ');\n';
};

// 显示文字
Arduino.forBlock['seeed_gfx_draw_string'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const font = block.getFieldValue('FONT') || '1';
  
  return varName + '.drawString(' + text + ', ' + x + ', ' + y + ', ' + font + ');\n';
};

// 创建精灵
Arduino.forBlock['seeed_gfx_create_sprite'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'sprite';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '32';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '32';
  
  // 添加库引用
  generator.addLibrary('Seeed_GFX', '#include <TFT_eSPI.h>');
  
  // 注册变量到Blockly系统
  registerVariableToBlockly(varName, 'TFT_eSprite');
  
  // 声明精灵对象
  generator.addVariable(varName, 'TFT_eSprite ' + varName + '(&tft);');
  
  // 生成创建精灵的代码
  return varName + '.createSprite(' + width + ', ' + height + ');\n';
};

// 显示精灵
Arduino.forBlock['seeed_gfx_push_sprite'] = function(block, generator) {
  const spriteField = block.getField('SPRITE');
  const spriteName = spriteField ? spriteField.getText() : 'sprite';
  const tftField = block.getField('TFT');
  const tftName = tftField ? tftField.getText() : 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  
  return spriteName + '.pushSprite(' + x + ', ' + y + ');\n';
};

// 创建电子墨水屏
Arduino.forBlock['seeed_gfx_create_epaper'] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || 'epaper';
  
  // 添加库引用
  generator.addLibrary('Seeed_GFX_EPaper', '#include <EPaper.h>');
  
  // 注册变量到Blockly系统
  registerVariableToBlockly(varName, 'EPaper');
  
  // 声明EPaper对象
  generator.addVariable(varName, 'EPaper ' + varName + ';');
  
  return '';
};

// 电子墨水屏初始化
Arduino.forBlock['seeed_gfx_epaper_begin'] = function(block, generator) {
  // 监听VAR输入值的变化，自动重命名Blockly变量
  if (!block._epaperVarMonitorAttached) {
    block._epaperVarMonitorAttached = true;
    block._epaperVarLastName = block.getFieldValue('VAR') || 'epaper';
    const varField = block.getField('VAR');
    if (varField) {
      const originalFinishEditing = varField.onFinishEditing_;
      varField.onFinishEditing_ = function(newName) {
        if (typeof originalFinishEditing === 'function') {
          originalFinishEditing.call(this, newName);
        }
        const workspace = block.workspace || (typeof Blockly !== 'undefined' && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
        const oldName = block._epaperVarLastName;
        if (workspace && newName && newName !== oldName) {
          renameVariableInBlockly(block, oldName, newName, 'EPaper');
          block._epaperVarLastName = newName;
        }
      };
    }
  }

  var varName = block.getFieldValue('VAR') || 'epaper';
  // const varField = block.getField('VAR');
  // const varName = varField ? varField.getText() : 'epaper';
  const model = block.getFieldValue('MODEL') || '502';

  if (Arduino.seeed_gfx_type !== model) {
    Arduino.seeed_gfx_type = model;
    console.log('Selected model:', model);

    if (window['projectService']) {
      window['projectService'].addMacro(`BOARD_SCREEN_COMBO=${model}`)
        .then(() => {
          if (model === '502') {
            return window['projectService'].addMacro('USE_XIAO_EPAPER_DISPLAY_BOARD_EE04')
          } else {
            return window['projectService'].removeMacro('USE_XIAO_EPAPER_DISPLAY_BOARD_EE04')
          }
        })
        .then(() => console.log('✅ 宏定义已更新'))
        .catch(err => console.error('❌ 失败:', err));
    }
  }

  const messageData = {
    eventType: 'workspaceChanged',
    code: 'Blockly.JavaScript.workspaceToCode(workspace)'
  };

  // 发送消息给父窗口
  window.parent.postMessage(messageData, '*');
  // }
  
  // 添加库引用
  generator.addLibrary('TFT_eSPI', '#include <TFT_eSPI.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
  
  // 注册变量
  registerVariableToBlockly(varName, 'EPAPER');
  generator.addObject(varName, 'EPaper ' + varName + ';');
  
  // 生成初始化代码
  return varName + '.begin();\n';
};

// 更新电子墨水屏
Arduino.forBlock['seeed_gfx_epaper_update'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'epaper';
  
  return varName + '.update();\n';
};

// 电子墨水屏睡眠
Arduino.forBlock['seeed_gfx_epaper_sleep'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'epaper';
  
  return varName + '.sleep();\n';
};

// 唤醒电子墨水屏
Arduino.forBlock['seeed_gfx_epaper_wake'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'epaper';
  
  return varName + '.wake();\n';
};

Arduino.forBlock['seeed_gfx_color'] = function(block, generator) {
  const color = block.getFieldValue('COLOR');
  return [color, generator.ORDER_ATOMIC];
}

// 颜色常量块
Arduino.forBlock['seeed_gfx_color_black'] = function(block, generator) {
  return ['0x0000', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_color_white'] = function(block, generator) {
  return ['0xFFFF', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_color_red'] = function(block, generator) {
  return ['0xF800', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_color_green'] = function(block, generator) {
  return ['0x07E0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_color_blue'] = function(block, generator) {
  return ['0x001F', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_color_yellow'] = function(block, generator) {
  return ['0xFFE0', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_color_cyan'] = function(block, generator) {
  return ['0x07FF', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_color_magenta'] = function(block, generator) {
  return ['0xF81F', generator.ORDER_ATOMIC];
};

// RGB565颜色转换
Arduino.forBlock['seeed_gfx_rgb565'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';

  const color = block.getFieldValue('COLOR');

  // 解析十六进制颜色
  
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return [varName + '.color565(' + r + ', ' + g + ', ' + b + ')', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_get_width'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  
  return [varName + '.width()', generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_get_height'] = function(block, generator) {
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'tft';
  
  return [varName + '.height()', generator.ORDER_ATOMIC];
};

function seeedGfxEnsureAnimationLibraries(generator) {
  generator.addLibrary('TFT_eSPI', '#include <TFT_eSPI.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
}

function seeedGfxDecodeBase64Frame(frameValue, expectedByteLength, frameIndex) {
  if (typeof frameValue !== 'string') {
    console.error(`[seeed_gfx_animation] Frame ${frameIndex} is not a Base64 string`);
    return null;
  }

  const base64 = frameValue.trim();
  const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  if (!base64 || base64.length % 4 !== 0 || !base64Pattern.test(base64)) {
    console.error(`[seeed_gfx_animation] Frame ${frameIndex} contains invalid Base64 data`);
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
      console.error('[seeed_gfx_animation] Base64 decoder is unavailable');
      return null;
    }

    if (bytes.length !== expectedByteLength) {
      console.error(`[seeed_gfx_animation] Frame ${frameIndex} has ${bytes.length} bytes; expected ${expectedByteLength}`);
      return null;
    }
    return bytes;
  } catch (error) {
    console.error(`[seeed_gfx_animation] Failed to decode frame ${frameIndex}:`, error);
    return null;
  }
}

function seeedGfxFormatRgb565Frame(bytes) {
  const values = [];
  for (let offset = 0; offset < bytes.length; offset += 2) {
    const value = (bytes[offset] << 8) | bytes[offset + 1];
    values.push(`0x${value.toString(16).padStart(4, '0').toUpperCase()}`);
  }

  const lines = [];
  for (let index = 0; index < values.length; index += 12) {
    lines.push(`  ${values.slice(index, index + 12).join(', ')}`);
  }
  return lines.join(',\n');
}

function seeedGfxGetAnimationSignature(width, height, fps, encodedFrames) {
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

  updateHash(`${width}:${height}:${fps}:${encodedFrames.length}|`);
  for (const encodedFrame of encodedFrames) {
    updateHash(encodedFrame);
    updateHash('|');
  }
  return `${(hash1 >>> 0).toString(16).padStart(8, '0')}${(hash2 >>> 0).toString(16).padStart(8, '0')}`;
}

function seeedGfxGetAnimationData(block) {
  let animationData = block.getFieldValue('CUSTOM_ANIMATION');

  if (typeof animationData === 'string') {
    try {
      animationData = JSON.parse(animationData);
    } catch (error) {
      console.error('[seeed_gfx_animation] Failed to parse animation field value:', error);
      return null;
    }
  }

  if (!animationData || typeof animationData !== 'object') {
    console.error('[seeed_gfx_animation] Animation data is missing');
    return null;
  }
  if (animationData.version !== 1 || animationData.format !== 'rgb565' || animationData.encoding !== 'rgb565-be-base64') {
    console.error('[seeed_gfx_animation] Unsupported animation version, format, or encoding');
    return null;
  }

  const width = animationData.width;
  const height = animationData.height;
  const fps = animationData.fps;
  if (!Number.isInteger(width) || width <= 0 || width > 65535 ||
      !Number.isInteger(height) || height <= 0 || height > 65535) {
    console.error('[seeed_gfx_animation] Width and height must be positive 16-bit integers');
    return null;
  }
  if (!Number.isFinite(fps) || fps <= 0) {
    console.error('[seeed_gfx_animation] FPS must be a positive number');
    return null;
  }
  if (!Array.isArray(animationData.frames)) {
    console.error('[seeed_gfx_animation] Animation frames must be an array');
    return null;
  }
  // A newly dragged block intentionally starts empty until a GIF or MP4 is uploaded.
  if (animationData.frames.length === 0) {
    return null;
  }
  if (animationData.frames.length > 65535) {
    console.error('[seeed_gfx_animation] Animation cannot contain more than 65535 frames');
    return null;
  }

  const expectedByteLength = width * height * 2;
  if (!Number.isSafeInteger(expectedByteLength)) {
    console.error('[seeed_gfx_animation] Animation dimensions are too large');
    return null;
  }

  const frames = [];
  for (let index = 0; index < animationData.frames.length; index++) {
    const binary = seeedGfxDecodeBase64Frame(animationData.frames[index], expectedByteLength, index);
    if (binary === null) {
      return null;
    }
    frames.push(seeedGfxFormatRgb565Frame(binary));
  }

  return {
    width,
    height,
    fps,
    signature: seeedGfxGetAnimationSignature(width, height, fps, animationData.frames),
    frames
  };
}

function seeedGfxGetBlockSymbolSuffix(block) {
  const suffix = String(block.id || 'block').replace(/[^a-zA-Z0-9]/g, '');
  return suffix || 'block';
}

function seeedGfxGetVariableCodeName(block, fieldName, fallbackName) {
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

function seeedGfxGetFrameVariableCodeName(block, generator) {
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

  return seeedGfxGetVariableCodeName(block, 'FRAME_VAR', 'seeedGfxAnimationFrame');
}

function seeedGfxGetAnimationPrefix(block, generator) {
  if (typeof block.getInputTargetBlock === 'function') {
    const animationBlock = block.getInputTargetBlock('ANIMATION');
    if (!animationBlock || animationBlock.type !== 'seeed_gfx_animation') {
      console.error('[Seeed GFX animation] The animation input must be connected directly to a Seeed GFX animation data block');
      return null;
    }
  }

  const animationCode = generator.valueToCode(block, 'ANIMATION', generator.ORDER_ATOMIC);
  if (!animationCode) {
    return null;
  }

  const match = String(animationCode).trim().match(/^(seeed_gfx_animation_[0-9a-f]{16})_frames$/);
  if (!match) {
    console.error('[Seeed GFX animation] The animation input must be connected directly to a Seeed GFX animation data block');
    return null;
  }
  return match[1];
}

Arduino.forBlock['seeed_gfx_animation'] = function(block, generator) {
  seeedGfxEnsureAnimationLibraries(generator);
  const animationData = seeedGfxGetAnimationData(block);
  if (!animationData) {
    return ['', generator.ORDER_ATOMIC];
  }

  const { width, height, fps, signature, frames } = animationData;
  const symbolPrefix = `seeed_gfx_animation_${signature}`;
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
    frameDeclarations.push(`static const uint16_t ${frameName}[] PROGMEM = {
${frames[index]}
};`);
  }

  const frameDelay = Math.max(1, Math.round(1000 / fps));
  const animationDeclaration = `// Seeed GFX animation (${width}x${height}, ${frameNames.length} frames, ${frameDeclarations.length} unique, ${fps} FPS, RGB565)
${frameDeclarations.join('\n\n')}
static const uint16_t* const ${symbolPrefix}_frames[] = {
  ${frameNames.join(',\n  ')}
};
static const uint16_t ${symbolPrefix}_width = ${width};
static const uint16_t ${symbolPrefix}_height = ${height};
static const uint16_t ${symbolPrefix}_frame_count = ${frameNames.length};
static const uint32_t ${symbolPrefix}_frame_delay = ${frameDelay};`;

  generator.addVariable(symbolPrefix, animationDeclaration);
  return [`${symbolPrefix}_frames`, generator.ORDER_ATOMIC];
};

function seeedGfxAddAnimationRenderHelper(generator) {
  generator.addFunction('seeed_gfx_draw_animation_frame', `void seeedGfxDrawAnimationFrame(TFT_eSPI &seeedGfxDisplay, int32_t seeedGfxX, int32_t seeedGfxY, uint16_t seeedGfxWidth, uint16_t seeedGfxHeight, const uint16_t *seeedGfxFrame) {
  bool seeedGfxPreviousSwapBytes = seeedGfxDisplay.getSwapBytes();
  // RGB565 constants are native-endian uint16_t values; swap bytes for TFT transport.
  seeedGfxDisplay.setSwapBytes(true);
  seeedGfxDisplay.pushImage(seeedGfxX, seeedGfxY, seeedGfxWidth, seeedGfxHeight, seeedGfxFrame);
  seeedGfxDisplay.setSwapBytes(seeedGfxPreviousSwapBytes);
}`);
}

function seeedGfxAddAnimationFrameByIndexHelper(generator) {
  seeedGfxAddAnimationRenderHelper(generator);
  generator.addFunction('seeed_gfx_draw_animation_frame_by_index', `void seeedGfxDrawAnimationFrameByIndex(TFT_eSPI &seeedGfxDisplay, int32_t seeedGfxX, int32_t seeedGfxY, uint16_t seeedGfxWidth, uint16_t seeedGfxHeight, const uint16_t * const seeedGfxFrames[], uint16_t seeedGfxFrameCount, int32_t seeedGfxFrameIndex) {
  if (seeedGfxFrameCount == 0) {
    return;
  }
  if (seeedGfxFrameIndex < 0) {
    seeedGfxFrameIndex = 0;
  }
  if (seeedGfxFrameIndex >= (int32_t)seeedGfxFrameCount) {
    seeedGfxFrameIndex = seeedGfxFrameCount - 1;
  }
  seeedGfxDrawAnimationFrame(seeedGfxDisplay, seeedGfxX, seeedGfxY, seeedGfxWidth, seeedGfxHeight, seeedGfxFrames[seeedGfxFrameIndex]);
}`);
}

Arduino.forBlock['seeed_gfx_play_animation'] = function(block, generator) {
  seeedGfxEnsureAnimationLibraries(generator);
  const display = seeedGfxGetVariableCodeName(block, 'VAR', 'tft');
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const animationPrefix = seeedGfxGetAnimationPrefix(block, generator);
  if (!animationPrefix) {
    return '// No Seeed GFX animation data\n';
  }

  seeedGfxAddAnimationRenderHelper(generator);
  const playMode = block.getFieldValue('PLAY_MODE') || 'BLOCKING';
  const loop = block.getFieldValue('LOOP') === 'TRUE';

  if (playMode === 'NON_BLOCKING') {
    const statePrefix = `seeed_gfx_animation_state_${seeedGfxGetBlockSymbolSuffix(block)}`;
    generator.addVariable(`${statePrefix}_frame`, `uint16_t ${statePrefix}_frame = 0;`);
    generator.addVariable(`${statePrefix}_last_ms`, `uint32_t ${statePrefix}_last_ms = 0;`);
    generator.addVariable(`${statePrefix}_started`, `bool ${statePrefix}_started = false;`);
    generator.addVariable(`${statePrefix}_done`, `bool ${statePrefix}_done = false;`);

    let code = `if (!${statePrefix}_done) {\n`;
    code += `  uint32_t ${statePrefix}_now = millis();\n`;
    code += `  if (!${statePrefix}_started || ${statePrefix}_now - ${statePrefix}_last_ms >= ${animationPrefix}_frame_delay) {\n`;
    code += `    seeedGfxDrawAnimationFrame(${display}, ${x}, ${y}, ${animationPrefix}_width, ${animationPrefix}_height, ${animationPrefix}_frames[${statePrefix}_frame]);\n`;
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

  let code = `for (uint16_t seeedGfxFrameIndex = 0; seeedGfxFrameIndex < ${animationPrefix}_frame_count; seeedGfxFrameIndex++) {\n`;
  code += '  uint32_t seeedGfxFrameStartedAt = millis();\n';
  code += `  seeedGfxDrawAnimationFrame(${display}, ${x}, ${y}, ${animationPrefix}_width, ${animationPrefix}_height, ${animationPrefix}_frames[seeedGfxFrameIndex]);\n`;
  code += '  uint32_t seeedGfxFrameRenderTime = millis() - seeedGfxFrameStartedAt;\n';
  code += `  if (seeedGfxFrameRenderTime < ${animationPrefix}_frame_delay) {\n`;
  code += `    delay(${animationPrefix}_frame_delay - seeedGfxFrameRenderTime);\n`;
  code += '  }\n';
  code += '}\n';
  return code;
};

Arduino.forBlock['seeed_gfx_draw_animation_frame'] = function(block, generator) {
  seeedGfxEnsureAnimationLibraries(generator);
  const display = seeedGfxGetVariableCodeName(block, 'VAR', 'tft');
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const frame = generator.valueToCode(block, 'FRAME', generator.ORDER_ATOMIC) || '0';
  const animationPrefix = seeedGfxGetAnimationPrefix(block, generator);
  if (!animationPrefix) {
    return '// No Seeed GFX animation data\n';
  }

  seeedGfxAddAnimationFrameByIndexHelper(generator);
  return `seeedGfxDrawAnimationFrameByIndex(${display}, ${x}, ${y}, ${animationPrefix}_width, ${animationPrefix}_height, ${animationPrefix}_frames, ${animationPrefix}_frame_count, ${frame});\n`;
};

Arduino.forBlock['seeed_gfx_animation_frame_count'] = function(block, generator) {
  seeedGfxEnsureAnimationLibraries(generator);
  const animationPrefix = seeedGfxGetAnimationPrefix(block, generator);
  if (!animationPrefix) {
    return ['0', generator.ORDER_ATOMIC];
  }

  return [`${animationPrefix}_frame_count`, generator.ORDER_ATOMIC];
};

Arduino.forBlock['seeed_gfx_step_animation_frame'] = function(block, generator) {
  seeedGfxEnsureAnimationLibraries(generator);
  const frameVariable = seeedGfxGetFrameVariableCodeName(block, generator);
  const target = generator.valueToCode(block, 'TARGET', generator.ORDER_ATOMIC) || '0';
  const frameCount = generator.valueToCode(block, 'FRAME_COUNT', generator.ORDER_ATOMIC) || '1';
  const direction = block.getFieldValue('DIRECTION') || 'AUTO';
  const symbolSuffix = seeedGfxGetBlockSymbolSuffix(block);
  const targetVariable = `seeed_gfx_animation_target_${symbolSuffix}`;
  const countVariable = `seeed_gfx_animation_frame_count_${symbolSuffix}`;

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

if (Blockly.Extensions.isRegistered('seeed_gfx_animation_play_dynamic_inputs')) {
  Blockly.Extensions.unregister('seeed_gfx_animation_play_dynamic_inputs');
}

Blockly.Extensions.register('seeed_gfx_animation_play_dynamic_inputs', function() {
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
