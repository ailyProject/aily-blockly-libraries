const IR_KEY_CODES = {
  CH_MINUS: 69,
  CHANNEL: 70,
  CH_PLUS: 71,
  PREV: 68,
  NEXT: 64,
  PLAY_PAUSE: 67,
  VOL_DOWN: 7,
  VOL_UP: 21,
  EQ: 9,
};

Arduino.forBlock["QuickTesting"] = function (block, generator) {
  var irpin = block.getFieldValue("IRPIN");

  generator.addLibrary(
    "MARK_EXCESS_MICROS",
    "#define MARK_EXCESS_MICROS    20",
  );
  generator.addLibrary("#include <IRremote.hpp>", "#include <IRremote.hpp>");
  generator.addSetupBegin(
    irpin + "irqkbegin",
    "Serial.begin(115200);\n  while(!Serial)\n   ;\n  IrReceiver.begin(" +
      irpin +
      ", ENABLE_LED_FEEDBACK);",
  );
  var code =
    "if(IrReceiver.decode()) {\n  IrReceiver.printIRResultShort(&Serial);\n  IrReceiver.resume();\n}";
  return code;
};

Arduino.forBlock["irrecv_begin_in"] = function (block, generator) {
  var irpinin = block.getFieldValue("IRPININ");

  generator.addLibrary(
    "MARK_EXCESS_MICROS",
    "#define MARK_EXCESS_MICROS    20",
  );
  generator.addLibrary("#include <IRremote.hpp>", "#include <IRremote.hpp>");
  generator.addSetupBegin(
    irpinin + "irqkbegin",
    "IrReceiver.begin(" + irpinin + ", ENABLE_LED_FEEDBACK);",
  );
  return "";
};

Arduino.forBlock["irrecv_begin_out"] = function (block, generator) {
  var irpinout = block.getFieldValue("IRPINOUT");

  generator.addLibrary("#include <IRremote.hpp>", "#include <IRremote.hpp>");
  generator.addSetupBegin(
    irpinout + "irbeginout",
    "IrReceiver.begin(" + irpinout + ");",
  );
  return "";
};

Arduino.forBlock["irrecv_datain"] = function (block, generator) {
  const branch = Arduino.statementToCode(block, "IRDATA");
  var code =
    "if (IrReceiver.decode()) {\n" +
    "if(!(IrReceiver.decodedIRData.flags & IRDATA_FLAGS_WAS_OVERFLOW)) {\n" +
    branch +
    "  IrReceiver.resume();\n}" +
    "}\n";
  return code;
};

Arduino.forBlock["irrecv_irdata"] = function (block, generator) {
  var code = "IrReceiver.decodedIRData.command";
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["irrecv_irsend"] = function (block, generator) {
  // 获取输入引脚
  const address =
    generator.valueToCode(block, "IRADDRESS", Arduino.ORDER_ATOMIC) || "0";
  const data =
    generator.valueToCode(block, "IROUTDATA", Arduino.ORDER_ATOMIC) || "0";

  // 生成红外发射代码
  const code = `IrSender.sendNEC(${address}, ${data}, 0);//后需要延时至少5ms再发送\n`;
  return code;
};

Arduino.forBlock["irrecv_on_key"] = function (block, generator) {
  const keyName = block.getFieldValue("IRKEY") || "";
  const keyValue = IR_KEY_CODES[keyName] || 0;
  const branch = Arduino.statementToCode(block, "HANDLER");
  const loopKey = `irrecv_on_key_${block.id}`;
  const debounceValue =
    generator.valueToCode(block, "DEBOUNCE", Arduino.ORDER_ATOMIC) || "150";
  const safeId = block.id ? block.id.replace(/[^a-zA-Z0-9_]/g, "_") : "0";
  const debounceVar = `_irremote_last_trigger_${safeId}`;

  generator.addLibrary(
    "MARK_EXCESS_MICROS",
    "#define MARK_EXCESS_MICROS    20",
  );
  generator.addLibrary("#include <IRremote.hpp>", "#include <IRremote.hpp>");

  generator.addVariable(
    "_irremote_last_command",
    "uint16_t _irremote_last_command = 0;",
  );
  generator.addVariable(debounceVar, `unsigned long ${debounceVar} = 0;`);

  const code = `if (IrReceiver.decode()) {
  uint16_t _irremote_current_command = IrReceiver.decodedIRData.command;
  if (IrReceiver.decodedIRData.flags & IRDATA_FLAGS_IS_REPEAT) {
    _irremote_current_command = _irremote_last_command;
  } else {
    _irremote_last_command = _irremote_current_command;
  }
  if (!(IrReceiver.decodedIRData.flags & IRDATA_FLAGS_WAS_OVERFLOW)) {
    if (_irremote_current_command == ${keyValue}) {
      unsigned long _irremote_now = millis();
      if (_irremote_now - ${debounceVar} >= ${debounceValue}) {
        ${debounceVar} = _irremote_now;
${branch}      }
    }
  }
  IrReceiver.resume();
}
`;
  generator.addLoop(loopKey, code);
  return "";
};
