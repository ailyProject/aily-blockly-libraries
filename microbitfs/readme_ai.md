# micro:bit V2 文件系统（microbitfs）

在 micro:bit V2（nRF52833）片内 Flash 上提供完整移植自 micropython-microbit-v2 的 microbitfs 文件系统积木：初始化/恢复、格式化、写入、追加、按行读取、删除、列目录与容量统计。

## Library Info

- **Name**: @aily-project/lib-microbitfs
- **Version**: 1.1.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `microbitfs_begin` | Statement | REBUILD(field_checkbox) | `microbitfs_begin(FALSE)` | `#include <MBMicroBitFS.h> ↵ microbitfsBegin(false);` |
| `microbitfs_format` | Statement | 无 | `microbitfs_format()` | `#include <MBMicroBitFS.h> ↵ microbitfsFormat();` |
| `microbitfs_write` | Statement | FILE(field_input), TEXT(input_value String) | `microbitfs_write("data.txt", text("你好"))` | `#include <MBMicroBitFS.h> ↵ microbitfsWrite("data.txt", "你好");` |
| `microbitfs_append_line` | Statement | FILE(field_input), TEXT(input_value String) | `microbitfs_append_line("data.txt", text("一行数据"))` | `#include <MBMicroBitFS.h> ↵ microbitfsAppendLine("data.txt", "一行数据");` |
| `microbitfs_append_number` | Statement | FILE(field_input), VALUE(input_value Number), DECIMALS(field_number) | `microbitfs_append_number("data.txt", math_number(25), 2)` | `#include <MBMicroBitFS.h> ↵ microbitfsAppendNumber("data.txt", 25, 2);` |
| `microbitfs_read` | Value (String) | FILE(field_input) | `microbitfs_read("data.txt")` | `#include <MBMicroBitFS.h> ↵ microbitfsRead("data.txt")` |
| `microbitfs_read_line` | Value (String) | FILE(field_input), LINE(input_value Number) | `microbitfs_read_line("data.txt", math_number(0))` | `#include <MBMicroBitFS.h> ↵ microbitfsReadLine("data.txt", 0)` |
| `microbitfs_line_count` | Value (Number) | FILE(field_input) | `microbitfs_line_count("data.txt")` | `#include <MBMicroBitFS.h> ↵ microbitfsLineCount("data.txt")` |
| `microbitfs_exists` | Value (Boolean) | FILE(field_input) | `microbitfs_exists("data.txt")` | `#include <MBMicroBitFS.h> ↵ microbitfsExists("data.txt")` |
| `microbitfs_file_size` | Value (Number) | FILE(field_input) | `microbitfs_file_size("data.txt")` | `#include <MBMicroBitFS.h> ↵ microbitfsFileSize("data.txt")` |
| `microbitfs_remove` | Statement | FILE(field_input) | `microbitfs_remove("data.txt")` | `#include <MBMicroBitFS.h> ↵ microbitfsRemove("data.txt");` |
| `microbitfs_list_files` | Value (String) | 无 | `microbitfs_list_files()` | `#include <MBMicroBitFS.h> ↵ microbitfsListFiles()` |
| `microbitfs_file_count` | Value (Number) | 无 | `microbitfs_file_count()` | `#include <MBMicroBitFS.h> ↵ microbitfsFileCount()` |
| `microbitfs_free_kb` | Value (Number) | 无 | `microbitfs_free_kb()` | `#include <MBMicroBitFS.h> ↵ microbitfsFreeKB()` |
| `microbitfs_used_kb` | Value (Number) | 无 | `microbitfs_used_kb()` | `#include <MBMicroBitFS.h> ↵ microbitfsUsedKB()` |
| `microbitfs_dir_exists` | Value (Boolean) | DIR(field_input) | `microbitfs_dir_exists("logs")` | `#include <MBMicroBitFS.h> ↵ microbitfsDirExists("logs")` |
| `microbitfs_dir_list` | Value (String) | DIR(field_input) | `microbitfs_dir_list("logs")` | `#include <MBMicroBitFS.h> ↵ microbitfsDirList("logs")` |
| `microbitfs_dir_file_count` | Value (Number) | DIR(field_input) | `microbitfs_dir_file_count("logs")` | `#include <MBMicroBitFS.h> ↵ microbitfsDirFileCount("logs")` |
| `microbitfs_dir_remove` | Statement | DIR(field_input) | `microbitfs_dir_remove("logs")` | `#include <MBMicroBitFS.h> ↵ microbitfsDirRemove("logs");` |

