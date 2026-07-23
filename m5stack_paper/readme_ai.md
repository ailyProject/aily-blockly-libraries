# Paper Onboard Sensors

## Library Info
- **Name**: @aily-project/lib-m5stack-paper
- **Version**: 0.1.0
- **Official source**: M5Unit-ENV SHT3X

## Blocks

| Block | Connection | ABS |
|---|---|---|
| `m5paper_init` | Statement | `m5paper_init()` |
| `m5paper_sht_available` | Boolean | `m5paper_sht_available()` |
| `m5paper_sht_value` | Number | `m5paper_sht_value(TEMPERATURE)` |
| `m5paper_fram_write_byte` | Boolean | `m5paper_fram_write_byte(math_number(0), math_number(0))` |
| `m5paper_fram_read_byte` | Number | `m5paper_fram_read_byte(math_number(0))` |
| `m5paper_fram_write_text` | Boolean | `m5paper_fram_write_text(math_number(0), text("Hello"))` |
| `m5paper_fram_read_text` | String | `m5paper_fram_read_text(math_number(0), math_number(32))` |

SHT readings are cached for 500ms. FRAM addresses and lengths are constrained so no operation crosses the 256-byte capacity.
