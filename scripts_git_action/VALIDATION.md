# 库规范检测系统使用指南

## 📋 概述

本项目提供了一套完整的库规范检测系统，用于确保所有 Blockly 库符合项目标准。

## 🚀 快速开始

### 本地检测

```bash
# 安装依赖
npm install js-yaml

# 检测指定库
node validate-library-compliance.js arduino_wifi

# 检测所有库
node validate-library-compliance.js --all

# 检测 PR 中变更的库（推荐）
node validate-library-compliance.js --changed

# 查看帮助
node validate-library-compliance.js --help
```

## ⚙️ 配置文件

配置文件位于 [.github/compliance-config.yml](.github/compliance-config.yml)

### 配置项说明

#### 1. 评分权重
```yaml
compliance:
  scoring:
    file_structure: 10      # 文件结构
    package_json: 15        # package.json 规范
    block_json: 20         # block.json 设计
    generator_js: 25       # generator.js 实现
    toolbox_json: 10       # toolbox.json 配置
    readme: 20             # README 文档
```

#### 2. 检测严格程度
```yaml
strictness:
  missing_readme: warning        # 缺少 README
  outdated_version: info         # 版本过时
  missing_i18n: warning          # 缺少国际化
  poor_generator_practices: error # 生成器代码问题
```

#### 3. GitHub Actions 配置
```yaml
github:
  pull_request:
    auto_check: true          # 自动检测 PR
    block_merge: true         # 阻止不合规的 PR
    minimum_score: 80         # 最低通过分数
    detailed_comments: true   # 详细评论报告
```

## 🔄 GitHub Actions 集成

### 自动触发条件

当 PR 或 Push 涉及以下文件时，会自动触发检测：
- `*/package.json`
- `*/block.json`
- `*/generator.js`
- `*/toolbox.json`
- `*/readme.md`

### Workflow 文件

检测工作流配置文件：[.github/workflows/library-compliance-check.yml](.github/workflows/library-compliance-check.yml)

### PR 评论

检测完成后，GitHub Actions 会自动在 PR 中添加评论，包含：
- ✅/❌ 检测结果状态
- 📦 检测的库列表
- 📊 详细报告链接
- 💡 本地检测命令
- 📖 规范文档链接

## 📊 检测项目

### 1. 文件结构 (10分)
- ✅ `package.json` 存在
- ✅ `block.json` 存在
- ✅ `generator.js` 存在
- ✅ `toolbox.json` 存在
- ⚠️ `README.md` 存在（推荐）

### 2. package.json 规范 (15分)
- 名称、版本、描述
- 依赖声明
- 关键字标签
- 作者信息

### 3. block.json 设计 (20分)
- 块类型定义
- 输入输出配置
- 颜色和样式
- 国际化支持

### 4. generator.js 实现 (25分)
- 代码生成逻辑
- 库依赖管理
- 变量作用域
- 错误处理

### 5. toolbox.json 配置 (10分)
- 工具箱分类
- 影子块设置
- 块排序

### 6. README 文档 (20分)
- 库简介
- 使用示例
- API 文档
- 硬件支持列表

## 🎯 评分标准

| 分数范围 | 状态 | 说明 |
|---------|------|------|
| ≥90% | ✅ 完全合规 | 可以合并 |
| 60-89% | ⚠️ 部分合规 | 建议改进 |
| <60% | ❌ 需要修改 | 阻止合并 |

## 📖 相关文档

- [Arduino库转Blockly库规范](Arduino库转Blockly库规范.md)
- [Blockly库README编写规范](blockly库readme编写规范.md)
- [库开发指南](库开发.md)
- [配置文件](.github/compliance-config.yml)

## 🛠️ 故障排除

### 问题：检测失败但不知道原因

**解决方案**：
```bash
# 查看详细错误信息
node validate-library-compliance.js <库名>
```

### 问题：GitHub Actions 没有评论权限

**解决方案**：
1. 进入仓库 Settings → Actions → General
2. 设置 Workflow permissions 为 "Read and write permissions"
3. 启用 "Allow GitHub Actions to create and approve pull requests"

### 问题：配置文件加载失败

**解决方案**：
```bash
# 验证 YAML 语法
node -e "const yaml = require('js-yaml'); const fs = require('fs'); try { yaml.load(fs.readFileSync('.github/compliance-config.yml', 'utf8')); console.log('✅ 配置文件正确'); } catch (e) { console.error('❌ 配置错误:', e.message); }"
```

## 💡 最佳实践

1. **开发前检测**：在开始开发前，先检测类似的库作为参考
2. **持续检测**：开发过程中定期运行检测脚本
3. **PR 前检测**：提交 PR 前在本地运行 `--changed` 模式
4. **配置调整**：根据项目需求调整 compliance-config.yml

## 🔗 命令速查

```bash
# 检测单个库
npm run validate -- arduino_wifi

# 检测所有库
npm run validate:all

# 检测变更库（CI/CD）
npm run validate:changed

# 查看帮助
npm run help
```

## 📝 更新日志

- v2.0: 添加 `--changed` 模式，支持配置文件
- v1.0: 初始版本，基础检测功能
