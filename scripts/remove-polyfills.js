const fs = require('fs');
const path = require('path');

const polyfillPaths = [
  path.join(__dirname, '../node_modules/next/dist/build/polyfills/polyfill-module.js'),
  path.join(__dirname, '../node_modules/next/dist/build/polyfills/polyfill-nomodule.js'),
];

for (const p of polyfillPaths) {
  try {
    if (fs.existsSync(p)) {
      // Empty the polyfill file so Next.js does not bundle Array.at, flat, Object.fromEntries
      fs.writeFileSync(p, '/* modern browsers polyfill stub */\n', 'utf8');
      console.log(`[optimize] Cleared legacy polyfills in: ${p}`);
    }
  } catch (err) {
    console.warn(`[optimize] Could not patch ${p}:`, err.message);
  }
}
