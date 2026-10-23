import { describe, expect, it } from "vite-plus/test";
import { ENGINE_DEFAULTS, Engine } from "../src/engine";

describe("Engine", () => {
  it("moves current to target and finishes exactly", () => {
    const engine = new Engine({ ...ENGINE_DEFAULTS });
    engine.target = 100;
    for (let i = 0; i < 120; i++) engine.step(1 / 60);
    expect(engine.current).toBe(100);
  });

  it("a gesture moves the target", () => {
    const engine = new Engine({ ...ENGINE_DEFAULTS });
    engine.begin();
    engine.move(30);
    engine.move(20);
    engine.end();
    expect(engine.target).toBe(50);
  });
});
