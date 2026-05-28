import { getPageSeo } from '@/lib/seo';
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo('/contact', {
    title: 'Contact Us - Blog Fusion',
    description: 'Get in touch with Blog Fusion for business inquiries, feedback, or collaborations.',
  });
}

export default function Contact() {
  return (
    <div>
      <section className="about-hero" style={{ backgroundColor: '#0a192f', padding: '6rem 0' }}>
        <div className="container">
          <h1>Contact Us</h1>
          <p>We'd Love to Hear From You</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-container">
            <div className="contact-info">
              <h3>📩 Professional Contact</h3>
              <p>
                If you have any questions, suggestions, or business inquiries, feel free to contact us. We are always happy to hear from our visitors and aim to respond as quickly as possible.
              </p>
              
              <div className="mt-4">
                <p><strong>📧 Email:</strong> huzaifamm70@gmail.com</p>
                <p style={{ marginTop: '0.5rem' }}><strong>📧 Email:</strong> mwaseem0488@gmail.com</p>
              </div>

              <div className="mt-4">
                <h4>You can also reach out to us for:</h4>
                <ul style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
                  <li style={{ marginBottom: '0.5rem' }}>Collaboration opportunities</li>
                  <li style={{ marginBottom: '0.5rem' }}>Guest posting</li>
                  <li style={{ marginBottom: '0.5rem' }}>Feedback and improvements</li>
                </ul>
              </div>
            </div>

            <div className="contact-form">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
