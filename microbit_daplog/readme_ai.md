# micro:bit V2 Data Logger (lib-microbit-daplog)

Logs data into the interface-chip Flash over the DAPLink I2C Flash Interface protocol; the computer reads it as `MYDATA.CSV` on the MICROBIT drive (Excel/WPS). The first file line is the format marker `MBDL,v3`; each following line is one comma-separated record.

## Library Info

- **Name**: @aily-project/lib-microbit-daplog
- **Version**: 1.5.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `daplog_begin` | Statement | (none) | `daplog_begin()` | `DapLog.begin();` |
| `daplog_log_row` | Statement (container) | STACK(input_statement) | `daplog_log_row()` + indented child blocks | `DapLog.beginRow(); ↵ DapLog.endRow();` |
| `daplog_add_col` | Statement | VALUE(input_value) | `daplog_add_col(microbit_temperature())` | `DapLog.col(String(1));` |
| `daplog_log_row1` | Statement | COL1(input_value) | `daplog_log_row1(microbit_temperature())` | `DapLog.logRow({String(1)});` |
| `daplog_log_row2` | Statement | COL1(input_value), COL2(input_value) | `daplog_log_row2(microbit_temperature(), microbit_acceleration(0))` | `DapLog.logRow({String(1), String(1)});` |
| `daplog_log_row4` | Statement | COL1(input_value), COL2(input_value), COL3(input_value), COL4(input_value) | `daplog_log_row4(microbit_temperature(), microbit_acceleration(0), microbit_acceleration(1), microbit_acceleration(2))` | `DapLog.logRow({String(1), String(1), String(1), String(1)});` |
| `daplog_log_row5` | Statement | COL1(input_value), COL2(input_value), COL3(input_value), COL4(input_value), COL5(input_value) | `daplog_log_row5(microbit_temperature(), microbit_acceleration(0), microbit_acceleration(1), microbit_acceleration(2), microbit_compass_heading())` | `DapLog.logRow({String(1), String(1), String(1), String(1), String(1)});` |
| `daplog_log_row6` | Statement | COL1(input_value), COL2(input_value), COL3(input_value), COL4(input_value), COL5(input_value), COL6(input_value) | `daplog_log_row6(microbit_temperature(), microbit_acceleration(0), microbit_acceleration(1), microbit_acceleration(2), microbit_compass_heading(), microbit_magnetic_field(0))` | `DapLog.logRow({String(1), String(1), String(1), String(1), String(1), String(1)});` |
| `daplog_clear` | Statement | (none) | `daplog_clear()` | `DapLog.clear();` |
| `daplog_remount` | Statement | (none) | `daplog_remount()` | `DapLog.remount();` |
| `daplog_ready` | Value (Boolean) | (none) | `daplog_ready()` | `DapLog.ready()` |
| `daplog_used_bytes` | Value (Number) | (none) | `daplog_used_bytes()` | `DapLog.usedBytes()` |
| `daplog_row_count` | Value (Number) | (none) | `daplog_row_count()` | `DapLog.rowCount()` |
| `daplog_status` | Value (String) | (none) | `daplog_status()` | `DapLog.status()` |

## ABS Examples

Log temperature and acceleration every 2 seconds (first record is the CSV header), print diagnostics over serial, refresh the file while button A is pressed:

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    serial_begin(Serial, 115200)
    daplog_begin()
    serial_println(Serial, daplog_status())
    daplog_log_row()
        daplog_add_col(text("Temperature C"))
        daplog_add_col(text("Accel mg"))

arduino_loop()
    daplog_log_row()
        daplog_add_col(microbit_temperature())
        daplog_add_col(microbit_acceleration(0))
    controls_if(microbit_button_is_pressed(0))
        @DO0:
            daplog_remount()
            serial_println(Serial, daplog_status())
    time_delay(math_number(2000))
