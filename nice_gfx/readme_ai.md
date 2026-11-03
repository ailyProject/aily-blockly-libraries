# NICE_GFX

Drawing and text / Sprite buffers / Touch input / Designer UI

## Library Info
- **Name**: @aily-project/lib-nice-gfx
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `nice_gfx_init_spi` | Statement | VAR(field_input), DRIVER(dropdown), BUS(dropdown), CS(dropdown), DC(dropdown), RST(field_input), SCK(dropdown), MOSI(dropdown), MISO(field_input), HZ(input_value), ROTATION(dropdown) | `nice_gfx_init_spi("gfx", ILI9341_240x320, SPI, CS, DC, "-1", SCK, MOSI, "-1", math_number(0), 0)` | `#include <NICE_GFX.h> ↵ ILI9341_240x320_SPI gfx(CS, DC, -1, SCK, MOSI, -1, 0); ↵ gfx.begin(); ↵ gfx.setRotation(0);` |
| `nice_gfx_init_qspi` | Statement | VAR(field_input), DRIVER(dropdown), CS(dropdown), RST(field_input), SCK(dropdown), D0(dropdown), D1(dropdown), D2(dropdown), D3(dropdown), HZ(input_value) | `nice_gfx_init_qspi("gfx", nice_gfx::CH13613_480x480_QSPI, CS, "-1", SCK, D0, D1, D2, D3, math_number(0))` | `#include <NICE_GFX.h> ↵ nice_gfx::CH13613_480x480_QSPI gfx(CS, -1, SCK, D0, D1, D2, D3, 0); ↵ gfx.begin();` |
| `nice_gfx_init_i2c` | Statement | VAR(field_input), DRIVER(dropdown), WIRE(dropdown), ADDRESS(input_value), RST(field_input), ROTATION(dropdown), SDA(field_input), SCL(field_input), HZ(input_value) | `nice_gfx_init_i2c("gfx", SSD1306_128x64_I2C, WIRE, math_number(0), "-1", 0, "-1", "-1", math_number(0))` | `#include <NICE_GFX.h> ↵ #include <Platform/Arduino/I2cWire.h> ↵ nice_gfx::I2cWire gfx_i2c(WIRE); ↵ SSD1306_128x64_I2C gfx(gfx_i2c, 0, -1); ↵ WIRE.begin(); ↵ WIRE.setClock(0); ↵ gfx.begin(); ↵ gfx.setRotation(0);` |
| `nice_gfx_init_board` | Statement | VAR(field_input), BOARD(dropdown) | `nice_gfx_init_board("gfx", CustomSpi)` | `#include <NICE_GFX.h> ↵ nice_gfx::BoardDisplay<nice_gfx::BoardPresetId::CustomSpi> gfx; ↵ gfx.begin();` |
| `nice_gfx_fill` | Statement | VAR(field_variable), COLOR(input_value) | `nice_gfx_fill($gfx, math_number(0))` | `#include <NICE_GFX.h> ↵ gfx.fillScreen(0);` |
| `nice_gfx_pixel` | Statement | VAR(field_variable), X(input_value), Y(input_value), COLOR(input_value) | `nice_gfx_pixel($gfx, math_number(0), math_number(0), math_number(0))` | `#include <NICE_GFX.h> ↵ gfx.drawPixel(0, 0, 0);` |
| `nice_gfx_line` | Statement | VAR(field_variable), X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), COLOR(input_value) | `nice_gfx_line($gfx, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `#include <NICE_GFX.h> ↵ gfx.drawLine(0, 0, 0, 0, 0);` |
| `nice_gfx_rect` | Statement | VAR(field_variable), MODE(dropdown), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR(input_value) | `nice_gfx_rect($gfx, drawRect, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `#include <NICE_GFX.h> ↵ gfx.drawRect(0, 0, 0, 0, 0);` |
| `nice_gfx_round_rect` | Statement | VAR(field_variable), MODE(dropdown), X(input_value), Y(input_value), W(input_value), H(input_value), R(input_value), COLOR(input_value) | `nice_gfx_round_rect($gfx, drawRoundRect, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `#include <NICE_GFX.h> ↵ gfx.drawRoundRect(0, 0, 0, 0, 0, 0);` |
| `nice_gfx_circle` | Statement | VAR(field_variable), MODE(dropdown), X(input_value), Y(input_value), R(input_value), COLOR(input_value) | `nice_gfx_circle($gfx, drawCircle, math_number(0), math_number(0), math_number(0), math_number(0))` | `#include <NICE_GFX.h> ↵ gfx.drawCircle(0, 0, 0, 0);` |
| `nice_gfx_ellipse` | Statement | VAR(field_variable), MODE(dropdown), X(input_value), Y(input_value), RX(input_value), RY(input_value), COLOR(input_value) | `nice_gfx_ellipse($gfx, drawEllipse, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `#include <NICE_GFX.h> ↵ gfx.drawEllipse(0, 0, 0, 0, 0);` |
| `nice_gfx_triangle` | Statement | VAR(field_variable), MODE(dropdown), X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), X2(input_value), Y2(input_value), COLOR(input_value) | `nice_gfx_triangle($gfx, drawTriangle, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `#include <NICE_GFX.h> ↵ gfx.drawTriangle(0, 0, 0, 0, 0, 0, 0);` |
| `nice_gfx_gradient` | Statement | VAR(field_variable), MODE(dropdown), X(input_value), Y(input_value), W(input_value), H(input_value), COLOR1(input_value), COLOR2(input_value) | `nice_gfx_gradient($gfx, fillRectVGradient, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `#include <NICE_GFX.h> ↵ gfx.fillRectVGradient(0, 0, 0, 0, 0, 0);` |
| `nice_gfx_arc` | Statement | VAR(field_variable), X(input_value), Y(input_value), R(input_value), IR(input_value), START(input_value), END(input_value), COLOR(input_value), BG(input_value) | `nice_gfx_arc($gfx, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `#include <NICE_GFX.h> ↵ gfx.drawSmoothArc(0, 0, 0, 0, 0, 0, 0, 0);` |
| `nice_gfx_wide_line` | Statement | VAR(field_variable), X0(input_value), Y0(input_value), X1(input_value), Y1(input_value), W(input_value), COLOR(input_value), BG(input_value) | `nice_gfx_wide_line($gfx, math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0), math_number(0))` | `#include <NICE_GFX.h> ↵ gfx.drawWideLine(0, 0, 0, 0, 0, 0, 0);` |
| `nice_gfx_font` | Statement | VAR(field_variable), FONT(dropdown) | `nice_gfx_font($gfx, Fixed6x13)` | `#include <NICE_GFX.h> ↵ gfx.setFont(nice_gfx::fonts::Fixed6x13);` |
| `nice_gfx_text_style` | Statement | VAR(field_variable), COLOR(input_value), BG(input_value), SIZE(input_value), WRAP(field_checkbox) | `nice_gfx_text_style($gfx, math_number(0), math_number(0), math_number(0), TRUE)` | `#include <NICE_GFX.h> ↵ gfx.setTextColor(0, 0); ↵ gfx.setTextSize(0); ↵ gfx.setTextWrap(true);` |
| `nice_gfx_text` | Statement | VAR(field_variable), TEXT(input_value), X(input_value), Y(input_value) | `nice_gfx_text($gfx, text("value"), math_number(0), math_number(0))` | `#include <NICE_GFX.h> ↵ gfx.drawString(String("value").c_str(), 0, 0);` |
| `nice_gfx_cursor_print` | Statement | VAR(field_variable), X(input_value), Y(input_value), MODE(dropdown), TEXT(input_value) | `nice_gfx_cursor_print($gfx, math_number(0), math_number(0), print, text("value"))` | `#include <NICE_GFX.h> ↵ gfx.setCursor(0, 0); ↵ gfx.print("value");` |
| `nice_gfx_rotation` | Statement | VAR(field_variable), ROTATION(input_value) | `nice_gfx_rotation($gfx, math_number(0))` | `#include <NICE_GFX.h> ↵ gfx.setRotation(0);` |
| `nice_gfx_invert` | Statement | VAR(field_variable), INVERT(input_value) | `nice_gfx_invert($gfx, logic_boolean(true))` | `#include <NICE_GFX.h> ↵ gfx.invertDisplay(true);` |
| `nice_gfx_viewport` | Statement | VAR(field_variable), X(input_value), Y(input_value), W(input_value), H(input_value) | `nice_gfx_viewport($gfx, math_number(0), math_number(0), math_number(0), math_number(0))` | `#include <NICE_GFX.h> ↵ gfx.setViewport(0, 0, 0, 0);` |
| `nice_gfx_action` | Statement | VAR(field_variable), ACTION(dropdown) | `nice_gfx_action($gfx, wait)` | `#include <NICE_GFX.h> ↵ gfx.wait();` |
| `nice_gfx_dimension` | Value | VAR(field_variable), DIM(dropdown) | `nice_gfx_dimension($gfx, width)` | `#include <NICE_GFX.h> ↵ gfx.width()` |
| `nice_gfx_status` | Value | VAR(field_variable) | `nice_gfx_status($gfx)` | `#include <NICE_GFX.h> ↵ static_cast<int>(gfx.lastError())` |
| `nice_gfx_color` | Value | COLOR(dropdown) | `nice_gfx_color("0xFFFF")` | `0xFFFF` |
| `nice_gfx_rgb565` | Value | R(input_value), G(input_value), B(input_value) | `nice_gfx_rgb565(math_number(0), math_number(0), math_number(0))` | `uint16_t ailyNiceGfxColor565(uint8_t r, uint8_t g, uint8_t b) { ↵   return uint16_t(((r & 0xF8) << 8) &#124; ((g & 0xFC) << 3) &#124; (b >> 3)); ↵ } ↵ ailyNiceGfxColor565(0, 0, 0)` |
| `nice_gfx_sprite_create` | Statement | VAR(field_input), DISPLAY(field_variable), W(input_value), H(input_value), DEPTH(dropdown) | `nice_gfx_sprite_create("sprite", $gfx, math_number(0), math_number(0), 16)` | `#include <NICE_GFX.h> ↵ GFX_Sprite sprite(&gfx); ↵ sprite.setColorDepth(16); ↵ sprite.createSprite(0, 0);` |
| `nice_gfx_sprite_push` | Statement | VAR(field_variable), X(input_value), Y(input_value) | `nice_gfx_sprite_push($sprite, math_number(0), math_number(0))` | `#include <NICE_GFX.h> ↵ sprite.pushSprite(0, 0);` |
| `nice_gfx_sprite_transparent` | Statement | VAR(field_variable), X(input_value), Y(input_value), COLOR(input_value) | `nice_gfx_sprite_transparent($sprite, math_number(0), math_number(0), math_number(0))` | `#include <NICE_GFX.h> ↵ sprite.pushSprite(0, 0, 0);` |
| `nice_gfx_sprite_delete` | Statement | VAR(field_variable) | `nice_gfx_sprite_delete($sprite)` | `#include <NICE_GFX.h> ↵ sprite.deleteSprite();` |
| `nice_gfx_sprite_ready` | Value | VAR(field_variable) | `nice_gfx_sprite_ready($sprite)` | `#include <NICE_GFX.h> ↵ sprite.created()` |
| `nice_gfx_touch_i2c` | Statement | VAR(field_variable), DRIVER(dropdown), WIRE(dropdown), ADDRESS(input_value), RST(field_input), IRQ(field_input), W(input_value), H(input_value) | `nice_gfx_touch_i2c($gfx, Cst816, WIRE, math_number(0), "-1", "-1", math_number(0), math_number(0))` | `#include <NICE_GFX.h> ↵ #include <Platform/Arduino/TouchWire.h> ↵ nice_gfx::TouchWire gfx_touch_bus(WIRE, -1, -1); ↵ nice_gfx::Cst816 gfx_touch(gfx_touch_bus, 0, 0, 0); ↵ WIRE.begin(); ↵ gfx_touch.begin(); ↵ gfx.attachTouch(gfx_touch);` |
| `nice_gfx_touch_xpt2046` | Statement | VAR(field_variable), CS(dropdown), SCK(dropdown), MOSI(dropdown), MISO(dropdown), IRQ(field_input) | `nice_gfx_touch_xpt2046($gfx, CS, SCK, MOSI, MISO, "-1")` | `#include <NICE_GFX.h> ↵ #include <Platform/Arduino/TouchSpi.h> ↵ nice_gfx::TouchSoftwareSpi gfx_touch_bus(nice_gfx::TouchPins(SCK, MOSI, MISO, CS, -1)); ↵ nice_gfx::Xpt2046 gfx_touch(gfx_touch_bus); ↵ gfx_touch.begin(); ↵ gfx.attachTouch(gfx_touch);` |
| `nice_gfx_touch_read` | Value | VAR(field_variable) | `nice_gfx_touch_read($gfx)` | `#include <NICE_GFX.h> ↵ uint16_t gfx_touch_x = 0, gfx_touch_y = 0; ↵ gfx.getTouch(&gfx_touch_x, &gfx_touch_y)` |
| `nice_gfx_touch_coordinate` | Value | VAR(field_variable), AXIS(dropdown) | `nice_gfx_touch_coordinate($gfx, x)` | `uint16_t gfx_touch_x = 0, gfx_touch_y = 0; ↵ gfx_touch_x` |
| `nice_gfx_touch_calibrate` | Statement | VAR(field_variable), COLOR(input_value), BG(input_value) | `nice_gfx_touch_calibrate($gfx, math_number(0), math_number(0))` | `#include <NICE_GFX.h> ↵ uint16_t gfx_touch_cal[5] = {0}; ↵ gfx.calibrateTouchChecked(gfx_touch_cal, 0, 0);` |
| `nice_gfx_ui_init` | Statement | VAR(field_input), DISPLAY(field_variable), HEADER(field_input), TILE(input_value) | `nice_gfx_ui_init("ui", $gfx, "ui.h", math_number(0))` | `#include <NICE_GFX.h> ↵ #include <UI/View.h> ↵ #include "ui.h" ↵ nice_gfx::htmlui::View ui(gfx, 0); ↵ bool ui_ready = false; ↵ if (ui_ready) ui.tick(millis()); ↵ ui_ready = (ui_config::load(ui) == nice_gfx::Status::Ok);` |
| `nice_gfx_ui_text` | Statement | VAR(field_variable), ID(input_value), TEXT(input_value) | `nice_gfx_ui_text($ui, text("value"), text("value"))` | `#include <NICE_GFX.h> ↵ #include <UI/View.h> ↵ ui.setText(ui_config::id(String("value").c_str()), String("value").c_str());` |
| `nice_gfx_ui_value` | Statement | VAR(field_variable), ID(input_value), VALUE(input_value) | `nice_gfx_ui_value($ui, text("value"), math_number(0))` | `#include <NICE_GFX.h> ↵ #include <UI/View.h> ↵ ui.setValue(ui_config::id(String("value").c_str()), 0);` |
| `nice_gfx_ui_get_value` | Value | VAR(field_variable), ID(input_value) | `nice_gfx_ui_get_value($ui, text("value"))` | `#include <NICE_GFX.h> ↵ #include <UI/View.h> ↵ ui.value(ui_config::id(String("value").c_str()))` |
| `nice_gfx_ui_get_text` | Value | VAR(field_variable), ID(input_value) | `nice_gfx_ui_get_text($ui, text("value"))` | `#include <NICE_GFX.h> ↵ #include <UI/View.h> ↵ String(ui.text(ui_config::id(String("value").c_str())))` |
| `nice_gfx_ui_state` | Statement | VAR(field_variable), MODE(dropdown), ID(input_value), STATE(input_value) | `nice_gfx_ui_state($ui, setVisible, text("value"), logic_boolean(true))` | `#include <NICE_GFX.h> ↵ #include <UI/View.h> ↵ ui.setVisible(ui_config::id(String("value").c_str()), true);` |
| `nice_gfx_ui_navigate` | Statement | VAR(field_variable), MODE(dropdown), PATH(input_value) | `nice_gfx_ui_navigate($ui, push, text("value"))` | `#include <NICE_GFX.h> ↵ #include <UI/View.h> ↵ ui.push(String("value").c_str());` |
| `nice_gfx_ui_action` | Statement | VAR(field_variable), ACTION(dropdown) | `nice_gfx_ui_action($ui, back)` | `#include <NICE_GFX.h> ↵ #include <UI/View.h> ↵ ui.back();` |
| `nice_gfx_ui_chart` | Statement | VAR(field_variable), ID(input_value), SERIES(input_value), VALUE(input_value) | `nice_gfx_ui_chart($ui, text("value"), math_number(0), math_number(0))` | `#include <NICE_GFX.h> ↵ #include <UI/View.h> ↵ ui.appendChartValue(ui_config::id(String("value").c_str()), 0, 0);` |
| `nice_gfx_ui_pointer` | Statement | VAR(field_variable), MODE(dropdown), X(input_value), Y(input_value) | `nice_gfx_ui_pointer($ui, pointerDown, math_number(0), math_number(0))` | `#include <NICE_GFX.h> ↵ #include <UI/View.h> ↵ ui.pointerDown(0, 0, millis());` |
| `nice_gfx_ui_touch` | Statement | VAR(field_variable), DISPLAY(field_variable) | `nice_gfx_ui_touch($ui, $gfx)` | `#include <NICE_GFX.h> ↵ #include <UI/View.h> ↵ bool ui_pressed = false; ↵ uint16_t ui_x = 0, ui_y = 0; ↵ if (gfx.getTouch(&ui_x, &ui_y)) { ↵   if (ui_pressed) ui.pointerMove(ui_x, ui_y, millis()); ↵   else ui.pointerDown(ui_x, ui_y, millis()); ↵   ui_pressed = true; ↵ } else if (ui_pressed) { ↵   ui.pointerUp(ui_x, ui_y, millis()); ↵   ui_pressed = false; ↵ }` |
| `nice_gfx_ui_on` | Hat | VAR(field_variable), ID(input_value), EVENT(dropdown), DO(input_statement) | `nice_gfx_ui_on($ui, text("value"), Click)` | `#include <NICE_GFX.h> ↵ #include <UI/View.h> ↵ void ailyNiceGfxEvent_generator_u2d_coverage_u2d_nice_gfx_ui_on(void *, nice_gfx::htmlui::Event &ng_event) { ↵ } ↵  ↵ ui.on(ui_config::id(String("value").c_str()), nice_gfx::htmlui::EventType::Click, ailyNiceGfxEvent_generator_u2d_coverage_u2d_nice_gfx_ui_on);` |
| `nice_gfx_ui_event_value` | Value | PROP(dropdown) | `nice_gfx_ui_event_value(value)` | `0` |

