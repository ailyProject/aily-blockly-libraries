# Seeed CAN

SeeedStudio CAN bus communication library, supports MCP2515 and MCP2518FD controllers

## Library Info
- **Name**: @aily-project/lib-seeed-can
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `seeed_can_create` | Statement | VAR(field_input), CS_PIN(field_number) | `seeed_can_create("can", 9)` | Dynamic code |
| `seeed_can_begin` | Statement | VAR(field_variable), SPEED(dropdown), CLOCK(dropdown) | `seeed_can_begin(variables_get($can), CAN_5KBPS, MCP_8MHz)` | Dynamic code |
| `seeed_can_send` | Statement | VAR(field_variable), ID(input_value), EXT(dropdown), DATA(input_value) | `seeed_can_send(variables_get($can), math_number(0), "0", text("value"))` | Dynamic code |
| `seeed_can_receive_check` | Value | VAR(field_variable) | `seeed_can_receive_check(variables_get($can))` | See generator |
| `seeed_can_receive` | Statement | VAR(field_variable), LEN(field_variable), ID(field_variable), DATA(field_variable) | `seeed_can_receive(variables_get($can), variables_get($len), variables_get($id), variables_get($data))` | Dynamic code |
| `seeed_can_get_id` | Value | VAR(field_variable) | `seeed_can_get_id(variables_get($can))` | Dynamic code |
| `seeed_can_init_mask` | Statement | VAR(field_variable), NUM(dropdown), EXT(dropdown), MASK(input_value) | `seeed_can_init_mask(variables_get($can), "0", "0", math_number(0))` | Dynamic code |
| `seeed_can_init_filter` | Statement | VAR(field_variable), NUM(dropdown), EXT(dropdown), FILTER(input_value) | `seeed_can_init_filter(variables_get($can), "0", "0", math_number(0))` | Dynamic code |
| `seeed_can_set_mode` | Statement | VAR(field_variable), MODE(dropdown) | `seeed_can_set_mode(variables_get($can), MODE_NORMAL)` | Dynamic code |
| `seeed_can_sleep` | Statement | VAR(field_variable) | `seeed_can_sleep(variables_get($can))` | Dynamic code |
| `seeed_can_wake` | Statement | VAR(field_variable) | `seeed_can_wake(variables_get($can))` | Dynamic code |
| `seeed_can_check_error` | Value | VAR(field_variable) | `seeed_can_check_error(variables_get($can))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SPEED | CAN_5KBPS, CAN_10KBPS, CAN_20KBPS, CAN_25KBPS, CAN_31K25BPS, CAN_33KBPS, CAN_40KBPS, CAN_50KBPS, CAN_80KBPS, CAN_83K3BPS, CAN_95KBPS, CAN_95K2BPS, CAN_100KBPS, CAN_125KBPS, CAN_200KBPS, CAN_250KBPS, CAN_500KBPS, CAN_6... | seeed_can_begin |
| CLOCK | MCP_8MHz, MCP_12MHz, MCP_16MHz | seeed_can_begin |
| EXT | 0, 1 | seeed_can_send, seeed_can_init_mask, seeed_can_init_filter |
| NUM | 0, 1 | seeed_can_init_mask |
| NUM | 0, 1, 2, 3, 4, 5 | seeed_can_init_filter |
| MODE | MODE_NORMAL, MODE_SLEEP, MODE_LISTEN, MODE_CONFIG | seeed_can_set_mode |

## ABS Examples

### Basic Usage
```
arduino_setup()
    seeed_can_create("can", 9)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, seeed_can_receive_check(variables_get($can)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `seeed_can_create("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
