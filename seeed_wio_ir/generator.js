"use strict";

(function registerWioIrGenerators() {
  // IRLibCombo requires the send base first, protocol headers in numeric order,
  // and the combo header last. Keeping stable library slots preserves that order
  // even when raw and protocol blocks appear in a different workspace order.
  const WIO_IR_PROTOCOLS = [
    { value: "NEC", include: "#include <IRLib_P01_NEC.h>" },
    { value: "SONY", include: "#include <IRLib_P02_Sony.h>" },
    { value: "RC5", include: "#include <IRLib_P03_RC5.h>" },
    { value: "RC6", include: "#include <IRLib_P04_RC6.h>" },
    { value: "PANASONIC_OLD", include: "#include <IRLib_P05_Panasonic_Old.h>" },
    { value: "JVC", include: "#include <IRLib_P06_JVC.h>" },
    { value: "NECX", include: "#include <IRLib_P07_NECx.h>" },
    { value: "SAMSUNG36", include: "#include <IRLib_P08_Samsung36.h>" },
    { value: "GICABLE", include: "#include <IRLib_P09_GICable.h>" },
    { value: "DIRECTV", include: "#include <IRLib_P10_DirecTV.h>" },
    { value: "RCMM", include: "#include <IRLib_P11_RCMM.h>" },
    { value: "CYKM", include: "#include <IRLib_P12_CYKM.h>" }
  ];

  function ensureWioIrLibrarySlots(generator) {
    const libraries = generator.codeDict && generator.codeDict.libraries;
    if (libraries && libraries.WioIR_SendBase === undefined) {
      generator._wioIrProtocolIncludes = Object.create(null);
    }
    generator.addLibrary("WioIR_SendBase", "#include <IRLibSendBase.h>");
    generator.addLibrary("WioIR_Protocols", "");
    generator.addLibrary("WioIR_HashRaw", "");
    generator.addLibrary("WioIR_Combo", "");
  }

  function getWioIrProtocol(protocol) {
    const normalized = String(protocol || "NEC").toUpperCase();
    return WIO_IR_PROTOCOLS.find(function(item) {
      return item.value === normalized;
    }) || WIO_IR_PROTOCOLS[0];
  }

  function getWioIrProtocolState(generator) {
    if (!generator._wioIrProtocolIncludes) {
      generator._wioIrProtocolIncludes = Object.create(null);
    }
    return generator._wioIrProtocolIncludes;
  }

  function updateWioIrProtocolIncludes(generator) {
    const selected = getWioIrProtocolState(generator);
    const includes = WIO_IR_PROTOCOLS.filter(function(item) {
      return selected[item.value];
    }).map(function(item) {
      return item.include;
    });
    generator.addLibrary("WioIR_Protocols", includes.join("\n"), true);
  }

  function addWioIrObject(generator, key, declaration) {
    if (typeof generator.addObject === "function") {
      generator.addObject(key, declaration);
    } else {
      generator.addVariable(key, declaration);
    }
  }

  function ensureWioIrProtocolSender(generator, protocol) {
    ensureWioIrLibrarySlots(generator);
    const selected = getWioIrProtocol(protocol);
    getWioIrProtocolState(generator)[selected.value] = true;
    updateWioIrProtocolIncludes(generator);
    generator.addLibrary("WioIR_Combo", "#include <IRLibCombo.h>", true);

    // Seeed_Arduino_IR maps IR_SEND_PWM_PIN to WIO_IR when the Wio Terminal
    // board definition is active, so sketches do not configure an output pin.
    addWioIrObject(generator, "wio_ir_sender", "IRsend ailyWioIrSender;");
    return selected.value;
  }

  function ensureWioIrRawSender(generator) {
    ensureWioIrLibrarySlots(generator);
    generator.addLibrary("WioIR_HashRaw", "#include <IRLib_HashRaw.h>", true);
    addWioIrObject(generator, "wio_ir_raw_sender", "IRsendRaw ailyWioIrRawSender;");
  }

  function valueCode(generator, block, inputName, fallback) {
    return generator.valueToCode(block, inputName, generator.ORDER_ATOMIC) || fallback;
  }

  function parseRawTimingLiteral(code) {
    const trimmed = String(code || "").trim();
    const quoted = trimmed.match(/^(["'])([\s\S]*)\1$/);
    if (!quoted) {
      return null;
    }

    const timingText = quoted[2].trim();
    if (!/^\d+(?:\s*,\s*\d+)*$/.test(timingText)) {
      return null;
    }

    const timings = timingText.split(",").map(function(value) {
      return Number(value.trim());
    });
    if (timings.length > 255 || timings.some(function(value) {
      return !Number.isInteger(value) || value < 1 || value > 65535;
    })) {
      return null;
    }
    return timings.join(", ");
  }

  Arduino.forBlock["wio_ir_send_nec"] = function(block, generator) {
    const data = valueCode(generator, block, "DATA", "1637937167");
    const khz = valueCode(generator, block, "KHZ", "38");
    ensureWioIrProtocolSender(generator, "NEC");
    return "ailyWioIrSender.send(NEC, " + data + ", 0, " + khz + ");\n";
  };

  Arduino.forBlock["wio_ir_send"] = function(block, generator) {
    const protocol = ensureWioIrProtocolSender(
      generator,
      block.getFieldValue("PROTOCOL") || "NEC"
    );
    const data = valueCode(generator, block, "DATA", "0");
    const data2 = valueCode(generator, block, "DATA2", "0");
    const khz = valueCode(generator, block, "KHZ", "38");
    return "ailyWioIrSender.send(" + protocol + ", " + data + ", " + data2 + ", " + khz + ");\n";
  };

  Arduino.forBlock["wio_ir_send_raw"] = function(block, generator) {
    const timings = parseRawTimingLiteral(
      valueCode(generator, block, "DATA", "\"9000,4500,560,560\"")
    );
    const khz = valueCode(generator, block, "KHZ", "38");
    if (!timings) {
      if (typeof console !== "undefined" && typeof console.error === "function") {
        console.error("[Wio IR] Raw timings must contain 1 to 255 comma-separated integers from 1 to 65535.");
      }
      return "// Wio IR: invalid raw timing data\n";
    }

    ensureWioIrRawSender(generator);
    return "{\n" +
      "  const uint16_t ailyWioIrRawData[] = {" + timings + "};\n" +
      "  ailyWioIrRawSender.send(ailyWioIrRawData, sizeof(ailyWioIrRawData) / sizeof(ailyWioIrRawData[0]), " + khz + ");\n" +
      "}\n";
  };
})();
