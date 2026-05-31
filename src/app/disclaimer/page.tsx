import { Metadata } from 'next';
import Link from 'next/link';

import { getPageSeo } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo('/disclaimer', {
    title: 'Disclaimer - Blog Fusion',
    description: 'Disclaimer and limitation of liability for Blog Fusion.',
  });
}

export default function Disclaimer() {
  return (
    <div className="section" style={{ padding: '6rem 0' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--text-primary)' }}>Disclaimer</h1>
        
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <h2 style={{ fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            1. General Information
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            The information provided by Blog Fusion ("we," "us," or "our") on our website (https://blog-fusion-beta.vercel.app/) is for general informational and educational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            2. Professional and Tech Advice
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            The Site may contain tech, programming, online earning, and career-related information. This information is provided for general informational and educational purposes only and is not a substitute for professional advice. Before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of professional technology or financial advice. The use or reliance of any information contained on this site is solely at your own risk.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            3. External Links Disclaimer
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            The Site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.
          </p>
          
          <h2 style={{ fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            4. Earnings and Income Disclaimer
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Blog Fusion may share strategies, tutorials, and information related to online earning, freelancing, and career development. We cannot and do not guarantee your ability to get results or earn any money with our ideas, information, tools, or strategies. Your level of success in attaining the results claimed in our materials depends on several factors, such as your background, dedication, skills, and financial situation.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            5. Reviews and Entertainment
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Our reviews regarding anime, movies, tech products, or other entertainment are solely the subjective opinions of our authors. They are intended for entertainment and informational purposes. Your experience with these products or media may differ.
          </p>

          <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: '0', fontWeight: '500' }}>
              If you have any questions about this Disclaimer, please <Link href="/contact" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>contact us</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
