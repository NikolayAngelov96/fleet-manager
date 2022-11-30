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

export function getSearchParams(location: string) {
  const query = new URLSearchParams(location);

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
*/
