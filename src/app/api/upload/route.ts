import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { optimizeAndStoreImage } from '@/lib/imageUpload';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('auth_session');

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    const singleFile = formData.get('image') as File | null;

    const filesToProcess: File[] = [];
    if (singleFile && singleFile.size > 0) {
      filesToProcess.push(singleFile);
    }
    for (const f of files) {
      if (f && f.size > 0) {
        filesToProcess.push(f);
      }
    }

    if (filesToProcess.length === 0) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of filesToProcess) {
      const url = await optimizeAndStoreImage(file);
      uploadedUrls.push(url);
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
