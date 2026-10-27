import { describe, expect, it } from "vite-plus/test";
import { ENGINE_DEFAULTS, Engine } from "../src/engine";
import { FiniteTrack, layoutOf } from "../src/track";

// 4 slides of 300px in a 650px window: we can scroll 1200 − 650 = 550px
const layout = layoutOf([300, 300, 300, 300], 650);

function makeEngine() {
  const engine = new Engine({ ...ENGINE_DEFAULTS });
  engine.track = new FiniteTrack(layout);
  return engine;
}

/** Run the engine for `seconds` at 60 fps. */
function run(engine: Engine, seconds: number) {
  for (let i = 0; i < seconds * 60; i++) engine.step(1 / 60);
}

describe("Engine", () => {
  it("moves current to target and finishes exactly", () => {
    const engine = makeEngine();
    engine.target = 300;
    run(engine, 2);
    expect(engine.current).toBe(300);
  });

  it("snaps to the nearest snap point when a gesture ends", () => {
    const engine = makeEngine();
    engine.begin();
    engine.move(420);
    engine.end();
    expect(engine.target).toBe(300);
  });

  it("rubber-bands past the edges and springs back", () => {
    const engine = makeEngine();
    engine.begin();
    engine.move(-100);
    expect(engine.target).toBeCloseTo(-30); // only 30% of the overdrag is drawn
    engine.end();
    expect(engine.target).toBe(0);
  });

  it("does not jump when grabbed mid-bounce", () => {
    const engine = makeEngine();
    engine.begin();
    engine.move(-100);
    run(engine, 1); // drawn 30px past the start
    engine.end();
    run(engine, 0.05); // released: part-way back
    const drawnAt = engine.current;

    engine.begin(); // grab it again…
    engine.move(0); // …and hold still
    expect(engine.target).toBeCloseTo(drawnAt);
  });
});
