import { div } from "./dom";

export class Loader {
  private element: HTMLDivElement = div({ className: "lds-dual-ring" });

  show(parent: HTMLElement) {
    parent.appendChild(this.element);
  }

  hide() {
    this.element.remove();
  }
}
