import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const dirsToClean = [
  path.join(rootDir, "public", "uploads", "videos"),
  path.join(rootDir, "public", "uploads", "images"),
  path.join(rootDir, "public", "uploads", "banners"),
];

for (const dir of dirsToClean) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file === ".gitkeep") continue;
      const fullPath = path.join(dir, file);
      try {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`Usunięto plik: ${file}`);
      } catch (err) {
        console.error(`Błąd usuwania pliku ${file}:`, err);
      }
    }
  }
}

// Reset posts.json
const postsFile = path.join(rootDir, "data", "posts.json");
fs.writeFileSync(postsFile, "[]\n", "utf-8");

// Reset creators.json
const creatorsFile = path.join(rootDir, "data", "creators.json");
fs.writeFileSync(creatorsFile, "[]\n", "utf-8");

console.log("\n✅ Wszelkie wgrane pliki wideo, miniaturki, posty oraz profile testowe zostały pomyślnie usunięte!");
