# ESP32 Rotary Encoder Library

Reads quadrature signals on CLK and DT using the ESP32 pulse counter. SW is an active-low push button.

## Library Info
- **Name**: @aily-project/lib-esp32-encoder
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rotary_encoder_init` | Statement | CLK_PIN(field_number), DT_PIN(field_number), SW_PIN(field_number) | `rotary_encoder_init(6, 7, 8)` | `#define CLK_PIN 6 // GPIO6 ↵ #define DT_PIN 7 // GPIO7 ↵ #define SW_PIN 8 // GPIO8 ↵ ESP32Encoder encoder; ↵ int32_t rawCount = 0; ↵ int32_t lastRawCount = 0; ↵ float lastPos = 0; ↵ float currentPos = 0; ↵ int displayPos = 0; // 用于显示的整数值 ↵ float increment = 0.5; // 增量步长，设置更小以提高精度 ↵ float upperLimit = 5.0; // 上限 ↵ float lowerLimit = 0.0; // 下限 ↵ bool positionChanged = false; ↵ int direction = 0; // 0:无变化, 1:向右, -1:向左 ↵ bool isAboveLimit = false; ↵ bool isBelowLimit = false; ↵ bool buttonPressed = false; ↵ bool lastButtonState = HIGH; ↵ unsigned long lastDebounceTime = 0; ↵ const unsigned long debounceDelay = 50; ↵ encoder.attachHalfQuad(CLK_PIN, DT_PIN); ↵ pinMode(SW_PIN, INPUT_PULLUP); ↵ // 设置编码器起始值 ↵ encoder.clearCount(); ↵ // 初始化位置 ↵ currentPos = lowerLimit; ↵ displayPos = lowerLimit; ↵ rawCount = 0; ↵ lastRawCount = 0; ↵ // 检测编码器状态变化 ↵ // 完全重新设计计数逻辑 ↵ rawCount = encoder.getCount(); ↵ // 只有在原始计数发生变化时才处理 ↵ if (rawCount != lastRawCount) { ↵ // 计算新位置，使用浮点数以保留精度 ↵ lastPos = currentPos; ↵ currentPos += (rawCount - lastRawCount) * increment; ↵ lastRawCount = rawCount; ↵ // 判断旋转方向 ↵ if (currentPos > lastPos) { ↵ direction = 1; // 向右旋转 ↵ } else if (currentPos < lastPos) { ↵ direction = -1; // 向左旋转 ↵ } ↵ // 限制位置在上下限之间 ↵ if (currentPos > upperLimit) { ↵ currentPos = upperLimit; ↵ isAboveLimit = true; ↵ } else { ↵ isAboveLimit = false; ↵ } ↵ if (currentPos < lowerLimit) { ↵ currentPos = lowerLimit; ↵ isBelowLimit = true; ↵ } else { ↵ isBelowLimit = false; ↵ } ↵ // 更新显示位置（四舍五入到整数） ↵ displayPos = round(currentPos); ↵ positionChanged = true; ↵ } else { ↵ positionChanged = false; ↵ } ↵ // 检测按键状态 ↵ bool reading = digitalRead(SW_PIN); ↵ if (reading != lastButtonState) { ↵ lastDebounceTime = millis(); ↵ } ↵ if ((millis() - lastDebounceTime) > debounceDelay) { ↵ if (reading != buttonPressed && reading == LOW) { ↵ buttonPressed = true; ↵ } else { ↵ buttonPressed = false; ↵ } ↵ } ↵ lastButtonState = reading;` |
| `rotary_encoder_read` | Value | (none) | `rotary_encoder_read()` | `displayPos` |
| `rotary_encoder_value_changed` | Value | (none) | `rotary_encoder_value_changed()` | `positionChanged` |
| `rotary_encoder_state_change` | Statement | STATE(dropdown), DO(input_statement) | `rotary_encoder_state_change(CHANGED)` | `if (positionChanged) { ↵ }` |
| `rotary_encoder_get_property` | Value | PROPERTY(dropdown) | `rotary_encoder_get_property(POSITION)` | `displayPos` |
| `rotary_encoder_set_property` | Statement | PROPERTY(dropdown), VALUE(input_value) | `rotary_encoder_set_property(POSITION, math_number(0))` | `currentPos = 1; ↵ displayPos = round(currentPos); ↵ lastRawCount = 0; ↵ encoder.clearCount();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| STATE | CHANGED, LEFT, RIGHT, ABOVE_LIMIT, BELOW_LIMIT | rotary_encoder_state_change |
| PROPERTY | POSITION, DIRECTION, INCREMENT, UPPER_LIMIT, LOWER_LIMIT | rotary_encoder_get_property |
| PROPERTY | POSITION, INCREMENT, UPPER_LIMIT, LOWER_LIMIT | rotary_encoder_set_property |

## ABS Examples

### Basic Usage
```
arduino_setup()
    rotary_encoder_init(6, 7, 8)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, rotary_encoder_read())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

## Encoder wiring and switch

Connect CLK and DT to GPIO inputs and SW to an input with the internal pull-up. Connect the switch to ground. The PRESSED event fires once per stable press after 50 ms. BUTTON_HELD returns 1 until a stable release and 0 afterwards.
