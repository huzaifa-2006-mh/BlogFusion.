import { notFound } from 'next/navigation';
import Link from 'next/link';
import { checkAuth } from '../../../lib/auth';
import prisma from '@/lib/prisma'; // Default import jo bina brackets ke lowercase prisma fetch karega
import ShareButtons from '@/components/ShareButtons';
import { Metadata } from 'next';
import Script from 'next/script';

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true }
  });
  return posts.map((post) => ({
    slug: post.slug
  }));
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const post = await prisma.post.findUnique({
    where: { slug }
  });

  if (!post) {
    return {
      title: 'Post Not Found - Blog Fusion'
    };
  }

  const metadata: Metadata = {
    title: post.metaTitle || `${post.title} - Blog Fusion`,
    description: post.metaDescription || post.excerpt,
    keywords: post.focusKeywords || undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.ogImage ? [{ url: post.ogImage }] : (post.coverImage ? [{ url: post.coverImage }] : []),
      url: post.canonicalUrl || undefined,
      type: 'article',
    },
    alternates: {
      canonical: post.canonicalUrl || undefined,
    }
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
}

export default async function BlogPostPage({ params }: any) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true, author: true }
  });

  if (!post || !post.published) {
    notFound();
  }

  // Increment view count in background
  prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } }
  }).catch(err => console.error("Error updating views:", err));

  const authorName = post.author?.username || "Admin";
  const authorInitial = authorName[0]?.toUpperCase() || "D";

  let content = post.content;

  // Extract font settings if present: <post-settings size="20px" family="Arial" />
  const fontSettingsMatch = content.match(/<post-settings size="(.*?)" family="(.*?)" \/>/);
  let customStyles: React.CSSProperties = {};
  if (fontSettingsMatch) {
    customStyles = {
      fontSize: fontSettingsMatch[1],
      fontFamily: fontSettingsMatch[2]
    };
    content = content.replace(/<post-settings .*? \/>/, '');
  }

  // Replace <back href="..."> with <a>
  let processedContent = content.replace(/<back href="(.*?)">(.*?)<\/back>/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>');

  // Handle <color val="..."> tag
  processedContent = processedContent.replace(/<color val="(.*?)">(.*?)<\/color>/g, '<span style="color: $1">$2</span>');

  // Handle <u> and <no-u>
  processedContent = processedContent.replace(/<u>(.*?)<\/u>/g, '<span style="text-decoration: underline">$1</span>');
  processedContent = processedContent.replace(/<no-u>(.*?)<\/no-u>/g, '<span style="text-decoration: none">$1</span>');

  // Handle <spacer /> tag
  processedContent = processedContent.replace(/<spacer \/>/g, '<div style="height: 1.5rem;" class="blog-spacer"></div>');

  // Replace Markdown-like headings
  processedContent = processedContent.replace(/^###\s+(.*)$/gm, '<h4>$1</h4>');
  processedContent = processedContent.replace(/^##\s+(.*)$/gm, '<h3>$1</h3>');
  processedContent = processedContent.replace(/^(?:\*\*|\#)\s+(.*)$/gm, '<h2>$1</h2>');

  // Handle <code> tags with newline preservation
  const codeBlocks: string[] = [];
  processedContent = processedContent.replace(/<code>([\s\S]*?)<\/code>/g, (match, code) => {
    const placeholder = `[CODE_BLOCK_${codeBlocks.length}]`;
    codeBlocks.push(`<pre class="code-block"><code>${code.trim()}</code></pre>`);
    return placeholder;
  });

  processedContent = processedContent.replace(/\n/g, '<br/>');

  // Clean up <br/> around block elements to prevent excessive spacing
  processedContent = processedContent.replace(/(<\/h[1-6]>)(?:\s*<br\/>)+/g, '$1');
  processedContent = processedContent.replace(/(?:<br\/>\s*)+(<h[1-6]>)/g, '$1');

  // Restore code blocks
  codeBlocks.forEach((block, index) => {
    processedContent = processedContent.replace(`[CODE_BLOCK_${index}]`, block);
  });

  const gallery = [...(post.images || [])];
  const inlineImages = [...gallery];
  let imageIndex = 0;
  const imageRegex = /(?:<p>\s*)?\[IMAGE(?:[:|]\s*(.*?))?\](?:\s*<\/p>)?/i;

  while (imageRegex.test(processedContent) && imageIndex < inlineImages.length) {
    const match = imageRegex.exec(processedContent);
    if (!match) break;
    const altText = match[1] ? match[1].trim() : `Blog image ${imageIndex + 1}`;
    const imgHtml = `
      <figure class="inline-image" style="margin: 2rem 0; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
        <img src="${inlineImages[imageIndex]}" alt="${altText}" style="width: 100%; height: auto; display: block;" />
        ${match[1] ? `<figcaption style="text-align: center; font-size: 0.85rem; color: #64748b; padding: 0.75rem; background: #f8fafc; border-top: 1px solid #e2e8f0; margin: 0;">${altText}</figcaption>` : ''}
      </figure>
    `;
    processedContent = processedContent.replace(match[0], imgHtml);
    imageIndex++;
  }

  return (
    <article className="section" style={{ padding: '4rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Compact Back Button */}
        <Link href="/" className="back-link">
          &larr; Back to Home
        </Link>

        {/* Dynamic Detail Header */}
        <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          {/* Centered Date */}
          <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem', display: 'block' }}>
            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>

          {/* Centered Title */}
          <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.3rem)', fontWeight: '800', color: '#0f172a', lineHeight: '1.25', letterSpacing: '-0.02em', margin: '0 auto 1.2rem auto', maxWidth: '750px' }}>
            {post.title}
          </h1>

          {post.shortDescription && (
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.5', fontWeight: '500', margin: '0 auto 1.5rem auto', maxWidth: '620px' }}>
              {post.shortDescription}
            </p>
          )}

          {/* Centered Category Tag Row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <Link href={`/category/${post.category.slug}`} style={{ textDecoration: 'none' }}>
              <span className="blog-detail-category-tag" style={{ marginBottom: 0 }}>#{post.category.slug}</span>
            </Link>
          </div>
        </header>

        {/* ─── CENTERED TOP BANNER AD (468x60) ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto 3rem auto', maxWidth: '468px', padding: '6px', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '12px' }}>
          <span style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '3px', fontWeight: '700' }}>ADVERTISEMENT</span>
          <div style={{ width: '468px', height: '60px', overflow: 'hidden' }}>
            <Script id="adsterra-468-60" strategy="afterInteractive">
              {`
                window.atOptions = {
                  'key' : '29598671',
                  'format' : 'iframe',
                  'height' : 60,
                  'width' : 468,
                  'params' : {}
                };
              `}
            </Script>
            <Script strategy="afterInteractive" src="https://www.highperformanceformat.com/29598671/invoke.js" />
          </div>
        </div>

        {/* Clean Reading Box */}
        <div className="blog-content" style={{ ...customStyles }}>
          <div dangerouslySetInnerHTML={{ __html: processedContent }} />
        </div>

        {/* ─── MIDDLE SQUARE BOX AD (300x250) ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '4rem auto', width: '320px', padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.01)' }}>
          <span style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '6px', fontWeight: '700' }}>SPONSORED ADS</span>
          <div style={{ width: '300px', height: '250px', overflow: 'hidden', borderRadius: '8px', background: '#fff' }}>
            <Script id="adsterra-300-250" strategy="afterInteractive">
              {`
                window.atOptions = {
                  'key' : '29598678',
                  'format' : 'iframe',
                  'height' : 250,
                  'width' : 300,
                  'params' : {}
                };
              `}
            </Script>
            <Script strategy="afterInteractive" src="https://www.highperformanceformat.com/29598678/invoke.js" />
          </div>
        </div>

        {/* Premium FAQ Card Accordions */}
        {post.faqs && (post.faqs as any[]).length > 0 && (
          <div style={{ marginTop: '2rem', padding: '2.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ marginBottom: '1.8rem', fontSize: '1.6rem', color: '#0f172a', textAlign: 'center', fontWeight: '800', letterSpacing: '-0.02em' }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(post.faqs as any[]).map((faq, index) => (
                <div key={index} style={{ background: 'white', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.01)' }}>
                  <h4 style={{ color: '#0f172a', fontWeight: '700', fontSize: '1.02rem', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: '#ec4899', fontWeight: '800' }}>Q:</span> {faq.question}
                  </h4>
                  <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5', margin: 0, fontWeight: '500' }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Remaining Gallery Display */}
        {imageIndex < inlineImages.length && (
          <div style={{ marginTop: '4rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>Post Gallery</h3>
            <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {inlineImages.slice(imageIndex).map((img, index) => (
                <div key={index} style={{ height: '220px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                  <img src={img} alt={`Gallery ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Premium Author Bio Box */}
        <div style={{ marginTop: '5rem', padding: '2rem', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '75px', height: '75px', borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899 0%, #ff4b91 100%)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '1.8rem', boxShadow: '0 8px 20px rgba(236,72,153,0.2)', flexShrink: 0 }}>
            {(post.author?.image || authorName.toLowerCase().includes('huzaifa')) ? (
              <img src={post.author?.image || '/huzaifa.png'} alt={authorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              authorInitial
            )}
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.4rem 0', fontWeight: '800', color: '#0f172a', fontSize: '1.3rem' }}>
              Written by <span style={{ color: '#ec4899' }}>{authorName}</span>
            </h3>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {authorName.toLowerCase().includes('marium') ? "Marium Waseem is a passionate developer and the lead voice behind Blog Fusion. She loves exploring new technologies and sharing her knowledge." : "Muhammad Huzaifa is a passionate developer and the lead voice behind Blog Fusion. He loves exploring new technologies and sharing his knowledge."}
            </p>
          </div>
        </div>

        {/* Sharing Ribbon */}
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid #f1f5f9', marginTop: '4rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>Share this post:</h3>
          <ShareButtons title={post.title} />
        </div>
      </div>

      {/* ─── DESKTOP RIGHT FLOATING SKYSCRAPER AD (160x600) ─── */}
      <div className="hidden xl:block" style={{ position: 'fixed', right: '20px', top: '150px', zIndex: 50, width: '160px', height: '600px', background: '#f8fafc', borderRadius: '8px', padding: '4px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>SPONSORED</span>
        <Script id="adsterra-160-600" strategy="afterInteractive">
          {`
            window.atOptions = {
              'key' : '29598677',
              'format' : 'iframe',
              'height' : 600,
              'width' : 160,
              'params' : {}
            };
          `}
        </Script>
        <Script strategy="afterInteractive" src="https://www.highperformanceformat.com/29598677/invoke.js" />
      </div>
    </article>
  );
}
