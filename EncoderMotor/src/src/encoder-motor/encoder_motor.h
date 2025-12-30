#pragma once

#ifndef _EM_ENCODER_MOTOR_H_
#define _EM_ENCODER_MOTOR_H_

/**
 * @file encoder_motor.h
 */

#include <WString.h>

#include <atomic>
#include <chrono>
#include <condition_variable>
#include <cstdint>
#include <mutex>
#include <thread>

#include "esp_arduino_version.h"
#include "motor.h"

/**
 * @namespace em
 */
namespace em {
/**
 * @~Chinese
 * @class EncoderMotor
 * @brief 编码电机驱动类
 * @details 该类主要功能如下：
 * -# 支持编码器输出信号为A、B两相且A、B两通道信号序列相位差为90度的编码电机。
 * -# 支持以指定的速度（RPM）驱动电机运转，或者以指定的PWM占空比直接驱动电机。
 * -# 支持获取电机当前的转速信息，单位为RPM。
 * -# 支持获取编码脉冲计数值，此计数值在A相下降沿进行更新，电机正转时计数值加1，反转时减1。
 * -# 支持获取电机驱动器当前设置的PWM占空比。
 */
/**
 * @~English
 * @class EncoderMotor
 * @brief Encoder Motor Class
 * @details The main functions of this class are as follows:
 * -# Supports encoded motors with encoder output signals of A and B phases and a phase difference of 90 degrees
 * between the signal sequences of A and B channels.
 * -# Supports driving the motor at a specified speed (RPM) or directly driving the motor with a specified PWM duty cycle.
 * -# Supports obtaining the current speed information of the motor in RPM.
 * -# Supports obtaining the encoder pulse count value. This count value is updated at the falling edge of phase A, incremented
 * by 1 during forward rotation and decremented by 1 during reverse rotation.
 * -# Supports obtaining the PWM duty cycle currently set on the motor driver.
 */
class EncoderMotor {
 public:
  /**
   * @~Chinese
   * @brief 用于明确电机正转时编码器AB相的相位关系，以便在脉冲计数及后续速度计算等操作中依据正确的相位关系进行处理。
   */
  /**
   * @~English
   * @brief Used to clarify the phase relationship between phase A and phase B of the encoder when the motor is rotating
   * forward, so that the correct phase relationship can be used in operations such as pulse counting and subsequent speed
   * calculation.
   */
  enum PhaseRelation : uint8_t {
    /**
     * @~Chinese
     * @brief 表示电机正转时A相领先于B相。
     */
    /**
     * @~English
     * @brief Represents the situation where phase A leads phase B when the motor is rotating forward.
     */
    kAPhaseLeads,

    /**
     * @~Chinese
     * @brief 表示电机正转时B相领先于A相。
     */
    /**
     * @~English
     * @brief Represents the situation where phase B leads phase A when the motor is rotating forward.
     */
    kBPhaseLeads,
  };

