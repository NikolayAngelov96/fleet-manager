type DomContent = string | Node;

type elementFactory<T extends HTMLElement> = (
  props?: object,
  ...content: DomContent[]
) => T;

export function e(type: string, props?: object, ...content: DomContent[]) {
  const element = document.createElement(type);

  if (props) {
    for (const propName in props) {
      if (propName.startsWith("on")) {
        const eventName = propName.slice(0, 2).toLowerCase();
        element.addEventListener(eventName, props[propName]);
      } else {
        element[propName] = props[propName];
      }
    }
  }

  for (const item of content) {
    element.append(item);
  }

  return element;
}

export const table: elementFactory<HTMLTableElement> = e.bind(null, "table");
export const thead: elementFactory<HTMLTableSectionElement> = e.bind(
  null,
  "thead"
);
export const tbody: elementFactory<HTMLTableSectionElement> = e.bind(
  null,
  "tbody"
);
export const tfoot: elementFactory<HTMLTableSectionElement> = e.bind(
  null,
  "tfoot"
);
export const tr: elementFactory<HTMLTableRowElement> = e.bind(null, "tr");
export const th: elementFactory<HTMLTableCellElement> = e.bind(null, "th");
export const td: elementFactory<HTMLTableCellElement> = e.bind(null, "td");
export const button: elementFactory<HTMLButtonElement> = e.bind(null, "button");
export const span: elementFactory<HTMLSpanElement> = e.bind(null, "span");
export const div: elementFactory<HTMLDivElement> = e.bind(null, "div");
export const a: elementFactory<HTMLAnchorElement> = e.bind(null, "a");
export const p: elementFactory<HTMLParagraphElement> = e.bind(null, "p");
export const strong: elementFactory<HTMLElement> = e.bind(null, "strong");
