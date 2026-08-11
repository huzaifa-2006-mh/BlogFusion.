const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog-fusion-beta.vercel.app';

export default function SiteJsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Blog Fusion',
    alternateName: 'BlogFusion',
    url: siteUrl,
    logo: `${siteUrl}/favicon-48x48.png`,
    founder: {
      '@type': 'Person',
      name: 'Muhammad Huzaifa',
      jobTitle: 'Founder & Boss',
      url: siteUrl,
    },
    chiefExecutiveOfficer: {
      '@type': 'Person',
      name: 'Maryam',
      jobTitle: 'CEO',
      url: siteUrl,
    },
    sameAs: [
      'https://github.com/huzaifa-2006-mh',
      'https://www.facebook.com/profile.php?id=61590547042139',
      'https://www.linkedin.com/in/mhssoftwarehouse/',
    ],
  };

  const huzaifaPersonSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Muhammad Huzaifa',
    jobTitle: 'Founder & Boss',
    worksFor: {
      '@type': 'Organization',
      name: 'Blog Fusion',
      url: siteUrl,
    },
    description: 'Muhammad Huzaifa is the Founder and Boss of Blog Fusion.',
    url: siteUrl,
    image: `${siteUrl}/huzaifa.png`,
  };

  const maryamPersonSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Maryam',
    jobTitle: 'CEO',
    worksFor: {
      '@type': 'Organization',
      name: 'Blog Fusion',
      url: siteUrl,
    },
    description: 'Maryam is the Chief Executive Officer (CEO) of Blog Fusion.',
    url: siteUrl,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(huzaifaPersonSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(maryamPersonSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
