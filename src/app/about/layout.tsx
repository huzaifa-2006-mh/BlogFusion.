import { getPageSeo } from '@/lib/seo';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo('/about', {
    title: 'About Us - Blog Fusion',
    description: 'Learn more about Blog Fusion, our mission, and our team.',
  });
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
