import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    let body: {
      visitorId?: string;
      path?: string;
      duration?: number;
      email?: string | null;
    } = {};

    try {
      const text = await request.text();
      body = text ? JSON.parse(text) : {};
    } catch {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const { visitorId, path, duration, email } = body;

    if (!visitorId) {
      return NextResponse.json({ ok: true, ignored: 'no visitorId' });
    }

    // Safely attempt database tracking without throwing 500 to browser console
    try {
      const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);

      const existingSession = await prisma.analytics.findFirst({
        where: {
          visitorId,
          path,
          updatedAt: { gte: thirtyMinsAgo },
        },
        orderBy: { updatedAt: 'desc' },
      });

      if (existingSession) {
        await prisma.analytics.update({
          where: { id: existingSession.id },
          data: {
            duration: typeof duration === 'number' ? duration : existingSession.duration + 30,
            lastPing: new Date(),
            email: email || existingSession.email,
          },
        });
      } else {
        await prisma.analytics.create({
          data: {
            visitorId,
            path: path || '/',
            duration: duration || 0,
            email: email || null,
          },
        });
      }
    } catch (dbError) {
      // Log to server console only; do not emit a 500 error to the client browser
      console.warn('Analytics DB log failed (silently caught):', dbError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.warn('Analytics route error:', error);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

export async function GET() {
  try {
    // 1. Total Unique Visitors
    let uniqueVisitorsCount = 0;
    try {
      const visitors = await prisma.analytics.groupBy({
        by: ['visitorId'],
      });
      uniqueVisitorsCount = visitors.length;
    } catch {
      uniqueVisitorsCount = 0;
    }

    // 2. Total Blog Reads
    let totalReads = 0;
    try {
      const posts = await prisma.post.findMany({
        select: { views: true },
      });
      totalReads = posts.reduce((sum, p) => sum + (p.views || 0), 0);
    } catch {
      totalReads = 0;
    }

    // 3. Average Time Spent (per visitor)
    let avgTimeSpent = 0;
    try {
      const visitorDurations = await prisma.analytics.groupBy({
        by: ['visitorId'],
        _sum: { duration: true },
      });
      avgTimeSpent =
        visitorDurations.length > 0
          ? Math.round(
              visitorDurations.reduce((sum, v) => sum + (v._sum?.duration || 0), 0) /
                visitorDurations.length
            )
          : 0;
    } catch {
      avgTimeSpent = 0;
    }

    // 4. Unique Emails
    let uniqueEmails = 0;
    try {
      const emails = await prisma.analytics.groupBy({
        by: ['email'],
        where: { email: { not: null } },
      });
      uniqueEmails = emails.length;
    } catch {
      uniqueEmails = 0;
    }

    // 5. Recent Activity
    let recentActivity: any[] = [];
    try {
      recentActivity = await prisma.analytics.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 15,
        select: {
          email: true,
          path: true,
          duration: true,
          updatedAt: true,
          visitorId: true,
        },
      });
    } catch {
      recentActivity = [];
    }

    return NextResponse.json({
      totalVisitors: uniqueVisitorsCount,
      totalReads,
      avgTimeSpent,
      uniqueEmails,
      recentActivity,
    });
  } catch (error) {
    console.error('Analytics Fetch Error:', error);
    return NextResponse.json(
      {
        totalVisitors: 0,
        totalReads: 0,
        avgTimeSpent: 0,
        uniqueEmails: 0,
        recentActivity: [],
      },
      { status: 200 }
    );
  }
}
