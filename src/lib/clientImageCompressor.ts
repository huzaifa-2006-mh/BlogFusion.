/**
 * Client-Side Universal Image Compressor and WebP Converter
 * Converts any image format (JPG, PNG, WEBP, AVIF, BMP, TIFF, GIF, HEIC)
 * of any size into a fast, compressed, high-quality .webp image before upload.
 */

export async function compressAndConvertToWebP(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82
): Promise<File> {
  // Pass SVGs through as-is since SVG is vector and cannot be raster-compressed
  if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
    return file;
  }

  // If running on server or without DOM, return original
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onload = () => {
        try {
          let { width, height } = img;

          // Scale down proportionally if image exceeds max bounds
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve(file);
          }

          // Smooth interpolation for highest visual quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Clear and draw
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return resolve(file);
              }

              const baseName = file.name
                .replace(/\.[^/.]+$/, '')
                .replace(/[^\w-]/g, '_');
              const webpFileName = `${baseName || 'image'}.webp`;

              const webpFile = new File([blob], webpFileName, {
                type: 'image/webp',
                lastModified: Date.now(),
              });

              resolve(webpFile);
            },
            'image/webp',
            quality
          );
        } catch (err) {
          console.warn('Canvas conversion to WebP failed, falling back to original file:', err);
          resolve(file);
        }
      };

      img.onerror = () => {
        console.warn('Image loading error, passing original file');
        resolve(file);
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => {
      resolve(file);
    };

    reader.readAsDataURL(file);
  });
}
