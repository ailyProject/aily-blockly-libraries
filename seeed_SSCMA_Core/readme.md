# SSCMA Micro Core

Seeed SSCMA微控制器AI推理核心库，专为ESP32-S3优化的本地AI视觉处理引擎。需要下载识别模型文件到设备的SPIFFS文件系统中使用。支持目标检测、图像分类、关键点检测、姿态估计等多种AI算法，可直接在微控制器上运行自定义训练的AI模型，适用于XIAO ESP32S3 Sense开发板。

## 库信息
- **库名**: @aily-project/lib-sscma_micro_core
- **版本**: 1.0.1
- **兼容**: ESP32-S3平台 (XIAO ESP32S3 Sense)
- **依赖**: `#include <SSCMA_Micro_Core.h>`

## 块定义

遍历块与info块必须配对使用，info块只能在对应遍历块的HANDLER内部使用。

| 块类型 | 连接 | 字段/输入 | .abi格式 | 生成代码 |
|--------|------|----------|----------|----------|
| `sscma_core_begin` | 语句块 | 无 | `{}` | `camera.begin(...); ai.begin(...);` |
| `sscma_core_set_loop_task_stack_size` | 语句块 | SIZE(input) | `"inputs":{"SIZE":{"shadow":{"type":"math_number","fields":{"NUM":40960}}}}` | `SET_LOOP_TASK_STACK_SIZE(40960);` |
| `sscma_core_get_managed_frame` | 值块 | 无 | `{}` | `camera.getManagedFrame()` |
| `sscma_core_invoke` | 语句块 | FRAME(input) | `"inputs":{"FRAME":{"block":{"type":"sscma_core_get_managed_frame"}}}` | `ai.invoke(frame);` |
| `sscma_core_register_boxes_callback` | Hat块 | HANDLER(statement) | `"inputs":{"HANDLER":{"block":{...}}}` | `ai.registerBoxesCallback(fn)` |
| `sscma_core_register_classes_callback` | Hat块 | HANDLER(statement) | `"inputs":{"HANDLER":{"block":{...}}}` | `ai.registerClassesCallback(fn)` |
| `sscma_core_register_points_callback` | Hat块 | HANDLER(statement) | `"inputs":{"HANDLER":{"block":{...}}}` | `ai.registerPointsCallback(fn)` |
| `sscma_core_register_keypoints_callback` | Hat块 | HANDLER(statement) | `"inputs":{"HANDLER":{"block":{...}}}` | `ai.registerKeypointsCallback(fn)` |
| `sscma_core_register_perf_callback` | Hat块 | HANDLER(statement) | `"inputs":{"HANDLER":{"block":{...}}}` | `ai.registerPerfCallback(fn)` |
| `sscma_core_get_boxes` | 语句块 | HANDLER(statement) | `"inputs":{"HANDLER":{"block":{...}}}` | `for(auto& box : ai.getBoxes())` |
| `sscma_core_get_boxes_info` | 值块 | PROPERTY(dropdown) | `"fields":{"PROPERTY":"score"}` | `box.score` |
| `sscma_core_get_classes` | 语句块 | HANDLER(statement) | `"inputs":{"HANDLER":{"block":{...}}}` | `for(auto& cls : ai.getClasses())` |
| `sscma_core_get_classes_info` | 值块 | PROPERTY(dropdown) | `"fields":{"PROPERTY":"score"}` | `cls.score` |
| `sscma_core_get_points` | 语句块 | HANDLER(statement) | `"inputs":{"HANDLER":{"block":{...}}}` | `for(auto& point : ai.getPoints())` |
| `sscma_core_get_points_info` | 值块 | PROPERTY(dropdown) | `"fields":{"PROPERTY":"x"}` | `point.x` |
| `sscma_core_get_keypoints` | 语句块 | HANDLER(statement) | `"inputs":{"HANDLER":{"block":{...}}}` | `for(auto& kp : ai.getKeypoints())` |
| `sscma_core_get_keypoints_info` | 值块 | PROPERTY(dropdown) | `"fields":{"PROPERTY":"score"}` | `kp.box.score` |
| `sscma_core_get_keypoints_points` | 语句块 | HANDLER(statement) | `"inputs":{"HANDLER":{"block":{...}}}` | `for(auto& point : kp.points)` |
| `sscma_core_get_keypoints_points_info` | 值块 | PROPERTY(dropdown) | `"fields":{"PROPERTY":"x"}` | `point.x` |
| `sscma_core_get_perf` | 语句块 | VAR(field_input) | `"fields":{"VAR":"perf"}` | `auto perf = ai.getPerf();` |
| `sscma_core_get_perf_info` | 值块 | VAR(field_variable), PROPERTY(dropdown) | `"fields":{"VAR":"perf","PROPERTY":"inference"}` | `perf.inference` |

## 字段类型映射

