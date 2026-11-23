# Monochrome display

The monochrome display driver library based on u8g2 can drive a variety of OLED and LCD monochrome displays, and supports common driver chips such as SSD1306, SSD1309, SH1106, SH1107, ST7305, ST7567, and ST7920.

## Library Info
- **Name**: @aily-project/lib-u8g2
- **Version**: 1.0.10

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `u8g2_begin` | Statement | TYPE(dropdown), MODE(dropdown); runtime variants: hardware-i2c-fixed-board: RESOLUTION(dropdown), PROTOCOL(dropdown), RESET_PIN(field_input); hardware-i2c-esp32: RESOLUTION(dropdown), PROTOCOL(dropdown), SCL_PIN(field_input), SDA_PIN(field_input), RESET_PIN(field_input); software-i2c: RESOLUTION(dropdown), PROTOCOL(dropdown), CLOCK_PIN(field_input), DATA_PIN(field_input), RESET_PIN(field_input); three-wire-hardware-spi: RESOLUTION(dropdown), PROTOCOL(dropdown), CS_PIN(field_input), RESET_PIN(field_input); three-wire-software-spi: RESOLUTION(dropdown), PROTOCOL(dropdown), CLOCK_PIN(field_input), DATA_PIN(field_input), CS_PIN(field_input), RESET_PIN(field_input); four-wire-hardware-spi: RESOLUTION(dropdown), PROTOCOL(dropdown), CS_PIN(field_input), DC_PIN(field_input), RESET_PIN(field_input); four-wire-software-spi: RESOLUTION(dropdown), PROTOCOL(dropdown), CLOCK_PIN(field_input), DATA_PIN(field_input), CS_PIN(field_input), DC_PIN(field_input), RESET_PIN(field_input); st7920-hardware-spi: RESOLUTION(dropdown), PROTOCOL(dropdown), CS_PIN(field_input), RESET_PIN(field_input); st7920-software-spi: RESOLUTION(dropdown), PROTOCOL(dropdown), CLOCK_PIN(field_input), DATA_PIN(field_input), CS_PIN(field_input), RESET_PIN(field_input) | `u8g2_begin(SSD1306, FULL_BUFFER, 128X64_NONAME, _HW_I2C, U8X8_PIN_NONE)` | `u8g2.begin();` |
| `u8g2_page_buffer` | Statement | DO(input_statement) | `u8g2_page_buffer()` | `u8g2.firstPage(); ↵ do { ↵ } while (u8g2.nextPage());` |
| `u8g2_clear` | Statement | (none) | `u8g2_clear()` | `u8g2.clear();` |
| `u8g2_draw_pixel` | Statement | X(input_value), Y(input_value) | `u8g2_draw_pixel(math_number(0), math_number(0))` | `u8g2.drawPixel(1, 1); ↵ u8g2.sendBuffer();` |
| `u8g2_draw_line` | Statement | X1(input_value), Y1(input_value), X2(input_value), Y2(input_value) | `u8g2_draw_line(math_number(0), math_number(0), math_number(0), math_number(0))` | `u8g2.drawLine(1, 1, 1, 1); ↵ u8g2.sendBuffer();` |
| `u8g2_draw_rectangle` | Statement | X(input_value), Y(input_value), WIDTH(input_value), HEIGHT(input_value), FILL(field_checkbox) | `u8g2_draw_rectangle(math_number(0), math_number(0), math_number(0), math_number(0), FALSE)` | `u8g2.drawFrame(1, 1, 1, 1); ↵ u8g2.sendBuffer();` |
| `u8g2_draw_circle` | Statement | X(input_value), Y(input_value), RADIUS(input_value), FILL(field_checkbox) | `u8g2_draw_circle(math_number(0), math_number(0), math_number(0), FALSE)` | `u8g2.drawCircle(1, 1, 1); ↵ u8g2.sendBuffer();` |
| `u8g2_draw_str` | Statement | X(input_value), Y(input_value), TEXT(input_value) | `u8g2_draw_str(math_number(0), math_number(0), text("value"))` | `u8g2.setFont(u8g2_font_ncenB08_tr); ↵ u8g2.drawUTF8(1, 1, String("value").c_str()); ↵ u8g2.sendBuffer();` |
| `u8g2_draw_bitmap` | Statement | X(input_value), Y(input_value), BITMAP(input_value) | `u8g2_draw_bitmap(math_number(0), math_number(0), math_number(0))` | `u8g2.drawXBMP(1, 1, 1_width, 1_height, 1); ↵ u8g2.sendBuffer();` |
| `u8g2_bitmap` | Value | CUSTOM_BITMAP(field_bitmap_u8g2) | `u8g2_bitmap({"schemaVersion":1,"encoding":"xbm-lsb-row-v1","width":128,"height":64,"bitmap":null})` | `No direct code emitted while the custom bitmap/animation field has no frame data.` |
| `u8g2_animation` | Value | CUSTOM_ANIMATION(field_u8g2_animation) | `u8g2_animation({"schemaVersion":1,"encoding":"xbm-lsb-row-v1","width":128,"height":64,"fps":10,"maxFrames":30,"dither":false,"threshold":127,"frameCount":0,"frames":null})` | `No direct code emitted while the custom bitmap/animation field has no frame data.` |
| `u8g2_play_animation` | Statement | X(input_value), Y(input_value), ANIMATION(input_value), PLAY_MODE(dropdown), LOOP(field_checkbox) | `u8g2_play_animation(math_number(0), math_number(0), u8g2_animation({"schemaVersion":1,"encoding":"xbm-lsb-row-v1","width":128,"height":64,"fps":10,"maxFrames":30,"dither":false,"threshold":127,"frameCount":0,"frames":null}), NON_BLOCKING, TRUE)` | `for (uint16_t i = 0; i < 1_frame_count; i++) { ↵ u8g2DrawAnimationFrame(1, 1, 1_width, 1_height, 1_frames[i]); ↵ u8g2.sendBuffer(); ↵ delay(1_frame_delay); ↵ }` |
| `u8g2_draw_animation_frame` | Statement | X(input_value), Y(input_value), ANIMATION(input_value), FRAME(input_value) | `u8g2_draw_animation_frame(math_number(0), math_number(0), u8g2_animation({"schemaVersion":1,"encoding":"xbm-lsb-row-v1","width":128,"height":64,"fps":10,"maxFrames":30,"dither":false,"threshold":127,"frameCount":0,"frames":null}), variables_get($animationFrame))` | `u8g2DrawAnimationFrameByIndex(1, 1, 1_width, 1_height, 1_frames, 1_frame_count, 1); ↵ u8g2.sendBuffer();` |
| `u8g2_animation_frame_count` | Value | ANIMATION(input_value) | `u8g2_animation_frame_count(u8g2_animation({"schemaVersion":1,"encoding":"xbm-lsb-row-v1","width":128,"height":64,"fps":10,"maxFrames":30,"dither":false,"threshold":127,"frameCount":0,"frames":null}))` | `1_frame_count` |
| `u8g2_icon_16x16` | Value | CUSTOM_BITMAP(field_bitmap_u8g2) | `u8g2_icon_16x16({"schemaVersion":1,"encoding":"xbm-lsb-row-v1","width":16,"height":16,"bitmap":null})` | `No direct code emitted while the custom bitmap/animation field has no frame data.` |
| `u8g2_icon_32x32` | Value | CUSTOM_BITMAP(field_bitmap_u8g2) | `u8g2_icon_32x32({"schemaVersion":1,"encoding":"xbm-lsb-row-v1","width":32,"height":32,"bitmap":null})` | `No direct code emitted while the custom bitmap/animation field has no frame data.` |
| `u8g2_icon_64x64` | Value | CUSTOM_BITMAP(field_bitmap_u8g2) | `u8g2_icon_64x64({"schemaVersion":1,"encoding":"xbm-lsb-row-v1","width":64,"height":64,"bitmap":null})` | `No direct code emitted while the custom bitmap/animation field has no frame data.` |
| `u8g2_set_flip_mode` | Statement | MODE(dropdown) | `u8g2_set_flip_mode("0")` | `u8g2.setFlipMode(0);` |
| `u8g2_set_display_mirror` | Statement | MODE(dropdown) | `u8g2_set_display_mirror("U8G2_MIRROR")` | `u8g2.setDisplayRotation(U8G2_R0);` |
| `u8g2_set_power_save` | Statement | MODE(dropdown) | `u8g2_set_power_save("0")` | `u8g2.setPowerSave(0);` |
| `u8g2_set_contrast` | Statement | VALUE(input_value) | `u8g2_set_contrast(math_number(0))` | `u8g2.setContrast(1);` |
| `u8g2_set_bus_clock` | Statement | SPEED(dropdown) | `u8g2_set_bus_clock("100000")` | `u8g2.setBusClock(100000);` |
| `u8g2_set_i2c_address` | Statement | ADDRESS(field_input) | `u8g2_set_i2c_address("0x78")` | `u8g2.setI2CAddress(0x78);` |
| `u8g2_set_font` | Statement | SIZE(dropdown); runtime variants: 8px-chinese: FONT_TYPE(dropdown), FONT(dropdown); 25px-helvetica: FONT_TYPE(dropdown), FONT(dropdown) | `u8g2_set_font(8, CHINESE, u8g2_font_wqy12_t_chinese1)` | `u8g2.setFont(FONT);` |
| `u8g2_set_draw_color` | Statement | COLOR(dropdown) | `u8g2_set_draw_color("1")` | `u8g2.setDrawColor(1);` |
| `u8g2_set_font_mode` | Statement | MODE(dropdown) | `u8g2_set_font_mode("1")` | `u8g2.setFontMode(1);` |
| `u8g2_clear_buffer` | Statement | (none) | `u8g2_clear_buffer()` | `u8g2.clearBuffer();` |
| `u8g2_send_buffer` | Statement | (none) | `u8g2_send_buffer()` | `u8g2.sendBuffer();` |
| `u8x8_begin` | Statement | TYPE(dropdown); runtime variants: hardware-i2c-fixed-board: RESOLUTION(dropdown), PROTOCOL(dropdown), RESET_PIN(field_input); hardware-i2c-esp32: RESOLUTION(dropdown), PROTOCOL(dropdown), SCL_PIN(field_input), SDA_PIN(field_input), RESET_PIN(field_input); software-i2c: RESOLUTION(dropdown), PROTOCOL(dropdown), CLOCK_PIN(field_input), DATA_PIN(field_input), RESET_PIN(field_input); three-wire-hardware-spi: RESOLUTION(dropdown), PROTOCOL(dropdown), CS_PIN(field_input), RESET_PIN(field_input); three-wire-software-spi: RESOLUTION(dropdown), PROTOCOL(dropdown), CLOCK_PIN(field_input), DATA_PIN(field_input), CS_PIN(field_input), RESET_PIN(field_input); four-wire-hardware-spi: RESOLUTION(dropdown), PROTOCOL(dropdown), CS_PIN(field_input), DC_PIN(field_input), RESET_PIN(field_input); four-wire-software-spi: RESOLUTION(dropdown), PROTOCOL(dropdown), CLOCK_PIN(field_input), DATA_PIN(field_input), CS_PIN(field_input), DC_PIN(field_input), RESET_PIN(field_input); st7920-hardware-spi: RESOLUTION(dropdown), PROTOCOL(dropdown), CS_PIN(field_input), RESET_PIN(field_input); st7920-software-spi: RESOLUTION(dropdown), PROTOCOL(dropdown), CLOCK_PIN(field_input), DATA_PIN(field_input), CS_PIN(field_input), RESET_PIN(field_input) | `u8x8_begin(SSD1306, 128X64_NONAME, _HW_I2C, U8X8_PIN_NONE)` | `u8x8.begin();` |
| `u8x8_clear` | Statement | (none) | `u8x8_clear()` | `u8x8.clear();` |
| `u8x8_draw_str` | Statement | X(input_value), Y(input_value), TEXT(input_value), INVERSE(field_checkbox) | `u8x8_draw_str(math_number(0), math_number(0), text("value"), FALSE)` | `u8x8.setFont(u8x8_font_chroma48medium8_r); ↵ u8x8.drawString(1, 1, String("value").c_str());` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| TYPE | SSD1306, SSD1309, SH1106, SH1107, ST7305, ST7567, ST7920 | u8g2_begin |
| MODE | FULL_BUFFER, PAGE_BUFFER | u8g2_begin |
| MODE | 0, 1 | u8g2_set_flip_mode, u8g2_set_power_save |
| MODE | U8G2_R0, U8G2_MIRROR, U8G2_MIRROR_VERTICAL | u8g2_set_display_mirror |
| PLAY_MODE | BLOCKING, NON_BLOCKING | u8g2_play_animation |
| LOOP | TRUE, FALSE | u8g2_play_animation |
| SPEED | 100000, 400000, 1000000 | u8g2_set_bus_clock |
| ADDRESS | Exact I2C/IIC address value passed to u8g2.setI2CAddress(), for example 0x78 | u8g2_set_i2c_address |
| SIZE | 8, 14, 19, 25, 34, 42, 50, 58 | u8g2_set_font |
| COLOR | 1, 0, 2 | u8g2_set_draw_color |
| MODE | 1, 0 | u8g2_set_font_mode |
| TYPE | SSD1306, SSD1309, SH1106, SH1107, ST7567, ST7920 | u8x8_begin |

