# Third-party notices

This package bundles the following upstream Arduino libraries in `src.7z`:

- [Adafruit DHT sensor library 1.4.6](https://github.com/adafruit/DHT-sensor-library/tree/1.4.6), commit `2295fe471c38d5e649a7b68cecccc42193c8e41c`, under the MIT License. The bundled `DHT.h` adds a guarded `ARDUINO_ARCH_CI13XX` fallback for `microsecondsToClockCycles`; all upstream copyright and license headers are retained.
- [Adafruit Unified Sensor 1.1.14](https://github.com/adafruit/Adafruit_Sensor/tree/1.1.14), commit `7b2473b6b24ae340f41685b5f5b2b90ad896db04`, under the Apache License 2.0. The bundled source is unmodified.
- [DHT20 0.3.1](https://github.com/RobTillaart/DHT20/tree/0.3.1) by Rob Tillaart, under the MIT License. Its upstream `LICENSE` remains inside `src.7z`.

The full Adafruit license texts are included in the `LICENSES` directory.
