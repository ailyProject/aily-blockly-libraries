#include <Swi2cPca9685.h>

static_assert(swi2cPca9685AngleToUs(-1) == 500, "lower angle clamp");
static_assert(swi2cPca9685AngleToUs(0) == 500, "zero angle");
static_assert(swi2cPca9685AngleToUs(90) == 1500, "midpoint");
static_assert(swi2cPca9685AngleToUs(180) == 2500, "maximum angle");
static_assert(swi2cPca9685AngleToUs(181) == 2500, "upper angle clamp");
static_assert(swi2cPca9685Prescale(25) == 243, "25 Hz divider");
static_assert(swi2cPca9685Prescale(50) == 121, "50 Hz divider");
static_assert(swi2cPca9685Prescale(100) == 60, "100 Hz divider");
static_assert(swi2cPca9685Prescale(1) == 255, "minimum frequency clamp");
static_assert(swi2cPca9685Prescale(10000) == 3, "maximum frequency clamp");
static_assert(swi2cPca9685UsToTicks(1500) == 307, "50 Hz pulse");
static_assert(swi2cPca9685UsToTicks(1500, swi2cPca9685Prescale(100)) == 614, "100 Hz pulse");
static_assert(swi2cPca9685UsToTicks(1500, swi2cPca9685Prescale(25)) == 153, "25 Hz pulse");
void setup() {}
void loop() {}
