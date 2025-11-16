import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import Marketplace from "./pages/Marketplace";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import WorkspaceSelector from "./components/WorkspaceSelector";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();

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
      justifyContent: "space-between",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(0,0,0,0.2)",
      backdropFilter: "blur(10px)",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
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

        <nav style={{ display: "flex", gap: 8 }}>
          <Link to="/" style={navLinkStyle("/")}>Home</Link>
          <Link to="/marketplace" style={navLinkStyle("/marketplace")}>Marketplace</Link>
        </nav>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#999", fontSize: 14 }}>
            Welcome, {user?.first_name || user?.email}
          </span>
          <button
            onClick={logout}
            style={{
              padding: "6px 12px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 6,
              color: "white",
              fontSize: 12,
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
            </Routes>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <AppContent />
      </WorkspaceProvider>
    </AuthProvider>
  );
}

export default App;




