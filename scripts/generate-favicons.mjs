import sharp from 'sharp';
import { existsSync, writeFileSync, copyFileSync } from 'fs';
import { join } from 'path';

const root = process.cwd();
const source = join(root, 'public', 'logo.png');

if (!existsSync(source)) {
  console.error('Missing public/logo.png');
  process.exit(1);
}

const outputs = [
  { file: join(root, 'src', 'app', 'icon.png'), size: 32 },
  { file: join(root, 'src', 'app', 'apple-icon.png'), size: 180 },
  { file: join(root, 'public', 'favicon-16x16.png'), size: 16 },
  { file: join(root, 'public', 'favicon-32x32.png'), size: 32 },
  { file: join(root, 'public', 'favicon-48x48.png'), size: 48 },
  { file: join(root, 'public', 'apple-touch-icon.png'), size: 180 },
];

for (const { file, size } of outputs) {
  await sharp(source)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(file);
  console.log(`Created ${file} (${size}x${size})`);
}

// Real .ico file (multi-size) for browsers and Google
let icoBuffer;
try {
  const toIco = (await import('to-ico')).default;
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map((size) =>
      sharp(source)
        .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toBuffer()
    )
  );
  icoBuffer = await toIco(pngBuffers);
} catch (error) {
  console.warn('to-ico unavailable, using 32px PNG as favicon.ico fallback');
  icoBuffer = await sharp(source)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();
}

const icoPaths = [
  join(root, 'public', 'favicon.ico'),
  join(root, 'src', 'app', 'favicon.ico'),
];

for (const icoPath of icoPaths) {
  writeFileSync(icoPath, icoBuffer);
  console.log(`Created ${icoPath}`);
}

// Next.js also reads app/icon.png — keep in sync with 32px asset
copyFileSync(join(root, 'public', 'favicon-32x32.png'), join(root, 'src', 'app', 'icon.png'));
