import { notFound } from 'next/navigation';
import Link from 'next/link';
import { checkAuth } from '../../../lib/auth';
import prisma from '@/lib/prisma'; 
import ShareButtons from '@/components/ShareButtons';
import { Metadata } from 'next';

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

  prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } }
  }).catch(err => console.error("Error updating views:", err));

  const authorName = post.author?.username || "Admin";
  const authorInitial = authorName[0]?.toUpperCase() || "D";

  let content = post.content;

  const fontSettingsMatch = content.match(/<post-settings size="(.*?)" family="(.*?)" \/>/);
  let customStyles: React.CSSProperties = {};
  if (fontSettingsMatch) {
    customStyles = {
      fontSize: fontSettingsMatch[1],
      fontFamily: fontSettingsMatch[2]
    };
    content = content.replace(/<post-settings .*? \/>/, '');
  }

  let processedContent = content.replace(/<back href="(.*?)">(.*?)<\/back>/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>');
  processedContent = processedContent.replace(/<color val="(.*?)">(.*?)<\/color>/g, '<span style="color: $1">$2</span>');
  processedContent = processedContent.replace(/<u>(.*?)<\/u>/g, '<span style="text-decoration: underline">$1</span>');
  processedContent = processedContent.replace(/<no-u>(.*?)<\/no-u>/g, '<span style="text-decoration: none">$1</span>');
  processedContent = processedContent.replace(/<spacer \/>/g, '<div style="height: 1.5rem;" class="blog-spacer"></div>');

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
      
      {/* ─── NAYI AUTOMATIC ADS: SOCIAL BAR & FLOATING SCRIPT NO. 1 ─── */}
      <div dangerouslySetInnerHTML={{
        __html: `
          <script async="async" data-cfasync="false" src="https://pl29699171.effectivecpmnetwork.com/646dfe8819eb11a7954692a21b4c9ada/invoke.js"></script>
          <div id="container-646dfe8819eb11a7954692a21b4c9ada"></div>
          <script type="text/javascript" src="https://pl29699172.effectivecpmnetwork.com/10/f4/fb/10f4fb60e1a7547158745009f4cbeb84.js"></script>
        `
      }} />

      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
        <Link href="/" className="back-link">
          &larr; Back to Home
        </Link>

        <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem', display: 'block' }}>
            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>

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

        {/* ─── CENTERED TOP BANNER AD (468x60 NAYA CODE) ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto 3rem auto', maxWidth: '468px', padding: '6px', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '12px' }}>
          <span style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '3px', fontWeight: '700' }}>ADVERTISEMENT</span>
          <div 
            style={{ width: '468px', height: '60px', overflow: 'hidden' }} 
            dangerouslySetInnerHTML={{
              __html: `
                <script type="text/javascript">
                  atOptions = {
                    'key' : '2a32449f0366cc57d7aa759f77df868f',
                    'format' : 'iframe',
                    'height' : 60,
                    'width' : 468,
                    'params' : {}
                  };
                </script>
                <script type="text/javascript" src="https://www.highperformanceformat.com/2a32449f0366cc57d7aa759f77df868f/invoke.js"></script>
              `
            }} 
          />
        </div>
        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
        </div>
      </div>

      {imageIndex < inlineImages.length && (
        <div style={{ marginTop: '4rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            More Images from this Blog
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {inlineImages.slice(imageIndex).map((img, idx) => (
              <div key={idx} style={{ position: 'relative', height: '200px', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <Image
                  src={img.src}
                  alt={img.alt || `Blog image ${idx + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
