'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

interface FAQ {
  question: string;
  answer: string;
}

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeywords, setFocusKeywords] = useState('');
  const [showOnHome, setShowOnHome] = useState(true);
  const [shortDescription, setShortDescription] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, postRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/posts/${id}`)
        ]);
        
        const catData = await catRes.json();
        const postData = await postRes.json();
        
        if (postData) {
          setCategories(catData);
          setTitle(postData.title || '');
          setCategoryId(postData.categoryId || '');
          setMetaTitle(postData.metaTitle || '');
          setMetaDescription(postData.metaDescription || '');
          setFocusKeywords(postData.focusKeywords || '');
          setShowOnHome(postData.showOnHome ?? true);
          setShortDescription(postData.shortDescription || '');
          setFaqs(postData.faqs || []);
          
          let rawContent = postData.content || '';
          const fontSettingsMatch = rawContent.match(/<post-settings size="(.*?)" family="(.*?)" \/>/);
          if (fontSettingsMatch) {
            setFontSize(fontSettingsMatch[1]);
            setFontFamily(fontSettingsMatch[2]);
            rawContent = rawContent.replace(/<post-settings .*? \/>\n?/, '');
          }
          setContent(rawContent);
          
          if (postData.images) setPreviews(postData.images);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => setPreviews(prev => [...prev, event.target?.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles([]); 
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
    setIsUpdating(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('categoryId', categoryId);
      formData.append('metaTitle', metaTitle);
      formData.append('metaDescription', metaDescription);
      formData.append('focusKeywords', focusKeywords);
      formData.append('showOnHome', String(showOnHome));
      formData.append('shortDescription', shortDescription);
      formData.append('faqs', JSON.stringify(faqs));
      
      const contentWithSettings = `<post-settings size="${fontSize}" family="${fontFamily}" />\n` + content;
      formData.append('content', contentWithSettings);
      imageFiles.forEach(file => formData.append('images', file));

      const response = await fetch(`/api/posts/${id}`, { method: 'PATCH', body: formData });

      if (response.ok) {
        alert('Blog updated successfully!');
        router.push('/dashboard/posts');
      } else {
        alert('Failed to update blog.');
      }
    } catch (error) {
      alert('An error occurred while updating.');
    } finally {
      setIsUpdating(false);
    }
  };

  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [textColor, setTextColor] = useState('#000000');

  const insertTag = (tagType: string) => {
    const textarea = document.getElementById('blog-content-area') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    let replacement = '';
    if (tagType === 'bold') replacement = `<b>${selectedText || 'bold text'}</b>`;
    else if (tagType === 'link') {
      const url = prompt('Enter the URL:', 'https://');
      if (url) replacement = `<back href="${url}">${selectedText || 'link text'}</back>`;
    } else if (tagType === 'color') replacement = `<color val="${textColor}">${selectedText || 'colored text'}</color>`;
    else if (tagType === 'underline') replacement = `<u>${selectedText || 'underlined text'}</u>`;

    if (replacement) {
      const newContent = text.substring(0, start) + replacement + text.substring(end);
      setContent(newContent);
    }
  };

  if (isLoading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading post data...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Edit Blog</h1>
        <button onClick={() => router.back()} className="btn btn-outline">Back</button>
      </div>
      
      <form onSubmit={handleSubmit} className="contact-form" style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>
        <div className="form-group">
          <label>Blog Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Short Description (Sub-title)</label>
          <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="A brief catchphrase for the home page..." />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={showOnHome} onChange={(e) => setShowOnHome(e.target.checked)} style={{ width: 'auto' }} />
            Show on Home Page
          </label>
        </div>

        <div className="form-group">
          <label>Content</label>
          <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', background: '#f1f1f1', borderRadius: '4px 4px 0 0' }}>
            <button type="button" onClick={() => insertTag('bold')}>B</button>
            <button type="button" onClick={() => insertTag('underline')}>U</button>
            <button type="button" onClick={() => insertTag('link')}>🔗 Link</button>
          </div>
          <textarea id="blog-content-area" value={content} onChange={(e) => setContent(e.target.value)} style={{ minHeight: '400px', fontSize, fontFamily }} required></textarea>
        </div>

        {/* FAQ Section */}
        <div className="form-group" style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
          <h3 style={{ marginBottom: '1rem' }}>FAQs</h3>
          {faqs.map((faq, index) => (
            <div key={index} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #f1f1f1', borderRadius: '8px' }}>
                <input type="text" placeholder="Question" value={faq.question} onChange={(e) => updateFAQ(index, 'question', e.target.value)} />
                <textarea placeholder="Answer" value={faq.answer} onChange={(e) => updateFAQ(index, 'answer', e.target.value)} style={{ minHeight: '80px', marginTop: '0.5rem' }}></textarea>
                <button type="button" onClick={() => removeFAQ(index)} style={{ color: 'red', marginTop: '0.5rem' }}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addFAQ} className="btn btn-outline" style={{ fontSize: '0.9rem' }}>+ Add FAQ</button>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
}
