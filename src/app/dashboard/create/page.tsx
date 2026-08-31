'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import RichTextEditor from '@/components/RichTextEditor';
import SeoCheckCard from '@/components/SeoCheckCard';
import { defaultPostCanonical, normalizeCanonicalUrl, slugify, toBlogSlugInput } from '@/lib/blogUrl';

interface FAQ {
  question: string;
  answer: string;
}

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [shortDescription, setShortDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageAlts, setImageAlts] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnHome, setShowOnHome] = useState(true);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeywords, setFocusKeywords] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [canonicalTouched, setCanonicalTouched] = useState(false);
  const [isIndexable, setIsIndexable] = useState(true);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isCustomSlug) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setIsCustomSlug(true);
    setSlug(toBlogSlugInput(val));
  };

  const resetSlugFromTitle = () => {
    setIsCustomSlug(false);
    setSlug(slugify(title));
  };

  useEffect(() => {
    fetch('/api/categories')
      .then(async (res) => {
        if (!res.ok) return [];
        const text = await res.text();
        if (!text) return [];
        try {
          const parsed = JSON.parse(text);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!canonicalTouched && slug) {
      setCanonicalUrl(defaultPostCanonical(slugify(slug)));
    }
  }, [slug, canonicalTouched]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setCoverPreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverImageUrl('');
    setCoverPreview(null);
  };

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
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImageAlts((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
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

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slugify(slug));
      formData.append('shortDescription', shortDescription);
      formData.append('categoryId', categoryId);
      formData.append('showOnHome', String(showOnHome));
      formData.append('faqs', JSON.stringify(faqs));
      formData.append('content', content);
      formData.append('metaTitle', metaTitle);
      formData.append('metaDescription', metaDescription);
      formData.append('focusKeywords', focusKeywords);
      formData.append('ogImage', ogImage || coverImageUrl || '');
      formData.append('canonicalUrl', normalizeCanonicalUrl(canonicalUrl, defaultPostCanonical(slugify(slug))));
      formData.append('isIndexable', String(isIndexable));
      formData.append('imageAlts', JSON.stringify(imageAlts));
      
      if (coverImageFile) {
        formData.append('coverImageFile', coverImageFile);
      }
      if (coverImageUrl) {
        formData.append('coverImageUrl', coverImageUrl);
      }

      imageFiles.forEach((file) => formData.append('images', file));

      const response = await fetch('/api/posts', { method: 'POST', body: formData });

      if (response.ok) {
        alert('Blog published successfully!');
        router.push('/dashboard/posts');
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.error || 'Failed to publish blog.');
      }
    } catch (error) {
      alert('An error occurred while publishing.');
    } finally {
      setIsLoading(false);
    }
  };

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
            Create New Blog
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>
            Draft, polish, and publish a premium tech post using the MS Word Rich Text Editor.
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
            transition: 'all 0.2s',
          }}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
        <div className="responsive-editor-grid">
          {/* Main Content Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Core Blog Editor Card */}
            <div className="dashboard-card" style={{ padding: '2.5rem' }}>
              <div style={{ marginBottom: '1.8rem' }}>
                <label
                  style={{
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    color: '#475569',
                    textTransform: 'uppercase',
                    marginBottom: '0.6rem',
                    display: 'block',
                    letterSpacing: '0.05em',
                  }}
                >
                  Blog Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
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
                    transition: 'all 0.2s',
                  }}
                  required
                />
              </div>

              {/* Custom Blog URL / Slug Section */}
              <div style={{ marginBottom: '1.8rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label
                    style={{
                      fontWeight: '800',
                      fontSize: '0.78rem',
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <span>🔗 Custom Blog URL</span>
                    {isCustomSlug && (
                      <span style={{ fontSize: '0.7rem', color: '#16a34a', background: '#dcfce7', padding: '1px 6px', borderRadius: '4px' }}>
                        Customized
                      </span>
                    )}
                  </label>
                  {isCustomSlug && (
                    <button
                      type="button"
                      onClick={resetSlugFromTitle}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#6B4226',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      ↺ Reset from Title
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                  <span style={{ padding: '0.65rem 0.85rem', background: '#f1f5f9', color: '#64748b', fontSize: '0.85rem', fontWeight: '600', borderRight: '1px solid #cbd5e1', userSelect: 'none' }}>
                    /blog/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="my-custom-url or paste a full link"
                    style={{
                      flex: 1,
                      padding: '0.65rem 0.85rem',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.92rem',
                      fontWeight: '600',
                      color: '#0f172a',
                    }}
                  />
                </div>
                <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                  Type a custom slug or paste a full URL. Live URL:{' '}
                  <strong style={{ color: '#0f172a' }}>{defaultPostCanonical(slugify(slug) || 'your-slug')}</strong>
                </p>
              </div>

              <div style={{ marginBottom: '1.8rem' }}>
                <label
                  style={{
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    color: '#475569',
                    textTransform: 'uppercase',
                    marginBottom: '0.6rem',
                    display: 'block',
                    letterSpacing: '0.05em',
                  }}
                >
                  Short Description
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="A catchy, brief sub-title to hook readers..."
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '0.95rem',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    color: '#475569',
                    textTransform: 'uppercase',
                    marginBottom: '0.6rem',
                    display: 'block',
                    letterSpacing: '0.05em',
                  }}
                >
                  Content (MS Word Editor)
                </label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your blog post here... Use the toolbar above to style headings, bold text, insert images, links, tables, and colors like MS Word."
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
                    onChange={(e) => {
                      setCanonicalTouched(true);
                      setCanonicalUrl(e.target.value);
                    }}
                    placeholder="https://blog-fusion-beta.vercel.app/blog/my-post"
                    style={inputStyle}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '0.35rem' }}>
                    Will be saved as: {normalizeCanonicalUrl(canonicalUrl, defaultPostCanonical(slugify(slug) || 'your-slug'))}
                  </span>
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

            {/* FAQs Accordion Builder Card */}
            <div className="dashboard-card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    ❓ Frequently Asked Questions (FAQs)
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.3rem 0 0 0' }}>
                    Add structured Q&A for rich FAQ snippets on Google.
                  </p>
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
            {/* Featured Image (Cover Image) Card */}
            <div className="dashboard-card" style={{ padding: '1.8rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🖼️</span> Featured Image (Cover)
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.2rem' }}>
                This image is shown at the top of the published post (above the title), not at the bottom of the article.
              </p>

              {coverPreview || coverImageUrl ? (
                <div style={{ marginBottom: '1.2rem', position: 'relative' }}>
                  <div
                    style={{
                      width: '100%',
                      height: '160px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: '1px solid #cbd5e1',
                      background: '#f1f5f9',
                    }}
                  >
                    <img
                      src={coverPreview || coverImageUrl}
                      alt="Featured Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeCoverImage}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    }}
                    title="Remove Image"
                  >
                    ✕
                  </button>
                </div>
              ) : null}

              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Upload Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px dashed #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    background: '#f8fafc',
                    cursor: 'pointer',
                  }}
                />
              </div>

              <div>
                <label style={labelStyle}>Or Enter Direct Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <SeoCheckCard
              title={title}
              slug={slug}
              metaTitle={metaTitle}
              metaDescription={metaDescription}
              focusKeywords={focusKeywords}
              canonicalUrl={canonicalUrl}
              coverImage={coverPreview || coverImageUrl}
            />

            {/* Save & Publish Options */}
            <div className="dashboard-card" style={{ padding: '1.8rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.2rem' }}>
                Publish Controls
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
                  {Array.isArray(categories) && categories.map((cat) => (
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
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: '8px',
                  background: '#6B4226',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '1rem',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(107, 66, 38, 0.25)',
                }}
              >
                {isLoading ? 'Publishing...' : '🚀 Publish Blog Post'}
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

