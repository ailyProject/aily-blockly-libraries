#include <DFRobot_Multi_DOF_IMU.h>
#include <cassert>
#include <cmath>
#include <iostream>
#include <string>
#include <cstdio>
TwoWire Wire;
static unsigned long clockMs=0;
unsigned long millis(){return clockMs++;}
void delay(unsigned long ms){clockMs+=ms;}
void HardwareSerial::begin(unsigned long baud){assert(baud==9600);}
void TwoWire::setClock(unsigned long hz){assert(hz==400000);}
void TwoWire::beginTransmission(uint8_t addr){assert(addr==0x4a);tx.clear();}
static std::string exchange(const std::string& op,const uint8_t* bytes=nullptr,size_t count=0){
  std::cout<<op<<' ';
  for(size_t i=0;i<count;i++)std::printf("%02x",bytes[i]);
  std::cout<<std::endl;std::string reply;
  if(!std::getline(std::cin,reply))std::exit(2);
  return reply;
}
static void append(std::deque<uint8_t>& buffer,const std::string& hex){
  for(size_t i=0;i<hex.size();i+=2)buffer.push_back(uint8_t(std::stoul(hex.substr(i,2),nullptr,16)));
}
size_t HardwareSerial::write(const uint8_t* bytes,size_t count){append(rx,exchange("UART",bytes,count));return count;}
uint8_t TwoWire::endTransmission(){return exchange("WRITE",tx.data(),tx.size())=="ACK"?0:2;}
size_t TwoWire::requestFrom(uint8_t id,size_t len){
  assert(id==0x4a);rx.clear();append(rx,exchange("READ "+std::to_string(len)));return rx.size();
}
static void test(DFRobot_Multi_DOF_IMU& imu){
  using M=DFRobot_Multi_DOF_IMU;
  assert(imu.begin());
  assert(imu.setSensorMode(M::eNormalMode));
  assert(imu.setAccelRange(M::eAccelRange2G) && imu.setGyroRange(M::eGyroRange250DPS));
  M::sSensorData_t a{},g{},m{};
#if IMU_AXES == 10
  float pressure = 0, altitude = 0;
#endif
  auto read = [&](){
#if IMU_AXES == 10
    return imu.get10dofData(&a,&g,&m,&pressure,false);
#elif IMU_AXES == 9
    return imu.get9dofData(&a,&g,&m);
#else
    return imu.get6dofData(&a,&g);
#endif
  };
  assert(read());assert(a.x==0 && a.y==0 && a.z==0 && g.x==0 && g.y==0 && g.z==0);
  assert(m.x==0 && m.y==0 && m.z==0);
#if IMU_AXES == 10
  assert(pressure == 101325 && imu.get10dofData(&a,&g,&m,&altitude,true) && altitude == 0);
#endif
  exchange("MOTION");
  auto sample=[&](){
    assert(read());
    assert(a.x==-.5f && a.y==1.f && a.z==.25f);
#if IMU_AXES >= 9
    assert(m.x==1234.5f && m.y==-1300.25f && m.z==-.25f);
#endif
#if IMU_AXES == 10
    assert(pressure == 90000);
#endif
    assert(g.x==-62.5f && g.y==31.25f && g.z==125.f);
  };
  sample();
  assert(imu.setAccelRange(M::eAccelRange8G) && imu.setGyroRange(M::eGyroRange1000DPS));sample();
  assert(imu.getStepCount()==0x10023 && imu.getTap()==2 && imu.getOrientation()==0x301);
  assert(imu.setInt(M::eImuIntPin1,M::eInt1_2Tap) && imu.setInt(M::eImuIntPin2,M::eInt1_2Orientation));
#if IMU_AXES >= 9
  assert(imu.setInt(M::eImuIntPin3, M::eInt3DataReady));
#endif
#if IMU_AXES == 10
  assert(imu.setInt(M::eImuIntPin4, M::eInt4PressureOOR));
  assert(imu.setPressOOR(101325, 100, M::ePressOORCountLimit7));
  assert(imu.get10dofData(&a,&g,&m,&altitude,true) && std::abs(altitude-988.093f)<0.03f);
  assert(!imu.calibrateAltitude(0) && imu.calibrateAltitude(540));
  assert(imu.get10dofData(&a,&g,&m,&altitude,true) && std::abs(altitude-510.857f)<0.03f);
  assert(read() && pressure == 90000);
#endif
  exchange("CONFIG");
  exchange("UNPLUG");
  assert(!imu.setAccelRange(M::eAccelRange16G) && !imu.setGyroRange(M::eGyroRange125DPS));
  assert(!read() && !imu.begin());
  exchange("RECONNECT");assert(imu.begin());
  assert(imu.reset());sample();
}
int main(int argc,char**argv){
#if IMU_AXES == 10
  constexpr auto model = DFRobot_Multi_DOF_IMU::eSensorModel10DOF;
#elif IMU_AXES == 9
  constexpr auto model = DFRobot_Multi_DOF_IMU::eSensorModel9DOF;
#else
  constexpr auto model = DFRobot_Multi_DOF_IMU::eSensorModel6DOF;
#endif
  assert(argc==2);HardwareSerial serial;
  if(std::string(argv[1])=="uart"){
    DFRobot_Multi_DOF_IMU_UART imu(model,&serial,9600,0x4a);test(imu);
  }else{
    DFRobot_Multi_DOF_IMU_I2C imu(model,&Wire,0x4a);test(imu);
  }
  std::cout<<"PASS"<<std::endl;
}
