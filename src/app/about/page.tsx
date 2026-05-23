<<<<<<< Updated upstream
'use client';

export default function About() {
  const teamMembers = [
    {
      name: "Marium Waseem",
      role: "CEO of Blog Fusion",
      initial: "M",
      bio: "Marium Waseem is the CEO of Blog Fusion and plays a leading role in managing and growing the platform. She is a skilled Data Analyst and Web Developer with a strong passion for technology, analytics, and creative digital experiences.",
      description: "She specializes in transforming data into meaningful insights and building modern, responsive, and user-friendly websites.",
      skills: [
        "Data Analytics",
        "HTML5 & CSS3",
        "JavaScript",
        "PHP",
        "WordPress",
        "React.js",
        "SQL",
        "Data Visualization",
        "Dashboard Reporting",
        "Microsoft Excel",
        "Responsive Web Design",
        "UI/UX Understanding",
        "Website Management",
        "Research & Data Interpretation",
        "Problem Solving & Team Management"
      ]
    },
    {
      name: "Muhammad Huzaifa",
      role: "Founder & Lead Developer",
      initial: "H",
      bio: "Muhammad Huzaifa is the Founder and Lead Developer at Blog Fusion. He is passionate about modern technologies, programming, and full-stack web development. With over 1 year of experience in web development, he has worked on various projects involving front-end interfaces, back-end systems, databases, and scalable web applications.",
      description: "He focuses on building efficient, scalable, and modern web solutions while continuously exploring new technologies and development trends.",
      skills: [
        "Oracle Database",
        "WordPress Development",
        "Java",
        "DSA in Java",
        "JavaScript",
        "HTML5 & CSS3",
        "Tailwind CSS",
        "PHP",
        "C#",
        "Python",
        "Node.js",
        "Express.js",
        "Next.js",
        "MySQL",
        "MongoDB",
        "REST API Development",
        "Full Stack Web Development",
        "Responsive Web Design",
        "Database Management"
      ]
    }
  ];

  const values = [
    {
      icon: "✨",
      title: "Quality First",
      description: "Every article is created with proper research and user intent in mind."
    },
    {
      icon: "🎯",
      title: "Innovation",
      description: "We stay ahead of trends and continuously explore new technologies."
    },
    {
      icon: "🤝",
      title: "Trust & Transparency",
      description: "No sponsored content, no paid endorsements. Just honest guidance."
    },
    {
      icon: "🚀",
      title: "Scalability",
      description: "Building efficient and scalable solutions for modern challenges."
    },
    {
      icon: "📚",
      title: "Knowledge Sharing",
      description: "Dedicated to helping people learn and grow in the digital world."
    },
    {
      icon: "💡",
      title: "Creativity",
      description: "Combining technology and creativity to build powerful ideas."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1>About Blog Fusion</h1>
          <p>A modern platform created to share knowledge, creativity, technology, and innovation</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section">
        <div className="container">
          <div className="about-content">
            <h2>Our Mission</h2>
            <p>
              Welcome to <strong>Blog Fusion</strong>, a modern platform dedicated to sharing knowledge, creativity, technology, and innovation with readers worldwide. Our goal is to provide valuable, easy-to-understand, and engaging content that helps people learn, grow, and stay updated with the digital world.
            </p>
            
            <p>
              At Blog Fusion, we believe that <strong>technology and creativity together can build powerful ideas</strong>. Behind this platform is a dedicated team passionate about web development, data analytics, and modern digital solutions. We're committed to delivering high-quality content with proper research and user intent in mind.
            </p>

            <div className="quote-section">
              <p className="quote-text">
                "Independent and unbiased. No sponsored content, no paid endorsements, no brand partnerships. Just honest tech guidance you can trust."
              </p>
            </div>
          </div>
=======
import Link from 'next/link';

// Rebuild trigger
  return (
    <div className="about-page" style={{ padding: '2rem 0' }}>
      {/* Hero Section */}
      <section className="about-hero" style={{ background: '#0f172a', color: 'white', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '1rem' }}>About Blog Fusion</h1>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            Welcome to Blog Fusion – a modern platform built to share knowledge, creativity, technology, and innovation with readers worldwide.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section" style={{ padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>Our Goal</h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.7', marginBottom: '1rem' }}>
            Our goal is to provide valuable, easy‑to‑understand, and engaging content that helps people learn, grow, and stay updated with the digital world.
          </p>
          <p style={{ fontSize: '1rem', lineHeight: '1.7' }}>
            At Blog Fusion we believe technology and creativity together can build powerful ideas. Behind this platform is a dedicated team passionate about web development, data analytics, and modern digital solutions.
          </p>
>>>>>>> Stashed changes
        </div>
      </section>

      {/* Team Section */}
<<<<<<< Updated upstream
      <section className="section team-section">
        <div className="container">
          <div className="section-title">
            <h2>Meet Our Team</h2>
            <p>Meet the talented individuals who drive Blog Fusion forward with passion, expertise, and dedication to innovation.</p>
          </div>

          {/* Team Grid */}
          <div className="team-grid">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="team-card">
                {/* Avatar & Header */}
                <div className="team-card-header">
                  <div className="avatar">
                    {member.initial}
                  </div>
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </div>

                {/* Content */}
                <div className="team-card-content">
                  <p className="team-bio">{member.bio}</p>
                  <p className="team-description">{member.description}</p>

                  <div className="skills-section">
                    <p className="skills-title">Skills & Expertise</p>
                    <div className="skills-container">
                      {member.skills.slice(0, 6).map((skill, skillIdx) => (
                        <span key={skillIdx} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 6 && (
                        <span className="skill-tag more-skills">
                          +{member.skills.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* All Skills Section */}
          <div className="all-skills-section">
            <h3>Combined Expertise</h3>
            
            <div className="expertise-category">
              <h4>Frontend Development</h4>
              <div className="expertise-tags">
                {['HTML5 & CSS3', 'JavaScript', 'React.js', 'Tailwind CSS', 'Responsive Web Design'].map((skill, idx) => (
                  <span key={idx} className="expertise-tag frontend">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="expertise-category">
              <h4>Backend Development</h4>
              <div className="expertise-tags">
                {['Node.js', 'Express.js', 'Next.js', 'PHP', 'Java', 'Python', 'C#'].map((skill, idx) => (
                  <span key={idx} className="expertise-tag backend">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="expertise-category">
              <h4>Database & Tools</h4>
              <div className="expertise-tags">
                {['MySQL', 'MongoDB', 'Oracle Database', 'REST API', 'WordPress', 'Data Analytics', 'UI/UX Design'].map((skill, idx) => (
                  <span key={idx} className="expertise-tag database">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
=======
      <section className="team-section" style={{ background: '#f8fafc', padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Meet Our Team</h2>
          {/* Marium */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#0f172a' }}>Marium Waseem – CEO of Blog Fusion</h3>
            <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
              Marium Waseem is the CEO of Blog Fusion and plays a leading role in managing and growing the platform. She is a skilled Data Analyst and Web Developer with a strong passion for technology, analytics, and creative digital experiences.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
              She specializes in transforming data into meaningful insights and building modern, responsive, and user‑friendly websites.
            </p>
            <h4 style={{ fontSize: '1.4rem', marginTop: '1rem' }}>Skills & Expertise</h4>
            <ul style={{ columnCount: 2, columnGap: '2rem', fontSize: '1rem', lineHeight: '1.6' }}>
              <li>Data Analytics</li>
              <li>HTML5 & CSS3</li>
              <li>JavaScript</li>
              <li>PHP</li>
              <li>WordPress</li>
              <li>React.js</li>
              <li>SQL</li>
              <li>Data Visualization</li>
              <li>Dashboard Reporting</li>
              <li>Microsoft Excel</li>
              <li>Responsive Web Design</li>
              <li>UI/UX Understanding</li>
              <li>Website Management</li>
              <li>Research & Data Interpretation</li>
              <li>Problem Solving & Team Management</li>
            </ul>
          </div>

          {/* Muhammad Huzaifa */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#0f172a' }}>Muhammad Huzaifa – Boss & Lead Developer</h3>
            <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
              Muhammad Huzaifa is the Boss and Lead Developer at Blog Fusion. He is passionate about modern technologies, programming, and full‑stack web development. With over 1 year of experience, he has worked on a variety of projects involving front‑end interfaces, back‑end systems, databases, and scalable web applications.
            </p>
            <h4 style={{ fontSize: '1.4rem', marginTop: '1rem' }}>Skills & Expertise</h4>
            <ul style={{ columnCount: 2, columnGap: '2rem', fontSize: '1rem', lineHeight: '1.6' }}>
              <li>Oracle Database</li>
              <li>WordPress Development</li>
              <li>Java</li>
              <li>DSA in Java</li>
              <li>JavaScript</li>
              <li>HTML5 & CSS3</li>
              <li>Tailwind CSS</li>
              <li>PHP</li>
              <li>C#</li>
              <li>Python</li>
              <li>Node.js</li>
              <li>Express.js</li>
              <li>Next.js</li>
              <li>MySQL</li>
              <li>MongoDB</li>
              <li>REST API Development</li>
              <li>Full‑Stack Web Development</li>
              <li>Responsive Web Design</li>
              <li>Database Management</li>
            </ul>
>>>>>>> Stashed changes
          </div>
        </div>
      </section>

<<<<<<< Updated upstream
      {/* Values Section */}
      <section className="section values-section">
        <div className="container">
          <div className="section-title">
            <h2>Our Values</h2>
          </div>

          <div className="values-grid">
            {values.map((value, idx) => (
              <div key={idx} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <h2>Join Our Community</h2>
          <p>
            Stay updated with the latest tech trends, tutorials, and insights. Subscribe to Blog Fusion and grow with us.
          </p>
          <a href="/" className="cta-button">
            Explore Our Blogs
          </a>
        </div>
      </section>

      <style jsx>{`
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .team-card {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          background: white;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .team-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(225, 29, 72, 0.15);
        }

        .team-card-header {
          background: linear-gradient(135deg, #0f172a, rgba(225, 29, 72, 0.2));
          padding: 2.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e11d48, #ff4b91);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: white;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .team-name {
          margin: 0 0 0.3rem 0;
          color: white;
          font-size: 1.4rem;
          font-weight: 700;
        }

        .team-role {
          margin: 0;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .team-card-content {
          padding: 2rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .team-bio {
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1rem;
          color: var(--text-primary);
          font-weight: 600;
        }

        .team-description {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .skills-section {
          margin-top: auto;
        }

        .skills-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .skill-tag {
          display: inline-block;
          padding: 0.4rem 0.8rem;
          background: linear-gradient(135deg, rgba(225, 29, 72, 0.1), rgba(79, 70, 229, 0.1));
          border-radius: 4px;
          font-size: 0.75rem;
          color: var(--primary-color);
          font-weight: 600;
          border: 1px solid rgba(225, 29, 72, 0.2);
        }

        .skill-tag.more-skills {
          background: rgba(0, 0, 0, 0.05);
          color: var(--text-secondary);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .all-skills-section {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          margin-top: 2rem;
        }

        .all-skills-section h3 {
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .expertise-category {
          margin-bottom: 2rem;
        }

        .expertise-category:last-child {
          margin-bottom: 0;
        }

        .expertise-category h4 {
          font-size: 0.95rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .expertise-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
        }

        .expertise-tag {
          padding: 0.5rem 1rem;
          color: white;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .expertise-tag.frontend {
          background: linear-gradient(135deg, #e11d48, #ff4b91);
        }

        .expertise-tag.backend {
          background: linear-gradient(135deg, #4f46e5, #6366f1);
        }

        .expertise-tag.database {
          background: linear-gradient(135deg, #10b981, #34d399);
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .value-card {
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          border: 1px solid #eee;
          text-align: center;
          transition: all 0.3s ease;
        }

        .value-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(225, 29, 72, 0.15);
        }

        .value-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .value-title {
          margin-bottom: 0.8rem;
          font-size: 1.2rem;
          color: var(--primary-color);
          font-weight: 700;
        }

        .value-description {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .team-section {
          background: #f8f9fa;
        }

        .section-title {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title h2 {
          font-size: 2.2rem;
          margin-bottom: 1rem;
        }

        .section-title p {
          font-size: 1rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        .quote-section {
          background: linear-gradient(135deg, rgba(225, 29, 72, 0.05), rgba(79, 70, 229, 0.05));
          padding: 2rem;
          border-radius: 8px;
          border-left: 4px solid var(--secondary-color);
          margin: 2rem 0;
        }

        .quote-text {
          font-size: 1.1rem;
          font-style: italic;
          color: var(--text-primary);
          font-weight: 500;
          margin: 0;
        }

        .cta-section {
          background: linear-gradient(135deg, var(--primary-color), rgba(225, 29, 72, 0.2));
          color: white;
          text-align: center;
          padding: 5rem 0;
        }

        .cta-section h2 {
          color: white;
          margin-bottom: 1.5rem;
          font-size: 2.2rem;
        }

        .cta-section p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto 2.5rem;
        }

        .cta-button {
          display: inline-block;
          padding: 1rem 2.5rem;
          background: white;
          color: var(--primary-color);
          border-radius: 6px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .team-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .team-card-header {
            padding: 1.5rem;
          }

          .team-card-content {
            padding: 1.5rem;
          }

          .avatar {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
          }

          .team-name {
            font-size: 1.2rem;
          }

          .team-bio {
            font-size: 0.9rem;
          }

          .all-skills-section {
            padding: 1.5rem;
          }

          .values-grid {
            grid-template-columns: 1fr;
          }

          .value-card {
            padding: 1.5rem;
          }

          .expertise-tags {
            gap: 0.6rem;
          }

          .expertise-tag {
            font-size: 0.75rem;
            padding: 0.4rem 0.7rem;
          }

          .section-title h2 {
            font-size: 1.8rem;
          }

          .cta-section {
            padding: 3rem 0;
          }

          .cta-section h2 {
            font-size: 1.8rem;
          }

          .cta-section p {
            font-size: 1rem;
          }

          .cta-button {
            padding: 0.8rem 2rem;
            font-size: 0.95rem;
          }
        }

        @media (max-width: 480px) {
          .team-grid {
            gap: 1rem;
          }

          .team-card-header {
            padding: 1.2rem;
          }

          .avatar {
            width: 50px;
            height: 50px;
            font-size: 1.2rem;
          }

          .team-name {
            font-size: 1rem;
          }

          .team-role {
            font-size: 0.7rem;
          }

          .team-bio {
            font-size: 0.8rem;
          }

          .team-description {
            font-size: 0.85rem;
          }

          .skills-title {
            font-size: 0.7rem;
          }

          .skill-tag {
            font-size: 0.65rem;
            padding: 0.3rem 0.6rem;
          }

          .expertise-tags {
            gap: 0.5rem;
          }

          .expertise-tag {
            font-size: 0.7rem;
            padding: 0.35rem 0.6rem;
          }

          .section-title h2 {
            font-size: 1.5rem;
          }

          .section-title p {
            font-size: 0.9rem;
          }

          .value-icon {
            font-size: 2rem;
          }

          .value-title {
            font-size: 1rem;
          }

          .value-description {
            font-size: 0.85rem;
          }

          .cta-section h2 {
            font-size: 1.5rem;
          }

          .cta-button {
            padding: 0.7rem 1.5rem;
            font-size: 0.9rem;
            width: 100%;
          }
        }
      `}</style>
=======
      {/* Back to Home */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link href="/" style={{ color: '#2563eb', textDecoration: 'underline', fontSize: '1rem' }}>← Back to Home</Link>
      </div>
>>>>>>> Stashed changes
    </div>
  );
}
