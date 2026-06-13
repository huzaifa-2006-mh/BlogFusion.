import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { generateNewsletterEmail } from '@/lib/newsletter';

export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
    }

    // Get all subscribers
    const subscribers = await prisma.subscriber.findMany({ select: { email: true } });

    if (subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers to email.', sent: 0 });
    }

    // Generate newsletter via Gemini AI
    const { subject, html } = await generateNewsletterEmail(title, content);

    // Send emails via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ error: 'RESEND_API_KEY not configured.' }, { status: 500 });
    }

    const resend = new Resend(resendKey);
    const emails = subscribers.map((s) => s.email);

    // Send in batches of 50 (Resend limit)
    let successCount = 0;
    const batchSize = 50;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      try {
        await resend.emails.send({
          from: 'Blog Fusion <onboarding@resend.dev>',
          to: batch,
          subject,
          html,
        });
        successCount += batch.length;
      } catch (batchErr) {
        console.error('Batch send error:', batchErr);
      }
    }

    return NextResponse.json({
      message: `Newsletter sent to ${successCount} subscribers.`,
      subject,
      sent: successCount,
      total: emails.length,
    });

  } catch (err) {
    console.error('Send newsletter error:', err);
    return NextResponse.json({ error: 'Failed to send newsletter.' }, { status: 500 });
  }
}
