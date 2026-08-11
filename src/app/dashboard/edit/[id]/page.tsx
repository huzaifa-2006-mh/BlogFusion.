'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

import RichTextEditor from '@/components/RichTextEditor';

interface FAQ {
  question: string;
  answer: string;
}

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageAlts, setImageAlts] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showOnHome, setShowOnHome] = useState(true);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeywords, setFocusKeywords] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [isIndexable, setIsIndexable] = useState(true);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, postRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/posts/${id}`),
        ]);

        const catData = await catRes.json();
        const postData = await postRes.json();

        if (postData) {
          setCategories(catData);
          setTitle(postData.title || '');
          setCategoryId(postData.categoryId || '');
          setShowOnHome(postData.showOnHome ?? true);
          setShortDescription(postData.shortDescription || '');
          setFaqs(postData.faqs || []);
          setMetaTitle(postData.metaTitle || '');
          setMetaDescription(postData.metaDescription || '');
          setFocusKeywords(postData.focusKeywords || '');
          setOgImage(postData.ogImage || '');
          setCanonicalUrl(postData.canonicalUrl || '');
          setIsIndexable(postData.isIndexable ?? true);
          setContent(postData.content || '');

          if (postData.images) {
            setPreviews(postData.images);
            setImageAlts(postData.images.map(() => ''));
          }
        }
      } catch (error) {
        console.error('Error loading post data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...files]);
      setImageAlts((prev) => [
        ...prev,
        ...files.map((file) => file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')),
      ]);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => setPreviews((prev) => [...prev, event.target?.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setImageAlts((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateImageAlt = (index: number, value: string) => {
    setImageAlts((prev) => prev.map((alt, i) => (i === index ? value : alt)));
  };

  const addFAQ = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const removeFAQ = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));
  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !content.replace(/<[^>]*>/g, '').trim()) {
      alert('Please write some content for the blog post.');
      return;
    }

    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('shortDescription', shortDescription);
      formData.append('categoryId', categoryId);
      formData.append('showOnHome', String(showOnHome));
      formData.append('faqs', JSON.stringify(faqs));
      formData.append('content', content);
      formData.append('metaTitle', metaTitle);
      formData.append('metaDescription', metaDescription);
      formData.append('focusKeywords', focusKeywords);
      formData.append('ogImage', ogImage);
      formData.append('canonicalUrl', canonicalUrl);
      formData.append('isIndexable', String(isIndexable));
      formData.append('imageAlts', JSON.stringify(imageAlts));
      imageFiles.forEach((file) => formData.append('images', file));

      const response = await fetch(`/api/posts/${id}`, { method: 'PATCH', body: formData });

      if (response.ok) {
        alert('Blog updated successfully!');
        router.push('/dashboard/posts');
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.error || 'Failed to update blog.');
      }
    } catch (error) {
      alert('An error occurred while updating.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
        <h2>Loading blog post...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem 0' }}>
      {/* Top Banner Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              color: '#0f172a',
              letterSpacing: '-0.03em',
              marginBottom: '0.5rem',
            }}
          >
            Edit Blog Post
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>
            Update your article using the MS Word Rich Text Editor.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: 'white',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '0.9rem',
            color: '#334155',
          }}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
        <div className="responsive-editor-grid">
          {/* Left Column: Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Core Blog Editor Card */}
            <div className="dashboard-card" style={{ padding: '2.5rem' }}>
              <div style={{ marginBottom: '1.8rem' }}>
                <label style={labelStyle}>Blog Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Mastering the Art of Tech Guides..."
                  style={{
                    width: '100%',
                    padding: '1rem 1.2rem',
                    fontSize: '1.35rem',
                    fontWeight: '700',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.8rem' }}>
                <label style={labelStyle}>Short Description</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="A catchy, brief sub-title..."
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Content (MS Word Editor)</label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write or edit your blog post..."
                />
              </div>
            </div>

            {/* SEO Settings Card */}
            <div className="dashboard-card" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.4rem' }}>
                🔍 SEO & Social Metadata
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.8rem' }}>
                Customize meta tags, focus keywords, social preview images, and canonical URLs for maximum search visibility.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={labelStyle}>Meta Title</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Custom Title | Blog Fusion"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Focus Keywords</label>
                  <input
                    type="text"
                    value={focusKeywords}
                    onChange={(e) => setFocusKeywords(e.target.value)}
                    placeholder="react, nextjs, web development"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Meta Description</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Comprehensive description for search engine results..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={labelStyle}>Open Graph (OG) Image URL</label>
                  <input
                    type="text"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="https://example.com/og-image.jpg"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Canonical URL</label>
                  <input
                    type="text"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://example.com/blog/my-post"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <input
                  type="checkbox"
                  id="indexable"
                  checked={isIndexable}
                  onChange={(e) => setIsIndexable(e.target.checked)}
                />
                <label htmlFor="indexable" style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155' }}>
                  Allow Search Engines to Index this Post (Robots: index, follow)
                </label>
              </div>
            </div>

            {/* FAQs Card */}
            <div className="dashboard-card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    ❓ Frequently Asked Questions (FAQs)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={addFAQ}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #0f172a',
                    background: '#0f172a',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  + Add FAQ
                </button>
              </div>

              {faqs.map((faq, index) => (
                <div key={index} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#475569' }}>FAQ #{index + 1}</span>
                    <button type="button" onClick={() => removeFAQ(index)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                    style={{ ...inputStyle, marginBottom: '0.6rem' }}
                  />
                  <textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="dashboard-card" style={{ padding: '1.8rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.2rem' }}>
                Update Controls
              </h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  required
                >
                  <option value="">Select Category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <input
                  type="checkbox"
                  id="showOnHome"
                  checked={showOnHome}
                  onChange={(e) => setShowOnHome(e.target.checked)}
                />
                <label htmlFor="showOnHome" style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155' }}>
                  Show on Homepage
                </label>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: '8px',
                  background: '#0f172a',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '1rem',
                  border: 'none',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                }}
              >
                {isUpdating ? 'Updating...' : '💾 Save Changes'}
              </button>
            </div>


          </div>
        </div>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontWeight: '800',
  fontSize: '0.75rem',
  color: '#475569',
  textTransform: 'uppercase',
  marginBottom: '0.4rem',
  display: 'block',
  letterSpacing: '0.04em',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  fontSize: '0.9rem',
  outline: 'none',
  background: '#f8fafc',
};
