import { getPageSeo } from '@/lib/seo';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo('/privacy-policy', {
    title: 'Privacy Policy - Blog Fusion',
    description: 'Privacy Policy for Blog Fusion. Learn how we handle and protect your data.',
  });
}

export default function PrivacyPolicy() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="mb-4">🔒 Privacy Policy</h1>
        <p>At <strong>BlogFusion</strong>, we value the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by BlogFusion and how we use it.</p>
        
        <h2 className="mt-4">Information We Collect</h2>
        <p>We collect basic information such as:</p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1.5rem' }}>
          <li>Name and email (only if provided voluntarily via contact forms or subscriptions)</li>
          <li>Website usage data (via cookies and analytics tools to improve user experience)</li>
        </ul>

        <h2 className="mt-4">How We Use Your Data</h2>
        <p>This data is used to:</p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1.5rem' }}>
          <li>Improve user experience on our platform</li>
          <li>Analyze website traffic and trends</li>
          <li>Provide better, more relevant content</li>
          <li>Communicate with you regarding your inquiries</li>
        </ul>

        <h2 className="mt-4">Data Protection</h2>
        <p>We do not sell, trade, or share your personal information with third parties without your consent. We implement a variety of security measures to maintain the safety of your personal information.</p>

        <h2 className="mt-4">Third-Party Services</h2>
        <p>Third-party services like Google AdSense may use cookies to display ads based on user interests. Users can choose to decline cookies through their individual browser options.</p>

        <h2 className="mt-4">Consent</h2>
        <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
      </div>
    </section>
  );
}
