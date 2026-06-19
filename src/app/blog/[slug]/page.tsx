import { notFound } from 'next/navigation';
import Script from 'next/script';
import { allPosts } from 'contentlayer/generated'; // Ya jo bhi aapka post data source hai
import { Mdx } from '@/components/mdx-components'; // Aapka original custom reader component

interface PostProps {
  params: {
    slug: string;
  };
}

async function getPostFromParams(slug: string) {
  const post = allPosts.find((post) => post.slugAsParams === slug);
  if (!post) return null;
  return post;
}

export default async function BlogPostPage({ params }: PostProps) {
  const post = await getPostFromParams(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-6 prose dark:prose-invert max-w-none bg-white min-h-screen">
      {/* ─── WEB LAYOUT STRUCTURE: Ads sidebar aur content split ─── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-6">
        
        {/* ================= LEFT COLUMN: AAPKA ASAL PREMIUM DESIGN CONTENT ================= */}
        <div className="lg:col-span-2">
          {/* Post Meta Headers */}
          <div className="text-sm text-gray-500 mb-2 uppercase tracking-wider font-semibold">
            {post.date} • <span className="text-pink-600 font-bold">#{post.category}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* ─── ADSTERRA AD 1: TOP BANNER (468x60) ─── */}
          <div className="my-6 p-2 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-center">
            <span className="text-[9px] text-slate-400 font-bold mb-1 uppercase tracking-widest block">Advertisement</span>
            <div className="w-full max-w-[468px] overflow-hidden flex justify-center">
              <Script id="adsterra-468" strategy="afterInteractive">
                {`
                  window.atOptions = {
                    'key' : '29598671',
                    'format' : 'iframe',
                    'height' : 60,
                    'width' : 468,
                    'params' : {}
                  };
                `}
              </Script>
              <Script strategy="afterInteractive" src="https://www.highperformanceformat.com/29598671/invoke.js" />
            </div>
          </div>

          {/* Dynamic Content Markdown Reader - Jo aapka original beautiful design render karega */}
          <div className="mt-6 font-sans antialiased text-slate-800">
            <Mdx code={post.body.code} />
          </div>

          {/* ─── ADSTERRA AD 2: MID CONTENT SQUARE (300x250) ─── */}
          <div className="my-8 p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-center">
            <span className="text-[9px] text-slate-400 font-bold mb-2 uppercase tracking-widest block">Advertisement</span>
            <div className="w-[300px] h-[250px] overflow-hidden shadow-sm rounded-lg bg-white flex justify-center items-center">
              <Script id="adsterra-300" strategy="afterInteractive">
                {`
                  window.atOptions = {
                    'key' : '29598678',
                    'format' : 'iframe',
                    'height' : 250,
                    'width' : 300,
                    'params' : {}
                  };
                `}
              </Script>
              <Script strategy="afterInteractive" src="https://www.highperformanceformat.com/29598678/invoke.js" />
            </div>
          </div>

          {/* Author Box Footer Profile Section */}
          <div className="mt-16 p-8 bg-[#f8fafc] rounded-[16px] flex items-center gap-6 border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.02)]">
            <div className="w-[75px] h-[75px] rounded-full bg-gradient-to-br from-[#ec4899] to-[#ff4b91] overflow-hidden flex items-center justify-center text-white font-extrabold text-[1.8rem] shadow-[0_8px_20px_rgba(236,72,153,0.2)] flex-shrink-0">
              <img src={post.authorImage || '/huzaifa.png'} alt={post.author} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="m-0 font-extrabold text-[#0f172a] text-[1.3rem]">
                Written by <span className="text-[#ec4899]">{post.author || 'Muhammad Huzaifa'}</span>
              </h3>
              <p className="m-0 text-[#475569] text-[0.95rem] mt-1 leading-relaxed">
                Passionate developer and the lead voice behind Blog Fusion. Exploring new technologies and sharing absolute knowledge.
              </p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: STICKY SIDEBAR ADS ================= */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6 flex flex-col items-center">
            
            {/* SIDEBAR BANNER 1 (300x250) */}
            <div className="w-full max-w-[300px] p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold mb-2 uppercase tracking-widest block text-center">Sponsored Content</span>
              <div className="w-[300px] h-[250px] bg-white overflow-hidden flex justify-center items-center rounded-lg border border-slate-100">
                <Script id="adsterra-sidebar-300" strategy="afterInteractive">
                  {`
                    window.atOptions = {
                      'key' : '29598678',
                      'format' : 'iframe',
                      'height' : 250,
                      'width' : 300,
                      'params' : {}
                    };
                  `}
                </Script>
                <Script strategy="afterInteractive" src="https://www.highperformanceformat.com/29598678/invoke.js" />
              </div>
            </div>

            {/* SIDEBAR BANNER 2 (160x600 Skyscraper) */}
            <div className="hidden lg:flex w-full max-w-[300px] p-3 bg-slate-50 border border-slate-200 rounded-2xl flex-col items-center shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold mb-2 uppercase tracking-widest block text-center">Trending Offers</span>
              <div className="w-[160px] h-[600px] bg-white overflow-hidden flex justify-center items-center rounded-lg border border-slate-100">
                <Script id="adsterra-sidebar-160" strategy="afterInteractive">
                  {`
                    window.atOptions = {
                      'key' : '29598677',
                      'format' : 'iframe',
                      'height' : 600,
                      'width' : 160,
                      'params' : {}
                    };
                  `}
                </Script>
                <Script strategy="afterInteractive" src="https://www.highperformanceformat.com/29598677/invoke.js" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </article>
  );
}
