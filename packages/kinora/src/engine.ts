import { damp } from "./utils";
import { FiniteTrack, type Track } from "./track";

export interface EngineOptions {
  snap: boolean;
  damping: number;
  edgeResistance: number;
}

export const ENGINE_DEFAULTS: EngineOptions = {
  snap: true,
  damping: 10,
  edgeResistance: 0.3,
};

export class Engine {
  options: EngineOptions;

  track: Track = new FiniteTrack({ cells: [], total: 0, viewport: 0 });

  target = 0;
  current = 0;
  isInteracting = false;

  #raw = 0;

  constructor(options: EngineOptions) {
    this.options = options;
  }

  step(dt: number): boolean {
    const previous = this.current;
    this.current = damp(this.current, this.target, this.options.damping, dt);
    // stop the animation when close enough
    if (Math.abs(this.target - this.current) < 0.01) {
      this.current = this.target;
    }
    return this.current !== previous;
  }

  begin() {
    this.isInteracting = true;
    this.target = this.current; // "catch" the carousel where it is
    this.#raw = this.track.unresist(this.current, this.options.edgeResistance);
  }

  move(delta: number) {
    if (!this.isInteracting) return;
    this.#raw += delta;
    this.target = this.track.resist(this.#raw, this.options.edgeResistance);
  }

  end() {
    if (!this.isInteracting) return;
    this.isInteracting = false;
    this.settle();
  }

  nearestIndex(position: number): number {
    let best = 0;
    let bestDistance = Infinity;
    this.track.snapPoints.forEach((point, i) => {
      const distance = Math.abs(this.track.distance(position, point));
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    return best;
  }

  settle(position = this.target) {
    position = this.track.clamp(position);
    if (this.options.snap) {
      const point = this.track.snapPoints[this.nearestIndex(position)];
      position += this.track.distance(position, point);
    }
    this.target = position;
  }
}
