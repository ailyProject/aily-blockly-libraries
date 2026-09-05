# micro:bit V2 数据日志（lib-microbit-daplog）

通过 DAPLink I2C Flash Interface 协议把日志写入接口芯片 Flash，电脑端 MICROBIT 盘直接打开 `MYDATA.CSV`（Excel/WPS）。文件首行为格式标识行 `MBDL,v3`，其后每行一条逗号分隔记录。

## Library Info

- **Name**: @aily-project/lib-microbit-daplog
- **Version**: 1.5.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `daplog_begin` | Statement | 无 | `daplog_begin()` | `#include <microbit_daplog.h> ↵ DapLog.begin();` |
| `daplog_log_row` | Statement（容器） | STACK(input_statement) | `daplog_log_row()` + 缩进子块 | `#include <microbit_daplog.h> ↵ DapLog.beginRow(); ↵ DapLog.endRow();` |
| `daplog_add_col` | Statement | VALUE(input_value) | `daplog_add_col(microbit_temperature())` | `#include <microbit_daplog.h> ↵ DapLog.col(String(_ailyMicrobitTemperature()));` |
| `daplog_log_row1` | Statement | COL1(input_value) | `daplog_log_row1(microbit_temperature())` | `#include <microbit_daplog.h> ↵ DapLog.logRow({String(_ailyMicrobitTemperature())});` |
| `daplog_log_row2` | Statement | COL1(input_value), COL2(input_value) | `daplog_log_row2(microbit_temperature(), microbit_acceleration(0))` | `#include <microbit_daplog.h> ↵ DapLog.logRow({String(_ailyMicrobitTemperature()), String(_ailyMicrobitAcceleration(0))});` |
| `daplog_log_row4` | Statement | COL1..COL4(input_value ×4) | `daplog_log_row4(microbit_temperature(), microbit_acceleration(0), microbit_acceleration(1), microbit_acceleration(2))` | `#include <microbit_daplog.h> ↵ DapLog.logRow({String(_ailyMicrobitTemperature()), String(_ailyMicrobitAcceleration(0)), String(_ailyMicrobitAcceleration(1)), String(_ailyMicrobitAcceleration(2))});` |
| `daplog_log_row5` | Statement | COL1..COL5(input_value ×5) | `daplog_log_row5(microbit_temperature(), microbit_acceleration(0), microbit_acceleration(1), microbit_acceleration(2), microbit_compass_heading())` | `#include <microbit_daplog.h> ↵ DapLog.logRow({String(_ailyMicrobitTemperature()), String(_ailyMicrobitAcceleration(0)), String(_ailyMicrobitAcceleration(1)), String(_ailyMicrobitAcceleration(2)), String(_ailyMicrobitCompassHeading())});` |
| `daplog_log_row6` | Statement | COL1..COL6(input_value ×6) | `daplog_log_row6(microbit_temperature(), microbit_acceleration(0), microbit_acceleration(1), microbit_acceleration(2), microbit_compass_heading(), microbit_magnetic_field(0))` | `#include <microbit_daplog.h> ↵ DapLog.logRow({String(_ailyMicrobitTemperature()), String(_ailyMicrobitAcceleration(0)), String(_ailyMicrobitAcceleration(1)), String(_ailyMicrobitAcceleration(2)), String(_ailyMicrobitCompassHeading()), String(_ailyMicrobitMagneticField(0))});` |
| `daplog_clear` | Statement | 无 | `daplog_clear()` | `#include <microbit_daplog.h> ↵ DapLog.clear();` |
| `daplog_remount` | Statement | 无 | `daplog_remount()` | `#include <microbit_daplog.h> ↵ DapLog.remount();` |
| `daplog_ready` | Value (Boolean) | 无 | `daplog_ready()` | `#include <microbit_daplog.h> ↵ DapLog.ready()` |
| `daplog_used_bytes` | Value (Number) | 无 | `daplog_used_bytes()` | `#include <microbit_daplog.h> ↵ DapLog.usedBytes()` |
| `daplog_row_count` | Value (Number) | 无 | `daplog_row_count()` | `#include <microbit_daplog.h> ↵ DapLog.rowCount()` |
| `daplog_status` | Value (String) | 无 | `daplog_status()` | `#include <microbit_daplog.h> ↵ DapLog.status()` |

## ABS Examples

温度 + 加速度，每 2 秒记录一行（首条记录为 CSV 列标题），串口打印诊断状态，按住 A 刷新：

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    serial_begin(Serial, 115200)
    daplog_begin()
    serial_println(Serial, daplog_status())
    daplog_log_row()
        daplog_add_col(text("温度℃"))
        daplog_add_col(text("加速度 毫g"))

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

