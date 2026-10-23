import { ENGINE_DEFAULTS, Engine, type EngineOptions } from "./engine";
import { clamp } from "./utils";

export interface KinoraOptions extends EngineOptions {
  dragSensitivity: number;
}

const DEFAULTS: KinoraOptions = {
  dragSensitivity: 1,
  ...ENGINE_DEFAULTS,
};

export class Kinora {
  readonly wrapper: HTMLElement;
  readonly items: HTMLElement[];
  readonly options: KinoraOptions;
  readonly engine: Engine;

  #pointerId: number | null = null;
  #lastPointer = 0;
  #lastTime: number | null = null;
  #abort = new AbortController();

  constructor(wrapper: HTMLElement, options = {}) {
    this.wrapper = wrapper;
    this.items = Array.from(wrapper.children) as HTMLElement[];
    this.options = { ...DEFAULTS, ...options };
    this.engine = new Engine(this.options);
    this.#addEvents();
    requestAnimationFrame(this.#loop);
  }

  #addEvents() {
    const signal = this.#abort.signal;
    this.wrapper.addEventListener("pointerdown", this.#onPointerDown, { signal });
    window.addEventListener("pointermove", this.#onPointerMove, { signal });
    window.addEventListener("pointerup", this.#onPointerUp, { signal });
    window.addEventListener("pointercancel", this.#onPointerUp, { signal });
  }

  update(now = performance.now()) {
    const dt = this.#lastTime === null ? 0 : clamp((now - this.#lastTime) / 1000, 0, 0.1);
    this.#lastTime = now;
    if (this.engine.step(dt)) {
      this.#render();
    }
  }

  #loop = (time: number) => {
    this.update(time);
    requestAnimationFrame(this.#loop);
  };

  #onPointerDown = (e: PointerEvent) => {
    if (this.#pointerId !== null) return; // already following another pointer
    if (e.pointerType === "mouse" && e.button !== 0) return; // left button only
    this.#pointerId = e.pointerId;
    this.#lastPointer = e.clientX;
    this.engine.begin();
    this.wrapper.classList.add("is-dragging");
  };

  #onPointerMove = (e: PointerEvent) => {
    if (e.pointerId !== this.#pointerId) return;
    const delta = e.clientX - this.#lastPointer;
    this.#lastPointer = e.clientX;
    this.engine.move(-delta * this.options.dragSensitivity);
  };

  #onPointerUp = (e: PointerEvent) => {
    if (e.pointerId !== this.#pointerId) return;
    this.#pointerId = null;
    this.engine.end();
    this.wrapper.classList.remove("is-dragging");
  };

  #render() {
    const x = -this.engine.current;
    for (const item of this.items) {
      item.style.transform = `translate3d(${x}px, 0, 0)`;
    }
  }
}
