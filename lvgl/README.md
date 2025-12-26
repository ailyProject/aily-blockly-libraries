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
| `lvgl_keyboard_create` | 语句块 | VAR(field_input), PARENT(field_variable) | `"VAR":"keyboard1"` | `keyboard1 = lv_keyboard_create(parent);` |
| `lvgl_obj_create` | 语句块 | VAR(field_input), PARENT(field_variable) | `"VAR":"obj1"` | `obj1 = lv_obj_create(parent);` |
| `lvgl_image_create` | 语句块 | VAR(field_input), PARENT(field_variable) | `"VAR":"img1"` | `img1 = lv_image_create(parent);` |
| `lvgl_list_create` | 语句块 | VAR(field_input), PARENT(field_variable) | `"VAR":"list1"` | `list1 = lv_list_create(parent);` |
| `lvgl_tabview_create` | 语句块 | VAR(field_input), PARENT(field_variable) | `"VAR":"tabview1"` | `tabview1 = lv_tabview_create(parent);` |

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
| `lvgl_keyboard_set_textarea` | 语句块 | VAR(field_variable), TEXTAREA(field_variable) | `lv_keyboard_set_textarea(keyboard, textarea);` |
| `lvgl_keyboard_set_mode` | 语句块 | VAR(field_variable), MODE(dropdown) | `lv_keyboard_set_mode(keyboard, mode);` |
| `lvgl_keyboard_set_popovers` | 语句块 | VAR(field_variable), ENABLE(dropdown) | `lv_keyboard_set_popovers(keyboard, enable);` |
| `lvgl_image_set_src` | 语句块 | VAR(field_variable), SRC(input) | `lv_image_set_src(img, src);` |
| `lvgl_image_set_zoom` | 语句块 | VAR(field_variable), ZOOM(input) | `lv_image_set_zoom(img, zoom);` |
| `lvgl_image_set_angle` | 语句块 | VAR(field_variable), ANGLE(input) | `lv_image_set_angle(img, angle);` |
| `lvgl_image_set_offset` | 语句块 | VAR(field_variable), X/Y(input) | `lv_image_set_offset_x(img, x); lv_image_set_offset_y(img, y);` |
| `lvgl_list_add_text` | 语句块 | VAR(field_variable), TEXT(input) | `lv_list_add_text(list, text);` |
| `lvgl_list_add_btn` | 语句块 | VAR(field_variable), TEXT(input), ICON(dropdown) | `lv_list_add_btn(list, icon, text);` |
| `lvgl_chart_set_type` | 语句块 | VAR(field_variable), TYPE(dropdown) | `lv_chart_set_type(chart, type);` |
| `lvgl_chart_set_point_count` | 语句块 | VAR(field_variable), COUNT(input) | `lv_chart_set_point_count(chart, count);` |
| `lvgl_chart_add_series` | 语句块 | VAR(field_variable), SERIES(field_input), COLOR(field_colour) | `lv_chart_add_series(chart, color);` |
| `lvgl_chart_set_next_value` | 语句块 | VAR(field_variable), SERIES(field_variable), VALUE(input) | `lv_chart_set_next_value(chart, series, value);` |
| `lvgl_chart_set_range` | 语句块 | VAR(field_variable), MIN/MAX(input) | `lv_chart_set_range(chart, min, max);` |
| `lvgl_chart_set_update_mode` | 语句块 | VAR(field_variable), MODE(dropdown) | `lv_chart_set_update_mode(chart, mode);` |
| `lvgl_chart_refresh` | 语句块 | VAR(field_variable) | `lv_chart_refresh(chart);` |
| `lvgl_tabview_add_tab` | 值块 | VAR(field_variable), TEXT(input) | `lv_tabview_add_tab(tabview, text)` |

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
- **显示**: 标签(label)、图像(image)、列表(list)、选项卡(tabview)
- **输入**: 按钮(button)、滑动条(slider)、开关(switch)、复选框(checkbox)、下拉框(dropdown)、文本框(textarea)、键盘(keyboard)
- **显示器**: 进度条(bar)、圆弧(arc)、加载动画(spinner)、图表(chart)

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

