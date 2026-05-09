# Grove 手势传感器

基于PAJ7620，I2C接口，识别9种手势动作。

## Library Info
- **Name**: @aily-project/lib-seeed-gesture
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `gesture_init` | Statement | — | `gesture_init()` | `gesture_sensor.init();` |
| `gesture_read` | Value | — | `gesture_read()` | `gesture_readGesture()` 返回int(-1表示无) |
| `gesture_is` | Value | GESTURE(dropdown) | `gesture_is(UP)` | `(gesture_readGesture() == (int)UP)` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| GESTURE | UP, DOWN, LEFT, RIGHT, PUSH, POLL, CLOCKWISE, ANTI_CLOCKWISE, WAVE | 手势类型 |

## ABS Examples

```
arduino_setup()
    gesture_init()

arduino_loop()
    controls_if()
        @IF0: gesture_is(UP)
        @DO0:
            serial_println(Serial, text("向上"))
        @IF1: gesture_is(LEFT)
        @DO1:
            serial_println(Serial, text("向左"))
    time_delay(math_number(100))
```

## Notes

1. **全局对象**: 使用固定名称 `gesture_sensor`
2. **手势值**: gesture_read()返回数字，-1表示未检测到手势
3. **检测频率**: 建议loop中100ms读取一次
