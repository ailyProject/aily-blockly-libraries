[English](#english) | [中文](#中文)

---

<a name="中文"></a>
# Aily Blockly 库合集

本仓库收集存放 Aily Blockly 库，为 [Aily Blockly](https://github.com/ailyProject/aily-blockly) 图形化编程平台提供丰富的硬件和功能扩展支持。

## 特性

- 🧩 **丰富的库生态** - 支持 100+ Arduino/ESP32 硬件库
- 🌍 **多语言支持** - 支持 11 种语言的国际化
- 🤖 **AI 友好** - 提供 README_AI.md 供大模型理解和使用
- 🔧 **规范检测** - 内置 GitHub Actions 自动检测库规范合规性

## 快速开始

### 安装库

在 Aily Blockly 项目中使用终端安装：

```bash
npm i @aily-project/lib-库名称
```

### 开发库

1. Fork 本仓库
2. 按照库结构创建新库
3. 提交 Pull Request

## 库结构

```
library-name/
├── block.json        # 积木块定义
├── generator.js      # Arduino 代码生成器
├── toolbox.json      # 工具箱配置
├── package.json      # npm 包配置
├── readme.md         # 用户说明文档
├── readme_ai.md      # AI 使用说明（可选）
├── src.7z            # Arduino 库源码（7z 压缩）
└── i18n/             # 多语言支持
    ├── zh_cn.json
    ├── en.json
    └── ...
```

## 文档

| 文档 | 说明 |
|------|------|
| [库编写规范](./.docs/库规范.md) | Blockly 库开发规范详解 |
| [库开发指南](./.docs/库开发.md) | 开发调试与提交流程 |
| [多语言支持](./.docs_ai/en/Blockly_Library_i18n_Conventions.md) | 国际化配置说明 |
| [PR 提交指南](./.docs/CONTRIBUTING.md) | 贡献代码规范 |
| [私有部署](./.docs/库管理.md) | 私有 npm 仓库搭建 |
| [库可用性测试](./.docs/test-table.md) | 各库测试状态 |
| [计划新增库](./.docs/todo.md) | 待开发库列表 |

### 开发者规范

| 文档 | 说明 |
|------|------|
| [Blockly 库代码规范](./.docs_ai/en/Blockly_Library_CODE_Conventions.md) | Blockly 库代码规范 |
| [Blockly 库 README 规范](./.docs_ai/en/Blockly_Library_README_Conventions.md) | README 文档规范 |
| [多语言文件规范](./.docs_ai/en/Blockly_Library_i18n_Conventions.md) | i18n 详细规范 |

## 贡献

欢迎贡献新库或改进现有库！

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/my-new-lib`
3. 提交更改：`git commit -m 'feat: add my-new-lib'`
4. 推送分支：`git push origin feature/my-new-lib`
5. 提交 Pull Request

详见 [PR 提交指南](./CONTRIBUTING.md)

## 许可证

各库遵循其原始开源协议，详见各库目录下的说明文件。

---

<a name="english"></a>
# Aily Blockly Libraries

This repository contains Blockly libraries for the [Aily Blockly](https://github.com/ailyProject/aily-blockly) visual programming platform, providing extensive hardware and functionality extensions.

## Features

- 🧩 **Rich Ecosystem** - 100+ Arduino/ESP32 hardware libraries
- 🌍 **Multilingual** - Internationalization support for 11 languages
- 🤖 **AI-Friendly** - README_AI.md for LLM understanding and usage
- 🔧 **Compliance Checking** - Built-in GitHub Actions for library validation

## Quick Start

### Install a Library

In your Aily Blockly project terminal:

```bash
npm i @aily-project/lib-library-name
```

### Develop a Library

1. Fork this repository
2. Create a new library following the structure
3. Submit a Pull Request

## Library Structure

```
library-name/
├── block.json        # Block definitions
├── generator.js      # Arduino code generator
├── toolbox.json      # Toolbox configuration
├── package.json      # npm package config
├── readme.md         # User documentation
├── readme_ai.md      # AI documentation (optional)
├── src.7z            # Arduino library source (7z compressed)
└── i18n/             # Internationalization
    ├── zh_cn.json
    ├── en.json
    └── ...
```

## Documentation

| Document | Description |
|----------|-------------|
| [Library Standards](./.docs/库规范.md) | Blockly library development standards |
| [Development Guide](./.docs/库开发.md) | Development, debugging and submission |
| [Internationalization](./.docs_ai/en/Blockly_Library_i18n_Conventions.md) | i18n configuration guide |
| [Contributing Guide](./.docs/CONTRIBUTING.md) | Contribution guidelines |
| [Private Deployment](./.docs/库管理.md) | Private npm registry setup |
| [Test Status](./.docs/test-table.md) | Library test status |
| [Roadmap](./.docs/todo.md) | Planned libraries |

### Developer References

| Document | Description |
|----------|-------------|
| [Blockly Library Code Conventions](./.docs_ai/en/Blockly_Library_CODE_Conventions.md) | Code conventions for Blockly libraries |
| [Blockly Library README Standards](./.docs_ai/en/Blockly_Library_README_Conventions.md) | README documentation standards |
| [i18n File Standards](./.docs_ai/en/Blockly_Library_i18n_Conventions.md) | Detailed i18n spec |

## Contributing

Contributions are welcome!

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/my-new-lib`
3. Commit changes: `git commit -m 'feat: add my-new-lib'`
4. Push to branch: `git push origin feature/my-new-lib`
5. Submit a Pull Request

See [Contributing Guide](./CONTRIBUTING.md) for details.

## License

Each library follows its original open-source license. See the documentation in each library directory.  