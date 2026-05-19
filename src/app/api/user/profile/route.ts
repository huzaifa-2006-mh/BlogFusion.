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

  try {
    const username = session.value;
    const body = await request.json();
    const { image } = body;

    let user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          username,
          password: 'hardcoded_password_placeholder',
          image
        }
      });
    } else {
      user = await prisma.user.update({
        where: { username },
        data: { image }
      });
    }

    return NextResponse.json({ success: true, image: user.image });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
