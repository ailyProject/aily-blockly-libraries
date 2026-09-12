# GxEPD2 Any Panel

One setup block exposing the full bundled GxEPD2 panel catalog (99 drivers: BW, 3-color, 4-color, 7-color) for the installed `@aily-project/lib-gxepd2`, with in-block SCK/MOSI pin definition.

## Library Info

- **Name**: @aily-project/lib-gxepd2-any
- **Version**: 1.1.0

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
| ---------- | ---------- | ----------------------------- | ---------- | -------------- |
| `gxepd2any_setup` | Statement | VAR(field_input), PANEL(dropdown), SCK(input_value), MOSI(input_value), CS(input_value), DC(input_value), RST(input_value), BUSY(input_value), BAUD(dropdown), RESET_DURATION(dropdown), INITIAL(dropdown), PULLDOWN(dropdown) | `gxepd2any_setup("display", GxEPD2_420c_GDEY042Z98, math_number(18), math_number(23), math_number(5), math_number(17), math_number(21), math_number(4), 0, 2, TRUE, FALSE)` | `SPI.end(); ↵ SPI.begin(1, -1, 1, 1); ↵ display.init(0, true, 2, false);` |

## Parameter Options

| Parameter | Values | Description |
| --------- | ------ | ----------- |
| PANEL | GxEPD2_102, GxEPD2_213_flex, GxEPD2_213_M21, GxEPD2_213_T5D, GxEPD2_213, GxEPD2_213_B72, GxEPD2_213_B73, GxEPD2_213_B74, GxEPD2_213_BN, GxEPD2_213_GDEY0213B74, GxEPD2_290, GxEPD2_290_BS, GxEPD2_290_GDEY029T94, GxEPD2_290_I6FD, GxEPD2_290_M06, GxEPD2_290_T5, GxEPD2_290_T5D, GxEPD2_290_T94, GxEPD2_290_T94_V2, GxEPD2_154_M10, GxEPD2_154_T8, GxEPD2_260, GxEPD2_260_M01, GxEPD2_266_BN, GxEPD2_266_GDEY0266T90, GxEPD2_290_GDEY029T71H, GxEPD2_270, GxEPD2_270_GDEY027T91, GxEPD2_150_BN, GxEPD2_154, GxEPD2_154_D67, GxEPD2_154_GDEY0154D67, GxEPD2_154_M09, GxEPD2_310_GDEQ031T10, GxEPD2_370_GDEY037T03, GxEPD2_371, GxEPD2_370_TC1, GxEPD2_420, GxEPD2_420_GDEY042T81, GxEPD2_420_GYE042A87, GxEPD2_420_M01, GxEPD2_420_SE0420NQ04, GxEPD2_583, GxEPD2_750, GxEPD2_583_GDEQ0583T31, GxEPD2_583_T8, GxEPD2_579_GDEY0579T93, GxEPD2_397_GDEM0397T81, GxEPD2_426_GDEQ0426T82, GxEPD2_750_GDEY075T7, GxEPD2_750_T7, GxEPD2_576_GDEH0576T81, GxEPD2_1020_GDEM102T91, GxEPD2_1160_T91, GxEPD2_1330_GDEM133T91, GxEPD2_1248, GxEPD2_1085_GDEM1085T51, GxEPD2_213_Z19c, GxEPD2_213c, GxEPD2_213_Z98c, GxEPD2_290_C90c, GxEPD2_290_Z13c, GxEPD2_290c, GxEPD2_266c, GxEPD2_270c, GxEPD2_154_Z90c, GxEPD2_154c, GxEPD2_420c, GxEPD2_420c_GDEY042Z98, GxEPD2_420c_Z21, GxEPD2_583c, GxEPD2_750c, GxEPD2_583c_GDEQ0583Z31, GxEPD2_583c_Z83, GxEPD2_579c_GDEY0579Z93, GxEPD2_750c_GDEW075Z08, GxEPD2_750c_GDEY075Z08, GxEPD2_750c_Z08, GxEPD2_750c_Z90, GxEPD2_1160c_GDEY116Z91, GxEPD2_1330c_GDEM133Z91, GxEPD2_1248c, GxEPD2_213c_GDEY0213F51, GxEPD2_290c_GDEY029F51H, GxEPD2_300c, GxEPD2_266c_GDEY0266F51H, GxEPD2_350c_GDEM035F51, GxEPD2_154c_GDEM0154F51H, GxEPD2_420c_GDEY0420F51, GxEPD2_437c, GxEPD2_579c_GDEY0579F51, GxEPD2_397c_GDEM0397F81, GxEPD2_750c_GDEM075F52, GxEPD2_1160c_GDEY116F51, GxEPD2_565c, GxEPD2_565c_GDEP0565D90, GxEPD2_730c_ACeP_730, GxEPD2_730c_GDEP073E01, GxEPD2_730c_GDEY073D46 | GxEPD2 driver class; label shows diagonal inches, color type (BW / 3-color / 4-color / 7-color), class name and resolution |
| BAUD | 0, 115200, 9600 | GxEPD2 diagnostic serial rate; 0 disables and skips Serial initialization |
| RESET_DURATION | 2, 10, 20 | Reset pulse length in ms passed to init |
| INITIAL | TRUE, FALSE | GxEPD2 initial parameter of init |
| PULLDOWN | FALSE, TRUE | GxEPD2 pulldown_rst_mode parameter of init |

