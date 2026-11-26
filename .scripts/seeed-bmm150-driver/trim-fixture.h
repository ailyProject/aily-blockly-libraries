/* Synthetic, nonzero OTP fixture for differential tests. */
#define SET_TRIM(t) do { (t).dig_x1=-3; (t).dig_y1=5; (t).dig_x2=7; (t).dig_y2=-8; \
  (t).dig_z1=29000; (t).dig_z2=-11000; (t).dig_z3=32; (t).dig_z4=-120; \
  (t).dig_xy1=45; (t).dig_xy2=-4; (t).dig_xyz1=24000; } while(0)