## Parameter Options

- `microbitfs_begin` REBUILD（field_checkbox）：`TRUE`（清空重建：先删除全部文件再初始化）/ `FALSE`（默认，自动恢复）。
- `microbitfs_append_number` DECIMALS（field_number）：0–7 的整数，默认 `2`。

## ABS Examples

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    microbitfs_begin(FALSE)
    serial_begin(Serial, 115200)
    microbitfs_write("data.txt", text("温度日志"))
    microbitfs_append_number("data.txt", math_number(25.5), 1)

arduino_loop()
    serial_println(Serial, microbitfs_read("data.txt"))
    serial_println(Serial, microbitfs_read_line("data.txt", math_number(0)))
    serial_println(Serial, microbitfs_line_count("data.txt"))
    serial_println(Serial, microbitfs_list_files())
    serial_println(Serial, microbitfs_file_count())
    serial_println(Serial, microbitfs_free_kb())
    serial_println(Serial, microbitfs_used_kb())
    time_delay(math_number(5000))
```

条件删除示例（输出块嵌入值输入槽，含虚拟文件夹操作）：

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    microbitfs_begin(FALSE)
    serial_begin(Serial, 115200)
    microbitfs_write("logs/day1.txt", text("温度日志"))

arduino_loop()
    controls_if(microbitfs_dir_exists("logs"))
        @DO0:
            serial_println(Serial, microbitfs_dir_list("logs"))
            serial_println(Serial, microbitfs_dir_file_count("logs"))
            microbitfs_dir_remove("logs")
    serial_println(Serial, microbitfs_dir_list("/"))
    time_delay(math_number(1000))
```

## Notes

1. **初始化**：`microbitfs_begin(FALSE)` 初始化/恢复文件系统（全新芯片自动初始化；`TRUE` 为清空重建）。任何文件积木在未初始化时会自动调用 `mbfs_init()` 兜底，但建议在 `arduino_setup()` 显式初始化一次。
2. **上游方案**：引擎为 micropython-microbit-v2 `src/codal_port/microbitfs.c` 的忠实移植（128B chunk 链表、marker 字节、随机轮转分配、FREED 页回收、sweep 页交换整理），文件系统窗口 `0x6D000–0x73000` 与其 `filesystem.ld` 一致；适配差异见 `src/microbitfs/microbitfs.c` 头部注释（链接符号改宏、nrfx_nvmc 同语义 NVMC 垫片、软件 PRNG、空钩子、新增 format）。
3. **无对象/无句柄**：全局单例快速操作模式，不创建 Blockly 变量；每次文件操作独立打开并关闭（写模式关闭时持久化文件长度）。
4. **输出块**：`microbitfs_read`、`microbitfs_read_line`、`microbitfs_line_count`、`microbitfs_exists`、`microbitfs_file_size`、`microbitfs_list_files`、`microbitfs_file_count`、`microbitfs_free_kb`、`microbitfs_used_kb` 是输出块，必须嵌入值输入槽（如 `serial_println` 的参数）。
5. **上游语义**：仅 'r'/'w' 模式——写 = 清空重写；追加由封装层读出原内容后整体重写（追加后总长上限 8192 字节）；`microbitfs_read` 上限 8192 字节；`microbitfs_read_line` 行号从 0 开始、单行上限 256 字节；空间不足时写入返回失败且该文件被清空（同上游 ENOSPC 行为）。
6. **容量与命名**：窗口 24KB（6 页），其中 1 页为持久配置/批量擦除备用页，可用数据约 20KB（160 chunk × 126 字节）；文件名最长 120 字符，首部 `/` 自动去除。
7. **依赖**：无外部接线；静态 RAM 占用仅句柄池等约几十字节。
8. **虚拟文件夹（封装层扩展，非上游功能）**：上游 microbitfs 为扁平文件系统（os.listdir 无参数且每个条目固定为文件，无 mkdir/rmdir/chdir/getcwd）。本库以名字前缀模拟文件夹：文件名可写 `logs/a.txt`；`microbitfs_dir_exists` 判断是否存在以 `dir/` 开头的文件；`microbitfs_dir_list` 返回直接子项（子文件夹名以 `/` 结尾，DIR 填 `/` 列根目录）；`microbitfs_dir_file_count` 统计含子层文件数；`microbitfs_dir_remove` 删除该前缀全部文件（根目录不可整删，需用格式化）。文件夹随第一个文件写入自动出现、全部文件删除后消失；带前缀的文件名总长仍受 120 字符限制。
