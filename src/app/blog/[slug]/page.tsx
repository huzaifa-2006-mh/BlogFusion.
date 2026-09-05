import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ShareButtons from '@/components/ShareButtons';
import { Metadata } from 'next';
import { defaultPostCanonical, normalizeCanonicalUrl } from '@/lib/blogUrl';
import { extractFirstImageSrc, stripCoverFromContent } from '@/lib/postHtml';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      return {
        title: 'Post Not Found - Blog Fusion',
      };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog-fusion-beta.vercel.app';
    const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
    const fallbackCanonical = `${cleanSiteUrl}/blog/${slug}`;
    const canonical = normalizeCanonicalUrl(post.canonicalUrl, fallbackCanonical);

    const metadata: Metadata = {
      title: post.metaTitle || `${post.title} - Blog Fusion`,
      description: post.metaDescription || post.excerpt,
      keywords: post.focusKeywords || undefined,
      openGraph: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        images: post.ogImage ? [{ url: post.ogImage }] : post.coverImage ? [{ url: post.coverImage }] : [],
        url: canonical,
        type: 'article',
      },
      alternates: {
        canonical: canonical,
      },
    };

    if (!post.isIndexable) {
      metadata.robots = {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      };
    }

    return metadata;
  } catch (error) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog-fusion-beta.vercel.app';
    return {
      title: 'Blog Fusion',
      description: 'Explore blogs on Blog Fusion',
      alternates: {
        canonical: siteUrl,
      },
    };
  }
}

