import { damp } from "./utils";

export interface EngineOptions {
  damping: number;
}

export const ENGINE_DEFAULTS: EngineOptions = {
  damping: 10,
};

export class Engine {
  options: EngineOptions;
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
    this.#raw = this.target;
  }

  move(delta: number) {
    if (!this.isInteracting) return;
    this.#raw += delta;
    this.target = this.#raw;
  }

  end() {
    this.isInteracting = false;
  }
}
