import fs from "fs";
import path from "path";

const LOCALES_DIR = path.resolve(__dirname, "../public/locales");
const LANGS = ["en", "ar"];

function main() {
  const allKeys: Record<string, Set<string>> = {};

  for (const lang of LANGS) {
    const langDir = path.join(LOCALES_DIR, lang);
    if (!fs.existsSync(langDir)) continue;

    const files = fs.readdirSync(langDir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const ns = file.replace(".json", "");
      const content = JSON.parse(fs.readFileSync(path.join(langDir, file), "utf-8"));
      const keys = extractKeys(content);

      if (!allKeys[ns]) allKeys[ns] = new Set();
      keys.forEach((k) => allKeys[ns].add(k));
    }
  }

  console.log("=== i18n Key Report ===");
  for (const [ns, keys] of Object.entries(allKeys)) {
    console.log(`\n[${ns}] (${keys.size} keys)`);
    for (const key of keys) {
      console.log(`  - ${ns}.${key}`);
    }
  }
}

function extractKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      keys.push(...extractKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

main();
