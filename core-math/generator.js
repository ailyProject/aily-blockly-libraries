Arduino.forBlock["math_number"] = function (block) {
  // Numeric value.
  const number = Number(block.getFieldValue("NUM"));
  const order =
    number >= 0 ? Arduino.ORDER_ATOMIC : Arduino.ORDER_UNARY_NEGATION;
  return [String(number), order];
};

Arduino.forBlock["math_number_base"] = function (block) {
  // Multi-base numeric value (DEC, HEX, BIN).
  const base = block.getFieldValue("BASE");
  let numStr = block.getFieldValue("NUM").trim();
  let code;

  if (base === "HEX") {
    // 移除可能的0x或0X前缀
    numStr = numStr.replace(/^0[xX]/, "");
    code = "0x" + numStr.toUpperCase();
  } else if (base === "BIN") {
    // 移除可能的0b或0B前缀
    numStr = numStr.replace(/^0[bB]/, "");
    code = "0b" + numStr;
  } else {
    // DEC - 直接使用数值
    code = numStr;
  }

  return [code, Arduino.ORDER_ATOMIC];
};

Arduino.forBlock["math_arithmetic"] = function (block) {
  // Basic arithmetic operators, and power.
  const OPERATORS = {
    ADD: [" + ", Arduino.ORDER_ADDITION],
    MINUS: [" - ", Arduino.ORDER_SUBTRACTION],
    MULTIPLY: [" * ", Arduino.ORDER_MULTIPLICATION],
    DIVIDE: [" / ", Arduino.ORDER_DIVISION],
    MODULO: [" % ", Arduino.ORDER_MODULUS],
    POWER: [null, Arduino.ORDER_NONE], // Handle power separately.
  };
  const tuple = OPERATORS[block.getFieldValue("OP")];
  const operator = tuple[0];
  const order = tuple[1];
  const argument0 = Arduino.valueToCode(block, "A", order) || "0";
  const argument1 = Arduino.valueToCode(block, "B", order) || "0";
  let code;
  // Power in JavaScript requires a special case since it has no operator.
  if (!operator) {
    code = "pow(" + argument0 + ", " + argument1 + ")";
    return [code, Arduino.ORDER_FUNCTION_CALL];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

Arduino.forBlock["math_single"] = function (block) {
  // Math operators with single operand.
  const operator = block.getFieldValue("OP");
  let code;
  let arg;
  if (operator === "NEG") {
    // Negation is a special case given its different operator precedence.
    arg =
      Arduino.valueToCode(block, "NUM", Arduino.ORDER_UNARY_NEGATION) || "0";
    if (arg[0] === "-") {
      // --3 is not legal in JS.
      arg = " " + arg;
    }
    code = "-" + arg;
    return [code, Arduino.ORDER_UNARY_NEGATION];
  }
  if (operator === "SIN" || operator === "COS" || operator === "TAN") {
    arg = Arduino.valueToCode(block, "NUM", Arduino.ORDER_DIVISION) || "0";
  } else {
    arg = Arduino.valueToCode(block, "NUM", Arduino.ORDER_NONE) || "0";
  }
  // First, handle cases which generate values that don't need parentheses
  // wrapping the code.
  switch (operator) {
    case "ABS":
      code = "abs(" + arg + ")";
      break;
    case "ROOT":
      code = "sqrt(" + arg + ")";
      break;
    case "LN":
      code = "log(" + arg + ")";
      break;
    case "EXP":
      code = "exp(" + arg + ")";
      break;
    case "POW10":
      code = "pow(10," + arg + ")";
      break;
    case "ROUND":
      code = "round(" + arg + ")";
      break;
    case "ROUNDUP":
      code = "ceil(" + arg + ")";
      break;
    case "ROUNDDOWN":
      code = "floor(" + arg + ")";
      break;
    case "SIN":
      code = "sin(" + arg + " / 180 * PI)";
      break;
    case "COS":
      code = "cos(" + arg + " / 180 * PI)";
      break;
    case "TAN":
      code = "tan(" + arg + " / 180 * PI)";
      break;
  }
  if (code) {
    return [code, Arduino.ORDER_FUNCTION_CALL];
  }
  // Second, handle cases which generate values that may need parentheses
  // wrapping the code.
  switch (operator) {
    case "LOG10":
      code = "log(" + arg + ") / log(10)";
      break;
    case "ASIN":
      code = "asin(" + arg + ") / PI * 180";
      break;
    case "ACOS":
      code = "acos(" + arg + ") / PI * 180";
      break;
    case "ATAN":
      code = "atan(" + arg + ") / PI * 180";
      break;
    default:
      throw Error("Unknown math operator: " + operator);
  }
  return [code, Arduino.ORDER_DIVISION];
};

Arduino.forBlock["math_constant"] = function (block) {
  // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
  const CONSTANTS = {
    PI: ["PI", Arduino.ORDER_ATOMIC],
    E: ["2.71828", Arduino.ORDER_ATOMIC],
    GOLDEN_RATIO: ["(1 + sqrt(5)) / 2", Arduino.ORDER_DIVISION],
    SQRT2: ["1.41421", Arduino.ORDER_ATOMIC],
    SQRT1_2: ["0.70711", Arduino.ORDER_ATOMIC],
    INFINITY: ["INFINITY", Arduino.ORDER_ATOMIC],
  };
  return CONSTANTS[block.getFieldValue("CONSTANT")];
};

Arduino.forBlock["math_number_property"] = function (block) {
  // Check if a number is even, odd, prime, whole, positive, or negative
  // or if it is divisible by certain number. Returns true or false.
  const PROPERTIES = {
    EVEN: [" % 2 === 0", Arduino.ORDER_MODULUS, Arduino.ORDER_EQUALITY],
    ODD: [" % 2 === 1", Arduino.ORDER_MODULUS, Arduino.ORDER_EQUALITY],
    WHOLE: [" % 1 === 0", Arduino.ORDER_MODULUS, Arduino.ORDER_EQUALITY],
    POSITIVE: [" > 0", Arduino.ORDER_RELATIONAL, Arduino.ORDER_RELATIONAL],
    NEGATIVE: [" < 0", Arduino.ORDER_RELATIONAL, Arduino.ORDER_RELATIONAL],
    DIVISIBLE_BY: [null, Arduino.ORDER_MODULUS, Arduino.ORDER_EQUALITY],
    PRIME: [null, Arduino.ORDER_NONE, Arduino.ORDER_FUNCTION_CALL],
  };
  const dropdownProperty = block.getFieldValue("PROPERTY");
  const [suffix, inputOrder, outputOrder] = PROPERTIES[dropdownProperty];
  const numberToCheck =
    Arduino.valueToCode(block, "NUMBER_TO_CHECK", inputOrder) || "0";
  let code;
  if (dropdownProperty === "PRIME") {
    // Prime is a special case as it is not a one-liner test.
    const functionName = Arduino.provideFunction_(
      "mathIsPrime",
      `
function ${Arduino.FUNCTION_NAME_PLACEHOLDER_}(n) {
  // https://en.wikipedia.org/wiki/Primality_test#Naive_methods
  if (n == 2 || n == 3) {
    return true;
  }
  // False if n is NaN, negative, is 1, or not whole.
  // And false if n is divisible by 2 or 3.
  if (isNaN(n) || n <= 1 || n % 1 !== 0 || n % 2 === 0 || n % 3 === 0) {
    return false;
  }
  // Check all the numbers of form 6k +/- 1, up to sqrt(n).
  for (var x = 6; x <= sqrt(n) + 1; x += 6) {
    if (n % (x - 1) === 0 || n % (x + 1) === 0) {
      return false;
    }
  }
  return true;
}
`,
    );
    code = functionName + "(" + numberToCheck + ")";
  } else if (dropdownProperty === "DIVISIBLE_BY") {
    const divisor =
      Arduino.valueToCode(block, "DIVISOR", Arduino.ORDER_MODULUS) || "0";
    code = numberToCheck + " % " + divisor + " === 0";
  } else {
    code = numberToCheck + suffix;
  }
  return [code, outputOrder];
};

// Arduino.forBlock["math_change"] = function (block) {
//   // Add to a variable in place.
//   const argument0 =
//     Arduino.valueToCode(block, "DELTA", Arduino.ORDER_ADDITION) || "0";
//   const varName = Arduino.getVariableName(block.getFieldValue("VAR"));
//   return (
//     varName +
//     " = (typeof " +
//     varName +
//     " === 'number' ? " +
//     varName +
//     " : 0) + " +
//     argument0 +
//     ";\n"
//   );
// };

// Rounding functions have a single operand.
// export const math_round = math_single;
Arduino.forBlock["math_round"] = Arduino.forBlock["math_single"];
// Trigonometry functions have a single operand.
// export const math_trig = math_single;
Arduino.forBlock["math_trig"] = Arduino.forBlock["math_single"];

Arduino.forBlock["math_on_list"] = function (block) {
  // Math functions for lists.
  const func = block.getFieldValue("OP");
  let list;
  let code;
  switch (func) {
    case "SUM":
      list = Arduino.valueToCode(block, "LIST", Arduino.ORDER_MEMBER) || "[]";
      // Arduino不支持reduce方法
      code = "0; // 警告: Arduino不支持自动数组求和，需要手动实现";
      break;
    case "MIN":
      list = Arduino.valueToCode(block, "LIST", Arduino.ORDER_NONE) || "[]";
      // Arduino不支持Math.min.apply
      code = "0; // 警告: Arduino不支持自动求最小值，需要手动实现";
      break;
    case "MAX":
      list = Arduino.valueToCode(block, "LIST", Arduino.ORDER_NONE) || "[]";
      // Arduino不支持Math.max.apply
      code = "0; // 警告: Arduino不支持自动求最大值，需要手动实现";
      break;
    case "AVERAGE":
      // Arduino不支持reduce方法和数组length属性
      code = "0; // 警告: Arduino不支持自动计算平均值，需要手动实现";
      break;
    case "MEDIAN":
      // Arduino不支持filter, sort等方法
      code = "0; // 警告: Arduino不支持自动计算中位数，需要手动实现";
      break;
    case "MODE":
      // Arduino不支持复杂的模式计算
      code = "0; // 警告: Arduino不支持自动计算众数，需要手动实现";
      break;
    case "STD_DEV":
      // Arduino不支持reduce和Math.pow方法
      code = "0; // 警告: Arduino不支持自动计算标准差，需要手动实现";
      break;
    case "RANDOM":
      // 使用Arduino的random函数替代
      list = Arduino.valueToCode(block, "LIST", Arduino.ORDER_NONE) || "[]";
      code = "0; // 警告: Arduino不支持数组随机取值，需要使用random()手动实现";
      break;
    default:
      throw Error("Unknown operator: " + func);
  }
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["math_modulo"] = function (block) {
  // Remainder computation.
  const argument0 =
    Arduino.valueToCode(block, "DIVIDEND", Arduino.ORDER_MODULUS) || "0";
  const argument1 =
    Arduino.valueToCode(block, "DIVISOR", Arduino.ORDER_MODULUS) || "0";
  const code = argument0 + " % " + argument1;
  return [code, Arduino.ORDER_MODULUS];
};

Arduino.forBlock["math_constrain"] = function (block) {
  // Constrain a number between two limits.
  const argument0 =
    Arduino.valueToCode(block, "VALUE", Arduino.ORDER_NONE) || "0";
  const argument1 =
    Arduino.valueToCode(block, "LOW", Arduino.ORDER_NONE) || "0";
  const argument2 =
    Arduino.valueToCode(block, "HIGH", Arduino.ORDER_NONE) || "Infinity";
  // 使用Arduino的constrain函数
  const code = "constrain(" + argument0 + ", " + argument1 + ", " + argument2 + ")";
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["math_random_int"] = function (block) {
  // Random integer between [X] and [Y].
  const argument0 =
    Arduino.valueToCode(block, "FROM", Arduino.ORDER_NONE) || "0";
  const argument1 = Arduino.valueToCode(block, "TO", Arduino.ORDER_NONE) || "0";
  // 使用Arduino的random函数
  const code = "random(" + argument0 + ", " + argument1 + " + 1)";
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

Arduino.forBlock["math_random_float"] = function (block) {
  // Random fraction between 0 and 1.
  // Arduino没有直接生成0-1随机小数的函数，需要转换
  return ["(random(0, 1000) / 1000.0)", Arduino.ORDER_DIVISION];
};

Arduino.forBlock["math_atan2"] = function (block) {
  // Arctangent of point (X, Y) in degrees from -180 to 180.
  const argument0 = Arduino.valueToCode(block, "X", Arduino.ORDER_NONE) || "0";
  const argument1 = Arduino.valueToCode(block, "Y", Arduino.ORDER_NONE) || "0";
  // 使用Arduino的atan2函数并转换为角度
  return [
    "atan2(" + argument1 + ", " + argument0 + ") * 180.0 / PI",
    Arduino.ORDER_MULTIPLICATION,
  ];
};

Arduino.forBlock["math_round_to_decimal"] = function (block) {
  const numberToRound =
    Arduino.valueToCode(block, "NUMBER", Arduino.ORDER_NONE) || "0";
  const decimals =
    Arduino.valueToCode(block, "DECIMALS", Arduino.ORDER_NONE) || "0";

  // Arduino没有toFixed方法，使用数学公式实现
  const code = `(round(${numberToRound} * pow(10, ${decimals})) / pow(10, ${decimals}))`;
  return [code, Arduino.ORDER_DIVISION];
};

Arduino.forBlock["math_bitwise_not"] = function (block) {
  const number =
    Arduino.valueToCode(block, "NUM", Arduino.ORDER_BITWISE_NOT) || "0";
  const code = `~${number}`;
  return [code, Arduino.ORDER_BITWISE_NOT];
};

Arduino.forBlock["map_to"] = function (block) {
  const num = Arduino.valueToCode(block, "NUM", Arduino.ORDER_NONE) || "0";
  const firstStart = Arduino.valueToCode(
    block,
    "FIRST_START",
    Arduino.ORDER_NONE,
  ) || "0";
  const firstEnd = Arduino.valueToCode(
    block,
    "FIRST_END",
    Arduino.ORDER_NONE,
  ) || "1023";
  const lastStart = Arduino.valueToCode(
    block,
    "LAST_START",
    Arduino.ORDER_NONE,
  ) || "0";
  const lastEnd = Arduino.valueToCode(
    block,
    "LAST_END",
    Arduino.ORDER_NONE,
  ) || "255";

  const code = `map(${num}, ${firstStart}, ${firstEnd}, ${lastStart}, ${lastEnd})`;

  return [code, Arduino.ORDER_ADDITION];
};

// 注册 math_op_tooltip 扩展
try {
  // 定义 tooltip 映射
  const MATH_OP_TOOLTIPS = {
    'ADD': '加法：两个数相加',
    'MINUS': '减法：两个数相减', 
    'MULTIPLY': '乘法：两个数相乘',
    'DIVIDE': '除法：两个数相除',
    'MODULO': '取模：计算除法的余数',
    'POWER': '幂运算：计算一个数的指定次方'
  };

  // 检查是否已经注册
  if (Blockly.Extensions.isRegistered('math_op_tooltip')) {
    Blockly.Extensions.unregister('math_op_tooltip');
  }

  Blockly.Extensions.register('math_op_tooltip', function() {
    // 为 math_arithmetic 块设置动态 tooltip
    const block = this;
    this.setTooltip(function() {
      const op = block.getFieldValue('OP');
      return MATH_OP_TOOLTIPS[op] || '数学运算';
    });
  });
} catch (e) {
  console.error("注册 math_op_tooltip 扩展失败:", e);
}

// 位移操作：<< 和 >>
Arduino.forBlock["math_bitwise_shift"] = function (block) {
  const OPERATORS = {
    LEFT: [" << ", Arduino.ORDER_BITWISE_SHIFT],
    RIGHT: [" >> ", Arduino.ORDER_BITWISE_SHIFT],
  };
  const tuple = OPERATORS[block.getFieldValue("OP")];
  const operator = tuple[0];
  const order = tuple[1];
  const argument0 = Arduino.valueToCode(block, "A", order) || "0";
  const argument1 = Arduino.valueToCode(block, "B", order) || "0";
  const code = argument0 + operator + argument1;
  return [code, order];
};

// 按位逻辑运算：&, |, ^
Arduino.forBlock["math_bitwise_logic"] = function (block) {
  const OPERATORS = {
    AND: [" & ", Arduino.ORDER_BITWISE_AND],
    OR: [" | ", Arduino.ORDER_BITWISE_OR],
    XOR: [" ^ ", Arduino.ORDER_BITWISE_XOR],
  };
  const tuple = OPERATORS[block.getFieldValue("OP")];
  const operator = tuple[0];
  const order = tuple[1];
  const argument0 = Arduino.valueToCode(block, "A", order) || "0";
  const argument1 = Arduino.valueToCode(block, "B", order) || "0";
  const code = argument0 + operator + argument1;
  return [code, order];
};

// 提取位段（通用）
Arduino.forBlock["math_extract_bits"] = function (block) {
  const operator = block.getFieldValue("OP");
  const number = Arduino.valueToCode(block, "NUM", Arduino.ORDER_NONE) || "0";
  let code;
  let order;

  switch (operator) {
    case "HIGH_BYTE":
      code = "highByte(" + number + ")";
      order = Arduino.ORDER_FUNCTION_CALL;
      break;
    case "LOW_BYTE":
      code = "lowByte(" + number + ")";
      order = Arduino.ORDER_FUNCTION_CALL;
      break;
    case "HIGH_WORD":
      code = "((" + number + " >> 16) & 0xFFFF)";
      order = Arduino.ORDER_BITWISE_AND;
      break;
    case "LOW_WORD":
      code = "(" + number + " & 0xFFFF)";
      order = Arduino.ORDER_BITWISE_AND;
      break;
    default:
      code = "0";
      order = Arduino.ORDER_ATOMIC;
  }

  return [code, order];
};

// 读取指定位
Arduino.forBlock["math_bitread"] = function (block) {
  const number = Arduino.valueToCode(block, "NUM", Arduino.ORDER_NONE) || "0";
  const bit = Arduino.valueToCode(block, "BIT", Arduino.ORDER_NONE) || "0";
  const code = "bitRead(" + number + ", " + bit + ")";
  return [code, Arduino.ORDER_FUNCTION_CALL];
};

// 写入指定位（返回修改后的值）
Arduino.forBlock["math_bitwrite"] = function (block) {
  const number = Arduino.valueToCode(block, "NUM", Arduino.ORDER_NONE) || "0";
  const bit = Arduino.valueToCode(block, "BIT", Arduino.ORDER_NONE) || "0";
  const value = Arduino.valueToCode(block, "VALUE", Arduino.ORDER_NONE) || "0";
  // 手动实现：如果value为1则置位，否则清零
  const code = "((" + value + ") ? ((" + number + ") | (1 << (" + bit + "))) : ((" + number + ") & ~(1 << (" + bit + "))))";
  return [code, Arduino.ORDER_CONDITIONAL];
};

// 置位(设置为1，返回修改后的值)
Arduino.forBlock["math_bitset"] = function (block) {
  const number = Arduino.valueToCode(block, "NUM", Arduino.ORDER_BITWISE_OR) || "0";
  const bit = Arduino.valueToCode(block, "BIT", Arduino.ORDER_NONE) || "0";
  const code = "(" + number + " | (1 << " + bit + "))";
  return [code, Arduino.ORDER_BITWISE_OR];
};

// 清零(设置为0，返回修改后的值)
Arduino.forBlock["math_bitclear"] = function (block) {
  const number = Arduino.valueToCode(block, "NUM", Arduino.ORDER_BITWISE_AND) || "0";
  const bit = Arduino.valueToCode(block, "BIT", Arduino.ORDER_NONE) || "0";
  const code = "(" + number + " & ~(1 << " + bit + "))";
  return [code, Arduino.ORDER_BITWISE_AND];
};

// 组合位段（通用）
Arduino.forBlock["math_combine_bits"] = function (block) {
  const operator = block.getFieldValue("OP");
  const high = Arduino.valueToCode(block, "HIGH", Arduino.ORDER_NONE) || "0";
  const low = Arduino.valueToCode(block, "LOW", Arduino.ORDER_NONE) || "0";
  let code;
  let order;

  switch (operator) {
    case "MAKE_WORD":
      code = "word(" + high + ", " + low + ")";
      order = Arduino.ORDER_FUNCTION_CALL;
      break;
    case "MAKE_DWORD":
      code = "((uint32_t)(" + high + ") << 16 | (" + low + "))";
      order = Arduino.ORDER_BITWISE_OR;
      break;
    default:
      code = "0";
      order = Arduino.ORDER_ATOMIC;
  }

  return [code, order];
};
