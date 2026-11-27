#include <DFRobot_GM60.h>
#include <cassert>
#include <cstdio>
#include <limits>
TwoWire Wire;
class SerialPeer : public Stream {
public:
    struct Byte { unsigned long at; uint8_t value; };
    std::vector<uint8_t> tx;
    std::deque<Byte> rx;
    int available() override { return !rx.empty() && rx.front().at <= millis(); }
    int read() override {
        if (!available()) return -1;
        const int value = rx.front().value;
        rx.pop_front();
        return value;
    }
    size_t write(uint8_t value) override { tx.push_back(value); return 1; }
    void deliver(std::initializer_list<uint8_t> bytes, unsigned long spacing = 0) {
        unsigned long at = millis();
        for (auto b : bytes) { rx.push_back({at, b}); at += spacing; }
    }
};
int main() {
    const std::vector<uint8_t> reset{0x7e,0,8,1,0,0xd9,0x55,0xab,0xcd};
    DFRobot_GM60_IIC i2c(&Wire);
    Wire.rx = {2};
    assert(i2c.begin());
    assert(Wire.writes.size() == 2 && Wire.writes[0] == std::vector<uint8_t>{0xaa});
    assert(Wire.writes[1] == reset);
    Wire.rx = {4,0,3,'A','B','C',4,0,0};
    assert(i2c.detection() == "ABC");
    assert(i2c.detection().empty());
    Wire.rx = {4,0,3,'A','B'};
    assert(i2c.detection() == "null");
    Wire.rx = {4,1,1};
    for (unsigned i=0; i<257; ++i) Wire.rx.push_back('Z');
    assert(i2c.detection() == std::string(257, 'Z'));
    Wire.rx = {4,0,3,'A',0,'B'};
    assert(i2c.detection() == std::string("A\0B",3));
    Wire.connected = false;
    const auto start = millis();
    assert(i2c.detection() == "null" && millis() == start);
    Wire.connected = true;
    Wire.rx = {4,0,1,'R'};
    assert(i2c.detection() == "R");
    SerialPeer peer;
    DFRobot_GM60_UART uart;
    peer.deliver({2,0,0,1,0,0x33,0x31}, 3);
    assert(uart.begin(peer) && peer.tx == reset);
    peer.deliver({2,0,0,1,0,0x33,0x30});
    assert(!uart.reset());
    peer.deliver({2,0,0,1,0});
    assert(!uart.reset());
    peer.deliver({4,0,3,'A','B','C'}, 10);
    assert(uart.detection() == "ABC");
    peer.deliver({4,0,3,'a','b'});
    assert(uart.detection() == "null");
    peer.deliver({4,0,3,0xe6,0xb0,0xb4,4,0,1,'R'}, 2);
    assert(uart.detection() == u8"水");
    assert(uart.detection() == "R");
    virtualMs = std::numeric_limits<unsigned long>::max()-50;
    assert(uart.detection() == "null");
    assert(virtualMs < 2100);
    std::puts("GM60 I2C/UART completed, fragmented, truncated, empty and adjacent scan frames, OEM ACK, CRC, and recovery passed");
}
