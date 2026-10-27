import { describe, expect, it } from "vite-plus/test";
import { FiniteTrack, layoutOf } from "../src/track";

// 4 slides of 300px in a 650px window: we can scroll 1200 − 650 = 550px
const layout = layoutOf([300, 300, 300, 300], 650);

describe("FiniteTrack", () => {
  const track = new FiniteTrack(layout);

  it("stops where the last slide's end meets the window's end", () => {
    expect(track.max).toBe(550);
    expect(track.snapPoints).toEqual([0, 300, 550]);
  });

  it("clamps resting positions", () => {
    expect(track.clamp(-50)).toBe(0);
    expect(track.clamp(999)).toBe(550);
  });

  it("unresist undoes resist", () => {
    for (const raw of [-200, -10, 0, 275, 560, 900]) {
      expect(track.unresist(track.resist(raw, 0.3), 0.3)).toBeCloseTo(raw);
    }
  });

  it("has a single snap point when everything fits", () => {
    const small = new FiniteTrack(layoutOf([100, 100], 650));
    expect(small.snapPoints).toEqual([0]);
  });
});
