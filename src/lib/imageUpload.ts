import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function optimizeAndStoreImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  
  // Ensure uploads directory exists
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (err) {
    console.error('Error creating uploads directory:', err);
  }

  const randomHash = crypto.randomBytes(6).toString('hex');
  const fileExt = path.extname(file.name).toLowerCase();
  const baseName = path.basename(file.name, fileExt).replace(/[^\w-]/g, '_');

  // Handle SVG and animated GIF natively to preserve animation / vector quality
  if (fileExt === '.svg' || file.type === 'image/svg+xml') {
    const fileName = `${baseName}_${Date.now()}_${randomHash}.svg`;
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);
    return `/uploads/${fileName}`;
  }

  if (fileExt === '.gif' || file.type === 'image/gif') {
    const fileName = `${baseName}_${Date.now()}_${randomHash}.gif`;
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);
    return `/uploads/${fileName}`;
  }

  // For all raster images (JPG, PNG, WEBP, AVIF, BMP, TIFF, etc.), convert to web-optimized WebP
  try {
    const fileName = `${baseName}_${Date.now()}_${randomHash}.webp`;
    const filePath = path.join(uploadsDir, fileName);

    const optimizedBuffer = await sharp(buffer)
      .rotate() // auto-orient based on EXIF
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    await fs.writeFile(filePath, optimizedBuffer);
    return `/uploads/${fileName}`;
  } catch (error) {
    console.warn('Sharp optimization fallback (saving raw file):', error);
    const safeExt = fileExt || '.png';
    const fileName = `${baseName}_${Date.now()}_${randomHash}${safeExt}`;
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);
    return `/uploads/${fileName}`;
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
