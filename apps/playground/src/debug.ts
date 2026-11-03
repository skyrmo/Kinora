import type { Kinora } from "kinora";

/** Live readout of the carousel's numbers. Returns a cleanup function. */
export function debug(kinora: Kinora) {
  const panel = document.createElement("pre");
  panel.className = "debug";
  document.body.append(panel);

  const show = () => {
    const { target, current } = kinora.engine;
    const gap = target - current;
    const bar = "█".repeat(Math.min(40, Math.round(Math.abs(gap) / 10)));
    panel.textContent = [
      `target   ${target.toFixed(1)} px`,
      `current  ${current.toFixed(1)} px`,
      `gap      ${gap.toFixed(1)} px`,
      `         ${bar}`,
      `page     ${kinora.index + 1} / ${kinora.pageCount}`,
      `cell     ${kinora.cellIndex + 1} / ${kinora.cells.length}`,
      `progress ${(kinora.progress * 100).toFixed(0)}%`,
    ].join("\n");
  };

  show();
  const stop = kinora.on("update", show);
  return () => {
    stop();
    panel.remove();
  };
}
