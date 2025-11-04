"use strict";

(function registerCapacitiveSensorWiringHintExtension() {
    if (
        typeof Blockly === "undefined" ||
        !Blockly.Extensions ||
        typeof Blockly.Extensions.register !== "function"
    ) {
        return;
    }
    const extensionName = "capacitivesensor_wiring_hint_image";
    try {
        Blockly.Extensions.register(extensionName, function () {
            const imageField = this.getField && this.getField("IMAGE");
            if (!imageField || typeof imageField.setValue !== "function") {
                return;
            }
            const workspace =
                this.workspace ||
                (typeof Blockly !== "undefined" &&
                    Blockly.getMainWorkspace &&
                    Blockly.getMainWorkspace());
            let mediaPath = "";
            if (
                workspace &&
                workspace.options &&
                typeof workspace.options.pathToMedia === "string"
            ) {
                mediaPath = workspace.options.pathToMedia;
            } else if (
                typeof Blockly !== "undefined" &&
                Blockly.mainWorkspace &&
                Blockly.mainWorkspace.options &&
                typeof Blockly.mainWorkspace.options.pathToMedia === "string"
            ) {
                mediaPath = Blockly.mainWorkspace.options.pathToMedia;
            }
            if (mediaPath && !mediaPath.endsWith("/")) {
                mediaPath += "/";
            }
            const localPath = "capacitivesensor/tu1.JPG";
            imageField.setValue((mediaPath || "") + localPath);
        });
    } catch (error) {
        if (
            !error ||
            !error.message ||
            error.message.indexOf("already registered") === -1
        ) {
            throw error;
        }
    }
})();

Arduino.forBlock["capacitivesensor_create"] = function (block, generator) {
    if (!block._capacitiveVarMonitorAttached) {
        block._capacitiveVarMonitorAttached = true;
        block._capacitiveVarLastName = block.getFieldValue("VAR") || "sensor";
        const varField = block.getField("VAR");
        if (varField && typeof varField.setValidator === "function") {
            varField.setValidator(function (newName) {
                const workspace =
                    block.workspace ||
                    (typeof Blockly !== "undefined" &&
                        Blockly.getMainWorkspace &&
                        Blockly.getMainWorkspace());
                const oldName = block._capacitiveVarLastName;
                if (workspace && newName && newName !== oldName) {
                    renameVariableInBlockly(
                        block,
                        oldName,
                        newName,
                        "CapacitiveSensor",
                    );
                    block._capacitiveVarLastName = newName;
                }
                return newName;
            });
        }
    }

    const varName = block.getFieldValue("VAR") || "sensor";
    const sendPin = block.getFieldValue("SEND");
    const receivePin = block.getFieldValue("RECV");

    generator.addLibrary(
        "#include <CapacitiveSensor.h>",
        "#include <CapacitiveSensor.h>",
    );
    registerVariableToBlockly(varName, "CapacitiveSensor");
    const variableKey = "capacitivesensor_" + varName;
    generator.addVariable(
        variableKey,
        "CapacitiveSensor " +
            varName +
            "(" +
            sendPin +
            ", " +
            receivePin +
            ");",
    );

    return "";
};

Arduino.forBlock["capacitivesensor_read"] = function (block, generator) {
    generator.addLibrary(
        "#include <CapacitiveSensor.h>",
        "#include <CapacitiveSensor.h>",
    );
    const varField = block.getField("VAR");
    const varName = varField ? varField.getText() : "sensor";
    const samples =
        generator.valueToCode(block, "SAMPLES", Arduino.ORDER_ATOMIC) || "30";
    const code = varName + ".capacitiveSensor(" + samples + ")";
    return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["capacitivesensor_read_raw"] = function (block, generator) {
    generator.addLibrary(
        "#include <CapacitiveSensor.h>",
        "#include <CapacitiveSensor.h>",
    );
    const varField = block.getField("VAR");
    const varName = varField ? varField.getText() : "sensor";
    const samples =
        generator.valueToCode(block, "SAMPLES", Arduino.ORDER_ATOMIC) || "30";
    const code = varName + ".capacitiveSensorRaw(" + samples + ")";
    return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["capacitivesensor_set_timeout"] = function (block, generator) {
    generator.addLibrary(
        "#include <CapacitiveSensor.h>",
        "#include <CapacitiveSensor.h>",
    );
    const varField = block.getField("VAR");
    const varName = varField ? varField.getText() : "sensor";
    const timeout =
        generator.valueToCode(block, "TIMEOUT", Arduino.ORDER_ATOMIC) || "2000";
    return varName + ".set_CS_Timeout_Millis(" + timeout + ");\n";
};

Arduino.forBlock["capacitivesensor_set_autocal"] = function (block, generator) {
    generator.addLibrary(
        "#include <CapacitiveSensor.h>",
        "#include <CapacitiveSensor.h>",
    );
    const varField = block.getField("VAR");
    const varName = varField ? varField.getText() : "sensor";
    const interval =
        generator.valueToCode(block, "INTERVAL", Arduino.ORDER_ATOMIC) ||
        "20000";
    return varName + ".set_CS_AutocaL_Millis(" + interval + ");\n";
};

Arduino.forBlock["capacitivesensor_reset_autocal"] = function (
    block,
    generator,
) {
    generator.addLibrary(
        "#include <CapacitiveSensor.h>",
        "#include <CapacitiveSensor.h>",
    );
    const varField = block.getField("VAR");
    const varName = varField ? varField.getText() : "sensor";
    return varName + ".reset_CS_AutoCal();\n";
};

Arduino.forBlock["capacitivesensor_wiring_hint"] = function (
    _block,
    _generator,
) {
    return "";
};
