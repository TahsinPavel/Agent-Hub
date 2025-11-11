export default function CategorySection({ category, agents }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
      gap: 16
    }}>
      {agents.map((agent) => (
        <div key={agent.id} style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12,
          padding: 16,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          cursor: "pointer"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(100, 108, 255, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 24 }}>{agent.icon}</div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{agent.name}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <span style={{
                  fontSize: 11,
                  color: "#888",
                  background: "rgba(255,255,255,0.05)",
                  padding: "2px 6px",
                  borderRadius: 8
                }}>{agent.category}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <span style={{ color: "#ffd700", fontSize: 12 }}>⭐</span>
                  <span style={{ fontSize: 12, color: "#bcbcbc" }}>{agent.rating}</span>
                </div>
              </div>
            </div>
          </div>
          
          <p style={{ 
            color: "#999", 
            fontSize: 13, 
            lineHeight: 1.4, 
            margin: "0 0 12px 0",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {agent.description}
          </p>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#4facfe" }}>
              ${agent.price}
            </div>
            <button style={{
              padding: "6px 12px",
              background: "linear-gradient(135deg, #646cff, #ff64c8)",
              border: "none",
              borderRadius: 6,
              color: "white",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
              Try Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
