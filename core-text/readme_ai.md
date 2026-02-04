# Arduino Text Manipulation Library

Core library for text and string operations

## Library Information
- **Library Name**: @aily-project/lib-core-text
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters | ABS Format | Generated Code |
|------------|------------|------------|------------|----------------|
| `text` | Value | TEXT(field_input) | `text("Hello World")` | `"Hello World"` |
| `char` | Value | CHAR(field_input) | `char('A')` | `'A'` |
| `text_join` | Value | Multiple inputs | `text_join(text("Hello"), text(" "), text("World"))` | `String("Hello") + String(" ") + String("World")` |
| `string_add_string` | Value | STRING1(input_value), STRING2(input_value) | `string_add_string(text("Hello"), text("World"))` | `String("Hello") + String("World")` |
| `text_length` | Value | VALUE(input_value) | `text_length(text("Hello"))` | `String("Hello").length()` |
| `text_isEmpty` | Value | VALUE(input_value) | `text_isEmpty(text(""))` | `String("").length() == 0` |
| `text_indexOf` | Value | VALUE(input_value), FIND(input_value) | `text_indexOf(text("Hello"), text("llo"))` | `String("Hello").indexOf("llo")` |
| `text_charAt` | Value | VALUE(input_value), AT(input_value) | `text_charAt(text("Hello"), math_number(0))` | `String("Hello").charAt(0)` |
| `text_getSubstring` | Value | STRING(input_value), AT1(dropdown), AT2(dropdown) | `text_getSubstring(text("Hello"), "FIRST", "LAST")` | `String("Hello").substring(0)` |
| `text_changeCase` | Value | TEXT(input_value), CASE(dropdown) | `text_changeCase(text("Hello"), "UPPERCASE")` | `String("Hello").toUpperCase()` |
| `text_trim` | Value | TEXT(input_value), MODE(dropdown) | `text_trim(text(" Hello "), "BOTH")` | `String(" Hello ").trim()` |
| `number_to_string` | Value | NUM(input_value) | `number_to_string(math_number(42))` | `String(42)` |
| `number_to` | Value | NUM(input_value) | `number_to(math_number(65))` | `char(65)` |
| `toascii` | Value | CHAR(input_value) | `toascii(char('A'))` | `int('A')` |

## ABS Examples

### Basic Text Operations
```
arduino_setup()
    variable_define("greeting", String, text("Hello"))
    variable_define("name", String, text("Arduino"))
    variable_define("message", String, string_add_string(variables_get($greeting), variables_get($name)))
    
    serial_begin(Serial, 9600)
    serial_println(Serial, variables_get($message))
    
    serial_print(Serial, text("Message length: "))
    serial_println(Serial, text_length(variables_get($message)))
```

### String Manipulation and Analysis
```
arduino_setup()
    variable_define("sentence", String, text("The quick brown fox"))
    serial_begin(Serial, 9600)
    
    // Length and emptiness check
    serial_print(Serial, text("Length: "))
    serial_println(Serial, text_length(variables_get($sentence)))
    
    controls_if()
        @IF0: text_isEmpty(variables_get($sentence))
        @DO0:
            serial_println(Serial, text("String is empty"))
        @ELSE:
            serial_println(Serial, text("String is not empty"))
    
    // Find substring
    variable_define("position", int, text_indexOf(variables_get($sentence), text("fox")))
    serial_print(Serial, text("'fox' found at position: "))
    serial_println(Serial, variables_get($position))
    
    // Character at position
    variable_define("firstChar", char, text_charAt(variables_get($sentence), math_number(0)))
    serial_print(Serial, text("First character: "))
    serial_println(Serial, variables_get($firstChar))
```

