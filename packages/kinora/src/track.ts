export interface CellBox {
  start: number;
  size: number;
}

export interface Layout {
  cells: readonly CellBox[];
}
