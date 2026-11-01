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
      // Fallback for Serverless / Cloudflare (read-only filesystem)
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
      // Fallback for Serverless / Cloudflare (read-only filesystem)
      const base64 = buffer.toString('base64');
      return `data:image/gif;base64,${base64}`;
    }
  }

  const ext = fileExt || (file.type === 'image/webp' ? '.webp' : '.png');
  const mime = file.type || (ext === '.webp' ? 'image/webp' : 'image/png');

  // Attempt saving to public/uploads directory (works locally)
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const fileName = `${baseName}_${Date.now()}_${randomHash}${ext}`;
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);
    return `/uploads/${fileName}`;
  } catch (fsErr) {
    // Failover for Serverless / Cloudflare (read-only filesystem) -> Return Data URL
    console.log('Serverless environment detected (read-only filesystem). Returning Data URL.');
    const base64 = buffer.toString('base64');
    return `data:${mime};base64,${base64}`;
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
