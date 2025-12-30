/**
 * @file motor.cpp
 */

#include "motor.h"

#include <Arduino.h>

namespace em {

#if ESP_ARDUINO_VERSION >= ESP_ARDUINO_VERSION_VAL(3, 0, 0)
Motor::Motor(const uint8_t positive_pin, const uint8_t negative_pin)
    : positive_pin_(positive_pin), negative_pin_(negative_pin) {
}
#endif

Motor::Motor(const uint8_t positive_pin,
             const uint8_t positive_pin_ledc_channel,
             const uint8_t negative_pin,
             const uint8_t negative_pin_ledc_channel)
    : positive_pin_(positive_pin),
      negative_pin_(negative_pin),
      positive_pin_ledc_channel_(positive_pin_ledc_channel),
      negative_pin_ledc_channel_(negative_pin_ledc_channel) {
}

void Motor::Init() {
#if ESP_ARDUINO_VERSION >= ESP_ARDUINO_VERSION_VAL(3, 0, 0)
  if (positive_pin_ledc_channel_ != 0xFF) {
    ledcAttachChannel(positive_pin_, kPwmFrequency, kPwmResolution, positive_pin_ledc_channel_);
  } else {
    ledcAttach(positive_pin_, kPwmFrequency, kPwmResolution);
  }

  if (negative_pin_ledc_channel_ != 0xFF) {
    ledcAttachChannel(negative_pin_, kPwmFrequency, kPwmResolution, negative_pin_ledc_channel_);
  } else {
    ledcAttach(negative_pin_, kPwmFrequency, kPwmResolution);
  }
#else
  ledcSetup(positive_pin_ledc_channel_, kPwmFrequency, kPwmResolution);
  ledcSetup(negative_pin_ledc_channel_, kPwmFrequency, kPwmResolution);
  ledcAttachPin(positive_pin_, positive_pin_ledc_channel_);
  ledcAttachPin(negative_pin_, negative_pin_ledc_channel_);
#endif
  Stop();
}

void Motor::RunPwmDuty(const int16_t pwm_duty) {
  pwm_duty_ = constrain(pwm_duty, -kMaxPwmDuty, kMaxPwmDuty);
  if (pwm_duty_ >= 0) {
#if ESP_ARDUINO_VERSION >= ESP_ARDUINO_VERSION_VAL(3, 0, 0)
    ledcWrite(positive_pin_, pwm_duty_);
    ledcWrite(negative_pin_, 0);
#else
    ledcWrite(positive_pin_ledc_channel_, pwm_duty_);
    ledcWrite(negative_pin_ledc_channel_, 0);
#endif
  } else {
#if ESP_ARDUINO_VERSION >= ESP_ARDUINO_VERSION_VAL(3, 0, 0)
    ledcWrite(positive_pin_, 0);
    ledcWrite(negative_pin_, -pwm_duty_);
#else
    ledcWrite(positive_pin_ledc_channel_, 0);
    ledcWrite(negative_pin_ledc_channel_, -pwm_duty_);
#endif
  }
}

int16_t Motor::PwmDuty() const {
  return pwm_duty_;
}

void Motor::Stop() {
  pwm_duty_ = 0;
#if ESP_ARDUINO_VERSION >= ESP_ARDUINO_VERSION_VAL(3, 0, 0)
  ledcWrite(positive_pin_, kMaxPwmDuty);
  ledcWrite(negative_pin_, kMaxPwmDuty);
#else
  ledcWrite(positive_pin_ledc_channel_, kMaxPwmDuty);
  ledcWrite(negative_pin_ledc_channel_, kMaxPwmDuty);
#endif
}

}  // namespace em