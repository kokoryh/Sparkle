import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const processDirectory = (dir: string) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    files.forEach(file => {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.isFile() && fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    });
};

const processFile = (filePath: string) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const transformedContent = content.replace(/^(export\s+const\s+\w+\s*=\s*)(new.*;)$/gm, '$1/* @__PURE__ */ $2');
    fs.writeFileSync(filePath, transformedContent, 'utf8');
    console.log(`[INFO] Modified: ${filePath}`);
};

const rootDir = path.join(__dirname, 'src/proto');
processDirectory(rootDir);
console.log('[DONE] All files processed');
