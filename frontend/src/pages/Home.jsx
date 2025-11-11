import { useEffect, useMemo, useState } from "react";
import { fetchAgents } from "../api/agentApi";
import "../styles/Home.css";
import HeroSection from "../components/HeroSection";
import FeaturedSection from "../components/FeaturedSection";
import CategorySection from "../components/CategorySection";

const CATEGORIES = [
  "⚡ Productivity", "✍️ Writing", "🎨 Images", "💻 Developer", 
  "💼 Business", "🔧 Utilities", "📚 Education", "📈 Marketing"
];

export default function Home() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const data = await fetchAgents();
        setAgents(data);
      } catch (error) {
        console.error("Failed to load agents:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  const { featured, trending, topRated } = useMemo(() => {
    const featured = agents.slice(0, 6);
    const trending = agents.filter(a => a.downloads > 1000).slice(0, 8);
    const topRated = agents.filter(a => a.rating >= 4.5).slice(0, 8);
    
    return { featured, trending, topRated };
  }, [agents]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p className="loading-text">Loading AI Agent Hub...</p>
      </div>
    );
  }

  return (
    <main className="modern-home">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Section */}
      <div className="section-container">
        <FeaturedSection agents={featured} />
      </div>

      {/* Trending Section */}
      <div className="section-container">
        <div style={{ marginBottom: 50 }}>
          <h2 className="section-title">🔥 Trending Now</h2>
          <p className="section-subtitle">Most popular AI agents this week</p>
        </div>
        <CategorySection agents={trending} />
      </div>

      {/* Top Rated Section */}
      <div className="section-container">
        <div style={{ marginBottom: 50 }}>
          <h2 className="section-title">⭐ Top Rated</h2>
          <p className="section-subtitle">Highest rated agents by our community</p>
        </div>
        <CategorySection agents={topRated} />
      </div>
    </main>
  );
}