  /**
   * @~Chinese
   * @brief 构造函数，用于创建一个 EncoderMotor 对象。
   * @note 该构造函数仅在ESP32 Arduino Core版本大于等于3.0.0时有效，3.0.0以下版本请使用 @ref EncoderMotor(const uint8_t,
   * const uint8_t, const uint8_t, const uint8_t, const uint8_t, const uint8_t, const uint32_t, const uint32_t, const
   * PhaseRelation)
   * @param[in] positive_pin 电机正极引脚编号。
   * @param[in] negative_pin 电机负极引脚编号。
   * @param[in] a_pin 编码器A相引脚编号。
   * @param[in] b_pin 编码器B相引脚编号。
   * @param[in] ppr 每转脉冲数。
   * @param[in] reduction_ration 减速比。
   * @param[in] phase_relation 相位关系（A相领先或B相领先，指电机正转时的情况），参数说明请查阅： @ref PhaseRelation 。
   * @details
   * 如果用户不清楚自己所使用的编码电机的phase_relation参数具体取值，可以使用示例程序 @ref detect_phase_relation.ino
   * 来帮助检测确定该参数的值。
   */
  /**
   * @~English
   * @brief Constructor for creating an EncoderMotor object.
   * @note This constructor is only valid when the ESP32 Arduino Core version is greater than or equal to 3.0.0. For versions
   * below 3.0.0, please use @ref EncoderMotor(const uint8_t, const uint8_t, const uint8_t, const uint8_t, const uint8_t, const
   * uint8_t, const uint32_t, const uint32_t, const PhaseRelation)
   * @param[in] positive_pin The pin number of the motor's positive pole.
   * @param[in] negative_pin The pin number of the motor's negative pole.
   * @param[in] a_pin The pin number of the encoder's A phase.
   * @param[in] b_pin The pin number of the encoder's B phase.
   * @param[in] ppr Pulses per revolution.
   * @param[in] reduction_ration Reduction ratio.
   * @param[in] phase_relation Phase relationship (A phase leads or B phase leads, referring to the situation when the motor is
   * rotating forward), @ref PhaseRelation.
   * @details
   * If the user is unsure about the value of the phase_relation parameter for the encoded motor they are using, they
   * can use the example program @ref detect_phase_relation.ino to help detect and determine the value of this parameter.
   */
  EncoderMotor(const uint8_t positive_pin,
               const uint8_t negative_pin,
               const uint8_t a_pin,
               const uint8_t b_pin,
               const uint32_t ppr,
               const uint32_t reduction_ration,
               const PhaseRelation phase_relation);
  /**
   * @~Chinese
   * @brief 构造函数，用于创建一个 EncoderMotor 对象。
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
   * @param[in] a_pin 编码器A相引脚编号。
   * @param[in] b_pin 编码器B相引脚编号。
   * @param[in] ppr 每转脉冲数。
   * @param[in] reduction_ration 减速比。
   * @param[in] phase_relation 相位关系（A相领先或B相领先，指电机正转时的情况），参数说明请查阅： @ref PhaseRelation 。
   * @details
   * 如果用户不清楚自己所使用的编码电机的phase_relation参数具体取值，可以使用示例程序 @ref detect_phase_relation.ino
   * 来帮助检测确定该参数的值。
   */
  /**
   * @~English
   * @brief Constructor for creating an EncoderMotor object.
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
   * @param[in] a_pin The pin number of the encoder's A phase.
   * @param[in] b_pin The pin number of the encoder's B phase.
   * @param[in] ppr Pulses per revolution.
   * @param[in] reduction_ration Reduction ratio.
   * @param[in] phase_relation Phase relationship (A phase leads or B phase leads, referring to the situation when the motor is
   * rotating forward), @ref PhaseRelation.
   * @details
   * If the user is unsure about the value of the phase_relation parameter for the encoded motor they are using, they
   * can use the example program @ref detect_phase_relation.ino to help detect and determine the value of this parameter.
   */
  EncoderMotor(const uint8_t positive_pin,
               const uint8_t positive_pin_ledc_channel,
               const uint8_t negative_pin,
               const uint8_t negative_pin_ledc_channel,
               const uint8_t a_pin,
               const uint8_t b_pin,
               const uint32_t ppr,
               const uint32_t reduction_ration,
               const PhaseRelation phase_relation);

  ~EncoderMotor();

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
   * @brief 使用给定的比例（P）、积分（I）、微分（D）参数值来设置速度PID控制器的参数。
   * @param[in] p 比例系数（P）的值。
   * @param[in] i 积分系数（I）的值。
   * @param[in] d 微分系数（D）的值。
   */
  /**
   * @~English
   * @brief Set the parameters of the speed PID controller with the given Proportional (P), Integral (I), and Derivative (D)
   * parameter values.
   * @param[in] p The value of the Proportional coefficient (P).
   * @param[in] i The value of the Integral coefficient (I).
   * @param[in] d The value of the Derivative coefficient (D).
   */
  void SetSpeedPid(const float p, const float i, const float d);

  /**
   * @~Chinese
   * @brief 通过指针获取速度PID控制器的比例（P）、积分（I）、微分（D）参数值。
   * @param[out] p 用于获取比例系数（P）值的指针，函数执行后该指针指向的内存位置将存储对应的参数值。
   * @param[out] i 用于获取积分系数（I）值的指针，函数执行后该指针指向的内存位置将存储对应的参数值。
   * @param[out] d 用于获取微分系数（D）值的指针，函数执行后该指针指向的内存位置将存储对应的参数值。
   */
  /**
   * @~English
   * @brief Get the Proportional (P), Integral (I), and Derivative (D) parameter values of the speed PID controller through
   * pointers.
   * @param[out] p Pointer used to get the value of the Proportional coefficient (P). After the function is executed, the memory
   * location pointed to by this pointer will store the corresponding parameter value.
   * @param[out] i Pointer used to get the value of the Integral coefficient (I). After the function is executed, the memory
   * location pointed to by this pointer will store the corresponding parameter value.
   * @param[out] d Pointer used to get the value of the Derivative coefficient (D). After the function is executed, the memory
   * location pointed to by this pointer will store the corresponding parameter value.
   */
  void GetSpeedPid(float* const p, float* const i, float* const d) const;

