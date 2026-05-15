# TLx493D 3D magnetic sensor

Infineon XENSIV TLx493D 3D magnetic sensor library reads three-axis magnetic field and temperature data through the I2C interface and supports multiple sensor models.

## Library Info
- **Name**: @aily-project/lib-infineon-tlx493d
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tlx493d_init` | Statement | VAR(field_input), TYPE(dropdown), ADDRESS(dropdown), WIRE(dropdown) | `tlx493d_init("mag", A1B6, TLx493D_IIC_ADDR_A0_e, WIRE)` | Dynamic code |
| `tlx493d_get_temperature` | Value | VAR(field_variable) | `tlx493d_get_temperature(variables_get($mag))` | Dynamic code |
| `tlx493d_get_magnetic_field` | Value | VAR(field_variable), AXIS(dropdown) | `tlx493d_get_magnetic_field(variables_get($mag), X)` | + returnVar + |
| `tlx493d_set_sensitivity` | Statement | VAR(field_variable), RANGE(dropdown) | `tlx493d_set_sensitivity(variables_get($mag), TLx493D_FULL_RANGE_e)` | Dynamic code |
| `tlx493d_set_power_mode` | Statement | VAR(field_variable), MODE(dropdown) | `tlx493d_set_power_mode(variables_get($mag), TLx493D_FAST_MODE_e)` | Dynamic code |
| `tlx493d_has_valid_data` | Value | VAR(field_variable) | `tlx493d_has_valid_data(variables_get($mag))` | Dynamic code |
| `tlx493d_software_reset` | Statement | VAR(field_variable) | `tlx493d_software_reset(variables_get($mag))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | A1B6, A2B6, A2BW, P2B6, W2B6, W2BW, P3B6 | tlx493d_init |
| ADDRESS | TLx493D_IIC_ADDR_A0_e, TLx493D_IIC_ADDR_A1_e, TLx493D_IIC_ADDR_A2_e, TLx493D_IIC_ADDR_A3_e | tlx493d_init |
| AXIS | X, Y, Z | tlx493d_get_magnetic_field |
| RANGE | TLx493D_FULL_RANGE_e, TLx493D_SHORT_RANGE_e, TLx493D_EXTRA_SHORT_RANGE_e | tlx493d_set_sensitivity |
| MODE | TLx493D_FAST_MODE_e, TLx493D_LOW_POWER_MODE_e, TLx493D_ULTRA_LOW_POWER_MODE_e, TLx493D_MASTER_CONTROLLED_MODE_e, TLx493D_POWER_DOWN_MODE_e | tlx493d_set_power_mode |

## ABS Examples

### Basic Usage
```
arduino_setup()
    tlx493d_init("mag", A1B6, TLx493D_IIC_ADDR_A0_e, WIRE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, tlx493d_get_temperature(variables_get($mag)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `tlx493d_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
