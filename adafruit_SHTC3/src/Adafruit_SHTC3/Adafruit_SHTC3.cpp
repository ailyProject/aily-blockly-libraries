/*!
 *  @file Adafruit_SHTC3.cpp
 *
 *  @mainpage Adafruit SHTC3 Digital Humidity & Temp Sensor
 *
 *  @section intro_sec Introduction
 *
 *  This is a library for the SHTC3 Digital Humidity & Temp Sensor
 *
 *  Designed specifically to work with the SHTC3 Digital sensor from Adafruit
 *
 *  Pick one up today in the adafruit shop!
 *  ------> https://www.adafruit.com/product/4636
 *
 *  These sensors use I2C to communicate, 2 pins are required to interface
 *
 *  Adafruit invests time and resources providing this open source code,
 *  please support Adafruit andopen-source hardware by purchasing products
 *  from Adafruit!
 *
 *  @section author Author
 *
 *  Limor Fried/Ladyada (Adafruit Industries).
 *
 *  @section license License
 *
 *  BSD license, all text above must be included in any redistribution
 */

#include "Adafruit_SHTC3.h"

static uint8_t crc8(const uint8_t *data, int len);

/*!
 * @brief  SHTC3 constructor
 */
Adafruit_SHTC3::Adafruit_SHTC3(void) {}

/*!
 * @brief  SHTC3 destructor
 */
Adafruit_SHTC3::~Adafruit_SHTC3(void) {
  if (temp_sensor) {
    delete temp_sensor;
  }
  if (humidity_sensor) {
    delete humidity_sensor;
  }
}

/**
 * Initialises the I2C bus, and assigns the I2C address to us.
 *
 * @param theWire   The I2C bus to use, defaults to &Wire
 *
 * @return True if initialisation was successful, otherwise False.
 */
bool Adafruit_SHTC3::begin(TwoWire *theWire) {
  if (i2c_dev) {
    delete i2c_dev; // remove old interface
  }

  i2c_dev = new Adafruit_I2CDevice(SHTC3_DEFAULT_ADDR, theWire);

  if (!i2c_dev->begin()) {
    return false;
  }

  sleep(false);
  reset();

  // read the ID
  if ((readID() & 0x083F) != 0x807) {
    return false;
  }
  humidity_sensor = new Adafruit_SHTC3_Humidity(this);
  temp_sensor = new Adafruit_SHTC3_Temp(this);
  return true;
}

/**
 * @brief Brings the SHTC3 in or out of sleep mode
 *
 * @param sleepmode If true, go into sleep mode. Else, wakeup
 */
void Adafruit_SHTC3::sleep(bool sleepmode) {
  if (sleepmode) {
    writeCommand(SHTC3_SLEEP);
  } else {
    writeCommand(SHTC3_WAKEUP);
    delayMicroseconds(250);
  }
}

/**
 * @brief Tells the SHTC3 to read future data in low power (fast) or normal
 * (precise)
 *
 * @param readmode If true, use low power mode for reads
 */
void Adafruit_SHTC3::lowPowerMode(bool readmode) { _lpMode = readmode; }

/**
 * Gets the ID register contents.
 *
 * @return The 16-bit ID register.
 */
uint16_t Adafruit_SHTC3::readID(void) {
  uint8_t data[3];

  readCommand(SHTC3_READID, data, 3);

  uint16_t id = data[0];
  id <<= 8;
  id |= data[1];

  return id;
}

/**
 * Performs a reset of the sensor to put it into a known state.
 */
void Adafruit_SHTC3::reset(void) {
  writeCommand(SHTC3_SOFTRESET);
  delay(1);
}

/**************************************************************************/
/*!
    @brief  Gets the humidity sensor and temperature values as sensor events
    @param  humidity Sensor event object that will be populated with humidity
   data
    @param  temp Sensor event object that will be populated with temp data
    @returns true if the event data was read successfully
*/
/**************************************************************************/
bool Adafruit_SHTC3::getEvent(sensors_event_t *humidity,
                              sensors_event_t *temp) {
  uint32_t t = millis();

  uint8_t readbuffer[6];

  sleep(false);
  if (_lpMode) {
    // low power
    writeCommand(SHTC3_LOWPOW_MEAS_TFIRST);
    delayMicroseconds(1000);
  } else {
    writeCommand(SHTC3_NORMAL_MEAS_TFIRST);
    delay(13);
  }

  while (!i2c_dev->read(readbuffer, sizeof(readbuffer))) {
    delay(1);
  }

  if (readbuffer[2] != crc8(readbuffer, 2) ||
      readbuffer[5] != crc8(readbuffer + 3, 2))
    return false;

  int32_t stemp = (int32_t)(((uint32_t)readbuffer[0] << 8) | readbuffer[1]);
  // simplified (65536 instead of 65535) integer version of:
  // temp = (stemp * 175.0f) / 65535.0f - 45.0f;
  stemp = ((4375 * stemp) >> 14) - 4500;
  _temperature = (float)stemp / 100.0f;

  uint32_t shum = ((uint32_t)readbuffer[3] << 8) | readbuffer[4];
  // simplified (65536 instead of 65535) integer version of:
  // humidity = (shum * 100.0f) / 65535.0f;
  shum = (625 * shum) >> 12;
  _humidity = (float)shum / 100.0f;

  sleep(true);

  // use helpers to fill in the events
  if (temp)
    fillTempEvent(temp, t);
  if (humidity)
    fillHumidityEvent(humidity, t);
  return true;
}

