#pragma once

#ifndef _EM_MOTOR_H_
#define _EM_MOTOR_H_

/**
 * @file motor.h
 */

#include <WString.h>

#include <cstdint>

#include "esp_arduino_version.h"

namespace em {
/**
 * @~Chinese
 * @class Motor
 * @brief 两路PWM电机驱动类
 */
/**
 * @~English
 * @class Motor
 * @brief A two-channel PWM motor driver class.
 */
class Motor {
 public:
  /**
   * @~Chinese
   * @brief PWM的分辨率，决定了PWM占空比可调节的精细程度，单位为位，这里设置为10位。
   */
  /**
   * @~English
   * @brief The resolution of PWM, which determines the fine-tuning level of the PWM duty cycle, in bits. Here it is set to 10
   * bits.
   */
  static constexpr uint8_t kPwmResolution = 10;
  /**
   * @~Chinese
   * @brief PWM的频率，单位为赫兹，这里设置为75000赫兹，用于控制电机驱动的PWM信号频率。
   */
  /**
   * @~English
   * @brief The frequency of PWM, in Hertz. Here it is set to 75000 Hz, used to control the frequency of the PWM signal for
   * motor driving.
   */
  static constexpr uint8_t kPwmFrequency = 75000;

  static_assert(kPwmResolution > 1);
  /**
   * @~Chinese
   * @brief 根据PWM分辨率计算出的最大PWM占空比数值。
   */
  /**
   * @~English
   * @brief The maximum PWM duty cycle value calculated based on the PWM resolution.
   */
  static constexpr int16_t kMaxPwmDuty = (1 << kPwmResolution) - 1;

  /**
   * @~Chinese
   * @brief 构造函数，用于创建一个 Motor 对象。
   * @note 该构造函数仅在ESP32 Arduino Core版本大于等于3.0.0时有效，3.0.0以下版本请使用 @ref Motor(const uint8_t, const
   * uint8_t, const uint8_t, const uint8_t)
   * @param[in] positive_pin 电机正极引脚编号。
   * @param[in] negative_pin 电机负极引脚编号。
   */
  /**
   * @~English
   * @brief Constructor for creating an Motor object.
   * @note This constructor is only valid when the ESP32 Arduino Core version is greater than or equal to 3.0.0. For versions
   * below 3.0.0, please use @ref Motor(const uint8_t, const uint8_t, const uint8_t, const uint8_t)
   * @param[in] positive_pin The pin number of the motor's positive pole.
   * @param[in] negative_pin The pin number of the motor's negative pole.
   */
  explicit Motor(const uint8_t positive_pin, const uint8_t negative_pin);

