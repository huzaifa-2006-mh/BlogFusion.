import { notFound } from 'next/navigation';
import Script from 'next/script';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Post Meta Data
  const post = {
    title: "Supervised vs. Unsupervised Learning: The Ultimate Guide for Beginners",
    category: "MACHINE-LEARNING",
    date: "JUN 14, 2026",
    author: { name: "Muhammad Huzaifa", image: "/huzaifa.png" }
  };

  const authorName = post.author?.name || "Muhammad Huzaifa";

  return (
    <article className="py-8 bg-white min-h-screen font-sans">
      {/* ─── MAIN GRID LAYOUT: Content left par, ads right sidebar me ─── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-6">
        
        {/* ================= LEFT COLUMN: AAPKA ASAL PREMIUM DESIGN CONTENT ================= */}
        <div className="lg:col-span-2">
          {/* Meta Info */}
          <div className="text-sm text-gray-500 mb-2 uppercase tracking-wider font-semibold">
            {post.date} • <span className="text-pink-600 font-bold">#{post.category}</span>
          </div>

          {/* Blog Main Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">
            {post.title}
          </h1>
          
          <p className="text-slate-600 italic mb-8 text-xl border-l-4 border-pink-500 pl-4 bg-slate-50 py-2 rounded-r">
            Demystifying the two core pillars of Machine Learning. Learn how they work, their key differences, and real-world applications with simple examples.
          </p>

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

          {/* Blog Content Body with Custom Typography & CSS Spacing */}
          <div className="text-slate-800 text-lg leading-relaxed space-y-6 antialiased">
            <p>
              Machine Learning (ML) is no longer just a futuristic buzzword; it is the invisible engine driving our daily digital experiences. From Netflix’s uncanny movie recommendations and Spotify’s personalized playlists to the seamless spam filters in our inboxes, intelligent systems are everywhere. But how do these algorithms actually learn to make such precise decisions? To understand the vast ecosystem of Artificial Intelligence, one must grasp its two fundamental pillars: Supervised Learning and Unsupervised Learning. Whether you are stepping into data science, launching a tech startup, or simply curious about how AI processes data, understanding the distinction between these two approaches is critical. This comprehensive guide breaks down both concepts using simple explanations, core mechanics, and real-world use cases.
            </p>
            
            {/* Heading 1 */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-10 mb-4 tracking-tight flex items-center gap-2 border-b pb-2 border-slate-100">
              <span className="text-pink-600">1.</span> What is Supervised Learning? (The Guided Approach)
            </h2>
            <p>
              Think of Supervised Learning as a classroom scenario where a student learns under the direct supervision of a teacher. In technical terms, Supervised Learning is a machine learning approach where a model is trained using a Labeled Dataset. A labeled dataset means that for every piece of input data, the correct corresponding output (the answer key) is already provided. The algorithm's primary task is to map the relationship between the inputs and the outputs.
            </p>
            
            <h3 className="text-xl font-bold text-slate-900 mt-6 mb-2">How it Works:</h3>
            <ul className="list-disc pl-6 space-y-3 text-slate-700">
              <li><strong className="text-slate-900">Data Collection:</strong> You provide the algorithm with a massive dataset, for example, thousands of images of cats and dogs.</li>
              <li><strong className="text-slate-900">Labeling:</strong> Each image is explicitly tagged (labeled) as either <span className="bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded font-mono text-sm">"Cat"</span> or <span className="bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded font-mono text-sm">"Dog"</span>.</li>
              <li><strong className="text-slate-900">Training:</strong> The algorithm analyzes the features of these images—such as ear shapes, whiskers, and sizes—and associates them with the correct label.</li>
              <li><strong className="text-slate-900">Prediction:</strong> Once training is complete, you introduce a completely new, unseen image. Based on its past training, the model calculates the probability and accurately predicts whether the image is a cat or a dog.</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-2">Types of Supervised Learning:</h3>
            <p>Supervised learning tasks are broadly divided into two major categories depending on the nature of the target variable:</p>
            <ul className="list-disc pl-6 space-y-3 text-slate-700">
              <li><strong className="text-slate-900">Classification:</strong> This occurs when the output variable is a distinct category or label. The goal is to sort data into predefined classes. Examples include predicting whether an email is "Spam" or "Not Spam," or determining if a financial transaction is "Fraudulent" or "Legitimate."</li>
              <li><strong className="text-slate-900">Regression:</strong> This occurs when the output variable is a continuous or numerical value. Instead of sorting data into categories, the model predicts a specific quantity. Examples include forecasting house prices based on square footage, predicting tomorrow's temperature, or estimating stock market trends.</li>
            </ul>

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

            {/* Heading 2 */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4 tracking-tight flex items-center gap-2 border-b pb-2 border-slate-100">
              <span className="text-pink-600">2.</span> What is Unsupervised Learning? (The Self-Learning Approach)
            </h2>
            <p>
              Now, imagine hand-delivering a massive box of assorted building blocks to a young child without giving them any manual, instructions, or rules. Over time, the child will naturally start sorting the blocks themselves—perhaps putting all the red blocks together, grouping the long blocks, or separating the circular ones. This self-guided sorting mechanism is the essence of Unsupervised Learning.
            </p>
            <p>
              In Unsupervised Learning, the algorithm is fed an Unlabeled Dataset. This means the system receives input data but is given no explicit target outputs, no tags, and no human supervisor to correct its mistakes. The algorithm is left entirely to its own devices to discover hidden patterns, underlying structures, and anomalies within the data.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-2">How it Works:</h3>
            <ul className="list-disc pl-6 space-y-3 text-slate-700">
              <li><strong className="text-slate-900">Data Input:</strong> You feed the algorithm raw, unstructured data, such as the purchase histories of hundreds of thousands of e-commerce customers.</li>
              <li><strong className="text-slate-900">Pattern Discovery:</strong> Without any predefined categories, the algorithm scans the data to identify similarities, frequencies, and behavioral correlations.</li>
              <li><strong className="text-slate-900">Grouping:</strong> The system autonomously clusters the data. For instance, it might group customers into distinct segments: "High-budget tech enthusiasts," "Seasonal discount shoppers," or "Bulk buyers."</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-2">Types of Unsupervised Learning:</h3>
            <ul className="list-disc pl-6 space-y-3 text-slate-700">
              <li><strong className="text-slate-900">Clustering:</strong> The process of automatically grouping similar data points together based on inherent characteristics. It is widely used for market segmentation, image compression, and document organization.</li>
              <li><strong className="text-slate-900">Association:</strong> This technique uncovers fascinating relationships and dependencies between variables in a dataset. A classic example is Market Basket Analysis, where retailers discover that customers who buy diapers are also highly likely to purchase baby wipes or formula during the same trip.</li>
              <li><strong className="text-slate-900">Dimensionality Reduction:</strong> When dealing with massive datasets containing hundreds of variables (dimensions), this process strips away redundant or irrelevant features. It simplifies the data, making it easier for systems to process without losing critical underlying information.</li>
            </ul>

            {/* Heading 3 */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4 tracking-tight flex items-center gap-2 border-b pb-2 border-slate-100">
              <span className="text-pink-600">3.</span> Real-World Applications
            </h2>
            <p>Both technologies work tirelessly behind the scenes of our favorite modern platforms. Here is how they are applied across global industries today:</p>
            
            <h3 className="text-xl font-bold text-slate-900 mt-6 mb-2">Supervised Learning Applications:</h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li><strong className="text-slate-900">Healthcare & Medical Imaging:</strong> Training models on thousands of labeled historical scans allows AI to assist radiologists in identifying early-stage tumors or cardiovascular risks with high precision.</li>
              <li><strong className="text-slate-900">Email & Security Systems:</strong> Advanced filters use classification models to analyze email subject lines and metadata, instantly redirecting malicious phishing attempts away from your inbox.</li>
              <li><strong className="text-slate-900">Voice Assistants:</strong> Virtual assistants like Siri, Alexa, and Google Assistant rely on supervised models to map your specific voice inputs into textual commands.</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-2">Unsupervised Learning Applications:</h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-700">
              <li><strong className="text-slate-900">E-Commerce Personalization:</strong> Major streaming platforms and digital marketplaces use clustering to analyze your silent browsing habits, recommending media and products you didn’t even know you wanted.</li>
              <li><strong className="text-slate-900">Cybersecurity & Anomaly Detection:</strong> Financial institutions deploy unsupervised algorithms to monitor global network traffic. Because the AI knows what "normal" behavior looks like, it instantly flags sudden, unusual patterns that could indicate a sophisticated cyberattack.</li>
              <li><strong className="text-slate-900">Genetics & Biology:</strong> Scientists use clustering algorithms to analyze massive sets of gene expression data, allowing them to classify different species or identify genetic similarities.</li>
            </ul>

            {/* FAQ Section */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-16 mb-4 border-t pt-8 border-slate-200">Frequently Asked Questions</h2>
            <div className="space-y-4 mt-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h4 className="font-extrabold text-slate-900 text-lg">Q: Is Regression a type of Unsupervised Learning?</h4>
                <p className="text-slate-600 mt-2">No, Regression is firmly a part of Supervised Learning. This is because regression algorithms require historical labeled training data (inputs paired with actual numeric outputs) to accurately forecast continuous numerical values.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h4 className="font-extrabold text-slate-900 text-lg">Q: Why is Unsupervised Learning considered harder than Supervised Learning?</h4>
                <p className="text-slate-600 mt-2">Unsupervised learning is more challenging because it operates without validation. There is no training "ground truth" or correct answer key to evaluate the model's performance against, making its outputs highly dependent on mathematical interpretation and algorithm tuning.</p>
              </div>
            </div>
          </div>

          {/* Premium Author Bio Box */}
          <div className="mt-16 p-8 bg-[#f8fafc] rounded-[16px] flex items-center gap-6 border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.02)]">
            <div className="w-[75px] h-[75px] rounded-full bg-gradient-to-br from-[#ec4899] to-[#ff4b91] overflow-hidden flex items-center justify-center text-white font-extrabold text-[1.8rem] shadow-[0_8px_20px_rgba(236,72,153,0.2)] flex-shrink-0">
              <img src={post.author?.image || '/huzaifa.png'} alt={authorName} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="m-0 font-extrabold text-[#0f172a] text-[1.3rem]">
                Written by <span className="text-[#ec4899]">{authorName}</span>
              </h3>
              <p className="m-0 text-[#475569] text-[0.95rem] mt-1 leading-relaxed">
                Muhammad Huzaifa is a passionate developer and the lead voice behind Blog Fusion. He loves exploring new technologies and sharing his knowledge.
              </p>
            </div>
          </div>

          {/* Share Ribbons */}
          <div className="mt-12 pt-6 border-t border-slate-100">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4">Share this post:</h3>
            <div className="flex flex-wrap gap-3 text-sm text-pink-600 font-bold">
              <span className="cursor-pointer bg-pink-50 px-3 py-1.5 rounded-full">Twitter</span> 
              <span className="cursor-pointer bg-pink-50 px-3 py-1.5 rounded-full">LinkedIn</span> 
              <span className="cursor-pointer bg-pink-50 px-3 py-1.5 rounded-full">Facebook</span> 
              <span className="cursor-pointer bg-pink-50 px-3 py-1.5 rounded-full">WhatsApp</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: FIXED STICKY SIDEBAR ADS ================= */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6 flex flex-col items-center">
            
            {/* SIDEBAR BANNER 1 (300x250 Square) */}
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
            <div className="hidden lg:flex w-full max-w-[300px] p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center shadow-sm">
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
