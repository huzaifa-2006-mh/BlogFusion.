import prisma from '@/lib/prisma';

export default async function DashboardHome() {
  let postCount = 0;
  let categoryCount = 0;

  try {
    postCount = await prisma.post.count();
    categoryCount = await prisma.category.count();
  } catch (error) {
    console.error(error);
  }

  return (
    <div>
      <h1 className="mb-4">Welcome Back, Chief!</h1>
      <p className="mb-4">Here's what's happening with your blogs today.</p>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stats-card">
          <p style={{ color: '#888' }}>Total Blogs Written</p>
          <h3>{postCount}</h3>
        </div>
        <div className="stats-card">
          <p style={{ color: '#888' }}>Categories Created</p>
          <h3>{categoryCount}</h3>
        </div>
        <div className="stats-card">
          <p style={{ color: '#888' }}>Platform Status</p>
          <h3 style={{ fontSize: '1.5rem' }}>Active</h3>
        </div>
      </div>

      <div className="section" style={{ padding: '2rem 0' }}>
        <h2 className="mb-4">Quick Guide</h2>
        <div className="card" style={{ padding: '1.5rem' }}>
          <p>1. Start by adding <strong>Categories</strong> from the sidebar.</p>
          <hr style={{ margin: '1rem 0', opacity: '0.1' }} />
          <p>2. Use <strong>Write Blog</strong> to create your first masterpiece.</p>
          <hr style={{ margin: '1rem 0', opacity: '0.1' }} />
          <p>3. Your blogs will automatically appear on the <strong>Homepage</strong> and in their respective categories.</p>
        </div>
      </div>
    </div>
  );
}
