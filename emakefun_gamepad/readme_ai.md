# Emakefun游戏手柄

Emakefun游戏手柄库，支持按键、摇杆、陀螺仪及2.4G/BLE无线通信。

## 库信息
- **名称**: @aily-project/lib-emakefun-gamepad
- **版本**: 1.0.0

## 块定义

| 块类型 | 连接类型 | 参数 (args0顺序) | ABS格式 | 生成代码 |
|--------|----------|------------------|---------|----------|
| `emakefun_gamepad_initialize` | Statement | VAR(field_input), ENABLE_GYRO(dropdown) | `emakefun_gamepad_initialize("gamepad", TRUE)` | `Gamepad gamepad; gamepad.Initialize(); gamepad.EnableGyroscope(true);` |
| `emakefun_gamepad_model_create` | Statement | VAR(field_input) | `emakefun_gamepad_model_create("gamepadModel")` | `GamepadModel gamepadModel;` |
| `emakefun_gamepad_attach_model` | Statement | GAMEPAD(field_variable), MODEL(field_variable) | `emakefun_gamepad_attach_model(variables_get($gamepad), variables_get($gamepadModel))` | `gamepad.AttachModel(&gamepadModel);` |
| `emakefun_gamepad_model_add_observer` | Statement | MODEL(field_variable), OBSERVER(field_variable) | `emakefun_gamepad_model_add_observer(variables_get($gamepadModel), variables_get($publisher))` | `gamepadModel.AddObserver(&publisher);` |
| `emakefun_gamepad_button_pressed` | Hat | MODEL(field_variable), BUTTON(dropdown), HANDLER(input_statement) | `emakefun_gamepad_button_pressed(variables_get($gamepadModel), "5") @HANDLER: action()` | `if (gamepadModel.ButtonPressed(kButtonA)) { action(); }` |
| `emakefun_gamepad_button_released` | Hat | MODEL(field_variable), BUTTON(dropdown), HANDLER(input_statement) | `emakefun_gamepad_button_released(variables_get($gamepadModel), "5") @HANDLER: action()` | `if (gamepadModel.ButtonReleased(kButtonA)) { action(); }` |
| `emakefun_gamepad_get_button_state` | Value | MODEL(field_variable), BUTTON(dropdown) | `emakefun_gamepad_get_button_state(variables_get($gamepadModel), "5")` | `gamepadModel.GetButtonState(kButtonA)` |
| `emakefun_gamepad_get_joystick_x` | Value | MODEL(field_variable) | `emakefun_gamepad_get_joystick_x(variables_get($gamepadModel))` | `gamepadModel.GetJoystickCoordinate().x` |
| `emakefun_gamepad_get_joystick_y` | Value | MODEL(field_variable) | `emakefun_gamepad_get_joystick_y(variables_get($gamepadModel))` | `gamepadModel.GetJoystickCoordinate().y` |
| `emakefun_gamepad_get_gravity_x` | Value | MODEL(field_variable) | `emakefun_gamepad_get_gravity_x(variables_get($gamepadModel))` | `gamepadModel.GetGravityAcceleration().x` |
| `emakefun_gamepad_get_gravity_y` | Value | MODEL(field_variable) | `emakefun_gamepad_get_gravity_y(variables_get($gamepadModel))` | `gamepadModel.GetGravityAcceleration().y` |
| `emakefun_gamepad_get_gravity_z` | Value | MODEL(field_variable) | `emakefun_gamepad_get_gravity_z(variables_get($gamepadModel))` | `gamepadModel.GetGravityAcceleration().z` |
| `emakefun_gamepad_new_joystick_coordinate` | Value | MODEL(field_variable) | `emakefun_gamepad_new_joystick_coordinate(variables_get($gamepadModel))` | `gamepadModel.NewJoystickCoordinate()` |
| `emakefun_gamepad_new_gravity_acceleration` | Value | MODEL(field_variable) | `emakefun_gamepad_new_gravity_acceleration(variables_get($gamepadModel))` | `gamepadModel.NewGravityAcceleration()` |
| `emakefun_gamepad_publisher_rf24_create` | Statement | VAR(field_input), CE_PIN(input_value), CS_PIN(input_value), CHANNEL(input_value), ADDR_WIDTH(input_value), ADDRESS(input_value) | `emakefun_gamepad_publisher_rf24_create("publisher", math_number(7), math_number(8), math_number(115), math_number(5), math_number(73014444097))` | `GamepadPublisherRf24 publisher(7, 8); publisher.Initialize(115, 5, 0x0011000011LL);` |
| `emakefun_gamepad_subscriber_rf24_create` | Statement | VAR(field_input), CE_PIN(input_value), CS_PIN(input_value), CHANNEL(input_value), ADDR_WIDTH(input_value), ADDRESS(input_value) | `emakefun_gamepad_subscriber_rf24_create("subscriber", math_number(7), math_number(8), math_number(115), math_number(5), math_number(73014444097))` | `GamepadSubscriberRf24 subscriber(7, 8); subscriber.Initialize(115, 5, 0x0011000011LL);` |
| `emakefun_gamepad_subscriber_rf24_attach_model` | Statement | SUBSCRIBER(field_variable), MODEL(field_variable) | `emakefun_gamepad_subscriber_rf24_attach_model(variables_get($subscriber), variables_get($gamepadModel))` | `subscriber.AttachModel(&gamepadModel);` |
| `emakefun_gamepad_publisher_ble_create` | Statement | VAR(field_input), SERIAL(dropdown) | `emakefun_gamepad_publisher_ble_create("publisher", Serial)` | `GamepadPublisherBle publisher; publisher.Initialize(Serial);` |
| `emakefun_gamepad_subscriber_ble_create` | Statement | VAR(field_input), SERIAL(dropdown) | `emakefun_gamepad_subscriber_ble_create("subscriber", Serial)` | `GamepadSubscriberBle subscriber; subscriber.Initialize(Serial);` |
| `emakefun_gamepad_subscriber_ble_attach_model` | Statement | SUBSCRIBER(field_variable), MODEL(field_variable) | `emakefun_gamepad_subscriber_ble_attach_model(variables_get($subscriber), variables_get($gamepadModel))` | `subscriber.AttachModel(&gamepadModel);` |

