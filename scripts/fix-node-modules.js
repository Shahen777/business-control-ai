const fs = require('fs');
const path = require('path');

function exists(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
}

function tryRename(fromPath, toPath) {
  try {
    fs.renameSync(fromPath, toPath);
    console.log(`[postinstall] renamed: ${fromPath} -> ${toPath}`);
    return true;
  } catch (error) {
    console.warn(`[postinstall] rename failed: ${fromPath} -> ${toPath}: ${error.message}`);
    return false;
  }
}

function fixDuplicatedNames(rootDir) {
  const queue = [rootDir];
  const maxEntries = 200000;
  let seen = 0;

  while (queue.length > 0) {
    const currentDir = queue.shift();

    let entries;
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      seen += 1;
      if (seen > maxEntries) {
        console.warn('[postinstall] scan limit reached; stopping early');
        return;
      }

      const name = entry.name;

      // 1) "name 2"  -> "name" (directory duplication pattern on macOS)
      // 2) "file 2.js" -> "file.js"
      const canonicalName = name
        .replace(/ 2(?=\.|$)/, '')
        .replace(/ 2(?=\.d\.ts$)/, '')
        .replace(/ 2(?=\.d\.mts$)/, '');

      if (canonicalName !== name) {
        const fromPath = path.join(currentDir, name);
        const toPath = path.join(currentDir, canonicalName);

        if (!exists(toPath)) {
          // Best-effort: rename only when canonical name doesn't exist.
          tryRename(fromPath, toPath);
        }
      }

      // Continue traversal
      const nextPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        // Avoid extremely large folders inside node_modules
        if (entry.name === '.cache') continue;
        queue.push(nextPath);
      }
    }
  }
}

function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const nodeModulesDir = path.join(projectRoot, 'node_modules');

  if (!exists(nodeModulesDir)) {
    return;
  }

  // Fix .bin naming first (common breakage for npm scripts)
  const binDir = path.join(nodeModulesDir, '.bin');
  const binDir2 = path.join(nodeModulesDir, '.bin 2');
  if (!exists(binDir) && exists(binDir2)) {
    tryRename(binDir2, binDir);
  }

  // Fix duplicated names across node_modules (e.g. "postcss 2.js" -> "postcss.js")
  fixDuplicatedNames(nodeModulesDir);
}

main();
