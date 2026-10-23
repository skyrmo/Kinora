import "./style.css";
import { Kinora } from "kinora";

const wrapper = document.querySelector<HTMLElement>("[data-carousel]")!;
const kinora = new Kinora(wrapper);

(window as any).kinora = kinora;
