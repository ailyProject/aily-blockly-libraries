# SSCMA Micro Core

Seeed SSCMA微控制器AI推理核心库，专为ESP32-S3优化的本地AI视觉处理引擎。需要下载识别模型文件到设备的SPIFFS文件系统中使用。支持目标检测、图像分类、关键点检测、姿态估计等多种AI算法，可直接在微控制器上运行自定义训练的AI模型，适用于XIAO ESP32S3 Sense开发板。

## 库信息
- **库名**: @aily-project/lib-sscma_micro_core
- **版本**: 1.0.0
- **兼容**: ESP32-S3平台 (XIAO ESP32S3 Sense等)
- **依赖**: `#include <SSCMA_Micro_Core.h>`

## 块定义

### 初始化

| 块类型 | 功能描述 | 生成代码 |
|--------|----------|----------|
| `sscma_core_begin` | 使用XIAO ESP32S3默认配置初始化SSCMA | `camera.begin(...); ai.begin(...);` |
| `sscma_core_set_loop_task_stack_size` | 设置循环任务栈大小 | `SET_LOOP_TASK_STACK_SIZE(40960);` |

### 推理处理

| 块类型 | 功能描述 | 生成代码 |
|--------|----------|----------|
| `sscma_core_get_managed_frame` | 获取管理帧(值块) | `camera.getManagedFrame()` |
| `sscma_core_invoke` | 执行AI推理 | `ai.invoke(frame);` |

### 回调注册 (Hat块)

| 块类型 | 功能描述 | 回调参数 |
|--------|----------|----------|
| `sscma_core_register_boxes_callback` | 目标检测回调 | `std::vector<SSCMAMicroCore::Box>& boxes` |
| `sscma_core_register_classes_callback` | 分类检测回调 | `std::vector<SSCMAMicroCore::Class>& classes` |
| `sscma_core_register_points_callback` | 关键点检测回调 | `std::vector<SSCMAMicroCore::Point>& points` |
| `sscma_core_register_keypoints_callback` | 关键点组检测回调 | `std::vector<SSCMAMicroCore::Keypoints>& keypoints` |
| `sscma_core_register_perf_callback` | 性能指标回调 | `SSCMAMicroCore::Perf& perf` |

### 结果遍历

| 块类型 | 功能描述 | 生成代码 |
|--------|----------|----------|
| `sscma_core_get_boxes` | 遍历目标检测结果 | `for (const auto& box : ai.getBoxes())` |
| `sscma_core_get_classes` | 遍历分类检测结果 | `for (const auto& cls : ai.getClasses())` |
| `sscma_core_get_points` | 遍历关键点检测结果 | `for (const auto& point : ai.getPoints())` |
| `sscma_core_get_keypoints` | 遍历关键点组检测结果 | `for (const auto& kp : ai.getKeypoints())` |
| `sscma_core_get_keypoints_points` | 遍历关键点组中的点 | `for (const auto& point : kp.points)` |

### 结果信息获取 (值块)

| 块类型 | 功能描述 | 迭代变量 | 可用属性 |
|--------|----------|----------|----------|
| `sscma_core_get_boxes_info` | 获取目标检测信息 | `box` | x, y, w, h, score, target |
| `sscma_core_get_classes_info` | 获取分类检测信息 | `cls` | score, target |
| `sscma_core_get_points_info` | 获取关键点信息 | `point` | x, y, z, score, target |
| `sscma_core_get_keypoints_info` | 获取关键点组信息 | `kp.box` | x, y, w, h, score, target |
| `sscma_core_get_keypoints_points_info` | 获取关键点组中的点信息 | `point` | x, y, z, score, target |

### 性能指标

| 块类型 | 功能描述 | 生成代码 |
|--------|----------|----------|
| `sscma_core_get_perf` | 获取性能指标到变量 | `auto perf = ai.getPerf();` |
| `sscma_core_get_perf_info` | 获取性能信息属性 | `perf.preprocess` / `perf.inference` / `perf.postprocess` |

## 下拉选项说明

### 目标检测信息属性 (sscma_core_get_boxes_info)
| 选项 | 值 | 说明 |
|------|-----|------|
| X坐标 | x | 边界框X坐标 |
| Y坐标 | y | 边界框Y坐标 |
| 宽度 | w | 边界框宽度 |
| 高度 | h | 边界框高度 |
| 置信度 | score | 检测置信度 |
| 目标类别 | target | 检测目标类别ID |

