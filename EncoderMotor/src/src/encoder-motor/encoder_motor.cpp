/**
 * @file encoder_motor.cpp
 */

#include "encoder_motor.h"

#include <Arduino.h>

#include <thread>
#include <utility>

#include "driver/gpio.h"
#include "driver/ledc.h"

namespace em {

namespace {
constexpr float kDefaultPositionP = 20.0;
constexpr float kDefaultPositionI = 0.1;
constexpr float kDefaultPositionD = 5.0;
constexpr float kDefaultSpeedP = 3.0;
constexpr float kDefaultSpeedI = 1.0;
constexpr float kDefaultSpeedD = 1.0;
constexpr int32_t kDeadRpmZone = 10;
}  // namespace

#if ESP_ARDUINO_VERSION >= ESP_ARDUINO_VERSION_VAL(3, 0, 0)
EncoderMotor::EncoderMotor(const uint8_t positive_pin,
                           const uint8_t negative_pin,
                           const uint8_t a_pin,
                           const uint8_t b_pin,
                           const uint32_t ppr,
                           const uint32_t reduction_ration,
                           const PhaseRelation phase_relation)
    : pin_a_(a_pin),
      pin_b_(b_pin),
      motor_driver_(positive_pin, negative_pin),
      total_ppr_(ppr * reduction_ration),
      b_level_at_a_falling_edge_(phase_relation == PhaseRelation::kAPhaseLeads ? HIGH : LOW),
      pulse_count_(0) {
  rpm_pid_.p = kDefaultSpeedP;
  rpm_pid_.i = kDefaultSpeedI;
  rpm_pid_.d = kDefaultSpeedD;
  rpm_pid_.max_integral = ceil(Motor::kMaxPwmDuty / rpm_pid_.i);
}
#endif

EncoderMotor::EncoderMotor(const uint8_t positive_pin,
                           const uint8_t positive_pin_ledc_channel,
                           const uint8_t negative_pin,
                           const uint8_t negative_pin_ledc_channel,
                           const uint8_t a_pin,
                           const uint8_t b_pin,
                           const uint32_t ppr,
                           const uint32_t reduction_ration,
                           const PhaseRelation phase_relation)
    : pin_a_(a_pin),
      pin_b_(b_pin),
      motor_driver_(positive_pin, positive_pin_ledc_channel, negative_pin, negative_pin_ledc_channel),
      total_ppr_(ppr * reduction_ration),
      b_level_at_a_falling_edge_(phase_relation == PhaseRelation::kAPhaseLeads ? HIGH : LOW),
      pulse_count_(0) {
  rpm_pid_.p = kDefaultSpeedP;
  rpm_pid_.i = kDefaultSpeedI;
  rpm_pid_.d = kDefaultSpeedD;
  rpm_pid_.max_integral = ceil(Motor::kMaxPwmDuty / rpm_pid_.i);
}

void EncoderMotor::Init() {
  std::lock_guard<std::mutex> lock(mutex_);
  if (update_rpm_thread_ != nullptr) {
    return;
  }

  motor_driver_.Init();

  pinMode(pin_a_, INPUT_PULLUP);
  pinMode(pin_b_, INPUT_PULLUP);

  attachInterruptArg(pin_a_, EncoderMotor::OnPinAFalling, this, FALLING);
  update_rpm_thread_ = new std::thread(&EncoderMotor::UpdateRpm, this);
}

void EncoderMotor::SetSpeedPid(const float p, const float i, const float d) {
  std::lock_guard<std::mutex> lock(mutex_);
  rpm_pid_.p = p;
  rpm_pid_.i = i;
  rpm_pid_.d = d;

  if (i > 0) {
    rpm_pid_.max_integral = ceil(Motor::kMaxPwmDuty / rpm_pid_.i);
  } else {
    rpm_pid_.max_integral = 0;
  }
}

void EncoderMotor::GetSpeedPid(float* const p, float* const i, float* const d) const {
  std::lock_guard<std::mutex> lock(mutex_);
  if (p != nullptr) {
    *p = rpm_pid_.p;
  }
  if (i != nullptr) {
    *i = rpm_pid_.i;
  }
  if (d != nullptr) {
    *d = rpm_pid_.d;
  }
}

EncoderMotor::~EncoderMotor() {
  std::unique_lock<std::mutex> lock(mutex_);
  DeleteThread(driving_thread_);
  DeleteThread(update_rpm_thread_);
}

void EncoderMotor::RunPwmDuty(const int16_t duty) {
  std::unique_lock<std::mutex> lock(mutex_);
  DeleteThread(driving_thread_);
  target_speed_rpm_ = 0;

  if (motor_driver_.PwmDuty() == duty) {
    return;
  }

  motor_driver_.RunPwmDuty(duty);
}

void EncoderMotor::RunSpeed(const int16_t speed_rpm) {
  std::lock_guard<std::mutex> lock(mutex_);
  if (driving_thread_ == nullptr) {
    rpm_pid_.integral = 0;
    driving_thread_ = new std::thread(&EncoderMotor::Driving, this);
  }

  if (speed_rpm == target_speed_rpm_) {
    return;
  }

  target_speed_rpm_ = speed_rpm;
  drive_ = true;
  condition_.notify_all();
}

void EncoderMotor::Stop() {
  std::unique_lock<std::mutex> lock(mutex_);
  DeleteThread(driving_thread_);
  motor_driver_.Stop();
  target_speed_rpm_ = 0;
  rpm_pid_.integral = 0;
}

int64_t EncoderMotor::EncoderPulseCount() const {
  return pulse_count_;
}

void EncoderMotor::ResetPulseCount() {
  pulse_count_ = 0;
}

double EncoderMotor::GetRevolutions() const {
  return static_cast<double>(pulse_count_) / total_ppr_;
}

int32_t EncoderMotor::SpeedRpm() const {
  std::unique_lock<std::mutex> lock(mutex_);
  return speed_rpm_;
}

int16_t EncoderMotor::PwmDuty() const {
  std::lock_guard<std::mutex> lock(mutex_);
  return motor_driver_.PwmDuty();
}

int32_t EncoderMotor::TargetRpm() const {
  std::lock_guard<std::mutex> lock(mutex_);
  return target_speed_rpm_;
}

void EncoderMotor::OnPinAFalling(void* self) {
  reinterpret_cast<EncoderMotor*>(self)->OnPinAFalling();
}

void EncoderMotor::OnPinAFalling() {
  if (gpio_get_level(static_cast<gpio_num_t>(pin_b_)) == b_level_at_a_falling_edge_) {
    ++pulse_count_;
  } else {
    --pulse_count_;
  }
}

void EncoderMotor::UpdateRpm() {
  std::unique_lock<std::mutex> lock(mutex_);
  last_update_speed_time_ = std::chrono::system_clock::now();
  while (!condition_.wait_until(
      lock, last_update_speed_time_ + std::chrono::milliseconds(50), [this]() { return update_rpm_thread_ == nullptr; })) {
    const auto now = std::chrono::system_clock::now();
    const double duration = std::chrono::duration_cast<std::chrono::milliseconds>(now - last_update_speed_time_).count();
    const double pulse_count = pulse_count_;
    speed_rpm_ = (pulse_count - previous_pulse_count_) * 60000.0 / duration / total_ppr_;
    previous_pulse_count_ = pulse_count;
    last_update_speed_time_ = now;
    if (driving_thread_ != nullptr) {
      drive_ = true;
      condition_.notify_all();
    }
  }
}

void EncoderMotor::Driving() {
  std::unique_lock<std::mutex> lock(mutex_);

  while (driving_thread_ != nullptr) {
    condition_.wait(lock, [this]() { return driving_thread_ == nullptr || drive_; });

    if (driving_thread_ == nullptr) {
      return;
    }

    if (target_speed_rpm_ < kDeadRpmZone && target_speed_rpm_ > -kDeadRpmZone) {
      motor_driver_.RunPwmDuty(0);
    } else {
      const float speed_error = target_speed_rpm_ - speed_rpm_;
      rpm_pid_.integral = constrain(rpm_pid_.integral + speed_error, -rpm_pid_.max_integral, rpm_pid_.max_integral);
      const int16_t duty = round(rpm_pid_.p * speed_error + rpm_pid_.i * rpm_pid_.integral);
      motor_driver_.RunPwmDuty(duty);
    }
    drive_ = false;
  }
}

void EncoderMotor::DeleteThread(std::thread*& thread) {
  if (thread != nullptr) {
#if __cplusplus >= 201402L
    const auto temp = std::exchange(thread, nullptr);
#else
    const auto temp = thread;
    thread = nullptr;
#endif
    condition_.notify_all();
    mutex_.unlock();
    temp->join();
    delete temp;
    mutex_.lock();
  }
}

}  // namespace em