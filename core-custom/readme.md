# Custom code

Supplementary tools to the standard Blockly library: advanced functions such as code insertion, macro definition, conditional compilation, function definition, pointer manipulation, etc.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-core-custom |
| Version | 1.1.1 |
| Author | ailyProject |
| Source | N/A |
| License | Original license |

## Supported Boards

Arduino-compatible boards supported by this package.

## Description

Insert C++ statements, expressions, and global declarations.

## Quick Start

1. Enable `@aily-project/lib-core-custom` in Aily Blockly.
2. Add the library blocks, initialize hardware in `arduino_setup()`, then use read/write blocks in `arduino_loop()`.

Stack macros, includes, and code insertion blocks inside **Global declarations**
to move them together. Each declaration keeps its selected global code region.
Standalone declarations remain supported.
