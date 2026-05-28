import type { Metadata } from 'next';
import { getPageSeo } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeo('/faqs', {
    title: 'Frequently Asked Questions (FAQs) - Blog Fusion',
    description:
      'Find answers about Blog Fusion content, tutorials, updates, contact options, and sharing policy.',
  });
}

const faqs = [
  {
    question: 'What is Blog Fusion?',
    answer:
      'Blog Fusion is a tech blog website where you can learn about the latest technology trends, programming tutorials, AI tools, web development guides, SEO tips, and software-related articles.',
  },
  {
    question: 'What type of content do you publish?',
    answer:
      'We mainly publish technology-related content including web development (HTML, CSS, JavaScript, React), programming tutorials (Python, C#, Java), AI tools and updates, SEO and blogging tips, and software guides and reviews.',
  },
  {
    question: 'Is the content on Blog Fusion free?',
    answer:
      'Yes, all the content on our website is completely free to read. You can learn and explore without any cost.',
  },
  {
    question: 'Is this website suitable for beginners?',
    answer:
      'Absolutely. Our tutorials are designed especially for beginners so anyone can easily learn coding and modern tech skills step by step.',
  },
  {
    question: 'How often is your content updated?',
    answer:
      'We regularly update our content to keep it fresh and relevant, especially for AI tools, SEO updates, and new programming technologies.',
  },
  {
    question: 'Do you offer courses or freelance services?',
    answer:
      'Currently, we only provide blog articles. However, we are planning to launch courses and services in the future.',
  },
  {
    question: 'How can I contact you?',
    answer:
      'You can contact us through our contact page or email. We try our best to respond as quickly as possible.',
  },
  {
    question: 'Can I share your content?',
    answer:
      'Yes, you are welcome to share our articles on social media platforms like Facebook, LinkedIn, and WhatsApp.',
  },
];

export default function FaqsPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 className="mb-4">Frequently Asked Questions (FAQs)</h1>
        <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
          Quick answers about Blog Fusion, our content, and how you can use the platform.
        </p>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {faqs.map((faq, index) => (
            <article
              key={faq.question}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1rem 1.2rem',
              }}
            >
              <h2 style={{ fontSize: '1.05rem', marginBottom: '0.45rem', color: '#0f172a' }}>
                {index + 1}. {faq.question}
              </h2>
              <p style={{ margin: 0, lineHeight: 1.65, color: '#475569' }}>{faq.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
