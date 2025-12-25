# LVGL Blockly库

LVGL(Light and Versatile Graphics Library)嵌入式图形库，提供丰富的UI控件。

## 库信息
- **库名**: @aily-project/lib-lvgl
- **版本**: 9.4.0
- **兼容**: ESP32系列

## 块定义

### 屏幕操作

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `lvgl_screen_create` | 语句块 | VAR(field_input) | `"VAR":"screen1"` | `screen1 = lv_obj_create(NULL);` |
| `lvgl_screen_active` | 值块 | 无 | 无 | `lv_screen_active()` |
| `lvgl_screen_load` | 语句块 | VAR(field_variable) | `"VAR":{"id":"xxx"}` | `lv_screen_load(screen);` |

### 控件创建

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `lvgl_label_create` | 语句块 | VAR(field_input), PARENT(field_variable) | `"VAR":"label1"` | `label1 = lv_label_create(parent);` |
| `lvgl_button_create` | 语句块 | VAR(field_input), PARENT(field_variable) | `"VAR":"btn1"` | `btn1 = lv_button_create(parent);` |
| `lvgl_slider_create` | 语句块 | VAR(field_input), PARENT(field_variable) | `"VAR":"slider1"` | `slider1 = lv_slider_create(parent);` |
| `lvgl_switch_create` | 语句块 | VAR(field_input), PARENT(field_variable) | `"VAR":"sw1"` | `sw1 = lv_switch_create(parent);` |
| `lvgl_checkbox_create` | 语句块 | VAR(field_input), PARENT(field_variable), TEXT(input) | `"VAR":"cb1"` | `cb1 = lv_checkbox_create(parent);` |
| `lvgl_bar_create` | 语句块 | VAR(field_input), PARENT(field_variable) | `"VAR":"bar1"` | `bar1 = lv_bar_create(parent);` |
| `lvgl_arc_create` | 语句块 | VAR(field_input), PARENT(field_variable) | `"VAR":"arc1"` | `arc1 = lv_arc_create(parent);` |
| `lvgl_spinner_create` | 语句块 | VAR(field_input), PARENT(field_variable) | `"VAR":"spinner1"` | `spinner1 = lv_spinner_create(parent);` |
| `lvgl_dropdown_create` | 语句块 | VAR(field_input), PARENT(field_variable) | `"VAR":"dropdown1"` | `dropdown1 = lv_dropdown_create(parent);` |
| `lvgl_textarea_create` | 语句块 | VAR(field_input), PARENT(field_variable) | `"VAR":"textarea1"` | `textarea1 = lv_textarea_create(parent);` |
| `lvgl_obj_create` | 语句块 | VAR(field_input), PARENT(field_variable) | `"VAR":"obj1"` | `obj1 = lv_obj_create(parent);` |

### 控件操作

| 块类型 | 连接 | 字段/输入 | 生成代码 |
|--------|------|----------|----------|
| `lvgl_label_set_text` | 语句块 | VAR(field_variable), TEXT(input) | `lv_label_set_text(label, text);` |
| `lvgl_label_set_long_mode` | 语句块 | VAR(field_variable), MODE(dropdown) | `lv_label_set_long_mode(label, mode);` |
| `lvgl_slider_set_value` | 语句块 | VAR(field_variable), VALUE(input), ANIM(dropdown) | `lv_slider_set_value(slider, val, anim);` |
| `lvgl_slider_set_range` | 语句块 | VAR(field_variable), MIN/MAX(input) | `lv_slider_set_range(slider, min, max);` |
| `lvgl_slider_get_value` | 值块 | VAR(field_variable) | `lv_slider_get_value(slider)` |
| `lvgl_bar_set_value` | 语句块 | VAR(field_variable), VALUE(input), ANIM(dropdown) | `lv_bar_set_value(bar, val, anim);` |
| `lvgl_bar_set_range` | 语句块 | VAR(field_variable), MIN/MAX(input) | `lv_bar_set_range(bar, min, max);` |
| `lvgl_arc_set_value` | 语句块 | VAR(field_variable), VALUE(input) | `lv_arc_set_value(arc, val);` |
| `lvgl_arc_set_range` | 语句块 | VAR(field_variable), MIN/MAX(input) | `lv_arc_set_range(arc, min, max);` |
| `lvgl_spinner_set_anim_params` | 语句块 | VAR(field_variable), TIME/ANGLE(input) | `lv_spinner_set_anim_params(spinner, time, angle);` |
| `lvgl_dropdown_set_options` | 语句块 | VAR(field_variable), OPTIONS(input) | `lv_dropdown_set_options(dropdown, options);` |
| `lvgl_dropdown_get_selected` | 值块 | VAR(field_variable) | `lv_dropdown_get_selected(dropdown)` |
| `lvgl_textarea_set_text` | 语句块 | VAR(field_variable), TEXT(input) | `lv_textarea_set_text(textarea, text);` |
| `lvgl_textarea_get_text` | 值块 | VAR(field_variable) | `lv_textarea_get_text(textarea)` |
| `lvgl_textarea_set_placeholder` | 语句块 | VAR(field_variable), TEXT(input) | `lv_textarea_set_placeholder_text(textarea, text);` |

