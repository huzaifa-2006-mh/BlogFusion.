import { getPageSeo } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo('/terms-and-conditions', {
    title: 'Terms & Conditions - Blog Fusion',
    description: 'Terms and Conditions of using Blog Fusion.',
  });
}

export default function TermsAndConditions() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="mb-4">📜 Terms and Conditions</h1>
        <p>Welcome to <strong>BlogFusion</strong>. These terms and conditions outline the rules and regulations for the use of our website.</p>
        
        <h2 className="mt-4">1. Acceptance of Terms</h2>
        <p>By accessing this website, we assume you accept these terms and conditions. Do not continue to use BlogFusion if you do not agree to take all of the terms and conditions stated on this page.</p>

        <h2 className="mt-4">2. Intellectual Property Rights</h2>
        <p>Other than the content you own, under these terms, BlogFusion and/or its licensors own all the intellectual property rights and materials contained in this website. You are granted limited license only for purposes of viewing the material contained on this website.</p>

        <h2 className="mt-4">3. Restrictions</h2>
        <p>You are specifically restricted from all of the following:</p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1.5rem' }}>
          <li>Publishing any website material in any other media without credit</li>
          <li>Selling, sublicensing and/or otherwise commercializing any website material</li>
          <li>Publicly performing and/or showing any website material</li>
          <li>Using this website in any way that is or may be damaging to this website</li>
          <li>Using this website contrary to applicable laws and regulations</li>
        </ul>

        <h2 className="mt-4">4. Your Content</h2>
        <p>In these Website Standard Terms and Conditions, &quot;Your Content&quot; shall mean any audio, video text, images or other material you choose to display on this website. By displaying Your Content, you grant BlogFusion a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>

        <h2 className="mt-4">5. Disclaimer</h2>
        <p>This website is provided &quot;as is,&quot; with all faults, and BlogFusion expresses no representations or warranties, of any kind related to this website or the materials contained on this website.</p>

        <h2 className="mt-4">6. Changes to Terms</h2>
        <p>BlogFusion is permitted to revise these terms at any time as it sees fit, and by using this website you are expected to review these terms on a regular basis.</p>
      </div>
    </section>
  );
}