```

Resulting `MYDATA.CSV` content example:

```csv
MBDL,v3
Temperature C,Accel mg
52.50,516
51.75,276
```

Value blocks must be nested in value slots (refresh on button A):

```abs
arduino_loop()
    controls_if(daplog_ready())
        @DO0:
            serial_println(Serial, daplog_used_bytes())
            serial_println(Serial, daplog_row_count())
            daplog_remount()
    time_delay(math_number(5000))
```

## Parameter Options

No dropdown parameters. "log row" is a container block: each "add column" child stacked inside adds one column (0..N, in stack order); column values accept text, number, or sensor value blocks. `daplog_log_row1/2/4/5/6` are hidden compatibility blocks (not in the toolbox; kept for loading old projects).

## Notes

1. **micro:bit V2 only**: relies on the interface chip (KL27/nRF52820) storage and the internal I2C bus (`Wire1`, SDA=pin 30/P0.16, SCL=pin 31/P0.08); Flash commands use slave address 0x72. On micro:bit V1 `daplog_begin()` fails and the other blocks are no-ops.
2. **Initialization**: `daplog_begin()` probes the interface chip and restores or creates the virtual file; on first use, or when old-version (v1 HTML/v2 HTML) or foreign data is detected, it automatically formats and clears that storage area. `DapLog.ready()` is true after success.
3. **Virtual file**: the name is fixed 8.3 `MYDATA  CSV` (shown as `MYDATA.CSV` on the drive); the storage starts with the format marker line `MBDL,v3` (also the first CSV line, visible in Excel); each following line is one comma-separated record. File size equals written bytes, and the file is valid CSV from byte 0.
4. **Capacity**: about 124-127KB depending on the interface chip model (sector size and capacity are probed at runtime); appending stops silently when full (written data is kept).
5. **Persistence**: the log lives in interface-chip Flash and survives power loss, reflashing, and re-plugging; `daplog_used_bytes()` restores from Flash at each boot, `daplog_row_count()` counts only rows written since this boot.
6. **Viewing**: plug in micro:bit, open the MICROBIT drive and double-click `MYDATA.CSV` (Excel/WPS); the drive view does not refresh while logging - use `daplog_remount()` (or re-plug USB). The computer side is a virtual read-only drive: add, edit, and delete only through firmware blocks.
7. **Full/power-loss edges**: appending stops silently when storage is full; a power cut mid-record may leave a half line (usually tolerated by CSV readers; later appends are unaffected). Column values containing commas or newlines are not CSV-escaped - avoid them.
8. **Coexistence**: this library uses different storage on a different chip than lib-microbitfs (nRF52833 Flash filesystem); both can be used at the same time. MakeCode data logging shares this storage area, so the two overwrite each other's data.
9. **Dependencies**: no wiring; communication uses the built-in `Wire1` shared with the built-in sensor library (sensor addresses 0x19/0x1D/0x1E/0x0E do not conflict).
10. **ABS text literals**: avoid half-width parentheses inside text(...) (for example `Temp(C)` triggers a parser warning); prefer characters such as the degree sign.
11. **Numeric wrapping**: the core String numeric constructors are explicit; the generator wraps every column value in `String(...)`, so sensor blocks with int/float outputs plug in directly.
12. **Storage format v3 (1.2.0)**: switched to the CSV file MYDATA.CSV with the marker line as the first file line; fixed a first-initialization order bug (v1 lost the header) and keeps erase/write read-back verification; old (v1/v2) or dirty data triggers a full automatic reformat.
13. **Diagnostics**: `daplog_status()` returns `ok=<0/1> err=<step code> sec=<sector bytes> cap=<total capacity> used=<bytes written> rows=<rows>`; a non-zero `err` marks the failed init step: 1/2=probe chip, 3=erase all, 4=erase per sector, 5=erase verify, 6/7=marker write/verify, 8=format retry, 9-12=file name/visibility/size/persistence setup.
14. **Variable columns (1.5.0)**: the "log row" container block plus "add column" children: the number of children is the column count (0..N) in stack order, generated as a `beginRow()/col()/endRow()` C++ sequence. Keep the column count consistent within one file. `daplog_log_row1/2/4/5/6` are hidden compatibility blocks.
