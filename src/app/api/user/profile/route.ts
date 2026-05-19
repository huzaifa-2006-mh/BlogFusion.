import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('auth_session');

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const username = session.value;
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, image: true }
  });

  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('auth_session');

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const username = session.value;
  const body = await request.json();
  const { image } = body;

  const user = await prisma.user.update({
    where: { username },
    data: { image }
  });

  return NextResponse.json({ success: true, image: user.image });
}
