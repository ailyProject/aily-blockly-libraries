#include <DFRobot_TactileSensor.h>
#include <cassert>
#include <cstdio>
#include <deque>
#include <iostream>
#include <sstream>
#include <string>
static unsigned long nowMs=0;
unsigned long millis(){return nowMs++;}
void delay(unsigned long ms){nowMs+=ms;}
class Bus : public Stream {
public:
  std::deque<uint8_t> bytes;
  int available() override {return int(bytes.size());}
  int read() override {if(bytes.empty())return -1; auto x=bytes.front();bytes.pop_front();return x;}
  size_t write(const uint8_t* data,size_t count) override {
    std::cout << "TX " << nowMs << ' ';
    for(size_t i=0;i<count;++i)printf("%02x",data[i]);
    std::cout << std::endl;
    std::string reply; if(!std::getline(std::cin,reply))std::exit(2);
    for(size_t i=0;i<reply.size();i+=2)bytes.push_back(static_cast<uint8_t>(std::stoul(reply.substr(i,2),nullptr,16)));
    return count;
  }
};
int main(){
  Bus bus; DFRobot_TactileSensor six(1,&bus), four(2,&bus);
  assert(six.begin(36)==0);assert(four.begin(32)==0);
  auto s=six.getDatas(); auto f=four.getDatas();
  assert(s.result==0 && f.result==0);
  for(int row=0;row<6;row++)for(int col=0;col<6;col++)assert(s.adcval[row][col]==1000+row*100+col);
  for(int row=0;row<4;row++)for(int col=0;col<8;col++)assert(f.adcval[row][col]==2000+row*100+col);
  auto id=six.getDeviceInfo();assert(id.VID==0x3343 && id.PID==0x1234 && id.version==0x0102);
  six.setThld(1300);six.setSampleRate(eSampleRate50Hz);six.setDevAddr(3);
  assert(six.getDatas().adcval[5][5]==1505);
  six.restoreSensor();assert(six.getDatas().adcval[5][5]==1505);
  std::cout<<"UNPLUG"<<std::endl;
  assert(six.begin(36)==-1);auto off=six.getDatas();assert(off.result!=0);
  for(auto &row:off.adcval)for(auto adc:row)assert(adc==0);
  assert(four.begin(32)==0 && four.getDatas().adcval[3][7]==2307);
  std::cout<<"RECONNECT"<<std::endl;
  assert(six.begin(36)==0 && six.getDatas().adcval[0][5]==1005);
  std::cout << "PASS" << std::endl;
}
