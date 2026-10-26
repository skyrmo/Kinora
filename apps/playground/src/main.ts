import "./style.css";
import { Kinora } from "kinora";
import { debug } from "./debug";
import { panel } from "./panel";

const wrapper = document.querySelector<HTMLElement>("[data-carousel]")!;
const kinora = new Kinora(wrapper);

debug(kinora);
panel(kinora);

(window as any).kinora = kinora;
