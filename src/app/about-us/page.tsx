import Link from "next/link";

export const metadata = {
  title: "About Us – Blog Fusion",
  description: "Learn about Blog Fusion, our mission, and the talented team behind the platform."
};

export default function AboutUsPage() {
  return (
    <section style={{ padding: "4rem 0", backgroundColor: "#f8fafc" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem" }}>
        <h1 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: "900", color: "#0f172a", textAlign: "center", marginBottom: "2rem" }}>
          About Us – Blog Fusion
        </h1>
        {/* The same detailed content as in the previous About page */}
        <p style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "#475569", marginBottom: "2rem" }}>
          Welcome to Blog Fusion, a modern platform created to share knowledge, creativity, technology, and innovation with readers worldwide. Our goal is to provide valuable, easy‑to‑understand, [...]
        </p>
        <p style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "#475569", marginBottom: "2rem" }}>
          At Blog Fusion, we believe that technology and creativity together can build powerful ideas. Behind this platform is a dedicated team passionate about web development, data analytics, and mo[...]
        </p>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#0f172a", marginTop: "2rem", marginBottom: "1rem" }}>
          Meet Our Team
        </h2>
        {/* Team member sections (same as previous) */}
        <h3 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#0f172a", marginBottom: "0.5rem" }}>Marium Waseem – CEO of Blog Fusion</h3>
        <p style={{ fontSize: "1rem", lineHeight: "1.7", color: "#475569", marginBottom: "1rem" }}>
          Marium Waseem is the CEO of Blog Fusion and plays a leading role in managing and growing the platform. She is a skilled Data Analyst and Web Developer with a strong passion for technology, a[...]
        </p>
        <p style={{ fontSize: "1rem", lineHeight: "1.7", color: "#475569", marginBottom: "1rem" }}>
          She specializes in transforming data into meaningful insights and building modern, responsive, and user‑friendly websites.
        </p>
        <h4 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#0f172a", marginTop: "1rem", marginBottom: "0.5rem" }}>Skills &amp; Expertise</h4>
        <ul style={{ columns: "2", columnGap: "2rem", listStyle: "disc", paddingLeft: "1.2rem", color: "#475569" }}>
          <li>Data Analytics</li>
          <li>HTML5 &amp; CSS3</li>
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
          <li>Research &amp; Data Interpretation</li>
          <li>Problem Solving &amp; Team Management</li>
        </ul>
        <p style={{ fontSize: "1rem", lineHeight: "1.7", color: "#475569", marginTop: "1rem" }}>
          Marium Waseem is dedicated to innovation, continuous learning, and delivering impactful digital solutions through creativity and analytical thinking.
        </p>
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#0f172a", fontWeight: "600", fontSize: "1.1rem" }}>← Back to Home</Link>
        </div>
      </div>
    </section>
  );
}
