let counter = 0;

export function generateId(prefix = "id"): string {
  counter += 1;
  return `${prefix}_${Date.now()}_${counter}`;
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}
