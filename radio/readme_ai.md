# RadioLib LoRa Radio

Universal wireless communication library supporting LoRa (SX127x/SX126x/SX128x/LLCC68) and other RF modules

## Library Info
- **Name**: @aily-project/lib-radiolib
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `radiolib_lora_init` | Statement | CHIP(dropdown), VAR(field_input), CS(input_value), IRQ(input_value), RST(input_value), GPIO(input_value), FREQ(input_value), POWER(input_value) | `radiolib_lora_init(SX1278, "radio", math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | Dynamic code |
| `radiolib_set_bandwidth` | Statement | VAR(field_variable), BW(dropdown) | `radiolib_set_bandwidth(variables_get($radio), "7.8")` | Dynamic code |
| `radiolib_set_spreading_factor` | Statement | VAR(field_variable), SF(dropdown) | `radiolib_set_spreading_factor(variables_get($radio), "6")` | Dynamic code |
| `radiolib_set_coding_rate` | Statement | VAR(field_variable), CR(dropdown) | `radiolib_set_coding_rate(variables_get($radio), "5")` | Dynamic code |
| `radiolib_set_frequency` | Statement | VAR(field_variable), FREQ(input_value) | `radiolib_set_frequency(variables_get($radio), math_number(0))` | Dynamic code |
| `radiolib_set_power` | Statement | VAR(field_variable), POWER(input_value) | `radiolib_set_power(variables_get($radio), math_number(0))` | Dynamic code |
| `radiolib_set_sync_word` | Statement | VAR(field_variable), SYNC(input_value) | `radiolib_set_sync_word(variables_get($radio), math_number(0))` | Dynamic code |
| `radiolib_transmit` | Statement | VAR(field_variable), MESSAGE(input_value) | `radiolib_transmit(variables_get($radio), text("value"))` | Dynamic code |
| `radiolib_receive` | Value | VAR(field_variable) | `radiolib_receive(variables_get($radio))` | Dynamic code |
| `radiolib_on_receive` | Hat | VAR(field_variable), HANDLER(input_statement) | `radiolib_on_receive(variables_get($radio)) @HANDLER: child_block()` | Dynamic code |
| `radiolib_start_receive` | Statement | VAR(field_variable) | `radiolib_start_receive(variables_get($radio))` | Dynamic code |
| `radiolib_received_data` | Value | VAR(field_variable) | `radiolib_received_data(variables_get($radio))` | _rl_data_ |
| `radiolib_received_rssi` | Value | VAR(field_variable) | `radiolib_received_rssi(variables_get($radio))` | _rl_rssi_ |
| `radiolib_received_snr` | Value | VAR(field_variable) | `radiolib_received_snr(variables_get($radio))` | _rl_snr_ |
| `radiolib_get_rssi` | Value | VAR(field_variable) | `radiolib_get_rssi(variables_get($radio))` | Dynamic code |
| `radiolib_get_snr` | Value | VAR(field_variable) | `radiolib_get_snr(variables_get($radio))` | Dynamic code |
| `radiolib_sleep` | Statement | VAR(field_variable) | `radiolib_sleep(variables_get($radio))` | Dynamic code |
| `radiolib_standby` | Statement | VAR(field_variable) | `radiolib_standby(variables_get($radio))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| CHIP | SX1278, SX1276, SX1262, SX1268, LLCC68, SX1280 | radiolib_lora_init |
| BW | 7.8, 10.4, 15.6, 20.8, 31.25, 41.7, 62.5, 125.0, 250.0, 500.0 | radiolib_set_bandwidth |
| SF | 6, 7, 8, 9, 10, 11, 12 | radiolib_set_spreading_factor |
| CR | 5, 6, 7, 8 | radiolib_set_coding_rate |

## ABS Examples

### Basic Usage
```
arduino_setup()
    radiolib_lora_init(SX1278, "radio", math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, radiolib_receive(variables_get($radio)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `radiolib_lora_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
