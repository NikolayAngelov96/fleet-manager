import { span } from "./dom/dom";

export function generateId(): string {
  return "0000-0000".replace(/0/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  );
}

export type SearchParams = {
  type?: string;
  availableOnly?: string;
};

export function getSearchParams(str: string) {
  const query = new URLSearchParams(window.location.search);

  let params: SearchParams = {};
  for (const [key, value] of [...query.entries()]) {
    params[key] = value;
  }

  return params;
}
/*
export function getSearchParams(query: string) {
  const querySplit = query.slice(1).split("&");

  let params = {};
  for (const query of querySplit) {
    let [key, value] = query.split("=");
    params[key] = value;
  }

  return params;
}

/*

export function checkOnSubmitForEmptyFields<T>(data: T) {
  let keysWithErrors: string[] = [];

  for (const key in data) {
    if (data[key] == "") {
      keysWithErrors.push(key);
    }
  }

  return keysWithErrors;
}

export function displaySubmitErrors(keys: string[]) {
  for (const key of keys) {
    let errorMessage = `${key} is a required field`;
    const errorElement = span({ className: "error-message" }, errorMessage);

    const inputElement = document.querySelector(
      `[name=${key}]`
    ) as HTMLInputElement;

    inputElement.style.position = "relative";

    inputElement.appendChild(errorElement);

    inputElement.style.border = "2px solid red";
  }
}


styles:

.error-message {
  color: red;
  position: absolute;
  top: 0;
  right: -270px;
}

*/
