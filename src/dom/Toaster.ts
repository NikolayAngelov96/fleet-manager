import { div } from "./dom";

class Toaster {
  private body: HTMLElement;
  element: HTMLDivElement;

  constructor();
  constructor(parent?: HTMLElement) {
    if (parent) {
      this.body = parent;
    } else {
      this.body = document.body;
    }
    this.element = div({ className: "toaster" }) as HTMLDivElement;
    this.element.style.top = "100px";
  }

  success(message: string) {
    this.element.textContent = `✅ ${message}`;
    this.displayElement();
  }

  error(message: string) {
    this.element.textContent = `❌ ${message}`;
    this.displayElement();
  }

  private displayElement() {
    this.body.appendChild(this.element);

    setTimeout(() => {
      this.element.remove();
    }, 3000);
  }
}

export const toast = new Toaster();
