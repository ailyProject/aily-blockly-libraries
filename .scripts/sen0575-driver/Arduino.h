#pragma once
#include <cstdint>
#include <cstdlib>
#include <cstring>
#include <string>
class String : public std::string {
public:
 using std::string::string;
 String(int n):std::string(std::to_string(n)){}
 String(std::string s):std::string(s){}
};
inline void delay(unsigned long){}
inline void delayMicroseconds(unsigned long){}
inline unsigned long millis(){static unsigned long n=0;return ++n;}
inline void pinMode(int,int){}
inline void digitalWrite(int,int){}
enum {OUTPUT,LOW,HIGH};
