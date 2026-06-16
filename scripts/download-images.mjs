#!/usr/bin/env node
/**
 * Downloads card images from Scryfall and saves them to assets/cards/.
 * Run: node scripts/download-images.mjs
 */

import { readFileSync, mkdirSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'assets', 'cards');

mkdirSync(OUT_DIR, { recursive: true });

const mainData = JSON.parse(readFileSync(join(ROOT, 'data', 'cards.json'), 'utf8'));
const bonusData = JSON.parse(readFileSync(join(ROOT, 'data', 'bonus.json'), 'utf8'));
const allCards = [...mainData.data, ...bonusData.data];

/**
 * Returns an array of { filename, url } objects for a card.
 * Single-faced cards: [{filename: "<id>.jpg", url: "..."}]
 * Double-faced cards: [{filename: "<id>_0.jpg", url: "..."}, {filename: "<id>_1.jpg", url: "..."}]
 */
function getImageEntries(card) {
  if (card.image_uris?.normal) {
    return [{ filename: `${card.id}.jpg`, url: card.image_uris.normal }];
  }
  if (card.card_faces) {
    return card.card_faces
      .map((face, i) => {
        if (!face.image_uris?.normal) return null;
        return { filename: `${card.id}_${i}.jpg`, url: face.image_uris.normal };
      })
      .filter(Boolean);
  }
  return [];
}

async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buffer = await res.arrayBuffer();
  writeFileSync(destPath, Buffer.from(buffer));
}

async function main() {
  const queue = [];
  for (const card of allCards) {
    for (const entry of getImageEntries(card)) {
      queue.push({ card: card.name, ...entry });
    }
  }

  console.log(`Downloading ${queue.length} image(s) to assets/cards/ ...\n`);

  let done = 0;
  for (const item of queue) {
    const destPath = join(OUT_DIR, item.filename);
    if (existsSync(destPath)) {
      console.log(`  [skip] ${item.filename}  (already exists)`);
      done++;
      continue;
    }

    process.stdout.write(`  [${done + 1}/${queue.length}] ${item.card} ... `);
    try {
      await downloadFile(item.url, destPath);
      console.log('✓');
    } catch (err) {
      console.log(`✗  ${err.message}`);
    }

    done++;

    // Polite delay: 100 ms between requests to respect Scryfall rate limits.
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\nDone. ${done} file(s) processed.`);
}

main().catch(err => { console.error(err); process.exit(1); });

