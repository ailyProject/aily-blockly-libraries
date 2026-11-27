#pragma once
#include "Arduino.h"
#include <deque>
#include <functional>
#include <vector>

class HardwareSerial {
public:
  unsigned baud = 0;
  int rxPin = -1, txPin = -1;
  std::vector<std::string> commands;
  std::function<std::string(const std::string&)> reply;
  void begin(unsigned b, unsigned, int rx, int tx) { baud=b; rxPin=rx; txPin=tx; }
  void begin(unsigned b) { baud=b; }
  size_t write(const uint8_t* bytes, size_t size) {
    for (size_t i=0; i<size; ++i) {
      line += static_cast<char>(bytes[i]);
      if (line.size() >= 2 && line.compare(line.size()-2, 2, "\r\n")==0) {
        line.resize(line.size()-2);
        commands.push_back(line);
        if (reply) offer(reply(line));
        line.clear();
      }
    }
    return size;
  }
  int available() const { return rx.size(); }
  int read() { const int b=rx.front(); rx.pop_front(); return b; }
  void offer(const std::string& frame) { rx.insert(rx.end(),frame.begin(),frame.end()); }
private:
  std::string line;
  std::deque<char> rx;
};
