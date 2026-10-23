import { describe, expect, it } from "vite-plus/test";
import { damp } from "../src/utils";

describe("damp", () => {
  it("gives the same result whatever the frame rate", () => {
    let at60fps = 0;
    for (let i = 0; i < 60; i++) at60fps = damp(at60fps, 100, 10, 1 / 60);

    let at120fps = 0;
    for (let i = 0; i < 120; i++) at120fps = damp(at120fps, 100, 10, 1 / 120);

    expect(at60fps).toBeCloseTo(at120fps, 6);
  });

  it("is ~95% of the way after 3 / lambda seconds", () => {
    expect(damp(0, 100, 10, 0.3)).toBeCloseTo(95, 0);
  });
});
