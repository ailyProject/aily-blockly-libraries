# SparkFun UHF RFID 读卡器

## Library Info
- **Name**: @aily-project/lib-sparkfun-rfid-reader
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `rfid_reader_init` | Statement | VAR(field_input), PORT(dropdown:Serial1/2/3) | `rfid_reader_init("rfid", Serial1)` | `RFID rfid; Serial1.begin(115200); rfid.begin(Serial1);` |
| `rfid_reader_start` | Statement | VAR(field_variable) | `rfid_reader_start(variables_get($rfid))` | `rfid.startReading();` |
| `rfid_reader_stop` | Statement | VAR(field_variable) | `rfid_reader_stop(variables_get($rfid))` | `rfid.stopReading();` |
| `rfid_reader_check_tag` | Value→Boolean | VAR(field_variable) | `rfid_reader_check_tag(variables_get($rfid))` | `rfid.check()` |
