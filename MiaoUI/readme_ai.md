# MiaoUI OLED Menu

Animated monochrome OLED menu UI based on U8g2.

## Library Info
- **Name**: @aily-project/lib-miaoui
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `miaoui_init` | Statement | VAR(field_input), DISPLAY(field_input), FIRST_ITEM(field_variable), INIT_DISPLAY(field_checkbox), MENU(input_statement), PARAMETERS(input_statement), TEXTS(i... | `miaoui_init("menu", "u8g2", variables_get($mainHeader), TRUE) @MENU: child_block() @PARAMETERS: child_block() @TEXTS: child_block()` | (void) |
| `miaoui_add_page` | Statement | PAGE(field_input), TITLE(field_input), TYPE(dropdown) | `miaoui_add_page("mainPage", "[Main]", UI_PAGE_TEXT)` | AddPage( |
| `miaoui_add_item` | Statement | ITEM(field_input), LABEL(field_input), PAGE(field_variable), TYPE(dropdown), IMAGE(field_input) | `miaoui_add_item("mainHeader", "[Main]", variables_get($mainPage), UI_ITEM_ONCE_FUNCTION, "nullptr")` | Dynamic code |
| `miaoui_add_navigation_item` | Statement | ITEM(field_input), LABEL(field_input), PAGE(field_variable), TYPE(dropdown), TARGET_PAGE(field_variable), IMAGE(field_input) | `miaoui_add_navigation_item("settingsItem", "Settings", variables_get($mainPage), UI_ITEM_PARENTS, variables_get($settingsPage), "nullptr")` | Dynamic code |
| `miaoui_add_action_item` | Statement | ITEM(field_input), LABEL(field_input), PAGE(field_variable), TYPE(dropdown), IMAGE(field_input), DO(input_statement) | `miaoui_add_action_item("actionItem", "Action", variables_get($mainPage), UI_ITEM_ONCE_FUNCTION, "nullptr") @DO: child_block()` | Dynamic code |
| `miaoui_bind_number` | Statement | ITEM(field_variable), DATA_VAR(field_input), DATA_TYPE(dropdown), ACCESS(dropdown), INITIAL(input_value), MIN(input_value), MAX(input_value), STEP(input_valu... | `miaoui_bind_number(variables_get($valueItem), "menuValue", INT, UI_DATA_ACTION_RW, math_number(0), math_number(0), math_number(0), math_number(0), NONE) @DO: child_block()` | Dynamic code |
| `miaoui_bind_switch` | Statement | ITEM(field_variable), DATA_VAR(field_input), INITIAL(input_value), ACCESS(dropdown), CALLBACK_MODE(dropdown), DO(input_statement) | `miaoui_bind_switch(variables_get($switchItem), "menuSwitch", logic_boolean(TRUE), UI_DATA_ACTION_RW, NONE) @DO: child_block()` | Dynamic code |
| `miaoui_bind_text` | Statement | ITEM(field_variable), TEXT(field_multilinetext) | `miaoui_bind_text(variables_get($aboutItem))` | Dynamic code |
| `miaoui_set_buttons` | Statement | VAR(field_variable), UP_PIN(input_value), DOWN_PIN(input_value), ENTER_PIN(input_value), ACTIVE_LEVEL(dropdown), PIN_MODE(dropdown) | `miaoui_set_buttons(variables_get($menu), math_number(2), math_number(2), math_number(2), Low, INPUT_PULLUP)` | Dynamic code |
| `miaoui_set_debounce` | Statement | VAR(field_variable), MILLISECONDS(input_value) | `miaoui_set_debounce(variables_get($menu), math_number(0))` | Dynamic code |
| `miaoui_set_button_repeat` | Statement | VAR(field_variable), DELAY(input_value), INTERVAL(input_value) | `miaoui_set_button_repeat(variables_get($menu), math_number(1000), math_number(1000))` | Dynamic code |
| `miaoui_push_action` | Statement | VAR(field_variable), ACTION(dropdown) | `miaoui_push_action(variables_get($menu), UI_ACTION_UP)` | (void) |
| `miaoui_try_push_action` | Value | VAR(field_variable), ACTION(dropdown) | `miaoui_try_push_action(variables_get($menu), UI_ACTION_UP)` | Dynamic code |
| `miaoui_update` | Statement | VAR(field_variable) | `miaoui_update(variables_get($menu))` | Dynamic code |
| `miaoui_set_background` | Statement | VAR(field_variable), INVERTED(input_value) | `miaoui_set_background(variables_get($menu), logic_boolean(TRUE))` | Dynamic code |
| `miaoui_is_begun` | Value | VAR(field_variable) | `miaoui_is_begun(variables_get($menu))` | Dynamic code |
| `miaoui_last_error_code` | Value | VAR(field_variable) | `miaoui_last_error_code(variables_get($menu))` | static_cast<uint8_t>( |
| `miaoui_last_error_message` | Value | VAR(field_variable) | `miaoui_last_error_message(variables_get($menu))` | Dynamic code |
| `miaoui_current_item_name` | Value | VAR(field_variable) | `miaoui_current_item_name(variables_get($menu))` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | UI_PAGE_TEXT, UI_PAGE_ICON | miaoui_add_page |
| TYPE | UI_ITEM_ONCE_FUNCTION, UI_ITEM_DATA, UI_ITEM_WORD, UI_ITEM_WAVE | miaoui_add_item |
| TYPE | UI_ITEM_PARENTS, UI_ITEM_RETURN | miaoui_add_navigation_item |
| TYPE | UI_ITEM_ONCE_FUNCTION, UI_ITEM_LOOP_FUNCTION | miaoui_add_action_item |
| DATA_TYPE | INT, FLOAT | miaoui_bind_number |
| ACCESS | UI_DATA_ACTION_RW, UI_DATA_ACTION_RO | miaoui_bind_number, miaoui_bind_switch |
| CALLBACK_MODE | NONE, UI_DATA_FUNCTION_STEP_EXECUTE, UI_DATA_FUNCTION_EXIT_EXECUTE | miaoui_bind_number, miaoui_bind_switch |
| ACTIVE_LEVEL | Low, High | miaoui_set_buttons |
| PIN_MODE | INPUT_PULLUP, INPUT | miaoui_set_buttons |
| ACTION | UI_ACTION_UP, UI_ACTION_DOWN, UI_ACTION_ENTER | miaoui_push_action, miaoui_try_push_action |

## ABS Examples

### Basic Usage
```
arduino_setup()
    u8g2_begin(... full-buffer 128x64 display ...)
    miaoui_set_buttons(variables_get($menu), math_number(3), math_number(18), math_number(8), Low, INPUT_PULLUP)
    miaoui_init("menu", "u8g2", variables_get($mainHeader), FALSE)
        @MENU:
            miaoui_add_page("mainPage", "[Main]", UI_PAGE_TEXT)
            miaoui_add_item("mainHeader", "[Main]", variables_get($mainPage), UI_ITEM_ONCE_FUNCTION, "nullptr")
            miaoui_add_item("valueItem", " Value", variables_get($mainPage), UI_ITEM_DATA, "nullptr")
            miaoui_add_item("aboutItem", " About", variables_get($mainPage), UI_ITEM_WORD, "nullptr")
        @PARAMETERS:
            miaoui_bind_number(variables_get($valueItem), "menuValue", INT, UI_DATA_ACTION_RW, math_number(50), math_number(0), math_number(100), math_number(5), NONE)
        @TEXTS:
            miaoui_bind_text(variables_get($aboutItem))
```

The exact `u8g2_begin` arguments depend on the selected display controller and
bus. MiaoUI requires the U8g2 full-buffer mode and a 128x64 resolution.

## Generation Model

1. `miaoui_init` declares `MiaoUI <VAR>(<DISPLAY>)` globally.
2. Blocks nested under `MENU`, `PARAMETERS`, and `TEXTS` generate the strong
   `Create_MenuTree`, `Create_Parameter`, and `Create_Text` hooks expected by
   the upstream library.
3. Page, item, data, text, and element structures are emitted at global scope so
   their lifetime covers the entire sketch.
4. Action bodies and data-change bodies become `static void callback(ui_t*)`
   functions. Empty or disabled data callbacks use `nullptr`.
5. `<VAR>.update()` is added to the beginning of `loop()` automatically.
6. Initialization, page, item, and backing-data names are registered with
   Blockly and follow variable renames. Generated C identifiers are sanitized.

## Notes

1. **Variable**: `miaoui_init("varName", ...)` creates variable `$varName`; reference it later with `variables_get($varName)`.
2. **Parameter order**: ABS parameters follow `block.json` args order.
3. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
4. Create every page before adding items that reference it. Item order inside
   `MENU` is the visual order on its page.
5. `UI_ITEM_DATA`, `UI_ITEM_WAVE`, and `UI_ITEM_WORD` require matching number,
   switch, or text bindings. Wave data must be integer/float with `MAX > MIN`.
6. `UI_PAGE_ICON` uses fixed 30x30 XBM images. Set the image expression to a
   global byte-array identifier; `nullptr` selects the upstream fallback image.
7. When the U8g2 initialization block already calls `u8g2.begin()`, set
   `INIT_DISPLAY` to `FALSE` to avoid initializing the display twice.
8. MiaoUI's C engine and hook names are global; only one active `miaoui_init`
   block is supported per sketch.
9. `miaoui_try_push_action` returns `false` for an invalid action or a full
   eight-entry queue; the statement variant intentionally discards the result.
10. Error codes are `0=None`, `1=NullFirstItem`, `2=InvalidMenuTree`, and
    `3=DisplaySizeMismatch`.
