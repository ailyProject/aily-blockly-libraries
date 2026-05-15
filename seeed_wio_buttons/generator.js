/**
 * Wio Terminal Buttons & 5-Way Switch Generator
 * @description 代码生成器 - Wio Terminal 按键与5向开关
 *
 * 硬件说明：
 *   - 三个可配置按键：WIO_KEY_A, WIO_KEY_B, WIO_KEY_C（低电平有效，上拉输入）
 *   - 5向开关：WIO_5S_UP, WIO_5S_DOWN, WIO_5S_LEFT, WIO_5S_RIGHT, WIO_5S_PRESS（低电平有效，上拉输入）
 *   - 宏定义已内置于 Wio Terminal 开发板包，无需额外库
 */

'use strict';

// ========== 检测可配置按键是否被按下 ==========
Arduino.forBlock['wio_button_is_pressed'] = function(block, generator) {
  const button = block.getFieldValue('BUTTON') || 'WIO_KEY_A';

  // 自动确保对应引脚已初始化（用唯一 tag 去重）
  const pinModeCode = 'pinMode(' + button + ', INPUT_PULLUP);';
  generator.addSetupEnd(pinModeCode, pinModeCode);

  // 按下时 digitalRead 返回 LOW
  return ['(digitalRead(' + button + ') == LOW)', generator.ORDER_ATOMIC];
};

// ========== 检测5向开关方向是否被拨动 ==========
Arduino.forBlock['wio_switch_is_pressed'] = function(block, generator) {
  const direction = block.getFieldValue('DIRECTION') || 'WIO_5S_UP';

  // 自动确保对应引脚已初始化（用唯一 tag 去重）
  const pinModeCode = 'pinMode(' + direction + ', INPUT_PULLUP);';
  generator.addSetupEnd(pinModeCode, pinModeCode);

  // 拨动时 digitalRead 返回 LOW
  return ['(digitalRead(' + direction + ') == LOW)', generator.ORDER_ATOMIC];
};
