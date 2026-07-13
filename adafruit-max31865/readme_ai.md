# MAX31865 RTD Temperature Sensor

Adafruit PT100/PT1000 RTD temperature sensor library via MAX31865 SPI interface.

## Library Info
- **Name**: @aily-project/lib-adafruit-max31865
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `max31865_init` | Statement | VAR(field_input), SPI_MODE(dropdown), CS_PIN(dropdown), WIRES(dropdown), SW_PINS(dummy, dynamic: SW_SCK_PIN, SW_MOSI_PIN, SW_MISO_PIN) | `max31865_init("rtd", HW, 5, MAX31865_2WIRE)` | `Adafruit_MAX31865 rtd(5); rtd.begin(MAX31865_2WIRE);` |
| `max31865_read_temperature` | Value(Number) | VAR(field_variable), RTD_NOMINAL(input_value), REF_RESISTOR(input_value) | `max31865_read_temperature($rtd, math_number(100), math_number(430))` | `rtd.temperature(100, 430)` |
| `max31865_read_rtd` | Value(Number) | VAR(field_variable) | `max31865_read_rtd($rtd)` | `rtd.readRTD()` |
| `max31865_read_fault` | Value(Number) | VAR(field_variable) | `max31865_read_fault($rtd)` | `rtd.readFault()` |
| `max31865_clear_fault` | Statement | VAR(field_variable) | `max31865_clear_fault($rtd)` | `rtd.clearFault();` |
| `max31865_set_wires` | Statement | VAR(field_variable), WIRES(dropdown) | `max31865_set_wires($rtd, MAX31865_3WIRE)` | `rtd.setWires(MAX31865_3WIRE);` |
| `max31865_auto_convert` | Statement | VAR(field_variable), ENABLE(dropdown) | `max31865_auto_convert($rtd, TRUE)` | `rtd.autoConvert(true);` |
| `max31865_enable_50hz` | Statement | VAR(field_variable), ENABLE(dropdown) | `max31865_enable_50hz($rtd, TRUE)` | `rtd.enable50Hz(true);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| SPI_MODE | HW, SW | Hardware SPI (uses SPI pins) or Software SPI (custom pins) |
| WIRES | MAX31865_2WIRE, MAX31865_3WIRE, MAX31865_4WIRE | RTD wire configuration |
| ENABLE | TRUE, FALSE | Enable/disable toggles for auto convert and 50Hz filter |
| CS_PIN | ${board.digitalPins} | Chip Select pin |
| SW_SCK_PIN | ${board.digitalPins} | Software SPI SCK pin (only when SPI_MODE=SW) |
| SW_MOSI_PIN | ${board.digitalPins} | Software SPI MOSI pin (only when SPI_MODE=SW) |
| SW_MISO_PIN | ${board.digitalPins} | Software SPI MISO pin (only when SPI_MODE=SW) |

## ABS Examples

### Basic Temperature Reading (Hardware SPI, PT100)
arduino_setup()
    max31865_init("rtd", HW, 5, MAX31865_2WIRE)
    serial_begin(Serial, 115200)

arduino_loop()
    serial_print(Serial, text("Temperature: "))
    serial_println(Serial, max31865_read_temperature(variables_get($rtd), math_number(100), math_number(430)))
    controls_if()
        @IF0: logic_compare(max31865_read_fault(variables_get($rtd)), NEQ, math_number(0))
        @DO0:
            serial_println(Serial, text("RTD fault detected!"))
            max31865_clear_fault(variables_get($rtd))
    time_delay(math_number(1000))

### Software SPI Mode (PT1000)
arduino_setup()
    max31865_init("rtd", SW, 15, MAX31865_3WIRE)
    serial_begin(Serial, 115200)

arduino_loop()
    serial_println(Serial, max31865_read_temperature(variables_get($rtd), math_number(1000), math_number(4300)))
    time_delay(math_number(500))

## Notes

1. **Variable**: `max31865_init("varName", ...)` creates variable `$varName` of type `Adafruit_MAX31865`; reference it later with `variables_get($varName)`.
2. **RTD nominal**: Use 100 for PT100, 1000 for PT1000.
3. **Reference resistor**: Use 430 for PT100, 4300 for PT1000 (match your breakout board).
4. **Dynamic fields**: `max31865_init` shows SCK/MOSI/MISO pin fields only when SPI_MODE is set to SW (Software SPI).
5. **SPI bus**: `SPI.begin()` is auto-deduplicated using `spi_SPI_begin` key.
6. **Initialization**: Call `max31865_init` inside `arduino_setup()`.