### 位置与大小

| 块类型 | 连接 | 字段/输入 | 生成代码 |
|--------|------|----------|----------|
| `lvgl_obj_set_pos` | 语句块 | VAR(field_variable), X/Y(input) | `lv_obj_set_pos(obj, x, y);` |
| `lvgl_obj_set_size` | 语句块 | VAR(field_variable), WIDTH/HEIGHT(input) | `lv_obj_set_size(obj, w, h);` |
| `lvgl_obj_align` | 语句块 | VAR(field_variable), ALIGN(dropdown), X_OFS/Y_OFS(input) | `lv_obj_align(obj, align, x, y);` |
| `lvgl_obj_center` | 语句块 | VAR(field_variable) | `lv_obj_center(obj);` |

### 状态与标志

| 块类型 | 连接 | 字段/输入 | 生成代码 |
|--------|------|----------|----------|
| `lvgl_obj_add_flag` | 语句块 | VAR(field_variable), FLAG(dropdown) | `lv_obj_add_flag(obj, flag);` |
| `lvgl_obj_remove_flag` | 语句块 | VAR(field_variable), FLAG(dropdown) | `lv_obj_remove_flag(obj, flag);` |
| `lvgl_obj_add_state` | 语句块 | VAR(field_variable), STATE(dropdown) | `lv_obj_add_state(obj, state);` |
| `lvgl_obj_remove_state` | 语句块 | VAR(field_variable), STATE(dropdown) | `lv_obj_remove_state(obj, state);` |
| `lvgl_obj_has_state` | 值块 | VAR(field_variable), STATE(dropdown) | `lv_obj_has_state(obj, state)` |
| `lvgl_obj_delete` | 语句块 | VAR(field_variable) | `lv_obj_delete(obj);` |

### 样式

| 块类型 | 连接 | 字段/输入 | 生成代码 |
|--------|------|----------|----------|
| `lvgl_obj_set_style_bg_color` | 语句块 | VAR(field_variable), COLOR(field_colour) | `lv_obj_set_style_bg_color(obj, color, LV_PART_MAIN);` |
| `lvgl_obj_set_style_text_color` | 语句块 | VAR(field_variable), COLOR(field_colour) | `lv_obj_set_style_text_color(obj, color, LV_PART_MAIN);` |
| `lvgl_obj_set_style_border_color` | 语句块 | VAR(field_variable), COLOR(field_colour) | `lv_obj_set_style_border_color(obj, color, LV_PART_MAIN);` |
| `lvgl_obj_set_style_border_width` | 语句块 | VAR(field_variable), WIDTH(input) | `lv_obj_set_style_border_width(obj, w, LV_PART_MAIN);` |
| `lvgl_obj_set_style_radius` | 语句块 | VAR(field_variable), RADIUS(input) | `lv_obj_set_style_radius(obj, r, LV_PART_MAIN);` |
| `lvgl_obj_set_style_pad_all` | 语句块 | VAR(field_variable), PAD(input) | `lv_obj_set_style_pad_all(obj, p, LV_PART_MAIN);` |
| `lvgl_obj_set_style_bg_opa` | 语句块 | VAR(field_variable), OPA(dropdown) | `lv_obj_set_style_bg_opa(obj, opa, LV_PART_MAIN);` |

