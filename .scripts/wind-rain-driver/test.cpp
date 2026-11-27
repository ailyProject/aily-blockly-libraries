#include <cmath>
#include <cstdlib>
#include <iostream>
#include <limits>
#include "Wind.h"
Console Serial;
uint32_t clockMs;
int adc;
struct Line {void(*edge)()=nullptr;int mode=-1;};
Line pins[32];
uint32_t millis(){return clockMs;}
int analogRead(byte){return adc;}
void attachInterrupt(int n,void(*f)(),int mode){pins[n]={f,mode};}
void tick(int line,uint32_t ms){clockMs=ms;pins[line].edge();}
void require(bool value,const char* label){if(!value){std::cerr<<label<<"\n";std::exit(1);}}
bool close(float a,float b){return std::abs(a-b)<0.001;}
int main(int argc,char**argv){
  if(argc!=2)return 2;
  const String which=argv[1];
  WindSpeed::begin(2,3);RainSensor::begin(4);
  require(pins[2].mode==FALLING && pins[4].mode==RISING,"interrupt polarity");
  if(which=="directions"){
    const int reads[]={42,117,210,370,545,700,840,960};
    const int degrees[]={0,315,270,45,225,90,135,180};
    const char* names[]={"E","NW","W","NE","SW","N","SE","S"};
    for(int i=0;i<8;i++){adc=reads[i];WindSpeed::updateWindDirection();
      require(WindSpeed::getWindDirection()==degrees[i] && WindSpeed::getWindDirectionString()==names[i],"compass label");}
  }else if(which=="early-tip" || which=="two-tips"){
    tick(4,25);tick(4,30);
    if(which=="two-tips")tick(4,60);
    clockMs=1001;RainSensor::update();
    int n=which=="two-tips"?2:1;
    std::cout<<RainSensor::getRainTicks()<<" "<<RainSensor::getRainfallLastHour()<<"\n";
    require(RainSensor::getRainTicks()==n && close(RainSensor::getRainfallLastHour(),n*0.2794f),"total/hour");
    RainSensor::resetTotal();require(RainSensor::getRainTicks()==0 && close(RainSensor::getRainfallLastDay(),n*0.2794f),"reset total preserves history");
    RainSensor::resetAll();require(!RainSensor::getRainTicks() && !RainSensor::getRainfallLastDay(),"reset history");
  }else if(which=="full"){
    clockMs=2000;RainSensor::update();
    for(int i=0;i<NO_RAIN_SAMPLES+7;i++){tick(4,2020+i*20);}
    clockMs+=1100;RainSensor::update();
    require(RainSensor::getRainTicks()==NO_RAIN_SAMPLES+7 && close(RainSensor::getRainfallLastDay(),NO_RAIN_SAMPLES*0.2794f),"bounded history");
    clockMs+=3600001;RainSensor::update();require(!RainSensor::getRainfallLastHour() && RainSensor::getRainfallLastDay()>0,"hour expiry");
    clockMs+=86400001;RainSensor::update();require(!RainSensor::getRainfallLastDay(),"day expiry");
  }else if(which=="wind"){
    for(int i=0;i<4;i++){tick(2,100+250*i);tick(2,105+250*i);}
    clockMs=1000;WindSpeed::updateWindSpeed();require(close(WindSpeed::getWindSpeedMph(),4*1.492f),"wind pulses");
    clockMs=5000;WindSpeed::updateWindSpeed();WindSpeed::updateWindSpeed();
    require(std::isfinite(WindSpeed::getWindSpeed()) && WindSpeed::getWindSpeed()==0,"quiescent wind");
  }else if(which=="wrap"){
    clockMs=UINT32_MAX-100;RainSensor::begin(4);tick(4,UINT32_MAX-75);tick(4,UINT32_MAX-70);tick(4,20);
    clockMs=1000;RainSensor::update();require(RainSensor::getRainTicks()==2 && close(RainSensor::getRainfallLastHour(),0.5588f),"millis wrap");
  }else{return 2;}
}