## ABS Examples

### Basic Usage
```
arduino_setup()
    u8g2_set_i2c_address("0x78")
    u8g2_begin(SSD1306, FULL_BUFFER, 128X64_NONAME, _HW_I2C, U8X8_PIN_NONE)
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, u8g2_bitmap({"schemaVersion":1,"encoding":"xbm-lsb-row-v1","width":128,"height":64,"bitmap":null}))
    time_delay(math_number(1000))
```

### Simple Animation Playback
Use the original playback block when the user only needs to play an uploaded animation.

```
arduino_setup()
    u8g2_begin(SSD1306, FULL_BUFFER, 128X64_NONAME, _HW_I2C, U8X8_PIN_NONE)

arduino_loop()
    u8g2_play_animation(math_number(0), math_number(0), u8g2_animation({"schemaVersion":1,"encoding":"xbm-lsb-row-v1","width":128,"height":64,"fps":10,"maxFrames":30,"dither":false,"threshold":127,"frameCount":0,"frames":null}), NON_BLOCKING, TRUE)
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
3. **I2C address**: `u8g2_set_i2c_address` passes the user-entered value directly to `u8g2.setI2CAddress()` with no automatic shift or conversion. Place it before `u8g2_begin`.
4. **Runtime shape**: `u8g2_begin` and `u8x8_begin` use protocol-specific pin signatures, while `u8g2_set_font` adds the matching `FONT_TYPE` and `FONT`; use the exact Runtime Variant Examples for the selected mode.
5. **Animation value reuse**: `u8g2_animation()` is the value block that holds the user-uploaded animation. Connect it to `u8g2_play_animation`, `u8g2_draw_animation_frame`, and `u8g2_animation_frame_count` as needed.

## Runtime Variant Examples

### Runtime Variant: u8g2_begin/hardware-i2c-esp32
```abs
arduino_setup()
    u8g2_begin(SSD1306, FULL_BUFFER, 128X64_NONAME, _HW_I2C, SCL, SDA, U8X8_PIN_NONE)
