#pragma once

// Match the CI13xx core's global, const-reference max overload.
template <class T, class L>
constexpr auto max(const T &a, const L &b) -> decltype((b < a) ? b : a) {
  return (a < b) ? b : a;
}
