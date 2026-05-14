import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Topics | BlogFusion',
  description: 'View tips, tutorials and how-to guides by topic on BlogFusion.',
};

export default async function CategoryIndexPage() {
  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }

  return (
    <div className="category-page">
      <div className="container">
        <header className="category-header fade-in">
          <h1>Explore Topics</h1>
          <p>View tips, tutorials and how-to guides by topic</p>
        </header>

        {categories.length > 0 ? (
          <div className="topic-grid fade-in" style={{ animationDelay: '0.2s' }}>
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/category/${category.slug}`} 
                className="topic-tag"
                id={`category-${category.slug}`}
              >
                #{category.slug}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center fade-in" style={{ padding: '4rem', background: 'white', borderRadius: '12px', border: '1px dashed #ddd' }}>
            <p style={{ color: '#888' }}>No topics found yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