## 图像控件使用说明

### 图像路径格式

LVGL 9.x 使用驱动字母前缀的路径格式：`驱动字母:/路径`

| 存储位置 | 驱动字母 | 路径示例 | 说明 |
|---------|---------|---------|------|
| SD 卡 | `A:/` | `A:/images/logo.png` | 需要先初始化 SD 卡库 |
| SPIFFS | `B:/` | `B:/icon.png` | 闪存文件系统 |
| LittleFS | `C:/` | `C:/image.png` | 改进的闪存文件系统 |
| 内置符号 | 无 | `LV_SYMBOL_OK` | LVGL 内置图标 |

### 使用步骤

**使用 SD 卡存储图片：**
```json
{
  "type": "esp32_sd_init",
  "fields": {"SPI": "SPI"},
  "inputs": {
    "SS": {"block": {"type": "math_number", "fields": {"NUM": "5"}}},
    "FREQUENCY": {"block": {"type": "math_number", "fields": {"NUM": "4000000"}}}
  },
  "next": {
    "block": {
      "type": "lvgl_image_create",
      "fields": {"VAR": "img1"},
      "next": {
        "block": {
          "type": "lvgl_image_set_src",
          "fields": {"VAR": {"id": "img1_var_id"}},
          "inputs": {
            "SRC": {"block": {"type": "text", "fields": {"TEXT": "A:/image.png"}}}
          }
        }
      }
    }
  }
}
```

**使用内置符号：**
```json
{
  "type": "lvgl_image_create",
  "fields": {"VAR": "img1"},
  "next": {
    "block": {
      "type": "lvgl_image_set_src",
      "fields": {"VAR": {"id": "img1_var_id"}},
      "inputs": {
        "SRC": {"block": {"type": "text", "fields": {"TEXT": "LV_SYMBOL_OK"}}}
      }
    }
  }
}
```

### 常用内置符号

| 符号名称 | 显示 | 说明 |
|---------|------|------|
| LV_SYMBOL_OK | ✓ | 确认 |
| LV_SYMBOL_CLOSE | ✕ | 关闭 |
| LV_SYMBOL_SETTINGS | ⚙ | 设置 |
| LV_SYMBOL_HOME | ⌂ | 主页 |
| LV_SYMBOL_POWER | ⏻ | 电源 |
| LV_SYMBOL_AUDIO | 🔊 | 音频 |
| LV_SYMBOL_VIDEO | 🎥 | 视频 |
| LV_SYMBOL_LIST | ☰ | 列表 |
| LV_SYMBOL_IMAGE | 🖼 | 图像 |
| LV_SYMBOL_EDIT | ✎ | 编辑 |
| LV_SYMBOL_LEFT | ← | 左箭头 |
| LV_SYMBOL_RIGHT | → | 右箭头 |
| LV_SYMBOL_UP | ↑ | 上箭头 |
| LV_SYMBOL_DOWN | ↓ | 下箭头 |
| LV_SYMBOL_PLUS | + | 加号 |
| LV_SYMBOL_MINUS | − | 减号 |

### 图像变换参数

| 参数 | 说明 | 默认值 | 范围 |
|------|------|--------|------|
| 缩放 | 图像缩放比例 | 256 (100%) | 0-65535 (0-25600%) |
| 角度 | 旋转角度(0.1度单位) | 0 | 0-3600 (0-360度) |
| 偏移 X | 水平偏移量 | 0 | 像素值 |
| 偏移 Y | 垂直偏移量 | 0 | 像素值 |

## 列表控件使用说明

列表控件用于显示可滚动的项目列表，支持文本项和带图标的按钮项。

### 创建列表并添加项目

