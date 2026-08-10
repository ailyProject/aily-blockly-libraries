# Cubic Core Car Library

Cubic Core LEGO car all-in-one library: PS3 controller, I2C 4-motor drive, encoder motors, servos, lights and OLED with a motor-priority shared-I2C arbitration.

## Library Info
- **Name**: @aily-project/lib-cubic_core_car
- **Version**: 1.0.0

Cubic Core LEGO car all-in-one library. Fixed pins for the Cubic Core mainboard. Self-contained (raw Wire motor protocol + LEDC encoder motors + ESP32Servo + U8g2); external deps: Ps3Controller, ESP32Servo, U8g2lib.

### Shared-I2C arbitration
OLED (SSD1306) and the I2C motor board share SDA=21/SCL=22. Motor-priority policy: encoder motors use LEDC PWM (bus-independent); I2C motor commands are 3 bytes and latched by the board; OLED refresh is chunked via `cubic_oled_refresh_stream` (1/8 screen per call, ~1.5ms) so motors stay real-time. Use `cubic_oled_refresh_full` only for static/boot screens.

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `cubic_init` | Statement | PPR(input_value), RED(input_value), M0PH(dropdown), M1PH(dropdown) | `cubic_init(value, value, "em::EncoderMotor::kAPhaseLeads", "em::EncoderMotor::kAPhaseLeads")` | Dynamic code |
| `cubic_ps3_begin` | Statement | MAC(input_value) | `cubic_ps3_begin(value)` | Dynamic code |
| `cubic_ps3_connected` | Value | (none) | `cubic_ps3_connected()` | Dynamic code |
| `cubic_on_connect` | Statement | DO(statement) | `cubic_on_connect({...})` | Dynamic code |
| `cubic_on_disconnect` | Statement | DO(statement) | `cubic_on_disconnect({...})` | Dynamic code |
| `cubic_stick` | Value | STICK(dropdown), AXIS(dropdown) | `cubic_stick("l", "y")` | Dynamic code |
| `cubic_button` | Value | BTN(dropdown) | `cubic_button("cross")` | Dynamic code |
| `cubic_button_pressed` | Value | BTN(dropdown) | `cubic_button_pressed("cross")` | Dynamic code |
| `cubic_rumble` | Statement | POWER(input_value), MS(input_value) | `cubic_rumble(value, value)` | Dynamic code |
| `cubic_i2c_motor` | Statement | M(dropdown), DIR(dropdown), SPD(input_value) | `cubic_i2c_motor("0", "0", value)` | Dynamic code |
| `cubic_i2c_all` | Statement | DIR(dropdown), SPD(input_value) | `cubic_i2c_all("0", value)` | Dynamic code |
| `cubic_stop_all` | Statement | (none) | `cubic_stop_all()` | Dynamic code |
| `cubic_enc_run_pwm` | Statement | M(dropdown), PWM(input_value) | `cubic_enc_run_pwm("0", value)` | Dynamic code |
| `cubic_enc_run_speed` | Statement | M(dropdown), RPM(input_value) | `cubic_enc_run_speed("0", value)` | Dynamic code |
| `cubic_enc_stop` | Statement | M(dropdown) | `cubic_enc_stop("0")` | Dynamic code |
| `cubic_enc_speed` | Value | M(dropdown) | `cubic_enc_speed("0")` | Dynamic code |
| `cubic_enc_pulse` | Value | M(dropdown) | `cubic_enc_pulse("0")` | Dynamic code |
| `cubic_enc_revolutions` | Value | M(dropdown) | `cubic_enc_revolutions("0")` | Dynamic code |
| `cubic_enc_reset` | Statement | M(dropdown) | `cubic_enc_reset("0")` | Dynamic code |
| `cubic_enc_pid` | Statement | M(dropdown), P(input_value), I(input_value), D(input_value) | `cubic_enc_pid("0", value, value, value)` | Dynamic code |
| `cubic_servo` | Statement | S(dropdown), ANGLE(input_value) | `cubic_servo("1", value)` | Dynamic code |
| `cubic_servo_all` | Statement | ANGLE(input_value) | `cubic_servo_all(value)` | Dynamic code |
| `cubic_servo_center` | Statement | (none) | `cubic_servo_center()` | Dynamic code |
| `cubic_oled_clear` | Statement | (none) | `cubic_oled_clear()` | Dynamic code |
| `cubic_oled_text` | Statement | X(input_value), Y(input_value), TEXT(input_value) | `cubic_oled_text(value, value, value)` | Dynamic code |
| `cubic_oled_refresh_full` | Statement | (none) | `cubic_oled_refresh_full()` | Dynamic code |
| `cubic_oled_refresh_stream` | Statement | (none) | `cubic_oled_refresh_stream()` | Dynamic code |
| `cubic_oled_logo` | Statement | (none) | `cubic_oled_logo()` | Dynamic code |
| `cubic_set_deadzone` | Statement | VAL(input_value) | `cubic_set_deadzone(value)` | Dynamic code |
| `cubic_invert_axis` | Statement | AXIS(dropdown), MODE(dropdown) | `cubic_invert_axis("LY", "-1")` | Dynamic code |
| `cubic_oled_pixel` | Statement | X(input_value), Y(input_value) | `cubic_oled_pixel(value, value)` | Dynamic code |
| `cubic_oled_line` | Statement | X1(input_value), Y1(input_value), X2(input_value), Y2(input_value) | `cubic_oled_line(value, value, value, value)` | Dynamic code |
| `cubic_oled_rect` | Statement | X(input_value), Y(input_value), W(input_value), H(input_value), FILL(dropdown) | `cubic_oled_rect(value, value, value, value, "0")` | Dynamic code |
| `cubic_oled_circle` | Statement | X(input_value), Y(input_value), R(input_value), FILL(dropdown) | `cubic_oled_circle(value, value, value, "0")` | Dynamic code |
| `cubic_oled_num` | Statement | X(input_value), Y(input_value), NUM(input_value) | `cubic_oled_num(value, value, value)` | Dynamic code |
| `cubic_oled_font` | Statement | SIZE(dropdown) | `cubic_oled_font("s")` | Dynamic code |
| `cubic_oled_color` | Statement | COLOR(dropdown) | `cubic_oled_color("1")` | Dynamic code |
| `cubic_oled_contrast` | Statement | VAL(input_value) | `cubic_oled_contrast(value)` | Dynamic code |
| `cubic_oled_power` | Statement | MODE(dropdown) | `cubic_oled_power("0")` | Dynamic code |
| `cubic_oled_flip` | Statement | MODE(dropdown) | `cubic_oled_flip("1")` | Dynamic code |
| `cubic_key` | Value | KEY(dropdown) | `cubic_key("1")` | Dynamic code |
| `cubic_key_pressed` | Value | KEY(dropdown) | `cubic_key_pressed("1")` | Dynamic code |
| `cubic_battery` | Value | (none) | `cubic_battery()` | Dynamic code |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| M0PH | em::EncoderMotor::kAPhaseLeads, em::EncoderMotor::kBPhaseLeads | cubic_init |
| M1PH | em::EncoderMotor::kAPhaseLeads, em::EncoderMotor::kBPhaseLeads | cubic_init |
| STICK | l, r | cubic_stick |
| AXIS | y, x | cubic_stick |
| BTN | cross, circle, triangle, square, l1, r1, l2, r2, up, down, left, right, select, start, ps | cubic_button |
| BTN | cross, circle, triangle, square, l1, r1, l2, r2, up, down, left, right, select, start, ps | cubic_button_pressed |
| M | 0, 1, 2, 3 | cubic_i2c_motor |
| DIR | 0, 1 | cubic_i2c_motor |
| DIR | 0, 1 | cubic_i2c_all |
| M | 0, 1 | cubic_enc_run_pwm |
| M | 0, 1 | cubic_enc_run_speed |
| M | 0, 1 | cubic_enc_stop |
| M | 0, 1 | cubic_enc_speed |
| M | 0, 1 | cubic_enc_pulse |
| M | 0, 1 | cubic_enc_revolutions |
| M | 0, 1 | cubic_enc_reset |
| M | 0, 1 | cubic_enc_pid |
| S | 1, 2, 3, 4 | cubic_servo |
| AXIS | LY, LX, RY, RX | cubic_invert_axis |
| MODE | -1, 1 | cubic_invert_axis |
| FILL | 0, 1 | cubic_oled_rect |
| FILL | 0, 1 | cubic_oled_circle |
| SIZE | s, m, l | cubic_oled_font |
| COLOR | 1, 0, 2 | cubic_oled_color |
| MODE | 0, 1 | cubic_oled_power |
| MODE | 1, 0 | cubic_oled_flip |
| KEY | 1, 2, 3 | cubic_key |
| KEY | 1, 2, 3 | cubic_key_pressed |

