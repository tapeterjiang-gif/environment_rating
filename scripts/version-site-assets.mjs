import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

// Content versions keep cached scripts and styles aligned with each HTML release.
const root = resolve(import.meta.dirname, '../site/dist');
let changed = 0;
for (const file of await readdir(root)) {
  if (!file.endsWith('.html')) continue;
  const path = resolve(root, file);
  const source = await readFile(path, 'utf8');
  const refs = [...source.matchAll(/(?:src|href)="([^"?#]+\.(?:css|js))(?:\?[^"#]*)?"/g)];
  let output = source;
  for (const ref of refs) {
    if (ref[1].includes('://')) continue;
    const hash = createHash('sha256').update(await readFile(resolve(root, ref[1]))).digest('hex').slice(0, 12);
    output = output.replace(ref[0], ref[0].replace(/=".*"$/, `="${ref[1]}?v=${hash}"`));
  }
  if (output !== source) {
    if (process.argv.includes('--check')) throw new Error(`Stale asset versions: ${file}`);
    await writeFile(path, output);
    changed++;
  }
}
console.log(`Checked site asset versions; ${changed} pages updated.`);