## Parameter Options

| Parameter | Values |
|---|---|
| nice_gfx_init_spi.DRIVER | `ILI9341_240x320`, `ST7789_240x240`, `ST7789_240x320`, `ST7735_128x160`, `GC9A01_240x240`, `AXS15231B_360x640`, `CO5300_480x480`, `GC9106_80x160`, `GC9107_128x128`, `GC9C01_360x360`, `GC9D01_160x160`, `HX8347C_240x320`, `HX8347D_240x320`, `HX8352C_240x400`, `HX8357A_320x480`, `HX8357B_320x480`, `HX8357C_320x480`, `HX8357D_320x480`, `HX8369A_480x864`, `ILI9163_128x160`, `ILI9225_176x220`, `ILI9331_240x320`, `ILI9481_320x480`, `ILI9486_320x480`, `ILI9488_320x480`, `ILI9806_480x854`, `JBT6K71_240x320`, `JD9613_126x294`, `NT35310_320x480`, `NT35510_480x800`, `NT39125_240x432`, `NV3001B_128x220`, `NV3007_168x428`, `NV3023_128x128`, `NV3041A_480x272`, `OTM8009A_480x800`, `R61529_320x480`, `R61581_320x480`, `RM67162_240x536`, `RM68120_480x800`, `RM68140_320x480`, `RM690B0_482x600`, `S6D02A1_128x160`, `SEPS525_160x128`, `SH8601_480x480`, `SPD2010_412x412`, `SSD1283A_130x130`, `SSD1331_96x64`, `SSD1351_128x128`, `SSD1357_128x128`, `ST7789_2_240x320`, `ST77916_360x360`, `ST7796_320x480`, `WEA2012_356x400`, `SSD1963_272x480`, `SSD1963_480x800`, `SSD1963_ALT_480x800`, `SSD1963_BD_480x800`, `ILI9341_2_240x320`, `ILI9342_240x320`, `ILI9341_Transposed_240x320`, `ILI9481_Parallel_320x480`, `ILI9486_Parallel_320x480`, `ILI9488_Parallel_320x480`, `GC9107_128x160`, `GC9D01_40x160`, `GC9D01_50x160`, `GC9D01_60x160`, `ST7789_Sequence3_240x320`, `ILI9481_Sequence2_320x480`, `ILI9481_Sequence3_320x480`, `ILI9481_Sequence4_320x480`, `ILI9481_Sequence5_320x480`, `ILI9481_Sequence6_320x480`, `ILI9481_Sequence7_320x480`, `ILI9481_Sequence8_320x480`, `ILI9481_Sequence2_Parallel_320x480`, `ILI9481_Sequence3_Parallel_320x480`, `ILI9481_Sequence4_Parallel_320x480`, `ILI9481_Sequence5_Parallel_320x480`, `ILI9481_Sequence6_Parallel_320x480`, `ILI9481_Sequence7_Parallel_320x480`, `ILI9481_Sequence8_Parallel_320x480`, `ILI9486_PaddedSPI_320x480`, `ST7796_PaddedSPI_320x480`, `NV3022B_240x284`, `JD9853_240x284`, `PT6891_95x28`, `GC9B71_320x386`, `ST77922_532x300`, `ST7102_480x800`, `JD9853A_172x320`, `JD9853_172x320`, `ST7789V2_170x320`, `ST7789V2_240x280`, `ST7789P_240x284`, `ST7789T3_240x320` |
| nice_gfx_init_spi.BUS | `SPI`, `SW_SPI` |
| nice_gfx_init_spi.ROTATION | `0`, `1`, `2`, `3` |
| nice_gfx_init_qspi.DRIVER | `nice_gfx::CH13613_480x480_QSPI`, `nice_gfx::AXS15231B_360x640_QSPI`, `nice_gfx::CO5300_480x480_QSPI`, `nice_gfx::ST77916_360x360_QSPI`, `nice_gfx::SH8601_480x480_QSPI`, `nice_gfx::SPD2010_412x412_QSPI`, `nice_gfx::RM67162_240x536_QSPI`, `nice_gfx::RM690B0_482x600_QSPI`, `nice_gfx::NV3041A_480x272_QSPI`, `nice_gfx::GC9B71_320x386_QSPI`, `nice_gfx::ST77922_532x300_QSPI`, `nice_gfx::ST7102_480x800_QSPI`, `nice_gfx::CO5300_466x466_QSPI`, `nice_gfx::CO5300_368x448_QSPI`, `nice_gfx::CO5300_410x502_QSPI`, `nice_gfx::SH8601_368x448_QSPI`, `nice_gfx::SH8601_466x466_QSPI`, `nice_gfx::SH8601_280x456_QSPI`, `nice_gfx::AXS15231B_320x480_QSPI`, `nice_gfx::AXS15231B_172x640_QSPI`, `nice_gfx::ST77916_390x390_QSPI` |
| nice_gfx_init_i2c.DRIVER | `SSD1306_128x64_I2C`, `SSD1306_128x32_I2C`, `SH1106_128x64_I2C` |
| nice_gfx_init_i2c.ROTATION | `0`, `1`, `2`, `3` |
| nice_gfx_init_board.BOARD | `CustomSpi`, `Esp32`, `Esp32S3Ili9341`, `OjAiotKitLcd`, `OjEsp32S3Basic`, `Rp2040`, `WioTerminal`, `XiaoRound`, `XueersiEsp32`, `Linkbit213Tricolor`, `SeeedEe02Spectra133`, `SeeedEe03103`, `SeeedEe0475`, `SeeedEe0575`, `SeeedReterminalE1001`, `SeeedReterminalE1002`, `SeeedReterminalE1003`, `SeeedReterminalE1004`, `SeeedReterminalSticky`, `SeeedTrmnl75Diy`, `SeeedXiao75Panel`, `OjOjoy`, `EspMosaico`, `Esp32S31Korvo1`, `WaveshareTouchLcd4B` |
| nice_gfx_rect.MODE | `drawRect`, `fillRect` |
| nice_gfx_round_rect.MODE | `drawRoundRect`, `fillRoundRect` |
| nice_gfx_circle.MODE | `drawCircle`, `fillCircle` |
| nice_gfx_ellipse.MODE | `drawEllipse`, `fillEllipse` |
| nice_gfx_triangle.MODE | `drawTriangle`, `fillTriangle` |
| nice_gfx_gradient.MODE | `fillRectVGradient`, `fillRectHGradient` |
| nice_gfx_font.FONT | `Fixed6x13`, `Scientifica5x11`, `Tamzen7x14`, `Spleen8x16`, `TomThumb4x6`, `ProFont6x12`, `UnifontCN16`, `GfxMonoCN16`, `Cozette6x13`, `GfxTerm8x16`, `GfxTermBold8x16`, `GfxSansCN16`, `GfxSansCN12`, `GfxSansCN24`, `GfxSerifCN24`, `GfxKaiCN16`, `GfxKaiCN24`, `GfxSansBoldCN24`, `GfxSansLatin16`, `GfxSansLatin24`, `GfxSmoothCN16`, `GfxSmoothCN24`, `GfxSmoothLatin16`, `GfxSmoothLatin24`, `GfxSerifHeavyCN24`, `Spleen12x24`, `TamzenBold8x16`, `GfxIndustrial16`, `GfxIndustrial24`, `GfxIndustrial32`, `GfxIndustrial40`, `GfxIndustrial48`, `GfxIndustrial64`, `GfxIndustrial72`, `GfxNarrow20`, `GfxNarrow32`, `GfxCircuit24`, `GfxCircuit40`, `GfxCondensed28`, `GfxCondensed56`, `GfxSmoothBoldCN16`, `GfxSmoothBoldCN20`, `GfxSmoothBoldCN24`, `GfxSmoothBoldCN28`, `GfxSmoothBoldCN32`, `GfxAegisDigits48`, `GfxAegisAngle48`, `GfxSmoothBoldCN36`, `GfxOledCaption8`, `GfxOledDigits18`, `GfxOledDigits22` |
| nice_gfx_cursor_print.MODE | `print`, `println` |
| nice_gfx_action.ACTION | `wait`, `resetViewport`, `startWrite`, `endWrite`, `initDMA`, `deInitDMA` |
| nice_gfx_dimension.DIM | `width`, `height` |
| nice_gfx_color.COLOR | `0xFFFF`, `0x0000`, `0xF800`, `0x07E0`, `0x001F`, `0xFFE0`, `0x07FF`, `0xF81F`, `0x8410`, `0xFDA0` |
| nice_gfx_sprite_create.DEPTH | `16`, `8`, `4`, `1` |
| nice_gfx_touch_i2c.DRIVER | `Cst816`, `Ft6x36`, `Gt911`, `Gt1151`, `Chsc6x`, `Axs5106L`, `Cst328`, `Cst3530` |
| nice_gfx_touch_coordinate.AXIS | `x`, `y` |
| nice_gfx_ui_state.MODE | `setVisible`, `setEnabled` |
| nice_gfx_ui_navigate.MODE | `push`, `replace` |
| nice_gfx_ui_action.ACTION | `back`, `home`, `beginUpdate`, `endUpdate`, `finish`, `invalidate`, `pointerCancel`, `commitTextInput`, `cancelTextInput` |
| nice_gfx_ui_pointer.MODE | `pointerDown`, `pointerMove`, `pointerUp` |
| nice_gfx_ui_on.EVENT | `Click`, `Input`, `Change`, `LongPress`, `Submit`, `Cancel`, `RouteChange`, `PageChange`, `AnimationEnd`, `Focus`, `Blur` |
| nice_gfx_ui_event_value.PROP | `value`, `x`, `y`, `target`, `optionIndex` |