| 类型 | .abi格式 | 示例 |
|------|----------|------|
| field_input | 字符串 | `"VAR": "perf"` |
| field_variable | 对象 | `"VAR": "perf"` |
| field_dropdown | 字符串 | `"PROPERTY": "score"` |
| input_value | 块连接 | `"inputs": {"FRAME": {"block": {...}}}` |
| input_statement | 块连接 | `"inputs": {"HANDLER": {"block": {...}}}` |

### PROPERTY 字段选项

**目标检测(boxes_info)**: `"x"` / `"y"` / `"w"` / `"h"` / `"score"` / `"target"`  
**分类(classes_info)**: `"score"` / `"target"`  
**关键点(points_info/keypoints_points_info)**: `"x"` / `"y"` / `"z"` / `"score"` / `"target"`  
**关键点组(keypoints_info)**: `"x"` / `"y"` / `"w"` / `"h"` / `"score"` / `"target"`  
**性能(perf_info)**: `"preprocess"` / `"inference"` / `"postprocess"`

## 连接规则

- **语句块**: 有previousStatement/nextStatement，通过`next`字段连接
- **值块**: 有output，连接到`inputs`中，无`next`字段
- **Hat块**: 无previousStatement/nextStatement，独立存在，HANDLER内容自动注册为回调
- **遍历配对**: `get_boxes`↔`get_boxes_info`，`get_classes`↔`get_classes_info`，依此类推
- **嵌套遍历**: `get_keypoints`内可嵌套`get_keypoints_points`实现二级遍历

## 使用示例

### 初始化
```json
{"type": "sscma_core_begin"}
```
生成: `camera.begin(DefaultCameraConfigXIAOS3); ai.begin(DefaultConfig);`  
自动声明: `SSCMAMicroCore ai;` `SSCMAMicroCore::VideoCapture camera;`

### 执行推理
```json
{"type": "sscma_core_invoke", "inputs": {"FRAME": {"block": {"type": "sscma_core_get_managed_frame"}}}}
```
生成: `MA_RETURN_IF_UNEXPECTED(ai.invoke(camera.getManagedFrame()));`

### 遍历检测结果
```json
{"type": "sscma_core_get_boxes", "inputs": {"HANDLER": {"block": {"type": "serial_print", "inputs": {"TEXT": {"block": {"type": "sscma_core_get_boxes_info", "fields": {"PROPERTY": "score"}}}}}}}}
```
生成: `for(const auto& box : ai.getBoxes()) { Serial.print(box.score); }`

### 注册回调
```json
{"type": "sscma_core_register_boxes_callback", "inputs": {"HANDLER": {"block": {"type": "serial_println", "inputs": {"TEXT": {"shadow": {"type": "text", "fields": {"TEXT": "检测到目标"}}}}}}}}
```
生成回调函数并自动注册到setup()末尾

### 获取性能指标
```json
{"type": "sscma_core_get_perf", "fields": {"VAR": "perf"}, "next": {"block": {"type": "serial_println", "inputs": {"TEXT": {"block": {"type": "sscma_core_get_perf_info", "fields": {"VAR": "perf", "PROPERTY": "inference"}}}}}}}
```
生成: `auto perf = ai.getPerf(); Serial.println(perf.inference);`

### 嵌套遍历关键点组
```json
{"type": "sscma_core_get_keypoints", "inputs": {"HANDLER": {"block": {"type": "sscma_core_get_keypoints_points", "inputs": {"HANDLER": {"block": {"type": "serial_print", "inputs": {"TEXT": {"block": {"type": "sscma_core_get_keypoints_points_info", "fields": {"PROPERTY": "x"}}}}}}}}}}}
```
生成: `for(auto& kp : ai.getKeypoints()) { for(auto& point : kp.points) { Serial.print(point.x); } }`

### 设置栈大小
```json
{"type": "sscma_core_set_loop_task_stack_size", "inputs": {"SIZE": {"shadow": {"type": "math_number", "fields": {"NUM": 40960}}}}}
```
生成: `SET_LOOP_TASK_STACK_SIZE(40960);` (宏定义)

## 重要规则

1. **初始化顺序**: `sscma_core_begin`必须在所有SSCMA块之前调用
2. **遍历配对**: info块只能在对应遍历块HANDLER内使用
3. **回调注册**: Hat块生成的回调自动注册到setup()末尾
4. **嵌套限制**: `keypoints_points`只能在`keypoints`内部使用
5. **变量管理**: `get_perf`用field_input创建，`get_perf_info`用field_variable引用
6. **错误处理**: 使用`MA_RETURN_IF_UNEXPECTED`宏自动处理错误

## 数据类型

**Box**: `x`, `y`, `w`, `h`(float), `score`(float), `target`(int)  
**Class**: `score`(float), `target`(int)  
**Point**: `x`, `y`, `z`(float), `score`(float), `target`(int)  
**Keypoints**: `box`(Box), `points`(vector<Point>)  
**Perf**: `preprocess`, `inference`, `postprocess`(int, ms)

---
*自包含文档，无需外部规范*
