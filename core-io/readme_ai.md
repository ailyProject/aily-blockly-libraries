# Arduino I/O Control Library

Arduino input/output control library for basic pin operations

## Library Information
- **Library Name**: @aily-project/lib-core-io
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters | ABS Format | Generated Code |
|------------|------------|------------|------------|----------------|
| `io_pinmode` | Statement | PIN(input_value), MODE(input_value) | `io_pinmode(io_pin_digi(13), io_mode(OUTPUT))` | `pinMode(13, OUTPUT);` |
| `io_digitalwrite` | Statement | PIN(input_value), STATE(input_value) | `io_digitalwrite(io_pin_digi(13), io_state(HIGH))` | `digitalWrite(13, HIGH);` |
| `io_digitalread` | Value | PIN(input_value) | `io_digitalread(io_pin_digi(2))` | `digitalRead(2)` |
| `io_analogwrite` | Statement | PIN(input_value), PWM(input_value) | `io_analogwrite(io_pin_pwm(9), math_number(128))` | `analogWrite(9, 128);` |
| `io_analogread` | Value | PIN(input_value) | `io_analogread(io_pin_adc(A0))` | `analogRead(A0)` |
| `io_pin_digi` | Value | PIN(dropdown) | `io_pin_digi(13)` | `13` |
| `io_pin_adc` | Value | PIN(dropdown) | `io_pin_adc(A0)` | `A0` |
| `io_pin_pwm` | Value | PIN(dropdown) | `io_pin_pwm(9)` | `9` |
| `io_mode` | Value | MODE(dropdown) | `io_mode(OUTPUT)` | `OUTPUT` |
| `io_state` | Value | STATE(dropdown) | `io_state(HIGH)` | `HIGH` |

## ABS Examples

### Basic LED Control
```
arduino_setup()
    io_pinmode(io_pin_digi(13), io_mode(OUTPUT))

arduino_loop()
    io_digitalwrite(io_pin_digi(13), io_state(HIGH))
    time_delay(math_number(1000))
    io_digitalwrite(io_pin_digi(13), io_state(LOW))
    time_delay(math_number(1000))
```

### Button Input with Pull-up
```
arduino_setup()
    io_pinmode(io_pin_digi(2), io_mode(INPUT_PULLUP))
    io_pinmode(io_pin_digi(13), io_mode(OUTPUT))
    serial_begin(Serial, 9600)

arduino_loop()
    controls_if()
        @IF0: logic_compare(EQ, io_digitalread(io_pin_digi(2)), io_state(LOW))
        @DO0:
            io_digitalwrite(io_pin_digi(13), io_state(HIGH))
            serial_println(Serial, text("Button pressed"))
        @ELSE:
            io_digitalwrite(io_pin_digi(13), io_state(LOW))
```

### Analog Input and PWM Output
```
arduino_setup()
    io_pinmode(io_pin_pwm(9), io_mode(OUTPUT))
    serial_begin(Serial, 9600)

arduino_loop()
    variable_define("sensorValue", "int", io_analogread(io_pin_adc(A0)))
    variable_define("pwmValue", "int", math_arithmetic(DIVIDE, variables_get($sensorValue), math_number(4)))
    
    io_analogwrite(io_pin_pwm(9), variables_get($pwmValue))
    serial_print(Serial, text("Sensor: "))
    serial_print(Serial, variables_get($sensorValue))
    serial_print(Serial, text(" PWM: "))
    serial_println(Serial, variables_get($pwmValue))
    
    time_delay(math_number(100))
```

## Parameter Options

| Parameter | Available Values | Description |
|-----------|------------------|-------------|
| PIN (Digital) | 0-13, etc. | Digital pin numbers (board-specific) |
| PIN (Analog) | A0-A5, etc. | Analog pin identifiers (board-specific) |
| PIN (PWM) | 3,5,6,9,10,11, etc. | PWM-capable pin numbers (board-specific) |
| MODE | INPUT, OUTPUT, INPUT_PULLUP | Pin operating modes |
| STATE | HIGH, LOW | Digital signal levels |
| PWM | 0-255 | PWM duty cycle value |

## Important Notes

1. **Pin Configuration**: Always use `io_pinmode` to configure pins before use
2. **Pin Types**: Use appropriate pin blocks (`io_pin_digi`, `io_pin_adc`, `io_pin_pwm`) for different functions
3. **PWM Range**: PWM values range from 0 (0% duty cycle) to 255 (100% duty cycle)
4. **Analog Range**: Analog readings typically range from 0-1023 (10-bit ADC)
5. **Pull-up Resistors**: Use `INPUT_PULLUP` mode for buttons to avoid external resistors
6. **Board Compatibility**: Use get_board_parameters tools to get valid pin numbers for current board