import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Marketplace from "./pages/Marketplace";
import Home from "./pages/Home";

function Navigation() {
  const location = useLocation();

  const navLinkStyle = (path) => ({
    textDecoration: "none",
    color: location.pathname === path ? "#646cff" : "#bcbcbc",
    padding: "8px 16px",
    borderRadius: 8,
    transition: "all 0.2s ease",
    fontSize: 14,
    fontWeight: location.pathname === path ? 600 : 400,
    background: location.pathname === path ? "rgba(100, 108, 255, 0.1)" : "transparent"
  });

  return (
    <header style={{
      padding: "16px 32px",
      display: "flex",
      gap: 24,
      alignItems: "center",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(0,0,0,0.2)",
      backdropFilter: "blur(10px)",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      <Link to="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 32 }}>🤖</div>
        <h2 style={{
          margin: 0,
          background: "linear-gradient(135deg, #646cff 0%, #ff64c8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontSize: 24,
          fontWeight: 700
        }}>
          AI Hub
        </h2>
      </Link>

      <nav style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
        <Link to="/" style={navLinkStyle("/")}>
          Home
        </Link>
        <Link to="/marketplace" style={navLinkStyle("/marketplace")}>
          Marketplace
        </Link>
        <button style={{
          padding: "8px 20px",
          borderRadius: 8,
          border: "1px solid #646cff",
          background: "transparent",
          color: "#646cff",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
          marginLeft: 12,
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#646cff";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#646cff";
        }}>
          Sign In
        </button>
      </nav>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
