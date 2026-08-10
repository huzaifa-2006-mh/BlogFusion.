import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function optimizeAndStoreImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileExt = path.extname(file.name).toLowerCase();
  const baseName = path.basename(file.name, fileExt).replace(/[^\w-]/g, '_');
  const randomHash = crypto.randomBytes(6).toString('hex');

  // Handle SVG and animated GIF natively
  if (fileExt === '.svg' || file.type === 'image/svg+xml') {
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      const fileName = `${baseName}_${Date.now()}_${randomHash}.svg`;
      const filePath = path.join(uploadsDir, fileName);
      await fs.writeFile(filePath, buffer);
      return `/uploads/${fileName}`;
    } catch (fsErr) {
      // Fallback for Vercel Serverless (read-only filesystem)
      const base64 = buffer.toString('base64');
      return `data:image/svg+xml;base64,${base64}`;
    }
  }

  if (fileExt === '.gif' || file.type === 'image/gif') {
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      const fileName = `${baseName}_${Date.now()}_${randomHash}.gif`;
      const filePath = path.join(uploadsDir, fileName);
      await fs.writeFile(filePath, buffer);
      return `/uploads/${fileName}`;
    } catch (fsErr) {
      // Fallback for Vercel Serverless (read-only filesystem)
      const base64 = buffer.toString('base64');
      return `data:image/gif;base64,${base64}`;
    }
  }

  // Compress raster image to web-optimized WebP (max 1600px width, 80% quality)
  let optimizedBuffer: Buffer;
  try {
    optimizedBuffer = await sharp(buffer)
      .rotate() // auto-orient based on EXIF
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();
  } catch (sharpErr) {
    console.warn('Sharp optimization error, using original buffer:', sharpErr);
    optimizedBuffer = buffer;
  }

  // Attempt saving to public/uploads directory (works locally)
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const fileName = `${baseName}_${Date.now()}_${randomHash}.webp`;
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, optimizedBuffer);
    return `/uploads/${fileName}`;
  } catch (fsErr) {
    // Failover for Vercel Serverless (read-only filesystem) -> Return compressed WebP Data URL
    console.log('Serverless environment detected (read-only filesystem). Returning compressed WebP Data URL.');
    const base64 = optimizedBuffer.toString('base64');
    return `data:image/webp;base64,${base64}`;
  }
}

export function applyImageAltPlaceholders(content: string, imageAlts: string[]): string {
  if (!imageAlts || !imageAlts.length) return content;

  // If content uses modern rich editor HTML with <img> tags, alt attributes are already embedded!
  if (content.includes('<img') || content.includes('<figure')) {
    return content;
  }

  const currentPlaceholders = (content.match(/\[IMAGE(?:[:|]\s*.*?)?\]/gi) || []).length;
  if (currentPlaceholders >= imageAlts.length) return content;

  const missing = imageAlts.slice(currentPlaceholders);
  const additions = missing.map((alt) => `[IMAGE: ${alt || 'Blog image'}]`).join('\n\n');

  return `${content.trim()}\n\n${additions}`.trim();
}