  /**
   * @~Chinese
   * @brief 构造函数，用于创建一个 Motor 对象。
   * @note 此类会使用ESP32的LED Control (LEDC)产生PWM波形驱动电机，在ESP32 Arduino Core版本小于3.0.0时，ESP32 Arduino
   * Core不会管理LEDC通道，需要用户指定每个引脚对应的LEDC通道，
   * 所以必须使用该构造函数构造对象，并指定电机正负极引脚对应的LEDC通道，每个pin只能对应一个LEDC通道，请勿重复使用LEDC通道，关于LEDC的说明请查阅官网：
   * @ref https://docs.espressif.com/projects/arduino-esp32/en/latest/api/ledc.html
   * @param[in] positive_pin 电机正极引脚编号。
   * @param[in] positive_pin_ledc_channel 电机正极引脚对应的LED Control
   * (LEDC)通道，共16个，范围0~15，每个pin只能对应一个通道，详情请查阅官方文档： @ref
   * https://docs.espressif.com/projects/arduino-esp32/en/latest/api/ledc.html
   * @param[in] negative_pin 电机负极引脚编号。
   * @param[in] negative_pin_ledc_channel 电机负极引脚对应的LED Control
   * (LEDC)通道，共16个，范围0~15，每个pin只能对应一个通道，详情请查阅官方文档： @ref
   * https://docs.espressif.com/projects/arduino-esp32/en/latest/api/ledc.html
   */
  /**
   * @~English
   * @brief Constructor for creating an Motor object.
   * @note This class will use the LED Control (LEDC) of ESP32 to generate PWM waveforms to driver the motor. When the ESP32
   * Arduino Core version is less than 3.0.0, the ESP32 Arduino Core will not manage the LEDC channels, and the user needs to
   * specify the LEDC channels corresponding to each pin. Therefore, it is necessary to use this constructor to construct the
   * object and specify the LEDC channels corresponding to the positive and negative pins of the motor. Each pin can only
   * correspond to one LEDC channel, and please do not reuse the LEDC channels. For the description of LEDC, please refer to the
   * official website:
   * @ref https://docs.espressif.com/projects/arduino-esp32/en/latest/api/ledc.html
   * @param[in] positive_pin The pin number of the motor's positive pole.
   * @param[in] positive_pin_ledc_channel The LED Control (LEDC) channel corresponding to the motor's positive pole pin, which
   * has a total of 16 channels ranging from 0 to 15. Each pin can only correspond to one channel and is used to configure
   * functions such as the PWM (Pulse Width Modulation) signal related to the positive pole pin of the motor. For more details,
   * please refer to the official documentation: @ref https://docs.espressif.com/projects/arduino-esp32/en/latest/api/ledc.html
   * @param[in] negative_pin The pin number of the motor's negative pole.
   * @param[in] negative_pin_ledc_channel The LED Control (LEDC) channel corresponding to the motor's negative pole pin, which
   * has a total of 16 channels ranging from 0 to 15. Each pin can only correspond to one channel and is used to configure
   * functions such as the PWM (Pulse Width Modulation) signal related to the negative pole pin of the motor. For more details,
   * please refer to the official documentation: @ref https://docs.espressif.com/projects/arduino-esp32/en/latest/api/ledc.html
   */
  explicit Motor(const uint8_t positive_pin,
                 const uint8_t positive_pin_ledc_channel,
                 const uint8_t negative_pin,
                 const uint8_t negative_pin_ledc_channel);

  ~Motor() = default;

  /**
   * @~Chinese
   * @brief 初始化。
   */
  /**
   * @~English
   * @brief Initialize.
   */
  void Init();

  /**
   * @~Chinese
   * @brief 直接设置电机的PWM占空比。
   * @param[in] pwm_duty PWM占空比（取值范围 -1023到1023）。正数代表正转，负数代表反转。
   */
  /**
   * @~English
   * @brief Set motor PWM directly.
   * @param[in] pwm_duty The duty cycle of PWM (the value range is from -1023 to 1023). A positive number represents forward
   * rotation, and a negative number represents revers
   * e rotation.
   */
  void RunPwmDuty(const int16_t pwm_duty);

  /**
   * @~Chinese
   * @brief 获取电机驱动器的PWM占空比。
   * @return PWM占空比（取值范围 -1023到1023）。正数代表正转，负数代表反转。
   */
  /**
   * @~English
   * @brief Get the PWM pwm_duty cycle of the motor driver.
   * @return The duty cycle of PWM (the value range is from -1023 to 1023). A positive number represents forward
   * rotation, and a negative number represents reverse rotation.
   */
  int16_t PwmDuty() const;

  /**
   * @~Chinese
   * @brief 停止电机运行。
   */
  /**
   * @~English
   * @brief Stop motor.
   */
  void Stop();

 private:
  const uint8_t positive_pin_ = 0xFF;
  const uint8_t negative_pin_ = 0xFF;
  const uint8_t positive_pin_ledc_channel_ = 0xFF;
  const uint8_t negative_pin_ledc_channel_ = 0xFF;
  int16_t pwm_duty_ = 0;
};
}  // namespace em

#endif