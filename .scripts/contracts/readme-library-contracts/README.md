# README library contracts

This directory contains repository-maintenance data used by README generation
and CI. These files are intentionally outside individual Blockly library
folders so they are not included when a user downloads a library.

Each optional `<library>.json` file describes only runtime facts that static
`block.json` cannot express, such as extension/mutator variants, JavaScript-
defined public blocks, compatibility-only inputs, and Agent visibility.

Rules:

- the filename must exactly match the top-level library directory, including case;
- library code and Agents must not depend on this file at runtime;
- all README generation and validation code must load contracts
  through `.scripts/readme-library-contracts.js`;
- `readme_ai.contract.json` must not be placed inside a library directory.
