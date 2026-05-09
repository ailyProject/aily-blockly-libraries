"use strict";

const SEEED_IR_PROTOCOLS = [
  ["P01_NEC", "#include <IRLib_P01_NEC.h>"],
  ["P02_Sony", "#include <IRLib_P02_Sony.h>"],
  ["P03_RC5", "#include <IRLib_P03_RC5.h>"],
  ["P04_RC6", "#include <IRLib_P04_RC6.h>"],
  ["P05_PanasonicOld", "#include <IRLib_P05_Panasonic_Old.h>"],
  ["P06_JVC", "#include <IRLib_P06_JVC.h>"],
  ["P07_NECx", "#include <IRLib_P07_NECx.h>"],
  ["P08_Samsung36", "#include <IRLib_P08_Samsung36.h>"],
  ["P09_GICable", "#include <IRLib_P09_GICable.h>"],
  ["P10_DirecTV", "#include <IRLib_P10_DirecTV.h>"],
  ["P11_RCMM", "#include <IRLib_P11_RCMM.h>"],
  ["P12_CYKM", "#include <IRLib_P12_CYKM.h>"]
];

function ensureSeeedIrCore(generator) {
  generator.addLibrary("SeeedIR_SendBase", "#include <IRLibSendBase.h>");
  generator.addLibrary("SeeedIR_DecodeBase", "#include <IRLibDecodeBase.h>");
  generator.addLibrary("SeeedIR_HashRaw", "#include <IRLib_HashRaw.h>");
  SEEED_IR_PROTOCOLS.forEach(function(item) {
    generator.addLibrary("SeeedIR_" + item[0], item[1]);
  });
  generator.addLibrary("SeeedIR_Combo", "#include <IRLibCombo.h>");
}

function ensureSeeedIrReceive(generator) {
  ensureSeeedIrCore(generator);
  generator.addLibrary("SeeedIR_RecvPCI", "#include <IRLibRecvPCI.h>");
}

function ensureSeeedIrProtocolNameHelper(generator) {
  ensureSeeedIrCore(generator);
  generator.addFunction(
    "aily_seeed_ir_protocol_name",
    "String ailySeeedIrProtocolName(uint8_t protocol) {\n" +
      "  return String(Pnames(protocol));\n" +
      "}\n"
  );
}

function ensureSerialBegin(generator) {
  if (generator && typeof generator.addSetupBegin === "function") {
    generator.addSetupBegin("seeed_ir_serial_begin", "Serial.begin(9600);\n", false);
  } else if (typeof Arduino !== "undefined" && typeof Arduino.addSetupBegin === "function") {
    Arduino.addSetupBegin("seeed_ir_serial_begin", "  Serial.begin(9600);\n");
  }
}

function addGlobalDeclaration(generator, key, declaration) {
  if (generator && typeof generator.addObject === "function") {
    generator.addObject(key, declaration);
  } else {
    generator.addVariable(key, declaration);
  }
}

function attachFieldInputVarMonitor(block, fieldName, varType, defaultName, monitorKey) {
  const currentName = block.getFieldValue(fieldName) || defaultName;
  registerVariableToBlockly(currentName, varType);

  if (block[monitorKey]) {
    return;
  }

  block[monitorKey] = true;
  const lastNameKey = monitorKey + "LastName";
  block[lastNameKey] = currentName;
  const varField = block.getField(fieldName);
  if (!varField) {
    return;
  }

  const originalFinishEditing = varField.onFinishEditing_;
  varField.onFinishEditing_ = function(newName) {
    if (typeof originalFinishEditing === "function") {
      originalFinishEditing.call(this, newName);
    }

    const workspace = block.workspace ||
      (typeof Blockly !== "undefined" && Blockly.getMainWorkspace && Blockly.getMainWorkspace());
    const oldName = block[lastNameKey];
    if (workspace && newName && newName !== oldName) {
      renameVariableInBlockly(block, oldName, newName, varType);
      block[lastNameKey] = newName;
    }
  };
}