## ABS Examples

### SPI display (classic ESP32 wiring)

```abs
arduino_setup()
    nice_gfx_init_spi("gfx", ILI9341_240x320, SPI, 5, 2, "4", 18, 23, "19", math_number(40000000), 0)
    nice_gfx_fill($gfx, nice_gfx_color(0x0000))
    nice_gfx_font($gfx, Fixed6x13)
    nice_gfx_text_style($gfx, nice_gfx_color(0xFFFF), nice_gfx_color(0x0000), math_number(1), TRUE)
    nice_gfx_text($gfx, text("Hello NICE_GFX"), math_number(10), math_number(10))

arduino_loop()
    time_delay(math_number(10))
```

### Sprite

```abs
arduino_setup()
    nice_gfx_init_spi("gfx", ILI9341_240x320, SPI, 5, 2, "4", 18, 23, "19", math_number(40000000), 0)
    nice_gfx_sprite_create("sprite", $gfx, math_number(120), math_number(60), 16)

arduino_loop()
    controls_if()
        @IF0: nice_gfx_sprite_ready($sprite)
        @DO0:
            nice_gfx_fill($sprite, nice_gfx_color(0x0000))
            nice_gfx_text($sprite, text("Sprite"), math_number(5), math_number(5))
            nice_gfx_sprite_push($sprite, math_number(10), math_number(40))
    time_delay(math_number(100))
```

