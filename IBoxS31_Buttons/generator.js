// IBoxS31_Keys：XL9555 按键扩展（I2C 0x27）

// 引脚和 I2C 地址按智盒板 IBox S31 写死，换成别的板时在代码里留个提醒
Arduino.iboxs31BoardNote = function () {
  try {
    const boardConfig = window['boardConfig'];
    const name = boardConfig && boardConfig.name ? String(boardConfig.name) : '';
    if (name && !/ibox\s*s31/i.test(name)) {
      return '// 注意：当前开发板是 ' + name + '，本库按智盒板 IBox S31 的引脚和 I2C 地址编写\n';
    }
  } catch (e) {}
  return '';
};

Arduino.iboxs31KeysEnsure = function (generator) {
  generator.addLibrary('IBoxS31_Keys', '#include <IBoxS31_Keys.h>');
  generator.addVariable('iboxs31_keys', 'IBoxS31_Keys iboxs31_keys;');
};

Arduino.forBlock['iboxs31_keys_init'] = function (block, generator) {
  Arduino.iboxs31KeysEnsure(generator);
  // 每轮循环采样一次，"刚按下 / 刚松开" 只在这一轮为真
  generator.addLoopBegin('iboxs31_keys_update', 'iboxs31_keys.update();\n');
  return Arduino.iboxs31BoardNote() + 'iboxs31_keys.begin(Wire, IBoxS31_Keys::ADDR, 0, 1);\n';
};

Arduino.forBlock['iboxs31_keys_key'] = function (block, generator) {
  const keys = ['IBOX_KEY_UP', 'IBOX_KEY_DOWN', 'IBOX_KEY_LEFT', 'IBOX_KEY_RIGHT', 'IBOX_KEY_OK', 'IBOX_KEY_A', 'IBOX_KEY_B'];
  const key = keys.indexOf(block.getFieldValue('KEY')) >= 0 ? block.getFieldValue('KEY') : 'IBOX_KEY_OK';
  const state = block.getFieldValue('STATE');
  Arduino.iboxs31KeysEnsure(generator);
  if (state === 'PRESSED') return ['iboxs31_keys.wasPressed(' + key + ')', generator.ORDER_FUNCTION_CALL];
  if (state === 'RELEASED') return ['((iboxs31_keys.released() & ' + key + ') != 0)', generator.ORDER_ATOMIC];
  return ['iboxs31_keys.isPressed(' + key + ')', generator.ORDER_FUNCTION_CALL];
};
