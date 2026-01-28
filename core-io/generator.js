Arduino.forBlock["io_pin_digi"] = function (block, generator) {
  const code = block.getFieldValue("PIN");
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["io_mode"] = function (block, generator) {
  const code = block.getFieldValue("MODE");
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["io_state"] = function (block, generator) {
  const code = block.getFieldValue("STATE");
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["io_pin_adc"] = function (block, generator) {
  const code = block.getFieldValue("PIN");
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["io_pin_pwm"] = function (block, generator) {
  const code = block.getFieldValue("PIN");
  return [code, Arduino.ORDER_ATOMIC];
};

// 检查指定引脚是否在当前 workspace 中被 io_pinmode 块手动设置了模式
function isPinModeSetByBlock(block, generator, targetPin) {
  const workspace = block.workspace;
  if (!workspace) return false;
  
  // 获取当前 workspace 中所有的 io_pinmode 块
  const pinModeBlocks = workspace.getBlocksByType("io_pinmode", false);
  
  for (const pinModeBlock of pinModeBlocks) {
    // 获取该块设置的引脚
    const pin = generator.valueToCode(pinModeBlock, "PIN", Arduino.ORDER_ATOMIC);
    if (pin === targetPin) {
      return true;
    }
  }
  return false;
}

Arduino.forBlock["io_pinmode"] = function (block, generator) {
  const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);
  const mode = generator.valueToCode(block, "MODE", Arduino.ORDER_ATOMIC);

  return `pinMode(${pin}, ${mode});\n`;
};
Arduino.forBlock["io_digitalread"] = function (block, generator) {
  const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);

  // 如果引脚没有被 io_pinmode 块设置过模式，则自动添加pinMode
  if (!isPinModeSetByBlock(block, generator, pin)) {
    generator.addSetupBegin(`pinMode_${pin}`, `pinMode(${pin}, INPUT);`);
  }

  return [`digitalRead(${pin})`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["io_digitalwrite"] = function (block, generator) {
  const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);
  const value = generator.valueToCode(block, "STATE", Arduino.ORDER_ATOMIC);

  // 如果引脚没有被 io_pinmode 块设置过模式，则自动添加pinMode
  if (!isPinModeSetByBlock(block, generator, pin)) {
    generator.addSetupBegin(`pinMode_${pin}`, `pinMode(${pin}, OUTPUT);`);
  }

  return `digitalWrite(${pin}, ${value});\n`;
};

Arduino.forBlock["io_analogread"] = function (block, generator) {
  const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);
  return [`analogRead(${pin})`, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["io_analogwrite"] = function (block, generator) {
  const pin = generator.valueToCode(block, "PIN", Arduino.ORDER_ATOMIC);
  const value = generator.valueToCode(block, "PWM", Arduino.ORDER_ATOMIC);
  return `analogWrite(${pin}, ${value});\n`;
};
