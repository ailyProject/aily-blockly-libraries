# TCA9548A 8路I2C集线器

8通道I2C多路复用器，解决I2C地址冲突，可扩展到8路独立I2C总线。

## Library Info
- **Name**: @aily-project/lib-seeed-tca9548a
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `tca9548a_init` | Statement | ADDRESS(dropdown) | `tca9548a_init(0x70)` | `Wire.begin(); tca9548a_mux.begin(Wire, 0x70);` |
| `tca9548a_open_channel` | Statement | CHANNEL(dropdown) | `tca9548a_open_channel(TCA_CHANNEL_0)` | `tca9548a_mux.openChannel(TCA_CHANNEL_0);` |
| `tca9548a_close_channel` | Statement | CHANNEL(dropdown) | `tca9548a_close_channel(TCA_CHANNEL_0)` | `tca9548a_mux.closeChannel(TCA_CHANNEL_0);` |
| `tca9548a_close_all` | Statement | — | `tca9548a_close_all()` | `tca9548a_mux.closeAll();` |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| ADDRESS | 0x70~0x77 | I2C地址（由A0/A1/A2引脚决定） |
| CHANNEL | TCA_CHANNEL_0 ~ TCA_CHANNEL_7 | 通道编号 |

## ABS Examples

```
arduino_setup()
    tca9548a_init(0x70)

arduino_loop()
    tca9548a_open_channel(TCA_CHANNEL_0)
    // 操作通道0上的设备...
    tca9548a_close_all()
    tca9548a_open_channel(TCA_CHANNEL_1)
    // 操作通道1上的设备...
    tca9548a_close_all()
```

## Notes

1. **全局对象**: 使用固定名称 `tca9548a_mux`
2. **使用模式**: 打开通道 → 操作设备 → 关闭（建议操作完后closeAll）
3. **多个集线器**: 可通过不同I2C地址级联多个TCA9548A
