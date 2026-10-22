# AI Pose Gesture

SEN0670 Gravity AI vision gesture and pose sensor with learned hand/pose classes and 13 built-in gestures.

## Library Info
- **Name**: @aily-project/lib-dfrobot-sen0670
- **Version**: 0.1.0

## Block Definitions

Compatibility types: `arduino:avr:uno`, `esp32:esp32:esp32`, `esp32:esp32:esp32c3`, `esp32:esp32:esp32s3`. Nano/Mega and other types are excluded. UNO UART uses SoftwareSerial; ESP32 uses a board hardware port (prefer Serial1; no Serial2 on ESP32-C3).

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sen0670_init_i2c` | Statement | VAR(field_input), WIRE(dropdown) | `sen0670_init_i2c("humanPose", Wire)` | `while (!humanPose.begin()) { ↵ delay(1000); ↵ }` |
| `sen0670_init_uart` | Statement | VAR(field_input), SERIAL(dropdown), RX(dropdown), TX(dropdown) | `sen0670_init_uart("humanPose", Serial1, RX, TX)` | `while (!humanPose.begin()) { ↵ delay(1000); ↵ }` |
| `sen0670_set_model` | Statement | VAR(field_variable), MODEL(dropdown) | `sen0670_set_model($humanPose, eHand)` | `humanPose.setModelType(DFRobot_HumanPose::eHand);` |
| `sen0670_get_result` | Value | VAR(field_variable) | `sen0670_get_result($humanPose)` | `humanPose.getResult() == DFRobot_HumanPose::eOK` |
| `sen0670_available` | Value | VAR(field_variable) | `sen0670_available($humanPose)` | `humanPose.availableResult()` |
| `sen0670_pop` | Statement | VAR(field_variable) | `sen0670_pop($humanPose)` | `humanPoseResult = humanPose.popResult();` |
| `sen0670_field` | Value | VAR(field_variable), FIELD(dropdown) | `sen0670_field($humanPose, ID)` | `(humanPoseResult ? humanPoseResult->id : 0)` |
| `sen0670_name` | Value | VAR(field_variable) | `sen0670_name($humanPose)` | `(humanPoseResult ? humanPoseResult->name : String(""))` |
| `sen0670_pose_pt` | Value | VAR(field_variable), PT(dropdown), XY(dropdown) | `sen0670_pose_pt($humanPose, nose, x)` | `(humanPoseResult ? ((PoseResult *)humanPoseResult)->nose.x : 0)` |
| `sen0670_hand_pt` | Value | VAR(field_variable), PT(dropdown), XY(dropdown) | `sen0670_hand_pt($humanPose, wrist, x)` | `(humanPoseResult ? ((HandResult *)humanPoseResult)->wrist.x : 0)` |
| `sen0670_set_conf` | Statement | VAR(field_variable), VAL(input_value) | `sen0670_set_conf($humanPose, math_number(0))` | `humanPose.setConfidence(0);` |
| `sen0670_set_iou` | Statement | VAR(field_variable), VAL(input_value) | `sen0670_set_iou($humanPose, math_number(0))` | `humanPose.setIOU(0);` |
| `sen0670_set_sim` | Statement | VAR(field_variable), VAL(input_value) | `sen0670_set_sim($humanPose, math_number(0))` | `humanPose.setLearnSimilarity(0);` |
| `sen0670_learn_list` | Statement | VAR(field_variable), MODEL(dropdown) | `sen0670_learn_list($humanPose, eHand)` | `humanPoseLearnList = humanPose.getLearnList(DFRobot_HumanPose::eHand);` |
| `sen0670_learn_size` | Value | VAR(field_variable) | `sen0670_learn_size($humanPose)` | `humanPoseLearnList.size()` |
| `sen0670_learn_name` | Value | VAR(field_variable), INDEX(input_value) | `sen0670_learn_name($humanPose, math_number(0))` | `humanPoseLearnList[0]` |
| `sen0670_set_en` | Statement | PIN(dropdown), LEVEL(dropdown) | `sen0670_set_en(PIN, HIGH)` | `digitalWrite(PIN, HIGH);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SERIAL | Serial1, Serial2, Serial | sen0670_init_uart |
| MODEL | eHand, ePose, eGesture | sen0670_set_model, sen0670_learn_list |
| FIELD | ID, SCORE, X, Y, W, H | sen0670_field |
| PT | nose, leye, reye, lear, rear, lshoulder, rshoulder, lelbow, relbow, lwrist, rwrist, lhip, rhip, lknee, rknee, lankle, rankle | sen0670_pose_pt |
| XY | x, y | sen0670_pose_pt, sen0670_hand_pt |
| PT | wrist, thumbCmc, thumbMcp, thumbIp, thumbTip, indexFingerMcp, indexFingerPip, indexFingerDip, indexFingerTip, middleFingerMcp, middleFingerPip, middleFingerDip, middleFingerTip, ringFingerMcp, ringFingerPip, ringFinge... | sen0670_hand_pt |
| LEVEL | HIGH, LOW | sen0670_set_en |

## ABS Examples

### Basic Usage
```
arduino_setup()
    sen0670_init_i2c("humanPose", Wire)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, sen0670_get_result($humanPose))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `sen0670_init_i2c` creates a Blockly variable. Use `$varName` only for field_variable slots; input_value slots must use the explicit `variables_get($varName)` block.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(true/false)`, variables, or nested value blocks.
