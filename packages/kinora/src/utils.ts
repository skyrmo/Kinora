/** Keep `value` between `min` and `max`. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Move from `a` towards `b` by fraction `t`. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Frame rate independent lerp.
 * `lambda`: how fast we approach `b`. ~95% done after 3/lambda seconds.
 * `dt`: seconds since the last frame.
 */
export function damp(a: number, b: number, lambda: number, dt: number): number {
  return lerp(a, b, 1 - Math.exp(-lambda * dt));
}
