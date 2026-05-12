[中文](./readme_zh.md)

# aily blockly Libraries

This repository contains Blockly libraries for the [aily blockly](https://github.com/ailyProject/aily-blockly) visual programming platform, providing extensive hardware and functionality extensions.

## Features

- 🧩 **Rich Ecosystem** - 300+ libraries
- 🌍 **Multilingual** - Internationalization support for 11 languages
- 🤖 **AI-Friendly** - README_AI.md for LLM understanding and usage
- 🔧 **Compliance Checking** - Built-in GitHub Actions for library validation

## Quick Start

### Install a Library

In your aily blockly project terminal:

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