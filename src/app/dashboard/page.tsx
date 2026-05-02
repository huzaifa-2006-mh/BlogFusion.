import prisma from '@/lib/prisma';

export default async function DashboardHome() {
  let stats = {
    postCount: 0,
    categoryCount: 0,
    totalVisitors: 0,
    totalReads: 0,
    avgTimeSpent: 0,
    uniqueEmails: 0
  };

  let recentActivity: any[] = [];

  try {
    stats.postCount = await prisma.post.count();
    stats.categoryCount = await prisma.category.count();
    
    // Total Unique Visitors
    const uniqueVisitors = await prisma.analytics.groupBy({
      by: ['visitorId'],
    });
    stats.totalVisitors = uniqueVisitors.length;

    // Total Blog Reads (sum of all post views)
    const posts = await prisma.post.findMany({ select: { views: true } });
    stats.totalReads = posts.reduce((sum, p) => sum + (p.views || 0), 0);

    // Average Time Spent (in seconds)
    const visitorDurations = await prisma.analytics.groupBy({
      by: ['visitorId'],
      _sum: { duration: true }
    });
    stats.avgTimeSpent = visitorDurations.length > 0 
      ? Math.round(visitorDurations.reduce((sum, v) => sum + (v._sum.duration || 0), 0) / visitorDurations.length)
      : 0;

    // Unique Emails Collected
    const uniqueEmails = await prisma.analytics.groupBy({
      by: ['email'],
      where: { email: { not: null } }
    });
    stats.uniqueEmails = uniqueEmails.length;

    // Recent Activity (last 10 sessions)
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
      <p className="mb-4">Here's a detailed look at your platform's performance.</p>

      {/* Main Stats Grid */}
      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <div className="stats-card">
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Total Visitors</p>
          <h3>{stats.totalVisitors}</h3>
        </div>
        <div className="stats-card">
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Total Blog Reads</p>
          <h3>{stats.totalReads}</h3>
        </div>
        <div className="stats-card">
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Avg. Time Spent</p>
          <h3>{formatTime(stats.avgTimeSpent)}</h3>
        </div>
        <div className="stats-card">
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Emails Collected</p>
          <h3>{stats.uniqueEmails}</h3>
        </div>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginTop: '1.5rem' }}>
        <div className="stats-card" style={{ padding: '1.5rem' }}>
          <p style={{ color: '#888', margin: 0 }}>Blogs Written</p>
          <h3 style={{ fontSize: '2rem' }}>{stats.postCount}</h3>
        </div>
        <div className="stats-card" style={{ padding: '1.5rem' }}>
          <p style={{ color: '#888', margin: 0 }}>Active Categories</p>
          <h3 style={{ fontSize: '2rem' }}>{stats.categoryCount}</h3>
        </div>
        <div className="stats-card" style={{ padding: '1.5rem' }}>
          <p style={{ color: '#888', margin: 0 }}>Platform Status</p>
          <h3 style={{ fontSize: '2rem', color: '#10b981' }}>Live</h3>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="section" style={{ padding: '3rem 0' }}>
        <h2 className="mb-4">Recent Visitor Activity</h2>
        <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
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
                      <span style={{ fontWeight: '600' }}>{act.email || "Anonymous"}</span>
                      <br />
                      <span style={{ fontSize: '0.7rem', color: '#888' }}>{act.visitorId.substring(0, 12)}...</span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--primary-color)', fontSize: '0.9rem' }}>
                      {act.path || '/'}
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
  );
}
