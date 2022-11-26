export function generateId(): string {
  return "0000-0000".replace(/0/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  );
}
