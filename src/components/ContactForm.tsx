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
    <>
      <h3>Send a Message</h3>

      {status === 'success' && (
        <p
          role="status"
          style={{
            padding: '0.85rem 1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            background: '#ecfdf5',
            border: '1px solid #86efac',
            color: '#166534',
            fontWeight: 600,
          }}
        >
          Thank you! Your message was sent successfully. We will get back to you soon.
        </p>
      )}

      {status === 'error' && (
        <p
          role="alert"
          style={{
            padding: '0.85rem 1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#991b1b',
            fontWeight: 600,
          }}
        >
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Honeypot — hidden from users, catches bots */}
        <input
          type="text"
          name="_honey"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
        />

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            required
            disabled={status === 'loading'}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email"
            required
            disabled={status === 'loading'}
          />
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Subject"
            required
            disabled={status === 'loading'}
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            placeholder="How can we help you?"
            required
            disabled={status === 'loading'}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </>
  );
}
