// ICM20948 Arduino Blockly Generator
// 避免重复加载扩展
if (typeof Arduino !== 'undefined') {

  function ensureGyroOffsets(generator) {
    generator.addVariable('gyro_offset', 'float gyro_offset_x = 0, gyro_offset_y = 0, gyro_offset_z = 0;');
  }

  function ensureSample(generator) {
    generator.addVariable('icm_sample_flags', 'bool icm_sample_fresh = false, icm_sample_valid = false;');
    generator.addFunction('icm20948_read_data', `
void icm20948_read_data() {
  static unsigned long lastAttempt = 0;
  icm_sample_fresh = false;
  if (!icm_initialized) {
    if (millis() - lastAttempt < 250) return;
    lastAttempt = millis();
    icm20948_begin();
    if (!icm_initialized) return;
  }
  if (myICM.dataReady()) {
    myICM.getAGMT();
    icm_sample_fresh = myICM.status == ICM_20948_Stat_Ok;
    icm_sample_valid = icm_sample_fresh;
  }
  if (myICM.status != ICM_20948_Stat_Ok && myICM.status != ICM_20948_Stat_NoData) {
    icm_sample_valid = false;
    icm_initialized = false;
    lastAttempt = millis();
  }
}`);
    generator.addLoopBegin('icm20948_read', 'icm20948_read_data();');
  }

  Arduino.forBlock['icm20948_init'] = function(block, generator) {
    const address = block.getFieldValue('ADDRESS');
    generator.addLibrary('icm20948_lib', '#include "ICM_20948.h"');
    generator.addVariable('icm20948_obj', 'ICM_20948_I2C myICM;');
    generator.addVariable('icm20948_initialized', 'bool icm_initialized = false;');
    generator.addFunction('icm20948_begin', `
void icm20948_begin() {
  icm_initialized = myICM.begin(Wire, ${address}) == ICM_20948_Stat_Ok;
}`);
    generator.addSetupBegin('icm20948_init', `
  Wire.begin();
  Wire.setClock(400000);
  icm20948_begin();
  Serial.println(icm_initialized ? "ICM20948 initialized successfully" : "ICM20948 initialization failed");`);
    return '';
  };

  for (const [type, method] of [['accel','acc'], ['gyro','gyr'], ['mag','mag']]) {
    Arduino.forBlock['icm20948_read_' + type] = function(block, generator) {
      ensureSample(generator);
      const axis = block.getFieldValue('AXIS');
      let value = `myICM.${method}${axis}()`;
      if (type === 'gyro') {
        ensureGyroOffsets(generator);
        value += ' - gyro_offset_' + axis.toLowerCase();
      }
      return [`(icm_sample_valid ? ${value} : NAN)`, Arduino.ORDER_ATOMIC];
    };
  }

  Arduino.forBlock['icm20948_read_temp'] = function(block, generator) {
    ensureSample(generator);
    return ['(icm_sample_valid ? myICM.temp() : NAN)', Arduino.ORDER_ATOMIC];
  };

  Arduino.forBlock['icm20948_data_ready'] = function(block, generator) {
    ensureSample(generator);
    return ['icm_sample_fresh', Arduino.ORDER_ATOMIC];
  };

  // 初始化AHRS
  Arduino.forBlock['icm20948_ahrs_init'] = function(block, generator) {
    const freq = block.getFieldValue('FREQ');
    
    generator.addVariable('ahrs_vars', `
// AHRS变量
float ahrs_q0 = 1.0f, ahrs_q1 = 0.0f, ahrs_q2 = 0.0f, ahrs_q3 = 0.0f;
float ahrs_roll = 0.0f, ahrs_pitch = 0.0f, ahrs_yaw = 0.0f;
float ahrs_sample_freq = ${freq}.0f;
float ahrs_beta = 0.1f;
unsigned long ahrs_last_update = 0;`);

    generator.addFunction('madgwick_update', `
void madgwick_update(float gx, float gy, float gz, float ax, float ay, float az, float mx, float my, float mz) {
  float recipNorm;
  float s0, s1, s2, s3;
  float qDot1, qDot2, qDot3, qDot4;
  float hx, hy;
  float _2q0mx, _2q0my, _2q0mz, _2q1mx, _2bx, _2bz, _4bx, _4bz, _2q0, _2q1, _2q2, _2q3, _2q0q2, _2q2q3, q0q0, q0q1, q0q2, q0q3, q1q1, q1q2, q1q3, q2q2, q2q3, q3q3;

  // Convert gyroscope degrees/sec to radians/sec
  gx *= 0.0174533f;
  gy *= 0.0174533f;
  gz *= 0.0174533f;

  // Rate of change of quaternion from gyroscope
  qDot1 = 0.5f * (-ahrs_q1 * gx - ahrs_q2 * gy - ahrs_q3 * gz);
  qDot2 = 0.5f * (ahrs_q0 * gx + ahrs_q2 * gz - ahrs_q3 * gy);
  qDot3 = 0.5f * (ahrs_q0 * gy - ahrs_q1 * gz + ahrs_q3 * gx);
  qDot4 = 0.5f * (ahrs_q0 * gz + ahrs_q1 * gy - ahrs_q2 * gx);

  // Compute feedback only if accelerometer measurement valid
  if ((ax != 0.0f || ay != 0.0f || az != 0.0f) && (mx != 0.0f || my != 0.0f || mz != 0.0f)) {
    // Normalise accelerometer measurement
    recipNorm = 1.0f / sqrt(ax * ax + ay * ay + az * az);
    ax *= recipNorm;
    ay *= recipNorm;
    az *= recipNorm;

    // Normalise magnetometer measurement
    recipNorm = 1.0f / sqrt(mx * mx + my * my + mz * mz);
    mx *= recipNorm;
    my *= recipNorm;
    mz *= recipNorm;

    // Auxiliary variables to avoid repeated arithmetic
    _2q0mx = 2.0f * ahrs_q0 * mx;
    _2q0my = 2.0f * ahrs_q0 * my;
    _2q0mz = 2.0f * ahrs_q0 * mz;
    _2q1mx = 2.0f * ahrs_q1 * mx;
    _2q0 = 2.0f * ahrs_q0;
    _2q1 = 2.0f * ahrs_q1;
    _2q2 = 2.0f * ahrs_q2;
    _2q3 = 2.0f * ahrs_q3;
    _2q0q2 = 2.0f * ahrs_q0 * ahrs_q2;
    _2q2q3 = 2.0f * ahrs_q2 * ahrs_q3;
    q0q0 = ahrs_q0 * ahrs_q0;
    q0q1 = ahrs_q0 * ahrs_q1;
    q0q2 = ahrs_q0 * ahrs_q2;
    q0q3 = ahrs_q0 * ahrs_q3;
    q1q1 = ahrs_q1 * ahrs_q1;
    q1q2 = ahrs_q1 * ahrs_q2;
    q1q3 = ahrs_q1 * ahrs_q3;
    q2q2 = ahrs_q2 * ahrs_q2;
    q2q3 = ahrs_q2 * ahrs_q3;
    q3q3 = ahrs_q3 * ahrs_q3;

    // Reference direction of Earth's magnetic field
    hx = mx * q0q0 - _2q0my * ahrs_q3 + _2q0mz * ahrs_q2 + mx * q1q1 + _2q1 * my * ahrs_q2 + _2q1 * mz * ahrs_q3 - mx * q2q2 - mx * q3q3;
    hy = _2q0mx * ahrs_q3 + my * q0q0 - _2q0mz * ahrs_q1 + _2q1mx * ahrs_q2 - my * q1q1 + my * q2q2 + _2q2 * mz * ahrs_q3 - my * q3q3;
    _2bx = sqrt(hx * hx + hy * hy);
    _2bz = -_2q0mx * ahrs_q2 + _2q0my * ahrs_q1 + mz * q0q0 + _2q1mx * ahrs_q3 - mz * q1q1 + _2q2 * my * ahrs_q3 - mz * q2q2 + mz * q3q3;
    _4bx = 2.0f * _2bx;
    _4bz = 2.0f * _2bz;

    // Gradient decent algorithm corrective step
    s0 = -_2q2 * (2.0f * q1q3 - _2q0q2 - ax) + _2q1 * (2.0f * q0q1 + _2q2q3 - ay) - _2bz * ahrs_q2 * (_2bx * (0.5f - q2q2 - q3q3) + _2bz * (q1q3 - q0q2) - mx) + (-_2bx * ahrs_q3 + _2bz * ahrs_q1) * (_2bx * (q1q2 - q0q3) + _2bz * (q0q1 + q2q3) - my) + _2bx * ahrs_q2 * (_2bx * (q0q2 + q1q3) + _2bz * (0.5f - q1q1 - q2q2) - mz);
    s1 = _2q3 * (2.0f * q1q3 - _2q0q2 - ax) + _2q0 * (2.0f * q0q1 + _2q2q3 - ay) - 4.0f * ahrs_q1 * (1 - 2.0f * q1q1 - 2.0f * q2q2 - az) + _2bz * ahrs_q3 * (_2bx * (0.5f - q2q2 - q3q3) + _2bz * (q1q3 - q0q2) - mx) + (_2bx * ahrs_q2 + _2bz * ahrs_q0) * (_2bx * (q1q2 - q0q3) + _2bz * (q0q1 + q2q3) - my) + (_2bx * ahrs_q3 - _4bz * ahrs_q1) * (_2bx * (q0q2 + q1q3) + _2bz * (0.5f - q1q1 - q2q2) - mz);
    s2 = -_2q0 * (2.0f * q1q3 - _2q0q2 - ax) + _2q3 * (2.0f * q0q1 + _2q2q3 - ay) - 4.0f * ahrs_q2 * (1 - 2.0f * q1q1 - 2.0f * q2q2 - az) + (-_4bx * ahrs_q2 - _2bz * ahrs_q0) * (_2bx * (0.5f - q2q2 - q3q3) + _2bz * (q1q3 - q0q2) - mx) + (_2bx * ahrs_q1 + _2bz * ahrs_q3) * (_2bx * (q1q2 - q0q3) + _2bz * (q0q1 + q2q3) - my) + (_2bx * ahrs_q0 - _4bz * ahrs_q2) * (_2bx * (q0q2 + q1q3) + _2bz * (0.5f - q1q1 - q2q2) - mz);
    s3 = _2q1 * (2.0f * q1q3 - _2q0q2 - ax) + _2q2 * (2.0f * q0q1 + _2q2q3 - ay) + (-_4bx * ahrs_q3 + _2bz * ahrs_q1) * (_2bx * (0.5f - q2q2 - q3q3) + _2bz * (q1q3 - q0q2) - mx) + (-_2bx * ahrs_q0 + _2bz * ahrs_q2) * (_2bx * (q1q2 - q0q3) + _2bz * (q0q1 + q2q3) - my) + _2bx * ahrs_q1 * (_2bx * (q0q2 + q1q3) + _2bz * (0.5f - q1q1 - q2q2) - mz);
    const float gradientSq = s0*s0 + s1*s1 + s2*s2 + s3*s3;
    if (gradientSq > 0.0f) {
      const float feedback = ahrs_beta / sqrt(gradientSq);
      qDot1 -= feedback * s0;
      qDot2 -= feedback * s1;
      qDot3 -= feedback * s2;
      qDot4 -= feedback * s3;
    }
  }

  // Integrate rate of change of quaternion to yield quaternion
  float dt = 1.0f / ahrs_sample_freq;
  ahrs_q0 += qDot1 * dt;
  ahrs_q1 += qDot2 * dt;
  ahrs_q2 += qDot3 * dt;
  ahrs_q3 += qDot4 * dt;

  // Normalise quaternion
  recipNorm = 1.0f / sqrt(ahrs_q0 * ahrs_q0 + ahrs_q1 * ahrs_q1 + ahrs_q2 * ahrs_q2 + ahrs_q3 * ahrs_q3);
  ahrs_q0 *= recipNorm;
  ahrs_q1 *= recipNorm;
  ahrs_q2 *= recipNorm;
  ahrs_q3 *= recipNorm;

  // Convert quaternion to Euler angles
  ahrs_roll = atan2(2.0f * (ahrs_q0 * ahrs_q1 + ahrs_q2 * ahrs_q3), 1.0f - 2.0f * (ahrs_q1 * ahrs_q1 + ahrs_q2 * ahrs_q2)) * 57.2958f;
  ahrs_pitch = asin(fmaxf(-1.0f, fminf(1.0f, 2.0f * (ahrs_q0 * ahrs_q2 - ahrs_q3 * ahrs_q1)))) * 57.2958f;
  ahrs_yaw = atan2(2.0f * (ahrs_q0 * ahrs_q3 + ahrs_q1 * ahrs_q2), 1.0f - 2.0f * (ahrs_q2 * ahrs_q2 + ahrs_q3 * ahrs_q3)) * 57.2958f;
}`);

    return '';
  };

  // 更新AHRS
  Arduino.forBlock['icm20948_ahrs_update'] = function(block, generator) {
    ensureGyroOffsets(generator);
    ensureSample(generator);
    const code = `
  if (icm_sample_fresh) {
    madgwick_update(
      myICM.gyrX() - gyro_offset_x, myICM.gyrY() - gyro_offset_y, myICM.gyrZ() - gyro_offset_z,
      myICM.accX(), myICM.accY(), myICM.accZ(),
      myICM.magX(), myICM.magY(), myICM.magZ()
    );
  }`;
    return code;
  };

  // 获取横滚角
  Arduino.forBlock['icm20948_get_roll'] = function(block, generator) {
    const code = `ahrs_roll`;
    return [code, Arduino.ORDER_ATOMIC];
  };

  // 获取俯仰角
  Arduino.forBlock['icm20948_get_pitch'] = function(block, generator) {
    const code = `ahrs_pitch`;
    return [code, Arduino.ORDER_ATOMIC];
  };

  // 获取偏航角
  Arduino.forBlock['icm20948_get_yaw'] = function(block, generator) {
    const code = `ahrs_yaw`;
    return [code, Arduino.ORDER_ATOMIC];
  };

  // 校准陀螺仪
  Arduino.forBlock['icm20948_calibrate_gyro'] = function(block, generator) {
    const samples = block.getFieldValue('SAMPLES');
    
    ensureGyroOffsets(generator);
    const code = `
  if (icm_initialized) {
    Serial.println("开始陀螺仪校准，请保持传感器静止...");
    delay(2000);
    float sumX = 0, sumY = 0, sumZ = 0;
    const unsigned long start = millis();
    unsigned int count = 0;
    while (count < ${samples} && millis() - start < ${samples}UL * 20UL + 500UL) {
      if (myICM.dataReady()) {
        myICM.getAGMT();
        if (myICM.status != ICM_20948_Stat_Ok) break;
        sumX += myICM.gyrX(); sumY += myICM.gyrY(); sumZ += myICM.gyrZ();
        ++count;
      } else if (myICM.status != ICM_20948_Stat_NoData) break;
      delay(2);
    }
    if (count == ${samples}) {
      gyro_offset_x = sumX/count; gyro_offset_y = sumY/count; gyro_offset_z = sumZ/count;
      Serial.print("陀螺仪偏移值 - X: "); Serial.print(gyro_offset_x);
      Serial.print(", Y: "); Serial.print(gyro_offset_y);
      Serial.print(", Z: "); Serial.println(gyro_offset_z);
    } else Serial.println("陀螺仪校准未完成");
  }`;
    return code;
  };

  // 设置陀螺仪偏移
  Arduino.forBlock['icm20948_set_gyro_offset'] = function(block, generator) {
    const offset_x = generator.valueToCode(block, 'OFFSET_X', Arduino.ORDER_ATOMIC) || '0';
    const offset_y = generator.valueToCode(block, 'OFFSET_Y', Arduino.ORDER_ATOMIC) || '0';
    const offset_z = generator.valueToCode(block, 'OFFSET_Z', Arduino.ORDER_ATOMIC) || '0';
    
    ensureGyroOffsets(generator);
    
    const code = `
  gyro_offset_x = ${offset_x};
  gyro_offset_y = ${offset_y};
  gyro_offset_z = ${offset_z};`;
    
    return code;
  };

  // 设置加速度计量程
  Arduino.forBlock['icm20948_set_accel_range'] = function(block, generator) {
    const range = block.getFieldValue('RANGE');
    
    const code = `
  if (icm_initialized) {
    ICM_20948_fss_t myFSS;
    myFSS.a = ${range};
    myICM.setFullScale(ICM_20948_Internal_Acc, myFSS);
  }`;
    
    return code;
  };

  // 设置陀螺仪量程
  Arduino.forBlock['icm20948_set_gyro_range'] = function(block, generator) {
    const range = block.getFieldValue('RANGE');
    
    const code = `
  if (icm_initialized) {
    ICM_20948_fss_t myFSS;
    myFSS.g = ${range};
    myICM.setFullScale(ICM_20948_Internal_Gyr, myFSS);
  }`;
    
    return code;
  };

}
