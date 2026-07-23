# Paper Onboard Sensors

Fixed onboard access for Paper's SHT30 temperature/humidity sensor and 256-byte FM24C02 FRAM.

The SHT30 wrapper comes from M5Stack's official M5Unit-ENV library. All devices use the documented internal I2C bus on GPIO21/22; SHT30 is 0x44 and FRAM is 0x50.