## ABS Examples

```abs
# Project Data Schema: 1 (external-only)

arduino_setup()
    gxepd2any_setup("display", GxEPD2_420c_GDEY042Z98, math_number(18), math_number(23), math_number(5), math_number(17), math_number(21), math_number(4), 0, 2, TRUE, FALSE)
    gxepd2_set_rotation($display, 0)
    gxepd2_page_update($display, FULL)
        gxepd2_fill_screen($display, gxepd2_color(GxEPD_WHITE))
        gxepd2_set_cursor($display, math_number(20), math_number(150))
        gxepd2_print($display, text("Hello any panel"))

arduino_loop()
    time_delay(math_number(1000))
```

## Notes

1. **Variable**: `gxepd2any_setup("display", ...)` creates `$display` registered as Blockly variable type `GxEPD2`; pass `$display` directly to the `field_variable` slots of all `gxepd2_*` blocks of `@aily-project/lib-gxepd2`. Do not combine two setup blocks for the same variable name.
2. **Pins**: SCK and MOSI(DIN) are hardware-SPI bus pins and are pinned with `SPI.begin(sck, -1, mosi, cs)` before init (ESP32 VSPI defaults SCK=18, MOSI=23; e-paper has no MISO). CS/DC/RST/BUSY are the four panel control pins. VCC/GND go to 3.3V/GND directly.
3. **Side effects**: besides the inline code in the Generated Code column, the handler registers `#include <Adafruit_GFX.h>`, `#include <GxEPD2.h>`, `#include <GxEPD2_BW.h>`, `#include <GxEPD2_3C.h>`, `#include <GxEPD2_4C.h>`, `#include <GxEPD2_7C.h>` and `#include <SPI.h>` via addLibrary, and the display object via addVariable, e.g. `GxEPD2_3C<GxEPD2_420c_GDEY042Z98, 300> display(GxEPD2_420c_GDEY042Z98(5, 17, 21, 4));` for the ABS Format example above.
4. Requires the installed `@aily-project/lib-gxepd2`; all panel classes compile from its headers, so this library ships no compiled source (`src/gxepd2-any/gxepd2_any.h` is a comment-only documentation header).
5. The declaration template height is pre-capped to the ESP32 static buffer budget (65536 bytes per plane), so large panels page automatically inside `gxepd2_page_update`.
6. PANEL labels are universal technical codes (inches + color type + class name + resolution) and are intentionally not localized; option values are the GxEPD2 class names.
7. Panels are 3.3V supply and 3.3V logic only. A blank panel usually means the wrong PANEL class; pick the entry matching your panel marking and resolution.
