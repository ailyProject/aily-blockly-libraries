# SparkFun WiseChip HUD 抬头显示器

## Library Info
- **Name**: @aily-project/lib-sparkfun-wisechip-hud
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `wisechip_hud_init` | Statement | VAR(field_input) | `wisechip_hud_init("hud")` | `WiseChipHUD hud; hud.begin();` |
| `wisechip_hud_icon_level` | Statement | VAR(field_variable), ICON(value), LEVEL(value) | `wisechip_hud_icon_level(variables_get($hud), 1, 50)` | `hud.AdjustIconLevel(1, 50);` |
| `wisechip_hud_nav` | Statement | VAR(field_variable), CMD(dropdown) | `wisechip_hud_nav(variables_get($hud), nav_TurnLeft)` | `hud.nav_TurnLeft(1);` |
| `wisechip_hud_compass` | Statement | VAR(field_variable), TYPE(dropdown), SELECT(value) | `wisechip_hud_compass(variables_get($hud), compassCircle, 3)` | `hud.compassCircle(3);` |
