import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.join(__dirname, 'src/script');
const DST_DIR = path.join(__dirname, 'dist');

function getBanner(): string {
    return `// Built at: ${new Date().toLocaleString()}`;
}

function hashContent(content: string): string {
    const cleanContent = content.replace(/\r\n/g, '\n').replace(/^\/\/ Built at: .+\n/, '');
    return crypto.createHash('sha256').update(cleanContent).digest('hex');
}

async function findEntryFiles(dir: string): Promise<string[]> {
    const result: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullpath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            result.push(...(await findEntryFiles(fullpath)));
        } else if (entry.isFile() && /^main(\.dev)?\.ts$/.test(entry.name)) {
            result.push(fullpath);
        }
    }
    return result;
}

async function buildEntry(entryPath: string) {
    const relativePath = path.relative(SRC_DIR, entryPath);
    const filename = relativePath.split(path.sep).join('.').replace('main.', '').replace('ts', 'js');
    const outPath = path.join(DST_DIR, filename);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    const result = await esbuild.build({
        entryPoints: [entryPath],
        bundle: true,
        minify: !filename.includes('.dev.'),
        format: 'esm',
        banner: { js: getBanner() },
        sourcemap: false,
        write: false,
    });
    let builtContent = result.outputFiles?.[0]?.text || '';
    if (relativePath.includes('webpage')) {
        builtContent = await renderTemplate(path.dirname(entryPath), builtContent);
    }
    const builtContentHash = hashContent(builtContent);
    try {
        const existContent = await fs.readFile(outPath, 'utf-8');
        const existContentHash = hashContent(existContent);
        if (existContentHash === builtContentHash) {
            console.log(`[CACHED] Unchanged: ${relativePath} (hash: ${builtContentHash.slice(0, 8)}...)`);
            return false;
        }
    } catch {}
    await fs.writeFile(outPath, builtContent);
    console.log(`[BUILT] Built: ${relativePath} (hash: ${builtContentHash.slice(0, 8)})`);
    return true;
}

async function renderTemplate(basePath: string, sourceContent: string): Promise<string> {
    const regex = /"{{\s*@([^\s}]+)\s*}}"/g;
    const matches = sourceContent.match(regex) || [];
    const templateIds = Array.from(new Set(matches.map(m => m.replace(regex, '$1'))));
    const templateCache = new Map<string, string>();
    await Promise.all(
        templateIds.map(async templateId => {
            const templatePath = path.join(basePath, templateId);
            try {
                const result = await esbuild.build({
                    entryPoints: [templatePath],
                    bundle: true,
                    minify: !templateId.includes('.dev.'),
                    format: 'iife',
                    sourcemap: false,
                    write: false,
                });
                templateCache.set(templateId, result.outputFiles?.[0]?.text || '');
            } catch (err) {
                console.error(`[ERROR] Build template "${templateId}" failed: ${err.toString()}`);
                templateCache.set(templateId, '');
            }
        })
    );
    return matches.reduce((content, placeholder) => {
        const templateId = placeholder.replace(regex, '$1');
        const compiledContent = JSON.stringify(templateCache.get(templateId) || '');
        return content.split(placeholder).join(compiledContent);
    }, sourceContent);
}

async function runBuild() {
    console.log('[START] Starting build...');
    const startTime = Date.now();
    let changedCount = 0;
    try {
        const entryFiles = await findEntryFiles(SRC_DIR);
        if (entryFiles.length === 0) {
            console.warn('[WARN] main.ts entry file not found');
            return;
        }
        console.log(`[INFO] Found ${entryFiles.length} entry points`);
        for (const file of entryFiles) {
            if (await buildEntry(file)) {
                changedCount++;
            }
        }
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(
            `[DONE] Build completed in ${duration} seconds | ` +
                `Changed: ${changedCount}/${entryFiles.length} | ` +
                `Skipped: ${entryFiles.length - changedCount}`
        );
    } catch (err: any) {
        console.error(`[ERROR] Build failed: ${err.toString()}`);
        process.exit(1);
    }
}

runBuild();
