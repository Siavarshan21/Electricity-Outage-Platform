export function filterItems<T extends Record<string, unknown>>(
  items: T[],
  filters: Record<string, string | undefined>,
): T[] {
  return items.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value || value === "") return true;
      const itemValue = item[key];
      if (typeof itemValue === "string") {
        return itemValue.toLowerCase().includes(value.toLowerCase());
      }
      return String(itemValue) === value;
    });
  });
}
