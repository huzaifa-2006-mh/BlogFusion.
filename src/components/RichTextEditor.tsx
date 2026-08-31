'use client';

import React, { useState, useEffect, useRef } from 'react';

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

// Helper: Convert legacy tags into standard clean HTML for existing posts
export function convertLegacyContentToHtml(raw: string): string {
  if (!raw) return '';

  let html = raw;

  // Convert legacy custom tags if present
  html = html.replace(/<back href="(.*?)">(.*?)<\/back>/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>');
  html = html.replace(/<color val="(.*?)">(.*?)<\/color>/g, '<span style="color: $1;">$2</span>');
  html = html.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
  html = html.replace(/<no-u>(.*?)<\/no-u>/g, '<span style="text-decoration: none;">$1</span>');
  html = html.replace(/<spacer \/>/g, '<hr style="border: none; border-top: 1px dashed #cbd5e1; margin: 1.5rem 0;" />');

  // If content already contains standard HTML block tags (<p>, <h2>, <div>), return
  if (/<(p|h[1-6]|div|span|strong|em|ul|ol|table|blockquote|figure|img)/i.test(html)) {
    return html;
  }

  // Legacy Markdown-like headings
  html = html.replace(/^###\s+(.*)$/gm, '<h4>$1</h4>');
  html = html.replace(/^##\s+(.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^(?:\*\*|\#)\s+(.*)$/gm, '<h2>$1</h2>');

  // Legacy bold & code
  html = html.replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>');
  html = html.replace(/<code>([\s\S]*?)<\/code>/g, '<pre style="background: #0f172a; color: #f8fafc; padding: 1rem; border-radius: 8px; font-family: monospace;"><code>$1</code></pre>');

  // Wrap plain lines into paragraphs if not already wrapped
  const lines = html.split(/\n\n+/);
  html = lines
    .map((line) => {
      line = line.trim();
      if (!line) return '';
      if (/^<h[1-6]|<pre|<blockquote|<table|<hr/i.test(line)) return line;
      return `<p>${line.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('');

  return html;
}

// Clean HTML to optimize for Semrush SEO
export function cleanHtmlForSeo(html: string): string {
  if (!html) return '';

  let clean = html;

  // Remove empty paragraphs or linebreaks
  clean = clean.replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, '');
  clean = clean.replace(/(<br\s*\/?>\\s*){3,}/gi, '<br/><br/>');

  // Remove empty span tags with no attributes or empty text
  clean = clean.replace(/<span\s*>(.*?)<\/span>/gi, '$1');
  clean = clean.replace(/<span[^>]*>\s*<\/span>/gi, '');

  // Normalize duplicate nested strong/em tags
  clean = clean.replace(/<strong>\s*<strong>/gi, '<strong>');
  clean = clean.replace(/<\/strong>\s*<\/strong>/gi, '</strong>');

  return clean.trim();
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing your blog post...',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Code block modal
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeContent, setCodeContent] = useState('');

  // Statistics
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readTime, setReadTime] = useState(1);

  // Colors
  const [textColor, setTextColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');

  // Sync editor content ONLY on initial mount or when editor is NOT actively focused
  // This prevents cursor resetting / jumping when typing!
  useEffect(() => {
    if (editorRef.current) {
      const isFocused = document.activeElement === editorRef.current;
      const parsedHtml = convertLegacyContentToHtml(value);
      if (!isFocused && editorRef.current.innerHTML !== parsedHtml) {
        editorRef.current.innerHTML = parsedHtml;
        updateStats(parsedHtml);
      }
    }
  }, [value]);

  const updateStats = (htmlContent: string) => {
    const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = text.length;
    const minutes = Math.max(1, Math.ceil(words / 200));

    setWordCount(words);
    setCharCount(chars);
    setReadTime(minutes);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      updateStats(currentHtml);
      onChange(currentHtml);
    }
  };

  const handleBlur = () => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      const cleaned = cleanHtmlForSeo(currentHtml);
      if (cleaned !== currentHtml) {
        editorRef.current.innerHTML = cleaned;
      }
      onChange(cleaned);
    }
  };

  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      handleInput();
    }
  };

  const saveCurrentSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSavedSelection(sel.getRangeAt(0).cloneRange());
    }
  };

  const restoreSelection = () => {
    if (savedSelection) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelection);
      }
    }
  };

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageSizePreset, setImageSizePreset] = useState<'100%' | '75%' | '50%' | '35%' | 'custom'>('100%');
  const [imageCustomWidth, setImageCustomWidth] = useState('450px');
  const [imageAlignment, setImageAlignment] = useState<'center' | 'left' | 'right'>('center');
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');

  // Format Block with cross-browser compatibility
  const handleBlockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tag = e.target.value;
    if (tag) {
      // Focus the editor first if not focused
      if (editorRef.current && document.activeElement !== editorRef.current) {
        editorRef.current.focus();
      }
      try {
        document.execCommand('formatBlock', false, tag);
      } catch (err) {
        // Fallback for some browsers expecting plain tag name
        const plainTag = tag.replace(/[<>]/g, '');
        document.execCommand('formatBlock', false, plainTag);
      }
      handleInput();
      e.target.value = '';
    }
  };

  // Font Family
  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = e.target.value;
    if (font) {
      execCmd('fontName', font);
      e.target.value = '';
    }
  };

  // Font Size
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    if (size) {
      execCmd('fontSize', size);
      e.target.value = '';
    }
  };

  // Text / Background Color
  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setTextColor(color);
    execCmd('foreColor', color);
  };

  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setBgColor(color);
    execCmd('hiliteColor', color);
  };

  // Open Link Modal
  const openLinkModal = () => {
    saveCurrentSelection();
    const sel = window.getSelection();
    const text = sel ? sel.toString() : '';
    setLinkText(text);
    setLinkUrl('');
    setShowLinkModal(true);
  };

  const insertLink = () => {
    if (!linkUrl) return;
    restoreSelection();

    let url = linkUrl.trim();
    if (!/^https?:\/\//i.test(url) && !url.startsWith('/') && !url.startsWith('#')) {
      url = 'https://' + url;
    }

    if (linkText) {
      const target = linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
      const linkHtml = `<a href="${url}"${target}>${linkText}</a>`;
      execCmd('insertHTML', linkHtml);
    } else {
      execCmd('createLink', url);
    }

    setShowLinkModal(false);
  };

  // Upload helper for files
  const uploadFiles = async (files: File[]) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      const urls: string[] = data.urls || (data.url ? [data.url] : []);

      if (urls.length === 1 && showImageModal) {
        setImageUrl(urls[0]);
        if (!imageAlt) {
          setImageAlt(files[0]?.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Blog Image');
        }
      } else {
        const effectiveWidth = imageSizePreset === 'custom' ? (imageCustomWidth || '100%') : imageSizePreset;
        urls.forEach((imgUrl, i) => {
          const alt = files[i]?.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Blog Image';
          const figureHtml = `
            <figure style="margin: 2rem 0; text-align: ${imageAlignment};">
              <img src="${imgUrl}" alt="${alt}" style="width: ${effectiveWidth}; max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); display: inline-block;" loading="lazy" decoding="async" />
              <figcaption style="font-size: 0.85rem; color: #64748b; margin-top: 0.6rem; font-style: italic;">${alt}</figcaption>
            </figure><p></p>
          `;
          execCmd('insertHTML', figureHtml);
        });
      }
    } catch (err) {
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Image File Select
  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadFiles(Array.from(e.target.files));
    }
  };

  // Insert Image with selected size and alignment
  const insertConfiguredImage = () => {
    if (!imageUrl) return;
    restoreSelection();

    const alt = imageAlt.trim() || 'Blog Image';
    const caption = imageCaption.trim();
    const effectiveWidth = imageSizePreset === 'custom' ? (imageCustomWidth || '100%') : imageSizePreset;

    const figureHtml = `
      <figure style="margin: 2rem 0; text-align: ${imageAlignment};">
        <img src="${imageUrl.trim()}" alt="${alt}" style="width: ${effectiveWidth}; max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); display: inline-block;" loading="lazy" decoding="async" />
        ${caption ? `<figcaption style="font-size: 0.85rem; color: #64748b; margin-top: 0.6rem; font-style: italic;">${caption}</figcaption>` : ''}
      </figure><p></p>
    `;

    execCmd('insertHTML', figureHtml);
    setImageUrl('');
    setImageAlt('');
    setImageCaption('');
    setShowImageModal(false);
  };

  // Drag & Drop Image Handler
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const imgFiles = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
      if (imgFiles.length > 0) {
        await uploadFiles(imgFiles);
      }
    }
  };

  // Paste Image Handler
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      const imgFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) imgFiles.push(file);
        }
      }
      if (imgFiles.length > 0) {
        e.preventDefault();
        await uploadFiles(imgFiles);
      }
    }
  };

  // Quick resize selected image in editor
  const handleSelectedImageResize = (sizeVal: string) => {
    if (editorRef.current) {
      const sel = window.getSelection();
      if (sel && sel.anchorNode) {
        let node: HTMLElement | null = (sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode) as HTMLElement;
        while (node && node !== editorRef.current) {
          if (node.tagName === 'IMG') {
            node.style.width = sizeVal;
            handleInput();
            return;
          }
          if (node.tagName === 'FIGURE') {
            const img = node.querySelector('img');
            if (img) {
              img.style.width = sizeVal;
              handleInput();
              return;
            }
          }
          node = node.parentElement;
        }
      }
    }
  };

  // Insert Table
  const insertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.95rem;">
        <thead>
          <tr style="background: #f1f5f9; text-align: left;">
            <th style="border: 1px solid #cbd5e1; padding: 0.75rem; font-weight: 700;">Header 1</th>
            <th style="border: 1px solid #cbd5e1; padding: 0.75rem; font-weight: 700;">Header 2</th>
            <th style="border: 1px solid #cbd5e1; padding: 0.75rem; font-weight: 700;">Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 0.75rem;">Row 1, Cell 1</td>
            <td style="border: 1px solid #cbd5e1; padding: 0.75rem;">Row 1, Cell 2</td>
            <td style="border: 1px solid #cbd5e1; padding: 0.75rem;">Row 1, Cell 3</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 0.75rem;">Row 2, Cell 1</td>
            <td style="border: 1px solid #cbd5e1; padding: 0.75rem;">Row 2, Cell 2</td>
            <td style="border: 1px solid #cbd5e1; padding: 0.75rem;">Row 2, Cell 3</td>
          </tr>
        </tbody>
      </table><p></p>
    `;
    execCmd('insertHTML', tableHtml);
  };

  return (
    <div
      style={{
        border: '1px solid #cbd5e1',
        borderRadius: '12px',
        background: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        position: isFullScreen ? 'fixed' : 'relative',
        top: isFullScreen ? 0 : undefined,
        left: isFullScreen ? 0 : undefined,
        right: isFullScreen ? 0 : undefined,
        bottom: isFullScreen ? 0 : undefined,
        zIndex: isFullScreen ? 9999 : undefined,
        display: 'flex',
        flexDirection: 'column',
        height: isFullScreen ? '100vh' : 'auto',
      }}
    >
      {/* Hidden File Input for Direct Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileSelect}
        accept="image/*,.png,.jpg,.jpeg,.webp,.gif,.svg,.avif,.bmp"
        multiple
        style={{ display: 'none' }}
      />

      {/* Ribbon Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.35rem',
          alignItems: 'center',
          padding: '0.65rem 0.85rem',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          userSelect: 'none',
        }}
      >
        {/* Undo / Redo */}
        <div style={groupStyle}>
          <button type="button" onClick={() => execCmd('undo')} title="Undo (Ctrl+Z)" style={btnStyle}>
            ↩
          </button>
          <button type="button" onClick={() => execCmd('redo')} title="Redo (Ctrl+Y)" style={btnStyle}>
            ↪
          </button>
        </div>

        {/* Headings / Format */}
        <div style={groupStyle}>
          <select onChange={handleBlockChange} style={{ ...selectStyle, fontWeight: '700', color: '#0f172a' }} defaultValue="">
            <option value="" disabled>
              Heading / Style
            </option>
            <option value="<h1>">👑 Heading 1 (H1 - Main)</option>
            <option value="<h2>">📌 Heading 2 (H2 - Major)</option>
            <option value="<h3>">🔹 Heading 3 (H3 - Sub)</option>
            <option value="<h4>">▫️ Heading 4 (H4 - Topic)</option>
            <option value="<h5>">Heading 5 (H5)</option>
            <option value="<h6>">Heading 6 (H6)</option>
            <option value="<p>">Normal Paragraph</option>
            <option value="<blockquote>">💬 Quote Block</option>
            <option value="<pre>">💻 Code Block</option>
          </select>
        </div>

        {/* Font Family */}
        <div style={groupStyle}>
          <select onChange={handleFontFamilyChange} style={selectStyle} defaultValue="">
            <option value="" disabled>
              Font Family
            </option>
            <option value="Inter, sans-serif">Inter</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="Impact, sans-serif">Impact</option>
            <option value="Verdana, sans-serif">Verdana</option>
          </select>
        </div>

        {/* Font Size */}
        <div style={groupStyle}>
          <select onChange={handleFontSizeChange} style={{ ...selectStyle, width: '80px' }} defaultValue="">
            <option value="" disabled>
              Size
            </option>
            <option value="1">10px</option>
            <option value="2">13px</option>
            <option value="3">16px (Normal)</option>
            <option value="4">18px</option>
            <option value="5">24px (Large)</option>
            <option value="6">32px (Huge)</option>
            <option value="7">48px</option>
          </select>
        </div>

        {/* Bold, Italic, Underline, Strike, Sub, Super */}
        <div style={groupStyle}>
          <button type="button" onClick={() => execCmd('bold')} title="Bold (Ctrl+B)" style={{ ...btnStyle, fontWeight: 'bold' }}>
            B
          </button>
          <button type="button" onClick={() => execCmd('italic')} title="Italic (Ctrl+I)" style={{ ...btnStyle, fontStyle: 'italic' }}>
            I
          </button>
          <button type="button" onClick={() => execCmd('underline')} title="Underline (Ctrl+U)" style={{ ...btnStyle, textDecoration: 'underline' }}>
            U
          </button>
          <button type="button" onClick={() => execCmd('strikeThrough')} title="Strikethrough" style={{ ...btnStyle, textDecoration: 'line-through' }}>
            S
          </button>
          <button type="button" onClick={() => execCmd('subscript')} title="Subscript" style={btnStyle}>
            x₂
          </button>
          <button type="button" onClick={() => execCmd('superscript')} title="Superscript" style={btnStyle}>
            x²
          </button>
        </div>

        {/* Text & Background Color */}
        <div style={groupStyle}>
          <label title="Text Color" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0 0.3rem', gap: '0.2rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#334155' }}>A</span>
            <input type="color" value={textColor} onChange={handleTextColorChange} style={{ width: '20px', height: '20px', border: 'none', background: 'none', cursor: 'pointer' }} />
          </label>
          <label title="Highlight Color" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0 0.3rem', gap: '0.2rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', background: '#fef08a', padding: '0 2px', borderRadius: '3px' }}>A</span>
            <input type="color" value={bgColor} onChange={handleBgColorChange} style={{ width: '20px', height: '20px', border: 'none', background: 'none', cursor: 'pointer' }} />
          </label>
        </div>

        {/* Alignment */}
        <div style={groupStyle}>
          <button type="button" onClick={() => execCmd('justifyLeft')} title="Align Left" style={btnStyle}>
            ≡
          </button>
          <button type="button" onClick={() => execCmd('justifyCenter')} title="Align Center" style={btnStyle}>
            ≂
          </button>
          <button type="button" onClick={() => execCmd('justifyRight')} title="Align Right" style={btnStyle}>
            ≡
          </button>
          <button type="button" onClick={() => execCmd('justifyFull')} title="Justify" style={btnStyle}>
            ≣
          </button>
        </div>

        {/* Lists & Indent */}
        <div style={groupStyle}>
          <button type="button" onClick={() => execCmd('insertUnorderedList')} title="Bullet List" style={btnStyle}>
            • List
          </button>
          <button type="button" onClick={() => execCmd('insertOrderedList')} title="Numbered List" style={btnStyle}>
            1. List
          </button>
          <button type="button" onClick={() => execCmd('outdent')} title="Decrease Indent" style={btnStyle}>
            ⇤
          </button>
          <button type="button" onClick={() => execCmd('indent')} title="Increase Indent" style={btnStyle}>
            ⇥
          </button>
        </div>

        {/* Inserts */}
        <div style={groupStyle}>
          <button
            type="button"
            onClick={() => {
              saveCurrentSelection();
              setImageTab('upload');
              setShowImageModal(true);
            }}
            title="Upload Local Image & Set Size"
            style={{ ...btnStyle, background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe', fontWeight: '700' }}
          >
            📁 Upload Image
          </button>
          <button
            type="button"
            onClick={() => {
              saveCurrentSelection();
              setImageTab('url');
              setShowImageModal(true);
            }}
            title="Insert Image by URL & Set Size"
            style={{ ...btnStyle, background: '#fdf2f8', color: '#db2777', borderColor: '#fbcfe8', fontWeight: '700' }}
          >
            🌐 Image URL
          </button>
          <button type="button" onClick={openLinkModal} title="Insert Link" style={btnStyle}>
            Link
          </button>
          <button type="button" onClick={insertTable} title="Insert Table" style={btnStyle}>
            Table
          </button>
          <button type="button" onClick={() => execCmd('insertHorizontalRule')} title="Horizontal Line" style={btnStyle}>
            Line
          </button>
        </div>

        {/* Quick Image Resize Toolbar Tool */}
        <div style={groupStyle}>
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleSelectedImageResize(e.target.value);
                e.target.value = '';
              }
            }}
            style={{ ...selectStyle, background: '#f8fafc', color: '#6B4226', fontWeight: '700' }}
            defaultValue=""
            title="Click an image in the editor and pick a size here to quickly resize it"
          >
            <option value="" disabled>
              🖼️ Resize Image
            </option>
            <option value="100%">Full Width (100%)</option>
            <option value="75%">Large (75%)</option>
            <option value="50%">Medium (50%)</option>
            <option value="35%">Small (35%)</option>
            <option value="250px">Custom 250px</option>
            <option value="400px">Custom 400px</option>
          </select>
        </div>

        {/* Tools */}
        <div style={groupStyle}>
          <button type="button" onClick={() => execCmd('removeFormat')} title="Clear Formatting" style={btnStyle}>
            Clear
          </button>
          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            title="Full Screen / Document Mode"
            style={{ ...btnStyle, background: isFullScreen ? '#0f172a' : '#f1f5f9', color: isFullScreen ? 'white' : '#334155' }}
          >
            {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>

      {/* Editor Content editable canvas */}
      <div style={{ padding: isFullScreen ? '2rem 4rem' : '1.5rem', flex: 1, overflowY: 'auto', background: '#f8fafc' }}>
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleBlur}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onPaste={handlePaste}
          data-placeholder={placeholder}
          className="ms-word-canvas"
          style={{
            minHeight: isFullScreen ? 'calc(100vh - 160px)' : '450px',
            padding: '2.5rem',
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            outline: 'none',
            fontSize: '1.05rem',
            lineHeight: '1.75',
            color: '#0f172a',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        />
      </div>

      {/* Status Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 1rem',
          background: '#f1f5f9',
          borderTop: '1px solid #e2e8f0',
          fontSize: '0.8rem',
          color: '#64748b',
          fontWeight: '600',
        }}
      >
        <div style={{ display: 'flex', gap: '1.2rem' }}>
          <span>Words: <strong>{wordCount}</strong></span>
          <span>Characters: <strong>{charCount}</strong></span>
          <span>Est. Reading Time: <strong>~{readTime} min</strong></span>
        </div>
        <div>
          <span style={{ color: '#16a34a', fontWeight: '700' }}>✓ Semrush SEO Clean HTML</span>
        </div>
      </div>

      {/* Modern Image Insert & Sizing Modal */}
      {showImageModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.8rem',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>
                Insert & Custom Size Image
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowImageModal(false);
                  setImageUrl('');
                }}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: imageTab === 'upload' ? 'white' : 'transparent',
                  color: imageTab === 'upload' ? '#0f172a' : '#64748b',
                  fontWeight: '750',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: imageTab === 'upload' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                📁 Upload File
              </button>
              <button
                type="button"
                onClick={() => setImageTab('url')}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: imageTab === 'url' ? 'white' : 'transparent',
                  color: imageTab === 'url' ? '#0f172a' : '#64748b',
                  fontWeight: '750',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: imageTab === 'url' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                🌐 Web URL
              </button>
            </div>

            {imageTab === 'upload' ? (
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem' }}>
                  Select Image from Computer
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      await uploadFiles([e.target.files[0]]);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px dashed #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    background: '#f8fafc',
                    cursor: 'pointer',
                  }}
                />
                {isUploading && <p style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: '700', marginTop: '0.4rem' }}>Uploading image to server...</p>}
              </div>
            ) : (
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem' }}>
                  Image Web Link (URL) *
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                />
              </div>
            )}

            {/* Image Size Selection Controls */}
            <div style={{ marginBottom: '1.2rem', background: '#FBF8F5', border: '1px solid #E8DFD8', padding: '1rem', borderRadius: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#3E2618', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                📐 Decide Image Size:
              </label>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {(['100%', '75%', '50%', '35%'] as const).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setImageSizePreset(preset)}
                    style={{
                      padding: '0.5rem 0.2rem',
                      borderRadius: '8px',
                      border: imageSizePreset === preset ? '2px solid #6B4226' : '1px solid #cbd5e1',
                      background: imageSizePreset === preset ? '#F5EDE4' : 'white',
                      color: imageSizePreset === preset ? '#6B4226' : '#475569',
                      fontWeight: '800',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                    }}
                  >
                    {preset === '100%' ? 'Full (100%)' : preset === '75%' ? 'Large (75%)' : preset === '50%' ? 'Med (50%)' : 'Small (35%)'}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => setImageSizePreset('custom')}
                  style={{
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    border: imageSizePreset === 'custom' ? '2px solid #6B4226' : '1px solid #cbd5e1',
                    background: imageSizePreset === 'custom' ? '#F5EDE4' : 'white',
                    color: imageSizePreset === 'custom' ? '#6B4226' : '#475569',
                    fontWeight: '750',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Custom Width:
                </button>
                <input
                  type="text"
                  value={imageCustomWidth}
                  onChange={(e) => {
                    setImageCustomWidth(e.target.value);
                    setImageSizePreset('custom');
                  }}
                  placeholder="e.g. 400px or 60%"
                  style={{
                    flex: 1,
                    padding: '0.45rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    background: 'white',
                  }}
                />
              </div>
            </div>

            {/* Alignment Controls */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem' }}>
                Alignment
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['center', 'left', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => setImageAlignment(align)}
                    style={{
                      flex: 1,
                      padding: '0.45rem',
                      borderRadius: '6px',
                      border: imageAlignment === align ? '2px solid #0f172a' : '1px solid #cbd5e1',
                      background: imageAlignment === align ? '#0f172a' : 'white',
                      color: imageAlignment === align ? 'white' : '#475569',
                      fontWeight: '700',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>

            {/* Alt & Caption */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '0.3rem' }}>
                  Alt Text (SEO)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Image description"
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#475569', marginBottom: '0.3rem' }}>
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Caption text"
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            {/* Live Preview */}
            {imageUrl && (
              <div style={{ marginBottom: '1.5rem', textAlign: imageAlignment, background: '#f8fafc', padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textAlign: 'left' }}>
                  Live Preview ({imageSizePreset === 'custom' ? imageCustomWidth : imageSizePreset} - {imageAlignment}):
                </p>
                <img
                  src={imageUrl}
                  alt="Preview"
                  style={{
                    width: imageSizePreset === 'custom' ? (imageCustomWidth || '100%') : imageSizePreset,
                    maxWidth: '100%',
                    maxHeight: '180px',
                    borderRadius: '8px',
                    objectFit: 'contain',
                    display: 'inline-block',
                  }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={() => {
                  setShowImageModal(false);
                  setImageUrl('');
                }}
                style={{ padding: '0.6rem 1.1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertConfiguredImage}
                disabled={!imageUrl.trim()}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: imageUrl.trim() ? '#6B4226' : '#94a3b8',
                  color: 'white',
                  fontWeight: '800',
                  cursor: imageUrl.trim() ? 'pointer' : 'not-allowed',
                  boxShadow: imageUrl.trim() ? '0 4px 12px rgba(107, 66, 38, 0.25)' : 'none',
                  fontSize: '0.9rem',
                }}
              >
                Insert Image ({imageSizePreset === 'custom' ? imageCustomWidth : imageSizePreset})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              width: '90%',
              maxWidth: '450px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>Insert Hyperlink</h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem' }}>Link URL</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                autoFocus
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.4rem' }}>Display Text (optional)</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Click here"
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="open-new-tab"
                checked={linkNewTab}
                onChange={(e) => setLinkNewTab(e.target.checked)}
              />
              <label htmlFor="open-new-tab" style={{ fontSize: '0.85rem', color: '#334155', fontWeight: '600' }}>Open link in new tab</label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', fontWeight: '600', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', background: '#0f172a', color: 'white', fontWeight: '700', cursor: 'pointer' }}
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const groupStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.2rem',
  paddingRight: '0.4rem',
  marginRight: '0.2rem',
  borderRight: '1px solid #e2e8f0',
};

const btnStyle: React.CSSProperties = {
  padding: '0.35rem 0.55rem',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  background: 'white',
  color: '#334155',
  fontSize: '0.85rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const selectStyle: React.CSSProperties = {
  padding: '0.35rem 0.45rem',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  background: 'white',
  color: '#334155',
  fontSize: '0.85rem',
  fontWeight: '600',
  outline: 'none',
  cursor: 'pointer',
};
