import { seedDatabase, type SeedData } from "./seed";

let db: SeedData | null = null;

export function getDb(): SeedData {
  if (!db) {
    db = seedDatabase();
  }
  return db;
}

export function resetDb(): void {
  db = seedDatabase();
}
