import { useState } from "react";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <section className="hero-section">
      <div className="hero-badge">
        <span className="badge-icon">✨</span>
        <span>Powered by Advanced AI Technology</span>
      </div>

      <h1 className="hero-title">
        Discover the Future of
        <br />
        <span className="gradient-text">AI Agents</span>
      </h1>

      <p className="hero-subtitle">
        Transform your workflow with intelligent AI agents. Browse, deploy, and scale
        automation solutions that work seamlessly with your business needs.
      </p>

      <form className="hero-search" onSubmit={handleSearch}>
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search for AI agents, tools, or solutions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </div>
      </form>

      <div className="hero-stats">
        <div className="stat-item">
          <div className="stat-number">500+</div>
          <div className="stat-label">AI Agents</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">50+</div>
          <div className="stat-label">Categories</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Available</div>
        </div>
      </div>
    </section>
  );
}