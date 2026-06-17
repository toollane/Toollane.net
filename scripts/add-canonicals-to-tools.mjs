import fs from "fs";
import path from "path";

const appDir = path.join(process.cwd(), "app");
const dryRun = process.argv.includes("--dry");

function walk(dir) {
  const entries = fs.readdirSync(dir, {
    withFileTypes: true,
  });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walk(fullPath);
    }

    if (entry.isFile() && entry.name === "page.tsx") {
      return [fullPath];
    }

    return [];
  });
}

function getRouteFromFile(filePath) {
  const relative = path.relative(appDir, path.dirname(filePath));

  if (!relative || relative === ".") {
    return "/";
  }

  const segments = relative
    .split(path.sep)
    .filter((segment) => !segment.startsWith("("))
    .filter((segment) => !segment.startsWith("@"))
    .filter(Boolean);

  return `/${segments.join("/")}`;
}

function findMetadataObject(content) {
  const token = "export const metadata: Metadata =";
  const start = content.indexOf(token);

  if (start === -1) {
    return null;
  }

  const objectStart = content.indexOf("{", start);

  if (objectStart === -1) {
    return null;
  }

  let depth = 0;

  for (let index = objectStart; index < content.length; index += 1) {
    const char = content[index];

    if (char === "{") {
      depth += 1;
    }

    if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        return {
          start,
          objectStart,
          objectEnd: index,
        };
      }
    }
  }

  return null;
}

function extractHref(content, filePath) {
  const hrefMatch = content.match(/href\s*=\s*["']([^"']+)["']/);

  if (hrefMatch?.[1]) {
    return hrefMatch[1];
  }

  return getRouteFromFile(filePath);
}

const pageFiles = walk(appDir);

const changedFiles = [];
const skippedFiles = [];

for (const filePath of pageFiles) {
  const content = fs.readFileSync(filePath, "utf8");

  if (!content.includes("ToolPageLayout")) {
    skippedFiles.push({
      filePath,
      reason: "No ToolPageLayout",
    });
    continue;
  }

  const metadata = findMetadataObject(content);

  if (!metadata) {
    skippedFiles.push({
      filePath,
      reason: "No metadata object",
    });
    continue;
  }

  const metadataContent = content.slice(metadata.objectStart, metadata.objectEnd + 1);

  if (metadataContent.includes("alternates:")) {
    skippedFiles.push({
      filePath,
      reason: "Already has alternates",
    });
    continue;
  }

  const canonical = extractHref(content, filePath);

  if (!canonical || canonical === "/") {
    skippedFiles.push({
      filePath,
      reason: "No valid canonical found",
    });
    continue;
  }

  const insertion = `

  alternates: {
    canonical: "${canonical}",
  },`;

  const updatedContent =
    content.slice(0, metadata.objectEnd) +
    insertion +
    content.slice(metadata.objectEnd);

  changedFiles.push({
    filePath,
    canonical,
  });

  if (!dryRun) {
    fs.writeFileSync(filePath, updatedContent, "utf8");
  }
}

console.log("");
console.log("Canonical migration finished.");
console.log("");

console.log(`Changed files: ${changedFiles.length}`);
for (const item of changedFiles) {
  console.log(`  ✓ ${path.relative(process.cwd(), item.filePath)} -> ${item.canonical}`);
}

console.log("");
console.log(`Skipped files: ${skippedFiles.length}`);
for (const item of skippedFiles) {
  console.log(
    `  - ${path.relative(process.cwd(), item.filePath)} — ${item.reason}`
  );
}

if (dryRun) {
  console.log("");
  console.log("Dry run only. No files were changed.");
}