### Text Joining and Formatting
```
variable_define("sensor1", int, math_number(25))
variable_define("sensor2", int, math_number(30))
variable_define("sensor3", int, math_number(22))

arduino_setup()
    
    serial_begin(Serial, 9600)

arduino_loop()
    // Create formatted output using text_join
    variable_define("report", String, text_join(
        text("Sensors: "),
        number_to_string(variables_get($sensor1)),
        text("°C, "),
        number_to_string(variables_get($sensor2)),
        text("°C, "),
        number_to_string(variables_get($sensor3)),
        text("°C")
    ))
    
    serial_println(Serial, variables_get($report))
    time_delay(math_number(2000))
```

### Case Conversion and Trimming
```
arduino_setup()
    variable_define("userInput", String, text("  Hello World  "))
    serial_begin(Serial, 9600)
    
    serial_print(Serial, text("Original: '"))
    serial_print(Serial, variables_get($userInput))
    serial_println(Serial, text("'"))
    
    // Trim whitespace
    variable_define("trimmed", String, text_trim(variables_get($userInput), BOTH))
    serial_print(Serial, text("Trimmed: '"))
    serial_print(Serial, variables_get($trimmed))
    serial_println(Serial, text("'"))
    
    // Case conversion
    variable_define("uppercase", String, text_changeCase(variables_get($trimmed), UPPERCASE))
    variable_define("lowercase", String, text_changeCase(variables_get($trimmed), LOWERCASE))
    
    serial_print(Serial, text("Uppercase: "))
    serial_println(Serial, variables_get($uppercase))
    serial_print(Serial, text("Lowercase: "))
    serial_println(Serial, variables_get($lowercase))
```

### Substring Extraction
```
arduino_setup()
    variable_define("data", String, text("Temperature:25.6"))
    serial_begin(Serial, 9600)
    
    // Find colon position
    variable_define("colonPos", int, text_indexOf(variables_get($data), text(":")))
    
    controls_if()
        @IF0: logic_compare(GT, variables_get($colonPos), math_number(-1))
        @DO0:
            // Extract temperature value after colon
            variable_define("tempStr", String, text_getSubstring(
                variables_get($data), 
                math_number(variables_get($colonPos) + 1), 
                "LAST"))
            
            serial_print(Serial, text("Temperature value: "))
            serial_println(Serial, variables_get($tempStr))
        @ELSE:
            serial_println(Serial, text("Invalid data format"))
```

### Character and ASCII Operations
```
arduino_setup()
    serial_begin(Serial, 9600)
    
    // ASCII to character conversion
    variable_define("asciiValue", int, math_number(65))
    variable_define("character", char, number_to(variables_get($asciiValue)))
    
    serial_print(Serial, text("ASCII 65 = "))
    serial_println(Serial, variables_get($character))
    
    // Character to ASCII conversion
    variable_define("letter", char, char('Z'))
    variable_define("asciiCode", int, toascii(variables_get($letter)))
    
    serial_print(Serial, text("'Z' = ASCII "))
    serial_println(Serial, variables_get($asciiCode))
    
    // Character range operations
    controls_for("i", math_number(65), math_number(90), math_number(1))
        serial_print(Serial, number_to(variables_get($i)))
        serial_print(Serial, text(" "))
    
    serial_println(Serial, text(""))
```

## Parameter Options

| Parameter | Available Values | Description |
|-----------|------------------|-------------|
| CASE | UPPERCASE, LOWERCASE, TITLECASE | Text case conversion options |
| MODE (trim) | LEFT, RIGHT, BOTH | Whitespace trimming modes |
| AT1/AT2 | FIRST, LAST, FROM_START, FROM_END | Substring position references |
| INDEX | Number | Character position (0-based indexing) |

## Important Notes

1. **String vs char**: Use `text()` for strings, `char()` for single characters
2. **Memory Management**: String operations can consume RAM; use cautiously
3. **Indexing**: String/character indexing is 0-based (first character is at position 0)
4. **Case Sensitivity**: String comparisons and searches are case-sensitive
5. **ASCII Range**: Standard ASCII characters range from 0-127
6. **Empty Strings**: Check for empty strings before operations to avoid errors
7. **Substring Bounds**: Ensure substring indices are within string length
8. **Performance**: Multiple string concatenations can be slow; consider alternatives