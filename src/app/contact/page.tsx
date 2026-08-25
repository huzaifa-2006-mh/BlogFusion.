import { getPageSeo } from '@/lib/seo';
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo('/contact', {
    title: 'Contact Us | Blog Fusion',
    description: 'Get in touch with the Blog Fusion editorial team for inquiries, feedback, or collaborations.',
  });
}

export default function Contact() {
  return (
    <div style={{ background: '#FFFFFF', color: '#222222', minHeight: '85vh' }}>
      {/* Header Banner */}
      <section
        style={{
          background: '#F5EDE4',
          borderBottom: '1px solid #E8DFD8',
          padding: '4.5rem 0 3.5rem 0',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '750px' }}>
          <div className="vip-badge" style={{ marginBottom: '1rem' }}>
            <span>Get in Touch</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
              fontWeight: '900',
              color: '#3E2618',
              letterSpacing: '-0.03em',
              marginBottom: '0.8rem',
              fontFamily: 'var(--font-outfit, sans-serif)',
            }}
          >
            Contact the Desk
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666666', margin: 0, lineHeight: '1.6' }}>
            Have a question, feedback on a publication, or a business proposal? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section style={{ padding: '5rem 0 6rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Direct Info Card */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E8DFD8',
                borderRadius: '20px',
                padding: '2.5rem',
                boxShadow: '0 4px 20px rgba(62, 38, 24, 0.04)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.4rem',
                  fontWeight: '850',
                  color: '#3E2618',
                  marginBottom: '1rem',
                  fontFamily: 'var(--font-outfit, sans-serif)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>📬</span> Direct Inquiries
              </h3>
              <p style={{ fontSize: '0.98rem', color: '#666666', lineHeight: '1.7', marginBottom: '2rem' }}>
                We review every reader submission, technical suggestion, and partnership request. Our team typically responds within 24 to 48 business hours.
              </p>

              <div
                style={{
                  background: '#F5EDE4',
                  borderRadius: '12px',
                  padding: '1.4rem',
                  marginBottom: '2rem',
                  border: '1px solid #E2D7CE',
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B4226', marginBottom: '0.75rem' }}>
                  Official Email Desks
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <a
                    href="mailto:huzaifamm70@gmail.com"
                    style={{ fontWeight: '700', color: '#3E2618', fontSize: '0.95rem', textDecoration: 'none' }}
                  >
                    ✉️ huzaifamm70@gmail.com
                  </a>
                  <a
                    href="mailto:mwaseem0488@gmail.com"
                    style={{ fontWeight: '700', color: '#3E2618', fontSize: '0.95rem', textDecoration: 'none' }}
                  >
                    ✉️ mwaseem0488@gmail.com
                  </a>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#3E2618', marginBottom: '0.8rem' }}>
                  What you can reach us for:
                </h4>
                <ul style={{ paddingLeft: '1.2rem', color: '#666666', fontSize: '0.92rem', lineHeight: '1.8' }}>
                  <li>Editorial corrections and fact-checking feedback</li>
                  <li>Guest writing and research collaboration</li>
                  <li>Technical questions regarding published guides</li>
                  <li>General readership suggestions</li>
                </ul>
              </div>
            </div>

            {/* Right Column: Contact Form Box */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E8DFD8',
                borderRadius: '20px',
                padding: '2.5rem',
                boxShadow: '0 4px 20px rgba(62, 38, 24, 0.04)',
              }}
            >
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
