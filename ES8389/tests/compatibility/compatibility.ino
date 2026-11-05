#include <Arduino.h>
#include <ES8389.h>
#include <ES8389Player.h>
#include "soc/soc_caps.h"

ES8389 audio;
ES8389Player player(audio);

void setup() {
#if !SOC_SDMMC_HOST_SUPPORTED
  // This must be a safe, immediate failure even without audio or storage hardware.
  if (ES8389Player::mountSD()) {
    abort();
  }
#endif
}

void loop() {}
