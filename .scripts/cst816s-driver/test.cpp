#include <cassert>
#include <iostream>
#include "CST816S.h"
static void fire(int pin) { if (interrupts.at(pin)) interrupts.at(pin)(); }
int main() {
  TwoWire first, second;
  CST816S touch;
  int callbacks = 0;
  touch.attachUserInterrupt([&] { ++callbacks; });
  first.input = {1, 0xb4, 0, 1};
  touch.begin(2, 3, &first);
  assert(touch.data.versionInfo[0] == 0xb4 && !touch.available());
  {
    CST816S other;
    other.begin(4, 5, &second);
    second.input = {5, 1, 0x40, 17, 0, 23};
    fire(5);
    assert(!touch.available() && other.available() && other.data.x == 17 && other.data.y == 23);
    first.input = {0x0b, 1, 0x80, 23, 0, 17};
    fire(3);
    assert(touch.available() && !other.available() && touch.gesture() == "DOUBLE CLICK" && touch.data.event == 2);
    for (int length = 0; length < 6; ++length) {
      first.input.assign(length, 255);
      fire(3);
      assert(!touch.available() && first.input.empty() && touch.data.x == 23 && touch.data.y == 17);
    }
    first.countOverride = 6;
    first.input = {5, 1};
    fire(3);
    assert(!touch.available() && touch.data.gestureID == 0x0b);
    first.countOverride = -1;
    first.ack = false;
    fire(3);
    assert(!touch.available());
    first.ack = true;
    first.rejectWrite = true;
    fire(3);
    assert(!touch.available());
    first.rejectWrite = false;
    first.onRequest = [] { fire(3); };
    first.input = {3, 1, 1, 44, 0, 9};
    fire(3);
    assert(touch.available() && touch.data.x == 300);
    first.onRequest = {};
    first.input = {4, 1, 0, 8, 0, 10};
    assert(touch.available() && touch.data.x == 8 && !touch.available());
    assert(callbacks > 0);
    other.begin(4, 6, &second);
    assert(!interrupts[5] && interrupts[6] && interrupts[3]);
    other.end();
    other.end();
    assert(!interrupts[6] && interrupts[3]);
    other.begin(4, 7, &second);
  }
  assert(!interrupts[7] && interrupts[3]);
  fire(3);
  touch.end();
  assert(!interrupts[3] && !touch.available());
  std::cout << "CST816S full, malformed, recovery, IRQ during read, two buses, rebind and release passed\n";
}
