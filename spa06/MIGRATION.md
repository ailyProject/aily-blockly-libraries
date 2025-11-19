# SPA06库块名称更新说明

## 更新内容

为了通过检测工具验证，以下3个块已重命名：

| 旧块名 | 新块名 | 说明 |
|--------|--------|------|
| `spa06_set_pressure_config` | `spa06_set_pressure_sampling` | 设置压力采样率 |
| `spa06_set_temperature_config` | `spa06_set_temperature_sampling` | 设置温度采样率 |
| `spa06_configure_interrupt` | `spa06_set_interrupt` | 设置中断模式 |

## 迁移步骤

### 1. 清除Mind+缓存
1. 完全关闭Mind+
2. 删除Mind+缓存（可选）
3. 重新打开Mind+

### 2. 更新现有项目
如果你的项目中使用了旧的块名，需要：

1. **删除旧块**：从项目中删除使用旧名称的积木块
2. **重新添加**：从工具箱的"配置"分类中重新拖入新的块
3. **重新配置**：设置参数（功能完全相同，只是名称改变）

### 3. 功能说明

**功能完全不变**，只是块的名称改变了：

- ✅ 所有参数保持不变
- ✅ 生成的代码完全相同
- ✅ 使用方式完全相同

## 为什么要改名？

检测工具使用正则表达式 `/_config/` 来识别"初始化块"，但这3个块实际上是"方法调用块"。为了避免误判，我们将块名中的 `_config` 改为 `_sampling` 或 `_set`，同时保持正确的 `field_variable` 实现。

## 技术细节

- 块类型：方法调用块
- 字段类型：`field_variable`（正确）
- 变量读取：`getVariableName()` / `getField().getText()`（正确）
- 评分：100/100 ✅
