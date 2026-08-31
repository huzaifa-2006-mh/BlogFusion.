import { defaultPostCanonical, isCanonicalOk, normalizeCanonicalUrl } from '@/lib/blogUrl';

export default function SeoCheckCard({
  title,
  slug,
  metaTitle,
  metaDescription,
  focusKeywords,
  canonicalUrl,
  coverImage,
}: {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  focusKeywords: string;
  canonicalUrl: string;
  coverImage: string | null;
}) {
  const resolvedCanonical = normalizeCanonicalUrl(
    canonicalUrl,
    defaultPostCanonical(slug || 'your-slug')
  );
  const checks = [
    { label: 'Title', ok: title.trim().length > 0 },
    { label: 'Custom URL / Slug', ok: slug.trim().length > 0 },
    { label: 'Canonical URL', ok: isCanonicalOk(canonicalUrl, slug) },
    { label: 'Meta description', ok: (metaDescription || '').trim().length >= 50 },
    { label: 'Focus keywords', ok: (focusKeywords || '').trim().length > 0 },
    { label: 'Cover image', ok: Boolean(coverImage) },
    { label: 'Meta title', ok: (metaTitle || title || '').trim().length > 0 },
  ];

  return (
    <div className="dashboard-card" style={{ padding: '1.8rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.4rem' }}>
        SEO Check
      </h3>
      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.85rem' }}>
        Canonical is valid if you paste a full link, a path, or leave it blank so we generate it from the custom URL.
      </p>
      <p style={{ fontSize: '0.75rem', color: '#334155', marginBottom: '1rem', wordBreak: 'break-all' }}>
        <strong>Canonical:</strong> {resolvedCanonical}
      </p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
        {checks.map((check) => (
          <li key={check.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 650 }}>
            <span>{check.label}</span>
            <span style={{ color: check.ok ? '#16a34a' : '#dc2626' }}>{check.ok ? 'Found' : 'Missing'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
