import GUI from "lil-gui";
import type { Kinora } from "kinora";

/** Sliders bound directly to kinora.options. Returns a cleanup function. */
export function panel(kinora: Kinora) {
  const gui = new GUI({ title: "Kinora" });
  gui.add(kinora.options, "damping", 1, 40, 0.5);
  gui.add(kinora.options, "dragSensitivity", 0.2, 3, 0.1);
  return () => gui.destroy();
}
