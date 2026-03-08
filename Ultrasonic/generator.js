Arduino.forBlock["ultrasonic_ranging"] = function (block, generator) {
  const pin1 = Arduino.valueToCode(block, "PIN1", Arduino.ORDER_ATOMIC);
  const pin2 = Arduino.valueToCode(block, "PIN2", Arduino.ORDER_ATOMIC);
  const functionName = `checkdistance_${pin1}_${pin2}`;
  const code = `float ${functionName}() {
  digitalWrite(${pin1}, LOW);
  delayMicroseconds(2);
  digitalWrite(${pin1}, HIGH);
  delayMicroseconds(10);
  digitalWrite(${pin1}, LOW);
  float distance = pulseIn(${pin2}, HIGH) / 58.00;
  delay(10);
  return distance;
}`;
  Arduino.addFunction(functionName, code);
  Arduino.addSetupBegin(
    functionName,
    `  pinMode(${pin1}, OUTPUT);
  pinMode(${pin2}, INPUT);\n`,
  );
  // Arduino.addLoopEnd("ultrasonic_ranging", `  ${functionName}();\n`);
  // return null;

  return [`${functionName}()`, Arduino.ORDER_ATOMIC];
};
