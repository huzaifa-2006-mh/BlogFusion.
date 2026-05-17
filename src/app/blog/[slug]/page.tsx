import { notFound } from 'next/navigation';
import Link from 'next/link';
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
      title: 'Post Not Found - Digital Inspiration'
    };
  }

  return {
    title: post.metaTitle || `${post.title} - Digital Inspiration`,
    description: post.metaDescription || post.excerpt,
    keywords: post.focusKeywords || undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
      type: 'article',
    }
  };
}

export default async function BlogPostPage({ params }: any) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      author: true
    }
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

  // Replace Markdown-like headings
  processedContent = processedContent.replace(/^(?:\*\*|\#)\s+(.*)$/gm, '<h2>$1</h2>');

  // Handle <code> tags with newline preservation
  const codeBlocks: string[] = [];
  processedContent = processedContent.replace(/<code>([\s\S]*?)<\/code>/g, (match, code) => {
    const placeholder = `[CODE_BLOCK_${codeBlocks.length}]`;
    codeBlocks.push(`<pre class="code-block"><code>${code.trim()}</code></pre>`);
    return placeholder;
  });

  processedContent = processedContent.replace(/\n/g, '<br/>');

  // Restore code blocks
  codeBlocks.forEach((block, index) => {
    processedContent = processedContent.replace(`[CODE_BLOCK_${index}]`, block);
  });
  
  const gallery = [...(post.images || [])];
  const inlineImages = [...gallery];
  
  let imageIndex = 0;
  while (processedContent.includes('[IMAGE]') && imageIndex < inlineImages.length) {
    const imgHtml = `
      <div class="inline-image" style="margin: 2rem 0; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
        <img src="${inlineImages[imageIndex]}" alt="Blog image ${imageIndex + 1}" style="width: 100%; height: auto; display: block;" />
      </div>
    `;
    processedContent = processedContent.replace('[IMAGE]', imgHtml);
    imageIndex++;
  }

  return (
    <article className="section" style={{ padding: '4rem 0 6rem 0' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Compact Back Button */}
        <Link href="/" className="back-link">
          &larr; Back to Home
        </Link>
        
        {/* Dynamic Detail Header (Beautifully Centered) */}
        <header style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          {/* Centered Date */}
          <span style={{ 
            fontSize: '0.875rem', 
            color: '#64748b', 
            fontWeight: '600', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            marginBottom: '0.8rem', 
            display: 'block' 
          }}>
            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          
          {/* Centered Title */}
          <h1 style={{ 
            fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', 
            fontWeight: '800', 
            color: '#0f172a',
            lineHeight: '1.25',
            letterSpacing: '-0.03em',
            margin: '0 auto 1.2rem auto',
            maxWidth: '750px'
          }}>
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p style={{ 
              fontSize: '1.15rem', 
              color: '#475569', 
              lineHeight: '1.5', 
              fontWeight: '500',
              margin: '0 auto 1.5rem auto',
              maxWidth: '620px'
            }}>
              {post.excerpt}
            </p>
          )}

          {/* Centered Category Tag Row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Link href={`/category/${post.category.slug}`} style={{ textDecoration: 'none' }}>
              <span className="blog-detail-category-tag" style={{ marginBottom: 0 }}>#{post.category.slug}</span>
            </Link>
          </div>

          {/* Centered Author Meta Badge */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.8rem', 
            borderTop: '1px solid #f1f5f9', 
            paddingTop: '1.25rem',
            maxWidth: '450px',
            margin: '0 auto'
          }}>
            <div style={{ 
              width: '38px', 
              height: '38px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #ec4899 0%, #ff4b91 100%)', 
              overflow: 'hidden', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              fontWeight: '800',
              fontSize: '0.95rem',
              boxShadow: '0 4px 10px rgba(236,72,153,0.15)'
            }}>
              {authorInitial}
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>{authorName}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: '500', marginTop: '0.05rem' }}>
                {Math.ceil(post.content.length / 500)} min read
              </p>
            </div>
          </div>
        </header>

        {/* Clean Reading Box */}
        <div className="blog-content" style={{ ...customStyles }}>
          <div dangerouslySetInnerHTML={{ __html: processedContent }} />
        </div>

        {/* Premium FAQ Card Accordions */}
        {post.faqs && (post.faqs as any[]).length > 0 && (
          <div style={{ marginTop: '4.5rem', padding: '2.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
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

        {/* Sharing Ribbon */}
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid #f1f5f9', marginTop: '4rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>Share this post:</h3>
          <ShareButtons title={post.title} />
        </div>
      </div>
    </article>
  );
}
