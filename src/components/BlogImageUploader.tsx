'use client';

type BlogImageUploaderProps = {
  previews: string[];
  imageAlts: string[];
  onImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAltChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
};

export default function BlogImageUploader({
  previews,
  imageAlts,
  onImagesChange,
  onAltChange,
  onRemove,
}: BlogImageUploaderProps) {
  return (
    <div>
      <h4 style={{ margin: '0 0 0.3rem 0', fontWeight: '900', fontSize: '1.1rem', color: '#0f172a' }}>
        Blog Visuals
      </h4>
      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1.2rem 0' }}>
        Upload images and write alt text for each one (important for SEO and accessibility).
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {previews.map((preview, i) => (
          <div
            key={`${preview}-${i}`}
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              background: 'white',
              overflow: 'visible',
            }}
          >
            <div style={{ position: 'relative', height: '180px', borderRadius: '10px 10px 0 0', overflow: 'hidden' }}>
              <img
                src={preview}
                alt={imageAlts[i] || `Uploaded image ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <button
                type="button"
                onClick={() => onRemove(i)}
                title="Remove Image"
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: 'rgba(255,255,255,0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#64748b',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '0.75rem' }}>
              <label
                htmlFor={`image-alt-${i}`}
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '0.4rem',
                }}
              >
                Alt text (required for SEO)
              </label>
              <input
                id={`image-alt-${i}`}
                type="text"
                value={imageAlts[i] || ''}
                onChange={(e) => onAltChange(i, e.target.value)}
                placeholder="Describe this image, e.g. React tutorial screenshot"
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        ))}

        <label
          style={{
            minHeight: '120px',
            border: '2px dashed #cbd5e1',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
            backgroundColor: '#f8fafc',
            padding: '1rem',
          }}
        >
          <span style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>+</span>
          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Add Photo</span>
          <input type="file" hidden multiple onChange={onImagesChange} accept="image/*,.jpg,.jpeg,.png,.webp,.avif,.bmp,.tiff,.gif,.heic,.heif" />
        </label>
      </div>
    </div>
  );
}