### 分类检测信息属性 (sscma_core_get_classes_info)
| 选项 | 值 | 说明 |
|------|-----|------|
| 置信度 | score | 分类置信度 |
| 目标类别 | target | 分类目标类别ID |

### 关键点信息属性 (sscma_core_get_points_info / sscma_core_get_keypoints_points_info)
| 选项 | 值 | 说明 |
|------|-----|------|
| X坐标 | x | 关键点X坐标 |
| Y坐标 | y | 关键点Y坐标 |
| Z坐标 | z | 关键点Z坐标 |
| 置信度 | score | 关键点置信度 |
| 目标类别 | target | 关键点类别ID |

### 关键点组信息属性 (sscma_core_get_keypoints_info)
| 选项 | 值 | 说明 |
|------|-----|------|
| X坐标 | x | 关键点组边界框X坐标 |
| Y坐标 | y | 关键点组边界框Y坐标 |
| 宽度 | w | 关键点组边界框宽度 |
| 高度 | h | 关键点组边界框高度 |
| 置信度 | score | 关键点组置信度 |
| 目标类别 | target | 关键点组类别ID |

### 性能指标属性 (sscma_core_get_perf_info)
| 选项 | 值 | 说明 |
|------|-----|------|
| 预处理时间 | preprocess | 图像预处理耗时(ms) |
| 推理时间 | inference | 模型推理耗时(ms) |
| 后处理时间 | postprocess | 结果后处理耗时(ms) |

## 设计特点

### 简化的初始化
`sscma_core_begin` 块采用一键初始化设计，自动完成：
- 声明全局变量 `SSCMAMicroCore ai;` 和 `SSCMAMicroCore::VideoCapture camera;`
- 使用 XIAO ESP32S3 Sense 默认配置初始化相机
- 使用默认配置初始化 SSCMA 推理引擎

### 遍历块配对使用
遍历块与对应的 info 块必须配对使用：
- `sscma_core_get_boxes` + `sscma_core_get_boxes_info`
- `sscma_core_get_classes` + `sscma_core_get_classes_info`
- `sscma_core_get_points` + `sscma_core_get_points_info`
- `sscma_core_get_keypoints` + `sscma_core_get_keypoints_info`
- `sscma_core_get_keypoints_points` + `sscma_core_get_keypoints_points_info`

### 两种使用模式

#### 模式1: 直接遍历 (推荐用于简单场景)
在 `loop()` 中直接使用遍历块获取结果：
```cpp
// 执行推理
ai.invoke(camera.getManagedFrame());

// 遍历目标检测结果
for (const auto& box : ai.getBoxes()) {
  // 使用 box.x, box.y, box.w, box.h, box.score, box.target
}
```

#### 模式2: 回调模式 (推荐用于异步处理)
注册回调函数，推理完成后自动调用：
```cpp
// 回调函数定义
void sscma_core_boxes_ai(const std::vector<SSCMAMicroCore::Box>& boxes, void* user_context) {
  // 处理检测结果
}

// setup() 中注册
ai.registerBoxesCallback(sscma_core_boxes_ai);
```

## 使用示例

### 基本目标检测
```json
{
  "blocks": {
    "blocks": [
      {
        "type": "sscma_core_begin",
        "next": {
          "block": {
            "type": "sscma_core_invoke",
            "inputs": {
              "FRAME": {
                "block": {
                  "type": "sscma_core_get_managed_frame"
                }
              }
            },
            "next": {
              "block": {
                "type": "sscma_core_get_boxes",
                "inputs": {
                  "HANDLER": {
                    "block": {
                      "type": "serial_print",
                      "inputs": {
                        "TEXT": {
                          "block": {
                            "type": "sscma_core_get_boxes_info",
                            "fields": {"PROPERTY": "score"}
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
    ]
  }
}
```

生成代码:
```cpp
#include <SSCMA_Micro_Core.h>

SSCMAMicroCore ai;
SSCMAMicroCore::VideoCapture camera;

void setup() {
  MA_RETURN_IF_UNEXPECTED(camera.begin(SSCMAMicroCore::VideoCapture::DefaultCameraConfigXIAOS3));
  MA_RETURN_IF_UNEXPECTED(ai.begin(SSCMAMicroCore::Config::DefaultConfig));
}

void loop() {
  MA_RETURN_IF_UNEXPECTED(ai.invoke(camera.getManagedFrame()));
  for (const auto& box : ai.getBoxes()) {
    Serial.print(box.score);
  }
}
```

