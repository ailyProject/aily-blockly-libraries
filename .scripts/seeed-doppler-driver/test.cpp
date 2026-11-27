#include "BGT24LTR11.h"
#include <array>
#include <cassert>
#include <cstdint>
#include <cstdio>
#include <deque>
#include <vector>

using Bytes = std::vector<uint8_t>;
static uint64_t nowUs;
unsigned long micros() { return uint32_t(nowUs++); }
void delayMicroseconds(unsigned int us) { nowUs += us; }

static Bytes frame(uint8_t addr, uint8_t cmd, const Bytes& payload) {
    uint16_t length = uint16_t(payload.size()+2);
    Bytes v{0x55, addr, cmd, uint8_t(length>>8), uint8_t(length)};
    v.insert(v.end(),payload.begin(),payload.end());
    uint16_t sum=0;
    for (auto byte:v) sum+=byte;
    v.push_back(uint8_t(sum>>8)); v.push_back(uint8_t(sum));
    return v;
}

struct UartFixture {
    struct Queued { uint64_t at; uint8_t byte; };
    std::deque<Queued> rx;
    uint32_t turnaround=1500, spacing=87;
    Bytes expected, response;
    size_t writes=0;
    bool partialWrite=false;
    void enqueue(const Bytes& data) {
        uint64_t time=nowUs+turnaround;
        for(auto b:data){ rx.push_back({time,b}); time+=spacing; }
    }
    int available() const {
        int n=0;
        for (const auto& b:rx) { if(b.at>nowUs) break; ++n; }
        return n;
    }
    int read() {
        if(rx.empty()||rx.front().at>nowUs) return -1;
        int b=rx.front().byte; rx.pop_front();return b;
    }
    size_t write(const uint8_t* data,size_t n) {
        ++writes;assert(Bytes(data,data+n)==expected);
        if(partialWrite) return n-1;
        enqueue(response); return n;
    }
    void expect(uint8_t cmd,const Bytes& request,const Bytes& reply) {
        expected=frame(0x2a,cmd,request);response=frame(0xa2,cmd,reply);
    }
};

int main(){
    UartFixture uart; BGT24LTR11<UartFixture> radar;
    assert(!radar.setMode(0)); radar.init(uart);
    // Exercise a real 32-bit micros wrap and the exact published request for target mode.
    nowUs=UINT32_MAX-800;uart.expect(0xc5,{0},{0});
    assert(uart.expected==Bytes({0x55,0x2a,0xc5,0,3,0,1,0x47}));
    assert(radar.setMode(0));assert(!radar.setMode(2));
    uart.expect(0xc5,{1},{0});assert(!radar.setMode(1));
    uart.expect(0xc6,{},{1});assert(radar.getMode()==2);
    uart.expect(0xc3,{2,9,1,3},{2,9,1,3});assert(radar.setSpeedScope(521,259));
    auto writes=uart.writes;assert(!radar.setSpeedScope(20,30)&&uart.writes==writes);
    uint16_t hi=0,lo=0;uart.expect(0xc4,{},{2,9,1,3});assert(radar.getSpeedScope(&hi,&lo)&&hi==521&&lo==259);
    uart.expect(0xc7,{0,0,4,0},{0,0,4,0});assert(radar.setThreshold(1024));
    uart.expect(0xc8,{},{0,0,0xfe,0xdc});assert(radar.getThreshold()==0xfedc);
    uint16_t state=7,speed=111;
    uart.expect(0xc1,{},{1,0x23,2});uart.response.back()^=1;
    assert(!radar.getInfo(&state,&speed)&&state==7&&speed==111);
    uart.expect(0xc1,{},{1,0x23,2});uart.response.resize(5);
    const auto started=nowUs;assert(!radar.getInfo(&state,&speed)&&nowUs-started<851000);
    uart.expect(0xc1,{},{1,0x23,2});
    Bytes noise{0x11,0x55,0x55,0xaa};
    auto unrelated=frame(0xa2,0xc5,{0});noise.insert(noise.end(),unrelated.begin(),unrelated.end());
    uart.response.insert(uart.response.begin(),noise.begin(),noise.end());
    assert(radar.getInfo(&state,&speed)&&state==2&&speed==291);
    uart.partialWrite=true;assert(radar.getSpeed()==65535);uart.partialWrite=false;
    uart.expect(0xc1,{},{0,42,1});assert(radar.getSpeed()==42&&radar.getTargetState()==1);
    Bytes iq;
    for(unsigned base:{0x1800u,0xb700u})for(unsigned j=0;j<1024;++j){
        uint16_t value=uint16_t(base+j);iq.push_back(uint8_t(value>>8));iq.push_back(uint8_t(value));
    }
    std::array<uint16_t,1025> i{},q{};i.back()=0xa5a5;q.back()=0x5a5a;
    uint16_t count=99;uart.enqueue(frame(0xa2,0xc2,iq));
    assert(!radar.getIQADC(i.data(),q.data(),1023,&count)&&!count);
    assert(radar.getIQADC(i.data(),q.data(),1024,&count)&&count==1024);
    for(unsigned j=0;j<count;++j) assert(i[j]==0x1800+j && q[j]==0xb700+j);
    assert(i.back()==0xa5a5 && q.back()==0x5a5a);
    auto corrupt=frame(0xa2,0xc2,iq);corrupt.back()^=1;uart.enqueue(corrupt);
    assert(!radar.getIQADC(i.data(),q.data(),&count)&&count==0);
    uart.expect(0xc5,{0},{0});auto other=frame(0xa2,0xc2,iq);
    uart.response.insert(uart.response.begin(),other.begin(),other.end());
    assert(radar.setMode(0));
    std::puts("Verified C1-C8, fragmented UART, timeout recovery, I/Q channel order, bounds and checksum");
}
