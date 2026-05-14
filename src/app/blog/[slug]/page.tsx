import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ShareButtons from '@/components/ShareButtons';

export default async function BlogPostPage({ params }: any) {
  // @ts-ignore
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
  // @ts-ignore
  prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } }
  }).catch(err => console.error("Error updating views:", err));

  // Ensure author exists before accessing
  const authorName = post.author?.username || "Admin";
  const authorInitial = authorName[0]?.toUpperCase() || "A";

  // Logic to handle custom tags and font styles
  let content = post.content;
  
  // Extract font settings if present: <post-settings size="20px" family="Arial" />
  const fontSettingsMatch = content.match(/<post-settings size="(.*?)" family="(.*?)" \/>/);
  let customStyles: React.CSSProperties = {};
  if (fontSettingsMatch) {
    customStyles = {
      fontSize: fontSettingsMatch[1],
      fontFamily: fontSettingsMatch[2]
    };
    // Remove the settings tag from content
    content = content.replace(/<post-settings .*? \/>/, '');
  }

  // Replace <back href="..."> with <a>
  let processedContent = content.replace(/<back href="(.*?)">(.*?)<\/back>/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: inherit;">$2</a>');
  
  // Handle <color val="..."> tag
  processedContent = processedContent.replace(/<color val="(.*?)">(.*?)<\/color>/g, '<span style="color: $1">$2</span>');

  // Handle <u> (underline) and <no-u> (remove underline)
  processedContent = processedContent.replace(/<u>(.*?)<\/u>/g, '<span style="text-decoration: underline">$1</span>');
  processedContent = processedContent.replace(/<no-u>(.*?)<\/no-u>/g, '<span style="text-decoration: none">$1</span>');

  // Handle <b> (already standard, but ensuring it's not messed up)
  // Replace Markdown-like headings
  processedContent = processedContent.replace(/^(?:\*\*|\#)\s+(.*)$/gm, '<h2 style="margin-top: 2rem; margin-bottom: 1rem; font-size: 1.8rem; color: var(--primary-color);">$1</h2>');

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
  const inlineImages = gallery.slice(1);
  
  let imageIndex = 0;
  while (processedContent.includes('[IMAGE]') && imageIndex < inlineImages.length) {
    const imgHtml = `
      <div class="inline-image" style="margin: 2rem 0; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <img src="${inlineImages[imageIndex]}" alt="Blog image ${imageIndex + 1}" style="width: 100%; height: auto; display: block;" />
      </div>
    `;
    processedContent = processedContent.replace('[IMAGE]', imgHtml);
    imageIndex++;
  }

  return (
    <article className="section">
      <div className="container" style={{ maxWidth: '900px' }}>
        <Link href="/" className="highlight" style={{ marginBottom: '2rem', display: 'inline-block' }}>
          &larr; Back to Home
        </Link>
        
        <header className="mb-4">
          <span className="card-category">{post.category.name}</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginTop: '1rem', lineHeight: '1.2' }}>{post.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--primary-color)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              {authorInitial}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '600', color: 'var(--primary-color)' }}>{authorName}</p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {Math.ceil(post.content.length / 500)} min read
              </p>
            </div>
          </div>
        </header>

        {post.coverImage && (
          <div className="featured-image" style={{ width: '100%', height: 'auto', maxHeight: '500px', marginBottom: '3rem', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div className="blog-content" style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#333', ...customStyles }}>
          <div dangerouslySetInnerHTML={{ __html: processedContent }} />
        </div>

        {/* Display remaining gallery images at the bottom if not used inline */}
        {imageIndex < inlineImages.length && (
          <div style={{ marginTop: '4rem' }}>
            <h3>Gallery</h3>
            <div className="card-grid" style={{ marginTop: '1.5rem' }}>
              {inlineImages.slice(imageIndex).map((img, index) => (
                <div key={index} className="card" style={{ height: '250px' }}>
                  <img src={img} alt={`Gallery ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4" style={{ borderTop: '1px solid #eee', marginTop: '5rem' }}>
          <h3>Share this wisdom:</h3>
          <ShareButtons title={post.title} />
        </div>
      </div>
    </article>
  );
}
