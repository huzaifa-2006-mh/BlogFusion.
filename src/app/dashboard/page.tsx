import prisma from '@/lib/prisma';

export default async function DashboardHome() {
  const stats = {
    postCount: 0,
    categoryCount: 0,
    totalVisitors: 0,
    totalReads: 0,
    avgTimeSpent: 0,
    uniqueEmails: 0
  };

  let recentActivity: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any

  try {
    stats.postCount = await prisma.post.count();
    stats.categoryCount = await prisma.category.count();
    
    // Total Unique Visitors
// @ts-ignore
    const uniqueVisitors = await prisma.analytics.groupBy({
      by: ['visitorId'],
    });
    stats.totalVisitors = uniqueVisitors.length;

    // Total Blog Reads (sum of all post views)
    const posts = await prisma.post.findMany({ select: { views: true } });
    stats.totalReads = posts.reduce((sum, p) => sum + (p.views || 0), 0);

    // Average Time Spent (in seconds)
// @ts-ignore
    const visitorDurations = await prisma.analytics.groupBy({
      by: ['visitorId'],
      _sum: { duration: true }
    });
    stats.avgTimeSpent = visitorDurations.length > 0 
      ? Math.round(visitorDurations.reduce((sum, v) => sum + (v._sum.duration || 0), 0) / visitorDurations.length)
      : 0;

    // Newsletter Subscribers (from dedicated Subscriber model)
// @ts-ignore
    stats.uniqueEmails = await prisma.subscriber.count();

    // Recent Activity (last 10 sessions)
// @ts-ignore
    recentActivity = await prisma.analytics.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 10
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="fade-in">
      <h1 className="mb-4">Welcome Back, Chief!</h1>
      <p className="mb-4">Here&apos;s a detailed look at your platform&apos;s performance.</p>

      {/* Main Stats Grid */}
      <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.5rem' }}>
        <div className="stats-card" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>Total Visitors</p>
          <h3 style={{ color: '#0f172a' }}>{stats.totalVisitors}</h3>
        </div>
        <div className="stats-card" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>Total Blog Reads</p>
          <h3 style={{ color: '#0f172a' }}>{stats.totalReads}</h3>
        </div>
        <div className="stats-card" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>Avg. Time Spent</p>
          <h3 style={{ color: '#0f172a' }}>{formatTime(stats.avgTimeSpent)}</h3>
        </div>
        <div className="stats-card" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>Newsletter Subscribers</p>
          <h3 style={{ color: '#0f172a' }}>{stats.uniqueEmails}</h3>
          <a href="/dashboard/subscribers" style={{ fontSize: '0.8rem', color: '#e11d48', textDecoration: 'none', fontWeight: 600 }}>View all →</a>
        </div>
      </div>

      <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div className="stats-card" style={{ padding: '1.5rem', background: '#0f172a', color: 'white' }}>
          <p style={{ color: '#94a3b8', margin: 0, fontWeight: 600 }}>Blogs Written</p>
          <h3 style={{ fontSize: '2.5rem', color: 'white', marginTop: '0.5rem' }}>{stats.postCount}</h3>
        </div>
        <div className="stats-card" style={{ padding: '1.5rem', background: '#e11d48', color: 'white' }}>
          <p style={{ color: '#ffe4e6', margin: 0, fontWeight: 600 }}>Active Categories</p>
          <h3 style={{ fontSize: '2.5rem', color: 'white', marginTop: '0.5rem' }}>{stats.categoryCount}</h3>
        </div>
        <div className="stats-card" style={{ padding: '1.5rem', background: '#10b981', color: 'white' }}>
          <p style={{ color: '#d1fae5', margin: 0, fontWeight: 600 }}>Platform Status</p>
          <h3 style={{ fontSize: '2.5rem', color: 'white', marginTop: '0.5rem' }}>Live</h3>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="section" style={{ padding: '2rem 0' }}>
        <h2 className="mb-4" style={{ fontSize: '1.5rem' }}>Recent Visitor Activity</h2>
        <div className="card" style={{ padding: '0', overflowX: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ minWidth: '700px' }}> {/* Ensure table doesn't squish too much */}
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(10, 25, 47, 0.05)', borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '1rem' }}>User / ID</th>
                  <th style={{ padding: '1rem' }}>Page Viewed</th>
                  <th style={{ padding: '1rem' }}>Time Spent</th>
                  <th style={{ padding: '1rem' }}>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.length > 0 ? (
                  recentActivity.map((act) => (
                    <tr key={act.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{act.email || "Anonymous"}</span>
                        <br />
                        <span style={{ fontSize: '0.7rem', color: '#888' }}>ID: {act.visitorId?.substring(0, 8)}</span>
                      </td>
                      <td style={{ padding: '1rem', color: '#444', fontSize: '0.9rem' }}>
                        <code>{act.path || '/'}</code>
                      </td>
                      <td style={{ padding: '1rem' }}>{formatTime(act.duration)}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#888' }}>
                        {new Date(act.updatedAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No activity recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
