# M5Stack Onboard RS485

Fixed-pin RS485 access for Station, Tough and Tab5.

- Station: RX GPIO3, TX GPIO1, DIR GPIO2; the interface shares UART0 with USB serial by hardware design.
- Tough: RX GPIO27, TX GPIO19; the onboard circuit handles direction automatically.
- Tab5: RX GPIO21, TX GPIO20, DIR GPIO34.

Direction is switched automatically around writes.
