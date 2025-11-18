const IRREMOTE_INCLUDE_KEY = "irremote_include";

const IR_PRESET_KEY_DEFINITIONS = [
  { name: "CH_MINUS", command: 69 },
  { name: "CHANNEL", command: 70 },
  { name: "CH_PLUS", command: 71 },
  { name: "PREV", command: 68 },
  { name: "NEXT", command: 64 },
  { name: "PLAY_PAUSE", command: 67 },
  { name: "VOL_DOWN", command: 7 },
  { name: "VOL_UP", command: 21 },
  { name: "EQ", command: 9 },
  { name: "NUM_0", command: 22 },
  { name: "NUM_1", command: 12 },
  { name: "NUM_2", command: 24 },
  { name: "NUM_3", command: 94 },
  { name: "NUM_4", command: 8 },
  { name: "NUM_5", command: 28 },
  { name: "NUM_6", command: 90 },
  { name: "NUM_7", command: 66 },
  { name: "NUM_8", command: 82 },
  { name: "NUM_9", command: 74 },
];

function ensureIrremote(generator) {
  generator.addLibrary(IRREMOTE_INCLUDE_KEY, "#include <IRremote.hpp>");
}

function ensurePresetHelper(generator) {
  const entries = IR_PRESET_KEY_DEFINITIONS.map(
    (item) => `  {${item.command}, "${item.name}"}`,
  ).join(",\n");
  const helperCode = `typedef struct {
  uint8_t command;
  const char* name;
} AilyIrPresetKey;

static const AilyIrPresetKey kAilyIrPresetKeys[] = {
${entries}
};

const char* ailyIrremoteGetPresetKeyName(uint16_t command) {
  for (size_t i = 0; i < sizeof(kAilyIrPresetKeys) / sizeof(kAilyIrPresetKeys[0]); i++) {
    if (kAilyIrPresetKeys[i].command == command) {
      return kAilyIrPresetKeys[i].name;
    }
  }
  return "";
}
`;
  generator.addFunction("aily_irremote_preset_helper", helperCode);
}

Arduino.forBlock["irremote_library_config"] = function (block, generator) {
  ensureIrremote(generator);
  const rawLength =
    generator.valueToCode(block, "RAW_LENGTH", generator.ORDER_ATOMIC) || "";
  const enableUniversal = block.getFieldValue("UNIVERSAL") === "TRUE";
  const keepExotic = block.getFieldValue("EXOTIC") === "TRUE";

  if (rawLength) {
    generator.addMacro(
      "irremote_raw_buffer_length",
      `#define RAW_BUFFER_LENGTH ${rawLength}`,
    );
  }

  if (!enableUniversal) {
    generator.addMacro(
      "irremote_exclude_universal",
      "#define EXCLUDE_UNIVERSAL_PROTOCOLS",
    );
  }

  if (!keepExotic) {
    generator.addMacro(
      "irremote_exclude_exotic",
      "#define EXCLUDE_EXOTIC_PROTOCOLS",
    );
  }

  return "";
};

Arduino.forBlock["irremote_receiver_begin"] = function (block, generator) {
  ensureIrremote(generator);
  const pin =
    generator.valueToCode(block, "PIN", generator.ORDER_ATOMIC) || "2";

  Arduino.addSetupBegin(
    "irremote_receiver_begin",
    `  IrReceiver.begin(${pin});\n`,
  );

  return "";
};

Arduino.forBlock["irremote_sender_begin"] = function (block, generator) {
  ensureIrremote(generator);
  const pin =
    generator.valueToCode(block, "PIN", generator.ORDER_ATOMIC) || "3";
  Arduino.addSetupBegin("irremote_sender_begin", `  IrSender.begin(${pin});\n`);

  return "";
};

Arduino.forBlock["irremote_on_receive"] = function (block, generator) {
  ensureIrremote(generator);
  const statements = generator.statementToCode(block, "DO");
  const userCode = statements || "";

  return `if (IrReceiver.decode()) {\n${userCode}  IrReceiver.resume();\n}\n`;
};