```json
{
  "type": "lvgl_list_create",
  "fields": {"VAR": "list1"},
  "next": {
    "block": {
      "type": "lvgl_list_add_text",
      "fields": {"VAR": {"id": "list1_var_id"}},
      "inputs": {
        "TEXT": {"block": {"type": "text", "fields": {"TEXT": "项目1"}}}
      },
      "next": {
        "block": {
          "type": "lvgl_list_add_text",
          "fields": {"VAR": {"id": "list1_var_id"}},
          "inputs": {
            "TEXT": {"block": {"type": "text", "fields": {"TEXT": "项目2"}}}
          },
          "next": {
            "block": {
              "type": "lvgl_list_add_btn",
              "fields": {"VAR": {"id": "list1_var_id"}, "ICON": "LV_SYMBOL_PLAY"},
              "inputs": {
                "TEXT": {"block": {"type": "text", "fields": {"TEXT": "播放"}}}
              }
            }
          }
        }
      }
    }
  }
}
```

### 列表图标选项

| 选项 | 值 | 说明 |
|------|-----|------|
| 无 | NULL | 不显示图标 |
| 播放 | LV_SYMBOL_PLAY | 播放图标 |
| 暂停 | LV_SYMBOL_PAUSE | 暂停图标 |
| 停止 | LV_SYMBOL_STOP | 停止图标 |
| 设置 | LV_SYMBOL_SETTINGS | 设置图标 |
| 音量 | LV_SYMBOL_VOLUME_MAX | 音量图标 |
| WiFi | LV_SYMBOL_WIFI | WiFi图标 |
| 蓝牙 | LV_SYMBOL_BLUETOOTH | 蓝牙图标 |

## 选项卡控件使用说明

选项卡控件用于创建带有选项卡标签的页面容器，每个选项卡可以包含不同的内容。

### 创建选项卡视图并添加选项卡

```json
{
  "type": "lvgl_tabview_create",
  "fields": {"VAR": "tabview1"},
  "next": {
    "block": {
      "type": "variables_set",
      "fields": {
        "VAR": {"id": "tab1_var_id"},
        "NAME": "tab1"
      },
      "inputs": {
        "VALUE": {
          "block": {
            "type": "lvgl_tabview_add_tab",
            "fields": {"VAR": {"id": "tabview1_var_id"}},
            "inputs": {
              "TEXT": {"block": {"type": "text", "fields": {"TEXT": "选项卡1"}}}
            }
          }
        }
      },
      "next": {
        "block": {
          "type": "variables_set",
          "fields": {
            "VAR": {"id": "tab2_var_id"},
            "NAME": "tab2"
          },
          "inputs": {
            "VALUE": {
              "block": {
                "type": "lvgl_tabview_add_tab",
                "fields": {"VAR": {"id": "tabview1_var_id"}},
                "inputs": {
                  "TEXT": {"block": {"type": "text", "fields": {"TEXT": "选项卡2"}}}
                }
              }
            }
          },
          "next": {
            "block": {
              "type": "lvgl_label_create",
              "fields": {"VAR": "label1", "PARENT": {"id": "tab1_var_id"}},
              "inputs": {
                "TEXT": {"block": {"type": "text", "fields": {"TEXT": "这是选项卡1的内容"}}}
              }
            }
          }
        }
      }
    }
  }
}
```

### 选项卡使用说明

1. **创建选项卡视图**: 使用 `lvgl_tabview_create` 创建选项卡容器
2. **添加选项卡**: 使用 `lvgl_tabview_add_tab` 添加新的选项卡，该块返回选项卡的内容对象
3. **添加内容**: 使用返回的选项卡内容对象作为父对象，向选项卡中添加其他控件
4. **变量存储**: 建议将每个选项卡的内容对象存储到变量中，以便后续添加控件

## 图表控件使用说明

图表控件用于显示数据可视化，支持柱状图、折线图和散点图。

### 创建图表并设置数据

