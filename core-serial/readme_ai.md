# Arduino Serial Communication Library

Core library for serial communication and data exchange

## Library Information
- **Library Name**: @aily-project/lib-core-serial
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters | ABS Format | Generated Code |
|------------|------------|------------|------------|----------------|
| `serial_begin` | Statement | SERIAL(dropdown), SPEED(dropdown) | `serial_begin(Serial, 9600)` | `Serial.begin(9600);` |
| `serial_available` | Value | SERIAL(dropdown) | `serial_available(Serial)` | `Serial.available()` |
| `serial_read` | Value | SERIAL(dropdown), TYPE(dropdown) | `serial_read(Serial, "read()")` | `Serial.read()` |
| `serial_read_until` | Value | SERIAL(dropdown), TERMINATOR(input_value) | `serial_read_until(Serial, text("\\n"))` | `Serial.readStringUntil('\\n')` |
| `serial_read_string` | Value | SERIAL(dropdown) | `serial_read_string(Serial)` | `Serial.readString()` |
| `serial_print` | Statement | SERIAL(dropdown), VAR(input_value) | `serial_print(Serial, text("Hello"))` | `Serial.print("Hello");` |
| `serial_println` | Statement | SERIAL(dropdown), VAR(input_value) | `serial_println(Serial, text("Hello"))` | `Serial.println("Hello");` |
| `serial_write` | Statement | SERIAL(dropdown), DATA(input_value) | `serial_write(Serial, math_number(65))` | `Serial.write(65);` |
| `serial_begin_esp32_custom` | Statement | VAR(field_input), UART(dropdown), SPEED(dropdown), RX(dropdown), TX(dropdown) | `serial_begin_esp32_custom("mySerial", "UART1", 9600, 16, 17)` | `HardwareSerial mySerial(1); mySerial.begin(9600, SERIAL_8N1, 16, 17);` |

## ABS Examples

### Basic Serial Output
```
arduino_setup()
    serial_begin(Serial, 9600)
    serial_println(Serial, text("Arduino started!"))

arduino_loop()
    serial_print(Serial, text("Uptime: "))
    serial_print(Serial, time_millis())
    serial_println(Serial, text(" ms"))
    time_delay(math_number(1000))
```

### Serial Input Processing
```
arduino_setup()
    serial_begin(Serial, 9600)
    serial_println(Serial, text("Send commands:"))

arduino_loop()
    controls_if()
        @IF0: logic_compare(GT, serial_available(Serial), math_number(0))
        @DO0:
            variable_define("command", String, serial_read_string(Serial))
            
            controls_if()
                @IF0: text_equals(variables_get($command), text("LED_ON"))
                @DO0:
                    io_digitalwrite(io_pin_digi(13), io_state(HIGH))
                    serial_println(Serial, text("LED turned ON"))
                @ELSEIF0: text_equals(variables_get($command), text("LED_OFF"))
                @DO1:
                    io_digitalwrite(io_pin_digi(13), io_state(LOW))
                    serial_println(Serial, text("LED turned OFF"))
                @ELSE:
                    serial_print(Serial, text("Unknown command: "))
                    serial_println(Serial, variables_get($command))
```

### Data Parsing and Validation
```
arduino_setup()
    serial_begin(Serial, 9600)
    serial_println(Serial, text("Enter numbers:"))

arduino_loop()
    controls_if()
        @IF0: logic_compare(GT, serial_available(Serial), math_number(0))
        @DO0:
            variable_define("input", int, serial_read(Serial, "parseInt()"))
            
            controls_if()
                @IF0: logic_compare(GT, variables_get($input), math_number(0))
                @DO0:
                    variable_define("square", int, math_arithmetic(MULTIPLY, 
                        variables_get($input), 
                        variables_get($input)))
                    
                    serial_print(Serial, text("Square of "))
                    serial_print(Serial, variables_get($input))
                    serial_print(Serial, text(" is "))
                    serial_println(Serial, variables_get($square))
                @ELSE:
                    serial_println(Serial, text("Please enter a positive number"))
```

### Multi-line Data Reading
```
arduino_setup()
    serial_begin(Serial, 9600)
    serial_println(Serial, text("Send data (end with #):"))

arduino_loop()
    controls_if()
        @IF0: logic_compare(GT, serial_available(Serial), math_number(0))
        @DO0:
            variable_define("data", String, serial_read_until(Serial, text("#")))
            
            serial_print(Serial, text("Received: "))
            serial_println(Serial, variables_get($data))
            
            serial_print(Serial, text("Length: "))
            serial_println(Serial, text_length(variables_get($data)))
```

### Binary Data Communication
```
arduino_global()
    variable_define("counter", int, math_number(0))

arduino_setup()
    serial_begin(Serial, 9600)

arduino_loop()
    // Send binary data
    serial_write(Serial, math_number(0xFF))  // Send 255
    serial_write(Serial, variables_get($counter))
    
    // Read binary data if available
    controls_if()
        @IF0: logic_compare(GTE, serial_available(Serial), math_number(2))
        @DO0:
            variable_define("byte1", int, serial_read(Serial, "read()"))
            variable_define("byte2", int, serial_read(Serial, "read()"))
            
            serial_print(Serial, text("Received bytes: "))
            serial_print(Serial, variables_get($byte1))
            serial_print(Serial, text(", "))
            serial_println(Serial, variables_get($byte2))
    
    variables_set($counter, math_arithmetic(ADD, variables_get($counter), math_number(1)))
    time_delay(math_number(1000))
```

### ESP32 Custom Serial Port
```
arduino_setup()
    // Initialize custom serial on ESP32
    serial_begin_esp32_custom("mySerial", "UART1", 115200, 16, 17)
    serial_begin(Serial, 9600)
    
    serial_println(Serial, text("ESP32 dual serial ready"))

arduino_loop()
    // Echo between Serial and custom serial
    controls_if()
        @IF0: logic_compare(GT, serial_available(Serial), math_number(0))
        @DO0:
            variable_define("data", String, serial_read_string(Serial))
            serial_println(mySerial, variables_get($data))
    
    controls_if()
        @IF0: logic_compare(GT, serial_available(mySerial), math_number(0))
        @DO0:
            variable_define("data", String, serial_read_string(mySerial))
            serial_println(Serial, variables_get($data))
```

## Parameter Options

| Parameter | Available Values | Description |
|-----------|------------------|-------------|
| SERIAL | Serial, Serial1, Serial2, Serial3 | Available serial ports (board-dependent) |
| SPEED | 9600, 19200, 38400, 57600, 115200, etc. | Baud rate options |
| TYPE | read(), peek(), parseInt(), parseFloat(), readString(), etc. | Data reading methods |
| UART | UART0, UART1 | ESP32 UART peripherals |

### Read Types Explained

- `read()` - Read single byte as integer (0-255)
- `peek()` - Read byte without removing from buffer
- `parseInt()` - Parse integer from incoming characters
- `parseFloat()` - Parse floating-point number
- `readString()` - Read entire incoming string
- `readStringUntil('\\n')` - Read until newline character

## Important Notes

1. **Initialization**: Always call `serial_begin()` in `arduino_setup()`
2. **Baud Rate Matching**: Both ends must use the same baud rate
3. **Buffer Management**: Serial buffer is limited; read data promptly
4. **Data Types**: `print()` formats data, `write()` sends raw bytes
5. **Line Endings**: Consider different line ending conventions (\\r, \\n, \\r\\n)
6. **Timeout**: `parseInt()` and `parseFloat()` have default 1-second timeout
7. **ESP32 Custom**: Custom serial ports require pin specification
8. **Blocking Operations**: Some read operations may block until data arrives