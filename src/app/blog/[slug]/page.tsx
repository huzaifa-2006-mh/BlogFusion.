import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ShareButtons from '@/components/ShareButtons';
import Image from 'next/image';

export default async function BlogPostPage({ params }: any) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true }
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen text-gray-900 selection:bg-indigo-100">
      <article className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8 font-sans antialiased">
        
        {/* 1. Pill-Style Tags (Top Centered) */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {post.focusKeywords?.split(',').map((tag: string) => (
            <span 
              key={tag} 
              className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100"
            >
              {tag.trim()}
            </span>
          ))}
        </div>

        {/* 2. Premium Serif Title */}
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-center text-gray-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* 3. Clean Meta Info (Centered Author & Date) */}
        <div className="flex items-center justify-center space-x-3 text-sm text-gray-500 mb-10 border-b border-gray-100 pb-8">
          {post.author?.image ? (
            <Image 
              src={post.author.image} 
              alt={post.author.name || 'Author'} 
              width={32} 
              height={32} 
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-xs">
              {post.author?.name?.charAt(0) || 'A'}
            </div>
          )}
          <span className="font-medium text-gray-800">{post.author?.name || 'Admin'}</span>
          <span>•</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </span>
        </div>

        {/* 4. Beautiful Rounded Featured Image */}
        {post.featuredImage && (
          <div className="relative w-full h-64 sm:h-[400px] mb-12 overflow-hidden rounded-2xl shadow-sm border border-gray-100">
            <Image 
              src={post.featuredImage} 
              alt={post.title} 
              fill 
              className="object-cover"
              priority 
            />
          </div>
        )}

        {/* 5. Article Content (Serif for Readability - Labnol Style) */}
        <div className="font-serif text-lg sm:text-xl text-gray-800 leading-relaxed space-y-6 max-w-none">
          {/* Injecting content safely */}
          <div 
            className="prose prose-lg prose-indigo max-w-none 
              prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900
              prose-p:text-gray-800 prose-p:leading-relaxed
              prose-pre:bg-gray-50 prose-pre:text-gray-900 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-xl prose-pre:p-4
              prose-code:text-indigo-600 prose-code:bg-gray-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </div>

        {/* 6. Share Section */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
            <span>Share</span>
            <ShareButtons url={`/blog/${post.slug}`} title={post.title} />
          </div>
        </div>

      </article>
    </div>
  );
}