```json
{
  "type": "lvgl_chart_create",
  "fields": {"VAR": "chart1"},
  "next": {
    "block": {
      "type": "lvgl_chart_set_type",
      "fields": {"VAR": {"id": "chart1_var_id"}, "TYPE": "LV_CHART_TYPE_LINE"},
      "next": {
        "block": {
          "type": "lvgl_chart_set_point_count",
          "fields": {"VAR": {"id": "chart1_var_id"}},
          "inputs": {
            "COUNT": {"block": {"type": "math_number", "fields": {"NUM": "10"}}}
          },
          "next": {
            "block": {
              "type": "lvgl_chart_add_series",
              "fields": {"VAR": {"id": "chart1_var_id"}, "SERIES": "series1", "COLOR": "#FF0000"},
              "next": {
                "block": {
                  "type": "lvgl_chart_set_range",
                  "fields": {"VAR": {"id": "chart1_var_id"}},
                  "inputs": {
                    "MIN": {"block": {"type": "math_number", "fields": {"NUM": "0"}}},
                    "MAX": {"block": {"type": "math_number", "fields": {"NUM": "100"}}}
                  },
                  "next": {
                    "block": {
                      "type": "lvgl_chart_set_next_value",
                      "fields": {"VAR": {"id": "chart1_var_id"}, "SERIES": {"id": "series1_var_id"}},
                      "inputs": {
                        "VALUE": {"block": {"type": "math_number", "fields": {"NUM": "50"}}}
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### 图表类型选项

| 选项 | 值 | 说明 |
|------|-----|------|
| 柱状图 | LV_CHART_TYPE_BAR | 显示柱状图 |
| 折线图 | LV_CHART_TYPE_LINE | 显示折线图 |
| 散点图 | LV_CHART_TYPE_SCATTER | 显示散点图 |

### 图表使用说明

1. **创建图表**: 使用 `lvgl_chart_create` 创建图表控件
2. **设置类型**: 使用 `lvgl_chart_set_type` 设置图表类型（柱状图、折线图或散点图）
3. **设置点数**: 使用 `lvgl_chart_set_point_count` 设置图表显示的数据点数量
4. **添加系列**: 使用 `lvgl_chart_add_series` 添加数据系列，每个系列可以有独立的颜色
5. **设置范围**: 使用 `lvgl_chart_set_range` 设置图表的Y轴范围
6. **添加数据**: 使用 `lvgl_chart_set_next_value` 向系列中添加数据点
7. **更新模式**: 使用 `lvgl_chart_set_update_mode` 设置图表更新模式
8. **刷新图表**: 使用 `lvgl_chart_refresh` 手动刷新图表显示

## 键盘控件使用说明

键盘控件用于提供虚拟键盘输入，支持与文本框关联以实现输入功能。

### 创建键盘并关联文本框

```json
{
  "type": "lvgl_textarea_create",
  "fields": {"VAR": "textarea1"},
  "next": {
    "block": {
      "type": "lvgl_keyboard_create",
      "fields": {"VAR": "keyboard1"},
      "next": {
        "block": {
          "type": "lvgl_keyboard_set_textarea",
          "fields": {"VAR": {"id": "keyboard1_var_id"}, "TEXTAREA": {"id": "textarea1_var_id"}},
          "next": {
            "block": {
              "type": "lvgl_keyboard_set_mode",
              "fields": {"VAR": {"id": "keyboard1_var_id"}, "MODE": "LV_KEYBOARD_MODE_TEXT_LOWER"},
              "next": {
                "block": {
                  "type": "lvgl_keyboard_set_popovers",
                  "fields": {"VAR": {"id": "keyboard1_var_id"}, "ENABLE": "true"}
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### 键盘模式选项

| 选项 | 值 | 说明 |
|------|-----|------|
| 文本 | LV_KEYBOARD_MODE_TEXT_LOWER | 小写字母文本模式 |
| 数字 | LV_KEYBOARD_MODE_NUMBER | 数字输入模式 |
| 特殊字符 | LV_KEYBOARD_MODE_SPECIAL | 特殊字符模式 |

### 键盘使用说明

1. **创建键盘**: 使用 `lvgl_keyboard_create` 创建键盘控件
2. **关联文本框**: 使用 `lvgl_keyboard_set_textarea` 将键盘与文本框关联，按键输入将自动显示在文本框中
3. **设置模式**: 使用 `lvgl_keyboard_set_mode` 设置键盘模式（文本、数字或特殊字符）
4. **弹出提示**: 使用 `lvgl_keyboard_set_popovers` 开启或关闭按键弹出提示