function getVarNameFromVAR(block, fallback) {
  const varField = block.getField('VAR');
  return varField ? varField.getText() : fallback;
}

function getFieldVariableName(block, fieldName, fallback) {
  const varField = block.getField(fieldName);
  return varField ? varField.getText() : fallback;
}

function valueCode(generator, block, name, fallback) {
  return generator.valueToCode(block, name, generator.ORDER_ATOMIC) || fallback;
}

function stripQuotedTextLiteral(code) {
  const trimmed = (code || "").trim();
  const match = trimmed.match(/^(["'])([\s\S]*)\1$/);
  return match ? match[2] : trimmed;
}

function ensureWioTerminalBoardHint() {
  const boardConfig = typeof window !== "undefined" ? window["boardConfig"] : null;
  return !!(boardConfig && JSON.stringify(boardConfig).indexOf("Wio") !== -1);
}

Arduino.forBlock["seeed_ir_sender_create"] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || "irSender";
  attachFieldInputVarMonitor(block, "VAR", "IRsend", "irSender", "_seeedIrSenderVarMonitorAttached");
  ensureSeeedIrCore(generator);
  addGlobalDeclaration(generator, "seeed_ir_sender_" + varName, "IRsend " + varName + ";");
  ensureWioTerminalBoardHint();
  return "";
};

Arduino.forBlock["seeed_ir_raw_sender_create"] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || "rawSender";
  attachFieldInputVarMonitor(block, "VAR", "IRsendRaw", "rawSender", "_seeedIrRawSenderVarMonitorAttached");
  ensureSeeedIrCore(generator);
  addGlobalDeclaration(generator, "seeed_ir_raw_sender_" + varName, "IRsendRaw " + varName + ";");
  return "";
};

Arduino.forBlock["seeed_ir_send"] = function(block, generator) {
  const varName = getVarNameFromVAR(block, "irSender");
  const protocol = block.getFieldValue("PROTOCOL") || "NEC";
  const data = valueCode(generator, block, "DATA", "0");
  const data2 = valueCode(generator, block, "DATA2", "0");
  const khz = valueCode(generator, block, "KHZ", "38");
  ensureSeeedIrCore(generator);
  return varName + ".send(" + protocol + ", " + data + ", " + data2 + ", " + khz + ");\n";
};

Arduino.forBlock["seeed_ir_send_nec"] = function(block, generator) {
  const varName = getVarNameFromVAR(block, "irSender");
  const data = valueCode(generator, block, "DATA", "1637937167");
  const khz = valueCode(generator, block, "KHZ", "38");
  ensureSeeedIrCore(generator);
  return varName + ".send(NEC, " + data + ", 0, " + khz + ");\n";
};

Arduino.forBlock["seeed_ir_wio_send"] = function(block, generator) {
  const protocol = block.getFieldValue("PROTOCOL") || "NEC";
  const data = valueCode(generator, block, "DATA", "1637937167");
  const data2 = valueCode(generator, block, "DATA2", "0");
  const khz = valueCode(generator, block, "KHZ", "38");
  ensureSeeedIrCore(generator);
  addGlobalDeclaration(generator, "seeed_ir_wio_sender", "IRsend ailyWioIrSender;");
  ensureWioTerminalBoardHint();
  return "ailyWioIrSender.send(" + protocol + ", " + data + ", " + data2 + ", " + khz + ");\n";
};

Arduino.forBlock["seeed_ir_send_raw"] = function(block, generator) {
  const varName = getVarNameFromVAR(block, "rawSender");
  const rawText = stripQuotedTextLiteral(valueCode(generator, block, "DATA", '"9000,4500,560,560"'));
  const khz = valueCode(generator, block, "KHZ", "38");
  ensureSeeedIrCore(generator);
  return "{\n" +
    "  uint16_t ailySeeedIrRawData[] = {" + rawText + "};\n" +
    "  " + varName + ".send(ailySeeedIrRawData, sizeof(ailySeeedIrRawData) / sizeof(ailySeeedIrRawData[0]), " + khz + ");\n" +
    "}\n";
};

Arduino.forBlock["seeed_ir_receiver_create"] = function(block, generator) {
  const varName = block.getFieldValue('VAR') || "irReceiver";
  const decoderName = block.getFieldValue("DECODER") || "irDecoder";
  const pin = block.getFieldValue("PIN") || "2";
  attachFieldInputVarMonitor(block, "VAR", "IRrecvPCI", "irReceiver", "_seeedIrReceiverVarMonitorAttached");
  attachFieldInputVarMonitor(block, "DECODER", "IRdecode", "irDecoder", "_seeedIrDecoderVarMonitorAttached");
  ensureSeeedIrReceive(generator);
  addGlobalDeclaration(generator, "seeed_ir_receiver_" + varName, "IRrecvPCI " + varName + "(" + pin + ");");
  addGlobalDeclaration(generator, "seeed_ir_decoder_" + decoderName, "IRdecode " + decoderName + ";");
  return "";
};

Arduino.forBlock["seeed_ir_receiver_enable"] = function(block, generator) {
  const varName = getVarNameFromVAR(block, "irReceiver");
  ensureSeeedIrReceive(generator);
  return varName + ".enableIRIn();\n";
};

Arduino.forBlock["seeed_ir_on_receive"] = function(block, generator) {
  const varName = getVarNameFromVAR(block, "irReceiver");
  const decoderName = getFieldVariableName(block, "DECODER", "irDecoder");
  const statements = generator.statementToCode(block, "DO") || "";
  ensureSeeedIrReceive(generator);
  return "if (" + varName + ".getResults()) {\n" +
    "  " + decoderName + ".decode();\n" +
    statements +
    "  " + varName + ".enableIRIn();\n" +
    "}\n";
};

Arduino.forBlock["seeed_ir_receiver_available"] = function(block, generator) {
  const varName = getVarNameFromVAR(block, "irReceiver");
  ensureSeeedIrReceive(generator);
  return [varName + ".getResults()", generator.ORDER_ATOMIC];
};

Arduino.forBlock["seeed_ir_decoder_decode"] = function(block, generator) {
  const decoderName = getFieldVariableName(block, "DECODER", "irDecoder");
  ensureSeeedIrCore(generator);
  return decoderName + ".decode();\n";
};

Arduino.forBlock["seeed_ir_decoder_get"] = function(block, generator) {
  const decoderName = getFieldVariableName(block, "DECODER", "irDecoder");
  const field = block.getFieldValue("FIELD") || "VALUE";
  const fieldMap = {
    PROTOCOL: "protocolNum",
    VALUE: "value",
    ADDRESS: "address",
    BITS: "bits"
  };
  ensureSeeedIrCore(generator);
  return [decoderName + "." + (fieldMap[field] || "value"), generator.ORDER_ATOMIC];
};

Arduino.forBlock["seeed_ir_decoder_protocol_name"] = function(block, generator) {
  const decoderName = getFieldVariableName(block, "DECODER", "irDecoder");
  ensureSeeedIrProtocolNameHelper(generator);
  return ["ailySeeedIrProtocolName(" + decoderName + ".protocolNum)", generator.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["seeed_ir_decoder_dump"] = function(block, generator) {
  const decoderName = getFieldVariableName(block, "DECODER", "irDecoder");
  const verbose = block.getFieldValue("VERBOSE") || "true";
  ensureSeeedIrCore(generator);
  ensureSerialBegin(generator);
  return decoderName + ".dumpResults(" + verbose + ");\n";
};

Arduino.forBlock["seeed_ir_receiver_resume"] = function(block, generator) {
  const varName = getVarNameFromVAR(block, "irReceiver");
  ensureSeeedIrReceive(generator);
  return varName + ".enableIRIn();\n";
};