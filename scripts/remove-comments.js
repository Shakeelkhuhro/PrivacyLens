#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');
const strip = require('strip-comments');


const GLOBS = [
  '**/*.{js,jsx,ts,tsx,css,scss,html}'
];


const IGNORE = [
  '**/node_modules/**',
  '**/.git/**',
  '**/dist/**',
  '**/build/**',
  '**/.expo/**',
  '**/package-lock.json',
  '**/yarn.lock',
  '**/pnpm-lock.yaml'
];

(async function main(){
  try {
    const entries = await fg(GLOBS, { ignore: IGNORE, dot: true });
    console.log(`Found ${entries.length} files to process.`);

    for (const file of entries) {
      try {
        const abs = path.resolve(file);
        const stat = fs.statSync(abs);
        if (!stat.isFile()) continue;

        const text = fs.readFileSync(abs, 'utf8');
        
        const bakPath = abs + '.commentbak';
        if (!fs.existsSync(bakPath)) {
          fs.writeFileSync(bakPath, text, 'utf8');
        }

        
        let stripped;
        try {
          stripped = strip(text);
        } catch (err) {
          console.error(`Failed to strip comments for ${file}:`, err.message);
          continue;
        }

        
        if (stripped !== text) {
          fs.writeFileSync(abs, stripped, 'utf8');
          console.log(`Stripped comments: ${file}`);
        }
      } catch (err) {
        console.error(`Error processing ${file}:`, err.message);
      }
    }

    console.log('Done. Backups saved with .commentbak extension.');
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
})();
