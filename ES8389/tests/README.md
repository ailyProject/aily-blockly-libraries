# ES8389 compatibility regression

Extract `ES8389/src.7z`, then compile this sketch for both a chip without SDMMC
(ESP32-C3) and one with SDMMC (ESP32-S3):

```sh
7z x ES8389/src.7z -owork/es8389-test
arduino-cli compile --fqbn esp32:esp32:esp32c3 --library work/es8389-test/src/ES8389 ES8389/tests/compatibility
arduino-cli compile --fqbn esp32:esp32:esp32s3 --library work/es8389-test/src/ES8389 ES8389/tests/compatibility
node ES8389/tests/sd_cooldown.test.cjs work/es8389-test/src/ES8389/src/ES8389Player.cpp
```

Both builds must succeed. The original unguarded SDMMC implementation fails the
ESP32-C3 build, even when the sketch does not use SD storage. When run on a chip
without SDMMC, the sketch also checks that `mountSD()` returns `false` without
accessing audio or storage hardware. No hardware is required for the compile
checks; running the sketch on a board is optional.

The Node test samples the supported `mountSD()` branch from the extracted source
and executes its control flow with deterministic storage and time mocks. It
checks failures at zero, even and odd milliseconds, unsigned timer wraparound,
the 3-second retry boundary, and reset of the failure state after success.
