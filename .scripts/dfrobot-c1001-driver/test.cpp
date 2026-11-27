#include "DFRobot_HumanDetection.h"
#include <cassert>
#include <deque>
#include <vector>
static uint32_t clockMs;
unsigned long millis() { return clockMs; }
void delay(unsigned long ms) { clockMs += ms; }

class Radar : public Stream {
public:
    uint32_t bootAt = 0, modeAt = 0;
    unsigned spacing = 0, writes = 0, modeWrites = 0;
    uint8_t mode = 2, requested = 2;
    bool present = true, shortDistance = false, addOther = false, badTail = false;
    int available() override { return !rx.empty() && int32_t(clockMs - rx.front().at) >= 0; }
    int read() override {
        if (!available()) return -1;
        int byte = rx.front().byte; rx.pop_front(); return byte;
    }
    size_t write(const uint8_t *p, size_t n) override {
        assert(n == 10 && p[0] == 0x53 && p[1] == 0x59 && p[4] == 0 && p[5] == 1 && p[8] == 0x54 && p[9] == 0x43);
        uint8_t sum = 0; for (size_t i=0; i<7; ++i) sum += p[i]; assert(sum == p[7]);
        ++writes;
        if (!present || clockMs < bootAt) return n;
        if (modeAt && clockMs >= modeAt) {mode = requested; modeAt = 0;}
        if (p[2] == 2 && p[3] == 8) {
            ++modeWrites; requested = p[6]; modeAt = clockMs + 1200; return n;
        }
        if (addOther) enqueue(0x80,0x01,{1});
        if (p[2] == 1 && p[3] == 0x83) enqueue(1,0x83,{1});
        if (p[2] == 2 && p[3] == 0xa8) enqueue(2,0xa8,{mode});
        if (p[2] == 0x80 && p[3] == 0x84) enqueue(0x80,0x84,shortDistance ? std::vector<uint8_t>{1} : std::vector<uint8_t>{1,44});
        if (p[2] == 0x85 && p[3] == 0x82) enqueue(0x85,0x82,{73});
        return n;
    }
private:
    struct Byte { uint32_t at; uint8_t byte; };
    std::deque<Byte> rx;
    void enqueue(uint8_t group, uint8_t opcode, const std::vector<uint8_t> &data) {
        std::vector<uint8_t> frame{0x53,0x59,group,opcode,0,uint8_t(data.size())};
        frame.insert(frame.end(),data.begin(),data.end());
        uint8_t sum=0; for (auto b:frame) sum+=b;
        frame.push_back(sum); frame.push_back(0x54); frame.push_back(badTail ? 0 : 0x43);
        uint32_t arrival = rx.empty() ? clockMs : rx.back().at + spacing;
        for (auto b:frame) {rx.push_back({arrival,b});arrival+=spacing;}
    }
};
int main() {
    for (unsigned spacing : {0u,75u,150u}) {
        clockMs = 0; Radar wire; wire.spacing = spacing; DFRobot_HumanDetection radar(&wire);
        assert(radar.begin() == 0 && wire.writes == 1 && clockMs == 9*spacing);
    }
    clockMs=0; Radar wire; DFRobot_HumanDetection radar(&wire);
    wire.bootAt=9900;
    assert(radar.begin()==0 && clockMs>=9900 && clockMs<=11000);
    wire.addOther=true;
    assert(radar.smHumanData(radar.eHumanDistance)==300);
    assert(radar.configWorkMode(radar.eFallingMode)==0 && radar.getWorkMode()==1);
    assert(wire.modeWrites==1 && radar.configWorkMode(radar.eFallingMode)==0 && wire.modeWrites==1);
    wire.shortDistance=true; assert(radar.smHumanData(radar.eHumanDistance)==0);
    wire.badTail=true; assert(radar.getHeartRate()==0xff); wire.badTail=false;
    wire.present=false; assert(radar.getHeartRate()==0xff); wire.present=true;
    assert(radar.getHeartRate()==73);
    Radar second; DFRobot_HumanDetection other(&second); assert(other.getWorkMode()==2);
}