### 使用回调的目标检测
```json
{
  "blocks": {
    "blocks": [
      {
        "type": "sscma_core_begin"
      },
      {
        "type": "sscma_core_register_boxes_callback",
        "inputs": {
          "HANDLER": {
            "block": {
              "type": "serial_println",
              "inputs": {
                "TEXT": {
                  "block": {
                    "type": "text",
                    "fields": {"TEXT": "检测到目标!"}
                  }
                }
              }
            }
          }
        }
      }
    ]
  }
}
```

### 设置栈大小
```json
{
  "type": "sscma_core_set_loop_task_stack_size",
  "inputs": {
    "SIZE": {
      "shadow": {
        "type": "math_number",
        "fields": {"NUM": 40960}
      }
    }
  }
}
```
生成代码: `SET_LOOP_TASK_STACK_SIZE(40960);` (作为宏添加)

### 获取性能指标
```json
{
  "type": "sscma_core_get_perf",
  "fields": {"PERF_VAR": "perf"},
  "next": {
    "block": {
      "type": "serial_println",
      "inputs": {
        "TEXT": {
          "block": {
            "type": "sscma_core_get_perf_info",
            "fields": {
              "PERF_VAR": {"name": "perf"},
              "PROPERTY": "inference"
            }
          }
        }
      }
    }
  }
}
```
生成代码:
```cpp
auto perf = ai.getPerf();
Serial.println(perf.inference);
```

## 数据类型

### SSCMAMicroCore::Box
```cpp
struct Box {
  float x;      // X坐标
  float y;      // Y坐标
  float w;      // 宽度
  float h;      // 高度
  float score;  // 置信度
  int target;   // 目标类别ID
};
```

### SSCMAMicroCore::Class
```cpp
struct Class {
  float score;  // 置信度
  int target;   // 目标类别ID
};
```

### SSCMAMicroCore::Point
```cpp
struct Point {
  float x;      // X坐标
  float y;      // Y坐标
  float z;      // Z坐标
  float score;  // 置信度
  int target;   // 目标类别ID
};
```

### SSCMAMicroCore::Keypoints
```cpp
struct Keypoints {
  Box box;                    // 关键点组边界框
  std::vector<Point> points;  // 关键点列表
};
```

### SSCMAMicroCore::Perf
```cpp
struct Perf {
  int preprocess;   // 预处理时间(ms)
  int inference;    // 推理时间(ms)
  int postprocess;  // 后处理时间(ms)
};
```

## 重要规则

1. **初始化顺序**: `sscma_core_begin` 必须在所有其他 SSCMA 块之前调用
2. **遍历块配对**: info 块必须在对应的遍历块内部使用
3. **回调注册**: 回调块生成的代码会自动注册到 setup() 末尾
4. **帧管理**: 使用 `getManagedFrame()` 获取的帧由系统自动管理内存
5. **错误处理**: 初始化和推理使用 `MA_RETURN_IF_UNEXPECTED` 宏进行错误处理

## 工具箱结构

```
SSCMA Core
├── 初始化
│   ├── sscma_core_begin
│   └── sscma_core_set_loop_task_stack_size
├── 推理处理
│   ├── sscma_core_get_managed_frame
│   └── sscma_core_invoke
├── 回调注册
│   ├── sscma_core_register_boxes_callback
│   ├── sscma_core_register_classes_callback
│   ├── sscma_core_register_points_callback
│   ├── sscma_core_register_keypoints_callback
│   └── sscma_core_register_perf_callback
├── 检测结果
│   ├── sscma_core_get_boxes
│   └── sscma_core_get_boxes_info
├── 分类结果
│   ├── sscma_core_get_classes
│   └── sscma_core_get_classes_info
├── 关键点结果
│   ├── sscma_core_get_points
│   └── sscma_core_get_points_info
├── 关键点组结果
│   ├── sscma_core_get_keypoints
│   ├── sscma_core_get_keypoints_info
│   ├── sscma_core_get_keypoints_points
│   └── sscma_core_get_keypoints_points_info
└── 性能指标
    ├── sscma_core_get_perf
    └── sscma_core_get_perf_info
```
