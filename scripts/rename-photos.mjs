#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ORIG = 'public/galeria/2025/originals';
const THUM = 'public/galeria/2025/thumbs';

const list = (p) => fs.readdirSync(p, { withFileTypes: true }).filter(d=>d.isFile()).map(d=>d.name);

function byNumericName(a,b){
  const na = Number((a.match(/\d+/g)||[]).join(''));
  const nb = Number((b.match(/\d+/g)||[]).join(''));
  const aHas = !Number.isNaN(na), bHas = !Number.isNaN(nb);
  if (aHas && bHas) return na - nb;
  if (aHas) return -1; if (bHas) return 1;
  return a.localeCompare(b);
}

function pad3(n){ return String(n).padStart(3, '0'); }

function renameBatch(dir, mapping){
  for (const {oldName, newName} of mapping){
    const src = path.join(dir, oldName);
    const dst = path.join(dir, newName);
    if (src === dst) continue;
    if (!fs.existsSync(src)) throw new Error(`Source not found: ${src}`);
    if (fs.existsSync(dst)) throw new Error(`Target already exists: ${dst}`);
    fs.renameSync(src, dst);
  }
}

function main(){
  const origNames = list(ORIG).sort(byNumericName);
  const thumNames = new Set(list(THUM));

  // Verify 1:1 pairing by name before renaming
  const missing = origNames.filter(n => !thumNames.has(n));
  if (missing.length){
    console.error(`Missing thumbs for ${missing.length} files:`);
    for (const m of missing.slice(0,10)) console.error(' -', m);
    throw new Error('Aborting rename due to missing thumbs.');
  }

  const total = origNames.length;
  if (total !== 303) {
    console.warn(`Notice: found ${total} originals. Proceeding anyway.`);
  }

  const mapping = origNames.map((oldName, i) => ({
    oldName,
    newName: `estacao-${pad3(i+1)}.jpg`, // force .jpg extension
  }));

  // Rename originals then thumbs using the same mapping
  console.log(`Renaming originals in ${ORIG} ...`);
  renameBatch(ORIG, mapping);
  console.log(`Renaming thumbs in ${THUM} ...`);
  renameBatch(THUM, mapping);

  console.log('Done.');
}

try { main(); } catch (e) { console.error(e?.message || e); process.exit(1); }