export default async function BlogPostPage({ params }: any) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true, author: true },
  });

  if (!post || !post.published) {
    notFound();
  }

  // Increment view count in background
  prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  }).catch((err) => console.error('Error updating views:', err));

  const authorName = post.author?.username || 'Admin';
  const authorInitial = authorName[0]?.toUpperCase() || 'D';

  let content = post.content || '';

  // Extract font settings if present: <post-settings size="20px" family="Arial" />
  const fontSettingsMatch = content.match(/<post-settings size="(.*?)" family="(.*?)" \/>/);
  let customStyles: React.CSSProperties = {};
  if (fontSettingsMatch) {
    customStyles = {
      fontSize: fontSettingsMatch[1],
      fontFamily: fontSettingsMatch[2],
    };
    content = content.replace(/<post-settings .*? \/>/, '');
  }

  const isRichHtml = /<(p|h[1-6]|div|figure|blockquote|table|ul|ol)/i.test(content);
  let processedContent = content;

  // Process legacy tags
  processedContent = processedContent.replace(/<back href="(.*?)">(.*?)<\/back>/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>');
  processedContent = processedContent.replace(/<color val="(.*?)">(.*?)<\/color>/g, '<span style="color: $1">$2</span>');
  processedContent = processedContent.replace(/<u>(.*?)<\/u>/g, '<span style="text-decoration: underline">$1</span>');
  processedContent = processedContent.replace(/<no-u>(.*?)<\/no-u>/g, '<span style="text-decoration: none">$1</span>');
  processedContent = processedContent.replace(/<spacer \/>/g, '<div style="height: 1.5rem;" class="blog-spacer"></div>');

  if (!isRichHtml) {
    processedContent = processedContent.replace(/^###\s+(.*)$/gm, '<h4>$1</h4>');
    processedContent = processedContent.replace(/^##\s+(.*)$/gm, '<h3>$1</h3>');
    processedContent = processedContent.replace(/^(?:\*\*|\#)\s+(.*)$/gm, '<h2>$1</h2>');

    const codeBlocks: string[] = [];
    processedContent = processedContent.replace(/<code>([\s\S]*?)<\/code>/g, (match, code) => {
      const placeholder = `[CODE_BLOCK_${codeBlocks.length}]`;
      codeBlocks.push(`<pre class="code-block"><code>${code.trim()}</code></pre>`);
      return placeholder;
    });

    processedContent = processedContent.replace(/\n/g, '<br/>');
    processedContent = processedContent.replace(/(<\/h[1-6]>)(?:\s*<br\/>)+/g, '$1');
    processedContent = processedContent.replace(/(?:<br\/>\s*)+(<h[1-6]>)/g, '$1');

    codeBlocks.forEach((block, index) => {
      processedContent = processedContent.replace(`[CODE_BLOCK_${index}]`, block);
    });
  }

  const gallery = (post.images || []).filter((img) => img && img !== post.coverImage);
  const inlineImages = [...gallery];
  let imageIndex = 0;
  const imageRegex = /(?:<p>\s*)?\[IMAGE(?:[:|]\s*(.*?))?\](?:\s*<\/p>)?/i;

  while (imageRegex.test(processedContent) && imageIndex < inlineImages.length) {
    const match = imageRegex.exec(processedContent);
    if (!match) break;
    const altText = match[1] ? match[1].trim() : `Blog image ${imageIndex + 1}`;
    const imgHtml = `
      <figure class="inline-image" style="margin: 2rem 0; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
        <img src="${inlineImages[imageIndex]}" alt="${altText}" style="width: 100%; height: auto; display: block;" loading="lazy" decoding="async" />
        ${match[1] ? `<figcaption style="text-align: center; font-size: 0.85rem; color: #64748b; padding: 0.75rem; background: #f8fafc; border-top: 1px solid #e2e8f0; margin: 0;">${altText}</figcaption>` : ''}
      </figure>
    `;
    processedContent = processedContent.replace(match[0], imgHtml);
    imageIndex++;
  }

  processedContent = processedContent.replace(/(?:<p>\s*)?\[IMAGE(?:[:|]\s*(.*?))?\](?:\s*<\/p>)?/gi, '');

  if (post.coverImage) {
    processedContent = stripCoverFromContent(processedContent, post.coverImage);
  }

  // Schema.org JSON-LD definitions
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog-fusion-beta.vercel.app';
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
  const canonical = normalizeCanonicalUrl(post.canonicalUrl, defaultPostCanonical(post.slug));
  const postUrl = canonical;
  const coverImg = post.ogImage || post.coverImage || extractFirstImageSrc(processedContent) || `${cleanSiteUrl}/favicon-48x48.png`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: [coverImg],
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Blog Fusion',
      logo: {
        '@type': 'ImageObject',
        url: `${cleanSiteUrl}/favicon-48x48.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  };

  const faqList = (post.faqs as any[]) || [];
  const faqSchema =
    faqList.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqList.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <article className="section" style={{ padding: '4rem 0 6rem 0' }}>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Back Link */}
        <Link href="/" className="back-link">
          &larr; Back to Home
        </Link>


        {/* Dynamic Detail Header */}
        <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <time
            dateTime={post.createdAt.toISOString()}
            style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem', display: 'block' }}
          >
            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </time>

          <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.3rem)', fontWeight: '800', color: '#0f172a', lineHeight: '1.25', letterSpacing: '-0.02em', margin: '0 auto 1.2rem auto', maxWidth: '750px' }}>
            {post.title}
          </h1>

          {post.shortDescription && (
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.5', fontWeight: '500', margin: '0 auto 1.5rem auto', maxWidth: '620px' }}>
              {post.shortDescription}
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <Link href={`/category/${post.category.slug}`} style={{ textDecoration: 'none' }}>
              <span className="blog-detail-category-tag" style={{ marginBottom: 0 }}>#{post.category.slug}</span>
            </Link>
          </div>
        </header>

        {/* Clean Article Content */}
        <div className="blog-content" style={{ ...customStyles }}>
          <div dangerouslySetInnerHTML={{ __html: processedContent }} />
        </div>

        {/* FAQ Accordions */}
        {faqList.length > 0 && (
          <section style={{ marginTop: '2rem', padding: '2.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ marginBottom: '1.8rem', fontSize: '1.6rem', color: '#0f172a', textAlign: 'center', fontWeight: '800', letterSpacing: '-0.02em' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {faqList.map((faq, index) => (
                <div key={index} style={{ background: 'white', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.01)' }}>
                  <h3 style={{ color: '#0f172a', fontWeight: '700', fontSize: '1.02rem', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: '#ec4899', fontWeight: '800' }}>Q:</span> {faq.question}
                  </h3>
                  <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5', margin: 0, fontWeight: '500' }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Author Bio Box */}
        <aside className="author-bio-box" style={{ marginTop: '5rem', padding: '2rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div className="author-bio-avatar" style={{ width: '75px', height: '75px', borderRadius: '50%', background: 'linear-gradient(135deg, #6B4226 0%, #3E2618 100%)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '1.8rem', boxShadow: '0 8px 20px rgba(107,66,38,0.2)', flexShrink: 0 }}>
            {post.author?.image ? (
              <img src={post.author.image} alt={authorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : authorName.toLowerCase().includes('huzaifa') ? (
              <img src="/huzaifa.png" alt="Muhammad Huzaifa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              authorInitial
            )}
          </div>
          <div className="author-bio-details">
            <h3 style={{ margin: '0 0 0.4rem 0', fontWeight: '800', color: '#3E2618', fontSize: '1.3rem' }}>
              Written by <span style={{ color: '#6B4226' }}>{authorName.toLowerCase().includes('mari') ? 'Marium Waseem (CEO)' : authorName.toLowerCase().includes('huzaifa') ? 'Muhammad Huzaifa (Founder & Boss)' : authorName}</span>
            </h3>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {authorName.toLowerCase().includes('mari') 
                ? "Marium Waseem is the Chief Executive Officer (CEO) of Blog Fusion. She leads company strategy, technology insights, and editorial excellence." 
                : "Muhammad Huzaifa is the Founder and Boss of Blog Fusion. He is a passionate software engineer and creator dedicated to sharing practical tech guides."}
            </p>
          </div>
        </aside>

        {/* Sharing Ribbon */}
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid #f1f5f9', marginTop: '4rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>Share this post:</h3>
          <ShareButtons title={post.title} />
        </div>
      </div>
    </article>
  );
}
