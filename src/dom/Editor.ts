export class Editor {
  constructor(
    private form: HTMLFormElement,
    private submitHandler: (data: any) => void
  ) {
    this.form.addEventListener("submit", (e) => this.onSubmit(e));
  }

  onSubmit(e: SubmitEvent) {
    e.preventDefault();

    const formData = new FormData(this.form);

    const data = Object.fromEntries(formData);

    this.submitHandler(data);
  }

  setValue(field: string, value: any) {
    const target = this.form.querySelector(`[name="${field}"]`);

    if (target instanceof HTMLInputElement) {
      if (target.type == "checkbox") {
        target.checked = value;
      } else {
        target.value = value;
      }
    } else if (
      target instanceof HTMLSelectElement ||
      target instanceof HTMLTextAreaElement
    ) {
      target.value = value;
    }
  }

  setValues(data: object) {
    for (const [field, value] of Object.entries(data)) {
      this.setValue(field, value);
    }
  }

  clear() {
    this.form.reset();
  }

  remove() {
    this.form.remove();
  }

  attachTo(parent: HTMLElement) {
    parent.appendChild(this.form);
  }
}
