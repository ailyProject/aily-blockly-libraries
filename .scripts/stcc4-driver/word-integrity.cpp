#include <DFRobot_STCC4.h>
#include <cassert>
#include <cstdio>
TwoWire Wire;
QuietSerial Serial;
unsigned long clockMs = 0;

uint8_t crc16word(uint16_t word) {
  uint8_t crc = 0xff;
  for (int bit = 15; bit >= 0; --bit) {
    const bool flip = ((crc >> 7) ^ (word >> bit)) & 1;
    crc <<= 1;
    if (flip) crc ^= 0x31;
  }
  return crc;
}
void reply(std::initializer_list<uint16_t> words) {
  Wire.response.clear(); Wire.minDelay = 0; Wire.endStatus = 0;
  for (auto w : words)
    Wire.response.insert(Wire.response.end(), {uint8_t(w >> 8),uint8_t(w),crc16word(w)});
}
void test(const char* key, bool pass, int index = -1) {
  std::printf("%s,%d,%s\n", key,index,pass ? "pass" : "fail");
}
int main() {
  assert(crc16word(0xbeef) == 0x92);
  DFRobot_STCC4_I2C driver;
  const uint32_t id = 0x0901018a;
  auto ident = [] { reply({0x0901,0x018a,0xbeef,0xa55a,0x5500,0x1122}); };
  ident(); test("valid-id",driver.getID()==id);
  for (int i=0;i<6;i++) {ident(); Wire.response[i*3+2]^=1; test("id-corrupt",driver.getID()==0,i);}
  // The driver requested the serial words as well as the product ID.
  ident(); Wire.response.resize(5); test("id-short",driver.getID()==0);
  ident(); Wire.endStatus=2; test("id-rejected-command-stale-buffer",driver.getID()==0);
  ident(); Wire.minDelay=1; test("id-1ms-execution",driver.getID()==id);
  uint16_t co2=0,status=0; float temp=0,hum=0;
  auto measurement=[&]{return driver.measurement(&co2,&temp,&hum,&status);};
  auto measure=[] {reply({650,0x9000,29360,0x40});};
  measure(); test("valid-measurement",measurement() && co2==650 && status==0x40 && std::abs(hum-50)<0.01);
  test("unsigned-temperature-word",std::abs(temp-(-45+175.0*0x9000/65535))<0.01);
  for(int i=0;i<4;i++){
    measure(); Wire.response[3*i+2]^=1;
    co2=11;temp=12;hum=13;status=14;
    test("measurement-corrupt-atomic",!measurement() && co2==11 && temp==12 && hum==13 && status==14,i);
  }
  measure(); Wire.response.pop_back();test("measurement-short",!measurement());
  measure(); Wire.minDelay=1;test("measurement-1ms-execution",measurement());
  reply({0}); Wire.minDelay=90;test("factory-reset-90ms",driver.factoryReset());
  reply({0}); Wire.response.back()^=1;test("factory-reset-corrupt",!driver.factoryReset());
  reply({0xffff});test("factory-reset-execution-error",!driver.factoryReset());
  reply({0xffff});uint16_t correction=99;test("frc-execution-error",!driver.forcedRecalibration(400,&correction)&&correction==99);
  reply({0x8000});Wire.response.back()^=1;test("frc-corrupt",!driver.forcedRecalibration(400,&correction)&&correction==99);
  Wire.endStatus=0;bool reset=driver.softRest();test("soft-reset-address",reset&&Wire.addr==0&&Wire.tx==std::vector<uint8_t>{6});
  Wire.endStatus=3;bool woke=driver.wakeup();test("wake-data-nack",woke&&Wire.addr==0x64&&Wire.tx==std::vector<uint8_t>{0});
  Wire.endStatus=2;test("wake-address-nack",!driver.wakeup());
}
