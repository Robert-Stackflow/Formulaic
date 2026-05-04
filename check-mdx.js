const fs = require("fs");
const path = require("path");
const { compile } = require("@mdx-js/mdx");

const MDX_ROOT = path.join(__dirname, "content/docs");

function scanMdxFiles(dir) {
  let list = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      list = list.concat(scanMdxFiles(full));
    } else if (/\.mdx?$/.test(e.name)) {
      list.push(full);
    }
  }
  return list;
}

async function checkFile(file) {
  const content = fs.readFileSync(file, "utf8");
  try {
    await compile(content, { outputFormat: "program" });
    return null;
  } catch (err) {
    const line = err.loc?.line ?? 0;
    const col = err.loc?.column ?? 0;
    const lineText = line ? content.split("\n")[line - 1]?.trim() : "";
    return {
      file,
      line,
      col,
      message: err.message.split("\n")[0],
      lineText,
    };
  }
}

(async function main() {
  const files = scanMdxFiles(MDX_ROOT);
  console.log(`扫描文件总数: ${files.length}`);

  let errors = [];
  for (const f of files) {
    const err = await checkFile(f);
    if (err) errors.push(err);
  }

  if (errors.length === 0) {
    console.log("所有MDX文件检测通过");
    return;
  }

  console.log(`检测到错误文件: ${errors.length}`);
  for (const e of errors) {
    console.log("----------------------------------------");
    console.log("文件:", e.file);
    console.log("错误:", e.message);
    if (e.lineText) console.log("源码行:", e.lineText);
  }
})();
