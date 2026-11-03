import "./style.css";
import { Kinora } from "kinora";
import { debug } from "./debug";
import { panel } from "./panel";

const wrapper = document.querySelector<HTMLElement>("[data-carousel]")!;
const kinora = new Kinora(wrapper);

debug(kinora);
panel(kinora);

document.querySelector("[data-prev]")!.addEventListener("click", () => kinora.prev());
document.querySelector("[data-next]")!.addEventListener("click", () => kinora.next());
kinora.on("change", ({ index, previous }) => console.log(`page ${previous} → ${index}`));

(window as any).kinora = kinora;
