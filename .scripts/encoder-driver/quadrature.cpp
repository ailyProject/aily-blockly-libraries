#include <AilyEncoderState.h>
#include <climits>

unsigned irqMask = 0, levels = ~0u;
std::function<void()> handlers[16];

void edge(unsigned pin) {
    levels ^= 1u << pin;
    if (handlers[pin % 16]) handlers[pin % 16]();
}
void rotate(Encoder& dial, unsigned a, unsigned b, bool forward) {
    for (unsigned pin : {forward ? b : a, forward ? a : b, forward ? b : a, forward ? a : b}) {
        edge(pin);
        dial.read();  // Also exercises the explicitly polled configuration.
    }
}
int main() {
    {
        AilyEncoderState left(1, 0), right(4, 5);
        left.begin(); left.begin(); right.write(0);
        assert(!irqMask && left.read() == 0 && right.read() == 0);
        rotate(left, 1, 0, true); rotate(right, 4, 5, false);
        left.poll(); right.poll();
        assert(left.read() == 4 && right.read() == -4 && left.direction == 1 && right.direction == -1);
        left.upperLimit = 6; rotate(left, 1, 0, true); left.poll();
        assert(left.read() == 6 && left.aboveLimit && !right.aboveLimit);
        irqMask = 1;
        assert(right.readAndReset() == -4 && right.read() == 0 && irqMask);
        left.write(INT32_MAX);
        edge(0); assert(left.read() == INT32_MIN && irqMask);
        irqMask = 0;
        Encoder disjointPortSameLine(17, 2); disjointPortSameLine.begin();
        Encoder invalid(99, 1); invalid.begin(); assert(invalid.read() == 0);
        Encoder same(3, 3); same.begin(); assert(same.read() == 0);
    }
    for (const auto& handler : handlers) assert(!handler);
}
