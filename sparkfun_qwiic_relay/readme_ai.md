# SparkFun Qwiic Relay 继电器

SparkFun Qwiic Relay 的 Blockly 封装库。

## Library Info
- **Name**: @aily-project/lib-sparkfun-qwiic-relay
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `qwiic_relay_init` | Statement | VAR(field_input), ADDR(dropdown) | `qwiic_relay_init("relay", SINGLE_RELAY_DEFAULT_ADDRESS)` | `Qwiic_Relay relay(SINGLE_RELAY_DEFAULT_ADDRESS); relay.begin();` |
| `qwiic_relay_on` | Statement | VAR(field_variable) | `qwiic_relay_on(variables_get($relay))` | `relay.turnRelayOn();` |
| `qwiic_relay_off` | Statement | VAR(field_variable) | `qwiic_relay_off(variables_get($relay))` | `relay.turnRelayOff();` |
| `qwiic_relay_toggle` | Statement | VAR(field_variable) | `qwiic_relay_toggle(variables_get($relay))` | `relay.toggleRelay();` |
| `qwiic_relay_on_num` | Statement | VAR(field_variable), NUM(input_value) | `qwiic_relay_on_num(variables_get($relay), math_number(1))` | `relay.turnRelayOn(1);` |
| `qwiic_relay_off_num` | Statement | VAR(field_variable), NUM(input_value) | `qwiic_relay_off_num(variables_get($relay), math_number(2))` | `relay.turnRelayOff(2);` |
| `qwiic_relay_all_on` | Statement | VAR(field_variable) | `qwiic_relay_all_on(variables_get($relay))` | `relay.turnAllRelaysOn();` |
| `qwiic_relay_all_off` | Statement | VAR(field_variable) | `qwiic_relay_all_off(variables_get($relay))` | `relay.turnAllRelaysOff();` |
| `qwiic_relay_get_state` | Value(Boolean) | VAR(field_variable) | `qwiic_relay_get_state(variables_get($relay))` | `relay.getState()` |

## Notes

1. `Qwiic_Relay` 构造函数需要地址参数（与其他 Qwiic 库不同）
2. 单路：默认地址 `SINGLE_RELAY_DEFAULT_ADDRESS` (0x18)；四路：`QUAD_RELAY_DEFAULT_ADDRESS` (0x6D)
3. 四路模式的路号从 1 到 4

## ABS Examples

```
arduino_setup()
    qwiic_relay_init("relay", SINGLE_RELAY_DEFAULT_ADDRESS)

arduino_loop()
    qwiic_relay_on(variables_get($relay))
    time_delay(math_number(1000))
    qwiic_relay_off(variables_get($relay))
    time_delay(math_number(1000))
```
