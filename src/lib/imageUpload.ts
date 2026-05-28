import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads');

export async function optimizeAndStoreImage(file: File): Promise<string> {
  const sharp = (await import('sharp')).default;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const optimizedBuffer = await sharp(buffer)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 76, effort: 4 })
    .toBuffer();

  await mkdir(UPLOADS_DIR, { recursive: true });
  const fileName = `${Date.now()}-${randomUUID()}.webp`;
  await writeFile(join(UPLOADS_DIR, fileName), optimizedBuffer);

  return `/uploads/${fileName}`;
}

export function applyImageAltPlaceholders(content: string, imageAlts: string[]): string {
  if (!imageAlts.length) return content;

  const currentPlaceholders = (content.match(/\[IMAGE(?:[:|]\s*.*?)?\]/gi) || []).length;
  if (currentPlaceholders >= imageAlts.length) return content;

  const missing = imageAlts.slice(currentPlaceholders);
  const additions = missing.map((alt) => `[IMAGE: ${alt || 'Blog image'}]`).join('\n\n');

  return `${content.trim()}\n\n${additions}`.trim();
}
