// XL9555：XL9555 / PCA9555 IO 扩展。引脚先用 xl9555_name_pin 起名字（登记成 XL9555Pin 类型的变量），
// 按键、读写积木的下拉框按名字选。每个名字生成一个全局常量 XL9555Pin（引脚号 + 按下是否为低），
// 其他积木直接引用它；用了没命名过的名字会在编译时报"未声明"

// I2C 引脚按板卡选：aily_iic 设过的自定义引脚 > 芯片自己的板卡配置 > 板卡 i2cPins > Wire 默认引脚
Arduino.xl9555WireBegin = function (generator, devicePins) {
  generator.addLibrary('Wire', '#include <Wire.h>');
  let pins = null;
  try {
    const board = window['boardConfig'] || {};
    const custom = window['customI2CPins'] && window['customI2CPins']['Wire'];
    const pick = list => {
      const sda = list && list.find(p => p[0] === 'SDA');
      const scl = list && list.find(p => p[0] === 'SCL');
      return sda && scl ? { sda: sda[1], scl: scl[1] } : null;
    };
    if (custom) pins = pick(custom);
    else if (devicePins && devicePins.sda != null && devicePins.scl != null) pins = { sda: devicePins.sda, scl: devicePins.scl };
    else pins = pick(board.i2cPins && board.i2cPins['Wire']);
    // 只有 ESP32 的 Wire.begin 能带引脚
    if (!(board.core && String(board.core).indexOf('esp32') > -1)) pins = null;
  } catch (e) {
    pins = null;
  }
  const code = pins ? 'Wire.begin(' + pins.sda + ', ' + pins.scl + ');' : 'Wire.begin();';
  let old = null;
  try {
    old = generator.codeDict.setups_begin['wire_Wire_begin'];
  } catch (e) {}
  generator.addSetupBegin('wire_Wire_begin', code, !!(pins && old && /\.begin\(\s*\)/.test(old)));
};

// 当前开发板 board.json 里的某项配置（没有就是 null）
Arduino.xl9555BoardConfig = function (key) {
  try {
    const board = window['boardConfig'];
    return board && board[key] ? board[key] : null;
  } catch (e) {
    return null;
  }
};

const XL9555_PIN_TYPE = 'XL9555Pin';

Arduino.xl9555Ensure = function (generator) {
  generator.addLibrary('XL9555', '#include <XL9555.h>');
  generator.addVariable('xl9555', 'XL9555 xl9555;');
};

// 名字转成 C++ 标识符：字母数字下划线照抄，其他字符（中文等）换成 _ + 十六进制码
Arduino.xl9555Ident = function (name) {
  let id = '';
  for (const ch of String(name || '')) id += /[A-Za-z0-9_]/.test(ch) ? ch : '_' + ch.codePointAt(0).toString(16).toUpperCase();
  return 'xl9555_' + (id || 'pin');
};

Arduino.xl9555PinIdent = function (block) {
  const field = block.getField('NAME');
  return Arduino.xl9555Ident(field ? field.getText() : '');
};

Arduino.forBlock['xl9555_init'] = function (block, generator) {
  const addr = block.getFieldValue('ADDRESS') || '0';
  Arduino.xl9555Ensure(generator);
  Arduino.xl9555WireBegin(generator);
  // 每轮循环读一次全部输入，"刚按下 / 刚松开" 只在这一轮为真
  generator.addLoopBegin('xl9555_update', 'xl9555.update();\n');
  return 'xl9555.begin(Wire, ' + (addr === '0' ? '0' : addr) + ');\n';
};

Arduino.forBlock['xl9555_name_pin'] = function (block, generator) {
  const pin = Math.min(15, Math.max(0, Number(block.getFieldValue('PIN')) || 0));
  const mode = block.getFieldValue('MODE') || 'KEY_LOW';
  const name = block.getFieldValue('NAME') || 'key1';
  // 名字登记成 XL9555Pin 类型的变量，改名时同步改掉其他积木里选的名字
  if (!block._xl9555NameAttached) {
    block._xl9555NameAttached = true;
    block._xl9555LastName = name;
    const field = block.getField('NAME');
    if (field) {
      const original = field.onFinishEditing_;
      field.onFinishEditing_ = function (newName) {
        if (typeof original === 'function') original.call(this, newName);
        const oldName = block._xl9555LastName;
        if (newName && newName !== oldName && typeof renameVariableInBlockly === 'function') {
          renameVariableInBlockly(block, oldName, newName, XL9555_PIN_TYPE);
          block._xl9555LastName = newName;
        }
      };
    }
  }
  if (typeof registerVariableToBlockly === 'function') registerVariableToBlockly(name, XL9555_PIN_TYPE);
  Arduino.xl9555Ensure(generator);
  const id = Arduino.xl9555Ident(name);
  const label = 'P' + (pin >> 3) + (pin & 7);
  const comment = String(name).replace(/[\r\n]/g, ' ') + ' = ' + label;
  generator.addVariable(id, 'const XL9555Pin ' + id + ' = { ' + pin + ', ' + (mode === 'KEY_HIGH' ? 'false' : 'true') + ' };  // ' + comment);
  return 'xl9555.pinMode(' + id + '.pin, ' + (mode === 'OUTPUT' ? 'OUTPUT' : 'INPUT') + ');\n';
};

Arduino.forBlock['xl9555_key'] = function (block, generator) {
  const id = Arduino.xl9555PinIdent(block);
  const state = block.getFieldValue('STATE');
  Arduino.xl9555Ensure(generator);
  const fn = state === 'PRESSED' ? 'pressed' : state === 'RELEASED' ? 'released' : 'held';
  return ['xl9555.' + fn + '(' + id + '.pin, ' + id + '.activeLow)', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['xl9555_write'] = function (block, generator) {
  const id = Arduino.xl9555PinIdent(block);
  const level = block.getFieldValue('LEVEL') === 'LOW' ? 'LOW' : 'HIGH';
  Arduino.xl9555Ensure(generator);
  return 'xl9555.digitalWrite(' + id + '.pin, ' + level + ');\n';
};

Arduino.forBlock['xl9555_read'] = function (block, generator) {
  const id = Arduino.xl9555PinIdent(block);
  Arduino.xl9555Ensure(generator);
  return ['xl9555.digitalRead(' + id + '.pin)', generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock['xl9555_ok'] = function (block, generator) {
  Arduino.xl9555Ensure(generator);
  return ['xl9555.connected()', generator.ORDER_FUNCTION_CALL];
};
