# SparkFun MAX30105 Pulse Oximeter & Heart Rate Sensor

Blockly wrapper for SparkFun MAX30105 pulse oximeter and heart rate sensor.

## Library Info
- **Name**: @aily-project/lib-sparkfun-max30105
- **Version**: 0.0.2

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `max30105_init` | Statement | VAR(field_input) | `max30105_init("heartSensor")` | `Wire.begin(); ↵ heartSensor.begin();` |
| `max30105_setup` | Statement | VAR(field_variable), LED_PWR(dropdown), SAMPLE_AVG(dropdown), LED_MODE(dropdown), SAMPLE_RATE(dropdown), PULSE_WIDTH(dropdown), ADC_RANGE(dropdown) | `max30105_setup($heartSensor, "60", "4", "2", "100", "411", "16384")` | `heartSensor.setup(60, 4, 2, 100, 411, 16384);` |
| `max30105_safe_check` | Value | VAR(field_variable), TIMEOUT(input_value) | `max30105_safe_check($heartSensor, math_number(1000))` | `heartSensor.safeCheck(1)` |
| `max30105_get_red` | Value | VAR(field_variable) | `max30105_get_red($heartSensor)` | `heartSensor.getRed()` |
| `max30105_get_ir` | Value | VAR(field_variable) | `max30105_get_ir($heartSensor)` | `heartSensor.getIR()` |
| `max30105_get_green` | Value | VAR(field_variable) | `max30105_get_green($heartSensor)` | `heartSensor.getGreen()` |
| `max30105_shutdown` | Statement | VAR(field_variable) | `max30105_shutdown($heartSensor)` | `heartSensor.shutDown();` |
| `max30105_wakeup` | Statement | VAR(field_variable) | `max30105_wakeup($heartSensor)` | `heartSensor.wakeUp();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| LED_PWR | 60, 20, 6 | max30105_setup |
| SAMPLE_AVG | 4, 8, 1, 16, 32 | max30105_setup |
| LED_MODE | 2, 1, 3 | max30105_setup |
| SAMPLE_RATE | 100, 400, 800, 1000 | max30105_setup |
| PULSE_WIDTH | 411, 118, 215 | max30105_setup |
| ADC_RANGE | 16384, 4096, 8192, 32768 | max30105_setup |

## ABS Examples

### Basic Usage
```
arduino_setup()
    max30105_init("heartSensor")
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, max30105_safe_check($heartSensor, math_number(1000)))
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `max30105_init("varName", ...)` creates variable `$varName`; pass `$varName` directly to `field_variable` slots; use `variables_get($varName)` only for `input_value` slots.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.

### FIFO transport

Initialize the sensor before setup. A failed identity check suppresses configuration writes. FIFO reads commit complete samples only. A short read retries from the interrupted chunk on a later poll. If the hardware read pointer cannot be restored, initialize and set up the sensor again. The local FIFO holds the four most recent unread samples in chronological order. Individual immediate channel getters may wait for different frames. Use check(), getFIFORed()/getFIFOIR()/getFIFOGreen() and nextSample() to read channels of one frame.

The LED power field is the 8-bit amplitude register code. Project files saved with ADC choice 32768 retain the original driver behavior (2048 nA full scale).

With equal hardware read and write pointers, a positive overflow counter confirms 32 pending samples. The driver drains the FIFO in whole frames and keeps the newest four. A partial first burst can be retried after rewinding even when the first byte cleared the overflow counter. When exactly 32 samples arrive without any overflow, the pointers and zero counter alone cannot distinguish full from empty. Poll before the FIFO fills when every sample matters.
