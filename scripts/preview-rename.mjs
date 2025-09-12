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

const orig = list(ORIG).sort(byNumericName);
const thum = new Set(list(THUM));
const missing = orig.filter(n=>!thum.has(n));
if(missing.length){
  console.error(`Warning: ${missing.length} thumbs missing`);
  for (const m of missing) console.error(' -', m);
}

const mapping = orig.map((name, i)=>{
  const ext = path.extname(name).toLowerCase();
  return { old: name, next: `estacao-${i+1}${ext}` };
});

console.log('Preview mapping (first 25):');
for (const m of mapping.slice(0,25)) console.log(`${m.old} -> ${m.next}`);
console.log(`\nTotal files to rename: ${mapping.length}`);
