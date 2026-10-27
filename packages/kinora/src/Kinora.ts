import { ENGINE_DEFAULTS, Engine, type EngineOptions } from "./engine";
import { Emitter } from "./emitter";
import { clamp } from "./utils";
import { FiniteTrack, type CellBox, type Layout } from "./track";

export interface KinoraOptions extends EngineOptions {
  dragSensitivity: number;
}

/** Event name → what listeners receive. (A `type`, not an `interface`, so it fits Record<string, unknown>.) */
export type KinoraEvents = {
  update: Kinora;
};

export interface Cell extends CellBox {
  /** Its place in the strip (0 = first). */
  index: number;
  /** The element in this cell (a direct child of the wrapper). */
  element: HTMLElement;
}

const DEFAULTS: KinoraOptions = {
  dragSensitivity: 1,
  ...ENGINE_DEFAULTS,
};

export class Kinora extends Emitter<KinoraEvents> {
  readonly wrapper: HTMLElement;
  readonly options: KinoraOptions;
  readonly engine: Engine;

  // readonly items: HTMLElement[];

  cells: Cell[] = [];
  layout: Layout = { cells: [], total: 0, viewport: 0 };

  #pointerId: number | null = null;
  #lastPointer = 0;
  #lastTime: number | null = null;
  #abort = new AbortController();

  constructor(wrapper: HTMLElement, options = {}) {
    super();
    this.wrapper = wrapper;
    this.options = { ...DEFAULTS, ...options };
    this.engine = new Engine(this.options);
    this.#measure();
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
      this.emit("update", this);
    }
  }

  #measure() {
    const elements = Array.from(this.wrapper.children) as HTMLElement[];
    let total = 0;
    this.cells = elements.map((element, index) => {
      const size = element.getBoundingClientRect().width;
      const cell: Cell = { index, element, start: total, size };
      total += size;
      return cell;
    });
    this.layout = { cells: this.cells, total, viewport: this.wrapper.clientWidth };
    this.engine.track = new FiniteTrack(this.layout);
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
    for (const cell of this.cells) {
      cell.element.style.transform = `translate3d(${x}px, 0, 0)`;
    }
  }
}
