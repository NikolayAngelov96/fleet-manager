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

    let errorKeys = this.checkOnSubmitForEmptyFields(data);

    if (errorKeys.length > 0) {
      this.displaySubmitErrors(errorKeys);
      return;
    }

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

  private checkOnSubmitForEmptyFields(data: any) {
    let keysWithErrors: string[] = [];

    for (const field in data) {
      if (data[field] == "") {
        keysWithErrors.push(field);
      }
    }

    return keysWithErrors;
  }

  private displaySubmitErrors(keys: string[]) {
    let errorMessage = "Please fill all required fields";

    const errorElement = document.createElement("div");

    errorElement.style.color = "red";
    errorElement.textContent = errorMessage;

    this.form.prepend(errorElement);

    for (const key of keys) {
      const element = this.form.querySelector(
        `[name="${key}"]`
      ) as HTMLInputElement;

      element.style.border = "2px solid red";
    }
  }
}
