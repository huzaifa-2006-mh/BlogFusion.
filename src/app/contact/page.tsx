import { getPageSeo } from '@/lib/seo';
import type { Metadata } from 'next';

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
              <h3>Send a Message</h3>
              <form>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" placeholder="Your Name" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="Your Email" />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" placeholder="Subject" />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
