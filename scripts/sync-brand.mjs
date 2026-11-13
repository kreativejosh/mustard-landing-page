// Pull brand files from mustard-bio-brand at the SHA pinned in brand.manifest.json.
//
//   npm run brand:sync            fetch and verify against the pinned checksums
//   npm run brand:sync -- --update   fetch and REWRITE the checksums (use after bumping `sha`)
//
// Source of truth is the brand repo. Nothing under brand/, public/assets/ or
// assets/fonts/ may be hand-edited: this script overwrites all of it.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = join(root, 'scripts', 'brand.manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const update = process.argv.includes('--update');

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const raw = (p) => `https://raw.githubusercontent.com/${manifest.repo}/${manifest.sha}/${p}`;

console.log(`brand:sync  ${manifest.repo} @ ${manifest.sha.slice(0, 10)}  (${manifest.files.length} files)`);

let changed = 0;
const drifted = [];

for (const f of manifest.files) {
  const res = await fetch(raw(f.from));
  if (!res.ok) {
    console.error(`\n  FAILED  ${f.from}\n          ${res.status} ${res.statusText} at ${raw(f.from)}`);
    console.error('\n  The pinned SHA may not exist, or the file moved in the brand repo.');
    process.exit(1);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const got = sha256(buf);

  if (update) {
    if (f.sha256 !== got) { changed++; f.sha256 = got; f.bytes = buf.length; }
  } else if (f.sha256 !== got) {
    drifted.push({ file: f.from, expected: f.sha256.slice(0, 12), got: got.slice(0, 12) });
    continue;
  }

  const dest = join(root, f.to);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, buf);
}

if (drifted.length) {
  console.error(`\n  ${drifted.length} file(s) at the pinned SHA no longer match the manifest:\n`);
  for (const d of drifted) console.error(`    ${d.file}\n      manifest ${d.expected}…  remote ${d.got}…`);
  console.error('\n  A pinned SHA is immutable, so this means the brand repo was force-pushed,');
  console.error('  or the manifest was hand-edited. Nothing was written. Re-run with --update');
  console.error('  only once you have confirmed the new bytes are intended.\n');
  process.exit(1);
}

if (update) {
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`brand:sync  manifest updated, ${changed} checksum(s) changed`);
} else {
  console.log('brand:sync  all files match the pinned checksums');
}
