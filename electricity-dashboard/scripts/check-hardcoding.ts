import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve(__dirname, "../src");
const IGNORE_DIRS = ["test", "node_modules"];
const EXTENSIONS = [".tsx", ".ts"];

const hardcodedPatterns = [
  />\s*[A-Z][a-z]+(?:\s+[a-z]+)*\s*</g, // Text content in JSX
];

function main() {
  const issues: Array<{ file: string; line: number; content: string }> = [];

  function scan(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (IGNORE_DIRS.includes(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
        checkFile(fullPath);
      }
    }
  }

  function checkFile(filePath: string) {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    lines.forEach((line, index) => {
      for (const pattern of hardcodedPatterns) {
        pattern.lastIndex = 0;
        const match = pattern.exec(line);
        if (match && !line.includes("t(") && !line.includes("className")) {
          issues.push({
            file: path.relative(SRC_DIR, filePath),
            line: index + 1,
            content: line.trim(),
          });
        }
      }
    });
  }

  scan(SRC_DIR);

  if (issues.length === 0) {
    console.log("No potential hardcoded strings found.");
  } else {
    console.log(`Found ${issues.length} potential hardcoded strings:\n`);
    issues.forEach((issue) => {
      console.log(`  ${issue.file}:${issue.line}`);
      console.log(`    ${issue.content}\n`);
    });
  }
}

main();
