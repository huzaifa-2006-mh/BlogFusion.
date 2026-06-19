import { notFound } from 'next/navigation';
import Link from 'next/link';
import { checkAuth } from '../../../lib/auth';
import prisma from '@/lib/prisma';
import ShareButtons from '@/components/ShareButtons';
import { Metadata } from 'next';
import Image from 'next/image';

// ... generateStaticParams aur generateMetadata waise hi rahega ...

export default async function BlogPostPage({ params }: any) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true } // Agar author ki details chahiye toh
  });

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8 font-sans antialiased text-gray-900">
      {/* Category / Tags */}
      <div className="flex flex-wrap gap-2 text-sm text-indigo-600 font-semibold tracking-wide uppercase mb-3">
        {post.focusKeywords?.split(',').map((tag: string) => (
          <span key={tag}>#{tag.trim()}</span>
        ))}
      </div>

      {/* Blog Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
        {post.title}
      </h1>

      {/* Meta Info (Date, Author) */}
      <div className="flex items-center space-x-3 text-sm text-gray-500 mb-8 border-b border-gray-200 pb-6">
        <span className="font-medium text-gray-700">{post.author?.name || 'Admin'}</span>
        <span>•</span>
        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>

      {/* Featured Image (Optional, agar model me hai) */}
      {post.featuredImage && (
        <div className="relative w-full h-64 sm:h-96 mb-8 overflow-hidden rounded-xl shadow-sm">
          <Image 
            src={post.featuredImage} 
            alt={post.title} 
            fill 
            className="object-cover"
            priority 
          />
        </div>
      )}

      {/* Main Content (Prose format text formatting ke liye) */}
      <div className="prose prose-lg max-w-none prose-indigo text-gray-800 leading-relaxed space-y-6">
        {/* Agar HTML format me data hai toh dangerouslySetInnerHTML use karein */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* Share Buttons Component */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Share this post</h3>
        <ShareButtons url={`/blog/${post.slug}`} title={post.title} />
      </div>
    </article>
  );
}
