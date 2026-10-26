type Listener<T> = (payload: T) => void;

/** A tiny typed event emitter. `Events` maps event names to payload types. */
export class Emitter<Events extends Record<string, unknown>> {
  #listeners: { [K in keyof Events]?: Set<Listener<Events[K]>> } = {};

  /** Listen to an event. Returns a function that stops listening. */
  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
    const listeners = (this.#listeners[event] ??= new Set());
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  protected emit<K extends keyof Events>(event: K, payload: Events[K]) {
    this.#listeners[event]?.forEach((listener) => listener(payload));
  }

  protected clearListeners() {
    this.#listeners = {};
  }
}
