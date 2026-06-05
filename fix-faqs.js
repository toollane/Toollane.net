const fs = require("fs");
const path = require("path");

const appDir = path.join(process.cwd(), "app");

function walk(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (file !== "page.tsx") continue;

    let content = fs.readFileSync(fullPath, "utf8");
    const original = content;

    content = content.replace(
      /const faqs = \[[\s\S]*?\];\s*/g,
      ""
    );

    content = content.replace(
      /\s*faqs=\{faqs\}/g,
      ""
    );

    if (content !== original) {
      fs.writeFileSync(fullPath, content);
      console.log("Fixed:", fullPath);
    }
  }
}

walk(appDir);