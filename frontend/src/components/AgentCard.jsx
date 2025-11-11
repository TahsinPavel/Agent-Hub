import { useState } from "react";
import { callAgent } from "../api/agentApi";

export default function AgentCard({ agent }) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleCallAgent = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const data = await callAgent(agent.id, "Hello AI"); // replace with dynamic input if needed
      setResponse(data);
    } catch (err) {
      setError("Agent call failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.06)",
        padding: 16,
        borderRadius: 12,
        background: "rgba(255,255,255,0.02)",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered ? "0 8px 24px rgba(100, 108, 255, 0.15)" : "none",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Agent Icon */}
      <div style={{
        fontSize: 48,
        marginBottom: 12,
        textAlign: "center"
      }}>
        {agent.icon || "🤖"}
      </div>

      {/* Agent Info */}
      <div style={{ flex: 1 }}>
        <h4 style={{
          margin: "0 0 8px 0",
          fontSize: 16,
          fontWeight: 600,
          lineHeight: 1.3
        }}>
          {agent.name}
        </h4>

        <p style={{
          margin: "0 0 12px 0",
          color: "#bcbcbc",
          fontSize: 13,
          lineHeight: 1.5,
          minHeight: 40,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical"
        }}>
          {agent.description || "No description available"}
        </p>

        {/* Category Badge */}
        {agent.category && (
          <div style={{
            display: "inline-block",
            padding: "4px 10px",
            borderRadius: 12,
            background: "rgba(100, 108, 255, 0.15)",
            color: "#8b92ff",
            fontSize: 11,
            fontWeight: 500,
            marginBottom: 12
          }}>
            {agent.category}
          </div>
        )}

        {/* Rating and Downloads */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
          fontSize: 13
        }}>
          {agent.rating && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: "#ffd700" }}>⭐</span>
              <span style={{ color: "#ddd", fontWeight: 500 }}>{agent.rating}</span>
            </div>
          )}
          {agent.downloads && (
            <>
              <span style={{ color: "#666" }}>•</span>
              <span style={{ color: "#999", fontSize: 12 }}>
                {agent.downloads >= 1000
                  ? `${(agent.downloads / 1000).toFixed(1)}k downloads`
                  : `${agent.downloads} downloads`}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Price and Action */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "auto",
        paddingTop: 12,
        borderTop: "1px solid rgba(255,255,255,0.06)"
      }}>
        <div>
          <div style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#646cff"
          }}>
            ${agent.price ?? "0.00"}
          </div>
          {agent.price && parseFloat(agent.price) > 0 && (
            <div style={{ fontSize: 10, color: "#666" }}>one-time</div>
          )}
        </div>

        <button
          onClick={handleCallAgent}
          disabled={loading}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: loading ? "#555" : "#646cff",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 14,
            fontWeight: 500,
            transition: "all 0.2s ease",
            opacity: loading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = "#535bf2";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.background = "#646cff";
          }}
        >
          {loading ? "Calling..." : "Try Now"}
        </button>
      </div>

      {/* Response Display */}
      {response && (
        <div style={{
          marginTop: 12,
          background: "rgba(0,0,0,0.3)",
          padding: 12,
          borderRadius: 8,
          border: "1px solid rgba(100, 255, 100, 0.2)"
        }}>
          <strong style={{ color: "#6f6", fontSize: 12 }}>✓ Response:</strong>
          <pre style={{
            whiteSpace: "pre-wrap",
            color: "#ddd",
            fontSize: 12,
            margin: "8px 0 0 0",
            maxHeight: 150,
            overflow: "auto"
          }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <p style={{
          color: "#ff6b6b",
          fontSize: 12,
          marginTop: 8,
          padding: 8,
          background: "rgba(255, 107, 107, 0.1)",
          borderRadius: 6
        }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
