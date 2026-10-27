import { clamp } from "./utils";

export interface CellBox {
  start: number;
  size: number;
}

export interface Layout {
  cells: readonly CellBox[];
  total: number;
  viewport: number;
}

export function layoutOf(sizes: number[], viewport: number): Layout {
  let total = 0;
  const cells = sizes.map((size) => {
    const cell = { start: total, size };
    total += size;
    return cell;
  });

  return { cells, total, viewport };
}

export interface Track {
  /** Positions (px) the carousel may come to rest at: one per page. */
  readonly snapPoints: number[];

  /** Pull a resting position into the allowed range. */
  clamp(position: number): number;

  /** Rubber-band: where a raw gesture position is actually drawn. */
  resist(raw: number, strength: number): number;

  /** The reverse of resist: which raw position is drawn at `position`. */
  unresist(position: number, strength: number): number;
  /** Signed distance from position `a` to position `b`. */

  distance(a: number, b: number): number;
}

export class FiniteTrack implements Track {
  readonly snapPoints: number[] = [];
  readonly max: number;

  constructor(layout: Layout) {
    this.max = Math.max(0, layout.total - layout.viewport);
    for (const cell of layout.cells) {
      const point = Math.min(cell.start, this.max);
      const last = this.snapPoints[this.snapPoints.length - 1];
      if (last === undefined || point - last > 1) {
        this.snapPoints.push(point);
      }
    }
    if (this.snapPoints.length === 0) {
      this.snapPoints.push(0);
    }
  }

  clamp(position: number): number {
    return clamp(position, 0, this.max);
  }

  resist(raw: number, strength: number) {
    if (raw < 0) {
      return raw * strength;
    }
    if (raw > this.max) {
      return this.max + (raw - this.max) * strength;
    }
    return raw;
  }

  unresist(position: number, strength: number) {
    if (strength <= 0) {
      return this.clamp(position);
    }
    if (position < 0) {
      return position / strength;
    }
    if (position > this.max) {
      return this.max + (position - this.max) / strength;
    }
    return position;
  }

  distance(a: number, b: number): number {
    return b - a;
  }
}
