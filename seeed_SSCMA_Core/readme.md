# seeed_SSCMA_Core

微控制器优化的AI推理库

## 库信息
- **库名**: @aily-project/lib-sscma_micro_core
- **版本**: 1.0.0
- **兼容**: ESP32-S3平台(XIAO ESP32S3 Sense等)

## 块定义

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `sscma_core_create` | 语句块 | VAR(field_input) | `"fields":{"VAR":"ai"}` | `SSCMAMicroCore ai;` |
| `sscma_core_create_video_capture` | 语句块 | VAR(field_input) | `"fields":{"VAR":"camera"}` | `VideoCapture camera;` |
| `sscma_core_begin` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMAMicroCore"}}` | `ai.begin();` |
| `sscma_core_video_capture_begin` | 语句块 | VAR(field_variable) | `"fields":{"VAR":{"id":"cam_id","name":"camera","type":"VideoCapture"}}` | `camera.begin();` |
| `sscma_core_set_loop_task_stack_size` | 语句块 | SIZE(input_value) | `"inputs":{"SIZE":{"block":{"type":"math_number","fields":{"NUM":"40960"}}}}` | `set_loop_task_stack_size(40960);` |
| `sscma_core_get_managed_frame` | 值块 | VAR(field_variable) | `"fields":{"VAR":{"id":"cam_id","name":"camera","type":"VideoCapture"}}` | `camera.getManagedFrame()` |
| `sscma_core_invoke` | 语句块 | VAR(field_variable), FRAME(input_value) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMAMicroCore"}},"inputs":{"FRAME":{"block":{"type":"sscma_core_get_managed_frame"}}}` | `ai.invoke(frame);` |
| `sscma_core_register_boxes_callback` | Hat块 | VAR(field_variable), HANDLER(input_statement) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMAMicroCore"}},"inputs":{"HANDLER":{"block":{...}}}` | `ai.registerBoxesCallback(callback)` |
| `sscma_core_register_classes_callback` | Hat块 | VAR(field_variable), HANDLER(input_statement) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMAMicroCore"}},"inputs":{"HANDLER":{"block":{...}}}` | `ai.registerClassesCallback(callback)` |
| `sscma_core_register_points_callback` | Hat块 | VAR(field_variable), HANDLER(input_statement) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMAMicroCore"}},"inputs":{"HANDLER":{"block":{...}}}` | `ai.registerPointsCallback(callback)` |
| `sscma_core_register_keypoints_callback` | Hat块 | VAR(field_variable), HANDLER(input_statement) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMAMicroCore"}},"inputs":{"HANDLER":{"block":{...}}}` | `ai.registerKeypointsCallback(callback)` |
| `sscma_core_register_perf_callback` | Hat块 | VAR(field_variable), HANDLER(input_statement) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMAMicroCore"}},"inputs":{"HANDLER":{"block":{...}}}` | `ai.registerPerfCallback(callback)` |
| `sscma_core_get_boxes` | 语句块 | VAR(field_variable), HANDLER(input_statement) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMAMicroCore"}},"inputs":{"HANDLER":{"block":{...}}}` | `for(auto& box : boxes)` |
| `sscma_core_get_boxes_info` | 值块 | PROPERTY(field_dropdown) | `"fields":{"PROPERTY":"x"}` | `box.x` |
| `sscma_core_get_classes` | 语句块 | VAR(field_variable), HANDLER(input_statement) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMAMicroCore"}},"inputs":{"HANDLER":{"block":{...}}}` | `for(auto& cls : classes)` |
| `sscma_core_get_classes_info` | 值块 | PROPERTY(field_dropdown) | `"fields":{"PROPERTY":"score"}` | `cls.score` |
| `sscma_core_get_points` | 语句块 | VAR(field_variable), HANDLER(input_statement) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMAMicroCore"}},"inputs":{"HANDLER":{"block":{...}}}` | `for(auto& pt : points)` |
| `sscma_core_get_points_info` | 值块 | PROPERTY(field_dropdown) | `"fields":{"PROPERTY":"x"}` | `pt.x` |
| `sscma_core_get_keypoints` | 语句块 | VAR(field_variable), HANDLER(input_statement) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMAMicroCore"}},"inputs":{"HANDLER":{"block":{...}}}` | `for(auto& kp : keypoints)` |
| `sscma_core_get_keypoints_info` | 值块 | PROPERTY(field_dropdown) | `"fields":{"PROPERTY":"x"}` | `kp.x` |
| `sscma_core_get_keypoints_points` | 语句块 | HANDLER(input_statement) | `"inputs":{"HANDLER":{"block":{...}}}` | `for(auto& pt : kp.points)` |
| `sscma_core_get_keypoints_points_info` | 值块 | PROPERTY(field_dropdown) | `"fields":{"PROPERTY":"x"}` | `pt.x` |
| `sscma_core_get_perf` | 语句块 | VAR(field_variable), PERF_VAR(field_input) | `"fields":{"VAR":{"id":"ai_id","name":"ai","type":"SSCMAMicroCore"},"PERF_VAR":"perf"}` | `Perf perf = ai.getPerf();` |
| `sscma_core_get_perf_info` | 值块 | PERF_VAR(field_variable), PROPERTY(field_dropdown) | `"fields":{"PERF_VAR":{"id":"perf_id","name":"perf","type":"Perf"},"PROPERTY":"inference"}` | `perf.inference` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "ai"`, `"PERF_VAR": "perf"` |
| field_variable | 变量对象 | `"VAR": {"id": "ai_id", "name": "ai", "type": "SSCMAMicroCore"}` |
| field_dropdown | 字符串 | `"PROPERTY": "x"`, `"PROPERTY": "score"` |
| input_value | 块连接 | `"inputs": {"SIZE": {"block": {"type": "math_number", "fields": {"NUM": "40960"}}}}` |
| input_statement | 块连接 | `"inputs": {"HANDLER": {"block": {...}}}` |

## 连接规则

- **语句块**: create/begin/invoke/get_*遍历块有previousStatement/nextStatement，通过`next`字段连接
- **值块**: get_managed_frame和各种*_info块有output，连接到`inputs`中，无`next`字段
- **Hat块**: register_*_callback块无previousStatement/nextStatement，通过`inputs`的HANDLER连接内部语句
- **特殊规则**: 
  - SSCMAMicroCore变量类型为"SSCMAMicroCore"，VideoCapture类型为"VideoCapture"，Perf类型为"Perf"
  - create块使用field_input创建变量，其他块使用field_variable引用变量
  - **遍历块配对使用**: `get_boxes`与`get_boxes_info`配对，`get_classes`与`get_classes_info`配对，依此类推
  - **info块无需VAR**: 在遍历块内部使用info块时，不需要指定VAR字段，直接访问当前遍历项
  - **使用场景**: get_*遍历块通常在loop()中直接使用，也可以在register_*_callback回调内使用
  - 回调块是Hat块，会生成独立的回调函数并自动注册，适用于异步处理
  - get_perf使用field_input创建Perf变量，get_perf_info使用field_variable引用

## 使用示例

### 实例创建和初始化
```json
{
  "type": "sscma_core_create",
  "id": "create_ai",
  "fields": {"VAR": "ai"},
  "next": {
    "block": {
      "type": "sscma_core_create_video_capture",
      "id": "create_cam",
      "fields": {"VAR": "camera"},
      "next": {
        "block": {
          "type": "sscma_core_begin",
          "id": "init_ai",
          "fields": {"VAR": {"id": "ai_id"}},
          "next": {
            "block": {
              "type": "sscma_core_video_capture_begin",
              "id": "init_cam",
              "fields": {"VAR": {"id": "cam_id"}}
            }
          }
        }
      }
    }
  }
}
```

### Loop中遍历检测结果(推荐方式)
```json
{
  "type": "sscma_core_invoke",
  "id": "invoke_ai",
  "fields": {"VAR": {"id": "ai_id"}},
  "inputs": {
    "FRAME": {
      "shadow": {
        "type": "sscma_core_get_managed_frame",
        "id": "get_frame",
        "fields": {"VAR": {"id": "cam_id"}}
      }
    }
  },
  "next": {
    "block": {
      "type": "sscma_core_get_boxes",
      "id": "get_boxes",
      "fields": {"VAR": {"id": "ai_id"}},
      "inputs": {
        "HANDLER": {
          "block": {
            "type": "serial_print",
            "id": "print_score",
            "fields": {"SERIAL": "Serial"},
            "inputs": {
              "VAR": {
                "shadow": {
                  "type": "text",
                  "id": "text1",
                  "fields": {"TEXT": "Box: score= "}
                }
              }
            },
            "next": {
              "block": {
                "type": "serial_print",
                "id": "print_score_val",
                "fields": {"SERIAL": "Serial"},
                "inputs": {
                  "VAR": {
                    "block": {
                      "type": "sscma_core_get_boxes_info",
                      "id": "box_score",
                      "fields": {"PROPERTY": "score"}
                    }
                  }
                },
                "next": {
                  "block": {
                    "type": "serial_print",
                    "id": "print_target_label",
                    "fields": {"SERIAL": "Serial"},
                    "inputs": {
                      "VAR": {
                        "shadow": {
                          "type": "text",
                          "id": "text2",
                          "fields": {"TEXT": ", target= "}
                        }
                      }
                    },
                    "next": {
                      "block": {
                        "type": "serial_println",
                        "id": "print_target_val",
                        "fields": {"SERIAL": "Serial"},
                        "inputs": {
                          "VAR": {
                            "block": {
                              "type": "sscma_core_get_boxes_info",
                              "id": "box_target",
                              "fields": {"PROPERTY": "target"}
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
    }
  }
}
```

### 在回调中使用遍历(异步处理)
```json
{
  "type": "sscma_core_register_boxes_callback",
  "id": "boxes_cb",
  "fields": {"VAR": {"id": "ai_id", "name": "ai", "type": "SSCMAMicroCore"}},
  "inputs": {
    "HANDLER": {
      "block": {
        "type": "sscma_core_get_boxes",
        "id": "get_boxes",
        "fields": {"VAR": {"id": "ai_id", "name": "ai", "type": "SSCMAMicroCore"}},
        "inputs": {
          "HANDLER": {
            "block": {
              "type": "serial_print",
              "id": "print_x",
              "fields": {"SERIAL": "Serial"},
              "inputs": {
                "VAR": {
                  "block": {
                    "type": "sscma_core_get_boxes_info",
                    "id": "box_x",
                    "fields": {"PROPERTY": "x"}
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

### 获取关键点组及嵌套遍历
```json
{
  "type": "sscma_core_get_keypoints",
  "id": "get_kps",
  "fields": {"VAR": {"id": "ai_id"}},
  "inputs": {
    "HANDLER": {
      "block": {
        "type": "serial_print",
        "id": "print_kp_score",
        "fields": {"SERIAL": "Serial"},
        "inputs": {
          "VAR": {
            "block": {
              "type": "sscma_core_get_keypoints_info",
              "id": "kp_score",
              "fields": {"PROPERTY": "score"}
            }
          }
        },
        "next": {
          "block": {
            "type": "sscma_core_get_keypoints_points",
            "id": "get_kp_pts",
            "inputs": {
              "HANDLER": {
                "block": {
                  "type": "serial_print",
                  "id": "print_pt_x",
                  "fields": {"SERIAL": "Serial"},
                  "inputs": {
                    "VAR": {
                      "block": {
                        "type": "sscma_core_get_keypoints_points_info",
                        "id": "pt_x",
                        "fields": {"PROPERTY": "x"}
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

### 获取性能指标
```json
{
  "type": "sscma_core_get_perf",
  "id": "get_perf",
  "fields": {
    "VAR": {"id": "ai_id"},
    "PERF_VAR": "perf"
  },
  "next": {
    "block": {
      "type": "serial_print",
      "id": "print_preprocess",
      "fields": {"SERIAL": "Serial"},
      "inputs": {
        "VAR": {
          "shadow": {
            "type": "text",
            "id": "text_pre",
            "fields": {"TEXT": "Perf: preprocess= "}
          }
        }
      },
      "next": {
        "block": {
          "type": "serial_print",
          "id": "print_pre_val",
          "fields": {"SERIAL": "Serial"},
          "inputs": {
            "VAR": {
              "block": {
                "type": "sscma_core_get_perf_info",
                "id": "perf_pre",
                "fields": {
                  "PERF_VAR": {"id": "perf_id"},
                  "PROPERTY": "preprocess"
                }
              }
            }
          },
          "next": {
            "block": {
              "type": "serial_print",
              "id": "print_inf_label",
              "fields": {"SERIAL": "Serial"},
              "inputs": {
                "VAR": {
                  "shadow": {
                    "type": "text",
                    "id": "text_inf",
                    "fields": {"TEXT": "ms, inference= "}
                  }
                }
              },
              "next": {
                "block": {
                  "type": "serial_println",
                  "id": "print_inf_val",
                  "fields": {"SERIAL": "Serial"},
                  "inputs": {
                    "VAR": {
                      "block": {
                        "type": "sscma_core_get_perf_info",
                        "id": "perf_inf",
                        "fields": {
                          "PERF_VAR": {"id": "LMuzXp(VVz~D:OKuacu-"},
                          "PROPERTY": "inference"
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
}
```

## 重要规则

1. **必须遵守**: 实例必须先create再begin，invoke需要有效的Frame输入，块ID必须唯一，变量ID在整个程序中保持一致
2. **连接限制**: create/begin/invoke/get_*遍历块是语句块有next连接，*_info块是值块无next字段，register_*_callback是Hat块无连接
3. **变量管理**: 
   - SSCMAMicroCore类型用于AI实例
   - VideoCapture类型用于摄像头实例
   - Perf类型用于性能指标
   - 支持多实例(ai、ai2等)
4. **遍历块配对规则**: 
   - `get_boxes`必须与`get_boxes_info`配对使用
   - `get_classes`必须与`get_classes_info`配对使用
   - `get_points`必须与`get_points_info`配对使用
   - `get_keypoints`必须与`get_keypoints_info`配对使用
   - `get_keypoints_points`必须与`get_keypoints_points_info`配对使用
   - info块只能在对应的遍历块HANDLER内使用
5. **使用场景**: 
   - **Loop中直接遍历**(推荐): 在loop()中调用invoke后直接使用get_*遍历块处理结果
   - **回调中遍历**: 在register_*_callback回调内使用get_*遍历块进行异步处理
   - **Task中使用**: 也可在FreeRTOS任务中使用遍历块
6. **嵌套遍历**: `get_keypoints`可以嵌套`get_keypoints_points`，实现关键点组→关键点的二级遍历
7. **常见错误**: 
   - ❌ 未create直接使用变量
   - ❌ 未begin就调用invoke
   - ❌ 在遍历块外使用info块
   - ❌ get_boxes与get_classes_info错误配对
   - ❌ field_variable缺少id或type字段
   - ❌ 混淆field_input(创建)和field_variable(引用)
   - ❌ 在info块中指定VAR字段(info块自动使用当前遍历项)

## 支持的字段选项

### PROPERTY(目标检测)
- `"x"`: X坐标
- `"y"`: Y坐标
- `"w"`: 宽度
- `"h"`: 高度
- `"score"`: 置信度
- `"target"`: 目标类别ID

### PROPERTY(分类)
- `"score"`: 置信度
- `"target"`: 目标类别ID

### PROPERTY(关键点)
- `"x"`: X坐标
- `"y"`: Y坐标
- `"z"`: Z坐标
- `"score"`: 置信度
- `"target"`: 目标类别ID

### PROPERTY(关键点组)
- `"x"`: X坐标(中心点)
- `"y"`: Y坐标(中心点)
- `"w"`: 宽度
- `"h"`: 高度
- `"score"`: 置信度
- `"target"`: 目标类别ID

### PROPERTY(性能指标)
- `"preprocess"`: 预处理时间(ms)
- `"inference"`: 推理时间(ms)
- `"postprocess"`: 后处理时间(ms)

## 技术说明
- **平台限制**: 仅支持ESP32-S3，需要足够的RAM和Flash
- **栈大小**: 默认40960字节，复杂模型可能需要调整
- **回调模式**: 基于回调的异步处理，避免阻塞主循环
- **内存管理**: Frame使用托管模式，自动处理内存释放