生成的 `MYDATA.CSV` 内容示例：

```csv
MBDL,v3
温度℃,加速度 毫g
52.50,516
51.75,276
```

按住 A 键刷新电脑上的文件（输出块必须嵌入值输入槽）：

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

无下拉参数。「记录一行数据」为容器块：内部堆叠几个「增加列」子块，本行就有几列（0..N，按堆叠顺序）；列值接受文本、数字或传感器读数输出块。`daplog_log_row1/2/4/5/6` 为隐藏的兼容积木（不在工具箱中，供旧项目加载）。

## Notes

1. **仅 micro:bit V2**：依赖接口芯片（KL27/nRF52820）的存储区与内部 I2C 总线（`Wire1`，SDA=引脚30/P0.16，SCL=引脚31/P0.08），Flash 命令从机地址 0x72；micro:bit V1 上 `daplog_begin()` 返回失败、其余积木为空操作。
2. **初始化**：`daplog_begin()` 探测接口芯片并恢复/建立虚拟文件；首次使用或检测到旧版本（v1 HTML/v2 HTML）/外部数据时**自动格式化并清空**该存储区。成功后 `DapLog.ready()` 为真。
3. **虚拟文件**：文件名固定为 8.3 格式 `MYDATA  CSV`（盘上显示 `MYDATA.CSV`）；存储首行为格式标识行 `MBDL,v3`（同时是 CSV 文件首行，Excel 中可见），其后每行一条逗号分隔记录。文件大小 = 已写字节数，从文件第 0 字节起即为合法 CSV。
4. **容量**：约 124–127KB（随接口芯片型号而异，运行时自动探测扇区大小与容量），写满后追加自动停止（已写数据保留）。
5. **持久性**：日志保存在接口芯片 Flash，断电、重新刷固件、重新插拔均不丢失；`daplog_used_bytes()` 每次开机从 Flash 自动恢复，`daplog_row_count()` 只统计本次开机的行数。
6. **查看方式**：micro:bit 插上电脑后打开 MICROBIT 盘双击 `MYDATA.CSV`（Excel/WPS）；记录过程中盘上显示不会自动更新，用 `daplog_remount()`（或重新插拔 USB）刷新。电脑端为虚拟只读盘，不能直接编辑或复制文件进去，增删改都要通过固件积木完成。
7. **写满/断电边界**：存储写满时追加静默停止；记录瞬间断电可能留下半行（CSV 下游读取一般可容忍，不影响后续追加）。列内容含逗号/换行时未做 CSV 转义，请避免在列中写入这些字符。
8. **并存**：与 lib-microbitfs（主芯片 nRF52833 Flash 文件系统）使用不同芯片的不同存储，可同时使用；与 MakeCode 数据日志使用同一存储区，二者数据会互相覆盖。
9. **依赖**：无外部接线；通信使用内置 `Wire1`，与内置传感器库共用内部总线，地址不冲突（传感器 0x19/0x1D/0x1E/0x0E）。
10. **ABS 文本字面量**：text(...) 内不要用半角括号（如 `温度(C)` 会触发解析告警），可用 ℃ 等字符替代。
11. **数值参数包装**：本核心 String 数值构造函数均为 explicit，生成器自动把三个参数包成 `String(...)`，传感器数值块（输出 int/float）可直接接入。
12. **存储格式 v3（1.2.0）**：改为 CSV 文件 MYDATA.CSV，标识行即文件首行；修复首次初始化顺序 bug（v1 表头丢失）并保留擦除/写入读回校验；检测到旧版本（v1/v2）或脏数据时自动整体重格式化，无需手动处理。
13. **诊断**：`daplog_status()` 返回 `ok=<0/1> err=<步骤码> sec=<扇区字节> cap=<总容量> used=<已写字节> rows=<行数>`；`err` 非零时表示初始化失败的具体步骤：1/2=查询接口芯片，3=整段擦除，4=逐扇区擦除，5=擦除校验，6/7=标识行写入/校验，8=格式化重试，9–12=文件名/可见性/大小/持久化配置。
14. **可变列数（1.5.0）**：「记录一行数据」容器块 + 「增加列」子块：子块数量即列数（0..N），按堆叠顺序生成 CSV 列；生成的 C++ 为 `beginRow()/col()/endRow()` 序列。同一文件建议保持列数一致。`daplog_log_row1/2/4/5/6` 为隐藏兼容积木。
