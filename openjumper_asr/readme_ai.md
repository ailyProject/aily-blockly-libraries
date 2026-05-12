# YiBi Offline Speech Recognition (ASR)

Adapted to the OpenJumper offline speech recognition module, it uses the serial port to receive speech recognition results, supports a variety of voice command recognition, and is suitable for voice control, smart hom...

## Library Info
- **Name**: @aily-project/lib-asr
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `openjumper_asr_init` | Statement | RX_PIN(dropdown), TX_PIN(dropdown) | `openjumper_asr_init(RX_PIN, TX_PIN)` | Dynamic code |
| `openjumper_asr_data` | Statement | (none) | `openjumper_asr_data()` | asr.asrRun(); |
| `openjumper_asr_rincmd` | Value | ASR_CMD(dropdown) | `openjumper_asr_rincmd("0")` | asr.asrDate == |
| `openjumper_asr_state` | Value | (none) | `openjumper_asr_state()` | asr.WakeUpStatus |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ASR_CMD | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, ... | openjumper_asr_rincmd |

## ABS Examples

### Basic Usage
```
arduino_setup()
    openjumper_asr_init(RX_PIN, TX_PIN)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, openjumper_asr_rincmd("0"))
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