```

### Runtime Variant: u8g2_begin/software-i2c
```abs
arduino_setup()
    u8g2_begin(SSD1306, FULL_BUFFER, 128X64_NONAME, _SW_I2C, 13, 11, 8)
```

### Runtime Variant: u8g2_begin/three-wire-hardware-spi
```abs
arduino_setup()
    u8g2_begin(SSD1306, FULL_BUFFER, 128X64_NONAME, _3W_HW_SPI, 10, 8)
```

### Runtime Variant: u8g2_begin/three-wire-software-spi
```abs
arduino_setup()
    u8g2_begin(SSD1306, FULL_BUFFER, 128X64_NONAME, _3W_SW_SPI, 13, 11, 10, 8)
```

### Runtime Variant: u8g2_begin/four-wire-hardware-spi
```abs
arduino_setup()
    u8g2_begin(SSD1306, FULL_BUFFER, 128X64_NONAME, _4W_HW_SPI, 10, 9, 8)
```

### Runtime Variant: u8g2_begin/four-wire-software-spi
```abs
arduino_setup()
    u8g2_begin(SSD1306, FULL_BUFFER, 128X64_NONAME, _4W_SW_SPI, 13, 11, 10, 9, 8)
```

### Runtime Variant: u8g2_begin/st7920-hardware-spi
```abs
arduino_setup()
    u8g2_begin(ST7920, FULL_BUFFER, 128X64, _HW_SPI, 17, U8X8_PIN_NONE)
