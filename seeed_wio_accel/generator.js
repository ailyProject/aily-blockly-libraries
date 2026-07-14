"use strict";

(function registerWioAccelGenerators() {
  function checkWioTerminalBoard() {
    const boardConfig = typeof window !== "undefined" ? window.boardConfig : null;
    const core = boardConfig && boardConfig.core ? String(boardConfig.core) : "";
    if (core && core.indexOf("seeed_wio_terminal") === -1) {
      console.warn("Wio Terminal accelerometer blocks require Seeeduino:samd:seeed_wio_terminal.");
    }
  }

  function ensureWioAccel(generator) {
    checkWioTerminalBoard();
    generator.addLibrary("Seeed_Wio_LIS3DHTR", "#include <LIS3DHTR.h>");
    if (typeof generator.addObject === "function") {
      generator.addObject("seeed_wio_accel", "LIS3DHTR<TwoWire> ailyWioAccel;");
    } else {
      generator.addVariable("seeed_wio_accel", "LIS3DHTR<TwoWire> ailyWioAccel;");
    }
  }

  function getVariableName(block, generator, fieldName, fallback) {
    const variableId = block.getFieldValue(fieldName);
    if (generator.nameDB_ && typeof generator.nameDB_.getName === "function") {
      return generator.nameDB_.getName(variableId, "VARIABLE");
    }
    return variableId || fallback;
  }

  Arduino.forBlock.wio_accel_init = function(block, generator) {
    const dataRate = block.getFieldValue("DATARATE") || "LIS3DHTR_DATARATE_25HZ";
    const range = block.getFieldValue("RANGE") || "LIS3DHTR_RANGE_2G";
    ensureWioAccel(generator);
    return "ailyWioAccel.begin(Wire1);\n" +
      "ailyWioAccel.setOutputDataRate(" + dataRate + ");\n" +
      "ailyWioAccel.setFullScaleRange(" + range + ");\n";
  };

  Arduino.forBlock.wio_accel_set_datarate = function(block, generator) {
    const dataRate = block.getFieldValue("DATARATE") || "LIS3DHTR_DATARATE_25HZ";
    ensureWioAccel(generator);
    return "ailyWioAccel.setOutputDataRate(" + dataRate + ");\n";
  };

  Arduino.forBlock.wio_accel_set_range = function(block, generator) {
    const range = block.getFieldValue("RANGE") || "LIS3DHTR_RANGE_2G";
    ensureWioAccel(generator);
    return "ailyWioAccel.setFullScaleRange(" + range + ");\n";
  };

  Arduino.forBlock.wio_accel_read_axis = function(block, generator) {
    const axis = block.getFieldValue("AXIS") || "X";
    const methods = {
      X: "getAccelerationX",
      Y: "getAccelerationY",
      Z: "getAccelerationZ"
    };
    ensureWioAccel(generator);
    return ["ailyWioAccel." + (methods[axis] || methods.X) + "()", generator.ORDER_FUNCTION_CALL];
  };

  Arduino.forBlock.wio_accel_read_xyz = function(block, generator) {
    const xName = getVariableName(block, generator, "X_VAR", "accelX");
    const yName = getVariableName(block, generator, "Y_VAR", "accelY");
    const zName = getVariableName(block, generator, "Z_VAR", "accelZ");
    ensureWioAccel(generator);
    generator.addVariable(xName, "float " + xName + ";");
    generator.addVariable(yName, "float " + yName + ";");
    generator.addVariable(zName, "float " + zName + ";");
    return "ailyWioAccel.getAcceleration(&" + xName + ", &" + yName + ", &" + zName + ");\n";
  };

  Arduino.forBlock.wio_accel_data_ready = function(block, generator) {
    ensureWioAccel(generator);
    return ["ailyWioAccel.available()", generator.ORDER_FUNCTION_CALL];
  };

  Arduino.forBlock.wio_accel_is_connected = function(block, generator) {
    ensureWioAccel(generator);
    return ["ailyWioAccel.isConnection()", generator.ORDER_FUNCTION_CALL];
  };

  Arduino.forBlock.wio_accel_on_tap = function(block, generator) {
    const clickType = block.getFieldValue("CLICK_TYPE") || "1";
    const threshold = generator.valueToCode(block, "THRESHOLD", generator.ORDER_ATOMIC) || "40";
    const handlerCode = generator.statementToCode(block, "HANDLER") || "";
    ensureWioAccel(generator);

    generator.addVariable(
      "wio_accel_tap_pending",
      "volatile bool ailyWioAccelTapPending = false;"
    );
    generator.addFunction(
      "ailyWioAccelTapISR",
      "void ailyWioAccelTapISR() {\n" +
      "  ailyWioAccelTapPending = true;\n" +
      "}\n"
    );
    generator.addFunction(
      "ailyWioAccelTapHandler",
      "void ailyWioAccelTapHandler() {\n" + handlerCode + "}\n"
    );
    generator.addSetupEnd(
      "wio_accel_tap_setup",
      "ailyWioAccel.click(" + clickType + ", " + threshold + ");\n" +
      "pinMode(GYROSCOPE_INT1, INPUT);\n" +
      "attachInterrupt(digitalPinToInterrupt(GYROSCOPE_INT1), ailyWioAccelTapISR, RISING);"
    );
    generator.addLoopBegin(
      "wio_accel_tap_dispatch",
      "if (ailyWioAccelTapPending) {\n" +
      "  noInterrupts();\n" +
      "  ailyWioAccelTapPending = false;\n" +
      "  interrupts();\n" +
      "  ailyWioAccelTapHandler();\n" +
      "}"
    );
    return "";
  };
})();
