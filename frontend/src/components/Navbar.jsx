import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import WorkspaceSelector from "./WorkspaceSelector";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Agent Tester", path: "/agent-tester" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="gradient-text">AI Hub</span>
        </Link>
        
        <ul className="navbar-menu">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="navbar-actions">
          {user ? (
            <>
              <WorkspaceSelector />
              <div className="user-menu">
                <span className="user-email">{user.email}</span>
                <button onClick={logout} className="auth-button">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="auth-button">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}