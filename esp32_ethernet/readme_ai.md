# ESP32 Ethernet

ESP32 Ethernet interface, supports built-in EMAC and SPI Ethernet (W5500, etc.)

## Library Info
- **Name**: @aily-project/lib-esp32-ethernet
- **Version**: 0.0.1

## Block Definitions

| Block Type | Connection | Parameters (args0 order) | ABS Format | Generated Code |
|------------|------------|--------------------------|------------|----------------|
| `esp32_eth_begin` | Statement | PHY_TYPE(dropdown), ADDR(input_value) | `esp32_eth_begin(ETH_PHY_LAN8720, math_number(0))` | ETH.begin( |
| `esp32_eth_begin_spi` | Statement | PHY_TYPE(dropdown), CS(input_value), IRQ(input_value), RST(input_value) | `esp32_eth_begin_spi(ETH_PHY_W5500, math_number(0), math_number(0), math_number(0))` | ETH.begin( |
| `esp32_eth_connected` | Value | (none) | `esp32_eth_connected()` | ETH.connected() |
| `esp32_eth_local_ip` | Value | (none) | `esp32_eth_local_ip()` | ETH.localIP().toString() |
| `esp32_eth_mac` | Value | (none) | `esp32_eth_mac()` | ETH.macAddress() |
| `esp32_eth_full_duplex` | Value | (none) | `esp32_eth_full_duplex()` | ETH.fullDuplex() |
| `esp32_eth_link_speed` | Value | (none) | `esp32_eth_link_speed()` | ETH.linkSpeed() |

## Parameter Options

| Parameter | Values | Description |
|-----------|--------|-------------|
| PHY_TYPE | ETH_PHY_LAN8720, ETH_PHY_TLK110, ETH_PHY_RTL8201, ETH_PHY_DP83848, ETH_PHY_KSZ8041, ETH_PHY_KSZ8081, ETH_PHY_W5500, ETH_PHY_DM9051 | esp32_eth_begin |
| PHY_TYPE | ETH_PHY_W5500, ETH_PHY_DM9051 | esp32_eth_begin_spi |

## ABS Examples

### Basic Usage
```
arduino_setup()
    esp32_eth_begin(ETH_PHY_LAN8720, math_number(0))
    serial_begin(Serial, 9600)

arduino_loop()
    serial_println(Serial, esp32_eth_connected())
    time_delay(math_number(1000))
```

## Notes

1. **Parameter order**: ABS parameters follow `block.json` args order.
2. **Input values**: use `math_number(n)`, `text("s")`, `logic_boolean(TRUE/FALSE)`, variables, or nested value blocks.
