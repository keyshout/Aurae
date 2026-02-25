const fs = require('fs');
const path = require('path');

const distRoot = path.resolve(__dirname, '..', 'dist');
const targetDirs = ['components', 'hooks'].map((dir) => path.join(distRoot, dir));

function walkFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkFiles(fullPath, files);
            continue;
        }
        if (entry.isFile() && (fullPath.endsWith('.js') || fullPath.endsWith('.mjs'))) {
            files.push(fullPath);
        }
    }
    return files;
}

function hasClientDirective(source) {
    return source.startsWith('"use client";') || source.startsWith("'use client';");
}

let patchedCount = 0;

for (const dir of targetDirs) {
    for (const filePath of walkFiles(dir)) {
        const source = fs.readFileSync(filePath, 'utf8');
        if (hasClientDirective(source)) continue;
        fs.writeFileSync(filePath, `"use client";\n${source}`, 'utf8');
        patchedCount += 1;
    }
}

console.log(`add-use-client: patched ${patchedCount} files`);
