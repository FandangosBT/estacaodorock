#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function pick(arr, fn) {
  return arr.filter(Boolean).filter(fn);
}

function parseArgs(argv) {
  const args = { dir: '', year: null, basePath: null };
  const rest = [];
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--year') { args.year = Number(argv[++i]); continue; }
    if (a === '--basePath') { args.basePath = argv[++i]; continue; }
    if (!args.dir) { args.dir = a; } else { rest.push(a); }
  }
  return args;
}

function byNumericName(a, b) {
  const na = Number(a.replace(/\D/g, ''));
  const nb = Number(b.replace(/\D/g, ''));
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
  return a.localeCompare(b);
}

async function main() {
  const { dir, year, basePath } = parseArgs(process.argv);
  if (!dir) {
    console.error('Usage: node scripts/genManifest.mjs <public/galeria/2025> [--year 2025] [--basePath /galeria/2025]');
    process.exit(1);
  }
  const abs = path.resolve(dir);
  const originalsDir = path.join(abs, 'originals');
  const thumbsDir = path.join(abs, 'thumbs');
  const yearInfer = year ?? Number(path.basename(abs));
  const basePathInfer = basePath ?? `/galeria/${yearInfer}`;
  const exts = new Set(['.jpg', '.jpeg', '.png', '.webp']);

  const list = (p) => fs.readdirSync(p, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((n) => exts.has(path.extname(n).toLowerCase()));

  const originals = list(originalsDir);
  const thumbs = new Set(list(thumbsDir));

  const items = pick(originals, (n) => thumbs.has(n))
    .sort(byNumericName)
    .map((name) => ({
      name,
      thumb: `${basePathInfer}/thumbs/${name}`,
      original: `${basePathInfer}/originals/${name}`,
      download: `${basePathInfer}/originals/${name}`,
    }));

  const out = {
    year: yearInfer,
    count: items.length,
    basePath: basePathInfer,
    items,
  };

  const outPath = path.join(abs, 'manifest.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
  console.log(`Wrote ${items.length} items to ${path.relative(process.cwd(), outPath)}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

