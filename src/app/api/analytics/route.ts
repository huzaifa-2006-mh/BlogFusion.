import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { visitorId, path, duration, email } = body;

    if (!visitorId) {
      return NextResponse.json({ error: 'visitorId is required' }, { status: 400 });
    }

    // Find a recent session for this visitor on this path (within last 30 minutes)
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    
// @ts-ignore
    const existingSession = await prisma.analytics.findFirst({
      where: {
        visitorId,
        path,
        updatedAt: { gte: thirtyMinsAgo }
      },
      orderBy: { updatedAt: 'desc' }
    });

    if (existingSession) {
// @ts-ignore
      const updated = await prisma.analytics.update({
        where: { id: existingSession.id },
        data: {
          duration: typeof duration === 'number' ? duration : existingSession.duration + 30,
          lastPing: new Date(),
          email: email || existingSession.email
        }
      });
      return NextResponse.json(updated);
    } else {
// @ts-ignore
      const created = await prisma.analytics.create({
        data: {
          visitorId,
          path,
          duration: duration || 0,
          email: email || null
        }
      });
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error('Analytics Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // 1. Total Unique Visitors
// @ts-ignore
    const uniqueVisitorsCount = await prisma.analytics.groupBy({
      by: ['visitorId'],
    }).then((res: unknown[]) => res.length);

    // 2. Total Blog Reads
    const posts = await prisma.post.findMany({
      select: { views: true }
    });
    const totalReads = posts.reduce((sum, p) => sum + (p.views || 0), 0);

    // 3. Average Time Spent (per visitor)
// @ts-ignore
    const visitorDurations = await prisma.analytics.groupBy({
      by: ['visitorId'],
      _sum: { duration: true }
    });
    const avgTimeSpent = visitorDurations.length > 0 
      ? Math.round(visitorDurations.reduce((sum, v) => sum + (v._sum.duration || 0), 0) / visitorDurations.length)
      : 0;

    // 4. Unique Emails
// @ts-ignore
    const uniqueEmails = await prisma.analytics.groupBy({
      by: ['email'],
      where: { email: { not: null } }
    }).then(res => res.length);

    // 5. Recent Activity
// @ts-ignore
    const recentActivity = await prisma.analytics.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 15,
      select: {
        email: true,
        path: true,
        duration: true,
        updatedAt: true,
        visitorId: true
      }
    });

    return NextResponse.json({
      totalVisitors: uniqueVisitorsCount,
      totalReads,
      avgTimeSpent,
      uniqueEmails,
      recentActivity
    });
  } catch (error) {
    console.error('Analytics Fetch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
