# 计算器 (Calculator)

TFT屏幕计算器模块，5×4按键矩阵，支持四则运算。全局单例`Calc`。

## Library Info
- **Name**: @aily-project/lib-calculator
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `calc_begin` | Statement | (none) | `calc_begin()` | `Calc.begin();` |
| `calc_show` | Statement | (none) | `calc_show()` | `Calc.show();` |
| `calc_handle_btns` | Statement | (none) | `calc_handle_btns()` | `Calc.handleBtns();` |
| `calc_is_edit_mode` | Value (Boolean) | (none) | `calc_is_edit_mode()` | `Calc.isEditMode()` |
| `calc_reset` | Statement | (none) | `calc_reset()` | `Calc.reset();` |

## ABS Examples

### Complete Usage

```
arduino_setup()
    calc_begin()

arduino_loop()
    controls_if()
        @IF0: logic_compare(ui_page_current(), EQ, math_number(4))
        @DO0:
            calc_handle_btns()
    controls_if()
        @IF0: logic_compare(ui_page_current(), EQ, math_number(4))
        @DO0:
            calc_show()
```

## Notes

1. **全局对象**: 库自动声明全局对象`Calc`，所有块直接使用
2. **依赖**: 需要`lib-ui-animation`（全局`UI`和`u8f`对象）
3. **按键布局**: `/ < % C` / `7 8 9 *` / `4 5 6 -` / `1 2 3 +` / `0 . +/- =`
4. **模式切换**: B键(BTN5)切换编辑/浏览模式，编辑模式下方向键移动光标，A键(BTN4)确认
5. **页面导航拦截**: 浏览模式下左右键可用于翻页；编辑模式下左右键移动光标，用`calc_is_edit_mode()`判断
