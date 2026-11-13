// Check every brand-owned file on disk against the pinned checksums. No network.
// Runs on `prebuild` and in CI, so a hand-edit to a brand file fails the build
// instead of shipping.
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'scripts', 'brand.manifest.json'), 'utf8'));

const missing = [];
const edited = [];

for (const f of manifest.files) {
  const p = join(root, f.to);
  if (!existsSync(p)) { missing.push(f.to); continue; }
  const got = createHash('sha256').update(readFileSync(p)).digest('hex');
  if (got !== f.sha256) edited.push({ file: f.to, from: f.from });
}

if (!missing.length && !edited.length) {
  console.log(`verify-brand  ${manifest.files.length} brand files match ${manifest.repo} @ ${manifest.sha.slice(0, 10)}`);
  process.exit(0);
}

if (missing.length) {
  console.error(`\n  ${missing.length} brand file(s) missing:\n`);
  for (const m of missing) console.error(`    ${m}`);
  console.error('\n  Run:  npm run brand:sync\n');
}

if (edited.length) {
  console.error(`\n  ${edited.length} brand file(s) have been edited locally:\n`);
  for (const e of edited) console.error(`    ${e.file}\n      owned by the brand repo (${e.from}) — it is not ours to change`);
  console.error('\n  Brand files are generated. To change one, change it in mustard-bio-brand,');
  console.error('  bump `sha` in scripts/brand.manifest.json, then:  npm run brand:sync -- --update');
  console.error('  To discard the local edit:  npm run brand:sync\n');
}

process.exit(1);
