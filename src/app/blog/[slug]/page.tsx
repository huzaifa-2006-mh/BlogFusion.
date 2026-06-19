import { notFound } from 'next/navigation';
import Link from 'next/link';
import { checkAuth } from '../../../lib/auth';
import prisma from '@/lib/prisma';
import ShareButtons from '@/components/ShareButtons';
import { Metadata } from 'next';
import Image from 'next/image';

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
    return { title: 'Post Not Found - Blog Fusion' };
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
    customStyles = { fontSize: fontSettingsMatch[1], fontFamily: fontSettingsMatch[2] };
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
  processedContent = processedContent.replace(/^(?:<br\/>\s*)+(<h[1-6]>)/g, '$1');

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="prose lg:prose-xl mx-auto dark:prose-invert">
        {post.coverImage && (
          <div className="relative h-96 w-full mb-8 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}

        <div className="flex items-center space-x-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
            {authorInitial}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">By {authorName}</p>
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 mb-4">
          {post.title}
        </h1>

        {post.category && (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-8">
            {post.category.name}
          </span>
        )}

        <div className="mb-8">
          <ShareButtons url={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/blog/${post.slug}`} title={post.title} />
        </div>

        <div 
          className="markdown-content text-gray-800 dark:text-gray-200 leading-relaxed prose max-w-none"
          style={customStyles}
          dangerouslySetInnerHTML={{ __html: processedContent }} 
        />

        {imageIndex < inlineImages.length && (
          <div style={{ marginTop: '4rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              More Images from this Blog
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {inlineImages.slice(imageIndex).map((img, idx) => (
                <div key={idx} style={{ position: 'relative', height: '200px', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <Image
                    src={img}
                    alt={`Blog image ${idx + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
