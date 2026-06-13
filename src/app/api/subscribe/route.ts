import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required.' }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();

    const existing = await prisma.subscriber.findUnique({ where: { email: trimmed } });
    if (existing) {
      return NextResponse.json({ message: 'You are already subscribed!' }, { status: 200 });
    }

    const subscriber = await prisma.subscriber.create({ data: { email: trimmed } });
    return NextResponse.json({ message: 'Successfully subscribed! 🎉', subscriber }, { status: 201 });

  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
