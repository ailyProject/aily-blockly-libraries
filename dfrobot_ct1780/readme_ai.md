# CT1780 K-Type Temperature

DFRobot CT1780 1-Wire K-type high-temperature sensor blocks with bundled OneWire dependency.

## Library Info

- **Name**: `@aily-project/lib-dfrobot-ct1780`
- **Version**: `0.1.0`
- **Arduino class**: `DFRobot_CT1780`
- **Bundled dependency**: `OneWire`

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `ct1780_init` | Statement | `VAR(field_input)`, `PIN(input_value)` | `ct1780_init("ct1780", math_number(2))` | Declares `DFRobot_CT1780 ct1780(pin);` and `uint8_t ct1780_addr[8]`. |
| `ct1780_reset_search` | Statement | `VAR(field_variable)` | `ct1780_reset_search($ct1780)` | `ct1780.reset_search();` |
| `ct1780_search_device` | Value Boolean | `VAR(field_variable)` | `ct1780_search_device($ct1780)` | `ct1780.searchDevice(ct1780_addr)` |
| `ct1780_read_temperature` | Value Number | `VAR(field_variable)` | `ct1780_read_temperature($ct1780)` | `ct1780.getCelsius(ct1780_addr)` |
| `ct1780_config_addr` | Value Number | `VAR(field_variable)` | `ct1780_config_addr($ct1780)` | `ct1780.getConfigAddr(ct1780_addr)` |
| `ct1780_address_byte` | Value Number | `VAR(field_variable)`, `INDEX(input_value)` | `ct1780_address_byte($ct1780, math_number(0))` | `ct1780_addr[index]` |

## Parameter Options

No dropdown parameters.

## ABS Examples

```text
ct1780_init("ct1780", math_number(2))
ct1780_reset_search($ct1780)
ct1780_search_device($ct1780)
ct1780_read_temperature($ct1780)
ct1780_config_addr($ct1780)
```

## Notes

1. `ct1780_search_device` stores the discovered 64-bit unique address in an internal cached address array named after the object variable.
2. Call `ct1780_search_device` successfully before reading temperature or configuration address.
3. Call `ct1780_reset_search` before scanning again from the first device.
4. Temperature returns `NAN` on failure; configuration address returns `-1` on failure.
