# PCA9685 软件I2C舵机驱动

PCA9685 16 路 PWM 舵机驱动库，使用**软件(位模拟)I2C**：SDA/SCL 可指定**任意 GPIO**，不占用硬件 I2C 外设，也不受开发板默认 I2C 引脚限制。

## Library Info

- **Name**: @aily-project/lib-swi2c-pca9685
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (block.json order) | ABS Format | Generated Code |
|------------|------------|-------------------------------|------------|----------------|
| `swi2c_pca9685_init` | Statement | SDA(input_value), SCL(input_value), ADDR(input_value), FREQ(input_value) | `swi2c_pca9685_init(math_number(17), math_number(18), math_number(64), math_number(50))` | `swi2cPca9685Init((int)(17), (int)(18), (uint8_t)(64), (float)(50));` |
| `swi2c_pca9685_set_angle` | Statement | CH(input_value), ANGLE(input_value) | `swi2c_pca9685_set_angle(math_number(0), math_number(90))` | `swi2cPca9685SetServoAngle((uint8_t)(0), (float)(90));` |
| `swi2c_pca9685_set_all_angle` | Statement | ANGLE(input_value) | `swi2c_pca9685_set_all_angle(math_number(90))` | `swi2cPca9685SetAllServoAngle((float)(90));` |
| `swi2c_pca9685_set_us` | Statement | CH(input_value), US(input_value) | `swi2c_pca9685_set_us(math_number(0), math_number(1500))` | `swi2cPca9685SetServoMicroseconds((uint8_t)(0), (uint16_t)(1500));` |
| `swi2c_pca9685_is_connected` | Value | (无) | `swi2c_pca9685_is_connected()` | `swi2cPca9685IsConnected()` |

## ABS Examples

### 基本用法：初始化并控制舵机

```abs
arduino_setup()
    serial_begin(Serial, 9600)
    swi2c_pca9685_init(math_number(17), math_number(18), math_number(64), math_number(50))
    swi2c_pca9685_set_angle(math_number(0), math_number(90))
    swi2c_pca9685_set_all_angle(math_number(90))

arduino_loop()
    serial_println(Serial, swi2c_pca9685_is_connected())
    time_delay(math_number(1000))
```

### 用变量控制通道与角度

```abs
arduino_global()
    variable_define("num", int, math_number(0))
    variable_define("angle", int, math_number(90))

arduino_setup()
    swi2c_pca9685_init(math_number(17), math_number(18), math_number(64), math_number(50))

arduino_loop()
    swi2c_pca9685_set_angle(variables_get($num), variables_get($angle))
    swi2c_pca9685_set_us(variables_get($num), math_number(1500))
    time_delay(math_number(1000))
```

## Notes

1. **单例驱动**：库内部维护一个全局 PCA9685 实例，`swi2c_pca9685_init` 初始化后其余积木直接使用，无需变量声明。
2. **参数**：
   - SDA/SCL：任意可用 GPIO 编号（数字），两脚不能相同；默认 17/18 仅为示例。
   - ADDR：PCA9685 7 位地址，十进制填写，默认 64（即 0x40；A0-A5 接高电平可改变地址）。
   - FREQ：舵机标准频率 50Hz；角度 0-180° 映射脉宽 500-2500µs，越界自动截断。
3. **接线**：SDA/SCL 需上拉电阻（常见 PCA9685 模块板载 10kΩ 上拉）；舵机电源用外部 5V，与主板**共地**。
4. **返回值**：所有控制块在总线无应答时返回 false 并中止本次写入；可用 `swi2c_pca9685_is_connected` 检测接线。