  /**
   * @~Chinese
   * @brief 直接设置电机的PWM占空比。
   * @param[in] pwm_duty PWM占空比（取值范围 -1023到1023）。正数代表正转，负数代表反转。
   */
  /**
   * @~English
   * @brief Set motor PWM directly.
   * @param[in] pwm_duty The duty cycle of PWM (the value range is from -1023 to 1023). A positive number represents forward
   * rotation, and a negative number represents reverse rotation.
   */
  void RunPwmDuty(const int16_t pwm_duty);

  /**
   * @~Chinese
   * @brief 以设定的速度值（RPM）运行电机。
   * @param[in] speed_rpm 速度设定值（RPM）。
   */
  /**
   * @~English
   * @brief Run motor at speed setpoint.
   * @param[in] speed_rpm Speed setpoint(RPM).
   */
  void RunSpeed(const int16_t speed_rpm);

  /**
   * @~Chinese
   * @brief 停止电机运行。
   */
  /**
   * @~English
   * @brief Stop motor.
   */
  void Stop();

  /**
   * @~Chinese
   * @brief 获取编码器脉冲计数。该计数值是在A相下降沿的时候计数，如果是正转会加一，反转则减一。
   * @return 编码器脉冲数。
   */
  /**
   * @~English
   * @brief Get encoder pulse count. The count value is incremented by one during forward rotation and decremented by one during
   * reverse rotation, counted at the falling edge of phase A.
   * @return int32_t Encoder pulses.
   */
  int64_t EncoderPulseCount() const;

  /**
   * @~Chinese
   * @brief 重置编码器脉冲计数为0
   */
  /**
   * @~English
   * @brief Reset the encoder pulse count to 0
   */
  void ResetPulseCount();

  /**
   * @~Chinese
   * @brief 获取电机转动的圈数。
   * @return 电机转动的圈数，正数表示正转，负数表示反转。
   * @details 圈数 = 编码器脉冲计数 / (PPR × 减速比)
   */
  /**
   * @~English
   * @brief Get the number of revolutions of the motor.
   * @return The number of revolutions of the motor. A positive number represents forward rotation, and a negative number represents reverse rotation.
   * @details Revolutions = Encoder pulse count / (PPR × Reduction ratio)
   */
  double GetRevolutions() const;

  /**
   * @~Chinese
   * @brief 获取电机当前的转速（RPM）。
   * @return 电机当前的转速（RPM）。
   */
  /**
   * @~English
   * @brief Get the current speed of the motor.
   * @return The current speed of the motor in RPM.
   */
  int32_t SpeedRpm() const;

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
   * @brief 获取电机的目标转速（RPM）。
   * @return 电机的目标转速（RPM）。
   */
  /**
   * @~English
   * @brief Get the target speed of the motor in RPM.
   * @return The target speed of the motor in RPM.
   */
  int32_t TargetRpm() const;

 private:
  static void OnPinAFalling(void* self);

  void OnPinAFalling();

  void UpdateRpm();

  void Driving();

  void DeleteThread(std::thread*& thread);

  struct Pid {
    float p = 0.0;
    float i = 0.0;
    float d = 0.0;
    float integral = 0.0;
    float max_integral = 0.0;
  };

  mutable std::mutex mutex_;
  std::condition_variable condition_;
  std::thread* update_rpm_thread_ = nullptr;
  std::thread* driving_thread_ = nullptr;
  Motor motor_driver_;
  const uint8_t pin_a_ = 0;
  const uint8_t pin_b_ = 0;
  const double total_ppr_ = 0;
  const uint8_t b_level_at_a_falling_edge_ = 0;
  Pid rpm_pid_;
  int64_t previous_pulse_count_ = 0;
  std::atomic<int64_t> pulse_count_;
  std::chrono::system_clock::time_point last_update_speed_time_ = std::chrono::time_point<std::chrono::system_clock>::min();
  int32_t speed_rpm_ = 0;
  int32_t target_speed_rpm_ = 0.0;
  bool drive_ = false;
};
}  // namespace em

#endif