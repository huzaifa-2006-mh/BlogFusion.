import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { applyImageAltPlaceholders, optimizeAndStoreImage } from '@/lib/imageUpload';

// GET a single post
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { category: true }
    });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// UPDATE a post
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const contentWithImages = applyImageAltPlaceholders(content, imageAlts);

    const updateData: any = {
      title,
      content: contentWithImages,
      categoryId,
      excerpt: contentWithImages.substring(0, 150).replace(/<[^>]*>?/gm, '') + '...',
      showOnHome: formData.get('showOnHome') === 'true',
      shortDescription: formData.get('shortDescription') as string || null,
      faqs: formData.get('faqs') ? JSON.parse(formData.get('faqs') as string) : null,
      metaTitle: (formData.get('metaTitle') as string) || null,
      metaDescription: (formData.get('metaDescription') as string) || null,
      focusKeywords: (formData.get('focusKeywords') as string) || null,
      ogImage: (formData.get('ogImage') as string) || null,
      canonicalUrl: (formData.get('canonicalUrl') as string) || null,
      isIndexable: formData.get('isIndexable') !== 'false',
    };

    // Handle new images if uploaded
    if (files.length > 0 && files[0].size > 0) {
      const uploadedImagePaths: string[] = [];

      for (const file of files) {
        if (file.size > 0) {
          const optimizedPath = await optimizeAndStoreImage(file);
          uploadedImagePaths.push(optimizedPath);
        }
      }
      updateData.images = uploadedImagePaths;
      updateData.coverImage = uploadedImagePaths[0];
    }

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/');
    return NextResponse.json(post);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE a post
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const session = cookieStore.get('auth_session');

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.post.delete({
      where: { id },
    });
    
    revalidatePath('/');
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
