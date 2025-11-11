export default function FeaturedSection({ agents }) {
  return (
    <section style={{ marginBottom: 60 }}>
      <div style={{ marginBottom: 50 }}>
        <h2 className="section-title">✨ Featured Agents</h2>
        <p className="section-subtitle">Hand-picked AI agents for maximum productivity</p>
      </div>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: 30
      }}>
        {agents.map((agent) => (
          <div key={agent.id} style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: 30,
            transition: "all 0.4s ease",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(20px)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-10px)";
            e.currentTarget.style.boxShadow = "0 20px 60px rgba(100, 108, 255, 0.3)";
            e.currentTarget.style.borderColor = "rgba(100, 108, 255, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              background: agent.gradient || "linear-gradient(135deg, #646cff, #ff64c8)"
            }}></div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ 
                fontSize: 40,
                padding: 15,
                background: "rgba(255,255,255,0.1)",
                borderRadius: 15,
                backdropFilter: "blur(10px)"
              }}>
                {agent.icon}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
                  {agent.name}
                </h3>
                <span style={{
                  fontSize: 13,
                  color: "#999",
                  background: "rgba(255,255,255,0.08)",
                  padding: "4px 12px",
                  borderRadius: 15,
                  fontWeight: 500
                }}>
                  {agent.category}
                </span>
              </div>
            </div>
            
            <p style={{ 
              color: "#bcbcbc", 
              fontSize: 16, 
              lineHeight: 1.6, 
              margin: "0 0 25px 0",
              fontWeight: 300
            }}>
              {agent.description}
            </p>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#ffd700", fontSize: 18 }}>⭐</span>
                <span style={{ fontSize: 16, color: "#bcbcbc", fontWeight: 500 }}>
                  {agent.rating}
                </span>
                <span style={{ color: "#666", fontSize: 14, marginLeft: 10 }}>
                  ({agent.downloads || 0} downloads)
                </span>
              </div>
              <div style={{ 
                fontSize: 20, 
                fontWeight: 700, 
                color: "#4facfe",
                background: "rgba(79, 172, 254, 0.1)",
                padding: "8px 16px",
                borderRadius: 12
              }}>
                ${agent.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
