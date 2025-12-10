'use strict';

// Seeed_GFX库的代码生成器
// 支持TFT_eSPI、TFT_eSprite和EPaper类

if (!Arduino.seeed_gfx) {
  Arduino.seeed_gfx = true;
  Arduino.seeed_gfx_type = '';
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
        if (event.oldJson && event.oldJson.type === 'seeed_gfx_init') {
          Arduino.seeed_gfx_type = '';
          console.log('delete BOARD_SCREEN_COMBO macro');
          window['projectService'].removeMacro('BOARD_SCREEN_COMBO')
            .then(() => console.log('✅ 宏定义已移除'))
            .catch(err => console.error('❌ 失败:', err));
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
  // const varField = block.getField('VAR');
  const varName = 'tft';

  const modelType = block.getFieldValue('MODEL') || 'Seeed_Wio_Terminal_500';
  const modelParts = modelType.split('_');
  const model = modelParts.pop();
  // window.add();
  if (Arduino.seeed_gfx_type !== model) {
    Arduino.seeed_gfx_type = model;
    console.log('Selected model:', model);
    console.log('data: ', window['packageJson']);

    if (window['projectService']) {
      window['projectService'].addMacro(`BOARD_SCREEN_COMBO=${model}`)
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

  // generator.addMacro('BOARD_SCREEN_COMBO', '#define BOARD_SCREEN_COMBO ' + model + '\n');
  // 添加库引用
  generator.addLibrary('TFT_eSPI', '#include <TFT_eSPI.h>');
  generator.addLibrary('SPI', '#include <SPI.h>');
  
  // 注册变量
  registerVariableToBlockly(varName, 'TFT_eSPI');
  generator.addVariable(varName, 'TFT_eSPI ' + varName + ' = TFT_eSPI();');
  
  // 生成初始化代码
  return varName + '.init();\n';
};

// 填充屏幕
Arduino.forBlock['seeed_gfx_fill_screen'] = function(block, generator) {
  // const varField = block.getField('VAR');
  const varName = 'tft';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.fillScreen(' + color + ');\n';
};

// 设置旋转
Arduino.forBlock['seeed_gfx_set_rotation'] = function(block, generator) {
  // const varField = block.getField('VAR');
  const varName = 'tft';
  const rotation = block.getFieldValue('ROTATION') || '0';
  
  return varName + '.setRotation(' + rotation + ');\n';
};

// 画点
Arduino.forBlock['seeed_gfx_draw_pixel'] = function(block, generator) {
  // const varField = block.getField('VAR');
  const varName = 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.drawPixel(' + x + ', ' + y + ', ' + color + ');\n';
};

// 画线
Arduino.forBlock['seeed_gfx_draw_line'] = function(block, generator) {
  // const varField = block.getField('VAR');
  const varName = 'tft';
  const x1 = generator.valueToCode(block, 'X1', generator.ORDER_ATOMIC) || '0';
  const y1 = generator.valueToCode(block, 'Y1', generator.ORDER_ATOMIC) || '0';
  const x2 = generator.valueToCode(block, 'X2', generator.ORDER_ATOMIC) || '0';
  const y2 = generator.valueToCode(block, 'Y2', generator.ORDER_ATOMIC) || '0';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.drawLine(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ', ' + color + ');\n';
};

// 画矩形
Arduino.forBlock['seeed_gfx_draw_rect'] = function(block, generator) {
  // const varField = block.getField('VAR');
  const varName = 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '10';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '10';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.drawRect(' + x + ', ' + y + ', ' + width + ', ' + height + ', ' + color + ');\n';
};

// 填充矩形
Arduino.forBlock['seeed_gfx_fill_rect'] = function(block, generator) {
  // const varField = block.getField('VAR');
  const varName = 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '10';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '10';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.fillRect(' + x + ', ' + y + ', ' + width + ', ' + height + ', ' + color + ');\n';
};

// 画矩形
Arduino.forBlock['seeed_gfx_draw_round_rect'] = function(block, generator) {
  // const varField = block.getField('VAR');
  const varName = 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '10';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '10';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.drawRoundRect(' + x + ', ' + y + ', ' + width + ', ' + height + ', ' + color + ');\n';
};

// 填充矩形
Arduino.forBlock['seeed_gfx_fill_round_rect'] = function(block, generator) {
  // const varField = block.getField('VAR');
  const varName = 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const width = generator.valueToCode(block, 'WIDTH', generator.ORDER_ATOMIC) || '10';
  const height = generator.valueToCode(block, 'HEIGHT', generator.ORDER_ATOMIC) || '10';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.fillRoundRect(' + x + ', ' + y + ', ' + width + ', ' + height + ', ' + color + ');\n';
};

// 画圆
Arduino.forBlock['seeed_gfx_draw_circle'] = function(block, generator) {
  // const varField = block.getField('VAR');
  const varName = 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const radius = generator.valueToCode(block, 'RADIUS', generator.ORDER_ATOMIC) || '5';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.drawCircle(' + x + ', ' + y + ', ' + radius + ', ' + color + ');\n';
};

// 填充圆
Arduino.forBlock['seeed_gfx_fill_circle'] = function(block, generator) {
  // const varField = block.getField('VAR');
  const varName = 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  const radius = generator.valueToCode(block, 'RADIUS', generator.ORDER_ATOMIC) || '5';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.fillCircle(' + x + ', ' + y + ', ' + radius + ', ' + color + ');\n';
};

// 设置文字颜色
Arduino.forBlock['seeed_gfx_set_text_color'] = function(block, generator) {
  // const varField = block.getField('VAR');
  const varName = 'tft';
  const color = generator.valueToCode(block, 'COLOR', generator.ORDER_ATOMIC) || '0';
  const bgcolor = generator.valueToCode(block, 'BGCOLOR', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.setTextColor(' + color + ', ' + bgcolor + ');\n';
};

// 设置文字大小
Arduino.forBlock['seeed_gfx_set_text_size'] = function(block, generator) {
  // const varField = block.getField('VAR');
  const varName = 'tft';
  const size = block.getFieldValue('SIZE') || '1';
  
  return varName + '.setTextSize(' + size + ');\n';
};

// 设置光标位置
Arduino.forBlock['seeed_gfx_set_cursor'] = function(block, generator) {
  // const varField = block.getField('VAR');
  const varName = 'tft';
  const x = generator.valueToCode(block, 'X', generator.ORDER_ATOMIC) || '0';
  const y = generator.valueToCode(block, 'Y', generator.ORDER_ATOMIC) || '0';
  
  return varName + '.setCursor(' + x + ', ' + y + ');\n';
};

// 打印文字
Arduino.forBlock['seeed_gfx_print'] = function(block, generator) {
  // const varField = block.getField('VAR');
  const varName = 'tft';
  const text = generator.valueToCode(block, 'TEXT', generator.ORDER_ATOMIC) || '""';
  
  return varName + '.print(' + text + ');\n';
};

// 显示文字
Arduino.forBlock['seeed_gfx_draw_string'] = function(block, generator) {
  // const varField = block.getField('VAR');
  const varName = 'tft';
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
  const varField = block.getField('VAR');
  const varName = varField ? varField.getText() : 'epaper';
  
  // 添加库引用
  generator.addLibrary('Seeed_GFX_EPaper', '#include <EPaper.h>');
  
  // 注册变量
  registerVariableToBlockly(varName, 'EPaper');
  generator.addVariable(varName, 'EPaper ' + varName + ';');
  
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
  const color = block.getFieldValue('COLOR');

  // 解析十六进制颜色
  
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return ['tft.color565(' + r + ', ' + g + ', ' + b + ')', generator.ORDER_ATOMIC];
};