```

### Runtime Variant: u8g2_begin/st7920-software-spi
```abs
arduino_setup()
    u8g2_begin(ST7920, FULL_BUFFER, 128X64, _SW_SPI, 18, 16, 17, U8X8_PIN_NONE)
```

### Runtime Variant: u8g2_set_font/25px-helvetica
```abs
arduino_loop()
    u8g2_set_font(25, HELV_B, u8g2_font_helvB24_tr)
```

### Runtime Variant: u8x8_begin/hardware-i2c-esp32
```abs
arduino_setup()
    u8x8_begin(SSD1306, 128X64_NONAME, _HW_I2C, SCL, SDA, U8X8_PIN_NONE)
```

### Runtime Variant: u8x8_begin/software-i2c
```abs
arduino_setup()
    u8x8_begin(SSD1306, 128X64_NONAME, _SW_I2C, 13, 11, 8)
```

### Runtime Variant: u8x8_begin/three-wire-hardware-spi
```abs
arduino_setup()
    u8x8_begin(SSD1306, 128X64_NONAME, _3W_HW_SPI, 10, 8)
```

### Runtime Variant: u8x8_begin/three-wire-software-spi
```abs
arduino_setup()
    u8x8_begin(SSD1306, 128X64_NONAME, _3W_SW_SPI, 13, 11, 10, 8)
```

### Runtime Variant: u8x8_begin/four-wire-hardware-spi
```abs
arduino_setup()
    u8x8_begin(SSD1306, 128X64_NONAME, _4W_HW_SPI, 10, 9, 8)
```

### Runtime Variant: u8x8_begin/four-wire-software-spi
```abs
arduino_setup()
    u8x8_begin(SSD1306, 128X64_NONAME, _4W_SW_SPI, 13, 11, 10, 9, 8)
```

### Runtime Variant: u8x8_begin/st7920-hardware-spi
```abs
arduino_setup()
    u8x8_begin(ST7920, 128X64, _HW_SPI, 17, U8X8_PIN_NONE)
```

### Runtime Variant: u8x8_begin/st7920-software-spi
```abs
arduino_setup()
    u8x8_begin(ST7920, 128X64, _SW_SPI, 18, 16, 17, U8X8_PIN_NONE)
```
