import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

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

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {}

    const uploadedImagePaths: string[] = [];

    for (const file of files) {
      if (file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name}`;
        const path = join(uploadDir, filename);
        await writeFile(path, buffer);
        uploadedImagePaths.push(`/uploads/${filename}`);
      }
    }

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

    const post = await prisma.post.create({
      data: {
        title,
        slug: title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now(),
        content,
        excerpt: content.substring(0, 150).replace(/<[^>]*>?/gm, '') + '...',
        categoryId,
        authorId: user.id,
        published: true,
        coverImage: uploadedImagePaths[0] || null,
        images: uploadedImagePaths,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Post creation error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
