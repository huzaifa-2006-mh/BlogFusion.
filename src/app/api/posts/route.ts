import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { applyImageAltPlaceholders, optimizeAndStoreImage } from '@/lib/imageUpload';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('auth_session');

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const categoryId = formData.get('categoryId') as string;
    const files = formData.getAll('images') as File[];
    const imageAlts = JSON.parse((formData.get('imageAlts') as string) || '[]') as string[];

    const uploadedImagePaths: string[] = [];

    for (const file of files) {
      if (file.size > 0) {
        const optimizedPath = await optimizeAndStoreImage(file);
        uploadedImagePaths.push(optimizedPath);
      }
    }

    const contentWithImages = applyImageAltPlaceholders(content, imageAlts);

    // Find the user (author)
    const username = session.value;
    let user = await prisma.user.findUnique({ where: { username } });

    // If user doesn't exist in DB (e.g. first time login), create them
    if (!user) {
      user = await prisma.user.create({
        data: {
          username,
          password: 'hardcoded_password_placeholder', // Since we use custom session
        }
      });
    }

    // Generate a clean slug
    const baseSlug = title.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const post = await prisma.post.create({
      data: {
        title,
        slug: baseSlug,
        content: contentWithImages,
        excerpt: contentWithImages.substring(0, 150).replace(/<[^>]*>?/gm, '') + '...',
        categoryId,
        authorId: user.id,
        published: true,
        showOnHome: formData.get('showOnHome') === 'true',
        shortDescription: formData.get('shortDescription') as string || null,
        faqs: formData.get('faqs') ? JSON.parse(formData.get('faqs') as string) : null,
        coverImage: uploadedImagePaths[0] || null,
        images: uploadedImagePaths,
        metaTitle: (formData.get('metaTitle') as string) || null,
        metaDescription: (formData.get('metaDescription') as string) || null,
        focusKeywords: (formData.get('focusKeywords') as string) || null,
        ogImage: (formData.get('ogImage') as string) || null,
        canonicalUrl: (formData.get('canonicalUrl') as string) || null,
        isIndexable: formData.get('isIndexable') !== 'false',
      },
    });

    revalidatePath('/');
    return NextResponse.json(post);
  } catch (error) {
    console.error('Post creation error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
