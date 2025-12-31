// // 添加新函数，用于将循环变量添加到工具箱
// function addLoopEndVariableToToolbox(block, varName) {
//   try {
//     const workspace = block.workspace;
//     if (!workspace || !varName) return;

//     // 获取工具箱
//     const toolbox = workspace.getToolbox();
//     if (!toolbox) return;

//     const allCategories = toolbox.getToolboxItems();
//     const variableCategory = allCategories.find(item =>
//       item.name_ === "Variables" || (item.getContents && item.getContents()[0]?.callbackKey === "CREATE_VARIABLE")
//     );

//     // 获取原始工具箱定义
//     const originalToolboxDef = workspace.options.languageTree;
//     if (!originalToolboxDef) return;

//     // 找到变量类别并更新其内容
//     for (let category of originalToolboxDef.contents) {
//       if ((category.name === "Variables" ||
//         (category.contents && category.contents[0]?.callbackKey === "CREATE_VARIABLE"))) {

//         // 检查变量是否已存在
//         const varExists = category.contents.some(item =>
//           item.fields && item.fields.VAR && item.fields.VAR.name === varName
//         );

//         if (!varExists) {
//           // 获取当前时间戳作为ID
//           const timestamp = new Date().getTime();
//           category.contents.push({
//             "kind": "block",
//             "type": "variables_get",
//             "fields": {
//               "VAR": {
//                 "id": "loopVar" + timestamp,
//                 "name": varName,
//                 "type": "int"
//               }
//             }
//           });

//           // 更新工具箱
//           if (toolbox && variableCategory) {
//             toolbox.refreshSelection();
//             workspace.updateToolbox(originalToolboxDef);

//             // 强制刷新工具箱显示
//             variableCategory.refreshTheme();

//             // 如果工具箱处于打开状态，使用更可靠的方式重新打开类别
//             if (toolbox.isOpen_) {
//               // 保存当前打开的类别ID
//               toolbox.setSelectedItem(null);

//               // 延迟更新确保DOM有足够时间更新
//               setTimeout(() => {
//                 variableCategory.updateFlyoutContents(originalToolboxDef);
//                 toolbox.setSelectedItem(variableCategory);
//                 workspace.refreshToolboxSelection();
//               }, 50);
//             } else {
//               variableCategory.updateFlyoutContents(originalToolboxDef);
//             }
//           }
//         }
//         break;
//       }
//     }
//   } catch (e) {
//     console.log("添加循环变量到工具箱时出错:", e);
//   }
// }

Arduino.forBlock["arduino_setup"] = function (block, generator) {
  const code = Arduino.statementToCode(block, "ARDUINO_SETUP");
  generator.addSetup("setup", code);
  return `setup() {\n${code}}\n`;
};

Arduino.forBlock["arduino_loop"] = function (block, generator) {
  const code = Arduino.statementToCode(block, "ARDUINO_LOOP");
  generator.addLoop("loop", code);
  return `loop() {\n${code}}\n`;
};

Arduino.forBlock["controls_repeat_ext"] = function (block, generator) {
  // Repeat n times.
  let repeats;
  if (block.getField("TIMES")) {
    // Internal number.
    repeats = String(Number(block.getFieldValue("TIMES")));
  } else {
    // External number.
    repeats =
      Arduino.valueToCode(block, "TIMES", Arduino.ORDER_ASSIGNMENT) || "0";
  }
  let branch = Arduino.statementToCode(block, "DO");
  let code = "";
  const loopVar = Arduino.nameDB_.getDistinctName("count", "VARIABLE");
  let endVar = repeats;
  if (!repeats.match(/^\w+$/) && !Blockly.utils.string.isNumber(repeats)) {
    endVar = Arduino.nameDB_.getDistinctName("repeat_end", "VARIABLE");
    code += "int " + endVar + " = " + repeats + ";\n";
  }
  code +=
    "for (int " +
    loopVar +
    " = 0; " +
    loopVar +
    " < " +
    endVar +
    "; " +
    loopVar +
    "++) {\n" +
    branch +
    "}\n";
  return code;
};

Arduino.forBlock["controls_repeat"] = Arduino.forBlock["controls_repeat_ext"];

Arduino.forBlock["controls_whileUntil"] = function (block, generator) {
  // Do while/until loop.
  const until = block.getFieldValue("MODE") === "UNTIL";
  let argument0 =
    Arduino.valueToCode(
      block,
      "BOOL",
      until ? Arduino.ORDER_LOGICAL_NOT : Arduino.ORDER_NONE,
    ) || "false";
  let branch = Arduino.statementToCode(block, "DO");
  if (until) {
    argument0 = "!" + argument0;
  }
  return "while (" + argument0 + ") {\n" + branch + "}\n";
};

Arduino.forBlock["controls_for"] = function (block, generator) {
  // For loop.
  const variable0 = Arduino.nameDB_.getName(
    block.getFieldValue("VAR"),
    "VARIABLE",
  );

  // 添加循环变量到工具箱
  // addLoopEndVariableToToolbox(block, variable0);
  addVariableToToolbox(block, variable0);

  const argument0 =
    Arduino.valueToCode(block, "FROM", Arduino.ORDER_ASSIGNMENT) || "0";
  const argument1 =
    Arduino.valueToCode(block, "TO", Arduino.ORDER_ASSIGNMENT) || "0";
  const increment =
    Arduino.valueToCode(block, "BY", Arduino.ORDER_ASSIGNMENT) || "1";
  let branch = Arduino.statementToCode(block, "DO");

  let code;
  let up = true;

  if (
    !isNaN(parseFloat(argument0)) && isFinite(argument0) &&
    !isNaN(parseFloat(argument1)) && isFinite(argument1) &&
    !isNaN(parseFloat(increment)) && isFinite(increment)
  ) {
    up = Number(argument0) <= Number(argument1);
  } else if (Number(increment) < 0) {
    up = false;
  }

  // 使用模板字符串改善代码可读性
  code = `for (int ${variable0} = ${argument0}; ${variable0}${up ? " < " : " > "}${argument1}; ${variable0}`;

  console.log("code: ", code);
  const step = Math.abs(Number(increment));
  if (step === 1) {
    code += up ? "++" : "--";
  } else {
    code += (up ? " += " : " -= ") + step;
  }

  code += `) {\n${branch}}\n`;
  // generator.addVariable(variable0, `int ${variable0};`);
  return code;
};

Arduino.forBlock["controls_flow_statements"] = function (block, generator) {
  // Flow statements: continue, break.
  let xfix = "";
  if (Arduino.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    xfix += Arduino.injectId(Arduino.STATEMENT_PREFIX, block);
  }
  if (Arduino.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the break/continue is triggered.
    xfix += Arduino.injectId(Arduino.STATEMENT_SUFFIX, block);
  }
  if (Arduino.STATEMENT_PREFIX) {
    const loop = block.getSurroundLoop();
    if (loop && !loop.suppressPrefixSuffix) {
      // Inject loop's statement prefix here since the regular one at the end
      // of the loop will not get executed if 'continue' is triggered.
      // In the case of 'break', a prefix is needed due to the loop's suffix.
      xfix += Arduino.injectId(Arduino.STATEMENT_PREFIX, loop);
    }
  }
  switch (block.getFieldValue("FLOW")) {
    case "BREAK":
      return xfix + "break;\n";
    case "CONTINUE":
      return xfix + "continue;\n";
  }
  throw Error("Unknown flow statement.");
};

Arduino.forBlock["controls_whileForever"] = function (block, generator) {
  const branch = Arduino.statementToCode(block, "DO");
  return "while (1) {\n" + branch + "}\n";
};
