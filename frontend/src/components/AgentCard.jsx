import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUsage } from "../contexts/UsageContext";

export default function AgentCard({ agent }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const { isAuthenticated } = useAuth();
  const { canUseAgent, getRemainingUses } = useUsage();

  const remainingUses = getRemainingUses(agent.id, isAuthenticated);
  const canUse = canUseAgent(agent.id, isAuthenticated);

  const handleTryNow = () => {
    if (!canUse) {
      setShowLimitModal(true);
      return;
    }
    // Redirect to dedicated agent workspace
    window.location.href = `/workspace/${agent.id}`;
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
        borderRadius: 16,
        padding: 20,
        margin: 10,
        width: 280,
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: isHovered ? "0 10px 30px rgba(0,0,0,0.3)" : "0 5px 15px rgba(0,0,0,0.1)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ fontSize: 32, marginBottom: 12 }}>{agent.icon}</div>
      
      <h3 style={{ margin: "0 0 8px 0", color: "white", fontSize: 18 }}>
        {agent.name}
      </h3>
      
      <p style={{ margin: "0 0 16px 0", color: "#ccc", fontSize: 14, lineHeight: 1.4 }}>
        {agent.description}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#999" }}>
          <span>⭐ {agent.rating}</span>
          <span>📥 {agent.downloads}</span>
        </div>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#646cff" }}>
          ${agent.price}
        </span>
      </div>

      {/* Usage indicator for non-authenticated users */}
      {!isAuthenticated && (
        <div style={{ 
          marginBottom: 12, 
          padding: "6px 12px", 
          background: canUse ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
          borderRadius: 6,
          fontSize: 12,
          color: canUse ? "#22c55e" : "#ef4444",
          textAlign: "center"
        }}>
          {canUse ? `${remainingUses} free tests remaining` : "Free tests used up"}
        </div>
      )}

      <button
        onClick={handleTryNow}
        style={{
          width: "100%",
          padding: "12px 20px",
          borderRadius: 8,
          border: "none",
          background: canUse ? "linear-gradient(135deg, #646cff 0%, #ff64c8 100%)" : "#666",
          color: "#fff",
          cursor: canUse ? "pointer" : "not-allowed",
          fontSize: 14,
          fontWeight: 600,
          transition: "all 0.2s ease"
        }}
      >
        {canUse ? "🚀 Try Now" : "Sign up to continue"}
      </button>

      {/* Limit Reached Modal */}
      {showLimitModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            borderRadius: 16,
            padding: 32,
            maxWidth: 400,
            width: "100%",
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h3 style={{ margin: "0 0 16px 0", color: "white" }}>
              Free Tests Used Up!
            </h3>
            <p style={{ margin: "0 0 24px 0", color: "#ccc", lineHeight: 1.5 }}>
              You've used all 3 free tests for <strong>{agent.name}</strong>. 
              Sign up to get unlimited access to all AI agents!
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setShowLimitModal(false)}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "transparent",
                  color: "#ccc",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <Link
                to="/login"
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  borderRadius: 8,
                  border: "none",
                  background: "linear-gradient(135deg, #646cff 0%, #ff64c8 100%)",
                  color: "white",
                  textDecoration: "none",
                  textAlign: "center",
                  fontWeight: 600
                }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
