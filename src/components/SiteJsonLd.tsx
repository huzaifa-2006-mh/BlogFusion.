const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog-fusion-beta.vercel.app';

export default function SiteJsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Blog Fusion',
    alternateName: 'BlogFusion',
    url: siteUrl,
    logo: `${siteUrl}/favicon-48x48.png`,
    sameAs: [
      'https://github.com/huzaifa-2006-mh',
      'https://www.facebook.com/profile.php?id=61590547042139',
      'https://www.linkedin.com/in/mhssoftwarehouse/',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Blog Fusion',
    alternateName: 'BlogFusion',
    url: siteUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Blog Fusion',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon-48x48.png`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
