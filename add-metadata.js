const fs = require("fs");
const path = require("path");

const appDir = path.join(process.cwd(), "app");

function walk(dir) {
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (entry !== "page.tsx") continue;
    if (fullPath.includes(`${path.sep}category${path.sep}`)) continue;
    if (fullPath.includes(`${path.sep}about${path.sep}`)) continue;
    if (fullPath.includes(`${path.sep}contact${path.sep}`)) continue;
    if (fullPath.includes(`${path.sep}privacy-policy${path.sep}`)) continue;
    if (fullPath.includes(`${path.sep}terms${path.sep}`)) continue;

    let content = fs.readFileSync(fullPath, "utf8");
    const original = content;

    const relative = path.relative(appDir, fullPath);
    const folder = relative.split(path.sep)[0];

    if (!folder || folder === "page.tsx") continue;

    const href = `/${folder}`;

    if (!content.includes('import type { Metadata } from "next";')) {
      content = `import type { Metadata } from "next";\n${content}`;
    }

    if (!content.includes('getToolMetadata')) {
      content = content.replace(
        /import type \{ Metadata \} from "next";\n/,
        `import type { Metadata } from "next";\nimport { getToolMetadata } from "@/lib/metadata";\n`
      );
    }

    if (!content.includes("export const metadata")) {
      const importBlockMatch = content.match(/(?:import[\s\S]*?;\n)+/);

      if (importBlockMatch) {
        const insertIndex = importBlockMatch[0].length;

        content =
          content.slice(0, insertIndex) +
          `\nexport const metadata: Metadata = getToolMetadata("${href}");\n\n` +
          content.slice(insertIndex);
      }
    }

    if (content !== original) {
      fs.writeFileSync(fullPath, content);
      console.log("Updated:", fullPath);
    }
  }
}

walk(appDir);