## 参数选项

| 参数 | 值 | 描述 |
|------|-----|------|
| ENABLE_GYRO | true, false | 是否启用陀螺仪 |
| BUTTON | 0-8 | 按键类型：0=摇杆按键, 1=L键, 2=R键, 3=Select键, 4=Mode键, 5=A键, 6=B键, 7=C键, 8=D键 |
| SERIAL | Serial, Serial1, etc. | 串口选择 |

## ABS示例

### 手柄端基本使用
```
arduino_setup()
    emakefun_gamepad_initialize("gamepad", TRUE)
    emakefun_gamepad_model_create("gamepadModel")
    emakefun_gamepad_attach_model(variables_get($gamepad), variables_get($gamepadModel))
    serial_begin(Serial, 115200)

arduino_loop()
    controls_if()
        @IF0: emakefun_gamepad_get_button_state(variables_get($gamepadModel), "5")
        @DO0:
            serial_println(Serial, text("A button pressed"))
```

### 2.4G无线发送端（手柄）
```
arduino_setup()
    emakefun_gamepad_initialize("gamepad", FALSE)
    emakefun_gamepad_model_create("gamepadModel")
    emakefun_gamepad_publisher_rf24_create("publisher", math_number(7), math_number(8), math_number(115), math_number(5), math_number(73014444097))
    emakefun_gamepad_attach_model(variables_get($gamepad), variables_get($gamepadModel))
    emakefun_gamepad_model_add_observer(variables_get($gamepadModel), variables_get($publisher))
    serial_begin(Serial, 115200)
```

### 2.4G无线接收端
```
arduino_setup()
    emakefun_gamepad_model_create("gamepadModel")
    emakefun_gamepad_subscriber_rf24_create("subscriber", math_number(7), math_number(8), math_number(115), math_number(5), math_number(73014444097))
    emakefun_gamepad_subscriber_rf24_attach_model(variables_get($subscriber), variables_get($gamepadModel))
    serial_begin(Serial, 115200)

arduino_loop()
    controls_if()
        @IF0: emakefun_gamepad_get_button_state(variables_get($gamepadModel), "5")
        @DO0:
            serial_println(Serial, text("A button pressed"))
```

## 注意事项

1. **变量引用**: 使用 `variables_get($varName)` 在值槽中引用已创建的变量
2. **参数顺序**: 遵循 `block.json` args0 定义的顺序
3. **2.4G引脚**: UNO使用CE=10, CS=9；Nano使用CE=7, CS=8
4. **依赖库**: 使用2.4G通信需要安装RF24库
