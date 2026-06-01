import sharp from 'sharp';

export async function optimizeAndStoreImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const optimizedBuffer = await sharp(buffer)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 76, effort: 4 })
    .toBuffer();

  const base64Data = optimizedBuffer.toString('base64');
  return `data:image/webp;base64,${base64Data}`;
}

export function applyImageAltPlaceholders(content: string, imageAlts: string[]): string {
  if (!imageAlts.length) return content;

  const currentPlaceholders = (content.match(/\[IMAGE(?:[:|]\s*.*?)?\]/gi) || []).length;
  if (currentPlaceholders >= imageAlts.length) return content;

  const missing = imageAlts.slice(currentPlaceholders);
  const additions = missing.map((alt) => `[IMAGE: ${alt || 'Blog image'}]`).join('\n\n');

  return `${content.trim()}\n\n${additions}`.trim();
}
