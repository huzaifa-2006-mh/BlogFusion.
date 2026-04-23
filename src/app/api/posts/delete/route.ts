import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function DELETE(request: Request) {
  console.log('--- DELETE REQUEST RECEIVED ---');
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log('ID to delete:', id);

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const session = cookieStore.get('auth_session');
    console.log('Session present:', !!session);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Attempt deletion
    const deletedPost = await prisma.post.delete({
      where: { id },
    });
    
    console.log('Successfully deleted post:', deletedPost.id);
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    console.error('API Delete Error Detail:', error);
    return NextResponse.json({ 
      error: 'Failed to delete post', 
      details: error.message 
    }, { status: 500 });
  }
}
