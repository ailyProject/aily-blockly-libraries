#pragma once

// Match FastLED's by-value max overload and its global using declaration.
namespace fl {
template <typename T, typename U>
constexpr auto max(T a, U b) {
  return (a > b) ? a : b;
}
}

using fl::max;
