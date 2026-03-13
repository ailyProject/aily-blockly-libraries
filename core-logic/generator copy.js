Arduino.forBlock["controls_if"] = function (block) {
  // If/elseif/else condition.
  let n = 0;
  let code = "";
  if (Arduino.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += Arduino.injectId(Arduino.STATEMENT_PREFIX, block);
  }
  do {
    const conditionCode =
      Arduino.valueToCode(block, "IF" + n, Arduino.ORDER_NONE) || "false";
    let branchCode = Arduino.statementToCode(block, "DO" + n);
    if (Arduino.STATEMENT_SUFFIX) {
      branchCode =
        Arduino.prefixLines(
          Arduino.injectId(Arduino.STATEMENT_SUFFIX, block),
          Arduino.INDENT,
        ) + branchCode;
    }
    code +=
      (n > 0 ? " else " : "") +
      "if (" +
      conditionCode +
      ") {\n" +
      branchCode +
      "}";
    n++;
  } while (block.getInput("IF" + n));

  if (block.getInput("ELSE") || Arduino.STATEMENT_SUFFIX) {
    let branchCode = Arduino.statementToCode(block, "ELSE");
    if (Arduino.STATEMENT_SUFFIX) {
      branchCode =
        Arduino.prefixLines(
          Arduino.injectId(Arduino.STATEMENT_SUFFIX, block),
          Arduino.INDENT,
        ) + branchCode;
    }
    code += " else {\n" + branchCode + "}";
  }
  return code + "\n";
};

// export const controls_ifelse = controls_if;
Arduino.forBlock["controls_ifelse"] = Arduino.forBlock["controls_if"];

Arduino.forBlock["controls_switch"] = function (block) {
  // Switch/case statement.
  let n = 0;
  let code = "";
  
  // Get the switch expression
  const switchValue = Arduino.valueToCode(block, "SWITCH", Arduino.ORDER_NONE) || "0";
  
  if (Arduino.STATEMENT_PREFIX) {
    code += Arduino.injectId(Arduino.STATEMENT_PREFIX, block);
  }
  
  code += "switch (" + switchValue + ") {\n";
  
  // Process all case statements
  do {
    const caseValue = Arduino.valueToCode(block, "CASE" + n, Arduino.ORDER_NONE);
    if (caseValue) {
      code += "  case " + caseValue + ":\n";
      let branchCode = Arduino.statementToCode(block, "DO" + n);
      if (Arduino.STATEMENT_SUFFIX) {
        branchCode = Arduino.prefixLines(
          Arduino.injectId(Arduino.STATEMENT_SUFFIX, block),
          Arduino.INDENT
        ) + branchCode;
      }
      code += Arduino.prefixLines(branchCode, Arduino.INDENT);
      code += "    break;\n";
    }
    n++;
  } while (block.getInput("CASE" + n));
  
  // Process default case if present
  if (block.getInput("DEFAULT")) {
    code += "  default:\n";
    let defaultCode = Arduino.statementToCode(block, "DEFAULT");
    if (Arduino.STATEMENT_SUFFIX) {
      defaultCode = Arduino.prefixLines(
        Arduino.injectId(Arduino.STATEMENT_SUFFIX, block),
        Arduino.INDENT
      ) + defaultCode;
    }
    code += Arduino.prefixLines(defaultCode, Arduino.INDENT);
    code += "    break;\n";
  }
  
  code += "}\n";
  return code;
};

Arduino.forBlock["logic_compare"] = function (block) {
  // Comparison operator.
  const OPERATORS = {
    EQ: "==",
    NEQ: "!=",
    LT: "<",
    LTE: "<=",
    GT: ">",
    GTE: ">=",
  };
  const operator = OPERATORS[block.getFieldValue("OP")];
  const order =
    operator === "==" || operator === "!="
      ? Arduino.ORDER_EQUALITY
      : Arduino.ORDER_RELATIONAL;
  const argument0 = Arduino.valueToCode(block, "A", order) || "0";
  const argument1 = Arduino.valueToCode(block, "B", order) || "0";
  const code = argument0 + " " + operator + " " + argument1;
  return [code, order];
};

Arduino.forBlock["logic_operation"] = function (block) {
  // Operations 'and', 'or'.
  const operator = block.getFieldValue("OP") === "AND" ? "&&" : "||";
  const order =
    operator === "&&" ? Arduino.ORDER_LOGICAL_AND : Arduino.ORDER_LOGICAL_OR;
  let argument0 = Arduino.valueToCode(block, "A", order);
  let argument1 = Arduino.valueToCode(block, "B", order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = "false";
    argument1 = "false";
  } else {
    // Single missing arguments have no effect on the return value.
    const defaultArgument = operator === "&&" ? "true" : "false";
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  const code = argument0 + " " + operator + " " + argument1;
  return [code, order];
};

Arduino.forBlock["logic_negate"] = function (block) {
  // Negation.
  const order = Arduino.ORDER_LOGICAL_NOT;
  const argument0 = Arduino.valueToCode(block, "BOOL", order) || "true";
  const code = "!" + argument0;
  return [code, order];
};

Arduino.forBlock["logic_boolean"] = function (block) {
  // Boolean values true and false.
  const code = block.getFieldValue("BOOL");
  code === "TRUE" ? "true" : "false";
  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["logic_null"] = function (block) {
  // Null data type.
  return ["null", Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["logic_ternary"] = function (block) {
  // Ternary operator.
  const value_if =
    Arduino.valueToCode(block, "IF", Arduino.ORDER_CONDITIONAL) || "false";
  const value_then =
    Arduino.valueToCode(block, "THEN", Arduino.ORDER_CONDITIONAL) || "null";
  const value_else =
    Arduino.valueToCode(block, "ELSE", Arduino.ORDER_CONDITIONAL) || "null";
  const code = value_if + " ? " + value_then + " : " + value_else;
  return [code, Arduino.ORDER_CONDITIONAL];
};
