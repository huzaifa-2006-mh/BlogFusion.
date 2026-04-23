export default function Disclaimer() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="mb-4">⚠️ Disclaimer</h1>
        <p>The information provided on <strong>BlogFusion</strong> is for educational and informational purposes only.</p>
        
        <h2 className="mt-4">No Guarantees</h2>
        <p>While we strive to provide accurate information, we do not guarantee:</p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1.5rem' }}>
          <li>Job placement or employment success</li>
          <li>Specific online earnings or financial income</li>
          <li>Absolute financial success or investment returns</li>
        </ul>

        <h2 className="mt-4">Risk Disclosure</h2>
        <p>
          All decisions made based on the information on this website are at your own risk. We recommend users verify information and consult with professionals before taking any significant action or making financial commitments.
        </p>

        <h2 className="mt-4">External Links</h2>
        <p>
          Our website may contain links to external websites that are not provided or maintained by or in any way affiliated with BlogFusion. Please note that BlogFusion does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
        </p>

        <p className="mt-4" style={{ fontWeight: '600' }}>
          By using our website, you hereby acknowledge and agree to this disclaimer.
        </p>
      </div>
    </section>
  );
}
