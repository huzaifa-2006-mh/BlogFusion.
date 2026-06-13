import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateNewsletterEmail(title: string, content: string): Promise<{ subject: string; html: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Fallback if no key
    return {
      subject: `New on Blog Fusion: ${title}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a192f;color:#ccd6f6;padding:40px;border-radius:12px;">
        <h1 style="color:#64ffda;font-size:24px;margin-bottom:16px;">${title}</h1>
        <p style="color:#8892b0;line-height:1.6;">${content.substring(0, 300)}...</p>
        <a href="https://blog-fusion-beta.vercel.app" style="display:inline-block;margin-top:24px;background:#64ffda;color:#0a192f;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;">Read Full Article →</a>
        <p style="margin-top:32px;font-size:12px;color:#495670;">You received this because you subscribed to Blog Fusion newsletter.</p>
      </div>`
    };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a professional email marketing copywriter for "Blog Fusion" - a premium tech and programming blog.

A new blog post has been published:
Title: "${title}"
Content preview: "${content.substring(0, 1000)}"

Write a compelling newsletter email. Output ONLY:
Line 1: Subject: [your subject line]
Line 2 onwards: The complete HTML email body (no markdown, no code blocks, just raw HTML).

The HTML email should:
- Have inline CSS only (no external stylesheets)
- Use a dark theme: background #0a192f, text #ccd6f6, accent #64ffda
- Be mobile responsive with max-width 600px centered
- Include: greeting, exciting intro hook, 3 key takeaways from the article, a CTA button linking to https://blog-fusion-beta.vercel.app
- Footer with unsubscribe note
- Look premium and professional`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const lines = text.split('\n');
    let subject = `New Post: ${title} | Blog Fusion`;
    let html = text;

    if (lines[0].toLowerCase().startsWith('subject:')) {
      subject = lines[0].replace(/^subject:\s*/i, '').trim();
      html = lines.slice(1).join('\n').trim();
    }

    // Strip any accidental markdown code blocks
    html = html.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

    return { subject, html };
  } catch (err) {
    console.error('Gemini AI error:', err);
    return {
      subject: `New on Blog Fusion: ${title}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a192f;color:#ccd6f6;padding:40px;border-radius:12px;">
        <h1 style="color:#64ffda;font-size:24px;margin-bottom:16px;">${title}</h1>
        <p style="color:#8892b0;line-height:1.6;">${content.substring(0, 300)}...</p>
        <a href="https://blog-fusion-beta.vercel.app" style="display:inline-block;margin-top:24px;background:#64ffda;color:#0a192f;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;">Read Full Article →</a>
        <p style="margin-top:32px;font-size:12px;color:#495670;">You received this because you subscribed to Blog Fusion newsletter.</p>
      </div>`
    };
  }
}
