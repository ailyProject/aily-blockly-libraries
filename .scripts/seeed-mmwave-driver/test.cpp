#include "mmwave_for_xiao.h"
#include <algorithm>
#include <cassert>
#include <deque>
#include <iostream>
#include <vector>

uint32_t fakeMillis = 42;
using Bytes = std::vector<byte>;
using Radar = Seeed_HSP24;

static Bytes frame(bool report, Bytes payload) {
    Bytes bytes = report ? Bytes{0xf4,0xf3,0xf2,0xf1} : Bytes{0xfd,0xfc,0xfb,0xfa};
    bytes.push_back(byte(payload.size()));
    bytes.push_back(0);
    bytes.insert(bytes.end(),payload.begin(),payload.end());
    Bytes footer = report ? Bytes{0xf8,0xf7,0xf6,0xf5} : Bytes{4,3,2,1};
    bytes.insert(bytes.end(),footer.begin(),footer.end());
    return bytes;
}

static Bytes observation(bool engineering) {
    Bytes p{byte(engineering ? 1 : 2),0xaa,3,64,0,88,70,0,11,0x23,0x01};
    if (engineering) {
        p.insert(p.end(),{8,8});
        for (unsigned i=0;i<18;++i) p.push_back(10+i);
        p.insert(p.end(),{98,1});
    }
    p.insert(p.end(),{0x55,0});
    return frame(true,p);
}

class Wire : public Stream {
public:
    enum Fault { None, Reject, Short, Silent };
    Fault fault = None;
    bool interleave = false;
    bool configured = false;
    std::deque<std::pair<uint32_t,byte>> rx;
    std::vector<Bytes> requests;

    void feed(const Bytes &bytes, uint32_t increment=0) {
        uint32_t at = rx.empty() ? fakeMillis : rx.back().first;
        for (byte b : bytes) { rx.emplace_back(at,b); at+=increment; }
    }
    int available() override { return !rx.empty() && int32_t(fakeMillis-rx.front().first)>=0; }
    int read() override {
        if (!available()) return -1;
        byte b=rx.front().second;
        rx.pop_front(); return b;
    }
    size_t write(const byte* bytes, size_t size) override {
        requests.emplace_back(bytes,bytes+size);
        const byte command=bytes[6];
        if (fault==Silent) return size;
        Bytes payload{command,1,0,0};
        if (command==0xff) configured=true;
        else if (command==0xfe || command==0xa3) configured=false;
        else assert(configured);
        if (command==0xa0) payload.insert(payload.end(),{1,0,7,1,0x16,0x15,9,0x22});
        if (command==0xab) payload.insert(payload.end(),{1,0});
        if (command==0x61) {
            payload.insert(payload.end(),{0xaa,8,7,6});
            for (int i=0;i<18;++i) payload.push_back(20+i);
            payload.insert(payload.end(),{0x34,0x12});
        }
        if (command!=0xff && command!=0xfe) {
            if (fault==Reject) payload[3]=1; // Check both bytes of the status word.
            if (fault==Short) payload.resize(4);
            if (interleave) {
                feed(observation(false));
                feed(frame(false,{0x63,1,0,0}));
            }
        }
        feed(frame(false,payload),1);
        return size;
    }
};

static void reports() {
    for (bool eng : {false,true}) {
        const Bytes f=observation(eng);
        for(size_t split=1;split<f.size();++split) {
            Wire w; Radar r(w); w.feed(Bytes(f.begin(),f.begin()+split));
            assert(r.getStatus().targetStatus==Radar::TargetStatus::ErrorFrame);
            w.feed(Bytes(f.begin()+split,f.end()));
            auto sample=r.getStatus();
            assert(sample.distance==291 && sample.targetStatus==Radar::TargetStatus::BothTargets);
            assert(sample.radarMode==(eng?1:2));
            if (eng) assert(sample.radarMovePower.moveGate[0]==10 && sample.radarStaticPower.staticGate[8]==27 && sample.photosensitive==98);
        }
        Wire w; Radar r(w); w.feed({11,12,0xf4,0xf3}); w.feed(f,1);
        Radar::RadarStatus sample;
        for(size_t i=0;i<=f.size();++i) {
            auto current=r.getStatus();
            if (current.distance!=-1) sample=current;
            delay(1);
        }
        assert(sample.distance==291);
    }
}

int main() {
    reports();
    Wire w; Radar r(w); w.interleave=true;
    fakeMillis=0xfffffff0u;
    assert(r.getVersion()=="V1.07.22091516");
    assert(!w.configured && w.requests.size()==3);
    assert(r.getStatus().distance==291);
    auto cfg=r.getConfig();assert(cfg.detectionDistance==8 && cfg.moveSetDistance==7 &&
        cfg.staticSetDistance==6 && cfg.radarMovePower.moveGate[0]==20 &&
        cfg.radarStaticPower.staticGate[8]==37 && cfg.noTargrtduration==0x1234);
    assert(r.setGatePower(0,0,100)==Radar::AskStatus::Success);
    assert(r.setGatePower(0xffff,11,99)==Radar::AskStatus::Success);
    auto req=w.requests[w.requests.size()-2];assert(req[10]==255 && req[11]==255 && req[16]==11 && req[22]==99);
    assert(r.setDetectionDistance(7,0x1234)==Radar::AskStatus::Success);
    req=w.requests[w.requests.size()-2];assert(req[10]==7 && req[16]==7 && req[22]==0x34 && req[23]==0x12);
    assert(r.setResolution(1)==Radar::AskStatus::Success && !w.configured && r.getResolution().resolution==1);
    assert(r.enableEngineeringModel()==Radar::AskStatus::Success && r.disableEngineeringModel()==Radar::AskStatus::Success);
    assert(r.refactoryRadar()==Radar::AskStatus::Success && r.rebootRadar()==Radar::AskStatus::Success && !w.configured);
    w.fault=Wire::Reject;assert(r.setGatePower(1,2,3)==Radar::AskStatus::Error);
    w.fault=Wire::Short;assert(r.getConfig().detectionDistance==-1);
    w.fault=Wire::Silent;uint32_t at=fakeMillis;
    assert(r.enableConfigMode()==Radar::AskStatus::Error && uint32_t(fakeMillis-at)==180);
    w.fault=Wire::None;assert(r.getResolution().resolution==1);
    std::cout<<"PASS: report splits, interleaved and delayed ACKs, version, gates, timing, resolution, engineering, restart and recovery\n";
}
