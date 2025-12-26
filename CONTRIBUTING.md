# 🤝 PR提交指南 (Contributing Guidelines)

感谢您对 aily-blockly-libraries 的贡献！本指南将帮助您规范地提交Pull Request，确保您的贡献能够顺利合并。

---

## 📋 目录

- [快速开始](#-快速开始)
- [⚠️ PR核心规则](#️-pr核心规则)
- [提交前准备](#-提交前准备)
- [库结构规范](#-库结构规范)
- [PR提交流程](#-pr提交流程)
- [代码规范检测](#-代码规范检测)
- [提交信息规范](#-提交信息规范)
- [PR模板](#-pr模板)
- [审核流程](#-审核流程)
- [常见问题](#-常见问题)

---

## 🚀 快速开始

### 1. Fork 仓库
```bash
# 在GitHub上Fork本仓库到您的个人账户
# 然后克隆到本地
git clone https://github.com/<您的用户名>/aily-blockly-libraries.git
cd aily-blockly-libraries
```

### 2. 创建分支
```bash
# 创建功能分支（推荐使用有意义的分支名）
git checkout -b feature/新库名称
# 或
git checkout -b fix/修复问题描述
```

### 3. 开发与测试
```bash
# 开发您的库...

# 运行规范检测
node validate-library-compliance.js 您的库名称
```

### 4. 提交与推送
```bash
git add .
git commit -m "feat(库名): 添加XXX库"
git push origin feature/新库名称
```

### 5. 创建Pull Request
在GitHub上创建PR，填写相关信息，等待审核。

---

## ⚠️ PR核心规则

> **重要提示**：为了保证代码审核效率和版本管理的清晰性，请严格遵守以下规则。不符合规则的PR将被要求修改或拒绝。

### 🔴 一个PR只能修改一个库

| ✅ 正确做法 | ❌ 错误做法 |
|------------|------------|
| PR #1: 添加DHT库 | PR #1: 同时添加DHT库和BME280库 |
| PR #2: 添加BME280库 | PR #1: 修复DHT库bug + 添加新功能到servo库 |
| PR #3: 修复FastLED库bug | PR #1: 更新多个库的package.json版本 |

**原因**：
- 便于代码审核，每个PR专注于单一变更
- 便于问题追踪，如果出现bug可以快速定位
- 便于版本回滚，可以独立撤销某个库的变更
- 便于CI/CD，自动检测只针对单个库运行

### 🔴 保持Commit简洁

**推荐**：每个PR使用一个清晰的commit（或少量高度相关的commit）

```bash
# ✅ 推荐：单个完整的commit
git add DHT/
git commit -m "feat(DHT): 添加DHT温湿度传感器库"

# ✅ 可接受：少量相关commit（针对复杂库）
git commit -m "feat(DHT): 添加DHT传感器基础功能"
git commit -m "feat(DHT): 添加DHT20 I2C支持"
git commit -m "docs(DHT): 添加使用文档和示例"

# ❌ 避免：过多零散的commit
git commit -m "add file"
git commit -m "fix typo"
git commit -m "update"
git commit -m "fix again"
git commit -m "final fix"
```

**如何合并多个commit**：
```bash
# 方法1：使用 --amend 修改最后一个commit
git add .
git commit --amend -m "feat(DHT): 添加DHT温湿度传感器库"

# 方法2：使用 rebase 合并多个commit
git rebase -i HEAD~3  # 合并最近3个commit
# 在编辑器中将 pick 改为 squash 或 s，保留第一个为 pick
```

### 🔴 如果需要修改多个库

请分别创建多个PR：

```bash
# 库1：DHT
git checkout -b feature/DHT
# 开发DHT库...
git add DHT/
git commit -m "feat(DHT): 添加DHT温湿度传感器库"
git push origin feature/DHT
# 创建PR #1

# 库2：BME280
git checkout main
git checkout -b feature/BME280
# 开发BME280库...
git add BME280/
git commit -m "feat(BME280): 添加BME280气压传感器库"
git push origin feature/BME280
# 创建PR #2
```

### 📋 PR检查清单

在提交PR前，请确认：

- [ ] 本PR只涉及 **一个库** 的变更
- [ ] Commit信息清晰，描述了变更内容
- [ ] 没有包含无关文件的修改
- [ ] 已运行规范检测且分数>=80分

---

## ✅ 提交前准备

### 必读文档
在提交PR前，请确保您已阅读并理解以下规范文档：

| 文档 | 说明 |
|------|------|
| [库规范.md](./库规范.md) | 库开发的核心规范，包含block.json、generator.js等详细说明 |
| [库开发.md](./库开发.md) | 库的开发调试方法和提交流程 |
| [i18n.md](./i18n.md) | 多语言支持规范 |
| [blockly库readme编写规范.md](./blockly库readme编写规范.md) | README文档编写标准 |
| [Arduino库转Blockly库规范.md](./Arduino库转Blockly库规范.md) | 将Arduino库转换为Blockly库的方法 |

### 环境要求
- Node.js >= 14.0.0
- 7-Zip（用于压缩Arduino源码）

---

## 📦 库结构规范

### 必需文件

每个库必须包含以下文件：

```
library-name/
├── package.json      # ✅ 必需 - npm包配置文件
├── block.json        # ✅ 必需 - Blockly块定义
├── generator.js      # ✅ 必需 - 代码生成器
├── toolbox.json      # ✅ 必需 - 工具箱配置
├── readme.md         # ✅ 建议 - 库说明文档
├── src.7z            # ✅ 建议 - Arduino源码压缩包
└── i18n/             # 🔸 可选 - 多语言支持
    ├── en.json
    ├── zh_cn.json
    └── zh_tw.json
```

### package.json 规范

```json
{
    "name": "@aily-project/lib-xxx",      // 必须以 @aily-project/lib- 开头
    "nickname": "库的中文名称",             // 显示在软件中的名称
    "author": "作者名",                    // 原作者或您的名称
    "description": "库的详细描述...",       // 清晰描述库的功能
    "version": "1.0.0",                   // 语义化版本号
    "compatibility": {
        "core": [                         // 兼容的核心类型
            "arduino:avr",
            "esp32:esp32"
        ],
        "voltage": [3.3, 5]               // 支持的电压
    },
    "keywords": [                         // 搜索关键词
        "aily",
        "blockly",
        "相关关键词..."
    ],
    "tested": false,                      // 是否经过测试
    "tester": ""                          // 测试者（如已测试）
}
```

### block.json 规范要点

- 每个block的 `type` 必须唯一，建议使用 `库名_功能名` 格式
- 正确设置 `previousStatement`、`nextStatement`、`output` 连接属性
- 使用统一的颜色标识同类型的block
- 使用 `${board.xxx}` 语法引用开发板配置

### generator.js 规范要点

```javascript
// ✅ 正确：将函数定义到Arduino对象中
Arduino.myFunction = function(value) {
    return 'ok';
};

// ❌ 错误：不要创建全局函数
function myFunction(value) {
    return 'ok';
}

// 使用提供的API添加附加代码
Arduino.forBlock['block_type'] = function(block, generator) {
    generator.addLibrary('tag', '#include <Library.h>');
    generator.addObject('tag', 'Object obj;');
    generator.addSetupBegin('tag', 'obj.begin();');
    return 'code';
};
```

### toolbox.json 规范要点

- 必须包含所有block的工具箱配置
- 合理设置影子块(shadow block)的默认值
- 保持工具箱结构清晰有序

### readme.md 规范要点

按照 [blockly库readme编写规范.md](./blockly库readme编写规范.md) 编写，需包含：
- 库基本信息
- 块定义表格
- 字段类型映射
- 连接规则说明
- 使用示例

---

## 📝 PR提交流程

### Step 1: 确认分支

```bash
# 确保您在正确的功能分支
git branch

# 同步上游仓库的最新代码
git remote add upstream https://github.com/ailyProject/aily-blockly-libraries.git
git fetch upstream
git rebase upstream/main
```

### Step 2: 本地验证

```bash
# 运行规范检测脚本
node validate-library-compliance.js 您的库名称

# 检测所有变更的库
node github-actions-validator.js --changed
```

**确保检测分数达到80分以上才能通过自动审核！**

### Step 3: 提交代码

```bash
# 添加变更
git add 您的库名称/

# 使用规范的提交信息
git commit -m "feat(库名): 添加XXX传感器库支持"

# 推送到您的Fork仓库
git push origin feature/新库名称
```

### Step 4: 创建Pull Request

1. 访问您的Fork仓库页面
2. 点击 "Compare & pull request"
3. 选择目标分支：`main` 或 `develop`
4. 填写PR标题和描述（见下方模板）
5. 提交PR

---

## 🔍 代码规范检测

### 自动检测

提交PR后，GitHub Actions会自动运行规范检测：

| 检测项目 | 满分 | 说明 |
|---------|------|------|
| 文件结构 | 10分 | 必需文件完整性 |
| package.json | 15分 | 项目配置规范 |
| block.json | 20分 | 块定义设计质量 |
| generator.js | 25分 | 代码生成实现 |
| toolbox.json | 10分 | 工具箱配置 |
| README文档 | 20分 | 文档完整性 |
| **总计** | **100分** | |

### 通过标准

| 等级 | 分数 | 状态 |
|------|------|------|
| 🟢 优秀 | 90-100分 | 可直接合并 |
| 🟡 良好 | 80-89分 | 可合并，建议优化 |
| 🔴 需改进 | <80分 | 需修复后重新提交 |

### 本地预检测

```bash
# 检测单个库
node validate-library-compliance.js DHT

# 检测多个库
node validate-library-compliance.js DHT FastLED servo

# 检测所有库
node validate-library-compliance.js --all

# GitHub Actions模式（检测git变更的库）
node github-actions-validator.js --changed
```

---

## 📌 提交信息规范

### 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type类型

| Type | 说明 |
|------|------|
| `feat` | 新增库或新功能 |
| `fix` | 修复bug |
| `docs` | 文档更新 |
| `style` | 代码格式调整（不影响功能） |
| `refactor` | 重构代码 |
| `test` | 添加测试 |
| `chore` | 构建过程或辅助工具变更 |

### 示例

```bash
# 新增库
git commit -m "feat(DHT): 添加DHT温湿度传感器库

- 支持DHT11/DHT22/DHT21/DHT20传感器
- 实现温度和湿度读取功能
- 添加I2C接口支持（DHT20）
- 包含多语言支持"

# 修复问题
git commit -m "fix(FastLED): 修复ESP32平台编译错误

修复在ESP32-S3平台上的引脚映射问题"

# 文档更新
git commit -m "docs(servo): 更新README添加使用示例"
```
 
---

## 📄 PR模板

请在创建PR时使用以下模板：

```markdown
## 📦 PR类型
<!-- 请勾选适用的选项 -->
- [ ] 🆕 新增库
- [ ] 🐛 Bug修复
- [ ] 📝 文档更新
- [ ] ♻️ 代码重构
- [ ] 🌐 多语言支持

## 📋 描述
<!-- 简要描述本次PR的内容 -->


## 🔗 关联库
<!-- 列出本次PR涉及的库 -->
- 库名称：
- 库版本：

## ✅ 自检清单
<!-- 请确认以下项目已完成 -->
- [ ] ⚠️ **本PR只涉及一个库的变更**（重要！）
- [ ] ⚠️ **Commit信息清晰且数量精简**
- [ ] 已阅读 [库规范.md](./库规范.md)
- [ ] 已运行 `node validate-library-compliance.js 库名称` 且分数>=80
- [ ] 库包含所有必需文件（package.json, block.json, generator.js, toolbox.json）
- [ ] package.json 中的 name 以 `@aily-project/lib-` 开头
- [ ] 已添加 readme.md 说明文档
- [ ] 已压缩Arduino源码为 src.7z（如适用）
- [ ] 已在本地测试库功能正常

## 📸 截图/演示
<!-- 如适用，添加块设计截图或演示GIF -->


## 🔧 测试环境
<!-- 列出您的测试环境 -->
- 开发板：
- Arduino核心版本：
- aily blockly版本：

## 📝 其他说明
<!-- 任何其他需要说明的内容 -->

```

---

## 👀 审核流程

### 审核步骤

1. **自动检测**：GitHub Actions运行规范检测
2. **PR格式检查**：确认PR只涉及单个库且commit清晰
3. **人工审核**：维护者审核代码质量和设计
4. **反馈修改**：根据审核意见进行修改
5. **合并发布**：通过审核后合并到主分支

### 审核重点

- ✅ **PR是否只涉及一个库**（重要！）
- ✅ **Commit是否清晰精简**
- ✅ 库结构是否完整规范
- ✅ block设计是否用户友好
- ✅ generator.js是否正确生成代码
- ✅ 是否遵循命名规范
- ✅ 文档是否清晰完整
- ✅ 是否存在安全问题

### 常见拒绝原因

| 原因 | 解决方法 |
|------|---------|
| PR修改了多个库 | 拆分为多个独立的PR |
| commit过多且杂乱 | 使用 `git rebase -i` 合并commit |
| 规范检测分数<80 | 按照检测报告修复问题 |
| 缺少必需文件 | 补充缺失的文件 |
| 命名不规范 | 修改package.json中的name字段 |

### 修改反馈

如果PR需要修改：

```bash
# 在原分支上继续修改
git checkout feature/新库名称

# 进行修改...

# 使用 --amend 避免产生多余的commit
git add .
git commit --amend -m "feat(库名): 添加XXX库（已修复审核意见）"

# 强制推送更新（因为修改了commit历史）
git push origin feature/新库名称 --force
```

---

## ❓ 常见问题

### Q: 为什么一个PR只能修改一个库？

这是为了保证代码审核和版本管理的清晰性：
- **便于审核**：审核者可以专注于单一库的变更
- **便于追踪**：如果出现问题可以快速定位到具体的PR
- **便于回滚**：可以独立撤销某个库的变更而不影响其他库
- **便于CI/CD**：自动检测可以针对单个库精确运行

### Q: 我想同时提交多个库怎么办？

请为每个库创建独立的分支和PR：
```bash
# 库1
git checkout -b feature/lib-a && git add lib-a/ && git commit -m "feat(lib-a): ..." && git push origin feature/lib-a
# 库2
git checkout main && git checkout -b feature/lib-b && git add lib-b/ && git commit -m "feat(lib-b): ..." && git push origin feature/lib-b
```

### Q: 规范检测分数不够80分怎么办？

查看检测报告中的具体问题和修复建议，按照建议逐一修复。常见问题包括：
- 缺少必需文件
- package.json 格式不正确
- block.json 中的type不唯一
- generator.js 使用了全局函数
- 缺少README文档

### Q: 如何测试我开发的库？

参考 [库开发.md](./库开发.md)：
1. 打开aily blockly的开发者模式
2. 使用 `npm i 库路径` 安装库到项目
3. 点击刷新按钮重新加载库
4. 在blockly工作区测试库功能

### Q: 是否需要提供多语言支持？

建议但非必需。如果您能提供多语言支持会更好，至少应支持：
- 简体中文 (zh_cn.json)
- 英文 (en.json)

### Q: 如何命名我的库？

- **目录名**：使用小写字母和下划线，如 `my_sensor`
- **package.json中的name**：必须以 `@aily-project/lib-` 开头，如 `@aily-project/lib-my-sensor`
- **nickname**：使用清晰的中文名称，如 "我的传感器库"

### Q: PR被拒绝了怎么办？

1. 仔细阅读拒绝原因和审核意见
2. 根据意见修改代码
3. 更新PR或创建新PR
4. 如有疑问，可在PR评论中讨论

### Q: 如何贡献对现有库的改进？

1. Fork仓库并创建分支
2. 修改现有库文件
3. 更新版本号（package.json中的version）
4. 运行规范检测确保通过
5. 提交PR并说明改进内容

---

## 📞 联系方式

- **GitHub Issues**：[提交Issue](https://github.com/ailyProject/aily-blockly-libraries/issues)
- **项目维护者**：奈何col

---

## 📜 许可证

本项目采用 MIT 许可证。提交PR即表示您同意您的贡献将采用相同的许可证。

---

感谢您的贡献！🎉
