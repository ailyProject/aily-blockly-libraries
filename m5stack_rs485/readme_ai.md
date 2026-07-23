# M5Stack Onboard RS485

## Library Info
- **Name**: @aily-project/lib-m5stack-rs485
- **Version**: 0.1.0

## Blocks

| Block | Connection | ABS |
|---|---|---|
| `m5stack_rs485_init` | Statement | `m5stack_rs485_init(math_number(115200))` |
| `m5stack_rs485_available` | Number | `m5stack_rs485_available()` |
| `m5stack_rs485_read_byte` | Number | `m5stack_rs485_read_byte()` |
| `m5stack_rs485_read_line` | String | `m5stack_rs485_read_line()` |
| `m5stack_rs485_write_text` | Boolean | `m5stack_rs485_write_text(text("Hello"), TRUE)` |
| `m5stack_rs485_write_byte` | Boolean | `m5stack_rs485_write_byte(math_number(0))` |

The generator uses board-specific official pin maps and controls DIR only where the hardware requires it.
