import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    
    if (!body || !body.email) {
      return NextResponse.json(
        { error: 'Email field is required.' },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // چیک کریں کہ ای میل پہلے سے موجود تو نہیں
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'This email is already subscribed!' },
        { status: 400 }
      );
    }

    // ڈیٹا بیس میں ای میل سیو کرنا
    await prisma.subscriber.create({
      data: { email },
    });

    return NextResponse.json(
      { message: 'Awesome! You have successfully subscribed.' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Database/Server Error:', error);
    return NextResponse.json(
      { error: 'Server error. Please try again later.' },
      { status: 500 }
    );
  }
}
