# 课程表管理 (Schedule Manager)

ESP32课程表显示与WiFi Web配置，支持上课/暑假/寒假模式切换。全局单例 `Sched`，无需变量管理。

## Library Info
- **Name**: @aily-project/lib-schedule-manager
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `sched_begin` | Statement | TFT(field_variable) | `sched_begin(variables_get($tft))` | `Sched.begin(&tft);` |
| `sched_set_defaults` | Statement | D0~D6(field_input×7) | `sched_set_defaults("数学,...", "...", ..., "", "")` | `{ String defs[7][8]; ... Sched.setDefaultSchedule(defs); }` |
| `sched_load` | Statement | (none) | `sched_load()` | `Sched.load();` |
| `sched_start_server` | Statement | PORT(input_value) | `sched_start_server(math_number(8080))` | `Sched.startServer(8080);` |
| `sched_show` | Statement | (none) | `sched_show()` | `Sched.show();` |
| `sched_handle_client` | Statement | (none) | `sched_handle_client()` | `Sched.handleClient();` |
| `sched_day_prev` | Statement | (none) | `sched_day_prev()` | `Sched.dayPrev(); Sched.show();` |
| `sched_day_next` | Statement | (none) | `sched_day_next()` | `Sched.dayNext(); Sched.show();` |
| `sched_set_weekday` | Statement | WD(field_number) | `sched_set_weekday(1)` | `Sched.setWeekday(1);` |
| `sched_is_dirty` | Value | (none) | `sched_is_dirty()` | `Sched.isDirty()` |
| `sched_clear_dirty` | Statement | (none) | `sched_clear_dirty()` | `Sched.clearDirty();` |
| `sched_get_mode` | Value | (none) | `sched_get_mode()` | `Sched.getMode()` |
| `sched_set_mode` | Statement | MODE(field_dropdown) | `sched_set_mode(1)` | `Sched.setMode(1);` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| MODE | 0(上课), 1(暑假), 2(寒假) | 课程表模式 |
| WD | 0~6 | 星期几(0=周一, 6=周日) |
| D0~D6 | 逗号分隔字符串 | 每天8节课名，如"数学,英语,体育,..." |

## ABS Examples

### Complete Usage

```
arduino_setup()
    sched_begin(variables_get($tft))
    sched_set_defaults("数学,英语,体育,语文,科学,地理,道法,数拓", "语文,英语,数学,信息,音乐,地理,心理,体锻", "英语,道法,语文,数学,体育,劳动,语文,英探2", "语文,数学,体育,音乐,美术,英探1,综实,理拓", "数学,英探1,语文,体育,科学,班会,跨学,跨学", "", "")
    sched_load()
    sched_start_server(math_number(8080))

arduino_loop()
    sched_handle_client()
    controls_if()
        @IF0: sched_is_dirty()
        @DO0:
            sched_clear_dirty()
            sched_show()
```

### Button Navigation (inside page handler)

```
controls_if()
    @IF0: ui_btn_pressed(2)
    @DO0:
        sched_day_prev()
controls_if()
    @IF0: ui_btn_pressed(3)
    @DO0:
        sched_day_next()
```

## Notes

1. **依赖**: 需要 `lib-ui-animation`（使用全局 `UI` 和 `u8f` 对象渲染中文）
2. **初始化顺序**: `sched_begin` → `sched_set_defaults` → `sched_load` → `sched_start_server`
3. **Web服务**: 需在WiFi连接后调用 `sched_start_server`，端口默认8080
4. **脏标记**: Web端修改模式或保存后会触发 `isDirty()`，需在loop中检测并刷新
5. **Flash存储**: 模式存储在 `schedmode` 命名空间，课程数据存储在 `schedule`/`sched_summer`/`sched_winter`