void Adafruit_SHTC3::fillTempEvent(sensors_event_t *temp, uint32_t timestamp) {
  memset(temp, 0, sizeof(sensors_event_t));
  temp->version = sizeof(sensors_event_t);
  temp->sensor_id = _sensorid_temp;
  temp->type = SENSOR_TYPE_AMBIENT_TEMPERATURE;
  temp->timestamp = timestamp;
  temp->temperature = _temperature;
}

void Adafruit_SHTC3::fillHumidityEvent(sensors_event_t *humidity,
                                       uint32_t timestamp) {
  memset(humidity, 0, sizeof(sensors_event_t));
  humidity->version = sizeof(sensors_event_t);
  humidity->sensor_id = _sensorid_humidity;
  humidity->type = SENSOR_TYPE_AMBIENT_TEMPERATURE;
  humidity->timestamp = timestamp;
  humidity->relative_humidity = _humidity;
}

/**
 * @brief Gets the Adafruit_Sensor object for the SHTC3's humidity sensor
 *
 * @return Adafruit_Sensor*
 */
Adafruit_Sensor *Adafruit_SHTC3::getHumiditySensor(void) {
  return humidity_sensor;
}

/**
 * @brief Gets the Adafruit_Sensor object for the SHTC3's humidity sensor
 *
 * @return Adafruit_Sensor*
 */
Adafruit_Sensor *Adafruit_SHTC3::getTemperatureSensor(void) {
  return temp_sensor;
}
/**
 * @brief  Gets the sensor_t object describing the SHTC3's humidity sensor
 *
 * @param sensor The sensor_t object to be populated
 */
void Adafruit_SHTC3_Humidity::getSensor(sensor_t *sensor) {
  /* Clear the sensor_t object */
  memset(sensor, 0, sizeof(sensor_t));

  /* Insert the sensor name in the fixed length char array */
  strncpy(sensor->name, "SHTC3_H", sizeof(sensor->name) - 1);
  sensor->name[sizeof(sensor->name) - 1] = 0;
  sensor->version = 1;
  sensor->sensor_id = _sensorID;
  sensor->type = SENSOR_TYPE_RELATIVE_HUMIDITY;
  sensor->min_delay = 0;
  sensor->min_value = 0;
  sensor->max_value = 100;
  sensor->resolution = 2;
}
/**
    @brief  Gets the humidity as a standard sensor event
    @param  event Sensor event object that will be populated
    @returns True
 */
bool Adafruit_SHTC3_Humidity::getEvent(sensors_event_t *event) {
  _theSHTC3->getEvent(event, NULL);

  return true;
}
/**
 * @brief  Gets the sensor_t object describing the SHTC3's tenperature sensor
 *
 * @param sensor The sensor_t object to be populated
 */
void Adafruit_SHTC3_Temp::getSensor(sensor_t *sensor) {
  /* Clear the sensor_t object */
  memset(sensor, 0, sizeof(sensor_t));

  /* Insert the sensor name in the fixed length char array */
  strncpy(sensor->name, "SHTC3_T", sizeof(sensor->name) - 1);
  sensor->name[sizeof(sensor->name) - 1] = 0;
  sensor->version = 1;
  sensor->sensor_id = _sensorID;
  sensor->type = SENSOR_TYPE_AMBIENT_TEMPERATURE;
  sensor->min_delay = 0;
  sensor->min_value = -40;
  sensor->max_value = 85;
  sensor->resolution = 0.3; // depends on calibration data?
}
/*!
    @brief  Gets the temperature as a standard sensor event
    @param  event Sensor event object that will be populated
    @returns true
*/
bool Adafruit_SHTC3_Temp::getEvent(sensors_event_t *event) {
  _theSHTC3->getEvent(NULL, event);

  return true;
}

/**
 * Internal function to perform and I2C write.
 *
 * @param cmd   The 16-bit command ID to send.
 */
bool Adafruit_SHTC3::writeCommand(uint16_t command) {
  uint8_t cmd[2];

  cmd[0] = command >> 8;
  cmd[1] = command & 0xFF;

  return i2c_dev->write(cmd, 2);
}

/**
 * Internal function to perform an I2C read.
 *
 * @param cmd   The 16-bit command ID to send.
 */
bool Adafruit_SHTC3::readCommand(uint16_t command, uint8_t *buffer,
                                 uint8_t num_bytes) {
  uint8_t cmd[2];

  cmd[0] = command >> 8;
  cmd[1] = command & 0xFF;

  return i2c_dev->write_then_read(cmd, 2, buffer, num_bytes);
}

/**
 * Performs a CRC8 calculation on the supplied values.
 *
 * @param data  Pointer to the data to use when calculating the CRC8.
 * @param len   The number of bytes in 'data'.
 *
 * @return The computed CRC8 value.
 */
static uint8_t crc8(const uint8_t *data, int len) {
  /*
   *
   * CRC-8 formula from page 14 of SHT spec pdf
   *
   * Test data 0xBE, 0xEF should yield 0x92
   *
   * Initialization data 0xFF
   * Polynomial 0x31 (x8 + x5 +x4 +1)
   * Final XOR 0x00
   */

  const uint8_t POLYNOMIAL(0x31);
  uint8_t crc(0xFF);

  for (int j = len; j; --j) {
    crc ^= *data++;

    for (int i = 8; i; --i) {
      crc = (crc & 0x80) ? (crc << 1) ^ POLYNOMIAL : (crc << 1);
    }
  }
  return crc;
}