Arduino.forBlock["irremote_receiver_available"] = function (_block, generator) {
  ensureIrremote(generator);
  return ["IrReceiver.available()", generator.ORDER_ATOMIC];
};

Arduino.forBlock["irremote_get_value"] = function (block, generator) {
  ensureIrremote(generator);
  const field = block.getFieldValue("FIELD");
  let code = "IrReceiver.decodedIRData.command";

  switch (field) {
    case "ADDRESS":
      code = "IrReceiver.decodedIRData.address";
      break;
    case "COMMAND":
      code = "IrReceiver.decodedIRData.command";
      break;
    case "EXTRA":
      code = "IrReceiver.decodedIRData.extra";
      break;
    case "RAW":
      code = "IrReceiver.decodedIRData.decodedRawData";
      break;
    case "BITS":
      code = "IrReceiver.decodedIRData.numberOfBits";
      break;
    case "FLAGS":
      code = "IrReceiver.decodedIRData.flags";
      break;
    default:
      break;
  }

  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock["irremote_get_protocol"] = function (block, generator) {
  ensureIrremote(generator);
  const format = block.getFieldValue("FORMAT");

  if (format === "NAME") {
    return ["String(IrReceiver.getProtocolString())", generator.ORDER_ATOMIC];
  }

  return ["IrReceiver.decodedIRData.protocol", generator.ORDER_ATOMIC];
};

Arduino.forBlock["irremote_check_flag"] = function (block, generator) {
  ensureIrremote(generator);
  const flag = block.getFieldValue("FLAG");
  const flagMap = {
    REPEAT: "IRDATA_FLAGS_IS_REPEAT",
    AUTO_REPEAT: "IRDATA_FLAGS_IS_AUTO_REPEAT",
    PARITY: "IRDATA_FLAGS_PARITY_FAILED",
    TOGGLE: "IRDATA_FLAGS_TOGGLE_BIT",
    DIFF_REPEAT: "IRDATA_FLAGS_IS_PROTOCOL_WITH_DIFFERENT_REPEAT",
    EXTRA_INFO: "IRDATA_FLAGS_EXTRA_INFO",
  };
  const mask = flagMap[flag] || "IRDATA_FLAGS_IS_REPEAT";

  return [
    `(IrReceiver.decodedIRData.flags & ${mask}) != 0`,
    generator.ORDER_ATOMIC,
  ];
};

Arduino.forBlock["irremote_is_preset_key"] = function (block, generator) {
  ensureIrremote(generator);
  const command = block.getFieldValue("KEY") || "0";
  return [
    `(IrReceiver.decodedIRData.command == ${command})`,
    generator.ORDER_ATOMIC,
  ];
};

Arduino.forBlock["irremote_get_preset_name"] = function (block, generator) {
  ensureIrremote(generator);
  ensurePresetHelper(generator);
  const code = `String(ailyIrremoteGetPresetKeyName(IrReceiver.decodedIRData.command))`;
  return [code, generator.ORDER_ATOMIC];
};

Arduino.forBlock["irremote_resume"] = function (_block, generator) {
  ensureIrremote(generator);
  return "IrReceiver.resume();\n";
};

Arduino.forBlock["irremote_send_command"] = function (block, generator) {
  ensureIrremote(generator);
  const protocol = block.getFieldValue("PROTOCOL") || "NEC";
  const address =
    generator.valueToCode(block, "ADDRESS", generator.ORDER_ATOMIC) || "0";
  const command =
    generator.valueToCode(block, "COMMAND", generator.ORDER_ATOMIC) || "0";
  const repeat =
    generator.valueToCode(block, "REPEAT", generator.ORDER_ATOMIC) || "0";

  return `IrSender.write(${protocol}, ${address}, ${command}, ${repeat});\n`;
};
