#pragma once
#include "Arduino.h"
#include <array>
#include <vector>

class TwoWire {
public:
    std::array<std::array<uint8_t, 44>, 3> devices{};
    std::array<uint8_t, 256> common{};
    uint8_t companions = 0x30;
    uint8_t device = 0;
    bool online = true, refuseSelection = false, shortRead = false, busy = false;
    int failRead = -1, failAddress = -1, failPayload = -1, failDevice = -1;
    unsigned bulbTransitions = 0, configWrites = 0;
    uint32_t availableAt = 0;
    bool measuring = false, neverReady = false;

    void begin() {}
    void beginTransmission(uint8_t) { tx.clear(); }
    size_t write(uint8_t b) { tx.push_back(b); return 1; }
    int endTransmission() {
        if (!online) return 2;
        if (tx.empty()) return 0;
        physical = tx[0];
        if (tx.size() == 1) return 0;
        if (physical != 1 || tx.size() != 2) return 3;
        const uint8_t value = tx[1];
        if (pending >= 0) {
            if (failPayload == pending && (failDevice < 0 || failDevice == device)) { failPayload = -1; return 3; }
            if (pending == 0x4f) {
                if (!refuseSelection) device = value & 3;
            } else if (pending == 7) {
                if ((devices.at(device)[7] ^ value) & 8) ++bulbTransitions;
                devices.at(device)[7] = value;
            } else {
                common.at(pending) = value;
                if (pending == 4) {
                    ++configWrites;
                    if ((value & 0x0c) == 0x0c) {
                        measuring = true;
                        common[4] &= ~2;
                        availableAt = millis() + (uint32_t(common[5])+1u)*56u/10u;
                    }
                }
            }
            pending = -1;
        } else if (value & 0x80) {
            if (failAddress == (value & 127)) { failAddress = -1; return 3; }
            pending = value & 127;
        } else {
            reply = value;
        }
        return 0;
    }
    int requestFrom(uint8_t, uint8_t) {
        byte = -1;
        if (physical == 0) { byte = (reply >= 0 ? 1 : 0) | (busy ? 2 : 0); return 1; }
        if (physical != 2 || reply < 0) return 0;
        const int address = reply; reply = -1;
        if (address == failRead) { failRead = -1; return 0; }
        if (address == 4 && measuring && !neverReady && int32_t(millis()-availableAt) >= 0) {
            measuring=false; common[4] |= 2;
        }
        if (address == 0x4f) byte = companions | device;
        else if (address >= 6 && address < 44) byte = devices.at(device).at(address);
        else byte = common[address];
        if (shortRead) { shortRead=false; byte=-1; }
        return 1;
    }
    int available() const { return byte >= 0; }
    int read() { const int value=byte; byte=-1; return value; }
private:
    std::vector<uint8_t> tx;
    int physical=-1, pending=-1, reply=-1, byte=-1;
};
extern TwoWire Wire;