### 事件

| 块类型 | 连接 | 字段/输入 | 生成代码 |
|--------|------|----------|----------|
| `lvgl_event_add_cb` | Hat块 | VAR(field_variable), EVENT(dropdown), HANDLER(input_statement) | 生成回调函数 |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "label1"` |
| field_dropdown | 字符串 | `"MODE": "LV_LABEL_LONG_MODE_WRAP"` |
| field_variable | 对象 | `"VAR": {"id": "var_id"}` |
| field_colour | 字符串 | `"COLOR": "#ffffff"` |
| input_value | 块连接 | `"inputs": {"TEXT": {"block": {...}}}` |
| input_statement | 块连接 | `"inputs": {"HANDLER": {"block": {...}}}` |

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **Hat块**: 无连接属性（事件回调块），作为独立程序入口

### 变量类型
所有LVGL对象使用 `lv_obj_t` 类型：
```json
{
  "type": "field_variable",
  "name": "VAR",
  "variable": "obj",
  "variableTypes": ["lv_obj_t"],
  "defaultType": "lv_obj_t"
}
```

## 使用示例

### 创建标签并设置文本
```json
{
  "type": "lvgl_label_create",
  "id": "label_create_id",
  "fields": {"VAR": "label1"},
  "next": {
    "block": {
      "type": "lvgl_label_set_text",
      "id": "label_set_text_id",
      "fields": {"VAR": {"id": "label1_var_id"}},
      "inputs": {
        "TEXT": {
          "shadow": {
            "type": "text",
            "fields": {"TEXT": "Hello LVGL"}
          }
        }
      }
    }
  }
}
```

### 创建滑动条并设置范围
```json
{
  "type": "lvgl_slider_create",
  "id": "slider_create_id",
  "fields": {"VAR": "slider1"},
  "next": {
    "block": {
      "type": "lvgl_slider_set_range",
      "id": "slider_range_id",
      "fields": {"VAR": {"id": "slider1_var_id"}},
      "inputs": {
        "MIN": {"shadow": {"type": "math_number", "fields": {"NUM": 0}}},
        "MAX": {"shadow": {"type": "math_number", "fields": {"NUM": 100}}}
      }
    }
  }
}
```

## 重要规则

1. **变量类型**: 所有LVGL对象变量类型为 `lv_obj_t`
2. **父对象**: 创建控件时需指定父对象，顶级父对象通常为 `screen` 或 `lv_screen_active()`
3. **事件块**: 事件回调块为Hat块，无连接属性
4. **颜色格式**: 使用标准hex颜色格式（如 `#ffffff`），自动转换为 `lv_color_make()`

## 支持的控件

- **基础**: 基础对象(obj)
- **显示**: 标签(label)
- **输入**: 按钮(button)、滑动条(slider)、开关(switch)、复选框(checkbox)、下拉框(dropdown)、文本框(textarea)
- **显示器**: 进度条(bar)、圆弧(arc)、加载动画(spinner)

## 对齐方式

| 选项 | 值 |
|------|-----|
| 居中 | LV_ALIGN_CENTER |
| 左上 | LV_ALIGN_TOP_LEFT |
| 中上 | LV_ALIGN_TOP_MID |
| 右上 | LV_ALIGN_TOP_RIGHT |
| 左中 | LV_ALIGN_LEFT_MID |
| 右中 | LV_ALIGN_RIGHT_MID |
| 左下 | LV_ALIGN_BOTTOM_LEFT |
| 中下 | LV_ALIGN_BOTTOM_MID |
| 右下 | LV_ALIGN_BOTTOM_RIGHT |

## 事件类型

| 选项 | 值 |
|------|-----|
| 点击 | LV_EVENT_CLICKED |
| 按下 | LV_EVENT_PRESSED |
| 释放 | LV_EVENT_RELEASED |
| 长按 | LV_EVENT_LONG_PRESSED |
| 值改变 | LV_EVENT_VALUE_CHANGED |
| 聚焦 | LV_EVENT_FOCUSED |
| 失焦 | LV_EVENT_DEFOCUSED |
