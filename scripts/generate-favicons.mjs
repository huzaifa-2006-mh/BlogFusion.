import sharp from 'sharp';
import { existsSync } from 'fs';
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

// favicon.ico = 32px PNG renamed works in many browsers; also write true ico via multi-size buffer
const icon32 = await sharp(source).resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).png().toBuffer();
await sharp(icon32).toFile(join(root, 'public', 'favicon.ico'));
console.log('Created public/favicon.ico');
