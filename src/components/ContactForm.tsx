'use client';

import { useState, FormEvent } from 'react';

const SAVEFORM_ENDPOINT =
  'https://www.saveform.io/api/submit/9141e226-7fd0-455a-86b0-96d2f227c8f6';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(SAVEFORM_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Unable to send your message. Please try again.');
      }

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again or email us directly.');
    }
  };

  return (
    <div>
      <h3
        style={{
          fontSize: '1.4rem',
          fontWeight: '850',
          color: '#3E2618',
          marginBottom: '0.4rem',
          fontFamily: 'var(--font-outfit, sans-serif)',
        }}
      >
        Send a Message
      </h3>
      <p style={{ fontSize: '0.92rem', color: '#666666', marginBottom: '1.8rem' }}>
        Fill in the details below and we will get back to your inquiry promptly.
      </p>

      {status === 'success' && (
        <div
          role="status"
          style={{
            padding: '1rem 1.2rem',
            marginBottom: '1.5rem',
            borderRadius: '10px',
            background: '#F5EDE4',
            border: '1px solid #6B4226',
            color: '#3E2618',
            fontWeight: 700,
            fontSize: '0.92rem',
          }}
        >
          ✓ Thank you! Your message was sent successfully. We will get back to you soon.
        </div>
      )}

      {status === 'error' && (
        <div
          role="alert"
          style={{
            padding: '1rem 1.2rem',
            marginBottom: '1.5rem',
            borderRadius: '10px',
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            fontWeight: 700,
            fontSize: '0.92rem',
          }}
        >
          ✕ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Honeypot */}
        <input
          type="text"
          name="_honey"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
        />

        <div>
          <label style={labelStyle} htmlFor="name">
            Your Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Jane Doe"
            required
            disabled={status === 'loading'}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="email">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="jane@example.com"
            required
            disabled={status === 'loading'}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="subject">
            Inquiry Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Editorial Question / Partnership Inquiry"
            required
            disabled={status === 'loading'}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="message">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Share your thoughts, feedback, or proposal..."
            rows={4}
            required
            disabled={status === 'loading'}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="vip-btn-primary"
          style={{
            width: '100%',
            padding: '0.95rem',
            fontSize: '1rem',
            justifyContent: 'center',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          }}
        >
          {status === 'loading' ? 'Sending Message...' : 'Send Message ✉️'}
        </button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: '800',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: '#3E2618',
  marginBottom: '0.4rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.85rem 1rem',
  border: '1px solid #E8DFD8',
  borderRadius: '10px',
  fontSize: '16px',
  color: '#222222',
  background: '#FAFAFA',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
};