### Designer UI with CST816 touch

Requires an ABI 19 export containing the `level` and `meter` IDs. Set I2C pins for your board before these calls if needed.

```abs
nice_gfx_ui_on($ui, text("level"), Change)
    @DO:
        nice_gfx_ui_value($ui, text("meter"), nice_gfx_ui_event_value(value))

arduino_setup()
    nice_gfx_init_spi("gfx", ILI9341_240x320, SPI, 5, 2, "4", 18, 23, "19", math_number(40000000), 0)
    nice_gfx_touch_i2c($gfx, Cst816, Wire, math_number(21), "-1", "-1", math_number(240), math_number(320))
    nice_gfx_ui_init("ui", $gfx, "ui.h", math_number(2048))

arduino_loop()
    nice_gfx_ui_touch($ui, $gfx)
    time_delay(math_number(1))
```

## Notes

1. Initialize the display first, then attach touch/create sprites, then load UI. Keep each object name unique. Display initialization creates a typed `NICE_GFX` variable; Sprite creation creates `GFX_Sprite`; UI initialization creates `NICE_GFX_View`. Use `$name` for field_variable slots, and `variables_get($name)` for value inputs.
2. Constructors are emitted globally; begin/load/create calls run where their initialization block appears. Constructor inputs HZ, ADDRESS, TILE, touch W/H must be constants. SPI argument order is CS, DC, RST, SCK, MOSI, MISO, HZ. QSPI order is CS, RST, SCK, D0, D1, D2, D3, HZ. Use -1 for unused reset/MISO/IRQ. Optional pin text fields accept a numeric pin or a board pin constant.
3. I2C display initialization accepts SDA/SCL (-1 for both uses default pins) and HZ. Custom pins use begin(sda,scl) on ESP32/ESP8266 and setSDA/setSCL on non-Mbed RP2040/STM32; other cores require default pins. The selected Wire bus is started and setClock(HZ) runs before display.begin(). Touch blocks reuse the selected bus. Addresses are decimal (60 = 0x3C). Touch defaults: Cst816=21, Ft6x36=56, Gt911=93, Gt1151=20, Chsc6x=46, Axs5106L=99, Cst328=26, Cst3530=88. GT1151 uses repeated-start register reads. Touch W/H are the dimensions at rotation 0.
4. QSPI requires a supported ESP32 target; CH13613 requires ESP32-S3. Board presets only compile for the corresponding MCU. SPI/SW_SPI blocks expose 97 color profiles; monochrome I2C exposes SSD1306/SH1106. Parallel, generic RGB/MIPI, arbitrary U8g2/GxEPD2 catalog configuration and raw image buffers remain C++ APIs; they are not additional Blockly initialization modes. Some board presets supply RGB/e-paper hardware internally. The unchanged bundled source contains those drivers.
5. Software SPI defaults to the same editable HZ input as SPI; use 1000000 or less for SW_SPI. Check `nice_gfx_status`: 0=Ok, 1=InvalidArgument, 2=NotInitialized, 3=Busy, 4=NoMemory, 5=Unsupported, 6=IoError. Full UI requires STL and dynamic memory; AVR supports basic graphics only. Compatibility metadata does not make every display available on every MCU.
6. Screen and Sprite drawing share a typed selector. Check `nice_gfx_sprite_ready` before drawing; a 16-bit Sprite needs width*height*2 bytes. For 1/4-bit sprites, drawing colors are palette indices. Free unused buffers with sprite_delete. Use startWrite/endWrite in balanced pairs; wait before reusing asynchronous pixel buffers.
7. Built-in fonts contain specific glyph sets. Use a CN font for Chinese, or re-export the required glyph subset with the designer. RGB components are 0..255; RGB565 expressions evaluate each component once.
8. XPT2046 uses independent software SPI pins, which must not overlap an active hardware SPI bus. Calibrate resistive touch before reading; calibration waits at most 30 seconds and lasts for the current run. touch_read samples once; coordinate blocks read that cached successful sample and keep previous coordinates after release.
9. Export ui.h and all associated assets from the matching designer into the sketch. The bundled runtime uses ResourceVersion 19, verified from UI/Compiled.h. Older upstream sample headers targeting ABI 15/17 must be re-exported; changing the static_assert alone is insufficient. Multiple views must use the same ui_config resource namespace.
10. ui_init emits a global View, a ready flag and an automatic tick(millis()) at loop end. Avoid long blocking loop work. Put ui_touch in loop after touch setup; it maps press/move/release to pointer events. ui_pointer is an alternative for manual input. All View calls must run on one task.
11. ui_on is a top-level Hat and registers its unique callback at setup end, after load. RouteChange automatically targets ID 0 and ignores the ID input. Other events use element IDs without #. event_value reads ng_event only inside a UI callback; outside it emits 0 with a warning. Callbacks should perform short operations.
12. setValue/setText do not emit Input/Change. Refresh related widgets explicitly. Numeric UI fields use integer fixed-point units; series indices start at 0. chart append copies samples. beginUpdate/endUpdate batch rendering; pair them. Navigated IDs refer to the current page; paths must exist in the exported project.
13. SPI/QSPI/I2C initialization defaults come from the active window.boardConfig.displayConfig. The controller and width/height match an existing profile; pins map sclk/sck, mosi/miso, cs/dc/rst, d0..d3/data0..data3, and sda/scl. frequency initializes the HZ number shadow; I2C also accepts optional address/wire, and rotation is used where the block has that field. Built-in pins can be added to the local GPIO picker. No file path is hardcoded. Defaults initialize synchronously before saved fields load; the flyout refreshes after generic toolbox shadows attach. Saved values, manual workspace edits and connected expressions take priority. Changing boards does not rewrite existing blocks. Unsupported interfaces are skipped; an unavailable controller/resolution keeps defaults and shows a warning. The board-preset block continues using upstream fixed wiring.

## Initialization Code Effects

The following shows the complete global objects and setup effects for representative initialization choices; include <NICE_GFX.h> before use.

```cpp
ILI9341_240x320_SPI gfx(5, 2, 4, 18, 23, 19, 40000000);
GFX_Sprite sprite(&gfx);
// setup, in order:
// gfx.begin();
// gfx.setRotation(0);
// sprite.setColorDepth(16);
// sprite.createSprite(120, 60);
```
