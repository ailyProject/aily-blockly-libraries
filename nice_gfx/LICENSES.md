# Source and license notices

This Blockly integration bundles the user's local NICE_GFX 1.0.0 source snapshot.
The upstream URL is https://github.com/ailyProject/nice-gfx.

`src.7z` extracts to `src/NICE_GFX/`, preserving the upstream library metadata,
source files and all notices distributed under `src/` and `LICENSES/`.

The upstream `LICENSES/README.md` states that project metadata declares MIT,
but this checkout has no standalone top-level license for the project's own
code. This integration does not supply or invent that missing license.
Consult the upstream maintainer for that text when preparing a redistribution.

Existing bundled notices include:

- Graphics: `src/NICE_GFX/src/Graphics/LICENSE-Bodmer.txt`.
- Font Awesome: `src/NICE_GFX/src/Graphics/LICENSE-Font-Awesome.txt`.
- Keyboard icons: `src/NICE_GFX/src/UI/LICENSE-Keyboard-Font-Awesome-6.txt`.
- Fonts: all notices in `src/NICE_GFX/src/Fonts/licenses/`.
- Additional driver notices remain alongside their source files.

Hardware examples and their external application dependencies are not part of
the archive. The source fingerprint and archive digest are recorded in
`source-manifest.json`.
